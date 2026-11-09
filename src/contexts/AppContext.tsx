import { setDoc as writeFirestoreDocument } from 'firebase/firestore';
import { createContinuousDataSync, localSyncChangeToken, syncDataSignature, localActivityPatch } from '../lib/continuousDataSync';
import { recoveringSubscription } from '../lib/recoveringSubscription';
import { formatLucyConversationMemory } from '../lib/lucyConversationMemory';
import { buildLucyCriticalFacts, formatLucyCriticalFacts } from '../lib/lucyCriticalFacts';
import { LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, LUCY_REVIEW_MODEL, LUCY_REVIEW_FALLBACK_MODELS } from '../lib/lucyModelPolicy';
import { reviewLucyReply } from '../lib/lucyReplyReview';
import { CALCULATION_HONESTY_RULE } from '../lib/divination/calculationAudit';
import type { CalculationAuditItem } from '../lib/divination/calculationAudit';
import { TAROT_NO_DRAW_RULE, verifyLucyTarotReply, isLucyTarotDrawRequest, revealLucyTarotDrawCard, type LucyTarotDraw } from '../lib/lucyTarotIntegrity';
import { drawLucyTarotCards, formatTarotMarker } from '../utils/tarotDetector';
import { buildLucyTarotReadingPrompt, LUCY_TAROT_RESPONSE_PROFILE } from '../lib/lucyTarotReading';
import { memoryFromMessages, mergeLucyMemory, readLucyMemory, writeLucyMemory, lucyMemorySignature, recallLucyLongTermMemory } from '../lib/lucyLongTermMemory';
import { buildLucySharedBackground } from '../lib/lucySharedBackground';
import { buildFullProfilePrompt } from '../lib/divination/profileContext';
import { buildFatePreviewPrompt } from '../lib/divination/fatePreview';
import { useLucyProConversation } from '@/hooks/useLucyProConversation';
import { resolveLucyPageChannels } from '@/lib/lucyChatPageMode';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, getDoc, getDocFromServer, setDoc, onSnapshot, serverTimestamp, type User, addDoc, collection } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { mergeUserProfiles, type SharedState, type UserProfile } from '../lib/sharedState';
import { loadProfileFromAllVaults, saveProfileToAllVaults } from '../lib/profileVault';
import { syncPrismAcrossDevices, type PrismSyncResult } from '../lib/prismSync';
import { unpackAndHydrateLocalStorage, cleanFirestoreData, mergeSharedState, getSharedStateSignature, collectAllLocalActivities, getSharedStateUpdatedAt } from '../lib/sharedStateSync';
import { pushToServerVault, pullFromServerVault, generatePairingCode, importWithPairingCode, pushToPairedVault, pullFromPairedVault, getPairedVaultId, setPairedVaultId, subscribeToPairedVault } from '../lib/serverSyncClient';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import { createBatchedPersistence } from '../lib/batchedPersistence';
import { invokeLLM, invokeLLMStream, PERSONAS, type Message, getCrossAppRecentDialogueContext, LUCY_CHAT_MODEL } from '../lib/ai';
import { buildPrismOmniscientContext } from '../lib/prismOmniSync';
import { calculateDetailedSaju } from '../lib/sajuAnalysis';
import { buildUserNatalSummary, formatRelationshipsContext } from '../lib/astrologyAnalysis';
import { selectOptimalDivinationTools, FIFTEEN_DIVINATION_TOOLS, type SevenThemeChannel, type SelectedDivinationToolsResult } from '../lib/fifteenDivinationTools';
// Heavy wisdom engines are dynamically imported on first chat use to reduce initial bundle parse time
// import { buildEarlyBuddhismSystemPrompt } from '../lib/earlyBuddhismWisdom';
// import { buildGnosticSystemPrompt } from '../lib/gnosticWisdom';
// import { buildAcimSystemPrompt } from '../lib/acimWisdom';
// import { buildDistancingSystemPrompt } from '../lib/distancingWisdom';
// import { buildSedonaSystemPrompt } from '../lib/sedonaWisdom';
// import { buildLettingGoSystemPrompt } from '../lib/lettingGoWisdom';
import { loadSavedUnifiedMessages, saveUnifiedMessagesSafely, mergeUnifiedMessages, hasRealUserConversation, createDefaultGreeting } from '../lib/chatHistorySync';
import { ALL_DCE_ENGINES } from '../lib/divination/deterministicEngine';
import { processDailyChatArchival, archiveAndResetChat } from '../lib/chatMemoryArchive';
import {
  SUGGESTIONS_SYSTEM_SUFFIX,
  parseSuggestions,
  cleanChatDisplayText,
} from '../utils/suggestions';
import { hasUnlockedPinToday, markPinUnlockedToday, clearPinUnlockedToday, getTodayDateKey } from '../lib/dailyCache';
import { PERSONA_GREETINGS, PRISM_VOICE_RULES, LUCY_CHAT_VOICE_RULES, resolveLucyResponseLength, LUCY_RESPONSE_PROFILES } from '../lib/copyTone';
import { isMobileDevice, isPerfReduced, isStandalonePWA } from '../lib/perfMode';
import { validateAndExtractKeyExercise } from '../lib/keyExercisesCatalog';
import { resetLucyContextOnTaskSwitch } from '../lib/lucyChatUtils';

export type PersonaType = 'lucy' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse';

export interface UnifiedMessage {
  tarotDraw?: LucyTarotDraw;
  id?: string;
  role: 'system' | 'user' | 'model' | 'assistant';
  content: string | any[];
  timestamp?: number;
  persona?: PersonaType;
  channel?: string;
  channels?: string[];
  mode?: string;
  keyExerciseIndex?: number;
  usedTools?: string[];
  calculationAudit?: CalculationAuditItem[];
  divinationContext?: string;
}

export interface SendUnifiedMessageOptions {
  tarotCardMarkers?: string;
  conversationId?: 'lucy' | 'lucy-pro';
  extraSystemContext?: string;
  systemSuffix?: string;
  onFinish?: (fullText: string, sentText: string, messageId?: string) => void | Promise<void>;
  forcePersona?: PersonaType;
  channel?: string;
  channels?: string[];
  mode?: string;
  keyExerciseIndex?: number;
  force?: boolean;
  oracleContext?: string;
  customUserProfile?: UserProfile;
  usedTools?: string[];
  calculationAudit?: CalculationAuditItem[];
  isLucyPlus?: boolean;
}

interface AppContextValue {
  firebaseUser: User | null;
  isAuthReady: boolean;
  isUnlocked: boolean;
  unlock: (code: string) => boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDeveloper: () => void;
  signInAsPairedSession: (vaultId?: string) => void;
  logout: () => Promise<void>;
  sharedState: SharedState | null;
  updateSharedState: (updates: Partial<SharedState>, sourceApp: string) => Promise<void>;
  syncPrismDevices: () => Promise<PrismSyncResult>;
  isSyncing: boolean;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activePersona: PersonaType;
  setActivePersona: (persona: PersonaType) => void;
  lucyProMessages: UnifiedMessage[];
  isLucyProGenerating: boolean;
  abortLucyProGenerating: () => void;
  clearLucyProMessages: () => void;
  personaMessages: Record<PersonaType, UnifiedMessage[]>;
  setPersonaMessages: React.Dispatch<React.SetStateAction<Record<PersonaType, UnifiedMessage[]>>>;
  isGenerating: Record<PersonaType, boolean>;
  abortGenerating: (persona?: PersonaType) => void;
  revealLucyTarotCard: (messageId: string, cardId: string, conversationId?: 'lucy' | 'lucy-pro') => void;
  sendUnifiedMessage: (
    text: string,
    forcePersona?: PersonaType,
    attachedImage?: string,
    options?: SendUnifiedMessageOptions
  ) => Promise<void>;
  chatSuggestions: Record<PersonaType, string[]>;
  openLucyChat: (
    persona?: PersonaType | 'epilogue' | string,
    options?: { autoSendPrompt?: string; draftPrompt?: string; mode?: string }
  ) => void;
  openHandbook: (theme?: string) => void;
  clearPersonaMessages: (persona?: PersonaType) => void;
  generateDevicePairingCode: () => Promise<{ code: string; expiresAt: number } | null>;
  importDevicePairingCode: (code: string) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextValue | null>(null);

const isLegacyAIErrorMessage = (message: UnifiedMessage): boolean => {
  if (message.role !== 'model' && message.role !== 'assistant') return false;
  if (typeof message.content !== 'string') return false;

  const normalized = message.content.toLowerCase();
  return [
    'ai service connection and call error',
    'invalid api key',
    'gemini_api_key',
    'permission_denied',
    'api key was reported as leaked',
  ].some((marker) => normalized.includes(marker));
};

const localKey = (uid: string) => `lucy_state_${uid}`;
const GUEST_KEY = 'lucy_state_guest';
const PERSISTENT_PROFILE_KEYS = [
  'prism_user_profile',
  'prism_user_profile_backup',
  'prism_user_profile_secure',
  'prism_user_profile_cloud_cache',
  'lucy_user_profile_v1',
  'lucy_user_profile_permanent'
] as const;

export function getPersistentUserProfile(): UserProfile | undefined {
  return loadProfileFromAllVaults();
}

export function setPersistentUserProfile(profile: UserProfile | undefined) {
  saveProfileToAllVaults(profile);
}

function safeJsonStringify(obj: any): string {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return undefined;
      }
      if (
        value instanceof HTMLElement || 
        (typeof Audio !== "undefined" && value instanceof Audio) || 
        (value.constructor && value.constructor.name === "HTMLAudioElement")
      ) {
        return undefined;
      }
      cache.add(value);
    }
    return value;
  });
}

function loadFromLocal(uid: string): SharedState | null {
  try {
    const raw = safeLocalStorage.getItem(localKey(uid));
    const parsed = raw ? (JSON.parse(raw) as SharedState) : null;
    const fallbackProfile = getPersistentUserProfile();
    if (parsed) {
      if (fallbackProfile) {
        parsed.userProfile = mergeUserProfiles(parsed.userProfile, fallbackProfile);
      }
      return parsed;
    }
    if (fallbackProfile) {
      return { userProfile: fallbackProfile };
    }
    return null;
  } catch {
    return null;
  }
}

function saveToLocal(uid: string, state: SharedState) {
  try {
    if (state?.userProfile) {
      setPersistentUserProfile(state.userProfile);
    }
    safeLocalStorage.setItem(localKey(uid), safeJsonStringify(state));
  } catch {}
}

function loadGuestState(): SharedState | null {
  try {
    const raw = safeLocalStorage.getItem(GUEST_KEY);
    const parsed = raw ? (JSON.parse(raw) as SharedState) : null;
    const fallbackProfile = getPersistentUserProfile();
    if (parsed) {
      if (fallbackProfile) {
        parsed.userProfile = mergeUserProfiles(parsed.userProfile, fallbackProfile);
      }
      return parsed;
    }
    if (fallbackProfile) {
      return { userProfile: fallbackProfile };
    }
    return null;
  } catch {
    return null;
  }
}

function saveGuestState(state: SharedState) {
  try {
    if (state?.userProfile) {
      setPersistentUserProfile(state.userProfile);
    }
    safeLocalStorage.setItem(GUEST_KEY, safeJsonStringify(state));
  } catch {}
}

const AUTH_UID_SESSION_KEY = 'prism_auth_uid';
/**
 * 박주형 님 전용 마스터 볼트 키: 원클릭 연동(모바일)과 구글 로그인(PC)이
 * 이 하나의 클라우드 볼트(Firestore pairedVaults/sharedState/chatThreads)를 공유해
 * 모든 데이터가 실시간 양방향 동기화됩니다.
 */
const MASTER_VAULT_ID = 'master_modele6777';
/** 마스터 볼트를 공유할 계정: 원클릭 연동 또는 본인 구글 계정 로그인. */
const isMasterVaultAccount = (user: { uid?: string; email?: string | null } | null, bypass: boolean): boolean =>
  bypass || Boolean(user?.email && user.email.toLowerCase() === 'modele6777@gmail.com');

// PIN-linked devices receive chatHistory through the paired state listener.
const getActiveChatDocId = (user: User | null): string | undefined =>
  user?.uid === auth.currentUser?.uid ? user?.uid : undefined;

/** 🍀 전역 토스트: 로그인 상태 전환 등 중요 순간을 앱 어디에서든 눈에 띄게 알립니다. */
export function showLucyToast(message: string, durationMs = 4200): void {
  if (typeof document === 'undefined') return;
  try {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:96px', 'transform:translateX(-50%)',
      'z-index:99999', 'padding:12px 20px', 'border-radius:16px',
      'background:linear-gradient(135deg, rgba(16,185,129,0.95), rgba(217,119,6,0.95))',
      'color:#fff', 'font-size:13px', 'font-weight:700', 'letter-spacing:-0.2px',
      'box-shadow:0 12px 40px rgba(16,185,129,0.35)',
      'backdrop-filter:blur(12px)', 'border:1px solid rgba(255,255,255,0.25)',
      'max-width:calc(100vw - 48px)', 'text-align:center', 'line-height:1.5',
      'transition:opacity 0.35s ease, transform 0.35s ease', 'opacity:0', 'translate:0 8px',
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.translate = '0 0';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.translate = '0 8px';
      setTimeout(() => { try { toast.remove(); } catch (_) {} }, 400);
    }, durationMs);
  } catch (_) {}
}
const LEGACY_UNLOCK_SESSION_KEY = 'lu_unlocked';

function readDailyUnlock(): boolean {
  if (hasUnlockedPinToday()) return true;
  try {
    if (safeSessionStorage.getItem(LEGACY_UNLOCK_SESSION_KEY) === 'true') {
      markPinUnlockedToday();
      safeSessionStorage.removeItem(LEGACY_UNLOCK_SESSION_KEY);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

function writeDailyUnlock() {
  markPinUnlockedToday();
  try {
    safeSessionStorage.removeItem(LEGACY_UNLOCK_SESSION_KEY);
  } catch {
    // ignore — in-memory unlock still applies for this tab
  }
}

let unlockMemoryFlag = readDailyUnlock();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => unlockMemoryFlag || readDailyUnlock());
  const [sharedState, renderSharedState] = useState<SharedState | null>(() => {
    const persistentProfile = getPersistentUserProfile();
    const guestState = loadGuestState();
    const initialProfile = mergeUserProfiles(persistentProfile, guestState?.userProfile);
    return {
      ...(guestState || {}),
      ...(initialProfile ? { userProfile: initialProfile } : {}),
    };
  });
  const sharedStateRef = useRef(sharedState);
  const syncBaselineRef = useRef({uid:'',ready:false});
  const setSharedState = useCallback((next: React.SetStateAction<SharedState | null>) => {
    const value = typeof next === 'function' ? next(sharedStateRef.current) : next;
    sharedStateRef.current = value;
    renderSharedState(value);
  }, []);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncInProgressRef = useRef(false);
  const [activePairedVaultId, setActivePairedVaultId] = useState<string | null>(() => getPairedVaultId());

  useEffect(() => {
    const handleVaultChange = (e: any) => {
      const vid = (e as CustomEvent)?.detail || getPairedVaultId();
      setActivePairedVaultId(vid || null);
    };
    window.addEventListener('prism:paired_vault_changed', handleVaultChange);
    return () => window.removeEventListener('prism:paired_vault_changed', handleVaultChange);
  }, []);
  const openLucyChat = useCallback((
    persona?: PersonaType | 'epilogue' | string,
    options?: { autoSendPrompt?: string; draftPrompt?: string; mode?: string }
  ) => {
    // Navigation alone must never start silent audio or request audio focus.
    const targetPersona: PersonaType = persona === 'epilogue' ? 'lucy' : ((persona as any) || 'lucy');
    setActivePersona(targetPersona);
    if (typeof window !== 'undefined') {
      const channelModeMap: Record<string, string> = {
        lucy: 'casual',      // ☀️ 프롤로그: 수다 모드
        orange: 'orange',    // 🌲 오렌지: 딥리즈닝/전략
        trinity: 'trinity',  // ✨ 트리니티: 사주/오라클
        aura: 'aura',        // ⚡ AURA: 웰니스/바이탈
        bluebird: 'bluebird',// 🐦 블루버드: 멘탈/치유
        muse: 'muse',        // 🎶 뮤즈: 창작/예술
        epilogue: 'master',  // 🌟 에필로그: 5대 우주 지능 올인원 PRO 마스터 모드
      };
      const targetMode = options?.mode || channelModeMap[persona || 'lucy'] || 'casual';
      safeSessionStorage.setItem('lucy_pro_pending_channel', targetMode);
      if (options?.autoSendPrompt) {
        safeSessionStorage.setItem('lucy_injected_auto_send', options.autoSendPrompt);
        safeSessionStorage.setItem('lucy_injected_input_draft', options.autoSendPrompt);
        window.dispatchEvent(new CustomEvent('lucy-inject-message', {
          detail: { prompt: options.autoSendPrompt, channel: targetMode }
        }));
      } else if (options?.draftPrompt) {
        safeSessionStorage.setItem('lucy_injected_input_draft', options.draftPrompt);
      }
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
    }
  }, []);

    const openHandbook = useCallback((theme?: string) => {
    const targetTheme = theme || 'prologue';
    safeSessionStorage.setItem('prism_pending_handbook_theme', targetTheme);
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: `/handbook?channel=${targetTheme}` } }));
  }, []);

  const [isChatOpen, _setIsChatOpen] = useState(false);
  const setIsChatOpen = useCallback<React.Dispatch<React.SetStateAction<boolean>>>((action) => {
    const shouldOpen = typeof action === 'function' ? action(false) : action;
    if (shouldOpen) {
      openLucyChat('lucy');
    }
    _setIsChatOpen(false);
  }, [openLucyChat]);

  // Unified Chat state
  const [activePersona, setActivePersona] = useState<PersonaType>('lucy');
  const [chatSuggestions, setChatSuggestions] = useState<Record<PersonaType, string[]>>({
    lucy: [],
    orange: [],
    trinity: [],
    aura: [],
    bluebird: [],
    muse: [],
  });

  // Single Unified Chat Timeline across all personas & portals
  const [unifiedMessages, setUnifiedMessages] = useState<UnifiedMessage[]>(() => {
    const loaded = loadSavedUnifiedMessages();
    const initialProfile = getPersistentUserProfile();
    const rawInitialNick = initialProfile?.basic?.nickname?.trim();
    const initialNick = (rawInitialNick && rawInitialNick !== '여행자' && rawInitialNick !== '사용자' && rawInitialNick !== '박주형') ? rawInitialNick : '제제';
    const result = processDailyChatArchival(loaded, initialNick);
    if (result.wasArchived) {
      saveUnifiedMessagesSafely(result.messages);
    }
    return result.messages;
  });

  // Backward compatible personaMessages mapping where all channels share the single continuous timeline
  const personaMessages = useMemo<Record<PersonaType, UnifiedMessage[]>>(() => {
    return {
      lucy: unifiedMessages,
      orange: unifiedMessages,
      trinity: unifiedMessages,
      aura: unifiedMessages,
      bluebird: unifiedMessages,
      muse: unifiedMessages,
    };
  }, [unifiedMessages]);

  const setPersonaMessages = useCallback<React.Dispatch<React.SetStateAction<Record<PersonaType, UnifiedMessage[]>>>>((action) => {
    setUnifiedMessages((prev) => {
      const dummyRecord: Record<PersonaType, UnifiedMessage[]> = {
        lucy: prev, orange: prev, trinity: prev, aura: prev, bluebird: prev, muse: prev
      };
      const result = typeof action === 'function' ? action(dummyRecord) : action;
      if (Array.isArray(result)) return result;
      return result.lucy || Object.values(result)[0] || prev;
    });
  }, []);

  const proChat = useLucyProConversation(firebaseUser?.uid || safeSessionStorage.getItem('prism_auth_uid') || 'device', getActiveChatDocId(firebaseUser));

  const [isGenerating, setIsGenerating] = useState<Record<PersonaType, boolean>>({
    lucy: false, orange: false, trinity: false, aura: false, bluebird: false, muse: false
  });
  const isGeneratingRef = useRef<Record<PersonaType, boolean>>({
    lucy: false, orange: false, trinity: false, aura: false, bluebird: false, muse: false
  });
  const abortControllersRef = useRef<Record<PersonaType, AbortController | null>>({
    lucy: null, orange: null, trinity: null, aura: null, bluebird: null, muse: null
  });

  const activeAssistMsgIdRef = useRef<Record<PersonaType, string | null>>({
    lucy: null,
    orange: null,
    trinity: null,
    aura: null,
    bluebird: null,
    muse: null,
  });
  const supersededControllersRef = useRef<WeakSet<AbortController>>(new WeakSet());

  const abortGenerating = useCallback((persona?: PersonaType) => {
    const targetPersonas: PersonaType[] = persona ? [persona] : (['lucy', 'orange', 'trinity', 'aura', 'bluebird', 'muse'] as PersonaType[]);
    targetPersonas.forEach(p => {
      if (abortControllersRef.current[p]) {
        try {
          abortControllersRef.current[p]?.abort();
        } catch (_) {}
        abortControllersRef.current[p] = null;
      }
      activeAssistMsgIdRef.current[p] = null;
      isGeneratingRef.current[p] = false;
    });
    setIsGenerating(prev => {
      const updated = { ...prev };
      targetPersonas.forEach(p => { updated[p] = false; });
      return updated;
    });
  }, []);

  // Broadcast channel for instantaneous cross-tab/PWA chat synchronization
  const chatBroadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('prism_chat_unified_sync');
        chatBroadcastRef.current = channel;

        channel.onmessage = (event) => {
          if (event.data && Array.isArray(event.data.messages)) {
            const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
            if (!isAnyGenerating) {
              const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
              const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
              const archived = processDailyChatArchival(event.data.messages, nick);
              setUnifiedMessages((prev) => mergeUnifiedMessages(prev, archived.messages));
            }
          }
        };

        return () => {
          channel.close();
          chatBroadcastRef.current = null;
        };
      } catch (e) {
        console.warn('[AppContext] BroadcastChannel init error:', e);
      }
    }
  }, []);

  // Helper to push chat history to Firestore in real-time for multi-device sync with debounce or immediate mode
  const pushChatThreadsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pushChatThreadsToFirestore = useCallback((
    messagesToPush: UnifiedMessage[] | Record<PersonaType, UnifiedMessage[]>,
    immediate = false
  ) => {
    const currentUid = getActiveChatDocId(firebaseUser);
    if (!currentUid) return;

    if (pushChatThreadsTimerRef.current) {
      clearTimeout(pushChatThreadsTimerRef.current);
      pushChatThreadsTimerRef.current = null;
    }

    const executePush = () => {
      try {
        const chatDocRef = doc(db, 'chatThreads', currentUid);
        const rawPayload = Array.isArray(messagesToPush) ? messagesToPush : (messagesToPush.lucy || Object.values(messagesToPush)[0] || []);
        // Don't push empty model placeholders to remote Firestore
        const payload = rawPayload.filter(m => m.role !== 'model' || (typeof m.content === 'string' ? m.content.trim() !== '' : !!m.content));
        const cleanList = cleanFirestoreData(payload);
        setDoc(chatDocRef, {
          messages: cleanList,
          unified: cleanList,
          updatedAt: serverTimestamp(),
          clientUpdatedAt: Date.now(),
        }, { merge: true }).catch((err) => {
          console.warn('[ChatThreads] Firestore sync notice (cached locally):', err?.message || err);
        });
      } catch (e) {
        console.warn('[ChatThreads] Failed to push to Firestore:', e);
      }
    };

    if (immediate) {
      executePush();
    } else {
      pushChatThreadsTimerRef.current = setTimeout(executePush, 200);
    }
  }, [firebaseUser]);

  // Sites uses its authenticated account independently of Firebase/PIN pairing.
  // Storage has already been reconciled before this event; refresh mounted views
  // without writing the received snapshot back to either cloud transport.
  useEffect(() => {
    const hydrateSitesState = (event: Event) => {
      const keys = (event as CustomEvent<{ keys?: string[] }>).detail?.keys;
      const cached = (firebaseUser?.uid ? loadFromLocal(firebaseUser.uid) : loadGuestState()) || {};
      const incoming = { ...cached, ...collectAllLocalActivities(firebaseUser?.uid) } as SharedState;
      // Explicit empty lists and removals must not fall back to an old cache.
      const fields: Record<string, keyof SharedState> = {
        epilogue_diary_history: 'epilogueHistory',
        luckey_user_goals_v2: 'userGoals',
        luckey_user_goals: 'userGoals',
        prism_omni_feature_history: 'featureHistory',
      };
      for (const key of keys || []) {
        if (!fields[key]) continue;
        try { (incoming as any)[fields[key]] = JSON.parse(safeLocalStorage.getItem(key) || '[]'); } catch {}
      }
      if (keys?.includes('userProfile')) {
        try { incoming.userProfile = JSON.parse(safeLocalStorage.getItem('userProfile') || '{}'); } catch {}
      }
      React.startTransition(() => setSharedState(incoming));
      if (!keys || keys.some(key => key.startsWith('chat_history') || key === 'lucy_state')) {
        const messages = loadSavedUnifiedMessages() as UnifiedMessage[];
        setUnifiedMessages(prev => {
          // Keep the local in-flight reply and accept the other device's messages.
          if (Object.values(isGeneratingRef.current).some(Boolean)) return mergeUnifiedMessages(prev, messages) as UnifiedMessage[];
          return messages;
        });
      }
      window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: incoming.userProfile }));
      window.dispatchEvent(new CustomEvent('prism:realtime_sync', { detail: incoming }));
      window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: incoming }));
      if (incoming.todayOracles) window.dispatchEvent(new CustomEvent('prism:daily_oracle_updated', { detail: incoming.todayOracles }));
      if (incoming.userGoals) {
        window.dispatchEvent(new CustomEvent('luckey-goals-sync', { detail: incoming.userGoals }));
        window.dispatchEvent(new CustomEvent('luckey:goals_synced', { detail: incoming.userGoals }));
      }
      if (incoming.epilogueHistory) window.dispatchEvent(new CustomEvent('epilogue:diary_synced', { detail: { epilogueHistory: incoming.epilogueHistory } }));
    };
    const syncStatus = (event: Event) => setIsSyncing((event as CustomEvent).detail === 'syncing');
    window.addEventListener('prism:sites_storage_applied', hydrateSitesState);
    window.addEventListener('prism:sites_sync_status', syncStatus);
    return () => {
      window.removeEventListener('prism:sites_storage_applied', hydrateSitesState);
      window.removeEventListener('prism:sites_sync_status', syncStatus);
    };
  }, [firebaseUser?.uid]);

  // Listen to cross-device chat sync events triggered by unpackAndHydrateLocalStorage
  const mergeIncomingChat = useCallback((previous: UnifiedMessage[], incoming: UnifiedMessage[]) => {
    const activeIds = Object.values(activeAssistMsgIdRef.current);
    const merged = mergeUnifiedMessages(previous, incoming);
    // Keep the local streaming bubble even while it has no text yet.
    for (const message of previous) {
      if (activeIds.includes(message.id) && !merged.some(item => item.id === message.id)) {
        merged.push(message);
      }
    }
    return merged;
  }, []);

  useEffect(() => {
    const handleChatSynced = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (Array.isArray(customEvent.detail)) {
        const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
        const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
        const archived = processDailyChatArchival(customEvent.detail, nick);
        setUnifiedMessages((prev) => {
          const merged = mergeIncomingChat(prev, archived.messages);
          return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged;
        });
      }
    };
    window.addEventListener('prism:chat_synced', handleChatSynced);
    return () => {
      window.removeEventListener('prism:chat_synced', handleChatSynced);
    };
  }, [mergeIncomingChat]);

  // Avoid serializing and writing the entire conversation on every streamed
  // animation frame. Final answers and page exit still flush immediately.
  const persistChatAction = useRef<(messages: UnifiedMessage[]) => void>(() => {});
  persistChatAction.current = messages => {
    saveUnifiedMessagesSafely(messages);
    chatBroadcastRef.current?.postMessage({ messages, timestamp: Date.now() });
    if (hasRealUserConversation(messages)) pushChatThreadsToFirestore(messages);
  };
  const chatPersistence = useRef<ReturnType<typeof createBatchedPersistence<UnifiedMessage[]>> | null>(null);
  if (!chatPersistence.current) chatPersistence.current = createBatchedPersistence(messages => persistChatAction.current(messages));
  useEffect(() => {
    if (Array.isArray(unifiedMessages)) chatPersistence.current?.schedule(unifiedMessages, !Object.values(isGeneratingRef.current).some(Boolean));
  }, [unifiedMessages]);
  useEffect(() => {
    const flush = () => chatPersistence.current?.flush();
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Automatic Midnight / Date Rollover Watcher (resets chat window daily even if tab stays open)
  useEffect(() => {
    const checkDateRollover = () => {
      const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
      if (isAnyGenerating) return;
      try {
        const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
        const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
        setUnifiedMessages((prev) => {
          const result = processDailyChatArchival(prev, nick);
          if (result.wasArchived) {
            saveUnifiedMessagesSafely(result.messages);
            return result.messages;
          }
          return prev;
        });
      } catch (_) {}
    };
    const intervalId = setInterval(checkDateRollover, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Window Focus / Visibility Change Sync & Storage Event Listener (Smart Merge)
  useEffect(() => {
    const handleSyncFromStorage = (e?: StorageEvent) => {
      // Only process storage events that specifically affect chat timeline
      if (e && e.key && !e.key.includes('chat_history') && !e.key.includes('unified') && !e.key.includes('prism_chat')) {
        return;
      }
      const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
      if (isAnyGenerating) return;

      try {
        const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
        const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
        const currentStored = loadSavedUnifiedMessages();
        const archivalResult = processDailyChatArchival(currentStored, nick);
        if (archivalResult.wasArchived) {
          saveUnifiedMessagesSafely(archivalResult.messages);
          setUnifiedMessages(archivalResult.messages);
          return;
        }

        if (hasRealUserConversation(currentStored)) {
          setUnifiedMessages((prev) => {
            const merged = mergeUnifiedMessages(prev, currentStored);
            if (JSON.stringify(prev) !== JSON.stringify(merged)) {
              return merged;
            }
            return prev;
          });
        }
      } catch (e) {
        console.warn('[AppContext] Failed to sync chat from storage event:', e);
      }
    };

    const handleSyncOnWakeup = async () => {
      handleSyncFromStorage();

      if (document.visibilityState === 'visible') {
        const uid = firebaseUser?.uid;
        if (uid) {
          try {
            const snap = await getDoc(doc(db, 'sharedState', uid));
            if (snap.exists()) {
              const remote = snap.data() as SharedState;
              const localCached = loadFromLocal(uid);
              const currentSig = getSharedStateSignature(localCached);
              const remoteSig = getSharedStateSignature(remote);
              if (currentSig !== remoteSig) {
                const merged = mergeSharedState(localCached || {}, remote);
                setSharedState(merged);
                saveToLocal(uid, merged);
                unpackAndHydrateLocalStorage(uid, merged, true);
              }
            }
          } catch (_) {}
        }
      }
    };

    window.addEventListener('storage', handleSyncFromStorage);
    window.addEventListener('focus', handleSyncOnWakeup);
    document.addEventListener('visibilitychange', handleSyncOnWakeup);

    return () => {
      window.removeEventListener('storage', handleSyncFromStorage);
      window.removeEventListener('focus', handleSyncOnWakeup);
      document.removeEventListener('visibilitychange', handleSyncOnWakeup);
    };
  }, [firebaseUser]);

  // Real-time Chat Threads Listener across devices (PC <-> Mobile)
  useEffect(() => {
    const effectiveChatId = getActiveChatDocId(firebaseUser);
    if (!effectiveChatId) return;

    const chatDocRef = doc(db, 'chatThreads', effectiveChatId);
    const unsub = onSnapshot(chatDocRef, { includeMetadataChanges: true }, (snap) => {
      // Skip local write echoes to avoid re-entrant update cycles
      if (snap.metadata.hasPendingWrites) {
        return;
      }

      if (snap.exists()) {
        const data = snap.data();
        const raw = data?.unified || data?.messages;
        if (raw) {
          let remoteList: UnifiedMessage[] = [];
          if (Array.isArray(raw)) {
            remoteList = raw.filter((m: UnifiedMessage) => !isLegacyAIErrorMessage(m));
          } else if (typeof raw === 'object') {
            Object.values(raw).forEach((msgs) => {
              if (Array.isArray(msgs)) {
                msgs.forEach((m: UnifiedMessage) => {
                  if (!isLegacyAIErrorMessage(m) && m.id !== 'greet') remoteList.push(m);
                });
              }
            });
            remoteList.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
          }

          if (remoteList.length > 0) {
            const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
            const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
            const archivalResult = processDailyChatArchival(remoteList, nick);
            if (archivalResult.wasArchived && !Object.values(isGeneratingRef.current).some(Boolean)) {
              saveUnifiedMessagesSafely(archivalResult.messages);
              setUnifiedMessages(archivalResult.messages);
              pushChatThreadsToFirestore(archivalResult.messages, true);
              return;
            }

            setUnifiedMessages((prev) => {
              const merged = mergeIncomingChat(prev, archivalResult.messages);
              if (JSON.stringify(prev) !== JSON.stringify(merged)) {
                saveUnifiedMessagesSafely(merged);
                return merged;
              }
              return prev;
            });
          }
        }
      }
    }, (err) => {
      console.warn('[ChatThreads] onSnapshot error:', (err as any).code || err.message);
    });

    return unsub;
  }, [firebaseUser, mergeIncomingChat, pushChatThreadsToFirestore]);

  const signInAsDeveloper = useCallback((silentToast = false) => {
    // ⚡ 원클릭 계정 연동: 박주형 님의 마스터 볼트(master_modele6777)로 즉시 로그인·잠금 해제합니다.
    // PC(구글 로그인)와 동일한 클라우드 볼트를 공유해 모든 데이터가 실시간 연동됩니다.
    const mockUser = {
      uid: MASTER_VAULT_ID,
      email: 'modele6777@gmail.com',
      displayName: '박주형',
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      providerId: 'google.com',
      phoneNumber: null,
      isLucyPlus: true,
      developer_bypass: true,
    } as any;
    // 모바일에서도 PC와 동일한 데이터를 즉시 쓰도록, 원클릭 계정의 로컬 저장소 키를 미리 준비합니다.
    safeLocalStorage.setItem('developer_bypass', 'true');
    safeLocalStorage.setItem(AUTH_UID_SESSION_KEY, mockUser.uid);
    // PC와 같은 마스터 볼트를 즉시 구독: 프로필·타로·대화가 실시간으로 따라옵니다.
    setPairedVaultId(MASTER_VAULT_ID);
    setActivePairedVaultId(MASTER_VAULT_ID);
    setFirebaseUser(mockUser);
    unlockMemoryFlag = true;
    setIsUnlocked(true);
    writeDailyUnlock();
    if (!silentToast) showLucyToast('⚡ 박주형 님 계정으로 1초 만에 연동되었습니다 🍀');
    // PC에서 저장된 최신 데이터를 즉시 끌어옵니다.
    void pullFromPairedVault().then((vaultState) => {
      if (!vaultState) return;
      setSharedState((prev) => {
        const merged = mergeSharedState(prev || {}, vaultState);
        saveToLocal(mockUser.uid, merged);
        unpackAndHydrateLocalStorage(mockUser.uid, merged);
        return merged;
      });
    }).catch(() => {});
  }, []);

  const unlock = useCallback((code: string): boolean => {
    if (code === '1202') {
      unlockMemoryFlag = true;
      setIsUnlocked(true);
      writeDailyUnlock();
      // 🍀 PIN 1202 해제 시 박주형 님의 마스터 볼트(master_modele6777)로 즉시 자동 로그인/연동
      if (!firebaseUser) {
        void auth.authStateReady().then(() => {
          if (!auth.currentUser) signInAsDeveloper(true);
        });
      }
      return true;
    }
    return false;
  }, [firebaseUser, signInAsDeveloper]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!firebaseUser) {
      if (hasUnlockedPinToday()) {
        unlockMemoryFlag = true;
        setIsUnlocked(true);
      } else {
        unlockMemoryFlag = false;
        setIsUnlocked(false);
      }
      return;
    }
    if (hasUnlockedPinToday()) {
      unlockMemoryFlag = true;
      setIsUnlocked(true);
    }
  }, [firebaseUser?.uid, isAuthReady]);

  // Handle redirect result on page load
  useEffect(() => {
    let mounted = true;
    getRedirectResult(auth)
      .then((result) => {
        if (mounted && result?.user) {
          setFirebaseUser(result.user);
          unlockMemoryFlag = true;
          setIsUnlocked(true);
          markPinUnlockedToday();
        }
      })
      .catch((err) => {
        console.error('[Auth] Redirect result error:', err);
        showLucyToast('Google 로그인에 실패했습니다. 계정 로그인 상태를 확인해 주세요.');
      });
    return () => { mounted = false; };
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        safeLocalStorage.removeItem('developer_bypass');
        setFirebaseUser(user);
        setIsAuthReady(true);
        unlockMemoryFlag = true;
        setIsUnlocked(true);
        markPinUnlockedToday();
        try {
          safeSessionStorage.setItem(AUTH_UID_SESSION_KEY, user.uid);
        } catch {
          // ignore
        }

        // Seamless bidirectional sync on login
        try {
          const [remoteSharedSnap, remoteProfileSnap, serverVaultState, remoteChatSnap] = await Promise.all([
            getDoc(doc(db, 'sharedState', user.uid)).catch(() => null),
            getDoc(doc(db, 'userProfiles', user.uid)).catch(() => null),
            pullFromServerVault(user.uid).catch(() => null),
            getDoc(doc(db, 'chatThreads', user.uid)).catch(() => null),
          ]);
          
          const remoteShared = remoteSharedSnap?.exists() ? (remoteSharedSnap.data() as SharedState) : null;
          const remoteProfile = remoteProfileSnap?.exists() ? (remoteProfileSnap.data() as UserProfile) : null;
          const cloudState = remoteShared || serverVaultState;
          const cloudProfile = remoteShared?.userProfile || remoteProfile || serverVaultState?.userProfile;

          const localCached = loadFromLocal(user.uid) || loadGuestState();
          const localVaultProfile = getPersistentUserProfile();

          // Lossless profile merge: combine local and cloud without data destruction
          const mergedProfile = mergeUserProfiles(localVaultProfile, cloudProfile);
          if (mergedProfile?.basic) {
            const rawN = mergedProfile.basic.nickname?.trim();
            if (!rawN || rawN === '여행자' || rawN === '사용자' || rawN === '박주형') {
              mergedProfile.basic.nickname = '제제';
            }
          }

          // Gather all local activities before merge
          const guestActivities = collectAllLocalActivities(user.uid);
          const baseLocalWithActivities: SharedState = {
            ...(localCached || {}),
            ...guestActivities,
            userProfile: mergedProfile || localCached?.userProfile || guestActivities.userProfile,
          };

          const mergedData: SharedState = mergeSharedState(
            baseLocalWithActivities,
            cloudState || {},
            getSharedStateUpdatedAt(baseLocalWithActivities),
            getSharedStateUpdatedAt(cloudState)
          );
          if (mergedProfile && Object.keys(mergedProfile).length > 0) {
            mergedData.userProfile = mergedProfile;
          }

          setSharedState(mergedData);
          saveToLocal(user.uid, mergedData);

          if (mergedProfile && Object.keys(mergedProfile).length > 0) {
            setPersistentUserProfile(mergedProfile);
            saveProfileToAllVaults(mergedProfile);
            const cleanProf = cleanFirestoreData(mergedProfile);
            const userDocRef = doc(db, 'sharedState', user.uid);
            setDoc(userDocRef, { userProfile: cleanProf, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
            const profileDocRef = doc(db, 'userProfiles', user.uid);
            setDoc(profileDocRef, { ...cleanProf, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
            pushToServerVault(user.uid, mergedData);
          }

          unpackAndHydrateLocalStorage(user.uid, mergedData, true);

          // Restore and merge chat history across devices immediately on authentication (skip if actively streaming a reply)
          if (remoteChatSnap?.exists() && !Object.values(isGeneratingRef.current).some(Boolean)) {
            const chatData = remoteChatSnap.data();
            const rawChat = chatData?.unified || chatData?.messages;
            if (rawChat) {
              let remoteList: UnifiedMessage[] = [];
              if (Array.isArray(rawChat)) {
                remoteList = rawChat.filter((m: UnifiedMessage) => !isLegacyAIErrorMessage(m));
              } else if (typeof rawChat === 'object') {
                Object.values(rawChat).forEach((msgs) => {
                  if (Array.isArray(msgs)) {
                    msgs.forEach((m: UnifiedMessage) => {
                      if (!isLegacyAIErrorMessage(m) && m.id !== 'greet') remoteList.push(m);
                    });
                  }
                });
                remoteList.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
              }
              if (remoteList.length > 0 && !Object.values(isGeneratingRef.current).some(Boolean)) {
                const rawNick = mergedData?.userProfile?.basic?.nickname?.trim();
                const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
                const remoteArchived = processDailyChatArchival(remoteList, nick);
                const localMsgs = loadSavedUnifiedMessages();
                const mergedChat = mergeUnifiedMessages(localMsgs, remoteArchived.messages);
                saveUnifiedMessagesSafely(mergedChat);
                setUnifiedMessages(mergedChat);
                if (remoteArchived.wasArchived) {
                  pushChatThreadsToFirestore(mergedChat, true);
                }
              }
            }
          }
        } catch (syncErr) {
          console.warn('[Auth] Initial cloud sync on login notice:', syncErr);
        }
      } else {
        const pairedVaultId = getPairedVaultId();
        if (safeLocalStorage.getItem('developer_bypass') === 'true' || (!pairedVaultId && hasUnlockedPinToday())) {
          signInAsDeveloper(true);
        } else if (pairedVaultId) {
          // Auto restore paired device session
          const pairedUser = {
            uid: pairedVaultId,
            email: null,
            displayName: '연동 기기',
            photoURL: null,
            emailVerified: true,
            isAnonymous: true,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => {},
            getIdToken: async () => 'paired-token',
            getIdTokenResult: async () => ({} as any),
            reload: async () => {},
            toJSON: () => ({}),
            providerId: 'paired.prism',
            phoneNumber: null,
          } as any;
          setFirebaseUser(pairedUser);
          unlockMemoryFlag = true;
          setIsUnlocked(true);
          writeDailyUnlock();
          safeLocalStorage.setItem(AUTH_UID_SESSION_KEY, pairedVaultId);
          safeSessionStorage.setItem(AUTH_UID_SESSION_KEY, pairedVaultId);
        } else {
          setFirebaseUser(null);
          try {
            safeSessionStorage.removeItem(AUTH_UID_SESSION_KEY);
            safeLocalStorage.removeItem(AUTH_UID_SESSION_KEY);
          } catch {
            // ignore
          }
        }
        setIsAuthReady(true);
      }
    }, (error) => {
      console.error('[Auth] State change error:', error);
      setIsAuthReady(true); // Still ready, just not authenticated
    });
    
    // Safety timeout: if auth hasn't signaled within 1.5 seconds, assume ready so user can use the app without freezing
    const timer = setTimeout(() => {
      setIsAuthReady((prev) => {
        if (!prev) console.warn('[Auth] Initialization timed out, forcing ready state');
        return true;
      });
    }, 1500);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [signInAsDeveloper]);

  // sharedState realtime listener
  useEffect(() => {
    if (!firebaseUser) {
      const guest = loadGuestState();
      setSharedState(guest);
      return;
    }

    const cached = loadFromLocal(firebaseUser.uid) ?? loadGuestState();
    if (cached) setSharedState(cached);

    syncBaselineRef.current = {uid:firebaseUser.uid,ready:false};
    const ref = doc(db, 'sharedState', firebaseUser.uid);
    const applySharedSnapshot = (snap: any) => {
      if(!snap.metadata?.fromCache&&!snap.metadata?.hasPendingWrites)syncBaselineRef.current={uid:firebaseUser.uid,ready:true};
      // Ignore local write optimistic echoes to prevent loops and frame drops
      if (snap.metadata.hasPendingWrites) {
        return;
      }

      if (snap.exists()) {
        const remoteData = snap.data() as SharedState;
        const currentSig = syncDataSignature(sharedStateRef.current);
        const remoteSig = syncDataSignature(remoteData);
        // If content signature is identical to current state, bypass re-render and re-hydration
        if (currentSig && remoteSig && currentSig === remoteSig) {
          return;
        }

        const localCached = loadFromLocal(firebaseUser.uid);
        const persistentProfile = getPersistentUserProfile();
        const localBestProfile = mergeUserProfiles(localCached?.userProfile, persistentProfile, true);
        const localProfTs = Number((localBestProfile as any)?.updatedAt || localBestProfile?.completedAt || localCached?.profileUpdatedAt || 0);
        const remoteProfTs = Number((remoteData?.userProfile as any)?.updatedAt || remoteData?.userProfile?.completedAt || remoteData?.profileUpdatedAt || 0);
        const preferRemoteProfile = remoteProfTs > localProfTs;
        const mergedProfile = mergeUserProfiles(
          localBestProfile,
          remoteData?.userProfile,
          preferRemoteProfile
        );
        const mergedData: SharedState = mergeSharedState(
          localCached || {},
          remoteData,
          localProfTs,
          remoteProfTs
        );
        if (mergedProfile && Object.keys(mergedProfile).length > 0) {
          mergedData.userProfile = mergedProfile;
        }
        sharedStateRef.current = mergedData;
        setSharedState(mergedData);
        saveToLocal(firebaseUser.uid, mergedData);
        if (mergedProfile && Object.keys(mergedProfile).length > 0) {
          setPersistentUserProfile(mergedProfile);
          saveProfileToAllVaults(mergedProfile);
        }

        // Unpack all today's oracle summaries, feature activity history, and sub-app libraries to local storage
        unpackAndHydrateLocalStorage(firebaseUser.uid, mergedData, true);
        window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: mergedData.userProfile }));
        window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: mergedData }));
        window.dispatchEvent(new CustomEvent('prism:realtime_sync', { detail: mergedData }));
        if (mergedData.todayOracles) {
          window.dispatchEvent(new CustomEvent('prism:daily_oracle_updated', { detail: mergedData.todayOracles }));
        }
        if (mergedData.todoMissions) {
          window.dispatchEvent(new CustomEvent('prism:todo_updated', { detail: mergedData.todoMissions }));
        }
        if (mergedData.ecprPrescription) {
          window.dispatchEvent(new CustomEvent('prism:ecpr_updated', { detail: mergedData.ecprPrescription }));
        }
        if (mergedData.oracleSessions) {
          window.dispatchEvent(new CustomEvent('prism:oracle_session_updated', { detail: mergedData.oracleSessions }));
        }
        if (mergedData.userGoals) {
          window.dispatchEvent(new CustomEvent('luckey-goals-sync', { detail: mergedData.userGoals }));
          window.dispatchEvent(new CustomEvent('luckey:goals_synced', { detail: mergedData.userGoals }));
        }
        if (mergedData.epilogueHistory) {
          window.dispatchEvent(new CustomEvent('epilogue:diary_synced', { detail: { epilogueHistory: mergedData.epilogueHistory } }));
          window.dispatchEvent(new CustomEvent('luckey:diary_synced', { detail: { epilogueHistory: mergedData.epilogueHistory } }));
        }
      } else {
        // Document does not exist on Firestore yet: initialize Firestore with persistent profile safely!
        const persistentProfile = getPersistentUserProfile();
        const localCached = loadFromLocal(firebaseUser.uid) ?? loadGuestState();
        const mergedProfile = mergeUserProfiles(persistentProfile, localCached?.userProfile, true);
        if (mergedProfile && Object.keys(mergedProfile).length > 0) {
          const initDoc: SharedState = {
            ...(localCached || {}),
            userProfile: mergedProfile,
          };
          const cleanInit = cleanFirestoreData({ ...initDoc, updatedAt: serverTimestamp() });
          setDoc(ref, cleanInit, { merge: true }).catch(() => {});
        }
      }
    };
    const unsub = recoveringSubscription({
      watch: (next, error) => onSnapshot(ref, { includeMetadataChanges: true }, next, error),
      load: () => getDocFromServer(ref), receive: applySharedSnapshot,
      isServer: (snap:any) => !snap.metadata?.fromCache && !snap.metadata?.hasPendingWrites,
      visible: () => document.visibilityState === 'visible', events: window, document,
    });

    // Direct real-time listener on userProfiles collection for instant profile sync
    const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.metadata.hasPendingWrites) return;
      if (snap.exists()) {
        const remoteProfile = snap.data() as UserProfile;
        if (!remoteProfile || Object.keys(remoteProfile).length === 0) return;
        const persistentProfile = getPersistentUserProfile();
        const localTs = Number((persistentProfile as any)?.updatedAt || persistentProfile?.completedAt || 0);
        const remoteTs = Number((remoteProfile as any)?.updatedAt || (remoteProfile as any)?.completedAt || 0);
        const mergedProfile = mergeUserProfiles(persistentProfile, remoteProfile, remoteTs > localTs);
        if (mergedProfile && Object.keys(mergedProfile).length > 0) {
          setPersistentUserProfile(mergedProfile);
          saveProfileToAllVaults(mergedProfile);
          setSharedState((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              userProfile: mergedProfile,
              profileUpdatedAt: Date.now(),
            };
            saveToLocal(firebaseUser.uid, updated);
            return updated;
          });
          window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: mergedProfile }));
          window.dispatchEvent(new CustomEvent('prism:realtime_sync', { detail: { userProfile: mergedProfile } }));
        }
      }
    }, (err) => {
      console.warn('[UserProfiles] Realtime listener notice:', (err as any).code || err.message);
    });

    return () => {
      unsub();
      unsubProfile();
    };
  }, [firebaseUser]);

  // Real-time Paired Vault Listener across devices (PC <-> Mobile via PIN/Pairing)
  useEffect(() => {
    const pairedVaultId = activePairedVaultId || getPairedVaultId();
    if (!pairedVaultId) return;

    const unsub = subscribeToPairedVault((incomingState) => {
      if (!incomingState) return;
      const currentSig = syncDataSignature(sharedStateRef.current);
      const incomingSig = syncDataSignature(incomingState);
      if (currentSig && incomingSig && currentSig === incomingSig) return;

      const localCached = sharedStateRef.current;
      const persistentProfile = getPersistentUserProfile();
      const mergedProfile = mergeUserProfiles(
        mergeUserProfiles(persistentProfile, localCached?.userProfile),
        incomingState?.userProfile,
        Number((incomingState.userProfile as any)?.updatedAt || incomingState.userProfile?.completedAt || incomingState.profileUpdatedAt || 0) >= Number((localCached?.userProfile as any)?.updatedAt || localCached?.userProfile?.completedAt || localCached?.profileUpdatedAt || 0)
      );
      const mergedData: SharedState = mergeSharedState(
        localCached || {},
        incomingState,
        getSharedStateUpdatedAt(localCached),
        getSharedStateUpdatedAt(incomingState)
      );
      if (mergedProfile && Object.keys(mergedProfile).length > 0) {
        mergedData.userProfile = mergedProfile;
      }
      setSharedState(mergedData);
      if (firebaseUser?.uid) {
        saveToLocal(firebaseUser.uid, mergedData);
      } else {
        saveGuestState(mergedData);
      }
      if (mergedProfile && Object.keys(mergedProfile).length > 0) {
        setPersistentUserProfile(mergedProfile);
        saveProfileToAllVaults(mergedProfile);
      }
      unpackAndHydrateLocalStorage(firebaseUser?.uid, mergedData, true);
      window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: mergedData.userProfile }));
      window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: mergedData }));
      window.dispatchEvent(new CustomEvent('prism:realtime_sync', { detail: mergedData }));
      if (mergedData.todayOracles) {
        window.dispatchEvent(new CustomEvent('prism:daily_oracle_updated', { detail: mergedData.todayOracles }));
      }
    });

    return unsub;
  }, [firebaseUser?.uid, activePairedVaultId]);

  // 🍀 마스터 볼트 실시간 연동: 박주형 님의 구글 로그인(PC)도 원클릭 연동(모바일)과
  // 같은 마스터 볼트(master_modele6777)를 자동 구독해, 모든 데이터가 양방향 실시간 동기화됩니다.
  useEffect(() => {
    if (!firebaseUser || !isMasterVaultAccount(firebaseUser, false)) return;
    if (getPairedVaultId() !== MASTER_VAULT_ID) {
      setPairedVaultId(MASTER_VAULT_ID);
      setActivePairedVaultId(MASTER_VAULT_ID);
    }
  }, [firebaseUser]);

  const handleSignIn = useCallback(async () => {
    safeLocalStorage.removeItem('developer_bypass');
    try {
      // 1. 구글 팝업 로그인 시도 (PC 및 팝업 허용 환경)
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        setFirebaseUser(result.user);
        unlockMemoryFlag = true;
        setIsUnlocked(true);
        markPinUnlockedToday();
        showLucyToast(`✨ ${result.user.displayName || 'Google'} 계정으로 로그인되었습니다 🍀`);
        return;
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }

      console.warn('[Auth] Google popup sign-in failed or blocked:', err?.code || err);

      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          console.warn('[Auth] Google redirect sign-in failed:', redirectError);
        }
      }
      showLucyToast('Google 로그인에 실패했습니다. 두 기기에서 같은 계정으로 다시 로그인해 주세요.');
    }
  }, []);

  const signInAsPairedSession = useCallback((vaultId?: string) => {
    safeLocalStorage.removeItem('developer_bypass');
    const targetVaultId = vaultId || getPairedVaultId() || `pin_sync_${Date.now()}`;
    setPairedVaultId(targetVaultId);
    const pairedUser = {
      uid: targetVaultId,
      email: null,
      displayName: '연동 기기',
      photoURL: null,
      emailVerified: true,
      isAnonymous: true,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'paired-token',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      providerId: 'paired.prism',
      phoneNumber: null,
    } as any;
    setFirebaseUser(pairedUser);
    unlockMemoryFlag = true;
    setIsUnlocked(true);
    writeDailyUnlock();
    safeLocalStorage.setItem(AUTH_UID_SESSION_KEY, targetVaultId);
    safeSessionStorage.setItem(AUTH_UID_SESSION_KEY, targetVaultId);

    void pullFromPairedVault().then((vaultState) => {
      if (vaultState) {
        setSharedState((prev) => {
          const merged = mergeSharedState(prev || {}, vaultState);
          saveToLocal(targetVaultId, merged);
          unpackAndHydrateLocalStorage(targetVaultId, merged);
          return merged;
        });
      }
    });
  }, []);

  const handleLogout = useCallback(async () => {
    safeLocalStorage.removeItem('developer_bypass');
    setPairedVaultId('');
    unlockMemoryFlag = false;
    clearPinUnlockedToday();
    try {
      safeSessionStorage.removeItem(AUTH_UID_SESSION_KEY);
      safeLocalStorage.removeItem(AUTH_UID_SESSION_KEY);
      safeSessionStorage.removeItem('prism_auth_uid');
      safeLocalStorage.removeItem('prism_auth_uid');
    } catch {
      // ignore
    }
    setIsUnlocked(false);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[Auth] SignOut failed:', e);
    }
    setFirebaseUser(null);
    const guestState = loadGuestState();
    setSharedState(guestState);
  }, []);

  const updateSharedState = useCallback(async (
    updates: Partial<SharedState>,
    sourceApp: string
  ) => {
    const finalMerged = (() => {
      const prev = sharedStateRef.current;
      const persistentProfile = getPersistentUserProfile();
      const existingProfile = mergeUserProfiles(
        prev?.userProfile,
        persistentProfile,
        true
      );
      const updatedProfile = updates.userProfile 
        ? mergeUserProfiles(existingProfile, updates.userProfile, true)
        : existingProfile;

      if (updates.userProfile?.basic) {
        if (!updatedProfile.basic) updatedProfile.basic = {};
        if (typeof updates.userProfile.basic.nickname === 'string') {
          updatedProfile.basic.nickname = updates.userProfile.basic.nickname;
        }
        if (typeof updates.userProfile.basic.birthtime === 'string') {
          updatedProfile.basic.birthtime = updates.userProfile.basic.birthtime;
        }
      }

      const nowTs = Date.now();
      if (updates.userProfile && updatedProfile) {
        updatedProfile.completedAt = nowTs;
        (updatedProfile as any).updatedAt = nowTs;
      }

      const finalMerged = mergeSharedState(
        prev || {},
        {
          ...updates,
          ...(updatedProfile && Object.keys(updatedProfile).length > 0 ? { userProfile: updatedProfile } : {}),
          ...(updates.userProfile ? { profileUpdatedAt: nowTs } : {}),
          sourceApp,
          clientUpdatedAt: nowTs,
        }
      );

      if (updatedProfile?.basic && finalMerged.userProfile?.basic) {
        if (typeof updatedProfile.basic.nickname === 'string') {
          finalMerged.userProfile.basic.nickname = updatedProfile.basic.nickname;
        }
        if (typeof updatedProfile.basic.birthtime === 'string') {
          finalMerged.userProfile.basic.birthtime = updatedProfile.basic.birthtime;
        }
      }

      if (updatedProfile && Object.keys(updatedProfile).length > 0) {
        setPersistentUserProfile(updatedProfile);
        saveProfileToAllVaults(updatedProfile);
      }

      if (!firebaseUser) {
        saveGuestState(finalMerged);
      } else {
        saveToLocal(firebaseUser.uid, finalMerged);
      }
      return finalMerged;
    })();
    sharedStateRef.current = finalMerged;
    setSharedState(finalMerged);
    unpackAndHydrateLocalStorage(firebaseUser?.uid, finalMerged);
    void pushToPairedVault(finalMerged).catch(() => {});

    if (!firebaseUser) return;

    setIsSyncing(true);
    try {
      const ref = doc(db, 'sharedState', firebaseUser.uid);
      const toPersist: any = cleanFirestoreData({
        ...finalMerged,
        sourceApp, 
        updatedAt: serverTimestamp(),
        lastAppSyncAt: Date.now(),
      });
      if (finalMerged?.userProfile) {
        const cleanProf = cleanFirestoreData(finalMerged.userProfile);
        toPersist.userProfile = cleanProf;
        // Direct dual-persist to userProfiles collection
        const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
        setDoc(profileRef, { ...cleanProf, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      }
      const syncTimeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 3500));
      await Promise.race([
        setDoc(ref, toPersist, { merge: true }),
        syncTimeoutPromise,
      ]);
      void pushToServerVault(firebaseUser.uid, finalMerged);
    } catch (err: any) {
      console.warn('[SharedState] Firestore sync notice, retained in local cache & server vault:', err?.message || err);
      void pushToServerVault(firebaseUser.uid, finalMerged);
    } finally {
      setIsSyncing(false);
    }
  }, [firebaseUser]);

  const syncPrismDevices = useCallback(async (): Promise<PrismSyncResult> => {
    if (isSyncInProgressRef.current) {
      return {
        success: true,
        needsReload: false,
        message: 'Sync already in progress',
        localVersion: sharedStateRef.current?.unifiedAppVersion || '',
        targetVersion: sharedStateRef.current?.unifiedAppVersion || '',
        mergedState: sharedStateRef.current,
      };
    }
    const currentState = sharedStateRef.current;
    // 원클릭 연동(마스터 볼트) 상태에서도 클라우드 3원 동기화(Firestore·서버 볼트·페어링 볼트)를 그대로 수행합니다.

    isSyncInProgressRef.current = true;
    setIsSyncing(true);
    try {
      // 1. Tri-pull from Firestore, Server Vault, and Paired PIN-code Vault
      const [result, serverVaultState, pairedVaultState] = await Promise.all([
        syncPrismAcrossDevices(firebaseUser?.uid, currentState),
        firebaseUser?.uid ? pullFromServerVault(firebaseUser.uid).catch(() => null) : Promise.resolve(null),
        pullFromPairedVault().catch(() => null),
      ]);

      let finalMerged = result.mergedState;
      if (serverVaultState) {
        finalMerged = mergeSharedState(
          serverVaultState || {},
          finalMerged || {}
        );
      }
      if (pairedVaultState) {
        finalMerged = mergeSharedState(
          pairedVaultState || {},
          finalMerged || {}
        );
      }

      if (finalMerged) {
        const currentSig = getSharedStateSignature(currentState);
        const mergedSig = getSharedStateSignature(finalMerged);
        if (currentSig !== mergedSig) {
          setSharedState(finalMerged);
          if (firebaseUser?.uid) {
            saveToLocal(firebaseUser.uid, finalMerged);
            pushToServerVault(firebaseUser.uid, finalMerged);
          } else {
            saveGuestState(finalMerged);
          }
          // Also persist updated state back to paired vault if active
          if (getPairedVaultId()) {
            void pushToPairedVault(finalMerged).catch(() => {});
          }
          if (finalMerged.userProfile && Object.keys(finalMerged.userProfile).length > 0) {
            setPersistentUserProfile(finalMerged.userProfile);
            saveProfileToAllVaults(finalMerged.userProfile);
          }
          unpackAndHydrateLocalStorage(firebaseUser?.uid, finalMerged);
          window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: finalMerged.userProfile }));
          window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: finalMerged }));
        }
      }

      // Also trigger chat messages synchronization across devices safely with timeout
      const activeChatId = getActiveChatDocId(firebaseUser);
      if (activeChatId) {
        try {
          const chatDocPromise = getDoc(doc(db, 'chatThreads', activeChatId));
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
          const chatDocSnap = await Promise.race([chatDocPromise, timeoutPromise]).catch(() => null);
          if (chatDocSnap && chatDocSnap.exists()) {
            const data = chatDocSnap.data();
            const raw = data?.unified || data?.messages;
            if (raw) {
              let remoteList: UnifiedMessage[] = [];
              if (Array.isArray(raw)) {
                remoteList = raw.filter((m: UnifiedMessage) => !isLegacyAIErrorMessage(m));
              } else if (typeof raw === 'object') {
                Object.values(raw).forEach((msgs) => {
                  if (Array.isArray(msgs)) {
                    msgs.forEach((m: UnifiedMessage) => {
                      if (!isLegacyAIErrorMessage(m) && m.id !== 'greet') remoteList.push(m);
                    });
                  }
                });
                remoteList.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
              }
              if (remoteList.length > 0) {
                const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
                const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
                const remoteArchived = processDailyChatArchival(remoteList, nick);
                setUnifiedMessages((prev) => {
                  const merged = mergeUnifiedMessages(prev, remoteArchived.messages);
                  saveUnifiedMessagesSafely(merged);
                  return merged;
                });
              }
            }
          }
        } catch (_) {}
      }

      return result;
    } finally {
      setIsSyncing(false);
      isSyncInProgressRef.current = false;
    }
  }, [firebaseUser]);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid || auth.currentUser?.uid !== uid) return;
    const readPending = () => {
        const activities = collectAllLocalActivities(uid);
        if (activities.chatHistory) activities.chatHistory = activities.chatHistory.filter(message =>
          message.role !== 'model' && message.role !== 'assistant' || (typeof message.content === 'string' ? Boolean(message.content.trim()) : Boolean(message.content?.length)));
        const current=sharedStateRef.current || {};
        const patch=localActivityPatch(current,activities);
        return {...current,...patch,...(Object.keys(patch).length?{clientUpdatedAt:Date.now()}:{} )};
    };
    const controller = createContinuousDataSync<SharedState>({
      changeToken: () => localSyncChangeToken(safeLocalStorage, uid),
      visible: () => syncBaselineRef.current.uid === uid && syncBaselineRef.current.ready && document.visibilityState === 'visible' && navigator.onLine !== false,
      signature: syncDataSignature,
      read: readPending,
      push: async state => {
        if (auth.currentUser?.uid !== uid) throw Error('Sync account changed');
        const next = { ...state, clientUpdatedAt: Date.now(), sourceApp: 'continuous-sync' };
        sharedStateRef.current = next;
        setSharedState(next);
        saveToLocal(uid, next);
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            writeFirestoreDocument(doc(db, 'sharedState', uid), cleanFirestoreData({ ...next, updatedAt: serverTimestamp() }), { merge: true }),
            new Promise<never>((_, reject) => { timer = setTimeout(() => reject(Error('Sync write timeout')), 6000); }),
          ]);
        } finally { if (timer) clearTimeout(timer); }
      },
    });
    const scan = () => { void controller.scan(); };
    const stagePending = () => {
      if(auth.currentUser?.uid!==uid)return;
      const pending=readPending();
      if(syncDataSignature(pending)!==syncDataSignature(sharedStateRef.current)){
        setSharedState(pending);saveToLocal(uid,pending);
      }
    };
    const wake = () => { if (document.visibilityState === 'visible') void controller.wake(); else stagePending(); };
    const timer = window.setInterval(scan, 1000);
    scan();
    window.addEventListener('storage', scan);
    window.addEventListener('prism:state_changed', scan);
    window.addEventListener('online', wake);
    window.addEventListener('focus', wake);
    window.addEventListener('pageshow', wake);
    window.addEventListener('pagehide', stagePending);
    document.addEventListener('visibilitychange', wake);
    return () => {
      controller.dispose();window.clearInterval(timer);
      window.removeEventListener('storage', scan);window.removeEventListener('prism:state_changed', scan);
      window.removeEventListener('online', wake);window.removeEventListener('focus', wake);window.removeEventListener('pageshow', wake);window.removeEventListener('pagehide', stagePending);
      document.removeEventListener('visibilitychange', wake);
    };
  }, [firebaseUser?.uid]);

  const generateDevicePairingCode = useCallback(async () => {
    const currentState = sharedStateRef.current || loadGuestState() || {};
    return await generatePairingCode(currentState);
  }, []);

  const importDevicePairingCode = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    try {
      const imported = await importWithPairingCode(code);
      if (!imported) {
        return { success: false, message: '유효하지 않거나 만료된 동기화 코드입니다.' };
      }
      const localCached = firebaseUser ? loadFromLocal(firebaseUser.uid) : loadGuestState();
      const persistentProfile = getPersistentUserProfile();
      const mergedProfile = mergeUserProfiles(
        mergeUserProfiles(persistentProfile, localCached?.userProfile),
        imported.userProfile
      );
      const merged: SharedState = mergeSharedState(
        localCached || {},
        imported || {}
      );
      if (mergedProfile && Object.keys(mergedProfile).length > 0) {
        merged.userProfile = mergedProfile;
      }
      setSharedState(merged);
      if (firebaseUser?.uid) {
        saveToLocal(firebaseUser.uid, merged);
        pushToServerVault(firebaseUser.uid, merged);
      } else {
        saveGuestState(merged);
      }
      if (mergedProfile && Object.keys(mergedProfile).length > 0) {
        setPersistentUserProfile(mergedProfile);
        saveProfileToAllVaults(mergedProfile);
      }
      unpackAndHydrateLocalStorage(firebaseUser?.uid, merged);
      window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: mergedProfile }));
      window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: merged }));

      if (firebaseUser?.uid) {
        const ref = doc(db, 'sharedState', firebaseUser.uid);
        const cleanToPersist = cleanFirestoreData({ ...merged, updatedAt: serverTimestamp() });
        setDoc(ref, cleanToPersist, { merge: true }).catch(() => {});
      }
      // Ensure the paired vault on server is updated with the freshly merged state
      if (getPairedVaultId()) {
        void pushToPairedVault(merged).catch(() => {});
      }
      return { success: true, message: '모든 활동 기록이 동기화되었습니다! 핀코드 기기 간 실시간 자동 저장이 활성화되었습니다.' };
    } catch (err: any) {
      return { success: false, message: err?.message || '동기화 중 오류가 발생했습니다.' };
    } finally {
      setIsSyncing(false);
    }
  }, [firebaseUser]);



  const clearPersonaMessages = useCallback((persona?: PersonaType) => {
    const target = persona || 'lucy';
    abortGenerating(target);
    const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname?.trim();
    const nick = (rawNick && rawNick !== '여행자' && rawNick !== '사용자' && rawNick !== '박주형') ? rawNick : '제제';
    const initialGreet = archiveAndResetChat(unifiedMessages, nick, target);

    if (pushChatThreadsTimerRef.current) {
      clearTimeout(pushChatThreadsTimerRef.current);
    }

    setUnifiedMessages(initialGreet);
    setChatSuggestions({
      lucy: [],
      orange: [],
      trinity: [],
      aura: [],
      bluebird: [],
      muse: [],
    });

    const currentUid = getActiveChatDocId(firebaseUser);
    if (currentUid) {
      try {
        const chatDocRef = doc(db, 'chatThreads', currentUid);
        const cleanList = cleanFirestoreData(initialGreet);
        setDoc(chatDocRef, {
          messages: cleanList,
          unified: cleanList,
          updatedAt: serverTimestamp(),
        }, { merge: true }).catch((err) => {
          console.warn('[ChatThreads] Firestore reset notice:', err?.message || err);
        });
      } catch (e) {
        console.warn('[ChatThreads] Failed to reset in Firestore:', e);
      }
    }
  }, [firebaseUser?.uid, unifiedMessages, abortGenerating]);

  const backgroundAccount = firebaseUser?.uid || safeSessionStorage.getItem('prism_auth_uid') || 'device';
  const regularRuntimeRef = useRef({ account: backgroundAccount, messages: unifiedMessages, setMessages: setUnifiedMessages, load: loadSavedUnifiedMessages, save: saveUnifiedMessagesSafely, isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions, chatBroadcastRef, pushChatThreadsToFirestore, updateSharedState });
  regularRuntimeRef.current = { account: backgroundAccount, messages: unifiedMessages, setMessages: setUnifiedMessages, load: loadSavedUnifiedMessages, save: saveUnifiedMessagesSafely, isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions, chatBroadcastRef, pushChatThreadsToFirestore, updateSharedState };
  const proRuntimeRef = useRef(proChat.runtime);
  proRuntimeRef.current = proChat.runtime;

  const revealLucyTarotCard = useCallback((messageId: string, cardId: string, conversationId: 'lucy' | 'lucy-pro' = 'lucy') => {
    const isPro = conversationId === 'lucy-pro';
    const runtime = isPro ? proRuntimeRef.current : regularRuntimeRef.current;
    runtime.setMessages(previous => {
      let changed = false;
      const next = previous.map(message => {
        if (message.id !== messageId || message.tarotDraw?.source !== 'app-random') return message;
        const tarotDraw = revealLucyTarotDrawCard(message.tarotDraw, cardId);
        if (tarotDraw !== message.tarotDraw) changed = true;
        return tarotDraw === message.tarotDraw ? message : { ...message, tarotDraw };
      });
      if (!changed) return previous;
      try {
        runtime.save(next);
      } catch (_) {}

      if (!isPro) {
        try {
          regularRuntimeRef.current.chatBroadcastRef.current?.postMessage({
            type: 'CHAT_SYNC',
            messages: next,
            account: regularRuntimeRef.current.account,
          });
        } catch (_) {}
        try {
          regularRuntimeRef.current.pushChatThreadsToFirestore(next);
        } catch (_) {}
      } else {
        try {
          proRuntimeRef.current.push(next);
        } catch (_) {}
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prism:tarot-card-revealed', { detail: { messageId, cardId, conversationId } }));
      }
      return next;
    });
  }, []);

  const sendUnifiedMessage = useCallback(async (
    text: string,
    _forcePersona?: PersonaType,
    attachedImage?: string,
    options?: SendUnifiedMessageOptions,
  ) => {
    // Cover drawer and other callers as well as the standalone chat.
    if (!options?.tarotCardMarkers && isLucyTarotDrawRequest(text)) {
      const cards = drawLucyTarotCards(/3장|세\s*장|쓰리카드|과거\s*현재\s*미래/i.test(text) ? 3 : 1);
      options = { ...options, tarotCardMarkers: cards.map(formatTarotMarker).join(' '),
        extraSystemContext: `${options?.extraSystemContext || ''}\n${buildLucyTarotReadingPrompt(cards, text)}` };
    }
    const tarotDraw: LucyTarotDraw | undefined = options?.tarotCardMarkers ? { source: 'app-random', id: crypto.randomUUID(), drawnAt: Date.now(), markers: options.tarotCardMarkers } : undefined;
    const sourcePersona: PersonaType = 'lucy';
    const isProConversation = options?.conversationId === 'lucy-pro' || (!options?.conversationId && typeof window !== 'undefined' && window.location.pathname === '/chat/pro');
    const runtime = isProConversation ? proRuntimeRef.current : regularRuntimeRef.current;
    const memoryAccount = runtime.account;
    const rememberConversation = (messages: readonly UnifiedMessage[], scope: 'lucy' | 'lucy-pro') => {
      if (regularRuntimeRef.current.account !== memoryAccount || proRuntimeRef.current.account !== memoryAccount) return;
      const before = mergeLucyMemory(readLucyMemory(memoryAccount), (sharedStateRef.current?.lucyLongTermMemory || []).filter(entry => entry.account === memoryAccount));
      const after = mergeLucyMemory(before, memoryFromMessages(memoryAccount, scope, messages));
      if (lucyMemorySignature(before) === lucyMemorySignature(after)) return;
      writeLucyMemory(memoryAccount, after);
      // Intentionally share only memory, even for Pro; its visible chat history stays isolated.
      void regularRuntimeRef.current.updateSharedState({ lucyLongTermMemory: after }, 'lucy-memory').catch(() => {});
    };
    const requestDay = getTodayDateKey();
    const requestProAccount = isProConversation ? proRuntimeRef.current.account : undefined;
    const canWriteConversation = () => getTodayDateKey() === requestDay && (!isProConversation || proRuntimeRef.current.account === requestProAccount);
    const { messages: unifiedMessages, load: loadSavedUnifiedMessages, isGeneratingRef, abortControllersRef, activeAssistMsgIdRef, setIsGenerating, setChatSuggestions } = runtime;
    const setUnifiedMessages: React.Dispatch<React.SetStateAction<UnifiedMessage[]>> = action => {
      if (canWriteConversation()) runtime.setMessages(prev => {
        const next = typeof action === 'function' ? action(prev) : action;
        if (!options?.tarotCardMarkers) return next;
        return next.map(message => {
          if (message.id !== assistMsgId || typeof message.content !== 'string') return message;
          // Keep the actual draw visible before the first AI token and throughout streaming.
          const reading = message.content.replace(/\[TAROT:[a-zA-Z0-9_]+(?::(?:upright|reversed|정방향|역방향))?\]\s*/gi, '').trimStart();
          return { ...message, tarotDraw: { ...tarotDraw!, revealedCardIds: message.tarotDraw?.revealedCardIds || [] }, content: `${options.tarotCardMarkers}\n\n${reading}` };
        });
      });
    };
    const saveUnifiedMessagesSafely = (list: UnifiedMessage[]) => { if (canWriteConversation()) runtime.save(list); };
    const chatBroadcastRef = isProConversation ? { current: null } : regularRuntimeRef.current.chatBroadcastRef;
    const pushChatThreadsToFirestore = isProConversation ? proRuntimeRef.current.push : regularRuntimeRef.current.pushChatThreadsToFirestore;
    const updateSharedState = isProConversation ? async (_state: Partial<SharedState>, _source: string) => {} : regularRuntimeRef.current.updateSharedState;
    const isLucyPlus = Boolean(
      (options as any)?.isLucyPlus ||
      options?.mode === 'master' ||
      safeLocalStorage.getItem('lucy_plus_active') === 'true' ||
      safeSessionStorage.getItem('lucy_plus_active') === 'true'
    );

    if (isLucyPlus) {
      // 👑 Lucy + 마스터 모드 절대 고정: 수다 모드로 이탈하지 않고 15대 운명학 도구 전원 총동원 유지
      options = {
        ...options,
        isLucyPlus: true,
        mode: 'master',
        channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'],
      };
    }

    const content = attachedImage
      ? [
          { type: 'text', text },
          { type: 'image_url', image_url: { url: attachedImage } }
        ]
      : text;

    // 1. Lock generating state FIRST so background Firestore/storage/BroadcastChannel listeners never overwrite the in-flight message
    const prevController = abortControllersRef.current[sourcePersona];
    const supersededAssistMsgId = activeAssistMsgIdRef.current[sourcePersona];
    if (prevController) {
      supersededControllersRef.current.add(prevController);
      try { prevController.abort(); } catch (_) {}
    }
    const currentAbortController = new AbortController();
    abortControllersRef.current[sourcePersona] = currentAbortController;

    // Create assistant message placeholder ID upfront and register as active
    const assistMsgId = 'reply-' + Math.random().toString(36).substring(2, 9);
    activeAssistMsgIdRef.current[sourcePersona] = assistMsgId;

    isGeneratingRef.current[sourcePersona] = true;
    setIsGenerating(prev => ({ ...prev, [sourcePersona]: true }));

    // 2. Add user message
    const userMsg: UnifiedMessage = { 
      id: 'msg-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8), 
      role: 'user', 
      content, 
      timestamp: Date.now(),
      persona: sourcePersona,
      channel: options?.channel,
      channels: options?.channels,
      mode: options?.mode
    };
    
    // 즉시 로컬 스토리지에 질문 영구 보존 및 브로드캐스트 & 클라우드 비동기 푸시
    // 이전 진행 중이던 미완성 응답(supersededAssistMsgId)이나 빈 플레이스홀더는 제거하여 연속 입력 시 깔끔한 단일 응답만 남도록 보장
    const currentMemory = Array.isArray(unifiedMessages) ? unifiedMessages : [];
    const currentStored = loadSavedUnifiedMessages();
    const combinedPrior = mergeUnifiedMessages(currentMemory, currentStored);
    const cleanPrior = combinedPrior.filter(m => {
      if (supersededAssistMsgId && m.id === supersededAssistMsgId) return false;
      return m.role !== 'model' || (typeof m.content === 'string' ? m.content.trim() !== '' : !!m.content);
    });
    const nextCommitted = mergeUnifiedMessages(cleanPrior, [userMsg]);
    saveUnifiedMessagesSafely(nextCommitted);
    rememberConversation(nextCommitted, isProConversation ? 'lucy-pro' : 'lucy');

    // Append both user message and assistant placeholder directly to unified timeline immediately
    setUnifiedMessages([
      ...nextCommitted,
      { 
        id: assistMsgId, 
        role: 'model' as const, 
        content: "", 
        timestamp: Date.now(), 
        persona: sourcePersona,
        channel: options?.channel,
        channels: options?.channels,
        mode: options?.mode,
        usedTools: []
      }
    ]);

    if (chatBroadcastRef.current) {
      chatBroadcastRef.current.postMessage({ messages: nextCommitted, timestamp: Date.now() });
    }
    pushChatThreadsToFirestore(nextCommitted, true);
    void updateSharedState({
      chatHistory: nextCommitted.slice(-150)
    }, 'lucy');

    // Mobile buffered requests need enough time to complete without intermediate chunks.
    let lastActivityTime = Date.now();
    const generationStartTime = Date.now();
    const isMobileChat = isMobileDevice();
    const activityIdleTimeoutMs = (options?.isLucyPlus || options?.mode === 'master') ? 300000 : isMobileChat ? 180000 : 60000;
    let watchdogTimer: NodeJS.Timeout | null = null;
    let isWatchdogTimeout = false;
    let isReviewingReply = false;

    const resetWatchdog = () => {
      lastActivityTime = Date.now();
      if (watchdogTimer) clearTimeout(watchdogTimer);
      const phaseIdleTimeout = isReviewingReply ? Math.max(activityIdleTimeoutMs, 120000) : activityIdleTimeoutMs;
      watchdogTimer = setTimeout(() => {
        const now = Date.now();
        const isIdleTooLong = now - lastActivityTime >= phaseIdleTimeout;
        const isMaxDurationReached = now - generationStartTime >= ((options?.isLucyPlus || options?.mode === 'master') ? 300000 : isMobileChat ? 180000 : 120000) + (isReviewingReply ? 120000 : 0);

        if (isGeneratingRef.current[sourcePersona] && (isIdleTooLong || isMaxDurationReached)) {
          console.warn(`[AppContext] Activity watchdog auto-released (${isIdleTooLong ? 'idle' : 'max cap'}) for ${sourcePersona}`);
          isWatchdogTimeout = true;
          try { currentAbortController.abort(); } catch (_) {}
        } else if (isGeneratingRef.current[sourcePersona]) {
          resetWatchdog();
        }
      }, phaseIdleTimeout);
    };

    resetWatchdog();
    
    // 3. Prepare AI Prompt (🌟 상담 대상자가 지정된 경우 해당 인물 프로필로 사주·점성학 전면 전환)
    const profile = options?.customUserProfile || sharedState?.userProfile || getPersistentUserProfile();
    const rawNickname = profile?.basic?.nickname?.trim();
    const rawRealName = profile?.basic?.name?.trim();
    const nickname = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자' && rawNickname !== '박주형') ? rawNickname : '제제';
    const realName = rawRealName || '박주형';
    const mbti = profile?.psych?.mbti || "정보 없음";
    
    const sajuObj = calculateDetailedSaju(profile);
    const saju = sajuObj ? sajuObj.systemPromptSummary : (profile?.basic?.birthdate 
      ? `생년월일: ${profile.basic.birthdate} (${profile.basic.lunarSolar || 'solar'}), 생시: ${profile.basic?.birthtime || '모름'}` 
      : "기본 생년월일 정보 없음");
    const memory = profile?.fate?.currentWorry || "특별한 고민 없음";
    const currentVibe = sharedState?.currentVibe || "통상적인 기운";
    const preferences = profile?.psych?.aiPreference || "정보 없음";
    const globalMemory = isProConversation ? "" : sharedState?.globalMemory || "";
    const deepCoreInfo = `사용자 MBTI: ${mbti}, 선호 스타일: ${profile?.psych?.counselingStyle || "기본"}${sajuObj ? `, 사주 본원: ${sajuObj.shortDigest}` : ''}`;
    
    // 모드별 답변 길이 및 사고 깊이 프로필 (수다모드: 짧게 1~3문장 / 7대채널: 보통 4~7문장 / 마스터: 길게 10문장+)
    const responseLength = resolveLucyResponseLength({
      persona: sourcePersona,
      mode: options?.mode,
      channels: options?.channels,
    });
    const responseProfile = options?.tarotCardMarkers
      ? LUCY_TAROT_RESPONSE_PROFILE
      : LUCY_RESPONSE_PROFILES[responseLength];

    // 직전 루시 답변 이후 사용자가 연속으로 입력한 모든 메시지 추출 (연속 대화 통합 이해)
    let lastCompletedModelIdx = -1;
    for (let i = nextCommitted.length - 1; i >= 0; i--) {
      if (nextCommitted[i].role === 'model') {
        lastCompletedModelIdx = i;
        break;
      }
    }
    const consecutiveUserMessages = nextCommitted
      .slice(lastCompletedModelIdx + 1)
      .filter((m) => m.role === 'user');
    const extractPlainUserText = (raw: any): string => {
      if (typeof raw === 'string') return raw.trim();
      if (Array.isArray(raw)) {
        return raw
          .map((p: any) => (p?.type === 'text' ? p.text : ''))
          .filter(Boolean)
          .join('\n')
          .trim();
      }
      return '';
    };
    const consecutiveUserTexts = consecutiveUserMessages
      .map((m) => extractPlainUserText(m.content))
      .filter(Boolean);
    const effectiveUserText =
      consecutiveUserTexts.length > 1 ? consecutiveUserTexts.join('\n') : text;

    const hasDivinationInjection =
      options?.extraSystemContext?.includes('[이번 질문의 계산 근거 및 한계]') ||
      options?.extraSystemContext?.includes('루시 15대 운명학 마스터') ||
      options?.extraSystemContext?.includes('루시 올인원 마스터 모드 — 15대 운명학 도구 전원 총동원') ||
      options?.extraSystemContext?.includes('선별된 도구별 맞춤 풀이 가이드');
    const activeThemeList = (options?.channels || (options?.channel ? [options.channel] : [])) as SevenThemeChannel[];
    const isMasterCall = isLucyPlus || options?.mode === 'master' || activeThemeList.length === 7;
    const isCasualMode =
      !options?.tarotCardMarkers && !isMasterCall && (
        options?.mode === 'casual' ||
        (!options?.mode && responseLength === 'short' && activeThemeList.length === 0)
      );
    const toolSelection: SelectedDivinationToolsResult = isCasualMode
      ? { isCasualMessage: true, selectedTools: [], promptInjection: '', selectionReason: '가벼운 일상 인사', firedEngineBadges: [] }
      : !hasDivinationInjection
      ? selectOptimalDivinationTools(effectiveUserText, isMasterCall ? (['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] as SevenThemeChannel[]) : activeThemeList, profile, isMasterCall, { allowMaster: isMasterCall || isProConversation })
      : { isCasualMessage: false, selectedTools: [], promptInjection: '', selectionReason: '', firedEngineBadges: [] };
    const toolsIncludedInPrompt = isCasualMode
      ? []
      : toolSelection.promptInjection
      ? (toolSelection.firedEngineBadges || [])
      : hasDivinationInjection
      ? options?.usedTools || []
      : [];
    const isFastCasualPath =
      !isMasterCall &&
      sourcePersona === 'lucy' &&
      responseLength === 'short' &&
      toolSelection.isCasualMessage &&
      !options?.extraSystemContext;

    let systemPrompt = "";
    if (isFastCasualPath) {
      // ⚡ 초고속 일상 수다 패스: 25KB 운명학/옴니 컨텍스트를 생략하고 핵심 프로필만 주입하여 0.7초 내 즉시 응답 보장
      systemPrompt = `당신은 사용자('${nickname}')의 가장 가깝고 다정한 단짝 친구 '루시(Lucy)'야.
- 사용자 기본 정보: 호칭 '${nickname}' (본명 '${realName}'은 절대 부르지 말고 오직 '${nickname}'으로만 불러줘), ${deepCoreInfo}, 최근 관심/고민: ${memory}
- 말투 원칙: 어떤 상황에서도 100% 친근하고 다정한 반말 구어체(~야, ~어, ~했어, ~지, ~네, ~잖아)만 사용해. 절대로 존댓말(~요, ~습니다)을 섞지 마.
- 대화 방식: 실제 사람이 카카오톡으로 단짝 친구와 대화하듯, 한 덩어리로 길게 쓰지 말고 **빈 줄(\`\\n\\n\`)로 구분된 2~3개의 짧은 말풍선 단락**(각 말풍선당 1~2문장)으로 쪼개어 가볍고 생동감 있게 공감하고 답해줘. 다정한 이모지(💬✨☕)를 자연스럽게 곁들여줘.

${LUCY_CHAT_VOICE_RULES}
${SUGGESTIONS_SYSTEM_SUFFIX}

${responseProfile.rule}`;
    } else {
      const astro = buildUserNatalSummary(profile);
      const relationships = formatRelationshipsContext(profile?.relationships);

      if (sourcePersona === 'lucy') {
        systemPrompt = PERSONAS.lucyFull(saju, astro, memory, relationships, currentVibe, nickname, realName, preferences, globalMemory, deepCoreInfo);
      } else if (sourcePersona === 'orange') {
        systemPrompt = `당신은 루시(Lucy)야. 지금은 오렌지 마음치유 채널에서 대화 중이야. 사용자의 질문과 마음에 깊이 귀 기울이고 따뜻하게 공감해 줘.\n\n` +
                       PERSONAS.orangeChat(memory, globalMemory, deepCoreInfo);
      } else if (sourcePersona === 'trinity') {
        const tarotContextMatch = options?.extraSystemContext?.match(/뽑은 (?:데일리 )?타로 카드:\s*([^\n\r]+)/);
        const tarotCardName = tarotContextMatch ? tarotContextMatch[1].trim() : "트리니티 타로 원형";
        systemPrompt = PERSONAS.tarotCounselor(
          tarotCardName,
          text,
          nickname || realName || '질문자님',
          saju,
          astro,
          options?.extraSystemContext
        );
      } else if (sourcePersona === 'aura') {
        systemPrompt = `당신은 루시(Lucy)야. 지금은 아우라 웰니스 채널에서 대화 중이야. 몸 컨디션과 실천 가능한 습관을 알려줘.\n\n` +
                       PERSONAS.healChat('신체 웰니스', globalMemory, deepCoreInfo);
      } else if (sourcePersona === 'bluebird') {
        systemPrompt = `당신은 루시(Lucy)야. 지금은 블루버드 휴식 채널에서 대화 중이야. 마음을 가볍게 위로해 줘.\n\n` +
                       PERSONAS.bluebirdChat('마음 쉬어가기', globalMemory, deepCoreInfo);
      } else if (sourcePersona === 'muse') {
        systemPrompt = `당신은 루시(Lucy)야. 지금은 뮤즈 창작 채널에서 대화 중이야. 영감과 작업 루틴을 같이 찾아보자.\n\n` +
                       PERSONAS.museChat('창의성 상담', memory, 'Muse', globalMemory, deepCoreInfo);
      } else {
        systemPrompt = PERSONAS.lucyFull(saju, astro, memory, relationships, currentVibe, nickname, realName, preferences, globalMemory, deepCoreInfo);
      }

      systemPrompt += `\n\n${LUCY_CHAT_VOICE_RULES}`;

      if (sourcePersona === 'lucy' && !isMasterCall && (options?.mode === 'casual' || !options?.channels?.length)) {
        systemPrompt += `\n\n[★ 루시 기본 일상 수다 모드 핵심 지침]:
1. [친근하고 다정한 수다 친구]: 당신은 사용자의 가장 가깝고 편안한 단짝 수다 친구 '루시'입니다. 딱딱한 멘토나 AI 상담사처럼 훈계/설교하지 말고, 카톡이나 DM을 나누듯 친근한 반말(또는 사용자의 어조에 맞춘 다정한 어투)로 즐겁게 수다를 떨어주세요.
2. [카톡식 다중 말풍선 티키타카]: 일장연설이나 한 덩어리의 긴 문단 대신, 실제 카톡하듯이 **빈 줄(\`\\n\\n\`)로 구분된 2~3개의 짧은 말풍선 단락**(각 말풍선당 1~2문장)으로 쪼개어 가볍고 자연스럽게 답하세요.
3. [리액션과 공감]: 사소한 일상(오늘 먹은 음식, 기분, 날씨, 넋두리 등)에 신나게 맞장구치고, 다정한 이모지(💬✨☕)를 곁들여 대화를 이어가세요.
4. [전문 모드 자동 전환 안내]: 사용자가 사주, 심층 전략, 신체 치유 등 전문적인 질문을 할 때만 자연스럽게 해당 전문 지능으로 깊이 있게 답하되, 그때도 2~4개의 카톡 말풍선 단락(\`\\n\\n\`)으로 나누어 전달하세요.`;
      }

      if (sourcePersona === 'lucy' && isMasterCall) {
        systemPrompt += `\n\n[루시 플러스 마스터 모드 응답 절대 원칙]:
1. [마스터 모드 100% 절대 고정]: 당신은 동서양 ${ALL_DCE_ENGINES.length}대 운명학과 7대 테마가 모두 활성화된 '루시 플러스(Lucy +) 마스터'야. 절대로 "가벼운 일상 수다를 떨까?", "수다 떨 준비가 되어 있어" 같은 수다 모드(casual) 대사나 질문을 하지 마.
2. [전천후 마스터 통찰]: 사용자가 짧은 인사("안녕", "하이")나 사소한 일상 이야기를 건네더라도 가벼운 수다 모드로 이탈하지 말고, ${ALL_DCE_ENGINES.length}대 운명학 마스터의 깊이 있고 다정한 품격으로 반갑게 맞이하며 오늘의 운기 흐름, 사주·점성학·타로 등 ${ALL_DCE_ENGINES.length}가지 도구 관점에서의 통찰을 준비된 상태로 친근하고 명쾌하게 제시해줘.`;
      }

      // Append cross-app real-time remembrance
      if (!isProConversation) systemPrompt += getCrossAppRecentDialogueContext();

      // Safari PWA / reduced 성능 기기 / 일상 수다모드(short)에서는 무거운 지식 엔진을 생략하여 지연 및 멈춤 방지
      const _isPerfReduced = isPerfReduced() || isStandalonePWA();

      // Append full PRISM omniscient ecosystem feature results
      if (!isProConversation) systemPrompt += buildPrismOmniscientContext(sharedState, firebaseUser?.uid || null);

      const needsDeepWisdomCanon =
        !_isPerfReduced &&
        responseLength !== 'short' &&
        (options?.mode === 'master' ||
          options?.mode === 'trinity' ||
          /방하착|초기불교|니까야|영지주의|노시스|그노시스|기적수업|ACIM|acim|세도나|호킨스|놓아버림|거리두기|무아|사성제|용서|거룩한\s*순간|속죄|원한|죄책감|두려움|화살|붓다|불교|신성한\s*불꽃|플레로마|소피아|데미우르고스|마음공부|영적|깨달음|명상/i.test(text));

      if (needsDeepWisdomCanon) {
        const [
          { buildEarlyBuddhismSystemPrompt },
          { buildGnosticSystemPrompt },
          { buildAcimSystemPrompt },
          { buildDistancingSystemPrompt },
          { buildSedonaSystemPrompt },
          { buildLettingGoSystemPrompt },
        ] = await Promise.all([
          import('../lib/earlyBuddhismWisdom'),
          import('../lib/gnosticWisdom'),
          import('../lib/acimWisdom'),
          import('../lib/distancingWisdom'),
          import('../lib/sedonaWisdom'),
          import('../lib/lettingGoWisdom'),
        ]);

        systemPrompt += `\n\n${buildEarlyBuddhismSystemPrompt()}`;
        systemPrompt += `\n\n${buildGnosticSystemPrompt()}`;
        systemPrompt += `\n\n${buildAcimSystemPrompt()}`;
        systemPrompt += `\n\n${buildDistancingSystemPrompt()}`;
        systemPrompt += `\n\n${buildSedonaSystemPrompt()}`;
        systemPrompt += `\n\n${buildLettingGoSystemPrompt()}`;
      }

      // 🔮 15대 운명학 도구 자동 선별 주입
      if (!hasDivinationInjection && !toolSelection.isCasualMessage && toolSelection.promptInjection) {
        systemPrompt += `\n\n${toolSelection.promptInjection}`;
      }

      if (options?.extraSystemContext) {
        systemPrompt += `\n\n${options.extraSystemContext}`;
      }
      const hasSuggestionsDirective =
        (options?.systemSuffix?.includes('[SUGGESTIONS:') ?? false) ||
        systemPrompt.includes('[SUGGESTIONS:');
      if (options?.systemSuffix) {
        systemPrompt += options.systemSuffix;
      } else if (!hasSuggestionsDirective) {
        systemPrompt += SUGGESTIONS_SYSTEM_SUFFIX;
      }

      // 강력한 대화 포커스 및 질문 맞춤형 적정 답변 길이 원칙
      systemPrompt += `\n\n[루시의 최우선 커뮤니케이션 & 질문 맞춤형 분량 원칙]
0. [호칭 절대 원칙 (★매우 중요)]: 사용자의 호칭은 반드시 사용자가 설정한 닉네임('${nickname}')으로만 다정하게 불러야 해. 사용자의 본명('${realName}')은 사주나 명리학 분석용일 뿐이므로 절대로 본명을 직접 부르지 말고, 오직 닉네임 '${nickname}'(으)로만 다정하게 불러줘.
1. [현재 입력 최우선 경청]: 사용자가 방금 보낸 최신 메시지의 의도와 핵심을 가장 먼저 파악하여 직접적이고 명쾌하며 다정하게 대답해줘.
2. [자연스러운 대화 기억과 연속성]: 사용자와 지금까지 나누었던 대화 기록을 자연스럽게 기억하고 존중하되, 묻지 않은 배경 지식을 무의미하게 길게 나열하지 마.
3. [유연한 흐름 전환]: 새로운 질문이나 주제가 들어왔을 때는 과거 이야기에 얽매이지 않고 새로운 흐름에 매끄럽게 반응해줘.
4. [말투 (반말 100% 절대 고정)]: 루시(Lucy)는 어떤 상황, 어떤 질문, 어떤 채널에서든 예외 없이 100% 항상 친근하고 다정한 친구 같은 '반말'만 사용해야 해. 절대로 존댓말(~요, ~습니다, ~해요, ~해 드려요, ~할게요, ~인가요 등)을 섞거나 혼용하지 마. 처음부터 끝까지 완전한 반말 구어체(~야, ~어, ~했어, ~지, ~네, ~잖아, ~자, ~해 등)로만 일관되게 대답해.
5. [🎨 이미지 요청]: 외부 이미지 생성 URL이나 존재하지 않는 이미지 주소를 만들지 마. 이미지 요청에는 상세한 이미지 설명을 돕고 앱의 이미지 생성 기능을 안내해. 실제 이미지 생성 API 결과를 받지 않았다면 생성이 완료됐다고 말하지 마.
6. [🔑 Key 개운(開運) 성전 40가지 개운 리추얼 추천 및 상호 연동]:
   - 사용자가 막힌 운기, 불안, 걱정, 답답함, 액운을 호소하거나 Key 개운 성전 관련 질문을 할 때만 40가지 개운 리추얼 중 가장 잘 맞는 '단 하나의 맞춤 개운 실천법'을 운명학적 개운(開運) 관점으로 자연스럽게 추천해줘.`;

      // 🎯 [최우선 적용] 모드별 답변 길이 규칙 (수다 짧게 / 7대채널 보통 / 마스터 길게)
      systemPrompt += `\n\n${responseProfile.rule}`;
    }
    if (sourcePersona === 'lucy' && !isMasterCall && isCasualMode) {
      systemPrompt += `\n\n[수다모드 도구 비활성화]\n이번 대화는 가벼운 수다 모드야. 운세·타로·사주 등 운명학 도구를 고르거나 분석에 적용하지 말고, 관련 도구 사용 여부나 결과 배지도 만들지 마. 사용자의 질문에 일상 대화처럼 직접 답해줘.`;
    }

    systemPrompt += `\n\n${TAROT_NO_DRAW_RULE}`;

    // Read the opposite runtime without merging, saving or broadcasting its messages.
    const oppositeRuntime = isProConversation ? regularRuntimeRef.current : proRuntimeRef.current;
    const oppositeMessages = mergeUnifiedMessages(oppositeRuntime.messages, oppositeRuntime.load());
    if (oppositeRuntime.account === memoryAccount) rememberConversation(oppositeMessages, isProConversation ? 'lucy' : 'lucy-pro');
    const sharedLucyBackground = buildLucySharedBackground({
      target: isProConversation ? 'lucy-pro' : 'lucy',
      sourceAccount: oppositeRuntime.account,
      currentAccount: runtime.account,
      messages: oppositeMessages,
      question: text,
    });
    if (sharedLucyBackground) systemPrompt += `\n\n${sharedLucyBackground}`;
    const memoryRecall = recallLucyLongTermMemory(memoryAccount, [...readLucyMemory(memoryAccount), ...(sharedStateRef.current?.lucyLongTermMemory || [])], effectiveUserText, [`${isProConversation ? 'lucy-pro' : 'lucy'}:${userMsg.id}`]);
    const longTermContext = formatLucyConversationMemory(memoryRecall);
    if (longTermContext) systemPrompt += `\n\n${longTermContext}`;
    const fullProfileContext = buildFullProfilePrompt(profile);
    systemPrompt += `\n\n${fullProfileContext}`;
    const fatePreviewContext = !isCasualMode ? buildFatePreviewPrompt(sajuObj) : '';
    if (fatePreviewContext) systemPrompt += `\n\n${fatePreviewContext}`;
    systemPrompt += `\n\n${CALCULATION_HONESTY_RULE}`;
    if (isMasterCall) systemPrompt += '\n마스터 답변은 결론·계산 근거와 상징적 참고·서로 다른 해석과 한계·실천할 행동을 질문에 맞게 종합해. 입력이 부족하면 필요한 정보를 짧게 물어보고 확정적 결론을 피한다.';
    let chatDivinationContext: string | undefined;
    // Calculate once per submitted turn in the shared send path used by Lucy and Pro.
    // Stream retries below reuse systemPrompt, so a retry cannot draw a different hexagram.
    if (!isCasualMode && toolsIncludedInPrompt.length > 0) {
      try {
        const { buildChatDivinationContext, CHAT_DIVINATION_MARKER } = await import('../lib/divination/chatContext');
        const evidencedIds = new Set((options?.calculationAudit || toolSelection.calculationAudit || [])
          .filter(item => item.sentToModel).map(item => item.toolId));
        const selected = Object.values(FIFTEEN_DIVINATION_TOOLS)
          .filter(tool => evidencedIds.has(tool.id)).map(tool => tool.id);
        const { buildSavedDivinationPrompt } = await import('../lib/divination/savedResults');
        const saved = buildSavedDivinationPrompt(sharedState?.featureHistory, profile, selected, text);
        if (saved.prompt && !saved.reuse) systemPrompt += `\n\n${saved.prompt}`;
        const actual = saved.reuse ? {prompt:CHAT_DIVINATION_MARKER+'\n'+saved.prompt,results:[]} : buildChatDivinationContext({ text, selected, previous: [...nextCommitted].reverse().find(m => m.role === 'model' || m.role === 'assistant')?.divinationContext });
        if (actual.prompt) {
          chatDivinationContext = actual.prompt;
          systemPrompt += `\n\n${actual.prompt}`;
        }
      } catch (_) {
        systemPrompt += '\n[채팅 점술 계산 실패] 이번 메시지의 새 포국·작괘를 계산했다고 말하지 말고 계산실 이용을 안내해.';
      }
    }

    const _isPerfReduced = isPerfReduced() || isStandalonePWA();
    
    // Format conversation properly for the API (only user/assistant roles after system)
    const sanitizeHistoryItem = (rawContent: any, isLatest: boolean) => {
      if (Array.isArray(rawContent)) {
        if (isLatest) return rawContent;
        const textPart = rawContent.find((p: any) => p.type === 'text')?.text || '';
        return textPart ? `[이전 첨부 파일 대화] ${textPart.slice(0, 500)}` : '[이전 첨부 파일 대화]';
      }
      if (typeof rawContent === 'string') {
        if (rawContent.startsWith('%PDF-') || (rawContent.length > 2000 && rawContent.includes('/Filter') && rawContent.includes('/FlateDecode'))) {
          return '[이전 첨부된 PDF 문서 대화]';
        }
        if (rawContent.length > 5000 && !isLatest) {
          return rawContent.slice(0, 5000) + '... (이전 대화 일부 요약)';
        }
        return rawContent;
      }
      return String(rawContent || '');
    };

    // 사용자와의 대화 맥락과 기억을 충분히 보존하면서 최신 대화에 가장 민첩하게 실시간 반응할 수 있도록 전달 (최근 10개 메시지)
    // Safari PWA / 저성능 기기: 대화 기록을 줄여 메모리 과부하 방지
    const historyLimit = _isPerfReduced ? 6 : 10;
    const priorHistoryBeforeConsecutive = nextCommitted
      .slice(0, lastCompletedModelIdx + 1)
      .filter((message) => !isLegacyAIErrorMessage(message));

    // 사용자가 연속으로 여러 문장을 입력한 경우, AI에게는 하나의 이어진 발화로 병합하여 전달함으로써 전체 맥락을 한 번에 완벽히 이해하고 단일 답변을 생성하도록 구성
    const coalescedLatestUserMsg: UnifiedMessage =
      consecutiveUserMessages.length > 1
        ? {
            ...userMsg,
            content: attachedImage
              ? [
                  { type: 'text', text: effectiveUserText },
                  { type: 'image_url', image_url: { url: attachedImage } },
                ]
              : effectiveUserText,
          }
        : userMsg;

    if (consecutiveUserMessages.length > 1) {
      systemPrompt += `\n\n[연속 대화 통합 이해 지침]: 사용자가 방금 ${consecutiveUserMessages.length}개의 메시지를 연속해서 입력했습니다:\n${consecutiveUserTexts.map((t, i) => `${i + 1}. "${t}"`).join('\n')}\n각각의 말을 따로 떼어 답변하지 말고, 위 연속된 말들의 전체 흐름과 의도를 하나로 이어서 이해한 뒤 한 번의 통합된 답변으로 자연스럽게 대답해줘.`;
    }

    const historySlice = [...priorHistoryBeforeConsecutive, coalescedLatestUserMsg].slice(-historyLimit);
    const taskContext = resetLucyContextOnTaskSwitch(historySlice, effectiveUserText);
    if (taskContext.didReset) {
      systemPrompt += `\n\n[새로운 작업 맥락 시작]\n사용자의 최신 요청이 이전 작업 유형과 달라졌습니다. 이전 작업의 역할·절차·출력 형식은 종료된 상태이므로 이어서 적용하지 말고, 이번 요청만 독립적으로 처리하세요.`;
    }
    const conversationForAPI: Message[] = [
      { role: 'system', content: systemPrompt },
      ...taskContext.messages.map((m, idx) => {
        const isLatestMessage = idx === taskContext.messages.length - 1;
        const finalContent = sanitizeHistoryItem(m.content, isLatestMessage);
        return {
          role: m.role === 'model' ? 'assistant' : m.role,
          content: finalContent
        };
      })
    ];
    

    const isSuperseded = () => !canWriteConversation() ||
      supersededControllersRef.current.has(currentAbortController) ||
      activeAssistMsgIdRef.current[sourcePersona] !== assistMsgId;

    const reviewAudit = options?.calculationAudit || toolSelection.calculationAudit || [];
    const criticalFacts = buildLucyCriticalFacts(
      reviewAudit.some(item => item.toolId === 'saju' && item.sentToModel && item.status === 'calculated') ? sajuObj : null,
      tarotDraw,
    );
    const criticalFactsPrompt = formatLucyCriticalFacts(criticalFacts);
    conversationForAPI[0].content += '\n' + criticalFactsPrompt;
    const verifyReply = async (text: string): Promise<string> => {
      const draft = cleanChatDisplayText(text);
      isReviewingReply = true;
      resetWatchdog();
      try {
        const reviewed = await reviewLucyReply(draft, {
          question: effectiveUserText,
          evidence: [options?.extraSystemContext || toolSelection.promptInjection || '', fullProfileContext, chatDivinationContext || '', longTermContext].join('\n'),
          conversation: taskContext.messages.slice(-8).map(message => ({ role:message.role === 'user' ? 'user' as const : 'assistant' as const, content:extractPlainUserText(message.content).slice(0,2000) })),
          facts: criticalFacts, memoryRecall,
          audit: reviewAudit, signal: currentAbortController.signal,
          request: messages => invokeLLM({ messages, preferServer: true, reviewMode: isMasterCall ? 'master' : 'general',
            model: isMasterCall ? LUCY_MASTER_MODEL : LUCY_REVIEW_MODEL,
            fallbackModels: isMasterCall ? LUCY_MASTER_FALLBACK_MODELS : LUCY_REVIEW_FALLBACK_MODELS,
            maxOutputTokens: isMasterCall ? 8192 : 4096, timeoutMs: 120000, signal: currentAbortController.signal }),
        });
        return verifyLucyTarotReply(cleanChatDisplayText(reviewed), tarotDraw, effectiveUserText);
      } finally { isReviewingReply = false; }
    };

    try {
      await invokeLLMStream({
        messages: conversationForAPI,
        signal: currentAbortController.signal,
        timeoutMs: isMasterCall ? 300000 : isMobileChat ? 180000 : 120000,
        model: isMasterCall ? LUCY_MASTER_MODEL : LUCY_CHAT_MODEL,
        fallbackModels: isMasterCall ? LUCY_MASTER_FALLBACK_MODELS : undefined,
        maxOutputTokens: isMasterCall ? 8192 : responseProfile.maxOutputTokens,
        thinkingLevel: isMasterCall ? 'HIGH' : responseProfile.thinkingLevel,
        preferBuffered: false,
        onChunk: () => {
          resetWatchdog();
          // Do not display, persist, or prefetch speech for an unverified partial reply.
        },
        onFinish: async (fullText: string) => {
          if (isSuperseded()) {
            if (watchdogTimer) {
              clearTimeout(watchdogTimer);
              watchdogTimer = null;
            }
            setUnifiedMessages(prev => prev.filter(m => m.id !== assistMsgId));
            return;
          }

          const cleanFullText = await verifyReply(fullText);
          if (isSuperseded()) return;
          if (!cleanFullText || cleanFullText.trim().length === 0) {
            throw new Error("Empty cleaned reply in onFinish");
          }

          if (watchdogTimer) {
            clearTimeout(watchdogTimer);
            watchdogTimer = null;
          }
          if (abortControllersRef.current[sourcePersona] === currentAbortController) {
            activeAssistMsgIdRef.current[sourcePersona] = null;
            isGeneratingRef.current[sourcePersona] = false;
            setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
          }

          const parsedSuggestions = parseSuggestions(cleanFullText);
          if (parsedSuggestions.length > 0) {
            setChatSuggestions(prev => ({
              ...prev,
              [sourcePersona]: parsedSuggestions,
            }));
          }

          rememberConversation([userMsg, { id: assistMsgId, role: 'model', content: cleanFullText, timestamp: Date.now() }], isProConversation ? 'lucy-pro' : 'lucy');
          const verifiedEx = validateAndExtractKeyExercise(cleanFullText, effectiveUserText, options?.keyExerciseIndex);
          const resolvedKeyExIndex = verifiedEx.isValid ? verifiedEx.exercise.globalIndex : options?.keyExerciseIndex;

          setUnifiedMessages(prev => {
            let found = false;
            const updated = prev.map(m => {
              if (m.id === assistMsgId) {
                found = true;
                return { 
                  ...m, 
                  content: cleanFullText, 
                  persona: sourcePersona,
                  channel: options?.channel || m.channel,
                  channels: options?.channels || m.channels,
                  mode: options?.mode || m.mode,
                  usedTools: toolsIncludedInPrompt,
                  calculationAudit: options?.calculationAudit || toolSelection.calculationAudit || [],
                  divinationContext: chatDivinationContext,
                  keyExerciseIndex: resolvedKeyExIndex ?? m.keyExerciseIndex
                };
              }
              return m;
            });
            if (!found) {
              updated.push({ 
                id: assistMsgId, 
                role: 'model' as const, 
                content: cleanFullText, 
                timestamp: Date.now(), 
                persona: sourcePersona,
                channel: options?.channel,
                channels: options?.channels,
                mode: options?.mode,
                usedTools: toolsIncludedInPrompt,
                  calculationAudit: options?.calculationAudit || toolSelection.calculationAudit || [],
                  divinationContext: chatDivinationContext,
                keyExerciseIndex: resolvedKeyExIndex
              });
            }
            saveUnifiedMessagesSafely(updated);
            if (chatBroadcastRef.current) {
              chatBroadcastRef.current.postMessage({ messages: updated, timestamp: Date.now() });
            }
            void updateSharedState({
              chatHistory: updated.slice(-150)
            }, 'lucy');
            pushChatThreadsToFirestore(updated, true);
            return updated;
          });

          // Save firestore history in background without awaiting to eliminate latency for onFinish / TTS
          const fUser = auth.currentUser;
          if (!isProConversation && fUser) {
            const targets = [
              { collectionName: 'lucy_history', logType: 'chat_sync', logTitle: '루시 마스터 대화' },
              { collectionName: 'orange_history', logType: 'chat_sync', logTitle: '오렌지 다이어리 교감' },
              { collectionName: 'bluebird_history', logType: 'chat_sync', logTitle: '블루버드 라디오 교감' },
              { collectionName: 'heal_history', logType: 'chat_sync', logTitle: '아우라 주파수 조율' },
              { collectionName: 'muse_history', logType: 'chat_sync', logTitle: '뮤즈 영감 싱크' },
              { collectionName: 'trinity_history', logType: 'chat_sync', logTitle: '트리니티 오라클 자문' }
            ];

            void Promise.all(
              targets.map(target =>
                addDoc(collection(db, target.collectionName, fUser.uid, 'entries'), {
                  type: target.logType,
                  title: target.logTitle,
                  content: effectiveUserText,
                  response: cleanFullText,
                  metadata: { question: effectiveUserText },
                  createdAt: serverTimestamp()
                })
              )
            ).catch((dbErr) => {
              console.warn("Failed saving unified chat log entry to all app histories:", dbErr);
            });
          }

          if (options?.onFinish) {
            try {
              await options.onFinish(cleanFullText, effectiveUserText, assistMsgId);
            } catch (callbackErr) {
              console.warn("sendUnifiedMessage onFinish callback failed:", callbackErr);
            }
          }
        }
      });
    } catch (err: any) {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }

      // If this request was superseded by a newer consecutive user message, silently remove its placeholder and let the new request handle generation
      if (isSuperseded()) {
        setUnifiedMessages(prev => prev.filter(m => m.id !== assistMsgId));
        return;
      }

      // Only treat as intentional user abort if NOT triggered by watchdog timeout
      if (currentAbortController.signal.aborted && !isWatchdogTimeout) {
        if (abortControllersRef.current[sourcePersona] === currentAbortController) {
          activeAssistMsgIdRef.current[sourcePersona] = null;
          isGeneratingRef.current[sourcePersona] = false;
          setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
        }
        // Never preserve an unverified partial reply after cancellation.
        setUnifiedMessages(prev => prev.filter(m => m.id !== assistMsgId));
        return;
      }

      // Fast automatic recovery retry with compact context before showing any error
      try {
        resetWatchdog();
        const compactSystemPrompt = `당신은 사용자('${nickname}')의 다정한 단짝 친구 '루시(Lucy)'야. 100% 친근한 반말 구어체(~야, ~어, ~지, ~네)로 사용자의 말에 따뜻하고 명쾌하게 답해줘.\n${TAROT_NO_DRAW_RULE}\n${CALCULATION_HONESTY_RULE}\n${responseProfile.rule}${'\n' + (options?.extraSystemContext || toolSelection.promptInjection || '')}\n${criticalFactsPrompt}\n${sharedLucyBackground}\n${longTermContext}\n${fullProfileContext}${fatePreviewContext ? '\n'+fatePreviewContext : ''}${chatDivinationContext ? '\n'+chatDivinationContext : ''}${isCasualMode ? '\n수다모드에서는 운세·타로·사주 등 운명학 도구를 선택하거나 답변에 적용하지 말고, 질문에 일상 대화처럼 직접 답해줘.' : ''}`;
        const compactMessages: Message[] = [
          { role: 'system', content: compactSystemPrompt },
          ...conversationForAPI.slice(-4),
        ];
        const recoveredRaw = await invokeLLM({
          messages: compactMessages,
          timeoutMs: isMasterCall ? 180000 : 30000,
          model: isMasterCall ? LUCY_MASTER_MODEL : LUCY_CHAT_MODEL,
          fallbackModels: isMasterCall ? LUCY_MASTER_FALLBACK_MODELS : undefined,
          signal: currentAbortController.signal,
        });
        const recoveredClean = await verifyReply(String(recoveredRaw || '').trim());
        if (isSuperseded()) return;
        if (recoveredClean && recoveredClean.length > 0) {
          rememberConversation([userMsg, { id: assistMsgId, role: 'model', content: recoveredClean, timestamp: Date.now() }], isProConversation ? 'lucy-pro' : 'lucy');
          isGeneratingRef.current[sourcePersona] = false;
          setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
          setUnifiedMessages(prev => {
            let found = false;
            const updated = prev.map(m => {
              if (m.id === assistMsgId) {
                found = true;
                return {
                  ...m,
                  content: recoveredClean,
                  persona: sourcePersona,
                  channel: options?.channel || m.channel,
                  channels: options?.channels || m.channels,
                  mode: options?.mode || m.mode,
                  usedTools: [],
                  calculationAudit: [],
                  divinationContext: chatDivinationContext,
                };
              }
              return m;
            });
            if (!found) {
              updated.push({
                id: assistMsgId,
                role: 'model' as const,
                content: recoveredClean,
                timestamp: Date.now(),
                persona: sourcePersona,
                channel: options?.channel,
                channels: options?.channels,
                mode: options?.mode,
                usedTools: [],
                  calculationAudit: [],
                divinationContext: chatDivinationContext,
              });
            }
            saveUnifiedMessagesSafely(updated);
            if (chatBroadcastRef.current) {
              chatBroadcastRef.current.postMessage({ messages: updated, timestamp: Date.now() });
            }
            void updateSharedState({
              chatHistory: updated.slice(-150)
            }, 'lucy');
            pushChatThreadsToFirestore(updated, true);
            return updated;
          });
          if (options?.onFinish) {
            try {
              await options.onFinish(recoveredClean, effectiveUserText, assistMsgId);
            } catch (_) {}
          }
          return;
        }
      } catch (retryErr) {
        console.warn("Fast recovery retry in sendUnifiedMessage also failed:", retryErr);
      }

      if (isSuperseded()) {
        setUnifiedMessages(prev => prev.filter(m => m.id !== assistMsgId));
        return;
      }

      console.error("Error in sendUnifiedMessage:", err);
      if (abortControllersRef.current[sourcePersona] === currentAbortController) {
        activeAssistMsgIdRef.current[sourcePersona] = null;
        isGeneratingRef.current[sourcePersona] = false;
        setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
      }

      const errStr = (err?.message || "") + JSON.stringify(err);
      let errorMsg = "(※ 일시적인 네트워크 지연이 발생했습니다. 다시 메시지를 보내주시면 정성껏 답변해 드릴게요.)";

      if (errStr.includes('prepayment credits') || errStr.includes('depleted') || errStr.includes('RESOURCE_EXHAUSTED')) {
        errorMsg = "⚠️ [Google AI Studio 크레딧 소진 안내]\n현재 API 키 프로젝트의 선불 크레딧(Prepayment Credits)이 소진되어 Google에서 API 호출을 일시 차단(429 RESOURCE_EXHAUSTED)했습니다.\n\n💡 해결 방법:\n1. Google AI Studio (https://aistudio.google.com/app/apikey)에서 결제 설정이 없는 '무료 티어(Free of charge)' 새 API 키를 발급받아 교체하시거나,\n2. https://ai.studio/projects 에서 선불 크레딧을 충전해 주시면 즉시 정상 대화가 재개됩니다.";
      } else if (errStr.includes('ACCOUNT_STATE_INVALID') || errStr.includes('deleted or disabled') || errStr.includes('UNAUTHENTICATED') || errStr.includes('401') || errStr.includes('Invalid API Key') || errStr.includes('GEMINI_API_KEY')) {
        errorMsg = "⚠️ [Google Gemini API 키 갱신 안내]\n현재 등록된 API 키가 만료되었거나 비활성화된 서비스 계정에 연결되어 있습니다 (401 UNAUTHENTICATED).\n\n💡 해결 방법:\n1. Google AI Studio (https://aistudio.google.com/app/apikey)에서 'Create API key'를 눌러 새 무료 API 키를 발급받으세요.\n2. AI Studio 화면 우측 상단의 **Settings > Secrets** 메뉴에서 `GEMINI_API_KEY` 값을 새로 등록해 주시면 즉시 실시간 대화가 재개됩니다.";
      }

      setUnifiedMessages(prev => {
        let found = false;
        const updated = prev.map(m => {
          if (m.id === assistMsgId) {
            found = true;
            const hasText = typeof m.content === 'string' && m.content.trim().length > 5;
            if (hasText) {
              return m;
            }
            return { 
              ...m, 
              content: errorMsg,
              persona: sourcePersona
            };
          }
          return m;
        });
        if (!found) {
          updated.push({
            id: assistMsgId,
            role: 'model' as const,
            content: errorMsg,
            timestamp: Date.now(),
            persona: sourcePersona
          });
        }
        saveUnifiedMessagesSafely(updated);
        if (chatBroadcastRef.current) {
          chatBroadcastRef.current.postMessage({ messages: updated, timestamp: Date.now() });
        }
        void updateSharedState({
          chatHistory: updated.slice(-150)
        }, 'lucy');
        pushChatThreadsToFirestore(updated, true);
        return updated;
      });
    } finally {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      if (abortControllersRef.current[sourcePersona] === currentAbortController && !isSuperseded()) {
        abortControllersRef.current[sourcePersona] = null;
        activeAssistMsgIdRef.current[sourcePersona] = null;
        isGeneratingRef.current[sourcePersona] = false;
        setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
      }
    }
  }, [activePersona, buildPrismOmniscientContext, calculateDetailedSaju, firebaseUser, isGeneratingRef, pushChatThreadsToFirestore, sharedState, unifiedMessages]);

  return (
    <AppContext.Provider value={{
      firebaseUser, isAuthReady, isUnlocked, unlock,
      signInWithGoogle: handleSignIn, signInAsDeveloper, signInAsPairedSession, logout: handleLogout,
      sharedState, updateSharedState, syncPrismDevices, isSyncing,
      isChatOpen, setIsChatOpen,
      activePersona, setActivePersona,
      lucyProMessages: proChat.messages, isLucyProGenerating: proChat.generating, abortLucyProGenerating: proChat.abort, clearLucyProMessages: proChat.reset,
      personaMessages, setPersonaMessages,
      isGenerating, abortGenerating, sendUnifiedMessage, revealLucyTarotCard, chatSuggestions, openLucyChat,
      openHandbook, clearPersonaMessages,
      generateDevicePairingCode, importDevicePairingCode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const useAppContext = useApp;
