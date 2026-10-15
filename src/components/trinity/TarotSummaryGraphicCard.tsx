import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Compass,
  Activity,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { playSuccessHaptic } from '@/lib/audioHaptics';
import { TTSHighlightedText } from '@/components/common/TTSHighlightedText';

export interface TarotSummaryGraphicCardProps {
  bullets: string[];
  readingText?: string;
  isTTSActive?: boolean;
  onToggleTTS?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

interface ParsedSummaryRow {
  step: string;
  label: string;
  tag: string;
  content: string;
  highlightBadge?: { text: string; color: string } | null;
  theme: {
    accentText: string;
    badgeBg: string;
    badgeBorder: string;
    cardBg: string;
    cardBorder: string;
    iconColor: string;
    dotColor: string;
  };
}

export function TarotSummaryGraphicCard({
  bullets,
  readingText,
  isTTSActive = false,
  onToggleTTS,
  className = '',
  title = '타로 리딩 핵심 3줄 요약',
  subtitle = 'CARD SYMBOLISM ✕ SAJU ESSENCE · 고밀도 3대 차원 심층 요약',
}: TarotSummaryGraphicCardProps) {
  const [copied, setCopied] = useState(false);

  if (!bullets || bullets.length === 0) return null;

  // 3개 불릿 정밀 파싱 (현재 에너지, 방향과 결단, 실천 처방)
  const rows: ParsedSummaryRow[] = bullets.slice(0, 3).map((bullet, idx) => {
    const match = bullet.match(/^\[([^\]]+)\]\s*(.*)$/);
    const rawTag = match ? match[1].trim() : (idx === 0 ? '현재 에너지' : idx === 1 ? '방향과 결단' : '실천 처방');
    const rawContent = match ? match[2].trim() : bullet.trim();

    // YES / NO 감지
    let highlightBadge: { text: string; color: string } | null = null;
    if (/\[YES\]|최종\s*판정[:\s]*YES/i.test(rawContent)) {
      highlightBadge = { text: '✨ YES', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
    } else if (/\[NO\]|최종\s*판정[:\s]*NO/i.test(rawContent)) {
      highlightBadge = { text: '🛑 NO', color: 'bg-rose-500/20 text-rose-300 border-rose-400/40' };
    } else if (/조건부\s*YES/i.test(rawContent)) {
      highlightBadge = { text: '⚡ 조건부 YES', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
    }

    if (idx === 0 || /현재|에너지|상황|진단/i.test(rawTag)) {
      return {
        step: '01',
        label: '카드 도상 상징 & 사주 본원 진단',
        tag: rawTag || '현재 에너지',
        content: rawContent,
        highlightBadge,
        theme: {
          accentText: 'text-sky-300',
          badgeBg: 'bg-sky-500/15',
          badgeBorder: 'border-sky-400/30',
          cardBg: 'from-sky-950/30 via-slate-900/40 to-black/60',
          cardBorder: 'border-sky-500/25 hover:border-sky-400/50',
          iconColor: 'text-sky-400',
          dotColor: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]',
        },
      };
    } else if (idx === 1 || /방향|결단|선택|판정|전환점/i.test(rawTag)) {
      return {
        step: '02',
        label: '심층 통찰 & 운의 전환점 나침반',
        tag: rawTag || '방향과 결단',
        content: rawContent,
        highlightBadge,
        theme: {
          accentText: 'text-amber-300',
          badgeBg: 'bg-amber-500/15',
          badgeBorder: 'border-amber-400/30',
          cardBg: 'from-amber-950/30 via-slate-900/40 to-black/60',
          cardBorder: 'border-amber-500/25 hover:border-amber-400/50',
          iconColor: 'text-amber-400',
          dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        },
      };
    } else {
      return {
        step: '03',
        label: '오늘 즉시 실천 행동 처방',
        tag: rawTag || '실천 처방',
        content: rawContent,
        highlightBadge,
        theme: {
          accentText: 'text-purple-300',
          badgeBg: 'bg-purple-500/15',
          badgeBorder: 'border-purple-400/30',
          cardBg: 'from-purple-950/30 via-slate-900/40 to-black/60',
          cardBorder: 'border-purple-500/25 hover:border-purple-400/50',
          iconColor: 'text-purple-400',
          dotColor: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]',
        },
      };
    }
  });

  const handleCopy = async () => {
    try {
      const summaryText = `【${title}】\n` + bullets.join('\n');
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summaryText);
        setCopied(true);
        playSuccessHaptic();
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy summary failed:', e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-[26px] p-5 sm:p-6 bg-gradient-to-br from-[#16122c]/95 via-[#0d0a1b]/98 to-[#1e1335]/95 border border-amber-500/30 shadow-[0_12px_45px_-8px_rgba(234,179,8,0.18)] backdrop-blur-2xl text-left space-y-4 ${className}`}
    >
      {/* Ambient background decorative glow */}
      <div className="absolute -top-24 -right-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/25 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Sparkles size={18} className="text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300/80 font-sans">
                <TTSHighlightedText text={subtitle} enabled={isTTSActive} />
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
              <span><TTSHighlightedText text={title} enabled={isTTSActive} /></span>
            </h4>
          </div>
        </div>

        {/* Action Controls: TTS + Copy */}
        <div className="flex items-center gap-2">
          {onToggleTTS && (
            <button
              type="button"
              onClick={onToggleTTS}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isTTSActive
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/15'
              }`}
              title="핵심 3줄 요약 음성 낭독"
            >
              {isTTSActive ? <VolumeX size={13} className="text-amber-300" /> : <Volume2 size={13} />}
              <span>{isTTSActive ? '낭독 정지' : '요약 낭독'}</span>
              {isTTSActive && (
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-1 h-2.5 bg-amber-400 animate-pulse rounded-full" />
                  <span className="w-1 h-3.5 bg-amber-300 animate-pulse delay-75 rounded-full" />
                  <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 hover:bg-white/15 text-white/80 border-white/10'
            }`}
            title="요약 텍스트 클립보드 복사"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="text-[11px]">{copied ? '복사됨' : '복사'}</span>
          </button>
        </div>
      </div>

      {/* 3 Graphic Dimension Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-2.5">
        {rows.map((row, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.08 }}
            className={`group relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r ${row.theme.cardBg} border ${row.theme.cardBorder} transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              {/* Step & Icon indicator */}
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <div className="w-7 h-7 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  {idx === 0 ? (
                    <Activity size={14} className={row.theme.iconColor} />
                  ) : idx === 1 ? (
                    <Compass size={14} className={row.theme.iconColor} />
                  ) : (
                    <CheckCircle2 size={14} className={row.theme.iconColor} />
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold text-white/40 mt-1">{row.step}</span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${row.theme.badgeBg} ${row.theme.badgeBorder} ${row.theme.accentText}`}
                  >
                    <TTSHighlightedText text={row.tag} enabled={isTTSActive} />
                  </span>
                  <span className="text-[11px] font-semibold text-white/50 font-sans hidden sm:inline">
                    <TTSHighlightedText text={row.label} enabled={isTTSActive} />
                  </span>
                  {row.highlightBadge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border tracking-wide ${row.highlightBadge.color}`}
                    >
                      {row.highlightBadge.text}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans font-medium break-keep">
                  <TTSHighlightedText text={row.content} enabled={isTTSActive} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subtle bottom insight footnote */}
      <div className="relative z-10 pt-1 flex items-center justify-between text-[11px] text-white/45 font-sans border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-amber-400/80" />
          <span>뽑힌 카드의 도상 상징과 사주 본원 기운을 융합한 즉시 실천 행동 처방입니다.</span>
        </span>
        <span className="text-[10px] text-white/30 hidden sm:inline">Trinitas Wisdom Essence</span>
      </div>
    </motion.div>
  );
}
