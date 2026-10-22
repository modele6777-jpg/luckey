import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Eye, RefreshCw, Sun, Compass, Activity,
  Flame, Heart, Wind, Coins, ShieldCheck, BookOpen, Zap, Star, Moon,
  ChevronLeft, ChevronRight, Shuffle, ZoomIn, Palette,
} from 'lucide-react';
import { TAROT_DECK, TarotCard, getTarotCardImageUrl, rollTarotReversed } from '../../data/tarotData';
import { TarotCardZoomModal } from './TarotCardZoomModal';
import { TarotCardBackFace } from './TarotCardBackFace';
import { TarotCardFlipParticles } from './TarotCardFlipParticles';
import { TarotCardBackCustomizerModal } from './TarotCardBackCustomizerModal';
import { PhysicalTarotInputModal } from './PhysicalTarotInputModal';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { triggerTarotScreenVibration } from '@/utils/tarotEffects';
import { isDailyTarotConcern } from '@/lib/trinity/utils';

export interface SelectedTarotCardEntry extends TarotCard {
  touchMetadata?: any | null;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  // Multi-pass cryptographic Fisher-Yates shuffle
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = newArr.length - 1; i > 0; i -= 1) {
      let rand = Math.random();
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const buffer = new Uint32Array(1);
        window.crypto.getRandomValues(buffer);
        rand = buffer[0] / (0xffffffff + 1);
      }
      const j = Math.floor(rand * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
  }
  return newArr;
};

const getTarotCardVisual = (card: TarotCard | null | undefined) => {
  if (!card) return { icon: Sparkles, color: 'text-yellow-400' };

  if (card.id?.startsWith('trinity_')) {
    const map: Record<string, { icon: typeof Sparkles; color: string }> = {
      trinity_01_source: { icon: Eye, color: 'text-indigo-400' },
      trinity_02_geometry: { icon: RefreshCw, color: 'text-cyan-400' },
      trinity_03_ascension: { icon: Sparkles, color: 'text-yellow-400' },
      trinity_04_mirror: { icon: Activity, color: 'text-zinc-400' },
      trinity_05_logos: { icon: Sun, color: 'text-amber-400' },
      trinity_06_alignment: { icon: Compass, color: 'text-yellow-400' },
      trinity_07_eye: { icon: Eye, color: 'text-purple-400' },
      trinity_08_shaman: { icon: Sparkles, color: 'text-rose-400' },
      trinity_09_cube: { icon: ShieldCheck, color: 'text-blue-400' },
      trinity_10_trinity: { icon: Sparkles, color: 'text-yellow-500' },
    };
    return map[card.id] ?? { icon: Sparkles, color: 'text-yellow-400' };
  }

  if (card.id?.startsWith('wands_')) return { icon: Flame, color: 'text-amber-500' };
  if (card.id?.startsWith('cups_')) return { icon: Heart, color: 'text-blue-400' };
  if (card.id?.startsWith('swords_')) return { icon: Wind, color: 'text-purple-400' };
  if (card.id?.startsWith('pent_')) return { icon: Coins, color: 'text-yellow-400' };

  const majorMap: Record<string, { icon: typeof Sparkles; color: string }> = {
    major_0: { icon: Eye, color: 'text-zinc-400' },
    major_1: { icon: Sparkles, color: 'text-amber-400' },
    major_2: { icon: Eye, color: 'text-indigo-400' },
    major_3: { icon: Heart, color: 'text-rose-400' },
    major_4: { icon: ShieldCheck, color: 'text-yellow-500' },
    major_5: { icon: BookOpen, color: 'text-blue-400' },
    major_6: { icon: Heart, color: 'text-pink-400' },
    major_7: { icon: Zap, color: 'text-yellow-400' },
    major_8: { icon: ShieldCheck, color: 'text-amber-500' },
    major_9: { icon: Eye, color: 'text-amber-400' },
    major_10: { icon: RefreshCw, color: 'text-cyan-400' },
    major_11: { icon: Activity, color: 'text-yellow-400' },
    major_12: { icon: RefreshCw, color: 'text-violet-400' },
    major_13: { icon: Activity, color: 'text-purple-500' },
    major_14: { icon: Wind, color: 'text-cyan-300' },
    major_15: { icon: Zap, color: 'text-red-500' },
    major_16: { icon: Zap, color: 'text-orange-500' },
    major_17: { icon: Star, color: 'text-yellow-300' },
    major_18: { icon: Moon, color: 'text-blue-300' },
    major_19: { icon: Sun, color: 'text-orange-400' },
    major_20: { icon: Sparkles, color: 'text-purple-400' },
    major_21: { icon: Sparkles, color: 'text-indigo-500' },
  };
  return majorMap[card.id] ?? { icon: Sparkles, color: 'text-yellow-400' };
};

// 78-card complete circular wheel
export const TOTAL_WHEEL_SLOTS = 78;

const getWheelLayout = (totalCards: number, radius: number, cardWidth: number) => {
  if (totalCards <= 1) {
    return { angleStep: 2 * Math.PI, seamAngle: 2 * Math.PI };
  }

  const seamAngle = 2 * Math.asin(Math.min(1, (cardWidth + 8) / (2 * radius)));
  return {
    angleStep: (2 * Math.PI - seamAngle) / (totalCards - 1),
    seamAngle,
  };
};

type DeckWheelCardProps = {
  card: TarotCard;
  originalIdx: number;
  radius: number;
  cardWidth: number;
  gapAngleOffset: number;
  isMobile: boolean;
  totalCards: number;
  isPicked: boolean;
  isHovered: boolean;
  cardBackId?: string;
};

// Ultra-lightweight card memoization: Fixed base slot + local neighbor gap fill only
const DeckWheelCard = React.memo(
  function DeckWheelCard({
    card,
    originalIdx,
    radius,
    cardWidth,
    gapAngleOffset,
    isMobile,
    totalCards = TOTAL_WHEEL_SLOTS,
    isPicked = false,
    isHovered = false,
    cardBackId,
  }: DeckWheelCardProps) {
    const { angleStep } = getWheelLayout(totalCards, radius, cardWidth);
    const localAngle = originalIdx * angleStep + gapAngleOffset;
    const liftAmount = isHovered ? (isMobile ? 12 : 18) : 0;
    const finalRadius = radius + liftAmount;
    const cardRotate = Math.round(((localAngle * 180) / Math.PI + 90) * 10) / 10;
    const x = Math.round(finalRadius * Math.cos(localAngle) * 10) / 10;
    const y = Math.round(finalRadius * Math.sin(localAngle) * 10) / 10;

    return (
      <div
        data-card-id={isPicked ? undefined : card.id}
        data-card-local-angle={localAngle}
        className={`absolute left-1/2 top-1/2 w-16 h-28 sm:w-20 sm:h-34 md:w-24 md:h-40 rounded-lg sm:rounded-xl flex items-center justify-center select-none ${
          isPicked
            ? 'hidden pointer-events-none'
            : isHovered
            ? 'pointer-events-auto cursor-pointer z-[5000]'
            : 'pointer-events-auto cursor-pointer'
        }`}
        style={{
          transform: `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) rotate(${cardRotate}deg)`,
          transformOrigin: 'center center',
          zIndex: isHovered ? 5000 : totalCards - originalIdx,
        }}
      >
        {!isPicked && (
          <TarotCardBackFace
            cardBackId={cardBackId}
            size={isMobile ? 'sm' : 'wheel'}
            isHovered={isHovered}
          />
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.card.id === next.card.id &&
      prev.cardBackId === next.cardBackId &&
      prev.originalIdx === next.originalIdx &&
      prev.cardWidth === next.cardWidth &&
      prev.gapAngleOffset === next.gapAngleOffset &&
      prev.radius === next.radius &&
      prev.isMobile === next.isMobile &&
      prev.totalCards === next.totalCards &&
      prev.isPicked === next.isPicked &&
      prev.isHovered === next.isHovered
    );
  }
);

interface TarotSpreadProps {
  onComplete: (cards: SelectedTarotCardEntry[], touchMetadata?: any | null) => void;
  onCancel: () => void;
  maxCards?: number;
  concern?: string;
  positions?: string[];
  spreadName?: string;
  spreadReason?: string;
  deckSource?: TarotCard[];
  cardBackVariant?: 'classic' | 'oracle';
  allowReversed?: boolean;
  cardBackId?: string;
}

export const TarotSpread: React.FC<TarotSpreadProps> = ({
  onComplete,
  onCancel,
  maxCards = 3,
  concern = '',
  positions = [],
  spreadName = '',
  spreadReason = '',
  deckSource,
  cardBackVariant = 'oracle',
  allowReversed = true,
  cardBackId,
}) => {
  const concernText = concern.trim();
  const hasConcern = concernText.length > 0;
  const hasSpreadMeta = spreadName.trim().length > 0;

  const [isMobile, setIsMobile] = useState(false);
  const isDaily = useMemo(() => {
    return maxCards === 1 || isDailyTarotConcern(concern) || isDailyTarotConcern(spreadName);
  }, [maxCards, concern, spreadName]);

  const compactSlots = maxCards >= 4 || isMobile;
  const slotClass = isMobile
    ? compactSlots
      ? 'w-12 h-18 sm:w-14 sm:h-21'
      : 'w-15 h-23 sm:w-18 sm:h-28'
    : compactSlots
      ? 'w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36'
      : 'w-22 h-34 md:w-30 md:h-46';
  const slotsWrapClass = isMobile
    ? 'flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-[96vw]'
    : compactSlots
      ? 'flex flex-wrap items-end justify-center gap-2 sm:gap-3 max-w-[92vw]'
      : 'flex items-center justify-center gap-4 md:gap-6';

  const activeSource = useMemo(() => {
    return deckSource && deckSource.length > 0 ? deckSource : TAROT_DECK;
  }, [deckSource]);

  const [deck, setDeck] = useState(() => shuffleArray(activeSource));

  useEffect(() => {
    setDeck(shuffleArray(activeSource));
    setSelectedEntries([]);
  }, [activeSource]);

  const { cardBackId: globalCardBackId } = useTarotCardBack();
  const effectiveCardBackId = cardBackId || globalCardBackId;
  const [showCardBackModal, setShowCardBackModal] = useState(false);
  const [showPhysicalInputModal, setShowPhysicalInputModal] = useState(false);

  const [selectedEntries, setSelectedEntries] = useState<Array<{ card: TarotCard; reversed: boolean }>>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const hasCompletedRef = useRef(false);
  const touchedCardIdRef = useRef<string | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const [radius, setRadius] = useState(600);
  const [yOffset, setYOffset] = useState(580);
  const [wheelCardWidth, setWheelCardWidth] = useState(96);

  const selectedIds = useMemo(
    () => selectedEntries.map((entry) => entry.card.id),
    [selectedEntries],
  );
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Active unpicked cards list for remaining count & auto-pick
  const activeWheelCards = useMemo(
    () => deck.filter((card) => !selectedIdSet.has(card.id)),
    [deck, selectedIdSet],
  );
  const wheelLayout = useMemo(
    () => getWheelLayout(deck.length, radius, wheelCardWidth),
    [deck.length, radius, wheelCardWidth],
  );

  // 🌟 나머지 카드는 고정하되 빈자리만 인접 카드가 국소적으로 메우는 오프셋 계산:
  // 전체 78장 중 뽑힌 카드 양옆 이웃 카드(좌우 최대 2장씩)만 빈자리 쪽으로 살짝 당겨 빈틈을 메우고,
  // 나머지 70여 장의 카드는 오프셋 0을 유지해 React.memo 리렌더링과 DOM 재계산을 원천 차단합니다.
  const localGapOffsets = useMemo(() => {
    const n = deck.length;
    const offsets = new Float64Array(n);
    if (n === 0 || selectedIdSet.size === 0) return offsets;

    const step = getWheelLayout(n, radius, wheelCardWidth).angleStep;
    for (let i = 0; i < n; i++) {
      if (!selectedIdSet.has(deck[i].id)) continue;

      // Find nearest unpicked left neighbor (within 3 slots)
      for (let d = 1; d <= 3; d++) {
        const leftIdx = i - d;
        if (leftIdx < 0) break;
        if (!selectedIdSet.has(deck[leftIdx].id)) {
          offsets[leftIdx] += step * (d === 1 ? 0.42 : 0.22);
          const leftIdx2 = leftIdx - 1;
          if (leftIdx2 >= 0 && !selectedIdSet.has(deck[leftIdx2].id)) {
            offsets[leftIdx2] += step * 0.16;
          }
          break;
        }
      }

      // Find nearest unpicked right neighbor (within 3 slots)
      for (let d = 1; d <= 3; d++) {
        const rightIdx = i + d;
        if (rightIdx >= n) break;
        if (!selectedIdSet.has(deck[rightIdx].id)) {
          offsets[rightIdx] -= step * (d === 1 ? 0.42 : 0.22);
          const rightIdx2 = rightIdx + 1;
          if (rightIdx2 < n && !selectedIdSet.has(deck[rightIdx2].id)) {
            offsets[rightIdx2] -= step * 0.16;
          }
          break;
        }
      }
    }

    // Round to 4 decimal places for stable React.memo equality checks
    for (let i = 0; i < n; i++) {
      if (offsets[i] !== 0) {
        offsets[i] = Math.round(offsets[i] * 10000) / 10000;
      }
    }
    return offsets;
  }, [deck, radius, selectedIdSet, wheelCardWidth]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const hoveredCardIdRef = useRef<string | null>(null);
  const [wheelReady, setWheelReady] = useState(false);
  const [zoomedCard, setZoomedCard] = useState<{ card: TarotCard; slotName?: string } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLayerRef = useRef<HTMLDivElement>(null);
  
  // High-performance physics refs
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const startPointerPosRef = useRef({ x: 0, y: 0 });
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0); // degrees per frame
  const rotationRef = useRef(Math.floor(Math.random() * 360));
  const hadMovedRef = useRef(false);
  const momentumRafRef = useRef<number | null>(null);

  const wheelCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastHoverCheckTimeRef = useRef<number>(0);

  const buildWheelTransform = useCallback(
    (deg: number) => `translate3d(-50%, calc(-50% + ${yOffset}px), 0) rotate(${deg}deg)`,
    [yOffset],
  );

  // 🌟 Zero-Reflow O(1) GPU Wheel Rotation:
  // 부모 휠 레이어의 단일 transform만 변경하며, 78장 자식 DOM 노드의 zIndex 루프 변경을 완전히 제거해 60~120fps 무저항 회전을 보장합니다.
  const applyRotation = useCallback(
    (deg: number) => {
      rotationRef.current = deg;
      if (wheelLayerRef.current) {
        wheelLayerRef.current.style.transform = buildWheelTransform(deg);
      }
    },
    [buildWheelTransform],
  );

  // Stop any active inertia loop
  const stopMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  }, []);

  // Smooth kinetic deceleration loop (60-120fps physics)
  const startMomentum = useCallback(
    (initialVelocity: number) => {
      stopMomentum();
      velocityRef.current = Math.max(-14, Math.min(14, initialVelocity));

      const step = () => {
        if (Math.abs(velocityRef.current) < 0.015) {
          velocityRef.current = 0;
          momentumRafRef.current = null;
          return;
        }

        applyRotation(rotationRef.current + velocityRef.current);
        velocityRef.current *= 0.94; // Friction damping
        momentumRafRef.current = requestAnimationFrame(step);
      };

      momentumRafRef.current = requestAnimationFrame(step);
    },
    [applyRotation, stopMomentum],
  );

  // Responsive layout calibration
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 480) {
        // Calibrated for mobile to keep wheel cards completely visible & unoccluded
        setRadius(Math.max(280, Math.min(340, Math.round(h * 0.40))));
        setYOffset(Math.max(300, Math.min(370, Math.round(h * 0.45))));
        setWheelCardWidth(64);
        setIsMobile(true);
      } else if (w < 768) {
        setRadius(460);
        setYOffset(540);
        setWheelCardWidth(w < 640 ? 64 : 80);
        setIsMobile(true);
      } else {
        setRadius(640);
        setYOffset(740);
        setWheelCardWidth(96);
        setIsMobile(false);
      }
    };

    updateRadius();
    const onResize = () => {
      if (!isDraggingRef.current) {
        updateRadius();
      }
    };
    window.addEventListener('resize', onResize);
    const timer = window.setTimeout(() => {
      updateRadius();
      setWheelReady(true);
    }, 50);

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      stopMomentum();
    };
  }, [stopMomentum]);

  // Synchronize initial wheel position (do not re-run 78-card DOM zIndex loop when picking a card)
  useEffect(() => {
    hoveredCardIdRef.current = hoveredCardId;
    if (wheelReady) {
      applyRotation(rotationRef.current);
    }
  }, [wheelReady, hoveredCardId, applyRotation]);

  // Handle ESC key to cancel/close the card spread window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  // Complete Viewport & Background Scroll Locking during card picking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedScrollY = window.scrollY;
    const origBodyOverflow = document.body.style.overflow;
    const origBodyTouchAction = document.body.style.touchAction;
    const origBodyOverscroll = document.body.style.overscrollBehavior;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Hard lock scrolling on both body and html elements
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    const containerEl = containerRef.current;
    const rootEl = rootRef.current;

    // Active non-passive wheel listener on wheel stage:
    // Calling e.preventDefault() here stops the window/page from scrolling while spinning cards
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stopMomentum();
      const delta = (e.deltaY || e.deltaX) * 0.05;
      applyRotation(rotationRef.current + delta);
      startMomentum(delta * 0.8);
    };

    // Non-passive touchmove listener to eliminate mobile pull-to-refresh or vertical document drag
    const handleNativeTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    // Global boundary trap on root modal to prevent any overscroll from reaching the background window
    const preventModalOverscroll = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    if (containerEl) {
      containerEl.addEventListener('wheel', handleNativeWheel, { passive: false });
      containerEl.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
    }

    if (rootEl) {
      rootEl.addEventListener('wheel', preventModalOverscroll, { passive: false });
      rootEl.addEventListener('touchmove', preventModalOverscroll, { passive: false });
    }

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.body.style.touchAction = origBodyTouchAction;
      document.body.style.overscrollBehavior = origBodyOverscroll;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.documentElement.style.overscrollBehavior = origHtmlOverscroll;

      if (containerEl) {
        containerEl.removeEventListener('wheel', handleNativeWheel);
        containerEl.removeEventListener('touchmove', handleNativeTouchMove);
      }
      if (rootEl) {
        rootEl.removeEventListener('wheel', preventModalOverscroll);
        rootEl.removeEventListener('touchmove', preventModalOverscroll);
      }

      // Restore scroll position cleanly
      window.scrollTo(0, savedScrollY);
    };
  }, [applyRotation, startMomentum, stopMomentum]);

  // Fast direct hit-test + O(1) candidate lookup with circular unwrapping
  const findTappedCard = useCallback(
    (clientX: number, clientY: number): TarotCard | null => {
      if (!containerRef.current || activeWheelCards.length === 0) return null;

      // 1. Instant direct DOM hit test
      try {
        const el = document.elementFromPoint(clientX, clientY);
        const cardEl = el?.closest('[data-card-id]');
        if (cardEl) {
          const cardId = cardEl.getAttribute('data-card-id');
          if (cardId) {
            const found = activeWheelCards.find((c) => c.id === cardId);
            if (found) return found;
          }
        }
      } catch (_) {}

      // 2. High-precision geometric fallback using cached wheel center (zero forced reflow)
      let centerX = wheelCenterRef.current.x;
      let centerY = wheelCenterRef.current.y;
      if (centerX === 0 && centerY === 0 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2 + yOffset;
        wheelCenterRef.current = { x: centerX, y: centerY };
      }
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const band = isMobile ? 260 : 360;

      // Ensure tap / hover is in the broad card ring band
      if (dist < Math.max(40, radius - band) || dist > radius + band) return null;

      const pointerAngle = Math.atan2(dy, dx);
      const rotationRad = (rotationRef.current * Math.PI) / 180;
      const currentRelativeAngle = pointerAngle - rotationRad;

      const total = deck.length || TOTAL_WHEEL_SLOTS;
      const { angleStep } = wheelLayout;

      // Normalize currentRelativeAngle to [0, 2*PI)
      let norm = currentRelativeAngle % (2 * Math.PI);
      if (norm < 0) norm += 2 * Math.PI;

      const centerIdx = Math.min(total - 1, Math.max(0, Math.round(norm / angleStep)));

      // The wheel has an intentional seam, so candidates do not wrap across its ends.
      const candidateIndices = Array.from({ length: 7 }, (_, offset) => centerIdx + offset - 3)
        .filter((idx) => idx >= 0 && idx < total);

      let bestCard: TarotCard | null = null;
      let bestDiff = Infinity;

      for (const idx of candidateIndices) {
        const card = deck[idx];
        if (!card || selectedIdSet.has(card.id)) continue;

        const cardAngle = idx * angleStep + (localGapOffsets[idx] || 0);
        const diff = Math.abs(norm - cardAngle);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestCard = card;
        }
      }

      return bestDiff < Math.max(0.12, angleStep * 1.5) ? bestCard : null;
    },
    [activeWheelCards, deck, isMobile, localGapOffsets, radius, selectedIdSet, wheelLayout, yOffset],
  );

  const handleSelect = useCallback(
    (cardToSelect: TarotCard) => {
      if (isFinishing || hasCompletedRef.current || selectedEntries.length >= maxCards) return;

      playAudioHaptic('card_draw');
      triggerTarotScreenVibration({ containerElement: rootRef.current, intensity: 'subtle' });

      setSelectedEntries((prev) => {
        if (prev.some((entry) => entry.card.id === cardToSelect.id) || prev.length >= maxCards) return prev;
        const isReversed = allowReversed ? rollTarotReversed() : false;
        const next = [...prev, { card: cardToSelect, reversed: isReversed }];
        if (next.length === maxCards) {
          if (hasCompletedRef.current) return next;
          hasCompletedRef.current = true;
          setIsFinishing(true);
          playAudioHaptic('save_success', { volume: 0.9 });
          window.setTimeout(() => {
            onComplete(
              next.map((entry) => ({
                ...entry.card,
                reversed: entry.reversed,
              })),
              null,
            );
          }, 950);
        }
        return next;
      });
    },
    [allowReversed, isFinishing, maxCards, onComplete, selectedEntries.length],
  );

  // Quick Spin & Shuffle Controls (Strictly shuffles ONLY remaining unpicked cards)
  const handleQuickSpin = (direction: 'left' | 'right') => {
    playAudioHaptic('card_draw', { volume: 0.65 });
    stopMomentum();
    const impulse = direction === 'left' ? -6 : 6;
    startMomentum(impulse);
  };

  const handleShuffleDeck = () => {
    playAudioHaptic('card_shuffle');
    stopMomentum();
    setDeck((prevDeck) => shuffleArray(prevDeck));
    startMomentum((Math.random() - 0.5) * 12);
  };

  const handleAutoPick = () => {
    if (activeWheelCards.length === 0 || selectedEntries.length >= maxCards || isFinishing || hasCompletedRef.current) return;
    const randomCard = activeWheelCards[Math.floor(Math.random() * activeWheelCards.length)];
    if (randomCard) {
      handleSelect(randomCard);
    }
  };

  // High performance Pointer & Mobile Touch handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFinishing) return;
    stopMomentum();
    if (!containerRef.current) return;

    touchStartTimeRef.current = performance.now();

    // Direct card element identification under touch pointer & eager image preload
    const targetEl = e.target as HTMLElement | null;
    const cardEl = targetEl?.closest('[data-card-id]');
    const touchedId = cardEl?.getAttribute('data-card-id') || null;
    touchedCardIdRef.current = touchedId;
    if (touchedId) {
      const candidateCard = deck.find((c) => c.id === touchedId);
      if (candidateCard) {
        const url = getTarotCardImageUrl(candidateCard);
        if (url) {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
        }
      }
    }

    if (e.pointerType === 'touch') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 + yOffset;
    wheelCenterRef.current = { x: centerX, y: centerY };

    activePointerIdRef.current = e.pointerId;
    isDraggingRef.current = false;
    hadMovedRef.current = false;
    startPointerPosRef.current = { x: e.clientX, y: e.clientY };
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    lastAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFinishing) return;

    // Hover detection when mouse is moving without dragging (Desktop only, throttled to 48ms)
    if (activePointerIdRef.current === null) {
      if (e.pointerType !== 'touch' && !isMobile) {
        const now = performance.now();
        if (now - lastHoverCheckTimeRef.current < 48) return;
        lastHoverCheckTimeRef.current = now;
        const hovered = findTappedCard(e.clientX, e.clientY);
        const nextId = hovered?.id || null;
        if (nextId !== hoveredCardId) {
          setHoveredCardId(nextId);
        }
      }
      return;
    }

    if (activePointerIdRef.current !== e.pointerId) return;

    // During drag, remove any hover highlight
    if (hoveredCardId) {
      setHoveredCardId(null);
    }

    const moveDist = Math.hypot(
      e.clientX - startPointerPosRef.current.x,
      e.clientY - startPointerPosRef.current.y,
    );

    // Realistic touch drag threshold to prevent micro-jitter during taps from cancelling selection
    const dragThreshold = e.pointerType === 'touch' ? 12 : 7;

    if (!isDraggingRef.current && moveDist > dragThreshold) {
      isDraggingRef.current = true;
      hadMovedRef.current = true;
      touchedCardIdRef.current = null;
    }

    if (!isDraggingRef.current) return;

    // 🌟 Use cached center coordinates from pointerdown (ZERO getBoundingClientRect reflow during drag!)
    const { x: centerX, y: centerY } = wheelCenterRef.current;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    // Shortest arc unwrapped angular delta (prevents -PI to +PI snap glitches)
    let deltaAngle = currentAngle - lastAngleRef.current;
    while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
    while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

    const deltaDeg = deltaAngle * (180 / Math.PI);
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);

    // Instant direct GPU transform without state re-render or DOM reflow
    applyRotation(rotationRef.current + deltaDeg);

    // Calculate instantaneous velocity for smooth flick release
    const instantVelocity = (deltaDeg / dt) * 16.67; // Normalize to 60fps frame rate
    velocityRef.current = velocityRef.current * 0.4 + instantVelocity * 0.6;

    lastAngleRef.current = currentAngle;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;

    const wasDragging = isDraggingRef.current;
    const hadMoved = hadMovedRef.current;
    const elapsed = performance.now() - touchStartTimeRef.current;
    const totalDist = Math.hypot(
      e.clientX - startPointerPosRef.current.x,
      e.clientY - startPointerPosRef.current.y,
    );

    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    setHoveredCardId(null);

    if (containerRef.current) {
      containerRef.current.classList.remove('cursor-grabbing');
      containerRef.current.classList.add('cursor-grab');
      try {
        if (containerRef.current.hasPointerCapture(e.pointerId)) {
          containerRef.current.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
    }

    // Natural tap detection: if user tapped quickly (< 380ms) and within 18px radius, guarantee tap selection
    const isIntentionalTap = (!hadMoved && !wasDragging) || (elapsed < 380 && totalDist < 18);

    if (isIntentionalTap && !isFinishing) {
      let tapped: TarotCard | null = null;
      if (touchedCardIdRef.current) {
        tapped = activeWheelCards.find((c) => c.id === touchedCardIdRef.current) || null;
      }
      if (!tapped) {
        tapped = findTappedCard(e.clientX, e.clientY);
      }

      if (tapped !== null) {
        handleSelect(tapped);
      }
    } else if (wasDragging) {
      // If user flicked with velocity, apply smooth momentum
      if (Math.abs(velocityRef.current) > 0.08) {
        startMomentum(velocityRef.current);
      }
    }
    touchedCardIdRef.current = null;
  };

  return (
    <div
      ref={rootRef}
      id="tarot-stage-container"
      className="fixed inset-0 z-[300] bg-zinc-950 overflow-hidden flex flex-col items-center justify-between font-sans select-none touch-none overscroll-none tarot-spread-stage-root"
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Top Floating Action Buttons (Card Back & Physical Input) */}
      <div
        className="absolute z-[320] flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 10px)',
          left: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        }}
      >
        <button
          type="button"
          onClick={() => setShowCardBackModal(true)}
          className="p-2 sm:px-3.5 sm:py-2 min-h-[38px] sm:min-h-[44px] rounded-full border border-yellow-500/40 bg-zinc-900 text-xs font-bold text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/70 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
          title="Quin 스타일 20종 타로 카드 뒷면 변경"
          aria-label="덱 뒷면 변경"
        >
          <Palette size={14} />
          <span className="hidden sm:inline">덱 뒷면 변경</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPhysicalInputModal(true)}
          className="p-2 sm:px-3.5 sm:py-2 min-h-[38px] sm:min-h-[44px] rounded-full border border-amber-500/40 bg-zinc-900 text-xs font-bold text-amber-200 hover:text-yellow-100 hover:border-amber-400 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
          title="소장하신 실물 카드로 직접 입력하여 AI 리딩 받기"
          aria-label="실물 카드 직접 입력"
        >
          <BookOpen size={14} />
          <span className="hidden sm:inline">실물 카드 직접 입력</span>
        </button>
      </div>

      {/* Top Floating Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="absolute z-[320] px-3.5 sm:px-4 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] rounded-full border border-yellow-500/40 bg-zinc-900 text-xs font-bold uppercase tracking-widest text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/60 active:scale-95 transition-transform flex items-center justify-center cursor-pointer pointer-events-auto"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 10px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
        }}
        aria-label="닫기"
      >
        닫기
      </button>

      {/* Main Interactive Stage (Zero 3D perspective & Zero backdrop-blur) */}
      <div
        ref={containerRef}
        className="flex-1 w-full relative flex items-center justify-center overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing overscroll-none"
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => setHoveredCardId(null)}
      >
        {/* 78-Card GPU Composited Wheel Layer - Flat 2D Single Hardware Composite Target */}
        <div
          ref={wheelLayerRef}
          className="absolute left-1/2 top-1/2 z-[30]"
          style={{
            transform: buildWheelTransform(rotationRef.current),
            willChange: 'transform',
            transformOrigin: 'center center',
            opacity: wheelReady ? 1 : 0,
          }}
        >
          {deck.map((card, originalIdx) => (
            <DeckWheelCard
              key={card.id}
              card={card}
              originalIdx={originalIdx}
              radius={radius}
              cardWidth={wheelCardWidth}
              gapAngleOffset={localGapOffsets[originalIdx] || 0}
              isMobile={isMobile}
              totalCards={deck.length}
              isPicked={selectedIdSet.has(card.id)}
              isHovered={hoveredCardId === card.id}
              cardBackId={effectiveCardBackId}
            />
          ))}
        </div>

        {/* Top Info Banner & Mobile Daily Guidance (Opaque surface, zero backdrop-blur) */}
        {isMobile && isDaily && selectedEntries.length === 0 ? (
          <div
            className="absolute left-0 right-0 z-[96] pointer-events-none flex flex-col items-center justify-center px-16 sm:px-24"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-yellow-500/40 text-yellow-300">
              <Sparkles size={13} className="text-yellow-400 shrink-0" />
              <span className="text-xs font-bold font-sans">오늘의 타로 · 1장 선택</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-200 font-mono font-bold">
                {activeWheelCards.length}장
              </span>
            </div>
            <p className="text-[11px] text-white/75 font-medium tracking-wide mt-1.5">
              덱을 좌우로 넘겨 오늘의 카드를 탭하세요
            </p>
          </div>
        ) : (
          (hasConcern || hasSpreadMeta) && (
            <div
              className="absolute left-0 right-0 z-[96] px-3 sm:px-4 pointer-events-none flex justify-center"
              style={{
                top: isMobile ? 'calc(env(safe-area-inset-top, 0px) + 3.0rem)' : 'calc(env(safe-area-inset-top, 0px) + 12px)',
                paddingRight: isMobile ? '12px' : 'calc(env(safe-area-inset-right, 0px) + 72px)',
                paddingLeft: isMobile ? '12px' : 'calc(env(safe-area-inset-left, 0px) + 16px)',
              }}
            >
              <div className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-yellow-500/25 bg-zinc-900 px-2.5 sm:px-3.5 py-1.5 sm:py-2 space-y-0.5 pointer-events-none">
                {hasSpreadMeta && (
                  <div className="text-center">
                    <p className="text-[10px] sm:text-sm font-bold text-yellow-200">
                      {spreadName} · {maxCards}장
                    </p>
                    {!isMobile && spreadReason && (
                      <p className="text-[9px] sm:text-[10px] text-white/50 leading-tight mt-0.5 line-clamp-1 break-keep">
                        {spreadReason}
                      </p>
                    )}
                  </div>
                )}
                {hasConcern && (
                  <div className={`text-center ${hasSpreadMeta ? 'border-t border-white/5 pt-0.5 sm:pt-1' : ''}`}>
                    <p className="text-[10px] sm:text-xs text-white/90 leading-tight line-clamp-1 break-keep">
                      {concernText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Selected card slots with a brief burst when a card is drawn. */}
        {(!isMobile || !isDaily || selectedEntries.length > 0) && (
          <div
            className="absolute flex flex-col items-center justify-center gap-1.5 sm:gap-4 md:gap-6 z-[95] pointer-events-none w-full px-2"
            style={{
              top: isMobile
                ? isDaily
                  ? 'calc(env(safe-area-inset-top, 0px) + 2.5rem)'
                  : hasConcern || hasSpreadMeta
                    ? 'calc(env(safe-area-inset-top, 0px) + 6.2rem)'
                    : 'calc(env(safe-area-inset-top, 0px) + 3.0rem)'
                : hasConcern || hasSpreadMeta
                  ? compactSlots
                    ? 'calc(env(safe-area-inset-top, 0px) + 9.5rem)'
                    : 'calc(env(safe-area-inset-top, 0px) + 8.5rem)'
                  : 'calc(env(safe-area-inset-top, 0px) + 4.5rem)',
            }}
          >
            <div className={slotsWrapClass}>
              {Array.from({ length: maxCards }).map((_, i) => {
                const entry = selectedEntries[i];
                const hasCard = entry !== undefined;
                const drawnCard = hasCard ? entry.card : null;
                const positionLabel = positions[i] || `Card ${i + 1}`;
                return (
                  <div
                    key={`slot-${i}`}
                    className={`${slotClass} bg-zinc-900 border border-yellow-500/30 rounded-xl md:rounded-2xl flex items-center justify-center relative`}
                  >
                    {!hasCard ? (
                      <div className="text-yellow-500/40 text-[7px] md:text-[9px] uppercase tracking-widest font-sans flex flex-col items-center gap-1 md:gap-1.5 px-1 text-center">
                        <div className="w-5 h-5 md:w-7 md:h-7 rounded-full border border-yellow-500/30 flex items-center justify-center bg-yellow-500/10">
                          <span className="text-yellow-500/70 text-[8px] md:text-[10px] font-serif font-black">
                            {i + 1}
                          </span>
                        </div>
                        <span className="font-bold tracking-wide leading-tight break-keep">{positionLabel}</span>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.52, rotateY: 160, y: 18 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 220,
                          damping: 16,
                          duration: 0.7,
                        }}
                        onClick={() => {
                          setZoomedCard({ card: { ...drawnCard!, reversed: entry.reversed }, slotName: positionLabel });
                        }}
                        className="absolute inset-0 pointer-events-auto border-2 border-yellow-400 bg-zinc-950 rounded-xl md:rounded-2xl flex flex-col justify-between p-1.5 sm:p-2 md:p-3 text-center overflow-hidden cursor-zoom-in group hover:border-yellow-300"
                        style={{ transformStyle: 'preserve-3d' }}
                        title={`${drawnCard!.nameKo} 카드 크게 보기`}
                      >
                        <motion.div
                          key={`draw-flash-${drawnCard!.id}`}
                          initial={{ opacity: 0.95, scale: 0.45 }}
                          animate={{ opacity: 0, scale: 1.9 }}
                          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-[-35%] z-20 rounded-full bg-[radial-gradient(circle,rgba(255,255,220,0.95)_0%,rgba(250,204,21,0.55)_18%,rgba(168,85,247,0.22)_42%,transparent_70%)] pointer-events-none"
                        />
                        <motion.div
                          key={`draw-sheen-${drawnCard!.id}`}
                          initial={{ x: '-150%', opacity: 0.9 }}
                          animate={{ x: '180%', opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
                          className="absolute inset-y-0 left-0 z-30 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center z-30 pointer-events-none">
                          <div className="w-6 h-6 rounded-full bg-yellow-500/90 text-black flex items-center justify-center">
                            <ZoomIn size={12} />
                          </div>
                        </div>
                        <img
                          src={getTarotCardImageUrl(drawnCard!)}
                          alt={drawnCard!.name}
                          loading="eager"
                          decoding="async"
                          style={{ transform: entry.reversed ? 'rotate(180deg)' : undefined, transformOrigin: 'center center' }}
                          className="absolute inset-0 w-full h-full object-cover z-0 rounded-xl md:rounded-2xl opacity-90"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 z-10 pointer-events-none rounded-xl md:rounded-2xl" />

                        <div className="flex justify-between items-center text-[6px] md:text-[7px] font-mono text-yellow-500/80 z-20 shrink-0">
                          <span>{entry.reversed ? 'REVERSED' : 'TRINITY'}</span>
                          <Sparkles size={6} className="text-yellow-400/80" />
                        </div>

                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 mx-auto rounded-full bg-black/70 border border-yellow-500/30 flex items-center justify-center text-yellow-400 z-20 shrink-0">
                          {React.createElement(getTarotCardVisual(drawnCard!).icon, {
                            size: isMobile ? 12 : 20,
                            className: getTarotCardVisual(drawnCard!).color,
                          })}
                        </div>

                        <div className="text-center z-20 flex flex-col gap-0.5 shrink-0 bg-black/85 py-0.5 sm:py-1 rounded-lg border border-yellow-500/20">
                          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-bold text-yellow-300 block leading-tight">
                            {drawnCard!.nameKo}
                          </span>
                          <span className="text-[5px] sm:text-[6px] md:text-[7px] font-mono text-white/50 uppercase tracking-widest block">
                            {entry.reversed ? '역방향' : drawnCard!.name}
                          </span>
                        </div>

                        <span className="text-[5px] sm:text-[6px] md:text-[7px] font-mono text-yellow-500/60 uppercase tracking-widest block z-20 shrink-0">
                          {drawnCard!.type}
                        </span>
                      </motion.div>
                    )}
                    {hasCard && (
                      <TarotCardFlipParticles
                        active
                        triggerKey={drawnCard!.id}
                        size="lg"
                        count={36}
                        className="z-[60]"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selection Instruction and Help */}
            {(!isMobile || !isDaily) && (
              <div className="text-center pointer-events-none flex flex-col items-center gap-1.5 px-4 w-full select-none">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold tracking-[0.15em] text-xs sm:text-[13px] md:text-sm font-sans">
                    {selectedEntries.length} / {maxCards} 카드를 선택하세요
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-mono font-bold">
                    남은 덱: {activeWheelCards.length}장
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Quick Control Bar (Opaque surface, zero backdrop-blur) */}
      <div
        className="relative z-[310] flex items-center justify-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 bg-zinc-950 border-t border-yellow-500/20 w-full touch-none select-none overscroll-none"
        style={{
          touchAction: 'none',
          overscrollBehavior: 'none',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)'
        }}
      >
        <button
          type="button"
          onClick={() => handleQuickSpin('left')}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-yellow-500/25 hover:border-yellow-400 text-yellow-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shrink-0"
          title="왼쪽으로 회전"
        >
          <ChevronLeft size={14} />
          <span className="hidden min-[380px]:inline">좌회전</span>
        </button>

        <button
          type="button"
          onClick={handleShuffleDeck}
          className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-yellow-500/40 hover:border-yellow-400 text-yellow-200 text-xs font-bold flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-transform cursor-pointer shrink"
          title={`현재 남은 ${activeWheelCards.length}장의 덱을 셔플합니다 (이미 뽑은 카드는 덱에 다시 들어가지 않습니다)`}
        >
          <Shuffle size={13} className="text-yellow-400 shrink-0" />
          <span className="truncate">셔플 ({activeWheelCards.length})</span>
        </button>

        <button
          type="button"
          onClick={handleAutoPick}
          disabled={selectedEntries.length >= maxCards}
          className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-yellow-500 text-zinc-950 font-bold text-xs flex items-center gap-1 sm:gap-1.5 hover:bg-yellow-400 active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
        >
          <Sparkles size={13} />
          <span className="whitespace-nowrap">자동 한 장</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickSpin('right')}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-yellow-500/25 hover:border-yellow-400 text-yellow-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shrink-0"
          title="오른쪽으로 회전"
        >
          <span className="hidden min-[380px]:inline">우회전</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Tarot Card Detail Zoom Modal */}
      <TarotCardZoomModal
        isOpen={!!zoomedCard}
        onClose={() => setZoomedCard(null)}
        card={zoomedCard?.card ?? null}
        slotName={zoomedCard?.slotName}
      />

      {/* Customizable Tarot Card Back Modal (Quin Style 20 Decks) */}
      <TarotCardBackCustomizerModal
        isOpen={showCardBackModal}
        onClose={() => setShowCardBackModal(false)}
      />

      {/* Physical Tarot Card Manual Input Modal */}
      <PhysicalTarotInputModal
        isOpen={showPhysicalInputModal}
        onClose={() => setShowPhysicalInputModal(false)}
        initialSpreadName={spreadName}
        initialPositions={positions}
        initialConcern={concern}
        onComplete={(cards) => {
          setShowPhysicalInputModal(false);
          onComplete(cards);
        }}
      />
    </div>
  );
};
