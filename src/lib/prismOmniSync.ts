import { type SharedState } from './sharedState';
import { auth, db, doc, setDoc, serverTimestamp } from './firebase';
import { calculateDetailedSaju } from './sajuAnalysis';
import { cleanFirestoreData } from './sharedStateSync';
import { getPairedVaultId, pushToPairedVault } from './serverSyncClient';

export interface PrismFeatureEntry {
  id: string;
  app: 'trinity' | 'orange' | 'bluebird' | 'heal' | 'muse' | 'hub' | 'epilogue';
  appName: string;
  featureName: string;
  summary: string;
  details?: Record<string, any>;
  timestamp: number;
  dateKey: string;
}

export interface DailyOracleSummary {
  app: 'trinity' | 'orange' | 'bluebird' | 'heal' | 'muse' | 'hub' | 'epilogue';
  appName?: string;
  featureName?: string;
  cardName?: string;
  cardKeywords?: string[];
  cardDesc?: string;
  diagnosis: string;
  remedy?: string;
  spiritualEnergy?: string;
  blessingMessage?: string;
  frequency?: string;
  symbol?: string;
  focusPlaylist?: string;
  drawnCard?: any;
  timestamp?: number;
  dateKey?: string;
}

const STORAGE_KEY = 'prism_omni_feature_history';
const MAX_ENTRIES = 60;

// ─── 오브 신탁 히스토리 ───────────────────────────────────────────────────────
export const ORB_HISTORY_KEY = 'prism_orb_scrying_history';
const MAX_ORB_HISTORY = 20;

export interface ScryingResultSnapshot {
  query: string;
  keyTheme: string;
  directAnswer: string;
  actionSolution: string;
  modeTitle?: string;
  timestamp: number;
  dateKey: string;
}

/**
 * 오브 신탁 결과를 히스토리에 저장합니다 (최대 20개).
 */
export function saveOrbScryingToHistory(result: ScryingResultSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(ORB_HISTORY_KEY);
    let history: ScryingResultSnapshot[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) history = [];
    history.unshift(result);
    if (history.length > MAX_ORB_HISTORY) history = history.slice(0, MAX_ORB_HISTORY);
    localStorage.setItem(ORB_HISTORY_KEY, JSON.stringify(history));
  } catch (_) {}
}

/**
 * 오브 신탁 히스토리를 반환합니다.
 */
export function getOrbScryingHistory(): ScryingResultSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORB_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

// ─── 루시 채팅 요약 ───────────────────────────────────────────────────────────
export const LUCY_CHAT_SUMMARY_KEY = 'prism_lucy_chat_summary';

export interface LucyChatSummary {
  summary: string;
  persona: string;
  timestamp: number;
  dateKey: string;
}

/**
 * 루시 채팅 대화 요약을 저장합니다.
 */
export function saveLucyChatSummary(summary: string, persona: string): void {
  if (typeof window === 'undefined') return;
  try {
    const todayKey = getTodayDateKey();
    const payload: LucyChatSummary = { summary, persona, timestamp: Date.now(), dateKey: todayKey };
    localStorage.setItem(LUCY_CHAT_SUMMARY_KEY, JSON.stringify(payload));
    // Cross-tab broadcast
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('prism-cross-app');
      bc.postMessage({ type: 'PRISM_LUCY_CHAT_SUMMARY', payload });
      bc.close();
    }
  } catch (_) {}
}

/**
 * 저장된 루시 채팅 요약을 반환합니다.
 */
export function getLucyChatSummary(): LucyChatSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LUCY_CHAT_SUMMARY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LucyChatSummary;
  } catch (_) {
    return null;
  }
}

function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const APP_NAMES: Record<string, string> = {
  trinity: '트리니티 (운명/타로/점성)',
  orange: '오렌지 (마음치유/비밀의 방)',
  bluebird: '블루버드 (휴식/호오포노포노)',
  heal: '아우라/힐 (신체웰니스/세도나)',
  muse: '뮤즈 (창작영감/롤모델)',
  hub: '허브 (글로벌바이탈/기운)',
  epilogue: '에필로그 (하루성찰/감사)',
};

function collectAllTodayOracles(dateKey: string): Record<string, any> {
  const result: Record<string, any> = {};
  const apps = ['trinity', 'orange', 'bluebird', 'heal', 'muse', 'hub', 'epilogue'];
  apps.forEach((app) => {
    try {
      const raw = localStorage.getItem(`prism_daily_oracle_${app}_${dateKey}`) ||
                  localStorage.getItem(`prism_latest_daily_${app}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.dateKey || parsed.dateKey === dateKey) {
          result[app] = parsed;
        }
      }
    } catch (_) {}
  });
  return result;
}

/**
 * 모든 앱의 일일 오라클/타로/치유 결과 요약본을 통합 저장하고 전사 공유소에 동기화합니다.
 */
export function recordDailyOracleResult(params: DailyOracleSummary): void {
  if (typeof window === 'undefined') return;

  try {
    const todayKey = params.dateKey || getTodayDateKey();
    const appName = params.appName || APP_NAMES[params.app] || params.app;
    const featureName = params.featureName || '데일리 오라클 비전';
    const timestamp = params.timestamp || Date.now();

    const summaryPayload: DailyOracleSummary = {
      ...params,
      appName,
      featureName,
      timestamp,
      dateKey: todayKey,
    };

    // 1. Save to dedicated daily oracle slot for the app
    try {
      localStorage.setItem(`prism_daily_oracle_${params.app}_${todayKey}`, JSON.stringify(summaryPayload));
      localStorage.setItem(`prism_latest_daily_${params.app}`, JSON.stringify(summaryPayload));
    } catch (_) {}

    // 2. Build concise human-readable summary for feature feed
    const cardInfo = params.cardName ? `[${params.cardName}${params.cardKeywords?.length ? ` (${params.cardKeywords.slice(0, 3).join(', ')})` : ''}] ` : '';
    const cleanDiagnosis = params.diagnosis ? params.diagnosis.replace(/[#*`_]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
    const remedyInfo = params.remedy ? ` | 처방: ${params.remedy.replace(/[#*`_]/g, ' ').trim().slice(0, 80)}` : '';
    const feedSummary = `${cardInfo}${cleanDiagnosis}${cleanDiagnosis.length >= 120 ? '...' : ''}${remedyInfo}`;

    // 3. Record to general feature history
    recordPrismFeature({
      app: params.app,
      appName,
      featureName,
      summary: feedSummary,
      details: summaryPayload,
    });

    // 4. Dispatch daily oracle event
    try {
      window.dispatchEvent(new CustomEvent('prism:daily_oracle_updated', { detail: summaryPayload }));
    } catch (_) {}

    // 5. Sync to Firestore & Paired Vault in real-time for instant cross-device synchronization (PC <-> Mobile)
    const activeUid = auth?.currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('prism_auth_uid') || sessionStorage.getItem('prism_auth_uid')) : null);
    
    // Collect all today's oracles to ensure full state preservation
    const allToday = collectAllTodayOracles(todayKey);
    allToday[params.app] = summaryPayload;

    const oraclePayload: Partial<SharedState> = {
      todayOracles: {
        [todayKey]: {
          ...allToday,
          [params.app]: summaryPayload,
        },
      },
      latestDailyOracles: {
        [params.app]: summaryPayload,
      },
      lastDailyOracleSync: Date.now(),
      clientUpdatedAt: Date.now(),
    };

    if (activeUid && activeUid !== 'developer-bypass-uid') {
      const ref = doc(db, 'sharedState', activeUid);
      const cleanPayload = cleanFirestoreData({
        ...oraclePayload,
        updatedAt: serverTimestamp(),
      });
      setDoc(ref, cleanPayload, { merge: true }).catch((err) => {
        console.warn('[recordDailyOracleResult] Firestore background sync notice (cached locally):', err?.message || err);
      });
    }

    if (getPairedVaultId()) {
      void pushToPairedVault(oraclePayload as SharedState).catch(() => {});
    }
  } catch (err) {
    console.warn('[recordDailyOracleResult] Failed to record daily oracle summary:', err);
  }
}

/**
 * 특정 댑의 최신 일일 오라클/타로/치유 결과 요약을 가져옵니다.
 */
export function getLatestDailyOracleResult(app: 'trinity' | 'orange' | 'bluebird' | 'heal' | 'muse' | 'hub' | 'epilogue' | string): DailyOracleSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`prism_latest_daily_${app}`);
    if (raw) {
      return JSON.parse(raw) as DailyOracleSummary;
    }
  } catch (_) {}
  return null;
}

/**
 * 프리즘 사이트 내의 모든 기능 수행 결과를 실시간으로 기록하고 전사 공유소에 동기화합니다.
 */
export function recordPrismFeature(params: {
  app: 'trinity' | 'orange' | 'bluebird' | 'heal' | 'muse' | 'hub' | 'epilogue';
  appName?: string;
  featureName: string;
  summary: string;
  details?: Record<string, any>;
}): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: PrismFeatureEntry = {
      id: `feat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      app: params.app,
      appName: params.appName || APP_NAMES[params.app] || params.app,
      featureName: params.featureName,
      summary: params.summary,
      details: params.details,
      timestamp: Date.now(),
      dateKey: getTodayDateKey(),
    };

    // 1. Save to dedicated app latest cache
    try {
      localStorage.setItem(`prism_latest_${params.app}_${params.featureName.replace(/[^a-zA-Z0-9가-힣]/g, '_')}`, JSON.stringify(entry));
    } catch (_) {}

    // 2. Append to chronological feature history
    let history: PrismFeatureEntry[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        history = JSON.parse(raw);
        if (!Array.isArray(history)) history = [];
      }
    } catch (_) {
      history = [];
    }

    history.unshift(entry);
    if (history.length > MAX_ENTRIES) {
      history = history.slice(0, MAX_ENTRIES);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (_) {}

    // 3. Dispatch custom event for real-time reactivity
    try {
      window.dispatchEvent(new CustomEvent('prism:feature_updated', { detail: entry }));
    } catch (_) {}

    // 4. Sync feature history to Firestore & Paired Vault in real-time
    const activeUid = auth?.currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('prism_auth_uid') || sessionStorage.getItem('prism_auth_uid')) : null);
    const cleanHistory = cleanFirestoreData(history);
    
    if (activeUid && activeUid !== 'developer-bypass-uid') {
      const ref = doc(db, 'sharedState', activeUid);
      setDoc(ref, {
        featureHistory: cleanHistory,
        clientUpdatedAt: Date.now(),
        updatedAt: serverTimestamp(),
      }, { merge: true }).catch((err) => {
        console.warn('[recordPrismFeature] Firestore background sync notice (cached locally):', err?.message || err);
      });
    }

    if (getPairedVaultId()) {
      void pushToPairedVault({ featureHistory: cleanHistory, clientUpdatedAt: Date.now() } as SharedState).catch(() => {});
    }
  } catch (err) {
    console.warn('[recordPrismFeature] Failed to record feature result:', err);
  }
}

/**
 * 특정 uid 및 sharedState를 바탕으로 모든 앱의 최신 결과들을 취합하여
 * 루시(Lucy) AI가 100% 훤히 인지할 수 있는 포괄적 에코시스템 프롬프트 컨텍스트를 생성합니다.
 */
export function buildPrismOmniscientContext(sharedState?: SharedState | null, uid?: string | null): string {
  if (typeof window === 'undefined') return '';

  try {
    const todayKey = getTodayDateKey();
    const effectiveUid = uid || 'guest';
    const dailyBriefingItems: string[] = [];
    const sections: string[] = [];

    // Helper to safely parse JSON
    const tryParse = (key: string) => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    };

    const profile = sharedState?.userProfile || tryParse('prism_user_profile');

    // 0. 사주명리학(四柱命理) 본원 에너지 브리핑 주입
    if (profile?.basic?.birthdate) {
      const saju = calculateDetailedSaju(profile);
      if (saju) {
        sections.push(`🌟 [사용자의 사주명리학 본원 및 오행 밸런스 브리핑]\n${saju.systemPromptSummary}`);
      }
    }

    // =========================================================================
    // ☀️ 1. 모든 앱의 [오늘의 데일리 오라클 & 타로 일일 종합 요약본] 수집 (오늘 날짜 전용)
    // =========================================================================
    
    // (1) 트리니티 데일리 타로 / 오라클
    const trinityDaily = tryParse(`prism_daily_oracle_trinity_${todayKey}`) ||
      tryParse(`trinity_daily_result_${effectiveUid}_${todayKey}`) ||
      tryParse(`trinity_daily_result_guest_${todayKey}`);

    if (trinityDaily && (trinityDaily.dateKey === todayKey || !trinityDaily.dateKey)) {
      const card = trinityDaily.drawnCard;
      const cardName = trinityDaily.cardName || (card?.nameKo ? `${card.nameKo}${card.name ? ` (${card.name})` : ''}` : trinityDaily.symbol || '운명의 타로');
      const keywords = trinityDaily.cardKeywords?.length ? ` [${trinityDaily.cardKeywords.join(', ')}]` : (card?.keywords?.length ? ` [${card.keywords.join(', ')}]` : '');
      const diag = (trinityDaily.diagnosis || trinityDaily.summary || '').slice(0, 200).trim();
      const rem = trinityDaily.remedy ? `\n  - 실천 처방(Remedy): ${trinityDaily.remedy}` : '';
      const bless = trinityDaily.blessingMessage ? `\n  - 축복 메시지: "${trinityDaily.blessingMessage}"` : '';
      dailyBriefingItems.push(`🔮 **[트리니티 데일리 타로]** 뽑은 카드: ${cardName}${keywords}\n  - 진단 요약: ${diag}${rem}${bless}`);
    }

    // (1-b) 트리니티 데일리 럭키 (행운 리포트 & 3대 퀘스트)
    const trinityLucky = tryParse(`trinity_daily_lucky_data_v4_${effectiveUid}_${todayKey}`) ||
      tryParse(`trinity_daily_lucky_data_v4_guest_${todayKey}`) ||
      tryParse(`trinity_daily_lucky_data_v4_${todayKey}`);
    if (trinityLucky && trinityLucky.luckScore) {
      dailyBriefingItems.push(`🍀 **[트리니티 데일리 럭키]** 행운 지수: ${trinityLucky.luckScore}점 (${trinityLucky.luckLevelTitle || '황금빛 기운'})\n  - 개운 주문: ${trinityLucky.luckySpell?.mantra || ''}\n  - 행운의 글귀: ${trinityLucky.luckyQuote?.quote || ''}`);
    }

    // (2) 오렌지 데일리 연금술 아이디어 오라클
    const orangeDaily = tryParse(`prism_daily_oracle_orange_${todayKey}`) ||
      tryParse(`orange_daily_result_${effectiveUid}_${todayKey}`) ||
      tryParse(`orange_daily_result_guest_${todayKey}`);

    if (orangeDaily && (orangeDaily.dateKey === todayKey || !orangeDaily.dateKey)) {
      const cardName = orangeDaily.cardName || (orangeDaily.data?.drawnCard?.name ? `${orangeDaily.data.drawnCard.name} ${orangeDaily.data.drawnCard.emoji || ''}` : '연금술 아이디어 카드');
      const diag = (orangeDaily.diagnosis || orangeDaily.summary || orangeDaily.data?.diagnosis || '').slice(0, 200).trim();
      const rem = (orangeDaily.remedy || orangeDaily.data?.remedy) ? `\n  - 실천 처방: ${orangeDaily.remedy || orangeDaily.data?.remedy}` : '';
      dailyBriefingItems.push(`🍊 **[오렌지 데일리 연금술 아이디어]** 뽑은 카드: ${cardName}\n  - 마음 진단 요약: ${diag}${rem}`);
    }

    // (3) 블루버드 데일리 마음챙김 / 치유 오라클
    const bluebirdDaily = tryParse(`prism_daily_oracle_bluebird_${todayKey}`) ||
      tryParse(`bluebird_daily_result_${effectiveUid}_${todayKey}`) ||
      tryParse(`bluebird_daily_result_guest_${todayKey}`);

    if (bluebirdDaily && (bluebirdDaily.dateKey === todayKey || !bluebirdDaily.dateKey)) {
      const cardName = bluebirdDaily.cardName || (bluebirdDaily.data?.drawnCard?.name ? `${bluebirdDaily.data.drawnCard.name} ${bluebirdDaily.data.drawnCard.emoji || ''}` : '치유의 파랑새 카드');
      const diag = (bluebirdDaily.diagnosis || bluebirdDaily.summary || bluebirdDaily.data?.diagnosis || '').slice(0, 200).trim();
      const rem = (bluebirdDaily.remedy || bluebirdDaily.data?.remedy) ? `\n  - 마음 실천 팁: ${bluebirdDaily.remedy || bluebirdDaily.data?.remedy}` : '';
      dailyBriefingItems.push(`🕊️ **[블루버드 데일리 마음챙김/휴식]** 뽑은 카드: ${cardName}\n  - 힐링 진단 요약: ${diag}${rem}`);
    }

    // (4) 아우라 / 힐 데일리 세도나 방하착 & 웰니스 오라클
    const healDaily = tryParse(`prism_daily_oracle_heal_${todayKey}`) ||
      tryParse(`heal_daily_result_${effectiveUid}_${todayKey}`) ||
      tryParse(`heal_daily_result_guest_${todayKey}`);

    if (healDaily && (healDaily.dateKey === todayKey || !healDaily.dateKey)) {
      const card = healDaily.drawnCard;
      const cardName = healDaily.cardName || (card?.nameKo ? `${card.nameKo} (${card.name})` : '세도나 방하착 카드');
      const diag = (healDaily.diagnosis || healDaily.summary || '').slice(0, 200).trim();
      const rem = healDaily.remedy ? `\n  - Releasing 방하착 처방: ${healDaily.remedy}` : '';
      dailyBriefingItems.push(`🌿 **[아우라/힐 데일리 세도나 방하착]** 뽑은 정화 카드: ${cardName}\n  - 무의식 정화 요약: ${diag}${rem}`);
    }

    // (5) 뮤즈 데일리 창작 영감 오라클
    const museDaily = tryParse(`prism_daily_oracle_muse_${todayKey}`) ||
      tryParse(`muse_daily_result_${effectiveUid}_${todayKey}`) ||
      tryParse(`muse_daily_result_guest_${todayKey}`);

    if (museDaily && (museDaily.dateKey === todayKey || !museDaily.dateKey)) {
      const cardName = museDaily.cardName || (museDaily.data?.activeCard?.name ? `${museDaily.data.activeCard.name} ${museDaily.data.activeCard.emoji || ''}` : '뮤즈 영감 카드');
      const diag = (museDaily.diagnosis || museDaily.summary || museDaily.data?.diagnosis || '').slice(0, 200).trim();
      const rem = (museDaily.remedy || museDaily.data?.remedy) ? `\n  - 창작 실천 팁: ${museDaily.remedy || museDaily.data?.remedy}` : '';
      dailyBriefingItems.push(`🎨 **[뮤즈 데일리 창작 영감]** 뽑은 카드: ${cardName}\n  - 예술적 비전 요약: ${diag}${rem}`);
    }

    // (6) 크리스탈 오브 신탁 히스토리 (오늘의 모든 신탁)
    try {
      const orbHistory: ScryingResultSnapshot[] = getOrbScryingHistory();
      const todayOrbs = orbHistory.filter((h) => h.dateKey === todayKey);
      if (todayOrbs.length > 0) {
        const orbLines = todayOrbs.slice(0, 5).map((h) => {
          const timeStr = new Date(h.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          return `  - [${timeStr}] [${h.keyTheme}] Q: "${h.query.slice(0, 40)}" → ${h.directAnswer.slice(0, 80)}...`;
        });
        dailyBriefingItems.push(`🔮 **[크리스탈 오브 오늘의 신탁 ${todayOrbs.length}회]**\n${orbLines.join('\n')}`);
      }
    } catch (_) {}

    // 종합 브리핑 섹션 추가
    if (dailyBriefingItems.length > 0) {
      sections.push(`☀️ [오늘 수행된 전체 앱 일일 결과 (Daily Oracle & Tarot) 종합 브리핑]\n${dailyBriefingItems.join('\n\n')}`);
    }

    // =========================================================================
    // 🔮 2. 각 앱별 세부 공명 & 메모리 히스토리
    // =========================================================================

    // --- TRINITY ---
    const trinityItems: string[] = [];
    try {
      const rawRes = localStorage.getItem('resonance_trinity_last_data');
      if (rawRes) {
        const res = JSON.parse(rawRes);
        if (res?.prescription || res?.advice) {
          trinityItems.push(`- [트리니티 영혼 공명]: 일관성 ${res.coherence ?? 90}%, 주파수 ${res.freqText || res.frequency || '528Hz'}, 처방: "${res.prescription || ''}", 실천: "${res.advice || ''}"`);
        }
      }
    } catch (_) {}
    if (sharedState?.trinityMemory) {
      trinityItems.push(`- [트리니티 기억/사주 분석]: ${sharedState.trinityMemory}`);
    }
    if (trinityItems.length > 0) {
      sections.push(`🔮 [트리니티 세부 공명/사주 현황]\n${trinityItems.join('\n')}`);
    }

    // --- ORANGE ---
    const orangeItems: string[] = [];
    try {
      const rawRes = localStorage.getItem('resonance_orange_last_data');
      if (rawRes) {
        const res = JSON.parse(rawRes);
        if (res?.prescription || res?.advice) {
          orangeItems.push(`- [비밀의 방 & 마음 공명]: 일관성 ${res.coherence ?? 85}%, 수호코드 [${res.shieldToken || 'SUN'}], 처방: "${res.prescription || ''}", 실천: "${res.advice || ''}"`);
        }
      }
    } catch (_) {}
    if (sharedState?.orangeMemory) {
      orangeItems.push(`- [오렌지 감정 성찰 기록]: ${sharedState.orangeMemory}`);
    }
    if (orangeItems.length > 0) {
      sections.push(`🍊 [오렌지 세부 공명/비밀의 방 현황]\n${orangeItems.join('\n')}`);
    }

    // --- BLUEBIRD ---
    const bluebirdItems: string[] = [];
    try {
      const rawRes = localStorage.getItem('resonance_bluebird_last_data');
      if (rawRes) {
        const res = JSON.parse(rawRes);
        if (res?.prescription || res?.advice) {
          bluebirdItems.push(`- [블루버드 휴식 공명]: 일관성 ${res.coherence ?? 88}%, 평온 주파수 ${res.freqText || '432Hz'}, 처방: "${res.prescription || ''}", 지침: "${res.advice || ''}"`);
        }
      }
    } catch (_) {}
    if (sharedState?.bluebirdMemory) {
      bluebirdItems.push(`- [블루버드 잠재의식 정화 기록]: ${sharedState.bluebirdMemory}`);
    }
    if (bluebirdItems.length > 0) {
      sections.push(`🕊️ [블루버드 세부 공명/호오포노포노 현황]\n${bluebirdItems.join('\n')}`);
    }

    // --- HEAL ---
    const healItems: string[] = [];
    try {
      const rawRes = localStorage.getItem('resonance_heal_last_data');
      if (rawRes) {
        const res = JSON.parse(rawRes);
        if (res?.prescription || res?.advice) {
          healItems.push(`- [아우라 웰니스 공명]: 일관성 ${res.coherence ?? 90}%, 치유 파동 ${res.freqText || '528Hz'}, 처방: "${res.prescription || ''}", 지침: "${res.advice || ''}"`);
        }
      }
    } catch (_) {}
    if (sharedState?.healMemory) {
      healItems.push(`- [아우라 차크라 & 세도나 릴리즈 기록]: ${sharedState.healMemory}`);
    }
    if (healItems.length > 0) {
      sections.push(`🌿 [아우라/힐 세부 공명/차크라 현황]\n${healItems.join('\n')}`);
    }

    // --- MUSE ---
    const museItems: string[] = [];
    try {
      const rawRes = localStorage.getItem('resonance_muse_last_data');
      if (rawRes) {
        const res = JSON.parse(rawRes);
        if (res?.prescription || res?.advice) {
          museItems.push(`- [뮤즈 창작 공명]: 일관성 ${res.coherence ?? 87}%, 창작 주파수 ${res.freqText || '639Hz'}, 처방: "${res.prescription || ''}", 지침: "${res.advice || ''}"`);
        }
      }
    } catch (_) {}
    if (sharedState?.museMemory) {
      museItems.push(`- [뮤즈 영감 & 롤모델 멘토링 기록]: ${sharedState.museMemory}`);
    }
    if (museItems.length > 0) {
      sections.push(`🎨 [뮤즈 세부 공명/롤모델 현황]\n${museItems.join('\n')}`);
    }

    // --- HUB & GLOBAL ---
    const hubItems: string[] = [];
    if (sharedState?.currentVibe) {
      hubItems.push(`- 오늘 선택한 소울 바이브: [${sharedState.currentVibe}]`);
    }
    if (sharedState?.healthMetrics) {
      const hm = sharedState.healthMetrics;
      hubItems.push(`- 실시간 생체 바이탈 지표: 피로도 ${hm.fatigue ?? 30}%, 스트레스 ${hm.stressLevel ?? 35}%, 수면점수 ${hm.sleepScore ?? 85}점, 집중도 ${sharedState.productivityMetrics?.focusTime ?? 70}점`);
    }
    if (sharedState?.luckScore !== undefined) {
      hubItems.push(`- 오늘의 행운 점수: ${sharedState.luckScore}점`);
    }
    if (sharedState?.globalMemory) {
      hubItems.push(`- 에코시스템 통합 요약 (Global Sync): ${sharedState.globalMemory}`);
    }
    if (hubItems.length > 0) {
      sections.push(`🌐 [허브 (Hub) 라이프 바이탈 & 기운 현황]\n${hubItems.join('\n')}`);
    }

    // --- RE:BIBLE (인생 경전 기록 & 루시의 관점 지혜) ---
    const rebibleItems: string[] = [];
    try {
      const rawVerses = localStorage.getItem('prism_rebible_verses_v2');
      if (rawVerses) {
        const verses = JSON.parse(rawVerses);
        if (Array.isArray(verses) && verses.length > 0) {
          const favoriteVerses = verses.filter((v: any) => v.isSacredFavorite).slice(0, 3);
          const recentVerses = verses.slice(0, 3);
          const featured = favoriteVerses.length > 0 ? favoriteVerses : recentVerses;
          
          featured.forEach((v: any) => {
            const annotationsCount = Array.isArray(v.annotations) ? v.annotations.length : 0;
            const annotText = annotationsCount > 0 ? ` (성찰 주석 ${annotationsCount}편 기록됨)` : '';
            rebibleItems.push(`- [${v.bookTitle || '지혜의 서'} ${v.chapterNumber || 1}:${v.verseNumber || 1} "${v.title}"] "${v.insight}" (사실/배경: ${v.fact?.slice(0, 80)}...)${annotText}`);
          });
        }
      }
    } catch (_) {}
    if (rebibleItems.length > 0) {
      sections.push(`📜 [리바이블(Re:Bible) 인생 경전 서재 & 루시의 관점 지혜 구절]\n${rebibleItems.join('\n')}`);
    }

    // --- 루시 채팅 대화 요약 (루시→오브 역방향 컨텍스트) ---
    try {
      const lucySummary = getLucyChatSummary();
      if (lucySummary && (Date.now() - lucySummary.timestamp < 24 * 60 * 60 * 1000)) {
        const timeStr = new Date(lucySummary.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        sections.push(`💬 [루시와의 최근 대화 요약 (${timeStr} 기준)]\n${lucySummary.summary}`);
      }
    } catch (_) {}

    // --- 최근 수행된 실시간 기능 활동 피드 (최신 10건) ---
    try {
      const rawHistory = localStorage.getItem(STORAGE_KEY);
      if (rawHistory) {
        const history: PrismFeatureEntry[] = JSON.parse(rawHistory);
        if (Array.isArray(history) && history.length > 0) {
          const recentList = history.slice(0, 10).map((h) => {
            const timeStr = new Date(h.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            return `• [${timeStr}] [${h.appName}] ${h.featureName}: ${h.summary}`;
          });
          sections.push(`⏱️ [최근 수행된 실시간 프리즘 활동 피드]\n${recentList.join('\n')}`);
        }
      }
    } catch (_) {}

    if (sections.length === 0) {
      return '';
    }

    return `\n\n==================================================================
[⚡ PRISM 에코시스템 일일 활동 메모리 (참고용 배경 지식)]
루시(Lucy), 아래는 사용자가 오늘 프리즘 내의 다른 댑/기능에서 수행한 일일 활동 기록 및 지표 요약이야.

${sections.join('\n\n')}

[💡 에코시스템 기억 활용 필수 원칙]:
1. [최우선 집중]: 사용자가 '지금 막 보낸 최신 메시지/질문'의 의도와 맥락을 최우선으로 파악하여 직접적이고 명쾌하게 답변해.
2. [과거 집착 금지]: 사용자가 이전 대화나 특정 과거 기록을 묻지 않았는데도, 위 배경 데이터를 장황하게 나열하거나 지난 활동 이야기로 대화 흐름을 가로채지 마.
3. [자연스러운 연계]: 위 데이터는 사용자가 직접 묻거나("아까 타로 결과 어때?", "오늘 오라클 뭐였지?") 현재 대화 맥락과 긴밀히 연결될 때만 1~2문장으로 다정하게 녹여내.
4. [어조 (반말 100% 절대 고정)]: 루시(Lucy)는 어떠한 상황에서도 예외 없이 다정하고 따뜻한 100% 반말 구어체(~야, ~어, ~했어, ~지, ~네, ~잖아, ~자, ~해 등)만을 일관되게 유지해. 존댓말 혼용 절대 금지.
==================================================================\n`;
  } catch (err) {
    console.warn('[buildPrismOmniscientContext] Error building context:', err);
    return '';
  }
}
