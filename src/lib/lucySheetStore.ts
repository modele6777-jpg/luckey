import { useEffect, useState } from 'react';
import { CLOSED_LUCY_SHEET, reduceLucySheet, type LucySheetAction, type LucySheetState } from './lucyToolSheetRouting';

/**
 * ✏️ 도구함·엔진함 창의 열림 상태를 버튼과 창 호스트가 함께 본다.
 *
 * 예전에는 헤더 도구함 버튼(`MasterTableSheetButton`)이 자기 reducer 상태와 창을 함께 들고 있었다.
 * 그래서 펼친 화면 루시프로에서 도구함(오브) 버튼을 숨기면(`shouldShowLucyToolsCabinet` = false)
 * 창 호스트까지 DOM에서 사라져, 남아 있는 연필(엔진함) 버튼과 답변 끝 관점 버튼이
 * `openLucyEngineBox()` 이벤트를 보내도 받아 줄 창이 없어 아무것도 열리지 않았다.
 *
 * 이제 창 호스트(`LucyToolSheetHost`)는 헤더에 항상 살아 있고, 버튼과 호스트는 이 저장소 하나만 본다.
 * (사용자 제보 2026-11-28: "펼친화면 루시프로 엔진함이 안나와")
 */
let sheetState: LucySheetState = CLOSED_LUCY_SHEET;
const listeners = new Set<() => void>();

export function getLucySheetState(): LucySheetState {
  return sheetState;
}

export function dispatchLucySheet(action: LucySheetAction): void {
  const next = reduceLucySheet(sheetState, action);
  if (next === sheetState) return;
  if (!next.open && !sheetState.open) return;
  sheetState = next;
  for (const listener of Array.from(listeners)) listener();
}

export function subscribeLucySheet(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** 창을 열고 닫는 상태를 컴포넌트에서 구독한다. */
export function useLucySheetState(): LucySheetState {
  const [state, setState] = useState<LucySheetState>(getLucySheetState);
  useEffect(() => subscribeLucySheet(() => setState(getLucySheetState())), []);
  return state;
}
