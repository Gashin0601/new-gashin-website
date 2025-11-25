"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import SocialLink from "../ui/SocialLinks";
import videosData from "@/data/videos.json";

function VideoPlayer({ src, isCurrent, poster, fallbackUrl }: { src: string; isCurrent: boolean; poster?: string; fallbackUrl?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Reset state on src change
        setIsLoaded(false);
        setHasError(false);

        // Check if source is HLS (.m3u8)
        const isHLS = src.endsWith('.m3u8');

        if (isHLS && Hls.isSupported()) {
            // Use HLS.js for adaptive streaming
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoaded(true);
                if (isCurrent) {
                    video.play().catch(() => { });
                }
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setHasError(true);
                }
            });
        } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                setIsLoaded(true);
                if (isCurrent) {
                    video.play().catch(() => { });
                }
            });
            video.addEventListener('error', () => setHasError(true));
        } else {
            // Standard MP4 - optimized loading
            video.src = src;
            video.addEventListener('loadeddata', () => {
                setIsLoaded(true);
            });
            video.addEventListener('error', () => setHasError(true));
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded || hasError) return;

        if (isCurrent) {
            video.play().catch(() => {
                // Handle autoplay restriction
            });
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [isCurrent, isLoaded, hasError]);

    // Helper to extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) return match[2];
        // Handle shorts
        const shortsMatch = url.match(/shorts\/([^#&?]*)/);
        if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
        return null;
    };

    if (hasError && fallbackUrl) {
        const videoId = getYouTubeId(fallbackUrl);
        if (videoId) {
            return (
                <div className="w-full h-full relative bg-black pointer-events-none">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=${isCurrent ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&mute=1&playsinline=1&rel=0`}
                        className="w-full h-full object-cover pointer-events-auto"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                    />
                </div>
            );
        }
    }

    return (
        <div className="w-full h-full relative bg-black pointer-events-none">
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            <video
                ref={videoRef}
                className={`w-full h-full object-cover transition-opacity duration-300 ${!isCurrent ? "opacity-60" : ""} ${!isLoaded ? "opacity-0" : ""}`}
                muted
                loop
                playsInline
                preload={isCurrent ? "auto" : "metadata"}
                poster={poster}
            />
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
                                className={`absolute rounded-3xl overflow-hidden transition-all duration-500 ease-in-out
                                    ${isCurrent ? "z-20 shadow-2xl ring-1 ring-black/10" : "z-10 opacity-50 cursor-pointer"}
                                `}
                                initial={{
                                    scale: 0.85,
                                    x: offset * 100 + "%",
                                    opacity: 0
                                }}
                                animate={{
                                    scale: isCurrent ? 1 : 0.85,
                                    x: isCurrent ? 0 : isPrev ? "-55%" : "55%",
                                    opacity: isCurrent ? 1 : 0.5,
                                    zIndex: isCurrent ? 20 : 10,
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        if (isPrev) setCurrentIndex(prevIndex);
                                        if (isNext) setCurrentIndex(nextIndex);
                                    }
                                }}
                            >
                                <div className="w-full h-full bg-black relative group">
                                    <VideoPlayer src={video.videoSrc} isCurrent={isCurrent} fallbackUrl={video.socialLinks.youtube} />

                                    {/* Navigation Overlay for Side Videos */}
                                    {!isCurrent && (
                                        <div
                                            className="absolute inset-0 z-50 cursor-pointer pointer-events-auto"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent bubbling
                                                if (isPrev) setCurrentIndex(prevIndex);
                                                if (isNext) setCurrentIndex(nextIndex);
                                            }}
                                        />
                                    )}

                                    {isCurrent && (
                                        <>
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

                                            {/* Video info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20 pointer-events-none">
                                                <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
                                            </div>

                                            {/* Hover overlay with social links */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
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
