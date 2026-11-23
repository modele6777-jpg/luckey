import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { deleteOrbMemory, orbMemorySettings, setOrbMemoryEnabled } from '@/lib/orbConsult';

export function OrbMemorySettings({ account, onChange }: { account: string; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const { enabled, entries, legacyCount } = open ? orbMemorySettings(account) : { enabled: false, entries: [], legacyCount: 0 };
  return (
    <Dialog.Root modal={false} open={open} onOpenChange={next => { setOpen(next); setConfirmAll(false); }}>
      <Dialog.Trigger asChild>
        <button type="button" className="lucy-orb-bed">상담 기억</button>
      </Dialog.Trigger>
      {open && (
        <ScreenPortal>
          <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
          <Dialog.Content className="absolute left-1/2 top-1/2 flex max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-2xl">
            <div className="flex justify-between gap-4">
              <Dialog.Title className="text-base font-bold">음성상담 기억</Dialog.Title>
              <Dialog.Close className="font-bold">닫기</Dialog.Close>
            </div>
            <Dialog.Description className="break-keep text-slate-300">
              켜면 이 기기에 고민과 마지막 조언을 최대 8건, 90일 동안 저장해 다음 오브 음성상담의 참고 자료로 보내요.
              끄면 저장과 다음 상담에서의 사용을 멈춰요. 저장된 기록은 아래에서 지울 수 있어요.
            </Dialog.Description>
            <label className="flex items-center gap-2 rounded-xl bg-slate-800 p-3">
              <input type="checkbox" checked={enabled} onChange={event => {
                setOrbMemoryEnabled(account, event.target.checked);
                onChange();
              }} />
              음성상담 기억 사용에 동의해요
            </label>
            {legacyCount > 0 && <p className="text-slate-300">이전 버전의 기록 {legacyCount}건은 동의하면 가져와요. 전체 삭제로 함께 지울 수 있어요.</p>}
            {entries.length === 0 && <p>저장된 상담 기억이 없어요.</p>}
            {entries.length > 0 && (
              <ul className="space-y-2">
                {entries.map(entry => (
                  <li key={entry.id} className="space-y-1 rounded-xl bg-slate-800 p-3">
                    <div className="flex justify-between gap-2">
                      <span>{new Date(entry.at).toLocaleDateString('ko-KR')} · {entry.masterName}</span>
                      <button type="button" onClick={() => { deleteOrbMemory(account, entry.id); onChange(); }} className="shrink-0 text-rose-200" aria-label={`삭제 · ${entry.concern}`}>삭제</button>
                    </div>
                    <p className="break-words">고민 · {entry.concern}</p>
                    {entry.advice && <p className="break-words text-slate-300">조언 · {entry.advice}</p>}
                    {entry.cards && <p className="break-words text-slate-300">카드 · {entry.cards}</p>}
                  </li>
                ))}
              </ul>
            )}
            {Boolean(entries.length || legacyCount) && (
              confirmAll ? (
                <div className="flex flex-wrap items-center gap-3">
                  <p>이 기기의 음성상담 기억을 모두 지울까요?</p>
                  <button type="button" onClick={() => { deleteOrbMemory(account); setConfirmAll(false); onChange(); }} className="text-rose-200">모두 삭제</button>
                  <button type="button" onClick={() => setConfirmAll(false)}>취소</button>
                </div>
              ) : <button type="button" onClick={() => setConfirmAll(true)} className="self-start text-rose-200">전체 삭제</button>
            )}
          </Dialog.Content>
        </ScreenPortal>
      )}
    </Dialog.Root>
  );
}
