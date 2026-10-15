/**
 * Prism Ecosystem - Cross-App Interconnected 'Toss' Pipeline
 * 오라클, 뮤즈, 블루버드, 에필로그 간의 영감 및 상태를 유기적으로 전달하는 '토스(Toss)' 엔진
 */

import type { PersonaDialogueContext } from './prismPersonaSync';

export type TossSourceApp = 'oracle' | 'muse' | 'bluebird' | 'epilogue' | 'heal' | 'lucy' | 'orange' | 'aura' | 'trinity' | 'hub' | (string & {});
export type TossTargetApp = 'muse' | 'bluebird' | 'epilogue' | 'heal' | 'oracle' | 'orange' | 'hoponopono' | (string & {});
export type TossActionType = 'art_prescription' | 'cleansing' | 'journal_prompt' | 'meditation' | 'smart_toss' | (string & {});

export interface TossCardInfo {
  id: string;
  name: string;
  nameKo: string;
  keywords: string[];
  cardName?: string;
  keyword?: string;
  cardIndex?: number;
  description?: string;
}

export interface PrismTossPayload {
  sourceApp: TossSourceApp;
  targetApp: TossTargetApp;
  actionType: TossActionType;
  cards?: TossCardInfo[];
  anchorArtworkTitle?: string;
  anchorArtworkCatalogId?: string;
  anchorArtQuote?: string;
  contextMessage?: string;
  autoTrigger?: boolean;
  autoPrompt?: string;
  personaDialogue?: PersonaDialogueContext | null;
  orbInsight?: {
    query?: string;
    keyTheme?: string;
    directAnswer?: string;
    actionSolution?: string;
    [key: string]: any;
  };
  tossedAt: number;
}

const STORAGE_TOSS_KEY = 'prism_active_toss_payload';

/**
 * 다른 앱으로 영감/데이터를 토스(Toss)하여 전송
 */
export function sendPrismToss(payload: PrismTossPayload): void {
  try {
    const raw = JSON.stringify(payload);
    sessionStorage.setItem(STORAGE_TOSS_KEY, raw);
    localStorage.setItem(STORAGE_TOSS_KEY, raw);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:toss_received', { detail: payload }));
    }
  } catch (e) {
    console.warn('[PrismToss] Failed to store toss payload:', e);
  }
}

/**
 * 타깃 앱에서 활성화된 토스 데이터 확인 및 수신
 */
export function getPendingPrismToss(targetApp: TossTargetApp): PrismTossPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_TOSS_KEY) || localStorage.getItem(STORAGE_TOSS_KEY);
    if (!raw) return null;
    const parsed: PrismTossPayload = JSON.parse(raw);
    if (parsed.targetApp === targetApp) {
      return parsed;
    }
  } catch (e) {
    console.warn('[PrismToss] Failed to parse toss payload:', e);
  }
  return null;
}

/**
 * 토스 모드 완료 또는 해제
 */
export function clearPrismToss(): void {
  try {
    sessionStorage.removeItem(STORAGE_TOSS_KEY);
    localStorage.removeItem(STORAGE_TOSS_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:toss_cleared'));
    }
  } catch (e) {
    console.warn('[PrismToss] Failed to clear toss payload:', e);
  }
}
