import Link from "next/link";

const demo: Record<string, any> = {
  "guide-ivan": {
    name: "Иван Карельский",
    role: "Профессиональный гид-проводник",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    experience: "12 лет",
    tours: 340,
    rating: 4.9,
    reviews: 215,
    bio: "Сертифицированный гид по Карелии с 12-летним стажем. Провожу авторские экскурсии по водопадам, горным тропам и историческим местам. Знаю каждую тропинку в лесах Южной Карелии.\n\nСпециализируюсь на фото-турах, многодневных походах и индивидуальных маршрутах для семей с детьми. Работаю круглый год — летом пешие маршруты, зимой снегоходные туры.",
    services: [
      { name: "Экскурсия на водопад Белые Мосты", duration: "6 часов", price: 4500, popular: true },
      { name: "Тур в Рускеалу + каньон", duration: "8 часов", price: 6000, popular: true },
      { name: "Фото-тур по Ладожским шхерам", duration: "10 часов", price: 8000, popular: false },
      { name: "Многодневный поход (2 дня)", duration: "2 дня", price: 15000, popular: false },
      { name: "Зимний снегоходный тур", duration: "4 часа", price: 7500, popular: true },
      { name: "Индивидуальный маршрут", duration: "По запросу", price: 0, popular: false },
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2659&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549884570-353ee5eb4232?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2526&auto=format&fit=crop",
    ],
    badges: ["Сертифицированный гид", "Первая помощь", "Фотограф", "Водитель кат. B"],
  }
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = demo[slug] || demo["guide-ivan"];

  return (
    <div className="bg-background text-on-background font-body-md w-full overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism-ice border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max mx-auto">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-background hover:text-primary-container transition-colors">КАРЕЛИЯ</Link>
          <div className="hidden md:flex gap-element-gap items-center">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/">Главная</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/location/belye-mosty">Направления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/rentals/ladoga-guesthouse">Жильё</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-primary-container border-b-2 border-primary-container pb-1" href="#">Услуги</Link>
          </div>
          <Link href="/" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-all">На главную</Link>
        </div>
      </nav>

      {/* Hero + Card */}
      <header className="relative pt-32 pb-16 bg-background">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary-container/30 shadow-2xl">
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1">
              <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.4em] mb-3 block"><span className="material-symbols-outlined text-[14px] align-middle mr-2">verified</span>{s.role}</span>
              <h1 className="font-display-xl text-[40px] md:text-headline-lg text-primary mb-4 tracking-tighter uppercase leading-tight">{s.name}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                {s.badges.map((b: string, i: number) => (
                  <span key={i} className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-caps text-[10px] uppercase tracking-wider border border-outline-variant/20">{b}</span>
                ))}
              </div>
              <div className="flex gap-8 mb-6">
                <div><p className="font-headline-md text-headline-md text-primary-container">{s.experience}</p><p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Стаж</p></div>
                <div><p className="font-headline-md text-headline-md text-primary-container">{s.tours}+</p><p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Экскурсий</p></div>
                <div><p className="font-headline-md text-headline-md text-primary-container flex items-center gap-1"><span className="material-symbols-outlined text-amber-400 text-[20px]">star</span>{s.rating}</p><p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">{s.reviews} отзывов</p></div>
              </div>
              {/* Quick messengers */}
              <div className="flex gap-3">
                <a href="https://wa.me/79001234567" target="_blank" className="flex items-center gap-2 bg-green-600/20 text-green-400 px-5 py-3 rounded-xl font-label-caps text-label-caps uppercase tracking-widest border border-green-600/30 hover:bg-green-600/30 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chat</span>WhatsApp
                </a>
                <a href="https://t.me/ivan_karelia" target="_blank" className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-5 py-3 rounded-xl font-label-caps text-label-caps uppercase tracking-widest border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">send</span>Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bio */}
      <section className="bg-background pb-16">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-4 block">О специалисте</span>
          {s.bio.split("\n\n").map((p: string, i: number) => (
            <p key={i} className="font-body-lg text-body-lg text-secondary/90 mb-6 leading-relaxed max-w-3xl">{p}</p>
          ))}
        </div>
      </section>

      {/* Price List */}
      <section className="bg-surface-container-lowest py-section-padding-y">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.4em] mb-4 block">Прайс-лист</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-10">Услуги и Цены</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {s.services.map((svc: any, i: number) => (
              <div key={i} className={`glassmorphism-ice rounded-2xl p-6 border transition-colors hover:border-primary-container/40 ${svc.popular ? "border-primary-container/30" : "border-outline-variant/20"} relative`}>
                {svc.popular && <span className="absolute top-4 right-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-caps text-[9px] uppercase tracking-wider">Популярно</span>}
                <h3 className="font-headline-md text-headline-md text-on-background mb-3 pr-20">{svc.name}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-2 text-secondary"><span className="material-symbols-outlined text-[16px]">schedule</span>{svc.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display-xl text-[28px] text-primary-container tracking-tight">{svc.price > 0 ? `${svc.price.toLocaleString("ru-RU")} ₽` : "Договорная"}</span>
                  <button className="bg-primary-container/10 text-primary-container px-5 py-2 rounded-xl font-label-caps text-label-caps uppercase tracking-widest border border-primary-container/30 hover:bg-primary-container/20 transition-colors">Записаться</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="bg-background py-section-padding-y">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.4em] mb-4 block">Портфолио</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-10">Фотографии с туров</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {s.portfolio.map((src: string, i: number) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                <img src={src} alt={`Портфолио ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-container/5 py-20 border-y border-primary-container/20">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-4">Готовы к Приключению?</h2>
          <p className="font-body-lg text-body-lg text-secondary mb-8 max-w-xl mx-auto">Свяжитесь со мной для бесплатной консультации по маршруту и подбору идеального тура.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/79001234567" target="_blank" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-xl font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity">Написать в WhatsApp</a>
            <a href="https://t.me/ivan_karelia" target="_blank" className="border-2 border-outline text-on-background px-10 py-4 rounded-xl font-label-caps text-label-caps uppercase tracking-widest hover:bg-on-background hover:text-background transition-all">Telegram</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-16 max-w-container-max mx-auto gap-stack-md">
          <div><div className="font-display-xl text-headline-md text-on-background mb-stack-sm">КАРЕЛИЯ</div><p className="font-body-md text-body-md text-secondary">© {new Date().getFullYear()} НЕЗАБЫВАЕМАЯ КАРЕЛИЯ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p></div>
          <div className="flex gap-element-gap">
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="#">Конфиденциальность</Link>
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="#">Условия</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
