export type OverlayPane = 'main' | 'content' | 'lucy';
let lastPane: OverlayPane = 'content';

/** Remember the source before React opens a document-hosted dialog. */
export function rememberOverlayPane(target: EventTarget | null, point?: { x: number; y: number }) {
  if (!(target instanceof Element)) return;
  const portal = target.closest<HTMLElement>('[data-overlay-pane]');
  const pane = portal?.dataset.overlayPane;
  if (pane === 'content' || pane === 'lucy') lastPane = pane;
  else if (target.closest('#duo-content-viewport')) lastPane = 'content';
  else if (target.closest('#duo-lucy-viewport')) lastPane = 'lucy';
  else if (!target.closest('.sites-pinned-sidebar')) {
    // Floating global controls live outside both pane DOM subtrees.
    const rect = target.getBoundingClientRect();
    const x = point?.x ?? rect.left + rect.width / 2;
    const y = point?.y ?? rect.top + rect.height / 2;
    for (const [id, owner] of [['duo-content-viewport', 'content'], ['duo-lucy-viewport', 'lucy']] as const) {
      const paneRect = document.getElementById(id)?.getBoundingClientRect();
      if (paneRect && paneRect.width > 0 && paneRect.height > 0 && x >= paneRect.left && x < paneRect.right && y >= paneRect.top && y < paneRect.bottom) lastPane = owner;
    }
  }
}
export function getLastOverlayPane(): OverlayPane { return lastPane; }
