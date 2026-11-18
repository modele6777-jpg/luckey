import { useRef, type HTMLAttributes } from 'react';

/** A release/click from the opening button must never dismiss a new dialog. */
export function DialogBackdrop({ onDismiss, children, ...props }: HTMLAttributes<HTMLDivElement> & { onDismiss: () => void }) {
  const armed = useRef(false);
  const freshPress = useRef(false);
  return <div {...props}
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
