"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import newsData from "@/data/news.json";

export default function MediaSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel if more than 3 items
    useEffect(() => {
        if (newsData.length <= 3) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % newsData.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">ニュース</h2>
                    <Link
                        href="/news"
                        className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                        すべて見る <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {newsData
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 3)
                        .map((news, index) => (
                            <motion.article
                                key={news.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/news/${news.slug}`}>
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-4 relative w-full">
                                        <Image
                                            src={news.image || "/images/news/placeholder.png"}
                                            alt={news.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                            <span>{news.source}</span>
                                            <span>•</span>
                                            <span>{news.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-[var(--accent)] transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] line-clamp-2 text-sm">
                                            {news.summary}
                                        </p>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                </div>
            </div>
        </section>
    );
}
