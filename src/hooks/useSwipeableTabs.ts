import { useState, useCallback, useEffect, useRef } from 'react';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface UseSwipeableTabsOptions<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (newTab: T, direction: 1 | -1) => void;
  minSwipeDistance?: number;
  minSwipeRatio?: number;
  requireEdgeReach?: boolean;
  maxPerpendicularRatio?: number;
  enabled?: boolean;
  enableHaptics?: boolean;
  loop?: boolean;
}

/**
 * 🛡️ 탭 내비게이션 및 스와이프 제스처 훅
 * - 화면 끝까지 스와이프(Edge Reach) 시에만 동일 앱 내 탭(DApp) 전환 지원
 * - 세로 스크롤 및 카드 드래그 시 사선 간섭 철저 차단 (absX > absY * 1.8)
 * - 텍스트 입력창, 슬라이더, 가로 칩 스크롤 영역 터치 시 스와이프 자동 무시
 * - 방향성 슬라이드 전환(direction, changeTabWithDirection) 및 글로벌 이벤트 연동
 */
export function useSwipeableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  minSwipeDistance = 80,
  minSwipeRatio = 0.35,
  requireEdgeReach = true,
  maxPerpendicularRatio = 1.8,
  enabled = true,
  enableHaptics = true,
  loop = true,
}: UseSwipeableTabsOptions<T>) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    shouldIgnore: boolean;
  } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!enabled || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      // 텍스트 입력창, 슬라이더, 가로 스크롤 컨테이너(.overflow-x-auto, [data-horizontal-scroll] 등), 노스와이프 영역 터치 시 무시
      const isInteractive = target?.closest(
        'input, textarea, select, [role="slider"], .no-swipe, [data-no-swipe], audio, video, .overflow-x-auto, .overflow-x-scroll, [data-horizontal-scroll]'
      );

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        shouldIgnore: Boolean(isInteractive),
      };
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;
      if (touchStartRef.current.shouldIgnore) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.changedTouches?.[0];
      if (!touch) {
        touchStartRef.current = null;
        return;
      }

      const startX = touchStartRef.current.x;
      const startY = touchStartRef.current.y;
      const startTime = touchStartRef.current.time;
      touchStartRef.current = null;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const deltaTime = Date.now() - startTime;

      // 제스처 유효 시간 (50ms ~ 1200ms)
      if (deltaTime > 1200 || deltaTime < 50) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 390;
      const effectiveMinDist = Math.max(minSwipeDistance, screenWidth * minSwipeRatio);

      // 명확한 수평 스와이프인지 확인 (세로 스크롤 중 사선 터치 방지)
      if (absX >= effectiveMinDist && absX > absY * maxPerpendicularRatio) {
        // 🛡️ 화면 끝까지 스와이프(Edge Reach) 조건 검증:
        // 좌 스와이프(다음 탭): 종점이 좌측 28% 이내 도달 or 화면 폭 55% 이상 횡단
        // 우 스와이프(이전 탭): 종점이 우측 72% 이상 도달 or 화면 폭 55% 이상 횡단
        if (requireEdgeReach) {
          const reachedLeftEdge = touch.clientX <= screenWidth * 0.28 || absX >= screenWidth * 0.55;
          const reachedRightEdge = touch.clientX >= screenWidth * 0.72 || absX >= screenWidth * 0.55;
          if (deltaX < 0 && !reachedLeftEdge) return;
          if (deltaX > 0 && !reachedRightEdge) return;
        }

        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex === -1) return;

        if (deltaX < 0) {
          // 👈 좌로 스와이프 -> 다음 탭
          let nextIndex = currentIndex + 1;
          if (nextIndex >= tabs.length) {
            if (!loop) return;
            nextIndex = 0;
          }
          const nextTab = tabs[nextIndex];
          setDirection(1);
          if (enableHaptics) {
            try { playAudioHaptic('tap_light'); } catch (_) {}
          }
          onTabChange(nextTab, 1);
        } else {
          // 👉 우로 스와이프 -> 이전 탭
          let prevIndex = currentIndex - 1;
          if (prevIndex < 0) {
            if (!loop) return;
            prevIndex = tabs.length - 1;
          }
          const prevTab = tabs[prevIndex];
          setDirection(-1);
          if (enableHaptics) {
            try { playAudioHaptic('tap_light'); } catch (_) {}
          }
          onTabChange(prevTab, -1);
        }
      }
    },
    [enabled, minSwipeDistance, minSwipeRatio, requireEdgeReach, maxPerpendicularRatio, tabs, activeTab, onTabChange, enableHaptics, loop]
  );

  const changeTabWithDirection = useCallback(
    (newTab: T) => {
      const currentIndex = tabs.indexOf(activeTab);
      const nextIndex = tabs.indexOf(newTab);
      const newDir: 1 | -1 = nextIndex >= currentIndex ? 1 : -1;
      setDirection(newDir);
      onTabChange(newTab, newDir);
    },
    [tabs, activeTab, onTabChange]
  );

  // 글로벌 이벤트 연동 유지 (외부 호출 호환성)
  useEffect(() => {
    if (!enabled || !tabs.length) return;

    const handlePrev = () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex === -1) return;

      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        if (!loop) return;
        prevIndex = tabs.length - 1;
      }

      const prevTab = tabs[prevIndex];
      setDirection(-1);
      if (enableHaptics) {
        try { playAudioHaptic('tap_light'); } catch (_) {}
      }
      onTabChange(prevTab, -1);
    };

    const handleNext = () => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex + 1;
      if (nextIndex >= tabs.length) {
        if (!loop) return;
        nextIndex = 0;
      }

      const nextTab = tabs[nextIndex];
      setDirection(1);
      if (enableHaptics) {
        try { playAudioHaptic('tap_light'); } catch (_) {}
      }
      onTabChange(nextTab, 1);
    };

    window.addEventListener('prism:tab_prev', handlePrev);
    window.addEventListener('prism:tab_next', handleNext);
    return () => {
      window.removeEventListener('prism:tab_prev', handlePrev);
      window.removeEventListener('prism:tab_next', handleNext);
    };
  }, [tabs, activeTab, onTabChange, enabled, enableHaptics, loop]);

  return {
    direction,
    setDirection,
    changeTabWithDirection,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}
