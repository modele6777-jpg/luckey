import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { clampMenuPosition, snapMenuPosition, type MenuBounds, type MenuEdge, type MenuPoint, type MenuSize } from '@/lib/floatingMenuGeometry';

const STORAGE_KEY = 'prism_fab_pos';
const BUTTON_SIZE = { width: 64, height: 64 };

function readBounds(): MenuBounds {
  if (typeof window === 'undefined') return { left: 0, top: 0, width: 382, height: 678 };
  const visual = window.visualViewport;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(probe);
  const css = getComputedStyle(probe);
  const top = parseFloat(css.paddingTop) || 0;
  const right = parseFloat(css.paddingRight) || 0;
  const bottom = parseFloat(css.paddingBottom) || 0;
  const left = parseFloat(css.paddingLeft) || 0;
  probe.remove();
  return {
    left: (visual?.offsetLeft ?? 0) + left,
    top: (visual?.offsetTop ?? 0) + top,
    width: Math.max(0, (visual?.width ?? innerWidth) - left - right),
    height: Math.max(0, (visual?.height ?? innerHeight) - top - bottom),
  };
}

function initialPosition() {
  const bounds = readBounds();
  let point = { x: bounds.left, y: bounds.top + bounds.height };
  let edge: MenuEdge = 'left';
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      point = saved;
      edge = saved.edge === 'right' || (saved.edge !== 'left' && saved.x > bounds.left + bounds.width / 2) ? 'right' : 'left';
    }
  } catch { /* Unavailable storage or a malformed legacy position uses a safe default. */ }
  return { point: snapMenuPosition(point, BUTTON_SIZE, bounds, edge), edge, bounds };
}

export function useFloatingMenu(onActivate: () => void, onDragStart: () => void) {
  const [initial] = useState(initialPosition);
  const [position, setPosition] = useState(initial.point);
  const [bounds, setBounds] = useState(initial.bounds);
  const [size, setSize] = useState<MenuSize>(BUTTON_SIZE);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const positionRef = useRef(position);
  const boundsRef = useRef(bounds);
  const sizeRef = useRef(size);
  const edgeRef = useRef(initial.edge);
  const dragRef = useRef<{ id: number; start: MenuPoint; origin: MenuPoint; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const move = useCallback((point: MenuPoint) => { positionRef.current = point; setPosition(point); }, []);
  const persist = useCallback((point: MenuPoint) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...point, edge: edgeRef.current })); } catch { /* Keep dragging functional without storage. */ }
  }, []);

  useEffect(() => {
    const update = () => {
      const nextBounds = readBounds();
      const button = buttonRef.current;
      const nextSize = { width: button?.offsetWidth || 64, height: button?.offsetHeight || 64 };
      if (dragRef.current) suppressClickRef.current = true;
      dragRef.current = null;
      setIsDragging(false);
      boundsRef.current = nextBounds;
      sizeRef.current = nextSize;
      setBounds(nextBounds);
      setSize(nextSize);
      const next = snapMenuPosition(positionRef.current, nextSize, nextBounds, edgeRef.current);
      move(next);
      persist(next);
    };
    update();
    const observer = new ResizeObserver(update);
    if (buttonRef.current) observer.observe(buttonRef.current);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, [move, persist]);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if ((event.pointerType === 'mouse' && event.button !== 0) || event.isPrimary === false || dragRef.current) return;
    event.stopPropagation();
    suppressClickRef.current = false;
    dragRef.current = { id: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: positionRef.current, moved: false };
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Synthetic events and interrupted browser captures. */ }
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    event.stopPropagation();
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; setIsDragging(true); onDragStart(); }
    suppressClickRef.current = true;
    move(clampMenuPosition({ x: drag.origin.x + dx, y: drag.origin.y + dy }, sizeRef.current, boundsRef.current));
  };
  const finish = (event: PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    event.stopPropagation();
    setIsDragging(false);
    if (drag.moved || cancelled) {
      suppressClickRef.current = true;
      const current = positionRef.current;
      const nextBounds = boundsRef.current;
      edgeRef.current = current.x + sizeRef.current.width / 2 < nextBounds.left + nextBounds.width / 2 ? 'left' : 'right';
      const next = snapMenuPosition(current, sizeRef.current, nextBounds, edgeRef.current);
      move(next);
      persist(next);
    }
    try { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already be gone. */ }
  };
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0 && suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); suppressClickRef.current = false; return; }
    onActivate();
  };
  return { position, bounds, size, isDragging, buttonRef, handlers: {
    onPointerDown, onPointerMove, onClick,
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => finish(event, false),
    onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => finish(event, true),
    onLostPointerCapture: (event: PointerEvent<HTMLButtonElement>) => finish(event, true),
  } };
}
