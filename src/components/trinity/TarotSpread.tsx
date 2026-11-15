import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { motion, useReducedMotion } from 'framer-motion';
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
import { LANDSCAPE_ARC_TOP, landscapeFanMetrics, placeRingCards, portraitFanMetrics } from './tarotRingLayout';

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

/** Local angle that sits at the top of the screen for a given wheel rotation. */
function frontLocalAngle(rotationDeg: number): number {
  let front = (-Math.PI / 2 - (rotationDeg * Math.PI) / 180) % (2 * Math.PI);
  if (front < 0) front += 2 * Math.PI;
  return front;
}

function compactSlotLabel(label: string, index: number): string {
  const named = label.match(/년주|월주|일주|시주/);
  if (named) return named[0];
  const stripped = label.replace(/^\s*\d+\s*[.·]\s*/, '').split(/[([]/)[0].trim();
  return stripped || String(index + 1);
}

/**
 * Stack by distance from the card at the front of the ring.
 * Index order puts every card on the right under its neighbor (a smear) and every
 * card on the left on top of its neighbor. Distance-from-front is symmetric, so
 * both sides show the same overlap while the ring rotates.
 */
function stackZForAngle(localAngle: number, frontAngle: number): number {
  const delta = Math.atan2(Math.sin(localAngle - frontAngle), Math.cos(localAngle - frontAngle));
  return 3000 - Math.round(Math.abs(delta) * 400);
}

type DeckWheelCardProps = {
  card: TarotCard;
  radius: number;
  localAngle: number;
  isMobile: boolean;
  isPicked: boolean;
  isHovered: boolean;
  stackZ: number;
  cardBackId?: string;
};

// Fixed slot on the circle. Overlap is even because z-order follows distance from the front, not deck index.
const DeckWheelCard = React.memo(
  function DeckWheelCard({
    card,
    radius,
    localAngle,
    isMobile,
    isPicked = false,
    isHovered = false,
    stackZ,
    cardBackId,
  }: DeckWheelCardProps) {
    const liftAmount = isHovered ? (isMobile ? 14 : 20) : 0;
    const cardRotate = Math.round(((localAngle * 180) / Math.PI + 90) * 10) / 10;
    const x = Math.round(radius * Math.cos(localAngle) * 10) / 10;
    const y = Math.round(radius * Math.sin(localAngle) * 10) / 10;
    const baseTransform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) rotate(${cardRotate}deg)`;
    const innerTransform = `translate3d(0, ${-liftAmount}px, 0) scale(${isHovered ? 1.035 : 1})`;

    return (
      <>
        <div
          data-card-id={isPicked ? undefined : card.id}
          data-card-local-angle={localAngle}
          className={`absolute left-1/2 top-1/2 w-16 h-28 sm:w-20 sm:h-34 md:w-24 md:h-40 rounded-lg sm:rounded-xl flex items-center justify-center select-none ${
            isPicked
              ? 'pointer-events-none'
              : isHovered
              ? 'pointer-events-auto cursor-pointer'
              : 'pointer-events-auto cursor-pointer'
          }`}
          style={{
            transform: baseTransform,
            transformOrigin: 'center center',
            transition: 'transform 680ms cubic-bezier(0.22, 1, 0.36, 1)',
            zIndex: isHovered ? 5000 : stackZ,
            opacity: isPicked ? 0 : 1,
            visibility: isPicked ? 'hidden' : 'visible',
          }}
        >
          {!isPicked && (
            <div
              className="relative w-full h-full rounded-lg sm:rounded-xl pointer-events-none"
              style={{
                transform: innerTransform,
                transition: 'transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: isHovered ? 'transform' : undefined,
              }}
            >
              <TarotCardBackFace
                cardBackId={cardBackId}
                size={isMobile ? 'sm' : 'wheel'}
                isHovered={isHovered}
              />
            </div>
          )}
        </div>
      </>
    );
  },
  (prev, next) => {
    return (
      prev.card.id === next.card.id &&
      prev.cardBackId === next.cardBackId &&
      prev.localAngle === next.localAngle &&
      prev.radius === next.radius &&
      prev.isMobile === next.isMobile &&
      prev.isPicked === next.isPicked &&
      prev.isHovered === next.isHovered &&
      prev.stackZ === next.stackZ
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
  const [isLandscapeLayout, setIsLandscapeLayout] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > window.innerHeight,
  );

  const compactSlots = maxCards >= 4 || isMobile;
  const slotClass = isMobile
    ? compactSlots
      ? 'w-12 h-18 sm:w-14 sm:h-21'
      : 'w-15 h-23 sm:w-18 sm:h-28'
    : compactSlots
      ? 'w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36'
      : 'w-22 h-34 md:w-30 md:h-46';
  const slotsWrapClass = isMobile
    ? 'flex w-full max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2'
    : compactSlots
      ? 'flex w-full max-w-full flex-wrap items-end justify-center gap-2 sm:gap-3'
      : 'flex w-full max-w-full items-center justify-center gap-4 md:gap-6';

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
  const [shuffleStatus, setShuffleStatus] = useState<'shuffling' | 'done' | null>(null);
  const reduceMotion = useReducedMotion();
  const shufflePointerRef = useRef<number | null>(null);

  useEffect(() => {
    if (shuffleStatus !== 'done') return;
    const timer = window.setTimeout(() => setShuffleStatus(null), 900);
    return () => window.clearTimeout(timer);
  }, [shuffleStatus]);
  const hasCompletedRef = useRef(false);
  const touchedCardIdRef = useRef<string | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const [radius, setRadius] = useState(600);
  const [yOffset, setYOffset] = useState(580);

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

  // Drawn cards leave the ring; the rest keep their order and slide into even spacing.
  const ringAngles = useMemo(
    () => placeRingCards(deck.map((card) => card.id), selectedIdSet),
    [deck, selectedIdSet],
  );
  const ringAnglesRef = useRef(ringAngles);
  ringAnglesRef.current = ringAngles;
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const hoveredCardIdRef = useRef<string | null>(null);
  const [centerCardId, setCenterCardId] = useState<string | null>(null);
  const centerCardIdRef = useRef<string | null>(null);
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
  const rotationRef = useRef(270);
  const hadMovedRef = useRef(false);
  const momentumRafRef = useRef<number | null>(null);

  const wheelCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastHoverCheckTimeRef = useRef<number>(0);

  // Exclusive target highlight: when hovering a card, only the hovered card is highlighted (center card effect disappears);
  // when not hovering, the screen-center top card is highlighted.
  const activeHighlightCardId = hoveredCardId ?? centerCardId;

  // Compute which unpicked card is currently closest to the screen center apex (-90 deg / -PI/2 rad)
  const updateCenterCardForRotation = useCallback(
    (deg: number) => {
      const total = deck.length;
      if (total === 0) {
        if (centerCardIdRef.current !== null) {
          centerCardIdRef.current = null;
          setCenterCardId(null);
        }
        return;
      }

      const rotationRad = (deg * Math.PI) / 180;
      let targetAngle = (-Math.PI / 2 - rotationRad) % (2 * Math.PI);
      if (targetAngle < 0) targetAngle += 2 * Math.PI;

      let bestId: string | null = null;
      let bestDiff = Infinity;
      const angles = ringAnglesRef.current;

      for (let i = 0; i < total; i++) {
        const card = deck[i];
        if (!card || selectedIdSet.has(card.id)) continue;
        const cardAngle = angles[i] ?? 0;
        const diff = Math.abs(Math.atan2(Math.sin(cardAngle - targetAngle), Math.cos(cardAngle - targetAngle)));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestId = card.id;
        }
      }

      if (bestId !== centerCardIdRef.current) {
        centerCardIdRef.current = bestId;
        setCenterCardId(bestId);
      }
    },
    [deck, selectedIdSet],
  );

  const buildWheelTransform = useCallback(
    (deg: number) => `translate3d(-50%, calc(-50% + ${yOffset}px), 0) rotate(${deg}deg)`,
    [yOffset],
  );

  // 🌟 Zero-Reflow O(1) GPU Wheel Rotation:
  // 부모 휠 레이어의 단일 transform만 변경하며, 중앙 카드 ID가 바뀔 때만 최소한의 상태 갱신을 수행합니다.
  const syncRingStack = useCallback((deg: number) => {
    const layer = wheelLayerRef.current;
    if (!layer) return;
    const front = frontLocalAngle(deg);
    const hovered = hoveredCardIdRef.current;
    layer.querySelectorAll<HTMLElement>('[data-card-local-angle]').forEach((el) => {
      const id = el.getAttribute('data-card-id');
      if (id && id === hovered) {
        el.style.zIndex = '5000';
        return;
      }
      const localAngle = Number(el.getAttribute('data-card-local-angle'));
      if (!Number.isFinite(localAngle)) return;
      el.style.zIndex = String(stackZForAngle(localAngle, front));
    });
  }, []);

  const applyRotation = useCallback(
    (deg: number) => {
      rotationRef.current = deg;
      if (wheelLayerRef.current) {
        wheelLayerRef.current.style.transform = buildWheelTransform(deg);
      }
      syncRingStack(deg);
      updateCenterCardForRotation(deg);
    },
    [buildWheelTransform, syncRingStack, updateCenterCardForRotation],
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
      const bounds = containerRef.current?.getBoundingClientRect();
      const w = bounds?.width || window.innerWidth;
      const h = bounds?.height || window.innerHeight;
      const isLandscape = w > h;
      setIsLandscapeLayout(isLandscape);

      if (isLandscape) {
        const fan = landscapeFanMetrics(h, LANDSCAPE_ARC_TOP);
        setRadius(fan.radius);
        setYOffset(fan.yOffset);
        setIsMobile(w < 700);
      } else {
        // Tall pane (phone, or one half of an unfolded / iPad split). The old
        // fixed radius left the arc in the middle and a black band above the buttons.
        const slot = containerRef.current?.querySelector('[data-tarot-slots]');
        const cardHalf = w >= 768 ? 84 : w >= 540 ? 72 : 58;
        const lift = w >= 768 ? 22 : 16;
        let arcTop = (w < 540 ? 230 : w < 768 ? 280 : 320) + cardHalf;
        if (slot && bounds) {
          const slotBox = slot.getBoundingClientRect();
          arcTop = Math.round(slotBox.bottom - bounds.top + cardHalf + lift);
        }
        const fan = portraitFanMetrics(w, h, arcTop);
        setRadius(fan.radius);
        setYOffset(fan.yOffset);
        setIsMobile(w < 768);
      }
    };

    updateRadius();
    const onResize = () => {
      if (!isDraggingRef.current) {
        updateRadius();
      }
    };
    window.addEventListener('resize', onResize);
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) observer.observe(containerRef.current);
    const timer = window.setTimeout(() => {
      updateRadius();
      setWheelReady(true);
    }, 50);

    return () => {
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      window.clearTimeout(timer);
      stopMomentum();
    };
  }, [stopMomentum]);

  // Synchronize initial wheel position & recalculate center card when deck or picked cards change.
  // After a draw, restack against the new even angles so the closing motion stays symmetric.
  useEffect(() => {
    hoveredCardIdRef.current = hoveredCardId;
    if (wheelReady) {
      applyRotation(rotationRef.current);
    } else {
      updateCenterCardForRotation(rotationRef.current);
      syncRingStack(rotationRef.current);
    }
  }, [wheelReady, hoveredCardId, selectedIds, deck, applyRotation, updateCenterCardForRotation, syncRingStack]);

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
      const angles = ringAnglesRef.current;
      const neighbor = total > 1 ? (2 * Math.PI) / Math.max(1, total - selectedIdSet.size) : Math.PI;

      // Normalize currentRelativeAngle to [0, 2*PI)
      let norm = currentRelativeAngle % (2 * Math.PI);
      if (norm < 0) norm += 2 * Math.PI;

      let bestCard: TarotCard | null = null;
      let bestDiff = Infinity;

      for (let idx = 0; idx < deck.length; idx++) {
        const card = deck[idx];
        if (!card || selectedIdSet.has(card.id)) continue;
        const cardAngle = angles[idx] ?? 0;
        const diff = Math.abs(Math.atan2(Math.sin(norm - cardAngle), Math.cos(norm - cardAngle)));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestCard = card;
        }
      }

      return bestDiff < Math.max(0.12, neighbor * 1.5) ? bestCard : null;
    },
    [activeWheelCards, deck, isMobile, radius, selectedIdSet, yOffset],
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
    // The arrow points toward the cards to bring into the visible top of the wheel.
    const impulse = direction === 'left' ? 6 : -6;
    startMomentum(impulse);
  };

  const handleShuffleDeck = () => {
    if (activeWheelCards.length < 2) {
      setShuffleStatus(null);
      return;
    }
    setShuffleStatus('done');
    setDeck((prevDeck) => {
      const remaining = shuffleArray(prevDeck.filter((card) => !selectedIdSet.has(card.id)));
      let next = 0;
      return prevDeck.map((card) => selectedIdSet.has(card.id) ? card : remaining[next++]);
    });
  };

  const handleShufflePress = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0 || shufflePointerRef.current !== null || activeWheelCards.length < 2) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    shufflePointerRef.current = event.pointerId;
    playAudioHaptic('card_shuffle');
    stopMomentum();
    setShuffleStatus('shuffling');
  };

  const endShufflePress = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (shufflePointerRef.current !== event.pointerId) return;
    shufflePointerRef.current = null;
    if (event.type === 'pointerup') handleShuffleDeck();
    else setShuffleStatus(null);
  };

  const handleAutoPick = () => {
    if (activeWheelCards.length === 0 || selectedEntries.length >= maxCards || isFinishing || hasCompletedRef.current) return;
    const highlightedCard = activeHighlightCardId
      ? activeWheelCards.find((card) => card.id === activeHighlightCardId)
      : undefined;
    const targetCard = highlightedCard || activeWheelCards[Math.floor(Math.random() * activeWheelCards.length)];
    if (targetCard) {
      handleSelect(targetCard);
    }
  };

  // High performance Pointer & Mobile Touch handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shufflePointerRef.current !== null) return;
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

    // During drag, remove any hover highlight so the center card naturally tracks the wheel
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
    <ScreenPortal>
    <div
      ref={rootRef}
      id="tarot-stage-container"
      className="fixed inset-0 z-[300] bg-zinc-950 overflow-hidden flex flex-col items-center justify-between font-sans select-none touch-none overscroll-none tarot-spread-stage-root"
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Unified Top Header Layer: Action Buttons & Perfectly Centered Info Banner */}
      <div
        className="absolute top-0 left-0 right-0 z-[320] w-full pointer-events-none flex flex-col items-center"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6px)',
          paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 12px)',
          paddingRight: 'calc(env(safe-area-inset-right, 0px) + 12px)',
        }}
      >
        {/* Top Controls Row: Left Action Buttons & Right Close Button */}
        <div className="w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowCardBackModal(true)}
              className="p-2 sm:px-3.5 sm:py-2 min-h-[38px] sm:min-h-[44px] rounded-full border border-yellow-500/40 bg-zinc-900/95 text-xs font-bold text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/70 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-md"
              title="타로 카드 뒷면 컬렉션 변경"
              aria-label="덱 뒷면 변경"
            >
              <Palette size={14} />
              <span className="hidden sm:inline">덱 뒷면 변경</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPhysicalInputModal(true)}
              className="p-2 sm:px-3.5 sm:py-2 min-h-[38px] sm:min-h-[44px] rounded-full border border-amber-500/40 bg-zinc-900/95 text-xs font-bold text-amber-200 hover:text-yellow-100 hover:border-amber-400 active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-md"
              title="소장하신 실물 카드로 직접 입력하여 AI 리딩 받기"
              aria-label="실물 카드 직접 입력"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">실물 카드 직접 입력</span>
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] rounded-full border border-yellow-500/40 bg-zinc-900/95 text-xs font-bold uppercase tracking-widest text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/60 active:scale-95 transition-transform flex items-center justify-center cursor-pointer pointer-events-auto shrink-0 shadow-lg backdrop-blur-md"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        {/* Top Info Banner (Always centered horizontally, never overlaps with action buttons) */}
        {(hasConcern || hasSpreadMeta) && (
          <div className="w-full flex justify-center mt-2 px-2 pointer-events-none">
            <div className="w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl border border-yellow-500/25 bg-zinc-900/95 px-3 py-1.5 sm:py-2 space-y-0.5 pointer-events-none shadow-xl backdrop-blur-md">
              {hasSpreadMeta && (
                <div className="text-center">
                  <p className="text-[11px] sm:text-sm font-bold text-yellow-200">
                    {spreadName} · {maxCards}장
                  </p>
                  {spreadReason && (
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
        )}
      </div>

      {isLandscapeLayout && (
        <div
          className="relative z-[120] shrink-0 w-full px-3 pb-1.5 pointer-events-none"
          style={{
            paddingTop: hasConcern || hasSpreadMeta
              ? 'calc(env(safe-area-inset-top, 0px) + 6.75rem)'
              : 'calc(env(safe-area-inset-top, 0px) + 3.1rem)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
              {Array.from({ length: maxCards }).map((_, i) => {
                const entry = selectedEntries[i];
                const fullLabel = positions[i] || `Card ${i + 1}`;
                const shortLabel = compactSlotLabel(fullLabel, i);
                return (
                  <div
                    key={`land-slot-${i}`}
                    title={entry ? `${fullLabel} · ${entry.card.nameKo}` : fullLabel}
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-yellow-500/40 bg-zinc-950 px-2.5"
                  >
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500/20 px-1 text-xs font-black leading-none text-yellow-100">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold leading-none text-yellow-50">{shortLabel}</span>
                    {entry && (
                      <button
                        type="button"
                        onClick={() => {
                          setZoomedCard({ card: { ...entry.card, reversed: entry.reversed }, slotName: fullLabel });
                        }}
                        className="pointer-events-auto max-w-[7rem] truncate text-xs font-semibold text-yellow-300"
                      >
                        {entry.card.nameKo}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="shrink-0 text-xs font-bold text-yellow-200">
              {selectedEntries.length}/{maxCards}
            </span>
          </div>
        </div>
      )}

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
          data-fan-radius={radius}
          data-fan-y-offset={yOffset}
          style={{
            transform: buildWheelTransform(rotationRef.current),
            willChange: 'transform',
            transformOrigin: 'center center',
            opacity: wheelReady ? 1 : 0,
          }}
        >
          {deck.map((card, originalIdx) => {
            const localAngle = ringAngles[originalIdx] ?? 0;
            const isHovered = activeHighlightCardId === card.id;
            return (
            <DeckWheelCard
              key={card.id}
              card={card}
              radius={radius}
              localAngle={localAngle}
              isMobile={isMobile}
              isPicked={selectedIdSet.has(card.id)}
              isHovered={isHovered}
              stackZ={stackZForAngle(localAngle, frontLocalAngle(rotationRef.current))}
              cardBackId={effectiveCardBackId}
            />
            );
          })}
        </div>


        {shuffleStatus && (
          <div className="pointer-events-none absolute inset-0 z-[110] grid place-items-center">
            {shuffleStatus === 'shuffling' && !reduceMotion && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#21152bf2_0%,#090811d9_45%,transparent_75%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.16 }}
              >
                <div className="relative h-32 w-20" style={{ perspective: 600 }}>
                  {Array.from({ length: 8 }, (_, index) => {
                    const side = index % 2 === 0 ? -1 : 1;
                    const layer = Math.floor(index / 2);
                    const lift = layer * 3;

                    return (
                      <motion.div
                        key={index}
                        className="absolute inset-0 origin-bottom rounded-xl shadow-[0_8px_20px_#0009]"
                        initial={{ x: 0, y: 30 - lift, rotateZ: 0, rotateY: 0, scale: 0.84 }}
                        animate={{
                          x: [0, side * (58 + lift), side * 26, side * 7, 0, 0],
                          y: [30 - lift, -lift, -18 - lift, -8 - lift, -lift, 34 - lift],
                          rotateZ: [0, side * 17, side * 9, -side * 4, 0, 0],
                          rotateY: [0, -side * 24, -side * 12, 0, 0, 0],
                          scale: [0.84, 1, 1, 1, 1, 0.84],
                        }}
                        transition={{
                          duration: 0.94,
                          repeat: Infinity,
                          delay: index * 0.013,
                          times: [0, 0.25, 0.46, 0.63, 0.82, 1],
                          ease: 'easeInOut',
                        }}
                      >
                        <TarotCardBackFace cardBackId={effectiveCardBackId} size="sm" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            <div role="status" className="absolute inset-x-0 top-[calc(50%+5rem)] text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-zinc-950/95 px-3 py-1.5 text-xs font-semibold text-yellow-200 shadow-lg">
                {shuffleStatus === 'done' && <Sparkles size={12} aria-hidden="true" />}
                {shuffleStatus === 'shuffling' ? '카드 섞는 중…' : '셔플 완료'}
              </span>
            </div>
          </div>
        )}

        {/* Selected card slots with a brief burst when a card is drawn. */}
        {!isLandscapeLayout && (
        <div
          data-tarot-slots
          className="absolute z-[95] pointer-events-none flex w-full flex-col items-center justify-center gap-1.5 px-2 sm:gap-4 md:gap-6"
          style={{
            top: isMobile
                ? hasConcern || hasSpreadMeta
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
        </div>
        )}
      </div>

      {/* Bottom Quick Control Bar (Opaque surface, zero backdrop-blur) */}
      <div
        data-tarot-controls
        className="relative z-[320] isolate box-border flex w-full min-w-0 max-w-full items-center justify-center gap-1.5 px-2 py-2 bg-zinc-950 border-t border-yellow-500/20 touch-none select-none overscroll-none"
        style={{
          touchAction: 'none',
          overscrollBehavior: 'none',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)'
        }}
      >
        <button
          type="button"
          onClick={() => handleQuickSpin('left')}
          className="min-w-0 flex-1 basis-0 max-w-[8.5rem] px-2 py-1.5 rounded-lg bg-zinc-900 border border-yellow-500/25 hover:border-yellow-400 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title="왼쪽 카드들을 가운데로 이동"
        >
          <ChevronLeft size={14} className="shrink-0" />
          <span className="truncate">좌회전</span>
        </button>

        <button
          type="button"
          onPointerDown={handleShufflePress}
          onPointerUp={endShufflePress}
          onPointerCancel={endShufflePress}
          onLostPointerCapture={endShufflePress}
          onClick={(event) => {
            if (event.detail !== 0 || shufflePointerRef.current !== null) return;
            playAudioHaptic('card_shuffle');
            stopMomentum();
            handleShuffleDeck();
          }}
          disabled={activeWheelCards.length < 2}
          className="min-w-0 flex-1 basis-0 max-w-[8.5rem] px-2 py-1.5 rounded-lg bg-zinc-900 border border-yellow-500/40 hover:border-yellow-400 text-yellow-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title={`현재 남은 ${activeWheelCards.length}장의 덱을 셔플합니다 (이미 뽑은 카드는 덱에 다시 들어가지 않습니다)`}
        >
          <Shuffle size={13} className="text-yellow-400 shrink-0" />
          <span className="truncate">{shuffleStatus === 'shuffling' ? '섞는 중…' : '셔플 (' + activeWheelCards.length + ')'}</span>
        </button>

        <button
          type="button"
          onClick={handleAutoPick}
          disabled={shuffleStatus === 'shuffling' || selectedEntries.length >= maxCards}
          className="min-w-0 flex-1 basis-0 max-w-[8.5rem] px-2 py-1.5 rounded-lg bg-yellow-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1 hover:bg-yellow-400 active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Sparkles size={13} className="shrink-0" />
          <span className="truncate">자동 한 장</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickSpin('right')}
          className="min-w-0 flex-1 basis-0 max-w-[8.5rem] px-2 py-1.5 rounded-lg bg-zinc-900 border border-yellow-500/25 hover:border-yellow-400 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title="오른쪽 카드들을 가운데로 이동"
        >
          <span className="truncate">우회전</span>
          <ChevronRight size={14} className="shrink-0" />
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
    </ScreenPortal>
  );
};
