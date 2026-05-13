import { getTags } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Метки</h1>
        <span className="text-sm text-gray-500">{tags.length} меток в базе</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">WordPress ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Нет добавленных меток
                  </td>
                </tr>
              ) : (
                tags.map((tag: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{tag.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {tag.wpId ? <span className="bg-gray-100 px-2 py-1 rounded">WP: {tag.wpId}</span> : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
