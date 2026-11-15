let pinnedToBottom = true;
let holdUntil = 0;

/** The conversation was at the latest messages before a popup changed the viewport. */
export function noteLucyScrollPin(next: boolean) {
  pinnedToBottom = next;
}

export function isLucyScrollPinned() {
  return pinnedToBottom;
}

/** iOS adjusts scrollTop when a popup closes, after the overlay node is already gone. */
export function holdLucyScrollPin(ms = 900) {
  holdUntil = Date.now() + ms;
}

export function lucyScrollPinHeld() {
  return Date.now() < holdUntil;
}

/** An upward read cancels the post-close restore, including one still in its hold window. */
export function releaseLucyScrollPin() {
  pinnedToBottom = false;
  holdUntil = 0;
}

export function rectsOverlap(a: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>, b: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>, min = 24) {
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return width > min && height > min;
}

/** A content-pane dialog must not freeze Lucy. Only a layer over the conversation does. */
export function overlayCoversElement(element: HTMLElement | null): boolean {
  if (!element || typeof document === 'undefined') return false;
  const target = element.getBoundingClientRect();
  if (target.width < 2 || target.height < 2) return false;
  return Array.from(document.querySelectorAll<HTMLElement>('[data-screen-overlay-layer]')).some(layer => {
    if (!layer.childElementCount) return false;
    const box = layer.getBoundingClientRect();
    return box.width > 2 && box.height > 2 && rectsOverlap(box, target);
  });
}
