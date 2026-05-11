import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fetching tags from WordPress...");
  try {
    const res = await fetch("https://po-karelii.ru/wp-json/wp/v2/tags?per_page=100");
    if (!res.ok) {
      throw new Error(`Failed to fetch tags: ${res.statusText}`);
    }
    
    const tags = await res.json();
    console.log(`Found ${tags.length} tags. Starting import...`);

    let importedCount = 0;

    for (const tag of tags) {
      const { id: wpId, name, slug } = tag;

      await prisma.tag.upsert({
        where: { wpId },
        update: {
          name,
          slug,
        },
        create: {
          wpId,
          name,
          slug,
        },
      });
      importedCount++;
    }

    console.log(`Successfully imported/updated ${importedCount} tags.`);
  } catch (error) {
    console.error("Error during tags import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
