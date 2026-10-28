import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { getTodayDateKey } from '@/lib/dailyCache';

function readChatDraft(storageKey: string): string {
  try { const draft = JSON.parse(safeLocalStorage.getItem(storageKey) || 'null'); return draft?.day === getTodayDateKey() && typeof draft.text === 'string' ? draft.text : ''; }
  catch { return ''; }
}

export function useSyncedChatDraft(account: string, scope: 'lucy' | 'lucy-pro'): [string, Dispatch<SetStateAction<string>>] {
  const key = `lucy_chat_draft_v1:${scope}:${encodeURIComponent(account)}`;
  const [snapshot, setSnapshot] = useState(() => ({ key, value: readChatDraft(key) }));
  const value = snapshot.key === key ? snapshot.value : readChatDraft(key);
  const current = useRef({ key, value });
  current.current = { key, value };
  const setValue = useCallback<Dispatch<SetStateAction<string>>>(action => {
    const { key: storageKey, value: previous } = current.current;
    const next = typeof action === 'function' ? action(previous) : action;
    current.current = { key: storageKey, value: next };
    safeLocalStorage.setItem(storageKey, JSON.stringify({ day: getTodayDateKey(), text: next }));
    setSnapshot({ key: storageKey, value: next });
  }, []);
  useEffect(() => {
    const refresh = () => setSnapshot({ key, value: readChatDraft(key) });
    const onStorage = (event: StorageEvent) => { if (event.key === key) refresh(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', refresh); };
  }, [key]);
  return [value, setValue];
}
