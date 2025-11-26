"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { motion } from "framer-motion";
// import StoryTimeline from "@/components/story/StoryTimeline";
// import storyData from "@/data/story.json";

export default function StoryPage() {
    return (
        <main
            className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center"
            aria-label="鈴木我信のストーリーページ"
        >
            {/* 準備中メッセージ */}
            <div className="text-center px-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    現在、準備中です
                </h1>
                <p className="text-[var(--text-secondary)] mb-8">
                    Coming Soon...
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--border-color)]"
                    aria-label="トップページへ戻る"
                >
                    <ArrowLeft size={20} aria-hidden="true" />
                    <span>TOPへ戻る</span>
                </Link>
            </div>

            {/*
            === 以下、元のコンテンツ（コメントアウト） ===

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0 }}
            >
                <nav className="fixed bottom-8 right-8 z-40" aria-label="ページナビゲーション">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--border-color)]"
                        aria-label="トップページへ戻る"
                    >
                        <ArrowLeft size={20} aria-hidden="true" />
                        <span>TOPへ戻る</span>
                    </Link>
                </nav>

                <header className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-8 tracking-tight"
                        aria-label="弱視というレンズを通して"
                    >
                        <span aria-hidden="true">
                            弱視という<br className="md:hidden" />レンズを通して
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto"
                        aria-label="私の世界は、少しだけ他の人とは違って見えています。生まれつきの弱視。それが私の「普通」でした。"
                    >
                        <span aria-hidden="true">
                            私の世界は、少しだけ他の人とは違って見えています。<br />
                            生まれつきの弱視。それが私の「普通」でした。
                        </span>
                    </motion.p>
                </header>

                <StoryTimeline timelineData={storyData.timeline} />

                <div className="py-20 text-center text-[var(--text-secondary)] text-sm">
                    <p>© 2025 Gashin Suzuki. All Rights Reserved.</p>
                </div>
            </motion.div>
            */}
        </main>
    );
}
