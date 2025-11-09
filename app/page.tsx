'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HamburgerButton } from '@/components/HamburgerButton';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { VideoCarousel } from '@/components/VideoCarousel';
import { NewsCarousel } from '@/components/NewsCarousel';
import { SocialAccount } from '@/components/SocialAccount';
import videosData from '@/data/videos.json';
import newsData from '@/data/news.json';
import socialsData from '@/data/socials.json';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerButton onClick={() => setMenuOpen(true)} isOpen={menuOpen} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Profile Image Placeholder */}
            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-[var(--border-color)]" />

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              我を信じて、世界をほどく。
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl mx-auto">
              慶應SFCの学生。視覚とテクノロジーで、学びと社会の垣根をゆるめる実験をしています。動画と文章で日々を記録。
            </p>

            <Link
              href="/story"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold text-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              ストーリーを見る
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Video Account Section */}
        <section className="py-20 px-6 bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto">
            <SocialAccount
              name={socialsData.videoAccount.name}
              handle={socialsData.videoAccount.handle}
              profileImage={socialsData.videoAccount.profileImage}
              description={socialsData.videoAccount.description}
              platforms={socialsData.videoAccount.platforms}
            />

            {/* Video Carousel */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 text-center">ショート動画</h2>
              <VideoCarousel videos={videosData} />
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">メディア掲載</h2>
            <NewsCarousel news={newsData} />
          </div>
        </section>

        {/* Daily Account Section */}
        <section className="py-20 px-6 bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">日常アカウント</h2>
            <SocialAccount
              name={socialsData.dailyAccount.name}
              handle={socialsData.dailyAccount.handle}
              profileImage={socialsData.dailyAccount.profileImage}
              description={socialsData.dailyAccount.description}
              platforms={socialsData.dailyAccount.platforms}
              instagramEmbed={socialsData.dailyAccount.instagramEmbed}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center text-[var(--text-secondary)]">
          <p>&copy; {new Date().getFullYear()} 鈴木我信 / Gashin Suzuki. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
