import React, { useId, useCallback, useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Menu, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WarpPhase } from '@/lib/omniWarp/types';
import { resetAppScroll, resetAppScrollToBottom } from '@/utils/scrollToTop';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

interface AncientRuneConfig {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  path: string;
  color: string;
  glowColor: string;
  /** 대각선 안착 각도 (0은 북쪽 기준, 45=NE, 135=SE, 225=SW, 315=NW) */
  diagonalDeg: number;
}

const ANCIENT_RUNES: AncientRuneConfig[] = [
  {
    id: 'raido',
    symbol: 'ᚱ',
    name: 'Raido',
    meaning: '운명과 여정',
    path: '/trinity',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.85)',
    diagonalDeg: 315, // 북서 (상좌) ➔ 트리니티
  },
  {
    id: 'algiz',
    symbol: 'ᛉ',
    name: 'Algiz',
    meaning: '소망과 보호',
    path: '/orange',
    color: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.85)',
    diagonalDeg: 45, // 북동 (상우) ➔ 오렌지
  },
  {
    id: 'sowilo',
    symbol: 'ᛋ',
    name: 'Sowilo',
    meaning: '태양과 치유',
    path: '/heal',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.85)',
    diagonalDeg: 135, // 남동 (하우) ➔ 힐링
  },
  {
    id: 'othala',
    symbol: 'ᛟ',
    name: 'Othala',
    meaning: '평화와 안식',
    path: '/bluebird',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.85)',
    diagonalDeg: 225, // 남서 (하좌) ➔ 블루버드
  },
];

// 12방위 외곽 룬 문자 각인 (Elder Futhark)
const OUTER_MINI_RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

function getRunePosition(deg: number, center: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: center + radius * Math.sin(rad),
    y: center - radius * Math.cos(rad),
  };
}

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
 * - 4방위 룬 점: 상(최상단 스크롤), 하(최하단 스크롤), 좌(메뉴 드로어), 우(배경음 컨트롤 & 홀딩 메뉴)
 * - 4대 고대 룬 문자: ᚱ(Raido), ᛉ(Algiz), ᛋ(Sowilo), ᛟ(Othala) 블랙홀 공전 및 호버 시 대각선 안착 / 소멸 도약
 * - 더블탭 시: 고대 룬 문자들 사이로 시공간이 붕괴하며 우주 심연으로 빨려들어가는 하이퍼스페이스 흡입 연출
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

  // 🚀 상단(North) 점 탭 시 화면/대화창 최상단 부드러운 스크롤 이동
  const handleScrollToTop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      playAudioHaptic('tap_light');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }

    resetAppScroll('smooth');
    window.dispatchEvent(new CustomEvent('prism:scroll_to_top'));
  }, []);

  // 🚀 하단(South) 점 탭 시 화면/대화창 최하단 부드러운 스크롤 이동
  const handleScrollToBottom = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      playAudioHaptic('tap_light');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }

    resetAppScrollToBottom('smooth');
    window.dispatchEvent(new CustomEvent('prism:scroll_to_bottom'));
  }, []);

  // 🚀 좌(West) 점 탭 시 사이드 네비게이션 메뉴 열기/토글
  const handleMenuClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      playAudioHaptic('tap_light');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('prism:toggle_menu'));
  }, []);

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

    try {
      playAudioHaptic('tap_light');
    } catch (_) {}

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('prism:toggle_bgm'));
  }, []);

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

  // 🔮 4대 고대 룬 문자 상태 관리 (클릭 시 소멸, 호버 해제 시 복구 초기화)
  const [vanishedRuneIds, setVanishedRuneIds] = useState<Set<string>>(new Set());
  const [implodingRuneId, setImplodingRuneId] = useState<string | null>(null);

  // 호버를 떼었다가 다시 호버하면 소멸된 룬 즉시 초기화
  useEffect(() => {
    if (!isHovered) {
      setVanishedRuneIds(new Set());
      setImplodingRuneId(null);
    }
  }, [isHovered]);

  const handleRuneClick = useCallback(
    (e: React.MouseEvent, rune: AncientRuneConfig) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        playAudioHaptic('tap_impact');
      } catch (_) {}
      try {
        triggerHaptic('wormhole');
      } catch (_) {}

      setImplodingRuneId(rune.id);

      setTimeout(() => {
        setVanishedRuneIds((prev) => new Set([...prev, rune.id]));
        setImplodingRuneId(null);
        if (onRuneNavigate) {
          onRuneNavigate(rune.path, rune.id);
        } else if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: rune.path } }));
          window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: rune.path } }));
        }
      }, 200);
    },
    [onRuneNavigate]
  );

  // 대형화된 버튼(76~84px) 외곽을 웅장하고 신비롭게 감싸는 최적의 마법진 직경 (144px)
  const size = 144;
  const center = size / 2; // 72px
  const rArc = 58;
  const circumferenceArc = 2 * Math.PI * rArc;

  return (
    <div
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

      {/* 🌌 4.3. 더블탭 시 룬 문자들 사이로 우주로 빨려들어가는 하이퍼스페이스 차원문 (Cosmic Suction Abyss) */}
      <AnimatePresence>
        {isCosmicSuction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center overflow-visible"
          >
            {/* 1) 룬과 룬을 잇는 사각형 시공간 전자기 플라즈마 결선 (Rune Quantum Plasma Web) */}
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="absolute inset-0 pointer-events-none animate-[spin_0.8s_linear_infinite]"
            >
              <polygon
                points={`${center - 39.6},${center - 39.6} ${center + 39.6},${center - 39.6} ${center + 39.6},${center + 39.6} ${center - 39.6},${center + 39.6}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                opacity="0.9"
                filter={`url(#${gradientId}-magic-glow)`}
                className="animate-pulse"
              />
              <polygon
                points={`${center},${center - 56} ${center + 56},${center} ${center},${center + 56} ${center - 56},${center}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.4"
                strokeDasharray="3 4"
                opacity="0.85"
                filter={`url(#${gradientId}-magic-glow)`}
              />
              {/* 대각선 4대 룬에서 중심 블랙홀로 꽂히는 광자 광선 (Inward Suction Beams) */}
              <line x1={center - 39.6} y1={center - 39.6} x2={center} y2={center} stroke="#fde047" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center + 39.6} y1={center - 39.6} x2={center} y2={center} stroke="#fde047" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center + 39.6} y1={center + 39.6} x2={center} y2={center} stroke="#fde047" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
              <line x1={center - 39.6} y1={center + 39.6} x2={center} y2={center} stroke="#fde047" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.95" />
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

      {/* 🔮 4.5. 4대 고대 룬 문자 (블랙홀 공전 & 호버 시 4대 대각선 안착 / 클릭 시 소멸 도약 / 더블탭 시 우주 흡입 도약) */}
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
            : isHovered
            ? { rotate: 0 }
            : { rotate: 360 }
        }
        transition={
          isCosmicSuction
            ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
            : isHovered
            ? { type: 'spring', stiffness: 280, damping: 22, mass: 0.8 }
            : { repeat: Infinity, duration: 24, ease: 'linear' }
        }
      >
        {ANCIENT_RUNES.map((rune) => {
          if (vanishedRuneIds.has(rune.id)) return null;

          const isImploding = implodingRuneId === rune.id;
          const { x, y } = getRunePosition(rune.diagonalDeg, center, 56);

          return (
            <div
              key={rune.id}
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <motion.button
                type="button"
                onClick={(e) => handleRuneClick(e, rune)}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                animate={
                  isCosmicSuction
                    ? {
                        scale: [1, 1.35, 2.8],
                        opacity: [1, 1, 0],
                        filter: [
                          'brightness(1.2) drop-shadow(0 0 10px currentColor)',
                          'brightness(2.2) drop-shadow(0 0 24px #ffffff)',
                          'blur(6px) brightness(3)',
                        ],
                      }
                    : isImploding
                    ? {
                        scale: [1, 2.2],
                        opacity: [1, 0],
                        filter: ['blur(0px) brightness(1)', 'blur(8px) brightness(2.5)'],
                      }
                    : {
                        scale: isHovered ? 1.05 : 0.85,
                        opacity: isHovered ? 1 : 0.75,
                      }
                }
                whileHover={!isImploding && !isCosmicSuction ? { scale: 1.25 } : undefined}
                whileTap={!isImploding && !isCosmicSuction ? { scale: 0.9 } : undefined}
                transition={
                  isCosmicSuction
                    ? { duration: 0.52, ease: [0.32, 0, 0.67, 0] }
                    : isImploding
                    ? { duration: 0.22, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 350, damping: 25 }
                }
                className="group pointer-events-auto relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer select-none transition-shadow duration-200"
                style={{
                  color: rune.color,
                  textShadow: `0 0 10px ${rune.glowColor}`,
                }}
                title={`${rune.symbol} ${rune.name} · ${rune.meaning}`}
                aria-label={`${rune.name} (${rune.meaning})`}
              >
                {/* 룬 스톤 배경 링 & 백드롭 (호버 시 뚜렷하게 발광 안착) */}
                <span
                  className="absolute inset-0 rounded-full border border-white/20 transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? 'rgba(2, 6, 23, 0.85)' : 'rgba(2, 6, 23, 0.4)',
                    boxShadow: isHovered ? `0 0 12px ${rune.glowColor}` : `0 0 6px ${rune.glowColor}`,
                    borderColor: isHovered ? rune.color : 'rgba(255, 255, 255, 0.15)',
                  }}
                />

                {/* 소멸 시 외곽 충격파 펄스 */}
                {isImploding && (
                  <span
                    className="absolute -inset-2 rounded-full animate-ping pointer-events-none"
                    style={{ backgroundColor: rune.color, opacity: 0.6 }}
                  />
                )}

                {/* 고대 룬 문자 글리프 */}
                <span className="relative z-10 text-[13px] font-black tracking-tighter select-none leading-none drop-shadow">
                  {rune.symbol}
                </span>

                {/* 호버 시 툴팁 안내 */}
                {isHovered && !isImploding && (
                  <span
                    className={`absolute pointer-events-none whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border border-white/20 text-[10px] font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 ${
                      rune.diagonalDeg === 315
                        ? '-top-6 -left-12'
                        : rune.diagonalDeg === 45
                        ? '-top-6 -right-12'
                        : rune.diagonalDeg === 135
                        ? '-bottom-6 -right-12'
                        : '-bottom-6 -left-12'
                    }`}
                    style={{ borderColor: rune.color }}
                  >
                    <span style={{ color: rune.color }} className="mr-1">
                      {rune.symbol}
                    </span>
                    {rune.meaning}
                  </span>
                )}
              </motion.button>
            </div>
          );
        })}
      </motion.div>

      {/* 🌟 5. 4 방위 고정 룬 보석 (상/하/좌/우) - 마우스 호버 시 상하좌우 화살표로 매끄럽게 전환 */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* 상(North) 점 / 화살표: 화면 최상단 이동 */}
        <button
          type="button"
          onClick={handleScrollToTop}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="group pointer-events-auto absolute left-1/2 -translate-x-1/2 -top-[10px] w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 z-40"
          title="화면 최상단으로 이동"
          aria-label="화면 최상단으로 이동"
        >
          <span className="relative flex items-center justify-center w-3 h-3 transition-all duration-200 group-hover:opacity-0 group-hover:scale-0">
            <span className="absolute w-2 h-2 rotate-45 border border-[#38bdf8] shadow-[0_0_8px_#38bdf8] bg-slate-950/80" />
            <span className="relative w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
          <ArrowUp className="absolute w-3.5 h-3.5 text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none stroke-[2.5]" />
        </button>

        {/* 하(South) 점 / 화살표: 화면 최하단 이동 */}
        <button
          type="button"
          onClick={handleScrollToBottom}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="group pointer-events-auto absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 z-40"
          title="화면 최하단으로 이동"
          aria-label="화면 최하단으로 이동"
        >
          <span className="relative flex items-center justify-center w-3 h-3 transition-all duration-200 group-hover:opacity-0 group-hover:scale-0">
            <span className="absolute w-2 h-2 rotate-45 border border-[#c084fc] shadow-[0_0_8px_#c084fc] bg-slate-950/80" />
            <span className="relative w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
          <ArrowDown className="absolute w-3.5 h-3.5 text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none stroke-[2.5]" />
        </button>

        {/* 좌(West) 점: 메뉴 열기 (LeftSidebarNav 드로어 토글) */}
        <button
          type="button"
          onClick={handleMenuClick}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="group pointer-events-auto absolute top-1/2 -translate-y-1/2 -left-[12px] w-9 h-9 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 z-40"
          title="메뉴 열기 (네비게이션)"
          aria-label="메뉴 열기"
        >
          <span className="relative flex items-center justify-center w-3 h-3 transition-all duration-200 group-hover:opacity-0 group-hover:scale-0">
            <span className="absolute w-2 h-2 rotate-45 border border-[#38bdf8] shadow-[0_0_8px_#38bdf8] bg-slate-950/80" />
            <span className="relative w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
          <Menu className="absolute w-3.5 h-3.5 text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none stroke-[2.5]" />
        </button>

        {/* 우(East) 점: 배경음 재생/일시정지 및 400ms 홀딩 시 팝오버 상세메뉴 */}
        <button
          type="button"
          onPointerDown={handleBgmPointerDown}
          onPointerMove={handleBgmPointerMove}
          onPointerUp={handleBgmPointerUp}
          onPointerCancel={handleBgmPointerUp}
          onPointerLeave={handleBgmPointerUp}
          onClick={handleBgmClick}
          onContextMenu={handleBgmContextMenu}
          onDoubleClick={handleBgmDoubleClick}
          onTouchStart={(e) => e.stopPropagation()}
          className={`group pointer-events-auto absolute top-1/2 -translate-y-1/2 -right-[12px] w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 z-40 ${
            isBgmHolding ? "scale-90 ring-2 ring-amber-400/80 shadow-[0_0_16px_rgba(251,191,36,0.9)]" : "active:scale-90"
          }`}
          title={isBgmPlaying ? "배경음 일시정지 (꾹 누르면 플레이어 메뉴)" : "배경음 재생 (꾹 누르면 플레이어 메뉴)"}
          aria-label="배경음 제어"
        >
          <span className="relative flex items-center justify-center w-3 h-3 transition-all duration-200 group-hover:opacity-0 group-hover:scale-0">
            <span
              className={`absolute w-2 h-2 rotate-45 border bg-slate-950/80 transition-all duration-200 ${
                isBgmPlaying
                  ? 'border-[#fbbf24] shadow-[0_0_10px_#fbbf24]'
                  : 'border-[#c084fc] shadow-[0_0_8px_#c084fc]'
              }`}
            />
            <span className="relative w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
          <Music
            className={`absolute w-3.5 h-3.5 text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] opacity-0 scale-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none stroke-[2.5] ${
              isBgmPlaying ? "animate-[spin_6s_linear_infinite]" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
});
