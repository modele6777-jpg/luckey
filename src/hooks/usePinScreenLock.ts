import { useEffect } from 'react';

const PIN_BG = 'oklch(0.08 0.02 270)';

/** PIN 잠금 화면일 때 body 배경·테마 간섭 차단 */
export function usePinScreenLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousBackground = document.body.style.backgroundColor;
    const previousTransition = document.body.style.transition;

    document.body.style.backgroundColor = PIN_BG;
    document.body.style.transition = 'background-color 0.2s ease';

    return () => {
      document.body.style.backgroundColor = previousBackground;
      document.body.style.transition = previousTransition;
    };
  }, [active]);
}