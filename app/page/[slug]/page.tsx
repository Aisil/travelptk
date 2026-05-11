import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/actions";
import LightboxGallery from "@/components/LightboxGallery";

export default async function PageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (!content || content.contentType !== "PAGE") {
    notFound();
  }

  const galleryImages = content.gallery ? content.gallery.split(",").filter(Boolean) : [];

  return (
    <div className="bg-background text-on-background font-body-md w-full overflow-x-hidden min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism-ice border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max mx-auto">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-background hover:text-primary-container transition-colors">КАРЕЛИЯ</Link>
          <div className="hidden md:flex gap-element-gap items-center">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/">Главная</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/post/bastion">Направления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/rentals/ladoga-guesthouse">Жильё</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/services/guide-ivan">Услуги</Link>
          </div>
          <Link href="/" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-all">На главную</Link>
        </div>
      </nav>

      {/* Page Header */}
      <header className="relative pt-32 pb-16 px-gutter border-b border-outline-variant/10 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto w-full text-center">
          <div className="flex justify-center items-center gap-2 mb-8 font-label-caps text-[11px] uppercase tracking-widest text-secondary/60">
            <Link href="/" className="hover:text-primary-container transition-colors">Главная</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-on-background/80">{content.title}</span>
          </div>
          <h1 className="font-display-xl text-[40px] md:text-[64px] text-primary tracking-tighter uppercase leading-tight">
            {content.title}
          </h1>
        </div>
      </header>

      {/* Page Content */}
      <section className="bg-background py-section-padding-y flex-grow">
        <div className="max-w-4xl mx-auto px-gutter">
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-secondary/90 prose-p:leading-relaxed prose-headings:text-on-background prose-headings:font-display-xl prose-a:text-primary-container prose-a:no-underline hover:prose-a:underline">
             {content.mainImage && (
               <img 
                 src={content.mainImage} 
                 alt={content.title} 
                 className="w-full aspect-[21/9] object-cover rounded-3xl mb-12 shadow-2xl border border-outline-variant/10"
               />
             )}
             
             <div className="space-y-8">
               {content.content.split("\n\n").filter(Boolean).map((p, i) => (
                 <p key={i}>{p}</p>
               ))}
             </div>

             {galleryImages.length > 0 && (
               <div className="mt-16 pt-16 border-t border-outline-variant/10">
                 <h2 className="font-display-xl text-3xl uppercase tracking-tighter mb-8">Изображения</h2>
                 <LightboxGallery images={galleryImages} title={content.title} />
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-12 max-w-container-max mx-auto gap-stack-md">
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
