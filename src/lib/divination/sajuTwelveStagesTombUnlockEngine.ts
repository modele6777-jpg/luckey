/**
 * =========================================================================
 * 🏛️ LUCKEY 사주 12운성 포태법 심층 생애주기 & 묘고지(墓庫地) 개고(開庫) 엔진
 * (Saju Twelve Stages & Four Tomb Storages Unlock Master Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 명리학의 핵심 원리인 12운성(포태법: 절·태·양·장생·목욕·관대·건록·제왕·쇠·병·사·묘)을 통해
 * 영혼의 기운이 잉태되고(태), 번영하며(건록/제왕), 창고에 보관되는(묘) 생애 주기를 정밀 분석합니다.
 * 특히 진·술·축·미(辰·戌·丑·未) 4대 묘고지(墓庫地)에 잠든 재고(재물창고), 관고(명예창고),
 * 인고(문서/지혜창고)를 형충(刑沖)으로 열어젖히는 '개고(開庫) 타이밍'과 폭발적 잠재력 해방을 진단합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult,
  STEM_ELEMENT,
} from '../sajuAnalysis';

export const SAJU_12STAGES_TOMB_VERSION = 'LUCKEY-SAJU-12STAGES-TOMB-v2.1.0';

export interface TwelveStagePillarVitality {
  pillarName: '년주 (근본)' | '월주 (사회)' | '일주 (본원)' | '시주 (결실)';
  ganZhi: string;
  stageName: string;
  vitalityScore: number; // 0 ~ 100
  lifecyclePhase: string; // 번영기, 수렴기, 잠복기, 도약기
  spiritualSignificance: string;
}

export interface TombStorageAnalysis {
  branchHanja: '辰' | '戌' | '丑' | '未';
  branchKorean: '진' | '술' | '축' | '미';
  storageType: '재고 (財庫: 재물과 자산 창고)' | '관고 (官庫: 권력과 명예 창고)' | '인고 (印庫: 문서와 지혜 창고)' | '식상고 (食傷庫: 재능과 표현 창고)';
  lockedTreasures: string; // 저장된 핵심 십신 및 오행
  isUnlocked: boolean; // 원국 내 충(沖)이나 형(刑)으로 이미 열렸는지 여부
  unlockCondition: string; // 개고를 촉발하는 세운/대운 글자 (진술충, 축미충 등)
  breakthroughPotentialScore: number; // 잠재력 폭발 지수 (0 ~ 100)
}

export interface SajuTwelveStagesTombReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  dayMasterArchetype: string;
  pillarsVitality: TwelveStagePillarVitality[];
  peakVitalityStage: string; // 사주 원국 내 가장 왕성한 운성
  tombStorages: TombStorageAnalysis[];
  hasTombStorage: boolean;
  tombKeyActionGuidance: string; // 묘고지 잠재력을 깨우는 1순위 행동
  annual2026TombInteraction: string; // 2026 병오년과의 개고/자극 반응
  synthesisPromptGuidance: string;
  tombSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatTombKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

// 12운성 기본 에너지 점수 및 라이프사이클 정의
const STAGE_ENERGY_MAP: Record<string, { score: number; phase: string; meaning: string }> = {
  장생: { score: 90, phase: '새로운 탄생과 순수한 성장기', meaning: '후원자의 도움과 귀인 복, 무궁무진한 시작의 추진력' },
  목욕: { score: 75, phase: '매력 발산과 예술적 표현기', meaning: '주목받는 인기, 감수성과 예술적 끼, 호기심과 변화' },
  관대: { score: 85, phase: '패기와 당당한 사회 입문기', meaning: '저돌적인 돌파력, 자존심과 승부욕, 시험과 합격의 기운' },
  건록: { score: 95, phase: '자수성가와 왕성한 성취기', meaning: '독립심과 실력, 흔들리지 않는 뿌리와 안정된 번영' },
  제왕: { score: 100, phase: '인생 최고의 전성기와 정점', meaning: '강렬한 리더십, 최고의 권력과 추진력, 타협 없는 카리스마' },
  쇠: { score: 80, phase: '노련한 지혜와 안정적 수성기', meaning: '원숙한 경험, 리스크 관리와 신중한 판단력' },
  병: { score: 65, phase: '섬세한 감수성과 직관 심화기', meaning: '공감 능력과 심리 통찰, 예술적 영감과 내면 성찰' },
  사: { score: 70, phase: '정신적 명징함과 깊은 탐구기', meaning: '학문과 연구, 고도의 집중력과 영적 직관력' },
  묘: { score: 75, phase: '내실 있는 축적과 비밀 창고기', meaning: '알짜배기 재물 축적, 깊은 잠재력과 저장 능력' },
  절: { score: 60, phase: '과거와의 단절과 무한한 가능성', meaning: '환골탈태의 전환점, 제로 베이스에서 시작하는 순수성' },
  태: { score: 70, phase: '새로운 씨앗의 잉태와 희망', meaning: '평화와 온화함, 미래를 향한 아이디어와 기획력' },
  양: { score: 80, phase: '안정적인 양육과 준비의 시기', meaning: '신뢰와 포용력, 꾸준한 기반 다지기와 상속 복' },
};

export function calculateSajuTwelveStagesTomb(
  profile?: UserProfile,
  targetDate: Date = new Date()
): SajuTwelveStagesTombReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const pillars = sajuRes?.pillars;
  const dayMaster = sajuRes?.dayMaster;
  const dayGan = dayMaster?.gan || '경';

  // 1. 각 기둥별 12운성 활력 분석
  const pillarsList: Array<{ name: '년주 (근본)' | '월주 (사회)' | '일주 (본원)' | '시주 (결실)'; pillar: any }> = [
    { name: '시주 (결실)', pillar: pillars?.hour },
    { name: '일주 (본원)', pillar: pillars?.day },
    { name: '월주 (사회)', pillar: pillars?.month },
    { name: '년주 (근본)', pillar: pillars?.year },
  ];

  const pillarsVitality: TwelveStagePillarVitality[] = pillarsList.map((item) => {
    if (!item.pillar) {
      return {
        pillarName: item.name,
        ganZhi: '시간 미정',
        stageName: '미정',
        vitalityScore: 70,
        lifecyclePhase: '미정',
        spiritualSignificance: '태어난 시간 입력 시 정밀 계산됩니다.',
      };
    }

    const stage = item.pillar.twelveStage || '건록';
    const meta = STAGE_ENERGY_MAP[stage] || STAGE_ENERGY_MAP.건록;

    return {
      pillarName: item.name,
      ganZhi: `${item.pillar.gan}${item.pillar.zhi}`,
      stageName: stage,
      vitalityScore: meta.score,
      lifecyclePhase: meta.phase,
      spiritualSignificance: meta.meaning,
    };
  });

  // 최고 활력 운성 추출
  const sorted = [...pillarsVitality].sort((a, b) => b.vitalityScore - a.vitalityScore);
  const peakVitalityStage = sorted[0]?.stageName || '건록';

  // 2. 4대 묘고지(辰·戌·丑·未) 검출 및 개고(開庫) 진단
  const tombStorages: TombStorageAnalysis[] = [];
  const allZhis = [
    pillars?.year?.zhi,
    pillars?.month?.zhi,
    pillars?.day?.zhi,
    pillars?.hour?.zhi,
  ].filter(Boolean);

  const hasChen = allZhis.includes('辰');
  const hasXu = allZhis.includes('戌');
  const hasChou = allZhis.includes('丑');
  const hasWei = allZhis.includes('未');

  // 진술충(辰戌沖), 축미충(丑未沖) 원국 내 보유 여부
  const hasChenXuClash = hasChen && hasXu;
  const hasChouWeiClash = hasChou && hasWei;

  const determineStorageType = (zhi: string, gan: string) => {
    // 일간 기준 십신 묘고 분류 (辰: 水고, 戌: 火고, 丑: 金고, 未: 木고)
    // 예: 庚/辛(금)에게 辰(수고)은 식상고, 戌(화고)은 관고, 丑(금고)은 비겁고, 未(목고)은 재고
    const el = STEM_ELEMENT[gan] || '금';
    if (zhi === '未') { // 木고
      if (['토'].includes(el)) return '관고 (官庫: 권력과 명예 창고)';
      if (['금'].includes(el)) return '재고 (財庫: 재물과 자산 창고)';
      if (['수'].includes(el)) return '식상고 (食傷庫: 재능과 표현 창고)';
      return '인고 (印庫: 문서와 지혜 창고)';
    }
    if (zhi === '戌') { // 火고
      if (['수'].includes(el)) return '재고 (財庫: 재물과 자산 창고)';
      if (['금'].includes(el)) return '관고 (官庫: 권력과 명예 창고)';
      if (['목'].includes(el)) return '식상고 (食傷庫: 재능과 표현 창고)';
      return '인고 (印庫: 문서와 지혜 창고)';
    }
    if (zhi === '丑') { // 金고
      if (['화'].includes(el)) return '재고 (財庫: 재물과 자산 창고)';
      if (['목'].includes(el)) return '관고 (官庫: 권력과 명예 창고)';
      if (['토'].includes(el)) return '식상고 (食傷庫: 재능과 표현 창고)';
      return '인고 (印庫: 문서와 지혜 창고)';
    }
    // 辰 (水고)
    if (['토'].includes(el)) return '재고 (財庫: 재물과 자산 창고)';
    if (['화'].includes(el)) return '관고 (官庫: 권력과 명예 창고)';
    if (['금'].includes(el)) return '식상고 (食傷庫: 재능과 표현 창고)';
    return '인고 (印庫: 문서와 지혜 창고)';
  };

  if (hasChen) {
    tombStorages.push({
      branchHanja: '辰',
      branchKorean: '진',
      storageType: determineStorageType('辰', dayGan),
      lockedTreasures: '수(水)의 보물창고: 유연한 자금력, 깊은 지혜와 시장 유통 감각',
      isUnlocked: hasChenXuClash,
      unlockCondition: '戌(술)의 운이 올 때 진술충(辰戌沖)으로 창고 문이 열림',
      breakthroughPotentialScore: hasChenXuClash ? 94 : 85,
    });
  }
  if (hasXu) {
    tombStorages.push({
      branchHanja: '戌',
      branchKorean: '술',
      storageType: determineStorageType('戌', dayGan),
      lockedTreasures: '화(火)의 보물창고: 강력한 브랜드 가치, 명예와 기술력, 인공지능/플랫폼',
      isUnlocked: hasChenXuClash,
      unlockCondition: '辰(진)의 운이 올 때 진술충(辰戌沖)으로 창고 문이 열림',
      breakthroughPotentialScore: hasChenXuClash ? 95 : 88,
    });
  }
  if (hasChou) {
    tombStorages.push({
      branchHanja: '丑',
      branchKorean: '축',
      storageType: determineStorageType('丑', dayGan),
      lockedTreasures: '금(金)의 보물창고: 견고한 알짜배기 금고, 정밀 특허, 결단력',
      isUnlocked: hasChouWeiClash,
      unlockCondition: '未(미)의 운이 올 때 축미충(丑未沖)으로 창고 문이 열림',
      breakthroughPotentialScore: hasChouWeiClash ? 92 : 82,
    });
  }
  if (hasWei) {
    tombStorages.push({
      branchHanja: '未',
      branchKorean: '미',
      storageType: determineStorageType('未', dayGan),
      lockedTreasures: '목(木)의 보물창고: 생명력 넘치는 콘텐츠, 창작 네트워크, 기획력',
      isUnlocked: hasChouWeiClash,
      unlockCondition: '丑(축)의 운이 올 때 축미충(丑未沖)으로 창고 문이 열림',
      breakthroughPotentialScore: hasChouWeiClash ? 93 : 84,
    });
  }

  const hasTombStorage = tombStorages.length > 0;

  // 3. 개고 가이드 및 2026 병오년 반응
  let tombKeyActionGuidance = '원국 내 묘고지가 없거나 잠재되어 있으므로, 꾸준한 루틴과 일상의 건록(실력)을 기르는 것이 최우선입니다.';
  if (hasTombStorage) {
    const primaryStorage = tombStorages[0];
    tombKeyActionGuidance = primaryStorage.isUnlocked
      ? `이미 원국 내에서 [${primaryStorage.storageType}]이 활성화되어 있습니다. 숨겨진 재능과 결단력을 과감히 세상에 펼쳐낼 때 폭발적 성과를 거둡니다.`
      : `내면에 깊이 잠든 [${primaryStorage.storageType}]가 있습니다. 평소에 전문성을 갈고닦아 창고 문이 열리는 기회의 타이밍에 한 번에 거두어들이는 전략이 필요합니다.`;
  }

  // 2026 병오년(丙午年) 반응: 午(오)화는 戌(술)과 오술(午戌) 반합, 未(미)와 오미(午未) 육합 형성
  let annual2026TombInteraction = '2026 병오년(丙午年)의 강력한 오화(午火)가 원국의 조화를 이끌며 안정적인 성장 기반을 형성합니다.';
  if (hasXu) {
    annual2026TombInteraction = '2026 병오년의 午(오)가 원국의 戌(술)과 만나 오술(午戌) 화국(火局)을 형성하여, 화(火)의 에너지와 명예·열정 창고가 크게 확장됩니다.';
  } else if (hasWei) {
    annual2026TombInteraction = '2026 병오년의 午(오)가 원국의 未(미)와 만나 오미(午未) 육합으로 조화로운 기운을 형성하며, 인연과 귀인의 도움이 따릅니다.';
  }

  const calculatedAtKst = formatTombKstTimestamp(targetDate);
  const tombSynthesisMatrix = {
    dominantTension: `최고 활력 ${peakVitalityStage} ↔ ${hasTombStorage ? tombStorages[0].storageType : '건록·제왕 순수 추구'}`,
    alignmentState: `${annual2026TombInteraction}`,
    integratedAction: tombKeyActionGuidance,
  };

  const interpretiveBoundary = '본 사주 12운성 포태법 & 묘고지 개고 리포트는 명리 원국 구조의 상징적 해석이며, 확정적 미래 예언이나 재무·투자 자문이 아닙니다.';

  const synthesisPromptGuidance = `
[사주 12운성 & 4대 묘고지(진·술·축·미) 개고 마스터 지능 | 연산 시각: ${calculatedAtKst}]:
- 최고 전성기 운성: "${peakVitalityStage}" (원국 내 기둥 활력 분포: ${pillarsVitality.map(p => `${p.pillarName}:${p.stageName}`).join(', ')})
- 보유 묘고지 현황: ${hasTombStorage ? tombStorages.map(t => `${t.branchKorean}(${t.storageType}, 개고여부:${t.isUnlocked ? '개방' : '잠금'})`).join(' / ') : '묘고지 미보유(순수 건록/제왕 추구형)'}
- 개고 돌파 행동 처방: "${tombKeyActionGuidance}"
- 2026 병오년 상호작용: "${annual2026TombInteraction}"
- 교차 매트릭스 [핵심 긴장: ${tombSynthesisMatrix.dominantTension} | 조율 상태: ${tombSynthesisMatrix.alignmentState}]
  * 통합 실천: ${tombSynthesisMatrix.integratedAction}
- 해석 경계: ${interpretiveBoundary}
내담자에게 "사주를 보니~"라는 진부한 서론 없이, 내면에 잠든 보물 창고(묘고지)와 지금 발휘해야 할 운성 에너지("${peakVitalityStage}")의 힘을 현실적 비유로 짚어줄 것.
`.trim();

  return {
    engineVersion: SAJU_12STAGES_TOMB_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    dayMasterArchetype: `${dayGan} (${dayMaster?.symbolName || '본원'})`,
    pillarsVitality,
    peakVitalityStage,
    tombStorages,
    hasTombStorage,
    tombKeyActionGuidance,
    annual2026TombInteraction,
    synthesisPromptGuidance,
    tombSynthesisMatrix,
    interpretiveBoundary,
  };
}

export function formatSajuTwelveStagesTombPrompt(report: SajuTwelveStagesTombReport): string {
  return report.synthesisPromptGuidance;
}
