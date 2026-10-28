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
 * - 동일 채널의 탭을 좌우 스와이프로 전환, 세로 스크롤·가로 캐러셀은 유지
 * - 세로 스크롤 및 카드 드래그 시 사선 간섭 철저 차단 (absX > absY * 1.8)
 * - 텍스트 입력창, 슬라이더, 가로 칩 스크롤 영역 터치 시 스와이프 자동 무시
 * - 방향성 슬라이드 전환(direction, changeTabWithDirection) 및 글로벌 이벤트 연동
 */
export function useSwipeableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  minSwipeDistance = 80,
  minSwipeRatio = 0.15,
  requireEdgeReach = false,
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

  const handleTouchStart = useCallback((event: React.TouchEvent | TouchEvent) => {
    touchStartRef.current = null;
    if (!enabled || tabs.length < 2 || event.touches.length !== 1) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="slider"], [role="dialog"], canvas, [draggable="true"], [data-no-tab-swipe], [data-bigbang="true"]')) return;
    // A horizontal carousel owns its gesture, even if it cannot currently scroll further.
    for (let element: Element | null = target; element && element !== event.currentTarget; element = element.parentElement) {
      const style = getComputedStyle(element);
      if (element.matches('[data-allow-x-scroll], .overflow-x-auto, .overflow-x-scroll') ||
          (['auto', 'scroll'].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)) return;
    }
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now(), shouldIgnore: false };
  }, [enabled, tabs.length]);

  const handleTouchMove = useCallback((event: React.TouchEvent | TouchEvent) => {
    const start = touchStartRef.current;
    if (!start) return;
    if (event.touches.length !== 1) { start.shouldIgnore = true; return; }
    const dx = Math.abs(event.touches[0].clientX - start.x);
    const dy = Math.abs(event.touches[0].clientY - start.y);
    if (dy > 12 && dy >= dx) start.shouldIgnore = true;
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent | TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!enabled || !start || start.shouldIgnore || event.changedTouches.length !== 1 || event.touches.length > 0) return;
    if (Date.now() - start.time > 1200 || window.getSelection()?.toString().trim()) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const root = event.currentTarget as HTMLElement | null;
    const width = root?.clientWidth || window.innerWidth;
    if (Math.abs(dx) < Math.max(minSwipeDistance, width * minSwipeRatio) || Math.abs(dx) <= Math.abs(dy) * maxPerpendicularRatio) return;
    if (requireEdgeReach && touch.clientX > width * .15 && touch.clientX < width * .85) return;
    const index = tabs.indexOf(activeTab);
    if (index < 0) return;
    const step: 1 | -1 = dx < 0 ? 1 : -1;
    const next = index + step;
    if (!loop && (next < 0 || next >= tabs.length)) return;
    const nextTab = tabs[(next + tabs.length) % tabs.length];
    if (!nextTab || nextTab === activeTab) return;
    // Authorize this intentional app-tab route while native browser history swipes remain blocked.
    (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    setDirection(step);
    if (enableHaptics) { try { playAudioHaptic('tap_light'); } catch (_) {} }
    onTabChange(nextTab, step);
  }, [enabled, tabs, activeTab, minSwipeDistance, minSwipeRatio, maxPerpendicularRatio, requireEdgeReach, loop, enableHaptics, onTabChange]);
  const handleTouchCancel = useCallback(() => { touchStartRef.current = null; }, []);

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
      onTouchMove: handleTouchMove,
      onTouchCancel: handleTouchCancel,
    },
  };
}
