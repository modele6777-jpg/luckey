import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'wouter';
import { 
  Sparkles, 
  MessageCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Heart, 
  Zap, 
  ArrowRight,
  Sun,
  Moon,
  Compass,
  Clock,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkle,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { TTSButton } from '@/components/TTSButton';
import { 
  TodayLucyPersonaData, 
  getCachedTodayLucyPersona, 
  generatePersonalizedLucyPersonaMessage, 
  shuffleNextLucyPersonaMessage 
} from '@/lib/todayLucyPersona';
import {
  calculateTodayIljin,
  calculateTodayCosmicTransit,
  getBestieTimeGreeting,
  getDailyLuckyPrescription,
  QUICK_EMPATHY_REACTIONS,
  QuickEmpathyReaction,
} from '@/lib/dailyCareTransit';
import { getTodayTrinityDailyResult } from '@/lib/todayTarotNarration';
import { TodayTarotNarrationModal } from '@/components/trinity/TodayTarotNarrationModal';

interface TodayLucyPersonaCardProps {
  saju?: any;
  biometrics?: { fatigue: number; stress: number; focus: number; sleep: number };
  globalInsight?: string;
  className?: string;
}

export function TodayLucyPersonaCard({
  saju,
  biometrics,
  globalInsight,
  className = "",
}: TodayLucyPersonaCardProps) {
  const [, navigate] = useLocation();
  const { sharedState, openLucyChat } = useApp();
  const [data, setData] = useState<TodayLucyPersonaData>(() => getCachedTodayLucyPersona());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isTarotNarrationOpen, setIsTarotNarrationOpen] = useState(false);
  const [showTransitDetail, setShowTransitDetail] = useState(false);

  // Zaya-style: User's selected emotion reaction
  const [selectedReaction, setSelectedReaction] = useState<QuickEmpathyReaction | null>(null);

  const rawNick = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
  const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
  const vibe = sharedState?.currentVibe || '평온함';

  // Calculate astronomical & Saju transits for today
  const todayIljin = useMemo(() => calculateTodayIljin(new Date()), []);
  const cosmicTransit = useMemo(() => calculateTodayCosmicTransit(new Date()), []);
  const luckyPrescription = useMemo(() => getDailyLuckyPrescription(todayIljin), [todayIljin]);
  const luckyDirectionLabel = useMemo(() => {
    const dir = luckyPrescription.luckyDirection || '';
    if (dir === '중앙') return '중앙';
    if (dir.endsWith('쪽')) return dir;
    return `${dir}쪽`;
  }, [luckyPrescription.luckyDirection]);
  const bestieGreeting = useMemo(() => getBestieTimeGreeting(nickname, todayIljin), [nickname, todayIljin]);

  // Check today's daily tarot result from cache/sharedState
  const todayTarotResult = useMemo(() => {
    return getTodayTrinityDailyResult();
  }, [isRefreshing]);

  // Format today's date in Korean: e.g. "10월 1일 목요일"
  const formattedTodayDate = useMemo(() => {
    return new Date().toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  }, []);

  // Update with AI-personalized message if cached item is from a previous state or default
  useEffect(() => {
    if (data.source === 'curated') {
      const sajuText = saju ? `${saju.dayMaster?.hanja || ''}(${saju.dayMaster?.korean || ''}) 본원, ${saju.elements?.dominant?.element || ''} 기운` : undefined;
      generatePersonalizedLucyPersonaMessage({
        nickname,
        sajuSummary: sajuText,
        vibe,
        biometrics,
        globalInsight,
      }).then((fresh) => {
        setData(fresh);
      }).catch(() => {
        // Keep curated fallback
      });
    }
  }, []);

  // Handle manual refresh / shuffle
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setSelectedReaction(null);

    try {
      const next = shuffleNextLucyPersonaMessage(data.id);
      setData(next);
    } catch (_) {
      // fallback
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [data.id, isRefreshing]);

  // Handle copying text to clipboard
  const handleCopy = useCallback(() => {
    const fullText = `[루시의 먼저 건네는 데일리 케어 & 운세 브리핑]\n"${bestieGreeting.greetingHeadline}"\n\n${selectedReaction ? selectedReaction.lucyReply : data.message}\n\n🌟 오늘의 일진: ${todayIljin.iljinTitle}\n🪐 우주 트랜짓: ${cosmicTransit.moonPhaseName} · ${cosmicTransit.planetaryTransitTitle}\n💡 오늘의 실천: ${selectedReaction ? selectedReaction.suggestedAction : data.actionTip}\n#Lucy #ZayaStyle #PRISM #데일리케어`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [bestieGreeting, data, selectedReaction, todayIljin, cosmicTransit]);

  // Open Lucy Chat with rich context
  const handleOpenLucyChat = useCallback((emotionReply?: string) => {
    let draftPrompt = `루시야, 오늘 "${bestieGreeting.careQuestion}"라고 물어봐줘서 답장해!\n\n`;
    if (emotionReply) {
      draftPrompt += `내 현재 상태는 [${emotionReply}]야. 오늘 ${todayIljin.dayStemKorean}${todayIljin.dayBranchKorean}일 일진과 내 사주 흐름에 맞춰 다정하게 속마음 나눠줘.`;
    } else {
      draftPrompt += `오늘 일진("${todayIljin.iljinTitle}")과 메시지("${data.headline}")에 대해 더 깊은 이야기 나누고 싶어!`;
    }
    openLucyChat('lucy', { draftPrompt });
  }, [bestieGreeting.careQuestion, data.headline, openLucyChat, todayIljin]);

  // Full speech text for TTS
  const speechText = useMemo(() => {
    if (selectedReaction) {
      return `${bestieGreeting.greetingHeadline}. ${selectedReaction.responseHeadline}. ${selectedReaction.lucyReply}. 오늘의 추천 실천: ${selectedReaction.suggestedAction}.`;
    }
    return `${bestieGreeting.greetingHeadline}. ${data.headline}. ${data.message}. 오늘의 일진은 ${todayIljin.iljinTitle}이며, ${todayIljin.energyFlow}. 오늘의 실천 팁: ${data.actionTip}.`;
  }, [bestieGreeting, data, selectedReaction, todayIljin]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`glass prism-xs-hub-card relative rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.4)] overflow-hidden group bg-gradient-to-br from-indigo-950/50 via-purple-950/25 to-black/70 backdrop-blur-2xl mb-6 transition-all duration-300 hover:border-white/25 hover:shadow-[0_16px_55px_rgba(99,102,241,0.2)] ${className}`}
    >
      {/* Iridescent Cosmic Aura Background Glow */}
      <div 
        className="absolute -top-28 -right-28 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none transition-transform duration-1000 group-hover:scale-125"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.85) 0%, rgba(59,130,246,0.5) 50%, transparent 80%)' }}
      />
      <div 
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-[90px] opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.75) 0%, rgba(245,158,11,0.45) 60%, transparent 80%)' }}
      />

      <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
        {/* Top Header Bar: Clean unboxed typography (zero-pill discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Lucy Avatar with Glowing Breathing Aura */}
            <div className="relative w-12 h-12 rounded-2xl border border-white/25 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(168,85,247,0.4)] backdrop-blur-md bg-gradient-to-br from-purple-500/35 via-pink-500/25 to-amber-500/35 group/avatar">
              <Sparkles size={22} className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] transition-transform duration-500 group-hover/avatar:rotate-12 group-hover/avatar:scale-110 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border border-white/40 animate-ping opacity-25 pointer-events-none" />
            </div>

            {/* Title & Metadata Line */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-white/50">
                <span className="font-bold text-amber-300/90 flex items-center gap-1">
                  <Sun size={12} className="text-amber-400" />
                  LUCY BESTIE CARE
                </span>
                <span aria-hidden="true" className="text-white/20">·</span>
                <span className="text-purple-300 font-semibold">{bestieGreeting.timeLabel}</span>
                <span aria-hidden="true" className="text-white/20">·</span>
                <span className="text-white/40">{formattedTodayDate}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>먼저 말 건네는 베프의 데일리 케어</span>
                <span className="text-xs font-normal text-amber-300/80 font-sans hidden sm:inline">
                  · {todayIljin.dayStemKorean}{todayIljin.dayBranchKorean}일 브리핑
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Header Controls (TTS, Refresh, Copy) */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            {/* Audio TTS Button */}
            <div title="루시 목소리로 데일리 브리핑 듣기" className="flex items-center">
              <TTSButton 
                text={speechText} 
                voice="Lucy"
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95" 
              />
            </div>

            {/* Refresh / Next Message Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="새로운 데일리 케어 메시지 보기"
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={15} className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin text-purple-400' : 'group-hover:rotate-45'}`} />
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title="데일리 브리핑 복사하기"
              className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isCopied ? (
                <Check size={15} className="text-emerald-400" />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>
        </div>

        {/* 🌟 1. Today's Transit & Iljin Live Strip (실시간 천간지지 일진 & 달의 위상 스트립) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-wrap text-xs text-white/80">
            {/* Iljin Badge */}
            <div className="flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-bold tracking-wide">
                {todayIljin.iljinTitle}
              </span>
            </div>
            <span aria-hidden="true" className="text-white/20 hidden sm:inline">·</span>

            {/* Moon Phase & Planetary transit */}
            <div className="flex items-center gap-1.5 text-stone-300">
              <Moon size={12} className="text-purple-300 shrink-0" />
              <span>{cosmicTransit.moonPhaseName} ({cosmicTransit.moonIllumination}%)</span>
            </div>
            <span aria-hidden="true" className="text-white/20 hidden md:inline">·</span>

            <div className="hidden md:flex items-center gap-1.5 text-white/60">
              <Compass size={12} className="text-cyan-300 shrink-0" />
              <span>{cosmicTransit.planetaryTransitTitle}</span>
            </div>
          </div>

          {/* Toggle Transit Details Button */}
          <button
            type="button"
            onClick={() => setShowTransitDetail((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-300/80 hover:text-purple-200 transition-colors ml-auto cursor-pointer"
          >
            <span>{showTransitDetail ? "행운 처방 접기" : "행운 처방 보기"}</span>
            {showTransitDetail ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Expandable Transit & Lucky Prescription Drawer */}
        <AnimatePresence>
          {showTransitDetail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-black/50 border border-purple-500/25 shadow-2xl backdrop-blur-xl text-xs">
                {/* Header: Title & Daily Pillar Context */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-amber-300 animate-pulse" />
                    <span className="font-bold text-sm text-white font-display">
                      오늘의 오행 맞춤 행운 처방 (Lucky Prescription)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                      {todayIljin.dayElement} 기운 보양
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 font-sans">
                    {todayIljin.dateString} · {todayIljin.iljinTitle}
                  </span>
                </div>

                {/* 4 Spacious Prescription Cards (2x2 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Lucky Color */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-purple-400/30 hover:bg-white/[0.06] transition-all">
                    <div
                      className="w-9 h-9 rounded-xl border border-white/20 shrink-0 shadow-md flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: luckyPrescription.luckyColorHex }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white/50 ring-2 ring-black/20" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-semibold">
                          행운의 컬러
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                          {luckyPrescription.luckyColorHex}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white leading-snug break-keep mt-1">
                        {luckyPrescription.luckyColor}
                      </span>
                      <span className="text-[11px] text-white/50 leading-relaxed font-sans mt-0.5 break-keep">
                        의상, 소품, 폰 배경화면으로 조화로운 기운 흡수
                      </span>
                    </div>
                  </div>

                  {/* 2. Lucky Time */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.06] transition-all">
                    <div className="w-9 h-9 rounded-xl border border-amber-400/30 bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-300 shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          최적의 행운 시간대
                        </span>
                        <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                          골든 아워
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white leading-snug break-keep mt-1">
                        {luckyPrescription.luckyTime}
                      </span>
                      <span className="text-[11px] text-white/50 leading-relaxed font-sans mt-0.5 break-keep">
                        집중 몰입, 중요 결정, 자기 돌봄에 가장 길한 기운
                      </span>
                    </div>
                  </div>

                  {/* 3. Lucky Activity */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/30 hover:bg-white/[0.06] transition-all">
                    <div className="w-9 h-9 rounded-xl border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300 shadow-sm">
                      <Sparkle size={18} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                          에너지 리셋 행동
                        </span>
                        <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                          개운 실천
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white leading-snug break-keep mt-1">
                        {luckyPrescription.luckyActivity}
                      </p>
                      <span className="text-[11px] text-white/50 leading-relaxed font-sans mt-0.5 break-keep">
                        몸과 마음에 고인 스트레스를 비우고 활력을 일깨우는 행동
                      </span>
                    </div>
                  </div>

                  {/* 4. Lucky Direction & Food */}
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all">
                    <div className="w-9 h-9 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300 shadow-sm">
                      <Compass size={18} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                          길방향 & 힐링 음식
                        </span>
                        <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                          길방 {luckyDirectionLabel}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white leading-snug break-keep mt-1">
                        {luckyPrescription.luckyFood}
                      </p>
                      <span className="text-[11px] text-white/50 leading-relaxed font-sans mt-0.5 break-keep">
                        {luckyDirectionLabel}을 향해 심호흡하고 속을 편안하게 채우기
                      </span>
                    </div>
                  </div>
                </div>

                {/* Energy Flow & Elemental Advice Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20">
                  <div className="flex items-start sm:items-center gap-2">
                    <Zap size={14} className="text-amber-300 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-purple-200 shrink-0">오늘의 오행 기운 조언:</span>
                      <span className="text-white/90 break-keep font-sans">{todayIljin.elementalAdvice}</span>
                    </div>
                  </div>
                  {todayIljin.elementDetail?.organs && (
                    <span className="text-[10px] text-white/40 font-mono sm:text-right shrink-0">
                      보양 장부: {todayIljin.elementDetail.organs}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 💬 2. Proactive Bestie Speaking Bubble (먼저 건네는 베프의 안부) */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-pink-900/20 border border-purple-500/25">
          <div className="flex items-start gap-3">
            <span className="text-xl sm:text-2xl shrink-0 select-none">💬</span>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs font-bold text-purple-200 tracking-wide font-sans">
                {bestieGreeting.greetingHeadline}
              </span>
              <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed font-sans break-keep">
                "{bestieGreeting.careQuestion}"
              </p>
              <span className="text-xs text-white/60 font-sans mt-0.5">
                {bestieGreeting.proactiveMessage}
              </span>
            </div>
          </div>
        </div>

        {/* 💖 3. Interactive Quick Emotion Reaction Buttons (루시에게 내 기분 답장하기) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-white/50 px-1 font-sans">
            <span>지금 내 마음 상태를 루시에게 톡 눌러 알려줘:</span>
            {selectedReaction && (
              <button
                type="button"
                onClick={() => setSelectedReaction(null)}
                className="text-purple-300 hover:text-white underline text-[11px] cursor-pointer"
              >
                처음 메시지로 되돌리기
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_EMPATHY_REACTIONS.map((rx) => {
              const isSelected = selectedReaction?.id === rx.id;
              return (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => setSelectedReaction(rx)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-purple-500/30 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-white/75 hover:text-white border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-base select-none">{rx.emoji}</span>
                  <span className="truncate">{rx.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 💌 4. Content Body: Dynamic Persona Message or Emotion Empathy Response */}
        <AnimatePresence mode="wait">
          {selectedReaction ? (
            <motion.div
              key={selectedReaction.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30"
            >
              {/* Empathy Response Headline */}
              <div className="flex items-center gap-2 text-amber-300">
                <Heart size={16} className="text-rose-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-bold font-display text-white tracking-tight break-keep">
                  {selectedReaction.responseHeadline}
                </h3>
              </div>

              {/* Lucy's Caring Voice Message */}
              <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed font-sans break-keep pl-3 border-l-2 border-rose-500/50">
                {selectedReaction.lucyReply}
              </p>

              {/* Action Tip */}
              <div className="flex items-center gap-2 pl-3 pt-1 text-xs text-amber-300/90 font-medium font-sans">
                <Zap size={13} className="text-amber-400 shrink-0" />
                <span className="text-white/40 font-mono text-[10px] uppercase">LUCY'S RX</span>
                <span className="text-white/30">·</span>
                <span className="break-keep">{selectedReaction.suggestedAction}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3"
            >
              {/* Headline Quote */}
              <div className="flex items-start gap-2.5">
                <span className="text-2xl text-purple-400/80 leading-none select-none font-serif">“</span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight break-keep pt-0.5">
                  {data.headline}
                </h3>
              </div>

              {/* Deep Lucy Message (100% 반말 친근한 톤) */}
              <p className="text-sm sm:text-[15px] text-white/85 leading-relaxed font-sans break-keep pl-5 sm:pl-6 border-l-2 border-purple-500/40 my-0.5">
                {data.message}
              </p>

              {/* Action Tip Kicker (현실 실천 가이드) */}
              {data.actionTip && (
                <div className="flex items-center gap-2 pl-5 sm:pl-6 pt-1 text-xs text-amber-300/90 font-medium font-sans">
                  <Zap size={13} className="text-amber-400 shrink-0" />
                  <span className="text-white/40 font-mono text-[10px] uppercase">LUCY'S TIP</span>
                  <span className="text-white/30">·</span>
                  <span className="break-keep">{data.actionTip}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 5. 오늘의 타로 결과 데일리 배너 & 낭독 버전 바로듣기 (오늘 뽑은 카드가 있을 때 노출) */}
        {todayTarotResult?.drawnCard && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-purple-950/20 border border-yellow-500/30 text-xs text-white/90 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.25)]">
                <Sparkles size={15} className="animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-extrabold">
                    오늘의 타로 (TODAY'S TAROT)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30 font-semibold">
                    {todayTarotResult.drawnCard.reversed ? '역방향' : '정방향'}
                  </span>
                </div>
                <p className="text-xs text-stone-200 font-medium break-keep break-words mt-0.5">
                  ✨ {todayTarotResult.drawnCard.nameKo} <span className="text-[10px] text-white/50">({todayTarotResult.drawnCard.name})</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTarotNarrationOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(234,179,8,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 font-sans"
              title="오늘의 타로 결과 및 음성 낭독 보기"
            >
              <Sparkles size={13} />
              <span>오늘의 타로 결과 보기</span>
            </button>
          </div>
        )}

        {/* 🤝 6. Bottom Interactive Bar: Converse with Lucy */}
        <div className="pt-2 sm:pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/50 font-sans">
            <Heart size={13} className="text-rose-400/80" />
            <span>
              {selectedReaction
                ? `루시가 네 감정을 소중하게 기억하고 있어`
                : `루시와 실시간으로 속마음을 나누고 통찰을 얻어보세요`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenLucyChat(selectedReaction?.label)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-600/70 via-indigo-600/60 to-pink-600/70 hover:from-purple-600/90 hover:via-indigo-600/80 hover:to-pink-600/90 border border-purple-400/40 hover:border-purple-300/60 shadow-[0_4px_20px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-sans"
          >
            <MessageCircle size={14} className="text-purple-200" />
            <span>
              {selectedReaction 
                ? `루시에게 "${selectedReaction.label}" 이야기 털어놓기`
                : `루시에게 답장하고 1:1 대화 나누기`}
            </span>
            <ArrowRight size={13} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 🔮 오늘의 타로 통합 결과 & 음성 낭독 모달 */}
      <TodayTarotNarrationModal
        isOpen={isTarotNarrationOpen}
        onClose={() => setIsTarotNarrationOpen(false)}
        dailyResult={todayTarotResult}
        onConsultLucy={(cardContext) => {
          setIsTarotNarrationOpen(false);
          openLucyChat('lucy', {
            draftPrompt: `루시야, 방금 뽑은 오늘의 타로 카드 결과를 확인했어!\n\n${cardContext}\n\n이 카드의 메시지와 실천 방향에 대해 더 깊은 통찰을 나눠줘.`,
          });
        }}
      />
    </motion.div>
  );
}

export default TodayLucyPersonaCard;
