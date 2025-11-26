import Link from 'next/link';
import Image from 'next/image';
import newsData from '@/data/news.json';

export default function NewsPage() {
  // Sort news by date (newest first)
  const sortedNews = [...newsData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main
      className="min-h-screen px-6 py-20 pt-24 bg-white"
      aria-label="メディア掲載一覧ページ"
    >
      <div className="max-w-4xl mx-auto">
        <header>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">メディア掲載</h1>
          <p className="text-gray-600 mb-12">
            {newsData.length}件の掲載記事
          </p>
        </header>

        <div
          className="space-y-6"
          role="list"
          aria-label="メディア掲載記事一覧"
        >
          {sortedNews.map((item, index) => (
            <article
              key={item.slug}
              role="listitem"
              aria-label={`記事${index + 1}: ${item.title}`}
            >
              <Link
                href={`/news/${item.slug}`}
                className="block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                aria-label={`${item.title}の記事を読む - ${item.source}、${new Date(item.date).toLocaleDateString('ja-JP')}`}
              >
                <div className="flex gap-4 p-6">
                  {/* Image */}
                  {item.image && (
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        aria-hidden="true"
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
                      <span aria-hidden="true">•</span>
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
            </article>
          ))}
        </div>

        <nav className="text-center mt-12" aria-label="ページナビゲーション">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
            aria-label="トップページに戻る"
          >
            トップに戻る
          </Link>
        </nav>
      </div>
    </main>
  );
}
