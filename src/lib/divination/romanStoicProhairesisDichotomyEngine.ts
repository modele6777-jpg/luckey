/**
 * 고대 로마 스토아학파 세네카·에픽테토스 아파테이아 & 프로하이레시스(Prohairesis) 통제이분법 엔진 (romanStoicProhairesisDichotomyEngine.ts)
 *
 * 고대 로마 스토아 철학의 거장 에픽테토스의 《엥케이리디온(Enchiridion)》, 마르쿠스 아우렐리우스의 《명상록(Meditations)》,
 * 그리고 세네카의 《인생의 짧음에 관하여(De Brevitate Vitae)》 원전 기반:
 * 내 통제권 안에 있는 것(내 생각, 충동, 열망, 혐오)과 내 통제권 밖의 것(몸, 재산, 평판, 타인의 행동, 외적 결과)을
 * 날카롭게 구분하는 '프로하이레시스(Prohairesis, 이성적 선택의지)'와 '통제 이분법(Dichotomy of Control)',
 * 어떤 운명의 폭풍우 속에서도 흔들리지 않는 영혼의 평정 '아파테이아(Apatheia)',
 * 주어진 모든 사건을 필연의 조화로 끌어안는 '아모르 파티(Amor Fati, 운명애)',
 * 그리고 유한한 시간 앞에서 본질에만 집중하게 하는 '메멘토 모리(Memento Mori)'를 산출하는 결정론적 행동 결단 엔진.
 *
 * 4대 스토아 카디널 덕목(Four Cardinal Stoic Virtues):
 * 1. 프로네시스(Phronesis / 지혜) - 통제 가능한 것과 불가능한 것을 명확히 가려내는 분별력
 * 2. 안드레이아(Andreia / 용기) - 외부의 위협과 고난 앞에서 마땅한 진실을 밀고 나가는 담대함
 * 3. 디카이오시네(Dikaiosyne / 정의) - 코스모폴리탄(세계시민)의 관점에서 타인과 공동체에 공정함을 베풂
 * 4. 소프로시네(Sophrosyne / 절제) - 헛된 격정과 충동을 다스려 이성의 고요한 지배권을 유지함
 */

import type { UserProfile } from '../sharedState';

export const ROMAN_STOIC_PROHAIRESIS_ENGINE_VERSION = '2.1.0';

export interface StoicVirtue {
  id: string;
  nameKo: string;
  greek: string;
  principle: string;
  prescription: string;
  affinityScore: number; // 0 ~ 100
}

export interface RomanStoicProhairesisReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  internalControlFocusScore: number; // 0 ~ 100 통제 가능한 내면 집중도
  externalSurrenderScore: number; // 0 ~ 100 통제 불가능한 외면 초연도
  amorFatiScore: number; // 0 ~ 100 아모르 파티(운명애) 지수
  apatheiaInnerPeaceScore: number; // 0 ~ 100 아파테이아(부동심) 평정 지수
  dominantVirtue: StoicVirtue; // 지배 스토아 덕목
  secondaryVirtue: StoicVirtue; // 보조 스토아 덕목
  mementoMoriPerspective: string; // 메멘토 모리 본질 통찰
  prohairesisActionGuidance: string; // 프로하이레시스 결단 실천 지침
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  stoicSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatStoicProhairesisKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function buildStoicReflectiveQuestion(virtue: StoicVirtue, contextText: string): string {
  const focus = contextText.trim();
  if (focus) {
    return `'${focus}'를 마주하며 ${virtue.nameKo}을 기준으로 삼을 때, 내 통제 밖의 결과는 놓아두고 지금 온전히 내가 선택할 행동 한 가지는 무엇인가요?`;
  }
  return `${virtue.nameKo}의 관점에서 볼 때, 오늘 내 에너지를 갉아먹지만 사실 내 소관이 아닌 걱정 한 가지는 무엇인가요?`;
}

function describeStoicProhairesisStage(score: number): string {
  if (score >= 84) return '아파테이아 부동심(Apatheia Serenity) — 외적 변수를 초연하게 수용하고 내면의 이성적 선택의지가 명료한 상태';
  if (score >= 70) return '프로하이레시스 정련(Prohairesis Focus) — 통제 가능한 행동과 태도에 중심을 모아 흔들림을 줄이는 상태';
  return '통제 이분법 자각(Dichotomy Awakening) — 내 소관 밖의 불안을 내려놓고 지금의 판단을 고르는 상태';
}

const STOIC_VIRTUES_BASE: Omit<StoicVirtue, 'affinityScore'>[] = [
  {
    id: 'phronesis',
    nameKo: '실천적 지혜 (프로네시스)',
    greek: 'Phronēsis',
    principle: '내 소관인 내 판단과 행동에만 전념하고, 바꿀 수 없는 외적 결과에 대한 번민을 내려놓는 지혜',
    prescription: '상황을 바꿀 수 없다면 그 상황을 바라보는 내 해석과 반응을 바꾸십시오. 그것만이 온전히 나의 것입니다.',
  },
  {
    id: 'andreia',
    nameKo: '불요불굴의 용기 (안드레이아)',
    greek: 'Andreia',
    principle: '실패에 대한 두려움과 타인의 시선을 털어내고, 원칙에 부합하는 옳은 결단을 흔들림 없이 실행함',
    prescription: '어려움이 앞을 가로막는 것이 아니라, 어려움 자체가 도약의 발판이자 성장의 재료입니다.',
  },
  {
    id: 'dikaiosyne',
    nameKo: '공정과 상생의 정의 (디카이오시네)',
    greek: 'Dikaiosynē',
    principle: '편협한 이기심을 넘어 전체의 조화와 상생을 염두에 두고 타인에게 정직하고 공평하게 처신함',
    prescription: '벌집에 해로운 것은 한 마리 꿀벌에게도 결코 유익하지 않습니다. 공동체의 선을 기준으로 행동하십시오.',
  },
  {
    id: 'sophrosyne',
    nameKo: '이성적 절제 (소프로시네)',
    greek: 'Sōphrosynē',
    principle: '과열된 욕망과 순간적 조급함을 진정시키고, 감정의 파도 밑바닥에 자리한 이성의 중심을 지킴',
    prescription: '충동에 즉각 반응하지 말고 한 호흡의 공간을 두십시오. 잠시의 멈춤이 영원한 품격을 만듭니다.',
  },
];

export interface RomanStoicProhairesisOptions {
  profile?: UserProfile | null;
  question?: string;
  contextText?: string;
  now?: Date;
  targetDate?: Date;
}

export function calculateRomanStoicProhairesis(
  options?: RomanStoicProhairesisOptions
): RomanStoicProhairesisReport {
  const profile = options?.profile;
  const contextText = options?.question || options?.contextText || '';
  const now = options?.now || options?.targetDate || new Date();

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '';

  let seed = 71;
  if (bdate) {
    const digits = bdate.replace(/\D/g, '');
    for (let i = 0; i < digits.length; i++) {
      seed = (seed * 31 + Number(digits[i])) % 10007;
    }
  }
  if (btime) {
    const tDigits = btime.replace(/\D/g, '');
    for (let i = 0; i < tDigits.length; i++) {
      seed = (seed * 19 + Number(tDigits[i])) % 10007;
    }
  }
  if (contextText) {
    for (let i = 0; i < contextText.length; i++) {
      seed = (seed * 17 + contextText.charCodeAt(i)) % 10007;
    }
  }
  const dayFactor = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  seed = (seed * 13 + (dayFactor % 1000)) % 10007;

  const internalControlFocusScore = 55 + (seed % 43); // 55 ~ 97
  const externalSurrenderScore = 52 + ((seed * 7) % 46); // 52 ~ 97
  const amorFatiScore = 58 + ((seed * 11) % 41); // 58 ~ 98
  const apatheiaInnerPeaceScore = 54 + ((seed * 13) % 44); // 54 ~ 97

  const virtueScores = STOIC_VIRTUES_BASE.map((v, idx) => {
    const virtSeed = (seed + idx * 233) % 10007;
    const score = 50 + (virtSeed % 48);
    return { ...v, affinityScore: score };
  });

  virtueScores.sort((a, b) => b.affinityScore - a.affinityScore);
  const dominantVirtue = virtueScores[0];
  const secondaryVirtue = virtueScores[1];

  let mementoMoriPerspective: string;
  const mmMod = seed % 3;
  if (mmMod === 0) {
    mementoMoriPerspective = '인생의 유한함을 명징하게 자각할 때, 타인의 인정이나 사소한 시비는 모래알처럼 흩어지고 오직 지금 행해야 할 진실한 본질만 우뚝 서게 됩니다.';
  } else if (mmMod === 1) {
    mementoMoriPerspective = '우리가 잃을 수 있는 것은 오직 지금이라는 순간뿐입니다. 과거나 미래에 대한 미련을 접고, 현재 손에 쥔 시간에 온전한 이성의 빛을 비추십시오.';
  } else {
    mementoMoriPerspective = '마치 오늘이 삶의 마지막 장인 것처럼 행동하되, 그 행동 속에는 영원히 부끄러움이 없을 지혜와 침착함을 담아내십시오.';
  }

  let prohairesisActionGuidance: string;
  if (internalControlFocusScore >= 80) {
    prohairesisActionGuidance = `현재 상황에서 당신의 선택의지(${dominantVirtue.nameKo})는 최상의 명료함을 갖추고 있습니다. 외적 변수나 타인의 태도에 휘둘리지 말고, 내면의 원칙에 따라 정돈된 한 걸음을 단호히 내딛으십시오.`;
  } else if (externalSurrenderScore >= 75) {
    prohairesisActionGuidance = `바꿀 수 없는 외적 결과에 지나치게 마음을 쓰지 않는 초연함(${secondaryVirtue.nameKo})이 개운의 핵심입니다. 내가 할 수 있는 최선을 다한 뒤, 일어나는 모든 일은 기꺼이 포용(Amor Fati)하십시오.`;
  } else {
    prohairesisActionGuidance = `요동치는 생각의 물결을 한 발짝 뒤에서 관조하며 ${dominantVirtue.nameKo}의 덕목을 상기하십시오. 내면의 통제권을 회복할 때 평정과 승리가 함께 깃듭니다.`;
  }

  const calculatedAtKst = formatStoicProhairesisKstTimestamp(now);
  const reflectiveQuestion = buildStoicReflectiveQuestion(dominantVirtue, contextText);
  const interpretiveBoundary = '스토아 통제 이분법과 프로하이레시스 해석은 태도와 선택을 가다듬는 철학적 성찰 비유일 뿐, 미래 사건 예측이나 의학적·법률적 조언이 아닙니다.';
  const composite = Math.round(
    (internalControlFocusScore + externalSurrenderScore + amorFatiScore + apatheiaInnerPeaceScore) / 4
  );
  const stoicSynthesisMatrix = {
    dominantTension: `${dominantVirtue.nameKo} ↔ ${secondaryVirtue.nameKo}`,
    alignmentState: describeStoicProhairesisStage(composite),
    integratedAction: `${dominantVirtue.prescription}${contextText.trim() ? ` [질문 맥락: ${contextText.trim()}]` : ''}`,
  };

  return {
    engineVersion: ROMAN_STOIC_PROHAIRESIS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    internalControlFocusScore,
    externalSurrenderScore,
    amorFatiScore,
    apatheiaInnerPeaceScore,
    dominantVirtue,
    secondaryVirtue,
    mementoMoriPerspective,
    prohairesisActionGuidance,
    reflectiveQuestion,
    interpretiveBoundary,
    stoicSynthesisMatrix,
  };
}

export function formatRomanStoicProhairesisPrompt(
  report: RomanStoicProhairesisReport
): string {
  const composite = Math.round(
    (report.internalControlFocusScore + report.externalSurrenderScore + report.amorFatiScore + report.apatheiaInnerPeaceScore) / 4
  );
  const lines = [
    `### 🏛️ 고대 로마 스토아학파 세네카·에픽테토스 아파테이아 & 프로하이레시스 통제이분법 리포트`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진 버전: v${report.engineVersion}`,
    `- 통제 이분법 국면: ${describeStoicProhairesisStage(composite)}`,
    `- 핵심 스토아 덕목: ${report.dominantVirtue.nameKo} — ${report.dominantVirtue.principle}`,
    `- 보조 스토아 덕목: ${report.secondaryVirtue.nameKo} — ${report.secondaryVirtue.principle}`,
    `- 메멘토 모리 통찰: ${report.mementoMoriPerspective}`,
    `- 프로하이레시스 결단 지침: ${report.prohairesisActionGuidance}`,
    `- [AI 해석 지침]: 스토아 철학의 '통제 이분법'을 적용하여, 질문자가 바꿀 수 없는 외적 결과·타인의 반응에 얽매이지 않고 오직 자신의 온전한 통제 영역(선택·태도·실행)에 집중하여 부동심(Apatheia)을 얻도록 명쾌하고 품격 있게 조언하십시오.`,
  ];
  if (report.stoicSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.stoicSynthesisMatrix.dominantTension} | 조율 상태: ${report.stoicSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${report.stoicSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 성찰 질문: ${report.reflectiveQuestion}`,
    `- 해석 경계: ${report.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
