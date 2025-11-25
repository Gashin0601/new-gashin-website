"use client";

import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import SocialLink from "../ui/SocialLinks";
import videosData from "@/data/videos.json";

function VideoPlayer({ src, isCurrent }: { src: string; isCurrent: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isCurrent) {
                videoRef.current.play().catch(() => {
                    // Handle autoplay restriction
                });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset time
            }
        }
    }, [isCurrent]);

    return (
        <video
            ref={videoRef}
            src={src}
            className={`w-full h-full object-cover ${!isCurrent ? "opacity-60" : ""}`}
            muted
            loop
            playsInline
        />
    );
}

export default function VideoAccount() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-advance carousel
    useEffect(() => {
        if (isHovered) return;

        const nextSlide = () => {
            setCurrentIndex((prev) => (prev + 1) % videosData.length);
        };

        timeoutRef.current = setInterval(nextSlide, 10000); // 10 seconds

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [isHovered]);

    const currentVideo = videosData[currentIndex];
    const prevIndex = (currentIndex - 1 + videosData.length) % videosData.length;
    const nextIndex = (currentIndex + 1) % videosData.length;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                {/* Account Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-2 border-white/10">
                        <Image
                            src="/images/profile/gashin_lv.jpeg"
                            alt="Gashin"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Gashin / 弱視慶應生</h2>
                    <p className="text-sm text-gray-400 font-mono -mt-4">@gashin_lv</p>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        視覚障害について、日々の学び、そして慶應SFCでの挑戦を動画で発信しています。
                    </p>

                    <div className="flex justify-center gap-6">
                        <SocialLink platform="youtube" url="https://youtube.com/@gashin_lv" className="text-[var(--sns-youtube)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="tiktok" url="https://www.tiktok.com/@gashin_lv" className="text-[var(--sns-tiktok)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="instagram" url="https://instagram.com/gashin_lv" className="text-[var(--sns-instagram)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="x" url="https://x.com/gashin_lv" className="text-[var(--sns-x)] hover:scale-110" iconSize={32} />
                    </div>
                </div>


                {/* Carousel Container - Temporarily Hidden */}
                {/* 
                <div
                    className="relative h-[600px] flex items-center justify-center perspective-1000"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence initial={false} mode="popLayout">
                        {videosData.map((video, index) => {
                            // Calculate offset from current index
                            // Handle wrapping: -1 (prev), 0 (current), 1 (next)
                            let offset = (index - currentIndex + videosData.length) % videosData.length;
                            if (offset > videosData.length / 2) offset -= videosData.length;

                            // Only render if it's current, prev, or next
                            if (Math.abs(offset) > 1) return null;

                            const isCurrent = offset === 0;
                            const isPrev = offset === -1;
                            const isNext = offset === 1;

                            return (
                                <motion.div
                                    key={video.id}
                                    layout
                                    className={`absolute rounded-3xl overflow-hidden transition-all duration-500 ease-in-out
                                        ${isCurrent ? "z-20 shadow-2xl border border-gray-800" : "z-10 opacity-40 cursor-pointer glass"}
                                    `}
                                    initial={{
                                        scale: 0.9,
                                        x: offset * 100 + "%",
                                        opacity: 0
                                    }}
                                    animate={{
                                        scale: isCurrent ? 1 : 0.9,
                                        x: isCurrent ? 0 : isPrev ? -380 : 380,
                                        opacity: isCurrent ? 1 : 0.4,
                                        zIndex: isCurrent ? 20 : 10,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        mass: 0.8
                                    }}
                                    style={{
                                        width: isCurrent ? "min(340px, 85vw)" : "min(280px, 70vw)",
                                        height: isCurrent ? "min(600px, 75vh)" : "min(500px, 65vh)",
                                    }}
                                    onClick={() => {
                                        if (isPrev) setCurrentIndex(prevIndex);
                                        if (isNext) setCurrentIndex(nextIndex);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${video.title} ${isCurrent ? "(再生中)" : isPrev ? "(前の動画)" : "(次の動画)"}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            if (isPrev) setCurrentIndex(prevIndex);
                                            if (isNext) setCurrentIndex(nextIndex);
                                        }
                                    }}
                                >
                                    <div className="w-full h-full bg-black relative group">
                                        <VideoPlayer src={video.videoSrc} isCurrent={isCurrent} />

                                        {isCurrent && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 pointer-events-none">
                                                    <h3 className="font-bold text-xl mb-1">{video.title}</h3>
                                                    <p className="text-sm opacity-80">{video.date}</p>
                                                </div>

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-30">
                                                    <div className="flex gap-4">
                                                        {Object.entries(video.socialLinks).map(([platform, url]) => (
                                                            <SocialLink
                                                                key={platform}
                                                                platform={platform as any}
                                                                url={url}
                                                                className="text-white bg-black/80 p-3 rounded-full hover:bg-black hover:scale-110 transition-all"
                                                                iconSize={24}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                */}
            </div>
        </section>
    );
}
