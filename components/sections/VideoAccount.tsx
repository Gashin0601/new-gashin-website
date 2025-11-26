"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SocialLink from "../ui/SocialLinks";
import videosData from "@/data/videos.json";

// Dynamic import with no SSR to avoid hydration issues
const ReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
    )
});

function VideoPlayer({ src, isCurrent }: { src: string; isCurrent: boolean }) {
    const [isReady, setIsReady] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!isCurrent && playerRef.current) {
            const internalPlayer = playerRef.current.getInternalPlayer();
            if (internalPlayer) {
                internalPlayer.currentTime = 0;
            }
        }
    }, [isCurrent]);

    return (
        <div className="w-full h-full relative bg-black overflow-hidden">
            {(!isReady || isBuffering) && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            <div
                className={`w-full h-full transition-opacity duration-300 ${!isReady ? "opacity-0" : ""} ${!isCurrent ? "opacity-60" : ""}`}
                style={{ position: 'absolute', inset: 0 }}
            >
                <ReactPlayer
                    ref={playerRef}
                    url={src}
                    playing={isCurrent}
                    loop
                    muted
                    playsinline
                    width="100%"
                    height="100%"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '100%',
                        minHeight: '100%'
                    }}
                    onReady={() => setIsReady(true)}
                    onBuffer={() => setIsBuffering(true)}
                    onBufferEnd={() => setIsBuffering(false)}
                    config={{
                        file: {
                            attributes: {
                                style: { objectFit: 'cover', width: '100%', height: '100%' }
                            }
                        }
                    }}
                />
            </div>
        </div>
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

                {/* Carousel Container */}
                <div
                    className="relative h-[500px] sm:h-[550px] md:h-[600px] flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                        {videosData.map((video, index) => {
                            // Calculate offset from current index
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
                                    className={`absolute rounded-3xl overflow-hidden
                                        ${isCurrent ? "z-20 shadow-2xl ring-1 ring-black/10" : "z-10 opacity-50 cursor-pointer"}
                                    `}
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1 : 0.85,
                                        x: isCurrent ? 0 : isPrev ? "-55%" : "55%",
                                        opacity: isCurrent ? 1 : 0.5,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        mass: 1
                                    }}
                                    style={{
                                        width: isCurrent ? "min(300px, 75vw)" : "min(240px, 60vw)",
                                        height: isCurrent ? "min(530px, 70vh)" : "min(420px, 55vh)",
                                    }}
                                >
                                    <div className="w-full h-full bg-black relative group">
                                        <VideoPlayer src={video.videoSrc} isCurrent={isCurrent} />

                                        {/* Navigation overlay for side videos */}
                                        {!isCurrent && (
                                            <div
                                                className="absolute inset-0 z-40 cursor-pointer"
                                                onClick={() => setCurrentIndex(index)}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`${video.title} ${isPrev ? "(前の動画)" : "(次の動画)"}`}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        setCurrentIndex(index);
                                                    }
                                                }}
                                            />
                                        )}

                                        {isCurrent && (
                                            <>
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none z-10" />

                                                {/* Video info */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20 pointer-events-none">
                                                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
                                                </div>

                                                {/* Hover overlay with social links */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 pointer-events-auto">
                                                    <div className="flex gap-3">
                                                        {Object.entries(video.socialLinks).map(([platform, url]) => (
                                                            <SocialLink
                                                                key={platform}
                                                                platform={platform as "youtube" | "tiktok" | "instagram" | "x"}
                                                                url={url}
                                                                className="text-white bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 hover:scale-110 transition-all"
                                                                iconSize={22}
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
                </div>

                {/* Carousel indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {videosData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? "bg-gray-900 w-6"
                                : "bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`動画 ${index + 1} に移動`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
