import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LucyCosmicBackgroundProps {
  isPlusMode: boolean;
}

interface CloverParticle {
  id: number;
  type: 'four' | 'three';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // px (18 - 36)
  rotation: number; // deg
  duration: number; // sec (10 - 22)
  delay: number; // sec
  color: 'emerald' | 'gold' | 'mint';
}

export function LucyCosmicBackground({ isPlusMode }: LucyCosmicBackgroundProps) {
  // Deterministic set of floating clovers across the viewport
  const clovers: CloverParticle[] = useMemo(() => {
    const list: CloverParticle[] = [
      { id: 1, type: 'four', x: 8, y: 12, size: 28, rotation: 14, duration: 16, delay: 0, color: 'gold' },
      { id: 2, type: 'three', x: 22, y: 28, size: 22, rotation: -20, duration: 18, delay: 1.5, color: 'emerald' },
      { id: 3, type: 'four', x: 38, y: 15, size: 32, rotation: 45, duration: 20, delay: 0.8, color: 'emerald' },
      { id: 4, type: 'three', x: 55, y: 24, size: 20, rotation: -12, duration: 15, delay: 2.2, color: 'mint' },
      { id: 5, type: 'four', x: 74, y: 18, size: 30, rotation: 30, duration: 19, delay: 1.1, color: 'gold' },
      { id: 6, type: 'three', x: 88, y: 32, size: 24, rotation: -35, duration: 17, delay: 3.0, color: 'emerald' },
      { id: 7, type: 'four', x: 12, y: 52, size: 26, rotation: 60, duration: 21, delay: 2.5, color: 'emerald' },
      { id: 8, type: 'three', x: 28, y: 68, size: 21, rotation: -15, duration: 14, delay: 0.5, color: 'mint' },
      { id: 9, type: 'four', x: 48, y: 58, size: 34, rotation: 25, duration: 22, delay: 1.8, color: 'gold' },
      { id: 10, type: 'three', x: 68, y: 72, size: 23, rotation: -40, duration: 16, delay: 2.9, color: 'emerald' },
      { id: 11, type: 'four', x: 84, y: 62, size: 29, rotation: 18, duration: 18, delay: 0.3, color: 'gold' },
      { id: 12, type: 'three', x: 92, y: 82, size: 19, rotation: -25, duration: 15, delay: 3.4, color: 'mint' },
      { id: 13, type: 'four', x: 18, y: 88, size: 27, rotation: 50, duration: 20, delay: 1.2, color: 'gold' },
      { id: 14, type: 'three', x: 42, y: 86, size: 22, rotation: -10, duration: 17, delay: 2.1, color: 'emerald' },
      { id: 15, type: 'four', x: 62, y: 90, size: 31, rotation: 35, duration: 19, delay: 0.9, color: 'emerald' },
      { id: 16, type: 'three', x: 80, y: 92, size: 20, rotation: -30, duration: 16, delay: 2.7, color: 'mint' },
    ];
    return list;
  }, []);

  return (
    <div
      className="lucy-cosmic-bg-container pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 🌌 Base Cosmic Deep Night Sky Background */}
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out"
        style={{
          background: isPlusMode
            ? 'radial-gradient(ellipse at 18% 20%, rgba(16, 185, 129, 0.16), transparent 50%), radial-gradient(ellipse at 82% 75%, rgba(245, 158, 11, 0.18), transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(5, 150, 105, 0.14), transparent 55%), linear-gradient(165deg, #050d1a 0%, #081a24 45%, #07151f 100%)'
            : 'radial-gradient(ellipse at 15% 15%, rgba(73, 72, 159, 0.32), transparent 48%), radial-gradient(ellipse at 88% 68%, rgba(112, 60, 165, 0.26), transparent 45%), radial-gradient(ellipse at 46% 100%, rgba(36, 77, 117, 0.32), transparent 56%), linear-gradient(165deg, #070b20 0%, #101533 55%, #080d24 100%)',
        }}
      />

      {/* 🌟 1. Lucy AI Default: Night Sky Starlight (밤하늘 별빛 레이어) */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: isPlusMode ? 0.22 : 1,
          scale: isPlusMode ? 0.96 : 1,
        }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="lucy-stars lucy-stars-distant" />
        <div className="lucy-stars lucy-stars-bright" />
        <div className="lucy-starlight-veil" />
      </motion.div>

      {/* 🍀 2. Lucy + Evolution: Clover Stars Layer (별빛이 네잎·세잎 클로버로 피어나는 레이어) */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: isPlusMode ? 1 : 0,
          scale: isPlusMode ? 1 : 1.05,
        }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Subtle Cosmic Emerald & Gold Stardust */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 24px 38px, #fbbf24 90%, transparent), radial-gradient(2px 2px at 120px 180px, #34d399 90%, transparent), radial-gradient(1.2px 1.2px at 240px 90px, #6ee7b7 90%, transparent), radial-gradient(1.8px 1.8px at 310px 270px, #fde68a 90%, transparent)',
            backgroundSize: '360px 360px, 420px 420px, 480px 480px, 390px 390px',
          }}
        />

        {/* Floating Four-Leaf & Three-Leaf Clovers */}
        {clovers.map((c) => {
          const isGold = c.color === 'gold';
          const isMint = c.color === 'mint';
          const fill = isGold ? '#fef08a' : isMint ? '#a7f3d0' : '#6ee7b7';
          const stroke = isGold ? '#f59e0b' : isMint ? '#10b981' : '#059669';
          const glow = isGold ? 'rgba(245, 158, 11, 0.7)' : 'rgba(16, 185, 129, 0.65)';

          return (
            <motion.div
              key={c.id}
              className="absolute pointer-events-none"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: c.size,
                height: c.size,
                filter: `drop-shadow(0 0 ${c.size > 28 ? '8px' : '5px'} ${glow})`,
              }}
              animate={
                isPlusMode
                  ? {
                      y: [0, -18, 0],
                      x: [0, 8, 0],
                      rotate: [c.rotation, c.rotation + 18, c.rotation - 10, c.rotation],
                      scale: [1, 1.08, 0.95, 1],
                      opacity: [0.55, 0.92, 0.65, 0.55],
                    }
                  : { opacity: 0 }
              }
              transition={{
                duration: c.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: c.delay,
              }}
            >
              {c.type === 'four' ? (
                // 🍀 Four-leaf Clover (네잎클로버: 행운과 마스터 지능)
                <svg
                  viewBox="0 0 32 32"
                  className="w-full h-full"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1.2"
                >
                  <g transform="translate(16, 16)">
                    {/* 4 Leaves */}
                    {[0, 90, 180, 270].map((deg) => (
                      <path
                        key={deg}
                        d="M 0 0 C -4 -5, -8 -11, -4 -13 C 0 -15, 0 -8, 0 0 C 0 -8, 0 -15, 4 -13 C 8 -11, 4 -5, 0 0"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Stem */}
                    <path
                      d="M 0 0 Q 3 10, -2 15"
                      fill="none"
                      stroke={stroke}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    {/* Sparkling Star Center */}
                    <circle cx="0" cy="0" r="1.5" fill="#ffffff" stroke="none" />
                  </g>
                </svg>
              ) : (
                // ☘️ Three-leaf Clover (세잎클로버: 평화, 조화, 온기)
                <svg
                  viewBox="0 0 32 32"
                  className="w-full h-full"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1.2"
                >
                  <g transform="translate(16, 16)">
                    {/* 3 Leaves */}
                    {[0, 120, 240].map((deg) => (
                      <path
                        key={deg}
                        d="M 0 0 C -4 -5, -8 -11, -4 -13 C 0 -15, 0 -8, 0 0 C 0 -8, 0 -15, 4 -13 C 8 -11, 4 -5, 0 0"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Stem */}
                    <path
                      d="M 0 0 Q 3 9, -1 14"
                      fill="none"
                      stroke={stroke}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    {/* Sparkling Star Center */}
                    <circle cx="0" cy="0" r="1.3" fill="#ffffff" stroke="none" />
                  </g>
                </svg>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* 👑 Golden & Emerald Aura Rim Border when in Lucy + */}
      <AnimatePresence>
        {isPlusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                'inset 0 0 45px rgba(245, 158, 11, 0.22), inset 0 0 90px rgba(16, 185, 129, 0.16)',
            }}
          >
            {/* Top Golden Light Strip */}
            <div
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.7) 30%, rgba(52, 211, 153, 0.8) 50%, rgba(245, 158, 11, 0.7) 70%, transparent 100%)',
                filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
