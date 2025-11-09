'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  videoSrc: string;
  duration: number;
  aspectRatio: string;
  date: string;
  socialLinks: {
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    x?: string;
  };
  audioNarration: string;
}

interface VideoCarouselProps {
  videos: Video[];
  autoPlayInterval?: number;
}

export function VideoCarousel({ videos, autoPlayInterval = 10000 }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSocial, setShowSocial] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = videos[currentIndex];
  const prevVideo = videos[(currentIndex - 1 + videos.length) % videos.length];
  const nextVideo = videos[(currentIndex + 1) % videos.length];

  // Auto-advance carousel
  useEffect(() => {
    if (videos.length <= 1) return;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setShowSocial(false);
      }, autoPlayInterval);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, videos.length, autoPlayInterval]);

  // Play video when current index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, user interaction required
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  const handleVideoClick = () => {
    setShowSocial(!showSocial);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSocial(false);
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowSocial(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setShowSocial(false);
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        動画がありません
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Carousel Container */}
      <div className="relative h-[600px] overflow-hidden rounded-2xl">
        {/* Previous Video (Glassmorphism) */}
        {videos.length > 1 && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-0 cursor-pointer"
            style={{
              width: '45%',
              opacity: 0.4,
              transform: 'translateY(-50%) translateX(-50%) scale(0.8)',
              filter: 'blur(4px)',
            }}
            onClick={goToPrev}
          >
            <video
              src={prevVideo.videoSrc}
              className="w-full h-auto rounded-xl"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        )}

        {/* Current Video */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative w-full h-full max-w-sm">
            <video
              ref={videoRef}
              src={currentVideo.videoSrc}
              className="w-full h-full object-contain rounded-xl shadow-2xl cursor-pointer"
              autoPlay
              loop
              playsInline
              preload="metadata"
              onClick={handleVideoClick}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
              <h3 className="text-white font-semibold text-lg line-clamp-2">
                {currentVideo.title}
              </h3>
            </div>

            {/* Social Links Overlay */}
            {showSocial && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-xl fade-in"
                onClick={handleOverlayClick}
              >
                <div className="flex flex-col gap-4">
                  {currentVideo.socialLinks.youtube && (
                    <a
                      href={currentVideo.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                  )}
                  {currentVideo.socialLinks.tiktok && (
                    <a
                      href={currentVideo.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      TikTok
                    </a>
                  )}
                  {currentVideo.socialLinks.instagram && (
                    <a
                      href={currentVideo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {currentVideo.socialLinks.x && (
                    <a
                      href={currentVideo.socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Video (Glassmorphism) */}
        {videos.length > 1 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 cursor-pointer"
            style={{
              width: '45%',
              opacity: 0.4,
              transform: 'translateY(-50%) translateX(50%) scale(0.8)',
              filter: 'blur(4px)',
            }}
            onClick={goToNext}
          >
            <video
              src={nextVideo.videoSrc}
              className="w-full h-auto rounded-xl"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowSocial(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[var(--accent)] w-8'
                  : 'bg-[var(--border-color)] hover:bg-[var(--text-secondary)]'
              }`}
              aria-label={`動画 ${index + 1} に移動`}
            />
          ))}
        </div>
      )}

      {/* More Videos Link */}
      <div className="text-center mt-8">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          もっと見る
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
