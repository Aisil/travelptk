import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/actions";
import LightboxGallery from "@/components/LightboxGallery";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (!content || content.contentType !== "POST") {
    notFound();
  }

  const lat = content.latitude || 62.0;
  const lng = content.longitude || 34.0;
  const galleryImages = content.gallery ? content.gallery.split(",").filter(Boolean) : [];

  return (
    <div className="bg-background text-on-background font-body-md w-full overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism-ice border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max mx-auto">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-background hover:text-primary-container transition-colors">КАРЕЛИЯ</Link>
          <div className="hidden md:flex gap-element-gap items-center">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/">Главная</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-primary-container border-b-2 border-primary-container pb-1" href="#">Направления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/rentals/ladoga-guesthouse">Жильё</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/services/guide-ivan">Услуги</Link>
          </div>
          <Link href="/" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-all">На главную</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-[65vh] w-full overflow-hidden flex items-end bg-zinc-950">
        <div className="absolute inset-0">
          {content.featuredImage ? (
            <img alt={content.title} className="w-full h-full object-cover opacity-50" src={content.featuredImage} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-container to-background"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        <div className="relative z-10 px-gutter max-w-container-max mx-auto w-full pb-16">
          <div className="flex items-center gap-2 mb-6 font-label-caps text-[11px] uppercase tracking-widest text-secondary/60">
            <Link href="/" className="hover:text-primary-container transition-colors">Главная</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary-container/70">{content.category?.name || "Запись"}</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-on-background/80 truncate max-w-[250px]">{content.title}</span>
          </div>
          <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.4em] mb-4 block">
            <span className="material-symbols-outlined text-[14px] align-middle mr-2">landscape</span>
            {content.category?.name || "Запись"}
          </span>
          <h1 className="font-display-xl text-[36px] md:text-[56px] text-primary mb-stack-md tracking-tighter uppercase leading-none">{content.title}</h1>
        </div>
      </header>

      {/* Content + Sidebar */}
      <section className="bg-background py-section-padding-y">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div>
              <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-6 block">Описание</span>
              <div className="prose prose-invert max-w-none prose-p:text-secondary/90 prose-p:text-body-lg prose-p:leading-relaxed prose-p:mb-6">
                {content.content.split("\n\n").filter(Boolean).map((p: any, i: any) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {content.videoUrl && (
              <div>
                <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-6 block">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-2">play_circle</span>
                  Видео
                </span>
                <div className="aspect-video rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl">
                  <iframe
                    src={content.videoUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div>
                <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-6 block">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-2">photo_library</span>
                  Фотогалерея ({galleryImages.length})
                </span>
                <LightboxGallery images={galleryImages} title={content.title} />
              </div>
            )}

            {content.latitude && content.longitude && (
              <div className="glassmorphism-ice rounded-2xl p-8 border border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-on-background mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[28px]">my_location</span>
                  Координаты
                </h3>
                <div className="flex gap-8">
                  <div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Широта</span>
                    <p className="font-headline-md text-[18px] text-primary-container font-mono">{content.latitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Долгота</span>
                    <p className="font-headline-md text-[18px] text-primary-container font-mono">{content.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            )}

            <Link href="/" className="inline-flex items-center gap-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-colors border border-outline-variant/20 rounded-xl px-6 py-4 hover:border-primary-container/30">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Назад к поиску
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-8">
              {content.latitude && content.longitude && (
                <div className="rounded-2xl overflow-hidden h-[350px] border border-outline-variant/20 shadow-2xl">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05}%2C${lat-0.03}%2C${lng+0.05}%2C${lat+0.03}&layer=mapnik&marker=${lat}%2C${lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              )}

              {content.tags && content.tags.length > 0 && (
                <div className="glassmorphism-ice rounded-2xl p-6 border border-outline-variant/20">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">sell</span>
                    Характеристики
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag: any) => (
                      <span key={tag.id} className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-caps text-[10px] uppercase tracking-wider border border-outline-variant/20 hover:border-primary-container/40 transition-colors">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {content.category && (
                <div className="glassmorphism-ice rounded-2xl p-6 border border-outline-variant/20">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-[28px]">folder</span>
                    Рубрика
                  </h3>
                  <span className="bg-primary-container/10 text-primary-container px-5 py-3 rounded-xl font-label-caps text-label-caps uppercase tracking-widest border border-primary-container/20 inline-block">
                    {content.category.name}
                  </span>
                </div>
              )}

              <div className="bg-primary-container/5 rounded-2xl p-6 border border-primary-container/20">
                <p className="font-body-md text-body-md text-secondary mb-4">Хотите посетить это место?</p>
                <Link href="/services/guide-ivan" className="block w-full bg-primary-container text-on-primary-container px-6 py-4 rounded-xl font-label-caps text-label-caps uppercase tracking-widest text-center hover:opacity-90 transition-opacity">
                  Заказать экскурсию
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-16 max-w-container-max mx-auto gap-stack-md">
          <div>
            <div className="font-display-xl text-headline-md text-on-background mb-stack-sm">КАРЕЛИЯ</div>
            <p className="font-body-md text-body-md text-secondary">© {new Date().getFullYear()} НЕЗАБЫВАЕМАЯ КАРЕЛИЯ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          </div>
          <div className="flex gap-element-gap">
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="#">Конфиденциальность</Link>
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="#">Условия</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
