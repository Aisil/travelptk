/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCategories, getTags, getContentById } from "@/lib/actions";
import Link from "next/link";
import ContentForm from "@/components/ContentForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const initialData = await getContentById(id);
  if (!initialData || initialData.contentType !== "PAGE") notFound();

  const categories = await getCategories();
  const tags = await getTags();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2">
          ← <span>Назад к списку</span>
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Редактировать страницу</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ContentForm categories={categories} tags={tags} contentType="PAGE" initialData={initialData} />
      </div>
    </div>
  );
}
