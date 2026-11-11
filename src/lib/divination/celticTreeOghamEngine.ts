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

export const CELTIC_OGHAM_VERSION = 'LUCKEY-CELTIC-OGHAM-v1.0.0';

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

export interface CelticTreeOghamReport {
  engineVersion: string;
  calculatedAt: string;
  birthGuardianTree: OghamTree;
  seasonalOracleTree: OghamTree;
  druidWisdomScore: number;     // 0 ~ 100 대자연 공명 점수
  treeMedicinePrescription: string;
  natureAttunementAffirmation: string;
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

export function calculateCelticTreeOgham(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
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

  // 드루이드 공명 점수 (70 ~ 99)
  const druidWisdomScore = 72 + ((month * 7 + day * 13) % 27);

  const treeMedicinePrescription = `내담자의 본명 수호목은 [${birthGuardianTree.nameOgham} - ${birthGuardianTree.nameTreeKo}] (${birthGuardianTree.oghamLetter})입니다. 현재 시점에는 [${seasonalOracleTree.nameTreeKo}]의 [${seasonalOracleTree.guardianKeyword}] 기운이 강력하게 공명하고 있습니다. ${seasonalOracleTree.treeMedicine}.`;

  const natureAttunementAffirmation = `나는 [${birthGuardianTree.nameTreeKo}]의 깊은 뿌리처럼 흔들림 없이 안전하며, [${seasonalOracleTree.nameTreeKo}]의 푸른 잎처럼 대자연의 지혜와 풍요를 온몸으로 흡수한다.`;

  return {
    engineVersion: CELTIC_OGHAM_VERSION,
    calculatedAt: targetDate.toISOString(),
    birthGuardianTree,
    seasonalOracleTree,
    druidWisdomScore,
    treeMedicinePrescription,
    natureAttunementAffirmation
  };
}

export function formatCelticTreeOghamPrompt(report: CelticTreeOghamReport): string {
  return `### 🌲 고대 켈트 오검(Ogham) 수목 지혜 & 수호목 오라클 엔진 (${CELTIC_OGHAM_VERSION})
- **본명 수호목 (Birth Tree)**: ${report.birthGuardianTree.nameOgham} [${report.birthGuardianTree.nameTreeKo} (${report.birthGuardianTree.nameTreeEn})]
  - 오검 신성 문자: ${report.birthGuardianTree.oghamLetter} | 수호 원소: ${report.birthGuardianTree.element} | 주기: ${report.birthGuardianTree.periodKo}
  - 수호목 핵심 키워드: ${report.birthGuardianTree.guardianKeyword}
  - 드루이드 격언: "${report.birthGuardianTree.celticAphorism}"
- **현재 공명 오라클 나무**: ${report.seasonalOracleTree.nameTreeKo} (${report.seasonalOracleTree.nameOgham})
  - 계절적 조언: ${report.seasonalOracleTree.guardianKeyword}
- **대자연 공명 점수**: ${report.druidWisdomScore}점 / 100점
- **수목 치유 처방 (Tree Medicine)**: ${report.treeMedicinePrescription}
- **자연 조율 확언 (Affirmation)**: ${report.natureAttunementAffirmation}`;
}
