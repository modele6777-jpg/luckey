import React, { useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import { isLucyMasterBgmPlaying, subscribeLucyMasterBgm, toggleLucyMasterBgm } from '@/lib/lucyMasterBgm';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { GUIDE_BUTTON_ICON_SIZE } from '@/components/guide/guideButtonLayout';

/** 🔮 루시 프로 헤더 배경음. 켜지면 다른 헤더 아이콘처럼 노란색이 된다. */
export function LucyMasterBgmToggle({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = useState(isLucyMasterBgmPlaying);
  useEffect(() => subscribeLucyMasterBgm(setPlaying), []);
  return (
    <button
      type="button"
      onClick={() => { triggerHaptic('whitehole'); void toggleLucyMasterBgm(); }}
      aria-pressed={playing}
      aria-label={playing ? '배경음 끄기' : '배경음 켜기'}
      title={playing ? '배경음 끄기' : '배경음 켜기'}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none transition-all duration-200 active:scale-95 hover:opacity-70 ${className}`}
    >
      <Music size={GUIDE_BUTTON_ICON_SIZE} aria-hidden="true" />
    </button>
  );
}
