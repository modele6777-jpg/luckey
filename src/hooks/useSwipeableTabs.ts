import { useState, useCallback } from 'react';

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
}

/**
 * 🛡️ 탭 내비게이션 훅 (화면 스와이프 탭 전환 전면 비활성화)
 * - 화면 스와이프로 인한 의도치 않은 탭 튕김 및 오동작을 원천 방지
 * - 탭 버튼 클릭 기반 방향성 슬라이드 전환(direction, changeTabWithDirection)만 안전하게 제공
 */
export function useSwipeableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
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

  return {
    direction,
    setDirection,
    changeTabWithDirection,
    swipeHandlers: {},
  };
}
