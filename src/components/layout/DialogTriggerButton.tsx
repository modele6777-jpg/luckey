import type { ButtonHTMLAttributes } from 'react';
import { rememberOverlayPane } from '@/lib/overlayPane';

/** Keep the tap target stable until click, even when blurring chat closes a keyboard. */
export function DialogTriggerButton({ onClick, onPointerDown, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} type={type}
    onPointerDown={event => {
      rememberOverlayPane(event.currentTarget, { x: event.clientX, y: event.clientY });
      onPointerDown?.(event);
      if (event.button === 0 && event.isPrimary) event.preventDefault();
    }}
    onClick={event => {
      event.stopPropagation();
      // Blur the composer only after click has reached its target. The dialog
      // can then restore focus to this button instead of reopening the keyboard.
      event.currentTarget.focus({ preventScroll: true });
      onClick?.(event);
    }}
  />;
}
