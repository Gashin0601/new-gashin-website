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
      className="min-h-screen px-6 py-20 pt-24 bg-[var(--bg-primary)]"
      aria-label="ニュース一覧ページ"
    >
      <div className="max-w-4xl mx-auto">
        <header>
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">ニュース</h1>
          <p className="text-[var(--text-secondary)] mb-12">
            {newsData.length}件の掲載記事
          </p>
        </header>

        <div
          className="space-y-6"
          role="list"
          aria-label="ニュース記事一覧"
        >
          {sortedNews.map((item, index) => (
            <article
              key={item.slug}
              role="listitem"
              aria-label={`記事${index + 1}: ${item.title}`}
            >
              <Link
                href={`/news/${item.slug}`}
                className="block bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                aria-label={`${item.title}の記事を読む - ${item.source}、${new Date(item.date).toLocaleDateString('ja-JP')}`}
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                  {/* Image */}
                  {item.image && (
                    <div className="flex-shrink-0 w-full sm:w-48 md:w-56 aspect-video bg-[var(--border-color)] rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.title} - ${item.source}`}
                        width={224}
                        height={126}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-xl mb-2 line-clamp-2 text-[var(--text-primary)]">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                      <span>{item.source}</span>
                      <span aria-hidden="true">•</span>
                      <time dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-3">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
            aria-label="トップページに戻る"
          >
            トップに戻る
          </Link>
        </nav>
      </div>
    </main>
  );
}
