import { syncDataSignature } from '@/lib/continuousDataSync';
import { recoveringSubscription } from '@/lib/recoveringSubscription';
import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { loadProHistory, saveProHistory, freshProHistory, normalizeProHistory, proHistoryKey } from '@/lib/lucyProHistory';
import { getTodayDateKey } from '@/lib/dailyCache';
import { hasRealUserConversation, mergeUnifiedMessages, type UnifiedMessage, type PersonaType } from '@/lib/chatHistorySync';
import { auth, db, doc, onSnapshot, setDoc, getDocFromServer } from '@/lib/firebase';
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
  const publishRef = useRef<((list:UnifiedMessage[])=>void)|null>(null);
  const publishedRef = useRef({uid:'',signature:''});
  messagesRef.current = messages;
  const setMessages = useCallback<React.Dispatch<React.SetStateAction<UnifiedMessage[]>>>((action) => {
    setMessagesState(previous => {
      const next = typeof action === 'function' ? action(previous) : action;
      saveProHistory(accountRef.current, next, resetRef.current.at);
      messagesRef.current = next;
      publishRef.current?.(next);
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
    const pro=cleanFirestoreData({day,messages,resetAt:at});
    const signature=syncDataSignature(pro);
    if(publishedRef.current.uid===cloudUid&&publishedRef.current.signature===signature)return;
    publishedRef.current={uid:cloudUid,signature};
    void setDoc(doc(db, 'chatThreads', cloudUid), {pro}, {merge:true}).catch(error=>{
      if(publishedRef.current.uid===cloudUid&&publishedRef.current.signature===signature)publishedRef.current={uid:cloudUid,signature:''};
      console.warn('[Lucy Pro] Chat sync write failed:',error);
    });
  }, [cloudUid]);
  publishRef.current=push;
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
        const history = loadProHistory(account);
        if(changed||resetRef.current.uid!==cloudUid||resetRef.current.day!==day)resetRef.current={uid:cloudUid,day,at:history.resetAt||0};
        else resetRef.current.at=Math.max(resetRef.current.at,history.resetAt||0);
        const loaded=history.messages;
        setMessagesState(previous => syncDataSignature(previous) === syncDataSignature(loaded) ? previous : loaded);
      }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === proHistoryKey(account)) check(); };
    check();
    const timer = window.setInterval(check, 30000);
    window.addEventListener('focus', check);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', check);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', check); window.removeEventListener('storage', onStorage); document.removeEventListener('visibilitychange', check); };
  }, [account, abort, cloudUid]);
  useEffect(() => {
    if (!cloudUid) return;
    const ref=doc(db, 'chatThreads', cloudUid);
    const receive=(snapshot:any) => {
      if (snapshot.metadata.hasPendingWrites || snapshot.metadata.fromCache || auth.currentUser?.uid !== cloudUid) return;
      const day = getTodayDateKey();
      const remote = snapshot.data()?.pro;
      const current = resetRef.current;
      const history=loadProHistory(account);
      const localReset = Math.max(current.uid === cloudUid && current.day === day ? current.at : 0,history.resetAt||0);
      const remoteReset = remote?.day === day && typeof remote.resetAt === 'number' ? remote.resetAt : 0;
      if (remoteReset < localReset) {push(history.messages,true,localReset);return;}
      if (remoteReset > localReset) abort();
      resetRef.current = { uid: cloudUid, day, at: remoteReset };
      const local = history.messages.filter(message => (message.timestamp || 0) >= remoteReset);
      const incoming = normalizeProHistory(remote, day).messages;
      publishedRef.current={uid:cloudUid,signature:syncDataSignature({day,messages:incoming,resetAt:remoteReset})};
      const merged = mergeUnifiedMessages(incoming, local);
      const activeId = activeAssistMsgIdRef.current.lucy;
      const active = messagesRef.current.find(message => message.id === activeId && (message.timestamp || 0) >= remoteReset);
      if (active && !merged.some(message => message.id === active.id)) merged.push(active);
      if (syncDataSignature(messagesRef.current) !== syncDataSignature(merged)) setMessages(merged);
      if (!isGeneratingRef.current.lucy && syncDataSignature(incoming) !== syncDataSignature(merged)) push(merged);
    };
    return recoveringSubscription({
      watch:(next,error)=>onSnapshot(ref,{includeMetadataChanges:true},next,error),
      load:()=>getDocFromServer(ref),receive,
      isServer:(snapshot:any)=>!snapshot.metadata?.fromCache&&!snapshot.metadata?.hasPendingWrites,
      visible:()=>document.visibilityState==='visible',events:window,document,
    });
  }, [account, cloudUid, push, setMessages, abort]);
  useEffect(() => () => abortControllersRef.current.lucy?.abort(), []);
  return { messages, generating: generating.lucy, suggestions: suggestions.lucy, abort, reset,
    runtime: { account, messages: messagesRef.current, setMessages, load: () => { const current = loadProHistory(account); dayRef.current = current.day; return current.messages; }, save: (list: UnifiedMessage[]) => saveProHistory(account, list), push, isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions } };
}
