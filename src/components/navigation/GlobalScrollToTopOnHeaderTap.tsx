import React, { useEffect } from 'react';
import { resetAppScroll } from '@/utils/scrollToTop';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { resolvePaneHeaderTap } from '@/lib/duoPaneFocus';
import {
  getWorkspacePaneElement,
  isSinglePaneLucyScreen,
  measureWorkspacePanes,
  readSafeAreaTop,
  resolveTapPane,
} from '@/lib/workspacePaneDom';

/**
 * 📱 아이폰 상태바 상단 중앙 노치(Notch) 탭 최상단 스크롤(Scroll-to-Top) 전역 컨트롤러
 * - 사용자 지시사항:
 *   1) 상단 로고 말고 상단 중앙 노치부분 누르면 최상단으로 이동
 *   2) 듀얼 화면(iPhone Duo)에서는 반반 쪼개서 중앙 노치부분 누르면 해당 화면만 독립 스크롤
 *   3) 로고, 버튼, 링크, 입력창 등 인터랙티브 요소는 100% 본래 동작 보장 (스크롤 간섭 원천 차단)
 *   4) 접힌 화면에서도 각 채널의 앱 제목(PROLOGUE·TRINITY…)을 누르면 최상단으로 이동
 */
export function GlobalScrollToTopOnHeaderTap(): null {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;
    let lastTouchScrollAt = 0;

    const isInteractiveElement = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      return Boolean(
        el.closest(
          'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], [role="link"], label, .clickable, [data-no-scroll-top], [data-brand-logo], audio, video, iframe, .lucy-header-actions, .prism-subnav-btn, .duo-page-nav'
        )
      );
    };

    /**
     * 🎯 상단 노치·앱 제목 터치 판별 및 스크롤 대상 패널 반환
     * - 반환값:
     *   - HTMLElement: 해당 화면/패널만 선별 스크롤 (듀얼 모드 좌/우 패널 또는 접힌 단일 화면)
     *   - false: 헤더 영역이 아니거나 인터랙티브 요소 터치 (스크롤하지 않음)
     */
    const getNotchScrollTarget = (
      clientX: number,
      clientY: number,
      target: HTMLElement | null
    ): HTMLElement | null | false => {
      if (isInteractiveElement(target)) return false;

      const pane = resolvePaneHeaderTap(clientX, clientY, measureWorkspacePanes(), readSafeAreaTop());
      if (!pane) return false;

      // 스크롤은 탭한 요소가 아니라 실제로 화면에 떠 있는 패널 범위에서만 일어나야 한다.
      return getWorkspacePaneElement(pane.pane) ?? target;
    };

    const executeScrollToTop = (scrollTarget: HTMLElement | null) => {
      // 접힌 화면에서도 루시 채팅 패널은 DOM에 남아 있으므로, 존재가 아니라 이 탭이
      // 어느 패널에서 났는지로 판정한다. 루시가 아니면 채널 본문을 직접 최상단으로 올린다.
      const tappedPane = resolveTapPane(scrollTarget);
      const isLucyTarget = tappedPane === 'lucy' || (tappedPane === null && isSinglePaneLucyScreen());
      // Lucy handles this event on its own message scroller; avoid scheduling a second
      // smooth scroll across every scrollable descendant in the pane.
      if (!isLucyTarget) resetAppScroll('smooth', scrollTarget);

      try {
        playAudioHaptic('tap_light');
      } catch (_) {}

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.(10);
        } catch (_) {}
      }

      try {
        window.dispatchEvent(
          new CustomEvent('prism-scroll-to-top', {
            detail: { target: scrollTarget, timestamp: Date.now() },
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
      if (dist > 25) {
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

      // 드래그/스와이프가 아닌 명확한 탭(500ms 이내, 25px 미만 이동) 판정
      if (distance > 25 || duration > 500) return;

      const target = (document.elementFromPoint(endX, endY) || e.target) as HTMLElement | null;

      const scrollTarget = getNotchScrollTarget(endX, endY, target);
      if (scrollTarget !== false) {
        lastTouchScrollAt = Date.now();
        executeScrollToTop(scrollTarget);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (document.elementFromPoint(e.clientX, e.clientY) || e.target) as HTMLElement | null;
      const scrollTarget = getNotchScrollTarget(e.clientX, e.clientY, target);
      if (scrollTarget !== false) {
        // A touch tap may also emit a synthetic click; consume both at the notch so
        // the React header handler cannot schedule another scroll.
        e.stopPropagation();
        if (Date.now() - lastTouchScrollAt < 700) return;
        executeScrollToTop(scrollTarget);
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
