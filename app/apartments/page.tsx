/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamicPublicMap from "@/components/DynamicPublicMap";
import { Star, Wifi, Coffee, Car, Wind, Tv, Calendar, Users, MapPin, ArrowRight, Check, Waves } from "lucide-react";
import Link from "next/link";

export default function ApartmentPage() {
  // Заглушка для карты апартаментов
  const apartmentLocation = [{
    id: 999,
    title: "Nordic Haven Apartment",
    slug: "nordic-haven",
    content: "Премиальные апартаменты в сосновом лесу",
    latitude: 61.78,
    longitude: 34.35,
    category: { name: "Апартаменты" }
  }];

  return (
    <div className="w-full flex flex-col font-sans bg-zinc-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Фоновое видео/изображение */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 z-10 bg-black/40"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md text-amber-300 font-medium text-xs mb-6 border border-amber-300/30 uppercase tracking-widest shadow-xl">
            <Star size={14} fill="currentColor" /> Премиум размещение
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none drop-shadow-xl">
            Nordic <span className="text-amber-400 font-serif italic font-medium lowercase">Haven</span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mb-12 font-light leading-relaxed drop-shadow-md">
            Идеальное место для уединения в сердце Карелии. Панорамные окна, собственная сауна и захватывающий вид на сосновый лес.
          </p>
          
          {/* Панель бронирования */}
          <div className="w-full max-w-4xl bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex-1 flex items-center gap-3 px-6 py-4 border-b sm:border-b-0 sm:border-r border-gray-100 w-full">
              <Calendar className="text-amber-500 shrink-0" size={24} />
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Прибытие - Выезд</span>
                <span className="text-sm font-semibold text-gray-900">Выберите даты</span>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full">
              <Users className="text-amber-500 shrink-0" size={24} />
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Гости</span>
                <span className="text-sm font-semibold text-gray-900">2 взрослых</span>
              </div>
            </div>
            <button className="w-full sm:w-auto px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2">
              Проверить цены <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      
      {/* 2. ОПИСАНИЕ И УДОБСТВА */}
      <section className="bg-white py-24 relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
                Об Апартаментах
              </h2>
              <p className="text-zinc-500 text-lg mb-6 leading-relaxed font-light">
                Просторная двухуровневая студия площадью 75 м², созданная с любовью к скандинавскому минимализму. 
                Натуральные материалы, теплые оттенки дерева и огромные окна от пола до потолка стирают границу между интерьером и дикой природой.
              </p>
              <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-light">
                Вы проснетесь под пение птиц, выпьете утренний кофе на террасе, а вечер сможете провести у настоящего дровяного камина или в приватной финской сауне.
              </p>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { icon: <Wifi size={20} />, label: "Высокоскоростной Wi-Fi" },
                  { icon: <Waves size={20} />, label: "Финская сауна" },
                  { icon: <Coffee size={20} />, label: "Кофемашина Nespresso" },
                  { icon: <Car size={20} />, label: "Своя парковка" },
                  { icon: <Wind size={20} />, label: "Кондиционер" },
                  { icon: <Tv size={20} />, label: "Smart TV & Netflix" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-zinc-700">
                    <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gallery Collage */}
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700 cursor-pointer" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2669&auto=format&fit=crop')" }}>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm h-48">
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700 cursor-pointer" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop')" }}>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm h-48">
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700 cursor-pointer relative group" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop')" }}>
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold tracking-wider">
                       СМОТРЕТЬ ВСЕ
                     </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ОСОБЕННОСТИ / ПРАВИЛА */}
      <section className="bg-zinc-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-4">Всё для вашего комфорта</h2>
            <p className="text-zinc-400 font-light text-lg">Мы продумали каждую мелочь, чтобы вам не пришлось ни о чем беспокоиться.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Кухня и Питание",
                items: ["Индукционная плита", "Посудомоечная машина", "Базовый набор продуктов", "Свежий фермерский завтрак (опция)"]
              },
              {
                title: "Ванная комната",
                items: ["Тропический душ", "Подогрев полов", "Премиальная косметика", "Халаты и мягкие полотенца"]
              },
              {
                title: "Правила дома",
                items: ["Заезд после 15:00", "Выезд до 12:00", "Без шумных вечеринок", "Можно с маленькими питомцами"]
              }
            ].map((block, idx) => (
              <div key={idx} className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                <h3 className="text-xl font-bold uppercase tracking-wide text-amber-400 mb-6">{block.title}</h3>
                <ul className="space-y-4">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. КАРТА */}
      <section className="bg-zinc-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                Расположение
              </h2>
              <p className="text-zinc-500 font-light flex items-center gap-2">
                <MapPin size={16} className="text-amber-500" />
                г. Сортавала, ул. Лесная, 12
              </p>
            </div>
          </div>
          
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white relative z-0">
            <DynamicPublicMap locations={apartmentLocation as any} />
          </div>
        </div>
      </section>

    </div>
  );
}
