import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
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
      <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">記事が見つかりません</h1>
          <Link
            href="/news"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ニュース一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  // Get link text based on type
  const linkText = newsItem.linkText || (newsItem.type === 'app' ? '公式サイトへ' : '記事を読む');

  return (
    <main className="min-h-screen px-6 py-20 pt-24 bg-white">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{newsItem.title}</h1>
          <div className="flex items-center gap-3 text-gray-500 mb-6">
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
          <p className="text-xl leading-relaxed text-gray-700">{newsItem.summary}</p>
        </div>

        {/* External Link - Hyperlink style */}
        <div className="mb-8">
          <a
            href={newsItem.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-lg"
          >
            {linkText}
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
          >
            ニュース一覧
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
