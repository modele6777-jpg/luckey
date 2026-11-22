import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { getLucyTableState, LUCY_TABLE_EVENT, type LucyTableState } from '@/lib/lucyTableBus';
import { useLucyMasterDepth, requestLucyTableFace } from '@/lib/lucyMasterMode';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { MasterSajuBoard } from './MasterSajuBoard';
import { MasterToolBoard } from './MasterToolBoard';
import { LucyEngineCatalogPanel } from '@/components/chat/LucyEngineCatalogDialog';

type Face = 'saju' | 'tarot' | 'recommended' | 'scrolls' | 'engines';
const FACES: { id: Face; icon: string; label: string; stage: 1 | 2 | 3 }[] = [
  { id: 'saju', icon: '☯', label: '사주 원국', stage: 1 },
  { id: 'tarot', icon: '🃏', label: '타로', stage: 2 },
  { id: 'recommended', icon: '🧭', label: '추천 도구', stage: 3 },
  { id: 'scrolls', icon: '📜', label: '양피지', stage: 3 },
  // 엔진함: 모든 단계에서 볼 수 있는 엔진 이름·뜻 목록 (읽기 전용)
  { id: 'engines', icon: '📚', label: '엔진함', stage: 1 },
];

/**
 * 📱 접은 화면 점술모드의 "도구 보기" 창.
 * 펼친 화면 왼쪽 테이블과 같은 내용(단계별 사주 원국 · 타로 · 추천 도구 · 12대 양피지)을 창으로 띄운다.
 * 카드 뽑기는 대화에서 하므로 여기서는 이미 뽑은 카드만 다시 보여준다.
 */
export function MasterTableSheet({ onClose }: { onClose: () => void }) {
  const depth = useLucyMasterDepth();
  const [table, setTable] = useState<LucyTableState>(() => getLucyTableState());
  const [face, setFace] = useState<Face>(() => (depth >= 3 ? 'recommended' : depth === 2 ? 'tarot' : 'saju'));
  const [focusTool, setFocusTool] = useState<string | null>(null);

  useEffect(() => {
    const onTable = (e: Event) => {
      const next = (e as CustomEvent<LucyTableState>).detail;
      if (next) setTable(next);
    };
    window.addEventListener(LUCY_TABLE_EVENT, onTable);
    return () => window.removeEventListener(LUCY_TABLE_EVENT, onTable);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const visible = FACES.filter(f => f.stage <= depth);
  const shown: Face = visible.some(f => f.id === face) ? face : 'saju';

  return (
    <ScreenPortal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px]" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="점술 도구 보기"
          data-master-table-sheet
          // 창은 화면 밖(포털)에 떠서 아침·낮 밝은 테마가 카드 색을 밝게 바꿔 버린다. 늘 어두운 창으로 고정.
          data-theme-dark-island="true"
          onClick={e => e.stopPropagation()}
          className="flex h-[min(42rem,calc(var(--overlay-height,100dvh)-1.5rem))] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-b from-[#24163a] to-[#140c24] text-white shadow-2xl"
          style={{ colorScheme: 'dark' }}
        >
          <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5">
            <p className="flex-1 text-[14px] font-black text-amber-100">🔮 점술 도구 <span className="ml-1 text-[11px] font-bold text-amber-200/70">· {depth}단계</span></p>
            <button type="button" onClick={onClose} aria-label="도구 창 닫기" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"><X size={18} /></button>
          </div>
          <div className="flex shrink-0 items-stretch gap-1 px-3 pt-2 pb-1.5" role="tablist" aria-label="점술 도구 보기">
            {visible.map(item => {
              const active = shown === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-table-face={item.id}
                  onClick={() => { triggerHaptic('whitehole'); setFace(item.id); }}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border px-1 py-1.5 ${active ? 'border-amber-300/80 bg-amber-400/20 text-amber-50' : 'border-white/12 bg-white/[0.05] text-slate-200'}`}
                >
                  <span className="text-[15px] leading-none" aria-hidden="true">{item.icon}</span>
                  <span className="mt-0.5 max-w-full truncate text-[10.5px] font-bold leading-tight">{item.label}</span>
                  <span className={`text-[8px] leading-none ${active ? 'text-amber-200/90' : 'text-slate-400'}`}>{item.id === 'engines' ? '목록' : `${item.stage}단계`}</span>
                </button>
              );
            })}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            {shown === 'engines' ? (
              <LucyEngineCatalogPanel />
            ) : shown === 'saju' ? (
              <MasterSajuBoard saju={table.saju} lastAnswer={table.lastAnswer} />
            ) : shown === 'tarot' ? (
              <DrawnCards cards={table.cards} />
            ) : (
              <MasterToolBoard
                view={shown}
                tools={table.tools}
                concern={table.concern}
                lastAnswer={table.lastAnswer}
                facts={table.facts}
                toolData={table.toolData}
                focusId={focusTool}
                onFocusTool={id => { setFocusTool(id); setFace('recommended'); }}
                onShowScrolls={() => { triggerHaptic('whitehole'); setFace('scrolls'); }}
              />
            )}
          </div>
        </div>
      </div>
    </ScreenPortal>
  );
}

function DrawnCards({ cards }: { cards: LucyTableState['cards'] }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" data-master-sheet-cards="empty">
        <p className="mb-3 text-3xl" aria-hidden="true">🃏</p>
        <p className="text-sm font-bold text-amber-200">아직 뽑은 카드가 없어요</p>
        <p className="mt-1.5 text-xs text-slate-300/90 break-keep">루시가 “카드로 볼까?” 하고 물으면 대화에서 직접 섞고 골라요. 뽑은 카드는 여기서 다시 볼 수 있어요.</p>
      </div>
    );
  }
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-5 pt-2" data-master-sheet-cards="ready">
      <p className="mb-2 text-[12px] font-bold text-amber-200">이번 상담에서 뽑은 카드</p>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((card, i) => (
          <figure key={`${card.id}-${i}`} className="text-center">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.nameKo} className={`w-full rounded-lg border border-amber-200/30 shadow-md ${card.reversed ? 'rotate-180' : ''}`} loading="lazy" />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-lg border border-amber-200/30 bg-white/5 text-2xl">🃏</div>
            )}
            <figcaption className="mt-1 text-[11px] font-bold text-white break-keep">{card.nameKo}</figcaption>
            <p className="text-[10px] text-slate-400">{card.orientationKo || (card.reversed ? '역방향' : '정방향')}</p>
          </figure>
        ))}
      </div>
    </div>
  );
}

function leftMasterTableIsVisible(): boolean {
  if (typeof document === 'undefined') return false;
  const pane = document.getElementById('duo-content-viewport');
  const table = pane?.querySelector('[data-duo-divination-tarot="true"]');
  if (!table) return false;
  const box = table.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
}

/** 왼쪽이 점술 테이블이면 엔진함만 연다. 왼쪽이 다른 화면이면 도구 팝업을 연다. */
export function MasterTableSheetButton({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        data-master-table-sheet-button
        aria-label="점술 도구 보기"
        title="점술 도구"
        onClick={() => {
          triggerHaptic('whitehole');
          if (leftMasterTableIsVisible()) {
            setOpen(false);
            requestLucyTableFace('engines');
            return;
          }
          setOpen(true);
        }}
        className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-bold backdrop-blur-md active:scale-95 ${tone === 'light'
          ? 'border-slate-300/80 bg-white/80 text-slate-700'
          : 'border-amber-200/30 bg-amber-400/10 text-amber-100'}`}
      >
        <span aria-hidden="true">🔮</span>
        도구
      </button>
      {open && <MasterTableSheet onClose={() => setOpen(false)} />}
    </>
  );
}
