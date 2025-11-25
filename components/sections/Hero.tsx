"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
            {/* Content Container */}
            <div className="relative z-10 max-w-7xl w-full px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 lg:gap-20 items-center pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-0 md:pb-0">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-8 sm:space-y-10 md:pr-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] tracking-tight text-black">
                        我を信じて<br />
                        突き進む。
                    </h1>

                    <div className="space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                        <p>
                            慶應義塾大学 環境情報学部 1年。
                        </p>
                        <p>
                            生まれつきの視覚障害（弱視）で、<br />
                            SNSでの発信やアプリ開発を通して、<br />
                            障害を強みに変えるために活動中。
                        </p>
                    </div>

                    <div className="pt-4 sm:pt-6">
                        <Link
                            href="/story"
                            className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 transition-all hover:gap-4 shadow-lg hover:shadow-xl"
                        >
                            ストーリーを見る
                            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                        </Link>
                    </div>
                </motion.div>

                {/* Portrait Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative w-full max-w-lg mx-auto md:mx-0 md:ml-auto"
                >
                    <Image
                        src="/images/profile/profile.png"
                        alt="Suzuki Gashin Portrait"
                        width={500}
                        height={600}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </motion.div>
            </div>
        </section>
    );
}
