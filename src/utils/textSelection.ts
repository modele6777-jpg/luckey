/**
 * useTextSelection - 앱 내 드래그 선택 텍스트를 감지하고 저장하는 전역 유틸리티
 * 선택된 텍스트를 sessionStorage에 저장(TTL 8초)하고,
 * Lucy/Orb 페이지 진입 시 자동으로 질문/고민으로 주입합니다.
 */

const SELECTION_KEY = 'prism_selected_text';
const SELECTION_AT_KEY = 'prism_selected_at';
const SELECTION_TTL_MS = 8000;

export function saveSelectedText(text: string): void {
  try {
    const trimmed = text.trim();
    if (trimmed.length < 5) {
      sessionStorage.removeItem(SELECTION_KEY);
      sessionStorage.removeItem(SELECTION_AT_KEY);
      return;
    }
    sessionStorage.setItem(SELECTION_KEY, trimmed.slice(0, 2000));
    sessionStorage.setItem(SELECTION_AT_KEY, String(Date.now()));
  } catch (_) {}
}

export function getAndClearSelectedText(): string | null {
  try {
    const text = sessionStorage.getItem(SELECTION_KEY);
    const at = Number(sessionStorage.getItem(SELECTION_AT_KEY) || '0');
    sessionStorage.removeItem(SELECTION_KEY);
    sessionStorage.removeItem(SELECTION_AT_KEY);
    if (!text || !at) return null;
    if (Date.now() - at > SELECTION_TTL_MS) return null;
    return text;
  } catch (_) {
    return null;
  }
}

export function initGlobalTextSelectionTracker(): () => void {
  const handlePointerUp = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length >= 5) {
        saveSelectedText(selection.toString());
      }
    }, 50);
  };

  document.addEventListener('mouseup', handlePointerUp);
  document.addEventListener('touchend', handlePointerUp);

  return () => {
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchend', handlePointerUp);
  };
}
