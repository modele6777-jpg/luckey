/**
 * 동양 유학 정통 성리학 사칠이기(四七理氣) & 거경궁리(居敬窮理) 주일무적(主一無適) 수양 엔진
 * (Neo-Confucian Four-Seven Debates Li-Qi Metaphysics & Mind Cultivation Engine)
 *
 * 송대 주자(朱熹)의 《태극도설해(太極圖說解)》, 《주자어류(朱子語類)》 및
 * 조선 유학의 정수인 퇴계 이황의 《성학십도(聖學十圖)》와 율곡 이이의 《격몽요결》 원전 기반:
 *
 * 1. 이기지묘(理氣之妙):
 *    - 이(理): 우주 만물의 보편적 존재 법칙이자 본연의 순선(純善)한 도덕 본체 (不相雜)
 *    - 기(氣): 만물을 형성하고 변화를 일으키는 구체적 기운과 물질적 작용 (不相離)
 * 2. 사단칠정론(四端七情論) 심성 분석:
 *    - 사단(四端: 仁義禮智):
 *      측은지심(인·사랑) / 수오지심(의·정의) / 사양지심(예·겸손) / 시비지심(지·판별)
 *    - 칠정(七情):
 *      희(喜·기쁨), 노(怒·분노), 애(哀·슬픔), 구(懼·두려움), 애(愛·애정), 오(惡·미움), 욕(欲·욕망)
 * 3. 심성 수양 4대 공부(工夫):
 *    - 존심양성(存心養性): 본래의 착한 마음을 보존하고 성품을 기름
 *    - 거경궁리(居敬窮理): 경(敬)의 자세로 사물의 본질과 이치를 깊이 탐구함
 *    - 주일무적(主一無適): 마음을 오직 한곳에 집중하여 흩어지지 않게 함
 *    - 격물치지(格物致知): 실제 사물에 나아가 끝까지 이치를 깨달아 지식을 완성함
 * 4. 본연지성(本然之性) 회복율 및 기질지성(氣質之性) 청탁 정화 지수 (0~100)
 */

import type { UserProfile } from '../sharedState';

export const NEO_CONFUCIAN_LIQI_ENGINE_VERSION = 'LUCKEY-NEO-CONFUCIAN-LIQI-v2.2.0';

export interface SadanVirtueInfo {
  nameKo: string;
  hanja: string;
  cardinalVirtue: '仁 (인)' | '義 (의)' | '禮 (예)' | '智 (지)';
  meaning: string;
  moralAction: string;
}

export interface ChiljeongEmotionInfo {
  nameKo: string;
  hanja: string;
  emotionType: string;
  moderationStatus: '과다(過多)' | '부족(不足)' | '중절(中節·조화)';
  harmonizationKey: string;
}

export interface NeoConfucianFourSevenLiQiReport {
  engineVersion: string;
  calculatedAtKst: string;
  dominantSadan: SadanVirtueInfo;
  secondarySadan: SadanVirtueInfo;
  dominantChiljeong: ChiljeongEmotionInfo;
  secondaryChiljeong: { nameKo: string; hanja: string; emotionType: string; harmonizationKey: string };
  sadanAlignmentScore: number;         // 0 ~ 100 사단 도덕 발현도
  chiljeongBalanceScore: number;       // 0 ~ 100 칠정 중절(中節) 조화 지수
  liQiHarmonyIndex: number;            // 0 ~ 100 이기지묘(理氣之妙) 밸런스
  originalNaturePurityScore: number;   // 0 ~ 100 본연지성(本然之性) 회복율
  geogyeongConcentrationIndex: number; // 0 ~ 100 거경(居敬) 주일무적 집중도
  neoConfucianMasterGuidance: string;
  mindCultivationPrescription: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  liQiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatNeoConfucianKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeLiQiStage(score: number): string {
  if (score >= 82) return '천리청명(天理淸明) — 사단의 도덕 이치가 기질의 탁함을 맑게 씻어내어 중절(中節)에 이른 조화기';
  if (score >= 68) return '거경함양(居敬涵養) — 경(敬)의 자세로 감정의 기복을 다스리며 본연지성을 회복해 가는 수양기';
  return '극기복례(克己復禮) — 칠정의 치우침을 알아차리고 주일무적(主一無適)으로 중심을 다시 세우는 정돈기';
}

const SADAN_VIRTUES: SadanVirtueInfo[] = [
  {
    nameKo: '측은지심 (惻隱之心)',
    hanja: '惻隱之心',
    cardinalVirtue: '仁 (인)',
    meaning: '남의 고통과 곤경을 차마 외면하지 못하고 함께 아파하는 순수한 사랑의 발로',
    moralAction: '약자를 온정으로 감싸 안고 만물을 포용하는 어진 자비심의 실천'
  },
  {
    nameKo: '수오지심 (羞惡之心)',
    hanja: '羞惡之心',
    cardinalVirtue: '義 (의)',
    meaning: '자신의 불의와 부도덕을 부끄러워하고 세상의 사악함을 단호히 미워하는 정의감',
    moralAction: '불의와의 타협을 거부하고 올곧은 신념으로 원칙과 책임을 지키는 결단'
  },
  {
    nameKo: '사양지심 (辭讓之心)',
    hanja: '辭讓之心',
    cardinalVirtue: '禮 (예)',
    meaning: '자신을 낮추고 상대를 공경하며 겸손하게 양보하는 조화로운 예절의 근본',
    moralAction: '오만함을 버리고 겸손과 배려로 인간관계의 올바른 질서를 세움'
  },
  {
    nameKo: '시비지심 (是非之心)',
    hanja: '是非之心',
    cardinalVirtue: '智 (지)',
    meaning: '무엇이 옳고 그른지, 무엇이 참되고 거짓인지 명철하게 가려내는 지혜의 눈',
    moralAction: '편견과 미망을 걷어내고 사물의 시비와 본질을 냉철하게 직관하는 판단'
  }
];

const CHILJEONG_EMOTIONS: Array<{ nameKo: string; hanja: string; emotionType: string; harmonizationKey: string }> = [
  { nameKo: '희 (喜 - 기쁨)', hanja: '喜', emotionType: '생명 활력과 성취의 즐거움', harmonizationKey: '도취에 빠져 방종하지 않고 경건함을 잃지 않음' },
  { nameKo: '노 (怒 - 분노)', hanja: '怒', emotionType: '장애와 부조리에 대한 의분', harmonizationKey: '사사로운 감정의 폭발을 막고 의로운 분별로 승화' },
  { nameKo: '애 (哀 - 슬픔)', hanja: '哀', emotionType: '상실과 애도에서 오는 비애', harmonizationKey: '지나친 낙담에 매몰되지 않고 삶의 숭고함을 회복' },
  { nameKo: '구 (懼 - 두려움)', hanja: '懼', emotionType: '미지와 위험 앞의 경계심', harmonizationKey: '위축된 공포를 도덕적 경외심과 신중함으로 전환' },
  { nameKo: '애 (愛 - 사랑)', hanja: '愛', emotionType: '인연과 사물을 향한 애착', harmonizationKey: '편협한 집착을 벗어나 공정한 박애로 승화' },
  { nameKo: '오 (惡 - 미움)', hanja: '惡', emotionType: '부정함과 거슬림에 대한 거부', harmonizationKey: '사리사욕의 증오를 비우고 순수한 도덕적 분별 유지' },
  { nameKo: '욕 (欲 - 욕망)', hanja: '欲', emotionType: '생존과 성취를 향한 추구력', harmonizationKey: '물욕과 과욕을 절제하고 대도(大道)를 향한 지향으로 조율' }
];

export function calculateNeoConfucianFourSevenLiQi(params: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): NeoConfucianFourSevenLiQiReport {
  const { profile, question = '', now = new Date() } = params;

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1992-08-15';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '09:00';

  const dateParts = bdate.split('-').map(p => parseInt(p, 10) || 0);
  const year = dateParts[0] || 1992;
  const month = dateParts[1] || 8;
  const day = dateParts[2] || 15;

  const timeParts = btime.split(':').map(p => parseInt(p, 10) || 0);
  const hour = timeParts[0] || 9;
  const minute = timeParts[1] || 0;

  let qHash = 0;
  for (let i = 0; i < question.length; i++) {
    qHash = (qHash * 31 + question.charCodeAt(i)) & 0xffffffff;
  }
  const qSeed = Math.abs(qHash);

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();
  const nowHour = now.getHours();

  const seed = (year * 365 + month * 31 + day + hour * 19 + minute * 5 + qSeed + nowYear * 12 + nowMonth * 30 + nowDay + nowHour) >>> 0;

  // 1. Dominant Sadan (Four Beginnings)
  const sadanIdx = seed % SADAN_VIRTUES.length;
  const secondarySadanIdx = (sadanIdx + 1 + ((seed >> 2) % (SADAN_VIRTUES.length - 1))) % SADAN_VIRTUES.length;
  const dominantSadan = SADAN_VIRTUES[sadanIdx];
  const secondarySadan = SADAN_VIRTUES[secondarySadanIdx];

  // 2. Dominant Chiljeong (Seven Emotions)
  const chiljeongIdx = (seed * 13 + 7) % CHILJEONG_EMOTIONS.length;
  const secondaryChiljeongIdx = (chiljeongIdx + 1 + ((seed >> 3) % (CHILJEONG_EMOTIONS.length - 1))) % CHILJEONG_EMOTIONS.length;
  const rawChiljeong = CHILJEONG_EMOTIONS[chiljeongIdx];
  const secondaryChiljeong = CHILJEONG_EMOTIONS[secondaryChiljeongIdx];

  const statusSeed = (seed * 7 + day) % 10;
  let moderationStatus: ChiljeongEmotionInfo['moderationStatus'] = '중절(中節·조화)';
  if (statusSeed < 2) {
    moderationStatus = '과다(過多)';
  } else if (statusSeed < 4) {
    moderationStatus = '부족(不足)';
  }

  const dominantChiljeong: ChiljeongEmotionInfo = {
    ...rawChiljeong,
    moderationStatus
  };

  // 3. Quantitative Indices
  const sadanAlignmentScore = Math.min(100, Math.max(52, 60 + ((seed * 11) % 39)));
  const chiljeongBalanceScore = Math.min(100, Math.max(48, 55 + ((seed * 17) % 43)));
  const liQiHarmonyIndex = Math.min(100, Math.max(50, Math.round(sadanAlignmentScore * 0.5 + chiljeongBalanceScore * 0.5)));
  const originalNaturePurityScore = Math.min(100, Math.max(45, Math.round(liQiHarmonyIndex * 0.7 + ((qSeed % 19) + 12))));
  const geogyeongConcentrationIndex = Math.min(100, Math.max(55, Math.round(62 + ((seed * 23 + hour * 7) % 37))));

  const calculatedAtKst = formatNeoConfucianKstTimestamp(now);
  const ritualAction = `${dominantSadan.moralAction}. 오늘 하루를 시작하거나 마무리할 때 3분간 바른 자세로 호흡을 가다듬고, '${dominantChiljeong.nameKo}' 감정이 흔들리는 순간 '${dominantChiljeong.harmonizationKey}'를 마음속으로 되뇌며 주일무적의 중심을 세우세요.`;
  const reflectionFocus = `성리학 사칠이기(${dominantSadan.nameKo}) · ${dominantChiljeong.nameKo} — 거경궁리(居敬窮理)와 중절(中節)의 조화`;

  const trimmedQuery = question?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `사단 '${dominantSadan.nameKo}'과 보조 덕목 '${secondarySadan.nameKo}'를 비추어 볼 때, "${trimmedQuery}"에서 칠정 '${dominantChiljeong.nameKo}'의 치우침을 중절(中節)로 되돌리는 첫걸음은 무엇인가요?`
    : `지금 '${dominantSadan.nameKo}'의 본연지성과 '${dominantChiljeong.nameKo}'의 기운 사이에서 주일무적(主一無適)의 중심을 지키려면 무엇을 먼저 정돈해야 할까요?`;
  const interpretiveBoundary = '이 지표는 성리학의 이기지묘(理氣之妙)·사단칠정론·거경궁리(居敬窮理) 수양론을 감정 조율과 도덕적 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';
  const composite = Math.round(
    (sadanAlignmentScore + chiljeongBalanceScore + liQiHarmonyIndex + originalNaturePurityScore + geogyeongConcentrationIndex) / 5
  );
  const liQiSynthesisMatrix = {
    dominantTension: `${dominantSadan.nameKo} ↔ ${dominantChiljeong.nameKo} [${dominantChiljeong.moderationStatus}]`,
    alignmentState: describeLiQiStage(composite),
    integratedAction: `${dominantSadan.moralAction} · ${dominantChiljeong.harmonizationKey}${question?.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  // 4. Guidance Formulation
  const neoConfucianMasterGuidance = `성리학의 핵심은 '이기불상리(理와 氣는 떨어질 수 없고) 이기불상잡(理와 氣는 서로 뒤섞이지 않는다)'의 이기지묘에 있습니다. 당신의 내면에서 지금 가장 크게 발현되어야 할 본연의 도덕성은 [${dominantSadan.nameKo}]입니다. 감정의 흐름에서는 [${dominantChiljeong.nameKo}]의 기운이 [${dominantChiljeong.moderationStatus}] 상태로 나타나고 있습니다. 주자의 가르침대로, 외적인 자극에 일희일비하지 말고 '거경궁리(居敬窮理)'—항상 마음을 경건하고 또렷하게 깨어 있게 유지하십시오.`;

  const mindCultivationPrescription = `[주일무적(主一無適) 수양 처방] 마음을 오직 하나에 모으고 잡념으로 흩어지지 않게 하는 주일무적 공부를 실천하십시오. 기질의 탁함을 맑게 씻어내어 ${describeLiQiStage(originalNaturePurityScore)} 흐름을 회복할 때, ${dominantSadan.moralAction}이(가) 저절로 이루어집니다. ${dominantChiljeong.nameKo} 감정에 휘둘릴 때는 ${dominantChiljeong.harmonizationKey}를 가슴에 품고 평온의 중심을 잡으십시오.`;

  return {
    engineVersion: NEO_CONFUCIAN_LIQI_ENGINE_VERSION,
    calculatedAtKst,
    dominantSadan,
    secondarySadan,
    dominantChiljeong,
    secondaryChiljeong,
    sadanAlignmentScore,
    chiljeongBalanceScore,
    liQiHarmonyIndex,
    originalNaturePurityScore,
    geogyeongConcentrationIndex,
    neoConfucianMasterGuidance,
    mindCultivationPrescription,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    liQiSynthesisMatrix,
  };
}

export function formatNeoConfucianFourSevenLiQiPrompt(rep: NeoConfucianFourSevenLiQiReport): string {
  const composite = Math.round(
    (rep.sadanAlignmentScore + rep.chiljeongBalanceScore + rep.liQiHarmonyIndex + rep.originalNaturePurityScore + rep.geogyeongConcentrationIndex) / 5
  );
  const lines = [
    `[성리학 사칠이기(四七理氣) & 거경궁리 주일무적 수양 실측 리포트]`,
    `· 연산 시각: ${rep.calculatedAtKst} | 버전: ${rep.engineVersion}`,
    `· 이기 수양 국면: ${describeLiQiStage(composite)}`,
    `· 주재 사단(四端): [${rep.dominantSadan.nameKo}] — 덕목: ${rep.dominantSadan.cardinalVirtue}`,
    `· 보조 교차 사단: [${rep.secondarySadan.nameKo}] — 덕목: ${rep.secondarySadan.cardinalVirtue}`,
    `  - 도덕적 의미: ${rep.dominantSadan.meaning}`,
    `  - 실천 행동: ${rep.dominantSadan.moralAction}`,
    `· 감정 칠정(七情) 현황: [${rep.dominantChiljeong.nameKo}] — 조화 상태: ${rep.dominantChiljeong.moderationStatus}`,
    `· 보조 교차 칠정: [${rep.secondaryChiljeong.nameKo}] — ${rep.secondaryChiljeong.harmonizationKey}`,
    `  - 감정 조율 요체: ${rep.dominantChiljeong.harmonizationKey}`,
    `· 성리학 거경 지침: ${rep.neoConfucianMasterGuidance}`,
    `· 주일무적 마음 수양 처방: ${rep.mindCultivationPrescription}`,
    `· 실천 의례: ${rep.ritualAction}`,
    `· 성찰 초점: ${rep.reflectionFocus}`,
    `· 성찰 질문: ${rep.reflectiveQuestion}`,
    `· 해석 경계: ${rep.interpretiveBoundary}`,
  ];
  if (rep.liQiSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스 [핵심 긴장: ${rep.liQiSynthesisMatrix.dominantTension} | 조율 상태: ${rep.liQiSynthesisMatrix.alignmentState}]`,
      `· 통합 실천: ${rep.liQiSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
