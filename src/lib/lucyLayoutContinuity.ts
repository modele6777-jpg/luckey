export interface LucyLayoutContinuitySnapshot {
  scrollTop: number;
  anchorKey: string | null;
  anchorOffset: number;
  atBottom: boolean;
  inputFocused: boolean;
  selectionStart: number | null;
  selectionEnd: number | null;
  selectionDirection: 'forward' | 'backward' | 'none' | null;
}

export interface LucyLayoutContinuityOptions {
  onRestore?: (snapshot: LucyLayoutContinuitySnapshot) => void;
}

const MESSAGE_ANCHOR_SELECTOR = '[data-lucy-message-key]';
const BOTTOM_FOLLOW_TOLERANCE = 80;
const LAYOUT_SETTLE_DELAY_MS = 180;

/**
 * Capture the visible conversation position relative to a stable message rather
 * than only its raw scrollTop, which can point somewhere else after text wraps at
 * a new pane width. Hidden retained panes have no meaningful visual anchor.
 */
export function captureLucyLayoutContinuity(
  scroller: HTMLElement,
  input: HTMLTextAreaElement | null,
): LucyLayoutContinuitySnapshot | null {
  const box = scroller.getBoundingClientRect();
  if (scroller.clientHeight < 2 || box.height < 2) return null;

  let anchorKey: string | null = null;
  let anchorOffset = 0;
  for (const candidate of Array.from(scroller.querySelectorAll<HTMLElement>(MESSAGE_ANCHOR_SELECTOR))) {
    const rect = candidate.getBoundingClientRect();
    if (rect.bottom > box.top + 1 && rect.top < box.bottom) {
      anchorKey = candidate.dataset.lucyMessageKey || null;
      anchorOffset = rect.top - box.top;
      break;
    }
  }

  const active = scroller.ownerDocument.activeElement;
  let selectionStart: number | null = null;
  let selectionEnd: number | null = null;
  let selectionDirection: LucyLayoutContinuitySnapshot['selectionDirection'] = null;
  const inputFocused = Boolean(input && active === input);
  if (input && inputFocused) {
    try {
      selectionStart = input.selectionStart;
      selectionEnd = input.selectionEnd;
      selectionDirection = input.selectionDirection;
    } catch (_) {}
  }

  return {
    scrollTop: scroller.scrollTop,
    anchorKey,
    anchorOffset,
    atBottom: scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= BOTTOM_FOLLOW_TOLERANCE,
    inputFocused,
    selectionStart,
    selectionEnd,
    selectionDirection,
  };
}

/** Restore the same visible message and, only when WebKit dropped it, composer focus. */
export function restoreLucyLayoutContinuity(
  scroller: HTMLElement,
  input: HTMLTextAreaElement | null,
  snapshot: LucyLayoutContinuitySnapshot,
): void {
  const maxScrollTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  let targetScrollTop = snapshot.scrollTop;

  if (snapshot.atBottom) {
    targetScrollTop = maxScrollTop;
  } else if (snapshot.anchorKey) {
    const anchor = Array.from(scroller.querySelectorAll<HTMLElement>(MESSAGE_ANCHOR_SELECTOR))
      .find(candidate => candidate.dataset.lucyMessageKey === snapshot.anchorKey);
    if (anchor) {
      const scrollerTop = scroller.getBoundingClientRect().top;
      const currentOffset = anchor.getBoundingClientRect().top - scrollerTop;
      targetScrollTop += currentOffset - snapshot.anchorOffset;
    }
  }
  scroller.scrollTop = Math.min(maxScrollTop, Math.max(0, targetScrollTop));

  if (!snapshot.inputFocused || !input?.isConnected) return;
  const document = input.ownerDocument;
  const active = document.activeElement;
  if (active !== input && active !== document.body && active !== document.documentElement) return;
  if (active !== input) {
    try { input.focus({ preventScroll: true }); }
    catch (_) { input.focus(); }
    if (snapshot.selectionStart != null && snapshot.selectionEnd != null) {
      try { input.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd, snapshot.selectionDirection || undefined); }
      catch (_) {}
    }
  }
}

/**
 * Observe layout-viewport, visual-viewport and pane-size changes. Keep the last
 * user-visible anchor while WebKit emits a burst of resize events (for example,
 * when an iPhone Duo is unfolded or the keyboard changes the available area).
 */
export function bindLucyLayoutContinuity(
  scroller: HTMLElement,
  input: HTMLTextAreaElement | null,
  options: LucyLayoutContinuityOptions = {},
): () => void {
  const document = scroller.ownerDocument;
  const view = document.defaultView;
  if (!view) return () => {};

  let lastSnapshot = captureLucyLayoutContinuity(scroller, input);
  let pendingSnapshot: LucyLayoutContinuitySnapshot | null = null;
  let restoreFrame = 0;
  let settleTimer = 0;
  let restoring = false;

  const remember = () => {
    if (restoring || pendingSnapshot) return;
    lastSnapshot = captureLucyLayoutContinuity(scroller, input) || lastSnapshot;
  };

  const restorePending = (): boolean => {
    if (!pendingSnapshot || scroller.clientHeight < 2) return false;
    restoring = true;
    restoreLucyLayoutContinuity(scroller, input, pendingSnapshot);
    options.onRestore?.(pendingSnapshot);
    restoring = false;
    return true;
  };

  const cancelPendingAndRemember = (inputWasIntentionallyLeft = false) => {
    if (restoreFrame) view.cancelAnimationFrame(restoreFrame);
    restoreFrame = 0;
    if (settleTimer) view.clearTimeout(settleTimer);
    settleTimer = 0;
    pendingSnapshot = null;
    lastSnapshot = captureLucyLayoutContinuity(scroller, input) || lastSnapshot;
    if (inputWasIntentionallyLeft && lastSnapshot) lastSnapshot.inputFocused = false;
  };

  const onLayoutChange = () => {
    if (!pendingSnapshot) pendingSnapshot = lastSnapshot || captureLucyLayoutContinuity(scroller, input);
    if (!pendingSnapshot) return;
    if (restoreFrame) view.cancelAnimationFrame(restoreFrame);
    restoreFrame = view.requestAnimationFrame(() => {
      restoreFrame = 0;
      restorePending();
    });
    if (settleTimer) view.clearTimeout(settleTimer);
    settleTimer = view.setTimeout(() => {
      settleTimer = 0;
      if (restoreFrame) view.cancelAnimationFrame(restoreFrame);
      restoreFrame = 0;
      const restored = restorePending();
      if (restored) {
        pendingSnapshot = null;
        lastSnapshot = captureLucyLayoutContinuity(scroller, input) || lastSnapshot;
      }
    }, LAYOUT_SETTLE_DELAY_MS);
  };

  const onPointerDown = (event: Event) => {
    const target = event.target;
    const onInput = Boolean(input && target instanceof Node && (target === input || input.contains(target)));
    if (onInput) return;

    if (pendingSnapshot) pendingSnapshot = { ...pendingSnapshot, inputFocused: false };
    if (lastSnapshot) lastSnapshot = { ...lastSnapshot, inputFocused: false };

    if (target instanceof Node && scroller.contains(target)) cancelPendingAndRemember(true);
  };

  const onDocumentFocusIn = (event: Event) => {
    if (event.target === input) return;
    if (pendingSnapshot) pendingSnapshot = { ...pendingSnapshot, inputFocused: false };
    if (lastSnapshot) lastSnapshot = { ...lastSnapshot, inputFocused: false };
  };

  const onInputStateChange = () => remember();
  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && (pendingSnapshot || lastSnapshot?.inputFocused)) {
      if (pendingSnapshot) pendingSnapshot = { ...pendingSnapshot, inputFocused: false };
      if (lastSnapshot) lastSnapshot = { ...lastSnapshot, inputFocused: false };
    }
  };
  const onUserScrollIntent = () => cancelPendingAndRemember(true);

  scroller.addEventListener('scroll', remember, { passive: true });
  scroller.addEventListener('wheel', onUserScrollIntent, { passive: true });
  scroller.addEventListener('touchstart', onUserScrollIntent, { passive: true });
  scroller.addEventListener('pointerdown', onUserScrollIntent, { passive: true });
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('focusin', onDocumentFocusIn, true);
  input?.addEventListener('input', onInputStateChange);
  input?.addEventListener('focus', onInputStateChange);
  input?.addEventListener('keyup', onInputStateChange);
  input?.addEventListener('click', onInputStateChange);
  input?.addEventListener('select', onInputStateChange);
  input?.addEventListener('keydown', onInputKeyDown);
  view.addEventListener('resize', onLayoutChange, { passive: true });
  view.addEventListener('orientationchange', onLayoutChange, { passive: true });
  view.screen?.orientation?.addEventListener?.('change', onLayoutChange);
  view.visualViewport?.addEventListener('resize', onLayoutChange, { passive: true });
  view.visualViewport?.addEventListener('scroll', onLayoutChange, { passive: true });

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onLayoutChange);
  resizeObserver?.observe(scroller);

  return () => {
    scroller.removeEventListener('scroll', remember);
    scroller.removeEventListener('wheel', onUserScrollIntent);
    scroller.removeEventListener('touchstart', onUserScrollIntent);
    scroller.removeEventListener('pointerdown', onUserScrollIntent);
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('focusin', onDocumentFocusIn, true);
    input?.removeEventListener('input', onInputStateChange);
    input?.removeEventListener('focus', onInputStateChange);
    input?.removeEventListener('keyup', onInputStateChange);
    input?.removeEventListener('click', onInputStateChange);
    input?.removeEventListener('select', onInputStateChange);
    input?.removeEventListener('keydown', onInputKeyDown);
    view.removeEventListener('resize', onLayoutChange);
    view.removeEventListener('orientationchange', onLayoutChange);
    view.screen?.orientation?.removeEventListener?.('change', onLayoutChange);
    view.visualViewport?.removeEventListener('resize', onLayoutChange);
    view.visualViewport?.removeEventListener('scroll', onLayoutChange);
    resizeObserver?.disconnect();
    if (restoreFrame) view.cancelAnimationFrame(restoreFrame);
    if (settleTimer) view.clearTimeout(settleTimer);
  };
}
