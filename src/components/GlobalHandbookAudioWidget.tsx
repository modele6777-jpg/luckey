import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  BookOpen,
  Volume2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  handbookAudioService,
  HandbookAudioState,
} from '@/services/handbookAudioService';
import { ALL_CHANNELS } from '@/data/handbookData';
import { safeSessionStorage } from '@/utils/safeStorage';

export const GlobalHandbookAudioWidget: React.FC = () => {
  const [location, navigate] = useLocation();
  const [audioState, setAudioState] = useState<HandbookAudioState>(() =>
    handbookAudioService.getState()
  );
  const [isMinimized, setIsMinimized] = useState(false);

  const widgetRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return handbookAudioService.subscribe((state) => {
      setAudioState(state);
    });
  }, []);

  // Click outside to collapse/minimize when expanded
  useEffect(() => {
    if (isMinimized) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsMinimized(true);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMinimized]);

  // Do not show widget if on the dedicated handbook page or if audio is not playing
  const isHandbookPage = location.startsWith('/handbook');
  if (isHandbookPage || !audioState.isPlaying || !audioState.activeSegment) {
    return null;
  }

  const channelMeta =
    ALL_CHANNELS.find((c) => c.id === audioState.activeSegment?.channel) ||
    ALL_CHANNELS[0];

  const handleGoToHandbook = () => {
    if (!audioState.activeSegment) return;
    try {
      safeSessionStorage.setItem(
        'prism_pending_handbook_theme',
        audioState.activeSegment.channel
      );
    } catch (_) {}
    navigate(
      `/handbook?channel=${audioState.activeSegment.channel}&chapter=${audioState.activeSegment.chapterIndex}`
    );
  };

  const getModeLabel = () => {
    switch (audioState.activePlaybackMode) {
      case 'all':
        return '🌈 7채널 대완독';
      case 'channel':
        return `📖 ${channelMeta.name} 완독`;
      case 'chapter':
        return '📑 챕터 낭독';
      default:
        return '🎧 핸드북 낭독';
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        aria-label="핸드북 백그라운드 오디오 플레이어"
        className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-[80] max-w-[calc(100vw-24px)] md:max-w-md"
      >
        <div
          ref={widgetRef}
          className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0e101f]/95 p-3 sm:p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all"
          style={{
            boxShadow: `0 10px 30px -5px ${channelMeta.glowColor || 'rgba(234,179,8,0.25)'}`,
          }}
        >
          {/* Top colored accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: channelMeta.dotColor?.replace('bg-', '') || '#eab308' }}
          />

          {isMinimized ? (
            /* Minimized compact pill */
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleGoToHandbook}
                className="flex items-center gap-2 text-left group min-w-0"
                title="핸드북 화면으로 이동"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${channelMeta.bgActive}`}
                >
                  <channelMeta.icon size={14} className={channelMeta.textActive} />
                </div>
                <div className="min-w-0 truncate">
                  <p className="text-[10px] text-white/50 font-bold leading-tight flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    낭독 중 ({audioState.segmentProgress.current}/{audioState.segmentProgress.total})
                  </p>
                  <p className="text-xs font-black text-white truncate max-w-[140px] sm:max-w-[180px]">
                    {audioState.activeSegment.label}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => handbookAudioService.togglePlayPause()}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
                  title={audioState.isPaused ? '재생' : '일시정지'}
                >
                  {audioState.isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(false)}
                  className="p-1.5 text-white/40 hover:text-white transition"
                  title="플레이어 펼치기"
                >
                  <BookOpen size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Expanded full widget */
            <div className="space-y-2.5">
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md ${channelMeta.onBadgeColor} uppercase tracking-wider shrink-0`}
                  >
                    {channelMeta.name}
                  </span>
                  <span className="text-[10px] font-bold text-white/50 truncate">
                    {getModeLabel()}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    {audioState.segmentProgress.current} / {audioState.segmentProgress.total}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="text-white/40 hover:text-white p-1 rounded-md transition"
                    title="최소화"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Title and jump action */}
              <button
                type="button"
                onClick={handleGoToHandbook}
                className="w-full text-left group hover:bg-white/[0.03] p-1.5 -mx-1.5 rounded-xl transition flex items-center justify-between gap-2"
                title="클릭하여 핸드북 본문 화면으로 이동"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white group-hover:text-amber-300 transition break-keep break-words">
                    {audioState.activeSegment.label}
                  </p>
                  <p className="text-[11px] text-white/70 break-keep break-words whitespace-normal mt-0.5 leading-relaxed">
                    {audioState.activeSegment.text}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] text-amber-300/80 font-bold group-hover:translate-x-0.5 transition">
                  <ExternalLink size={12} />
                  <span className="hidden sm:inline">본문</span>
                </div>
              </button>

              {/* Controls bar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleGoToHandbook}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold border border-white/10 transition active:scale-95"
                >
                  <BookOpen size={12} className="text-amber-400" />
                  <span>핸드북 열기</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handbookAudioService.skipPrevious()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition active:scale-95"
                    title="이전 섹션"
                  >
                    <SkipBack size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handbookAudioService.togglePlayPause()}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1.5 transition shadow-md active:scale-95"
                    title={audioState.isPaused ? '재생' : '일시정지'}
                  >
                    {audioState.isPaused ? (
                      <>
                        <Play size={13} fill="currentColor" />
                        <span>재생</span>
                      </>
                    ) : (
                      <>
                        <Pause size={13} />
                        <span>일시정지</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handbookAudioService.skipNext()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition active:scale-95"
                    title="다음 섹션"
                  >
                    <SkipForward size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handbookAudioService.stop()}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition active:scale-95"
                    title="낭독 정지"
                  >
                    <Square size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
