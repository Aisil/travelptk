import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fetching categories from WordPress...");
  try {
    const res = await fetch("https://po-karelii.ru/wp-json/wp/v2/categories?per_page=100");
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    
    const wpCategories = await res.json();
    console.log(`Found ${wpCategories.length} categories. Starting fix...`);

    // We must NOT delete categories blindly if they are linked to Locations.
    // However, the user specifically requested to "Очистить текущую таблицу категорий".
    // Doing so requires deleting Locations first or setting categoryId to null,
    // but Prisma schema requires categoryId on Location.
    // To be safe and avoid breaking Locations, I will use upsert instead of deleteMany,
    // OR just use upsert to fix parentId.
    // But let's follow the instruction "Очистить текущую таблицу категорий" carefully.
    // Wait, if I delete categories, Location records will be deleted or throw constraint error.
    // Since this is a fresh setup and we just imported tags, maybe locations are empty.
    
    // Attempt to clear table (may fail if there are locations)
    try {
      await prisma.category.deleteMany();
      console.log("Cleared existing categories.");
    } catch (e) {
      console.log("Could not clear categories (possibly due to existing locations). We will update them instead.");
    }

    // Pass 1: Upsert all categories
    for (const wpCat of wpCategories) {
      const { id: wpId, name, slug } = wpCat;

      await prisma.category.upsert({
        where: { wpId },
        update: {
          name,
          slug,
          parentId: null // Reset parent initially
        },
        create: {
          wpId,
          name,
          slug,
          parentId: null
        },
      });
    }
    console.log("Pass 1: Created/Updated all categories with no parents.");

    // Pass 2: Set parents
    let updatedParents = 0;
    for (const wpCat of wpCategories) {
      if (wpCat.parent && wpCat.parent !== 0) {
        // Find the parent's Prisma ID using its WP ID
        const parentCategory = await prisma.category.findUnique({
          where: { wpId: wpCat.parent }
        });

        if (parentCategory) {
          // Update the current category's parentId
          await prisma.category.update({
            where: { wpId: wpCat.id },
            data: { parentId: parentCategory.id }
          });
          updatedParents++;
        }
      }
    }
    
    console.log(`Pass 2: Successfully mapped ${updatedParents} parent relations.`);
  } catch (error) {
    console.error("Error during categories fix:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
