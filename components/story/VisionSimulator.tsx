"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Camera, RotateCcw, Smartphone } from "lucide-react";

interface VisionSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VisionSimulator({
    isOpen,
    onClose,
}: VisionSimulatorProps) {
    const [isImpaired, setIsImpaired] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [hasGyroscope, setHasGyroscope] = useState(false);
    const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Check for gyroscope support
    useEffect(() => {
        if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
            setHasGyroscope(true);
        }
    }, []);

    // Set video srcObject when stream is available
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.play().catch(console.error);
        }
    }, [cameraStream, useCamera]);

    // Gyroscope handler
    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (!gyroscopeEnabled) return;
        // Gyroscope logic can be added here if needed
    }, [gyroscopeEnabled]);

    // Request gyroscope permission (iOS 13+)
    const requestGyroscopePermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === "granted") {
                    setGyroscopeEnabled(true);
                }
            } catch (error) {
                console.error("Gyroscope permission error:", error);
            }
        } else {
            setGyroscopeEnabled(true);
        }
    };

    // Toggle gyroscope
    const toggleGyroscope = () => {
        if (gyroscopeEnabled) {
            setGyroscopeEnabled(false);
        } else {
            requestGyroscopePermission();
        }
    };

    // Start camera
    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            setCameraStream(stream);
            setUseCamera(true);
        } catch (error: any) {
            console.error("Camera access error:", error);
            if (error.name === "NotAllowedError") {
                setCameraError("カメラへのアクセスが拒否されました");
            } else if (error.name === "NotFoundError") {
                setCameraError("カメラが見つかりません");
            } else {
                setCameraError("カメラを起動できませんでした");
            }
        }
    };

    // Stop camera
    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        setUseCamera(false);
        setCameraError(null);
    }, [cameraStream]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setIsImpaired(false);
            setGyroscopeEnabled(false);
        }
    }, [isOpen, stopCamera]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Toggle vision mode with vibration
    const toggleVisionMode = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setIsImpaired(!isImpaired);
    };

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-[var(--bg-primary)]"
                role="dialog"
                aria-modal="true"
                aria-label="視覚体験シミュレーター"
            >
                {/* Main viewport */}
                <div className="relative w-full h-full overflow-hidden">
                    {/* Camera/Background content */}
                    <div className="absolute inset-0">
                        {useCamera && cameraStream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                <div className="text-center text-[var(--text-secondary)] px-6">
                                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="text-lg">
                                        カメラを起動して、あなたの周囲を<br />
                                        私の視点で見てみましょう
                                    </p>
                                    {cameraError && (
                                        <p className="text-red-500 mt-4 text-sm">{cameraError}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vision impairment overlay */}
                    <AnimatePresence>
                        {isImpaired && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 pointer-events-none"
                                aria-hidden="true"
                            >
                                {/* Left eye blind (left half completely dark) */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: "linear-gradient(to right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 48%, rgba(0,0,0,0.5) 52%, rgba(0,0,0,0) 55%)",
                                    }}
                                />

                                {/* Tunnel vision vignette on right side */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: "radial-gradient(ellipse 35% 45% at 70% 50%, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 100%)",
                                    }}
                                />

                                {/* Peripheral blur effect */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backdropFilter: "blur(0px)",
                                        WebkitBackdropFilter: "blur(0px)",
                                        maskImage: "radial-gradient(ellipse 40% 50% at 70% 50%, transparent 30%, black 70%)",
                                        WebkitMaskImage: "radial-gradient(ellipse 40% 50% at 70% 50%, transparent 30%, black 70%)",
                                    }}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            backdropFilter: "blur(6px)",
                                            WebkitBackdropFilter: "blur(6px)",
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-3 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors border border-[var(--border-color)]"
                    aria-label="体験を終了"
                >
                    <X size={24} />
                </button>

                {/* Current mode indicator */}
                <div
                    className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        isImpaired
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    }`}
                    aria-live="polite"
                >
                    {isImpaired ? "弱視モード" : "通常モード"}
                </div>

                {/* Control panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent z-20">
                    <div className="max-w-md mx-auto space-y-4">
                        {/* Vision toggle button - Main CTA */}
                        <motion.button
                            onClick={toggleVisionMode}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                isImpaired
                                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                                    : "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                            }`}
                            aria-pressed={isImpaired}
                            aria-label={isImpaired ? "通常の見え方に切り替える" : "私の見え方に切り替える"}
                        >
                            {isImpaired ? (
                                <>
                                    <Eye size={24} />
                                    <span>通常の見え方に戻す</span>
                                </>
                            ) : (
                                <>
                                    <EyeOff size={24} />
                                    <span>私の見え方を体験する</span>
                                </>
                            )}
                        </motion.button>

                        {/* Secondary controls */}
                        <div className="flex gap-2">
                            {/* Camera toggle */}
                            <button
                                onClick={useCamera ? stopCamera : startCamera}
                                className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                    useCamera
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]"
                                }`}
                                aria-label={useCamera ? "カメラを停止" : "カメラを使用"}
                            >
                                <Camera size={18} />
                                <span>{useCamera ? "カメラ停止" : "カメラを起動"}</span>
                            </button>

                            {/* Gyroscope toggle (mobile only) */}
                            {hasGyroscope && (
                                <button
                                    onClick={toggleGyroscope}
                                    className={`py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        gyroscopeEnabled
                                            ? "bg-[var(--accent)] text-white"
                                            : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]"
                                    }`}
                                    aria-label={gyroscopeEnabled ? "ジャイロを無効化" : "ジャイロを有効化"}
                                >
                                    <Smartphone size={18} />
                                </button>
                            )}
                        </div>

                        {/* Description text */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isImpaired ? "impaired" : "normal"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center text-[var(--text-secondary)] text-sm leading-relaxed"
                            >
                                {isImpaired ? (
                                    <p>
                                        左目が見えず、視野が狭くなっています。<br />
                                        周辺視野がぼやけ、見える範囲が限られています。
                                    </p>
                                ) : (
                                    <p>
                                        カメラを起動して、私の見え方を体験してください。
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
