"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SocialLink from "../ui/SocialLinks";

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
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Account Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-2 border-white/10">
                        <Image
                            src="/images/profile/suzuki_gashin.jpeg"
                            alt="鈴木我信"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">鈴木我信</h2>
                    <p className="text-sm text-gray-400 font-mono -mt-4">@suzuki_gashin</p>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        日々の気づきや活動をXで発信しています。
                    </p>

                    <div className="flex justify-center gap-6">
                        <SocialLink platform="x" url="https://x.com/suzuki_gashin" className="text-[var(--sns-x)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="instagram" url="https://instagram.com/suzuki_gashin" className="text-[var(--sns-instagram)] hover:scale-110" iconSize={32} />
                        <SocialLink platform="facebook" url="https://facebook.com/suzuki.gashin" className="text-[var(--sns-facebook)] hover:scale-110" iconSize={32} />
                    </div>
                </div>

                {/* X (Twitter) Embed */}
                <div className="max-w-md mx-auto">
                    <div ref={tweetContainerRef} className="bg-white rounded-xl overflow-hidden min-h-[200px]">
                        {isLoading && !hasError && (
                            <div className="flex items-center justify-center h-[200px]">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                        {hasError && (
                            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                                <p className="mb-2">投稿を読み込めませんでした</p>
                                <a
                                    href="https://x.com/suzuki_gashin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Xで見る →
                                </a>
                            </div>
                        )}
                        <blockquote
                            className="twitter-tweet"
                            data-lang="ja"
                            data-dnt="true"
                            data-theme="light"
                        >
                            <a href="https://twitter.com/suzuki_gashin/status/1968874968055214136"></a>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}
