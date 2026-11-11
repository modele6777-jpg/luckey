import React, { useEffect } from 'react';
import { resetAppScroll } from '@/utils/scrollToTop';
import { playAudioHaptic } from '@/lib/audioHaptics';

/**
 * 📱 아이폰 상태바 상단 중앙 노치(Notch) 탭 최상단 스크롤(Scroll-to-Top) 전역 컨트롤러
 * - 사용자 지시사항:
 *   1) 상단 로고 말고 상단 중앙 노치부분 누르면 최상단으로 이동
 *   2) 듀얼 화면(iPhone Duo)에서는 반반 쪼개서 중앙 노치부분 누르면 해당 화면만 독립 스크롤
 *   3) 로고, 버튼, 링크, 입력창 등 인터랙티브 요소는 100% 본래 동작 보장 (스크롤 간섭 원천 차단)
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
          'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], [role="link"], label, .clickable, [data-no-scroll-top], [data-brand-logo], audio, video, iframe, .lucy-header-actions, .prism-subnav-btn, .duo-page-nav'
        )
      );
    };

    /**
     * 🎯 상단 중앙 노치(Notch) 영역 터치 판별 및 스크롤 대상 패널 반환
     * - 반환값:
     *   - HTMLElement: 해당 화면/패널만 선별 스크롤 (듀얼 모드 좌/우 패널 또는 단일 화면)
     *   - false: 노치 영역이 아니거나 인터랙티브 요소 터치 (스크롤하지 않음)
     */
    const getNotchScrollTarget = (
      clientX: number,
      clientY: number,
      target: HTMLElement | null
    ): HTMLElement | null | false => {
      if (isInteractiveElement(target)) return false;

      // 상단 상태바/노치 및 헤더 여백 터치 감지 영역 (상단 ~ 78px 또는 safe-area + 28px)
      const safeAreaThreshold = Math.max(76, getSafeAreaTop() + 28);
      if (clientY > safeAreaThreshold) return false;

      // 1. 듀얼 스크린 (iPhone Duo 펼친 화면: 좌측 채널 vs 우측 루시)
      const contentPane = document.getElementById('duo-content-viewport');
      const lucyPane = document.getElementById('duo-lucy-viewport');
      const isDual = Boolean(
        contentPane &&
        lucyPane &&
        contentPane.offsetParent !== null &&
        lucyPane.offsetParent !== null
      );

      if (isDual && contentPane && lucyPane) {
        const contentRect = contentPane.getBoundingClientRect();
        const lucyRect = lucyPane.getBoundingClientRect();
        const isSideBySide = Math.abs(contentRect.top - lucyRect.top) < 30;

        if (isSideBySide) {
          // 📱 좌측 화면(콘텐츠 뷰포트) 노치: 좌측 0~70px(로고) 제외, 우측 여백 전까지
          if (
            clientX >= contentRect.left + 70 &&
            clientX <= contentRect.right - 20
          ) {
            return contentPane;
          }

          // 📱 우측 화면(루시 채팅창) 노치: 좌측 로고/버튼 제외, 중앙부 터치
          if (
            clientX >= lucyRect.left + 80 &&
            clientX <= lucyRect.right - 80
          ) {
            return lucyPane;
          }
        } else {
          // 📱 상하 듀얼 화면 (세로 회전 펼침)
          // 상단 화면(콘텐츠 뷰포트) 노치
          if (clientY <= safeAreaThreshold && clientX >= 70 && clientX <= window.innerWidth - 30) {
            return contentPane;
          }

          // 하단 화면(루시 채팅창) 노치
          if (
            clientY >= lucyRect.top &&
            clientY <= lucyRect.top + safeAreaThreshold &&
            clientX >= 70 &&
            clientX <= window.innerWidth - 30
          ) {
            return lucyPane;
          }
        }

        // 듀얼 모드에서 노치 영역 밖을 터치한 경우 스크롤 무시
        return false;
      }

      // 2. 단일 화면 (접힌 화면 또는 일반 모바일) 중앙 노치
      // 좌측 로고 영역(0~70px) 및 우측 여백 제외 중앙 상단 탭
      if (clientX >= 70 && clientX <= window.innerWidth - 30) {
        return target;
      }

      return false;
    };

    const executeScrollToTop = (scrollTarget: HTMLElement | null) => {
      resetAppScroll('smooth', scrollTarget);

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
        executeScrollToTop(scrollTarget);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (document.elementFromPoint(e.clientX, e.clientY) || e.target) as HTMLElement | null;
      const scrollTarget = getNotchScrollTarget(e.clientX, e.clientY, target);
      if (scrollTarget !== false) {
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
