"use client";

import { motion } from "framer-motion";

interface StoryChapterProps {
    data: any;
    index: number;
}

export default function StoryChapter({ data, index }: StoryChapterProps) {
    const isEven = index % 2 === 0;
    const isFull = data.layout === "full";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-20 md:mb-32 max-w-3xl mx-auto"
        >
            {/* Content */}
            <div className="text-center">
                <div className="mb-8">
                    <span className="text-sm font-mono text-gray-400 block mb-3 tracking-widest">{data.year}</span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-wide">{data.title}</h2>
                    <p className="text-gray-300 leading-loose whitespace-pre-wrap text-base md:text-lg text-left font-light tracking-wide">
                        {data.body}
                    </p>
                </div>

                {data.ctaButton && (
                    <a
                        href={data.ctaButton.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        {data.ctaButton.label}
                    </a>
                )}
            </div>
        </motion.div>
    );
}
