/**
 * 대한민국 남명 조식(南冥 曺植) 선생 《내명자경 외단자의(內明者敬 外斷者義)》 성성자(惺惺子) 경의검(敬義劍) & 단성소(丹城疏) 서릿발 실천 지조 지혜 엔진
 *
 * 조선 중기 영남학파의 영수이자 실천적 선비정신의 거봉 남명 조식(南冥 曺植, 1501~1572) 선생의 핵심 사상
 * 《남명집(南冥集)》, 〈단성소(丹城疏, 을묘사직소)〉, 〈무진소(戊辰疏)〉, 〈신명사도(神明舍圖)〉, 성성자(惺惺子)와 경의검(敬義劍) 일화 원전 기반:
 * 1. 내명자경(內明者敬) 마음 성찰 및 상시 각성도(Inner Clarity through Gyeong Revere Score): 사사로운 욕망을 비우고 본성을 밝히는 엄격한 경(敬)의 수양도.
 * 2. 외단자의(外斷者義) 결단력 및 불의 척결 실천력(Outer Decisive Righteousness Ui Score): 옳고 그름을 서릿발처럼 가려 행동으로 옮기는 단호한 의(義)의 기개.
 * 3. 성성자(惺惺子) 깨어있는 양심 방울 자각 지수(Seongseongja Bell of Vigilance Index): 허리에 방울을 차 마음이 흐려지지 않게 늘 스스로를 일깨우는 경계심.
 * 4. 단성소(丹城疏) 서릿발 직언 및 불굴 지조 지수(Danseongso Uncompromising Integrity Score): 권력 앞에서도 흔들리지 않고 대의와 백성을 위해 진실을 고하는 용기.
 * 5. 산천재(山天齋) 지리산 실천학문 및 의병 배출 기개 지표(Sancheonjae Practical Scholarship & Courage Index): 말 잔치를 배격하고 국난 극복의 실천적 힘을 기르는 현장성.
 *
 * @version LUCKEY-NAMMYEONG-JO-SIK-GYEONG-UI-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_NAMMYEONG_JO_SIK_VERSION = 'LUCKEY-NAMMYEONG-JO-SIK-GYEONG-UI-v2.1.0';

export interface NammyeongTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface NammyeongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanNammyeongJoSikGyeongUiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 남명 조식 경의사상 지표 (0~100)
  innerClarityGyeongScore: number;             // 내명자경(內明者敬) 마음 성찰 및 상시 각성도 (Inner Clarity through Gyeong)
  outerDecisiveUiScore: number;                // 외단자의(外斷者義) 결단력 및 실천력 (Outer Decisive Righteousness Ui)
  seongseongjaBellAwakeningIndex: number;      // 성성자(惺惺子) 깨어있는 양심 방울 자각 지수 (Seongseongja Bell of Vigilance)
  danseongsoUprightCourageScore: number;       // 단성소(丹城疏) 서릿발 직언 및 불굴 지조 지수 (Danseongso Integrity)
  sancheonjaeActionScholarshipIndex: number;   // 산천재(山天齋) 실천학문 및 불굴 기개 지표 (Sancheonjae Action Courage)
  // 세부 분석
  activeNammyeongTheme: NammyeongTheme;
  secondaryNammyeongTheme: NammyeongTheme;
  focalNammyeongAphorism: NammyeongAphorism;
  secondaryNammyeongAphorism: NammyeongAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  nammyeongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  nammyeongSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatNammyeongKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeNammyeongStage(score: number): string {
  if (score >= 92) return '경의쌍수(敬義雙修) — 내면의 성찰과 바깥의 결단이 서릿발처럼 합일된 실천기';
  if (score >= 87) return '성성각성(惺惺覺醒) — 방울 소리처럼 깨어 있어 흔들림 없이 중심을 잡는 정진기';
  return '내명자경(內明者敬) — 번잡함을 거두고 마음의 성채를 고요히 밝히는 수양기';
}

export const NAMMYEONG_THEMES: NammyeongTheme[] = [
  {
    themeKey: 'gyeongAndUiDualSwords',
    themeTitleEn: 'Inner Reverence (Gyeong) & Outer Righteousness (Ui)',
    themeTitleKo: '경(敬)과 의(義)의 쌍검 — 안으로는 밝히고 밖으로는 결단한다',
    pragmaticInsight: '마음만 닦고 행동하지 않는 학문은 위선이며, 깊은 성찰 없이 앞서는 행동은 무모합니다. 경(敬)으로 내면을 티 없이 맑게 비추고 의(義)로써 옳지 못한 것을 단호히 베어낼 때 온전한 실천이 완성됩니다.',
    practicalCounsel: '생각만 복잡하게 굴리며 결단을 미루지 마십시오. 양심에 부끄러움이 없다면 망설임을 털어내고 옳다고 확신하는 바를 즉시 단호하게 행동으로 옮기십시오.',
  },
  {
    themeKey: 'seongseongjaVigilance',
    themeTitleEn: 'Seongseongja: The Bell of Continuous Awakening',
    themeTitleKo: '성성자의 맑은 방울소리 — 한순간도 흐려지지 않는 각성',
    pragmaticInsight: '남명 선생은 옷고름에 성성자(惺惺子)라는 방울을 달아 걸을 때마다 울리는 소리를 들으며 마음이 안일함이나 잡념에 잠들지 않도록 매 순간 스스로를 일깨웠습니다.',
    practicalCounsel: '일상의 나태와 타성에 젖어들지 마십시오. 당신만의 ‘마음의 방울’을 달아두고, 흐트러짐이 찾아올 때마다 호흡을 가다듬고 초심과 원칙을 새롭게 환기하십시오.',
  },
  {
    themeKey: 'danseongsoCourage',
    themeTitleEn: 'Danseongso: Fearless Integrity in Truth',
    themeTitleKo: '목숨을 건 단성소의 직언 — 권력 앞에서도 굽히지 않는 대의',
    pragmaticInsight: '을묘사직소(단성소)에서 남명 선생은 죽음을 각오하고 나라의 병폐를 준엄하게 꾸짖었습니다. 알랑거리는 아첨으로 자리를 보전하기보다 진실을 지키는 데 자신의 존재를 걸었습니다.',
    practicalCounsel: '눈앞의 손익이나 타인의 눈치를 보느라 비겁하게 침묵하지 마십시오. 공동체와 미래를 위해 꼭 해야 할 말이라면 예의를 갖추되 당당하고 솔직하게 진실을 말하십시오.',
  },
  {
    themeKey: 'sinmyeongsaInnerFortress',
    themeTitleEn: 'Sinmyeongsa: The Inner Palace of Conscience',
    themeTitleKo: '신명사도의 마음 경영 — 오욕칠정을 다스리는 내면의 성채',
    pragmaticInsight: '남명 선생은 인간의 마음을 군주가 다스리는 성채(神明舍)에 비유했습니다. 사사로운 욕망의 적들이 침범하지 못하도록 경의(敬義)의 파수꾼을 세워 마음의 평화를 지켰습니다.',
    practicalCounsel: '외부의 유혹과 분노, 불안에 당신의 마음자리를 내어주지 마십시오. 내면의 성채를 굳건히 지키며 평정심과 고결한 품격을 의연하게 유지하십시오.',
  },
  {
    themeKey: 'sancheonjaeActionLearning',
    themeTitleEn: 'Sancheonjae: Practical Learning for Real Action',
    themeTitleKo: '지리산 산천재의 실천 학문 — 위기 앞에서 칼을 뽑는 기개',
    pragmaticInsight: '공허한 탁상공론을 극도로 경계하고, 백성을 구하고 나라를 지키는 산 학문을 가르쳤습니다. 그 가르침을 받은 제자들은 임진왜란이 일어나자 분연히 의병을 일으켜 나라를 구했습니다.',
    practicalCounsel: '이론이나 말재주에 머물지 말고 실질적인 역량을 기르십시오. 당신이 배운 지식과 기술이 주변 사람들의 고통을 덜어주고 실제 문제를 해결하는 힘이 되게 하십시오.',
  },
];

export const NAMMYEONG_APHORISMS: NammyeongAphorism[] = [
  {
    aphorismKey: 'naemyeongGyeongOedanUi',
    aphorismKo: '안으로 마음을 밝히는 것은 경(敬)이요, 밖으로 행동을 결단하는 것은 의(義)이다.',
    aphorismHanja: '內明者敬 外斷者義 (내명자경 외단자의)',
    sourceContext: '《남명집(南冥集)》 경의검(敬義劍) 명문',
    actionGuidance: '내면의 양심을 거울처럼 맑게 닦고, 대외적 행동에서는 주저함 없이 의로움을 실천하십시오.',
  },
  {
    aphorismKey: 'seongseongjaAwake',
    aphorismKo: '방울을 차는 것은 마음이 잠들거나 흐트러지지 않게 스스로를 늘 일깨우기 위함이다.',
    aphorismHanja: '惺惺子 警身醒心 (성성자 경신성심)',
    sourceContext: '《남명집(南冥集)》 성성자 방울 일화',
    actionGuidance: '매 순간 깨어있는 주의력을 유지하며, 안일한 타성에 빠지지 않도록 마음의 고삐를 죄십시오.',
  },
  {
    aphorismKey: 'learningWithoutActionDead',
    aphorismKo: '손으로 물 뿌리고 빗자루질하는 법도 모르면서 입으로만 천하의 이치를 논하는 것은 거짓 학문이다.',
    aphorismHanja: '洒掃應對不知 口談天理何益 (쇄소응대부지 구담천리하익)',
    sourceContext: '퇴계 이황에게 보낸 서간문',
    actionGuidance: '가장 기본적인 일상의 실천부터 철저히 챙기며, 행동이 뒷받침되는 진정한 실력을 증명하십시오.',
  },
  {
    aphorismKey: 'chiriMountainSolitude',
    aphorismKo: '지리산 천왕봉 높은 기상은 비바람에도 흔들리지 않으니, 군자의 지조 또한 천년 세월에 변함이 없다.',
    aphorismHanja: '請看千石鐘 非大扣無聲 (청간천석종 비대구무성)',
    sourceContext: '《남명집(南冥集)》 〈제덕산계정(題德山溪亭)〉',
    actionGuidance: '주변의 사소한 평판이나 일시적 바람에 일희일비하지 말고, 거산(巨山)처럼 묵직한 지조를 지키십시오.',
  },
  {
    aphorismKey: 'sovereignDutyTruth',
    aphorismKo: '나라의 근본이 위태로운데 어찌 침묵하여 녹봉만 축내겠는가. 옳은 도리를 다할 뿐이다.',
    aphorismHanja: '事急矣 國勢已去 (사급의 국세이거)',
    sourceContext: '〈단성소(丹城疏, 을묘사직소)〉',
    actionGuidance: '진실과 정의가 요구하는 순간에 비겁하게 물러서지 말고, 책임 있는 주체로서 당당히 소신을 밝히십시오.',
  },
];

export function calculateKoreanNammyeongJoSikGyeongUi(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanNammyeongJoSikGyeongUiResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `NAMMYEONG-JO-SIK-GYEONG-UI:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const innerClarityGyeongScore = 82 + (absHash % 17);
  const outerDecisiveUiScore = 83 + ((absHash >> 3) % 16);
  const seongseongjaBellAwakeningIndex = 81 + ((absHash >> 6) % 18);
  const danseongsoUprightCourageScore = 80 + ((absHash >> 9) % 19);
  const sancheonjaeActionScholarshipIndex = 82 + ((absHash >> 12) % 17);

  const themeIndex = (absHash >> 5) % NAMMYEONG_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 6) % (NAMMYEONG_THEMES.length - 1))) % NAMMYEONG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % NAMMYEONG_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (NAMMYEONG_APHORISMS.length - 1))) % NAMMYEONG_APHORISMS.length;

  const activeNammyeongTheme = NAMMYEONG_THEMES[themeIndex];
  const secondaryNammyeongTheme = NAMMYEONG_THEMES[secondaryThemeIndex];
  const focalNammyeongAphorism = NAMMYEONG_APHORISMS[aphorismIndex];
  const secondaryNammyeongAphorism = NAMMYEONG_APHORISMS[secondaryAphorismIndex];

  const reflectiveQuestion = query?.trim()
    ? `'${query.trim()}' 앞에서 ${activeNammyeongTheme.themeTitleKo.split(' — ')[0]}과 ${secondaryNammyeongTheme.themeTitleKo.split(' — ')[0]} 가운데 지금 내면으로 밝히고 밖으로 결단해야 할 한 가지는 무엇인가요?`
    : `오늘 당신의 성성자 방울이 울릴 때 ${activeNammyeongTheme.themeTitleKo.split(' — ')[0]}과 ${secondaryNammyeongTheme.themeTitleKo.split(' — ')[0]} 중 가장 먼저 깨워야 할 원칙은 무엇인가요?`;
  const interpretiveBoundary =
    '이 남명 조식 경의사상 지표는 내명자경·외단자의의 실천 정신을 비추는 정성적 성찰 프레임이며, 확정적 성패 예언이 아닙니다.';

  const guidanceTitle = `남명 조식 경의사상 지혜: ${activeNammyeongTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 실천적 선비정신의 영수 남명 조식 선생은 안으로 마음을 밝히는 경(敬)과 밖으로 행동을 결단하는 의(義), 성성자 방울의 상시 각성, 그리고 불의에 굴하지 않는 서릿발 실천 지조를 강조합니다. ` +
    `현재 당신의 결단과 도전에 가장 든든한 등불이 되는 핵심 원리는 '${activeNammyeongTheme.themeTitleKo}'입니다. ` +
    `${activeNammyeongTheme.practicalCounsel} 아울러 남명 선생의 명훈 "${focalNammyeongAphorism.aphorismKo} (${focalNammyeongAphorism.aphorismHanja})"를 가슴에 깊이 새기고, ` +
    `${focalNammyeongAphorism.actionGuidance}`;

  const calculatedAtKst = formatNammyeongKstTimestamp(now);
  const avgScore = Math.round(
    (innerClarityGyeongScore +
      outerDecisiveUiScore +
      seongseongjaBellAwakeningIndex +
      danseongsoUprightCourageScore +
      sancheonjaeActionScholarshipIndex) /
      5,
  );
  const nammyeongSynthesisMatrix = {
    dominantTension: `${activeNammyeongTheme.themeTitleKo} ↔ ${focalNammyeongAphorism.sourceContext}`,
    alignmentState: describeNammyeongStage(avgScore),
    integratedAction: `${focalNammyeongAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_NAMMYEONG_JO_SIK_VERSION,
    calculatedAtKst,
    innerClarityGyeongScore,
    outerDecisiveUiScore,
    seongseongjaBellAwakeningIndex,
    danseongsoUprightCourageScore,
    sancheonjaeActionScholarshipIndex,
    activeNammyeongTheme,
    secondaryNammyeongTheme,
    focalNammyeongAphorism,
    secondaryNammyeongAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    nammyeongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    nammyeongSynthesisMatrix,
  };
}

export function formatKoreanNammyeongJoSikGyeongUiPrompt(
  res: KoreanNammyeongJoSikGyeongUiResult,
): string {
  const avgScore = Math.round(
    (res.innerClarityGyeongScore +
      res.outerDecisiveUiScore +
      res.seongseongjaBellAwakeningIndex +
      res.danseongsoUprightCourageScore +
      res.sancheonjaeActionScholarshipIndex) /
      5,
  );
  const lines = [
    `【남명 조식 선생 《내명자경 외단자의》 경의검 & 성성자 실천 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 경의 실천 국면: ${describeNammyeongStage(avgScore)}`,
    `- 핵심 경의사상 테마: ${res.activeNammyeongTheme.themeTitleKo} [${res.activeNammyeongTheme.themeTitleEn}]`,
    `- 보조 교차 테마: ${res.secondaryNammyeongTheme.themeTitleKo} [${res.secondaryNammyeongTheme.themeTitleEn}]`,
    `- 선비정신 실천 통찰: ${res.activeNammyeongTheme.pragmaticInsight}`,
    `- 결단 실천 조언: ${res.activeNammyeongTheme.practicalCounsel}`,
    `- 남명 원전 명훈: "${res.focalNammyeongAphorism.aphorismKo}"`,
    `- 보조 교차 명훈: "${res.secondaryNammyeongAphorism.aphorismKo}" [${res.secondaryNammyeongAphorism.sourceContext}]`,
    `- 한문 원전: [${res.focalNammyeongAphorism.aphorismHanja}]`,
    `- 원전 출처: [${res.focalNammyeongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalNammyeongAphorism.actionGuidance}`,
    `- 종합 남명 선비정신 권면: ${res.nammyeongComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.nammyeongSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.nammyeongSynthesisMatrix.dominantTension} | 조율 상태: ${res.nammyeongSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.nammyeongSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
