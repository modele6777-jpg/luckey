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
    (_e: React.TouchEvent | TouchEvent) => {
      // 댑(탭) 간의 스와이프 제스처로 인한 페이지 이동 비활성화 (상단/하단 버튼 클릭으로만 이동)
      touchStartRef.current = null;
    },
    []
  );

  const handleTouchEnd = useCallback(
    (_e: React.TouchEvent | TouchEvent) => {
      touchStartRef.current = null;
    },
    []
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
