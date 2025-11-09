'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HamburgerButton } from '@/components/HamburgerButton';
import { HamburgerMenu } from '@/components/HamburgerMenu';

export default function StoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerButton onClick={() => setMenuOpen(true)} isOpen={menuOpen} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isStoryPage />

      <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">ストーリーページ</h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8">
            Coming Soon...
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </>
  );
}
