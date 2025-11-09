'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  externalUrl: string;
  ogpImageFetch: boolean;
  image: string | null;
  imageAlt: string;
}

interface NewsCarouselProps {
  news: NewsItem[];
  autoPlayInterval?: number;
}

export function NewsCarousel({ news, autoPlayInterval = 5000 }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const shouldShowCarousel = news.length >= 4;

  const currentNews = news[currentIndex];
  const prevNews = shouldShowCarousel ? news[(currentIndex - 1 + news.length) % news.length] : null;
  const nextNews = shouldShowCarousel ? news[(currentIndex + 1) % news.length] : null;

  // Auto-advance carousel (only if 4+ items)
  useEffect(() => {
    if (!shouldShowCarousel) return;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, autoPlayInterval);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, news.length, shouldShowCarousel, autoPlayInterval]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        ニュースがありません
      </div>
    );
  }

  // Show all items if less than 4
  if (!shouldShowCarousel) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.slug} news={item} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            さらに見る
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
          </Link>
        </div>
      </div>
    );
  }

  // Carousel view (4+ items)
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Carousel Container */}
      <div className="relative min-h-[300px]">
        {/* Previous News (Glassmorphism) */}
        {prevNews && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 z-0 cursor-pointer"
            style={{
              width: '80%',
              opacity: 0.3,
              transform: 'translateY(-50%) translateX(-25%) scale(0.95)',
              filter: 'blur(3px)',
            }}
            onClick={goToPrev}
          >
            <NewsCard news={prevNews} isBlurred />
          </div>
        )}

        {/* Current News */}
        <div className="relative z-10">
          <NewsCard news={currentNews} />
        </div>

        {/* Next News (Glassmorphism) */}
        {nextNews && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 z-0 cursor-pointer"
            style={{
              width: '80%',
              opacity: 0.3,
              transform: 'translateY(-50%) translateX(25%) scale(0.95)',
              filter: 'blur(3px)',
            }}
            onClick={goToNext}
          >
            <NewsCard news={nextNews} isBlurred />
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-[var(--accent)] w-8'
                : 'bg-[var(--border-color)] hover:bg-[var(--text-secondary)]'
            }`}
            aria-label={`ニュース ${index + 1} に移動`}
          />
        ))}
      </div>

      {/* More News Link */}
      <div className="text-center mt-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          さらに見る
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
        </Link>
      </div>
    </div>
  );
}

function NewsCard({ news, isBlurred = false }: { news: NewsItem; isBlurred?: boolean }) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className={`block bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
        isBlurred ? 'pointer-events-none' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        {news.image && (
          <div className="flex-shrink-0 w-32 h-32 bg-[var(--border-color)] rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.imageAlt}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {news.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
            <span>{news.source}</span>
            <span>•</span>
            <time dateTime={news.date}>{new Date(news.date).toLocaleDateString('ja-JP')}</time>
          </div>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
            {news.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
