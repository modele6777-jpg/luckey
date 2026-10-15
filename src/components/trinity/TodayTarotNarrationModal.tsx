import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Compass,
  Sun,
  Eye,
  ChevronRight,
  Copy,
  Check,
  ZoomIn,
} from 'lucide-react';
import { Streamdown } from '@/components/Streamdown';
import { playTTSInChunks, stopTTS, useTTSActive, useTTSState } from '@/utils/tts';
import { TTSHighlightText } from '@/utils/ttsHighlight';
import {
  buildTarotNarrationContent,
  type TarotNarrationChapter,
} from '@/lib/todayTarotNarration';
import { LucyTarotAdviceCard } from './LucyTarotAdviceCard';
import { TarotSummaryGraphicCard } from './TarotSummaryGraphicCard';
import { TodayTarotShareButton } from './TodayTarotShareModal';
import { TarotCardZoomModal } from './TarotCardZoomModal';
import { TarotFlippingCard } from './TarotFlippingCard';
import { type TodayTarotShareData } from '@/utils/todayTarotExporter';
import { stripSummaryFromTarotText } from '@/lib/tarotSummaryUtils';
import { TAROT_DECK, TarotCard } from '@/data/tarotData';
import { TarotSpread } from './TarotSpread';
import { FollowUpTarotTimeline, FollowUpTarotEntry } from './FollowUpTarotTimeline';
import { FollowUpTarotInputBar } from './FollowUpTarotInputBar';
import { invokeLLMStream } from '@/lib/ai';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { getTodayDateKey } from '@/lib/dailyCache';
import { useSmartScroll } from '@/hooks/useSmartScroll';
import { SmartScrollResumeButton } from '@/components/common/SmartScrollResumeButton';

export interface TodayTarotNarrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyResult: any;
  initialMode?: 'narration' | 'text';
  onConsultLucy?: (cardContext: string) => void;
  onGoToTarotWheel?: () => void;
}

export function TodayTarotNarrationModal({
  isOpen,
  onClose,
  dailyResult,
  onConsultLucy,
  onGoToTarotWheel,
}: TodayTarotNarrationModalProps) {
  const [selectedVoice, setSelectedVoice] = useState<'Lucy' | 'Kore'>('Lucy');
  const [activeSpeechType, setActiveSpeechType] = useState<'full' | 'summary' | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCardZoomOpen, setIsCardZoomOpen] = useState(false);

  // 🔮 오늘의 데일리 타로 연속 추가 질문 & 잔여 덱 관리 엔진
  const todayKey = useMemo(() => getTodayDateKey(), []);
  const storageKey = `trinity_daily_followups_${todayKey}`;

  const [dailyFollowUpEntries, setDailyFollowUpEntries] = useState<FollowUpTarotEntry[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);
        if (cached) return JSON.parse(cached);
      }
    } catch (_) {}
    return [];
  });

  const [isFollowUpGenerating, setIsFollowUpGenerating] = useState(false);
  const [showFollowUpWheelModal, setShowFollowUpWheelModal] = useState(false);
  const [pendingFollowUpQuestion, setPendingFollowUpQuestion] = useState('');
  const [zoomedTimelineCard, setZoomedTimelineCard] = useState<{ card: TarotCard; slotName?: string } | null>(null);

  // Persist daily follow-up entries
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(dailyFollowUpEntries));
    } catch (_) {}
  }, [dailyFollowUpEntries, storageKey]);

  const isTTSActive = useTTSActive();
  const ttsState = useTTSState();

  const modalScrollRef = useRef<HTMLDivElement>(null);
  const {
    isUserOverriding,
    remainingSeconds,
    resumeAutoScroll,
    hasActiveHighlight,
  } = useSmartScroll({
    containerRef: modalScrollRef,
    enabled: isOpen,
    resumeDelayMs: 3000,
  });

  const narrationData = useMemo(() => {
    return buildTarotNarrationContent(dailyResult);
  }, [dailyResult]);

  // 잔여 덱 계산 (오늘의 타로 1장 + 누적된 추가 질문 카드들 완전 제외)
  const dailyDrawnCardIds = useMemo(() => {
    const ids = new Set<string>();
    if (narrationData.card?.id) ids.add(narrationData.card.id);
    (dailyFollowUpEntries || []).forEach((entry) => { if (entry?.card?.id) ids.add(entry.card.id); });
    return ids;
  }, [narrationData.card, dailyFollowUpEntries]);

  const dailyRemainingDeck = useMemo(() => {
    return TAROT_DECK.filter((card) => !dailyDrawnCardIds.has(card.id));
  }, [dailyDrawnCardIds]);

  // 🔮 데일리 타로 심층 추가 리딩 실행기
  const executeDailyFollowUpReading = useCallback(async (
    questionText: string,
    chosenCard: TarotCard,
    isReversed: boolean,
  ) => {
    if (isFollowUpGenerating) return;

    const safeCard = chosenCard || TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
    const cardNameKo = safeCard.nameKo || safeCard.name || '타로 카드';
    const cardNameEn = safeCard.name || cardNameKo;
    const cardKeywords = Array.isArray(safeCard.keywords) ? safeCard.keywords.join(', ') : '';

    const newEntryId = `fu_daily_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newEntry: FollowUpTarotEntry = {
      id: newEntryId,
      question: questionText,
      card: safeCard,
      reversed: isReversed,
      reading: '',
      isGenerating: true,
      createdAt: Date.now(),
    };
    setDailyFollowUpEntries((prev) => [...prev, newEntry]);
    setIsFollowUpGenerating(true);

    let currentText = '';
    try {
      const cardName = narrationData.card ? `${narrationData.card.nameKo} (${narrationData.card.reversed ? '역방향' : '정방향'})` : '오늘의 데일리 타로';
      const initialReading = narrationData.cleanDiagnosis || narrationData.rawDiagnosis || '';

      const previousQAHistory = (dailyFollowUpEntries || [])
        .filter((e) => e && e.card && e.reading && !e.isGenerating)
        .map(
          (e, idx) =>
            `[추가 질문 #${idx + 1}] "${e.question || '추가 질문'}"\n[뽑힌 카드] ${e.card?.nameKo || e.card?.name || '타로 카드'} (${e.reversed ? '역방향' : '정방향'})\n[해설] ${(e.reading || '').slice(0, 250)}`,
        )
        .join('\n\n');

      const messagesForLLM = [
        {
          role: 'system',
          content: `당신은 78장 타로 마스터 '트리니티'입니다. 질문자가 오늘 뽑은 데일리 타로 카드(${cardName})에 이어, 이미 뽑힌 카드를 제외하고 남은 77장의 잔여 덱에서 새로운 카드를 추가로 뽑아 오늘 하루의 운과 흐름에 대해 심층 연속 질문을 던졌습니다.

[답변 규정]
1. 오늘 뽑힌 데일리 타로의 거시적 흐름과 새로 뽑힌 추가 카드의 정/역방향 상징을 관통하여 직관적이고 똑부러지게 답변하십시오.
2. 질문자가 던진 구체적인 추가 질문에 초점을 맞추어 오늘 하루 남은 시간 동안 실천할 수 있는 명확한 행동 지침과 현실적 조언을 제시하십시오.
3. 중복된 미사여구를 배제하고, 신뢰감 넘치는 정통 타로 마스터의 품격 있는 한국어로 작성하십시오.`,
        },
        {
          role: 'user',
          content: `[오늘의 데일리 타로] ${cardName}
[데일리 리딩 요약] ${initialReading ? initialReading.slice(0, 500) : ''}
${previousQAHistory ? `\n[이전 추가질문 이력]\n${previousQAHistory}\n` : ''}
[새로 뽑힌 잔여 덱 추가 카드] ${cardNameKo} (${cardNameEn}) - ${isReversed ? '역방향' : '정방향'} / 키워드: ${cardKeywords}
[이번 추가 질문] "${questionText}"`,
        },
      ];

      const fullGenerated = await invokeLLMStream({
        messages: messagesForLLM as any,
        onChunk: (chunk) => {
          currentText += chunk;
          setDailyFollowUpEntries((prev) =>
            prev.map((e) => (e.id === newEntryId ? { ...e, reading: currentText } : e)),
          );
        },
      });

      const finalText = fullGenerated || currentText;
      setDailyFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId ? { ...e, reading: finalText, isGenerating: false } : e,
        ),
      );
      playAudioHaptic('card_draw');
    } catch (err: any) {
      console.warn('[executeDailyFollowUpReading] Streaming interrupted, applying fallback interpretation:', err);
      const fallbackReading = `오늘 뽑힌 ${cardNameKo} (${isReversed ? '역방향' : '정방향'})의 에너지는 당신의 직관과 행동을 조화롭게 이끌어 줄 것입니다. 외부 상황의 변화에 흔들리지 마시고 중심을 지키며 오늘 하루를 보내세요.`;
      setDailyFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId
            ? { ...e, reading: currentText.trim() ? currentText : fallbackReading, isGenerating: false }
            : e,
        ),
      );
      playAudioHaptic('card_draw');
    } finally {
      setIsFollowUpGenerating(false);
    }
  }, [dailyFollowUpEntries, isFollowUpGenerating, narrationData]);

  const handleDirectFollowUpDraw = useCallback((questionText: string) => {
    setPendingFollowUpQuestion(questionText);
    setShowFollowUpWheelModal(true);
  }, []);

  const handleAutoFollowUpDraw = useCallback((questionText: string) => {
    if (isFollowUpGenerating) return;
    if (dailyRemainingDeck.length === 0) return;
    const randomIndex = Math.floor(Math.random() * dailyRemainingDeck.length);
    const chosenCard = dailyRemainingDeck[randomIndex];
    const isReversed = Math.random() < 0.35;
    playAudioHaptic('card_draw');
    executeDailyFollowUpReading(questionText, chosenCard, isReversed);
  }, [dailyRemainingDeck, executeDailyFollowUpReading, isFollowUpGenerating]);

  const handleFollowUpWheelComplete = useCallback((selected: any[]) => {
    setShowFollowUpWheelModal(false);
    if (!selected || selected.length === 0) return;
    const card = selected[0];
    const reversed = !!card.reversed;
    const q = pendingFollowUpQuestion || '오늘 하루에 대한 추가 통찰과 조언';
    setPendingFollowUpQuestion('');
    executeDailyFollowUpReading(q, card, reversed);
  }, [pendingFollowUpQuestion, executeDailyFollowUpReading]);

  const shareData: TodayTarotShareData = useMemo(() => ({
    title: '오늘의 데일리 타로',
    card: narrationData.card,
    dateStr: narrationData.dateKey
      ? `${narrationData.dateKey.slice(0, 4)}. ${narrationData.dateKey.slice(4, 6)}. ${narrationData.dateKey.slice(6, 8)}`
      : undefined,
    conciseSummaryBullets: narrationData.conciseSummaryBullets,
    diagnosis: narrationData.cleanDiagnosis || narrationData.rawDiagnosis,
    rawBlessing: narrationData.rawBlessing,
    frequency: narrationData.frequency,
    luckyNumber: narrationData.luckyNumber,
    luckyColor: narrationData.luckyColor,
  }), [narrationData]);

  // Clean up TTS audio on close
  const handleClose = useCallback(() => {
    stopTTS();
    setActiveSpeechType(null);
    onClose();
  }, [onClose]);

  // Sync TTS active state
  useEffect(() => {
    if (!isTTSActive) {
      setActiveSpeechType(null);
    }
  }, [isTTSActive]);

  // Full Narration Playback
  const handlePlayFullNarration = useCallback(async () => {
    if (isTTSActive && activeSpeechType === 'full') {
      stopTTS();
      setActiveSpeechType(null);
      return;
    }
    if (!narrationData.fullSpeech) return;

    setActiveSpeechType('full');
    await playTTSInChunks(narrationData.fullSpeech, 'Kore', 110);
  }, [isTTSActive, activeSpeechType, narrationData.fullSpeech]);

  // Summary TTS Playback
  const handlePlaySummary = useCallback(async () => {
    if (isTTSActive && activeSpeechType === 'summary') {
      stopTTS();
      setActiveSpeechType(null);
      return;
    }
    if (!narrationData.summarySpeechText) return;

    setActiveSpeechType('summary');
    await playTTSInChunks(narrationData.summarySpeechText, 'Kore', 110);
  }, [isTTSActive, activeSpeechType, narrationData.summarySpeechText]);

  const handleCopyText = useCallback(() => {
    if (!narrationData.cleanDiagnosis && !narrationData.rawDiagnosis) return;
    const cardInfo = narrationData.card
      ? `[오늘의 타로] ${narrationData.card.nameKo} (${narrationData.card.reversed ? '역방향' : '정방향'})\n\n`
      : '';
    const summaryText = narrationData.conciseSummaryBullets.length > 0
      ? `[핵심 3줄 요약]\n${narrationData.conciseSummaryBullets.join('\n')}\n\n`
      : '';
    const textToCopy =
      `✨ [오늘의 타로 리딩 결과]\n` +
      cardInfo +
      summaryText +
      `■ 마스터 심층 비전 리딩\n${narrationData.cleanDiagnosis || narrationData.rawDiagnosis}\n\n` +
      (narrationData.rawBlessing
        ? `■ 행운의 파동과 축복\n주파수: ${narrationData.frequency} · 행운수: ${narrationData.luckyNumber} · 행운색: ${narrationData.luckyColor}\n"${narrationData.rawBlessing}"\n`
        : '') +
      `- PRISM TRINITY ORACLE`;
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [narrationData]);

  const handleConsult = useCallback(() => {
    if (!onConsultLucy || !narrationData.card) return;
    const cardName = narrationData.card.nameKo || '오늘의 타로';
    const orientation = narrationData.card.reversed ? '역방향' : '정방향';
    const diag = narrationData.cleanDiagnosis || narrationData.rawDiagnosis || '';
    const summary = narrationData.conciseSummaryBullets.join(' ') || '';
    const context = `[🔮 오늘의 타로 데일리 연계]\n- 뽑은 카드: ${cardName} (${orientation})\n${summary ? `- 핵심 요약: ${summary}\n` : ''}- 마스터 비전 리딩:\n${diag.slice(0, 600)}`;
    handleClose();
    onConsultLucy(context);
  }, [onConsultLucy, narrationData, handleClose]);

  const card = narrationData.card;
  const isFullPlaying = isTTSActive && activeSpeechType === 'full';
  const isSummaryPlaying = isTTSActive && activeSpeechType === 'summary';

  const actualTarotCard: TarotCard | null = useMemo(() => {
    if (!card) return null;
    const found = TAROT_DECK.find((c) => c.id === card.id || c.nameKo === card.nameKo || c.name === card.name);
    if (found) {
      return { ...found, reversed: !!card.reversed };
    }
    return {
      id: card.id || 'daily_card',
      name: card.name,
      nameKo: card.nameKo,
      reversed: !!card.reversed,
      keywords: card.keywords || [],
      type: 'major',
      number: 0,
      element: 'Spirit',
      description: '',
    } as TarotCard;
  }, [card]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      >
        <motion.div
          ref={modalScrollRef}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0c0c12] border border-yellow-500/35 p-5 sm:p-7 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col space-y-5"
        >
          {/* Subtle Ambient Cosmic Glow */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #eab308 0%, #a855f7 50%, transparent 80%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-[80px] opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, #6366f1 50%, transparent 80%)' }}
          />

          {/* Header Title & Top Actions */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex flex-col justify-start gap-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400 font-mono">
                <Sparkles size={13} className="text-yellow-400 animate-pulse shrink-0" />
                <span className="truncate">오늘의 타로 오라클 (Today&apos;s Tarot Oracle)</span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight flex items-center gap-2 truncate">
                <span><TTSHighlightText text="오늘의 타로 리딩 & 음성 낭독" /></span>
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {card && (
                <TodayTarotShareButton
                  data={shareData}
                  variant="compact"
                  label="공유 / 소장"
                  className="bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/35 text-yellow-300 shadow-sm"
                />
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 sm:p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Card Showcase Banner or Empty State */}
          {!card ? (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mx-auto">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">오늘의 타로 카드가 아직 없습니다</h4>
                <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                  오늘 하루의 우주적 기운과 배경 에너지를 담은 데일리 타로 카드를 아직 뽑지 않았습니다.
                </p>
              </div>
              {onGoToTarotWheel && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onGoToTarotWheel();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>오늘의 타로 1장 뽑기 (DRAW 1 CARD)</span>
                </button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-purple-950/20 border border-yellow-500/30 shadow-md"
            >
              <TarotFlippingCard
                card={card as any}
                slotName="COSMIC ANCHOR"
                index={0}
                size="wide"
                onClick={() => setIsCardZoomOpen(true)}
              />

              <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400/80 font-bold">
                    <TTSHighlightText text="COSMIC ANCHOR" />
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30 font-semibold">
                    <TTSHighlightText text={card.reversed ? '역방향 (Reversed)' : '정방향 (Upright)'} />
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    <TTSHighlightText text={card.nameKo} /> <span className="text-xs text-white/50 font-mono font-normal">({card.name})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCardZoomOpen(true)}
                    className="px-2 py-0.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="카드 크게 보기"
                  >
                    <ZoomIn size={11} />
                    <span>카드 크게 보기</span>
                  </button>
                </div>
                {card.keywords?.length > 0 && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap pt-1">
                    {card.keywords.slice(0, 4).map((kw: string) => (
                      <span
                        key={kw}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-yellow-300/90 border border-white/10"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Integrated Narration Controller (상단 오디오 제어 바) */}
          {card && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-purple-950/20 border border-yellow-500/30 shadow-inner space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Master Play Button */}
                  <button
                    type="button"
                    onClick={handlePlayFullNarration}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                      isFullPlaying
                        ? 'bg-amber-400 text-black border border-amber-300 animate-pulse'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black'
                    }`}
                  >
                    {isFullPlaying ? <VolumeX size={15} /> : <Play size={15} className="fill-current" />}
                    <span>{isFullPlaying ? '낭독 중지' : '전체 낭독 듣기'}</span>
                  </button>

                  {/* Replay Button */}
                  <button
                    type="button"
                    onClick={handlePlayFullNarration}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                    title="처음부터 다시 듣기"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {/* Animated Equalizer Wavebars */}
                  {isTTSActive && (
                    <div className="flex items-end gap-1 h-5 px-2">
                      <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                      <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:150ms] h-5" />
                      <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:300ms] h-3" />
                      <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:450ms] h-5" />
                      <span className="w-1 bg-yellow-400 rounded-full animate-bounce [animation-delay:200ms] h-2" />
                    </div>
                  )}
                </div>

                {/* Voice Selector & Copy Button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl text-[11px]">
                    <span className="text-white/40 pl-1.5 font-mono text-[10px]">목소리:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedVoice('Lucy')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedVoice === 'Lucy'
                          ? 'bg-yellow-400/25 text-yellow-300 border border-yellow-400/40'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      루시
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVoice('Kore')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedVoice === 'Kore'
                          ? 'bg-yellow-400/25 text-yellow-300 border border-yellow-400/40'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Kore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🌟 Other Tarot Reading Identical Result Container (Trinity's Insight) */}
          {card && (
            <div className="glass p-5 rounded-2xl border border-yellow-500/30 shadow-2xl flex flex-col relative overflow-hidden text-left space-y-4">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 blur-[60px] pointer-events-none rounded-full" />
              
              {/* Trinity's Insight Header */}
              <div className="flex justify-between items-center mb-1 shrink-0 relative z-10 w-full font-sans border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Sparkles size={16} />
                  <h4 className="text-xs font-bold tracking-widest uppercase">
                    Trinity&apos;s Insight
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayFullNarration}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isFullPlaying
                        ? 'bg-yellow-500/25 text-yellow-300 border border-yellow-400/40 animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/15'
                    }`}
                    title={isFullPlaying ? '낭독 중지하기' : '전체 리딩 음성으로 듣기'}
                  >
                    {isFullPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    <span>{isFullPlaying ? '중지' : '전체 낭독'}</span>
                  </button>
                </div>
              </div>

              {/* 🌟 1. 핵심 3줄 요약 첫 칸 고정 렌더링 (원클릭 요약 TTS 지원) */}
              {narrationData.conciseSummaryBullets.length > 0 && (
                <div className="pt-1 pb-3">
                  <TarotSummaryGraphicCard
                    bullets={narrationData.conciseSummaryBullets}
                    readingText={narrationData.cleanDiagnosis || narrationData.rawDiagnosis}
                    isTTSActive={isSummaryPlaying}
                    onToggleTTS={handlePlaySummary}
                    title="오늘의 데일리 타로 핵심 3줄 요약"
                    subtitle="DAILY TAROT ESSENCE · 핵심 정수"
                  />
                </div>
              )}

              {/* Full Markdown 5-Step Reading Body */}
              <div
                className="text-white/85 text-sm leading-relaxed relative z-10 w-full font-sans"
                style={{ wordBreak: 'keep-all' }}
              >
                <Streamdown immediate enableTTSHighlight={isFullPlaying}>{stripSummaryFromTarotText(narrationData.cleanDiagnosis || narrationData.rawDiagnosis || "")}</Streamdown>
              </div>

              {/* Planetary / Frequency Harmony Section */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-yellow-300/90 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                    <TTSHighlightText text={`주파수: ${narrationData.frequency}`} />
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                    <TTSHighlightText text={`행운수: ${narrationData.luckyNumber}`} />
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                    <TTSHighlightText text={`행운색: ${narrationData.luckyColor}`} />
                  </span>
                </div>
                {narrationData.rawBlessing && (
                  <p className="text-xs text-stone-300 font-sans italic leading-relaxed">
                    &quot;<TTSHighlightText text={narrationData.rawBlessing} />&quot;
                  </p>
                )}
              </div>

              {/* 🌟 그에 맞는 루시의 특별 조언 (TTS 가능) */}
              <LucyTarotAdviceCard
                cards={card ? [card] : null}
                tarotConcern="오늘의 타로"
                readingText={narrationData.cleanDiagnosis || narrationData.rawDiagnosis}
                mode="daily"
                className="mt-3"
                onConsultLucy={handleConsult}
              />

              {/* ⚠️ 타로 성찰 주의사항 (맹목적 믿음 지양 상시 표시) */}
              <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 space-y-1.5 text-xs text-white/85 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <AlertCircle size={14} className="text-amber-400 shrink-0" />
                  <span>타로 성찰 주의사항 (맹목적 믿음 지양)</span>
                </div>
                <p className="leading-relaxed text-white/70 break-keep text-[11px] sm:text-xs">
                  타로는 미래를 결정짓는 절대적 예언이 아니라, 자신의 내면을 성찰하고 더 나은 선택을 돕는 지혜의 나침반입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 의지와 지혜에 있습니다.
                </p>
              </div>

              {/* 🔮 오늘의 데일리 타로 잔여 덱 연속 질문 & 타임라인 영역 */}
              {card && (
                <div className="mt-5 pt-5 border-t border-amber-500/25 space-y-5">
                  <FollowUpTarotTimeline
                    entries={dailyFollowUpEntries}
                    onZoomCard={(data) => setZoomedTimelineCard({ card: data.card, slotName: data.slotName })}
                  />
                  <FollowUpTarotInputBar
                    remainingCount={dailyRemainingDeck.length}
                    totalCount={TAROT_DECK.length}
                    drawnCount={dailyDrawnCardIds.size}
                    initialConcern="오늘의 타로"
                    drawnCards={actualTarotCard ? [actualTarotCard] : []}
                    isGenerating={isFollowUpGenerating}
                    onDirectDraw={handleDirectFollowUpDraw}
                    onAutoDraw={handleAutoFollowUpDraw}
                    title="오늘의 타로 추가 질문 & 연속 리딩"
                    subtitle="오늘의 카드(1장)를 제외한 남은 77장의 잔여 덱에서 카드를 뽑아 추가 조언을 얻으세요."
                    customChips={[
                      '오늘 남은 하루를 가장 빛나게 보낼 행동 지침은?',
                      '오늘 특별히 주의해야 할 인간관계나 돌발 변수는?',
                      '오늘 밤 잠들기 전 확인해야 할 나의 작은 성취는?',
                      '오늘의 행운을 극대화하기 위해 지금 당장 실천할 일은?',
                    ]}
                    placeholder="오늘의 운세에 대해 더 궁금한 점을 질문하세요"
                  />
                </div>
              )}
            </div>
          )}

          {/* 📍 스마트 스크롤 수동 조작 시 낭독 위치 즉시 복귀 플로팅 버튼 (3초 카운트다운) */}
          <SmartScrollResumeButton
            isVisible={isUserOverriding && isTTSActive && hasActiveHighlight}
            onResume={resumeAutoScroll}
            remainingSeconds={remainingSeconds}
            label="낭독 위치로 이동"
          />

          {/* Action Footer Buttons — 새로운 타로 뽑기 방지 및 1일 1회 완료 보호 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
            {/* Left: 1-per-day status or other tarot inquiry */}
            {card ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="px-3.5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300/90 text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="text-yellow-400" />
                  <span>오늘의 타로 1일 1회 완료 (내일 00시 리셋)</span>
                </div>
                {onGoToTarotWheel && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onGoToTarotWheel();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer"
                    title="다른 고민으로 타로 상담실 이동"
                  >
                    <span>다른 고민 질문하기</span>
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}

            {/* Right: Share, Consult Lucy & Close */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              {card && (
                <TodayTarotShareButton data={shareData} variant="secondary" label="결과 공유하기" />
              )}
              {onConsultLucy && (
                <button
                  type="button"
                  disabled={!card}
                  onClick={card ? handleConsult : undefined}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    card
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)] active:scale-95 cursor-pointer"
                      : "bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-50 shadow-none pointer-events-none"
                  }`}
                  title={card ? "루시와 1:1 심층 상담하기" : "오늘의 타로를 먼저 뽑아야 심층 리딩 상담이 가능합니다"}
                >
                  <Sparkles size={13} className={card ? "text-black" : "text-zinc-500"} />
                  <span>{card ? "루시와 심층 상담하기" : "심층 리딩 상담 (카드 뽑기 필요)"}</span>
                  <ChevronRight size={13} className={card ? "opacity-70" : "opacity-30"} />
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>

          {/* Tarot Card Detail Zoom Modal */}
          <TarotCardZoomModal
            isOpen={isCardZoomOpen}
            onClose={() => setIsCardZoomOpen(false)}
            card={card ? { ...card, reversed: Boolean(card.reversed === true || card.reversed === ('true' as any) || (card as any)?.isReversed) } : null}
            slotName="오늘의 데일리 타로 · COSMIC ANCHOR"
          />

          {/* Timeline Card Zoom Modal */}
          {zoomedTimelineCard && (
            <TarotCardZoomModal
              isOpen={Boolean(zoomedTimelineCard)}
              onClose={() => setZoomedTimelineCard(null)}
              card={zoomedTimelineCard.card}
              slotName={zoomedTimelineCard.slotName || '추가 질문 카드'}
            />
          )}

          {/* 🎡 잔여 덱 전용 360도 원형 휠 선택 모달 */}
          {showFollowUpWheelModal && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
              <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl bg-slate-950/95 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col">
                <TarotSpread
                  deckSource={dailyRemainingDeck}
                  maxCards={1}
                  concern={pendingFollowUpQuestion}
                  spreadName={`오늘의 타로 추가 질문 #${dailyFollowUpEntries.length + 1}`}
                  spreadReason={`오늘의 타로를 제외한 ${dailyRemainingDeck.length}장의 잔여 덱에서 1장을 직접 고릅니다.`}
                  onComplete={handleFollowUpWheelComplete}
                  onCancel={() => setShowFollowUpWheelModal(false)}
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TodayTarotNarrationModal;
