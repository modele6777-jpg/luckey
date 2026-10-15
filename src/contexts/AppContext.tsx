import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, getDoc, getDocFromServer, setDoc, onSnapshot, serverTimestamp, type User, addDoc, collection } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { mergeUserProfiles, type SharedState, type UserProfile } from '../lib/sharedState';
import { loadProfileFromAllVaults, saveProfileToAllVaults } from '../lib/profileVault';
import { syncPrismAcrossDevices, type PrismSyncResult } from '../lib/prismSync';
import { unpackAndHydrateLocalStorage, cleanFirestoreData, mergeSharedState, getSharedStateSignature, collectAllLocalActivities, getSharedStateUpdatedAt } from '../lib/sharedStateSync';
import { pushToServerVault, pullFromServerVault, generatePairingCode, importWithPairingCode, pushToPairedVault, pullFromPairedVault, getPairedVaultId, setPairedVaultId, subscribeToPairedVault } from '../lib/serverSyncClient';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import { invokeLLMStream, PERSONAS, type Message, getCrossAppRecentDialogueContext } from '../lib/ai';
import { buildPrismOmniscientContext } from '../lib/prismOmniSync';
import { calculateDetailedSaju } from '../lib/sajuAnalysis';
import { buildUserNatalSummary, formatRelationshipsContext } from '../lib/astrologyAnalysis';
// Heavy wisdom engines are dynamically imported on first chat use to reduce initial bundle parse time
// import { buildEarlyBuddhismSystemPrompt } from '../lib/earlyBuddhismWisdom';
// import { buildGnosticSystemPrompt } from '../lib/gnosticWisdom';
// import { buildAcimSystemPrompt } from '../lib/acimWisdom';
// import { buildDistancingSystemPrompt } from '../lib/distancingWisdom';
// import { buildSedonaSystemPrompt } from '../lib/sedonaWisdom';
// import { buildLettingGoSystemPrompt } from '../lib/lettingGoWisdom';
import { loadSavedUnifiedMessages, saveUnifiedMessagesSafely, mergeUnifiedMessages, hasRealUserConversation, createDefaultGreeting } from '../lib/chatHistorySync';
import { processDailyChatArchival, buildPermanentMemoryPromptContext, archiveAndResetChat } from '../lib/chatMemoryArchive';
import {
  SUGGESTIONS_SYSTEM_SUFFIX,
  parseSuggestions,
  cleanChatDisplayText,
} from '../utils/suggestions';
import { hasUnlockedPinToday, markPinUnlockedToday, getTodayDateKey } from '../lib/dailyCache';
import { PERSONA_GREETINGS, PRISM_VOICE_RULES, LUCY_CHAT_VOICE_RULES } from '../lib/copyTone';
import { isPerfReduced, isStandalonePWA } from '../lib/perfMode';
import { validateAndExtractKeyExercise } from '../lib/keyExercisesCatalog';

export type PersonaType = 'lucy' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse';

export interface UnifiedMessage {
  id?: string;
  role: 'system' | 'user' | 'model' | 'assistant';
  content: string | any[];
  timestamp?: number;
  persona?: PersonaType;
  channel?: string;
  channels?: string[];
  mode?: string;
  keyExerciseIndex?: number;
}

export interface SendUnifiedMessageOptions {
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
  personaMessages: Record<PersonaType, UnifiedMessage[]>;
  setPersonaMessages: React.Dispatch<React.SetStateAction<Record<PersonaType, UnifiedMessage[]>>>;
  isGenerating: Record<PersonaType, boolean>;
  abortGenerating: (persona?: PersonaType) => void;
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
        parsed.userProfile = mergeUserProfiles(fallbackProfile, parsed.userProfile);
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
        parsed.userProfile = mergeUserProfiles(fallbackProfile, parsed.userProfile);
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
  const [sharedState, setSharedState] = useState<SharedState | null>(() => {
    const persistentProfile = getPersistentUserProfile();
    const guestState = loadGuestState();
    const initialProfile = mergeUserProfiles(persistentProfile, guestState?.userProfile);
    return {
      ...(guestState || {}),
      ...(initialProfile ? { userProfile: initialProfile } : {}),
    };
  });
  const sharedStateRef = useRef(sharedState);
  sharedStateRef.current = sharedState;
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
    const result = processDailyChatArchival(loaded, '제제');
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

  const [isGenerating, setIsGenerating] = useState<Record<PersonaType, boolean>>({
    lucy: false, orange: false, trinity: false, aura: false, bluebird: false, muse: false
  });
  const isGeneratingRef = useRef<Record<PersonaType, boolean>>({
    lucy: false, orange: false, trinity: false, aura: false, bluebird: false, muse: false
  });
  const abortControllersRef = useRef<Record<PersonaType, AbortController | null>>({
    lucy: null, orange: null, trinity: null, aura: null, bluebird: null, muse: null
  });

  const abortGenerating = useCallback((persona?: PersonaType) => {
    const targetPersonas: PersonaType[] = persona ? [persona] : (['lucy', 'orange', 'trinity', 'aura', 'bluebird', 'muse'] as PersonaType[]);
    targetPersonas.forEach(p => {
      if (abortControllersRef.current[p]) {
        try {
          abortControllersRef.current[p]?.abort();
        } catch (_) {}
        abortControllersRef.current[p] = null;
      }
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
          if (event.data && Array.isArray(event.data.messages) && event.data.messages.length > 0) {
            const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
            if (!isAnyGenerating) {
              setUnifiedMessages((prev) => mergeUnifiedMessages(prev, event.data.messages));
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

  // Helper to push chat history to Firestore in real-time for multi-device sync with debounce
  const pushChatThreadsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pushChatThreadsToFirestore = useCallback((messagesToPush: UnifiedMessage[] | Record<PersonaType, UnifiedMessage[]>) => {
    const currentUid = auth.currentUser?.uid || firebaseUser?.uid || activePairedVaultId || getPairedVaultId();
    if (!currentUid) return;

    if (pushChatThreadsTimerRef.current) {
      clearTimeout(pushChatThreadsTimerRef.current);
    }

    pushChatThreadsTimerRef.current = setTimeout(() => {
      try {
        const chatDocRef = doc(db, 'chatThreads', currentUid);
        const payload = Array.isArray(messagesToPush) ? messagesToPush : (messagesToPush.lucy || Object.values(messagesToPush)[0] || []);
        const cleanList = cleanFirestoreData(payload);
        setDoc(chatDocRef, {
          messages: cleanList,
          unified: cleanList,
          updatedAt: serverTimestamp(),
        }, { merge: true }).catch((err) => {
          console.warn('[ChatThreads] Firestore sync notice (cached locally):', err?.message || err);
        });
      } catch (e) {
        console.warn('[ChatThreads] Failed to push to Firestore:', e);
      }
    }, 600);
  }, [firebaseUser?.uid, activePairedVaultId]);

  // Persist unified messages whenever they change locally & broadcast to other tabs/PWA windows & sync to Firestore
  useEffect(() => {
    if (unifiedMessages && unifiedMessages.length > 0) {
      saveUnifiedMessagesSafely(unifiedMessages);

      // Broadcast to other open windows/PWA standalone instances
      if (chatBroadcastRef.current) {
        chatBroadcastRef.current.postMessage({ messages: unifiedMessages, timestamp: Date.now() });
      }

      // Automatically sync non-empty conversations to Firestore for real-time PC <-> Mobile continuity
      if (hasRealUserConversation(unifiedMessages)) {
        pushChatThreadsToFirestore(unifiedMessages);
      }
    }
  }, [unifiedMessages, pushChatThreadsToFirestore]);

  // Window Focus / Visibility Change Sync & Storage Event Listener (Smart Merge)
  useEffect(() => {
    const handleSyncFromStorage = (e?: StorageEvent) => {
      // Only process storage events that specifically affect chat timeline
      if (e && e.key && !e.key.includes('unified_messages')) {
        return;
      }
      const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
      if (isAnyGenerating) return;

      try {
        const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname || sharedStateRef.current?.userProfile?.basic?.name;
        const nick = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
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
        if (uid && safeLocalStorage.getItem('developer_bypass') !== 'true') {
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
        const vaultId = getPairedVaultId();
        if (vaultId) {
          try {
            const paired = await pullFromPairedVault();
            if (paired) {
              const localCached = firebaseUser ? loadFromLocal(firebaseUser.uid) : loadGuestState();
              const currentSig = getSharedStateSignature(localCached);
              const pairedSig = getSharedStateSignature(paired);
              if (currentSig !== pairedSig) {
                const merged = mergeSharedState(localCached || {}, paired);
                setSharedState(merged);
                if (firebaseUser?.uid) saveToLocal(firebaseUser.uid, merged);
                else saveGuestState(merged);
                unpackAndHydrateLocalStorage(firebaseUser?.uid, merged, true);
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
    const effectiveChatId = firebaseUser?.uid || activePairedVaultId || getPairedVaultId();
    if (!effectiveChatId) return;

    const chatDocRef = doc(db, 'chatThreads', effectiveChatId);
    const unsub = onSnapshot(chatDocRef, (snap) => {
      // Skip local write echoes to avoid re-entrant update cycles
      if (snap.metadata.hasPendingWrites) {
        return;
      }

      if (snap.exists()) {
        const data = snap.data();
        const raw = data?.unified || data?.messages;
        if (raw) {
          // If generating, don't clobber local streaming
          const isAnyGenerating = Object.values(isGeneratingRef.current).some(Boolean);
          if (isAnyGenerating) return;

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
            const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname || sharedStateRef.current?.userProfile?.basic?.name;
            const nick = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
            const archivalResult = processDailyChatArchival(remoteList, nick);
            if (archivalResult.wasArchived) {
              saveUnifiedMessagesSafely(archivalResult.messages);
              setUnifiedMessages(archivalResult.messages);
              pushChatThreadsToFirestore(archivalResult.messages);
              return;
            }

            setUnifiedMessages((prev) => {
              const merged = mergeUnifiedMessages(prev, remoteList);
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
  }, [firebaseUser?.uid, activePairedVaultId]);

  useEffect(() => {
    if (!firebaseUser) {
      unlockMemoryFlag = false;
      setIsUnlocked(false);
      return;
    }
    if (hasUnlockedPinToday()) {
      unlockMemoryFlag = true;
      setIsUnlocked(true);
    }
  }, [firebaseUser?.uid]);

  // Handle redirect result on page load
  useEffect(() => {
    let mounted = true;
    getRedirectResult(auth)
      .then((result) => {
        if (mounted && result?.user) {
          setFirebaseUser(result.user);
        }
      })
      .catch((err) => {
        console.error('[Auth] Redirect result error:', err);
      });
    return () => { mounted = false; };
  }, []);

  // Firebase auth listener
  useEffect(() => {
    // Check if developer bypass was active
    const isDev = safeLocalStorage.getItem('developer_bypass') === 'true';
    if (isDev) {
      const mockUser = {
        uid: 'developer-bypass-uid',
        email: 'developer@lucyuni.com',
        displayName: '개발자 모드',
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
      } as any;
      setFirebaseUser(mockUser);
      setIsAuthReady(true);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        safeLocalStorage.removeItem('developer_bypass');
        setFirebaseUser(user);
        setIsAuthReady(true);
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

          // Restore and merge chat history across devices immediately on authentication
          if (remoteChatSnap?.exists()) {
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
              if (remoteList.length > 0) {
                const localMsgs = loadSavedUnifiedMessages();
                const mergedChat = mergeUnifiedMessages(localMsgs, remoteList);
                saveUnifiedMessagesSafely(mergedChat);
                setUnifiedMessages(mergedChat);
              }
            }
          }
        } catch (syncErr) {
          console.warn('[Auth] Initial cloud sync on login notice:', syncErr);
        }
      } else {
        const pairedVaultId = getPairedVaultId();
        if (pairedVaultId && safeLocalStorage.getItem('developer_bypass') !== 'true') {
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
        } else if (safeLocalStorage.getItem('developer_bypass') !== 'true') {
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
  }, []);

  // sharedState realtime listener
  useEffect(() => {
    if (!firebaseUser) {
      const guest = loadGuestState();
      setSharedState(guest);
      return;
    }

    const cached = loadFromLocal(firebaseUser.uid) ?? loadGuestState();
    if (cached) setSharedState(cached);

    const ref = doc(db, 'sharedState', firebaseUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      // Ignore local write optimistic echoes to prevent loops and frame drops
      if (snap.metadata.hasPendingWrites) {
        return;
      }

      if (snap.exists()) {
        const remoteData = snap.data() as SharedState;
        const currentSig = getSharedStateSignature(sharedStateRef.current);
        const remoteSig = getSharedStateSignature(remoteData);
        // If content signature is identical to current state, bypass re-render and re-hydration
        if (currentSig && remoteSig && currentSig === remoteSig) {
          return;
        }

        const localCached = loadFromLocal(firebaseUser.uid);
        const persistentProfile = getPersistentUserProfile();
        const mergedProfile = mergeUserProfiles(
          mergeUserProfiles(persistentProfile, localCached?.userProfile),
          remoteData?.userProfile,
          true
        );
        const mergedData: SharedState = mergeSharedState(
          localCached || {},
          remoteData,
          0,
          Date.now()
        );
        if (mergedProfile && Object.keys(mergedProfile).length > 0) {
          mergedData.userProfile = mergedProfile;
        }
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
    }, (err) => {
      console.warn('[SharedState] Firestore read failed, using local cache:', (err as any).code || err.message);
    });

    // Direct real-time listener on userProfiles collection for instant profile sync
    const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.metadata.hasPendingWrites) return;
      if (snap.exists()) {
        const remoteProfile = snap.data() as UserProfile;
        if (!remoteProfile || Object.keys(remoteProfile).length === 0) return;
        const persistentProfile = getPersistentUserProfile();
        const mergedProfile = mergeUserProfiles(persistentProfile, remoteProfile, true);
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
      const currentSig = getSharedStateSignature(sharedStateRef.current);
      const incomingSig = getSharedStateSignature(incomingState);
      if (currentSig && incomingSig && currentSig === incomingSig) return;

      const localCached = firebaseUser ? loadFromLocal(firebaseUser.uid) : loadGuestState();
      const persistentProfile = getPersistentUserProfile();
      const mergedProfile = mergeUserProfiles(
        mergeUserProfiles(persistentProfile, localCached?.userProfile),
        incomingState?.userProfile,
        true
      );
      const mergedData: SharedState = mergeSharedState(
        localCached || {},
        incomingState,
        0,
        Date.now()
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

  const unlock = useCallback((code: string): boolean => {
    if (code === '1202') {
      unlockMemoryFlag = true;
      setIsUnlocked(true);
      writeDailyUnlock();
      return true;
    }
    return false;
  }, []);

  const handleSignIn = useCallback(async () => {
    safeLocalStorage.removeItem('developer_bypass');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('[Auth] Redirect sign-in error:', redirectErr);
          throw redirectErr;
        }
      }
      throw err;
    }
  }, []);

  const signInAsDeveloper = useCallback(() => {
    const mockUser = {
      uid: 'developer-bypass-uid',
      email: 'developer@lucyuni.com',
      displayName: '개발자 모드',
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
    } as any;
    
    safeLocalStorage.setItem('developer_bypass', 'true');
    setFirebaseUser(mockUser);
    unlockMemoryFlag = true;
    setIsUnlocked(true);
    writeDailyUnlock();
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
    try {
      safeSessionStorage.removeItem(AUTH_UID_SESSION_KEY);
      safeLocalStorage.removeItem(AUTH_UID_SESSION_KEY);
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
    let finalMerged: SharedState | null = null;
    
    setSharedState(prev => {
      const persistentProfile = getPersistentUserProfile();
      const existingProfile = mergeUserProfiles(
        persistentProfile,
        prev?.userProfile
      );
      const updatedProfile = updates.userProfile 
        ? mergeUserProfiles(existingProfile, updates.userProfile, true)
        : existingProfile;

      finalMerged = mergeSharedState(
        prev || {},
        {
          ...updates,
          ...(updatedProfile && Object.keys(updatedProfile).length > 0 ? { userProfile: updatedProfile } : {}),
          sourceApp,
          clientUpdatedAt: Date.now(),
        }
      );

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
    });

    if (finalMerged) {
      unpackAndHydrateLocalStorage(firebaseUser?.uid, finalMerged);
      // Continuous Real-Time Auto-Save to Paired Vault (for PIN-code synced devices)
      void pushToPairedVault(finalMerged).catch(() => {});
    }

    if (!firebaseUser || safeLocalStorage.getItem('developer_bypass') === 'true') return;

    setIsSyncing(true);
    try {
      const ref = doc(db, 'sharedState', firebaseUser.uid);
      const payload = finalMerged || updates;
      const toPersist: any = cleanFirestoreData({ 
        ...payload, 
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
      if (finalMerged) {
        pushToServerVault(firebaseUser.uid, finalMerged);
      }
    } catch (err: any) {
      console.warn('[SharedState] Firestore sync notice, retained in local cache & server vault:', err?.message || err);
      if (finalMerged) {
        pushToServerVault(firebaseUser.uid, finalMerged);
      }
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
    if (safeLocalStorage.getItem('developer_bypass') === 'true') {
      return syncPrismAcrossDevices(null, currentState);
    }

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
      if (firebaseUser?.uid) {
        try {
          const chatDocPromise = getDoc(doc(db, 'chatThreads', firebaseUser.uid));
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
                setUnifiedMessages((prev) => {
                  const merged = mergeUnifiedMessages(prev, remoteList);
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
    const rawNick = sharedStateRef.current?.userProfile?.basic?.nickname || sharedStateRef.current?.userProfile?.basic?.name;
    const nick = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
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

    const currentUid = auth.currentUser?.uid || firebaseUser?.uid;
    if (currentUid && safeLocalStorage.getItem('developer_bypass') !== 'true') {
      try {
        const chatDocRef = doc(db, 'chatThreads', currentUid);
        const cleanList = cleanFirestoreData(initialGreet);
        setDoc(chatDocRef, {
          messages: cleanList,
          unified: cleanList,
          updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.warn('[ChatThreads] Firestore reset notice:', err?.message || err);
        });
      } catch (e) {
        console.warn('[ChatThreads] Failed to reset in Firestore:', e);
      }
    }
  }, [firebaseUser?.uid, unifiedMessages]);

  const sendUnifiedMessage = useCallback(async (
    text: string,
    _forcePersona?: PersonaType,
    attachedImage?: string,
    options?: SendUnifiedMessageOptions,
  ) => {
    const sourcePersona: PersonaType = 'lucy';
    
    const content = attachedImage
      ? [
          { type: 'text', text },
          { type: 'image_url', image_url: { url: attachedImage } }
        ]
      : text;

    // 1. Add user message
    const userMsg: UnifiedMessage = { 
      id: 'msg-' + Math.random().toString(36).substring(2, 9), 
      role: 'user', 
      content, 
      timestamp: Date.now(),
      persona: sourcePersona,
      channel: options?.channel,
      channels: options?.channels,
      mode: options?.mode
    };
    
    // Create assistant message placeholder
    const assistMsgId = 'reply-' + Math.random().toString(36).substring(2, 9);
    let replyText = "";

    // Append both user message and assistant placeholder directly to unified timeline
    setUnifiedMessages(prev => [
      ...prev,
      userMsg,
      { 
        id: assistMsgId, 
        role: 'model' as const, 
        content: "", 
        timestamp: Date.now(), 
        persona: sourcePersona,
        channel: options?.channel,
        channels: options?.channels,
        mode: options?.mode
      }
    ]);
    
    // 2. Set generating status and register AbortController
    if (abortControllersRef.current[sourcePersona]) {
      try { abortControllersRef.current[sourcePersona]?.abort(); } catch (_) {}
    }
    const currentAbortController = new AbortController();
    abortControllersRef.current[sourcePersona] = currentAbortController;

    isGeneratingRef.current[sourcePersona] = true;
    setIsGenerating(prev => ({ ...prev, [sourcePersona]: true }));

    // 60-second Safety Watchdog Timer: prevents UI from hanging indefinitely on network loss/stalls while allowing full generation for complex queries
    const watchdogTimer = setTimeout(() => {
      if (isGeneratingRef.current[sourcePersona]) {
        console.warn(`[AppContext] Safety watchdog auto-released isGenerating for ${sourcePersona}`);
        try { currentAbortController.abort(); } catch (_) {}
        isGeneratingRef.current[sourcePersona] = false;
        setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
      }
    }, 60000);
    
    // 3. Prepare AI Prompt
    const profile = sharedState?.userProfile || getPersistentUserProfile();
    const nickname = profile?.basic?.nickname || "";
    const realName = profile?.basic?.name || "";
    const mbti = profile?.psych?.mbti || "정보 없음";
    
    const sajuObj = calculateDetailedSaju(profile);
    const saju = sajuObj ? sajuObj.systemPromptSummary : (profile?.basic?.birthdate 
      ? `생년월일: ${profile.basic.birthdate} (${profile.basic.lunarSolar || 'solar'}), 생시: ${profile.basic?.birthtime || '모름'}` 
      : "기본 생년월일 정보 없음");
    const astro = buildUserNatalSummary(profile);
    const memory = profile?.fate?.currentWorry || "특별한 고민 없음";
    const relationships = formatRelationshipsContext(profile?.relationships);
    const currentVibe = sharedState?.currentVibe || "통상적인 기운";
    const preferences = profile?.psych?.aiPreference || "정보 없음";
    const globalMemory = sharedState?.globalMemory || "";
    const deepCoreInfo = `사용자 MBTI: ${mbti}, 선호 스타일: ${profile?.psych?.counselingStyle || "기본"}${sajuObj ? `, 사주 본원: ${sajuObj.shortDigest}` : ''}`;
    
    let systemPrompt = "";
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

    if (sourcePersona === 'lucy' && (options?.mode === 'casual' || !options?.channels?.length)) {
      systemPrompt += `\n\n[★ 루시 일상 수다 모드 핵심 지침]:
1. [직접 대화형 / 강의식 정답 금지]: 사용자에게 일방적인 긴 훈계나 거창한 솔루션을 일장연설로 늘어놓지 마세요.
2. [간결한 티키타카]: 친한 친구와 카톡으로 수다를 떨듯이 1~3문장 내외로 간결하고 자연스럽게 대화하세요.
3. [경청과 다정한 맞장구]: 사용자의 말에 귀 기울여 공감하고, 리액션과 맞장구를 치며 다음 이야기를 가볍게 되물어보세요.`;
    }

    // Append cross-app real-time remembrance
    systemPrompt += getCrossAppRecentDialogueContext();

    // Safari PWA / reduced 성능 기기에서는 무거운 지식 엔진을 생략하여 멈춤 방지
    const _isPerfReduced = isPerfReduced() || isStandalonePWA();

    // Append full PRISM omniscient ecosystem feature results
    systemPrompt += buildPrismOmniscientContext(sharedState, firebaseUser?.uid || null);

    if (!_isPerfReduced) {
      // 동적 import: 채팅 첫 전송 시에만 로드 (앱 초기 번들 파싱 부담 제거)
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

      // 🪷 Append Early Buddhism (Nikāya) canonical wisdom engine
      systemPrompt += `\n\n${buildEarlyBuddhismSystemPrompt()}`;

      // 🌌 Append Gnosticism (Nag Hammadi & Gnosis) esoteric wisdom engine
      systemPrompt += `\n\n${buildGnosticSystemPrompt()}`;

      // 🕊️ Append A Course in Miracles (ACIM) forgiveness & peace engine
      systemPrompt += `\n\n${buildAcimSystemPrompt()}`;

      // 🧠 Append Psychological Distancing (Self-Distancing & Cognitive Defusion) Master engine
      systemPrompt += `\n\n${buildDistancingSystemPrompt()}`;

      // 🕊️ Append Sedona Method (5 Questions & Releasing) Master engine
      systemPrompt += `\n\n${buildSedonaSystemPrompt()}`;

      // ☀️ Append David R. Hawkins Letting Go (Surrender) Master engine
      systemPrompt += `\n\n${buildLettingGoSystemPrompt()}`;
    }

    // 📖 Append Permanent Background Memory & Long-term Episodic Archive
    systemPrompt += `\n\n${buildPermanentMemoryPromptContext()}`;

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

    // 강력한 대화 포커스 및 인지 능력, 기억력 개선
    systemPrompt += `\n\n[루시의 최우선 커뮤니케이션 & 대화 기억 원칙]
1. [현재 입력 최우선 경청]: 사용자가 방금 보낸 최신 메시지(질문, 일상 대화, 타로 해석 요청, 고민 등)의 의도와 핵심을 가장 먼저 정확히 파악하여, 그 질문에 직접적이고 명쾌하며 다정하게 대답해줘.
2. [자연스러운 대화 기억과 연속성]: 사용자와 지금까지 나누었던 대화 기록과 이야기들을 자연스럽게 기억하고 존중해줘. 사용자가 "아까 내가 말했던 거 기억해?", "그때 추천해준 건?", "전에 했던 이야기" 등을 언급할 때 대화 기록을 기반으로 섬세하게 인지하고 대답해줘.
3. [유연한 흐름 전환]: 사용자가 새로운 질문이나 다른 주제를 꺼낼 때는 과거 이야기에 억지로 얽매이지 않고, 새로운 주제에 맞춰 매끄럽고 유연하게 반응해줘.
4. [배경 지식의 조화로운 활용]: 프로필, 사주, 오라클 등 에코시스템 데이터는 대화 맥락과 질문에 맞을 때 자연스럽게 1~2문장으로 녹여내고, 묻지 않은 배경 지식을 무의미하게 길게 나열하지 마.
5. [말투 (반말 100% 절대 고정)]: 루시(Lucy)는 어떤 상황, 어떤 질문, 어떤 채널에서든 예외 없이 100% 항상 친근하고 다정한 친구 같은 '반말'만 사용해야 해. 절대로 존댓말(~요, ~습니다, ~해요, ~해 드려요, ~할게요, ~인가요 등)을 섞거나 혼용하지 마. 처음부터 끝까지 완전한 반말 구어체(~야, ~어, ~했어, ~지, ~네, ~잖아, ~자, ~해 등)로만 일관되게 대답해.
6. [🎨 AI 이미지 생성 및 원화 그리기 지침]: 사용자가 그림, 일러스트, 이미지, 아트워크, 풍경, 캐릭터 등을 그려달라고 요청하거나(~ 그려줘, 이미지 만들어줘, 그려줄래, 아트워크 생성해줘, 사진 그려봐 등) 시각적인 묘사를 원할 때:
   - 다정한 친구 같은 설명과 함께 반드시 다음 형식의 고화질 이미지 마크다운 태그를 답변 본문에 포함하여 즉시 원화를 그려줘:
     ![이미지 설명](https://image.pollinations.ai/prompt/영문_상세_프롬프트?width=768&height=576&seed=랜덤숫자&nologo=true&model=flux)
   - 영문_상세_프롬프트는 사용자의 요청 주제를 시각적으로 매우 아름답고 정교하며 예술적인 고품질 영어 프롬프트(예: ethereal lighting, 8k resolution, masterpiece, detailed digital concept art 등)로 풍부하게 확장하여 URL-인코딩 형태로 작성해.
7. [🔑 Key 마음약방 40가지 불안 치유 연습 추천 및 상호 연동]:
   - 사용자가 불안, 걱정, 공황, 초조, 과도한 생각의 꼬리물기, 신체 긴장, 감정 압박을 호소하거나 Key 마음약방 관련 질문을 할 때:
     1) 따뜻하고 다정한 친구(반말)로서 깊은 공감과 인지적 안도감을 먼저 건네줘.
     2) 사용자의 현재 고민이나 감정에 가장 완벽하게 매칭되는 40가지 연습 중 '단 하나의 맞춤 실천 연습'(예: '연습 1. 걱정 그리기', '연습 9. 호흡에 닻 내리기', '연습 10. 발바닥 그라운딩', '연습 15. 유기적 5초 풍선 호흡', '연습 20. 친절과 자기자비' 등)을 꼭 집어 추천하고 그 이유를 다정하게 설명해줘.
     3) 답변 말미에 "답변 바로 아래 추천 카드의 [실천하기] 버튼을 누르면 Key 연습실에서 방금 추천한 연습이 바로 열릴 거야!"라고 안내해줘.`;
    
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
    const historySlice = [...unifiedMessages, userMsg].filter((message) => !isLegacyAIErrorMessage(message)).slice(-historyLimit);
    const conversationForAPI: Message[] = [
      { role: 'system', content: systemPrompt },
      ...historySlice.map((m, idx) => {
        const isLatestMessage = idx === historySlice.length - 1;
        const finalContent = sanitizeHistoryItem(m.content, isLatestMessage);
        return {
          role: m.role === 'model' ? 'assistant' : m.role,
          content: finalContent
        };
      })
    ];
    
    let pendingRaf: number | null = null;
    let latestCleanReply = '';

    const flushChunk = () => {
      pendingRaf = null;
      setUnifiedMessages(prev => {
        let found = false;
        const updated = prev.map(m => {
          if (m.id === assistMsgId) {
            found = true;
            return { ...m, content: latestCleanReply, persona: sourcePersona };
          }
          return m;
        });
        if (!found) {
          updated.push({ id: assistMsgId, role: 'model' as const, content: latestCleanReply, timestamp: Date.now(), persona: sourcePersona });
        }
        return updated;
      });
    };

    try {
      await invokeLLMStream({
        messages: conversationForAPI,
        signal: currentAbortController.signal,
        timeoutMs: 60000,
        onChunk: (chunk: string) => {
          replyText += chunk;
          latestCleanReply = cleanChatDisplayText(replyText);
          if (pendingRaf === null) {
            pendingRaf = requestAnimationFrame(flushChunk);
          }
        },
        onFinish: async (fullText: string) => {
          if (pendingRaf !== null) {
            cancelAnimationFrame(pendingRaf);
            pendingRaf = null;
          }
          isGeneratingRef.current[sourcePersona] = false;
          setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));

          const parsedSuggestions = parseSuggestions(fullText);
          if (parsedSuggestions.length > 0) {
            setChatSuggestions(prev => ({
              ...prev,
              [sourcePersona]: parsedSuggestions,
            }));
          }

          const cleanFullText = cleanChatDisplayText(fullText);
          const verifiedEx = validateAndExtractKeyExercise(cleanFullText, text, options?.keyExerciseIndex);
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
                keyExerciseIndex: resolvedKeyExIndex
              });
            }
            pushChatThreadsToFirestore(updated);
            return updated;
          });

          // Save firestore history under appropriate app schema if not developer bypass
          const fUser = auth.currentUser;
          if (fUser && safeLocalStorage.getItem('developer_bypass') !== 'true') {
            try {
              const targets = [
                { collectionName: 'orange_history', logType: 'chat_sync', logTitle: '오렌지 다이어리 교감' },
                { collectionName: 'bluebird_history', logType: 'chat_sync', logTitle: '블루버드 라디오 교감' },
                { collectionName: 'heal_history', logType: 'chat_sync', logTitle: '아우라 주파수 조율' },
                { collectionName: 'muse_history', logType: 'chat_sync', logTitle: '뮤즈 영감 싱크' },
                { collectionName: 'trinity_history', logType: 'chat_sync', logTitle: '트리니티 오라클 자문' }
              ];

              await Promise.all(
                targets.map(target =>
                  addDoc(collection(db, target.collectionName, fUser.uid, 'entries'), {
                    type: target.logType,
                    title: target.logTitle,
                    content: text.length > 40 ? `${text.slice(0, 40)}...` : text,
                    response: cleanFullText,
                    metadata: { question: text },
                    createdAt: serverTimestamp()
                  })
                )
              );
            } catch (dbErr) {
              console.warn("Failed saving unified chat log entry to all app histories:", dbErr);
            }
          }

          if (options?.onFinish) {
            try {
              await options.onFinish(fullText, text, assistMsgId);
            } catch (callbackErr) {
              console.warn("sendUnifiedMessage onFinish callback failed:", callbackErr);
            }
          }
        }
      });
    } catch (err: any) {
      console.error("Error in sendUnifiedMessage:", err);
      isGeneratingRef.current[sourcePersona] = false;
      setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));

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
            const hasText = typeof m.content === 'string' && m.content.trim().length > 15;
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
        pushChatThreadsToFirestore(updated);
        return updated;
      });
    } finally {
      clearTimeout(watchdogTimer);
      if (abortControllersRef.current[sourcePersona] === currentAbortController) {
        abortControllersRef.current[sourcePersona] = null;
      }
      isGeneratingRef.current[sourcePersona] = false;
      setIsGenerating(prev => ({ ...prev, [sourcePersona]: false }));
    }
  }, [activePersona, buildPrismOmniscientContext, calculateDetailedSaju, firebaseUser, isGeneratingRef, pushChatThreadsToFirestore, sharedState, unifiedMessages]);

  return (
    <AppContext.Provider value={{
      firebaseUser, isAuthReady, isUnlocked, unlock,
      signInWithGoogle: handleSignIn, signInAsDeveloper, signInAsPairedSession, logout: handleLogout,
      sharedState, updateSharedState, syncPrismDevices, isSyncing,
      isChatOpen, setIsChatOpen,
      activePersona, setActivePersona,
      personaMessages, setPersonaMessages,
      isGenerating, abortGenerating, sendUnifiedMessage, chatSuggestions, openLucyChat,
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
