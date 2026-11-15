import { rememberOverlayPane } from '@/lib/overlayPane';
import { useRef, type ButtonHTMLAttributes, type MouseEvent, type PointerEvent, type TouchEvent } from 'react';

const TAP_SLOP = 48;

type ActivationEvent = {
  stopPropagation?: () => void;
  currentTarget?: EventTarget | null;
  pointerType?: string;
  detail?: number;
};

/**
 * iOS WebKit drops click on controls inside overflow clipping and backdrop-filter
 * chrome, and a stationary tap is often delivered as touchend after pointercancel.
 * Activate from the gesture that actually arrives, once.
 */
export function DialogTriggerButton({
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerMove,
  onPointerCancel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const press = useRef<{ id: number; x: number; y: number; cancelled: boolean } | null>(null);
  const touch = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const lastActivation = useRef(-Infinity);
  const activate = (event: ActivationEvent) => {
    event.stopPropagation?.();
    if (props.disabled) return;
    const now = Date.now();
    if (now - lastActivation.current < 700) return;
    lastActivation.current = now;
    onClick?.(event as MouseEvent<HTMLButtonElement>);
    // Focusing on touch makes iOS scroll the conversation to the control.
    if ((event.pointerType === 'mouse' || event.detail === 0) && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.focus({ preventScroll: true });
    }
  };
  const rememberPress = (id: number, x: number, y: number) => {
    press.current = { id, x, y, cancelled: false };
  };
  return <button {...props} type={type}
    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', ...props.style }}
    onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
      rememberOverlayPane(event.currentTarget, { x: event.clientX, y: event.clientY });
      onPointerDown?.(event);
      if (event.button !== 0 || !event.isPrimary || event.defaultPrevented) return;
      rememberPress(event.pointerId, event.clientX, event.clientY);
    }}
    onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
      const start = press.current;
      if (start?.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) start.cancelled = true;
    }}
    onPointerCancel={(event: PointerEvent<HTMLButtonElement>) => {
      if (press.current?.id === event.pointerId) press.current.cancelled = true;
      onPointerCancel?.(event);
    }}
    onPointerUp={(event: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event);
      const start = press.current;
      press.current = null;
      if (event.pointerType === 'mouse' || event.defaultPrevented || !start || start.id !== event.pointerId || start.cancelled) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) return;
      event.preventDefault();
      activate(event);
    }}
    onTouchStart={(event: TouchEvent<HTMLButtonElement>) => {
      onTouchStart?.(event);
      const point = event.changedTouches[0];
      if (!point) return;
      touch.current = { id: point.identifier, x: point.clientX, y: point.clientY, moved: false };
    }}
    onTouchMove={(event: TouchEvent<HTMLButtonElement>) => {
      onTouchMove?.(event);
      const start = touch.current;
      const point = event.changedTouches[0];
      if (start && point && start.id === point.identifier && Math.hypot(point.clientX - start.x, point.clientY - start.y) > TAP_SLOP) start.moved = true;
    }}
    onTouchEnd={(event: TouchEvent<HTMLButtonElement>) => {
      onTouchEnd?.(event);
      const start = touch.current;
      touch.current = null;
      const point = event.changedTouches[0];
      if (!start || !point || start.moved || start.id !== point.identifier) return;
      if (Math.hypot(point.clientX - start.x, point.clientY - start.y) > TAP_SLOP) return;
      activate(event);
    }}
    onClick={(event: MouseEvent<HTMLButtonElement>) => {
      if (Date.now() - lastActivation.current < 700) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      activate(event);
    }}
  />;
}
