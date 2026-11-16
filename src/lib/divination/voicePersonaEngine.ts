/**
 * =========================================================================
 * LUCKEY 스피치 & 커뮤니케이션 페르소나 엔진 (Voice Persona Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리의 식상(식신·상관의 표현력과 생산성)의 위력, 일간의 오행적 기질,
 * 서양 점성술의 수성(Mercury: 지성·논리·소통) 및 3하우스(화법)를 융합하여
 * 사용자의 독점적 화법 페르소나, 상황별 스피치 치트키, 그리고 언어 설득력
 * 마스터리 지수(0~100)를 결정론적 수리로 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const VOICE_PERSONA_VERSION = 'LUCKEY-VOICE-v2.1.0';

function formatVoicePersonaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type VoicePersonaType = 'sharp_innovator' | 'artisan_mentor' | 'strategic_commander' | 'visionary_catalyst';

export interface VoicePersonaDetail {
  type: VoicePersonaType;
  title: string;
  hanja: string;
  coreVibe: string;              // 목소리와 어투에서 풍기는 고유한 아우라
  persuasionSuperpower: string;  // 상대를 설득하는 가장 강력한 무기
  speakingFormula: string;       // 신뢰를 200% 끌어올리는 말하기 공식
  pitfallToAvoid: string;        // 실수하기 쉬운 소통의 맹점
}

export const VOICE_PERSONAS: Record<VoicePersonaType, VoicePersonaDetail> = {
  sharp_innovator: {
    type: 'sharp_innovator',
    title: '본질 관통형 혁신가 (상관격·수은적 지성)',
    hanja: '傷官破竹型',
    coreVibe: '군더더기 없이 명쾌하며, 허례허식을 걷어내고 문제의 정곡을 단번에 찌르는 날카로운 지성미',
    persuasionSuperpower: '복잡한 상황을 3줄 요약으로 단순화하고, 기존 방식의 모순을 논리적으로 타파하는 압도적 명쾌함',
    speakingFormula: '【결론(Why) ➔ 핵심 데이터(Proof) ➔ 구체적 조치(Action)】 3단 압축 화법',
    pitfallToAvoid: '상대의 느린 이해나 감정적 서사를 답답해하여 말이 차가워지거나 방어심을 자극할 수 있음'
  },
  artisan_mentor: {
    type: 'artisan_mentor',
    title: '신뢰 구축형 장인 멘토 (식신생재·대지적 안정감)',
    hanja: '食神生財型',
    coreVibe: '차분하고 묵직하며, 깊은 전문 지식을 누구나 이해할 수 있게 차근차근 풀어주는 온화한 권위',
    persuasionSuperpower: '실제 경험과 디테일한 사례를 엮어내어 상대방이 스스로 고개를 끄덕이게 만드는 깊은 신뢰감',
    speakingFormula: '【상대 공감 ➔ 실제 사례/원리 ➔ 상생적 대안 제시】 포용형 스토리텔링',
    pitfallToAvoid: '설명이 지나치게 꼼꼼해져 핵심 결론이 뒤로 밀리거나 결정적 승부처에서 속도감이 떨어질 수 있음'
  },
  strategic_commander: {
    type: 'strategic_commander',
    title: '철벽의 전략 사령관 (관인상생·강철의 카리스마)',
    hanja: '官印相生型',
    coreVibe: '흔들림 없는 무게감과 원칙, 조직과 프로젝트 전체를 조망하는 서늘하고 확고한 리더십',
    persuasionSuperpower: '전체 판세와 리스크 대비책을 한눈에 제시하여 상대가 안심하고 따르게 만드는 구조적 설득력',
    speakingFormula: '【거시적 목표 ➔ 3대 원칙 ➔ 역할과 책임(R&R) 명시】 지휘관형 가이드',
    pitfallToAvoid: '감정적 지지나 캐주얼한 스몰톡을 생략하여 상대에게 거리감이나 위압감을 줄 수 있음'
  },
  visionary_catalyst: {
    type: 'visionary_catalyst',
    title: '영감 폭발형 비저너리 (목화통명·불꽃의 전도사)',
    hanja: '木火通明型',
    coreVibe: '에너지가 넘치고 영감을 주며, 미래의 가능성과 비전으로 사람들의 심장을 뛰게 만드는 흡인력',
    persuasionSuperpower: '보이지 않는 미래의 그림을 눈앞에 생생하게 그려내어 사람들의 가슴에 열정을 지피는 스토리',
    speakingFormula: '【우리가 풀려는 거대한 문제 ➔ 새로운 세상의 비전 ➔ 함께 만드는 미래】 비전 피칭',
    pitfallToAvoid: '아이디어의 디테일한 실행 로드맵이나 현실적 자원 제약을 간과하여 공수표로 비칠 위험'
  }
};

export interface ContextSpeechCheatsheet {
  negotiation: string;    // 협상·계약 상황에서의 치트키
  presentation: string;   // 발표·투자 유치 상황에서의 치트키
  conflictMediation: string; // 갈등 중재 상황에서의 치트키
  oneOnOne: string;       // 1:1 깊은 대화 상황에서의 치트키
}

export interface VoicePersonaResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  // 1순위 화법 페르소나
  persona: VoicePersonaDetail;

  // 언어 설득력 마스터리 지수 (0~100)
  persuasionScore: number;
  persuasionRankTitle: string;

  // 상황별 실전 스피치 치트키
  cheatsheet: ContextSpeechCheatsheet;

  // 대화 에너지 보완 팁 (오행 밸런스 기반)
  conversationalBalanceTip: string;

  summary: string;
  voiceSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

/**
 * 스피치 & 커뮤니케이션 페르소나 연산 메인 함수
 */
export function calculateVoicePersona(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): VoicePersonaResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  const structures = saju.specialStructures.map(s => s.name);
  const elements = saju.elements.counts;
  const dayGan = saju.pillars.day.gan;

  // 1. 화법 페르소나 타입 결정
  let personaType: VoicePersonaType = 'sharp_innovator';

  const hasSangGwan = structures.some(s => s.includes('상관')) || (dayGan === '庚' && saju.pillars.day.zhi === '戌');
  const hasSikShin = structures.some(s => s.includes('식신'));
  const hasGwanIn = structures.some(s => s.includes('관') || s.includes('인'));

  if (hasSangGwan) {
    personaType = 'sharp_innovator';
  } else if (hasSikShin) {
    personaType = 'artisan_mentor';
  } else if (hasGwanIn) {
    personaType = 'strategic_commander';
  } else if ((elements['화'] || 0) + (elements['목'] || 0) >= 3) {
    personaType = 'visionary_catalyst';
  } else {
    personaType = 'sharp_innovator';
  }

  const persona = VOICE_PERSONAS[personaType];

  // 2. 언어 설득력 지수 산출 (0~100)
  let persuasionScore = 80;
  if (hasSangGwan) persuasionScore += 10; // 논리적 명쾌함과 정곡 찌르기
  if (saju.pillars.day.gan === '庚' || saju.pillars.day.gan === '辛') persuasionScore += 5; // 금(金) 기운의 결단력
  if ((elements['수'] || 0) >= 2) persuasionScore += 4; // 수(水) 기운의 유연한 지혜
  persuasionScore = Math.min(99, persuasionScore);

  let persuasionRankTitle = '설득의 아키텍트 (Persuasion Architect)';
  if (persuasionScore >= 90) persuasionRankTitle = '절대적 설득의 마에스트로 (Persuasion Maestro)';
  else if (persuasionScore >= 80) persuasionRankTitle = '설득의 정밀 아키텍트 (Persuasion Architect)';
  else persuasionRankTitle = '신뢰의 커뮤니케이터 (Trust Communicator)';

  // 3. 상황별 스피치 치트키
  const cheatsheet: ContextSpeechCheatsheet = {
    negotiation: '조건을 밀고 당기기 전에 "우리가 합의했을 때 얻게 될 공통의 결과"를 먼저 확정 짓고 세부 수치로 들어가기',
    presentation: '도입부 30초 안에 결론과 핵심 가치를 못 박고, 슬라이드마다 단 하나의 명확한 메시지만 남기기',
    conflictMediation: '감정적 공방에 휘말리지 말고 "사실(Fact)"과 "해석(Opinion)"을 선명하게 분리하여 화이트보드에 적기',
    oneOnOne: '상대의 말을 끊지 않고 끝까지 경청한 뒤, 상대의 마지막 단어를 미러링하며 핵심 의도를 되짚어주기'
  };

  // 4. 대화 보완 팁
  const conversationalBalanceTip = (elements['화'] || 0) < 1
    ? '말에 따뜻한 온기와 눈빛을 2초만 더 머금으면, 상대방은 당신의 날카로운 지성을 비판이 아닌 진심 어린 조언으로 받아들입니다.'
    : '논리의 칼날 뒤에 부드러운 유머 한 스푼을 섞으면 상대의 마음의 문이 완전히 무장해제됩니다.';

  const calculatedAtKst = formatVoicePersonaKstTimestamp(now);
  const q = (params?.question || '').trim();
  const voiceSynthesisMatrix = {
    dominantTension: `${persona.title} ↔ ${persona.pitfallToAvoid.slice(0, 28)}`,
    alignmentState: `${persuasionRankTitle} · ${persona.hanja}`,
    integratedAction: `${persona.speakingFormula}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const interpretiveBoundary = '본 스피치·커뮤니케이션 페르소나 리포트는 명리 식상 및 기질 수리에 기반한 화법 성찰 가이드이며, 심리·임상 평가나 절대적 성과 보증이 아닙니다.';

  const summary = `[커뮤니케이션 페르소나] 타입: ${persona.title}. ` +
    `설득력 위상: ${persuasionRankTitle}. ` +
    `핵심 공식: ${persona.speakingFormula}. 주의점: ${persona.pitfallToAvoid.slice(0, 30)}...`;

  return {
    engineVersion: VOICE_PERSONA_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    persona,
    persuasionScore,
    persuasionRankTitle,
    cheatsheet,
    conversationalBalanceTip,
    summary,
    voiceSynthesisMatrix,
    interpretiveBoundary,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatVoicePersonaPrompt(res: VoicePersonaResult): string {
  const matrixLine = res.voiceSynthesisMatrix
    ? `\n- 스피치 교차 매트릭스: 핵심 긴장(${res.voiceSynthesisMatrix.dominantTension}) · 조율 상태(${res.voiceSynthesisMatrix.alignmentState}) · 통합 실천(${res.voiceSynthesisMatrix.integratedAction})`
    : '';
  return `[스피치 & 커뮤니케이션 페르소나 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]
- 1순위 화법 페르소나: **${res.persona.title}** [${res.persona.hanja}]
  • 고유 아우라: ${res.persona.coreVibe}
  • 설득 슈퍼파워: ${res.persona.persuasionSuperpower}
  • 말하기 절대 공식: **${res.persona.speakingFormula}**
  • 주의할 대화 맹점: ${res.persona.pitfallToAvoid}
- 언어 설득력 위상: **${res.persuasionRankTitle}**
- 실전 스피치 치트키:
  • 협상/계약: ${res.cheatsheet.negotiation}
  • 발표/피칭: ${res.cheatsheet.presentation}
  • 갈등 중재: ${res.cheatsheet.conflictMediation}
  • 1:1 대화: ${res.cheatsheet.oneOnOne}
- 에너지 보완 팁: ${res.conversationalBalanceTip}${matrixLine}
- 해석 경계: ${res.interpretiveBoundary}
※ 루시 지침: 말은 단순한 의사전달이 아니라 현실을 빚어내는 강력한 창조의 도구입니다. 사용자가 자신의 독보적인 화법 강점(본질 관통, 명쾌한 논리)을 십분 발휘하면서도, 상대방의 마음을 부드럽게 무장해제시키는 실전 대화 기술을 자신감 있게 발휘할 수 있도록 북돋워 주세요.`;
}
