const LUCY_PATHS = new Set(['/', '/chat', '/lucy', '/chat/pro']);
const RIGHT_PANE_STAY_PATHS = new Set(['/', '/chat', '/lucy']);

export type FoldCover =
  | { kind: 'cosmic' }
  | { kind: 'lucy'; navigateTo: '/chat' | null }
  | { kind: 'channel'; navigateTo: string | null };

function cleanPath(path: string): string {
  const clean = (path || '/').split('?')[0].split('#')[0] || '/';
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/** Left pane is the Cosmic Room exactly while the route is a Lucy screen. */
export function leftPaneIsCosmicRoom(path: string): boolean {
  return LUCY_PATHS.has(cleanPath(path));
}

/**
 * Unfolded Lucy+ is Cosmic Room (left) + Lucy (right).
 * Folding keeps the pane that was touched last.
 * Touching the Cosmic Room must not fall through to the previous channel.
 */
export function resolveFoldCover(input: {
  lastTouched: 'left' | 'right';
  currentPath: string;
  lastLeftChannelPath: string;
}): FoldCover {
  const current = cleanPath(input.currentPath);
  const onLucy = leftPaneIsCosmicRoom(current);

  if (input.lastTouched === 'left' && onLucy) {
    return { kind: 'cosmic' };
  }

  if (input.lastTouched === 'right') {
    return {
      kind: 'lucy',
      navigateTo: RIGHT_PANE_STAY_PATHS.has(current) ? null : '/chat',
    };
  }

  const target = cleanPath(input.lastLeftChannelPath || current);
  const navigateTo = onLucy && target !== current ? target : null;
  return { kind: 'channel', navigateTo };
}
