export type LucyMasterTableFace = 'saju' | 'tarot' | 'recommended' | 'scrolls' | 'engines';

export type LucyMasterTableFaceAction =
  | { type: 'stage-changed'; depth: number; changed: boolean }
  | { type: 'answer-updated' }
  | { type: 'mode-reset' }
  | { type: 'tarot-requested' }
  | { type: 'tab-selected'; face: LucyMasterTableFace };

/** The default left-side view for each Lucy Pro consultation stage. */
export function getLucyMasterDefaultTableFace(depth: number): LucyMasterTableFace {
  if (depth === 2) return 'tarot';
  if (depth >= 3) return 'recommended';
  return 'saju';
}

/**
 * Stage changes choose that stage's default. Answers alone do not change the
 * user's tab choice, so a manually selected view remains visible until the
 * user changes stage or selects another tab.
 */
export function reduceLucyMasterTableFace(
  current: LucyMasterTableFace,
  action: LucyMasterTableFaceAction,
): LucyMasterTableFace {
  switch (action.type) {
    case 'stage-changed':
      return action.changed ? getLucyMasterDefaultTableFace(action.depth) : current;
    case 'answer-updated':
      return current;
    case 'mode-reset':
      return 'saju';
    case 'tarot-requested':
      return 'tarot';
    case 'tab-selected':
      return action.face;
  }
}
