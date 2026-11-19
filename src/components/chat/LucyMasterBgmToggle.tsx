import React, { useEffect, useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';
import { isLucyMasterBgmPlaying, subscribeLucyMasterBgm, toggleLucyMasterBgm } from '@/lib/lucyMasterBgm';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/** 🔮 루시 마스터 배경음 켜기/끄기 버튼 */
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
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-all active:scale-95 ${
        playing
          ? 'bg-purple-500/25 border-purple-300/50 text-purple-100 shadow-[0_0_12px_#a855f766]'
          : 'bg-slate-900/60 border-white/15 text-slate-400'
      } ${className}`}
    >
      {playing ? <Music2 size={13} className="animate-pulse" /> : <VolumeX size={13} />}
      <span>{playing ? '배경음 ON' : '배경음 OFF'}</span>
    </button>
  );
}
