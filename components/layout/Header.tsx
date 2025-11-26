"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX, Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const { theme, setTheme } = useTheme();

    // Initialize audio from localStorage
    useEffect(() => {
        const savedAudio = localStorage.getItem("audioEnabled");
        if (savedAudio === "true") {
            setAudioEnabled(true);
        }
    }, []);

    const toggleAudio = () => {
        const newState = !audioEnabled;
        setAudioEnabled(newState);
        localStorage.setItem("audioEnabled", String(newState));
        window.dispatchEvent(new CustomEvent("audioStateChange", { detail: { enabled: newState } }));
    };

    return (
        <>
            {/* Spacer to prevent content from being hidden behind fixed header */}
            <div
                className="h-[88px] sm:h-[112px] md:h-[144px]"
                aria-hidden="true"
            />
            <header
                className="fixed top-0 left-0 right-0 z-40"
                role="banner"
            >
                {/* Compact Header Bar */}
                <div className="flex items-center justify-between p-3 sm:p-4 md:p-6">
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="鈴木我信のホームページへ戻る"
                >
                    <img
                        src="/logo-handwritten-square.png"
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                        aria-hidden="true"
                    />
                </Link>

                {/* Hamburger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
                    aria-label="メニューを開く"
                    aria-expanded={isOpen}
                    aria-controls="main-menu"
                >
                    <Menu size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
                </button>
            </div>

            {/* Fullscreen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="main-menu"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="メインメニュー"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="メニューを閉じる"
                            >
                                <X size={32} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-12">
                            {/* Navigation Links */}
                            <nav
                                className="flex flex-col items-center space-y-8 text-2xl font-light tracking-wider"
                                aria-label="メインナビゲーション"
                            >
                                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    TOP
                                    <span className="sr-only">（トップページへ）</span>
                                </Link>
                                <Link href="/story" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    STORY
                                    <span className="sr-only">（ストーリーページへ）</span>
                                </Link>
                                <Link href="/news" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)] transition-colors">
                                    NEWS
                                    <span className="sr-only">（ニュースページへ）</span>
                                </Link>
                            </nav>

                            {/* Settings */}
                            <div
                                className="w-full max-w-xs space-y-8 pt-12 border-t border-gray-200 dark:border-gray-800"
                                role="group"
                                aria-label="サイト設定"
                            >
                                {/* Audio Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500" id="audio-toggle-label">音声読み上げ</span>
                                    <button
                                        onClick={toggleAudio}
                                        aria-labelledby="audio-toggle-label"
                                        aria-pressed={audioEnabled}
                                        role="switch"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${audioEnabled ? "bg-[var(--accent)] text-white" : "bg-gray-200 dark:bg-gray-800"
                                            }`}
                                    >
                                        {audioEnabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
                                        <span className="text-sm font-medium">{audioEnabled ? "ON" : "OFF"}</span>
                                    </button>
                                </div>

                                {/* Theme Toggle */}
                                <div className="space-y-2">
                                    <span className="text-sm text-gray-500 block mb-2" id="theme-group-label">カラーテーマ</span>
                                    <div
                                        className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1"
                                        role="radiogroup"
                                        aria-labelledby="theme-group-label"
                                    >
                                        <button
                                            onClick={() => setTheme("light")}
                                            aria-label="ライトモードに切り替え"
                                            role="radio"
                                            aria-checked={theme === "light"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "light" ? "bg-white shadow-sm text-black" : "text-gray-400"
                                                }`}
                                        >
                                            <Sun size={18} aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => setTheme("normal")}
                                            aria-label="通常モード"
                                            role="radio"
                                            aria-checked={theme === "normal"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "normal" ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-gray-400"
                                                }`}
                                        >
                                            <Monitor size={18} aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            aria-label="ダークモードに切り替え"
                                            role="radio"
                                            aria-checked={theme === "dark"}
                                            className={`flex-1 flex justify-center py-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 shadow-sm text-white" : "text-gray-400"
                                                }`}
                                        >
                                            <Moon size={18} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
        </>
    );
}
