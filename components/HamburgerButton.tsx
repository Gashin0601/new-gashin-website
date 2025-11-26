'use client';

import { useTheme } from '@/hooks/useTheme';

interface HamburgerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function HamburgerButton({ onClick, isOpen }: HamburgerButtonProps) {
  const { theme } = useTheme();
  // In light and normal mode: black lines, light background
  // In dark mode: white lines, dark background
  const isLightOrNormal = theme === 'light' || theme === 'normal';

  return (
    <button
      onClick={onClick}
      className={`fixed top-6 right-6 z-30 p-3 rounded-lg transition-colors shadow-lg ${
        isLightOrNormal
          ? 'bg-white/80 hover:bg-white'
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]'
      }`}
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span
          className={`block h-0.5 w-full transform transition-transform duration-300 ${
            isLightOrNormal ? 'bg-black' : 'bg-[var(--text-primary)]'
          } ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
        />
        <span
          className={`block h-0.5 w-full transition-opacity duration-300 ${
            isLightOrNormal ? 'bg-black' : 'bg-[var(--text-primary)]'
          } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <span
          className={`block h-0.5 w-full transform transition-transform duration-300 ${
            isLightOrNormal ? 'bg-black' : 'bg-[var(--text-primary)]'
          } ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
        />
      </div>
    </button>
  );
}
