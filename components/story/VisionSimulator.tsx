"use client";

import { useState, useRef, useEffect, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Camera, RotateCcw, Play, AlertTriangle } from "lucide-react";

// Error Boundary to catch crashes
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode; onReset: () => void }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("VisionSimulator Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
                    <div className="text-center text-white">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                        <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
                        <p className="text-white/70 mb-4 text-sm">{this.state.error?.message}</p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                this.props.onReset();
                            }}
                            className="px-6 py-3 bg-white text-black rounded-full font-bold"
                        >
                            やり直す
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

interface VisionSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "permission" | "capturing" | "viewing";

export default function VisionSimulator({ isOpen, onClose }: VisionSimulatorProps) {
    const [step, setStep] = useState<Step>("permission");
    const [isImpaired, setIsImpaired] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [panorama, setPanorama] = useState<string | null>(null);
    const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [initialGamma, setInitialGamma] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [debugLog, setDebugLog] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const shutterAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize shutter sound
    useEffect(() => {
        if (typeof window !== "undefined") {
            shutterAudioRef.current = new Audio("/sounds/shutter.mp3");
            shutterAudioRef.current.volume = 0.5;
        }
    }, []);

    // iOS detection
    const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setStep("permission");
            setCameraReady(false);
            setError(null);
            setPhotos([]);
            setPanorama(null);
            setInitialGamma(null);
            setProgress(0);
            setIsImpaired(false);
        }
    }, [isOpen]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Add debug log
    const addLog = (msg: string) => {
        console.log(msg);
        setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    // Request all permissions and start camera
    const requestPermissions = async () => {
        setError(null);
        addLog("開始: requestPermissions");

        // 1. Request gyroscope permission (iOS 13+)
        addLog(`iOS検出: ${isIOS}`);
        addLog(`requestPermission存在: ${typeof (DeviceOrientationEvent as any).requestPermission === "function"}`);

        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                addLog("ジャイロ許可リクエスト中...");
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                addLog(`ジャイロ許可結果: ${permission}`);
                if (permission !== "granted") {
                    setError("ジャイロセンサーの許可が必要です。");
                    return;
                }
            } catch (e: any) {
                addLog(`ジャイロエラー: ${e.message || e}`);
                // Continue without gyroscope
            }
        } else {
            addLog("ジャイロ許可不要（非iOS or 古いバージョン）");
        }

        // 2. Start camera
        addLog("カメラ開始中...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });
            addLog("カメラストリーム取得成功");

            streamRef.current = stream;

            // Move to capturing step first
            setStep("capturing");
            addLog("ステップ変更: capturing");

            // Then set up video
            setTimeout(() => {
                if (videoRef.current) {
                    addLog("video要素にストリーム設定中...");
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", "true");
                    videoRef.current.setAttribute("webkit-playsinline", "true");
                    videoRef.current.muted = true;

                    videoRef.current.onloadedmetadata = () => {
                        addLog("メタデータ読み込み完了");
                        videoRef.current?.play().then(() => {
                            addLog("ビデオ再生開始成功");
                            setCameraReady(true);
                        }).catch((e) => {
                            addLog(`再生エラー: ${e.message}`);
                        });
                    };

                    videoRef.current.onerror = (e) => {
                        addLog(`video要素エラー: ${e}`);
                    };
                } else {
                    addLog("ERROR: videoRef.current is null");
                }
            }, 100);

        } catch (e: any) {
            addLog(`カメラエラー: ${e.name} - ${e.message}`);
            if (e.name === "NotAllowedError") {
                setError("カメラの許可が必要です。ブラウザの設定を確認してください。");
            } else {
                setError(`カメラエラー: ${e.message}`);
            }
        }
    };

    // Refs for auto-capture
    const initialGammaRef = useRef<number | null>(null);
    const lastCaptureProgressRef = useRef<number>(-1);
    const isCapturingRef = useRef<boolean>(false);

    // Gyroscope event handler with auto-capture
    useEffect(() => {
        if (step !== "capturing" || !cameraReady) return;

        // Reset refs when starting
        initialGammaRef.current = null;
        lastCaptureProgressRef.current = -1;
        isCapturingRef.current = false;

        addLog("ジャイロリスナー開始 (自動撮影ON)");

        const handleOrientation = (e: DeviceOrientationEvent) => {
            try {
                if (e.gamma === null) return;

                const gamma = e.gamma;

                setGyroData({
                    alpha: e.alpha || 0,
                    beta: e.beta || 0,
                    gamma: gamma,
                });

                // Initialize starting position
                if (initialGammaRef.current === null) {
                    initialGammaRef.current = gamma;
                    setInitialGamma(gamma);
                    addLog(`初期位置設定: ${gamma.toFixed(1)}°`);
                    return;
                }

                // Calculate rotation from start
                const rotation = gamma - initialGammaRef.current;
                const absRotation = Math.abs(rotation);

                // Progress: 0-100% based on 60 degree rotation
                const newProgress = Math.min(100, Math.round((absRotation / 60) * 100));
                setProgress(newProgress);

                // Auto-capture every 20% progress (at 20, 40, 60, 80%)
                // Only capture if we've moved past a threshold
                const captureInterval = 20;
                const currentThreshold = Math.floor(newProgress / captureInterval) * captureInterval;

                if (currentThreshold > lastCaptureProgressRef.current &&
                    currentThreshold >= 20 &&
                    currentThreshold <= 80 &&
                    !isCapturingRef.current) {

                    // Prevent rapid captures
                    isCapturingRef.current = true;
                    lastCaptureProgressRef.current = currentThreshold;

                    addLog(`自動撮影開始: ${currentThreshold}%`);

                    // Capture photo safely
                    try {
                        if (videoRef.current && canvasRef.current) {
                            const video = videoRef.current;
                            const canvas = canvasRef.current;
                            const ctx = canvas.getContext("2d");

                            if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                ctx.drawImage(video, 0, 0);

                                const photo = canvas.toDataURL("image/jpeg", 0.8);
                                setPhotos(prev => {
                                    if (prev.length >= 5) return prev;
                                    return [...prev, photo];
                                });

                                addLog(`撮影完了: ${currentThreshold}%`);

                                // Shutter sound
                                try {
                                    if (shutterAudioRef.current) {
                                        shutterAudioRef.current.currentTime = 0;
                                        shutterAudioRef.current.play().catch(() => {});
                                    }
                                } catch (soundErr) {
                                    // Ignore sound errors
                                }

                                // Vibration
                                try {
                                    if (navigator.vibrate) {
                                        navigator.vibrate(50);
                                    }
                                } catch (vibrateErr) {
                                    // Ignore vibration errors
                                }
                            }
                        }
                    } catch (captureErr: any) {
                        addLog(`撮影エラー: ${captureErr.message}`);
                    }

                    // Allow next capture after delay
                    setTimeout(() => {
                        isCapturingRef.current = false;
                    }, 500);
                }
            } catch (err: any) {
                addLog(`ジャイロエラー: ${err.message}`);
            }
        };

        window.addEventListener("deviceorientation", handleOrientation, true);
        return () => {
            window.removeEventListener("deviceorientation", handleOrientation, true);
        };
    }, [step, cameraReady, addLog]);

    // Capture a photo from video
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) {
            addLog("撮影失敗: video/canvasがnull");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            addLog("撮影失敗: contextがnull");
            return;
        }

        // Check if video is actually playing
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            addLog("撮影失敗: videoサイズが0");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const photo = canvas.toDataURL("image/jpeg", 0.8);
        setPhotos(prev => {
            if (prev.length >= 6) {
                addLog("撮影スキップ: 既に6枚");
                return prev;
            }
            addLog(`撮影成功: ${prev.length + 1}枚目`);
            return [...prev, photo];
        });

        // Shutter sound
        if (shutterAudioRef.current) {
            shutterAudioRef.current.currentTime = 0;
            shutterAudioRef.current.play().catch(() => {});
        }

        // Vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, [addLog]);

    // Manual capture button
    const handleManualCapture = () => {
        capturePhoto();
    };

    // Create panorama from photos
    const createPanorama = useCallback(() => {
        if (photos.length < 3 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Load all images
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        photos.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                images[index] = img;
                loadedCount++;

                if (loadedCount === photos.length) {
                    // Calculate panorama dimensions
                    const imgHeight = images[0].height;
                    const stripWidth = Math.floor(images[0].width / 2);
                    const totalWidth = stripWidth * images.length;

                    canvas.width = totalWidth;
                    canvas.height = imgHeight;

                    // Draw each image strip
                    images.forEach((img, i) => {
                        const srcX = Math.floor((img.width - stripWidth) / 2);
                        ctx.drawImage(
                            img,
                            srcX, 0, stripWidth, imgHeight,
                            i * stripWidth, 0, stripWidth, imgHeight
                        );
                    });

                    const panoramaUrl = canvas.toDataURL("image/jpeg", 0.9);
                    setPanorama(panoramaUrl);
                    setStep("viewing");

                    // Stop camera
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                    }
                }
            };
            img.src = src;
        });
    }, [photos]);

    // Complete capture
    const handleComplete = () => {
        if (photos.length >= 3) {
            createPanorama();
        }
    };

    // Reset and try again
    const handleReset = () => {
        setPhotos([]);
        setPanorama(null);
        setInitialGamma(null);
        setProgress(0);
        setStep("permission");
        setCameraReady(false);
    };

    // Toggle vision mode
    const toggleVision = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        setIsImpaired(!isImpaired);
    };

    if (!isOpen) return null;

    return (
        <ErrorBoundary onReset={handleReset}>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black"
                >
                    {/* Hidden canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-3 bg-black/50 rounded-full text-white"
                    >
                        <X size={24} />
                    </button>

                {/* Step 1: Permission request */}
                {step === "permission" && (
                    <div className="h-full flex flex-col items-center justify-center px-6 text-white">
                        <Camera size={64} className="mb-6 opacity-50" />
                        <h2 className="text-2xl font-bold mb-4">パノラマ撮影</h2>
                        <p className="text-center text-white/70 mb-8 max-w-sm">
                            カメラとジャイロセンサーを使用します。<br />
                            許可を求めるダイアログが表示されたら「許可」をタップしてください。
                        </p>
                        <button
                            onClick={requestPermissions}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-2"
                        >
                            <Play size={24} />
                            撮影を開始
                        </button>
                        {error && (
                            <p className="mt-4 text-red-400 text-center text-sm max-w-sm">{error}</p>
                        )}
                        {/* Debug log */}
                        {debugLog.length > 0 && (
                            <div className="mt-6 w-full max-w-sm bg-black/50 rounded-lg p-3 text-xs font-mono text-green-400 max-h-40 overflow-y-auto">
                                {debugLog.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Capturing */}
                {step === "capturing" && (
                    <div className="h-full relative">
                        {/* Video element - fullscreen */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ transform: "scaleX(1)" }}
                        />

                        {/* Loading indicator */}
                        {!cameraReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                <div className="text-center text-white px-6">
                                    <div className="animate-spin w-10 h-10 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                                    <p className="mb-4">カメラを起動中...</p>
                                    {/* Debug log while loading */}
                                    {debugLog.length > 0 && (
                                        <div className="bg-black/50 rounded-lg p-3 text-xs font-mono text-green-400 max-h-48 overflow-y-auto text-left">
                                            {debugLog.map((log, i) => (
                                                <div key={i}>{log}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* UI Overlay */}
                        {cameraReady && (
                            <>
                                {/* Gyroscope info + Debug log */}
                                <div className="absolute top-16 left-4 right-4 z-20">
                                    <div className="bg-black/80 rounded-lg p-3 text-white text-sm font-mono">
                                        <div>γ: {gyroData.gamma.toFixed(1)}° | 進捗: {progress}%</div>
                                        <div className="text-xs text-white/60 mt-1">
                                            撮影済み: {photos.length}/6枚
                                        </div>
                                        {/* Debug log */}
                                        <div className="mt-2 pt-2 border-t border-white/20 text-xs text-green-400 max-h-24 overflow-y-auto">
                                            {debugLog.slice(-5).map((log, i) => (
                                                <div key={i}>{log}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Photo thumbnails */}
                                {photos.length > 0 && (
                                    <div className="absolute top-32 left-4 right-4 z-20 flex gap-1 overflow-x-auto">
                                        {photos.map((photo, i) => (
                                            <img
                                                key={i}
                                                src={photo}
                                                alt={`Photo ${i + 1}`}
                                                className="h-12 w-auto rounded border border-white/30"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Center guide */}
                                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-yellow-400/80 z-10" />

                                {/* Progress bar */}
                                <div className="absolute bottom-36 left-4 right-4 z-20">
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all duration-200"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-white text-sm mt-2">
                                        {photos.length === 0
                                            ? "スマホを右にゆっくり回してください"
                                            : photos.length < 5
                                            ? `撮影中... あと${5 - photos.length}枚`
                                            : "撮影完了！「完了」を押してください"}
                                    </p>
                                </div>

                                {/* Manual capture button */}
                                <div className="absolute bottom-8 left-4 right-4 z-20 flex gap-3">
                                    <button
                                        onClick={handleManualCapture}
                                        disabled={photos.length >= 5}
                                        className="flex-1 py-4 bg-white text-black rounded-full font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Camera size={20} />
                                        手動撮影 ({photos.length}/5)
                                    </button>
                                    {photos.length >= 3 && (
                                        <button
                                            onClick={handleComplete}
                                            className="flex-1 py-4 bg-yellow-400 text-black rounded-full font-bold flex items-center justify-center"
                                        >
                                            完了
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 3: Viewing panorama */}
                {step === "viewing" && panorama && (
                    <div className="h-full flex flex-col">
                        {/* Panorama image */}
                        <div className="flex-1 relative overflow-x-auto overflow-y-hidden">
                            <img
                                src={panorama}
                                alt="パノラマ"
                                className="h-full w-auto max-w-none"
                                draggable={false}
                            />

                            {/* Vision impairment overlay */}
                            {isImpaired && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Left eye blind */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "linear-gradient(to right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 45%, rgba(0,0,0,0) 55%)",
                                        }}
                                    />
                                    {/* Tunnel vision */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "radial-gradient(ellipse 30% 40% at 70% 50%, transparent 0%, transparent 50%, rgba(0,0,0,0.9) 100%)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Mode badge */}
                        <div className={`absolute top-16 left-4 z-20 px-4 py-2 rounded-full text-sm font-bold ${
                            isImpaired ? "bg-orange-500 text-white" : "bg-white/20 text-white"
                        }`}>
                            {isImpaired ? "弱視モード" : "通常モード"}
                        </div>

                        {/* Controls */}
                        <div className="p-4 pb-8 bg-black space-y-3">
                            <button
                                onClick={toggleVision}
                                className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 ${
                                    isImpaired
                                        ? "bg-white/20 text-white"
                                        : "bg-white text-black"
                                }`}
                            >
                                {isImpaired ? <Eye size={24} /> : <EyeOff size={24} />}
                                {isImpaired ? "通常の見え方に戻す" : "私の見え方を体験"}
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full py-3 rounded-full font-medium bg-white/10 text-white flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} />
                                撮り直す
                            </button>
                        </div>
                    </div>
                )}
                </motion.div>
            </AnimatePresence>
        </ErrorBoundary>
    );
}
