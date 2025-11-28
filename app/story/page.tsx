"use client";

// import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { EyeOff } from "lucide-react";
// import VisionSimulator from "@/components/story/VisionSimulator";

export default function StoryPage() {
    // const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    return (
        <main
            className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center"
            aria-label="鈴木我信のストーリーページ"
        >
            {/* 準備中メッセージ */}
            <div className="text-center px-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    現在、準備中です
                </h1>
                <p className="text-[var(--text-secondary)] mb-8">
                    Coming Soon...
                </p>

                {/* 視覚体験ボタン - 準備中のためコメントアウト
                <button
                    onClick={() => setIsSimulatorOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full font-medium hover:opacity-80 transition-opacity mb-6"
                    aria-label="私の見え方を体験する"
                >
                    <EyeOff size={20} aria-hidden="true" />
                    <span>私の見え方を体験する</span>
                </button>
                */}

                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--border-color)]"
                        aria-label="トップページへ戻る"
                    >
                        <ArrowLeft size={20} aria-hidden="true" />
                        <span>TOPへ戻る</span>
                    </Link>
                </div>
            </div>

            {/* 視覚シミュレーター - 準備中のためコメントアウト
            <VisionSimulator
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
            />
            */}
        </main>
    );
}
