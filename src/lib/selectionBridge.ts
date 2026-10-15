/**
 * selectionBridge.ts
 * 앱 내 텍스트 선택(드래그) 감지 및 루시 채팅/크리스탈 오브 즉시 연동 브릿지
 */

export interface DraggedSelectionContext {
  text: string;
  timestamp: number;
  sourcePath?: string;
  target?: 'lucy' | 'orb' | string;
  targetMenuId?: string;
  targetPath?: string;
  contextReason?: string;
}

const SELECTION_STORAGE_KEY = 'prism_dragged_selection_context';
const MAX_VALIDITY_MS = 10 * 60 * 1000; // 10분 유효

/**
 * 🌟 브라우저 내 현재 선택(스크롤)된 모든 텍스트 추출
 * - 일반 DOM 텍스트 노드뿐만 아니라 input, textarea (빈칸 입력창) 및 contenteditable 내부 텍스트까지 완벽 지원
 */
export function getLiveSelectedText(): string {
  if (typeof window === 'undefined') return '';

  // 1. 활성화된 폼 입력 요소 (input, textarea 등 빈칸) 내부의 선택 텍스트 확인
  try {
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement)
    ) {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        const inputSelected = activeEl.value.substring(Math.min(start, end), Math.max(start, end)).trim();
        if (inputSelected.length >= 2) {
          return inputSelected;
        }
      }
    }
  } catch (_) {}

  // 2. 일반 DOM 본문 및 contenteditable 영역의 텍스트 선택 확인
  try {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const domSelected = selection.toString().trim();
      if (domSelected.length >= 2) {
        return domSelected;
      }
    }
  } catch (_) {}

  return '';
}


/**
 * 선택된 텍스트를 세션 스토리지에 안전하게 저장 (중복 저장 및 불필요한 이벤트 발행 방지)
 */
export function savePendingSelection(
  text: string,
  target?: 'lucy' | 'orb' | string,
  sourcePath?: string,
  extra?: Partial<DraggedSelectionContext>
): void {
  if (!text || text.trim().length < 2) return;
  try {
    const trimmed = text.trim();
    const existingRaw = sessionStorage.getItem(SELECTION_STORAGE_KEY);
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw) as DraggedSelectionContext;
        if (
          existing.text === trimmed &&
          existing.target === target &&
          existing.sourcePath === (sourcePath || (typeof window !== 'undefined' ? window.location.pathname : undefined))
        ) {
          return; // 동일한 선택 상태이므로 중복 디스패치 생략
        }
      } catch (_) {}
    }

    const payload: DraggedSelectionContext = {
      text: trimmed,
      timestamp: Date.now(),
      sourcePath: sourcePath || (typeof window !== 'undefined' ? window.location.pathname : undefined),
      target,
      ...(extra || {})
    };
    sessionStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(payload));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:selection_saved', { detail: payload }));
    }
  } catch (e) {
    console.warn('[SelectionBridge] Failed to save selection:', e);
  }
}

/**
 * 대기 중인 선택 텍스트를 가져오고 즉시 소모(삭제)
 */
export function getAndClearPendingSelection(): DraggedSelectionContext | null {
  try {
    const raw = sessionStorage.getItem(SELECTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraggedSelectionContext;
    sessionStorage.removeItem(SELECTION_STORAGE_KEY);

    if (Date.now() - parsed.timestamp > MAX_VALIDITY_MS) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn('[SelectionBridge] Failed to get pending selection:', e);
    return null;
  }
}

/**
 * 현재 선택된 텍스트 가져오기 (소모하지 않음)
 */
export function peekPendingSelection(): DraggedSelectionContext | null {
  try {
    const raw = sessionStorage.getItem(SELECTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraggedSelectionContext;
    if (Date.now() - parsed.timestamp > MAX_VALIDITY_MS) {
      sessionStorage.removeItem(SELECTION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (_) {
    return null;
  }
}

/**
 * 대기 중인 선택 텍스트를 즉시 삭제하고 토스 모드 취소 이벤트 발행 (선택 텍스트가 있을 때만 유효하게 발행)
 */
export function clearPendingSelection(): void {
  try {
    const existing = sessionStorage.getItem(SELECTION_STORAGE_KEY);
    if (!existing) return; // 대기 중인 선택이 없을 때는 중복 이벤트/불필요한 리렌더링 방지
    sessionStorage.removeItem(SELECTION_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:selection_cleared'));
    }
  } catch (e) {
    console.warn('[SelectionBridge] Failed to clear pending selection:', e);
  }
}

