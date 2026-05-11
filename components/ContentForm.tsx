"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { createContent } from "@/lib/actions";
import { useRouter } from "next/navigation";

// Dynamically import MapPicker to disable SSR (Leaflet requires window object)
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg bg-gray-100 animate-pulse flex items-center justify-center border border-gray-200">
      <span className="text-gray-500 font-medium">Загрузка карты...</span>
    </div>
  ),
});

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ContentFormProps {
  categories: Category[];
  tags?: Tag[];
  contentType?: "POST" | "PAGE";
}

export default function ContentForm({ categories, tags = [], contentType = "POST" }: ContentFormProps) {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    // Set content type explicitly
    formData.set("contentType", contentType);
    
    // Override manual inputs with map coordinates if they exist
    if (coords.lat) formData.set("latitude", coords.lat.toString());
    if (coords.lng) formData.set("longitude", coords.lng.toString());
    
    const res = await createContent(formData);
    
    if (res?.success) {
      router.push(contentType === "POST" ? "/admin/posts" : "/admin/pages");
    } else {
      alert("Ошибка при сохранении: " + (res?.error || "Попробуйте позже"));
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <input type="hidden" name="contentType" value={contentType} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
            placeholder={contentType === "POST" ? "Название локации или услуги" : "Заголовок страницы"}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-mono text-sm"
            placeholder="my-cool-link"
          />
        </div>
      </div>

      {contentType === "POST" && (
        <>
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Рубрика
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-white"
            >
              <option value="" disabled>Выберите рубрику...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Метки (Теги)
            </label>
            <div className="w-full max-h-48 overflow-y-auto p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={tag.id}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="truncate" title={tag.name}>{tag.name}</span>
                  </label>
                ))}
                {tags.length === 0 && <span className="text-gray-500 text-sm">Нет доступных меток</span>}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Контент (текст)
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm resize-y"
          placeholder="Основной текст..."
        />
      </div>

      {contentType === "POST" && (
        <div className="space-y-2 p-5 bg-gray-50 rounded-xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Координаты на карте (Кликните, чтобы выбрать точку)
          </label>
          
          <MapPicker onLocationSelect={(lat, lng) => setCoords({ lat, lng })} />
          
          <div className="flex gap-6 mt-4 pt-2 border-t border-gray-200 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Широта:</span> 
              <span className="font-mono bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                {coords.lat ? coords.lat.toFixed(6) : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Долгота:</span> 
              <span className="font-mono bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                {coords.lng ? coords.lng.toFixed(6) : "—"}
              </span>
            </div>
          </div>

          <input type="hidden" name="latitude" value={coords.lat || ""} />
          <input type="hidden" name="longitude" value={coords.lng || ""} />
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md w-full sm:w-auto disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
