import { getPages, publishContent } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Страницы</h1>
          <p className="text-sm text-gray-500 mt-1">Информационные страницы сайта из WordPress</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Фото</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Страницы не найдены</td>
                </tr>
              ) : (
                pages.map((page: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {page.featuredImage && (
                          <img src={page.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{page.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{page.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {page.featuredImage ? "📷" : "—"} {page.gallery ? "🖼" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          page.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {page.status === "PUBLISHED" ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <a href={`/page/${page.slug}`} className="text-blue-600 hover:text-blue-800" target="_blank">Просмотр</a>
                      {page.status === "PENDING" && (
                        <form className="inline" action={async () => {
                          "use server";
                          await publishContent(page.id);
                        }}>
                          <button type="submit" className="text-green-600 hover:text-green-800 ml-2">Опубликовать</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-gray-400 text-right">Всего страниц: {pages.length}</p>
    </div>
  );
}
