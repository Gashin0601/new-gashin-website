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

      <main className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">すべての動画</h1>
          <p className="text-[var(--text-secondary)] mb-12">
            {videosData.length}件の動画
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videosData.map((video) => (
              <div
                key={video.id}
                className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <video
                  src={video.videoSrc}
                  className="w-full aspect-[9/16] object-cover"
                  preload="metadata"
                  controls
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {video.socialLinks.youtube && (
                      <a
                        href={video.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 bg-[#FF0000] text-white rounded-full hover:opacity-90"
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
                      >
                        X
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
