/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from '@prisma/client';
import "dotenv/config";

import { prisma } from "../lib/prisma";

const WP_API_URL = 'https://po-karelii.ru/wp-json/wp/v2';

function cleanContent(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove <style> tags and their content
    .replace(/\s*class="[^"]*"/gi, '') // Remove class attributes
    .replace(/\s*style="[^"]*"/gi, '') // Remove style attributes
    .replace(/\s*id="[^"]*"/gi, '') // Remove id attributes
    .replace(/<div[^>]*>/gi, '') // Remove <div> tags
    .replace(/<\/div>/gi, '') // Remove </div> tags
    .replace(/<span[^>]*>/gi, '') // Remove <span> tags
    .replace(/<\/span>/gi, '') // Remove </span> tags
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .trim();
}

function extractCoordinates(text: string): { latitude: number | null, longitude: number | null } {
  const coordMatch = text.match(/(\d{2}\.\d{4,}),\s*(\d{2}\.\d{4,})/);
  if (coordMatch) {
    return {
      latitude: parseFloat(coordMatch[1]),
      longitude: parseFloat(coordMatch[2])
    };
  }
  return { latitude: null, longitude: null };
}

async function fetchWpData(endpoint: string) {
  const url = `${WP_API_URL}/${endpoint}?_embed&per_page=100`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

async function syncTags(wpTags: any[]) {
  const tagMap = new Map(); // wpId -> dbId
  for (const tag of wpTags) {
    if (!tag) continue;
    const existing = await prisma.tag.upsert({
      where: { wpId: tag.id },
      update: { name: tag.name, slug: tag.slug },
      create: { wpId: tag.id, name: tag.name, slug: tag.slug }
    });
    tagMap.set(tag.id, existing.id);
  }
  return tagMap;
}

async function syncCategories(wpCategories: any[]) {
  const categoryMap = new Map(); // wpId -> dbId
  const parentMap = new Map();

  // First pass: Create or update all categories, storing their parent IDs
  for (const cat of wpCategories) {
    if (!cat) continue;
    parentMap.set(cat.id, cat.parent);

    const existing = await prisma.category.upsert({
      where: { wpId: cat.id },
      update: { name: cat.name, slug: cat.slug },
      create: { wpId: cat.id, name: cat.name, slug: cat.slug }
    });
    categoryMap.set(cat.id, existing.id);
  }

  // Second pass: Link children to their parents
  for (const [wpId, dbId] of categoryMap.entries()) {
    const parentWpId = parentMap.get(wpId);
    if (parentWpId && parentWpId !== 0) {
      const parentDbId = categoryMap.get(parentWpId);
      if (parentDbId) {
        await prisma.category.update({
          where: { id: dbId },
          data: { parentId: parentDbId }
        });
      }
    }
  }

  return categoryMap;
}

async function processPosts(items: any[], type: ContentType, categoryMap: Map<number, number>, tagMap: Map<number, number>) {
  for (const item of items) {
    const wpId = item.id;
    const title = item.title?.rendered || 'Без названия';
    const slug = item.slug || `post-${wpId}`;
    const rawContent = item.content?.rendered || '';

    const cleanedContent = cleanContent(rawContent);
    const { latitude, longitude } = extractCoordinates(rawContent);

    // Extract featured image
    let featuredImage = null;
    if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'].length > 0) {
      featuredImage = item._embedded['wp:featuredmedia'][0].source_url || null;
    }

    // Determine category
    let categoryId = null;
    if (item.categories && item.categories.length > 0) {
      categoryId = categoryMap.get(item.categories[0]) || null;
    }

    let tagsConnect: { id: number }[] = [];
    if (item.tags && item.tags.length > 0) {
      tagsConnect = item.tags
        .map((t: number) => tagMap.get(t))
        .filter((id: number | undefined) => id !== undefined)
        .map((id: number) => ({ id }));
    }

    await prisma.entry.upsert({
      where: { wpId },
      update: {
        title,
        slug,
        content: cleanedContent,
        contentType: type,
        latitude,
        longitude,
        featuredImage,
        categoryId,
        tags: { connect: tagsConnect },
        status: 'PUBLISHED'
      },
      create: {
        wpId,
        title,
        slug,
        content: cleanedContent,
        contentType: type,
        latitude,
        longitude,
        featuredImage,
        categoryId,
        status: 'PUBLISHED'
      }
    });
    console.log(`Imported ${type}: ${title}`);
  }
}

async function main() {
  console.log('Starting WP Import...');

  // 1. Fetch categories
  const wpCategories = await fetchWpData('categories');
  const categoryMap = await syncCategories(wpCategories);
  console.log(`Synced ${categoryMap.size} categories.`);

  const wpTags = await fetchWpData('tags');
  const tagMap = await syncTags(wpTags);
  console.log(`Synced ${tagMap.size} tags.`);

  // 2. Fetch and process posts
  const posts = await fetchWpData('posts');
  await processPosts(posts, 'POST', categoryMap, tagMap);

  // 3. Fetch and process pages
  const pages = await fetchWpData('pages');
  await processPosts(pages, 'PAGE', categoryMap, tagMap);

  console.log('Import completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
