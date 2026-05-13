/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCategoryTree, createCategory } from "@/lib/actions";

export const dynamic = 'force-dynamic';

// Тип для рекурсивного отображения дерева
type CategoryNode = {
  id: number;
  wpId: number | null;
  name: string;
  slug: string;
  parentId: number | null;
  children?: CategoryNode[];
};

function CategoryRow({ category, depth = 0 }: { category: CategoryNode; depth?: number }) {
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
          {depth > 0 && (
            <span className="text-gray-300 mr-2" style={{ marginLeft: `${depth * 1.5}rem` }}>
              └─
            </span>
          )}
          <span className={depth === 0 ? "font-bold text-blue-900" : ""}>{category.name}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{category.slug}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
          {category.wpId ? <span className="bg-gray-100 px-2 py-1 rounded">WP: {category.wpId}</span> : "—"}
        </td>
      </tr>
      {category.children && category.children.length > 0 && (
        category.children.map((child) => (
          <CategoryRow key={child.id} category={child} depth={depth + 1} />
        ))
      )}
    </>
  );
}

export default async function CategoriesPage() {
  const categoryTree = await getCategoryTree();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Рубрики</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Добавить новую рубрику</h2>
        <form action={async (formData) => {
          "use server";
          await createCategory(formData);
        }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Название рубрики
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Например, Музеи"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Добавить
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Иерархия рубрик</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">WordPress ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryTree.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Нет добавленных рубрик
                  </td>
                </tr>
              ) : (
                categoryTree.map((cat: any) => (
                  <CategoryRow key={cat.id} category={cat as any} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
