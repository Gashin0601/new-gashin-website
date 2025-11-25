import Link from 'next/link';
import Image from 'next/image';
import newsData from '@/data/news.json';

export default function NewsPage() {
  // Sort news by date (newest first)
  const sortedNews = [...newsData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen px-6 py-20 pt-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">メディア掲載</h1>
        <p className="text-gray-600 mb-12">
          {newsData.length}件の掲載記事
        </p>

        <div className="space-y-6">
          {sortedNews.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4 p-6">
                {/* Image */}
                {item.image && (
                  <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-xl mb-2 line-clamp-2 text-gray-900">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{item.source}</span>
                    <span>•</span>
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString('ja-JP')}
                    </time>
                  </div>
                  <p className="text-gray-600 line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
