import Link from 'next/link';
import Image from 'next/image';
import newsData from '@/data/news.json';

export function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = newsData.find((item) => item.slug === slug);

  if (!newsItem) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">記事が見つかりません</h1>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            ニュース一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 pt-24">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{newsItem.title}</h1>
          <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-6">
            <span className="font-semibold">{newsItem.source}</span>
            <span>•</span>
            <time dateTime={newsItem.date}>
              {new Date(newsItem.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Featured Image */}
        {newsItem.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <Image
              src={newsItem.image}
              alt={newsItem.title}
              width={800}
              height={450}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Summary */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-xl leading-relaxed">{newsItem.summary}</p>
        </div>

        {/* External Link */}
        <div className="mb-8">
          <a
            href={newsItem.externalUrl}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            記事を読む
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 10h10M10 5l5 5-5 5" />
            </svg>
          </a>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-8 border-t border-[var(--border-color)]">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
          >
            ニュース一覧
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
