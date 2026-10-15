import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ZoomIn,
  Flame,
  Coins,
  Compass,
  Feather,
  Sun,
  Moon,
  Eye,
  Activity,
  RefreshCw,
  LucideIcon,
} from 'lucide-react';
import { type TarotCard, getTarotCardImageUrl } from '@/data/tarotData';
import { TarotCardBackFace } from './TarotCardBackFace';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import { TarotCardFlipParticles } from './TarotCardFlipParticles';
import { triggerTarotScreenVibration } from '@/utils/tarotEffects';

export function getTarotCardVisualHelper(card: TarotCard | null | undefined): {
  icon: LucideIcon;
  color: string;
} {
  if (!card) return { icon: Sparkles, color: 'text-yellow-400' };

  if (card.id?.startsWith('trinity_')) {
    const map: Record<string, { icon: LucideIcon; color: string }> = {
      trinity_01_source: { icon: Eye, color: 'text-indigo-400' },
      trinity_02_geometry: { icon: RefreshCw, color: 'text-cyan-400' },
      trinity_03_ascension: { icon: Sparkles, color: 'text-yellow-400' },
      trinity_04_mirror: { icon: Activity, color: 'text-zinc-400' },
    };
    if (map[card.id]) return map[card.id];
  }

  if (card.type === 'major') {
    return { icon: Sun, color: 'text-yellow-400' };
  }
  if (card.type === 'wands') {
    return { icon: Flame, color: 'text-amber-500' };
  }
  if (card.type === 'cups') {
    return { icon: Moon, color: 'text-blue-400' };
  }
  if (card.type === 'swords') {
    return { icon: Feather, color: 'text-cyan-400' };
  }
  if (card.type === 'pentacles') {
    return { icon: Coins, color: 'text-emerald-400' };
  }
  return { icon: Sparkles, color: 'text-yellow-400' };
}

export interface TarotFlippingCardProps {
  card: TarotCard;
  slotName?: string;
  index?: number;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'wide';
  forceFlipped?: boolean;
  cardBackId?: string;
}

export const TarotFlippingCard: React.FC<TarotFlippingCardProps> = ({
  card,
  slotName,
  index = 0,
  onClick,
  className = '',
  size = 'md',
  cardBackId,
}) => {
  const { cardBackId: globalCardBackId } = useTarotCardBack();
  const effectiveCardBackId = cardBackId || globalCardBackId;
  const [isClicked, setIsClicked] = useState(false);
  const visual = getTarotCardVisualHelper(card);
  const isReversed = Boolean(
    card.reversed === true ||
    card.reversed === ('true' as any) ||
    (card as any)?.isReversed === true ||
    (card as any)?.isReversed === 'true' ||
    (card as any)?.is_reversed === true ||
    (card as any)?.is_reversed === 'true' ||
    (card as any)?.orientation === 'reversed' ||
    (card as any)?.orientation === '역방향' ||
    (card as any)?.direction === 'reversed' ||
    (card as any)?.direction === '역방향' ||
    Boolean(card.nameKo && (card.nameKo.includes('(역)') || card.nameKo.includes('(역방향)') || card.nameKo.includes('· 역방향') || card.nameKo.includes('[역방향]'))) ||
    Boolean(card.name && (card.name.includes('(Rev)') || card.name.includes('(Reversed)') || card.name.includes('[Reversed]') || card.name.includes('[역방향]'))) ||
    Boolean(slotName && (slotName.includes('역방향') || slotName.includes('(역)')))
  );
  const imageUrl = getTarotCardImageUrl(card);

  // Slight initial tilt alternating by index (-8° to +8°) for magical natural spread feel
  const tiltDeg = index % 2 === 0 ? -6 : 6;
  const delay = Math.min(index * 0.12 + 0.06, 1.2);

  // Size variations
  let containerDimensions = 'w-20 min-h-[7.5rem]';
  let imageTextSize = 'text-[9px]';
  let subTextSize = 'text-[6px]';
  let iconCircleSize = 'w-7 h-7';
  let iconSize = 14;

  if (size === 'sm') {
    containerDimensions = 'w-16 min-h-[6.2rem]';
    imageTextSize = 'text-[8px]';
    subTextSize = 'text-[5px]';
    iconCircleSize = 'w-6 h-6';
    iconSize = 12;
  } else if (size === 'lg') {
    containerDimensions = 'w-28 min-h-[10.5rem]';
    imageTextSize = 'text-[11px]';
    subTextSize = 'text-[7px]';
    iconCircleSize = 'w-9 h-9';
    iconSize = 18;
  } else if (size === 'wide') {
    containerDimensions = 'w-22 min-h-[8.5rem]';
    imageTextSize = 'text-[10px]';
    subTextSize = 'text-[6.5px]';
    iconCircleSize = 'w-7 h-7';
    iconSize = 14;
  }

  const [particlesActive, setParticlesActive] = useState(false);
  const [particleTriggerKey, setParticleTriggerKey] = useState(0);

  // 카드가 180도에서 0도로 회전하며 앞면을 온전히 드러내는 황금 순간에 입자 애니메이션 및 화면 미세 진동 트리거
  React.useEffect(() => {
    const flipMomentMs = Math.max(100, Math.round((delay + 0.18) * 1000));
    const timer = window.setTimeout(() => {
      setParticlesActive(true);
      setParticleTriggerKey((prev) => prev + 1);
      triggerTarotScreenVibration({ intensity: 'subtle' });
    }, flipMomentMs);

    return () => window.clearTimeout(timer);
  }, [delay]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    setParticlesActive(true);
    setParticleTriggerKey((prev) => prev + 1);
    triggerTarotScreenVibration({ intensity: 'subtle' });
    setTimeout(() => setIsClicked(false), 450);
    onClick?.();
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative inline-block ${className}`}
    >
      {/* 🌟 카드가 뒤집히는 순간 뿜어져 나오는 찬란한 입자 애니메이션 */}
      <TarotCardFlipParticles
        active={particlesActive}
        triggerKey={particleTriggerKey}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
        count={size === 'sm' ? 20 : 26}
      />

      {/* Subtle Mystical Candlelight / Celestial Aura Flicker while being drawn */}
      <div
        className="absolute -inset-1 sm:-inset-1.5 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-yellow-300/30 to-amber-500/20 blur-[6px] pointer-events-none tarot-card-drawing-flicker opacity-75 group-hover:opacity-100 transition-opacity"
        style={{ zIndex: 0 }}
      />

      <motion.div
        initial={{
          rotateY: 180,
          scale: 0.72,
          y: 32,
          rotateZ: tiltDeg,
          opacity: 0,
        }}
        animate={{
          rotateY: 0,
          scale: isClicked ? 1.08 : 1,
          y: 0,
          rotateZ: 0,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 18,
          delay,
        }}
        whileHover={{
          scale: 1.05,
          y: -4,
          rotateZ: index % 2 === 0 ? -1.5 : 1.5,
          transition: { type: 'spring', stiffness: 350, damping: 25 },
        }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
        className={`${containerDimensions} rounded-2xl cursor-zoom-in relative select-none group transition-shadow duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.45)]`}
        title={`${card.nameKo} 카드 크게 보기 (상세 보기)`}
      >
        {/* =========================================================================
            FRONT FACE: Revealed Tarot Card
            Visible at rotateY: 0deg, hidden when rotated 180deg
           ========================================================================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
          className="absolute inset-0 w-full h-full bg-zinc-950 border border-yellow-500/50 group-hover:border-yellow-300 rounded-2xl flex flex-col items-center justify-between p-2 text-center overflow-hidden transition-colors duration-300 shadow-[0_0_20px_rgba(234,179,8,0.22)] tarot-card-border-flicker"
        >
          {/* Subtle magical shimmer sweep on entrance */}
          <motion.div
            initial={{ x: '-150%', opacity: 0.9 }}
            animate={{ x: '240%', opacity: 0 }}
            transition={{
              duration: 1.1,
              delay: delay + 0.22,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/50 via-yellow-100/75 to-transparent skew-x-12 pointer-events-none z-30"
          />

          {/* Continuous Ambient Mystical Shimmer Wave */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-300/10 to-transparent pointer-events-none z-25 tarot-ambient-shimmer-layer" />

          {/* Periodic Subtle Shimmer Beam across artwork */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/25 to-transparent skew-x-12 pointer-events-none z-25 opacity-0 group-hover:opacity-100 tarot-card-shimmer-sweep transition-opacity" />

          {/* Click Scale Wave Feedback */}
          {isClicked && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl border-2 border-yellow-300 bg-yellow-400/20 pointer-events-none z-40"
            />
          )}

          {/* Card Artwork Image */}
          <img
            src={imageUrl}
            alt={card.name}
            style={{
              transform: isReversed ? 'rotate(180deg)' : undefined,
              transformOrigin: 'center center',
            }}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/65 z-10 pointer-events-none" />

          {/* Hover Zoom Icon Badge */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-yellow-500/90 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <ZoomIn size={12} />
            </div>
          </div>

          {/* Position Slot Label */}
          <div className="flex justify-between items-center w-full z-20 shrink-0 text-[6px] font-mono text-yellow-400/90 drop-shadow-sm">
            <span className="truncate max-w-[70%] font-semibold tracking-wider">
              {slotName || `${index + 1}번`}
            </span>
            <Sparkles size={7} className="text-yellow-400 shrink-0 animate-pulse" />
          </div>

          {/* Center Arcana Symbol Emblem */}
          <div
            className={`${iconCircleSize} rounded-full bg-black/65 border border-yellow-500/30 flex items-center justify-center text-yellow-400 z-20 transition-all duration-300 group-hover:scale-110 shadow-inner group-hover:border-yellow-400/60`}
          >
            {React.createElement(visual.icon, {
              size: iconSize,
              className: visual.color,
            })}
          </div>

          {/* Card Names Pill */}
          <div className="text-center z-20 flex flex-col gap-0.5 w-full bg-black/70 py-1 px-1 rounded-lg border border-yellow-500/20 backdrop-blur-[2px]">
            <span
              className={`font-bold text-yellow-300 ${imageTextSize} leading-tight truncate px-0.5 font-sans`}
            >
              {card.nameKo}
            </span>
            <span
              className={`${subTextSize} text-white/60 uppercase tracking-widest leading-none truncate px-0.5 font-mono`}
            >
              {isReversed ? '역방향 (REVERSED)' : card.name}
            </span>
          </div>

          {/* Reversed Indicator Ribbon (if reversed) */}
          {isReversed && (
            <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-rose-950/85 border border-rose-500/60 text-rose-200 text-[6px] font-mono font-bold uppercase z-25 pointer-events-none">
              REV
            </div>
          )}
        </div>

        {/* =========================================================================
            BACK FACE: Mystical Tarot Card Back (Dynamic Quin 20-Deck Theme)
            Visible at rotateY: 180deg (starts facing front, then turns away)
           ========================================================================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/40 tarot-card-border-flicker"
        >
          {/* Subtle back shimmer sweep as card is drawn from deck */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent skew-x-12 pointer-events-none z-20 tarot-card-shimmer-sweep" />
          <TarotCardBackFace
            cardBackId={effectiveCardBackId}
            size={size}
            isHovered={isClicked}
          />
        </div>
      </motion.div>
    </div>
  );
};
