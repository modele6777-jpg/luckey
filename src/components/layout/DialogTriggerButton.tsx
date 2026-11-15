import { rememberOverlayPane } from '@/lib/overlayPane';
import { useRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';

/** Safari can omit the compatibility click after a cancelled pointer default. */
export function DialogTriggerButton({ onClick, onPointerDown, onPointerUp, onPointerMove, onPointerCancel, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const press = useRef<{ id: number; x: number; y: number; cancelled: boolean } | null>(null);
  const lastTouchActivation = useRef(-Infinity);
  const activate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (props.disabled) return;
    event.currentTarget.focus({ preventScroll: true });
    onClick?.(event);
  };
  return <button {...props} type={type}
    style={{ touchAction: 'manipulation', ...props.style }}
    onPointerDown={event => {
      rememberOverlayPane(event.currentTarget, { x: event.clientX, y: event.clientY });
      onPointerDown?.(event);
      if (event.button !== 0 || !event.isPrimary || event.defaultPrevented) return;
      press.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cancelled: false };
    }}
    onPointerMove={event => {
      onPointerMove?.(event);
      const start = press.current;
      if (start?.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) start.cancelled = true;
    }}
    onPointerCancel={event => { press.current = null; onPointerCancel?.(event); }}
    onPointerUp={event => {
      onPointerUp?.(event);
      const start = press.current;
      press.current = null;
      if (event.pointerType === 'mouse' || event.defaultPrevented || !start || start.id !== event.pointerId || start.cancelled || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 20) return;
      lastTouchActivation.current = Date.now();
      event.preventDefault();
      activate(event);
    }}
    onClick={event => {
      if (event.detail !== 0 && Date.now() - lastTouchActivation.current < 750) {
        event.preventDefault(); event.stopPropagation(); return;
      }
      activate(event);
    }}
  />;
}
