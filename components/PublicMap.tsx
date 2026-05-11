"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Custom Icon for premium design
const premiumIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // We can use custom dot icon here ideally, but default works for now
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

export default function PublicMap({ locations }: { locations: Location[] }) {
  const validLocations = locations.filter(loc => loc.latitude !== null && loc.longitude !== null);
  
  const defaultCenter: [number, number] = validLocations.length > 0 
    ? [validLocations[0].latitude as number, validLocations[0].longitude as number]
    : [62.0, 34.0];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={false}
      className="z-0"
    >
      {/* Premium clean map tile (Carto Light) */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {validLocations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude as number, loc.longitude as number]} icon={premiumIcon}>
          <Popup className="premium-popup">
            <div className="p-3 min-w-[220px] font-sans">
              <span className="inline-block bg-primary-container/10 text-on-primary-container font-label-caps text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest mb-2 border border-primary-container/20">
                {loc.category?.name || "Локация"}
              </span>
              <h3 className="font-headline-md text-[18px] leading-tight text-zinc-900 mb-2 uppercase tracking-tight">
                {loc.title}
              </h3>
              <p className="font-body-md text-[13px] text-zinc-600 line-clamp-2 mb-4">
                {loc.content}
              </p>
              <Link 
                href={`/post/${loc.slug}`} 
                className="font-label-caps text-[10px] uppercase tracking-widest text-zinc-900 flex items-center gap-2 hover:gap-3 transition-all border-b border-zinc-900 pb-1 w-fit"
              >
                Подробнее <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
