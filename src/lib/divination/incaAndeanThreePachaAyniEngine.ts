/**
 * 고대 잉카 안데스 코스몰로지 3대 세계 & 신성 영수 & 파차마마 아이니(Ayni) 호혜 조화 엔진
 *
 * LUCKEY-INCA-ANDEAN-THREE-PACHA-AYNI-v1.0.0
 *
 * 남아메리카 안데스 산맥 및 잉카 제국 케추아(Quechua) 샤머니즘 원전 기반
 * 3대 우주 세계(하난 파차·카이 파차·우쿠 파차), 3대 신성 영수(콘도르·퓨마·뱀),
 * 대지모신 파차마마(Pachamama)의 사미(Sami, 청정 에너지)와 아이니(Ayni, 신성 상호호혜) 결정론 엔진.
 *
 * [핵심 우주론 체계]
 * 1. 3대 파차 (Three Worlds / Pachas):
 *    - 하난 파차 (Hanan Pacha): 천상계, 영적 시야와 신성한 지혜, 태양신 인티(Inti)의 빛, 수호 영수: 신성 콘도르 (Kuntur)
 *    - 카이 파차 (Kay Pacha): 지상계/현세, 깨어있는 현존, 용기와 구체적 실행, 인간의 삶, 수호 영수: 신성 퓨마 (Puma)
 *    - 우쿠 파차 (Uku Pacha): 지하계/무의식, 심연의 그림자 정화 및 재생, 영적 뿌리, 수호 영수: 신성 뱀 (Amaru)
 * 2. 에너지 순환 및 정화 (Energy Dynamics):
 *    - 사미 (Sami): 우주와 대자연에서 흐르는 맑고 가벼운 고차원 정기
 *    - 후차 (Hucha): 정체되고 무거운 저밀도 에너지 (파차마마에게 내려놓아 퇴비처럼 승화)
 * 3. 아이니 (Ayni - Sacred Reciprocity):
 *    - "오늘 너에게 주고, 내일 나에게 돌아온다." 우주와 인간, 이웃 간의 신성한 상호 호혜와 순환 법칙
 * 4. 잉카 3대 황금 덕목 (Three Incan Pillars):
 *    - 무나이 (Munay): 가슴의 조건 없는 사랑과 온기
 *    - 양카이 (Yankay): 손과 몸의 성실한 실천과 노동
 *    - 야차이 (Yachay): 머리의 밝은 지혜와 올바른 앎
 */

import type { UserProfile } from '../sharedState';

export const INCA_ANDEAN_PACHA_VERSION = '2.3.0';

export interface IncaAndeanPachaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 3대 파차 공명도
  hananPachaCelestialScore: number; // 하난 파차 (천상/콘도르 영적 시야, 0~100)
  kayPachaEarthlyPresenceScore: number; // 카이 파차 (지상/퓨마 용기 실행, 0~100)
  ukuPachaSubconsciousDepthScore: number; // 우쿠 파차 (지하/뱀 재생 치유, 0~100)
  // 안데스 영성 지표
  ayniReciprocityBalanceScore: number; // 아이니(Ayni) 신성 호혜성 조화 지수 (0~100)
  samiLightEnergyPurity: number; // 사미(Sami) 청정 생명 에너지 순도 (0~100)
  huchaHeavyEnergyClearance: number; // 후차(Hucha) 탁기 정화율 (0~100)
  // 3대 기둥 활성도
  munayHeartLoveScore: number; // 무나이 (사랑/가슴, 0~100)
  yankayActionLaborScore: number; // 양카이 (실천/노동, 0~100)
  yachayWisdomIntellectScore: number; // 야차이 (지혜/머리, 0~100)
  // 신성 영수 수호령
  sacredAnimalTotem: {
    animalKo: string;
    quechuaName: string;
    realm: string;
    totemicMedicine: string;
  };
  situationalPachaAudit: {
    focusTheme: string;
    dominantPillar: string;
    ayniExchangePrinciple: string;
    huchaReleasePractice: string;
  };
  temporalPachaRhythm: {
    kstTimeLabel: string;
    intiSolarWindow: string;
    andeanSeason: string;
    temporalGuidance: string;
  };
  pachaSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  ayniSpiritualPrescription: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const ANDEAN_TOTEMS = [
  {
    animalKo: '신성한 콘도르',
    quechuaName: 'Kuntur',
    realm: '하난 파차 (Hanan Pacha - 천상계)',
    totemicMedicine: '높은 하늘에서 삶의 전모를 조망하는 영적 시야를 선사합니다. 사소한 갈등을 초월하여 거대한 목적지를 향해 날개를 펼치십시오.',
  },
  {
    animalKo: '신성한 퓨마',
    quechuaName: 'Puma',
    realm: '카이 파차 (Kay Pacha - 지상계)',
    totemicMedicine: '두려움 없는 용기와 즉각적인 결단력을 부여합니다. 지체하지 않고 현존하며 목표를 향해 우아하고 단호하게 발걸음을 내딛으십시오.',
  },
  {
    animalKo: '신성한 뱀',
    quechuaName: 'Amaru',
    realm: '우쿠 파차 (Uku Pacha - 지하계)',
    totemicMedicine: '낡은 허물을 벗어던지는 심원한 탈바꿈과 치유를 돕습니다. 과거의 상처와 후회를 파차마마 대지모신에 온전히 맡겨 새로운 지혜로 재탄생하십시오.',
  },
];

function formatKstString(date: Date): { label: string; hour: number; month: number } {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return {
    label: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    hour: kst.getUTCHours(),
    month: kst.getUTCMonth() + 1,
  };
}

function getTemporalPachaRhythm(now: Date) {
  const kst = formatKstString(now);
  const intiSolarWindow =
    kst.hour >= 5 && kst.hour < 11
      ? '인티(Inti) 여명·아침 봉헌창 — 사미(Sami)의 맑은 첫 기운을 들이마시며 하루의 아이니 서원을 세우는 시간'
      : kst.hour >= 11 && kst.hour < 17
        ? '카이 파차 정오·현존창 — 퓨마의 발걸음으로 구체적 실행과 상호호혜의 노동을 완수하는 시간'
        : kst.hour >= 17 && kst.hour < 22
          ? '코야(Quilla) 황혼·정화창 — 하루 동안 쌓인 무거운 후차(Hucha)를 파차마마 대지에 내려놓는 시간'
          : '우쿠 파차 심야·별빛창 — 아마루(뱀)의 심연에서 묵은 집착을 벗고 콘도르의 꿈 시야를 여는 시간';

  const andeanSeason =
    kst.month >= 3 && kst.month <= 5
      ? '수확과 감사의 파차마마 계절 (인티 라이미 준비기 — 결실의 환원과 조율)'
      : kst.month >= 6 && kst.month <= 8
        ? '동지 태양제 인티 라이미(Inti Raymi) 계절 — 내면의 불씨를 지키며 높은 비전을 세우는 시기'
        : kst.month >= 9 && kst.month <= 11
          ? '파종과 기우의 시투아(Situa) 계절 — 묵은 후차를 씻어내고 새로운 인연을 심는 시기'
          : '비와 대지 잉태의 카팍 라이미(Capac Raymi) 계절 — 깊은 뿌리를 내리며 내실과 지혜를 축적하는 시기';

  return {
    kstTimeLabel: kst.label,
    intiSolarWindow,
    andeanSeason,
    temporalGuidance: `${intiSolarWindow} · ${andeanSeason}의 리듬에 맞추어 오늘 주고받을 아이니의 균형을 가다듬으십시오.`,
  };
}

function getSituationalPachaAudit(question: string | undefined, dominantPillar: string) {
  const q = (question || '').trim();
  if (/돈|재물|투자|사업|일|직장|계약|이직|승진/.test(q)) {
    return {
      focusTheme: '현세 실행과 풍요의 아이니(Ayni) 순환',
      dominantPillar,
      ayniExchangePrinciple: '내가 내어놓는 성실한 가치(양카이)와 세상이 돌려주는 정당한 보답이 균형을 이루어야 풍요가 머뭅니다.',
      huchaReleasePractice: '조급함과 과도한 집착(후차)을 대지에 흘려보내고, 지금 손에 쥔 과업 하나를 정성껏 매듭지으십시오.',
    };
  }
  if (/사랑|연애|관계|결혼|사람|가족|친구|갈등/.test(q)) {
    return {
      focusTheme: '가슴의 무나이(Munay)와 관계의 상호호혜',
      dominantPillar,
      ayniExchangePrinciple: '일방적으로 쏟기만 하거나 받기만 하는 관계는 사미의 흐름을 막습니다. 온기와 경계의 호혜를 회복하십시오.',
      huchaReleasePractice: '상대에 대한 서운함이나 오해의 찌꺼기를 촛불이나 호흡에 실어 파차마마에게 맡겨 비우십시오.',
    };
  }
  if (/건강|마음|치유|불안|지침|휴식|영적|진로|고민/.test(q)) {
    return {
      focusTheme: '사미(Sami) 청정 회복과 내면의 재탄생',
      dominantPillar,
      ayniExchangePrinciple: '스스로를 돌보고 맑히는 것 역시 파차마마에 대한 신성한 보답입니다. 내면의 평화가 외부의 조화를 부릅니다.',
      huchaReleasePractice: '맨발로 땅을 밟거나 맑은 물 한 잔을 마시며, 어깨에 얹힌 무거운 피로를 깊게 내쉬어 정화하십시오.',
    };
  }
  return {
    focusTheme: '삼계(하난·카이·우쿠)의 통합과 영적 균형',
    dominantPillar,
    ayniExchangePrinciple: '하늘의 시야(야차이), 가슴의 사랑(무나이), 손의 실천(양카이)이 하나로 맞물릴 때 아이니의 축복이 열립니다.',
    huchaReleasePractice: '오늘 하루 감사할 일 한 가지를 먼저 떠올리고, 무거운 걱정은 대지모신에게 가볍게 내려놓으십시오.',
  };
}

export function calculateIncaAndeanThreePachaAyni(
  profile?: UserProfile | null,
  nowArg?: Date,
  questionArg?: string
): IncaAndeanPachaReport {
  const now = nowArg || new Date();
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_inca_andean_pacha_v1`;
  const seed = djb2Hash(seedStr);

  const hananPachaCelestialScore = 64 + (seed % 35);
  const kayPachaEarthlyPresenceScore = 62 + ((seed >> 2) % 37);
  const ukuPachaSubconsciousDepthScore = 60 + ((seed >> 4) % 39);

  const ayniReciprocityBalanceScore = Math.round((hananPachaCelestialScore + kayPachaEarthlyPresenceScore + ukuPachaSubconsciousDepthScore) / 3);
  const samiLightEnergyPurity = 65 + ((seed >> 5) % 34);
  const huchaHeavyEnergyClearance = 68 + ((seed >> 7) % 31);

  const munayHeartLoveScore = 63 + ((seed >> 3) % 36);
  const yankayActionLaborScore = 61 + ((seed >> 6) % 38);
  const yachayWisdomIntellectScore = 66 + ((seed >> 8) % 33);

  const pillars = [
    { name: '무나이 (Munay · 가슴의 사랑과 포용)', val: munayHeartLoveScore },
    { name: '양카이 (Yankay · 손의 성실한 실천)', val: yankayActionLaborScore },
    { name: '야차이 (Yachay · 머리의 맑은 지혜)', val: yachayWisdomIntellectScore },
  ].sort((a, b) => b.val - a.val);
  const dominantPillar = pillars[0].name;

  const sacredAnimalTotem = ANDEAN_TOTEMS[seed % ANDEAN_TOTEMS.length];
  const temporalPachaRhythm = getTemporalPachaRhythm(now);
  const situationalPachaAudit = getSituationalPachaAudit(questionArg, dominantPillar);

  let ayniSpiritualPrescription = '';
  if (hananPachaCelestialScore >= kayPachaEarthlyPresenceScore && hananPachaCelestialScore >= ukuPachaSubconsciousDepthScore) {
    ayniSpiritualPrescription = '콘도르의 높은 비전이 열려 있습니다. 눈앞의 일시적 장애물에 매몰되지 말고 장기적 본질을 바라보며 아이니(나눔)를 실천하십시오.';
  } else if (kayPachaEarthlyPresenceScore >= ukuPachaSubconsciousDepthScore) {
    ayniSpiritualPrescription = '퓨마의 단호한 행동력이 필요한 시기입니다. 생각을 행동으로 옮길 때 파차마마의 강렬한 사미(청정에너지)가 길을 열어줍니다.';
  } else {
    ayniSpiritualPrescription = '뱀의 심원한 허물벗기가 일어나는 정화기입니다. 불필요한 집착과 후차(무거운 기운)를 내려놓으면 놀라운 재생력이 솟아납니다.';
  }

  const pachaSynthesisMatrix = {
    coreInsight: `[${sacredAnimalTotem.animalKo}(${sacredAnimalTotem.quechuaName})]의 수호 아래 [${dominantPillar}] 기둥이 중심을 잡고 있으며, ${situationalPachaAudit.focusTheme} 국면이 펼쳐져 있습니다.`,
    recommendedAction: `${ayniSpiritualPrescription} (${situationalPachaAudit.huchaReleasePractice})`,
    cautionNotice: '주고받음의 균형(아이니)이 무너지면 사미가 흐려집니다. 무리한 희생이나 일방적 기대를 경계하십시오.',
  };

  const ritualAction = `[${sacredAnimalTotem.animalKo} · ${situationalPachaAudit.focusTheme}] ${pachaSynthesisMatrix.recommendedAction}`;
  const reflectionFocus = `오늘 '${dominantPillar}'의 기운으로 후차(무거운 집착)를 덜어내고 내가 먼저 건넬 아이니(상호호혜)의 한 가지는 무엇입니까?`;
  const qClean = (questionArg || '').trim();
  const reflectiveQuestion = qClean
    ? `지금 "${qClean}" 앞에서 ${sacredAnimalTotem.animalKo}의 시선으로 오늘 먼저 건넬 아이니(상호호혜)와 내려놓을 후차(집착) 한 가지는 무엇인가요?`
    : `지금 '${dominantPillar}'의 기운으로 후차(무거운 집착)를 덜어내고 오늘 먼저 건넬 아이니(상호호혜) 한 가지는 무엇인가요?`;

  return {
    engineVersion: INCA_ANDEAN_PACHA_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalPachaRhythm.kstTimeLabel,
    hananPachaCelestialScore,
    kayPachaEarthlyPresenceScore,
    ukuPachaSubconsciousDepthScore,
    ayniReciprocityBalanceScore,
    samiLightEnergyPurity,
    huchaHeavyEnergyClearance,
    munayHeartLoveScore,
    yankayActionLaborScore,
    yachayWisdomIntellectScore,
    sacredAnimalTotem,
    situationalPachaAudit,
    temporalPachaRhythm,
    pachaSynthesisMatrix,
    ayniSpiritualPrescription,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    boundaryNotice: '본 결과는 안데스 케추아 3계 파차와 아이니 호혜 원리에 따른 정성적 성찰 지표이며, 우열을 가르는 점수나 절대적 예언이 아닙니다.',
    interpretiveBoundary: '본 결과는 안데스 케추아 3계 파차와 아이니 호혜 원리에 따른 정성적 성찰 지표이며, 우열을 가르는 점수나 절대적 예언이 아닙니다.',
  };
}

export function formatIncaAndeanThreePachaAyniPrompt(report: IncaAndeanPachaReport): string {
  const highWorld =
    report.hananPachaCelestialScore >= report.kayPachaEarthlyPresenceScore &&
    report.hananPachaCelestialScore >= report.ukuPachaSubconsciousDepthScore
      ? '하난 파차(Hanan Pacha · 콘도르 천상 비전)'
      : report.kayPachaEarthlyPresenceScore >= report.ukuPachaSubconsciousDepthScore
        ? '카이 파차(Kay Pacha · 퓨마 지상 현존)'
        : '우쿠 파차(Uku Pacha · 뱀 지하 재생)';

  return [
    `[고대 잉카 안데스 코스몰로지 3대 파차 & 파차마마 아이니(Ayni) 호혜 조화 v${report.engineVersion}]`,
    `- 연산 시각: ${report.calculatedAtKst}`,
    `- 주도 우주 세계: ${highWorld}`,
    `- 수호 토템: ${report.sacredAnimalTotem.animalKo} (${report.sacredAnimalTotem.quechuaName}) [${report.sacredAnimalTotem.realm}]`,
    `  * 치유 지혜: ${report.sacredAnimalTotem.totemicMedicine}`,
    `- 질문 맥락 감사 (${report.situationalPachaAudit.focusTheme}):`,
    `  * 주도 덕목 기둥: ${report.situationalPachaAudit.dominantPillar}`,
    `  * 아이니(Ayni) 호혜 원칙: ${report.situationalPachaAudit.ayniExchangePrinciple}`,
    `  * 후차(Hucha) 정화 실천: ${report.situationalPachaAudit.huchaReleasePractice}`,
    `- KST 시공간 리듬: ${report.temporalPachaRhythm.intiSolarWindow} / ${report.temporalPachaRhythm.andeanSeason}`,
    `  * 시공간 지침: ${report.temporalPachaRhythm.temporalGuidance}`,
    `- 파차 교차 매트릭스:`,
    `  * 핵심 통찰: ${report.pachaSynthesisMatrix.coreInsight}`,
    `  * 권고 실행: ${report.pachaSynthesisMatrix.recommendedAction}`,
    `  * 주의 경계: ${report.pachaSynthesisMatrix.cautionNotice}`,
    `- 파차마마 아이니 처방: ${report.ayniSpiritualPrescription}`,
    `- 실천 의례(Ritual Action): ${report.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${report.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${report.reflectiveQuestion}`,
    `- 해석 경계: ${report.boundaryNotice}`,
  ].join('\n');
}
