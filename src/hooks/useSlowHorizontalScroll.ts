import { useEffect, useRef } from 'react';

/** Readable native scrolling, retaining touch, wheel and keyboard navigation. */
export function useSlowHorizontalScroll(resetKey: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pixelsPerSecond = 20; // Natural, lively smooth pace
    let direction = 1;
    let previousTime = 0;
    let resumeAt = performance.now() + 1000;
    let hovered = false;
    let pressed = false;
    let frame = 0;
    let maximum = 0;
    let position = element.scrollLeft;

    const measure = () => {
      maximum = Math.max(0, element.scrollWidth - element.clientWidth);
      position = Math.min(element.scrollLeft, maximum);
    };

    const pause = (delayMs = 2500) => {
      resumeAt = performance.now() + delayMs;
      position = element.scrollLeft;
    };

    const syncScroll = () => {
      if (hovered || pressed || performance.now() < resumeAt) {
        position = element.scrollLeft;
      }
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true;
    };
    const leave = () => {
      hovered = false;
      pause(1500);
    };
    const down = () => {
      pressed = true;
      pause(3000);
    };
    const up = () => {
      pressed = false;
      pause(2000);
    };

    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;

      // Dynamically recheck maximum if it wasn't measured yet
      if (maximum <= 0 && element.scrollWidth > element.clientWidth) {
        measure();
      }

      if (!document.hidden && !reducedMotion.matches && !hovered && !pressed && time >= resumeAt && maximum > 0) {
        position = Math.max(0, Math.min(maximum, position + direction * pixelsPerSecond * (elapsed / 1000)));
        element.scrollLeft = position;

        if (position >= maximum - 0.5) {
          direction = -1;
          position = maximum;
          resumeAt = time + 1800; // brief pause at ends before reversing
        } else if (position <= 0.5) {
          direction = 1;
          position = 0;
          resumeAt = time + 1800;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    measure();
    // Re-measure after initial paint and layout
    const initTimer = setTimeout(measure, 150);
    const initTimer2 = setTimeout(measure, 500);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    for (const child of element.children) resizeObserver.observe(child);

    const mutationObserver = new MutationObserver(() => {
      measure();
      for (const child of element.children) {
        try { resizeObserver.observe(child); } catch (_) {}
      }
    });
    mutationObserver.observe(element, { childList: true, subtree: true });

    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    element.addEventListener('scroll', syncScroll, { passive: true });
    element.addEventListener('wheel', () => pause(2500), { passive: true });
    element.addEventListener('touchmove', () => pause(2500), { passive: true });

    frame = requestAnimationFrame(tick);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(initTimer2);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      element.removeEventListener('scroll', syncScroll);
    };
  }, [resetKey]);

  return ref;
}
