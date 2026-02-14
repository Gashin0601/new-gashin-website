"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] pb-16 md:pb-20"
            aria-label="鈴木我信の紹介"
        >
            {/* Content Container */}
            <div className="relative z-10 max-w-6xl w-full px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center pt-24 sm:pt-36 md:pt-24">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-6 sm:space-y-8"
                >
                    {/*
                        aria-label ensures screen readers read this as one cohesive phrase
                        The visual <br> is hidden from screen readers with aria-hidden
                    */}
                    <p
                        className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-[var(--text-primary)]"
                        aria-label="我を信じて突き進む。"
                    >
                        我を信じて<br aria-hidden="true" />
                        突き進む。
                    </p>

                    {/*
                        Profile description - grouped as one readable block for screen readers
                        Visual line breaks are hidden from assistive technology
                    */}
                    <div
                        className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-md"
                    >
                        <p>
                            慶應義塾大学 環境情報学部 1年。
                        </p>
                        <p>
                            生まれつきの視覚障害（弱視）で、<br aria-hidden="true" />
                            SNSでの発信やアプリ開発を通して、<br aria-hidden="true" />
                            障害を強みに変えるために活動中。
                        </p>
                    </div>

                    {/* ストーリーボタン - 一時的にコメントアウト
                    <div className="pt-2 sm:pt-4">
                        <Link
                            href="/story"
                            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm sm:text-base rounded-full hover:opacity-80 transition-all hover:gap-4 shadow-lg"
                            aria-label="鈴木我信のストーリーを見る"
                        >
                            <span>ストーリーを見る</span>
                            <ArrowRight size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                        </Link>
                    </div>
                    */}
                </motion.div>

                {/* Portrait Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative w-full max-w-md mx-auto"
                >
                    <Image
                        src="/images/profile/profile.png"
                        alt="鈴木我信のポートレート写真"
                        width={500}
                        height={600}
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </motion.div>
            </div>
        </section>
    );
}
