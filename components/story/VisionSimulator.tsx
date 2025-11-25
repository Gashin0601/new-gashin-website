"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function VisionSimulator() {
    const [mode, setMode] = useState<"normal" | "impaired">("normal");

    return (
        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl group">
            {/* Background Image (Sample) */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                    backgroundImage: "url('/images/story/sample-panorama-180.jpg')",
                    // Fallback gradient if image missing
                    backgroundColor: "#333"
                }}
            >
                {/* Fallback text if image not loaded */}
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold select-none">
                    VISION SIMULATOR
                </div>
            </div>

            {/* Impaired Vision Overlays */}
            <div
                className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${mode === "impaired" ? "opacity-100" : "opacity-0"
                    }`}
            >
                {/* Left Blindness */}
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-black" />

                {/* Tunnel Vision / Blur on Right Side */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 backdrop-blur-[4px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                <button
                    onClick={() => setMode("normal")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${mode === "normal"
                            ? "bg-white text-black scale-105 shadow-lg"
                            : "bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                        }`}
                >
                    <Eye size={20} />
                    通常の見え方
                </button>
                <button
                    onClick={() => setMode("impaired")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${mode === "impaired"
                            ? "bg-[#222284] text-white scale-105 shadow-lg ring-2 ring-white/20"
                            : "bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                        }`}
                >
                    <EyeOff size={20} />
                    私の見え方
                </button>
            </div>

            {/* Label Overlay */}
            <div className="absolute top-6 left-6 z-20">
                <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
                    {mode === "normal" ? "Normal Vision" : "Gashin's Vision (Left Blindness + Low Vision)"}
                </span>
            </div>
        </div>
    );
}
