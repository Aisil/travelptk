"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";

// Динамический импорт карты внутри клиентского компонента, чтобы избежать ошибки SSR
const PublicMap = dynamic(() => import("./PublicMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-2xl bg-gray-50 animate-pulse flex flex-col items-center justify-center border border-gray-200">
      <MapIcon size={48} className="text-gray-300 mb-4 animate-bounce" />
      <span className="text-gray-500 font-medium text-lg">Загрузка интерактивной карты...</span>
    </div>
  ),
});

interface Location {
  id: number;
  title: string;
  slug: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  category?: {
    name: string;
  };
}

export default function DynamicPublicMap({ locations }: { locations: Location[] }) {
  return <PublicMap locations={locations} />;
}
