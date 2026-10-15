import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Triangle, 
  RotateCcw,
  Calendar,
  Star
} from 'lucide-react';
import { 
  UNIVERSE_INSIGHTS, 
  getDailyInsight,
  type UniverseInsightItem 
} from '@/data/universeInsights';
import { TTSButton } from '@/components/TTSButton';
import { UniverseInsightCodexModal } from '@/components/UniverseInsightCodexModal';
import { useApp } from '@/contexts/AppContext';
import { useUniverseInsightFavorites } from '@/lib/universeInsightFavorites';

interface UniverseInsightCardProps {
  saju?: any;
  customInsight?: {
    summary: string;
    author?: string;
  };
  onInsightChange?: (insight: UniverseInsightItem) => void;
}

export function UniverseInsightCard({
  saju,
  customInsight,
  onInsightChange
}: UniverseInsightCardProps) {
  const { sharedState, updateSharedState } = useApp();

  const handleUpdateCloudFavorites = (ids: string[]) => {
    updateSharedState({
      favoriteInsightIds: ids,
    }, 'HUB_FAVORITES');
  };

  const { isFavorite, toggleFavorite, favoriteCount } = useUniverseInsightFavorites(
    sharedState?.favoriteInsightIds,
    handleUpdateCloudFavorites
  );

  // Always retrieve the fixed daily insight from the full ('all') theme
  const todayFixedInsight = useMemo(() => {
    return getDailyInsight('all');
  }, []);

  const [currentInsight, setCurrentInsight] = useState<UniverseInsightItem>(todayFixedInsight);
  const [isResonanceExpanded, setIsResonanceExpanded] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Check if current insight is today's default fixed insight
  const isViewingTodayInsight = currentInsight.id === todayFixedInsight.id;
  const isCurrentFavorite = isFavorite(currentInsight.id);

  // Formatted Korean date string for today
  const todayFormattedDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  }, []);

  // Copy to clipboard
  const handleCopy = () => {
    const text = `"${currentInsight.quote}"\n— ${currentInsight.author} (${currentInsight.source})\n\n[우주 통찰] ${currentInsight.resonance}\n#UniverseInsight #PRISM`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset to today's fixed daily insight
  const handleResetToDaily = () => {
    setCurrentInsight(todayFixedInsight);
    if (onInsightChange) onInsightChange(todayFixedInsight);
  };

  return (
    <>
      <div className="glass prism-xs-hub-card p-4 sm:p-6 md:p-8 rounded-[28px] sm:rounded-[32px] border border-white/15 shadow-2xl relative overflow-hidden group bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-black/40 backdrop-blur-xl">
        {/* Background Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl border border-white/15 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,200,100,0.2)] group/sun backdrop-blur-md bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-sky-500/20">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} 
                className="absolute inset-0 rounded-2xl border border-dashed border-white/30" 
              />
              <Triangle 
                className="relative z-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-transform group-hover/sun:scale-110 duration-500 animate-pulse -translate-y-[1px]" 
                fill="transparent"
                strokeWidth={2.2} 
                size={18} 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.25em] font-sans flex items-center gap-1.5">
                  <span>Universe Insight</span>
                  <span className="text-white/30">•</span>
                  <span className="text-amber-300/90 font-normal">오늘의 지혜</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold font-sans flex items-center gap-1">
                  <span>{currentInsight.categoryIcon}</span>
                  <span>{currentInsight.categoryName}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-sans mt-0.5">
                <Calendar size={11} className="text-amber-400/70 shrink-0" />
                <span className="shrink-0">{todayFormattedDate}</span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-white/50 hidden sm:inline break-keep">매일 자정 새로운 지혜로 갱신되는 1일 1명언</span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Reset to today's fixed quote if customized */}
            {!isViewingTodayInsight && (
              <button
                onClick={handleResetToDaily}
                title="오늘의 고정 명언으로 돌아가기"
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 transition-all flex items-center gap-1 text-xs font-bold font-sans active:scale-95 animate-pulse"
              >
                <RotateCcw size={12} />
                <span>오늘 명언</span>
              </button>
            )}

            {/* Favorite / Bookmark Toggle */}
            <button
              onClick={() => toggleFavorite(currentInsight.id)}
              title={isCurrentFavorite ? "즐겨찾기에서 제거" : "즐겨찾기에 추가"}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-90 ${
                isCurrentFavorite
                  ? 'bg-amber-500/25 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/60 hover:text-amber-300'
              }`}
            >
              <Star 
                size={14} 
                className={isCurrentFavorite ? "fill-amber-300 text-amber-300 animate-pulse" : ""} 
              />
            </button>

            {/* TTS Audio */}
            <TTSButton 
              text={`"${currentInsight.quote}" — ${currentInsight.author}. ${currentInsight.resonance}`}
              voice="Kore"
              className="scale-90 opacity-80 hover:opacity-100 transition-opacity bg-white/5 border border-white/10 hover:border-amber-400/40 rounded-xl px-2.5 py-1.5"
            />

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="명언 복사하기"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
            >
              {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {/* Codex Library Modal Button */}
            <button
              onClick={() => setIsCodexOpen(true)}
              title="전체 명언 보관소 열기"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-400/30 text-amber-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold font-sans active:scale-95 shadow-sm"
            >
              <BookOpen size={13} />
              <span>지혜 보관소</span>
              {favoriteCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-400/30 border border-amber-300/50 text-amber-200 text-[10px] rounded-full font-bold">
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quote Content Display */}
        <div className="relative z-10 my-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInsight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-[17px] sm:text-lg md:text-xl font-sans font-medium leading-[1.65] text-white tracking-tight break-keep mb-3">
                "{currentInsight.quote}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300/90 text-sm">— {currentInsight.author}</span>
                  <span className="text-white/40 italic text-xs">《{currentInsight.source}》</span>
                </div>
                <div className="flex items-center gap-1">
                  {currentInsight.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Saju Alignment Badge (if provided) */}
          {saju && (
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold font-sans flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                본원: {saju.dayMaster.hanja} {saju.dayMaster.symbolName}
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium font-sans">
                🌿 보약 에너지: {saju.elements.lacking.name} 보충
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-medium font-sans">
                🔥 2026 {saju.annual2026.theme.split('—')[0].trim()}
              </span>
            </div>
          )}

          {/* Expandable Cosmic Resonance & Action Reflection Guide */}
          <div className="mt-3 pt-2">
            <button
              onClick={() => setIsResonanceExpanded(!isResonanceExpanded)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300/80 hover:text-amber-200 transition-colors font-sans py-1 group/btn"
            >
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span>우주 통찰 & 성찰 가이드</span>
              {isResonanceExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <AnimatePresence>
              {isResonanceExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 border border-amber-400/20 text-xs sm:text-[13px] text-amber-100/90 leading-relaxed font-sans break-keep shadow-inner">
                    <p className="font-medium">{currentInsight.resonance}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full Wisdom Codex Modal */}
      <UniverseInsightCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onSelectInsight={(item) => {
          setCurrentInsight(item);
          if (onInsightChange) onInsightChange(item);
        }}
      />
    </>
  );
}
