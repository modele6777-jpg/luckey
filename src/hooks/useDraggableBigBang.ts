import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { clampMenuPosition, type MenuPoint } from '@/lib/floatingMenuGeometry';
import { readMenuBounds } from '@/lib/navigationMenu';
import { safeLocalStorage } from '@/utils/safeStorage';

const POSITION_KEY = 'prism_device_bigbang_position_v1';
const HALO = 28;
const THRESHOLD = 26;
function readPosition(): MenuPoint | null {
  try { const point = JSON.parse(safeLocalStorage.getItem(POSITION_KEY) || 'null'); return Number.isFinite(point?.x) && Number.isFinite(point?.y) ? point : null; }
  catch { return null; }
}

/** Moving the control cancels its tap/hold action; placement stays local to this device. */
export function useDraggableBigBang(onDragStart: () => void) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<MenuPoint | null>(readPosition);
  const base = useRef(position);
  const cancelAction = useRef(onDragStart);
  cancelAction.current = onDragStart;
  const cleanup = useRef<(() => void) | null>(null);
  const suppressClick = useRef(false);
  const constrain = (point: MenuPoint) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return point;
    // Keep the surrounding directional controls inside the usable viewport too.
    const outer = clampMenuPosition({ x: point.x - HALO, y: point.y - HALO }, { width: rect.width + HALO * 2, height: rect.height + HALO * 2 }, readMenuBounds());
    return { x: outer.x + HALO, y: outer.y + HALO };
  };
  useLayoutEffect(() => {
    const restore = () => { if (base.current) setPosition(constrain(base.current)); };
    restore();
    window.addEventListener('resize', restore);
    window.visualViewport?.addEventListener('resize', restore);
    window.visualViewport?.addEventListener('scroll', restore);
    return () => {
      cleanup.current?.();
      window.removeEventListener('resize', restore);
      window.visualViewport?.removeEventListener('resize', restore);
      window.visualViewport?.removeEventListener('scroll', restore);
    };
  }, []);
  const onPointerDownCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    cleanup.current?.();
    suppressClick.current = false;
    const start = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, id: event.pointerId };
    let dragging = false;
    let latest = { x: rect.left, y: rect.top };
    const move = (next: PointerEvent) => {
      if (next.pointerId !== start.id) return;
      const dx = next.clientX - start.x, dy = next.clientY - start.y;
      if (!dragging && Math.hypot(dx, dy) < THRESHOLD) return;
      if (!dragging) { dragging = true; suppressClick.current = true; cancelAction.current(); }
      next.preventDefault();
      next.stopPropagation();
      latest = constrain({ x: start.left + dx, y: start.top + dy });
      setPosition(latest);
    };
    const finish = (next: PointerEvent) => {
      if (next.pointerId !== start.id) return;
      if (dragging) {
        next.preventDefault(); next.stopPropagation();
        base.current = latest;
        safeLocalStorage.setItem(POSITION_KEY, JSON.stringify(latest));
      }
      cleanup.current?.();
    };
    const blur = () => { if (dragging) { base.current = latest; safeLocalStorage.setItem(POSITION_KEY, JSON.stringify(latest)); } cleanup.current?.(); };
    cleanup.current = () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', finish, true);
      window.removeEventListener('pointercancel', finish, true);
      window.removeEventListener('blur', blur);
      cleanup.current = null;
    };
    window.addEventListener('pointermove', move, { capture: true, passive: false });
    window.addEventListener('pointerup', finish, { capture: true, passive: false });
    window.addEventListener('pointercancel', finish, { capture: true, passive: false });
    window.addEventListener('blur', blur);
  };
  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
  };
  const style: CSSProperties | undefined = position ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto', transform: 'none' } : undefined;
  return { rootRef, positioned: !!position, style, onPointerDownCapture, onClickCapture };
}
