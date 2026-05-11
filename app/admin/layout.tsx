"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  File,
  FolderTree,
  Tags,
  Menu,
  X,
  LogOut,
  MapPin
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { name: "Записи", href: "/admin/posts", icon: FileText },
    { name: "Страницы", href: "/admin/pages", icon: File },
    { name: "Рубрики", href: "/admin/categories", icon: FolderTree },
    { name: "Метки", href: "/admin/tags", icon: Tags },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row w-full absolute inset-0 z-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center z-20">
        <span className="text-xl font-bold">Travel Admin</span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-gray-900 text-white flex-shrink-0 min-h-screen`}
      >
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="text-blue-500" />
            Travel Admin
          </h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-colors mb-2">
            <span className="font-medium text-sm">Вернуться на сайт</span>
          </Link>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full bg-gray-50 text-gray-900">
        {children}
      </main>
    </div>
  );
}
