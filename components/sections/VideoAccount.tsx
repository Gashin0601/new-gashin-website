"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SocialLink from "../ui/SocialLinks";
import videosData from "@/data/videos.json";
import { preloadVideo, isVideoPreloaded, takePreloadedVideo, returnPreloadedVideo, isVideoReady } from "@/lib/videoPreloader";

function VideoPlayer({ src, isCurrent, isMuted, isVisible }: { src: string; isCurrent: boolean; isMuted: boolean; isVisible: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const srcRef = useRef<string>(src);
    const [hasFirstFrame, setHasFirstFrame] = useState(() => isVideoReady(src));
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Use preloaded video element or create a new one
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check if we already have a video element for this src
        if (videoRef.current && srcRef.current === src) {
            return;
        }

        // Return previous video to cache if switching src
        if (videoRef.current && srcRef.current !== src) {
            returnPreloadedVideo(srcRef.current, videoRef.current);
            videoRef.current = null;
        }

        srcRef.current = src;

        // Try to take the preloaded video element from cache
        let video = takePreloadedVideo(src);
        let isFromCache = !!video;

        if (!video) {
            // Create new video if not preloaded
            video = document.createElement('video');
            video.preload = 'auto';
            video.loop = true;
            video.playsInline = true;
            video.muted = true; // Start muted for autoplay
            video.src = src;

            // iOS Safari requires setAttribute for playsinline
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            // Don't set muted attribute - control via JS property only

            // Start preloading for future use (will store in cache after load)
            preloadVideo(src);
        }

        // Apply styles - different for mobile vs desktop
        video.className = `z-[1] transition-opacity duration-300`;
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            // Mobile: use flexbox centering from container (no absolute positioning)
            video.style.cssText = 'width: auto; height: 100%; min-width: 100%; min-height: 100%; object-fit: cover; object-position: center;';
        } else {
            // Desktop: use absolute positioning for precise centering
            video.style.cssText = 'width: auto; height: 100%; min-width: 100%; min-height: 100%; object-fit: cover; object-position: center; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);';
        }

        // Event listeners
        const handleLoadedData = () => setHasFirstFrame(true);
        const handleCanPlay = () => {
            setHasFirstFrame(true);
            if (isCurrent && isVisible) {
                video!.play().catch(() => { });
            }
        };
        const handlePlaying = () => setHasFirstFrame(true);

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('playing', handlePlaying);

        // Clear container and add video
        container.innerHTML = '';
        container.appendChild(video);
        videoRef.current = video;

        // Check if already ready (from cache)
        if (isFromCache && video.readyState >= 2) {
            setHasFirstFrame(true);
        } else if (video.readyState < 2) {
            video.load();
        }

        return () => {
            video!.removeEventListener('loadeddata', handleLoadedData);
            video!.removeEventListener('canplay', handleCanPlay);
            video!.removeEventListener('playing', handlePlaying);
        };
    }, [src]);

    // Return video to cache on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                returnPreloadedVideo(srcRef.current, videoRef.current);
                videoRef.current = null;
            }
        };
    }, []);

    // Handle mute/unmute separately from play/pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Only change mute if video is already playing (user toggled mute)
        if (!video.paused) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    // Handle play/pause with audio fade based on visibility and current state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Variables for cleanup
        let canPlayHandler: (() => void) | null = null;
        let retryTimeout: NodeJS.Timeout | null = null;
        let retryCount = 0;
        const maxRetries = 10;
        let isCancelled = false;

        // Clear any existing fade interval
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }

        const shouldPlay = isCurrent && isVisible;

        if (shouldPlay) {
            const attemptPlay = () => {
                if (isCancelled) return;
                if (retryCount >= maxRetries) return;

                // Ensure video is ready before playing
                if (video.readyState < 2) {
                    retryCount++;
                    retryTimeout = setTimeout(attemptPlay, 300);
                    return;
                }

                // iOS Safari: Start muted for autoplay, then unmute
                // Only set muted=true if not already playing with sound
                if (video.paused) {
                    video.muted = true;
                    video.volume = 0;
                }

                video.play()
                    .then(() => {
                        if (isCancelled) return;

                        // After play succeeds, restore muted state based on user preference
                        video.muted = isMuted;

                        // Fade in volume if not muted
                        if (!isMuted) {
                            let vol = video.volume;
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
                        } else {
                            video.volume = 1;
                        }
                    })
                    .catch(() => {
                        if (isCancelled) return;
                        retryCount++;
                        // Retry after a short delay if play fails
                        if (retryCount < maxRetries) {
                            retryTimeout = setTimeout(attemptPlay, 500);
                        }
                    });
            };

            // Start attempting to play
            attemptPlay();

            // Also listen for canplay event as a backup
            canPlayHandler = () => {
                if (!isCancelled && video.paused && isCurrent && isVisible) {
                    attemptPlay();
                }
            };
            video.addEventListener('canplay', canPlayHandler);
            video.addEventListener('canplaythrough', canPlayHandler);
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
                video.removeEventListener('canplaythrough', canPlayHandler);
            }
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [isCurrent, isVisible, isMuted]);

    // Update video opacity when isCurrent or hasFirstFrame changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.style.opacity = hasFirstFrame ? (isCurrent ? '1' : '0.6') : '0';
    }, [isCurrent, hasFirstFrame]);

    return (
        <div className="w-full h-full relative bg-black overflow-hidden z-0">
            {!hasFirstFrame && (
                <div className="absolute inset-0 flex items-center justify-center z-[5]">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            {/* iOS Safari fix: wrapper div handles the cover behavior - video added dynamically */}
            <div
                ref={containerRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ overflow: 'hidden' }}
            />
            {/* Mute indicator */}
            {isCurrent && isMuted && hasFirstFrame && (
                <div
                    className="absolute top-4 right-4 z-[25] bg-black/50 rounded-full p-2 pointer-events-none"
                    role="status"
                    aria-label="音声がミュート中です。タップまたはクリックでミュート解除"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

        const checkVisibility = () => {
            const rect = section.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                setIsVisible(true);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Play when even slightly visible (any intersection)
                    setIsVisible(entry.isIntersecting);
                });
            },
            {
                threshold: [0, 0.1, 0.5, 1],
                rootMargin: '50px'
            }
        );

        observer.observe(section);

        // Check initial visibility immediately
        checkVisibility();

        // Also check after loading screen might have finished (multiple delays)
        const timers = [
            setTimeout(checkVisibility, 500),
            setTimeout(checkVisibility, 1000),
            setTimeout(checkVisibility, 2000),
            setTimeout(checkVisibility, 3000),
        ];

        // Listen for scroll to catch visibility changes
        window.addEventListener('scroll', checkVisibility);

        return () => {
            observer.disconnect();
            timers.forEach(t => clearTimeout(t));
            window.removeEventListener('scroll', checkVisibility);
        };
    }, []);

    // Unlock audio on first user interaction (required for iOS Safari)
    // iOS Safari requires unmuting to happen WITHIN the user gesture handler
    useEffect(() => {
        let hasInteracted = false;

        const handleUserInteraction = () => {
            if (hasInteracted) return;
            hasInteracted = true;

            // IMPORTANT: Must unmute directly within the gesture handler for iOS Safari
            // React state updates are async and lose the gesture context
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                // Unmute and ensure volume is up
                video.muted = false;
                video.volume = 1;
                // Try to play if paused (within gesture context)
                if (video.paused) {
                    video.play().catch(() => { });
                }
            });

            // Also set React state for proper tracking
            setIsMuted(false);

            // Remove listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('touchend', handleUserInteraction);
            document.removeEventListener('scroll', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('touchend', handleUserInteraction);
        document.addEventListener('scroll', handleUserInteraction, { passive: true });
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('touchend', handleUserInteraction);
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

    // Current video info for screen reader announcements
    const currentVideo = videosData[currentIndex];

    return (
        <section
            ref={sectionRef}
            className="py-12 md:py-14 bg-[var(--bg-primary)] overflow-hidden"
            aria-label="Gashin / 弱視慶應生 - 動画アカウント"
        >
            <div className="max-w-6xl mx-auto px-6">
                {/* Account Header */}
                <header className="text-center mb-8 md:mb-10 space-y-3 md:space-y-4">
                    <div
                        className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-2 border-white/10"
                        role="img"
                        aria-label="Gashin / 弱視慶應生のプロフィール画像"
                    >
                        <Image
                            src="/images/profile/gashin_lv.jpeg"
                            alt=""
                            fill
                            className="object-cover"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]" id="video-account-title">
                        Gashin / 弱視慶應生
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] font-mono -mt-4" aria-label="ユーザー名 アット gashin_lv">
                        @gashin_lv
                    </p>
                    <p
                        className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg"
                        id="video-account-description"
                    >
                        視覚障害について、日々の学び、そして慶應SFCでの挑戦を動画で発信しています。
                    </p>

                    <nav
                        className="flex justify-center gap-6"
                        aria-label="Gashinのソーシャルメディアリンク"
                    >
                        <SocialLink platform="youtube" url="https://youtube.com/@gashin_lv" className="text-[var(--sns-youtube)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="tiktok" url="https://www.tiktok.com/@gashin_lv" className="text-[var(--sns-tiktok)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="instagram" url="https://instagram.com/gashin_lv" className="text-[var(--sns-instagram)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="x" url="https://x.com/gashin_lv" className="hover:scale-110" iconSize={32} />
                    </nav>
                </header>

                {/* Screen reader live region for carousel updates */}
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                >
                    {`動画 ${currentIndex + 1} / ${videosData.length}: ${currentVideo.title}`}
                </div>

                {/* Carousel Container */}
                <div
                    className="relative h-[480px] sm:h-[520px] md:h-[540px] flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    role="region"
                    aria-roledescription="動画カルーセル"
                    aria-label={`動画カルーセル、全${videosData.length}件、現在${currentIndex + 1}件目を表示中`}
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
                                        ${isCurrent ? "z-20 shadow-2xl ring-1 ring-black/10" : "z-10 cursor-pointer"}
                                    `}
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1 : 0.85,
                                    x: isCurrent ? 0 : isPrev ? -180 : 180,
                                    opacity: isCurrent ? 1 : 0.6,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    mass: 1
                                }}
                                style={{
                                    width: "min(280px, 72vw)",
                                    height: "min(500px, 68vh)",
                                    left: "50%",
                                    top: "50%",
                                    marginLeft: "calc(min(280px, 72vw) * -0.5)",
                                    marginTop: "calc(min(500px, 68vh) * -0.5)",
                                }}
                                role="group"
                                aria-roledescription="動画スライド"
                                aria-label={`${video.title}${isCurrent ? '、現在表示中' : isPrev ? '、前の動画' : '、次の動画'}`}
                                aria-hidden={!isCurrent && !isPrev && !isNext}
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
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none z-10" aria-hidden="true" />

                                            {/* Video info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20 pointer-events-none">
                                                <h3 className="font-bold text-lg mb-1 line-clamp-2" id={`video-title-${video.id}`}>
                                                    {video.title}
                                                </h3>
                                            </div>

                                            {/* Social links overlay - shown on hover or tap */}
                                            <div
                                                className={`absolute inset-0 bg-black/60 flex items-center justify-center z-[50] transition-opacity duration-200 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                role="dialog"
                                                aria-label={`${video.title}をSNSで見る`}
                                                aria-hidden={!showOverlay}
                                            >
                                                <nav
                                                    className="flex gap-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label="この動画のSNSリンク"
                                                >
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
                                                </nav>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Carousel indicators */}
                <div className="flex justify-center gap-3 mt-6">
                    {videosData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-3 rounded-full transition-all cursor-pointer ${index === currentIndex
                                ? "bg-[var(--text-primary)] w-8"
                                : "bg-[var(--border-color)] hover:bg-[var(--text-secondary)] w-3"
                                }`}
                            aria-label={`動画 ${index + 1} に移動`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
