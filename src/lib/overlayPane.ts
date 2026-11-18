export type OverlayPane = 'main' | 'content' | 'lucy';
let lastPane: OverlayPane = 'content';

type WorkspaceOverlayPane = Exclude<OverlayPane, 'main'>;
const WORKSPACE_PANES: readonly WorkspaceOverlayPane[] = ['content', 'lucy'];

/**
 * Pane wrappers carry `data-workspace-pane` in folded and unfolded layouts.
 * The `#duo-*-viewport` ids exist only while unfolded, so they cannot be the
 * only way to recognise the source pane of a popup.
 */
function workspacePaneElement(pane: WorkspaceOverlayPane): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById(pane === 'content' ? 'duo-content-viewport' : 'duo-lucy-viewport')
    ?? document.querySelector<HTMLElement>(`[data-workspace-pane="${pane}"]`);
}

function isPaneOnScreen(pane: WorkspaceOverlayPane): boolean {
  const element = workspacePaneElement(pane);
  if (!element || element.getClientRects().length === 0) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 1 && rect.height > 1;
}

/** Remember the source before React opens a document-hosted dialog. */
export function rememberOverlayPane(target: EventTarget | null, point?: { x: number; y: number }) {
  if (!(target instanceof Element)) return;
  const portal = target.closest<HTMLElement>('[data-overlay-pane]');
  const pane = portal?.dataset.overlayPane;
  if (pane === 'content' || pane === 'lucy') { lastPane = pane; return; }
  const workspace = target.closest<HTMLElement>('#duo-content-viewport, #duo-lucy-viewport, [data-workspace-pane]');
  const owner = workspace?.id === 'duo-lucy-viewport' ? 'lucy'
    : workspace?.id === 'duo-content-viewport' ? 'content'
    : workspace?.dataset.workspacePane;
  if (owner === 'content' || owner === 'lucy') { lastPane = owner; return; }
  if (target.closest('.sites-pinned-sidebar')) return;
  // Floating global controls live outside both pane DOM subtrees.
  const rect = target.getBoundingClientRect();
  const x = point?.x ?? rect.left + rect.width / 2;
  const y = point?.y ?? rect.top + rect.height / 2;
  for (const candidate of WORKSPACE_PANES) {
    const paneRect = workspacePaneElement(candidate)?.getBoundingClientRect();
    if (paneRect && paneRect.width > 0 && paneRect.height > 0 && x >= paneRect.left && x < paneRect.right && y >= paneRect.top && y < paneRect.bottom) lastPane = candidate;
  }
}

/**
 * The remembered source, unless folding has hidden it. A popup opened by an
 * event or a global control while folded belongs to the screen on show;
 * assigning it to the hidden pane would mount an invisible dialog.
 */
export function getLastOverlayPane(): OverlayPane {
  if (lastPane === 'main' || typeof document === 'undefined') return lastPane;
  if (isPaneOnScreen(lastPane)) return lastPane;
  const visible = WORKSPACE_PANES.find(isPaneOnScreen);
  return visible ?? lastPane;
}
