import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { LUCY_ENGINE_BOX_CLOSE_EVENT, LUCY_ENGINE_BOX_OPEN_EVENT, openLucyEngineBox } from '@/lib/lucyTableBus';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/**
 * 🔮 점술모드(루시프로) 헤더의 연필 버튼 — 엔진함을 연다.
 * 사용자 지시: "루시점술모드에도 상단에 연필버튼 만들어서 엔진함을 만들어줘" (2026-11-27)
 *
 * 점술 도구함(오브 버튼)과 이 버튼을 분리해 두어, 점술 도구 창은 그대로 두고 엔진함만 따로 연다.
 * 창 자체는 헤더의 `MasterTableSheetButton`이 가진 엔진함(📚 엔진함 · 심층 관점 설명)을 그대로 쓰므로,
 * 답변 끝 관점 버튼으로 여는 엔진함과 같은 창·같은 이동 동작을 쓴다.
 */
export function MasterEngineCatalogButton({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    window.addEventListener(LUCY_ENGINE_BOX_OPEN_EVENT, onOpen);
    window.addEventListener(LUCY_ENGINE_BOX_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(LUCY_ENGINE_BOX_OPEN_EVENT, onOpen);
      window.removeEventListener(LUCY_ENGINE_BOX_CLOSE_EVENT, onClose);
    };
  }, []);

  return (
    <button
      type="button"
      data-master-engine-catalog-button
      data-tool-button-icon="pencil"
      aria-label="엔진함 보기"
      aria-expanded={isOpen}
      title="엔진함"
      onClick={() => { triggerHaptic('whitehole'); openLucyEngineBox(); }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-md active:scale-95 ${tone === 'light'
        ? 'border-slate-300/80 bg-white/80 text-slate-700'
        : 'border-amber-200/30 bg-amber-400/10 text-amber-100'}`}
    >
      <Pencil size={15} aria-hidden="true" />
    </button>
  );
}
