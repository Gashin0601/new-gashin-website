"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Simulate loading time (e.g., 3.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasLoaded", "true");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black"
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

            {/* Skip Button (Accessibility) */}
            <button
              onClick={() => {
                setIsLoading(false);
                sessionStorage.setItem("hasLoaded", "true");
              }}
              className="mt-8 text-sm text-gray-500 hover:text-black underline focus:outline-none focus:ring-2 focus:ring-black rounded p-1"
            >
              Skip Loading
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
