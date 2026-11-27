import { LUCY_MASTER_CHANNELS } from './lucyChatPageMode';

/** 루시 일반 채팅에 쓰는 7대 테마 채널 */
export type LucyTurnChannel = 'prologue' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse' | 'epilogue';

/**
 * 한 턴의 모드
 * - casual: 인사·잡담처럼 도구를 쓰지 않는 턴
 * - companion: 일반 루시 채팅 — 기초 도구는 쓰지 않고 엔진함의 심층 관점만 골라 쓴다
 * - master: 점술모드 — 기초 도구 15종 + 심층 관점을 질문에 맞춰 골라 쓴다
 */
export type LucyTurnMode = 'casual' | 'companion' | 'master';

export interface LucyPageTurnPlan {
  mode: LucyTurnMode;
  channels: LucyTurnChannel[];
  isMaster: boolean;
  isCasual: boolean;
  requireBasicAndDeep: boolean;
  /** 일반 채팅: 기초 도구 없이 심층 관점만 절제해 쓴다 */
  deepPerspectivesOnly: boolean;
}

/**
 * 💬 루시 페이지의 한 턴 정책.
 * - 점술모드(마스터): 7대 채널 + 기초 도구 15종·심층 관점 자동 선택(requireBasicAndDeep = true)
 * - 일반 채팅: 채널·기초 도구 없이, 엔진함의 심층 관점만 질문에 맞춰 소수만 쓴다(deepPerspectivesOnly = true)
 */
export function resolveLucyPageTurn(masterMode: boolean): LucyPageTurnPlan {
  if (masterMode) {
    return {
      mode: 'master',
      channels: [...LUCY_MASTER_CHANNELS],
      isMaster: true,
      isCasual: false,
      requireBasicAndDeep: true,
      deepPerspectivesOnly: false,
    };
  }
  return {
    mode: 'companion',
    channels: [],
    isMaster: false,
    isCasual: true,
    requireBasicAndDeep: false,
    deepPerspectivesOnly: true,
  };
}

export interface LucyTurnEngineInput {
  persona: string;
  optionMode?: string;
  channelCount?: number;
  requireBasicAndDeep?: boolean;
  isMasterCall?: boolean;
  voiceTurn?: boolean;
}

/**
 * AppContext가 한 턴에 기초·심층 운명학 엔진을 돌릴지 판정한다.
 * - 음성 턴, 점술모드(isMasterCall), 도구 사용을 명시한 호출은 엔진을 가동한다.
 * - 일반 루시 채팅(수다모드)과 mode 'casual' 호출은 엔진을 돌리지 않는다.
 */
export function requiresBasicAndDeepForTurn(input: LucyTurnEngineInput): boolean {
  if (input.voiceTurn) return false;
  if (input.isMasterCall) return true;
  if (input.requireBasicAndDeep) return true;
  if (input.optionMode === 'casual') return false;
  if (input.persona === 'lucy' && (input.channelCount ?? 0) === 0) return false;
  return input.persona === 'lucy';
}
