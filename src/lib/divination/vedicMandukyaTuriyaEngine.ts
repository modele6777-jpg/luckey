/**
 * 고대 인도 만두키야 우파니샤드 4대 의식 상태 & 투리야(Turiya) 순수의식 엔진 (vedicMandukyaTuriyaEngine.ts)
 *
 * 힌두 베단타 철학의 정수인 《만두키야 우파니샤드(Mandukya Upanishad)》 및 가우다파다의 《만두키야 카리카(Mandukya Karika)》 원전 기반:
 * 우주의 근본 음률 '옴(AUM)'과 인간 의식의 4대 계위 체계.
 *
 * 4대 의식 상태(Four States of Consciousness):
 * 1. 자그라트(Jagrat / Vaishvanara) - 'A' 음률: 감각을 통해 외적 세계를 경험하는 물질계 각성 상태
 * 2. 스왑나(Swapna / Taijasa) - 'U' 음률: 내면의 인상과 상상력으로 미세계를 유영하는 꿈 상태
 * 3. 수숩티(Sushupti / Prajna) - 'M' 음률: 분별과 욕망이 멈추고 고요한 지복(Ananda)에 잠기는 깊은 숙면 상태
 * 4. 투리야(Turiya / Brahman) - 무음의 침묵(Amatra): 세 가지 상태를 온전히 비추는 불멸의 목격자(Sakshi)이자 순수 초월 의식
 *
 * 일상의 번잡함 속에서 불멸의 관조자 의식을 일깨우고,
 * 마야(Maya)의 환영을 벗어나 절대적 내면 평화와 진정한 자아(Atman)를 실현하는 초월적 엔진.
 */

import type { UserProfile } from '../sharedState';

export const VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION = '2.0.0';

function formatMandukyaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface MandukyaConsciousnessState {
  id: string;
  nameKo: string;
  sanskrit: string;
  aumLetter: string; // A, U, M, Amatra(침묵)
  realm: string; // 물질계, 미세계, 원인계, 초월계
  divinePrinciple: string;
  spiritualGift: string;
  resonanceScore: number; // 0 ~ 100 공명도
}

export interface VedicMandukyaTuriyaReport {
  engineVersion: string;
  calculatedAtKst: string;
  timestamp: string;
  turiyaPureConsciousnessScore: number; // 0 ~ 100 투리야 순수의식 각성도
  aumSyllableResonanceIndex: number; // 0 ~ 100 옴(AUM) 신성 파동 공명도
  sakshiWitnessPresenceScore: number; // 0 ~ 100 샥시(초연한 목격자) 현존 지수
  mayaIllusionDissolutionRate: number; // 0 ~ 100 마야 환영 투사 탈각율
  dominantState: MandukyaConsciousnessState; // 주재 의식 상태
  secondaryState: MandukyaConsciousnessState; // 보조 의식 상태
  mandukyaUpanishadGuidance: string; // 만두키야 우파니샤드 지혜 지침
  omPranavaMeditationRitual: string; // 옴 프라나바 침묵 명상 리추얼
  turiyaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const MANDUKYA_STATES_BASE: Omit<MandukyaConsciousnessState, 'resonanceScore'>[] = [
  {
    id: 'turiya',
    nameKo: '투리야 (제4의 순수의식)',
    sanskrit: 'Turiya',
    aumLetter: 'Amatra (무음의 침묵)',
    realm: '초월계 (Brahman / Atman)',
    divinePrinciple: '각성·꿈·숙면의 세 상태가 오고 감을 지켜보는 불변의 관조자이자 순수한 앎 그 자체',
    spiritualGift: '세상의 어떤 풍파나 감정의 소용돌이 속에서도 흔들리지 않는 절대적 평온과 자유',
  },
  {
    id: 'sushupti',
    nameKo: '수숩티 (숙면·지복체)',
    sanskrit: 'Sushupti (Prajna)',
    aumLetter: 'M (마카라)',
    realm: '원인계 (Causal Realm / Ananda)',
    divinePrinciple: '욕망도 두려움도 없는 텅 빈 고요 속에서 영혼이 근원의 에너지와 하나 되어 충전됨',
    spiritualGift: '지친 정신을 단번에 회복시키는 깊은 휴식과 집착이 씻겨나간 청정한 무욕의 지혜',
  },
  {
    id: 'swapna',
    nameKo: '스왑나 (꿈·미세체)',
    sanskrit: 'Swapna (Taijasa)',
    aumLetter: 'U (우카라)',
    realm: '미세계 (Subtle Realm / Tejas)',
    divinePrinciple: '물질의 제약을 벗어나 순수한 생각과 상상력으로 새로운 현실과 영감을 빚어내는 빛의 장',
    spiritualGift: '고정관념을 뛰어넘는 천재적 창의성, 직관적 예지력, 무의식의 상처를 치유하는 영적 유연함',
  },
  {
    id: 'jagrat',
    nameKo: '자그라트 (각성·물질체)',
    sanskrit: 'Jagrat (Vaishvanara)',
    aumLetter: 'A (아카라)',
    realm: '물질계 (Gross Realm / Sthula)',
    divinePrinciple: '오감을 활짝 열고 눈앞에 펼쳐진 현실 세계를 책임감 있게 마주하고 실행하는 현존력',
    spiritualGift: '아이디어를 현실 세계의 구체적 성취로 연결하는 강력한 접지력과 기민한 실행력',
  },
];

export interface VedicMandukyaTuriyaOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateVedicMandukyaTuriya(
  optionsOrProfile?: VedicMandukyaTuriyaOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): VedicMandukyaTuriyaReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as VedicMandukyaTuriyaOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 93117;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 47) % 1000003;

  const states: MandukyaConsciousnessState[] = MANDUKYA_STATES_BASE.map((st, idx) => {
    const score = 46 + ((seed * (idx + 3) + idx * 37) % 53);
    return { ...st, resonanceScore: Math.min(99, Math.max(39, score)) };
  });

  states.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantState = states[0];
  const secondaryState = states[1];

  const turiyaPureConsciousnessScore = Math.min(100, Math.max(45, 54 + ((seed * 23) % 44)));
  const aumSyllableResonanceIndex = Math.min(100, Math.max(44, 52 + ((seed * 29) % 46)));
  const sakshiWitnessPresenceScore = Math.min(100, Math.max(42, 50 + ((seed * 31) % 48)));
  const mayaIllusionDissolutionRate = Math.min(100, Math.max(40, 48 + ((seed * 17) % 49)));

  const mandukyaUpanishadGuidance = `당신은 몸도, 스쳐가는 감정도, 불안한 생각도 아닙니다. 그 모든 것을 바라보는 초연한 목격자(Sakshi)입니다. 지금 조명되는 상태는 [${dominantState.nameKo}]입니다. ${dominantState.spiritualGift}의 힘을 신뢰하십시오. 현상의 파도에 휩쓸리지 않고 깊은 바다의 침묵에 닻을 내릴 때입니다.`;
  const omPranavaMeditationRitual = `숨을 들이마시고 내쉬며 마음속으로 길게 'A-U-M...'을 울린 뒤, 음률이 멎은 고요한 침묵에 머무르십시오: "사르밤 칼비담 브라만(Sarvam Khalvidam Brahman) — 모든 것은 신성한 의식이며, 나는 영원한 순수 지각자이다."`;

  const calculatedAtKst = formatMandukyaKstTimestamp(now);
  const q = question.trim();
  const turiyaSynthesisMatrix = {
    dominantTension: `${dominantState.nameKo} ↔ ${secondaryState.nameKo}`,
    alignmentState: `${dominantState.aumLetter} · ${dominantState.realm}`,
    integratedAction: `${omPranavaMeditationRitual}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION,
    calculatedAtKst,
    timestamp: now.toISOString(),
    turiyaPureConsciousnessScore,
    aumSyllableResonanceIndex,
    sakshiWitnessPresenceScore,
    mayaIllusionDissolutionRate,
    dominantState,
    secondaryState,
    mandukyaUpanishadGuidance,
    omPranavaMeditationRitual,
    turiyaSynthesisMatrix,
  };
}

export function formatVedicMandukyaTuriyaPrompt(rep: VedicMandukyaTuriyaReport): string {
  const matrixLine = rep.turiyaSynthesisMatrix
    ? `\n· 투리야 의식 교차 매트릭스: 핵심 긴장(${rep.turiyaSynthesisMatrix.dominantTension}) · 조율 상태(${rep.turiyaSynthesisMatrix.alignmentState}) · 통합 실천(${rep.turiyaSynthesisMatrix.integratedAction})`
    : '';
  return `[고대 인도 만두키야 우파니샤드 4대 의식 & 투리야(Turiya) 순수의식 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | ${rep.calculatedAtKst}
· 주재 의식 상태: [${rep.dominantState.nameKo} (${rep.dominantState.sanskrit})]
  - 옴 음률 계위: ${rep.dominantState.aumLetter} | 영역: ${rep.dominantState.realm}
  - 신성 원리: ${rep.dominantState.divinePrinciple}
  - 영적 은사: ${rep.dominantState.spiritualGift}
· 보조 의식 상태: [${rep.secondaryState.nameKo} (${rep.secondaryState.sanskrit})]
· 만두키야 우파니샤드 지혜 지침: ${rep.mandukyaUpanishadGuidance}
· 옴 프라나바 침묵 명상 리추얼: ${rep.omPranavaMeditationRitual}${matrixLine}`;
}
