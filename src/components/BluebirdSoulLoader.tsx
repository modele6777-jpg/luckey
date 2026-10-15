import React from 'react';
import { motion } from 'motion/react';

export const BluebirdSoulLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-10 gap-4 sm:gap-5 select-none">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        {/* Subtle Breathing Outer Hairline */}
        <motion.div
          animate={{
            scale: [0.94, 1.06, 0.94],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full border border-sky-400/20"
        />

        {/* Ambient Glow */}
        <div className="w-8 h-8 rounded-full bg-sky-400/10 blur-xl" />

        {/* Minimal Soul Bird Wing Emblem */}
        <motion.div
          animate={{
            scale: [0.97, 1.03, 0.97],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-950/40 border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-950/50 backdrop-blur-sm"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-300">
            <path d="M20.3 5.4a1 1 0 0 0-1.2-1.2c-1.5.4-3.5 1.4-5 2.8C12.6 8.5 12 10.5 12 12c0 1.5.6 3.5 2.1 5 1.5 1.4 3.5 2.4 5 2.8a1 1 0 0 0 1.2-1.2c-.4-1.5-1.4-3.5-2.8-5 1.4-1.5 2.4-3.5 2.8-5z" fill="currentColor" fillOpacity="0.2" />
            <path d="M3.7 5.4a1 1 0 0 1 1.2-1.2c1.5.4 3.5 1.4 5 2.8C11.4 8.5 12 10.5 12 12c0 1.5-.6 3.5-2.1 5-1.5 1.4-3.5 2.4-5 2.8a1 1 0 0 1-1.2-1.2c.4-1.5 1.4-3.5 2.8-5-1.4-1.5-2.4-3.5-2.8-5z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </motion.div>
      </div>

      <div className="flex flex-col items-center text-center px-4">
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[10px] sm:text-[11px] font-bold text-sky-300 tracking-[0.25em] uppercase font-mono"
        >
          Bluebird · Soul Medicine
        </motion.span>
        <p className="text-[11px] text-white/50 mt-1 font-sans">치유의 주파수를 조율하는 중...</p>
      </div>

      {/* Minimal Hairline Progress */}
      <div className="w-20 sm:w-28 h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent"
        />
      </div>
    </div>
  );
};
