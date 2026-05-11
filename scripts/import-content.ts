import { prisma } from "../lib/prisma";

/**
 * Очистка HTML от мусора WordPress/Elementor.
 */
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

/**
 * Извлекаем координаты из текста.
 */
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

/**
 * Извлекаем ссылку на YouTube видео из HTML-контента.
 */
function extractVideoUrl(html: string): string | null {
  // YouTube embed
  const embedMatch = html.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  // YouTube watch
  const watchMatch = html.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // youtu.be short
  const shortMatch = html.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // Vimeo
  const vimeoMatch = html.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

/**
 * Извлекаем оригинальные (не миниатюры) картинки из HTML-контента.
 */
function extractGalleryImages(html: string, mainImage: string | null): string[] {
  const allImages = html.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [];

  // Убираем дубли, миниатюры (содержат -NNNxNNN.) и главное фото
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const img of allImages) {
    // Пропускаем миниатюры WordPress (-300x300, -150x150 и т.д.)
    if (/-\d+x\d+\./.test(img)) continue;
    // Пропускаем главное фото
    if (mainImage && img === mainImage) continue;
    // Пропускаем дубли
    if (seen.has(img)) continue;

    seen.add(img);
    unique.push(img);
  }

  // Ограничиваем до 10 фото
  return unique.slice(0, 10);
}

async function fetchAllPosts(): Promise<any[]> {
  const allPosts: any[] = [];
  let page = 1;
  const perPage = 50;

  while (true) {
    const url = `https://po-karelii.ru/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_embed`;
    console.log(`  Загрузка страницы ${page}...`);

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400) break;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) break;

    allPosts.push(...posts);

    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
    if (page >= totalPages) break;
    page++;
  }

  return allPosts;
}

async function main() {
  console.log("=== Импорт контента с медиа из WordPress ===\n");

  console.log("1. Загрузка постов...");
  const posts = await fetchAllPosts();
  console.log(`   Найдено ${posts.length} постов.\n`);

  console.log("2. Загрузка маппинга из БД...");
  const dbCategories = await prisma.category.findMany();
  const dbTags = await prisma.tag.findMany();

  const catMap = new Map<number, number>();
  for (const c of dbCategories) {
    if (c.wpId) catMap.set(c.wpId, c.id);
  }

  const tagMap = new Map<number, number>();
  for (const t of dbTags) {
    if (t.wpId) tagMap.set(t.wpId, t.id);
  }
  console.log(`   Категорий: ${catMap.size}, Меток: ${tagMap.size}\n`);

  console.log("3. Импорт постов с медиа...");
  let imported = 0;
  let skipped = 0;
  let withImages = 0;
  let withVideo = 0;

  for (const post of posts) {
    const title = cleanHtml(post.title?.rendered || "Без названия");
    const slug = post.slug;
    const rawContent = post.content?.rendered || "";
    const content = cleanHtml(rawContent);

    // Главное фото из _embedded
    const mainImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
    if (mainImage) withImages++;

    // Видео из контента
    const videoUrl = extractVideoUrl(rawContent);
    if (videoUrl) withVideo++;

    // Галерея: картинки из контента (без миниатюр и дублей)
    const galleryImages = extractGalleryImages(rawContent, mainImage);
    const gallery = galleryImages.length > 0 ? galleryImages.join(",") : null;

    // Категория
    let categoryId: number | null = null;
    if (post.categories?.length > 0) {
      for (const wpCatId of post.categories) {
        if (catMap.has(wpCatId)) {
          categoryId = catMap.get(wpCatId)!;
          break;
        }
      }
    }
    if (!categoryId) {
      let uncategorized = await prisma.category.findFirst({ where: { slug: "bez-rubriki" } });
      if (!uncategorized) {
        uncategorized = await prisma.category.create({ data: { name: "Без рубрики", slug: "bez-rubriki" } });
      }
      categoryId = uncategorized.id;
    }

    // Метки
    const tagIds: number[] = [];
    if (post.tags?.length > 0) {
      for (const wpTagId of post.tags) {
        if (tagMap.has(wpTagId)) tagIds.push(tagMap.get(wpTagId)!);
      }
    }

    // Координаты
    const coords = extractCoords(rawContent);
    const latitude = coords.lat || 62.0 + Math.random() * 4;
    const longitude = coords.lng || 30.0 + Math.random() * 6;

    try {
      await prisma.location.upsert({
        where: { slug },
        update: {
          title, content, latitude, longitude, categoryId,
          mainImage, videoUrl, gallery,
          tags: { set: tagIds.map((id) => ({ id })) },
        },
        create: {
          title, slug, content, latitude, longitude, status: "PUBLISHED", categoryId,
          mainImage, videoUrl, gallery,
          tags: { connect: tagIds.map((id) => ({ id })) },
        },
      });
      imported++;
      const media = [mainImage ? "📷" : "", videoUrl ? "🎬" : "", gallery ? `🖼${galleryImages.length}` : ""].filter(Boolean).join(" ");
      console.log(`   ✓ [${imported}] ${title.substring(0, 60)} ${media}`);
    } catch (error: any) {
      skipped++;
      console.log(`   ✗ ${title.substring(0, 60)} — ${error.message?.substring(0, 80)}`);
    }
  }

  console.log(`\n=== Готово! ===`);
  console.log(`   Импортировано: ${imported}`);
  console.log(`   С главным фото: ${withImages}`);
  console.log(`   С видео: ${withVideo}`);
  console.log(`   Пропущено: ${skipped}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
