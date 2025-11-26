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
        // iOS Safari requires setAttribute for playsinline to work properly
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.crossOrigin = 'anonymous';
        video.oncanplaythrough = () => {
            preloadedVideos[src] = video;
            resolve(video);
        };
        video.onerror = () => resolve(video);
        video.load();
    });
}

function VideoPlayer({ src, isCurrent, isMuted, isVisible }: { src: string; isCurrent: boolean; isMuted: boolean; isVisible: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasFirstFrame, setHasFirstFrame] = useState(false);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Preload this video
    useEffect(() => {
        preloadVideo(src);
    }, [src]);

    // Set iOS Safari specific attributes via JavaScript
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // iOS Safari requires setAttribute for playsinline to work properly
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
    }, []);

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

    // Handle play/pause with audio fade based on visibility and current state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Variables for cleanup
        let canPlayHandler: (() => void) | null = null;
        let retryTimeout: NodeJS.Timeout | null = null;
        let isCancelled = false;

        // Clear any existing fade interval
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }

        const shouldPlay = isCurrent && isVisible;

        if (shouldPlay) {
            // iOS Safari: Always start playback muted, then unmute after play succeeds
            // This prevents iOS from triggering fullscreen mode
            video.muted = true;
            video.volume = 0;

            const attemptPlay = () => {
                if (isCancelled) return;

                video.play()
                    .then(() => {
                        if (isCancelled) return;

                        // After play succeeds, restore muted state if user had unmuted
                        if (!isMuted) {
                            video.muted = false;
                        }

                        // Fade in volume
                        let vol = 0;
                        fadeIntervalRef.current = setInterval(() => {
                            vol += 0.1;
                            if (vol >= 1) {
                                vol = 1;
                                if (fadeIntervalRef.current) {
                                    clearInterval(fadeIntervalRef.current);
                                    fadeIntervalRef.current = null;
                                }
                            }
                            video.volume = vol;
                        }, 50);
                    })
                    .catch(() => {
                        if (isCancelled) return;
                        // Retry after a short delay if play fails (e.g., video not ready yet)
                        retryTimeout = setTimeout(attemptPlay, 500);
                    });
            };

            // Try to play immediately, or wait for video to be ready
            if (video.readyState >= 2) {
                attemptPlay();
            } else {
                canPlayHandler = () => {
                    attemptPlay();
                    if (canPlayHandler) {
                        video.removeEventListener('canplay', canPlayHandler);
                    }
                };
                video.addEventListener('canplay', canPlayHandler);
            }
        } else {
            // Fade out then pause
            let vol = video.volume;
            fadeIntervalRef.current = setInterval(() => {
                vol -= 0.1;
                if (vol <= 0) {
                    vol = 0;
                    video.volume = vol;
                    video.pause();
                    if (!isCurrent) {
                        video.currentTime = 0;
                    }
                    if (fadeIntervalRef.current) {
                        clearInterval(fadeIntervalRef.current);
                        fadeIntervalRef.current = null;
                    }
                } else {
                    video.volume = vol;
                }
            }, 30);
        }

        return () => {
            isCancelled = true;
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
            if (canPlayHandler && video) {
                video.removeEventListener('canplay', canPlayHandler);
            }
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [isCurrent, isLoaded, isVisible, isMuted]);

    return (
        <div className="w-full h-full relative bg-black overflow-hidden z-0">
            {!hasFirstFrame && (
                <div className="absolute inset-0 flex items-center justify-center z-[5]">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            <video
                ref={videoRef}
                src={src}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[1] ${!isCurrent ? "opacity-60" : ""} ${!hasFirstFrame ? "opacity-0" : ""}`}
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
            />
            {/* Mute indicator */}
            {isCurrent && isMuted && hasFirstFrame && (
                <div className="absolute top-4 right-4 z-[25] bg-black/50 rounded-full p-2 pointer-events-none">
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
    const [isVisible, setIsVisible] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Preload all videos on mount
    useEffect(() => {
        videosData.forEach((video) => {
            preloadVideo(video.videoSrc);
        });
    }, []);

    // Intersection Observer to detect section visibility
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Play when even slightly visible (any intersection)
                    setIsVisible(entry.isIntersecting);
                });
            },
            {
                threshold: [0, 0.1, 0.5, 1],
                rootMargin: '0px'
            }
        );

        observer.observe(section);

        // Check initial visibility immediately
        const rect = section.getBoundingClientRect();
        const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInitiallyVisible) {
            setIsVisible(true);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // Try to unmute after any user interaction on the page
    useEffect(() => {
        const handleUserInteraction = () => {
            setIsMuted(false);
            // Remove listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('scroll', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    // Auto-advance carousel (only when visible)
    useEffect(() => {
        if (isHovered || !isVisible) return;

        const nextSlide = () => {
            setCurrentIndex((prev) => (prev + 1) % videosData.length);
        };

        timeoutRef.current = setInterval(nextSlide, 10000); // 10 seconds

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [isHovered, isVisible]);

    const handleUnmute = () => {
        setIsMuted(false);
    };

    // Handle overlay toggle for mobile tap
    const handleVideoTap = () => {
        // Clear any existing timeout
        if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
        }

        setShowOverlay(prev => !prev);

        // Auto-hide overlay after 3 seconds
        if (!showOverlay) {
            overlayTimeoutRef.current = setTimeout(() => {
                setShowOverlay(false);
            }, 3000);
        }
    };

    // Touch handlers for swipe gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Only trigger swipe if horizontal movement is greater than vertical
        // and the swipe distance is significant (at least 50px)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - go to previous
                setCurrentIndex((prev) => (prev - 1 + videosData.length) % videosData.length);
            } else {
                // Swipe left - go to next
                setCurrentIndex((prev) => (prev + 1) % videosData.length);
            }
        }

        touchStartRef.current = null;
    };

    // Clean up overlay timeout on unmount
    useEffect(() => {
        return () => {
            if (overlayTimeoutRef.current) {
                clearTimeout(overlayTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
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
                        <SocialLink platform="x" url="https://x.com/gashin_lv" className="hover:scale-110" iconSize={32} />
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    className="relative h-[500px] sm:h-[550px] md:h-[600px] flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
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
                                    <div
                                        className="w-full h-full bg-black relative touch-pan-y"
                                        onMouseEnter={() => isCurrent && setShowOverlay(true)}
                                        onMouseLeave={() => isCurrent && setShowOverlay(false)}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={(e) => {
                                            // Check if this was a swipe or just a tap
                                            if (touchStartRef.current) {
                                                const touch = e.changedTouches[0];
                                                const deltaX = touch.clientX - touchStartRef.current.x;
                                                const deltaY = touch.clientY - touchStartRef.current.y;

                                                // If horizontal swipe detected, handle navigation
                                                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                                                    if (deltaX > 0) {
                                                        setCurrentIndex((prev) => (prev - 1 + videosData.length) % videosData.length);
                                                    } else {
                                                        setCurrentIndex((prev) => (prev + 1) % videosData.length);
                                                    }
                                                    touchStartRef.current = null;
                                                    return;
                                                }
                                            }
                                            touchStartRef.current = null;

                                            // If not a swipe, treat as tap
                                            if (isCurrent) {
                                                handleVideoTap();
                                                if (isMuted) handleUnmute();
                                            }
                                        }}
                                        onClick={(e) => {
                                            // Only handle click on desktop (no touch)
                                            if (e.detail > 0 && isCurrent) {
                                                handleVideoTap();
                                                if (isMuted) handleUnmute();
                                            }
                                        }}
                                    >
                                        <VideoPlayer src={video.videoSrc} isCurrent={isCurrent} isMuted={isMuted} isVisible={isVisible} />

                                        {/* Navigation overlay for side videos */}
                                        {!isCurrent && (
                                            <div
                                                className="absolute inset-0 z-40 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentIndex(index);
                                                }}
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

                                                {/* Social links overlay - shown on hover or tap */}
                                                <div
                                                    className={`absolute inset-0 bg-black/60 flex items-center justify-center z-[50] transition-opacity duration-200 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                >
                                                    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                                        {Object.entries(video.socialLinks).map(([platform, url]) => (
                                                            <SocialLink
                                                                key={platform}
                                                                platform={platform as "youtube" | "tiktok" | "instagram" | "x"}
                                                                url={url}
                                                                className="bg-white/30 backdrop-blur-sm p-3 rounded-full hover:bg-white/50 hover:scale-110 transition-all"
                                                                iconSize={24}
                                                                iconColor="#ffffff"
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
                <div className="flex justify-center gap-3 mt-8">
                    {videosData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-3 rounded-full transition-all cursor-pointer ${index === currentIndex
                                ? "bg-gray-900 w-8"
                                : "bg-gray-300 hover:bg-gray-500 w-3"
                                }`}
                            aria-label={`動画 ${index + 1} に移動`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
