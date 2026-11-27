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
 * 답변 끝 도구 버튼으로 연 도구는 이번 질문에 쓰이지 않아 탭이 잠겨 있어도 그 도구를 보여준다.
 * 그 밖에는 잠긴 탭을 피해 첫 열린 탭으로 돌린다.
 */
export function pickActiveDivinationTab(
  views: readonly { id: DivinationToolId; locked: boolean }[],
  tab: DivinationToolId,
  requestedTab: DivinationToolId | null,
): DivinationToolId {
  if (requestedTab && views.some(view => view.id === requestedTab)) return requestedTab;
  const current = views.find(view => view.id === tab);
  if (current && !current.locked) return current.id;
  return (views.find(view => !view.locked)?.id ?? 'saju') as DivinationToolId;
}
