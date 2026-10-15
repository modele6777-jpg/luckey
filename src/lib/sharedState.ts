import { useEffect, useState, useCallback } from 'react';
import { auth, db, doc, setDoc, onSnapshot, serverTimestamp, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export interface HealthMetrics {
  fatigue?: number;       // 0-100
  sleepScore?: number;    // 0-100
  caffeineIntake?: number; // 0-100
  stressLevel?: number;   // 0-100
}

export interface ProductivityMetrics {
  tasksCompleted?: number;
  focusTime?: number;     // minutes
}

// 섹션1: 기본 정보
export interface ProfileBasic {
  name?: string;            // 실명
  nickname?: string;        // 닉네임 (루시가 부를 이름)
  birthdate?: string;       // YYYY-MM-DD
  birthtime?: string;       // HH:MM
  gender?: 'male' | 'female' | 'other';
  birthCity?: string;
  lunarSolar?: 'solar' | 'lunar';
}

// 섹션2: 사주/운세 관심사
export interface ProfileFate {
  fateInterests?: string[];  // ['사주', '타로', '별자리', '기예단문']
  lifeGoal?: string;
  currentWorry?: string;
}

// 섹션3: 음악 취향
export interface ProfileMusic {
  favoriteGenres?: string[];  // ['K-Pop', '재즈', '클래식', ...]
  instruments?: string[];
  creativeGoal?: string;
  favoriteArtists?: string;
}

// 섹션4: 심리/감정 및 딥 코어(Deep Core) 설정
export interface ProfilePsych {
  mbti?: string;
  counselingStyle?: 'empathy' | 'advice' | 'mixed';
  currentMood?: string;
  personalityKeywords?: string[];
  overloadTime?: string;     // 뇌 과부하가 심해지는 시간대
  currentSymptoms?: string;  // 현재 겪고 있는 증상
  aiPreference?: string;     // AI들이 어떤 톤과 성격으로 대해줬으면 좋겠는지
}

// 섹션5: 예술 취향
export interface ProfileArt {
  favoriteArtStyle?: string[];  // ['인상주의', '초현실주의', '팝아트', ...]
  favoritePoets?: string;
  favoriteColors?: string[];
  artMedium?: string[];  // ['그림', '사진', '조각', ...]
}

// 점성학적 관계 및 지인 분석 정보
export interface RelationshipEntry {
  id: string;
  name: string;            // 인물 이름/호칭 (예: 민수, 팀장님 등)
  relation: string;        // 관계 (친구, 연인, 배우자, 직장 동료, 가족 등)
  birthdate?: string;      // 생년월일 (선택)
  zodiacSign?: string;     // 별자리 (예: 사자자리, 전갈자리 등)
  traits?: string;         // 주요 성격 및 성향
  dynamics?: string;       // 관계 역학 메모 또는 고민
}

export interface UserProfile {
  basic?: ProfileBasic;
  fate?: ProfileFate;
  music?: ProfileMusic;
  psych?: ProfilePsych;
  art?: ProfileArt;
  relationships?: RelationshipEntry[];
  completedAt?: any;
}

const PROFILE_PLACEHOLDERS = new Set(['여행자', '사용자', '정보 없음', '모름', '기본', 'none', 'unknown', '']);

function isProfilePlaceholder(val: any): boolean {
  if (val === undefined || val === null) return true;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return !trimmed || PROFILE_PLACEHOLDERS.has(trimmed.toLowerCase()) || trimmed === '여행자' || trimmed === '사용자';
  }
  if (Array.isArray(val)) return val.length === 0;
  return false;
}

function mergeSectionSafely<T extends any>(baseSection?: T, incomingSection?: T, preferIncoming = false): T {
  const b = baseSection || {} as any;
  const i = incomingSection || {} as any;
  const res: any = preferIncoming ? { ...b, ...i } : { ...i, ...b };
  const allKeys = new Set([...Object.keys(b), ...Object.keys(i)]);

  for (const k of allKeys) {
    const bVal = b[k];
    const iVal = i[k];
    const bEmpty = isProfilePlaceholder(bVal);
    const iEmpty = isProfilePlaceholder(iVal);

    if (bEmpty && iEmpty) {
      res[k] = !bEmpty ? bVal : (!iEmpty ? iVal : bVal || iVal);
      continue;
    }
    if (!bEmpty && iEmpty) {
      res[k] = preferIncoming ? iVal : bVal;
      continue;
    }
    if (bEmpty && !iEmpty) {
      res[k] = iVal;
      continue;
    }

    if (Array.isArray(bVal) || Array.isArray(iVal)) {
      if (preferIncoming && Array.isArray(iVal) && iVal.length > 0) {
        res[k] = iVal;
        continue;
      }
      const bArr = Array.isArray(bVal) ? bVal : [];
      const iArr = Array.isArray(iVal) ? iVal : [];
      res[k] = Array.from(new Set([...bArr, ...iArr]));
      continue;
    }

    if (typeof bVal === 'string' && typeof iVal === 'string') {
      const bStr = bVal.trim();
      const iStr = iVal.trim();
      if (bStr === iStr) {
        res[k] = bStr;
      } else if (preferIncoming) {
        res[k] = iStr;
      } else {
        res[k] = iStr.length >= bStr.length ? iStr : bStr;
      }
      continue;
    }

    res[k] = preferIncoming ? (iVal !== undefined ? iVal : bVal) : (iVal !== undefined ? iVal : bVal);
  }
  return res as T;
}

export function mergeUserProfiles(base?: UserProfile, incoming?: UserProfile, preferIncoming = false): UserProfile {
  if (!base && !incoming) return {};
  if (!base) return incoming || {};
  if (!incoming) return base || {};

  return {
    ...(preferIncoming ? base : incoming),
    ...(preferIncoming ? incoming : base),
    basic: mergeSectionSafely(base.basic, incoming.basic, preferIncoming),
    fate: mergeSectionSafely(base.fate, incoming.fate, preferIncoming),
    music: mergeSectionSafely(base.music, incoming.music, preferIncoming),
    psych: mergeSectionSafely(base.psych, incoming.psych, preferIncoming),
    art: mergeSectionSafely(base.art, incoming.art, preferIncoming),
    relationships: preferIncoming
      ? (incoming.relationships && incoming.relationships.length > 0 ? incoming.relationships : base.relationships)
      : (base.relationships && base.relationships.length > 0 ? base.relationships : incoming.relationships),
    completedAt: (preferIncoming ? incoming.completedAt : base.completedAt) || incoming.completedAt || base.completedAt || Date.now(),
  };
}

export interface SharedState {
  uid?: string;
  userProfile?: UserProfile;
  healthMetrics?: HealthMetrics;
  productivityMetrics?: ProductivityMetrics;
  luckScore?: number;        // 0-100 (Progressive luck)
  visualGiftConfig?: {
    colorName: string;
    hex: string;
    themes: string[];
  };
  themeColor?: string; // App-wide background theme based on vibe
  currentVibe?: string;
  globalMemory?: string; // AI-generated summary of all apps
  trinityMemory?: string; // Specific to Lucy (Destiny/Luck)
  museMemory?: string;    // Specific to Muse (Art/Inspiration)
  orangeMemory?: string;  // Specific to Orange (Emotions/Diary)
  bluebirdMemory?: string; // Specific to Bluebird (Healing/Prescription)
  healMemory?: string;    // Specific to Aura (Physical Health/Energy)
  prologueMemory?: string; // Specific to Prologue (Hub Home Page)
  epilogueMemory?: string; // Specific to Epilogue (Reflection Page)
  deepSyncHistory?: any[]; // For Trinity Library
  museHistory?: any[];     // For Muse Library
  orangeHistory?: any[];   // For Orange Library
  bluebirdHistory?: any[]; // For Bluebird Library
  healHistory?: any[];     // For Heal Library
  trinityHistory?: any[];  // For Trinity Library
  prologueHistory?: any[]; // For Prologue Library
  epilogueHistory?: any[]; // For Epilogue Library
  showOnboarding?: boolean; // For showing soul onboarding
  lastMuseSync?: number;   // Daily limit for Muse
  lastOrangeRefine?: number; // Daily limit for Orange
  lastBluebirdSync?: number; // Daily limit for Bluebird
  lastTrinitySync?: number;  // Daily limit for Trinity
  lastDailyOracleSync?: number; // Universal daily oracle limit
  lastTrinityDailySync?: number;
  lastTrinitySoulSync?: number;
  lastOrangeDailySync?: number;
  lastOrangeSoulSync?: number;
  lastBluebirdDailySync?: number;
  lastBluebirdSoulSync?: number;
  lastHealDailySync?: number;
  lastHealSoulSync?: number;
  lastMuseDailySync?: number;
  lastMuseSoulSync?: number;
  soulHistory?: { name: string; value: number }[]; // For SoulFrequencyChart
  emotionHistory?: { name: string; value: number }[]; // For EmotionDistribution
  lastEnergyAnalysis?: number; // timestamp
  focusPlaylists?: string[]; // Saved focus music playlists
  favoriteInsightIds?: string[]; // Saved Universal Insight quote IDs (즐겨찾기)
  featureHistory?: any[]; // Consolidated cross-app activity feed (Tarot, Saju, Wishes, Art, etc.)
  todayOracles?: Record<string, Record<string, any>>; // key: dateKey (YYYY-MM-DD), value: { [app]: DailyOracleSummary }
  latestDailyOracles?: Record<string, any>; // key: app, value: DailyOracleSummary
  dailySecrets?: Record<string, any>; // key: dateKey (YYYY-MM-DD), value: Orange Daily Secret data
  hoponoponoDaily?: Record<string, any>; // key: dateKey (YYYY-MM-DD), value: Bluebird Hoponopono data
  dailyArts?: Record<string, any>; // key: dateKey (YYYY-MM-DD), value: Muse Daily Art recommendation data
  trinityDailyLucky?: Record<string, any>; // key: dateKey (YYYY-MM-DD), value: Trinity Daily Lucky data (report, quests, boost)
  todoMissions?: {
    date: string;
    missions: any[];
    lastSavedAt?: string;
  };
  ecprPrescription?: {
    prescription: any;
    distressType?: string;
    symptoms?: string;
    timestamp?: number;
    dateKey?: string;
  };
  oracleSessions?: Record<string, any>; // key: `${mode}_${dateKey}`, value: SavedDailyOracleSession
  healingTreasures?: any[]; // Oracle treasures
  growthLogs?: any; // Oracle growth streak and completion
  talismanChest?: any[]; // Orange talisman chest
  equippedCharm?: any; // Currently equipped talisman
  rebibleVerses?: any[]; // Re:Bible holy scriptures and annotations across devices
  userGoals?: any[]; // User goals and concentric progress ring dashboard across devices
  userGoalsUpdatedAt?: number;
  chatHistory?: any[]; // Unified chat messages across devices
  chatThreads?: Record<string, any[]>; // Unified chat messages across devices
  chatUpdatedAt?: number;
  sourceApp?: string;
  updatedAt?: any;
  clientUpdatedAt?: number;
  profileUpdatedAt?: number;
  unifiedAppVersion?: string;
  clientAppVersions?: {
    desktop?: string;
    mobile?: string;
    tablet?: string;
  };
  lastAppSyncAt?: number;
}

export function useFirebaseAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);
    });
    return unsub;
  }, []);

  return { firebaseUser, isAuthReady };
}

export function useSharedState(uid: string | undefined) {
  const [sharedState, setSharedState] = useState<SharedState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!uid) {
      setSharedState(null);
      return;
    }
    if (localStorage.getItem('developer_bypass') === 'true') {
      return;
    }
    const ref = doc(db, 'sharedState', uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSharedState(snap.data() as SharedState);
      }
    }, (error) => {
      console.warn('[useSharedState] Firestore onSnapshot failed: ', error.message);
    });
    return unsub;
  }, [uid]);

  const updateSharedState = useCallback(async (
    updates: Partial<SharedState>,
    sourceApp: string
  ) => {
    if (!uid) return;
    setIsSyncing(true);
    // Optimistic local state update
    setSharedState(prev => ({
      ...(prev || {}),
      ...updates,
      sourceApp,
    }));
    try {
      const ref = doc(db, 'sharedState', uid);
      await setDoc(ref, {
        ...updates,
        sourceApp,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `sharedState/${uid}`);
    } finally {
      setIsSyncing(false);
    }
  }, [uid]);

  return { sharedState, updateSharedState, isSyncing };
}
