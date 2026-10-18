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

/**
 * 🛡️ 탭 내비게이션 훅
 * - 화면 본문 터치 제스처는 비활성화하여 스크롤/드래그 간섭 차단
 * - 빅뱅 버튼 가장자리 좌/우 룬 점 클릭(prism:tab_prev, prism:tab_next) 및 탭 버튼 클릭 연동
 * - 방향성 슬라이드 전환(direction, changeTabWithDirection) 제공
 */
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

  // 🚀 빅뱅 버튼 좌/우 룬 점 탭 전환 글로벌 이벤트 연동
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
