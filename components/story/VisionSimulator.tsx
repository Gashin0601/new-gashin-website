"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Camera, RotateCcw, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface VisionSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

type CaptureStep = "intro" | "capturing" | "viewing";
type CapturePosition = "left" | "center" | "right";

const CAPTURE_POSITIONS: CapturePosition[] = ["left", "center", "right"];
const POSITION_LABELS: Record<CapturePosition, string> = {
    left: "左",
    center: "中央",
    right: "右",
};

export default function VisionSimulator({
    isOpen,
    onClose,
}: VisionSimulatorProps) {
    // State
    const [step, setStep] = useState<CaptureStep>("intro");
    const [isImpaired, setIsImpaired] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [capturedImages, setCapturedImages] = useState<(string | null)[]>([null, null, null]);
    const [panoramaImage, setPanoramaImage] = useState<string | null>(null);
    const [viewOffset, setViewOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
    const [deviceGamma, setDeviceGamma] = useState(0);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const panoramaCanvasRef = useRef<HTMLCanvasElement>(null);
    const dragStartRef = useRef({ x: 0, offset: 0 });

    // Start camera
    const startCamera = useCallback(async () => {
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
        } catch (error: any) {
            console.error("Camera access error:", error);
            if (error.name === "NotAllowedError") {
                setCameraError("カメラへのアクセスが拒否されました。設定からカメラの許可を確認してください。");
            } else if (error.name === "NotFoundError") {
                setCameraError("カメラが見つかりません。");
            } else {
                setCameraError("カメラを起動できませんでした。");
            }
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
    }, [cameraStream]);

    // Set video source when stream is available
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.play().catch(console.error);
        }
    }, [cameraStream]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setStep("intro");
            setIsImpaired(false);
            setCurrentPosition(0);
            setCapturedImages([null, null, null]);
            setPanoramaImage(null);
            setViewOffset(0);
            setGyroscopeEnabled(false);
            setCameraError(null);
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

    // Gyroscope handler
    useEffect(() => {
        if (!gyroscopeEnabled || step !== "viewing") return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma !== null) {
                // Map gamma (-90 to 90) to viewOffset
                const normalizedGamma = Math.max(-45, Math.min(45, event.gamma));
                setDeviceGamma(normalizedGamma);
                // Calculate offset based on gamma
                const maxOffset = getMaxOffset();
                const newOffset = (normalizedGamma / 45) * (maxOffset / 2);
                setViewOffset(Math.max(-maxOffset, Math.min(0, -maxOffset / 2 + newOffset)));
            }
        };

        window.addEventListener("deviceorientation", handleOrientation);
        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [gyroscopeEnabled, step, panoramaImage]);

    // Request gyroscope permission (iOS)
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

    // Capture current frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0);

        // Get image data URL
        const imageData = canvas.toDataURL("image/jpeg", 0.9);

        // Update captured images
        const newCapturedImages = [...capturedImages];
        newCapturedImages[currentPosition] = imageData;
        setCapturedImages(newCapturedImages);

        // Vibrate feedback
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }

        // Move to next position or finish
        if (currentPosition < CAPTURE_POSITIONS.length - 1) {
            setCurrentPosition(currentPosition + 1);
        } else {
            // All photos captured, create panorama
            createPanorama(newCapturedImages);
        }
    }, [currentPosition, capturedImages]);

    // Create panorama from captured images
    const createPanorama = useCallback((images: (string | null)[]) => {
        if (!panoramaCanvasRef.current) return;

        const canvas = panoramaCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Load all images
        const imageElements: HTMLImageElement[] = [];
        let loadedCount = 0;

        images.forEach((src, index) => {
            if (!src) return;

            const img = new Image();
            img.onload = () => {
                imageElements[index] = img;
                loadedCount++;

                // When all images loaded, compose panorama
                if (loadedCount === images.filter(Boolean).length) {
                    composePanorama(ctx, canvas, imageElements);
                }
            };
            img.src = src;
        });
    }, []);

    // Compose panorama on canvas with blending
    const composePanorama = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        images: HTMLImageElement[]
    ) => {
        if (images.length === 0) return;

        const imgHeight = images[0].height;
        const imgWidth = images[0].width;

        // Calculate overlap and total width
        const overlapPercent = 0.3; // 30% overlap
        const overlapWidth = Math.floor(imgWidth * overlapPercent);
        const effectiveWidth = imgWidth - overlapWidth;
        const totalWidth = imgWidth + effectiveWidth * (images.length - 1);

        canvas.width = totalWidth;
        canvas.height = imgHeight;

        // Draw images with gradient blending
        images.forEach((img, index) => {
            const x = index * effectiveWidth;

            if (index === 0) {
                // First image: draw fully
                ctx.drawImage(img, 0, 0);
            } else {
                // Create gradient for blending
                const gradient = ctx.createLinearGradient(x, 0, x + overlapWidth, 0);
                gradient.addColorStop(0, "rgba(255,255,255,0)");
                gradient.addColorStop(1, "rgba(255,255,255,1)");

                // Draw the image
                ctx.save();

                // First, draw the non-overlapping part
                ctx.drawImage(
                    img,
                    overlapWidth, 0, imgWidth - overlapWidth, imgHeight,
                    x + overlapWidth, 0, imgWidth - overlapWidth, imgHeight
                );

                // Then blend the overlapping part
                // Create a temporary canvas for the blend
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = overlapWidth;
                tempCanvas.height = imgHeight;
                const tempCtx = tempCanvas.getContext("2d");

                if (tempCtx) {
                    // Draw the overlapping part of the new image
                    tempCtx.drawImage(img, 0, 0, overlapWidth, imgHeight, 0, 0, overlapWidth, imgHeight);

                    // Apply gradient mask
                    tempCtx.globalCompositeOperation = "destination-in";
                    tempCtx.fillStyle = gradient;
                    tempCtx.fillRect(0, 0, overlapWidth, imgHeight);

                    // Draw blended overlap onto main canvas
                    ctx.drawImage(tempCanvas, x, 0);
                }

                ctx.restore();
            }
        });

        // Get panorama image
        const panoramaDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPanoramaImage(panoramaDataUrl);
        setStep("viewing");
        stopCamera();

        // Center the view
        setViewOffset(-totalWidth / 2 + window.innerWidth / 2);
    };

    // Get max offset for panorama viewing
    const getMaxOffset = () => {
        if (!panoramaImage || !panoramaCanvasRef.current) return 0;
        return Math.max(0, panoramaCanvasRef.current.width - window.innerWidth);
    };

    // Drag handlers for panorama viewing
    const handleDragStart = (clientX: number) => {
        if (gyroscopeEnabled) return;
        setIsDragging(true);
        dragStartRef.current = { x: clientX, offset: viewOffset };
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || gyroscopeEnabled) return;
        const delta = clientX - dragStartRef.current.x;
        const maxOffset = getMaxOffset();
        setViewOffset(Math.max(-maxOffset, Math.min(0, dragStartRef.current.offset + delta)));
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Toggle vision mode
    const toggleVisionMode = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setIsImpaired(!isImpaired);
    };

    // Start capturing
    const startCapturing = async () => {
        await startCamera();
        setStep("capturing");
    };

    // Reset and recapture
    const resetCapture = () => {
        setCapturedImages([null, null, null]);
        setCurrentPosition(0);
        setPanoramaImage(null);
        setStep("capturing");
        startCamera();
    };

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
                {/* Hidden canvases for image processing */}
                <canvas ref={canvasRef} className="hidden" />
                <canvas ref={panoramaCanvasRef} className="hidden" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 p-3 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors border border-[var(--border-color)]"
                    aria-label="体験を終了"
                >
                    <X size={24} />
                </button>

                {/* Step: Intro */}
                {step === "intro" && (
                    <div className="w-full h-full flex flex-col items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-md"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                <Camera size={40} className="text-[var(--text-secondary)]" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
                                パノラマ撮影で体験
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                カメラで周囲を撮影して、<br />
                                私の視点で世界を見てみましょう。<br />
                                <span className="text-sm">左・中央・右の3枚を撮影します。</span>
                            </p>
                            <button
                                onClick={startCapturing}
                                className="w-full py-4 px-6 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full font-bold text-lg hover:opacity-80 transition-opacity"
                            >
                                撮影を開始
                            </button>
                            {cameraError && (
                                <p className="text-red-500 mt-4 text-sm">{cameraError}</p>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Step: Capturing */}
                {step === "capturing" && (
                    <div className="w-full h-full flex flex-col">
                        {/* Camera view */}
                        <div className="flex-1 relative overflow-hidden bg-black">
                            {cameraStream ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-white/50">カメラを起動中...</p>
                                </div>
                            )}

                            {/* Direction guide overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Guide arrows */}
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                                    <div className={`transition-opacity ${currentPosition === 0 ? "opacity-100" : "opacity-30"}`}>
                                        <ChevronLeft size={48} className="text-white drop-shadow-lg" />
                                    </div>
                                    <div className={`transition-opacity ${currentPosition === 2 ? "opacity-100" : "opacity-30"}`}>
                                        <ChevronRight size={48} className="text-white drop-shadow-lg" />
                                    </div>
                                </div>

                                {/* Center crosshair */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border-2 border-white/50 rounded-lg" />
                                </div>

                                {/* Position indicator */}
                                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2">
                                    <p className="text-white font-bold">
                                        {POSITION_LABELS[CAPTURE_POSITIONS[currentPosition]]}を撮影
                                    </p>
                                </div>
                            </div>

                            {/* Captured thumbnails */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {capturedImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                            index === currentPosition
                                                ? "border-white scale-110"
                                                : img
                                                ? "border-green-500"
                                                : "border-white/30"
                                        }`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-black/50 flex items-center justify-center">
                                                <span className="text-white/50 text-xs">
                                                    {POSITION_LABELS[CAPTURE_POSITIONS[index]]}
                                                </span>
                                            </div>
                                        )}
                                        {img && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                                                <Check size={16} className="text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Capture button */}
                        <div className="p-6 bg-[var(--bg-primary)]">
                            <button
                                onClick={captureFrame}
                                disabled={!cameraStream}
                                className="w-full py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full font-bold text-lg hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Camera size={24} />
                                <span>撮影 ({currentPosition + 1}/3)</span>
                            </button>
                            <p className="text-center text-[var(--text-secondary)] text-sm mt-2">
                                {currentPosition === 0 && "左側を向いて撮影してください"}
                                {currentPosition === 1 && "正面を向いて撮影してください"}
                                {currentPosition === 2 && "右側を向いて撮影してください"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Step: Viewing */}
                {step === "viewing" && panoramaImage && (
                    <div className="w-full h-full flex flex-col">
                        {/* Panorama viewer */}
                        <div
                            className="flex-1 relative overflow-hidden bg-black cursor-grab active:cursor-grabbing"
                            onMouseDown={(e) => handleDragStart(e.clientX)}
                            onMouseMove={(e) => handleDragMove(e.clientX)}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                            onTouchEnd={handleDragEnd}
                        >
                            {/* Panorama image */}
                            <div
                                className="absolute h-full transition-transform duration-75"
                                style={{
                                    transform: `translateX(${viewOffset}px)`,
                                    width: panoramaCanvasRef.current?.width || "auto",
                                }}
                            >
                                <img
                                    src={panoramaImage}
                                    alt="パノラマ画像"
                                    className="h-full w-auto max-w-none"
                                    draggable={false}
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
                                        aria-hidden="true"
                                    >
                                        {/* Left eye blind */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: "linear-gradient(to right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 48%, rgba(0,0,0,0.5) 52%, rgba(0,0,0,0) 55%)",
                                            }}
                                        />
                                        {/* Tunnel vision */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: "radial-gradient(ellipse 35% 45% at 70% 50%, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 100%)",
                                            }}
                                        />
                                        {/* Blur effect */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
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

                            {/* Drag hint */}
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ delay: 3, duration: 1 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                                    <p className="text-white font-medium">
                                        ← ドラッグして周囲を見渡す →
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Mode indicator */}
                        <div
                            className={`absolute top-4 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                isImpaired
                                    ? "bg-[var(--accent)] text-white"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                            }`}
                        >
                            {isImpaired ? "弱視モード" : "通常モード"}
                        </div>

                        {/* Control panel */}
                        <div className="p-4 pb-8 bg-[var(--bg-primary)] space-y-3">
                            {/* Vision toggle */}
                            <button
                                onClick={toggleVisionMode}
                                className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                    isImpaired
                                        ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                                        : "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                }`}
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
                            </button>

                            {/* Secondary controls */}
                            <div className="flex gap-2">
                                <button
                                    onClick={resetCapture}
                                    className="flex-1 py-3 px-4 rounded-full text-sm font-medium bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={18} />
                                    <span>撮り直す</span>
                                </button>
                                {"DeviceOrientationEvent" in window && (
                                    <button
                                        onClick={gyroscopeEnabled ? () => setGyroscopeEnabled(false) : requestGyroscopePermission}
                                        className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                            gyroscopeEnabled
                                                ? "bg-[var(--accent)] text-white"
                                                : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]"
                                        }`}
                                    >
                                        <span>{gyroscopeEnabled ? "ジャイロON" : "ジャイロで操作"}</span>
                                    </button>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-center text-[var(--text-secondary)] text-sm">
                                {isImpaired
                                    ? "左目が見えず、視野が狭くなっています。"
                                    : "撮影したパノラマで私の見え方を体験できます。"}
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
