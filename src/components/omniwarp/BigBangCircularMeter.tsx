import React, { useId, useCallback, useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Menu, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WarpPhase } from '@/lib/omniWarp/types';
import { resetAppScroll, resetAppScrollToBottom } from '@/utils/scrollToTop';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

// 12방위 외곽 룬 문자 각인 (Elder Futhark) - 아케인 서클 미세 글리프 유지
const OUTER_MINI_RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

interface BigBangCircularMeterProps {
  /** 사용자가 누르고 있는지 여부 */
  isPressing: boolean;
  /** 마우스 호버 여부 */
  isHovered?: boolean;
  /** 실시간 가상 압력 (0.0 ~ 1.0) */
  gauge?: number;
  /** 누르고 있는 시간 (ms) */
  durationMs?: number;
  /** 현재 감지된 워프 위상 */
  activePhase?: WarpPhase;
  /** 취소(어보트) 대기 상태 */
  isAborted?: boolean;
  /** 무한 반복 대기 사이클 타이밍 값 (선택적) */
  idleCycleProgress?: number;
  /** 고대 룬 클릭 시 네비게이션 콜백 (선택적) */
  onRuneNavigate?: (path: string, runeId: string) => void;
  /** 🌌 더블탭 시 고대 룬 문자 사이로 우주로 빨려들어가는 하이퍼스페이스 애니메이션 상태 */
  isCosmicSuction?: boolean;
}

/**
 * 🔮 빅뱅 아케인 마법진 매트릭스 (BigBang Arcane Magic Circle)
 * - 현대적이고 신비로운 대형 코스믹 아케인 서클 시스템
 * - 직경 144px로 확대되어 76~84px 크기의 코스믹 옵시디언 버튼을 웅장하고 유려하게 감쌈
 * - 4방위 고정 금빛 아이콘: 상(최상단 스크롤 쉐브론), 하(최하단 스크롤 쉐브론), 좌(3선 메뉴), 우(음표 배경음 컨트롤)
 * - 더블탭/드래그 시: 시공간이 수렴하며 우주 심연으로 빨려들어가는 하이퍼스페이스 흡입 연출
 */
export const BigBangCircularMeter = React.memo(function BigBangCircularMeter({
  isPressing,
  isHovered = false,
  gauge = 0,
  durationMs = 0,
  activePhase = 'idle',
  isAborted = false,
  onRuneNavigate,
  isCosmicSuction = false,
}: BigBangCircularMeterProps) {
  const gradientId = useId();
  const meterRootRef = useRef<HTMLDivElement | null>(null);

  // 🔮 4방위 점 탭 시 룬문자 임플로전(Implosion) 발광 펄스 상태 관리
  const [implodingDotId, setImplodingDotId] = useState<string | null>(null);

  const triggerDotPulse = useCallback((dotId: string) => {
    setImplodingDotId(dotId);
    setTimeout(() => {
      setImplodingDotId((current) => (current === dotId ? null : current));
    }, 240);
  }, []);

  // 🚀 상단(North) 점 탭 시 화면/대화창 최상단 부드러운 스크롤 이동
  const handleScrollToTop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerDotPulse('north');

    try {
      playAudioHaptic('tap_impact');
    } catch (_) {}
    try {
      triggerHaptic('wormhole');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }

    resetAppScroll('smooth');
    window.dispatchEvent(new CustomEvent('prism:scroll_to_top'));
  }, [triggerDotPulse]);

  // 🚀 하단(South) 점 탭 시 화면/대화창 최하단 부드러운 스크롤 이동
  const handleScrollToBottom = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerDotPulse('south');

    try {
      playAudioHaptic('tap_impact');
    } catch (_) {}
    try {
      triggerHaptic('wormhole');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }

    resetAppScrollToBottom('smooth');
    window.dispatchEvent(new CustomEvent('prism:scroll_to_bottom'));
  }, [triggerDotPulse]);

  // 🚀 좌(West) 점 탭 시 사이드 네비게이션 메뉴 열기/토글
  const handleMenuClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerDotPulse('west');

    try {
      playAudioHaptic('tap_impact');
    } catch (_) {}
    try {
      triggerHaptic('wormhole');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('prism:toggle_menu'));
  }, [triggerDotPulse]);

  // 🎵 우(East) 점 배경음 상태 및 롱프레스(홀딩) 제어
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(() => {
    try {
      return localStorage.getItem('prism_bgm_playing') === 'true';
    } catch {
      return false;
    }
  });
  const [isBgmHolding, setIsBgmHolding] = useState(false);
  const bgmHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isBgmHoldTriggeredRef = useRef(false);
  const bgmHoldStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // 실시간 재생 상태 동기화
  useEffect(() => {
    const handleBgmState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying?: boolean }>;
      if (typeof customEvent.detail?.isPlaying === 'boolean') {
        setIsBgmPlaying(customEvent.detail.isPlaying);
      }
    };
    window.addEventListener('prism:bgm_state_change', handleBgmState);
    return () => {
      window.removeEventListener('prism:bgm_state_change', handleBgmState);
    };
  }, []);

  const handleBgmPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();
    isBgmHoldTriggeredRef.current = false;
    bgmHoldStartPosRef.current = { x: e.clientX, y: e.clientY };
    setIsBgmHolding(true);

    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
    }

    bgmHoldTimerRef.current = setTimeout(() => {
      isBgmHoldTriggeredRef.current = true;
      setIsBgmHolding(false);
      bgmHoldTimerRef.current = null;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch (_) {}
      }
      try {
        playAudioHaptic('success');
      } catch (_) {}
      window.dispatchEvent(new CustomEvent('prism:open_bgm_menu'));
    }, 400);
  }, []);

  const handleBgmPointerMove = useCallback((e: React.PointerEvent) => {
    if (!bgmHoldStartPosRef.current || !bgmHoldTimerRef.current) return;
    const dx = Math.abs(e.clientX - bgmHoldStartPosRef.current.x);
    const dy = Math.abs(e.clientY - bgmHoldStartPosRef.current.y);
    if (dx > 10 || dy > 10) {
      if (bgmHoldTimerRef.current) {
        clearTimeout(bgmHoldTimerRef.current);
        bgmHoldTimerRef.current = null;
      }
      setIsBgmHolding(false);
    }
  }, []);

  const handleBgmPointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
      bgmHoldTimerRef.current = null;
    }
    setIsBgmHolding(false);
  }, []);

  const handleBgmClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBgmHoldTriggeredRef.current) {
      isBgmHoldTriggeredRef.current = false;
      return;
    }

    triggerDotPulse('east');

    try {
      playAudioHaptic('tap_impact');
    } catch (_) {}
    try {
      triggerHaptic('wormhole');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('prism:toggle_bgm'));
  }, [triggerDotPulse]);

  const handleBgmContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
      bgmHoldTimerRef.current = null;
    }
    setIsBgmHolding(false);
    window.dispatchEvent(new CustomEvent('prism:toggle_bgm_menu'));
  }, []);

  const handleBgmDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
      bgmHoldTimerRef.current = null;
    }
    setIsBgmHolding(false);
    window.dispatchEvent(new CustomEvent('prism:next_bgm_track'));
  }, []);

  // 마우스 호버 해제 또는 다른 곳 클릭/터치 시 4방위 버튼 효과 및 홀딩 상태 즉시 해제
  useEffect(() => {
    if (!isHovered && !isPressing) {
      setImplodingDotId(null);
      setIsBgmHolding(false);
      if (bgmHoldTimerRef.current) {
        clearTimeout(bgmHoldTimerRef.current);
        bgmHoldTimerRef.current = null;
      }
    }
  }, [isHovered, isPressing]);

  useEffect(() => {
    const handleOutsideInteraction = (e: Event) => {
      const target = e.target as Node | null;
      if (meterRootRef.current && target && !meterRootRef.current.contains(target)) {
        setImplodingDotId(null);
        setIsBgmHolding(false);
        if (bgmHoldTimerRef.current) {
          clearTimeout(bgmHoldTimerRef.current);
          bgmHoldTimerRef.current = null;
        }
        if (document.activeElement && meterRootRef.current.contains(document.activeElement)) {
          (document.activeElement as HTMLElement).blur?.();
        }
      }
    };
    window.addEventListener('pointerdown', handleOutsideInteraction, { passive: true });
    window.addEventListener('mousedown', handleOutsideInteraction, { passive: true });
    window.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleOutsideInteraction);
      window.removeEventListener('mousedown', handleOutsideInteraction);
      window.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, []);

  // 대형화된 버튼(76~84px) 외곽을 웅장하고 신비롭게 감싸는 최적의 마법진 직경 (144px)
  const size = 144;
  const center = size / 2; // 72px
  const rArc = 58;
  const circumferenceArc = 2 * Math.PI * rArc;

  return (
    <div
      ref={meterRootRef}
      className="relative flex items-center justify-center pointer-events-none select-none shrink-0 transition-transform duration-300 will-change-transform"
      style={{
        width: size,
        height: size,
        transform: isPressing ? 'scale(1.12)' : isHovered ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {/* 🌟 1. 마법진 앰비언트 글로우 오라 (호버 시 찬란하게 증폭되는 성운 플레어) */}
      <div
        className="absolute -inset-1 rounded-full pointer-events-none transition-all duration-500 blur-[10px]"
        style={{
          background: isPressing
            ? activePhase === 'whitehole'
              ? 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(254,240,138,0.5) 45%, transparent 75%)'
              : activePhase === 'mirrorhole'
              ? 'radial-gradient(circle, rgba(224,242,254,0.7) 0%, rgba(186,230,253,0.5) 45%, transparent 75%)'
              : activePhase === 'blackhole'
              ? 'radial-gradient(circle, rgba(88,28,135,0.6) 0%, rgba(0,0,0,0.8) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(0,240,255,0.45) 0%, rgba(168,85,247,0.4) 50%, transparent 75%)'
            : isHovered
            ? 'radial-gradient(circle, rgba(0,240,255,0.38) 0%, rgba(192,132,252,0.32) 45%, rgba(251,191,36,0.25) 65%, transparent 80%)'
            : 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, rgba(168,85,247,0.18) 45%, transparent 75%)',
          opacity: isPressing ? 1 : isHovered ? 0.95 : 0.7,
        }}
      />

      {/* 🌟 2. 정밀 아케인 SVG 벡터 마법진 베이스 & 고출력 네온 아크 */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          {/* 초발광 아케인 네온 필터 */}
          <filter id={`${gradientId}-magic-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur1" />
            <feGaussianBlur stdDeviation="4.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 4색 네온 오로라 그라데이션 */}
          <linearGradient id={`${gradientId}-aurora-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.98} />
            <stop offset="25%" stopColor="#00f0ff" stopOpacity={0.95} />
            <stop offset="65%" stopColor="#c084fc" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.95} />
          </linearGradient>

          {/* 골드 성광 그라데이션 */}
          <linearGradient id={`${gradientId}-gold-gradient`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.85} />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.95} />
          </linearGradient>
        </defs>

        {/* 베이스 궤도 동심 가이드 링 (발광 강화) */}
        <circle
          cx={center}
          cy={center}
          r={68}
          fill="none"
          stroke={`url(#${gradientId}-aurora-gradient)`}
          strokeWidth={0.7}
          strokeDasharray="2 3"
          opacity={isHovered ? 0.85 : 0.55}
          filter={`url(#${gradientId}-magic-glow)`}
        />
        <circle
          cx={center}
          cy={center}
          r={62}
          fill="none"
          stroke="#00f0ff"
          strokeWidth={0.8}
          opacity={isHovered ? 0.75 : 0.45}
        />
        <circle
          cx={center}
          cy={center}
          r={50}
          fill="none"
          stroke="#c084fc"
          strokeWidth={0.6}
          strokeDasharray="4 4"
          opacity={isHovered ? 0.7 : 0.4}
        />

        {/* 실시간 타이밍 오로라 아크 진행선 (누를 때 실시간 압력 게이지 연동) */}
        <g style={{ transformOrigin: `${center}px ${center}px` }} className={isPressing ? 'animate-[spin_2s_linear_infinite]' : isHovered ? 'animate-[spin_3.6s_linear_infinite]' : ''}>
          <circle
            cx={center}
            cy={center}
            r={rArc}
            fill="none"
            stroke={`url(#${gradientId}-aurora-gradient)`}
            strokeWidth={isPressing ? 2.8 : isHovered ? 2.2 : 1.8}
            strokeDasharray={
              isPressing
                ? `${circumferenceArc * Math.max(0.15, Math.min(1.0, gauge))} ${circumferenceArc * (1 - Math.max(0.15, Math.min(1.0, gauge)))}`
                : `${circumferenceArc * 0.45} ${circumferenceArc * 0.55}`
            }
            strokeLinecap="round"
            filter={`url(#${gradientId}-magic-glow)`}
            opacity={isPressing ? 1 : isHovered ? 0.95 : 0.85}
          />
        </g>
      </svg>

      {/* 🌟 3. 외곽 정방향 회전 12대 룬 각인 서클 (시계방향 공전, 누를 때 고속 공명) */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`absolute inset-0 pointer-events-none will-change-transform ${
          isCosmicSuction
            ? 'animate-[spin_0.6s_linear_infinite]'
            : isPressing
            ? 'animate-[spin_6s_linear_infinite]'
            : isHovered
            ? 'animate-[spin_12s_linear_infinite]'
            : 'animate-[spin_22s_linear_infinite]'
        }`}
      >
        <circle
          cx={center}
          cy={center}
          r={65}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={0.8}
          strokeDasharray="2 4"
          opacity={isHovered ? 0.8 : 0.5}
        />

        {/* 12방위 외곽 고대 룬 문자 각인 및 눈금 보석 */}
        {OUTER_MINI_RUNES.map((glyph, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const rx = center + 65 * Math.sin(angle);
          const ry = center - 65 * Math.cos(angle);

          // 눈금 사이의 미세 다이아몬드 별점 (15도 오프셋)
          const starAngle = ((i * 30 + 15) * Math.PI) / 180;
          const sx = center + 65 * Math.sin(starAngle);
          const sy = center - 65 * Math.cos(starAngle);

          return (
            <g key={`outer-glyph-${i}`}>
              <text
                x={rx}
                y={ry}
                fill={i % 2 === 0 ? '#38bdf8' : '#c084fc'}
                fontSize="7.5"
                fontWeight="900"
                fontFamily="serif"
                textAnchor="middle"
                dominantBaseline="central"
                opacity={isHovered ? 0.95 : 0.75}
                filter={`url(#${gradientId}-magic-glow)`}
                className="select-none"
              >
                {glyph}
              </text>
              <circle
                cx={sx}
                cy={sy}
                r="1"
                fill="#fbbf24"
                opacity={isHovered ? 0.85 : 0.5}
              />
            </g>
          );
        })}
      </svg>

      {/* 🌟 4. 내부 역방향 회전 8방위 신성기하학 옥타그램 (8-Pointed Sacred Octagram Seal) */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`absolute inset-0 pointer-events-none will-change-transform ${
          isCosmicSuction
            ? 'animate-[spin_0.45s_linear_infinite_reverse]'
            : isPressing
            ? 'animate-[spin_8s_linear_infinite_reverse]'
            : isHovered
            ? 'animate-[spin_14s_linear_infinite_reverse]'
            : 'animate-[spin_20s_linear_infinite_reverse]'
        }`}
      >
        <circle
          cx={center}
          cy={center}
          r={45}
          fill="none"
          stroke="#c084fc"
          strokeWidth={0.8}
          strokeDasharray="3 5"
          opacity={isHovered ? 0.85 : 0.6}
        />
        <circle
          cx={center}
          cy={center}
          r={38}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={0.6}
          strokeDasharray="2 3"
          opacity={isHovered ? 0.75 : 0.45}
        />

        {/* 8방위 옥타그램 성좌: 정사각형 1 (0°, 90°, 180°, 270°) */}
        <polygon
          points={`${center},27 ${center + 45},72 ${center},117 ${center - 45},72`}
          fill="none"
          stroke={`url(#${gradientId}-gold-gradient)`}
          strokeWidth={0.8}
          strokeDasharray="2 3"
          opacity={isHovered ? 0.9 : 0.65}
          filter={`url(#${gradientId}-magic-glow)`}
        />

        {/* 8방위 옥타그램 성좌: 정사각형 2 (45°, 135°, 225°, 315° 회전 교차) */}
        <polygon
          points={`${center + 31.8},${center - 31.8} ${center + 31.8},${center + 31.8} ${center - 31.8},${center + 31.8} ${center - 31.8},${center - 31.8}`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={0.8}
          strokeDasharray="2 3"
          opacity={isHovered ? 0.85 : 0.6}
          filter={`url(#${gradientId}-magic-glow)`}
        />
      </svg>

      {/* 🌌 4.3. 더블탭 시 4방위 점 사이로 우주로 빨려들어가는 하이퍼스페이스 차원문 (Cosmic Suction Abyss) */}
      <AnimatePresence>
        {isCosmicSuction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center overflow-visible"
          >
            {/* 1) 4방위 점들을 잇는 시공간 전자기 플라즈마 결선 */}
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="absolute inset-0 pointer-events-none animate-[spin_0.8s_linear_infinite]"
            >
              <polygon
                points={`${center},${center - 62} ${center + 62},${center} ${center},${center + 62} ${center - 62},${center}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                opacity="0.9"
                filter={`url(#${gradientId}-magic-glow)`}
                className="animate-pulse"
              />
              <polygon
                points={`${center - 43.8},${center - 43.8} ${center + 43.8},${center - 43.8} ${center + 43.8},${center + 43.8} ${center - 43.8},${center + 43.8}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.4"
                strokeDasharray="3 4"
                opacity="0.85"
                filter={`url(#${gradientId}-magic-glow)`}
              />
              {/* 4방위 점에서 중심 블랙홀로 꽂히는 광자 흡입 빔 */}
              <line x1={center} y1={center - 62} x2={center} y2={center} stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center + 62} y1={center} x2={center} y2={center} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center} y1={center + 62} x2={center} y2={center} stroke="#c084fc" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center - 62} y1={center} x2={center} y2={center} stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
            </svg>

            {/* 2) 룬 사이 우주 심연 흡입 볼텍스 (Cosmic Singularity Vortex) */}
            <div
              className="absolute w-36 h-36 rounded-full pointer-events-none animate-[spin_1.2s_linear_infinite] opacity-90 blur-[1px]"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(56,189,248,0.95) 0deg, rgba(147,51,234,0.85) 60deg, transparent 120deg, rgba(254,240,138,0.9) 180deg, rgba(52,211,153,0.85) 240deg, transparent 300deg, rgba(56,189,248,0.95) 360deg)',
              }}
            />
            {/* 3) 중심으로 수축/흡입되는 중력파 파동 링 (Darkness Inward Suction Waves) */}
            <motion.div
              initial={{ scale: 1.5, opacity: 0.9 }}
              animate={{ scale: [1.5, 0.4, 0.05], opacity: [0.9, 0.7, 0] }}
              transition={{ duration: 0.45, ease: 'easeIn', repeat: Infinity }}
              className="absolute w-28 h-28 rounded-full border-2 border-cyan-300 shadow-[0_0_24px_rgba(56,189,248,1),inset_0_0_18px_rgba(168,85,247,0.9)] bg-[radial-gradient(circle_at_center,black_0%,rgba(15,10,24,0.85)_50%,transparent_80%)]"
            />
            {/* 4) 깊은 우주 성운 칠흑 보이드 (Deep Cosmic Abyss Aperture) */}
            <div
              className="absolute w-24 h-24 rounded-full pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.98)_0%,rgba(15,10,35,0.9)_55%,transparent_90%)] shadow-[0_0_30px_rgba(0,0,0,1)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 4.5. 4방위 고정 금빛 아이콘 (상: 최상단 화살표 / 하: 최하단 화살표 / 좌: 3선 메뉴 / 우: 음표 음악) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{ transformOrigin: `${center}px ${center}px` }}
        animate={
          isCosmicSuction
            ? {
                rotate: [0, 360, 900],
                scale: [1, 1.25, 3.4],
                opacity: [1, 1, 0],
              }
            : {
                rotate: 0,
                scale: 1,
                opacity: 1,
              }
        }
        transition={
          isCosmicSuction
            ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
            : { duration: 0.2, ease: 'easeOut' }
        }
      >
        {/* ▲ 상(North) 고정 아이콘: 금빛 쉐브론 화살표 · 화면 최상단 스크롤 */}
        <div
          style={{
            left: `${center}px`,
            top: `${center - 62}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <motion.button
            type="button"
            onClick={(e) => {
              handleScrollToTop(e);
              e.currentTarget.blur();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.currentTarget.blur();
            }}
            onPointerLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'north' ? null : curr));
              e.currentTarget.blur();
            }}
            onMouseLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'north' ? null : curr));
              e.currentTarget.blur();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            animate={
              isCosmicSuction
                ? {
                    scale: [1, 1.4, 2.8],
                    opacity: [1, 1, 0],
                    filter: [
                      'brightness(1.2) drop-shadow(0 0 10px #fbbf24)',
                      'brightness(2.2) drop-shadow(0 0 24px #ffffff)',
                      'blur(6px) brightness(3)',
                    ],
                  }
                : implodingDotId === 'north'
                ? {
                    scale: [1, 1.35, 1],
                    filter: ['brightness(1)', 'brightness(2.0)', 'brightness(1)'],
                  }
                : {
                    scale: isHovered ? 1.12 : 1,
                    opacity: isHovered ? 1 : 0.9,
                  }
            }
            whileTap={!implodingDotId && !isCosmicSuction ? { scale: 0.88 } : undefined}
            transition={
              isCosmicSuction
                ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
                : implodingDotId === 'north'
                ? { duration: 0.2, ease: 'easeOut' }
                : { duration: 0.18, ease: 'easeOut' }
            }
            className="pointer-events-auto relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer select-none bg-transparent border-0 p-0 outline-none transition-transform duration-150 z-40"
            title="화면 최상단 이동"
            aria-label="화면 최상단 이동"
          >
            {implodingDotId === 'north' && (
              <span
                className="absolute w-7 h-7 rounded-full animate-ping pointer-events-none"
                style={{ backgroundColor: '#fbbf24', opacity: 0.7 }}
              />
            )}

            <ChevronUp
              className="w-4 h-4 text-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.75)] transition-all duration-200 hover:text-[#fde68a] hover:drop-shadow-[0_0_11px_rgba(251,191,36,1)] stroke-[2.4]"
            />
          </motion.button>
        </div>

        {/* ♪ 우(East) 고정 아이콘: 금빛 음표 · 배경음 제어 & 400ms 홀딩 메뉴 */}
        <div
          style={{
            left: `${center + 62}px`,
            top: `${center}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <motion.button
            type="button"
            onPointerDown={handleBgmPointerDown}
            onPointerMove={handleBgmPointerMove}
            onPointerUp={(e) => {
              handleBgmPointerUp(e);
              e.currentTarget.blur();
            }}
            onPointerCancel={handleBgmPointerUp}
            onPointerLeave={(e) => {
              handleBgmPointerUp(e);
              setImplodingDotId((curr) => (curr === 'east' ? null : curr));
              e.currentTarget.blur();
            }}
            onMouseLeave={(e) => {
              setIsBgmHolding(false);
              setImplodingDotId((curr) => (curr === 'east' ? null : curr));
              e.currentTarget.blur();
            }}
            onClick={(e) => {
              handleBgmClick(e);
              e.currentTarget.blur();
            }}
            onContextMenu={handleBgmContextMenu}
            onDoubleClick={handleBgmDoubleClick}
            onTouchStart={(e) => e.stopPropagation()}
            animate={
              isCosmicSuction
                ? {
                    scale: [1, 1.4, 2.8],
                    opacity: [1, 1, 0],
                    filter: [
                      'brightness(1.2) drop-shadow(0 0 10px #fbbf24)',
                      'brightness(2.2) drop-shadow(0 0 24px #ffffff)',
                      'blur(6px) brightness(3)',
                    ],
                  }
                : implodingDotId === 'east'
                ? {
                    scale: [1, 1.35, 1],
                    filter: ['brightness(1)', 'brightness(2.0)', 'brightness(1)'],
                  }
                : {
                    scale: isBgmHolding ? 0.9 : isHovered ? 1.12 : 1,
                    opacity: isHovered ? 1 : 0.9,
                  }
            }
            whileTap={!implodingDotId && !isCosmicSuction ? { scale: 0.88 } : undefined}
            transition={
              isCosmicSuction
                ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
                : implodingDotId === 'east'
                ? { duration: 0.2, ease: 'easeOut' }
                : { duration: 0.18, ease: 'easeOut' }
            }
            className={`pointer-events-auto relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer select-none bg-transparent border-0 p-0 outline-none transition-transform duration-150 z-40 ${
              isBgmHolding ? 'scale-90' : ''
            }`}
            title={isBgmPlaying ? '배경음 일시정지' : '배경음 재생'}
            aria-label="배경음 제어"
          >
            {implodingDotId === 'east' && (
              <span
                className="absolute w-7 h-7 rounded-full animate-ping pointer-events-none"
                style={{ backgroundColor: '#fbbf24', opacity: 0.7 }}
              />
            )}

            <Music
              className={`w-[15px] h-[15px] text-[#fbbf24] transition-all duration-200 stroke-[2.2] hover:text-[#fde68a] hover:drop-shadow-[0_0_11px_rgba(251,191,36,1)] ${
                isBgmPlaying
                  ? 'drop-shadow-[0_0_9px_rgba(251,191,36,0.95)]'
                  : 'drop-shadow-[0_0_6px_rgba(251,191,36,0.75)]'
              }`}
            />
          </motion.button>
        </div>

        {/* ▼ 하(South) 고정 아이콘: 금빛 쉐브론 화살표 · 화면 최하단 스크롤 */}
        <div
          style={{
            left: `${center}px`,
            top: `${center + 62}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <motion.button
            type="button"
            onClick={(e) => {
              handleScrollToBottom(e);
              e.currentTarget.blur();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.currentTarget.blur();
            }}
            onPointerLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'south' ? null : curr));
              e.currentTarget.blur();
            }}
            onMouseLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'south' ? null : curr));
              e.currentTarget.blur();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            animate={
              isCosmicSuction
                ? {
                    scale: [1, 1.4, 2.8],
                    opacity: [1, 1, 0],
                    filter: [
                      'brightness(1.2) drop-shadow(0 0 10px #fbbf24)',
                      'brightness(2.2) drop-shadow(0 0 24px #ffffff)',
                      'blur(6px) brightness(3)',
                    ],
                  }
                : implodingDotId === 'south'
                ? {
                    scale: [1, 1.35, 1],
                    filter: ['brightness(1)', 'brightness(2.0)', 'brightness(1)'],
                  }
                : {
                    scale: isHovered ? 1.12 : 1,
                    opacity: isHovered ? 1 : 0.9,
                  }
            }
            whileTap={!implodingDotId && !isCosmicSuction ? { scale: 0.88 } : undefined}
            transition={
              isCosmicSuction
                ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
                : implodingDotId === 'south'
                ? { duration: 0.2, ease: 'easeOut' }
                : { duration: 0.18, ease: 'easeOut' }
            }
            className="pointer-events-auto relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer select-none bg-transparent border-0 p-0 outline-none transition-transform duration-150 z-40"
            title="화면 최하단 이동"
            aria-label="화면 최하단 이동"
          >
            {implodingDotId === 'south' && (
              <span
                className="absolute w-7 h-7 rounded-full animate-ping pointer-events-none"
                style={{ backgroundColor: '#fbbf24', opacity: 0.7 }}
              />
            )}

            <ChevronDown
              className="w-4 h-4 text-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.75)] transition-all duration-200 hover:text-[#fde68a] hover:drop-shadow-[0_0_11px_rgba(251,191,36,1)] stroke-[2.4]"
            />
          </motion.button>
        </div>

        {/* ☰ 좌(West) 고정 아이콘: 금빛 3선 메뉴 · 메뉴 열기 */}
        <div
          style={{
            left: `${center - 62}px`,
            top: `${center}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <motion.button
            type="button"
            onClick={(e) => {
              handleMenuClick(e);
              e.currentTarget.blur();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.currentTarget.blur();
            }}
            onPointerLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'west' ? null : curr));
              e.currentTarget.blur();
            }}
            onMouseLeave={(e) => {
              setImplodingDotId((curr) => (curr === 'west' ? null : curr));
              e.currentTarget.blur();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            animate={
              isCosmicSuction
                ? {
                    scale: [1, 1.4, 2.8],
                    opacity: [1, 1, 0],
                    filter: [
                      'brightness(1.2) drop-shadow(0 0 10px #fbbf24)',
                      'brightness(2.2) drop-shadow(0 0 24px #ffffff)',
                      'blur(6px) brightness(3)',
                    ],
                  }
                : implodingDotId === 'west'
                ? {
                    scale: [1, 1.35, 1],
                    filter: ['brightness(1)', 'brightness(2.0)', 'brightness(1)'],
                  }
                : {
                    scale: isHovered ? 1.12 : 1,
                    opacity: isHovered ? 1 : 0.9,
                  }
            }
            whileTap={!implodingDotId && !isCosmicSuction ? { scale: 0.88 } : undefined}
            transition={
              isCosmicSuction
                ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
                : implodingDotId === 'west'
                ? { duration: 0.2, ease: 'easeOut' }
                : { duration: 0.18, ease: 'easeOut' }
            }
            className="pointer-events-auto relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer select-none bg-transparent border-0 p-0 outline-none transition-transform duration-150 z-40"
            title="메뉴 열기"
            aria-label="메뉴 열기"
          >
            {implodingDotId === 'west' && (
              <span
                className="absolute w-7 h-7 rounded-full animate-ping pointer-events-none"
                style={{ backgroundColor: '#fbbf24', opacity: 0.7 }}
              />
            )}

            <Menu
              className="w-[15px] h-[15px] text-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.75)] transition-all duration-200 hover:text-[#fde68a] hover:drop-shadow-[0_0_11px_rgba(251,191,36,1)] stroke-[2.2]"
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});
