import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Sparkles, 
  BookMarked, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ArrowRight, 
  Star,
  Quote
} from 'lucide-react';
import { ReBibleVerse } from '@/types/rebible';
import { 
  loadLocalVerses, 
  subscribeToReBibleVerses, 
  getDailyMannaVerse,
  cleanFactText,
  DEFAULT_SACRED_VERSES 
} from '@/lib/rebibleStorage';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { useApp } from '@/contexts/AppContext';

export const ReBibleDailyMannaCard: React.FC = () => {
  const [, navigate] = useLocation();
  const { firebaseUser } = useApp();
  const [verses, setVerses] = useState<ReBibleVerse[]>(() => {
    const local = loadLocalVerses();
    return local.length > 0 ? local : DEFAULT_SACRED_VERSES;
  });
  const [currentVerse, setCurrentVerse] = useState<ReBibleVerse | null>(() => getDailyMannaVerse(verses));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isTTSActive = useTTSActive();

  useEffect(() => {
    const unsub = subscribeToReBibleVerses(firebaseUser?.uid, (fetched) => {
      if (fetched && fetched.length > 0) {
        setVerses(fetched);
        // If current verse is null, initialize
        setCurrentVerse((prev) => prev || getDailyMannaVerse(fetched));
      }
    });

    const handleVersesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const fresh = loadLocalVerses();
        setVerses(fresh);
      }
    };
    window.addEventListener('rebible-verses-updated', handleVersesUpdated);

    return () => {
      unsub();
      window.removeEventListener('rebible-verses-updated', handleVersesUpdated);
    };
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (!currentVerse && verses.length > 0) {
      setCurrentVerse(getDailyMannaVerse(verses));
    }
  }, [verses, currentVerse]);

  useEffect(() => {
    if (!isTTSActive && isPlayingAudio) {
      setIsPlayingAudio(false);
    }
  }, [isTTSActive, isPlayingAudio]);

  const handleShuffleAnother = useCallback(() => {
    if (verses.length <= 1) return;
    const next = getDailyMannaVerse(verses, currentVerse?.id);
    if (next) {
      setCurrentVerse(next);
    }
  }, [verses, currentVerse]);

  const handleToggleRecitation = async () => {
    if (!currentVerse) return;
    if (isPlayingAudio) {
      stopTTS();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const recitationScript = `${currentVerse.reference}. ${currentVerse.title}. 루시의 지혜. ${currentVerse.insight}.`;
    
    try {
      await playTTS(recitationScript, 'Kore', true);
    } catch (e) {
      console.warn('TTS Recitation finished:', e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  if (!currentVerse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass prism-xs-hub-card w-full relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 hover:border-white/20 text-white p-5 sm:p-7 md:p-8 backdrop-blur-xl bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-black/40 group transition-all duration-500"
    >
      {/* Background Sacred Glass Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-transparent blur-[100px] opacity-30 pointer-events-none group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000 -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-amber-500/10 via-purple-500/5 to-transparent blur-[90px] opacity-20 pointer-events-none -ml-16 -mb-16" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl border border-white/15 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-white/5 group-hover:scale-105 transition-transform duration-500">
              <Sparkles size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono uppercase tracking-[0.25em] text-amber-400">
                  DAILY MANNA · 오늘의 묵상
                </span>
                {currentVerse.isSacredFavorite && (
                  <span className="flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    황금 구절
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                오늘 나에게 주는 루시의 지혜
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pick another verse (Icon only - 셔플) */}
            <button
              onClick={handleShuffleAnother}
              disabled={verses.length <= 1}
              className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-center text-xs font-semibold cursor-pointer active:scale-95 disabled:opacity-40 shadow-sm"
              title="리바이블 전권에서 다른 지혜의 구절 셔플"
              aria-label="지혜의 구절 셔플"
            >
              <RefreshCw size={15} className="text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* Audio Recitation (Icon only) */}
            <button
              onClick={handleToggleRecitation}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95 shadow-md ${
                isPlayingAudio
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300 animate-pulse'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/30'
              }`}
              title={isPlayingAudio ? "낭독 중지" : "루시의 지혜 듣기 (음성 낭독)"}
              aria-label={isPlayingAudio ? "낭독 중지" : "말씀 듣기"}
            >
              {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Verse Body - Pure Insight Only */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVerse.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3.5"
          >
            {/* Reference & Title */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full font-serif font-black text-xs bg-amber-400/15 border border-amber-400/30 text-amber-300 tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                <BookMarked size={12} className="text-amber-400" />
                <span>{currentVerse.reference}</span>
              </span>
              <span className="text-sm sm:text-base font-bold text-white/90 tracking-tight">
                {currentVerse.title}
              </span>
            </div>

            {/* Holy Spirit Insight Quote Glass Box */}
            <div className="relative p-5 sm:p-6 rounded-[24px] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-black/25 border border-white/10 hover:border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group/quote transition-all duration-300">
              <Quote className="absolute top-3 right-3 text-amber-400/15 group-hover/quote:text-amber-400/25 transition-colors pointer-events-none" size={36} />
              <p className="font-serif text-sm sm:text-base md:text-lg font-medium leading-relaxed italic text-white/95 drop-shadow-sm break-keep">
                "{currentVerse.insight}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Link */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[11px] font-mono text-white/40">
            출처: {currentVerse.bookTitle}
          </span>

          <button
            onClick={() => navigate('/rebible')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer group-hover:translate-x-0.5 duration-300 font-sans shadow-sm"
          >
            <span>인생 경전 Re:Bible 서재 전체 열기</span>
            <ArrowRight size={13} className="text-amber-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
