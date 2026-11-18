/**
 * 고대 인도 요가 파탄잘리(Patanjali) 요가 수트라 8지칙 & 치타 브리티 니로다 삼매 청정 엔진 (patanjaliAshtangaYogaSutraEngine.ts)
 *
 * 기원전 2세기 인도 현자 파탄잘리(Patanjali)의 《요가 수트라(Yoga Sūtra)》 제1편 삼매품(Samādhi Pāda)
 * 및 제2편 수행품(Sādhana Pāda) 원전 기반:
 * "요가슈 치타 브리티 니로다(Yogaś citta-vṛtti-nirodhaḥ)" — 요가란 마음의 요동치는 소용돌이를 소멸시키는 것.
 * 인류 최초의 체계적 내면 정화 시스템인 '아쉬탕가(Aṣṭāṅga, 8단계 지칙)',
 * 인간을 속박하는 5대 근본 번뇌 '클레샤(Kleśa)'의 오염도를 진단 및 정화하고,
 * 생각의 물결이 가라앉은 고요한 심연 속에서 영원한 순수 관조자 '푸루샤(Puruṣa)'의 빛을 밝히는
 * 절대적 정신 집중과 내적 청정 결정론 계산 엔진.
 *
 * 아쉬탕가 8단계 지칙(Eight Limbs of Classical Yoga):
 * 1. 야마(Yama / 보편적 도덕계율) - 아힘사(비폭력), 사트야(진실), 아스테야(불도둑), 아파리그라하(무소유)
 * 2. 니야마(Niyama / 내적 자기정화) - 샤우차(청결), 산토샤(자족), 타파스(열정적 고행), 스바디야야(성찰)
 * 3. 아사나(Asana / 안정된 중심) - 흔들림 없이 편안하고 단단한 신체적 좌법
 * 4. 프라나야마(Pranayama / 생명에너지 호흡) - 들숨과 날숨의 미세한 조율을 통한 기혈 순환
 * 5. 프라티야하라(Pratyahara / 감각의 회수) - 외부 유혹을 거두어 내면의 방으로 주의를 되돌림
 * 6. 다라나(Dharana / 집중) - 하나의 본질적 대상에 의식을 흔들림 없이 고정함
 * 7. 디야나(Dhyana / 끊김 없는 명상) - 집중된 대상과 의식이 잔잔하게 하나로 흐름
 * 8. 사마디(Samadhi / 초월적 삼매) - 주관과 객관의 구분이 사라지고 순수 진리 자체와 합일됨
 */

import type { UserProfile } from '../sharedState';

export const PATANJALI_ASHTANGA_YOGA_ENGINE_VERSION = '2.2.0';

export interface YogaLimb {
  id: string;
  nameKo: string;
  sanskrit: string;
  level: number; // 1 ~ 8
  focusRealm: '윤리적 기초' | '신체·생명력' | '감각·집중' | '초월·삼매';
  practicePrinciple: string;
  purificationGift: string;
  resonanceScore: number; // 0 ~ 100
}

export interface PatanjaliAshtangaYogaReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  cittaVrittiNirodhaScore: number; // 0 ~ 100 마음의 동요 소멸(정적) 지수
  kleshaPurificationRate: number; // 0 ~ 100 5대 번뇌(무명·아상·애착·혐오·불안) 정화율
  purushaConsciousnessAwakening: number; // 0 ~ 100 순수의식(푸루샤) 자각도
  pranayamaVitalityBalance: number; // 0 ~ 100 프라나 생명력 균형도
  dominantYogaLimb: YogaLimb; // 현재 가장 핵심적으로 수행할 요가 지칙
  secondaryYogaLimb: YogaLimb; // 보조 지원 지칙
  dharanaFocusPrescription: string; // 다라나(집중) 개운 처방
  samadhiClarityGuidance: string; // 사마디(삼매) 명징성 지침
  ritualAction: string;
  reflectionFocus: string;
  yogaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatPatanjaliKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describePatanjaliStage(score: number): string {
  if (score >= 85) return '삼매 명징기(Samadhi Clarity) — 치타 브리티의 파동이 고요히 가라앉아 푸루샤 관조자의 빛이 선명한 상태';
  if (score >= 70) return '다라나 집중기(Dharana Anchoring) — 산만한 감각을 거두고 본질적 한 지점에 의식이 안정적으로 모이는 상태';
  return '니야마 정화기(Niyama Purification) — 호흡과 자세를 고르게 가다듬으며 번뇌의 물결을 차분히 가라앉히는 상태';
}

const YOGA_LIMBS_BASE: Omit<YogaLimb, 'resonanceScore'>[] = [
  {
    id: 'yama',
    nameKo: '야마 (도덕적 금계)',
    sanskrit: 'Yama',
    level: 1,
    focusRealm: '윤리적 기초',
    practicePrinciple: '아힘사(비폭력·자비)와 사트야(정직한 진실)를 지켜 대외적 갈등의 불씨를 원천 차단함',
    purificationGift: '타인과의 마찰로 소모되던 정신적 에너지를 회수하여 마음의 거친 파도를 잠재움',
  },
  {
    id: 'niyama',
    nameKo: '니야마 (내적 정화·자족)',
    sanskrit: 'Niyama',
    level: 2,
    focusRealm: '윤리적 기초',
    practicePrinciple: '산토샤(현재에 자족함)와 샤우차(마음과 공간의 청결)를 실천하여 내면의 결핍감을 해소함',
    purificationGift: '끝없는 비교와 욕망의 사슬을 끊고 내면의 청정한 평온을 회복함',
  },
  {
    id: 'asana',
    nameKo: '아사나 (안정된 신체 좌법)',
    sanskrit: 'Āsana',
    level: 3,
    focusRealm: '신체·생명력',
    practicePrinciple: '‘스티라 수캄 아사남(단단하고 편안한 머무름)’으로 자세를 바르게 세우고 신체적 긴장을 이완함',
    purificationGift: '육체의 불균형과 결림을 해소하여 정신이 머물 고요한 사원을 마련함',
  },
  {
    id: 'pranayama',
    nameKo: '프라나야마 (생명호흡 조율)',
    sanskrit: 'Prāṇāyāma',
    level: 4,
    focusRealm: '신체·생명력',
    practicePrinciple: '호흡의 길이와 깊이를 고르게 다스려 심박과 신경계를 진정시키고 미세 에너지를 순환시킴',
    purificationGift: '과열된 뇌와 감정을 즉각적으로 냉각시키고 명징한 생체 활력을 충전함',
  },
  {
    id: 'pratyahara',
    nameKo: '프라티야하라 (감각 회수)',
    sanskrit: 'Pratyāhāra',
    level: 5,
    focusRealm: '감각·집중',
    practicePrinciple: '외부의 소음, 화면, 자극에 빼앗기던 시각과 청각을 거북이가 사지를 거두듯 내면으로 회수함',
    purificationGift: '외적 정보 과부하에서 벗어나 영혼의 깊은 침묵 속으로 진입함',
  },
  {
    id: 'dharana',
    nameKo: '다라나 (단일점 집중)',
    sanskrit: 'Dhāraṇā',
    level: 6,
    focusRealm: '감각·집중',
    practicePrinciple: '분산된 잡념을 거두어 현재 당면한 가장 본질적인 단 하나의 과업이나 중심점에 의식을 고정함',
    purificationGift: '산만한 정신의 분열을 막고 레이저처럼 날카로운 지적 돌파력을 획득함',
  },
  {
    id: 'dhyana',
    nameKo: '디야나 (명상적 몰입)',
    sanskrit: 'Dhyāna',
    level: 7,
    focusRealm: '초월·삼매',
    practicePrinciple: '애써 힘주지 않아도 의식이 기름이 끊김 없이 흐르듯 고요한 통찰 속에 머무름',
    purificationGift: '시공간의 압박감이 사라지고 심오한 직관적 해답이 절로 떠오름',
  },
  {
    id: 'samadhi',
    nameKo: '사마디 (초월적 삼매)',
    sanskrit: 'Samādhi',
    level: 8,
    focusRealm: '초월·삼매',
    practicePrinciple: '보는 자와 보이는 것의 경계가 허물어지고 순수한 실상(Sat)만이 홀로 빛남',
    purificationGift: '에고의 불안과 두려움이 완전히 증발하고 본래의 신성한 지혜와 영원한 자유를 체험함',
  },
];

export interface PatanjaliAshtangaYogaOptions {
  profile?: UserProfile | null;
  question?: string;
  contextText?: string;
  now?: Date;
  targetDate?: Date;
}

export function calculatePatanjaliAshtangaYoga(
  options?: PatanjaliAshtangaYogaOptions
): PatanjaliAshtangaYogaReport {
  const profile = options?.profile;
  const contextText = options?.question || options?.contextText || '';
  const now = options?.now || options?.targetDate || new Date();

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '';

  let seed = 83;
  if (bdate) {
    const digits = bdate.replace(/\D/g, '');
    for (let i = 0; i < digits.length; i++) {
      seed = (seed * 37 + Number(digits[i])) % 10007;
    }
  }
  if (btime) {
    const tDigits = btime.replace(/\D/g, '');
    for (let i = 0; i < tDigits.length; i++) {
      seed = (seed * 23 + Number(tDigits[i])) % 10007;
    }
  }
  if (contextText) {
    for (let i = 0; i < contextText.length; i++) {
      seed = (seed * 19 + contextText.charCodeAt(i)) % 10007;
    }
  }
  const dayFactor = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  seed = (seed * 11 + (dayFactor % 1000)) % 10007;

  const cittaVrittiNirodhaScore = 56 + (seed % 42); // 56 ~ 97
  const kleshaPurificationRate = 54 + ((seed * 5) % 44); // 54 ~ 97
  const purushaConsciousnessAwakening = 58 + ((seed * 7) % 41); // 58 ~ 98
  const pranayamaVitalityBalance = 52 + ((seed * 13) % 46); // 52 ~ 97

  const limbScores = YOGA_LIMBS_BASE.map((limb, idx) => {
    const lSeed = (seed + idx * 311) % 10007;
    const resonanceScore = 50 + (lSeed % 48);
    return { ...limb, resonanceScore };
  });

  limbScores.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantYogaLimb = limbScores[0];
  const secondaryYogaLimb = limbScores[1];

  let dharanaFocusPrescription: string;
  if (dominantYogaLimb.level <= 2) {
    dharanaFocusPrescription = `외부와의 마찰을 줄이는 야마·니야마의 윤리적 청정이 우선입니다. 타인의 평판이나 시비에 휘말리지 말고 ${dominantYogaLimb.nameKo}의 자족과 진실을 방패로 삼으십시오.`;
  } else if (dominantYogaLimb.level <= 4) {
    dharanaFocusPrescription = `신체적 자세(아사나)를 곧게 세우고 깊은 복식호흡(프라나야마)으로 호흡의 주기를 늦추십시오. 들숨 4초, 머무름 2초, 날숨 6초의 리듬이 흐트러진 생체 활력을 재정렬합니다.`;
  } else if (dominantYogaLimb.level <= 6) {
    dharanaFocusPrescription = `외부의 산만한 자극과 스마트폰 알림을 끄고 감각을 내면으로 회수(프라티야하라)한 뒤, 현재 가장 중요한 단 한 가지 과업에만 온 의식을 쏟아붓는 다라나(Dharana)를 가동하십시오.`;
  } else {
    dharanaFocusPrescription = `인위적으로 성과를 쥐어짜려 하지 말고, 고요한 통찰 속에 물러나 지켜보는 디야나와 사마디의 순수 관조자(Puruṣa)로 머무르십시오. 답은 이미 내면에 준비되어 있습니다.`;
  }

  let samadhiClarityGuidance: string;
  if (cittaVrittiNirodhaScore >= 80) {
    samadhiClarityGuidance = `마음의 소용돌이가 가라앉아 호수의 잔물결처럼 투명한 지혜가 드러나는 상태입니다. 흔들림 없는 평정심 속에서 내리는 판단이 가장 정확합니다.`;
  } else if (kleshaPurificationRate >= 75) {
    samadhiClarityGuidance = `번뇌의 뿌리(애착과 불안)가 한 겹 씻겨 나가며 가벼운 홀가분함이 깃들고 있습니다. 불필요한 고집을 내려놓을수록 대운의 흐름이 막힘없이 열립니다.`;
  } else {
    samadhiClarityGuidance = `잡념이 일어날 때마다 그것에 이름표를 붙이지 말고 단지 흘러가는 구름처럼 관조하십시오. 요동치는 물결 밑바닥의 고요한 침묵이 당신의 본래 자리입니다.`;
  }

  const calculatedAtKst = formatPatanjaliKstTimestamp(now);
  const ritualAction = `오늘 제${dominantYogaLimb.level}지칙 '${dominantYogaLimb.nameKo}(${dominantYogaLimb.sanskrit})'을 실천하기 위해, ${dharanaFocusPrescription}`;
  const reflectionFocus = `파탄잘리 요가 수트라(${dominantYogaLimb.nameKo} ↔ ${secondaryYogaLimb.nameKo}) — ${dominantYogaLimb.focusRealm}과 치타 브리티 니로다`;
  const composite = Math.round(
    (cittaVrittiNirodhaScore + kleshaPurificationRate + purushaConsciousnessAwakening + pranayamaVitalityBalance) / 4
  );
  const yogaSynthesisMatrix = {
    dominantTension: `${dominantYogaLimb.nameKo} ↔ ${secondaryYogaLimb.nameKo}`,
    alignmentState: describePatanjaliStage(composite),
    integratedAction: `${dharanaFocusPrescription}${contextText.trim() ? ` [질문 맥락: ${contextText.trim()}]` : ''}`,
  };

  return {
    engineVersion: PATANJALI_ASHTANGA_YOGA_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    cittaVrittiNirodhaScore,
    kleshaPurificationRate,
    purushaConsciousnessAwakening,
    pranayamaVitalityBalance,
    dominantYogaLimb,
    secondaryYogaLimb,
    dharanaFocusPrescription,
    samadhiClarityGuidance,
    ritualAction,
    reflectionFocus,
    yogaSynthesisMatrix,
    interpretiveBoundary: '본 파탄잘리 요가 수트라 8지칙 리포트는 고전 요가 철학에 기반한 정성적 마음 수련 안내이며, 의학·심리 진단을 대신하지 않습니다.',
  };
}

export function formatPatanjaliAshtangaYogaPrompt(
  report: PatanjaliAshtangaYogaReport
): string {
  const composite = Math.round(
    (report.cittaVrittiNirodhaScore + report.kleshaPurificationRate + report.purushaConsciousnessAwakening + report.pranayamaVitalityBalance) / 4
  );
  const lines = [
    `### 🧘 고대 인도 파탄잘리 요가 수트라 8지칙 & 치타 브리티 니로다 삼매 청정 리포트`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진 버전: v${report.engineVersion}`,
    `- 삼매 수행 국면: ${describePatanjaliStage(composite)}`,
    `- 핵심 수행 요가지칙: 제${report.dominantYogaLimb.level}지칙 ${report.dominantYogaLimb.nameKo} [${report.dominantYogaLimb.focusRealm}] — ${report.dominantYogaLimb.practicePrinciple}`,
    `- 보조 수행 요가지칙: 제${report.secondaryYogaLimb.level}지칙 ${report.secondaryYogaLimb.nameKo} [${report.secondaryYogaLimb.focusRealm}] — ${report.secondaryYogaLimb.practicePrinciple}`,
    `- 다라나(단일점 집중) 처방: ${report.dharanaFocusPrescription}`,
    `- 사마디(삼매 명징성) 지침: ${report.samadhiClarityGuidance}`,
    `- 실천 의례: ${report.ritualAction}`,
    `- 성찰 초점: ${report.reflectionFocus}`,
    `- [AI 해석 지침]: 파탄잘리 《요가 수트라》의 '치타 브리티 니로다(마음의 작용을 고요히 함)' 원리를 적용하여, 질문자가 산만한 잡념과 번뇌의 소용돌이를 멈추고 고요한 순수의식(Puruṣa)의 중심을 잡아 흔들림 없는 집중력과 삼매의 명징성을 회복하도록 지혜롭게 안내하십시오.`,
  ];
  if (report.yogaSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.yogaSynthesisMatrix.dominantTension} | 조율 상태: ${report.yogaSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${report.yogaSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 해석 경계: ${report.interpretiveBoundary}`);
  return lines.join('\n');
}
