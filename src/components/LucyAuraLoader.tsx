import React from 'react';
import { motion } from 'motion/react';

interface LucyAuraLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  compact?: boolean;
}

/**
 * 🍀 LucyAuraLoader (Minimalist Edition)
 * 루시 AI 챗 & 교감 진입 전용 미니멀 클로버 로딩 화면
 */
export function LucyAuraLoader({
  message = '루시와 행운의 깊은 교감 조율 중...',
  subMessage = 'FOUR-LEAF CLOVER · FORTUNE & INTUITION',
  fullScreen = false,
  compact = false,
}: LucyAuraLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={`flex flex-col items-center justify-center select-none text-slate-100 overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#050806] min-h-[100dvh] w-screen px-4 pt-safe pb-safe'
          : compact
          ? 'relative py-8 px-4 w-full'
          : 'relative min-h-[42vh] py-12 px-4 w-full'
      }`}
    >
      {/* Soft Ambient Emerald Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Minimal Clover Breath Emblem */}
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
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-emerald-400/20"
          />

          {/* Minimal Clover Geometry Container */}
          <motion.div
            animate={{
              scale: [0.97, 1.03, 0.97],
            }}
            transition={{
              duration: 2.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-950/60 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400"
            >
              {/* Minimal Organic Four Leaf Petals */}
              <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Top Leaf */}
                <path d="M16 16 C16 10, 11 8, 11 12 C11 15.5, 16 16, 16 16" fill="currentColor" fillOpacity="0.25" />
                {/* Right Leaf */}
                <path d="M16 16 C22 16, 24 11, 20 11 C16.5 11, 16 16, 16 16" fill="currentColor" fillOpacity="0.25" />
                {/* Bottom Leaf */}
                <path d="M16 16 C16 22, 21 24, 21 20 C21 16.5, 16 16, 16 16" fill="currentColor" fillOpacity="0.25" />
                {/* Left Leaf */}
                <path d="M16 16 C10 16, 8 21, 12 21 C15.5 21, 16 16, 16 16" fill="currentColor" fillOpacity="0.25" />
              </g>
              {/* Central Golden Core Dewdrop */}
              <circle cx="16" cy="16" r="1.8" fill="#fde047" />
            </svg>
          </motion.div>
        </div>

        {/* Minimal Lucy Wordmark */}
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-emerald-300 font-sans">
            Lucy
          </span>
          <span className="w-1 h-1 rounded-full bg-emerald-400/50" />
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-400/60 font-mono">
            Bestie
          </span>
        </div>

        {/* Message Indicator */}
        <motion.p
          animate={{ opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className="text-xs sm:text-[13px] font-medium tracking-wide text-emerald-100/90 font-sans max-w-xs break-keep px-4"
        >
          {message}
        </motion.p>

        {/* Minimal Submessage */}
        {subMessage && (
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-emerald-500/50 font-mono mt-1 uppercase">
            {subMessage}
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
            className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default LucyAuraLoader;
