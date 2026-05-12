import Link from "next/link";
import { getPosts, publishContent } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = resolvedSearchParams.category || '';
  const allPosts = await getPosts();
  const posts = categoryFilter ? allPosts.filter(p => p.category?.slug === categoryFilter || p.category?.id.toString() === categoryFilter) : allPosts;

  // Extract unique categories from posts for the filter dropdown
  const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean).map(c => JSON.stringify(c)))).map(c => JSON.parse(c));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Записи</h1>
          <p className="text-sm text-gray-500 mt-1">Локации, услуги, дома — весь контент из WordPress</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          Добавить запись
        </Link>
      </div>

      <div className="flex gap-2 mb-6 items-center">
        <span className="text-sm font-medium text-gray-700">Фильтр по рубрике:</span>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/posts" className={`px-3 py-1 text-xs rounded-full ${!categoryFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Все</Link>
          {categories.map((c: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => (
            <Link key={c.id} href={`/admin/posts?category=${c.id}`} className={`px-3 py-1 text-xs rounded-full ${categoryFilter === c.id.toString() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Рубрика</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Фото</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    <p className="text-gray-400 mb-2">Записи пока не добавлены</p>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <img src={post.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {post.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {post.featuredImage ? "📷" : "—"} {post.gallery ? "🖼" : ""} {post.videoUrl ? "🎬" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {post.status === "PUBLISHED" ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link href={`/post/${post.slug}`} className="text-blue-600 hover:text-blue-800" target="_blank">Просмотр</Link>
                      {post.status === "PENDING" && (
                        <form className="inline" action={async () => {
                          "use server";
                          await publishContent(post.id);
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
      <p className="text-sm text-gray-400 text-right">Всего записей: {posts.length}</p>
    </div>
  );
}
