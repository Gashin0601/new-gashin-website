"use client";

import { Mail } from "lucide-react";

export default function Contact() {
    return (
        <section
            className="py-12 md:py-16 bg-[var(--bg-secondary)]"
            aria-label="お問い合わせ"
        >
            <div className="max-w-2xl mx-auto px-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                    お問い合わせ
                </h2>
                <p className="text-[var(--text-secondary)] mb-6">
                    メディア取材・講演依頼・開発のお仕事など、お気軽にご連絡ください。
                </p>
                <a
                    href="mailto:gashin@keio.jp"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full hover:opacity-80 transition-opacity font-medium"
                    aria-label="メールで問い合わせる gashin@keio.jp"
                >
                    <Mail size={20} aria-hidden="true" />
                    <span>gashin@keio.jp</span>
                </a>
            </div>
        </section>
    );
}
