/**
 * 한국 조선 성리학 퇴계 이황(退溪 李滉) 《성학십도(聖學十圖)》 경(敬) 철학 & 거경궁리(居敬窮理) 심법 엔진
 *
 * 1568년(선조 1년) 퇴계 이황 선생의 《성학십도(聖學十圖)》 및 《자성록(自省錄)》 원전 기반.
 * 1. 경(敬) 철학: "성학의 처음이자 끝은 오직 경(敬)이다." 마음을 한곳에 모아 흩어지지 않게 하는 주일무적(主一無適).
 * 2. 상성성(常惺惺): 혼미함과 안일에 빠지지 않고 언제나 마음의 등불을 환하게 밝혀 깨어 있는 상태.
 * 3. 정제엄숙(整齊嚴肅): 옷매무새와 몸가짐을 바르게 정돈하여 겉과 속이 함께 단정해지는 수양의 기초.
 * 4. 거경궁리(居敬窮理): 안으로는 마음을 경건히 보존하고(居敬), 밖으로는 사물의 이치를 끝까지 탐구함(窮理).
 * 5. 심통성정(心統性情): 마음은 타고난 본성(性)과 밖으로 드러나는 감정(情)을 통솔하는 주재자.
 *
 * @version LUCKEY-TOEGYE-SEONGHAK-SIPDO-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const TOEGYE_SEONGHAK_SIPDO_VERSION = 'LUCKEY-TOEGYE-SEONGHAK-SIPDO-v2.1.0';

export interface SeonghakDiagram {
  diagramNumber: number;
  diagramTitleHanja: string;
  diagramTitleKo: string;
  corePrinciple: string;
  cultivationMethod: string;
}

export interface GyeongPractice {
  practiceHanja: string;
  practiceKo: string;
  meaningKo: string;
  dailyApplication: string;
}

export interface ToegyeSeonghakSipdoResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  gyeongMindfulnessFocusScore: number;       // 경(敬) 내면집중 주일무적도
  geogyeongGungriPrecisionScore: number;     // 거경궁리 사유이치 정밀도
  sangseongseongAwakeningScore: number;      // 상성성(常惺惺) 일상 깨어있음 지수
  jeongjeEomsukDignityScore: number;         // 정제엄숙 몸가짐 품격도
  seonghakIntegrationPracticeScore: number;  // 성학십도 지행합일 실천력
  // 세부 명세
  activeSeonghakDiagram: SeonghakDiagram;
  secondarySeonghakDiagram: SeonghakDiagram;
  focalGyeongPractice: GyeongPractice;
  secondaryGyeongPractice: GyeongPractice;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  toegyePhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  toegyeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatToegyeKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeToegyeStage(score: number): string {
  if (score >= 85) return '주일무적(主一無適) — 마음이 한곳에 맑게 모여 흔들림 없이 깨어 있는 경지';
  if (score >= 75) return '거경궁리(居敬窮理) — 경건한 중심 위에서 사물의 이치를 차분히 밝히는 국면';
  return '정제엄숙(整齊嚴肅) — 몸가짐과 일상을 단정히 정돈하며 내면의 기운을 거두는 흐름';
}

export type ToegyeSeonghakSipdoReport = ToegyeSeonghakSipdoResult;

const SEONGHAK_DIAGRAMS: SeonghakDiagram[] = [
  {
    diagramNumber: 1,
    diagramTitleHanja: '太極圖 (태극도)',
    diagramTitleKo: '하늘의 도(天道)와 인간 본성의 근원을 밝히는 도',
    corePrinciple: '무극이태극(無極而太極) - 우주 삼라만상의 근본 이치와 내 안의 순수한 본성이 하나로 통함',
    cultivationMethod: '근본 원리를 잊지 않고 사사로운 욕망에 흔들리지 않는 근원의 평정을 유지하십시오.',
  },
  {
    diagramNumber: 2,
    diagramTitleHanja: '西銘圖 (서명도)',
    diagramTitleKo: '하늘과 땅을 부모로 삼고 만물을 한 몸으로 여기는 도',
    corePrinciple: '민오동포 물오여야(民吾同胞 物吾與也) - 모든 인간은 형제요 만물은 나의 벗이라는 대자대비한 인(仁)',
    cultivationMethod: '나와 타인을 가르는 편협한 경계를 허물고 모두를 품는 너그러운 사랑과 포용을 베푸십시오.',
  },
  {
    diagramNumber: 3,
    diagramTitleHanja: '小學圖 (소학도)',
    diagramTitleKo: '일상의 사소한 예절과 물 뿌리고 비질하는 쇄소응대의 도',
    corePrinciple: '하학이상달(下學而上達) - 가장 기본적이고 작은 일상 실천을 통해 높은 진리의 경지에 이름',
    cultivationMethod: '거창한 명분에 앞서 일상의 사소한 약속과 주변 정리정돈부터 철저히 챙기십시오.',
  },
  {
    diagramNumber: 4,
    diagramTitleHanja: '大學圖 (대학도)',
    diagramTitleKo: '타고난 밝은 덕을 밝히고 백성을 새롭게 하는 도',
    corePrinciple: '명명덕 친민 지어지선(明明德 親民 止於至善) - 사물의 이치를 궁구하여 가장 지극한 선에 머묾',
    cultivationMethod: '격물치지(格物致知)의 끈기로 사태의 본질을 끝까지 파고들어 명쾌한 분별력을 확립하십시오.',
  },
  {
    diagramNumber: 6,
    diagramTitleHanja: '心學圖 (심학도)',
    diagramTitleKo: '마음의 본체와 작용을 바르게 이끄는 도',
    corePrinciple: '인심도심(人心道心)의 분별 - 감각적 욕망의 위험함을 경계하고 도덕적 본성의 미묘함을 보존함',
    cultivationMethod: '마음이 욕망에 이끌려 치우치지 않도록 항상 내면의 중심축을 굳게 잡으십시오.',
  },
  {
    diagramNumber: 8,
    diagramTitleHanja: '心統性情圖 (심통성정도)',
    diagramTitleKo: '마음이 본성과 감정을 통솔하는 주재자임을 밝히는 도',
    corePrinciple: '사단칠정(四端七情)의 조화 - 선한 본성은 온전히 발현시키고 거친 감정은 절도에 맞게 다스림',
    cultivationMethod: '감정이 격해질 때 한 발 물러서서 마음의 주재자로서 평정심을 되찾으십시오.',
  },
  {
    diagramNumber: 9,
    diagramTitleHanja: '敬齋箴圖 (경재잠도)',
    diagramTitleKo: '경(敬)의 처소와 실천 규범을 구체적으로 세우는 도',
    corePrinciple: '정제엄숙(整齊嚴肅)과 주일무적(主一無適) - 단정한 태도 속에서 한결같은 집중을 이어감',
    cultivationMethod: '산만한 잡념을 거두어들이고 지금 이 순간의 과업 하나에 온 마음을 쏟으십시오.',
  },
  {
    diagramNumber: 10,
    diagramTitleHanja: '夙興夜寐箴圖 (숙흥야매잠도)',
    diagramTitleKo: '아침에 일찍 일어나 밤에 늦게 잘 때까지 하루 수양의 도',
    corePrinciple: '일관된 생활 리듬과 지속적인 자기 성찰로 하루의 시작과 끝을 온전하게 채움',
    cultivationMethod: '아침의 맑은 기운을 지키고 저녁에는 하루를 반추하여 내면의 흐트러짐을 바로잡으십시오.',
  },
];

const GYEONG_PRACTICES: GyeongPractice[] = [
  {
    practiceHanja: '主一無適 (주일무적)',
    practiceKo: '마음을 한곳에 모아 다른 곳으로 흩어지지 않게 함',
    meaningKo: '지금 하는 일 하나에 전념하여 잡념과 곁눈질을 원천적으로 거두는 순수한 집중',
    dailyApplication: '여러 갈래의 걱정을 내려놓고 오직 지금 처리해야 할 당면 과제에 일심으로 집중하십시오.',
  },
  {
    practiceHanja: '常惺惺 (상성성)',
    practiceKo: '언제나 맑게 깨어 있어 어둠과 몽롱함에 빠지지 않음',
    meaningKo: '마음의 등불을 늘 밝혀두어 방심하거나 타성에 젖지 않는 내면의 명료한 각성 상태',
    dailyApplication: '관성적인 습관에 끌려가지 말고 스스로의 생각과 언행을 또렷하게 의식하며 행하십시오.',
  },
  {
    practiceHanja: '整齊嚴肅 (정제엄숙)',
    practiceKo: '몸가짐과 옷매무새를 바르게 정돈하고 안색을 단정히 함',
    meaningKo: '외면의 단정함이 내면의 깊은 질서와 위엄을 길러내는 유학 수양의 시작점',
    dailyApplication: '주변 환경과 옷차림, 자세를 바르게 정돈하여 흐트러진 마음의 기운을 다잡으십시오.',
  },
  {
    practiceHanja: '其心收斂 (기심수렴)',
    practiceKo: '밖으로 달아나는 마음을 조용히 안으로 거두어들임',
    meaningKo: '외물에 빼앗긴 주의력을 거두어 내면의 중심에 평온하게 머무는 수양법',
    dailyApplication: '타인의 시선이나 외부 평가에 대한 조급함을 내려놓고 자신의 본래 자리를 편안히 지키십시오.',
  },
];

export function calculateToegyeSeonghakSipdo(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ToegyeSeonghakSipdoResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'ToegyeSeonghakSipdo';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const gyeongMindfulnessFocusScore = 65 + (absHash % 34);
  const geogyeongGungriPrecisionScore = 62 + ((absHash >> 3) % 37);
  const sangseongseongAwakeningScore = 66 + ((absHash >> 6) % 33);
  const jeongjeEomsukDignityScore = 60 + ((absHash >> 9) % 39);
  const seonghakIntegrationPracticeScore = 63 + ((absHash >> 12) % 36);

  const diagramIndex = (absHash >> 4) % SEONGHAK_DIAGRAMS.length;
  const secondaryDiagramIndex = (diagramIndex + 1 + ((absHash >> 6) % (SEONGHAK_DIAGRAMS.length - 1))) % SEONGHAK_DIAGRAMS.length;
  const practiceIndex = (absHash >> 7) % GYEONG_PRACTICES.length;
  const secondaryPracticeIndex = (practiceIndex + 1 + ((absHash >> 10) % (GYEONG_PRACTICES.length - 1))) % GYEONG_PRACTICES.length;

  const activeSeonghakDiagram = SEONGHAK_DIAGRAMS[diagramIndex];
  const secondarySeonghakDiagram = SEONGHAK_DIAGRAMS[secondaryDiagramIndex];
  const focalGyeongPractice = GYEONG_PRACTICES[practiceIndex];
  const secondaryGyeongPractice = GYEONG_PRACTICES[secondaryPracticeIndex];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `퇴계 이황의 《${activeSeonghakDiagram.diagramTitleHanja}》와 《${secondarySeonghakDiagram.diagramTitleHanja}》를 비추어 볼 때, "${trimmedQuery}"에서 흩어진 마음을 하나로 모으는 경(敬)의 태도는 무엇인가요?`
    : `지금 마음을 쓰는 일 앞에서, '${activeSeonghakDiagram.diagramTitleHanja}'의 근원과 '${secondarySeonghakDiagram.diagramTitleHanja}'의 실천을 함께 살리려면 무엇을 단정히 해야 할까요?`;

  const interpretiveBoundary = '이 지표는 퇴계 이황 선생의 《성학십도》와 《자성록》에 담긴 경(敬)·거경궁리·상성성·심통성정 수양 철학을 내면 집중과 태도 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';

  const counselTitle = `퇴계 성학십도와 경(敬) 심법: ${activeSeonghakDiagram.diagramTitleHanja}`;
  const philosophicalGuidance = `퇴계 선생의 가르침에 따르면 만사의 성패는 마음을 하나로 모으는 경(敬)에 달려 있습니다. ` +
    `현재 상황에서는 《${activeSeonghakDiagram.diagramTitleHanja}》의 이치를 새겨 ${activeSeonghakDiagram.cultivationMethod} ` +
    `특히 심법 실천의 핵심으로 '${focalGyeongPractice.practiceHanja}(${focalGyeongPractice.practiceKo})'를 마음에 새기십시오. ${focalGyeongPractice.dailyApplication}`;

  const calculatedAtKst = formatToegyeKstTimestamp(now);
  const avgScore = Math.round(
    (gyeongMindfulnessFocusScore +
      geogyeongGungriPrecisionScore +
      sangseongseongAwakeningScore +
      jeongjeEomsukDignityScore +
      seonghakIntegrationPracticeScore) /
      5,
  );
  const toegyeSynthesisMatrix = {
    dominantTension: `${activeSeonghakDiagram.diagramTitleHanja} ↔ ${focalGyeongPractice.practiceHanja}`,
    alignmentState: describeToegyeStage(avgScore),
    integratedAction: `${focalGyeongPractice.dailyApplication}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: TOEGYE_SEONGHAK_SIPDO_VERSION,
    calculatedAtKst,
    gyeongMindfulnessFocusScore,
    geogyeongGungriPrecisionScore,
    sangseongseongAwakeningScore,
    jeongjeEomsukDignityScore,
    seonghakIntegrationPracticeScore,
    activeSeonghakDiagram,
    secondarySeonghakDiagram,
    focalGyeongPractice,
    secondaryGyeongPractice,
    reflectiveQuestion,
    interpretiveBoundary,
    toegyePhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    toegyeSynthesisMatrix,
  };
}

export function formatToegyeSeonghakSipdoPrompt(res: ToegyeSeonghakSipdoResult): string {
  const avgScore = Math.round(
    (res.gyeongMindfulnessFocusScore +
      res.geogyeongGungriPrecisionScore +
      res.sangseongseongAwakeningScore +
      res.jeongjeEomsukDignityScore +
      res.seonghakIntegrationPracticeScore) /
      5,
  );
  const lines = [
    `【한국 조선 성리학 퇴계 이황 성학십도 경(敬) 심법 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 경(敬) 수양 국면: ${describeToegyeStage(avgScore)}`,
    `- 성학십도 도상: ${res.activeSeonghakDiagram.diagramTitleHanja} (${res.activeSeonghakDiagram.diagramTitleKo})`,
    `- 보조 교차 도상: ${res.secondarySeonghakDiagram.diagramTitleHanja} (${res.secondarySeonghakDiagram.diagramTitleKo})`,
    `- 핵심 수양 원리: ${res.activeSeonghakDiagram.corePrinciple}`,
    `- 도상 실천 지침: ${res.activeSeonghakDiagram.cultivationMethod}`,
    `- 핵심 경(敬) 심법: ${res.focalGyeongPractice.practiceHanja} - ${res.focalGyeongPractice.practiceKo}`,
    `- 보조 교차 심법: ${res.secondaryGyeongPractice.practiceHanja} - ${res.secondaryGyeongPractice.practiceKo}`,
    `- 심법 실천 요결: ${res.focalGyeongPractice.dailyApplication}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 철학적 처방: ${res.toegyePhilosophicalCounsel.philosophicalGuidance}`,
  ];
  if (res.toegyeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.toegyeSynthesisMatrix.dominantTension} | 조율 상태: ${res.toegyeSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.toegyeSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
