"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SocialLink from "../ui/SocialLinks";
import { useTheme } from "@/hooks/useTheme";

declare global {
    interface Window {
        twttr?: {
            widgets: {
                load: (element?: HTMLElement) => Promise<void>;
            };
        };
    }
}

export default function DailyAccount() {
    const tweetContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const loadTwitterWidget = () => {
            // If twttr is already loaded, use it
            if (window.twttr?.widgets) {
                window.twttr.widgets.load(tweetContainerRef.current || undefined)
                    .then(() => setIsLoading(false))
                    .catch(() => setHasError(true));
                return;
            }

            // Load the Twitter widget script
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';

            script.onload = () => {
                // Wait a bit for twttr to initialize
                setTimeout(() => {
                    if (window.twttr?.widgets) {
                        window.twttr.widgets.load(tweetContainerRef.current || undefined)
                            .then(() => setIsLoading(false))
                            .catch(() => setHasError(true));
                    } else {
                        setHasError(true);
                    }
                }, 100);
            };

            script.onerror = () => {
                setHasError(true);
                setIsLoading(false);
            };

            document.body.appendChild(script);
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(loadTwitterWidget, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            className="py-24 bg-[var(--bg-primary)]"
            aria-label="鈴木我信 - 日常アカウント"
        >
            <div className="max-w-6xl mx-auto px-6">
                {/* Account Header */}
                <header className="text-center mb-16 space-y-6">
                    <div
                        className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-2 border-white/10"
                        role="img"
                        aria-label="鈴木我信のプロフィール画像"
                    >
                        <Image
                            src="/images/profile/suzuki_gashin.jpeg"
                            alt=""
                            fill
                            className="object-cover"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]" id="daily-account-title">
                        鈴木我信
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] font-mono -mt-4" aria-label="ユーザー名 アット suzuki_gashin">
                        @suzuki_gashin
                    </p>
                    <p
                        className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg"
                        id="daily-account-description"
                    >
                        日々の気づきや活動をXで発信しています。
                    </p>

                    <nav
                        className="flex justify-center gap-6"
                        aria-label="鈴木我信のソーシャルメディアリンク"
                    >
                        <SocialLink platform="x" url="https://x.com/suzuki_gashin" className="hover:scale-110" iconSize={32} />
                        <SocialLink platform="instagram" url="https://instagram.com/suzuki_gashin" className="text-[var(--sns-instagram)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="facebook" url="https://facebook.com/suzuki.gashin" className="text-[var(--sns-facebook)] hover:scale-110" iconSize={32} />
                    </nav>
                </header>

                {/* X (Twitter) Embed */}
                <div
                    className="max-w-md mx-auto"
                    role="region"
                    aria-label="鈴木我信の最新のX（Twitter）投稿"
                >
                    <div ref={tweetContainerRef} className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden min-h-[200px]">
                        {isLoading && !hasError && (
                            <div
                                className="flex items-center justify-center h-[200px]"
                                role="status"
                                aria-label="投稿を読み込み中"
                            >
                                <div className="w-8 h-8 border-4 border-[var(--border-color)] border-t-[var(--text-secondary)] rounded-full animate-spin" aria-hidden="true"></div>
                                <span className="sr-only">読み込み中...</span>
                            </div>
                        )}
                        {hasError && (
                            <div
                                className="flex flex-col items-center justify-center h-[200px] text-[var(--text-secondary)]"
                                role="alert"
                            >
                                <p className="mb-2">投稿を読み込めませんでした</p>
                                <a
                                    href="https://x.com/suzuki_gashin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--accent)] hover:underline"
                                    aria-label="鈴木我信のXアカウントを新しいタブで開く"
                                >
                                    Xで見る →
                                </a>
                            </div>
                        )}
                        <blockquote
                            className="twitter-tweet"
                            data-lang="ja"
                            data-dnt="true"
                            data-theme={resolvedTheme}
                        >
                            <a href="https://twitter.com/suzuki_gashin/status/1968874968055214136">鈴木我信のツイート</a>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}
