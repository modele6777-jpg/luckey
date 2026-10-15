/**
 * =========================================================================
 * 타로 카드 드로우 & 뒤집힘 전용 화면 미세 진동 및 햅틱 효과 유틸리티
 * =========================================================================
 * 1) 디바이스 물리 햅틱 진동 (모바일 브라우저 지원 시)
 * 2) 화면 미세 진동 (Micro-Rumble / Screen Shake CSS 셰이크)
 * 3) 커스텀 윈도우 이벤트 디스패치
 */

export interface TarotVibrationOptions {
  containerElement?: HTMLElement | null;
  intensity?: 'subtle' | 'medium' | 'strong';
  durationMs?: number;
}

export function triggerTarotScreenVibration(options?: TarotVibrationOptions): void {
  if (typeof window === 'undefined') return;

  // 1. 디바이스 물리 진동 햅틱 (Web Vibration API)
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = options?.intensity === 'strong' 
        ? [25, 40, 30] 
        : options?.intensity === 'subtle'
        ? [15, 20, 15]
        : [18, 28, 20];
      navigator.vibrate(pattern);
    }
  } catch (_) {
    // 보안 컨텍스트나 무음 모드 등 진동 제한 시 무시
  }

  // 2. 시각적 화면 미세 진동 (CSS 애니메이션 클래스 주입)
  try {
    const target =
      options?.containerElement ||
      document.getElementById('tarot-stage-container') ||
      document.querySelector('.tarot-spread-stage-root') ||
      document.getElementById('root');

    if (target && target instanceof HTMLElement) {
      target.classList.remove('tarot-screen-vibrating');
      // 강제 리플로우(reflow)로 이전 애니메이션 즉각 초기화 후 재실행
      void target.offsetWidth;
      target.classList.add('tarot-screen-vibrating');

      const timeout = options?.durationMs || 340;
      window.setTimeout(() => {
        target.classList.remove('tarot-screen-vibrating');
      }, timeout);
    }
  } catch (_) {
    // DOM 조작 실패 안전 방어
  }

  // 3. 글로벌 이벤트 디스패치 (리액트 컴포넌트 구독용)
  try {
    window.dispatchEvent(
      new CustomEvent('tarot-screen-vibrate', {
        detail: { timestamp: Date.now(), intensity: options?.intensity || 'medium' },
      })
    );
  } catch (_) {}
}
