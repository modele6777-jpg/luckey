import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TarotCardFlipParticlesProps {
  active?: boolean;
  triggerKey?: string | number;
  count?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ParticleData {
  id: number;
  angle: number;
  distance: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  glowColor: string;
  type: 'star' | 'spark' | 'diamond' | 'ember';
  rotation: number;
  delay: number;
  duration: number;
}

const PARTICLE_PALETTES = [
  { color: '#FEF08A', glow: 'rgba(254, 240, 138, 0.9)', type: 'star' as const },
  { color: '#FACC15', glow: 'rgba(250, 204, 21, 0.85)', type: 'spark' as const },
  { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.8)', type: 'diamond' as const },
  { color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.95)', type: 'star' as const },
  { color: '#FB923C', glow: 'rgba(251, 146, 60, 0.8)', type: 'ember' as const },
  { color: '#67E8F9', glow: 'rgba(103, 232, 249, 0.8)', type: 'spark' as const },
  { color: '#C084FC', glow: 'rgba(192, 132, 252, 0.75)', type: 'star' as const },
];

export const TarotCardFlipParticles: React.FC<TarotCardFlipParticlesProps> = ({
  active = true,
  triggerKey = 0,
  count = 26,
  className = '',
  size = 'md',
}) => {
  const scaleMultiplier = size === 'sm' ? 0.75 : size === 'lg' ? 1.3 : 1;

  const particles: ParticleData[] = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Golden angle distribution with slight natural jitter
      const baseAngle = (i / count) * 2 * Math.PI;
      const angleJitter = ((i * 37) % 20 - 10) * (Math.PI / 180);
      const angle = baseAngle + angleJitter;

      // Distance variance: some burst nearby, others shoot far for rich depth
      const minDistance = (40 + ((i * 19) % 35)) * scaleMultiplier;
      const maxDistance = (85 + ((i * 43) % 45)) * scaleMultiplier;
      const distance = minDistance + (maxDistance - minDistance) * 0.8;

      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      const palette = PARTICLE_PALETTES[i % PARTICLE_PALETTES.length];
      const pSize = (3.5 + ((i * 13) % 5)) * scaleMultiplier;
      const rotation = ((i * 67) % 360) - 180;
      const delay = (i % 5) * 0.02;
      const duration = 0.65 + ((i * 29) % 25) * 0.01;

      return {
        id: i,
        angle,
        distance,
        targetX,
        targetY,
        size: pSize,
        color: palette.color,
        glowColor: palette.glow,
        type: palette.type,
        rotation,
        delay,
        duration,
      };
    });
  }, [count, scaleMultiplier, triggerKey]);

  if (!active) return null;

  return (
    <div
      key={`particle-burst-${triggerKey}`}
      className={`absolute inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-visible ${className}`}
      style={{ overflow: 'visible' }}
    >
      <AnimatePresence>
        {/* 1. Radiant Expanding Shockwave Ring (GPU Transform + Opacity only, zero blur filter) */}
        <motion.div
          key={`shockwave-${triggerKey}`}
          initial={{ scale: 0.5, opacity: 0.85 }}
          animate={{ scale: 1.75 * scaleMultiplier, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-full h-full rounded-2xl border border-yellow-300/75"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* 2. Burst of Lightweight Hardware-Accelerated Sparkles (zero SVG drop-shadow filters) */}
        {particles.map((p) => (
          <motion.div
            key={`p-${triggerKey}-${p.id}`}
            initial={{
              x: 0,
              y: 0,
              scale: 0.25,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: p.targetX,
              y: p.targetY,
              scale: [0.3, 1.15, 0.1],
              opacity: [1, 0.9, 0],
              rotate: p.rotation,
            }}
            transition={{
              duration: Math.min(0.45, p.duration * 0.65),
              delay: p.delay * 0.5,
              ease: 'easeOut',
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              width: p.size,
              height: p.size,
              willChange: 'transform, opacity',
            }}
          >
            {p.type === 'star' ? (
              <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                <path
                  d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                  fill={p.color}
                />
              </svg>
            ) : p.type === 'diamond' ? (
              <div
                className="w-full h-full rotate-45 rounded-[1px]"
                style={{ backgroundColor: p.color }}
              />
            ) : (
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: p.color }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};


export default TarotCardFlipParticles;
