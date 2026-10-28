import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props { children: React.ReactNode; text: string; targetLabel: string; onForward?: (text: string) => void; disabled?: boolean }
export function ChatBubbleForward({ children, text, targetLabel, onForward, disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; start.current = null; };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, [open]);
  const show = () => { if (!disabled && onForward && text.trim()) setOpen(true); };
  return <div className="contents" style={{ WebkitTouchCallout: onForward ? 'none' : undefined }}
    onPointerDown={event => {
      if (!onForward || disabled || !event.isPrimary || event.button !== 0 || (event.target as Element).closest('button,a,input,textarea,select')) return;
      clear(); start.current = { x: event.clientX, y: event.clientY };
      timer.current = setTimeout(() => { clear(); show(); }, 500);
    }}
    onPointerMove={event => { if (start.current && Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 10) clear(); }}
    onPointerUp={clear} onPointerCancel={clear} onPointerLeave={clear}
    onContextMenu={event => { if (onForward && !disabled) { event.preventDefault(); clear(); show(); } }}>
    {children}
    {onForward && !disabled && <button type="button" className="sr-only focus:not-sr-only" onClick={show}>이 말풍선을 {targetLabel}로 전달</button>}
    {open && typeof document !== 'undefined' && createPortal(
      <div className="fixed inset-0 z-[10030] flex items-center justify-center bg-black/35 p-5" onPointerDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-label="말풍선 전달" className="w-full max-w-sm rounded-3xl border border-emerald-200 bg-white p-5 text-slate-800 shadow-2xl" onKeyDown={event => {
          if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); }
          if (event.key === 'Tab') { event.preventDefault(); (document.activeElement === confirmRef.current ? cancelRef.current : confirmRef.current)?.focus(); }
        }}>
          <p className="font-bold">{targetLabel}로 전달</p>
          <p className="mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm">{text}</p>
          <p className="mt-3 text-xs text-slate-500">선택한 말풍선만 다른 채팅에 보내고 그곳에서 대화를 이어갑니다.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={cancelRef} type="button" className="rounded-xl px-4 py-2.5 text-sm" onClick={() => setOpen(false)}>취소</button>
            <button ref={confirmRef} type="button" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white" onClick={() => { setOpen(false); onForward?.(text); }}>전달하기</button>
          </div>
        </section>
      </div>, document.body)}
  </div>;
}
