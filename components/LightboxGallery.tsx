"use client";

import { useState, useEffect, useCallback } from "react";

interface LightboxGalleryProps {
  images: string[];
  title: string;
}

export default function LightboxGallery({ images, title }: LightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [activeIndex, close, prev, next]);

  return (
    <>
      {/* Сетка миниатюр */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/10 relative focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <img
              alt={`${title} — фото ${i + 1}`}
              src={src}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px] opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                zoom_in
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Лайтбокс */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={close}
        >
          {/* Затемнение */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Контент */}
          <div
            className="relative z-10 flex items-center justify-center w-full h-full px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={close}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-20 border border-white/10"
              aria-label="Закрыть"
            >
              <span className="material-symbols-outlined text-white text-[28px]">close</span>
            </button>

            {/* Счётчик */}
            <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/10 z-20">
              <span className="font-label-caps text-label-caps text-white tracking-widest">
                {activeIndex + 1} / {images.length}
              </span>
            </div>

            {/* Кнопка «Назад» */}
            <button
              onClick={prev}
              className="absolute left-4 md:left-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-20 border border-white/10"
              aria-label="Предыдущее фото"
            >
              <span className="material-symbols-outlined text-white text-[32px]">chevron_left</span>
            </button>

            {/* Изображение */}
            <img
              src={images[activeIndex]}
              alt={`${title} — фото ${activeIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            />

            {/* Кнопка «Вперёд» */}
            <button
              onClick={next}
              className="absolute right-4 md:right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors z-20 border border-white/10"
              aria-label="Следующее фото"
            >
              <span className="material-symbols-outlined text-white text-[32px]">chevron_right</span>
            </button>

            {/* Полоска миниатюр снизу */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 max-w-[80vw] overflow-x-auto px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-sm">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                    i === activeIndex
                      ? "ring-2 ring-primary-container opacity-100 scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
