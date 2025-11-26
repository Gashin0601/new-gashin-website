'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
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
        className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-white border-l border-gray-200 z-50 shadow-2xl slide-in-right overflow-y-auto"
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="mb-8 p-2 rounded-lg hover:bg-gray-100 transition-colors text-black"
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
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg text-black"
                >
                  トップ
                </Link>
              </li>
              <li>
                <Link
                  href="/story"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg text-black"
                >
                  ストーリー
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg text-black"
                >
                  ニュース
                </Link>
              </li>
            </ul>
          </nav>
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
