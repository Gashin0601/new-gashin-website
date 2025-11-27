"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EyeOff } from "lucide-react";
import VisionSimulator from "./VisionSimulator";

interface InteractiveExperience {
    type: string;
    ctaText: string;
    features?: {
        panorama?: {
            sampleImage?: string;
        };
    };
}

interface StoryChapterProps {
    data: {
        chapter: number;
        year?: number | string;
        yearRange?: string;
        title: string;
        body: string;
        layout?: string;
        interactiveExperience?: InteractiveExperience;
        ctaButton?: {
            href: string;
            label: string;
        };
    };
    index: number;
    totalChapters?: number;
}

export default function StoryChapter({ data, index, totalChapters }: StoryChapterProps) {
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    const hasVisionSimulator = data.interactiveExperience?.type === "vision-simulator";

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-20 md:mb-32 max-w-3xl mx-auto"
                role="listitem"
                aria-label={`第${index + 1}章${totalChapters ? ` / 全${totalChapters}章` : ''}: ${data.title}（${data.year || data.yearRange}）`}
            >
                {/* Content */}
                <div className="text-center">
                    <header className="mb-8">
                        <time
                            className="text-sm font-mono text-[var(--text-secondary)] block mb-3 tracking-widest"
                            dateTime={String(data.year || data.yearRange)}
                        >
                            {data.yearRange || data.year}
                        </time>
                        <h3 className="text-2xl md:text-3xl font-bold mb-8 tracking-wide">
                            {data.title}
                        </h3>
                    </header>
                    <div
                        className="text-[var(--text-secondary)] leading-loose whitespace-pre-wrap text-base md:text-lg text-left font-light tracking-wide"
                        role="paragraph"
                    >
                        {data.body}
                    </div>

                    {/* Vision Simulator CTA Button */}
                    {hasVisionSimulator && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-10"
                        >
                            <button
                                onClick={() => setIsSimulatorOpen(true)}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                                aria-label={data.interactiveExperience?.ctaText || "私の見え方を体験する"}
                            >
                                <EyeOff size={24} />
                                <span>{data.interactiveExperience?.ctaText || "私の見え方を体験する"}</span>
                            </button>
                            <p className="text-sm text-[var(--text-secondary)] mt-3">
                                フルスクリーンで視覚体験シミュレーターが開きます
                            </p>
                        </motion.div>
                    )}

                    {/* Regular CTA Button */}
                    {data.ctaButton && (
                        <a
                            href={data.ctaButton.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-8 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-full font-bold hover:opacity-80 transition-colors"
                            aria-label={`${data.ctaButton.label}（新しいタブで開きます）`}
                        >
                            {data.ctaButton.label}
                        </a>
                    )}
                </div>
            </motion.article>

            {/* Vision Simulator Modal */}
            {hasVisionSimulator && (
                <VisionSimulator
                    isOpen={isSimulatorOpen}
                    onClose={() => setIsSimulatorOpen(false)}
                    sampleImage={data.interactiveExperience?.features?.panorama?.sampleImage}
                />
            )}
        </>
    );
}
