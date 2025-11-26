"use client";

import { motion } from "framer-motion";

interface StoryChapterProps {
    data: any;
    index: number;
    totalChapters?: number;
}

export default function StoryChapter({ data, index, totalChapters }: StoryChapterProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-20 md:mb-32 max-w-3xl mx-auto"
            role="listitem"
            aria-label={`第${index + 1}章${totalChapters ? ` / 全${totalChapters}章` : ''}: ${data.title}（${data.year}）`}
        >
            {/* Content */}
            <div className="text-center">
                <header className="mb-8">
                    <time
                        className="text-sm font-mono text-gray-400 block mb-3 tracking-widest"
                        dateTime={data.year}
                    >
                        {data.year}
                    </time>
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 tracking-wide">
                        {data.title}
                    </h3>
                </header>
                <div
                    className="text-gray-300 leading-loose whitespace-pre-wrap text-base md:text-lg text-left font-light tracking-wide"
                    role="paragraph"
                >
                    {data.body}
                </div>

                {data.ctaButton && (
                    <a
                        href={data.ctaButton.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                        aria-label={`${data.ctaButton.label}（新しいタブで開きます）`}
                    >
                        {data.ctaButton.label}
                    </a>
                )}
            </div>
        </motion.article>
    );
}
