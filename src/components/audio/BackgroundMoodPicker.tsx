import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Sparkles,
} from 'lucide-react';
import { useMoodSound } from '@/hooks/useMoodSound';
import { MoodSoundId } from '@/lib/moodSoundEngine';

interface EnvironmentAtmosphere {
  gradient: string;
  radialCore: string;
  secondaryColor: string;
  vignetteColor: string;
  particleGlow: string;
  keyword: string;
}

const ENVIRONMENT_ATMOSPHERES: Record<MoodSoundId, EnvironmentAtmosphere> = {
  rain: {
    gradient: 'linear-gradient(145deg, rgba(3, 105, 161, 0.42) 0%, rgba(12, 74, 110, 0.28) 45%, rgba(2, 6, 23, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(56, 189, 248, 0.4) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)',
    secondaryColor: '#0284c7',
    vignetteColor: 'rgba(3, 105, 161, 0.32)',
    particleGlow: 'rgba(56, 189, 248, 0.6)',
    keyword: '촉촉한 밤비의 잔향과 서늘한 청명함',
  },
  forest: {
    gradient: 'linear-gradient(145deg, rgba(5, 150, 105, 0.42) 0%, rgba(6, 78, 59, 0.28) 45%, rgba(2, 44, 34, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 75%)',
    secondaryColor: '#059669',
    vignetteColor: 'rgba(5, 150, 105, 0.3)',
    particleGlow: 'rgba(52, 211, 153, 0.6)',
    keyword: '햇살이 비치는 깊은 숲과 싱그러운 솔바람',
  },
  whitenoise: {
    gradient: 'linear-gradient(145deg, rgba(124, 58, 237, 0.38) 0%, rgba(76, 29, 149, 0.28) 45%, rgba(15, 23, 42, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(167, 139, 250, 0.38) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 75%)',
    secondaryColor: '#7c3aed',
    vignetteColor: 'rgba(124, 58, 237, 0.28)',
    particleGlow: 'rgba(167, 139, 250, 0.6)',
    keyword: '잡념과 소음이 지워지는 고요한 벨벳 공간',
  },
  ocean: {
    gradient: 'linear-gradient(145deg, rgba(8, 145, 178, 0.42) 0%, rgba(21, 94, 117, 0.28) 45%, rgba(8, 51, 68, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(6, 182, 212, 0.4) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 75%)',
    secondaryColor: '#0891b2',
    vignetteColor: 'rgba(8, 145, 178, 0.3)',
    particleGlow: 'rgba(6, 182, 212, 0.6)',
    keyword: '끝없이 밀려왔다 물러서는 밤바다의 숨결',
  },
  binaural: {
    gradient: 'linear-gradient(145deg, rgba(217, 119, 6, 0.42) 0%, rgba(180, 83, 9, 0.28) 45%, rgba(69, 26, 3, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%)',
    secondaryColor: '#d97706',
    vignetteColor: 'rgba(217, 119, 6, 0.3)',
    particleGlow: 'rgba(245, 158, 11, 0.6)',
    keyword: '432Hz 솔페지오 황금빛 공명과 내면의 조화',
  },
  fireplace: {
    gradient: 'linear-gradient(145deg, rgba(234, 88, 12, 0.42) 0%, rgba(154, 52, 18, 0.28) 45%, rgba(67, 20, 7, 0.88) 100%)',
    radialCore: 'radial-gradient(circle at 50% 18%, rgba(249, 115, 22, 0.4) 0%, rgba(234, 88, 12, 0.15) 50%, transparent 75%)',
    secondaryColor: '#ea580c',
    vignetteColor: 'rgba(234, 88, 12, 0.32)',
    particleGlow: 'rgba(249, 115, 22, 0.6)',
    keyword: '타오르는 장작의 따스한 온기와 타닥거림',
  },
};

export function BackgroundMoodPicker() {
  const {
    isPlaying,
    activeMood,
    volume,
    isPickerOpen,
    presets,
    currentPreset,
    togglePlay,
    setMood,
    setVolume,
    closePicker,
  } = useMoodSound();

  const barRef = useRef<HTMLDivElement | null>(null);

  const atmosphere = useMemo(() => {
    return ENVIRONMENT_ATMOSPHERES[activeMood] || ENVIRONMENT_ATMOSPHERES.rain;
  }, [activeMood]);

  // Click outside to collapse the horizontal bar
  useEffect(() => {
    if (!isPickerOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        closePicker();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isPickerOpen, closePicker]);

  if (!isPickerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={barRef}
        initial={{ opacity: 0, scale: 0.94, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -4 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-safe-2 left-2 sm:left-4 md:top-safe-4 md:left-6 z-[350] h-11 flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full bg-zinc-950/94 backdrop-blur-2xl border text-white max-w-[calc(100vw-16px)] sm:max-w-fit shadow-2xl transition-colors select-none isolate"
        style={{
          borderColor: `${currentPreset.color}50`,
          boxShadow: `0 8px 30px -4px rgba(0, 0, 0, 0.75), 0 0 16px ${atmosphere.vignetteColor}`,
        }}
      >
        {/* Leading Play/Pause & Active Mood Glyph Button (Maintains Button Height & Visual State) */}
        <button
          type="button"
          onClick={() => togglePlay()}
          className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-transform group"
          style={{
            backgroundColor: `${currentPreset.color}25`,
            border: `1px solid ${currentPreset.color}60`,
            boxShadow: `0 0 12px ${atmosphere.particleGlow}`,
          }}
          title={isPlaying ? `${currentPreset.name} 일시정지` : `${currentPreset.name} 재생`}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3 px-0.5">
              {[0.4, 1, 0.6].map((scale, i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [scale, 1, 0.3, scale] }}
                  transition={{
                    duration: 0.65 + i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-[2px] h-3 rounded-full origin-bottom"
                  style={{ backgroundColor: currentPreset.color }}
                />
              ))}
            </div>
          ) : (
            <Play
              size={13}
              fill="currentColor"
              className="ml-0.5 text-white/90 group-hover:scale-110 transition-transform"
              style={{ color: currentPreset.color }}
            />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-4 w-[1px] bg-white/15 shrink-0" />

        {/* Horizontal Sound Presets Strip (가로로 펼쳐지는 앰비언트 무드 칩 목록) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-180px)] sm:max-w-none">
          {presets.map((preset) => {
            const isSelected = activeMood === preset.id;
            const isCurrentlyActiveAndPlaying = isSelected && isPlaying;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    togglePlay();
                  } else {
                    setMood(preset.id);
                    if (!isPlaying) togglePlay(preset.id);
                  }
                }}
                className={`h-7 px-2 sm:px-2.5 rounded-full flex items-center gap-1.5 shrink-0 text-xs transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'text-white font-bold shadow-md'
                    : 'bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white border border-transparent'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${preset.color}35`,
                        border: `1px solid ${preset.color}80`,
                        boxShadow: `0 0 10px ${preset.color}45`,
                      }
                    : {}
                }
                title={`${preset.name} (${preset.nameEn}) - ${preset.description}`}
              >
                <span className="text-xs leading-none">{preset.emoji}</span>
                <span className="text-[11px] sm:text-xs whitespace-nowrap leading-none">
                  {preset.name}
                </span>

                {/* Micro animated indicator for active playing sound */}
                {isCurrentlyActiveAndPlaying ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping ml-0.5 shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                ) : isSelected ? (
                  <span
                    className="w-1 h-1 rounded-full ml-0.5 shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-[1px] bg-white/15 shrink-0" />

        {/* Compact Volume Control */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setVolume(volume > 0 ? 0 : 0.6)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title={volume === 0 ? '음소거 해제' : '음소거'}
          >
            {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 sm:w-16 h-1 rounded-full bg-white/20 accent-emerald-400 cursor-pointer"
            title={`볼륨: ${Math.round(volume * 100)}%`}
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-[1px] bg-white/15 shrink-0" />

        {/* Collapse / Close Button */}
        <button
          type="button"
          onClick={closePicker}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:scale-90 transition-all shrink-0 cursor-pointer"
          title="배경음 패널 접기"
          aria-label="배경음 패널 접기"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
