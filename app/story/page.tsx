"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StoryTimeline from "@/components/story/StoryTimeline";
import storyData from "@/data/story.json";

export default function StoryPage() {
    return (
        <main className="min-h-screen bg-[#0b0c10] text-white overflow-x-hidden">
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0 }}
            >
                {/* Back Link (Bottom Right) */}
                <div className="fixed bottom-8 right-8 z-40">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={20} />
                        TOPへ戻る
                    </Link>
                </div>

                {/* Hero Text */}
                <div className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-8 tracking-tight"
                    >
                        弱視という<br className="md:hidden" />レンズを通して
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
                    >
                        私の世界は、少しだけ他の人とは違って見えています。<br />
                        生まれつきの弱視。それが私の「普通」でした。
                    </motion.p>
                </div>

                {/* Timeline */}
                <StoryTimeline timelineData={storyData.timeline} />

                {/* Footer Area */}
                <div className="py-20 text-center text-gray-500 text-sm">
                    <p>© 2025 Gashin Suzuki. All Rights Reserved.</p>
                </div>
            </motion.div>
        </main>
    );
}
