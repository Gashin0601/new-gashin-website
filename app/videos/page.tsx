'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HamburgerButton } from '@/components/HamburgerButton';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import videosData from '@/data/videos.json';

export default function VideosPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerButton onClick={() => setMenuOpen(true)} isOpen={menuOpen} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        className="min-h-screen px-6 py-20"
        aria-label="動画一覧ページ"
      >
        <div className="max-w-6xl mx-auto">
          <header>
            <h1 className="text-4xl font-bold mb-4">すべての動画</h1>
            <p className="text-[var(--text-secondary)] mb-12">
              {videosData.length}件の動画
            </p>
          </header>

          <div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="動画リスト"
          >
            {videosData.map((video, index) => (
              <article
                key={video.id}
                className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                role="listitem"
                aria-label={`動画${index + 1}: ${video.title}`}
              >
                <video
                  src={video.videoSrc}
                  className="w-full aspect-[9/16] object-cover"
                  preload="metadata"
                  controls
                  aria-label={`${video.title}の動画プレーヤー`}
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h2>
                  <nav
                    className="flex flex-wrap gap-2 mt-3"
                    aria-label={`${video.title}のSNSリンク`}
                  >
                    {video.socialLinks.youtube && (
                      <a
                        href={video.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-[#FF0000] text-white rounded-full hover:opacity-90"
                        aria-label="YouTubeで見る（新しいタブで開きます）"
                      >
                        YouTube
                      </a>
                    )}
                    {video.socialLinks.tiktok && (
                      <a
                        href={video.socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-black text-white rounded-full hover:opacity-90"
                        aria-label="TikTokで見る（新しいタブで開きます）"
                      >
                        TikTok
                      </a>
                    )}
                    {video.socialLinks.instagram && (
                      <a
                        href={video.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full hover:opacity-90"
                        aria-label="Instagramで見る（新しいタブで開きます）"
                      >
                        Instagram
                      </a>
                    )}
                    {video.socialLinks.x && (
                      <a
                        href={video.socialLinks.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-black text-white rounded-full hover:opacity-90"
                        aria-label="X（Twitter）で見る（新しいタブで開きます）"
                      >
                        X
                      </a>
                    )}
                  </nav>
                </div>
              </article>
            ))}
          </div>

          <nav className="text-center mt-12" aria-label="ページナビゲーション">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
              aria-label="トップページに戻る"
            >
              トップに戻る
            </Link>
          </nav>
        </div>
      </main>
    </>
  );
}
