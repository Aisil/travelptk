/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../lib/prisma";

// ── Утилиты ──

function cleanHtml(raw: string): string {
  let text = raw;
  text = text.replace(/<div[^>]*data-elementor[^>]*>/gi, "");
  text = text.replace(/<section[^>]*data-elementor[^>]*>/gi, "");
  text = text.replace(/<div[^>]*class="elementor[^"]*"[^>]*>/gi, "");
  text = text.replace(/\s*style="[^"]*"/gi, "");
  text = text.replace(/<span[^>]*>\s*<\/span>/gi, "");
  text = text.replace(/<div[^>]*>\s*<\/div>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#8211;/g, "–");
  text = text.replace(/&#8212;/g, "—");
  text = text.replace(/&#171;/g, "«");
  text = text.replace(/&#187;/g, "»");
  text = text.replace(/&#8230;/g, "…");
  text = text.replace(/&#\d+;/g, "");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n\s*\n\s*\n/g, "\n\n");
  text = text.trim();
  if (text.length < 10) return "Описание будет добавлено позже.";
  if (text.length > 5000) text = text.substring(0, 5000) + "…";
  return text;
}

function extractCoords(text: string): { lat: number | null; lng: number | null } {
  const regex = /(\d{2}\.\d{3,6})\s*[,;]\s*(\d{2}\.\d{3,6})/;
  const match = text.match(regex);
  if (match) {
    const a = parseFloat(match[1]);
    const b = parseFloat(match[2]);
    if (a >= 60 && a <= 67 && b >= 28 && b <= 38) return { lat: a, lng: b };
    if (b >= 60 && b <= 67 && a >= 28 && a <= 38) return { lat: b, lng: a };
  }
  return { lat: null, lng: null };
}

function extractVideoUrl(html: string): string | null {
  const embedMatch = html.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  const watchMatch = html.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = html.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const vimeoMatch = html.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

function extractGalleryImages(html: string, featuredImage: string | null): string[] {
  const allImages = html.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const img of allImages) {
    if (/-\d+x\d+\./.test(img)) continue;
    if (featuredImage && img === featuredImage) continue;
    if (seen.has(img)) continue;
    seen.add(img);
    unique.push(img);
  }
  return unique.slice(0, 10);
}

async function fetchPaginated(baseUrl: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  while (true) {
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}per_page=50&page=${page}&_embed`;
    console.log(`    Страница ${page}...`);
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400) break;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

// ── Главная функция ──

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  ПОЛНЫЙ ИМПОРТ ИЗ WordPress (po-karelii.ru)  ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // ── 1. Импорт категорий ──
  console.log("── 1. Импорт категорий ──");
  const wpCats = await fetchPaginated("https://po-karelii.ru/wp-json/wp/v2/categories");
  console.log(`  Найдено ${wpCats.length} категорий.`);

  // Первый проход: создаём все без parentId
  for (const cat of wpCats) {
    await prisma.category.upsert({
      where: { wpId: cat.id },
      update: { name: cat.name, slug: cat.slug },
      create: { wpId: cat.id, name: cat.name, slug: cat.slug },
    });
  }

  // Второй проход: устанавливаем parentId
  for (const cat of wpCats) {
    if (cat.parent && cat.parent !== 0) {
      const parent = await prisma.category.findUnique({ where: { wpId: cat.parent } });
      if (parent) {
        const child = await prisma.category.findUnique({ where: { wpId: cat.id } });
        if (child) {
          await prisma.category.update({
            where: { id: child.id },
            data: { parentId: parent.id },
          });
        }
      }
    }
  }
  console.log(`  ✓ Категории импортированы с иерархией.\n`);

  // ── 2. Импорт меток ──
  console.log("── 2. Импорт меток ──");
  const wpTags = await fetchPaginated("https://po-karelii.ru/wp-json/wp/v2/tags");
  console.log(`  Найдено ${wpTags.length} меток.`);

  for (const tag of wpTags) {
    await prisma.tag.upsert({
      where: { wpId: tag.id },
      update: { name: tag.name, slug: tag.slug },
      create: { wpId: tag.id, name: tag.name, slug: tag.slug },
    });
  }
  console.log(`  ✓ Метки импортированы.\n`);

  // ── Маппинги ──
  const dbCategories = await prisma.category.findMany();
  const dbTags = await prisma.tag.findMany();
  const catMap = new Map<number, number>();
  for (const c of dbCategories) { if (c.wpId) catMap.set(c.wpId, c.id); }
  const tagMap = new Map<number, number>();
  for (const t of dbTags) { if (t.wpId) tagMap.set(t.wpId, t.id); }

  // ── 3. Импорт записей (Posts) ──
  console.log("── 3. Импорт записей (Posts) ──");
  const wpPosts = await fetchPaginated("https://po-karelii.ru/wp-json/wp/v2/posts");
  console.log(`  Найдено ${wpPosts.length} записей.`);

  let postCount = 0;
  for (const post of wpPosts) {
    const result = await importEntry(post, "POST", catMap, tagMap);
    if (result) postCount++;
  }
  console.log(`  ✓ Импортировано ${postCount} записей.\n`);

  // ── 4. Импорт страниц (Pages) ──
  console.log("── 4. Импорт страниц (Pages) ──");
  const wpPages = await fetchPaginated("https://po-karelii.ru/wp-json/wp/v2/pages");
  console.log(`  Найдено ${wpPages.length} страниц.`);

  let pageCount = 0;
  for (const page of wpPages) {
    const result = await importEntry(page, "PAGE", catMap, tagMap);
    if (result) pageCount++;
  }
  console.log(`  ✓ Импортировано ${pageCount} страниц.\n`);

  // ── Итоги ──
  const totalContent = await prisma.entry.count();
  const totalCats = await prisma.category.count();
  const totalTags = await prisma.tag.count();

  console.log("╔══════════════════════════════════════════╗");
  console.log(`║  Записей (POST):  ${postCount}`);
  console.log(`║  Страниц (PAGE):  ${pageCount}`);
  console.log(`║  Категорий:       ${totalCats}`);
  console.log(`║  Меток:           ${totalTags}`);
  console.log(`║  Всего контента:  ${totalContent}`);
  console.log("╚══════════════════════════════════════════╝");
}

async function importEntry(
  item: any,
  contentType: "POST" | "PAGE",
  catMap: Map<number, number>,
  tagMap: Map<number, number>
): Promise<boolean> {
  const title = cleanHtml(item.title?.rendered || "Без названия");
  const slug = item.slug;
  const rawContent = item.content?.rendered || "";
  const content = cleanHtml(rawContent);

  const featuredImage = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  const videoUrl = extractVideoUrl(rawContent);
  const galleryImages = extractGalleryImages(rawContent, featuredImage);
  const gallery = galleryImages.length > 0 ? galleryImages.join(",") : null;

  // Категория (у страниц может не быть)
  let categoryId: number | null = null;
  if (item.categories && item.categories.length > 0) {
    for (const wpCatId of item.categories) {
      if (catMap.has(wpCatId)) {
        categoryId = catMap.get(wpCatId)!;
        break;
      }
    }
  }

  // Метки (у страниц обычно нет)
  const tagIds: number[] = [];
  if (item.tags && item.tags.length > 0) {
    for (const wpTagId of item.tags) {
      if (tagMap.has(wpTagId)) tagIds.push(tagMap.get(wpTagId)!);
    }
  }

  // Координаты
  const coords = extractCoords(rawContent);
  const latitude = coords.lat || (contentType === "POST" ? 62.0 + Math.random() * 4 : null);
  const longitude = coords.lng || (contentType === "POST" ? 30.0 + Math.random() * 6 : null);

  try {
    await prisma.entry.upsert({
      where: { slug },
      update: {
        title, content, contentType, latitude, longitude, categoryId,
        featuredImage, videoUrl, gallery, wpId: item.id,
        tags: { set: tagIds.map((id) => ({ id })) },
      },
      create: {
        title, slug, content, contentType, status: "PUBLISHED",
        latitude, longitude, categoryId,
        featuredImage, videoUrl, gallery, wpId: item.id,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });

    const media = [featuredImage ? "📷" : "", videoUrl ? "🎬" : "", gallery ? `🖼${galleryImages.length}` : ""].filter(Boolean).join(" ");
    const typeLabel = contentType === "POST" ? "📝" : "📄";
    console.log(`    ${typeLabel} ${title.substring(0, 55)} ${media}`);
    return true;
  } catch (error: any) {
    console.log(`    ✗ ${title.substring(0, 55)} — ${error.message?.substring(0, 80)}`);
    return false;
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
