"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SocialLink from "../ui/SocialLinks";
import videosData from "@/data/videos.json";

// Preload all videos on page load
const preloadedVideos: { [key: string]: HTMLVideoElement } = {};

function preloadVideo(src: string): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
        if (preloadedVideos[src]) {
            resolve(preloadedVideos[src]);
            return;
        }
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.oncanplaythrough = () => {
            preloadedVideos[src] = video;
            resolve(video);
        };
        video.onerror = () => resolve(video);
        video.load();
    });
}

function VideoPlayer({ src, isCurrent, isMuted, onUnmute }: { src: string; isCurrent: boolean; isMuted: boolean; onUnmute: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasFirstFrame, setHasFirstFrame] = useState(false);

    // Preload this video
    useEffect(() => {
        preloadVideo(src);
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedData = () => {
            setIsLoaded(true);
            setHasFirstFrame(true);
        };

        const handleLoadedMetadata = () => {
            setHasFirstFrame(true);
        };

        const handleCanPlay = () => {
            setIsLoaded(true);
            setHasFirstFrame(true);
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);

        // Force load
        video.load();

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = isMuted;
    }, [isMuted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isCurrent) {
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [isCurrent, isLoaded]);

    const handleClick = () => {
        if (isCurrent && isMuted) {
            onUnmute();
        }
    };

    return (
        <div className="w-full h-full relative bg-black overflow-hidden" onClick={handleClick}>
            {!hasFirstFrame && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            <video
                ref={videoRef}
                src={src}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${!isCurrent ? "opacity-60" : ""} ${!hasFirstFrame ? "opacity-0" : ""}`}
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
            />
            {/* Mute indicator */}
            {isCurrent && isMuted && hasFirstFrame && (
                <div className="absolute top-4 right-4 z-20 bg-black/50 rounded-full p-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                </div>
            )}
        </div>
    );
}

export default function VideoAccount() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Preload all videos on mount
    useEffect(() => {
        videosData.forEach((video) => {
            preloadVideo(video.videoSrc);
        });
    }, []);

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

    const handleUnmute = () => {
        setIsMuted(false);
    };

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
                                        <VideoPlayer src={video.videoSrc} isCurrent={isCurrent} isMuted={isMuted} onUnmute={handleUnmute} />

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
