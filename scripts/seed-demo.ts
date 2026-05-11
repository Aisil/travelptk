import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding demo data...");

  // 1. Находим или создаём категории
  const catVodopady = await prisma.category.upsert({
    where: { slug: "vodopady" },
    update: {},
    create: { name: "Водопады", slug: "vodopady" },
  });

  const catZhilye = await prisma.category.upsert({
    where: { slug: "zhilye" },
    update: {},
    create: { name: "Жильё", slug: "zhilye" },
  });

  const catUslugi = await prisma.category.upsert({
    where: { slug: "uslugi" },
    update: {},
    create: { name: "Услуги", slug: "uslugi" },
  });

  // 2. Водопад «Белые Мосты»
  await prisma.location.upsert({
    where: { slug: "belye-mosty" },
    update: {},
    create: {
      title: "Водопад Белые Мосты",
      slug: "belye-mosty",
      content: "Водопад Белые Мосты (Юканкоски) — самый высокий водопад Южной Карелии. Два потока воды обрушиваются с высоты 18 метров в живописный каньон, образуя облака водяной пыли.",
      latitude: 61.7562,
      longitude: 31.3991,
      status: "PUBLISHED",
      categoryId: catVodopady.id,
    },
  });
  console.log("  ✓ Водопад «Белые Мосты»");

  // 3. Гостевой дом «Ладога»
  await prisma.location.upsert({
    where: { slug: "ladoga-guesthouse" },
    update: {},
    create: {
      title: "Гостевой Дом «Ладога»",
      slug: "ladoga-guesthouse",
      content: "Уютный гостевой дом на берегу Ладожского озера с панорамным видом. Идеален для семейного отдыха. До мраморного каньона Рускеала — 30 минут.",
      latitude: 61.7041,
      longitude: 30.6923,
      status: "PUBLISHED",
      categoryId: catZhilye.id,
    },
  });
  console.log("  ✓ Гостевой дом «Ладога»");

  // 4. Квартира в Сортавале
  await prisma.location.upsert({
    where: { slug: "sortavala-apartment" },
    update: {},
    create: {
      title: "Квартира в центре Сортавалы",
      slug: "sortavala-apartment",
      content: "Стильная двухкомнатная квартира в историческом центре Сортавалы. Пешая доступность до всех достопримечательностей, кафе и набережной.",
      latitude: 61.7070,
      longitude: 30.6918,
      status: "PUBLISHED",
      categoryId: catZhilye.id,
    },
  });
  console.log("  ✓ Квартира в Сортавале");

  // 5. Гид Иван
  await prisma.location.upsert({
    where: { slug: "guide-ivan" },
    update: {},
    create: {
      title: "Гид Иван Карельский",
      slug: "guide-ivan",
      content: "Сертифицированный гид по Карелии с 12-летним стажем. Авторские экскурсии по водопадам, горным тропам и историческим местам.",
      latitude: 61.7041,
      longitude: 30.6923,
      status: "PUBLISHED",
      categoryId: catUslugi.id,
    },
  });
  console.log("  ✓ Гид Иван Карельский");

  console.log("\nSeed complete! 4 demo records created.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
