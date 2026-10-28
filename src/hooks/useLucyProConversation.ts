import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { loadProHistory, saveProHistory, freshProHistory, proHistoryKey } from '@/lib/lucyProHistory';
import { getTodayDateKey } from '@/lib/dailyCache';
import type { UnifiedMessage, PersonaType } from '@/lib/chatHistorySync';

const record = <T,>(value: T): Record<PersonaType, T> => ({ lucy: value, orange: value, trinity: value, aura: value, bluebird: value, muse: value });
export function useLucyProConversation(account: string) {
  const [messages, setMessagesState] = useState(() => loadProHistory(account).messages);
  const messagesRef = useRef(messages);
  const accountRef = useRef(account);
  const dayRef = useRef(getTodayDateKey());
  const [generating, setIsGenerating] = useState(record(false));
  const [suggestions, setChatSuggestions] = useState(record<string[]>([]));
  const isGeneratingRef = useRef(record(false));
  const abortControllersRef = useRef(record<AbortController | null>(null));
  const activeAssistMsgIdRef = useRef(record<string | null>(null));
  messagesRef.current = messages;
  const setMessages = useCallback<React.Dispatch<React.SetStateAction<UnifiedMessage[]>>>((action) => {
    setMessagesState(previous => {
      const next = typeof action === 'function' ? action(previous) : action;
      saveProHistory(accountRef.current, next);
      messagesRef.current = next;
      return next;
    });
  }, []);
  const abort = useCallback(() => {
    abortControllersRef.current.lucy?.abort();
    abortControllersRef.current.lucy = null;
    activeAssistMsgIdRef.current.lucy = null;
    isGeneratingRef.current.lucy = false;
    setIsGenerating(record(false));
  }, []);
  const reset = useCallback(() => {
    abort();
    setMessages(freshProHistory().messages);
    setChatSuggestions(record<string[]>([]));
  }, [abort, setMessages]);
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
  useEffect(() => () => abortControllersRef.current.lucy?.abort(), []);
  return { messages, generating: generating.lucy, suggestions: suggestions.lucy, abort, reset,
    runtime: { account, messages: messagesRef.current, setMessages, load: () => { const current = loadProHistory(account); dayRef.current = current.day; return current.messages; }, save: (list: UnifiedMessage[]) => saveProHistory(account, list), isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions } };
}
