import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { WarpPhase, OmniWarpTarget, OmniWarpContext } from '@/lib/omniWarp/types';
import { calculateWarpMetrics, forceToAiTemperature, RADIAL_WARP_APPS } from '@/lib/omniWarp/forceSensor';
import { serializeCurrentView, synthesizeWarpTarget, isDisallowedWarpDestination } from '@/lib/omniWarp/omniWarpEngine';
import {
  getWhiteholeRecommendedApp,
  getBlackholeRecommendedApp,
} from '@/lib/omniWarp/wormholeSpectrum';
import { getTossRule } from '@/lib/prismTossRegistry';
import { resolveCanonicalPath, isValidPrismPath } from '@/lib/prismRouteRegistry';
import { resetActiveWormholePeek } from '@/lib/omniWarp/wormholeShuffleEngine';
import {
  peekNextRecommendedMenuByCycle,
  commitNextRecommendedMenuByCycle,
  resetActiveContextPeek,
} from '@/lib/omniWarp/contextNavCycleEngine';
import { omniWarpAudio } from '@/lib/omniWarp/omniWarpAudio';
import { triggerHaptic, startBlackHoleContinuousHaptic, stopBlackHoleContinuousHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { safeSessionStorage } from '@/utils/safeStorage';
import { peekPendingSelection, savePendingSelection, clearPendingSelection, getLiveSelectedText } from '@/lib/selectionBridge';
import { sendPrismToss } from '@/lib/prismToss';
import { tossSelectionToMenu, PRISM_ALL_APP_DESTINATIONS } from '@/lib/selectionContextRecommender';
import { BigBangCircularMeter } from './BigBangCircularMeter';
import { PrismAppIcon } from './PrismAppIcon';

export function BigBangButton() {
  let location = '/';
  let navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = to;
    }
  };

  try {
    const [wouterLoc, wouterNav] = useLocation();
    location = wouterLoc;
    navigate = wouterNav;
  } catch (_) {
    if (typeof window !== 'undefined') {
      location = window.location.pathname;
    }
  }

  const isKeySite =
    location === '/key' ||
    location === '/calm' ||
    location === '/orb' ||
    location === '/gateway' ||
    location === '/crystal' ||
    (typeof window !== 'undefined' && (
      window.location.pathname.includes('key') ||
      window.location.pathname.includes('calm') ||
      window.location.pathname.includes('orb')
    ));

  const isChatView =
    location === '/chat' ||
    location === '/lucy' ||
    (typeof window !== 'undefined' && window.location.pathname.includes('chat'));

  const [isPressing, setIsPressing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activePhase, setActivePhase] = useState<WarpPhase>('idle');
  const [gauge, setGauge] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [aiTemp, setAiTemp] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<OmniWarpTarget | null>(null);
  const [isAborted, setIsAborted] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const [dragAngleDeg, setDragAngleDeg] = useState(0);
  const [radialSectorIndex, setRadialSectorIndex] = useState<number>(-1);
  const [isPageScrolling, setIsPageScrolling] = useState(false);
  const lastScrollTimeRef = useRef<number>(0);
  const maxDragDistanceRef = useRef<number>(0);
  const touchStartedWhileScrollingRef = useRef<boolean>(false);

  // 스크롤 중에는 추천 1순위나 HUD 칩이 미리 노출되지 않도록 감지
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();
      setIsPageScrolling(true);
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsPageScrolling(false);
      }, 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  // 🎯 OmniWarp BigBang Controller: 화이트홀(빛비춤) · 블랙홀(어두운 심연) 상태
  const [activeHole, setActiveHole] = useState<'whitehole' | 'blackhole'>('whitehole');
  const lastHoleRef = useRef<'whitehole' | 'blackhole'>('whitehole');

  const lastSectorRef = useRef<number>(-1);
  const cachedContextRef = useRef<OmniWarpContext | null>(null);
  const lastUpdateGaugeRef = useRef<number>(0);
  const lastStateUpdateTimeRef = useRef<number>(0);

  // ⚡ 더블탭 감지용 타이머 및 이전 탭 타임스탬프 ref
  const lastTapTimeRef = useRef<number>(0);
  const singleTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
    };
  }, []);

  // 🎯 현재 활성화된 브라우저 텍스트 선택(스크롤) 내용 추출 (취소되었거나 비어있으면 '' 반환)
  // 일반 본문 노드뿐만 아니라 input/textarea 빈칸 입력창 및 방금 보존된 pending selection까지 완벽 지원
  const getActiveSelectionText = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    // 1. 현재 브라우저 실시간 선택 텍스트 (input, textarea 빈칸 및 일반 본문 포함)
    const live = getLiveSelectedText();
    if (live && live.length >= 2) return live;

    // 2. 버튼 클릭/터치 시 포커스 이동 등으로 selection이 방금 해제된 경우: 보존된 대기 스토리지 확인
    const pending = peekPendingSelection();
    if (pending && pending.text && pending.text.trim().length >= 2) {
      return pending.text.trim();
    }
    return '';
  }, []);

  // 🌟 텍스트 드래그(선택) 감지: 탭 시 루시 토스, 홀드 시 Key 40가지 연습 토스 지원
  const [hasSelectionToss, setHasSelectionToss] = useState(false);
  const [selectionPreviewText, setSelectionPreviewText] = useState('');
  const touchStartSelectionRef = useRef<string>('');

  useEffect(() => {
    const updateSelectionState = () => {
      if (typeof window === 'undefined') return;

      // 🛡️ 조작 중일 때는 선택 상태를 강제 해제하지 않음
      if (touchStartRef.current || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bigbang_pressing') === 'true')) {
        return;
      }

      const text = getActiveSelectionText();

      // 🎯 스크롤(선택) 취소 감지:
      // 브라우저 텍스트 선택이 해제되거나 비어있으면 토스 모드 및 대기 스토리지 즉각 취소!
      if (!text) {
        clearPendingSelection();
        setHasSelectionToss(false);
        setSelectionPreviewText('');
        return;
      }

      setHasSelectionToss(true);
      setSelectionPreviewText(text.slice(0, 24));
    };

    const handleSaved = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.text && detail.text.length >= 2) {
        setHasSelectionToss(true);
        setSelectionPreviewText(detail.text.slice(0, 24));
      }
    };

    const handleTossedOrCleared = () => {
      clearPendingSelection();
      setHasSelectionToss(false);
      setSelectionPreviewText('');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearPendingSelection();
        setHasSelectionToss(false);
        setSelectionPreviewText('');
      }
    };

    let selDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedUpdateSelection = () => {
      if (selDebounceTimer) clearTimeout(selDebounceTimer);
      selDebounceTimer = setTimeout(() => {
        updateSelectionState();
      }, 90);
    };

    document.addEventListener('selectionchange', debouncedUpdateSelection, { passive: true });
    document.addEventListener('select', debouncedUpdateSelection, true); // 빈칸(input/textarea) 선택 감지
    document.addEventListener('mouseup', debouncedUpdateSelection, { passive: true });
    document.addEventListener('touchend', debouncedUpdateSelection, { passive: true });
    window.addEventListener('prism:selection_saved', handleSaved);
    window.addEventListener('prism:selection_tossed', handleTossedOrCleared);
    window.addEventListener('prism:selection_cleared', handleTossedOrCleared);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (selDebounceTimer) clearTimeout(selDebounceTimer);
      document.removeEventListener('selectionchange', debouncedUpdateSelection);
      document.removeEventListener('select', debouncedUpdateSelection, true);
      document.removeEventListener('mouseup', debouncedUpdateSelection);
      document.removeEventListener('touchend', debouncedUpdateSelection);
      window.removeEventListener('prism:selection_saved', handleSaved);
      window.removeEventListener('prism:selection_tossed', handleTossedOrCleared);
      window.removeEventListener('prism:selection_cleared', handleTossedOrCleared);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [getActiveSelectionText]);

  // Active view context and next destination pre-vision (수정구슬 영시)
  const currentContext = serializeCurrentView(location);
  const normPath = location.replace('/', '') || 'hub';
  const tossRule = getTossRule(normPath, `${currentContext.summary} ${currentContext.primarySubject || ''}`);
  
  // profile, handbook, library, omniwarp 4대 페이지는 워프 이동 대상에서 엄격 배제
  const sanitizeDest = (dest: any) => {
    if (!dest || isDisallowedWarpDestination(dest.id) || isDisallowedWarpDestination(dest.path)) {
      return {
        id: 'hub',
        name: '프롤로그 허브',
        subName: '프리즘 우주의 중심',
        path: '/',
        icon: '🏛️',
        description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
        themeColor: '#00f0ff',
      };
    }
    return dest;
  };

  const globalWhitehole = getWhiteholeRecommendedApp(location);
  const globalBlackhole = getBlackholeRecommendedApp(location);
  const whiteholeApp = sanitizeDest({
    id: globalWhitehole.id,
    name: globalWhitehole.name,
    subName: globalWhitehole.subName,
    path: globalWhitehole.path,
    icon: globalWhitehole.icon,
    description: globalWhitehole.description,
    themeColor: globalWhitehole.themeColor,
  });
  const blackholeApp = sanitizeDest({
    id: globalBlackhole.id,
    name: globalBlackhole.name,
    subName: globalBlackhole.subName,
    path: globalBlackhole.path,
    icon: globalBlackhole.icon,
    description: globalBlackhole.description,
    themeColor: globalBlackhole.themeColor,
  });
  const secondaryDest = sanitizeDest(tossRule.secondary);
  const tertiaryDest = sanitizeDest(tossRule.tertiary);


  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<WarpPhase>('idle');
  const lastEventHorizonModeRef = useRef<'whitehole' | 'mirrorhole' | 'blackhole' | undefined>(undefined);
  const currentPointerEventRef = useRef<React.PointerEvent | null>(null);
  const hasTriggeredBlackHolePeakRef = useRef<boolean>(false);
  const lastStageRef = useRef<number>(1);
  const globalPointerMoveRef = useRef<((e: PointerEvent) => void) | null>(null);
  const globalPointerUpRef = useRef<((e: PointerEvent) => void) | null>(null);

  const cleanupGlobalPointerListeners = useCallback(() => {
    if (globalPointerMoveRef.current) {
      window.removeEventListener('pointermove', globalPointerMoveRef.current);
      globalPointerMoveRef.current = null;
    }
    if (globalPointerUpRef.current) {
      window.removeEventListener('pointerup', globalPointerUpRef.current);
      globalPointerUpRef.current = null;
    }
  }, []);

  // Real-time animation loop while pressing (60fps 고성능 최적화: 캐싱 & 스로틀링)
  const updateLoop = useCallback(() => {
    if (!touchStartRef.current) return;

    const now = performance.now();
    const start = touchStartRef.current;
    const currentPointer = currentPointerEventRef.current;

    const metrics = calculateWarpMetrics(
      start.time,
      now,
      start.x,
      start.y,
      currentPointer ? currentPointer.clientX : start.x,
      currentPointer ? currentPointer.clientY : start.y,
      currentPointer || undefined
    );

    const context = cachedContextRef.current || serializeCurrentView(location);
    let target = synthesizeWarpTarget(context, metrics);
    const temp = forceToAiTemperature(metrics.virtualForce);
    const sectorIdx = metrics.radialSectorIndex !== undefined ? metrics.radialSectorIndex : -1;

    const deltaX = currentPointer ? currentPointer.clientX - start.x : 0;
    const deltaY = currentPointer ? currentPointer.clientY - start.y : 0;
    const dist = Math.hypot(deltaX, deltaY);

    // 🎯 제스처 실시간 타깃 및 HUD 매핑:
    // 1) 드래그 (dist >= 20): Key (마음약방 & 40가지 연습) 도약
    // 2) 제자리 홀드 (dist < 20, elapsed >= 250): 루시 (/chat 1:1 대화) 소환
    // 3) 가볍게 탭 (dist < 20, elapsed < 250): 홈 (/) 베이스캠프 복귀
    const textToToss = touchStartSelectionRef.current || getActiveSelectionText();
    const elapsed = now - start.time;

    let currentHole: 'whitehole' | 'blackhole' = 'whitehole';

    if (dist >= 20) {
      setIsPageScrolling(false);
      currentHole = 'blackhole';
      const isTextToss = Boolean(textToToss);
      target = {
        id: 'key',
        icon: '🔑',
        phase: 'blackhole',
        gauge: metrics.virtualForce,
        aiTemperature: temp,
        title: 'Key 마음약방',
        actionType: isTextToss ? 'smart_toss' : 'navigate',
        previewLabel: isTextToss
          ? `[Key 토스] "${textToToss.slice(0, 16)}..." ➔ 40가지 연습 처방`
          : `[드래그 도약] Key 마음약방`,
        previewDescription: '제이미 저커먼 도서 연동 마음 치유 동반자 & 40가지 소매틱 연습',
        destinationPath: '/key',
        themeColor: '#0ea5e9',
        accentGlow: 'rgba(14, 165, 233, 0.85)',
      };
    } else if (elapsed >= 250) {
      currentHole = 'whitehole';
      const isTextToss = Boolean(textToToss);
      target = {
        id: 'lucy',
        icon: '💬',
        phase: 'whitehole',
        gauge: metrics.virtualForce,
        aiTemperature: temp,
        title: '루시 1:1 대화',
        actionType: isTextToss ? 'smart_toss' : 'navigate',
        previewLabel: isTextToss
          ? `[루시 토스] "${textToToss.slice(0, 16)}..." ➔ 루시 질의`
          : `[홀드 소환] 루시 1:1 대화`,
        previewDescription: '마음의 안식처 루시와 나누는 따뜻한 대화와 지혜 조언',
        destinationPath: '/chat',
        themeColor: '#fde68a',
        accentGlow: 'rgba(253, 230, 138, 0.85)',
      };
    } else {
      currentHole = 'whitehole';
      target = {
        id: 'hub',
        icon: '🏠',
        phase: 'whitehole',
        gauge: metrics.virtualForce,
        aiTemperature: temp,
        title: '홈 베이스캠프',
        actionType: 'navigate',
        previewLabel: '가볍게 탭 ➔ 홈으로 이동',
        previewDescription: '프롤로그 허브 메인으로 귀환합니다',
        destinationPath: '/',
        themeColor: '#38bdf8',
        accentGlow: 'rgba(56, 189, 248, 0.85)',
      };
    }

    // 중요한 상태 변경(섹터, 페이즈, 어보트, 홀)이 발생했거나 약 33ms(30fps) 경과 시 상태 일괄 동기화
    const isSectorChanged = sectorIdx !== lastSectorRef.current;
    const isPhaseChanged = metrics.phase !== lastPhaseRef.current;
    const isAbortedChanged = metrics.isAborted !== isAborted;
    const isHoleChanged = currentHole !== lastHoleRef.current;
    const isGaugeSignificantlyChanged = Math.abs(metrics.virtualForce - lastUpdateGaugeRef.current) >= 0.04;
    const isTimeThrottled = now - lastStateUpdateTimeRef.current >= 32;

    if (isSectorChanged || isPhaseChanged || isAbortedChanged || isHoleChanged || isGaugeSignificantlyChanged || isTimeThrottled) {
      lastStateUpdateTimeRef.current = now;
      lastUpdateGaugeRef.current = metrics.virtualForce;

      setGauge(metrics.virtualForce);
      setDurationMs(metrics.durationMs);
      setAiTemp(temp);
      setActivePhase(metrics.phase);
      setCurrentTarget(target);
      setIsAborted(metrics.isAborted);
      setDragOffset({ x: metrics.dragOffsetX || 0, y: metrics.dragOffsetY || 0 });
      setDragDistance(dist);
      setDragAngleDeg(metrics.dragAngleDeg || 0);
      setRadialSectorIndex(sectorIdx);
      setActiveHole(currentHole);
    }

    // 🎯 7대 앱 방사형 조이스틱 각 앱 섹터 진입 시 기계식 마그네틱 틱 햅틱 진동
    if (sectorIdx !== -1 && sectorIdx !== lastSectorRef.current && !metrics.isAborted) {
      lastSectorRef.current = sectorIdx;
      triggerHaptic('whitehole');
    } else if (sectorIdx === -1) {
      lastSectorRef.current = -1;
    }

    // 🧲 화이트홀 ➔ 블랙홀 전환 시 실시간 오디오 & 햅틱
    if (currentHole !== lastHoleRef.current && !metrics.isAborted) {
      lastHoleRef.current = currentHole;
      if (currentHole === 'whitehole') {
        omniWarpAudio.playWhiteHole();
        triggerHaptic('whitehole');
      } else if (currentHole === 'blackhole') {
        omniWarpAudio.playBlackHole();
        triggerHaptic('blackhole');
      }
    }

    // 🧲 마그네틱 래칫 햅틱
    const currentStage = target.stageIndex || 1;
    if (sectorIdx === -1 && currentStage !== lastStageRef.current && !metrics.isAborted) {
      lastStageRef.current = currentStage;
      triggerHaptic('whitehole');
    }

    // 🕳️ 블랙홀 단계 미세 진동 피드백 (홀드 지속 시 심연 럼블 - 웜홀 및 방사형 조이스틱 영역에서는 중단)
    if (metrics.phase === 'blackhole' && !metrics.isAborted && sectorIdx === -1) {
      startBlackHoleContinuousHaptic();
    } else {
      stopBlackHoleContinuousHaptic();
    }

    // Audio & Haptic triggers on phase transition
    if (metrics.phase !== lastPhaseRef.current && !metrics.isAborted) {
      if (metrics.phase === 'whitehole') {
        omniWarpAudio.playWhiteHole();
        triggerHaptic('whitehole');
      } else if (metrics.phase === 'wormhole') {
        omniWarpAudio.playWormhole();
        triggerHaptic('wormhole');
      } else if (metrics.phase === 'event_horizon') {
        omniWarpAudio.playEventHorizon();
        triggerHaptic('event_horizon');
      } else if (metrics.phase === 'blackhole') {
        omniWarpAudio.playBlackHole();
        triggerHaptic('blackhole');
      }
      lastPhaseRef.current = metrics.phase;
    }

    if (metrics.isAborted && lastPhaseRef.current !== 'aborted') {
      omniWarpAudio.playAbort();
      triggerHaptic('abort');
      lastPhaseRef.current = 'aborted';
    }

    rafRef.current = requestAnimationFrame(updateLoop);
  }, [location, isAborted]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const wasScrolling = (Date.now() - lastScrollTimeRef.current < 650) || isPageScrolling;
    touchStartedWhileScrollingRef.current = wasScrolling;
    maxDragDistanceRef.current = 0;

    cleanupGlobalPointerListeners();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    const onGlobalMove = (ev: PointerEvent) => {
      currentPointerEventRef.current = ev as any;
      if (touchStartRef.current) {
        const d = Math.hypot(ev.clientX - touchStartRef.current.x, ev.clientY - touchStartRef.current.y);
        if (d > maxDragDistanceRef.current) {
          maxDragDistanceRef.current = d;
        }
      }
    };
    const onGlobalUp = (ev: PointerEvent) => {
      cleanupGlobalPointerListeners();
      handlePointerUp(ev as any);
    };

    globalPointerMoveRef.current = onGlobalMove;
    globalPointerUpRef.current = onGlobalUp;
    window.addEventListener('pointermove', onGlobalMove, { passive: true });
    window.addEventListener('pointerup', onGlobalUp);

    const now = performance.now();
    touchStartRef.current = {
      time: now,
      x: e.clientX,
      y: e.clientY,
    };
    currentPointerEventRef.current = e;
    const initialSel = getActiveSelectionText();
    touchStartSelectionRef.current = initialSel;
    try {
      sessionStorage.setItem('bigbang_pressing', 'true');
      if (initialSel) {
        savePendingSelection(initialSel, undefined, location);
      }
    } catch (_) {}
    lastPhaseRef.current = 'whitehole';
    lastEventHorizonModeRef.current = undefined;
    lastSectorRef.current = -1;
    lastStageRef.current = 1;
    lastUpdateGaugeRef.current = 0.08;
    lastStateUpdateTimeRef.current = now;
    lastHoleRef.current = 'whitehole';

    // 신규 터치 시작 시 웜홀/맥락 후보 캐시 초기화
    resetActiveWormholePeek();
    resetActiveContextPeek();

    // 터치 시작 시 단 한 번만 직렬화하여 캐싱 (매 16ms마다 I/O 파싱 방지)
    const context = serializeCurrentView(location);
    cachedContextRef.current = context;

    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setDragAngleDeg(0);
    setRadialSectorIndex(-1);
    setActiveHole('whitehole');
    setIsPressing(true);
    setIsAborted(false);
    setActivePhase('whitehole');
    setGauge(0.08);
    setDurationMs(0);

    const initialMetrics = calculateWarpMetrics(
      now,
      now,
      e.clientX,
      e.clientY,
      e.clientX,
      e.clientY,
      e
    );
    const target = synthesizeWarpTarget(context, initialMetrics);
    setCurrentTarget(target);

    // ☀️ 가벼운 탭 진입 시 화이트홀 빛비춤 햅틱 및 사운드
    omniWarpAudio.playWhiteHole();
    triggerHaptic('whitehole');

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateLoop);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressing || !touchStartRef.current) return;
    currentPointerEventRef.current = e;
  };

  // ⚡ 추천 1순위 즉시 도약 헬퍼 (더블탭 시 실행 - 루시와 Key는 엄격 제외)
  const goToNextRecommended = useCallback((customContext?: any, customMetrics?: any) => {
    // 대기 중인 1회 탭(홈 이동) 타이머 즉시 취소
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    lastTapTimeRef.current = 0;

    // 🌟 더블탭: 추천 1순위 웜홀 사운드 & 햅틱
    omniWarpAudio.playDoubleTap();
    triggerHaptic('wormhole');

    const textToToss = touchStartSelectionRef.current || getActiveSelectionText();
    const { menu: targetMenu, reason, stats, safePath } = commitNextRecommendedMenuByCycle(
      location,
      textToToss || undefined
    );

    // 🛡️ 실존 페이지 및 워프 불가 목적지 검증 (루시/Key 엄격 제외 보장)
    const isExcluded = (p: string, id: string) => {
      const lower = `${p} ${id}`.toLowerCase();
      return (
        lower.includes('chat') ||
        lower.includes('lucy') ||
        lower.includes('key') ||
        lower.includes('calm')
      );
    };

    let finalSafePath = safePath;
    let finalMenu = targetMenu;

    if (
      !isValidPrismPath(finalSafePath) ||
      isDisallowedWarpDestination(finalMenu.id) ||
      isDisallowedWarpDestination(finalSafePath) ||
      isExcluded(finalSafePath, finalMenu.id)
    ) {
      console.warn(`[DoubleTapRecommend] Filtered restricted path: ${finalSafePath}`);
      const fallback = PRISM_ALL_APP_DESTINATIONS.find(
        (d) => d.tossTargetId === 'trinity' || d.basePath === '/trinity'
      ) || PRISM_ALL_APP_DESTINATIONS[0];
      finalSafePath = fallback.path;
      finalMenu = fallback;
    }

    const cycleLabel = stats.isFullCycleCompleted
      ? `새 순환 ${stats.cycleIndex}회차`
      : `순환 ${stats.visitedCount}/${stats.totalCount}`;

    const previewLabel = textToToss
      ? `[추천 1위 토스 · ${cycleLabel}] ${finalMenu.name}`
      : `[추천 1위 도약 · ${cycleLabel}] ${finalMenu.name}`;

    const previewDescription = textToToss
      ? `"${textToToss.slice(0, 20)}..." ➔ ${finalMenu.name} 즉시 실행`
      : reason;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prism:bigbang_commit', {
          detail: {
            phase: 'wormhole',
            target: {
              id: finalMenu.id,
              name: finalMenu.name,
              destinationPath: finalSafePath,
              themeColor: finalMenu.themeColor,
              icon: finalMenu.emoji,
              previewLabel,
              previewDescription,
              cycleStats: stats,
            },
            context: customContext || serializeCurrentView(location),
            metrics: customMetrics,
            timestamp: Date.now(),
          },
        })
      );
    }

    if (textToToss) {
      tossSelectionToMenu(textToToss, finalMenu, location, (targetPath) => {
        if (isKeySite) {
          window.location.href = targetPath;
        } else {
          navigate(targetPath);
          window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: targetPath } }));
          window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: targetPath } }));
        }
      });
    } else {
      if (isKeySite) {
        window.location.href = finalSafePath;
      } else {
        navigate(finalSafePath);
        window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: finalSafePath } }));
        window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: finalSafePath } }));
        if (finalSafePath.includes('?tab=')) {
          const tabName = finalSafePath.split('?tab=')[1]?.split('&')[0];
          if (tabName) {
            sessionStorage.setItem('prism_target_tab', tabName);
            window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: tabName } }));
          }
        }
      }
    }

    touchStartSelectionRef.current = '';
    setActivePhase('idle');
    setGauge(0);
    setDurationMs(0);
    resetActiveContextPeek();
  }, [location, navigate, getActiveSelectionText, isKeySite]);

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement> | PointerEvent) => {
    cleanupGlobalPointerListeners();
    if (!touchStartRef.current) return;

    try {
      if ('currentTarget' in e && (e.currentTarget as any)?.releasePointerCapture) {
        (e.currentTarget as any).releasePointerCapture((e as any).pointerId);
      }
    } catch (_) {}

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const start = touchStartRef.current;
    const now = performance.now();
    const duration = now - start.time;
    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;
    const dist = Math.hypot(deltaX, deltaY);

    const metrics = calculateWarpMetrics(
      start.time,
      now,
      start.x,
      start.y,
      e.clientX,
      e.clientY,
      e
    );

    setIsPressing(false);
    touchStartRef.current = null;
    currentPointerEventRef.current = null;
    cachedContextRef.current = null;
    lastStageRef.current = 1;
    lastSectorRef.current = -1;
    lastHoleRef.current = 'whitehole';
    lastEventHorizonModeRef.current = undefined;
    stopBlackHoleContinuousHaptic();
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setDragAngleDeg(0);
    setRadialSectorIndex(-1);
    try {
      sessionStorage.removeItem('bigbang_pressing');
    } catch (_) {}

    if (metrics.isAborted || isAborted) {
      omniWarpAudio.playAbort();
      triggerHaptic('abort');
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      setIsAborted(false);
      resetActiveWormholePeek();
      return;
    }

    setIsAborted(false);
    const context = serializeCurrentView(location);

    // 버튼 영역 내부인지 정밀 판별 (버튼 bounding rect 기준)
    const isWithinButton = (() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        return distFromCenter <= (rect.width / 2) + 6;
      }
      return dist <= 44;
    })();

    // [1] 제자리 탭 (360ms 미만 및 제자리 영역 dist < 30 또는 버튼 내부 터치)
    const isTapGesture = (duration < 360 && dist < 30) || (duration < 320 && isWithinButton);
    if (isTapGesture) {
      const nowMs = performance.now();
      const timeSinceLastTap = nowMs - lastTapTimeRef.current;

      // 🎯 더블탭 감지 (이전 탭 후 30ms ~ 380ms 이내 재탭 시): 추천 1순위 즉시 도약! (루시/Key 엄격 제외)
      if (timeSinceLastTap > 30 && timeSinceLastTap < 380) {
        goToNextRecommended(context, metrics);
        return;
      }

      // ☀️ 첫 번째 탭: 더블탭 입력 대기 (240ms) 후 싱글탭(홈으로 이동) 실행
      lastTapTimeRef.current = nowMs;

      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }

      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        triggerHaptic('whitehole');
        omniWarpAudio.playWhiteHole();

        // ☀️ 제자리 탭: 럭키 프롤로그 홈('/')으로 즉시 복귀!
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('prism:bigbang_commit', {
              detail: {
                phase: 'whitehole',
                target: {
                  id: 'hub',
                  name: '홈 베이스캠프',
                  destinationPath: '/',
                  themeColor: '#38bdf8',
                  eventHorizonMode: 'whitehole',
                },
                context,
                metrics: { ...metrics, phase: 'whitehole' },
                timestamp: Date.now(),
              },
            })
          );
        }

        if (location === '/' || location === '') {
          // 이미 홈 화면일 때는 최상단으로 부드럽게 스크롤
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          // 다른 화면일 때는 홈('/')으로 즉시 이동
          if (
            typeof window !== 'undefined' &&
            (window.location.pathname.includes('key') ||
              window.location.pathname.includes('calm') ||
              window.location.pathname.includes('orb'))
          ) {
            window.location.href = '/';
          } else {
            navigate('/');
            window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/' } }));
            window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/' } }));
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }
      }, 240);

      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      return;
    }

    // 홀드/드래그 발생 시 더블탭 타이머 및 기록 리셋
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    lastTapTimeRef.current = 0;

    // [2] 홀드 (300ms 이상) 또는 드래그 릴리즈 분기
    const textToToss = touchStartSelectionRef.current || getActiveSelectionText();

    // 🔑 [드래그: dist >= 20] ➔ Key (마음약방 & 40가지 연습) 도약!
    if (dist >= 20) {
      triggerHaptic('blackhole');
      omniWarpAudio.playBlackHole();

      // 🔑 텍스트 드래그(선택) 연동: 글자를 스크롤/선택한 상태에서 드래그 ➔ Key 40가지 연습으로 즉시 토스!
      if (textToToss) {
        savePendingSelection(textToToss, 'key', location);
        try {
          sessionStorage.setItem('key_tossed_text', textToToss);
          sessionStorage.setItem('key_target_tab', 'tab-exercises');
        } catch (_) {}
        sendPrismToss({
          sourceApp: location || 'bigbang_button',
          targetApp: 'key',
          actionType: 'smart_toss',
          contextMessage: textToToss,
          autoPrompt: textToToss,
          tossedAt: Date.now(),
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('prism:selection_tossed', {
              detail: { text: textToToss, target: 'key', sourcePath: location },
            })
          );
          window.dispatchEvent(
            new CustomEvent('prism:selection_saved', {
              detail: { text: textToToss, target: 'key', sourcePath: location },
            })
          );
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('prism:bigbang_commit', {
            detail: {
              phase: 'blackhole',
              target: {
                id: 'key',
                name: 'Key',
                destinationPath: '/key',
                themeColor: '#0ea5e9',
                eventHorizonMode: 'blackhole',
                previewLabel: '[드래그 도약] Key 마음약방',
                previewDescription: '제이미 저커먼 도서 연동 마음 치유 동반자 & 40가지 소매틱 연습',
              },
              context,
              metrics: { ...metrics, phase: 'blackhole' },
              timestamp: Date.now(),
            },
          })
        );
      }

      setTimeout(() => {
        if (isKeySite && !textToToss) {
          // Key 사이트에서 드래그 시 홈 귀환
          const returnPath = safeSessionStorage.getItem('prism_key_return_path') || '/';
          safeSessionStorage.removeItem('prism_key_return_path');
          const finalDest =
            returnPath.includes('key') || returnPath.includes('calm') || returnPath.includes('orb')
              ? '/'
              : returnPath;
          window.location.href = finalDest;
        } else {
          // Key 사이트로 도약
          const currentPath = location || '/';
          safeSessionStorage.setItem('prism_key_return_path', currentPath);
          if (isKeySite) {
            window.location.href = '/key';
          } else {
            navigate('/key');
            window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/key' } }));
            window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/key' } }));
          }
        }
      }, 240);

      touchStartSelectionRef.current = '';
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      resetActiveContextPeek();
      return;
    }

    // 💬 [홀드: dist < 20] ➔ 루시 (/chat 1:1 대화) 소환!
    triggerHaptic('whitehole');
    omniWarpAudio.playWhiteHole();

    // 🌟 텍스트 드래그(선택) 연동: 글자를 스크롤/선택한 상태에서 빅뱅 홀드 ➔ 루시에게 즉시 토스!
    if (textToToss) {
      savePendingSelection(textToToss, 'lucy', location);
      try {
        sessionStorage.setItem(
          'lucy_injected_auto_send',
          `[선택 내용 토스 질의]\n"${textToToss}"\n\n이 내용에 대해 핵심 분석과 실천적인 마음 치유 및 지혜 조언을 해줘.`
        );
        sessionStorage.setItem('lucy_injected_input_draft', textToToss);
      } catch (_) {}
      sendPrismToss({
        sourceApp: location || 'bigbang_button',
        targetApp: 'lucy',
        actionType: 'smart_toss',
        contextMessage: textToToss,
        autoPrompt: textToToss,
        tossedAt: Date.now(),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('prism:selection_tossed', {
            detail: { text: textToToss, target: 'lucy', sourcePath: location },
          })
        );
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prism:bigbang_commit', {
          detail: {
            phase: 'whitehole',
            target: {
              id: 'lucy',
              name: '루시 1:1 대화',
              destinationPath: '/chat',
              themeColor: '#fde68a',
              eventHorizonMode: 'whitehole',
              previewLabel: '[홀드 소환] 루시 1:1 대화',
              previewDescription: '마음의 안식처 루시와 나누는 따뜻한 대화와 지혜 조언',
            },
            context,
            metrics: { ...metrics, phase: 'whitehole' },
            timestamp: Date.now(),
          },
        })
      );
    }

    setTimeout(() => {
      if (isChatView && !textToToss) {
        // 채팅 화면에서 홀드 시 이전 페이지 귀환
        const returnPath = safeSessionStorage.getItem('prism_chat_return_path') || '/';
        safeSessionStorage.removeItem('prism_chat_return_path');
        const finalDest = returnPath.includes('chat') ? '/' : returnPath;
        if (isKeySite) {
          window.location.href = finalDest;
        } else {
          navigate(finalDest);
          window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: finalDest } }));
          window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: finalDest } }));
        }
      } else {
        // 루시 채팅방으로 입장
        const currentPath = location || '/';
        safeSessionStorage.setItem('prism_chat_return_path', currentPath);
        if (isKeySite) {
          window.location.href = '/chat';
        } else {
          navigate('/chat');
          window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
          window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/chat' } }));
        }
      }
    }, 240);

    touchStartSelectionRef.current = '';
    setActivePhase('idle');
    setGauge(0);
    setDurationMs(0);
  };

  const handlePointerCancel = () => {
    cleanupGlobalPointerListeners();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    stopBlackHoleContinuousHaptic();
    setIsPressing(false);
    setIsAborted(false);
    touchStartRef.current = null;
    currentPointerEventRef.current = null;
    cachedContextRef.current = null;
    lastStageRef.current = 1;
    lastSectorRef.current = -1;
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setDragAngleDeg(0);
    setRadialSectorIndex(-1);
    setActivePhase('idle');
    setGauge(0);
    setDurationMs(0);
    touchStartSelectionRef.current = '';
    try {
      sessionStorage.removeItem('bigbang_pressing');
    } catch (_) {}
  };

  useEffect(() => {
    const handleGlobalCancel = () => {
      if (touchStartRef.current) {
        handlePointerCancel();
      }
    };
    window.addEventListener('pointercancel', handleGlobalCancel);
    window.addEventListener('blur', handleGlobalCancel);
    return () => {
      window.removeEventListener('pointercancel', handleGlobalCancel);
      window.removeEventListener('blur', handleGlobalCancel);
      stopBlackHoleContinuousHaptic();
      cleanupGlobalPointerListeners();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 🌟 위상 판별: 화이트홀(빛비춤), 블랙홀(어두운 심연) - 미러홀 완전 제거
  const isWhiteholeMode =
    activeHole === 'whitehole' ||
    activePhase === 'whitehole' ||
    (activePhase === 'event_horizon' && currentTarget?.eventHorizonMode === 'whitehole');

  const isBlackholeMode =
    activeHole === 'blackhole' ||
    activePhase === 'blackhole' ||
    (activePhase === 'event_horizon' && currentTarget?.eventHorizonMode === 'blackhole');

  // 🎯 현재 활성화된 목적지의 상징 아이콘 식별자 결정 (프리즘 메인 아이콘 규격)
  const activeAppId = (() => {
    if (isAborted) return 'aborted';
    // 🌀 웜홀 상태 (버튼영역내 제자리 제외): 옴니워프 유니버스 아이콘
    if (activePhase === 'wormhole') return 'omniwarp';
    // 🌌 사건의 지평선 상태 (조준 중): 해당 조준 채널의 아이콘을 최우선으로 표출!
    if (radialSectorIndex >= 0) return RADIAL_WARP_APPS[radialSectorIndex]?.id || 'hub';
    // 🔑 드래그 시: Key 마음약방
    if (dragDistance >= 20) return 'key';
    // 💬 제자리 홀드 - 채팅 화면에서는 프리즘 홈 귀환
    if (isChatView) return 'hub';
    // 💬 제자리 홀드 - 일반 화면에서는 루시 1:1 대화
    return 'lucy';
  })();

  const activeAppName = (() => {
    if (isAborted) return '취소';
    // 🌀 웜홀 상태: 추천 1순위 차원 도약
    if (activePhase === 'wormhole') return '추천 1순위 차원 도약';
    // 🌌 사건의 지평선 상태 (조준 중): 해당 조준 채널 및 서브메뉴 명칭 표출
    if (radialSectorIndex >= 0) {
      const channel = RADIAL_WARP_APPS[radialSectorIndex];
      const subTitle = currentTarget?.title || '';
      return subTitle ? `${channel?.name || ''} · ${subTitle}` : (channel?.name || '');
    }
    // 🔑 드래그 시: Key 마음약방 도약
    if (dragDistance >= 20) return 'Key (마음약방 도약)';
    // 💬 제자리 홀드 - 채팅 화면에서는 프리즘 귀환
    if (isChatView) return '프리즘 귀환 (채팅 나가기)';
    // 💬 제자리 홀드 - 일반 화면에서는 루시 대화
    return '루시 (1:1 마음 대화)';
  })();

  return (
    <>
      {/* 🚀 Crystal Ball Big Bang Button (군더더기 없는 현대적이고 웅장한 대형 코스믹 아티팩트) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[350] pointer-events-none flex items-center justify-center select-none bottom-safe-fab"
      >
        <div
          className="group relative flex flex-col items-center justify-center pointer-events-auto select-none"
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {/* 🌟 텍스트 선택(스크롤) 시 4대 토스 경로 안내 뱃지 표출 */}
          <AnimatePresence>
            {hasSelectionToss && !isPressing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-950/95 backdrop-blur-xl border border-cyan-400/60 text-[10px] font-bold text-cyan-200 shadow-[0_4px_24px_rgba(0,240,255,0.45)] pointer-events-none flex items-center gap-1.5 z-50 animate-pulse ring-1 ring-cyan-400/40"
              >
                <span className="text-xs">✨</span>
                <span className="text-sky-300 font-black">탭</span><span className="text-slate-300">▸홈</span>
                <span className="text-slate-500">│</span>
                <span className="text-purple-300 font-black">더블탭</span><span className="text-slate-300">▸추천1위</span>
                <span className="text-slate-500">│</span>
                <span className="text-yellow-300 font-black">홀드</span><span className="text-slate-300">▸루시</span>
                <span className="text-slate-500">│</span>
                <span className="text-cyan-300 font-black">드래그</span><span className="text-slate-300">▸Key</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎯 드래그 시 실시간 맥락 추천 순환(Cycle) HUD 칩 */}
          <AnimatePresence>
            {isPressing && dragDistance >= 38 && !isAborted && !isPageScrolling && currentTarget && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center whitespace-nowrap select-none"
              >
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_24px_rgba(56,189,248,0.4)]">
                  <PrismAppIcon
                    nameOrId={currentTarget.id || currentTarget.destinationPath || currentTarget.name || currentTarget.title}
                    size={18}
                    className="shrink-0 drop-shadow"
                    color={currentTarget.themeColor || '#38bdf8'}
                  />
                  <span className="text-xs font-bold text-white tracking-tight">
                    {currentTarget.title || currentTarget.name}
                  </span>
                  {currentTarget.cycleStats && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-400/40">
                      {currentTarget.cycleStats.isFullCycleCompleted
                        ? `새 순환 ${currentTarget.cycleStats.cycleIndex}회차`
                        : `순환 ${currentTarget.cycleStats.visitedCount}/${currentTarget.cycleStats.totalCount}`}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-cyan-200/90 font-medium mt-1 px-2.5 py-0.5 bg-black/60 rounded-md backdrop-blur-sm drop-shadow max-w-[260px] truncate text-center">
                  {currentTarget.previewDescription || '손을 떼면 즉시 차원 도약합니다'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎯 버튼 & 궤도 정밀 센터링 앵커 (대형 코스믹 아티팩트 규격 76~84px) */}
          <div className="relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] flex items-center justify-center shrink-0">

            {/* 🌟 빅뱅 아케인 마법진 매트릭스 (하드웨어 가속, 상시 렌더링 및 누를 때 공명 가속) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <BigBangCircularMeter
                isPressing={isPressing}
                isHovered={isHovered}
                gauge={gauge}
                durationMs={durationMs}
                activePhase={activePhase}
                isAborted={isAborted}
              />
            </div>

            {/* Ambient Gravitational Ripple Waves - active on hover to prevent continuous mobile composite thrashing */}
            {activePhase === 'idle' && isHovered && (
              <>
                <div className="absolute -inset-2.5 rounded-full border border-cyan-400/25 animate-ping opacity-20 pointer-events-none z-0" />
                <div className="absolute -inset-4 rounded-full border border-purple-400/15 animate-pulse opacity-30 pointer-events-none z-0" />
              </>
            )}


            {/* 🎯 빅뱅 차원 수렴 인터랙션 (군더더기 없는 현대적이고 신비로운 코스믹 아케인 버튼) */}
            <motion.button
              ref={buttonRef}
              id="bigbang-omnibutton"
              data-bigbang="true"
              type="button"
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goToNextRecommended();
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                x: isPressing
                  ? isAborted
                    ? (dragDistance > 0 ? (dragOffset.x * Math.min(dragDistance * 0.7, 48)) / dragDistance : 0)
                    : (dragDistance > 0 ? (dragOffset.x * Math.min(dragDistance * 0.6, 40)) / dragDistance : 0)
                  : 0,
                y: isPressing
                  ? isAborted
                    ? (dragDistance > 0 ? (dragOffset.y * Math.min(dragDistance * 0.7, 48)) / dragDistance : 0)
                    : (dragDistance > 0 ? (dragOffset.y * Math.min(dragDistance * 0.6, 40)) / dragDistance : 0)
                  : 0,
                scale: isPressing
                  ? (1.04 + gauge * 0.08)
                  : 1.0,
              }}
              transition={{
                duration: 0.08,
              }}
              className={`w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full flex flex-col items-center justify-center shrink-0 cursor-pointer outline-none relative overflow-hidden transition-all duration-200 border will-change-transform z-30 touch-none select-none ${
                isPressing && isAborted
                  ? 'opacity-70 border-red-500/70 shadow-[0_0_24px_rgba(239,68,68,0.5)]'
                  : isPressing && activePhase === 'wormhole'
                  ? 'border-emerald-300/90 shadow-[0_0_40px_rgba(52,211,153,0.9),0_0_24px_rgba(6,182,212,0.7),inset_0_0_26px_rgba(52,211,153,0.7)]'
                  : isPressing && isWhiteholeMode
                  ? 'border-amber-100/95 shadow-[0_0_40px_rgba(255,255,255,0.95),0_0_28px_rgba(254,240,138,0.8),inset_0_0_24px_rgba(255,255,255,0.9)]'
                  : isPressing && isBlackholeMode
                  ? 'border-purple-900/90 shadow-[0_0_40px_rgba(0,0,0,1),0_0_24px_rgba(147,51,234,0.6),inset_0_0_28px_rgba(0,0,0,1)]'
                  : isPressing
                  ? 'border-cyan-300/80 shadow-[0_0_32px_rgba(56,189,248,0.45),inset_0_0_22px_rgba(56,189,248,0.35)]'
                  : 'border-cyan-400/40 hover:border-cyan-300/80 shadow-[0_0_24px_rgba(56,189,248,0.3)]'
              }`}
              style={{
                touchAction: 'none',
                userSelect: 'none',
                background: isPressing && isAborted
                  ? 'radial-gradient(circle at 40% 35%, #1f0b0f 0%, #0d0406 55%, #040102 100%)'
                  : isPressing && activePhase === 'wormhole'
                  ? 'radial-gradient(circle at 50% 50%, #ffffff 0%, #38bdf8 20%, #a855f7 42%, #0e051e 68%, #000000 100%)'
                  : isPressing && isWhiteholeMode
                  ? 'radial-gradient(circle at 40% 30%, #ffffff 0%, #fef3c7 35%, #fde68a 65%, #f59e0b 100%)'
                  : isPressing && isBlackholeMode
                  ? 'radial-gradient(circle at 50% 50%, #000000 0%, #040308 45%, #090514 80%, #020104 100%)'
                  : isPressing
                  ? 'radial-gradient(circle at 35% 30%, #171833 0%, #0e0f21 45%, #060712 80%, #020207 100%)'
                  : 'radial-gradient(circle at 35% 30%, #171833 0%, #0e0f21 45%, #060712 80%, #020207 100%)',
                boxShadow: isPressing && isAborted
                  ? 'inset 0 0 20px rgba(239, 68, 68, 0.4), 0 0 24px rgba(239, 68, 68, 0.5)'
                  : isPressing && activePhase === 'wormhole'
                  ? 'inset 0 0 25px rgba(52, 211, 153, 0.9), 0 0 35px rgba(6, 182, 212, 0.85)'
                  : isPressing && isWhiteholeMode
                  ? 'inset 0 0 25px rgba(255, 255, 255, 0.95), 0 0 35px rgba(253, 230, 138, 0.9)'
                  : isPressing && isBlackholeMode
                  ? 'inset 0 0 30px rgba(0, 0, 0, 1), inset 0 0 15px rgba(88, 28, 135, 0.5), 0 0 40px rgba(0, 0, 0, 0.95)'
                  : isPressing
                  ? 'inset 0 0 22px rgba(56, 189, 248, 0.35), inset -6px -6px 18px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.45)'
                  : 'inset 0 0 22px rgba(56, 189, 248, 0.25), inset -6px -6px 18px rgba(0, 0, 0, 0.9), 0 0 24px rgba(56, 189, 248, 0.3)',
              }}
              title="빅뱅 버튼 (탭: 홈 / 더블탭: 추천 1순위 / 홀드: 루시 / 드래그: Key)"
              aria-label={
                hasSelectionToss
                  ? '빅뱅 버튼 · 선택 내용 토스 대기중'
                  : '빅뱅 버튼 · 탭: 홈, 더블탭: 추천 1순위, 홀드: 루시, 드래그: Key'
              }
            >
              {/* 🌀 [웜홀] 빛비춤 + 어두운 심연 + 사건의 지평선 3원 동시 융합 전개 */}
              {isPressing && activePhase === 'wormhole' && (
                <>
                  {/* 🕳️ 심연: 외곽 암흑 흡입 파동 (Blackhole Suction) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-suction-wave-1 opacity-80 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(147,51,234,0.45)_65%,black_100%)]" />
                  {/* ☀️ 빛비춤: 중심 찬란한 성광 회전 광선 (Whitehole Rays) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-rays-spin opacity-85 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.95)_0deg,transparent_60deg,rgba(254,240,138,0.85)_120deg,transparent_180deg,rgba(255,255,255,0.95)_240deg,transparent_300deg,rgba(255,255,255,0.95)_360deg)]" />
                  {/* 🌌 사건의 지평선: 빛과 어둠이 교차하는 상대론적 소용돌이 (Event Horizon Accretion Vortex) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-wormhole-vortex opacity-90 bg-[conic-gradient(from_0deg,rgba(56,189,248,0.9)_0deg,transparent_45deg,rgba(168,85,247,0.85)_90deg,transparent_135deg,rgba(52,211,153,0.85)_180deg,transparent_225deg,rgba(255,255,255,0.95)_270deg,transparent_315deg,rgba(56,189,248,0.9)_360deg)]" />
                </>
              )}

              {/* 홀드 시 블랙홀: 피어오르는 자욱한 검은 연기 소용돌이 (Dense Black Smoke Plumes) */}
              {isPressing && isBlackholeMode && (
                <>
                  {/* 외곽으로 뿜어져 퍼지는 자욱한 검은 연기 베일 */}
                  <div className="absolute -inset-4 rounded-full pointer-events-none blackhole-smoke-swirl-cw opacity-90 blur-[10px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.98)_0%,rgba(15,10,24,0.9)_50%,transparent_80%)]" />
                  <div className="absolute -inset-6 rounded-full pointer-events-none blackhole-smoke-swirl-ccw opacity-85 blur-[14px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(24,16,36,0.85)_55%,transparent_85%)]" />
                  {/* 내부에서 소용돌이치는 칠흑 먹구름 와류 */}
                  <div className="absolute inset-0 rounded-full pointer-events-none animate-[spin_3s_linear_infinite] opacity-95 bg-[conic-gradient(from_0deg,rgba(0,0,0,1)_0deg,rgba(25,18,36,0.85)_90deg,rgba(0,0,0,1)_180deg,rgba(15,10,24,0.9)_270deg,rgba(0,0,0,1)_360deg)]" />
                </>
              )}

              {/* 탭 시 화이트홀 찬란한 빛비춤 방사광 (Starlight Rays) */}
              {isPressing && isWhiteholeMode && (
                <div className="absolute inset-0 rounded-full pointer-events-none bigbang-rays-spin opacity-85 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.95)_0deg,transparent_60deg,rgba(254,240,138,0.85)_120deg,transparent_180deg,rgba(255,255,255,0.95)_240deg,transparent_300deg,rgba(255,255,255,0.95)_360deg)]" />
              )}

              {/* 기본 대기 상태일 때의 은은한 회전 볼텍스 링 */}
              {!isPressing && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none z-10 transition-opacity duration-200 animate-[spin_12s_linear_infinite] opacity-40"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(168,85,247,0.6) 0deg, rgba(15,17,36,0.9) 120deg, rgba(192,132,252,0.5) 240deg, rgba(168,85,247,0.6) 360deg)',
                  }}
                />
              )}

              {/* Event Horizon Deep Singularity Core (크리스탈 구체의 코어 - 화이트홀/블랙홀/웜홀 반응) */}
              <div
                className="absolute inset-2.5 sm:inset-3 rounded-full z-15 pointer-events-none transition-all duration-200 overflow-hidden flex items-center justify-center"
                style={{
                  background: isPressing && activePhase === 'wormhole'
                    ? 'radial-gradient(circle at 45% 35%, #052e16 0%, #064e3b 50%, #022c22 100%)'
                    : isPressing && isWhiteholeMode
                    ? 'radial-gradient(circle at 45% 35%, #ffffff 0%, #fef08a 45%, #f59e0b 100%)'
                    : isPressing && isBlackholeMode
                    ? 'radial-gradient(circle at 50% 50%, #000000 0%, #020206 55%, #05040b 100%)'
                    : 'radial-gradient(circle at 45% 35%, #101228 0%, #090a1a 55%, #03030a 100%)',
                  boxShadow: isPressing && activePhase === 'wormhole'
                    ? '0 0 18px rgba(52, 211, 153, 0.8), inset 0 0 14px rgba(6, 182, 212, 0.7)'
                    : isPressing && isWhiteholeMode
                    ? '0 0 20px rgba(255, 255, 255, 1), inset 0 0 10px rgba(255, 255, 255, 0.9)'
                    : isPressing && isBlackholeMode
                    ? 'inset 0 0 24px rgba(0, 0, 0, 1)'
                    : 'inset 0 0 16px rgba(0, 0, 0, 0.95)',
                }}
              />

              {/* 🎯 Big Bang Center: 순수 코스믹 싱귤래리티 코어 (아이콘 없이 순수 빛과 에너지 집중) */}
              <div className="relative z-20 w-full h-full rounded-full flex items-center justify-center text-center select-none pointer-events-none">
                <div className="relative flex items-center justify-center pointer-events-none">
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      isPressing
                        ? activePhase === 'wormhole'
                          ? 'w-4 h-4 bg-cyan-200 blur-[0.5px] shadow-[0_0_14px_#38bdf8]'
                          : isWhiteholeMode
                          ? 'w-4 h-4 bg-white blur-[0.5px] shadow-[0_0_18px_#ffffff]'
                          : isBlackholeMode
                          ? 'w-3 h-3 bg-black border border-purple-400/60 shadow-[0_0_12px_#000000]'
                          : 'w-3.5 h-3.5 bg-cyan-300/90 blur-[0.5px] shadow-[0_0_10px_#38bdf8]'
                        : 'w-2.5 h-2.5 bg-cyan-300/80 blur-[1px] animate-pulse'
                    }`}
                  />
                  <div
                    className={`absolute rounded-full border border-cyan-400/30 transition-all duration-300 ${
                      isPressing ? 'w-8 h-8 scale-110 opacity-70' : 'w-5 h-5 animate-ping opacity-40'
                    }`}
                  />
                  <div
                    className={`absolute rounded-full border border-purple-400/20 transition-all duration-300 ${
                      isPressing ? 'w-12 h-12 scale-115 opacity-60' : 'w-8 h-8 animate-pulse opacity-30'
                    }`}
                  />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
