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

  // 1. 디바이스 물리 진동 햅틱 (Web Vibration API - 경량 단일 펄스)
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = options?.intensity === 'strong'
        ? 22
        : options?.intensity === 'subtle'
        ? 10
        : 15;
      navigator.vibrate(pattern);
    }
  } catch (_) {
    // 보안 컨텍스트나 무음 모드 등 진동 제한 시 무시
  }
}
