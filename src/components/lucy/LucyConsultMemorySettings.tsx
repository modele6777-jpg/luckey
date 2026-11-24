import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { exportLucyMemoryBackup, LUCY_MEMORY_BACKUP_MAX_BYTES, restoreLucyMemoryBackup } from '@/lib/lucyMemoryBackup';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { deleteOrbMemory, orbMemorySettings, setOrbMemoryEnabled } from '@/lib/orbConsult';
import {
  deleteLucyConsultMemory,
  editLucyConsultMemory,
  LUCY_CONSULT_MODES,
  readLucyConsultMemorySettings,
  setLucyConsultMemoryEnabled,
  setLucyConsultMemorySharing,
  type LucyConsultMemory,
  type LucyConsultMode,
} from '@/lib/lucyConsultMemory';

export function LucyConsultMemorySettings({ account, mode, onChange, light }: {
  account: string; mode: LucyConsultMode; onChange?: () => void; light?: boolean;
}) {
  const [backupMessage, setBackupMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [, setRevision] = useState(0);
  const [confirmAll, setConfirmAll] = useState(false);
  const [editing, setEditing] = useState<LucyConsultMemory | null>(null);
  const settings = open ? readLucyConsultMemorySettings(account) : null;
  const legacyCount = open ? orbMemorySettings(account).legacyCount : 0;
  const changed = () => { setRevision(value => value + 1); onChange?.(); };
  const close = (next: boolean) => { setOpen(next); setConfirmAll(false); setEditing(null); };
  const toggle = (source: LucyConsultMode, enabled: boolean) => {
    if (source === 'voice') setOrbMemoryEnabled(account, enabled);
    else setLucyConsultMemoryEnabled(account, source, enabled);
    changed();
  };
  const deleteAll = () => {
    deleteOrbMemory(account);
    deleteLucyConsultMemory(account, 'chat');
    deleteLucyConsultMemory(account, 'divination');
    setConfirmAll(false);
    setEditing(null);
    changed();
  };
  const downloadBackup = () => {
    try {
      const backup = exportLucyMemoryBackup(window.localStorage, account);
      const file = new Blob([backup], { type: 'application/json' });
      if (file.size > LUCY_MEMORY_BACKUP_MAX_BYTES) throw new Error('Backup too large');
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lucy-memory-backup.json';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setBackupMessage('기억 백업을 내려받았어요. 상담 내용이 담긴 파일이니 개인적으로 보관하세요.');
    } catch {
      setBackupMessage('기억 백업을 내려받지 못했어요.');
    }
  };
  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > LUCY_MEMORY_BACKUP_MAX_BYTES) throw new Error('백업 파일이 너무 큽니다.');
      const result = restoreLucyMemoryBackup(window.localStorage, account, await file.text());
      setBackupMessage(`복원 ${result.restored}개 · 이 기기에 이미 있어 건너뜀 ${result.skipped}개. 다른 상담 화면은 새로고침 후 확인하세요.`);
      changed();
    } catch (error) {
      setBackupMessage(error instanceof SyntaxError ? '루시 기억 백업 파일을 읽지 못했어요.' : error instanceof Error ? error.message : '기억을 복원하지 못했어요.');
    }
  };
  return (
    <Dialog.Root modal={false} open={open} onOpenChange={close}>
      <Dialog.Trigger asChild>
        {mode === 'voice'
          ? <button type="button" className="lucy-orb-bed">상담 기억</button>
          : <button type="button" aria-label="상담 기억" title="상담 기억" className={`p-2 rounded-xl ${light ? 'text-slate-700' : 'text-slate-200'}`}><BookOpen size={16} aria-hidden="true" /></button>}
      </Dialog.Trigger>
      {settings && (
        <ScreenPortal>
          <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
          <Dialog.Content className={`absolute left-1/2 top-1/2 flex max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl p-4 text-sm shadow-2xl ${light ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
            <div className="flex justify-between gap-4">
              <Dialog.Title className="text-base font-bold">루시 상담 기억</Dialog.Title>
              <Dialog.Close className="font-bold">닫기</Dialog.Close>
            </div>
            <Dialog.Description className="break-keep">
              모드별로 켜면 이 기기에 상담 요약을 최대 8건, 90일 동안 저장해 같은 모드에서 참고해요.
              공유를 켜면 기억이 켜진 모드끼리만 요약을 참고해요.
            </Dialog.Description>
            <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
              <legend className="mb-2 font-semibold">기억할 모드</legend>
              {(Object.keys(LUCY_CONSULT_MODES) as LucyConsultMode[]).map(source => (
                <label key={source} className="flex items-center gap-2">
                  <input type="checkbox" checked={settings.enabled[source] === true} onChange={event => toggle(source, event.target.checked)} />
                  {LUCY_CONSULT_MODES[source]}
                </label>
              ))}
            </fieldset>
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" checked={settings.sharing} onChange={event => { setLucyConsultMemorySharing(account, event.target.checked); changed(); }} />
              켜진 모드끼리 기억 공유
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={downloadBackup} className="underline">기억 백업</button>
              <label className="cursor-pointer underline">
                기억 복원
                <input type="file" accept=".json,application/json" className="sr-only" onChange={event => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = '';
                  void importBackup(file);
                }} />
              </label>
            </div>
            {backupMessage && <p role="status">{backupMessage}</p>}
            {legacyCount > 0 && <p>이전 오브 기록 {legacyCount}건은 음성모드 기억에 동의하면 가져와요. 전체 삭제로 함께 지울 수 있어요.</p>}
            {settings.entries.length === 0 && <p>저장된 상담 기억이 없어요.</p>}
            <ul className="space-y-2">
              {settings.entries.map(entry => (
                <li key={`${entry.source}:${entry.id}`} className={`space-y-2 rounded-xl p-3 ${light ? 'bg-slate-100' : 'bg-slate-800'}`}>
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>{new Date(entry.at).toLocaleDateString('ko-KR')} · {LUCY_CONSULT_MODES[entry.source]}{entry.masterName ? ` · ${entry.masterName}` : ''}</span>
                    <span className="flex gap-3">
                      <button type="button" aria-label={`수정 · ${entry.concern}`} onClick={() => setEditing(entry)}>수정</button>
                      <button type="button" aria-label={`삭제 · ${entry.concern}`} onClick={() => {
                        deleteLucyConsultMemory(account, entry.source, entry.id);
                        setEditing(null);
                        changed();
                      }}>삭제</button>
                    </span>
                  </div>
                  {editing?.id === entry.id && editing.source === entry.source ? (
                    <form className="flex flex-col gap-2" onSubmit={event => {
                      event.preventDefault();
                      if (editLucyConsultMemory(account, entry.source, entry.id, editing)) {
                        setEditing(null);
                        changed();
                      }
                    }}>
                      <label>고민<input required maxLength={160} className="w-full rounded border border-current bg-transparent px-2 py-1" value={editing.concern} onChange={event => setEditing({ ...editing, concern: event.target.value })} /></label>
                      <label>조언<textarea maxLength={160} className="w-full rounded border border-current bg-transparent px-2 py-1" value={editing.advice} onChange={event => setEditing({ ...editing, advice: event.target.value })} /></label>
                      <div className="flex gap-4"><button type="submit" disabled={!editing.concern.trim()}>저장</button><button type="button" onClick={() => setEditing(null)}>취소</button></div>
                    </form>
                  ) : (
                    <>
                      <p className="break-words">고민 · {entry.concern}</p>
                      {entry.advice && <p className="break-words">조언 · {entry.advice}</p>}
                      {entry.cards && <p className="break-words">카드 · {entry.cards}</p>}
                    </>
                  )}
                </li>
              ))}
            </ul>
            {Boolean(settings.entries.length || legacyCount) && (
              confirmAll ? (
                <div className="flex flex-wrap gap-3">
                  <p>이 기기의 세 모드 상담 기억을 모두 지울까요?</p>
                  <button type="button" onClick={deleteAll}>모두 삭제</button>
                  <button type="button" onClick={() => setConfirmAll(false)}>취소</button>
                </div>
              ) : <button type="button" onClick={() => setConfirmAll(true)} className="self-start">전체 삭제</button>
            )}
          </Dialog.Content>
        </ScreenPortal>
      )}
    </Dialog.Root>
  );
}
