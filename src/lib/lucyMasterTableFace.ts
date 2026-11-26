export type LucyMasterTableFace = 'saju' | 'tarot' | 'recommended' | 'scrolls' | 'engines';

export type LucyMasterTableFaceAction =
  | { type: 'stage-changed'; depth: number; changed: boolean }
  | { type: 'answer-updated' }
  | { type: 'mode-reset' }
  | { type: 'tarot-requested' }
  | { type: 'tab-selected'; face: LucyMasterTableFace };

/**
 * 루시프로(점술모드)는 하나의 통합 상담이라 단계별 기본 화면이 없다.
 * 들어오면 언제나 사주 원국에서 시작하고, 타로·13대 도구·12대 양피지·엔진함은 탭으로 바로 연다.
 */
export function getLucyMasterDefaultTableFace(_depth?: number): LucyMasterTableFace {
  return 'saju';
}

/**
 * The unified mode has no stage changes; a reset or a requested face moves the view,
 * an answer alone keeps the user's tab choice.
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
