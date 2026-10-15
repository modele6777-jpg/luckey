import { useEffect } from 'react';
import { savePendingSelection, clearPendingSelection, getLiveSelectedText } from '../lib/selectionBridge';

interface SelectionBridgeToolbarProps {
  currentPath?: string;
}

/**
 * 🌟 SelectionBridgeToolbar (선택 텍스트 백그라운드 브릿지)
 * - 일반 본문 텍스트뿐만 아니라 input, textarea (빈칸 입력창) 및 모든 텍스트 선택(스크롤)을 포착하여
 *   빅뱅 버튼 토스 연동 파이프라인을 백그라운드에서 안전하게 구동합니다.
 * - 스크롤 취소/해제 시 clearPendingSelection()을 호출하여 대기 토스 모드를 안전하게 초기화합니다.
 */
export default function SelectionBridgeToolbar({ currentPath: _currentPath }: SelectionBridgeToolbarProps) {

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    const handleSelectionChange = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (typeof window === 'undefined') return;

        // 🌟 일반 본문 및 input/textarea 빈칸 입력창 내부 선택 텍스트까지 포괄 추출
        const text = getLiveSelectedText();

        // 🛡️ 만약 사용자가 빅뱅 버튼을 조작/터치 중이라면 pendingSelection을 섣불리 지우지 않고 보존!
        const isBigBangActive = Boolean(
          document.querySelector('#bigbang-omnibutton:active, [data-bigbang="true"]:active') ||
          (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bigbang_pressing') === 'true')
        );
        if (isBigBangActive) {
          return;
        }

        // 🎯 스크롤(선택) 취소 감지:
        // 선택이 없거나 해제되었거나 2글자 미만이면 대기 토스모드 정리
        if (!text || text.length < 2) {
          clearPendingSelection();
          return;
        }

        // 유효한 선택 텍스트 백그라운드 저장 (빅뱅 버튼 연동용)
        savePendingSelection(text, undefined, window.location.pathname);
      }, 120);
    };

    let clearTimer: NodeJS.Timeout | null = null;
    const handleDocumentMouseDown = (e: MouseEvent | TouchEvent) => {
      // 대기 중인 선택이 전혀 없으면 불필요한 DOM 질의 및 타이머 스케줄링 즉시 생략
      if (typeof sessionStorage === 'undefined' || !sessionStorage.getItem('prism_dragged_selection_context')) {
        return;
      }

      // 🛡️ 빅뱅 버튼이나 토스 조작 트리거를 클릭/터치할 때는 selection을 지우지 않고 유지!
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('#bigbang-omnibutton, [data-bigbang], [data-no-clear-selection]')) {
        return;
      }

      if (sessionStorage.getItem('bigbang_pressing') === 'true') {
        return;
      }

      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        const text = getLiveSelectedText();
        if (!text || text.length < 2) {
          clearPendingSelection();
        }
      }, 140);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearPendingSelection();
      }
    };

    // 브라우저 텍스트 선택 관련 다각도 이벤트 리스너 등록 (iOS Safari 스크롤 쓰레드 병목 방지를 위해 passive 지정)
    document.addEventListener('selectionchange', handleSelectionChange, { passive: true });
    document.addEventListener('mouseup', handleSelectionChange, { passive: true });
    document.addEventListener('touchend', handleSelectionChange, { passive: true });
    document.addEventListener('keyup', handleSelectionChange, { passive: true });
    // 💡 input / textarea 등 빈칸 내부 드래그 선택 시 발생하는 select 이벤트 (capture 모드로 감지)
    document.addEventListener('select', handleSelectionChange, true);

    document.addEventListener('mousedown', handleDocumentMouseDown, { passive: true });
    document.addEventListener('touchstart', handleDocumentMouseDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (clearTimer) clearTimeout(clearTimer);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('select', handleSelectionChange, true);

      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('touchstart', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 🎯 스크롤할 때 선택 영역 위에 일체의 배지나 툴바를 노출하지 않음
  return null;
}
