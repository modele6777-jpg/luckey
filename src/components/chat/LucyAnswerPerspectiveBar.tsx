import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DivinationToolId } from '@/lib/lucyToolRegistry';
import {
  ANSWER_ENGINE_STATUS_LABELS,
  type LucyAnswerEngineRef,
  type LucyAnswerEngines,
} from '@/lib/lucyAnswerPerspectives';

/**
 * 이름 옆 배지 문구.
 * 하나면 그 이름, 여러 개면 첫 이름 뒤에 나머지 개수를 붙인다. 예: 사주명리+2개
 */
export function engineGroupBadgeLabel(names: readonly string[]): string {
  const first = names.find(name => name.trim()) ?? '';
  if (names.length <= 1) return first;
  return `${first}+${names.length - 1}개`;
}

/**
 * 💬 루시 답변의 도구·관점 배지.
 * - 말풍선 위(기본): 쓴 도구·관점을 하나씩 보여 준다.
 * - 이름 옆: 하나면 이름만, 여러 개면 "이름+N개". 누르면 목록이 열려 각각 확인할 수 있다.
 */
export function LucyAnswerEngineBar({ engines, isLight, isMasterMode, show, onOpenPerspective, onOpenTool, className = 'mb-1.5', besideName = false }: {
  engines: LucyAnswerEngines;
  isLight: boolean;
  isMasterMode: boolean;
  show: boolean;
  onOpenPerspective: (engineKey: string) => void;
  onOpenTool: (toolId: DivinationToolId) => void;
  className?: string;
  besideName?: boolean;
}) {
  if (!show) return null;
  const tools = isMasterMode ? engines.tools.filter(tool => tool.toolId) : [];
  const perspectives = engines.perspectives;
  if (tools.length === 0 && perspectives.length === 0) return null;

  return (
    <div className={`${besideName ? 'inline-flex min-w-0 flex-wrap items-center gap-1' : 'flex w-full min-w-0 flex-col gap-1'} ${className}`} data-lucy-answer-engines data-beside-name={besideName ? 'true' : undefined}>
      {tools.length > 0 && (
        besideName
          ? <NameBadgeGroup kind="tool" items={tools} isLight={isLight} onPick={item => item.toolId && onOpenTool(item.toolId)} />
          : <ExpandedBadges kind="tool" items={tools} isLight={isLight} onPick={item => item.toolId && onOpenTool(item.toolId)} />
      )}
      {perspectives.length > 0 && (
        besideName
          ? <NameBadgeGroup kind="perspective" items={perspectives} isLight={isLight} onPick={item => onOpenPerspective(item.key)} />
          : <ExpandedBadges kind="perspective" items={perspectives} isLight={isLight} onPick={item => onOpenPerspective(item.key)} />
      )}
    </div>
  );
}

function chipClass(kind: 'tool' | 'perspective', isLight: boolean): string {
  const tone = kind === 'tool'
    ? (isLight
      ? 'border-sky-300 bg-sky-50 text-sky-900 hover:border-sky-400 hover:bg-sky-100'
      : 'border-sky-300/35 bg-sky-400/10 text-sky-100 hover:border-sky-300/70 hover:bg-sky-400/20')
    : (isLight
      ? 'border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400 hover:bg-amber-100'
      : 'border-amber-300/40 bg-amber-400/10 text-amber-100 hover:border-amber-300/70 hover:bg-amber-400/20');
  return `flex max-w-full cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold shadow-xs transition-all hover:-translate-y-px active:translate-y-0 active:scale-95 ${tone}`;
}

function ExpandedBadges({ kind, items, isLight, onPick }: {
  kind: 'tool' | 'perspective';
  items: LucyAnswerEngineRef[];
  isLight: boolean;
  onPick: (item: LucyAnswerEngineRef) => void;
}) {
  const label = kind === 'tool' ? '🔮 이 답변 도구' : '✨ 이 답변 관점';
  const attr = kind === 'tool' ? 'data-lucy-answer-tool' : 'data-lucy-answer-perspective';
  return (
    <div className="flex flex-wrap items-center gap-1.5 pl-1" {...{ [kind === 'tool' ? 'data-lucy-answer-tools' : 'data-lucy-answer-perspectives']: '' }}>
      <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{label}</span>
      {items.map(item => (
        <button
          key={`${kind}-${item.key}`}
          type="button"
          {...{ [attr]: item.key }}
          title={`${item.nameKo} · ${ANSWER_ENGINE_STATUS_LABELS[item.status]}`}
          onClick={() => onPick(item)}
          className={chipClass(kind, isLight)}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span className="truncate">{item.nameKo}</span>
          {kind === 'tool' && (
            <span
              aria-hidden="true"
              data-lucy-answer-status={item.status}
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                item.status === 'calculated' ? 'bg-emerald-500' : item.status === 'partial' ? 'bg-amber-500' : 'bg-violet-400'
              }`}
            />
          )}
        </button>
      ))}
    </div>
  );
}

function NameBadgeGroup({ kind, items, isLight, onPick }: {
  kind: 'tool' | 'perspective';
  items: LucyAnswerEngineRef[];
  isLight: boolean;
  onPick: (item: LucyAnswerEngineRef) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const label = engineGroupBadgeLabel(items.map(item => item.nameKo));
  const groupAttr = kind === 'tool' ? 'data-lucy-answer-tools' : 'data-lucy-answer-perspectives';
  const itemAttr = kind === 'tool' ? 'data-lucy-answer-tool' : 'data-lucy-answer-perspective';

  const place = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 220;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    setBox({ top: rect.bottom + 6, left });
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  const openList = () => {
    if (items.length === 1) {
      onPick(items[0]);
      return;
    }
    place();
    setOpen(value => !value);
  };

  return (
    <div className="inline-flex" {...{ [groupAttr]: '' }}>
      <button
        ref={buttonRef}
        type="button"
        data-lucy-answer-badge={kind}
        aria-expanded={items.length > 1 ? open : undefined}
        aria-haspopup={items.length > 1 ? 'menu' : undefined}
        title={items.map(item => item.nameKo).join(', ')}
        onClick={openList}
        className={chipClass(kind, isLight)}
      >
        <span aria-hidden="true">{items[0]?.icon}</span>
        <span className="truncate">{label}</span>
      </button>
      {open && box && items.length > 1 && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          role="menu"
          data-lucy-answer-menu={kind}
          style={{ position: 'fixed', top: box.top, left: box.left, zIndex: 80, width: 220 }}
          className="max-h-64 overflow-y-auto rounded-2xl border border-amber-200/30 bg-[#1b122c] p-1.5 text-white shadow-2xl"
        >
          {items.map(item => (
            <button
              key={`${kind}-menu-${item.key}`}
              type="button"
              role="menuitem"
              {...{ [itemAttr]: item.key }}
              onClick={() => { setOpen(false); onPick(item); }}
              className="flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left text-[12px] font-semibold text-amber-50 hover:bg-white/10"
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="min-w-0 flex-1 truncate">{item.nameKo}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
