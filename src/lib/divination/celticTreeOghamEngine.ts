/**
 * =========================================================================
 * LUCKEY 고대 켈트 오검(Ogham) 수목(樹木) 신성 지혜 & 수호목 오라클 엔진
 * (Ancient Celtic Tree Ogham Sacred Wisdom & Oracle Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 아일랜드와 브리튼의 드루이드(Druids) 전통에서 전승된 켈트 신성 문자 오검(Ogham).
 * 13개 태음월 켈트 수목 달력(Celtic Tree Calendar)과 대자연의 흐름을
 * 생년월일 수비학에 매핑하여, 내담자의 '본명 수호목(Birth Guardian Tree)'과
 * 현재 인생의 전환점에 필요한 대자연의 치유 처방(Tree Medicine)을 0ms 순수 수리로 해석합니다.
 * 
 * [13대 켈트 신성 수목 (Beth-Luis-Nuin)]
 * 1. Beth (자작나무): 새로운 시작, 탄생, 정화
 * 2. Luis (마가목): 직관, 영적 보호, 마법적 통찰
 * 3. Fearn (오리나무): 용기, 기초의 확립, 수호
 * 4. Saille (버드나무): 감정 치유, 달의 리듬, 유연성
 * 5. Nuin (물푸레나무): 우주목(Yggdrasil), 조화, 영적 연결
 * 6. Huath (산사나무): 심장 정화, 내면의 장벽 돌파
 * 7. Duir (참나무): 불굴의 힘, 왕의 권위, 영원한 생명력
 * 8. Tinne (호랑가시나무): 전사의 결단, 승리, 불패의 의지
 * 9. Coll (개암나무): 지혜의 원천, 직관적 영감, 창의성
 * 10. Muin (포도나무): 영혼의 수확, 본질적 열정, 감각의 축복
 * 11. Gort (아이비): 끈기와 인내, 영혼의 회복력, 연대
 * 12. Ngetal (갈대): 유연한 적응, 깊은 진실의 탐구
 * 13. Ruis (딱총나무): 성숙한 종결, 변형, 부활의 순환
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_OGHAM_VERSION = 'LUCKEY-CELTIC-OGHAM-v2.1.0';

export interface OghamTree {
  nameOgham: string;
  nameTreeKo: string;
  nameTreeEn: string;
  oghamLetter: string;
  periodKo: string;
  element: '물' | '불' | '바람' | '대지' | '에테르';
  guardianKeyword: string;
  treeMedicine: string;
  celticAphorism: string;
}

export interface OghamSituationalAudit {
  groveQuestionAxis: string;
  treeResonanceFocus: string;
  druidMedicineAction: string;
  rootCaution: string;
}

export interface OghamTemporalRhythm {
  kstHour: number;
  groveWatchWindow: string;
  lunarTreeSeason: string;
  attunementGuidance: string;
  groveTempo: '발아' | '성장' | '휴면';
}

export interface OghamSynthesisMatrix {
  resonanceState: '깊은공명' | '조화순환' | '뿌리안정';
  birthSeasonalLink: string;
  nextGroveStep: string;
}

export interface CelticTreeOghamReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  birthGuardianTree: OghamTree;
  seasonalOracleTree: OghamTree;
  druidWisdomScore: number;     // 내부 연산용
  situationalOghamAudit: OghamSituationalAudit;
  temporalOghamRhythm: OghamTemporalRhythm;
  oghamSynthesisMatrix: OghamSynthesisMatrix;
  treeMedicinePrescription: string;
  natureAttunementAffirmation: string;
  interpretiveBoundary: string;
}

const CELTIC_TREES: OghamTree[] = [
  {
    nameOgham: 'Beth (베스)',
    nameTreeKo: '자작나무',
    nameTreeEn: 'Birch',
    oghamLetter: 'ᚁ',
    periodKo: '12월 24일 ~ 1월 20일',
    element: '바람',
    guardianKeyword: '새로운 시작, 정화, 탄생의 서막',
    treeMedicine: '과거의 낡은 찌꺼기를 백색 수피처럼 벗겨내고 새하얀 첫 장을 열어젖히는 정화의 에너지',
    celticAphorism: '흰 자작나무 숲을 지날 때, 모든 어제는 하얗게 지워지고 오직 맑은 빛만 남는다.'
  },
  {
    nameOgham: 'Luis (루이스)',
    nameTreeKo: '마가목',
    nameTreeEn: 'Rowan',
    oghamLetter: 'ᚂ',
    periodKo: '1월 21일 ~ 2월 17일',
    element: '불',
    guardianKeyword: '직관의 눈, 영적 보호, 비전의 각성',
    treeMedicine: '붉은 열매처럼 타오르는 마법적 보호막으로 부정적 기운을 차단하고 직관을 밝히는 에너지',
    celticAphorism: '마가목의 붉은 열매를 품은 자는 어둠 속에서도 길을 잃지 않는다.'
  },
  {
    nameOgham: 'Fearn (페아른)',
    nameTreeKo: '오리나무',
    nameTreeEn: 'Alder',
    oghamLetter: 'ᚃ',
    periodKo: '2월 18일 ~ 3월 17일',
    element: '물',
    guardianKeyword: '용기, 단단한 기초, 영적 수호',
    treeMedicine: '물속에서도 썩지 않는 목재처럼, 감정의 혼란 속에서도 확고한 신념과 기초를 지켜내는 힘',
    celticAphorism: '물길 속에 서 있는 오리나무는 흐름을 두려워하지 않고 스스로 다리가 된다.'
  },
  {
    nameOgham: 'Saille (살리)',
    nameTreeKo: '버드나무',
    nameTreeEn: 'Willow',
    oghamLetter: 'ᚄ',
    periodKo: '3월 18일 ~ 4월 14일',
    element: '물',
    guardianKeyword: '달의 리듬, 감정의 치유, 유연한 회복',
    treeMedicine: '강풍에 부러지지 않고 휘어지는 유연성으로 마음의 상처를 보듬고 무의식의 지혜를 길어 올리는 치유',
    celticAphorism: '버드나무는 바람에 맞서지 않기에 세상에서 가장 오래 살아남는다.'
  },
  {
    nameOgham: 'Nuin (누인)',
    nameTreeKo: '물푸레나무',
    nameTreeEn: 'Ash',
    oghamLetter: 'ᚅ',
    periodKo: '4월 15일 ~ 5월 12일',
    element: '에테르',
    guardianKeyword: '우주목의 연결, 영적 조화, 대통합',
    treeMedicine: '하늘과 땅을 잇는 뿌리와 가지처럼, 미시적 일상과 원대한 영적 비전을 완벽히 조화시키는 힘',
    celticAphorism: '물푸레나무의 가지는 별을 만지고, 그 뿌리는 대지의 심장을 껴안는다.'
  },
  {
    nameOgham: 'Huath (후아트)',
    nameTreeKo: '산사나무',
    nameTreeEn: 'Hawthorn',
    oghamLetter: 'ᚆ',
    periodKo: '5월 13일 ~ 6월 9일',
    element: '대지',
    guardianKeyword: '내적 정화, 심장의 치유, 경계선 돌파',
    treeMedicine: '가시덤불 속에 순백의 꽃을 피우듯, 상처를 보호막 삼아 가장 순수한 사랑과 용기를 꽃피우는 에너지',
    celticAphorism: '가장 날카로운 가시 사이에 가장 그윽한 흰 꽃이 숨어 있다.'
  },
  {
    nameOgham: 'Duir (두이르)',
    nameTreeKo: '참나무',
    nameTreeEn: 'Oak',
    oghamLetter: 'ᚇ',
    periodKo: '6월 10일 ~ 7월 7일',
    element: '불',
    guardianKeyword: '불굴의 힘, 왕의 위엄, 영원한 신뢰',
    treeMedicine: '벼락을 맞고도 굳건히 버티는 천년 참나무처럼, 어떤 위기에도 흔들리지 않는 장엄한 권위와 뚝심',
    celticAphorism: '참나무 문을 두드리는 자는 천 년의 용기를 빌려 입는다.'
  },
  {
    nameOgham: 'Tinne (티네)',
    nameTreeKo: '호랑가시나무',
    nameTreeEn: 'Holly',
    oghamLetter: 'ᚈ',
    periodKo: '7월 8일 ~ 8월 4일',
    element: '불',
    guardianKeyword: '전사의 결단, 불패의 승리, 고결한 의지',
    treeMedicine: '겨울에도 푸른 잎을 잃지 않는 강철 같은 결단력으로 정면 승부에서 승리를 거머쥐는 결기',
    celticAphorism: '호랑가시나무 잎끝의 칼날은 오직 진실한 정의만을 위해 베어진다.'
  },
  {
    nameOgham: 'Coll (콜)',
    nameTreeKo: '개암나무',
    nameTreeEn: 'Hazel',
    oghamLetter: 'ᚉ',
    periodKo: '8월 5일 ~ 9월 1일',
    element: '바람',
    guardianKeyword: '지혜의 샘, 시적 영감, 천재적 영감',
    treeMedicine: '신화 속 연어가 삼킨 지혜의 개암 열매처럼, 영감을 현실의 창작과 통찰로 구체화하는 지적 마스터리',
    celticAphorism: '개암나무 아래 앉은 시인은 바람이 속삭이는 우주의 비밀을 적는다.'
  },
  {
    nameOgham: 'Muin (무인)',
    nameTreeKo: '포도나무',
    nameTreeEn: 'Vine',
    oghamLetter: 'ᚋ',
    periodKo: '9월 2일 ~ 9월 29일',
    element: '대지',
    guardianKeyword: '영혼의 수확, 열정의 숙성, 감각의 축복',
    treeMedicine: '여름의 뙤약볕을 달콤한 포도주로 빚어내듯, 지나온 모든 고난을 최고의 가치와 풍요로 승화시키는 수확',
    celticAphorism: '포도 넝쿨이 감고 올라가는 곳마다 영혼의 축제가 열린다.'
  },
  {
    nameOgham: 'Gort (고르트)',
    nameTreeKo: '아이비 (담쟁이)',
    nameTreeEn: 'Ivy',
    oghamLetter: 'ᚌ',
    periodKo: '9월 30일 ~ 10월 27일',
    element: '물',
    guardianKeyword: '불굴의 인내, 끈기, 영혼의 회복력',
    treeMedicine: '바위를 뚫고 올라가는 담쟁이의 생명력처럼, 어떤 척박한 환경에서도 반드시 생존하여 승리하는 끈기',
    celticAphorism: '담쟁이는 거센 벽을 탓하지 않고 온몸으로 껴안아 푸른 성벽으로 바꾼다.'
  },
  {
    nameOgham: 'Ngetal (게탈)',
    nameTreeKo: '갈대',
    nameTreeEn: 'Reed',
    oghamLetter: 'ᚍ',
    periodKo: '10월 28일 ~ 11월 24일',
    element: '바람',
    guardianKeyword: '유연한 적응, 깊은 진실의 탐구, 소통',
    treeMedicine: '물가에 깊이 뿌리박고 바람의 노래를 부르는 갈대처럼, 혼란기 속에서 명확한 진실을 전달하는 힘',
    celticAphorism: '갈대의 속삭임에는 땅의 깊은 맥박과 하늘의 먼 소식이 담겨 있다.'
  },
  {
    nameOgham: 'Ruis (루이스)',
    nameTreeKo: '딱총나무 (엘더)',
    nameTreeEn: 'Elder',
    oghamLetter: 'ᚏ',
    periodKo: '11월 25일 ~ 12월 23일',
    element: '대지',
    guardianKeyword: '성숙한 매듭, 변형과 부활, 순환의 완성',
    treeMedicine: '오래된 주기를 지혜롭게 마무리하고 다음 단계로 완전히 새롭게 태어나는 심오한 변형의 마법',
    celticAphorism: '엘더 나무의 마지막 잎이 떨어질 때, 가장 찬란한 부활의 서막이 열린다.'
  }
];

function getKstOghamParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildOghamSituationalAudit(
  question: string,
  birthTree: OghamTree,
  seasonalTree: OghamTree
): OghamSituationalAudit {
  const q = question.toLowerCase();
  if (/일|진로|사업|이직|선택|시험|계획/.test(q)) {
    return {
      groveQuestionAxis: '성장의 방향과 뿌리 기반 점검',
      treeResonanceFocus: `${birthTree.nameTreeKo}의 기질 위에 ${seasonalTree.nameTreeKo}의 실행력 접목`,
      druidMedicineAction: '지금 진행 중인 일에서 핵심 줄기 하나만 남기고 잔가지를 쳐내는 우선순위 정리를 하십시오.',
      rootCaution: '겉잎만 무성하고 뿌리가 얕으면 계절 바람에 흔들립니다.',
    };
  }
  if (/관계|사랑|연애|사람|가족|갈등|화해/.test(q)) {
    return {
      groveQuestionAxis: '숲의 연대와 경계선 조율',
      treeResonanceFocus: `${seasonalTree.nameTreeKo} (${seasonalTree.guardianKeyword})의 포용과 유연성`,
      druidMedicineAction: '가까운 사이일수록 나무 사이의 적당한 그늘과 간격을 존중하며 따뜻한 안부를 건네십시오.',
      rootCaution: '상대의 영역까지 뿌리를 뻗어 통제하려 들지 마십시오.',
    };
  }
  return {
    groveQuestionAxis: `${seasonalTree.nameTreeKo} 숲의 계절 순응`,
    treeResonanceFocus: seasonalTree.treeMedicine,
    druidMedicineAction: '가까운 나무나 식물을 잠시 바라보며 호흡을 천천히 세 번 가다듬으십시오.',
    rootCaution: '씨앗을 심자마자 열매를 따려는 조급함을 경계하십시오.',
  };
}

function buildOghamTemporalRhythm(now: Date): OghamTemporalRhythm {
  const { hour, month } = getKstOghamParts(now);

  let groveWatchWindow = '아침 자작나무 이슬 창';
  let groveTempo: OghamTemporalRhythm['groveTempo'] = '발아';
  let attunementGuidance = '신선한 호흡과 함께 오늘의 의도를 맑게 세우기 좋은 시간입니다.';

  if (hour >= 5 && hour < 10) {
    groveWatchWindow = '여명 숲 이슬 발아 창 (05~10시)';
    groveTempo = '발아';
    attunementGuidance = '새로운 시작과 맑은 직관이 열리므로 오늘의 핵심 과업을 먼저 펼치십시오.';
  } else if (hour >= 10 && hour < 17) {
    groveWatchWindow = '정오 참나무 광합성 성장 창 (10~17시)';
    groveTempo = '성장';
    attunementGuidance = '햇빛을 받아 줄기를 뻗듯 실질적 실행과 소통에 힘을 싣기 좋습니다.';
  } else if (hour >= 17 && hour < 21) {
    groveWatchWindow = '황혼 버드나무 순환 정리 창 (17~21시)';
    groveTempo = '성장';
    attunementGuidance = '감정의 찌꺼기를 바람에 흘려보내고 하루를 차분히 갈무리하십시오.';
  } else {
    groveWatchWindow = '심야 엘더(Elder) 뿌리 휴면 창 (21~05시)';
    groveTempo = '휴면';
    attunementGuidance = '에너지를 뿌리로 내려보내 깊은 쉼 속에서 재생을 도모할 시간입니다.';
  }

  let lunarTreeSeason = '켈트 13태음월 순환절';
  if (month >= 3 && month <= 5) lunarTreeSeason = '봄 · 버드나무·물푸레 발아절';
  else if (month >= 6 && month <= 8) lunarTreeSeason = '여름 · 참나무·호랑가시 만개절';
  else if (month >= 9 && month <= 11) lunarTreeSeason = '가을 · 포도나무·갈대 수확절';
  else lunarTreeSeason = '겨울 · 엘더·자작나무 정화절';

  return {
    kstHour: hour,
    groveWatchWindow,
    lunarTreeSeason,
    attunementGuidance,
    groveTempo,
  };
}

export function calculateCelticTreeOgham(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question: string = ''
): CelticTreeOghamReport {
  let month = 8;
  let day = 15;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      month = parseInt(digits.slice(4, 6), 10);
      day = parseInt(digits.slice(6, 8), 10);
    }
  }

  // 13개 수목 달력 인덱스 판정
  // 12/24~1/20(0), 1/21~2/17(1), 2/18~3/17(2), 3/18~4/14(3), 4/15~5/12(4),
  // 5/13~6/9(5), 6/10~7/7(6), 7/8~8/4(7), 8/5~9/1(8), 9/2~9/29(9),
  // 9/30~10/27(10), 10/28~11/24(11), 11/25~12/23(12)
  const monthDay = month * 100 + day;
  let birthTreeIndex = 0;

  if (monthDay >= 1224 || monthDay <= 120) birthTreeIndex = 0;
  else if (monthDay <= 217) birthTreeIndex = 1;
  else if (monthDay <= 317) birthTreeIndex = 2;
  else if (monthDay <= 414) birthTreeIndex = 3;
  else if (monthDay <= 512) birthTreeIndex = 4;
  else if (monthDay <= 609) birthTreeIndex = 5;
  else if (monthDay <= 707) birthTreeIndex = 6;
  else if (monthDay <= 804) birthTreeIndex = 7;
  else if (monthDay <= 901) birthTreeIndex = 8;
  else if (monthDay <= 929) birthTreeIndex = 9;
  else if (monthDay <= 1027) birthTreeIndex = 10;
  else if (monthDay <= 1124) birthTreeIndex = 11;
  else birthTreeIndex = 12;

  const birthGuardianTree = CELTIC_TREES[birthTreeIndex];

  // 목표일 시점의 계절적 신탁 나무
  const targetMonthDay = (targetDate.getMonth() + 1) * 100 + targetDate.getDate();
  let seasonalIndex = (birthTreeIndex + Math.floor(targetMonthDay / 30)) % CELTIC_TREES.length;
  const seasonalOracleTree = CELTIC_TREES[seasonalIndex];

  // 드루이드 공명 점수 (내부 연산용)
  const druidWisdomScore = 72 + ((month * 7 + day * 13) % 27);

  const treeMedicinePrescription = `내담자의 본명 수호목은 [${birthGuardianTree.nameOgham} - ${birthGuardianTree.nameTreeKo}] (${birthGuardianTree.oghamLetter})입니다. 현재 시점에는 [${seasonalOracleTree.nameTreeKo}]의 [${seasonalOracleTree.guardianKeyword}] 기운이 강력하게 공명하고 있습니다. ${seasonalOracleTree.treeMedicine}.`;

  const natureAttunementAffirmation = `나는 [${birthGuardianTree.nameTreeKo}]의 깊은 뿌리처럼 흔들림 없이 안전하며, [${seasonalOracleTree.nameTreeKo}]의 푸른 잎처럼 대자연의 지혜와 풍요를 온몸으로 흡수한다.`;

  const situationalOghamAudit = buildOghamSituationalAudit(question, birthGuardianTree, seasonalOracleTree);
  const temporalOghamRhythm = buildOghamTemporalRhythm(targetDate);
  const resonanceState: OghamSynthesisMatrix['resonanceState'] =
    druidWisdomScore >= 88 ? '깊은공명' : druidWisdomScore >= 78 ? '조화순환' : '뿌리안정';
  const oghamSynthesisMatrix: OghamSynthesisMatrix = {
    resonanceState,
    birthSeasonalLink: `${birthGuardianTree.nameTreeKo}(${birthGuardianTree.element})와 현재 ${seasonalOracleTree.nameTreeKo}(${seasonalOracleTree.element})가 ${temporalOghamRhythm.groveWatchWindow}에서 만납니다.`,
    nextGroveStep: situationalOghamAudit.druidMedicineAction,
  };

  const kst = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const interpretiveBoundary = '본 켈트 오검 수목 오라클 리포트는 13태음월 수목 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.';

  return {
    engineVersion: CELTIC_OGHAM_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    birthGuardianTree,
    seasonalOracleTree,
    druidWisdomScore,
    situationalOghamAudit,
    temporalOghamRhythm,
    oghamSynthesisMatrix,
    treeMedicinePrescription,
    natureAttunementAffirmation,
    interpretiveBoundary
  };
}

export function formatCelticTreeOghamPrompt(report: CelticTreeOghamReport): string {
  return `### 🌲 고대 켈트 오검(Ogham) 수목 지혜 & 수호목 오라클 엔진 (${CELTIC_OGHAM_VERSION})
- **기준 시각(KST)**: ${report.calculatedAtKst}
- **본명 수호목 (Birth Tree)**: ${report.birthGuardianTree.nameOgham} [${report.birthGuardianTree.nameTreeKo} (${report.birthGuardianTree.nameTreeEn})]
  - 오검 신성 문자: ${report.birthGuardianTree.oghamLetter} | 수호 원소: ${report.birthGuardianTree.element} | 주기: ${report.birthGuardianTree.periodKo}
  - 수호목 핵심 키워드: ${report.birthGuardianTree.guardianKeyword}
  - 드루이드 격언: "${report.birthGuardianTree.celticAphorism}"
- **현재 공명 오라클 나무**: ${report.seasonalOracleTree.nameTreeKo} (${report.seasonalOracleTree.nameOgham}) · 공명 상태(${report.oghamSynthesisMatrix.resonanceState})
  - 계절적 조언: ${report.seasonalOracleTree.guardianKeyword}
- **질문 맥락 감사**: ${report.situationalOghamAudit.groveQuestionAxis} · 초점(${report.situationalOghamAudit.treeResonanceFocus})
  - 드루이드 처방: ${report.situationalOghamAudit.druidMedicineAction}
  - 뿌리 경계: ${report.situationalOghamAudit.rootCaution}
- **KST 시공간 리듬 (${report.temporalOghamRhythm.kstHour}시)**: ${report.temporalOghamRhythm.groveWatchWindow} · ${report.temporalOghamRhythm.lunarTreeSeason} (${report.temporalOghamRhythm.groveTempo})
  - 시간대 지침: ${report.temporalOghamRhythm.attunementGuidance}
- **수목 교차 매트릭스**: ${report.oghamSynthesisMatrix.birthSeasonalLink}
- **수목 치유 처방 (Tree Medicine)**: ${report.treeMedicinePrescription}
- **자연 조율 확언 (Affirmation)**: ${report.natureAttunementAffirmation}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
