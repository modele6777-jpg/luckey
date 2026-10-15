import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  KeyRound,
  RefreshCw,
  Star,
  Check,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
import {
  getTodaySecretContext,
  generateDeterministicSecretWellRecommendations,
  fetchAiSecretWellRecommendations,
  SecretWellRecommendation,
  TodaySecretContext,
} from '@/lib/secretWishingWellSynergy';
import { WishCategoryId } from '@/lib/wishingWell';

export interface WishingWellSecretRecommendationsProps {
  onApplyWish: (wishText: string, category: WishCategoryId) => void;
  onCastDirectly: (wishText: string, category: WishCategoryId) => void;
  onNavigateToSecret?: () => void;
  isCasting?: boolean;
}

export function WishingWellSecretRecommendations({
  onApplyWish,
  onCastDirectly,
  onNavigateToSecret,
  isCasting = false,
}: WishingWellSecretRecommendationsProps) {
  const [context, setContext] = useState<TodaySecretContext>(() => getTodaySecretContext());
  const [recommendations, setRecommendations] = useState<SecretWellRecommendation[]>(() =>
    generateDeterministicSecretWellRecommendations(context, 0)
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [redrawCount, setRedrawCount] = useState(0);

  // Synchronize context whenever this component mounts or gains focus
  const syncContext = useCallback(() => {
    const ctx = getTodaySecretContext();
    setContext(ctx);
    return ctx;
  }, []);

  useEffect(() => {
    const ctx = syncContext();
    setRecommendations(generateDeterministicSecretWellRecommendations(ctx, redrawCount));
  }, [syncContext, redrawCount]);

  // Handle AI re-tune / refresh
  const handleRegenerate = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    const nextSeed = redrawCount + 1;
    setRedrawCount(nextSeed);

    try {
      const freshCtx = syncContext();
      const enhanced = await fetchAiSecretWellRecommendations(freshCtx, nextSeed);
      setRecommendations(enhanced);
    } catch (e) {
      console.warn('[WishingWellSecretRecommendations] Refresh error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApply = (rec: SecretWellRecommendation) => {
    onApplyWish(rec.wishText, rec.category);
    setAppliedId(rec.id);
    setTimeout(() => {
      setAppliedId(null);
    }, 2200);
  };

  const handleDirectCast = (rec: SecretWellRecommendation) => {
    if (isCasting) return;
    onCastDirectly(rec.wishText, rec.category);
  };

  return (
    <div
      id="wishing-well-secret-ai-recommendations"
      className="relative w-full rounded-[28px] bg-gradient-to-br from-amber-500/[0.14] via-orange-500/[0.08] to-slate-950/70 border border-amber-400/40 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(245,158,11,0.18),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden space-y-5 group"
    >
      {/* Specular ambient corner flare */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-bl from-amber-400/25 via-orange-500/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-white/[0.1] pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/30 to-orange-500/30 border border-amber-300/50 flex items-center justify-center text-amber-200 shadow-[0_4px_16px_rgba(245,158,11,0.3)] shrink-0">
            <Sparkles size={18} className="animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                오늘의 시크릿 x 별빛 AI 추천
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/25 to-orange-400/25 text-amber-300 border border-amber-300/40 font-mono tracking-wider">
                AI SYNERGY
              </span>
            </div>
            <p className="text-[11px] text-white/60 font-sans mt-0.5 break-keep">
              시크릿의 확언을 밤하늘 별에 띄워 무의식의 저항을 녹이고 현실화를 가속합니다
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {!context.isReceived && onNavigateToSecret && (
            <button
              type="button"
              onClick={onNavigateToSecret}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-[11px] text-orange-200 hover:text-white transition-all cursor-pointer font-medium active:scale-95 shadow-sm"
              title="오늘의 시크릿 탭으로 이동"
            >
              <KeyRound size={12} className="text-amber-300" />
              <span>시크릿 열기</span>
              <ArrowRight size={11} />
            </button>
          )}

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-[11px] text-white/80 hover:text-white transition-all cursor-pointer font-medium active:scale-95 disabled:opacity-50"
            title="새로운 공명 소망으로 AI 재추천"
          >
            <RefreshCw size={12} className={isAiLoading ? 'animate-spin text-amber-300' : 'text-amber-300/80'} />
            <span>{isAiLoading ? 'AI 조율 중...' : 'AI 재생성'}</span>
          </button>
        </div>
      </div>

      {/* Secret Frequency Capsule */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
            <KeyRound size={13} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 border border-amber-300/30">
                {context.themeKo}
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                {context.isReceived ? '오늘의 수신된 시크릿' : '오늘의 카탈로그 시크릿'}
              </span>
            </div>
            <p className="text-xs text-white/90 font-serif italic break-keep break-words mt-0.5 max-w-xl">
              &ldquo;{context.effectiveWish}&rdquo;
            </p>
          </div>
        </div>

        {!context.isReceived && (
          <span className="text-[10px] text-amber-300/80 font-sans shrink-0 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
            💡 오늘의 시크릿을 받으면 1:1 맞춤 소망이 연결됩니다
          </span>
        )}
      </div>

      {/* 1순위 AI 추천 단일 최적 카드 */}
      <div className="relative z-10 w-full">
        {recommendations.slice(0, 1).map((rec) => {
          const isApplied = appliedId === rec.id;

          return (
            <motion.div
              key={rec.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 sm:p-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border ${rec.borderClass} transition-all flex flex-col justify-between space-y-4 backdrop-blur-xl relative overflow-hidden group/card shadow-[0_10px_30px_rgba(0,0,0,0.3)]`}
            >
              <div className="space-y-3.5">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/25 to-yellow-400/25 text-amber-200 border border-amber-300/40 font-mono tracking-wider flex items-center gap-1 shadow-sm">
                      <Sparkles size={11} className="text-amber-300" />
                      <span>1순위 AI 최우선 추천</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${rec.badgeClass} flex items-center gap-1 font-mono`}>
                      <span>{rec.categoryEmoji}</span>
                      <span>{rec.categoryLabel}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-white/50 tracking-wider">
                    {rec.dimensionLabel}
                  </span>
                </div>

                {/* Wish Content */}
                <p className="text-sm sm:text-base text-white/95 font-sans leading-relaxed font-semibold break-keep">
                  {rec.wishText}
                </p>

                {/* Synergy Explanation Box */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs text-white/70">
                  <div className="flex items-center gap-1 text-amber-300/90 font-bold">
                    <Zap size={11} />
                    <span>시너지 원리</span>
                  </div>
                  <p className="leading-relaxed text-white/75 break-keep">
                    {rec.synergyReason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleApply(rec)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    isApplied
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-white/85 hover:text-white'
                  }`}
                  title="이 문구를 소원 입력창에 복사합니다"
                >
                  {isApplied ? (
                    <>
                      <Check size={14} className="text-emerald-300" />
                      <span>입력창 적용됨!</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} className="text-white/60" />
                      <span>소원 적용</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isCasting}
                  onClick={() => handleDirectCast(rec)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400/90 via-amber-300/90 to-yellow-300/90 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-[0_4px_16px_rgba(245,158,11,0.35)] disabled:opacity-40"
                  title="이 소원을 즉시 밤하늘 별에게 띄웁니다 (슈웅~)"
                >
                  <Star size={14} className="text-slate-950 fill-slate-950" />
                  <span>별에게 바로 띄우기</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
