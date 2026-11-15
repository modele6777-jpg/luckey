/**
 * Which workspace pane a header tap belongs to, and what the Lucy chat route is.
 *
 * iPhone Duo keeps both panes mounted: `RetainedPane` holds the Lucy chat in the DOM
 * while the folded screen shows a lucky channel, and `LucyStandalonePage` keeps the
 * `in-lucy-chat` class on <html>/<body> from its first mount. So the presence of
 * `.lucy-chat-shell` or that class says nothing about the screen the user is looking
 * at — only the measured panes do. Everything here is pure so the decision can be
 * tested without a browser.
 */
export type WorkspacePane = 'content' | 'lucy';

export interface PaneRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface PaneBox extends PaneRect {
  pane: WorkspacePane;
  visible: boolean;
  /** The channel's own app title (`[data-page-title]`), which sits below the notch band. */
  title: PaneRect | null;
}

/** Top band that always counts as the status bar / notch, whatever the device inset. */
export const HEADER_TAP_MIN_BAND = 76;

/** Slack around the app title that still counts as pressing the title itself. */
const TITLE_TAP_X_PAD = 16;
const TITLE_TAP_TOP_PAD = 6;
const TITLE_TAP_BOTTOM_PAD = 18;

/** Side-by-side panes share a top edge; a stacked pair does not. */
const DUAL_STACK_TOLERANCE = 30;

/** Left logo gutter and right gutter inside a pane's header. */
const CONTENT_HEADER_LEFT_INSET = 70;
const CONTENT_HEADER_RIGHT_INSET = 20;
const LUCY_HEADER_LEFT_INSET = 80;
const LUCY_HEADER_RIGHT_INSET = 80;
const SINGLE_HEADER_RIGHT_INSET = 30;

export function notchBandBottom(safeAreaTop: number): number {
  return Math.max(HEADER_TAP_MIN_BAND, safeAreaTop + 28);
}

/**
 * The Lucy chat screen owns routes `/`, `/chat`, `/lucy` and their sub-routes.
 * A channel path such as `/prologue` or `/trinity?tab=tarot` never is one.
 */
export function isLucyChatPath(path: string | null | undefined): boolean {
  const clean = (path || '/').split('?')[0].split('#')[0] || '/';
  if (clean === '/' || clean === '/chat' || clean === '/lucy') return true;
  return clean.startsWith('/chat/') || clean.startsWith('/lucy/');
}

/**
 * Is the user on the Lucy chat screen right now?
 *
 * A mounted but hidden Lucy pane is not the screen the user is on: while folded on a
 * lucky channel the chat stays in the DOM, so `lucyOnlyPaneVisible` must be measured,
 * never inferred from `.lucy-chat-shell`. Missing that is what locked left/right app
 * navigation in the folded state.
 */
export function isLucyChatScreen(
  locationPath: string,
  windowPath: string,
  lucyOnlyPaneVisible: boolean,
): boolean {
  return isLucyChatPath(locationPath) || isLucyChatPath(windowPath) || lucyOnlyPaneVisible;
}

function isInside(rect: PaneRect, x: number, y: number, leftInset: number, rightInset: number): boolean {
  return x >= rect.left + leftInset && x <= rect.right - rightInset && y >= rect.top && y <= rect.bottom;
}

function isTitlePress(title: PaneRect | null, x: number, y: number): boolean {
  if (!title || title.width <= 0 || title.height <= 0) return false;
  return (
    x >= title.left - TITLE_TAP_X_PAD &&
    x <= title.right + TITLE_TAP_X_PAD &&
    y >= title.top - TITLE_TAP_TOP_PAD &&
    y <= title.bottom + TITLE_TAP_BOTTOM_PAD
  );
}

/**
 * Resolve a header tap to the pane it should scroll, or null when the point is not
 * a header tap at all (content, buttons, the wrong pane's gutter).
 *
 * The channel app title sits at `--page-header-top + 2.1rem`, which on a folded
 * iPhone is roughly 90px down — below the fixed notch band. Measuring the title and
 * accepting a press on it is what keeps "tap the app title" working while the phone
 * is folded, without widening the whole top band over content that scrolls behind it.
 */
export function resolvePaneHeaderTap(
  clientX: number,
  clientY: number,
  panes: readonly PaneBox[],
  safeAreaTop: number,
): PaneBox | null {
  const visible = panes.filter((pane) => pane.visible && pane.width > 0 && pane.height > 0);
  if (visible.length === 0) return null;

  const band = notchBandBottom(safeAreaTop);
  const content = visible.find((pane) => pane.pane === 'content') ?? null;
  const lucy = visible.find((pane) => pane.pane === 'lucy') ?? null;

  if (content && lucy) {
    const sideBySide = Math.abs(content.top - lucy.top) < DUAL_STACK_TOLERANCE;

    if (sideBySide) {
      if (isInside(content, clientX, clientY, CONTENT_HEADER_LEFT_INSET, CONTENT_HEADER_RIGHT_INSET) && clientY <= band) {
        return content;
      }
      if (isTitlePress(content.title, clientX, clientY)) return content;
      if (isInside(lucy, clientX, clientY, LUCY_HEADER_LEFT_INSET, LUCY_HEADER_RIGHT_INSET) && clientY <= band) {
        return lucy;
      }
      return null;
    }

    // Stacked dual (unfolded portrait): the content pane owns the top half, Lucy the bottom half.
    if (isInside(content, clientX, clientY, CONTENT_HEADER_LEFT_INSET, SINGLE_HEADER_RIGHT_INSET) && clientY <= band) {
      return content;
    }
    if (isTitlePress(content.title, clientX, clientY)) return content;
    if (
      clientY >= lucy.top &&
      clientY <= lucy.top + band &&
      isInside(lucy, clientX, clientY, CONTENT_HEADER_LEFT_INSET, SINGLE_HEADER_RIGHT_INSET)
    ) {
      return lucy;
    }
    return null;
  }

  // Folded single screen: exactly one pane is on screen.
  const only = content ?? lucy;
  if (!only) return null;
  if (isInside(only, clientX, clientY, CONTENT_HEADER_LEFT_INSET, SINGLE_HEADER_RIGHT_INSET) && clientY <= band) {
    return only;
  }
  if (only.pane === 'content' && isTitlePress(only.title, clientX, clientY)) return only;
  return null;
}
