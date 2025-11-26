"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import videosData from "@/data/videos.json";

// Preload video function
function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = src;
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    // iOS Safari requires setAttribute for playsinline to work properly
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.crossOrigin = 'anonymous';

    const handleReady = () => {
      resolve();
    };

    video.oncanplaythrough = handleReady;
    video.onerror = handleReady; // Resolve even on error to not block loading
    video.load();

    // Timeout fallback
    setTimeout(handleReady, 5000);
  });
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Preload all videos
    const preloadAllVideos = async () => {
      const totalVideos = videosData.length;
      let loadedCount = 0;

      const promises = videosData.map(async (video) => {
        await preloadVideo(video.videoSrc);
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalVideos) * 100));
      });

      await Promise.all(promises);

      // Minimum display time of 2 seconds
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
      sessionStorage.setItem("hasLoaded", "true");
    };

    preloadAllVideos();
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

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center bg-white text-black"
          style={{ minHeight: '100vh', minWidth: '100vw' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Logo Container */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Handwritten Logo */}
                <img src="/logo-handwritten.png" alt="Gashin Logo" className="w-full h-full object-contain invert" />
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
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
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
            >
              Skip Loading
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
