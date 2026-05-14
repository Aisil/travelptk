/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublishedLocations, getAllPublishedLocations } from "@/lib/actions";
import DynamicPublicMap from "@/components/DynamicPublicMap";
import Link from "next/link";

export default async function Home() {
  const locations = await getPublishedLocations();
  const allLocations = await getAllPublishedLocations();

  return (
    <div className="bg-background text-on-background font-body-md w-full m-0 p-0 overflow-x-hidden">
      
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 dark:bg-background/80 backdrop-blur-md border-b-0 glassmorphism-ice">
        <div className="flex justify-between items-center px-gutter py-6 max-w-container-max mx-auto">
          <div className="font-display-xl text-headline-md tracking-tighter text-on-background dark:text-on-background">КАРЕЛИЯ</div>
          <div className="hidden md:flex gap-element-gap">
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-primary dark:text-primary-container border-b-2 border-primary-container pb-1" href="#">Направления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Впечатления</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="/locations">Карта</Link>
            <Link className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="/admin">Админка</Link>
          </div>
          <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-widest scale-98 active:scale-95 hover:opacity-80 transition-all duration-300">
            Спланировать
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Карельский Лес" 
            className="w-full h-full object-cover opacity-60" 
            src="https://images.unsplash.com/photo-1549884570-353ee5eb4232?q=80&w=2670&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background"></div>
        </div>
        <div className="relative z-10 text-center px-gutter max-w-4xl mt-16">
          <h1 className="font-display-xl text-[64px] md:text-display-xl text-primary mb-stack-md tracking-tighter uppercase leading-none">
            НЕЗАБЫВАЕМАЯ КАРЕЛИЯ
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mb-element-gap max-w-2xl mx-auto">
            Исследуйте безмолвное величие Севера. Каталог эксклюзивных природных чудес и архитектурных жемчужин в самом сердце Карелии.
          </p>
          <div className="flex flex-col md:flex-row gap-stack-md justify-center">
            <button className="bg-primary-container text-on-primary-container px-10 py-5 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity">
              Начать Путешествие
            </button>
            <button className="border-2 border-outline text-on-background px-10 py-5 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-on-background hover:text-background transition-all">
              Посмотреть Каталог
            </button>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <section className="bg-white text-on-secondary-fixed py-section-padding-y w-full">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="mb-element-gap">
            <span className="font-label-caps text-label-caps text-on-primary-container uppercase tracking-[0.3em] mb-4 block">Навигационный Центр</span>
            <h2 className="font-headline-lg text-headline-lg text-on-secondary-fixed uppercase">ИССЛЕДУЙТЕ ЛОКАЦИИ</h2>
          </div>
          
          <div className="relative w-full h-[600px] bg-zinc-100 rounded-2xl overflow-hidden shadow-2xl group border border-outline-variant/10 z-0">
            <DynamicPublicMap locations={allLocations as any} />
            
            {/* UI поверх карты */}
            <div className="absolute bottom-8 left-8 p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-xl max-w-sm border border-outline-variant/20 pointer-events-none z-[1000]">
              <p className="font-label-caps text-label-caps text-on-primary-container mb-2">Популярный Маршрут</p>
              <h3 className="font-headline-md text-headline-md mb-2">Мраморная Тропа</h3>
              <p className="font-body-md text-body-md text-on-secondary-fixed-variant">42-километровое живописное путешествие по каньонам Рускеалы.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Regions Grid */}
      <section className="bg-white text-on-secondary-fixed py-section-padding-y w-full border-t border-gray-100">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="mb-element-gap">
            <span className="font-label-caps text-label-caps text-on-primary-container uppercase tracking-[0.3em] mb-4 block">Выберите направление</span>
            <h2 className="font-headline-lg text-headline-lg text-on-secondary-fixed uppercase">РАЙОНЫ КАРЕЛИИ</h2>
          </div>

          <div className="flex flex-col gap-8">
            {/* Питкярантский район */}
            <Link href="/region/pitkyarantskiy" className="group relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl block cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img
                  alt="Питкярантский район"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1549884570-353ee5eb4232?q=80&w=2670&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                <span className="inline-block bg-primary-container/20 backdrop-blur-md text-primary-container font-label-caps text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 w-max border border-primary-container/30">
                  Ладожские шхеры и водопады
                </span>
                <h3 className="font-display-xl text-[32px] md:text-[48px] text-white mb-2 group-hover:text-primary-container transition-colors uppercase tracking-tight">
                  ПИТКЯРАНТСКИЙ РАЙОН
                </h3>
                <div className="flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary/80 group-hover:text-white transition-colors">
                  Исследовать <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Сортавальский район */}
            <Link href="/region/sortavalskiy" className="group relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl block cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img
                  alt="Сортавальский район"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2526&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                <span className="inline-block bg-primary-container/20 backdrop-blur-md text-primary-container font-label-caps text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 w-max border border-primary-container/30">
                  Мраморный каньон и архитектура
                </span>
                <h3 className="font-display-xl text-[32px] md:text-[48px] text-white mb-2 group-hover:text-primary-container transition-colors uppercase tracking-tight">
                  СОРТАВАЛЬСКИЙ РАЙОН
                </h3>
                <div className="flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary/80 group-hover:text-white transition-colors">
                  Исследовать <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Олонецкий район */}
            <Link href="/region/oloneckiy" className="group relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl block cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img
                  alt="Олонецкий район"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2659&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                <span className="inline-block bg-primary-container/20 backdrop-blur-md text-primary-container font-label-caps text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 w-max border border-primary-container/30">
                  Древние равнины и традиции
                </span>
                <h3 className="font-display-xl text-[32px] md:text-[48px] text-white mb-2 group-hover:text-primary-container transition-colors uppercase tracking-tight">
                  ОЛОНЕЦКИЙ РАЙОН
                </h3>
                <div className="flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary/80 group-hover:text-white transition-colors">
                  Исследовать <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* Bento Grid Gallery */}
      <section className="bg-surface-container-lowest text-on-surface py-section-padding-y w-full">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="mb-element-gap text-center">
            <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-[0.4em] mb-4 block">Визуальный Дневник</span>
            <h2 className="font-headline-lg text-headline-lg uppercase">СЕВЕРНОЕ ПОЛОТНО</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
            {/* Tile 1 */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group cursor-crosshair h-[400px] md:h-auto">
              <img 
                alt="Рассвет в лесу" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2670&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <p className="font-label-caps text-label-caps uppercase text-primary-container">Рассвет на Паанаярви</p>
              </div>
            </div>
            
            {/* Tile 2 */}
            <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group cursor-crosshair h-[300px] md:h-auto">
              <img 
                alt="Ледяное озеро" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2526&auto=format&fit=crop" 
              />
            </div>
            
            {/* Tile 3 */}
            <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group cursor-crosshair h-[300px] md:h-auto">
              <img 
                alt="Горный пик" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2659&auto=format&fit=crop" 
              />
            </div>
            
            {/* Tile 4 */}
            <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden relative group cursor-crosshair h-[300px] md:h-auto">
              <img 
                alt="Вид на реку" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2670&auto=format&fit=crop" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background dark:bg-surface-container-lowest border-t border-outline-variant/20 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-section-padding-y max-w-container-max mx-auto gap-stack-md">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-display-xl text-headline-md text-on-background mb-stack-sm">КАРЕЛИЯ</div>
            <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim">© {new Date().getFullYear()} НЕЗАБЫВАЕМАЯ КАРЕЛИЯ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          </div>
          <div className="flex gap-element-gap">
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors hover:opacity-80 duration-200" href="#">Конфиденциальность</Link>
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors hover:opacity-80 duration-200" href="#">Условия</Link>
            <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors hover:opacity-80 duration-200" href="#">Контакты</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
