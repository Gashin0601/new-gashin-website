"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX, Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
    const [audioEnabled, setAudioEnabled] = useState(false);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme("system");
        }

        const savedAudio = localStorage.getItem("audioEnabled");
        if (savedAudio === "true") {
            setAudioEnabled(true);
        }
    }, []);

    const applyTheme = (newTheme: "light" | "dark" | "system") => {
        const root = document.documentElement;
        if (newTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.setAttribute("data-theme", systemTheme);
        } else {
            root.setAttribute("data-theme", newTheme);
        }
    };

    const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    };

    const toggleAudio = () => {
        const newState = !audioEnabled;
        setAudioEnabled(newState);
        localStorage.setItem("audioEnabled", String(newState));
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            {/* Compact Header Bar */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6">
                {/* Logo */}
                <Link href="/">
                    <img src="/logo-handwritten-horizontal-cropped.png" alt="Gashin Suzuki" className="w-24 sm:w-28 md:w-36 lg:w-40" />
                </Link>

                {/* Hamburger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
                    aria-label="Open Menu"
                >
                    <Menu size={20} className="sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Fullscreen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Close Menu"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-12">
                            {/* Navigation Links */}
                            <nav className="flex flex-col items-center space-y-8 text-2xl font-light tracking-wider">
                                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    TOP
                                </Link>
                                <Link href="/story" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    STORY
                                </Link>
                                <Link href="/news" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    NEWS
                                </Link>
                            </nav>

                            {/* Settings */}
                            <div className="w-full max-w-xs space-y-8 pt-12 border-t border-gray-200 dark:border-gray-800">
                                {/* Audio Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">音声読み上げ</span>
                                    <button
                                        onClick={toggleAudio}
                                        aria-label={audioEnabled ? "音声読み上げをオフにする" : "音声読み上げをオンにする"}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${audioEnabled ? "bg-[var(--accent)] text-white" : "bg-gray-200 dark:bg-gray-800"
                                            }`}
                                    >
                                        {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                        <span className="text-sm font-medium">{audioEnabled ? "ON" : "OFF"}</span>
                                    </button>
                                </div>

                                {/* Theme Toggle */}
                                <div className="space-y-2">
                                    <span className="text-sm text-gray-500 block mb-2">カラーテーマ</span>
                                    <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1" role="group" aria-label="カラーテーマ選択">
                                        <button
                                            onClick={() => handleThemeChange("light")}
                                            aria-label="ライトモードに切り替え"
                                            aria-pressed={theme === "light"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "light" ? "bg-white shadow-sm text-black" : "text-gray-400"
                                                }`}
                                        >
                                            <Sun size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleThemeChange("system")}
                                            aria-label="システム設定に合わせる"
                                            aria-pressed={theme === "system"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "system" ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-gray-400"
                                                }`}
                                        >
                                            <Monitor size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleThemeChange("dark")}
                                            aria-label="ダークモードに切り替え"
                                            aria-pressed={theme === "dark"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 shadow-sm text-white" : "text-gray-400"
                                                }`}
                                        >
                                            <Moon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
