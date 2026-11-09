import { useEffect, useRef } from 'react';

/** Readable native scrolling, retaining touch, wheel and keyboard navigation. */
export function useSlowHorizontalScroll(resetKey: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pixelsPerSecond = 12;
    let direction = 1;
    let previousTime = 0;
    let resumeAt = performance.now() + 2000;
    let hovered = window.matchMedia('(hover: hover)').matches && element.matches(':hover');
    let pressed = false;
    let focused = element.contains(document.activeElement);
    let frame = 0;
    let maximum = 0;
    let position = 0;
    element.scrollLeft = 0;

    const measure = () => {
      maximum = Math.max(0, element.scrollWidth - element.clientWidth);
      position = Math.min(position, maximum);
    };
    const pause = () => {
      resumeAt = performance.now() + 4000;
      position = element.scrollLeft;
    };
    const syncScroll = () => {
      if (hovered || pressed || focused || performance.now() < resumeAt) position = element.scrollLeft;
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true;
    };
    const leave = () => { hovered = false; pause(); };
    const down = () => { pressed = true; pause(); };
    const up = () => { pressed = false; pause(); };
    const focusIn = () => { focused = true; };
    const focusOut = (event: FocusEvent) => {
      focused = event.relatedTarget instanceof Node && element.contains(event.relatedTarget);
      pause();
    };
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      if (!document.hidden && !reducedMotion.matches && !hovered && !pressed && !focused && time >= resumeAt && maximum > 0) {
        // Keep a fractional position: integer scrollLeft rounding must not stall slow motion.
        position = Math.max(0, Math.min(maximum, position + direction * pixelsPerSecond * elapsed / 1000));
        element.scrollLeft = position;
        if (position === maximum || position === 0) {
          direction *= -1;
          resumeAt = time + 2000;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    element.addEventListener('scroll', syncScroll, { passive: true });
    element.addEventListener('wheel', pause, { passive: true });
    element.addEventListener('touchmove', pause, { passive: true });
    element.addEventListener('focusin', focusIn);
    element.addEventListener('focusout', focusOut);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      element.removeEventListener('scroll', syncScroll);
      element.removeEventListener('wheel', pause);
      element.removeEventListener('touchmove', pause);
      element.removeEventListener('focusin', focusIn);
      element.removeEventListener('focusout', focusOut);
    };
  }, [resetKey]);

  return ref;
}
