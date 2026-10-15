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
        {/* 1. Radiant Expanding Shockwave Ring (Golden-Amber Celestial Aura) */}
        <motion.div
          key={`shockwave-${triggerKey}`}
          initial={{ scale: 0.25, opacity: 0.95 }}
          animate={{ scale: 2.3 * scaleMultiplier, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-full h-full rounded-2xl border-2 border-yellow-300/80 bg-[radial-gradient(ellipse_at_center,rgba(254,240,138,0.45)_0%,rgba(234,179,8,0.2)_50%,transparent_75%)] blur-[3px]"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* 2. Secondary High-Speed Solar Flash Pulse */}
        <motion.div
          key={`solar-flash-${triggerKey}`}
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 1.8 * scaleMultiplier, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(250,204,21,0.5)_45%,transparent_70%)] blur-[2px]"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* 3. Central Starlight Cross Rays Beam */}
        <motion.div
          key={`cross-rays-${triggerKey}`}
          initial={{ scale: 0.2, rotate: 0, opacity: 1 }}
          animate={{ scale: 1.9 * scaleMultiplier, rotate: 45, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute w-24 h-24 flex items-center justify-center"
        >
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[0.5px]" />
          <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-white to-transparent blur-[0.5px]" />
          <div className="absolute w-3/4 h-[1.5px] rotate-45 bg-gradient-to-r from-transparent via-yellow-200 to-transparent blur-[0.5px]" />
          <div className="absolute w-3/4 h-[1.5px] -rotate-45 bg-gradient-to-r from-transparent via-yellow-200 to-transparent blur-[0.5px]" />
        </motion.div>

        {/* 4. Burst of 26 Radiant Sparkles, Diamonds, Stars & Embers */}
        {particles.map((p) => {
          return (
            <motion.div
              key={`p-${triggerKey}-${p.id}`}
              initial={{
                x: 0,
                y: 0,
                scale: 0.15,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: p.targetX,
                y: p.targetY,
                scale: [0.2, 1.4, 0.1],
                opacity: [1, 1, 0],
                rotate: p.rotation * 2,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.18, 0.89, 0.32, 1.15],
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                width: p.size,
                height: p.size,
                willChange: 'transform, opacity',
              }}
            >
              {p.type === 'star' ? (
                // ✦ Four-pointed sparkling star
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full overflow-visible"
                  style={{
                    filter: `drop-shadow(0 0 6px ${p.glowColor}) drop-shadow(0 0 10px ${p.glowColor})`,
                  }}
                >
                  <path
                    d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                    fill={p.color}
                  />
                </svg>
              ) : p.type === 'diamond' ? (
                // ✧ Diamond shimmer
                <div
                  className="w-full h-full rotate-45 rounded-[1px]"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.glowColor}, 0 0 14px ${p.glowColor}`,
                  }}
                />
              ) : p.type === 'ember' ? (
                // Floating golden ember
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `radial-gradient(circle, #ffffff 10%, ${p.color} 70%)`,
                    boxShadow: `0 0 7px ${p.glowColor}, 0 0 12px ${p.glowColor}`,
                  }}
                />
              ) : (
                // Glowing celestial circular spark
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 6px ${p.glowColor}, 0 0 12px ${p.glowColor}`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TarotCardFlipParticles;
