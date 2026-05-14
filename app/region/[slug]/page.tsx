/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // For this demo, let's map region slugs to their root category slugs or names
  const regionMap: Record<string, string> = {
    'pitkyarantskiy': 'pitkyaranta',
    'sortavalskiy': 'sortavala',
    'oloneckiy': 'olonec'
  };

  const categorySlug = regionMap[slug];
  if (!categorySlug) notFound();

  // Find the root category for the region
  const rootCategory = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      children: true
    }
  });

  if (!rootCategory) notFound();

  const titleMap: Record<string, string> = {
    'pitkyarantskiy': 'ПИТКЯРАНТСКИЙ РАЙОН',
    'sortavalskiy': 'СОРТАВАЛЬСКИЙ РАЙОН',
    'oloneckiy': 'ОЛОНЕЦКИЙ РАЙОН'
  };

  const regionTitle = titleMap[slug];

  // For each child category, fetch up to 3 posts
  const categoriesWithPosts = await Promise.all(
    rootCategory.children.map(async (child: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      const posts = await prisma.entry.findMany({
        where: { categoryId: child.id, contentType: "POST", status: "PUBLISHED" },
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      return {
        ...child,
        posts
      };
    })
  );

  return (
    <div className="bg-background text-on-background font-body-md w-full overflow-x-hidden min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism-ice border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max mx-auto">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-background hover:text-primary-container transition-colors">КАРЕЛИЯ</Link>
          <div className="hidden md:flex gap-element-gap items-center">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/">Главная</Link>
          </div>
          <Link href="/" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-all">На главную</Link>
        </div>
      </nav>

      <header className="relative pt-40 pb-20 px-gutter border-b border-outline-variant/10 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto w-full text-center">
          <h1 className="font-display-xl text-[48px] md:text-[80px] text-primary tracking-tighter uppercase leading-tight">
            {regionTitle}
          </h1>
          <p className="font-body-lg text-secondary mt-6 max-w-2xl mx-auto">
            Откройте для себя уникальные места, историческое наследие и первозданную природу.
          </p>
        </div>
      </header>

      <main className="flex-grow py-section-padding-y max-w-container-max mx-auto px-gutter w-full space-y-24">
        {categoriesWithPosts.filter((c: any) => c.posts.length > 0).map((category: any) => (
          <section key={category.id}>
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant/10 pb-6">
              <h2 className="font-display-xl text-3xl uppercase tracking-tight text-white">{category.name}</h2>
              {/* Optional: Add count or description if needed */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-element-gap">
              {category.posts.map((post: any) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group card-hover-effect cursor-pointer block">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-xl border border-outline-variant/5">
                    <img
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:brightness-110"
                      src={post.featuredImage || `https://images.unsplash.com/photo-1549884570-353ee5eb4232?q=80&w=800&auto=format&fit=crop`}
                    />
                  </div>
                  <div className="px-2">
                    <h3 className="font-headline-md text-headline-md mb-2 group-hover:text-primary-container transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant flex items-center gap-2 group-hover:text-white transition-all mt-4">
                      Подробнее <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Simulated "Смотреть все" button if we assume there might be more */}
            <div className="mt-12 text-center">
              <Link href={`/category/${category.slug}`} className="inline-block border border-outline-variant/20 text-on-surface-variant px-10 py-4 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:border-primary-container hover:text-primary-container transition-all">
                Смотреть все: {category.name}
              </Link>
            </div>
          </section>
        ))}

        {categoriesWithPosts.filter((c: any) => c.posts.length > 0).length === 0 && (
           <div className="text-center py-20 text-secondary font-body-lg">
             В этом районе пока нет записей.
           </div>
        )}
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-12 max-w-container-max mx-auto gap-stack-md">
          <div>
            <div className="font-display-xl text-headline-md text-on-background mb-stack-sm">КАРЕЛИЯ</div>
            <p className="font-body-md text-body-md text-secondary">© {new Date().getFullYear()} НЕЗАБЫВАЕМАЯ КАРЕЛИЯ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
