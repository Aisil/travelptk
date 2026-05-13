/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

const demo: Record<string, any> = {
  "ladoga-guesthouse": {
    title: "Гостевой Дом «Ладога»",
    type: "Гостевой дом",
    location: "Сортавала, ул. Приозёрная, 12",
    price: 4500,
    rating: 4.8,
    reviews: 127,
    heroImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2670&auto=format&fit=crop",
    description: "Уютный гостевой дом на берегу Ладожского озера с панорамным видом. Идеален для семейного отдыха и романтических путешествий. До мраморного каньона Рускеала — 30 минут на машине.\n\nК вашим услугам — собственный пирс для рыбалки, русская баня на дровах, мангальная зона с беседкой. Каждый номер оформлен в скандинавском стиле с элементами карельского декора.",
    gallery: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2671&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2670&auto=format&fit=crop",
    ],
    amenities: [
      { icon: "wifi", name: "Бесплатный Wi-Fi" },
      { icon: "local_parking", name: "Парковка" },
      { icon: "hot_tub", name: "Баня на дровах" },
      { icon: "kitchen", name: "Полная кухня" },
      { icon: "deck", name: "Терраса с видом" },
      { icon: "grill", name: "Мангальная зона" },
      { icon: "rowing", name: "Лодка напрокат" },
      { icon: "ac_unit", name: "Кондиционер" },
      { icon: "local_laundry_service", name: "Стиральная машина" },
      { icon: "pets", name: "Можно с животными" },
    ],
    details: [
      { label: "Спальни", value: "3" },
      { label: "Гости", value: "до 8" },
      { label: "Площадь", value: "120 м²" },
      { label: "До озера", value: "50 м" },
    ]
  },
  "sortavala-apartment": {
    title: "Квартира в центре Сортавалы",
    type: "Квартира",
    location: "Сортавала, ул. Карельская, 24",
    price: 2800,
    rating: 4.6,
    reviews: 89,
    heroImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop",
    description: "Стильная двухкомнатная квартира в историческом центре Сортавалы. Пешая доступность до всех достопримечательностей, кафе и набережной.\n\nСвежий ремонт, скандинавский минимализм, полностью оборудованная кухня. Идеально для пары или небольшой компании.",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2671&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2670&auto=format&fit=crop",
    ],
    amenities: [
      { icon: "wifi", name: "Wi-Fi" },
      { icon: "local_parking", name: "Парковка во дворе" },
      { icon: "kitchen", name: "Кухня" },
      { icon: "tv", name: "Smart TV" },
      { icon: "ac_unit", name: "Кондиционер" },
      { icon: "local_laundry_service", name: "Стиральная машина" },
    ],
    details: [
      { label: "Комнаты", value: "2" },
      { label: "Гости", value: "до 4" },
      { label: "Площадь", value: "56 м²" },
      { label: "Этаж", value: "3 из 5" },
    ]
  }
};

export default async function RentalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = demo[slug] || demo["ladoga-guesthouse"];

  return (
    <div className="bg-background text-on-background font-body-md w-full overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism-ice border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max mx-auto">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-background hover:text-primary-container transition-colors">КАРЕЛИЯ</Link>
          <div className="hidden md:flex gap-element-gap items-center">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/">Главная</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/location/belye-mosty">Направления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-primary-container border-b-2 border-primary-container pb-1" href="#">Жильё</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="/services/guide-ivan">Услуги</Link>
          </div>
          <Link href="/" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-all">На главную</Link>
        </div>
      </nav>

      {/* Hero with title */}
      <header className="relative pt-32 pb-12 bg-background">
        <div className="max-w-container-max mx-auto px-gutter">
          <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.4em] mb-4 block"><span className="material-symbols-outlined text-[14px] align-middle mr-2">apartment</span>{r.type}</span>
          <h1 className="font-display-xl text-[40px] md:text-headline-lg text-primary mb-stack-md tracking-tighter uppercase leading-tight">{r.title}</h1>
          <div className="flex items-center gap-6 text-secondary">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">location_on</span>{r.location}</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-amber-400">star</span>{r.rating} ({r.reviews} отзывов)</span>
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <section className="max-w-container-max mx-auto px-gutter mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[450px]">
          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden"><img src={r.gallery[0]} alt={r.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
          {r.gallery.slice(1, 5).map((src: string, i: number) => (
            <div key={i} className="rounded-2xl overflow-hidden"><img src={src} alt={`Фото ${i+2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
          ))}
        </div>
      </section>

      {/* Content + Booking */}
      <section className="max-w-container-max mx-auto px-gutter pb-section-padding-y">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-4 block">Об объекте</span>
              {r.description.split("\n\n").map((p: string, i: number) => (
                <p key={i} className="font-body-lg text-body-lg text-secondary/90 mb-6 leading-relaxed">{p}</p>
              ))}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {r.details.map((d: any, i: number) => (
                <div key={i} className="glassmorphism-ice rounded-xl p-5 border border-outline-variant/20 text-center">
                  <p className="font-headline-md text-headline-md text-primary-container mb-1">{d.value}</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">{d.label}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.3em] mb-6 block">Удобства</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {r.amenities.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-surface-container rounded-xl p-4 border border-outline-variant/10 hover:border-primary-container/30 transition-colors">
                    <span className="material-symbols-outlined text-primary-container text-[24px]">{a.icon}</span>
                    <span className="font-body-md text-body-md text-on-background">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sticky Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 glassmorphism-ice rounded-2xl p-8 border border-outline-variant/20 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display-xl text-[36px] text-primary-container tracking-tight">{r.price.toLocaleString("ru-RU")} ₽</span>
                <span className="font-body-md text-body-md text-secondary">/ сутки</span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/10">
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Заезд</p>
                    <p className="font-body-md text-body-md text-on-background">14:00</p>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/10">
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Выезд</p>
                    <p className="font-body-md text-body-md text-on-background">12:00</p>
                  </div>
                </div>
                <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/10">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Гости</p>
                  <p className="font-body-md text-body-md text-on-background">{r.details[1]?.value}</p>
                </div>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 space-y-2">
                <div className="flex justify-between text-secondary"><span>{r.price.toLocaleString("ru-RU")} ₽ × 3 ночи</span><span>{(r.price * 3).toLocaleString("ru-RU")} ₽</span></div>
                <div className="flex justify-between text-secondary"><span>Сервисный сбор</span><span>500 ₽</span></div>
                <div className="flex justify-between font-headline-md text-on-background pt-2 border-t border-outline-variant/20"><span>Итого</span><span>{(r.price * 3 + 500).toLocaleString("ru-RU")} ₽</span></div>
              </div>
              <button className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity">Забронировать</button>
              <p className="text-center font-body-md text-[13px] text-secondary">Оплата не спишется сейчас</p>
            </div>
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
