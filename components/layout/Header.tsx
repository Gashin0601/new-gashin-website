"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Story page has dark background, so use white button
    const isStoryPage = pathname === "/story";

    return (
        <>
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
                    className={`p-2 rounded-full backdrop-blur-md shadow-lg hover:scale-105 transition-transform ${
                        isStoryPage
                            ? "bg-white/80 text-black"
                            : "bg-black/80 text-white"
                    }`}
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
                        className="fixed inset-0 z-50 bg-white flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="メインメニュー"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-black"
                                aria-label="メニューを閉じる"
                            >
                                <X size={32} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex-1 flex flex-col justify-center items-center p-8">
                            {/* Navigation Links */}
                            <nav
                                className="flex flex-col items-center space-y-8 text-2xl font-light tracking-wider text-black"
                                aria-label="メインナビゲーション"
                            >
                                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-gray-600 transition-colors">
                                    TOP
                                    <span className="sr-only">（トップページへ）</span>
                                </Link>
                                <Link href="/story" onClick={() => setIsOpen(false)} className="hover:text-gray-600 transition-colors">
                                    STORY
                                    <span className="sr-only">（ストーリーページへ）</span>
                                </Link>
                                <Link href="/news" onClick={() => setIsOpen(false)} className="hover:text-gray-600 transition-colors">
                                    NEWS
                                    <span className="sr-only">（ニュースページへ）</span>
                                </Link>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
        </>
    );
}
