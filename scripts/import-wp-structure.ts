import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function importWPStructure() {
  try {
    console.log("Начинаем импорт рубрик...");
    const catRes = await fetch("https://po-karelii.ru/wp-json/wp/v2/categories?per_page=100");
    if (!catRes.ok) throw new Error(`HTTP Error! Status: ${catRes.status}`);
    const wpCategories = await catRes.json();
    
    console.log(`Получено ${wpCategories.length} рубрик.`);
    
    // Шаг 1: Создаем/обновляем все рубрики без иерархии
    for (const wpCat of wpCategories) {
      await prisma.category.upsert({
        where: { slug: wpCat.slug },
        update: { wpId: wpCat.id, name: wpCat.name },
        create: { wpId: wpCat.id, name: wpCat.name, slug: wpCat.slug }
      });
    }
    
    // Шаг 2: Устанавливаем связи (parentId)
    for (const wpCat of wpCategories) {
      if (wpCat.parent !== 0) {
        const parentInDB = await prisma.category.findUnique({
          where: { wpId: wpCat.parent }
        });
        
        if (parentInDB) {
          await prisma.category.update({
            where: { wpId: wpCat.id },
            data: { parentId: parentInDB.id }
          });
        }
      }
    }
    console.log("✅ Иерархия рубрик успешно импортирована!");

    console.log("Начинаем импорт меток...");
    const tagRes = await fetch("https://po-karelii.ru/wp-json/wp/v2/tags?per_page=100");
    if (!tagRes.ok) throw new Error(`HTTP Error! Status: ${tagRes.status}`);
    const wpTags = await tagRes.json();
    
    console.log(`Получено ${wpTags.length} меток.`);
    
    for (const wpTag of wpTags) {
      await prisma.tag.upsert({
        where: { slug: wpTag.slug },
        update: { wpId: wpTag.id, name: wpTag.name },
        create: { wpId: wpTag.id, name: wpTag.name, slug: wpTag.slug }
      });
    }
    console.log("✅ Метки успешно импортированы!");

  } catch (error) {
    console.error("Ошибка при импорте:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importWPStructure();
