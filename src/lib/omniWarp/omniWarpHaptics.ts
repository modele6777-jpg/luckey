/**
 * OmniWarp Haptic Patterns
 * 차등 진동 피드백 (navigator.vibrate)
 */

export type HapticType = 'whitehole' | 'mirrorhole' | 'event_horizon' | 'blackhole' | 'blackhole_peak' | 'wormhole' | 'bigbang' | 'abort';

let blackHoleLoopInterval: number | null = null;

/**
 * 🕳️ 블랙홀 단계 도달 시 무한 반복 미세 진동 피드백 (Continuous Gravity Rumble)
 */
export function startBlackHoleContinuousHaptic(): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  if (blackHoleLoopInterval !== null) return;

  try {
    // 즉각 1회 초기 진동 킥
    navigator.vibrate?.([15, 20, 15]);
  } catch (_) {}

  // 80ms 간격으로 블랙홀 미세 럼블 무한 반복
  blackHoleLoopInterval = window.setInterval(() => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([14, 18, 12]);
      }
    } catch (_) {}
  }, 80);
}

/**
 * 🛑 블랙홀 무한 진동 중단 및 즉각 해제
 */
export function stopBlackHoleContinuousHaptic(): void {
  if (blackHoleLoopInterval !== null) {
    clearInterval(blackHoleLoopInterval);
    blackHoleLoopInterval = null;
  }
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(0);
    }
  } catch (_) {}
}

export function triggerHaptic(type: HapticType): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'whitehole':
        // 맑고 가벼운 고주파 탭 (톡-)
        navigator.vibrate?.([12]);
        break;
      case 'mirrorhole':
        // 영롱하고 산뜻한 크리스탈 유리 햅틱 (경쾌한 이중 탭)
        navigator.vibrate?.([8, 14, 10]);
        break;
      case 'event_horizon':
        // 부드러운 웜홀 통과 진동
        navigator.vibrate?.([18, 20, 15]);
        break;
      case 'blackhole':
        // 미세하고 정밀한 저주파 중력파 럼블 (지이익-)
        navigator.vibrate?.([14, 18, 12]);
        break;
      case 'blackhole_peak':
        // 압력 최대치(블랙홀 단계) 도달 시 미세 진동 피드백 (틱-틱-지잉)
        navigator.vibrate?.([10, 15, 10, 20, 12]);
        break;
      case 'wormhole':
        // 🌀 웜홀 시공간 도약 햅틱: 에메랄드/사이버 트리플 펄스 바운스
        navigator.vibrate?.([16, 26, 20, 26, 22]);
        break;
      case 'bigbang':
        // 단발성 임팩트 킥 (쿵!)
        navigator.vibrate?.([120]);
        break;
      case 'abort':
        // 옆으로 튕겨냈을 때 안전 취소 피드백 (톡-투둑)
        navigator.vibrate?.([25, 20, 30]);
        break;
    }
  } catch (_) {}
}

