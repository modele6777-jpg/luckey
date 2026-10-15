import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  BookOpen,
  Bookmark,
  ChevronRight,
  Headphones,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Radio,
} from 'lucide-react';
import { normalizeTextForSpeech, playTTS, stopTTS, subscribeTTS } from '@/utils/tts';

export type BookAppTheme = 'bluebird' | 'orange' | 'trinity' | 'heal' | 'muse' | 'prologue' | 'epilogue';

export interface BookChapterTab {
  id: string;
  romanNumeral: string;
  title: string;
  shortLabel: string;
  icon?: React.ReactNode;
}

export interface RealBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: BookAppTheme;
  bookTitle: string;
  bookSubtitle: string;
  bookAuthor?: string;
  epigraphQuote?: string;
  epigraphSource?: string;
  chapterTabs: BookChapterTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  leftPageHeaderExtra?: React.ReactNode;
  leftPageContent?: React.ReactNode;
  children: React.ReactNode;
  footerPageNumber?: string;
  audiobookNarrations?: Record<string, string>;
  defaultVoice?: string;
}

interface ThemeBookStyle {
  leatherCover: string;
  leatherBorder: string;
  accentColor: string;
  accentText: string;
  accentBadge: string;
  accentGlow: string;
  goldBorder: string;
  ribbonColor: string;
  parchmentBg: string;
  parchmentInnerBorder: string;
  sealEmoji: string;
  latinMotto: string;
  crestLabel: string;
}

const THEME_STYLES: Record<BookAppTheme, ThemeBookStyle> = {
  bluebird: {
    leatherCover: 'from-[#07131e] via-[#0b1c2b] to-[#040a10]',
    leatherBorder: 'border-sky-500/40',
    accentColor: '#38bdf8',
    accentText: 'text-sky-400',
    accentBadge: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    goldBorder: 'border-sky-400/30',
    ribbonColor: 'bg-gradient-to-b from-sky-400 via-blue-500 to-sky-600 shadow-sky-500/40',
    parchmentBg: 'from-[#091522]/95 via-[#0c1a29]/95 to-[#060f18]/95',
    parchmentInnerBorder: 'border-sky-500/20',
    sealEmoji: '🕊️',
    latinMotto: 'Pax Omnis "Ego" · 모든 평화는 나로부터',
    crestLabel: 'HOʻOPONOPONO SACRED CODEX',
  },
  orange: {
    leatherCover: 'from-[#1a0e05] via-[#261508] to-[#0d0702]',
    leatherBorder: 'border-amber-500/40',
    accentColor: '#f59e0b',
    accentText: 'text-amber-400',
    accentBadge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    goldBorder: 'border-amber-400/30',
    ribbonColor: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-amber-500/40',
    parchmentBg: 'from-[#1c1106]/95 via-[#231509]/95 to-[#120a03]/95',
    parchmentInnerBorder: 'border-amber-500/20',
    sealEmoji: '✨',
    latinMotto: 'Quod Intus, Sic Extra · 내면이 그러하듯 외부도 그러하다',
    crestLabel: 'THE SECRET GOLDEN MANUSCRIPT',
  },
  trinity: {
    leatherCover: 'from-[#110f08] via-[#1a170a] to-[#080703]',
    leatherBorder: 'border-yellow-500/40',
    accentColor: '#eab308',
    accentText: 'text-yellow-400',
    accentBadge: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
    accentGlow: 'rgba(234, 179, 8, 0.25)',
    goldBorder: 'border-yellow-400/30',
    ribbonColor: 'bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 shadow-yellow-500/40',
    parchmentBg: 'from-[#141208]/95 via-[#1c190c]/95 to-[#0b0a04]/95',
    parchmentInnerBorder: 'border-yellow-500/20',
    sealEmoji: '👑',
    latinMotto: 'Lux In Tenebris Lucet · 어둠 속에 신성의 빛이 비치나니',
    crestLabel: 'A COURSE IN MIRACLES CODEX',
  },
  heal: {
    leatherCover: 'from-[#05140d] via-[#091f14] to-[#020a06]',
    leatherBorder: 'border-emerald-500/40',
    accentColor: '#10b981',
    accentText: 'text-emerald-400',
    accentBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    accentGlow: 'rgba(168, 85, 247, 0.25)',
    goldBorder: 'border-emerald-400/30',
    ribbonColor: 'bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-600 shadow-emerald-500/40',
    parchmentBg: 'from-[#07170f]/95 via-[#0c2217]/95 to-[#040e09]/95',
    parchmentInnerBorder: 'border-emerald-500/20',
    sealEmoji: '🌿',
    latinMotto: 'Dimitte Et Liberare · 집착을 놓아주고 온전히 해방되라',
    crestLabel: 'SEDONA & LETTING GO GRIMOIRE',
  },
  epilogue: {
    leatherCover: 'from-[#14081c] via-[#1d0c29] to-[#0a030f]',
    leatherBorder: 'border-purple-500/40',
    accentColor: '#c084fc',
    accentText: 'text-purple-400',
    accentBadge: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
    accentGlow: 'rgba(192, 132, 252, 0.25)',
    goldBorder: 'border-purple-400/30',
    ribbonColor: 'bg-gradient-to-b from-purple-400 via-pink-500 to-indigo-600 shadow-purple-500/40',
    parchmentBg: 'from-[#160a20]/95 via-[#1e0e2c]/95 to-[#0e0414]/95',
    parchmentInnerBorder: 'border-purple-500/20',
    sealEmoji: '🌙',
    latinMotto: 'Finis Coronat Opus · 하루의 완성이 내일의 영광을 비춘다',
    crestLabel: 'PRISM EPILOGUE MASTER CODEX',
  },
  prologue: {
    leatherCover: 'from-[#1a0a05] via-[#241208] to-[#0d0502]',
    leatherBorder: 'border-red-500/40',
    accentColor: '#ef4444',
    accentText: 'text-red-400',
    accentBadge: 'bg-red-500/15 text-red-300 border-red-400/30',
    accentGlow: 'rgba(239, 68, 68, 0.25)',
    goldBorder: 'border-red-400/30',
    ribbonColor: 'bg-gradient-to-b from-red-400 via-amber-500 to-orange-600 shadow-red-500/40',
    parchmentBg: 'from-[#1c0c06]/95 via-[#231008]/95 to-[#120603]/95',
    parchmentInnerBorder: 'border-red-500/20',
    sealEmoji: '☀️',
    latinMotto: 'Sanctuarium Universalis · 7대 우주 샌추어리의 출발점',
    crestLabel: 'PRISM PROLOGUE SANCTUARY CODEX',
  },
  muse: {
    leatherCover: 'from-[#12081c] via-[#1c0d2b] to-[#09030e]',
    leatherBorder: 'border-purple-500/40',
    accentColor: '#a855f7',
    accentText: 'text-purple-400',
    accentBadge: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
    accentGlow: 'rgba(168, 85, 247, 0.25)',
    goldBorder: 'border-purple-400/30',
    ribbonColor: 'bg-gradient-to-b from-fuchsia-400 via-purple-500 to-indigo-600 shadow-purple-500/40',
    parchmentBg: 'from-[#150a22]/95 via-[#1e0f2f]/95 to-[#0d0515]/95',
    parchmentInnerBorder: 'border-purple-500/20',
    sealEmoji: '🎨',
    latinMotto: 'Creatio Ex Animo · 영혼에서 솟아나는 무한한 창조성',
    crestLabel: 'THE ARTIST\'S WAY TOME',
  },
};

export function RealBookModal({
  isOpen,
  onClose,
  theme,
  bookTitle,
  bookSubtitle,
  bookAuthor,
  epigraphQuote,
  epigraphSource,
  chapterTabs,
  activeTabId,
  onTabChange,
  leftPageHeaderExtra,
  leftPageContent,
  children,
  footerPageNumber = '- Page Ⅰ -',
  audiobookNarrations = {},
  defaultVoice = 'Kore',
}: RealBookModalProps) {
  const style = THEME_STYLES[theme] || THEME_STYLES.bluebird;
  const currentTabIndex = chapterTabs.findIndex((t) => t.id === activeTabId);
  const currentTab = chapterTabs[currentTabIndex >= 0 ? currentTabIndex : 0];

  // Audiobook State
  const [isAudiobookActive, setIsAudiobookActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>(
    defaultVoice || 'Kore'
  );
  const isPlayingRef = useRef(false);

  // Subscribe to global TTS updates
  useEffect(() => {
    const unsubscribe = subscribeTTS((tts) => {
      setIsPlayingAudio(tts.isSpeaking);
      setIsLoadingAudio(tts.isLoading);
      isPlayingRef.current = tts.isSpeaking || tts.isLoading;
    });
    return () => {
      unsubscribe();
      if (isPlayingRef.current && isAudiobookActive) {
        stopTTS();
      }
    };
  }, [isAudiobookActive]);

  // Stop audio when modal closes
  const handleClose = useCallback(() => {
    if (isAudiobookActive) {
      stopTTS();
      setIsAudiobookActive(false);
    }
    onClose();
  }, [isAudiobookActive, onClose]);

    // Compile full narration text for a chapter
  const getChapterNarration = useCallback((tabId: string) => {
    if (audiobookNarrations[tabId]) {
      return audiobookNarrations[tabId];
    }
    const tab = chapterTabs.find((t) => t.id === tabId);
    if (!tab) return `${bookTitle} ${bookSubtitle}`;
    return `${bookTitle}, 제${tab.romanNumeral}장: ${tab.title}. ${epigraphQuote ? `격언: ${epigraphQuote}` : ''}`;
  }, [audiobookNarrations, chapterTabs, bookTitle, bookSubtitle, epigraphQuote]);

  // Compile full continuous narration text for ALL chapters from beginning to end
  const getFullBookNarration = useCallback(() => {
    const sections: string[] = [];
    sections.push(`${bookTitle}. ${bookSubtitle}.`);
    if (bookAuthor) {
      sections.push(`저자: ${bookAuthor}.`);
    }
    if (epigraphQuote) {
      sections.push(`서문 격언: ${epigraphQuote}`);
    }
    chapterTabs.forEach((tab) => {
      sections.push(`제${tab.romanNumeral}장. ${tab.title}.`);
      if (audiobookNarrations[tab.id]) {
        sections.push(audiobookNarrations[tab.id]);
      }
    });
    return sections.join('\n\n');
  }, [bookTitle, bookSubtitle, bookAuthor, epigraphQuote, chapterTabs, audiobookNarrations]);

  // Play entire book audiobook at once (전체 챕터 한번에 완독)
  const handlePlayFullAudiobook = useCallback(async () => {
    if (isPlayingAudio || isLoadingAudio) {
      stopTTS();
      setIsAudiobookActive(false);
      return;
    }

    const fullNarration = getFullBookNarration();
    const clean = normalizeTextForSpeech(fullNarration);

    setIsAudiobookActive(true);
    await playTTS(clean, selectedVoice);
  }, [getFullBookNarration, isPlayingAudio, isLoadingAudio, selectedVoice]);

  // Play current chapter audiobook
  const handlePlayChapterAudio = useCallback(async (tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    const textToSpeak = getChapterNarration(targetTabId);
    const clean = normalizeTextForSpeech(textToSpeak);

    if (isPlayingAudio || isLoadingAudio) {
      stopTTS();
      setIsAudiobookActive(false);
      return;
    }

    setIsAudiobookActive(true);
    await playTTS(clean, selectedVoice);
  }, [activeTabId, getChapterNarration, isPlayingAudio, isLoadingAudio, selectedVoice]);

  // Navigate & play next chapter
  const handleNextChapter = useCallback(() => {
    stopTTS();
    const nextIdx = (currentTabIndex + 1) % chapterTabs.length;
    const nextTab = chapterTabs[nextIdx];
    onTabChange(nextTab.id);
    setTimeout(() => {
      handlePlayChapterAudio(nextTab.id);
    }, 150);
  }, [currentTabIndex, chapterTabs, onTabChange, handlePlayChapterAudio]);

  // Navigate & play prev chapter
  const handlePrevChapter = useCallback(() => {
    stopTTS();
    const prevIdx = (currentTabIndex - 1 + chapterTabs.length) % chapterTabs.length;
    const prevTab = chapterTabs[prevIdx];
    onTabChange(prevTab.id);
    setTimeout(() => {
      handlePlayChapterAudio(prevTab.id);
    }, 150);
  }, [currentTabIndex, chapterTabs, onTabChange, handlePlayChapterAudio]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
        onClick={handleClose}
      >
        {/* Book Open Animation Wrapper */}
        <motion.div
          initial={{ scale: 0.9, rotateX: 10, y: 30, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, rotateX: 10, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 85, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[96vw] sm:max-w-xl md:max-w-6xl h-[88dvh] md:h-[88vh] md:max-h-[90vh] flex flex-col my-auto select-text font-serif"
          style={{ perspective: '1600px' }}
        >
          {/* Hanging Satin Ribbon Bookmark 🔖 (책 중앙 접힘선 스파인 위치로 이동하여 상단 우측 오디오북과 겹침 방지) */}
          <div className="hidden md:flex absolute -top-3 left-[41.666%] -translate-x-1/2 z-40 flex-col items-center pointer-events-none drop-shadow-xl animate-pulse">
            <div className={`w-5 sm:w-6 h-12 sm:h-16 ${style.ribbonColor} rounded-b-md shadow-2xl relative`}>
              <div className="absolute inset-x-0 bottom-0 h-3 border-b-2 border-amber-300/80" />
            </div>
            {/* Ribbon V-Cut point */}
            <div className="w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-r-[10px] sm:border-r-[12px] border-r-transparent border-t-[8px] sm:border-t-[10px] border-t-amber-400" />
          </div>

          {/* Hardcover Leather Spine & Outer Frame Container */}
          <div
            className={`relative w-full h-full rounded-[22px] sm:rounded-[36px] md:rounded-[40px] p-2 sm:p-3.5 md:p-5 bg-gradient-to-b ${style.leatherCover} border-2 ${style.leatherBorder} shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_${style.accentGlow}] flex flex-col overflow-hidden`}
          >
            {/* 4 Corner Brass Gilded Metal Brackets */}
            <div className="absolute top-2 left-2 w-5 sm:w-10 h-5 sm:h-10 border-t-2 border-l-2 border-amber-400/40 rounded-tl-xl sm:rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-2 right-2 w-5 sm:w-10 h-5 sm:h-10 border-t-2 border-r-2 border-amber-400/40 rounded-tr-xl sm:rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-5 sm:w-10 h-5 sm:h-10 border-b-2 border-l-2 border-amber-400/40 rounded-bl-xl sm:rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-5 sm:w-10 h-5 sm:h-10 border-b-2 border-r-2 border-amber-400/40 rounded-br-xl sm:rounded-br-2xl pointer-events-none" />

            {/* Top Bar (Crest Title on Left, Full Audiobook Player & Close on Right) */}
            <div className="relative z-30 flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-6 py-1.5 sm:py-3 mb-1.5 sm:mb-2 border-b border-white/10 shrink-0 bg-black/40 rounded-xl sm:rounded-2xl">
              {/* Left: Crest & Title */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
                <span className="text-base sm:text-2xl drop-shadow-md shrink-0">{style.sealEmoji}</span>
                <div className="min-w-0">
                  <span className="text-[8px] sm:text-[10px] font-mono font-bold tracking-widest text-amber-400/90 uppercase block leading-none break-keep break-words">
                    {style.crestLabel}
                  </span>
                  <h2 className="text-[11px] sm:text-sm font-bold text-white tracking-tight break-keep break-words mt-0.5">
                    {bookTitle}
                  </h2>
                </div>
              </div>

              {/* Right: Full Audiobook Player & Close Button */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
                {/* Full Continuous Audiobook Player Bar */}
                <div className="flex items-center gap-1 sm:gap-2 bg-white/[0.06] border border-amber-400/30 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-sm">
                  <button
                    onClick={handlePlayFullAudiobook}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      isPlayingAudio || isAudiobookActive
                        ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    }`}
                    title={isPlayingAudio ? '오디오북 멈추기' : '전체 챕터 한번에 완독 듣기'}
                  >
                    <Headphones size={11} className={isPlayingAudio ? 'animate-bounce shrink-0' : 'shrink-0'} />
                    <span>
                      {isPlayingAudio ? '낭독 중' : isLoadingAudio ? '로딩...' : <><span className="hidden sm:inline">전체 </span>오디오북<span className="hidden sm:inline"> 완독</span></>}
                    </span>
                    {isPlayingAudio && (
                      <div className="flex items-center gap-0.5 ml-0.5 sm:ml-1">
                        <span className="w-0.5 sm:w-1 h-2 sm:h-3 bg-black rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                        <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-black rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                        <span className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-black rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
                      </div>
                    )}
                  </button>

                  {/* Voice Selector */}
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="text-[10px] bg-black/50 border border-white/15 text-amber-200/90 rounded-lg px-1 sm:px-1.5 py-0.5 focus:outline-none cursor-pointer hidden sm:inline-block"
                    title="낭독 음성 선택"
                  >
                    <option value="Kore">Kore (여성 기본)</option>
                  </select>

                  {/* Stop Button */}
                  {(isPlayingAudio || isAudiobookActive) && (
                    <button
                      onClick={() => {
                        stopTTS();
                        setIsAudiobookActive(false);
                      }}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="오디오북 완전 정지"
                    >
                      <Square size={11} />
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shadow-sm shrink-0"
                  aria-label="책 닫기"
                >
                  <X size={13} className="sm:w-[15px] sm:h-[15px]" />
                </button>
              </div>
            </div>

            {/* Chapter Horizontal Ribbon Tabs */}
            <div className="relative z-30 flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-6 pb-1.5 sm:pb-2.5 overflow-x-auto no-scrollbar shrink-0">
              {chapterTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      if (isPlayingAudio) {
                        handlePlayChapterAudio(tab.id);
                      }
                    }}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? `${style.accentBadge} shadow-sm scale-105 font-bold`
                        : 'bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.07] border border-white/5'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-amber-400/90 font-bold">
                      {tab.romanNumeral}
                    </span>
                    <span>{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Open Book Spread (Dual Pages on Desktop / Seamless Single Page on Mobile) */}
            <div
              className={`relative z-10 flex-1 min-h-0 rounded-[16px] sm:rounded-[24px] md:rounded-[28px] bg-gradient-to-r ${style.parchmentBg} border ${style.parchmentInnerBorder} shadow-inner flex flex-col md:flex-row overflow-hidden`}
            >
              {/* Natural Book Spine Crease & Depth Shadow (왼쪽 5/12 창 분할선에 정확히 맞춘 책 접힘선) */}
              <div className="hidden md:block absolute inset-y-0 left-[41.666%] -translate-x-1/2 w-8 bg-gradient-to-r from-black/50 via-black/80 to-transparent pointer-events-none z-20" />
              <div className="hidden md:block absolute inset-y-0 left-[41.666%] -translate-x-1/2 w-[1.5px] bg-amber-400/30 pointer-events-none z-20 shadow-[0_0_6px_rgba(245,158,11,0.3)]" />
              <div className="hidden md:block absolute inset-y-0 left-[41.666%] w-6 bg-gradient-to-r from-black/35 to-transparent pointer-events-none z-20" />

              {/* LEFT PAGE (서문, 목차, 라틴어 격언, 핵심 요약) */}
              <div className="hidden md:flex md:w-5/12 flex-col justify-between p-6 lg:p-8 relative z-10 overflow-y-auto no-scrollbar bg-black/15">
                {/* Left Page Top: Gilded Book Title & Crest */}
                <div className="space-y-6">
                  <div className="text-center space-y-3 pb-4 border-b border-white/10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-amber-400/20 to-transparent border border-amber-400/40 text-2xl shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                      {style.sealEmoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white tracking-tight">
                        {bookTitle}
                      </h3>
                      <p className="text-xs text-white/50 font-sans mt-1">
                        {bookSubtitle}
                      </p>
                      {bookAuthor && (
                        <p className="text-[10px] font-mono text-amber-400/80 mt-1 uppercase tracking-wider">
                          Author · {bookAuthor}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Epigraph Quote Card */}
                  {epigraphQuote && (
                    <div className="p-4 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20 space-y-2 relative overflow-hidden">
                      <div className="text-amber-400/40 text-2xl font-serif leading-none">“</div>
                      <p className="text-xs text-amber-100/90 italic leading-relaxed font-serif pl-2">
                        {epigraphQuote}
                      </p>
                      {epigraphSource && (
                        <p className="text-[10px] text-amber-400/70 text-right font-sans">
                          — {epigraphSource}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Left Page Extra Custom Content or Chapter Summary */}
                  {leftPageContent ? (
                    <div className="space-y-3 font-sans text-xs">
                      {leftPageContent}
                    </div>
                  ) : (
                    /* Default Chapter Table of Contents */
                    <div className="space-y-2.5 font-sans">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                        TABLE OF CONTENTS · 목차
                      </span>
                      <div className="space-y-1.5">
                        {chapterTabs.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onTabChange(t.id);
                              if (isPlayingAudio) {
                                handlePlayChapterAudio(t.id);
                              }
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              t.id === activeTabId
                                ? 'bg-amber-500/15 border-amber-400/30 text-amber-200 shadow-sm'
                                : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[10px] font-bold text-amber-400">
                                {t.romanNumeral}
                              </span>
                              <span className="text-xs font-medium truncate">
                                {t.title}
                              </span>
                            </div>
                            <ChevronRight size={13} className="text-white/30 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Left Page Footer Motto */}
                <div className="pt-6 border-t border-white/5 text-center space-y-1">
                  <p className="text-[10px] font-serif italic text-amber-300/70">
                    {style.latinMotto}
                  </p>
                  <p className="text-[9px] font-mono text-white/30">
                    LIBER SAPIENTIAE · PRISM UNIVERSE
                  </p>
                </div>
              </div>

              {/* RIGHT PAGE (본문 스크롤 영역, 상호작용 카드, 실천 가이드, Lucy 바이블) */}
              <div className="flex-1 min-h-0 flex flex-col justify-between p-3 sm:p-6 lg:p-8 relative z-10 overflow-y-auto select-text custom-scrollbar">
                {/* Chapter Heading Banner */}
                <div className="pb-3 sm:pb-5 border-b border-white/10 mb-3.5 sm:mb-6 shrink-0 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20">
                        CHAPTER {currentTab?.romanNumeral}
                      </span>
                      <span className="text-[10px] text-white/40 font-sans hidden sm:inline">
                        ✦ ──────────────── ✦
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-xl font-extrabold text-white tracking-tight">
                      {currentTab?.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePlayChapterAudio()}
                      className={`p-2 rounded-full border transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-md animate-pulse'
                          : 'bg-white/5 hover:bg-white/15 text-white/60 hover:text-amber-300 border-white/10'
                      }`}
                      title={isPlayingAudio ? '오디오북 멈추기' : '이 챕터 오디오북 듣기'}
                    >
                      {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    {leftPageHeaderExtra && (
                      <div className="shrink-0">
                        {leftPageHeaderExtra}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 space-y-3.5 sm:space-y-6 font-sans">
                  {children}
                </div>

                {/* Right Page Footer with Page Number */}
                <div className="pt-3.5 sm:pt-6 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-white/40 font-mono shrink-0 mt-4 sm:mt-8">
                  <span>PRISM COMPENDIUM</span>
                  <span className="text-amber-400 font-bold tracking-widest">
                    {footerPageNumber}
                  </span>
                  <span>ALL RIGHTS RESERVED</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
