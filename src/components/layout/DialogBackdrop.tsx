import { useEffect, useRef, type HTMLAttributes } from 'react';

/** A release/click from the opening button must never dismiss a new dialog. */
export function DialogBackdrop({ onDismiss, children, ...props }: HTMLAttributes<HTMLDivElement> & { onDismiss: () => void }) {
  const armed = useRef(false);
  const freshPress = useRef(false);
  useEffect(() => {
    const reset = () => { armed.current = false; freshPress.current = false; };
    window.addEventListener('resize', reset, { passive: true });
    window.addEventListener('orientationchange', reset, { passive: true });
    document.addEventListener('visibilitychange', reset);
    return () => {
      window.removeEventListener('resize', reset);
      window.removeEventListener('orientationchange', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, []);
  return <div {...props}
    onTouchStartCapture={event => {
      freshPress.current = true;
      armed.current = event.target === event.currentTarget;
      props.onTouchStartCapture?.(event);
    }}
    onTouchCancel={event => {
      armed.current = false; freshPress.current = false;
      props.onTouchCancel?.(event);
    }}
    onPointerDownCapture={event => {
      freshPress.current = true;
      props.onPointerDownCapture?.(event);
    }}
    onClickCapture={event => {
      props.onClickCapture?.(event);
      const allow = freshPress.current || event.detail === 0;
      freshPress.current = false;
      // WebKit may retarget the opening tap's synthetic click to a card or
      // action inside the newly painted dialog, not just to its backdrop.
      if (!allow) { event.preventDefault(); event.stopPropagation(); }
    }}
    onPointerDown={event => {
      armed.current = event.target === event.currentTarget;
      props.onPointerDown?.(event);
    }}
    onPointerCancel={event => { armed.current = false; freshPress.current = false; props.onPointerCancel?.(event); }}
    onClick={event => {
      props.onClick?.(event);
      const dismiss = armed.current && event.target === event.currentTarget;
      armed.current = false;
      if (dismiss && !event.defaultPrevented) onDismiss();
    }}
  >{children}</div>;
}
