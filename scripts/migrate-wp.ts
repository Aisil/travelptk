/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from '@prisma/client';
import "dotenv/config";
import { prisma } from "../lib/prisma";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

const WP_API_URL = 'https://po-karelii.ru/wp-json/wp/v2';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function downloadImage(url: string, destFolder: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.mkdir(destFolder, { recursive: true });
    const destPath = path.join(destFolder, filename);
    await fs.writeFile(destPath, buffer);

    return `/uploads/${path.basename(destFolder)}/${filename}`;
  } catch (error) {
    console.error(`Failed to download ${url}`, error);
    return null;
  }
}

async function getOrCreateFolder(slug: string, title: string) {
  let folder = await prisma.mediaFolder.findFirst({ where: { name: title } });
  if (!folder) {
    folder = await prisma.mediaFolder.create({ data: { name: title } });
  }
  return folder;
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

    const folder = await getOrCreateFolder(slug, title);
    const destFolder = path.join(UPLOADS_DIR, slug);

    // Parse HTML with cheerio
    const $ = cheerio.load(rawContent);

    // Extract elementor gallery backgrounds
    $('.elementor-gallery-item, [style*="background-image"]').each((_, el) => {
      const bgImageMatch = $(el).attr('style')?.match(/url\(['"]?(.*?)['"]?\)/);
      if (bgImageMatch && bgImageMatch[1]) {
        // Append an img tag so the next block catches it
        $(el).append(`<img src="${bgImageMatch[1]}" alt="Gallery Image" />`);
      }
    });

    // Extract all images
    const images: { oldUrl: string, newUrl: string, filename: string }[] = [];

    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).parent('a').attr('href');
      if (src && src.includes('po-karelii.ru')) {
        const filename = path.basename(src.split('?')[0]);
        const newUrl = `/uploads/${slug}/${filename}`;
        images.push({ oldUrl: src, newUrl, filename });
        // Replace src in HTML immediately
        $(el).attr('src', newUrl);

        // Remove link wrappers that point to images
        if ($(el).parent('a').length > 0) {
           $(el).unwrap();
        }
      }
    });

    // Remove unwanted tags
    $('style, svg, details, summary').remove();

    // Clean all tags from unwanted attributes
    $('*').each((_, el) => {
      const attributes = (el as any).attributes;
      if (attributes) {
        for (const attr of attributes) {
          const name = attr.name;
          if (
            name === 'class' ||
            name === 'style' ||
            name === 'id' ||
            name.startsWith('data-elementor-') ||
            name.startsWith('data-e-') ||
            name === 'srcset' ||
            name === 'sizes' ||
            name === 'data-src'
          ) {
            $(el).removeAttr(name);
          }
        }
      }
    });

    // Unwrap span and div
    $('span, div').each((_, el) => {
       $(el).replaceWith($(el).html() || '');
    });

    let cleanedContent = $.html();

    // Fallback: Remove any stray empty divs/spans
    cleanedContent = cleanedContent.replace(/<div\s*><\/div>/gi, '').replace(/<span\s*><\/span>/gi, '');

    const { latitude, longitude } = extractCoordinates(rawContent);

    // Download images and save to Media
    for (const img of images) {
      const downloaded = await downloadImage(img.oldUrl, destFolder, img.filename);
      if (downloaded) {
        await prisma.media.create({
          data: {
            filename: img.filename,
            url: img.newUrl,
            mimeType: 'image/jpeg', // Approximation
            size: 0, // Impossible to know without full fs stat, skipping for now
            title: img.filename,
            folderId: folder.id
          }
        });
      }
    }

    // Extract featured image
    let featuredImage = null;
    if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'].length > 0) {
      const sourceUrl = item._embedded['wp:featuredmedia'][0].source_url;
      if (sourceUrl) {
         const filename = path.basename(sourceUrl.split('?')[0]);
         const newUrl = `/uploads/${slug}/${filename}`;
         const downloaded = await downloadImage(sourceUrl, destFolder, filename);
         if (downloaded) {
             featuredImage = newUrl;
             await prisma.media.create({
              data: {
                filename: filename,
                url: newUrl,
                mimeType: 'image/jpeg',
                size: 0,
                title: filename,
                folderId: folder.id
              }
            });
         }
      }
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
        tags: { connect: tagsConnect },
        status: 'PUBLISHED'
      }
    });
    console.log(`Imported ${type}: ${title}`);
  }
}

async function main() {
  console.log('Starting WP Import...');

  const wpCategories = await fetchWpData('categories');
  const categoryMap = await syncCategories(wpCategories);
  console.log(`Synced ${categoryMap.size} categories.`);

  const wpTags = await fetchWpData('tags');
  const tagMap = await syncTags(wpTags);
  console.log(`Synced ${tagMap.size} tags.`);

  const posts = await fetchWpData('posts');
  await processPosts(posts, 'POST', categoryMap, tagMap);

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
