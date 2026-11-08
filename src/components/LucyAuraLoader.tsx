import React from 'react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { motion } from 'motion/react';

export type LucyLoaderTier = 'ai' | 'plus' | 'pro';

interface LucyAuraLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  compact?: boolean;
  isPro?: boolean;
  tier?: LucyLoaderTier;
  isUnfolded?: boolean;
}

/**
 * 🍀 LucyAuraLoader (4-Tier Typography Edition)
 * 루시 4대 모드(Lucy · Lucy + · Lucy Pro · Lucy+ Pro) 전환 및 진입 전용 숨쉬는 로딩 애니메이션
 * (모드별로 Lucy / + / Pro / + Pro 문양이 옅은 상태에서 진하게 맥동)
 */
export function LucyAuraLoader({
  message,
  subMessage,
  fullScreen = false,
  compact = false,
  isPro = false,
  tier,
  isUnfolded = false,
}: LucyAuraLoaderProps) {
  const activeTier: LucyLoaderTier = tier ?? (isPro ? 'pro' : 'ai');
  const isPlusPro = activeTier === 'pro' && Boolean(isUnfolded);
  const proText = isPlusPro ? '+ Pro' : 'Pro';

  const defaultMessage =
    activeTier === 'pro'
      ? `${isPlusPro ? 'Lucy+ Pro' : 'Lucy Pro'} 252대 결정론 엔진 조율 중...`
      : activeTier === 'plus'
      ? 'Lucy + 코스믹 룸 & 일상 교감 조율 중...'
      : 'Lucy와 행운의 깊은 교감 조율 중...';

  const defaultSubMessage =
    activeTier === 'pro'
      ? '252 DETERMINISTIC ENGINES · ALL-IN-ONE MASTER'
      : activeTier === 'plus'
      ? 'COSMIC AMBIENT ROOM · INTUITIVE AI'
      : 'FOUR-LEAF CLOVER · FORTUNE & INTUITION';

  const finalMessage = message ?? defaultMessage;
  const finalSubMessage = subMessage ?? defaultSubMessage;

  const content = (
    <div
      data-fullscreen-loader={fullScreen || undefined}
      role="status"
      aria-label={finalMessage}
      className={`flex flex-col items-center justify-center select-none text-slate-100 overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#050806] h-[100dvh] w-full px-4'
          : compact
          ? 'relative py-8 px-4 w-full'
          : 'relative min-h-[42vh] py-12 px-4 w-full'
      }`}
      style={fullScreen ? { boxSizing: 'border-box', minHeight: 0, margin: 0, paddingTop: 'max(env(safe-area-inset-top, 0px), env(safe-area-inset-bottom, 0px))', paddingBottom: 'max(env(safe-area-inset-top, 0px), env(safe-area-inset-bottom, 0px))' } : undefined}
    >
      {/* Soft Ambient Glow (Pro: Amber / Plus: Teal / AI: Emerald) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl ${
          activeTier === 'pro'
            ? 'bg-amber-500/12'
            : activeTier === 'plus'
            ? 'bg-teal-500/14'
            : 'bg-emerald-500/10'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Emblem Container */}
        <div className="relative flex items-center justify-center mb-4 sm:mb-6">
          {/* Subtle Outer Hairline Pulse Ring */}
          <motion.div
            animate={{
              scale: [0.94, 1.08, 0.94],
              opacity: [0.25, 0.6, 0.25],
            }}
            transition={{
              duration: 3.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border ${
              activeTier === 'pro'
                ? 'border-amber-400/30'
                : activeTier === 'plus'
                ? 'border-teal-400/30'
                : 'border-emerald-400/25'
            }`}
          />

          {/* Minimal Geometry Container with Respective Breathing Text */}
          {activeTier === 'pro' ? (
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="min-w-[3.75rem] h-14 sm:min-w-[4.5rem] sm:h-16 px-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-950/60 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="lucy-pro-loading-pulse-ring absolute inset-1 rounded-xl pointer-events-none" />
              {isPlusPro ? (
                <div className="flex items-center gap-1.5 z-10 whitespace-nowrap select-none">
                  <span className="text-base sm:text-lg font-black text-amber-300/85 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    +
                  </span>
                  <span className="lucy-pro-loading-text text-base sm:text-lg font-black tracking-wider text-amber-300">
                    Pro
                  </span>
                </div>
              ) : (
                <span className="lucy-pro-loading-text text-base sm:text-lg font-black tracking-wider text-amber-300 z-10 whitespace-nowrap">
                  Pro
                </span>
              )}
            </motion.div>
          ) : activeTier === 'plus' ? (
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-950/60 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="lucy-plus-loading-pulse-ring absolute inset-1 rounded-xl pointer-events-none" />
              <span className="lucy-plus-loading-text text-2xl sm:text-3xl font-black text-teal-300 z-10 leading-none">
                +
              </span>
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-950/60 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="lucy-ai-loading-pulse-ring absolute inset-1 rounded-xl pointer-events-none" />
              <span className="lucy-ai-loading-text text-sm sm:text-base font-black tracking-widest text-emerald-300 z-10">
                Lucy
              </span>
            </motion.div>
          )}
        </div>

        {/* Minimal Lucy Wordmark */}
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className={`text-[11px] sm:text-xs font-black tracking-[0.3em] uppercase font-sans ${
            activeTier === 'pro'
              ? 'text-amber-300'
              : activeTier === 'plus'
              ? 'text-teal-300'
              : 'text-emerald-300'
          }`}>
            Lucy
          </span>
          <span className={`w-1 h-1 rounded-full ${
            activeTier === 'pro'
              ? 'bg-amber-400/50'
              : activeTier === 'plus'
              ? 'bg-teal-400/50'
              : 'bg-emerald-400/50'
          }`} />
          <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono font-bold ${
            activeTier === 'pro'
              ? 'text-amber-400/80'
              : activeTier === 'plus'
              ? 'text-teal-400/80'
              : 'text-emerald-400/70'
          }`}>
            {activeTier === 'pro' ? 'Pro Master' : activeTier === 'plus' ? 'Plus Ambient' : 'Intuitive AI'}
          </span>
        </div>

        {/* Message Indicator */}
        <motion.p
          animate={{ opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className={`text-xs sm:text-[13px] font-medium tracking-wide font-sans max-w-xs break-keep px-4 ${
            activeTier === 'pro'
              ? 'text-amber-100/90'
              : activeTier === 'plus'
              ? 'text-teal-100/90'
              : 'text-emerald-100/90'
          }`}
        >
          {finalMessage}
        </motion.p>

        {/* Minimal Submessage */}
        {finalSubMessage && (
          <p className={`text-[9px] sm:text-[10px] tracking-[0.2em] font-mono mt-1 uppercase ${
            activeTier === 'pro'
              ? 'text-amber-500/60'
              : activeTier === 'plus'
              ? 'text-teal-500/60'
              : 'text-emerald-500/50'
          }`}>
            {finalSubMessage}
          </p>
        )}

        {/* Minimal Hairline Progress Indicator */}
        <div className="w-24 sm:w-32 h-[1.5px] bg-white/10 rounded-full mt-3 sm:mt-4 overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={`w-full h-full rounded-full bg-gradient-to-r from-transparent ${
              activeTier === 'pro'
                ? 'via-amber-400'
                : activeTier === 'plus'
                ? 'via-teal-400'
                : 'via-emerald-400'
            } to-transparent`}
          />
        </div>
      </div>
    </div>
  );
  return fullScreen && typeof document !== 'undefined' ? <ScreenPortal>{content}</ScreenPortal> : content;
}

export default LucyAuraLoader;
