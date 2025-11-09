'use client';

import { useEffect, useState } from 'react';

export function useAudio() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load audio setting from localStorage
    const savedAudioSetting = localStorage.getItem('audioNarration');
    if (savedAudioSetting !== null) {
      setAudioEnabled(savedAudioSetting === 'true');
    } else {
      // Default: detect screen reader
      // For now, default to false unless explicitly enabled
      setAudioEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Save to localStorage
    localStorage.setItem('audioNarration', audioEnabled.toString());
  }, [audioEnabled, mounted]);

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  return { audioEnabled, toggleAudio, mounted };
}
