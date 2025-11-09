'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    // Trigger grayscale to color transition after page load
    const timer = setTimeout(() => {
      setHeroLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerButton onClick={() => setMenuOpen(true)} isOpen={menuOpen} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="min-h-screen">
        {/* Hero Section with Grayscale to Color Transition */}
        <section
          className={`min-h-screen flex items-center justify-center px-6 py-20 transition-all duration-[2000ms] ease-out ${
            heroLoaded ? 'grayscale-0' : 'grayscale'
          }`}
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Large Portrait Image */}
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-12 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50">
              {socialsData.videoAccount.profileImage ? (
                <Image
                  src={socialsData.videoAccount.profileImage}
                  alt="鈴木我信のポートレート"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              我を信じて、<br />世界をほどく。
            </h1>

            <p className="text-2xl md:text-3xl text-[var(--text-secondary)] mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              慶應SFCの学生。視覚とテクノロジーで、<br className="hidden md:block" />
              学びと社会の垣根をゆるめる実験をしています。<br />
              動画と文章で日々を記録。
            </p>

            <Link
              href="/story"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-full font-semibold text-xl hover:bg-[var(--accent-hover)] hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              ストーリーを見る
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Video Account Section */}
        <section className="py-32 px-6 bg-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center">動画投稿</h2>

            <div className="mb-16">
              <SocialAccount
                name={socialsData.videoAccount.name}
                handle={socialsData.videoAccount.handle}
                profileImage={socialsData.videoAccount.profileImage}
                description={socialsData.videoAccount.description}
                platforms={socialsData.videoAccount.platforms}
              />
            </div>

            {/* Video Carousel */}
            <div className="mt-20">
              <h3 className="text-4xl font-bold mb-12 text-center">ショート動画</h3>
              <VideoCarousel videos={videosData} />
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-32 px-6 bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center">メディア掲載</h2>
            <NewsCarousel news={newsData} />
          </div>
        </section>

        {/* Daily Account Section */}
        <section className="py-32 px-6 bg-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center">日常アカウント</h2>
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
        <footer className="py-16 px-6 text-center text-[var(--text-secondary)] border-t border-[var(--border-color)]">
          <p className="text-lg">&copy; {new Date().getFullYear()} 鈴木我信 / Gashin Suzuki. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
