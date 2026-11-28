import type { DivinationToolId } from '@/lib/lucyToolRegistry';

/**
 * ✏️ 도구함(헤더 버튼) 하나가 여는 두 가지 창.
 * - divination: 점술모드 도구함 (사주·타로·13대 도구 탭)
 * - chat: 일반 채팅 엔진함 (심층 관점 설명)
 * 답변 끝 버튼(관점·도구)도 같은 창을 열되, 각자 맞는 창으로 연다.
 */
export type LucySheetVariant = 'divination' | 'chat';

export interface LucySheetState {
  open: boolean;
  variant: LucySheetVariant;
}

export const CLOSED_LUCY_SHEET: LucySheetState = { open: false, variant: 'chat' };

/** The shared sheet activates only the header button that owns its current variant. */
export function isLucySheetButtonExpanded(state: LucySheetState, isMasterMode: boolean): boolean {
  return state.open && state.variant === (isMasterMode ? 'divination' : 'chat');
}

/**
 * 코스믹 프로가 펼친 화면의 왼쪽에 있는지.
 * 가로로 펼쳐져 있고, 좌우가 바뀌지 않았으며, 콘텐츠 칸에 코스믹 프로(점술 테이블)가
 * 떠 있을 때만 참이다. 세로 펼침(위·아래), 좌우 맞바꿈, 왼쪽이 다른 채널이면 거짓.
 */
export function isCosmicProOnTheLeft(input: {
  unfolded: boolean;
  landscape: boolean;
  panesSwapped: boolean;
  cosmicProMounted: boolean;
}): boolean {
  return input.unfolded && input.landscape && !input.panesSwapped && input.cosmicProMounted;
}

/** 도구함(오브)은 루시프로이면서 코스믹 프로가 왼쪽에 있을 때만 숨긴다. */
export function shouldShowLucyToolsCabinet(isMasterMode: boolean, cosmicProOnLeft: boolean): boolean {
  return !(isMasterMode && cosmicProOnLeft);
}

export type LucySheetAction =
  /** 헤더 버튼을 직접 눌렀을 때: 점술모드면 도구함, 일반 채팅이면 엔진함 */
  | { type: 'button'; isMasterMode: boolean }
  /** 답변 끝 '이 답변 관점' 버튼: 엔진함을 연다 */
  | { type: 'engine-box' }
  /** 답변 끝 '이 답변 도구' 버튼: 점술 도구함을 연다 */
  | { type: 'divination-tool' }
  | { type: 'close' };

export function reduceLucySheet(state: LucySheetState, action: LucySheetAction): LucySheetState {
  switch (action.type) {
    case 'button':
      return { open: true, variant: action.isMasterMode ? 'divination' : 'chat' };
    case 'engine-box':
      return { open: true, variant: 'chat' };
    case 'divination-tool':
      return { open: true, variant: 'divination' };
    case 'close':
      return { ...state, open: false };
    default:
      return state;
  }
}

/**
 * 점술 도구함에서 지금 보여줄 탭.
 * 잠긴 도구도 설명을 보려고 고를 수 있다. 계산 화면은 이번 질문에 쓴 도구만 연다.
 */
export function pickActiveDivinationTab(
  views: readonly { id: DivinationToolId; locked: boolean }[],
  tab: DivinationToolId,
  requestedTab: DivinationToolId | null,
): DivinationToolId {
  if (requestedTab && views.some(view => view.id === requestedTab)) return requestedTab;
  if (views.some(view => view.id === tab)) return tab;
  return (views.find(view => !view.locked)?.id ?? 'saju') as DivinationToolId;
}
