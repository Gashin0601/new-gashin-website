"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import videosData from "@/data/videos.json";
import { preloadAllVideos, isVideoPreloaded } from "@/lib/videoPreloader";

export default function LoadingScreen() {
  // Start with false for SSR - crawlers will see actual content
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Mark as mounted (client-side only)
    setMounted(true);

    // Check if we've already shown the loading screen in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    // Always preload videos (in background if already loaded before)
    const preloadInBackground = () => {
      // Check if videos are already preloaded
      const allPreloaded = videosData.every(v => isVideoPreloaded(v.videoSrc));
      if (!allPreloaded) {
        // Preload without blocking - no progress callback needed
        preloadAllVideos(videosData);
      }
    };

    if (hasLoaded) {
      // Skip loading screen but still preload videos in background
      setIsLoading(false);
      preloadInBackground();
      return;
    }

    // First visit: show loading screen with progress
    setIsLoading(true);

    const loadVideos = async () => {
      await preloadAllVideos(videosData, (loaded, total) => {
        setLoadingProgress(Math.round((loaded / total) * 100));
      });

      // Minimum display time
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
      sessionStorage.setItem("hasLoaded", "true");
    };

    loadVideos();
  }, []);

  // Prevent scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // Don't render anything on server - crawlers will see actual page content
  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          role="alert"
          aria-live="polite"
          aria-label={`ページを読み込み中、${loadingProgress}パーセント完了`}
        >
          <div className="flex flex-col items-center">
            {/* Logo Container */}
            <div
              className="relative w-48 h-48 mb-8 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <img
                  src="/logo-handwritten.png"
                  alt="鈴木我信のロゴ"
                  className="w-full h-full object-contain invert"
                />
              </motion.div>
            </div>

            {/* Text */}
            <motion.h1
              className="text-xl font-tracking-widest font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              SUZUKI GASHIN
            </motion.h1>

            {/* Loading Progress */}
            <motion.div
              className="mt-6 w-48"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div
                className="h-1 bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={loadingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="読み込み進捗"
              >
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center" aria-hidden="true">
                Loading... {loadingProgress}%
              </p>
            </motion.div>

            {/* Skip Button (Accessibility) */}
            <button
              onClick={() => {
                setIsLoading(false);
                sessionStorage.setItem("hasLoaded", "true");
              }}
              className="mt-6 text-sm text-gray-500 hover:text-black underline focus:outline-none focus:ring-2 focus:ring-black rounded p-1"
              aria-label="読み込みをスキップしてメインコンテンツへ移動"
            >
              Skip Loading
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
