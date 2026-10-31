import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Star,
  Stars as LucideStars,
  X,
  History,
  Heart,
  Compass,
  RefreshCw,
  Feather,
  Moon,
  Orbit,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useApp } from '@/contexts/AppContext';
import { sendWishingWellToLucy } from '@/lib/oracleDeepInsight';
import { TTSButton } from '@/components/TTSButton';
import { playStarWishSound, playWishingWellPlopSound } from '@/lib/audio';
import {
  WISH_CATEGORIES,
  WishCategoryId,
  WishEntry,
  castWishIntoWell,
  loadWishesHistory,
  deduplicateWishes,
} from '@/lib/wishingWell';
import { WishingWellSecretRecommendations } from '@/components/orange/WishingWellSecretRecommendations';

interface WishingWellModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  onSwitchMode?: (mode: 'secret' | 'wishingWell' | 'synergy' | 'bible') => void;
}

const QUICK_WISH_CHIPS: Record<WishCategoryId, string[]> = {
  inner_peace: [
    '지친 마음을 내려놓고 고요한 평온을 맞이합니다',
    '모든 걱정이 물결처럼 흩어지고 평안이 찾아옵니다',
    '내 안의 깊은 안식과 맑은 호흡을 회복합니다',
  ],
  self_love: [
    '있는 그대로의 나를 온전히 안아주고 사랑합니다',
    '완벽하지 않아도 나는 충분히 소중하고 빛납니다',
    '나의 모든 감정과 모습을 따뜻하게 긍정합니다',
  ],
  courage: [
    '두려움을 넘어 새로운 도전으로 담대히 나아갑니다',
    '나를 가두던 한계를 깨고 더 큰 세상으로 도약합니다',
    '내 안의 무한한 잠재력과 용기를 신뢰합니다',
  ],
  relationship: [
    '소중한 인연들과 진심 어린 사랑과 이해를 나눕니다',
    '과거의 오해와 상처를 흘려보내고 화해를 맞이합니다',
    '나를 존중하고 지지하는 따뜻한 관계가 피어납니다',
  ],
  dream: [
    '가슴 뛰는 비전과 꿈이 눈부신 현실로 성취됩니다',
    '원하는 목표를 향한 우주의 기회와 행운이 열립니다',
    '나의 창작과 열정이 세상에 선한 울림을 전합니다',
  ],
};

export function WishingWellModal({
  isOpen = true,
  onClose,
  isModal = true,
  onSwitchMode,
}: WishingWellModalProps) {
  const { openLucyChat, sendUnifiedMessage } = useApp();
  const [activeTab, setActiveTab] = useState<'cast' | 'history'>('cast');
  const [selectedCategory, setSelectedCategory] = useState<WishCategoryId>('self_love');
  const [wishInput, setWishInput] = useState('');
  const [isCasting, setIsCasting] = useState(false);
  const [wishesHistory, setWishesHistory] = useState<WishEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [latestResult, setLatestResult] = useState<WishEntry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    const uid = auth.currentUser?.uid || 'guest';
    setLoadingHistory(true);
    try {
      const list = await loadWishesHistory(uid);
      setWishesHistory(list);
    } catch (e) {
      console.error('[WishingWellModal] Failed to fetch history:', e);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen || !isModal) {
      setErrorMsg(null);
      fetchHistory();
    } else {
      setWishInput('');
      setLatestResult(null);
    }
  }, [isOpen, isModal, fetchHistory]);

  const selectedCategoryMeta =
    WISH_CATEGORIES.find((c) => c.id === selectedCategory) || WISH_CATEGORIES[0];

  const handleCastWish = async (
    overrideWish?: string | React.MouseEvent<HTMLButtonElement>,
    overrideCategory?: WishCategoryId
  ) => {
    setIsCasting(true);
    setErrorMsg(null);

    // Celestial shooting star & starlight chime sound ("슈웅~ 팅그랑✨")
    playStarWishSound();

    const targetCategory = overrideCategory || selectedCategory;
    if (overrideCategory && overrideCategory !== selectedCategory) {
      setSelectedCategory(overrideCategory);
    }
    const catMeta = WISH_CATEGORIES.find((c) => c.id === targetCategory) || selectedCategoryMeta;

    const safetyTimer = setTimeout(() => {
      setIsCasting(false);
    }, 9000);

    try {
      const uid = auth.currentUser?.uid || 'guest';
      const wishStr = typeof overrideWish === 'string' ? overrideWish : undefined;
      const effectiveWish =
        (wishStr !== undefined ? wishStr : wishInput).trim() ||
        catMeta.defaultWish ||
        '가슴속 간절한 소망이 밤하늘 별빛처럼 밝게 실현되길 기원합니다.';
      const result = await castWishIntoWell(uid, effectiveWish, targetCategory);
      setLatestResult(result);
      setWishesHistory((prev) => deduplicateWishes([result, ...prev]));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prism:wish_cast', { detail: { wish: result } }));
      }
    } catch (err: any) {
      console.error('[WishingWellModal] Error casting wish:', err);
      setErrorMsg(err?.message || '별빛과 교감하는 중 오류가 발생했습니다.');
    } finally {
      clearTimeout(safetyTimer);
      setIsCasting(false);
    }
  };

  const handleApplyWish = (wishText: string, category: WishCategoryId) => {
    setSelectedCategory(category);
    setWishInput(wishText);
    const textarea = document.getElementById('wishing-well-textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCastDirectly = (wishText: string, category: WishCategoryId) => {
    setSelectedCategory(category);
    setWishInput(wishText);
    void handleCastWish(wishText, category);
  };

  const handleNavigateToSecret = () => {
    if (onSwitchMode) {
      onSwitchMode('secret');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:switch_orange_mode', { detail: { mode: 'secret' } }));
    }
    if (isModal && onClose) {
      onClose();
    }
  };

  // 🌟 토스된 소원 텍스트 즉시 수신 및 자동 소원 빌기
  useEffect(() => {
    const triggerAutoWish = (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');
      setWishInput(trimmed);
      setTimeout(() => {
        void handleCastWish(trimmed);
      }, 150);
    };

    if (isOpen || !isModal) {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText) {
        triggerAutoWish(autoText);
      }
    }

    const handleExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.text && (detail.tab === 'wishingWell' || detail.targetMenuId?.includes('well') || detail.targetMenu?.path?.includes('wishingWell'))) {
        triggerAutoWish(detail.text);
      }
    };
    window.addEventListener('prism:selection_execute', handleExecute);
    return () => window.removeEventListener('prism:selection_execute', handleExecute);
  }, [isOpen, isModal]);

  const handleResetForNewWish = () => {
    setLatestResult(null);
    setWishInput('');
  };

  if (isOpen !== undefined && !isOpen && isModal) return null;

  const wellContent = (
    <div
      className={`relative w-full ${
        isModal
          ? 'max-w-3xl bg-slate-950/60 max-h-[92vh]'
          : 'max-w-4xl mx-auto bg-slate-950/50 my-2'
      } border border-white/20 rounded-[32px] sm:rounded-[36px] shadow-[0_32px_120px_-15px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.35)] overflow-hidden flex flex-col backdrop-blur-3xl font-sans`}
    >
      {/* Specular Ambient Liquid Glow Layers */}
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[550px] h-[220px] bg-gradient-to-b from-amber-400/25 via-orange-500/10 to-transparent blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-gradient-to-bl from-teal-400/10 via-amber-400/10 to-transparent blur-[80px] pointer-events-none" />

      {/* Top Specular Edge Prism Light Ribbon */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/50 via-amber-300/70 to-transparent shrink-0" />

      {/* Glass Header */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0 bg-white/[0.04] backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/30 via-indigo-500/25 to-purple-600/30 border border-amber-300/35 flex items-center justify-center shadow-[0_8px_24px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.5)] shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/25 to-transparent" />
            <Star className="relative z-10 w-5 h-5 text-amber-300 fill-amber-300/40 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                별에게 소원빌기
                <span className="text-[11px] font-serif italic text-amber-300/90 font-normal">Wish Upon a Star</span>
              </h2>
              <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-indigo-500/20 text-amber-300 border border-amber-300/40 uppercase tracking-widest font-mono shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                ORANGE CELESTIAL
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/60 font-sans mt-0.5">
              밤하늘 은하수에 진실한 소망을 띄우고, 별빛의 신비로운 화답을 만나보세요
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            id="wishing-well-close-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/20 text-white/70 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 shadow-sm"
            title="닫기"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Glass Navigation Tabs */}
      <div className="flex items-center justify-between px-6 sm:px-8 pt-3 pb-2.5 border-b border-white/[0.08] relative z-10 shrink-0 bg-black/30 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <button
            id="tab-cast-wish"
            onClick={() => {
              setActiveTab('cast');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cast'
                ? 'bg-gradient-to-r from-amber-500/35 via-orange-500/30 to-amber-500/25 text-amber-200 border border-amber-300/55 shadow-[0_4px_20px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05] border border-transparent'
            }`}
          >
            <Star size={13} className={activeTab === 'cast' ? 'text-amber-300 animate-pulse fill-amber-300/40' : ''} />
            <span>별에게 소원 빌기</span>
          </button>

          <button
            id="tab-wishes-history"
            onClick={() => {
              setActiveTab('history');
              fetchHistory();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-amber-500/35 via-orange-500/30 to-amber-500/25 text-amber-200 border border-amber-300/55 shadow-[0_4px_20px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05] border border-transparent'
            }`}
          >
            <History size={13} className={activeTab === 'history' ? 'text-amber-300' : ''} />
            <span>별의 기억</span>
            {wishesHistory.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 font-mono font-bold border border-amber-300/40">
                {wishesHistory.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'history' && (
          <button
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[11px] text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={11} className={loadingHistory ? 'animate-spin text-amber-300' : ''} />
            <span>새로고침</span>
          </button>
        )}
      </div>

      {/* Glass Body */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {activeTab === 'cast' ? (
          <div className="space-y-6">
            {/* Luminous Celestial Starlit Night Sky Centerpiece */}
            <div className="relative w-full h-48 sm:h-56 rounded-[28px] bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-black/85 border border-amber-400/25 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl group">
              {/* Shimmering Glass Top Lip Highlight */}
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

              {/* Twinkling Background Stars Field */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <span className="absolute top-4 left-10 w-1 h-1 bg-amber-200 rounded-full animate-ping opacity-75" />
                <span className="absolute top-8 right-16 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse opacity-90 shadow-[0_0_8px_#fde047]" />
                <span className="absolute bottom-6 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300 opacity-80" />
                <span className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-300 rounded-full animate-ping delay-700 opacity-60" />
                <span className="absolute bottom-8 right-10 w-1 h-1 bg-indigo-200 rounded-full animate-pulse delay-500 opacity-80" />
                <span className="absolute top-12 left-1/3 w-1.5 h-1.5 bg-white/90 rounded-full shadow-[0_0_6px_#ffffff] animate-pulse" />
              </div>

              {/* Concentric Celestial Orbital Halos */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [0.7, 1.35, 2.3], opacity: [0.65, 0.25, 0] }}
                  transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
                  className="w-40 h-40 rounded-full border border-amber-300/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                />
                <motion.div
                  animate={{ scale: [0.7, 1.35, 2.3], opacity: [0.55, 0.2, 0] }}
                  transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, delay: 1.4, ease: 'easeOut' }}
                  className="w-40 h-40 rounded-full border border-indigo-400/35 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                />
                <motion.div
                  animate={{ scale: [0.7, 1.35, 2.3], opacity: [0.45, 0.15, 0] }}
                  transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, delay: 2.8, ease: 'easeOut' }}
                  className="w-40 h-40 rounded-full border border-amber-200/30 shadow-[0_0_15px_rgba(254,240,138,0.2)]"
                />
              </div>

              {/* Starlight Nebula Radial Wash */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-purple-900/20 to-transparent opacity-90 pointer-events-none" />

              {/* Shooting Star Flare Animation on Casting */}
              {isCasting && (
                <motion.div
                  initial={{ x: -160, y: 120, opacity: 0 }}
                  animate={{ x: 260, y: -140, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  className="absolute pointer-events-none z-20"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_16px_#fff,0_0_32px_#f59e0b]" />
                  <div className="w-32 h-[2px] -rotate-45 bg-gradient-to-r from-transparent via-amber-300/60 to-white -mt-1 -ml-28" />
                </motion.div>
              )}

              {/* Floating Celestial Star Crystal */}
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                <motion.div
                  animate={
                    isCasting
                      ? { scale: [1, 1.4, 0.85], rotate: [0, 180, 360], y: [0, -14, 2] }
                      : { y: [0, -6, 0], rotate: [0, 5, 0, -5, 0] }
                  }
                  transition={
                    isCasting
                      ? { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                      : { duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                  }
                  className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-indigo-300 p-[2px] shadow-[0_0_40px_rgba(245,158,11,0.7),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center cursor-default"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900/95 via-indigo-950/90 to-slate-950 flex items-center justify-center shadow-inner">
                    <Star className="w-7 h-7 text-amber-300 fill-amber-300/40 drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]" />
                  </div>
                  {/* Surrounding Starlight Glimmer */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,1)] flex items-center justify-center">
                    <Sparkles size={8} className="text-slate-950" />
                  </div>
                </motion.div>

                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide font-sans drop-shadow-sm">
                    {isCasting
                      ? '슈웅~ 소원이 은하수를 건너 별빛으로 날아가고 있습니다...'
                      : '밤하늘 가장 빛나는 별에 진심을 담아 소원을 띄워보세요'}
                  </p>
                  <p className="text-[10px] text-white/55 font-mono">
                    {isCasting ? '별빛이 마음에 화답하는 중 · Celestial Echoing' : 'Ask · Believe · Receive · Starlight Resonance'}
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Glass Reveal Card (When Wish is freshly Cast) */}
            <AnimatePresence>
              {latestResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="p-6 sm:p-7 rounded-[26px] bg-gradient-to-br from-amber-500/20 via-indigo-950/30 to-black/70 border border-amber-300/50 shadow-[0_20px_50px_rgba(245,158,11,0.25),inset_0_1px_2px_rgba(255,255,255,0.45)] space-y-4 backdrop-blur-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/30 to-orange-400/30 text-amber-200 border border-amber-300/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-mono flex items-center gap-1">
                        <Star size={11} className="text-amber-300 fill-amber-300/40" />
                        #{latestResult.crystalKeyword}
                      </span>
                      <span className="text-xs text-white/65 font-sans">{latestResult.categoryLabel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TTSButton
                        text={`${latestResult.echo}. ${latestResult.innerChildGuidance}`}
                        voice="Kore"
                        className="text-amber-300 border-amber-300/40 bg-amber-500/15 text-xs py-1.5 px-3"
                      />
                      <button
                        onClick={handleResetForNewWish}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white/80 hover:text-white text-xs transition-all cursor-pointer active:scale-95 font-medium"
                      >
                        새 소원 작성
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black text-amber-300/90 uppercase tracking-[0.2em] mb-1 font-mono">
                      나의 소망
                    </div>
                    <p className="text-sm sm:text-base font-serif italic text-white/95 leading-relaxed font-medium">
                      &ldquo;{latestResult.wish}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.1] border border-amber-300/30 space-y-2 backdrop-blur-xl shadow-inner">
                    <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles size={12} className="text-amber-300 animate-pulse" />
                      <span>별빛의 메아리</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans font-medium break-keep">
                      {latestResult.echo}
                    </p>
                  </div>

                  {latestResult.innerChildGuidance && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-500/[0.1] border border-emerald-400/30 text-xs sm:text-sm text-emerald-200 font-sans">
                      <Heart size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-300 mr-1.5">내면 아이에게 건네는 말:</span>
                        <span className="break-keep">{latestResult.innerChildGuidance}</span>
                      </div>
                    </div>
                  )}

                  {/* Lucy Deep Insight Consultation Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isModal && onClose) onClose();
                      void sendWishingWellToLucy(latestResult, openLucyChat, sendUnifiedMessage);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-400/40 text-amber-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <Sparkles size={13} className="text-amber-400" />
                    <span>이 소원으로 루시와 심층 상담하기</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!latestResult && (
              <>
                {/* 🌟 오늘의 시크릿 x 우물 AI 맞춤 공명 추천 영역 */}
                <WishingWellSecretRecommendations
                  onApplyWish={handleApplyWish}
                  onCastDirectly={handleCastDirectly}
                  onNavigateToSecret={handleNavigateToSecret}
                  isCasting={isCasting}
                />

                {/* Category Selection Glass Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/85 tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Compass size={13} className="text-amber-300" />
                      소원 영역 선택
                    </span>
                    <span className="text-[10px] text-white/45 font-mono">카테고리별 맞춤 주파수</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {WISH_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-500/30 via-white/[0.1] to-transparent border-amber-300/80 shadow-[0_8px_25px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] text-white ring-1 ring-amber-300/50'
                              : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/15 hover:border-white/25 text-white/70 hover:text-white shadow-sm'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/25 rounded-full blur-xl pointer-events-none" />
                          )}
                          <span className="text-2xl drop-shadow-sm shrink-0">{cat.emoji}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold tracking-tight break-keep break-words">{cat.label}</div>
                            <div className="text-[10px] text-white/50 break-keep break-words font-sans mt-0.5">
                              {cat.id === 'self_love'
                                ? '자존감 & 셀프러브'
                                : cat.id === 'inner_peace'
                                ? '마음의 평온 & 안식'
                                : cat.id === 'courage'
                                ? '도전과 성장 용기'
                                : cat.id === 'relationship'
                                ? '따뜻한 연결 & 화해'
                                : '꿈과 비전 실현'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Wish Inspiration Chips */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/65">
                    <Feather size={12} className="text-amber-300" />
                    <span>밤하늘에 띄울 추천 소망 문구 (클릭 시 자동 입력)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_WISH_CHIPS[selectedCategory]?.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWishInput(chip)}
                        className="text-left px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.11] border border-white/15 hover:border-amber-300/50 text-[11px] text-white/75 hover:text-amber-200 transition-all cursor-pointer active:scale-98 backdrop-blur-md font-medium"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glass Wish Input Area */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white/85 tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-300" />
                      <span>소원 작성</span>
                      <span className="text-[10px] text-amber-300/90 font-normal font-sans">(선택 사항)</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/45">{wishInput.length}/200자</span>
                  </label>
                  <div className="relative rounded-2xl bg-black/45 border border-white/20 backdrop-blur-2xl focus-within:border-amber-300/70 focus-within:ring-1 focus-within:ring-amber-300/40 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
                    <textarea
                      id="wishing-well-textarea"
                      value={wishInput}
                      onChange={(e) => setWishInput(e.target.value.slice(0, 200))}
                      placeholder={`별에게 띄울 소원을 직접 적으셔도 좋고, 비워두시면 '${selectedCategoryMeta.label}'의 기본 소망으로 별빛이 화답합니다...`}
                      rows={3}
                      className="w-full p-4 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none resize-none leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs backdrop-blur-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Glass CTA Button */}
                <button
                  id="wishing-well-submit-btn"
                  type="button"
                  disabled={isCasting}
                  onClick={handleCastWish}
                  className="w-full py-4 sm:py-4.5 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 hover:from-amber-200 hover:to-yellow-200 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-[0_12px_35px_rgba(245,158,11,0.4),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center gap-2.5 cursor-pointer tracking-wide"
                >
                  {isCasting ? (
                    <>
                      <Star className="w-5 h-5 animate-spin text-slate-950 fill-slate-950" />
                      <span>별빛의 화답을 듣는 중... (슈웅~)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>
                        {wishInput.trim()
                          ? '별에게 소원 띄우기 (슈웅~)'
                          : `${selectedCategoryMeta.emoji} [${selectedCategoryMeta.label}] 별에게 소원 빌기`}
                      </span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          /* 별의 기억 (히스토리 탭) */
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-white/50 text-xs font-sans">
                <Sparkles className="w-8 h-8 animate-pulse text-amber-300" />
                <span>별빛에 담긴 기억들을 불러오고 있습니다...</span>
              </div>
            ) : wishesHistory.length === 0 ? (
              <div className="py-20 text-center text-white/50 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center mx-auto text-amber-300/50 shadow-inner">
                  <Star className="w-7 h-7 text-amber-300/50 fill-amber-300/20" />
                </div>
                <p className="text-sm font-bold text-white/80">아직 별에 띄운 소원이 없습니다.</p>
                <p className="text-xs text-white/45 font-sans">
                  밤하늘 첫 번째 별에 소망을 띄우고 내면 아이와 따뜻하게 교감해보세요.
                </p>
                <button
                  onClick={() => setActiveTab('cast')}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs font-bold transition-all cursor-pointer"
                >
                  별에게 소원 빌러 가기 &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishesHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 sm:p-6 rounded-[24px] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-black/50 border border-white/20 hover:border-amber-300/50 transition-all space-y-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-400/25 text-amber-200 border border-amber-300/40 font-mono flex items-center gap-1">
                          <Star size={10} className="text-amber-300 fill-amber-300/40" />
                          #{item.crystalKeyword}
                        </span>
                        <span className="text-xs text-white/60">{item.categoryLabel}</span>
                      </div>
                      <TTSButton
                        text={`${item.echo}. ${item.innerChildGuidance}`}
                        voice="Kore"
                        className="scale-90 text-amber-300 border-amber-300/40 bg-amber-500/15"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-black text-amber-300/80 uppercase tracking-[0.2em] mb-1 font-mono">
                        나의 소망
                      </div>
                      <p className="text-sm font-medium text-white/95 font-serif italic">
                        &ldquo;{item.wish}&rdquo;
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/[0.08] border border-amber-300/25 space-y-1.5 backdrop-blur-xl">
                      <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Sparkles size={11} className="text-amber-300" />
                        <span>별빛의 메아리</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans font-medium break-keep">
                        {item.echo}
                      </p>
                    </div>

                    {item.innerChildGuidance && (
                      <div className="flex items-start gap-2 text-xs text-emerald-200 font-sans pt-1">
                        <Heart size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="break-keep">{item.innerChildGuidance}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!isModal) {
    return wellContent;
  }

  return (
    <div
      id="wishing-well-modal"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex justify-center"
      >
        {wellContent}
      </motion.div>
    </div>
  );
}
