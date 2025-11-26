import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import newsData from '@/data/news.json';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';

const baseUrl = 'https://gashinsuzuki.com';

export function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = newsData.find((item) => item.slug === slug);

  if (!newsItem) {
    return {
      title: '記事が見つかりません',
    };
  }

  return {
    title: newsItem.title,
    description: newsItem.summary,
    openGraph: {
      title: `${newsItem.title} | 鈴木我信`,
      description: newsItem.summary,
      url: `${baseUrl}/news/${newsItem.slug}`,
      type: 'article',
      publishedTime: newsItem.date,
      authors: ['鈴木我信'],
      images: newsItem.image
        ? [
            {
              url: newsItem.image,
              width: 800,
              height: 450,
              alt: newsItem.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${newsItem.title} | 鈴木我信`,
      description: newsItem.summary,
      images: newsItem.image ? [newsItem.image] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/news/${newsItem.slug}`,
    },
  };
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
    <>
      <ArticleJsonLd
        title={newsItem.title}
        description={newsItem.summary}
        url={`${baseUrl}/news/${newsItem.slug}`}
        image={newsItem.image}
        datePublished={newsItem.date}
      />
      <main
        className="min-h-screen px-6 py-20 pt-24 bg-white"
        aria-label={`${newsItem.title}の記事詳細ページ`}
      >
        <article
          className="max-w-3xl mx-auto"
          aria-label={newsItem.title}
        >
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{newsItem.title}</h1>
            <div className="flex items-center gap-3 text-gray-500 mb-6">
              <span className="font-semibold">{newsItem.source}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={newsItem.date}>
                {new Date(newsItem.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </header>

          {/* Featured Image */}
          {newsItem.image && (
            <figure className="mb-8 rounded-xl overflow-hidden">
              <Image
                src={newsItem.image}
                alt=""
                width={800}
                height={450}
                className="w-full h-auto"
                aria-hidden="true"
              />
              <figcaption className="sr-only">{newsItem.title}のサムネイル画像</figcaption>
            </figure>
          )}

          {/* Summary */}
          <section className="prose prose-lg max-w-none mb-8" aria-label="記事概要">
            <p className="text-xl leading-relaxed text-gray-700">{newsItem.summary}</p>
          </section>

          {/* External Link - Hyperlink style */}
          <div className="mb-8">
            <a
              href={newsItem.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-lg"
              aria-label={`${linkText}（新しいタブで開きます）`}
            >
              {linkText}
              <ExternalLink size={18} aria-hidden="true" />
            </a>
          </div>

          {/* Navigation */}
          <nav
            className="flex gap-4 pt-8 border-t border-gray-200"
            aria-label="ページナビゲーション"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
              aria-label="ニュース一覧ページへ"
            >
              ニュース一覧
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
              aria-label="トップページに戻る"
            >
              トップに戻る
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
