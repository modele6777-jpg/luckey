import React, { useEffect } from 'react';
import { resetAppScroll } from '@/utils/scrollToTop';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/**
 * 📱 아이폰 상태바 / 상단 헤더 탭 시 최상단 스크롤(Scroll-to-Top) 전역 컨트롤러
 * - 아이폰 고유의 Status Bar 탭 최상단 이동 인터랙션을 앱의 모든 페이지에 1:1 구현
 * - 상단 상태바 영역(0~54px) 및 각 페이지 헤더의 빈 공간/타이틀 탭 시 부도럽게 최상단으로 스크롤
 * - 버튼, 링크, 입력창 등 인터랙티브 요소는 정상 동작을 100% 보장하며 스크롤과 간섭 방지
 * - 듀얼 스크린(iPhone Duo) 환경에서는 탭된 좌/우 뷰포트를 판별하여 해당 창만 독립 스크롤
 */
export function GlobalScrollToTopOnHeaderTap(): null {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;

    const getSafeAreaTop = (): number => {
      if (typeof window === 'undefined') return 44;
      const rootSat = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0',
        10
      );
      return rootSat > 0 ? rootSat : 44;
    };

    const isInteractiveElement = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      return Boolean(
        el.closest(
          'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], [role="link"], label, .clickable, [data-no-scroll-top], audio, video, iframe'
        )
      );
    };

    const isTopScrollTriggerZone = (
      target: HTMLElement | null,
      clientY: number
    ): boolean => {
      if (!target) return false;

      // 1. 최상단 상태바 / 노치 / 다이내믹 아일랜드 터치 영역 (안전영역 + 12px)
      const safeAreaThreshold = Math.max(54, getSafeAreaTop() + 12);
      if (clientY <= safeAreaThreshold) {
        return true;
      }

      // 2. 페이지 상단 헤더 / 네비게이션 바 영역 (빈 공간 및 타이틀)
      const headerAncestor = target.closest(
        'header, nav.top-nav, .lucy-chat-header, .hub-header, [data-top-bar], [data-header], .sticky.top-0, .top-navigation-strip, .prism-header'
      );
      if (headerAncestor) {
        // 헤더 내부라도 화면 상단 120px 이내인 경우 최상단 이동 트리거로 인정
        const rect = headerAncestor.getBoundingClientRect();
        if (rect.top <= safeAreaThreshold && clientY <= rect.bottom + 8) {
          return true;
        }
      }

      return false;
    };

    const executeScrollToTop = (target: HTMLElement | null) => {
      resetAppScroll('smooth', target);

      try {
        triggerHaptic('light');
      } catch (_) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(10);
          } catch (_) {}
        }
      }

      try {
        window.dispatchEvent(
          new CustomEvent('prism-scroll-to-top', {
            detail: { target, timestamp: Date.now() },
          })
        );
      } catch (_) {}
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isDragging = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - startX, touch.clientY - startY);
      if (dist > 14) {
        isDragging = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDragging || e.changedTouches.length !== 1) return;
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const duration = Date.now() - startTime;
      const distance = Math.hypot(endX - startX, endY - startY);

      // 드래그/스와이프가 아닌 명확한 탭(400ms 이내, 14px 미만 이동) 판정
      if (distance > 14 || duration > 400) return;

      const target = (document.elementFromPoint(endX, endY) || e.target) as HTMLElement | null;
      if (!target) return;

      // 인터랙티브 버튼/링크 탭은 원래 기능 수행을 위해 절대 차단하지 않음
      if (isInteractiveElement(target)) {
        return;
      }

      // 상단 상태바 또는 헤더 영역 탭 검증
      if (isTopScrollTriggerZone(target, endY)) {
        executeScrollToTop(target);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // 마우스/트랙패드 클릭 처리
      const target = (document.elementFromPoint(e.clientX, e.clientY) || e.target) as HTMLElement | null;
      if (!target || isInteractiveElement(target)) return;

      if (isTopScrollTriggerZone(target, e.clientY)) {
        executeScrollToTop(target);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('click', handleClick, { passive: true, capture: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
}
