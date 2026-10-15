import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Clock,
  Eye,
  RotateCcw,
  Compass,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { TarotCard, getTarotCardImageUrl } from '@/data/tarotData';
import { Streamdown } from '@/components/Streamdown';
import { playTTSInChunks, stopTTS, useTTSState } from '@/utils/tts';
import { playSuccessHaptic } from '@/lib/audioHaptics';

export interface FollowUpTarotEntry {
  id: string;
  question: string;
  card: TarotCard;
  reversed: boolean;
  reading: string;
  isGenerating?: boolean;
  createdAt: number;
}

export interface FollowUpTarotTimelineProps {
  entries: FollowUpTarotEntry[];
  onZoomCard: (data: { card: TarotCard; slotName?: string }) => void;
  className?: string;
}

export const FollowUpTarotTimeline: React.FC<FollowUpTarotTimelineProps> = ({
  entries,
  onZoomCard,
  className = '',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isSpeaking, activeText, activeFullText } = useTTSState();

  if (!entries || entries.length === 0) {
    return null;
  }

  const handleCopy = async (entry: FollowUpTarotEntry) => {
    try {
      const cardName = entry.card?.nameKo || entry.card?.name || '타로 카드';
      const textToCopy = `【추가 질문: ${entry.question || ''}】\n뽑힌 카드: ${cardName} (${entry.reversed ? '역방향' : '정방향'})\n\n[트리니티 마스터 심층 해설]\n${entry.reading || ''}`;
      await navigator.clipboard.writeText(textToCopy);
      playSuccessHaptic();
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (_) {}
  };

  return (
    <div className={`space-y-6 w-full ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Compass size={14} className="animate-spin-slow" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>심층 추가 리딩 타임라인</span>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
              {entries.length}개의 질의응답
            </span>
          </h3>
        </div>
        <span className="text-[11px] text-white/50 font-sans hidden sm:inline">
          기존 카드를 제외한 잔여 덱 연속 탐색
        </span>
      </div>

      <div className="relative pl-4 sm:pl-6 border-l-2 border-amber-500/30 space-y-8">
        <AnimatePresence initial={false}>
          {entries.map((entry, index) => {
            const isEntryTTSActive =
              isSpeaking &&
              (activeFullText === entry.reading || activeText === entry.reading || (activeFullText && entry.reading.includes(activeFullText.slice(0, 30))));

            const formattedTime = new Date(entry.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>

                {/* Card Container */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-black/90 border border-amber-500/25 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4 hover:border-amber-500/40 transition-colors">
                  {/* Top Bar: Question Badge, Time & Controls */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1 flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          추가 질문 #{index + 1}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-white/40 font-mono">
                          <Clock size={11} />
                          <span>{formattedTime}</span>
                        </div>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white/95 leading-snug break-keep flex items-start gap-1.5 pt-0.5">
                        <HelpCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{entry.question}</span>
                      </h4>
                    </div>

                    {/* Action buttons (TTS & Copy) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={async () => {
                          if (isEntryTTSActive) {
                            stopTTS();
                          } else if (entry.reading) {
                            await playTTSInChunks(entry.reading, 'Kore', 110);
                          }
                        }}
                        disabled={entry.isGenerating || !entry.reading}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isEntryTTSActive
                            ? 'bg-amber-400/25 text-amber-300 border border-amber-400/50 animate-pulse'
                            : 'bg-white/5 hover:bg-white/15 text-white/80 border border-white/10'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                        title={isEntryTTSActive ? '낭독 중지' : '추가 리딩 음성으로 듣기'}
                      >
                        {isEntryTTSActive ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        <span className="text-[11px]">{isEntryTTSActive ? '중지' : '낭독'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(entry)}
                        disabled={entry.isGenerating || !entry.reading}
                        className={`p-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
                          copiedId === entry.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/5 hover:bg-white/15 text-white/70 border-white/10'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                        title="해설 내용 복사"
                      >
                        {copiedId === entry.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Drawn Card Spotlight */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3.5 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => entry.card && onZoomCard({ card: entry.card, slotName: `추가 질문 #${index + 1}` })}
                      className="relative shrink-0 w-16 h-24 sm:w-20 sm:h-30 rounded-lg overflow-hidden border border-amber-400/40 group/card shadow-md cursor-zoom-in hover:scale-105 active:scale-95 transition-transform"
                      title="카드 크게 보기"
                    >
                      <img
                        src={entry.card ? getTarotCardImageUrl(entry.card) : '/placeholder-card.png'}
                        alt={entry.card?.nameKo || '타로 카드'}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          entry.reversed ? 'rotate-180' : ''
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/30 flex items-center justify-center transition-colors">
                        <Eye size={16} className="text-white opacity-0 group-hover/card:opacity-100 transition-opacity drop-shadow" />
                      </div>
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-amber-300">
                          {entry.card?.nameKo || entry.card?.name || '타로 카드'}
                        </span>
                        {entry.card?.name && (
                          <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
                            {entry.card.name}
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            entry.reversed
                              ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          }`}
                        >
                          {entry.reversed ? '🔄 역방향 (Reversed)' : '✨ 정방향 (Upright)'}
                        </span>
                      </div>

                      <p className="text-[11px] sm:text-xs text-white/70 line-clamp-2 break-keep font-sans">
                        {Array.isArray(entry.card?.keywords) ? entry.card.keywords.join(' · ') : ''}
                      </p>

                      <div className="text-[10px] text-amber-400/80 font-sans pt-1 flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>잔여 덱에서 추출된 실시간 상징</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Interpretation Section */}
                  <div className="text-sm leading-relaxed text-white/90 pt-1">
                    {entry.isGenerating && !entry.reading ? (
                      <div className="flex items-center gap-2 py-4 text-amber-400/70 text-xs">
                        <RefreshCw size={14} className="animate-spin text-amber-400" />
                        <span className="animate-pulse">트리니티 마스터가 잔여 카드의 파동을 해석하고 있습니다...</span>
                      </div>
                    ) : (
                      <div>
                        <Streamdown immediate={!entry.isGenerating}>
                          {entry.reading}
                        </Streamdown>
                        {entry.isGenerating && (
                          <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-1 align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
