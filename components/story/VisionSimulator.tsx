"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Camera, RotateCcw, Move, Smartphone } from "lucide-react";

interface VisionSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
    sampleImage?: string;
}

export default function VisionSimulator({
    isOpen,
    onClose,
    sampleImage = "/images/story/sample-panorama.jpg",
}: VisionSimulatorProps) {
    const [isImpaired, setIsImpaired] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [hasGyroscope, setHasGyroscope] = useState(false);
    const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    // Pan/rotation state
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const rotationStart = useRef({ x: 0, y: 0 });

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check for gyroscope support
    useEffect(() => {
        if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
            setHasGyroscope(true);
        }
    }, []);

    // Hide instructions after delay
    useEffect(() => {
        if (isOpen && showInstructions) {
            const timer = setTimeout(() => setShowInstructions(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, showInstructions]);

    // Gyroscope handler
    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (!gyroscopeEnabled) return;
        if (event.beta !== null && event.gamma !== null) {
            const x = Math.max(-60, Math.min(60, (event.beta - 45) * 0.8));
            const y = Math.max(-90, Math.min(90, event.gamma * 0.8));
            setRotation({ x, y });
        }
    }, [gyroscopeEnabled]);

    // Request gyroscope permission (iOS 13+)
    const requestGyroscopePermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === "granted") {
                    setGyroscopeEnabled(true);
                    window.addEventListener("deviceorientation", handleOrientation);
                }
            } catch (error) {
                console.error("Gyroscope permission error:", error);
            }
        } else {
            // Non-iOS devices - enable directly
            setGyroscopeEnabled(true);
            window.addEventListener("deviceorientation", handleOrientation);
        }
    };

    // Toggle gyroscope
    const toggleGyroscope = () => {
        if (gyroscopeEnabled) {
            setGyroscopeEnabled(false);
            window.removeEventListener("deviceorientation", handleOrientation);
        } else {
            requestGyroscopePermission();
        }
    };

    // Update gyroscope listener when handler changes
    useEffect(() => {
        if (gyroscopeEnabled) {
            window.addEventListener("deviceorientation", handleOrientation);
            return () => window.removeEventListener("deviceorientation", handleOrientation);
        }
    }, [gyroscopeEnabled, handleOrientation]);

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            setCameraStream(stream);
            setUseCamera(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Camera access error:", error);
            alert("カメラへのアクセスが拒否されました。サンプル画像を使用します。");
        }
    };

    // Stop camera
    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        setUseCamera(false);
    }, [cameraStream]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setRotation({ x: 0, y: 0 });
            setIsImpaired(false);
            setShowInstructions(true);
            setGyroscopeEnabled(false);
            window.removeEventListener("deviceorientation", handleOrientation);
        }
    }, [isOpen, stopCamera, handleOrientation]);

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

    // Mouse/touch drag handlers
    const handleDragStart = (clientX: number, clientY: number) => {
        if (gyroscopeEnabled) return; // Disable drag when gyroscope is active
        setIsDragging(true);
        dragStart.current = { x: clientX, y: clientY };
        rotationStart.current = { ...rotation };
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!isDragging || gyroscopeEnabled) return;

        const deltaX = clientX - dragStart.current.x;
        const deltaY = clientY - dragStart.current.y;

        setRotation({
            x: Math.max(-60, Math.min(60, rotationStart.current.x - deltaY * 0.3)),
            y: Math.max(-90, Math.min(90, rotationStart.current.y + deltaX * 0.3)),
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        handleDragStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    // Reset rotation
    const resetRotation = () => {
        setRotation({ x: 0, y: 0 });
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    };

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
                className="fixed inset-0 z-[100] bg-black"
                role="dialog"
                aria-modal="true"
                aria-label="視覚体験シミュレーター"
            >
                {/* Main viewport */}
                <div
                    ref={containerRef}
                    className={`relative w-full h-full overflow-hidden select-none ${
                        !gyroscopeEnabled ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Image/Video content with pan effect */}
                    <div
                        className="absolute inset-0 transition-transform duration-75 ease-out"
                        style={{
                            transform: `scale(1.5) translate(${rotation.y * 0.3}%, ${rotation.x * 0.3}%)`,
                        }}
                    >
                        {useCamera ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${sampleImage})`,
                                    backgroundColor: "#1a1a1a",
                                }}
                            >
                                {/* Fallback gradient when no image */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                                    }}
                                />
                                {/* Sample scene elements */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white/30">
                                        <p className="text-6xl mb-4">🏫</p>
                                        <p className="text-xl font-medium">SFCキャンパス</p>
                                        <p className="text-sm mt-2">（サンプル画像がありません）</p>
                                    </div>
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

                                {/* Slight color desaturation */}
                                <div
                                    className="absolute inset-0 mix-blend-saturation"
                                    style={{
                                        background: "rgba(128,128,128,0.2)",
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Instructions overlay */}
                    <AnimatePresence>
                        {showInstructions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                            >
                                <div className="bg-black/80 backdrop-blur-md rounded-2xl px-8 py-6 text-center text-white max-w-sm mx-4">
                                    <Move className="w-10 h-10 mx-auto mb-4 opacity-80" />
                                    <p className="text-xl font-bold mb-2">視点を動かしてみよう</p>
                                    <p className="text-white/70">
                                        画面をドラッグして周囲を見渡せます
                                    </p>
                                    {hasGyroscope && (
                                        <p className="text-sm text-white/50 mt-3 flex items-center justify-center gap-2">
                                            <Smartphone size={16} />
                                            スマホを傾けても操作できます
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors border border-white/10"
                    aria-label="体験を終了"
                >
                    <X size={24} />
                </button>

                {/* Current mode indicator */}
                <div
                    className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        isImpaired
                            ? "bg-amber-500 text-black"
                            : "bg-white/20 backdrop-blur-md text-white border border-white/10"
                    }`}
                    aria-live="polite"
                >
                    {isImpaired ? "👁 弱視モード" : "通常モード"}
                </div>

                {/* Control panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                    <div className="max-w-md mx-auto space-y-4">
                        {/* Vision toggle button - Main CTA */}
                        <motion.button
                            onClick={toggleVisionMode}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                isImpaired
                                    ? "bg-white text-black shadow-lg shadow-white/20"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30"
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
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                    useCamera
                                        ? "bg-red-500 text-white"
                                        : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                                }`}
                                aria-label={useCamera ? "カメラを停止" : "カメラを使用"}
                            >
                                <Camera size={18} />
                                <span className="hidden sm:inline">{useCamera ? "カメラ停止" : "カメラ"}</span>
                            </button>

                            {/* Gyroscope toggle */}
                            {hasGyroscope && (
                                <button
                                    onClick={toggleGyroscope}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                        gyroscopeEnabled
                                            ? "bg-blue-500 text-white"
                                            : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                                    }`}
                                    aria-label={gyroscopeEnabled ? "ジャイロを無効化" : "ジャイロを有効化"}
                                >
                                    <Smartphone size={18} />
                                    <span className="hidden sm:inline">{gyroscopeEnabled ? "ジャイロON" : "ジャイロ"}</span>
                                </button>
                            )}

                            {/* Reset rotation */}
                            <button
                                onClick={resetRotation}
                                className="py-3 px-4 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 transition-all flex items-center justify-center gap-2 hover:bg-white/20"
                                aria-label="視点をリセット"
                            >
                                <RotateCcw size={18} />
                                <span className="hidden sm:inline">リセット</span>
                            </button>
                        </div>

                        {/* Description text */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isImpaired ? "impaired" : "normal"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center text-white/80 text-sm leading-relaxed"
                            >
                                {isImpaired ? (
                                    <p>
                                        <span className="font-bold text-amber-400">左目が見えず</span>、
                                        <span className="font-bold text-amber-400">視野が狭く</span>なっています。
                                        <br />
                                        周辺視野がぼやけ、見える範囲が限られています。
                                    </p>
                                ) : (
                                    <p>
                                        これが一般的な見え方です。
                                        <br />
                                        オレンジのボタンを押して、私の見え方を体験してください。
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

// Standalone component for embedding without modal
export function VisionSimulatorEmbed() {
    const [isImpaired, setIsImpaired] = useState(false);

    const toggleVisionMode = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setIsImpaired(!isImpaired);
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/story/sample-panorama.jpg')",
                    backgroundColor: "#1a1a2e",
                }}
            >
                {/* Fallback */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    }}
                />
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
                    >
                        {/* Left blindness */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(to right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 48%, rgba(0,0,0,0) 55%)",
                            }}
                        />
                        {/* Tunnel vision */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "radial-gradient(ellipse 35% 45% at 70% 50%, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.95) 100%)",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode indicator */}
            <div
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isImpaired
                        ? "bg-amber-500 text-black"
                        : "bg-white/20 backdrop-blur-sm text-white"
                }`}
            >
                {isImpaired ? "弱視モード" : "通常モード"}
            </div>

            {/* Toggle buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                    onClick={() => setIsImpaired(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        !isImpaired
                            ? "bg-white text-black shadow-lg"
                            : "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    }`}
                >
                    <Eye size={16} />
                    通常
                </button>
                <button
                    onClick={toggleVisionMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        isImpaired
                            ? "bg-amber-500 text-black shadow-lg"
                            : "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    }`}
                >
                    <EyeOff size={16} />
                    私の見え方
                </button>
            </div>
        </div>
    );
}
