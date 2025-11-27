"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Camera, RotateCcw, ChevronRight, AlertCircle } from "lucide-react";

interface VisionSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

type CaptureStep = "intro" | "capturing" | "viewing";
type SpeedStatus = "ok" | "too_fast" | "too_slow" | "idle";

// Panorama configuration
const PANORAMA_CONFIG = {
    totalAngle: 120, // Total sweep angle (degrees)
    captureInterval: 10, // Capture every N degrees
    stripWidth: 80, // Width of each captured strip (pixels)
    minSpeed: 5, // Minimum rotation speed (deg/sec)
    maxSpeed: 60, // Maximum rotation speed (deg/sec)
};

export default function VisionSimulator({
    isOpen,
    onClose,
}: VisionSimulatorProps) {
    // Core state
    const [step, setStep] = useState<CaptureStep>("intro");
    const [isImpaired, setIsImpaired] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Panorama capture state
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedStrips, setCapturedStrips] = useState<string[]>([]);
    const [panoramaImage, setPanoramaImage] = useState<string | null>(null);
    const [sweepProgress, setSweepProgress] = useState(0); // 0 to 1
    const [speedStatus, setSpeedStatus] = useState<SpeedStatus>("idle");
    const [guideArrowOffset, setGuideArrowOffset] = useState(0); // -1 to 1

    // Panorama viewing state
    const [viewOffset, setViewOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const panoramaCanvasRef = useRef<HTMLCanvasElement>(null);
    const dragStartRef = useRef({ x: 0, offset: 0 });

    // Gyroscope tracking refs
    const initialGammaRef = useRef<number | null>(null);
    const lastGammaRef = useRef<number>(0);
    const lastCaptureAngleRef = useRef<number>(0);
    const lastTimestampRef = useRef<number>(Date.now());
    const capturedAnglesRef = useRef<Set<number>>(new Set());

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

    // Request gyroscope permission (iOS 13+)
    const requestGyroscopePermission = useCallback(async (): Promise<boolean> => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                return permission === "granted";
            } catch (error) {
                console.error("Gyroscope permission error:", error);
                return false;
            }
        }
        return true; // Non-iOS devices
    }, []);

    // Capture a strip from the video
    const captureStrip = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Capture center strip of video
        const stripWidth = PANORAMA_CONFIG.stripWidth;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const sourceX = (videoWidth - stripWidth) / 2;

        canvas.width = stripWidth;
        canvas.height = videoHeight;

        ctx.drawImage(
            video,
            sourceX, 0, stripWidth, videoHeight,
            0, 0, stripWidth, videoHeight
        );

        return canvas.toDataURL("image/jpeg", 0.85);
    }, []);

    // Gyroscope handler for panorama capture
    useEffect(() => {
        if (!isCapturing || step !== "capturing") return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma === null) return;

            const gamma = event.gamma;
            const now = Date.now();
            const deltaTime = (now - lastTimestampRef.current) / 1000; // seconds

            // Initialize starting position
            if (initialGammaRef.current === null) {
                initialGammaRef.current = gamma;
                lastGammaRef.current = gamma;
                lastTimestampRef.current = now;
                return;
            }

            // Calculate rotation from start
            const rotationFromStart = gamma - initialGammaRef.current;
            const absRotation = Math.abs(rotationFromStart);

            // Calculate speed
            const deltaGamma = Math.abs(gamma - lastGammaRef.current);
            const speed = deltaTime > 0 ? deltaGamma / deltaTime : 0;

            // Update speed status
            if (speed < PANORAMA_CONFIG.minSpeed) {
                setSpeedStatus(deltaTime > 0.5 ? "too_slow" : "idle");
            } else if (speed > PANORAMA_CONFIG.maxSpeed) {
                setSpeedStatus("too_fast");
            } else {
                setSpeedStatus("ok");
            }

            // Update guide arrow position (-1 to 1 based on gamma tilt)
            const normalizedArrow = Math.max(-1, Math.min(1, (gamma - initialGammaRef.current) / 30));
            setGuideArrowOffset(normalizedArrow);

            // Update progress
            const progress = Math.min(1, absRotation / PANORAMA_CONFIG.totalAngle);
            setSweepProgress(progress);

            // Capture at intervals
            const captureAngle = Math.floor(absRotation / PANORAMA_CONFIG.captureInterval) * PANORAMA_CONFIG.captureInterval;

            if (
                captureAngle > 0 &&
                !capturedAnglesRef.current.has(captureAngle) &&
                speed >= PANORAMA_CONFIG.minSpeed &&
                speed <= PANORAMA_CONFIG.maxSpeed
            ) {
                capturedAnglesRef.current.add(captureAngle);
                const strip = captureStrip();
                if (strip) {
                    setCapturedStrips(prev => [...prev, strip]);
                    // Vibration feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(20);
                    }
                }
            }

            // Check if panorama is complete
            if (absRotation >= PANORAMA_CONFIG.totalAngle) {
                finishCapture();
            }

            lastGammaRef.current = gamma;
            lastTimestampRef.current = now;
        };

        window.addEventListener("deviceorientation", handleOrientation);
        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [isCapturing, step, captureStrip]);

    // Finish capture and create panorama
    const finishCapture = useCallback(() => {
        setIsCapturing(false);

        // Create panorama from strips
        if (capturedStrips.length > 0) {
            createPanoramaFromStrips(capturedStrips);
        }
    }, [capturedStrips]);

    // Create panorama from captured strips
    const createPanoramaFromStrips = useCallback((strips: string[]) => {
        if (!panoramaCanvasRef.current || strips.length === 0) return;

        const canvas = panoramaCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Load all strip images
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        strips.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                images[index] = img;
                loadedCount++;

                if (loadedCount === strips.length) {
                    // All images loaded, compose panorama
                    const stripHeight = images[0].height;
                    const stripWidth = images[0].width;
                    const overlap = Math.floor(stripWidth * 0.3);
                    const effectiveWidth = stripWidth - overlap;
                    const totalWidth = stripWidth + effectiveWidth * (images.length - 1);

                    canvas.width = totalWidth;
                    canvas.height = stripHeight;

                    // Draw strips with blending
                    images.forEach((img, i) => {
                        const x = i * effectiveWidth;

                        if (i === 0) {
                            ctx.drawImage(img, 0, 0);
                        } else {
                            // Create gradient blend
                            const gradient = ctx.createLinearGradient(x, 0, x + overlap, 0);
                            gradient.addColorStop(0, "rgba(255,255,255,0)");
                            gradient.addColorStop(1, "rgba(255,255,255,1)");

                            // Draw non-overlapping part
                            ctx.drawImage(
                                img,
                                overlap, 0, stripWidth - overlap, stripHeight,
                                x + overlap, 0, stripWidth - overlap, stripHeight
                            );

                            // Blend overlapping part
                            const tempCanvas = document.createElement("canvas");
                            tempCanvas.width = overlap;
                            tempCanvas.height = stripHeight;
                            const tempCtx = tempCanvas.getContext("2d");

                            if (tempCtx) {
                                tempCtx.drawImage(img, 0, 0, overlap, stripHeight, 0, 0, overlap, stripHeight);
                                tempCtx.globalCompositeOperation = "destination-in";
                                tempCtx.fillStyle = gradient;
                                tempCtx.fillRect(0, 0, overlap, stripHeight);
                                ctx.drawImage(tempCanvas, x, 0);
                            }
                        }
                    });

                    const panoramaDataUrl = canvas.toDataURL("image/jpeg", 0.9);
                    setPanoramaImage(panoramaDataUrl);
                    setStep("viewing");
                    stopCamera();
                    setViewOffset(-totalWidth / 2 + window.innerWidth / 2);
                }
            };
            img.src = src;
        });
    }, [stopCamera]);

    // Start panorama capture
    const startPanoramaCapture = async () => {
        const hasPermission = await requestGyroscopePermission();
        if (!hasPermission) {
            setCameraError("ジャイロスコープの許可が必要です。");
            return;
        }

        await startCamera();
        setStep("capturing");

        // Reset capture state
        initialGammaRef.current = null;
        lastGammaRef.current = 0;
        lastCaptureAngleRef.current = 0;
        capturedAnglesRef.current.clear();
        setCapturedStrips([]);
        setSweepProgress(0);
        setSpeedStatus("idle");

        // Start capture after brief delay for camera to initialize
        setTimeout(() => {
            setIsCapturing(true);
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }, 500);
    };

    // Manual capture for devices without gyroscope
    const captureManualFrame = () => {
        const strip = captureStrip();
        if (strip) {
            const newStrips = [...capturedStrips, strip];
            setCapturedStrips(newStrips);

            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // Update progress
            const progress = newStrips.length / 12; // Expect about 12 strips
            setSweepProgress(Math.min(1, progress));

            // Auto-complete after enough strips
            if (newStrips.length >= 12) {
                createPanoramaFromStrips(newStrips);
            }
        }
    };

    // Complete panorama manually
    const completeManualCapture = () => {
        if (capturedStrips.length >= 3) {
            createPanoramaFromStrips(capturedStrips);
        }
    };

    // Reset capture
    const resetCapture = () => {
        setCapturedStrips([]);
        setPanoramaImage(null);
        setSweepProgress(0);
        setSpeedStatus("idle");
        setIsCapturing(false);
        initialGammaRef.current = null;
        capturedAnglesRef.current.clear();
        setStep("capturing");
        startCamera();

        setTimeout(() => {
            setIsCapturing(true);
        }, 500);
    };

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setStep("intro");
            setIsImpaired(false);
            setIsCapturing(false);
            setCapturedStrips([]);
            setPanoramaImage(null);
            setSweepProgress(0);
            setSpeedStatus("idle");
            setViewOffset(0);
            setGyroscopeEnabled(false);
            setCameraError(null);
            initialGammaRef.current = null;
            capturedAnglesRef.current.clear();
        }
    }, [isOpen, stopCamera]);

    // Prevent body scroll
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

    // Escape key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Panorama viewing - drag handlers
    const handleDragStart = (clientX: number) => {
        if (gyroscopeEnabled) return;
        setIsDragging(true);
        dragStartRef.current = { x: clientX, offset: viewOffset };
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || gyroscopeEnabled) return;
        const delta = clientX - dragStartRef.current.x;
        const maxOffset = panoramaCanvasRef.current
            ? Math.max(0, panoramaCanvasRef.current.width - window.innerWidth)
            : 0;
        setViewOffset(Math.max(-maxOffset, Math.min(0, dragStartRef.current.offset + delta)));
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Gyroscope for panorama viewing
    useEffect(() => {
        if (!gyroscopeEnabled || step !== "viewing") return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma !== null && panoramaCanvasRef.current) {
                const gamma = Math.max(-45, Math.min(45, event.gamma));
                const maxOffset = Math.max(0, panoramaCanvasRef.current.width - window.innerWidth);
                const newOffset = (gamma / 45) * (maxOffset / 2);
                setViewOffset(Math.max(-maxOffset, Math.min(0, -maxOffset / 2 + newOffset)));
            }
        };

        window.addEventListener("deviceorientation", handleOrientation);
        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [gyroscopeEnabled, step]);

    // Toggle vision mode
    const toggleVisionMode = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setIsImpaired(!isImpaired);
    };

    // Request gyroscope for viewing
    const enableGyroscopeViewing = async () => {
        const hasPermission = await requestGyroscopePermission();
        if (hasPermission) {
            setGyroscopeEnabled(true);
        }
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
                {/* Hidden canvases */}
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
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                <Camera size={48} className="text-[var(--text-secondary)]" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
                                パノラマ撮影で体験
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-2 leading-relaxed">
                                iPhoneのパノラマカメラのように、<br />
                                スマホをゆっくり横に動かして撮影します。
                            </p>
                            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mb-8 text-left">
                                <p className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                                    <ChevronRight size={16} className="text-[var(--accent)]" />
                                    撮影ボタンを押してスタート
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                                    <ChevronRight size={16} className="text-[var(--accent)]" />
                                    矢印に合わせてゆっくり右へ回転
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                                    <ChevronRight size={16} className="text-[var(--accent)]" />
                                    完了後、私の見え方を体験
                                </p>
                            </div>
                            <button
                                onClick={startPanoramaCapture}
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

                {/* Step: Capturing (iOS-like sweep) */}
                {step === "capturing" && (
                    <div className="w-full h-full flex flex-col bg-black">
                        {/* Camera view */}
                        <div className="flex-1 relative overflow-hidden">
                            {cameraStream ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                    <p className="text-white/50">カメラを起動中...</p>
                                </div>
                            )}

                            {/* Center guide line */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-yellow-400/80" />

                            {/* Guide arrow (moves with device tilt) */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2"
                                animate={{
                                    left: `${50 + guideArrowOffset * 20}%`,
                                    x: "-50%",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="flex items-center justify-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        speedStatus === "ok"
                                            ? "bg-yellow-400"
                                            : speedStatus === "too_fast"
                                            ? "bg-red-500"
                                            : "bg-white/50"
                                    }`}>
                                        <ChevronRight size={24} className="text-black" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Progress bar */}
                            <div className="absolute bottom-32 left-4 right-4">
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-yellow-400"
                                        animate={{ width: `${sweepProgress * 100}%` }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                    />
                                </div>
                                <p className="text-center text-white/80 text-sm mt-2">
                                    {Math.round(sweepProgress * 100)}%
                                </p>
                            </div>

                            {/* Speed warning */}
                            <AnimatePresence>
                                {speedStatus === "too_fast" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
                                    >
                                        <AlertCircle size={18} />
                                        <span className="font-bold">ゆっくり動かしてください</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Preview strip */}
                            {capturedStrips.length > 0 && (
                                <div className="absolute top-20 left-4 right-4 h-16 bg-black/50 rounded-lg overflow-hidden flex">
                                    {capturedStrips.slice(-10).map((strip, i) => (
                                        <div key={i} className="h-full flex-shrink-0" style={{ width: 20 }}>
                                            <img src={strip} alt="" className="h-full w-full object-cover opacity-80" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Instruction */}
                            <div className="absolute bottom-48 left-1/2 -translate-x-1/2 text-center">
                                <p className="text-white text-lg font-medium drop-shadow-lg">
                                    {isCapturing
                                        ? "ゆっくり右へ回転してください"
                                        : "準備中..."}
                                </p>
                            </div>
                        </div>

                        {/* Manual controls (fallback) */}
                        <div className="p-4 bg-black/90 space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={captureManualFrame}
                                    disabled={!cameraStream}
                                    className="flex-1 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Camera size={20} />
                                    <span>手動撮影</span>
                                </button>
                                {capturedStrips.length >= 3 && (
                                    <button
                                        onClick={completeManualCapture}
                                        className="flex-1 py-3 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-300 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <span>完了 ({capturedStrips.length}枚)</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-center text-white/50 text-xs">
                                ジャイロが動作しない場合は手動で撮影できます
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
                                        onClick={gyroscopeEnabled ? () => setGyroscopeEnabled(false) : enableGyroscopeViewing}
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
