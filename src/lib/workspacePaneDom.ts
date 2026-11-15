import { type PaneBox, type PaneRect, type WorkspacePane } from './duoPaneFocus';

const PANE_ID: Record<WorkspacePane, string> = {
  content: 'duo-content-viewport',
  lucy: 'duo-lucy-viewport',
};

/**
 * The pane element by id when unfolded, by attribute when folded.
 * `#duo-content-viewport` / `#duo-lucy-viewport` only exist while the phone is open,
 * so the folded screen has to be recognised by `[data-workspace-pane]`.
 */
export function getWorkspacePaneElement(pane: WorkspacePane): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return (
    document.getElementById(PANE_ID[pane]) ??
    document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`)
  );
}

/** A pane hidden with `display: none` keeps its children mounted but paints nothing. */
export function isElementOnScreen(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (el.getClientRects().length === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 1 && rect.height > 1;
}

export function readSafeAreaTop(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 44;
  const rootSat = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0',
    10,
  );
  return rootSat > 0 ? rootSat : 44;
}

function rectOf(el: Element | null): PaneRect | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

/** Measure one workspace pane, including the channel app title inside it. */
export function measureWorkspacePane(pane: WorkspacePane): PaneBox | null {
  const el = getWorkspacePaneElement(pane);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    pane,
    visible: isElementOnScreen(el),
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    title: rectOf(el.querySelector('[data-page-title], .duo-page-title')),
  };
}

export function measureWorkspacePanes(): PaneBox[] {
  if (typeof document === 'undefined') return [];
  return [measureWorkspacePane('content'), measureWorkspacePane('lucy')].filter(
    (pane): pane is PaneBox => pane !== null,
  );
}

/** True only when Lucy is the single screen on show (folded chat), not a background pane. */
export function isSinglePaneLucyScreen(): boolean {
  return isElementOnScreen(getWorkspacePaneElement('lucy')) && !isElementOnScreen(getWorkspacePaneElement('content'));
}

/** The Lucy chat pane is on screen right now (folded chat, or the right/left dual pane). */
export function isLucyChatPaneVisible(): boolean {
  return isElementOnScreen(getWorkspacePaneElement('lucy'));
}

/**
 * The engine of a live scroll decision: which pane owns this tap.
 * Content wins when both panes are mounted and neither is measurable apart.
 */
export function resolveTapPane(el: HTMLElement | null): WorkspacePane | null {
  if (!el || typeof el.closest !== 'function') return null;
  if (el.closest('#duo-lucy-viewport, [data-workspace-pane="lucy"]')) return 'lucy';
  if (el.closest('#duo-content-viewport, [data-workspace-pane="content"]')) return 'content';
  return null;
}
