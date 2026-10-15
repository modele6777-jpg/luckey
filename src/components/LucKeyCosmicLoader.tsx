import React from 'react';
import { motion } from 'motion/react';
import { LucKeyLogoText } from './LucKeyLogoText';

export interface LucKeyCosmicLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  compact?: boolean;
}

/**
 * 🍀 LucKeyCosmicLoader (Minimalist Edition)
 * 미니멀하고 정제된 LucKey(네잎클로버 ✕ 해답의 열쇠) 메인 로딩 화면
 */
export function LucKeyCosmicLoader({
  message = '행운과 해답의 문을 여는 중...',
  subMessage = 'LUCKEY · SOUL SANCTUARY',
  fullScreen = false,
  compact = false,
}: LucKeyCosmicLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={`flex flex-col items-center justify-center select-none text-white overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#06070a] min-h-[100dvh] w-screen px-4 pt-safe pb-safe'
          : compact
          ? 'relative py-6 px-4 w-full'
          : 'relative min-h-[40vh] py-10 px-4 w-full'
      }`}
    >
      {/* Subtle Ambient Vignette Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-44 h-44 sm:w-72 sm:h-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-amber-500/5 blur-2xl" />
      </div>

      {/* Minimalist Central Emblem: Clover & Key Motif */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-4 sm:mb-6">
          {/* Subtle Outer Breathing Hairline Ring */}
          <motion.div
            animate={{
              scale: [0.96, 1.05, 0.96],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-emerald-400/25"
          />

          {/* Minimalist Rotating Orbit Ring (Desktop only to keep mobile pristine) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 16,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
            className="hidden sm:block absolute w-24 h-24 rounded-full border border-dashed border-amber-400/20"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
          </motion.div>

          {/* Core Minimal Clover-Key Geometry (SVG) */}
          <motion.div
            animate={{
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center shadow-lg shadow-black/40 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 sm:w-8 sm:h-8"
            >
              {/* Four-leaf Clover subtle petals */}
              <g className="text-emerald-400" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                {/* Top Leaf */}
                <path d="M16 16 C16 11, 12 9, 12 12 C12 15, 16 16, 16 16" fill="currentColor" fillOpacity="0.2" />
                {/* Right Leaf */}
                <path d="M16 16 C21 16, 23 12, 20 12 C17 12, 16 16, 16 16" fill="currentColor" fillOpacity="0.2" />
                {/* Bottom Leaf */}
                <path d="M16 16 C16 21, 20 23, 20 20 C20 17, 16 16, 16 16" fill="currentColor" fillOpacity="0.2" />
                {/* Left Leaf */}
                <path d="M16 16 C11 16, 9 20, 12 20 C15 20, 16 16, 16 16" fill="currentColor" fillOpacity="0.2" />
              </g>

              {/* Minimal Golden Celestial Key Accent */}
              <g className="text-amber-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="16" cy="16" r="2.5" fill="#fde047" stroke="none" />
                {/* Slender Key Pin */}
                <path d="M16 18.5 L16 25" />
                <path d="M16 23 L18.5 23" />
                <path d="M16 25 L18 25" />
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Brand Name */}
        <div className="mb-1.5 sm:mb-2">
          <LucKeyLogoText size={compact ? 'sm' : 'md'} />
        </div>

        {/* Clean Message Indicator */}
        <motion.p
          animate={{ opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className="text-xs sm:text-[13px] font-medium tracking-wide text-zinc-300 font-sans text-center px-4 max-w-xs break-keep"
        >
          {message}
        </motion.p>

        {/* Minimal Subtitle */}
        {subMessage && (
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-zinc-500 font-mono mt-1 uppercase text-center">
            {subMessage}
          </p>
        )}

        {/* Minimal Hairline Progress Sheen */}
        <div className="w-24 sm:w-36 h-[1.5px] bg-white/10 rounded-full mt-3 sm:mt-4 overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.8,
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

export default LucKeyCosmicLoader;
