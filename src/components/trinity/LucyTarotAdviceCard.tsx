import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronRight,
  MessageCircle,
  Lightbulb,
  Heart,
  Compass,
} from 'lucide-react';
import { TarotCard, getTarotCardImageUrl } from '@/data/tarotData';
import { TarotResultShareButton } from './TodayTarotShareModal';
import { type TarotShareData } from '@/utils/todayTarotExporter';
import { useApp } from '@/contexts/AppContext';
import {
  LucyTarotAdvice,
  LucyTarotAdviceParams,
  buildDeterministicLucyAdvice,
  getEnhancedLucyTarotAdvice,
} from '@/lib/lucyTarotAdvice';
import { playTTSInChunks, stopTTS, useTTSActive, subscribeTTS } from '@/utils/tts';
import { TTSHighlightedText } from '@/components/common/TTSHighlightedText';

export interface LucyTarotAdviceCardProps {
  cards?: any[] | null;
  tarotConcern?: string;
  readingText?: string;
  mode?: 'standard' | 'daily' | 'oracle';
  oracleMode?: 'healing' | 'growth' | 'miracle';
  saju?: any;
  className?: string;
  onConsultLucy?: () => void;
}

export function LucyTarotAdviceCard({
  cards,
  tarotConcern = '오늘의 타로',
  readingText = '',
  mode = 'standard',
  oracleMode,
  saju,
  className = '',
  onConsultLucy,
}: LucyTarotAdviceCardProps) {
  const { sharedState, openLucyChat } = useApp();
  const rawNick = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
  const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';

  const params = useMemo<LucyTarotAdviceParams>(() => ({
    cards,
    tarotConcern,
    readingText,
    nickname,
    mode,
    oracleMode,
    saju,
  }), [cards, tarotConcern, readingText, nickname, mode, oracleMode, saju]);

  // Initial instant deterministic advice
  const [advice, setAdvice] = useState<LucyTarotAdvice>(() => buildDeterministicLucyAdvice(params));
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingMyTTS, setIsPlayingMyTTS] = useState(false);
  const isGlobalTTSActive = useTTSActive();

  // Async background enhancement when parameters change
  useEffect(() => {
    let isCurrent = true;
    const initial = buildDeterministicLucyAdvice(params);
    setAdvice(initial);

    getEnhancedLucyTarotAdvice(params, (enhanced) => {
      if (isCurrent && enhanced) {
        setAdvice(enhanced);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [params]);

  // Subscribe to TTS state to track active playback
  useEffect(() => {
    const unsub = subscribeTTS((state) => {
      if (!state.isSpeaking) {
        setIsPlayingMyTTS(false);
        return;
      }
      const activeText = state.activeText || state.activeFullText || '';
      if (advice.speechText && activeText.includes(advice.headline.slice(0, 10))) {
        setIsPlayingMyTTS(true);
      } else {
        setIsPlayingMyTTS(false);
      }
    });
    return unsub;
  }, [advice.speechText, advice.headline]);

  // TTS Toggle Handler
  const handleToggleTTS = useCallback(async () => {
    if (isPlayingMyTTS && isGlobalTTSActive) {
      stopTTS();
      setIsPlayingMyTTS(false);
      return;
    }

    if (!advice.speechText) return;
    setIsPlayingMyTTS(true);
    await playTTSInChunks(advice.speechText, 'Kore', 110);
  }, [isPlayingMyTTS, isGlobalTTSActive, advice.speechText]);

  // Copy advice to clipboard
  const handleCopy = useCallback(() => {
    if (!advice) return;
    const fullText = `[✨ 루시의 특별 조언]\n${advice.headline}\n\n${advice.advice}\n\n🌿 오늘의 실천: ${advice.actionTip}\n${advice.keyword}`;
    navigator.clipboard?.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {});
  }, [advice]);

  // Deep consultation click
  const handleDeepConsult = useCallback(() => {
    if (onConsultLucy) {
      onConsultLucy();
      return;
    }
    const cardSummary = (cards || []).map((c) => `${c.nameKo}${c.reversed ? '(역방향)' : ''}`).join(', ');
    const deepContext = `[🔮 루시의 특별 타로 조언 연계 대화]\n- 고민/주제: "${tarotConcern}"\n- 뽑은 카드: [${cardSummary || '타로 카드'}]\n- 루시의 조언: "${advice.headline}"\n${advice.advice}\n- 실천 과제: ${advice.actionTip}`;
    openLucyChat('lucy', {
      draftPrompt: `루시야, 방금 타로 리딩에서 네가 해준 조언 "${advice.headline}"에 대해 더 깊이 이야기 나누고 싶어.`,
      autoSendPrompt: `루시야, 방금 타로 결과에서 네가 건네준 특별 조언:\n\n"${advice.headline}"\n"${advice.advice}"\n\n이 조언을 바탕으로 내 상황에 대해 조금 더 구체적으로 조언해줘.`,
      mode: 'casual',
    });
  }, [onConsultLucy, cards, tarotConcern, advice, openLucyChat]);

  const isHealing = mode === 'oracle' && oracleMode === 'healing';
  const isGrowth = mode === 'oracle' && oracleMode === 'growth';
  const isMiracle = mode === 'oracle' && oracleMode === 'miracle';

  const badgeTitle = isHealing
    ? '사주 ✕ 타로 오라클 마스터 조언'
    : isGrowth
    ? '루시의 그로스 실행 코칭'
    : isMiracle
    ? '기적수업 지각전환 마스터 조언'
    : '루시의 특별 맞춤 조언';

  const shareData: TarotShareData = useMemo(() => {
    const cardItems = cards && cards.length > 0 ? cards.map((c, i) => ({
      id: c.id,
      nameKo: c.nameKo || c.name || '타로 카드',
      name: c.name || '',
      reversed: !!c.reversed,
      keywords: c.keywords,
      imageUrl: c.imageUrl || (typeof getTarotCardImageUrl === 'function' ? getTarotCardImageUrl(c) : undefined),
      slotName: c.slotName || (cards.length > 1 ? `#${i + 1} 카드` : undefined),
    })) : [];

    const defaultTitle = mode === 'daily'
      ? '오늘의 데일리 타로'
      : mode === 'oracle'
      ? (oracleMode === 'healing' ? '사주 ✕ 타로 마스터 오라클' : oracleMode === 'miracle' ? '기적수업 지각전환 오라클' : '루시의 성장 오라클')
      : '78장 타로 마스터 비전';

    return {
      title: defaultTitle,
      concern: tarotConcern,
      cards: cardItems,
      card: cardItems[0] || null,
      dateStr: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      diagnosis: readingText,
      adviceHeadline: advice.headline,
      adviceText: advice.advice,
      frequency: saju?.yongsin?.name ? `${saju.yongsin.name} 용신 조화` : undefined,
    };
  }, [cards, mode, oracleMode, tarotConcern, readingText, advice.headline, advice.advice, saju]);

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-purple-950/25 border border-yellow-500/35 p-4 sm:p-5 shadow-xl relative overflow-hidden text-left backdrop-blur-md ${className}`}
    >
      <div className="absolute top-0 right-0 w-44 h-44 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black shadow-md shrink-0">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">
                LUCY'S SPECIAL ADVICE
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
                {badgeTitle}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 font-sans">
              {nickname} 님을 위한 1:1 영혼 가이드
            </h4>
          </div>
        </div>

        {/* Action Toolbar: TTS + Share + Copy */}
        <div className="flex items-center gap-2">
          {/* TTS Audio Button */}
          <button
            type="button"
            onClick={handleToggleTTS}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
              isPlayingMyTTS
                ? 'bg-amber-400 text-black border border-amber-300 animate-pulse'
                : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-400/35 hover:border-yellow-400/60'
            }`}
            title={isPlayingMyTTS ? '루시 음성 낭독 중지' : '루시 목소리로 조언 듣기'}
          >
            {isPlayingMyTTS ? (
              <>
                <VolumeX size={13} />
                <span className="text-[11px]">낭독 중지</span>
                <span className="flex gap-0.5 ml-0.5">
                  <span className="w-1 h-2 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-3 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-2 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </>
            ) : (
              <>
                <Volume2 size={13} className="text-yellow-400" />
                <span className="text-[11px]">루시 조언 듣기</span>
              </>
            )}
          </button>

          {/* Share Button (Image Save & Text Copy) */}
          <TarotResultShareButton
            data={shareData}
            variant="compact"
            label="결과 공유"
          />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            title="루시의 조언 복사"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Advice Content Body */}
      <div className="pt-3.5 space-y-3 relative z-10">
        {/* Headline Quote */}
        <div className="flex items-start gap-2 text-yellow-300 font-bold text-xs sm:text-sm font-sans leading-snug">
          <Lightbulb size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <span>&ldquo;<TTSHighlightedText text={advice.headline} />&rdquo;</span>
        </div>

        {/* Advice Paragraph */}
        <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-sans pl-1">
          <TTSHighlightedText text={advice.advice} />
        </p>

        {/* Action Tip Pill */}
        <div className="p-3 rounded-xl bg-black/40 border border-yellow-500/25 flex items-start gap-2.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 shrink-0 mt-0.5">
            <TTSHighlightedText text="오늘의 실천" />
          </span>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            <TTSHighlightedText text={advice.actionTip} />
          </p>
        </div>

        {/* Energy Keywords & Deep Chat CTA */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <span className="text-[11px] font-mono text-yellow-400/80">
            {advice.keyword}
          </span>

          <button
            type="button"
            onClick={handleDeepConsult}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
          >
            <MessageCircle size={12} />
            <span>루시와 이 조언으로 대화하기</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LucyTarotAdviceCard;
