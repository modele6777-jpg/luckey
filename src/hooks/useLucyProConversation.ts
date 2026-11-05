import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { loadProHistory, saveProHistory, freshProHistory, normalizeProHistory, proHistoryKey } from '@/lib/lucyProHistory';
import { getTodayDateKey } from '@/lib/dailyCache';
import { hasRealUserConversation, mergeUnifiedMessages, type UnifiedMessage, type PersonaType } from '@/lib/chatHistorySync';
import { auth, db, doc, onSnapshot, setDoc } from '@/lib/firebase';
import { cleanFirestoreData } from '@/lib/sharedStateSync';

const record = <T,>(value: T): Record<PersonaType, T> => ({ lucy: value, orange: value, trinity: value, aura: value, bluebird: value, muse: value });
export function useLucyProConversation(account: string, cloudUid?: string) {
  const [messages, setMessagesState] = useState(() => loadProHistory(account).messages);
  const messagesRef = useRef(messages);
  const accountRef = useRef(account);
  const dayRef = useRef(getTodayDateKey());
  const [generating, setIsGenerating] = useState(record(false));
  const [suggestions, setChatSuggestions] = useState(record<string[]>([]));
  const isGeneratingRef = useRef(record(false));
  const abortControllersRef = useRef(record<AbortController | null>(null));
  const activeAssistMsgIdRef = useRef(record<string | null>(null));
  const resetRef = useRef({ uid: cloudUid, day: dayRef.current, at: 0 });
  messagesRef.current = messages;
  const setMessages = useCallback<React.Dispatch<React.SetStateAction<UnifiedMessage[]>>>((action) => {
    setMessagesState(previous => {
      const next = typeof action === 'function' ? action(previous) : action;
      saveProHistory(accountRef.current, next);
      messagesRef.current = next;
      return next;
    });
  }, []);
  const push = useCallback((list: UnifiedMessage[], _immediate?: boolean, resetAt?: number) => {
    if (!cloudUid || auth.currentUser?.uid !== cloudUid) return;
    const day = getTodayDateKey();
    const reset = resetRef.current;
    const at = resetAt ?? (reset.uid === cloudUid && reset.day === day ? reset.at : 0);
    const messages = resetAt
      ? list
      : list.filter(message => (message.timestamp || 0) >= at && (
        message.role !== 'model' || Boolean(typeof message.content === 'string' ? message.content.trim() : message.content?.length)
      ));
    if (!resetAt && !hasRealUserConversation(messages)) return;
    void setDoc(doc(db, 'chatThreads', cloudUid), {
      pro: cleanFirestoreData({ day, messages, resetAt: at }),
    }, { merge: true }).catch(error => console.warn('[Lucy Pro] Chat sync write failed:', error));
  }, [cloudUid]);
  const abort = useCallback(() => {
    abortControllersRef.current.lucy?.abort();
    abortControllersRef.current.lucy = null;
    activeAssistMsgIdRef.current.lucy = null;
    isGeneratingRef.current.lucy = false;
    setIsGenerating(record(false));
  }, []);
  const reset = useCallback(() => {
    abort();
    const day = getTodayDateKey();
    const at = Date.now();
    const fresh = freshProHistory(day, at).messages;
    resetRef.current = { uid: cloudUid, day, at };
    setMessages(fresh);
    push(fresh, true, at);
    setChatSuggestions(record<string[]>([]));
  }, [abort, cloudUid, push, setMessages]);
  useEffect(() => {
    const check = () => {
      const day = getTodayDateKey();
      const changed = accountRef.current !== account || dayRef.current !== day;
      if (changed) abort();
      accountRef.current = account;
      dayRef.current = day;
      if (changed || !isGeneratingRef.current.lucy) {
        const loaded = loadProHistory(account).messages;
        setMessagesState(previous => JSON.stringify(previous) === JSON.stringify(loaded) ? previous : loaded);
      }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === proHistoryKey(account)) check(); };
    check();
    const timer = window.setInterval(check, 30000);
    window.addEventListener('focus', check);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', check);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', check); window.removeEventListener('storage', onStorage); document.removeEventListener('visibilitychange', check); };
  }, [account, abort]);
  useEffect(() => {
    if (!cloudUid) return;
    return onSnapshot(doc(db, 'chatThreads', cloudUid), { includeMetadataChanges: true }, snapshot => {
      if (snapshot.metadata.hasPendingWrites || snapshot.metadata.fromCache || auth.currentUser?.uid !== cloudUid) return;
      const day = getTodayDateKey();
      const remote = snapshot.data()?.pro;
      const current = resetRef.current;
      const localReset = current.uid === cloudUid && current.day === day ? current.at : 0;
      const remoteReset = remote?.day === day && typeof remote.resetAt === 'number' ? remote.resetAt : 0;
      if (remoteReset < localReset) return;
      resetRef.current = { uid: cloudUid, day, at: remoteReset };
      const local = loadProHistory(account).messages.filter(message => (message.timestamp || 0) >= remoteReset);
      const incoming = normalizeProHistory(remote, day).messages;
      const merged = mergeUnifiedMessages(incoming, local);
      const activeId = activeAssistMsgIdRef.current.lucy;
      const active = messagesRef.current.find(message => message.id === activeId && (message.timestamp || 0) >= remoteReset);
      if (active && !merged.some(message => message.id === active.id)) merged.push(active);
      if (JSON.stringify(messagesRef.current) !== JSON.stringify(merged)) setMessages(merged);
      if (!isGeneratingRef.current.lucy && JSON.stringify(incoming) !== JSON.stringify(merged)) push(merged);
    }, error => console.warn('[Lucy Pro] Chat sync listener failed:', error));
  }, [account, cloudUid, push, setMessages]);
  useEffect(() => () => abortControllersRef.current.lucy?.abort(), []);
  return { messages, generating: generating.lucy, suggestions: suggestions.lucy, abort, reset,
    runtime: { account, messages: messagesRef.current, setMessages, load: () => { const current = loadProHistory(account); dayRef.current = current.day; return current.messages; }, save: (list: UnifiedMessage[]) => saveProHistory(account, list), push, isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions } };
}
