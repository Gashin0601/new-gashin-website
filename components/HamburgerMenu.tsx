'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isStoryPage?: boolean;
}

export function HamburgerMenu({ isOpen, onClose, isStoryPage = false }: HamburgerMenuProps) {
  const { theme, setTheme } = useTheme();
  const { audioEnabled, toggleAudio } = useAudio();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.classList.add('scroll-lock');
      // Focus close button
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        // Trap focus within menu
        if (e.key === 'Tab') {
          const focusableElements = menuRef.current?.querySelectorAll(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.classList.remove('scroll-lock');
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleAudioToggle = () => {
    toggleAudio();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[var(--bg-primary)] border-l border-[var(--border-color)] z-50 shadow-2xl slide-in-right overflow-y-auto"
        style={theme === 'normal' ? {
          '--bg-primary': '#ffffff',
          '--text-primary': '#0b0c10',
          '--text-secondary': '#666666',
          '--bg-secondary': '#f5f5f5',
          '--border-color': '#e0e0e0',
        } as React.CSSProperties : undefined}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="mb-8 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="メニューを閉じる"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Navigation */}
          <nav className="mb-10">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              ナビゲーション
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-lg"
                >
                  トップ
                </Link>
              </li>
              <li>
                <Link
                  href="/story"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-lg"
                >
                  ストーリー
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-lg"
                >
                  ニュース
                </Link>
              </li>
            </ul>
          </nav>

          {/* Settings */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              設定
            </h2>

            {/* Audio Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">🔊</span>
                  <span className="font-medium">音声読み上げ</span>
                </div>
                <button
                  role="switch"
                  aria-checked={audioEnabled}
                  onClick={handleAudioToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${audioEnabled ? 'bg-[var(--accent)]' : 'bg-gray-300'
                    }`}
                  aria-label={`音声読み上げを${audioEnabled ? 'オフ' : 'オン'}にする`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${audioEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2 px-4">
                {audioEnabled ? '音声読み上げが有効です' : '音声読み上げが無効です'}
              </p>
            </div>

            {/* Theme Switcher */}
            <div>
              <div className="flex items-center gap-3 mb-3 px-4">
                <span className="text-xl" aria-hidden="true">🎨</span>
                <span className="font-medium">カラーテーマ</span>
              </div>
              <div
                role="radiogroup"
                aria-label="カラーテーマ"
                className="space-y-2"
              >
                <button
                  role="radio"
                  aria-checked={theme === 'light'}
                  onClick={() => handleThemeChange('light')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${theme === 'light'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>ライトテーマ</span>
                    {theme === 'light' && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                <button
                  role="radio"
                  aria-checked={theme === 'dark'}
                  onClick={() => handleThemeChange('dark')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${theme === 'dark'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>ダークテーマ</span>
                    {theme === 'dark' && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                <button
                  role="radio"
                  aria-checked={theme === 'normal'}
                  onClick={() => handleThemeChange('normal')}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${theme === 'normal'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>通常</span>
                    {theme === 'normal' && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {isStoryPage && (
              <p className="text-sm text-[var(--text-secondary)] px-4 mt-4">
                通常モードではストーリーページは黒テーマで表示されます
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .slide-in-right {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
