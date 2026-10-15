import React from 'react';
import { motion } from 'motion/react';

interface KeyCosmicLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

/**
 * 🔑 KeyCosmicLoader (Minimalist Edition)
 * Key (마음약방 & Calm) 전용 미니멀 키 실루엣 로딩 화면
 */
export function KeyCosmicLoader({
  message = 'Key 마음약방 처방 조율 중...',
  subMessage = '40 CALM PRACTICES & CLINICAL SOMATIC RAG',
  fullScreen = true,
}: KeyCosmicLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={`flex flex-col items-center justify-center select-none z-50 text-slate-100 overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 w-screen h-screen bg-[#04060c] min-h-[100dvh] px-4 pt-safe pb-safe'
          : 'w-full py-10 px-4'
      }`}
    >
      {/* Soft Ambient Cyan/Indigo Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-indigo-500/8 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Minimal Key Emblem */}
        <div className="relative flex items-center justify-center mb-4 sm:mb-6">
          {/* Subtle Outer Hairline Pulse Ring */}
          <motion.div
            animate={{
              scale: [0.94, 1.08, 0.94],
              opacity: [0.25, 0.6, 0.25],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-cyan-400/20"
          />

          {/* Minimal Orbit Star (Desktop only to keep mobile pristine) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 14,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
            className="hidden sm:block absolute w-24 h-24 rounded-full border border-dashed border-cyan-400/15"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />
          </motion.div>

          {/* Minimal Key Geometry Container */}
          <motion.div
            animate={{
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-black/50 backdrop-blur-sm"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300"
            >
              {/* Minimalist Key Head Ring */}
              <circle
                cx="16"
                cy="11"
                r="5"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <circle cx="16" cy="11" r="2" fill="#ffffff" />
              {/* Slender Key Shaft */}
              <path
                d="M16 16 L16 26"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Key Teeth */}
              <path
                d="M16 22 L19.5 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M16 25 L19 25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* Minimal Key Wordmark */}
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-cyan-300 font-sans">
            Key
          </span>
          <span className="w-1 h-1 rounded-full bg-cyan-400/50" />
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-cyan-400/60 font-mono">
            Calm
          </span>
        </div>

        {/* Message Indicator */}
        <motion.p
          animate={{ opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className="text-xs sm:text-[13px] font-medium tracking-wide text-cyan-100/90 font-sans max-w-xs break-keep px-4"
        >
          {message}
        </motion.p>

        {/* Minimal Submessage */}
        {subMessage && (
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-cyan-500/50 font-mono mt-1 uppercase">
            {subMessage}
          </p>
        )}

        {/* Minimal Hairline Progress Sheen */}
        <div className="w-28 sm:w-32 h-[1.5px] bg-white/10 rounded-full mt-4 overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default KeyCosmicLoader;
