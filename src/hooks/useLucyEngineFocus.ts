import { useEffect, useState } from 'react';
import {
  getLastEngineFocus,
  LUCY_ENGINE_FOCUS_EVENT,
  type LucyEngineFocusRequest,
} from '@/lib/lucyTableBus';

/**
 * 엔진함이 열릴 때 "이 관점으로 이동해 달라"는 요청을 읽는다.
 * 창이 나중에 마운트되어도 마지막 요청을 쓰고, 그 뒤로는 새 요청만 따라간다.
 */
export function useLucyEngineFocusRequest(active: boolean): LucyEngineFocusRequest | null {
  const [request, setRequest] = useState<LucyEngineFocusRequest | null>(null);

  useEffect(() => {
    if (!active) {
      setRequest(null);
      return;
    }
    setRequest(getLastEngineFocus());
    const onFocus = (event: Event) => {
      const detail = (event as CustomEvent<LucyEngineFocusRequest>).detail;
      if (detail?.engineKey) setRequest(detail);
    };
    window.addEventListener(LUCY_ENGINE_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(LUCY_ENGINE_FOCUS_EVENT, onFocus);
  }, [active]);

  return request;
}
