'use client';

import { useTheme } from '@/hooks/useTheme';

interface HamburgerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function HamburgerButton({ onClick, isOpen }: HamburgerButtonProps) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-30 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors shadow-lg"
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
      style={(theme === 'normal' || theme === 'light') ? {
        '--bg-secondary': '#000000',
        '--text-primary': '#ffffff',
        '--border-color': '#333333',
      } as React.CSSProperties : undefined}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span
          className={`block h-0.5 w-full bg-[var(--text-primary)] transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
        />
        <span
          className={`block h-0.5 w-full bg-[var(--text-primary)] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
            }`}
        />
        <span
          className={`block h-0.5 w-full bg-[var(--text-primary)] transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
        />
      </div>
    </button>
  );
}
