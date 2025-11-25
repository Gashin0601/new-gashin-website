"use client";

import Image from "next/image";
import Script from "next/script";
import SocialLink from "../ui/SocialLinks";

export default function DailyAccount() {
    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Account Header */}
                <div className="text-center mb-12 sm:mb-14 md:mb-16 space-y-4 sm:space-y-6">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden shadow-xl border-2 border-white/10">
                        <Image
                            src="/images/profile/gashin_lv.jpeg"
                            alt="Gashin"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">鈴木我信</h2>
                    <p className="text-xs sm:text-sm text-gray-400 font-mono -mt-2 sm:-mt-4">@suzuki_gashin</p>
                    <p className="text-base sm:text-lg text-[var(--text-secondary)]">
                        日々の気づきや活動をXで発信しています。
                    </p>

                    <div className="flex justify-center gap-4 sm:gap-6">
                        <SocialLink platform="x" url="https://x.com/suzuki_gashin" className="text-[var(--sns-x)] hover:scale-110" iconSize={24} />
                        <SocialLink platform="instagram" url="https://instagram.com/suzuki_gashin" className="text-[var(--sns-instagram)] hover:scale-110" iconSize={24} />
                        <SocialLink platform="facebook" url="https://facebook.com/suzuki.gashin" className="text-[var(--sns-facebook)] hover:scale-110" iconSize={24} />
                    </div>
                </div>

                {/* X (Twitter) Embed */}
                <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden">
                    <blockquote className="twitter-tweet">
                        <p lang="ja" dir="ltr">
                            <a href="https://twitter.com/suzuki_gashin/status/1968874968055214136?ref_src=twsrc%5Etfw"></a>
                        </p>
                    </blockquote>
                </div>
            </div>
            <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        </section>
    );
}
