import Link from "next/link";
import ContentForm from "@/components/ContentForm";

export const dynamic = 'force-dynamic';

export default async function NewAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2">
          ← <span>Назад к списку</span>
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Добавить страницу</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ContentForm categories={[]} tags={[]} contentType="PAGE" />
      </div>
    </div>
  );
}
