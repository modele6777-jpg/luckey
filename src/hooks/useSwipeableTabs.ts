import { useState, useCallback, useEffect } from 'react';
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

/** Tab buttons and explicit navigation events remain; touch gestures never change tabs. */
export function useSwipeableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  enabled = true,
  enableHaptics = true,
  loop = true,
}: UseSwipeableTabsOptions<T>) {
  const [direction, setDirection] = useState<1 | -1>(1);
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
    swipeHandlers: {},
  };
}
