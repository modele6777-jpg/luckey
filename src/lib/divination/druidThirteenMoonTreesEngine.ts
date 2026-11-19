/**
 * =========================================================================
 * LUCKEY 켈트 드루이드 13대 달나무(Moon Trees) & 오검 주술 엔진
 * (Celtic Druid 13 Moon Trees & Ogham Sacred Forest Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 아일랜드 켈트 드루이드의 13개 음력 주기 수목 역법(Beth-Luis-Nion Tree Calendar)과
 * 성스러운 오검(Ogham) 문자 체계 정통 원전.
 * 
 * 1. 13대 신성 달나무 수호목 (Thirteen Sacred Moon Trees):
 *    - 자작나무 (Beth): 12.24 ~ 01.20 / 새로움, 정화, 탄생의 시작
 *    - 마가목 (Luis): 01.21 ~ 02.17 / 영적 보호, 통찰, 액운 방어
 *    - 물푸레나무 (Nion): 02.18 ~ 03.17 / 우주수(Yggdrasil), 연결, 해양
 *    - 오리나무 (Fearn): 03.18 ~ 04.14 / 전사의 방패, 용기, 결단
 *    - 버드나무 (Saille): 04.15 ~ 05.12 / 달의 물결, 직관, 상상력
 *    - 산사나무 (Uath): 05.13 ~ 06.09 / 성역의 수호, 인내, 비밀의 문
 *    - 참나무 (Duir): 06.10 ~ 07.07 / 왕의 문, 불굴의 힘, 견고함
 *    - 호랑가시나무 (Tinne): 07.08 ~ 08.04 / 전사의 창, 정의, 회복
 *    - 개암나무 (Coll): 08.05 ~ 09.01 / 지혜의 견과, 시적 영감, 지성
 *    - 포도나무 (Muin): 09.02 ~ 09.29 / 수확의 기쁨, 예언, 깊은 성찰
 *    - 담쟁이덩굴 (Gort): 09.30 ~ 10.27 / 강인한 생명력, 인내, 미로 극복
 *    - 갈대 (Ngetal): 10.28 ~ 11.24 / 유연한 직관, 조화, 깊은 치유
 *    - 엘더나무 (Ruis): 11.25 ~ 12.23 / 지혜로운 노년, 완성과 부활
 * 
 * 2. 숲의 원소 친화력 (Sacred Grove Element): 대지 / 공기 / 불 / 물
 * 3. 드루이드 숲 생체 공명 지수 (Druid Forest Resonance Score - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const DRUID_MOON_TREES_VERSION = 'LUCKEY-DRUID-MOON-TREES-v2.4.0';

export interface DruidTreeSituationalAudit {
  groveFocus: string;
  oghamGuidance: string;
  forestAction: string;
  rootCaution: string;
}

export interface DruidTreeTemporalRhythm {
  kstHour: number;
  sacredGroveWindow: string;
  lunarTreeSeason: string;
  groveTimingDirective: string;
  treeTempo: '발아' | '번성' | '침잠';
}

export interface DruidTreeSynthesisMatrix {
  resonanceGrade: '고목공명' | '유연조화' | '뿌리안정';
  birthCycleLink: string;
  nextGroveStep: string;
}

export interface DruidMoonTreeInfo {
  oghamLetter: string;
  celticName: string;
  koreanName: string;
  calendarRange: string;
  sacredAttribute: string;         // 신성한 권능
  druidTreeOmen: string;           // 드루이드 숲의 신탁
}

export interface DruidMoonTreesReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  birthTree: DruidMoonTreeInfo;
  activeCycleTree: DruidMoonTreeInfo;
  resonanceScore: number;          // 내부 연산용
  situationalTreeAudit: DruidTreeSituationalAudit;
  temporalTreeRhythm: DruidTreeTemporalRhythm;
  treeSynthesisMatrix: DruidTreeSynthesisMatrix;
  forestGuidance: string;
  synthesisMessage: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const THIRTEEN_TREES: DruidMoonTreeInfo[] = [
  {
    oghamLetter: 'ᚁ (Beith)',
    celticName: '베스 (Birch / 자작나무)',
    koreanName: '새로운 시작과 정화의 자작나무',
    calendarRange: '12월 24일 ~ 1월 20일',
    sacredAttribute: '과거의 상처를 깨끗이 씻어내고 백지에서 순수한 첫걸음을 내딛는 탄생의 힘',
    druidTreeOmen: '오래된 껍질을 벗고 새로운 순백의 가능성으로 다시 피어나라.',
  },
  {
    oghamLetter: 'ᚂ (Luis)',
    celticName: '루이스 (Rowan / 마가목)',
    koreanName: '영적 보호와 예리한 직관의 마가목',
    calendarRange: '1월 21일 ~ 2월 17일',
    sacredAttribute: '어두운 유혹과 액운을 쫓아내고 마음의 직관적 나침반을 밝히는 방패',
    druidTreeOmen: '붉은 열매처럼 번뜩이는 영감을 믿고 당신의 경계를 굳건히 지켜라.',
  },
  {
    oghamLetter: 'ᚅ (Nion)',
    celticName: '니온 (Ash / 물푸레나무)',
    koreanName: '우주수와 시공간 연결의 물푸레나무',
    calendarRange: '2월 18일 ~ 3월 17일',
    sacredAttribute: '뿌리는 심연에 닿고 가지는 하늘을 찌르는 거대한 통합과 소통의 힘',
    druidTreeOmen: '눈앞의 작은 이해관계에 얽매이지 말고 더 넓은 세계와 당신의 영혼을 이어라.',
  },
  {
    oghamLetter: 'ᚃ (Fearn)',
    celticName: '페른 (Alder / 오리나무)',
    koreanName: '불굴의 용기와 영적 수호의 오리나무',
    calendarRange: '3월 18일 ~ 4월 14일',
    sacredAttribute: '물속에서도 썩지 않는 단단함으로 폭풍우를 견뎌내는 전사의 저력',
    druidTreeOmen: '두려움에 굴복하지 마라. 정면으로 마주할 때 거센 파도도 당신을 무너뜨리지 못한다.',
  },
  {
    oghamLetter: 'ᚄ (Saille)',
    celticName: '살레 (Willow / 버드나무)',
    koreanName: '달빛의 직관과 유연한 감성의 버드나무',
    calendarRange: '4월 15일 ~ 5월 12일',
    sacredAttribute: '부드러운 유연함으로 강풍을 흘려보내고 무의식의 심오한 지혜를 길어올림',
    druidTreeOmen: '억지로 저항하지 말고 유연하게 흐름을 타라. 부드러움이 가장 강한 무기이다.',
  },
  {
    oghamLetter: 'ᚆ (Uath)',
    celticName: '우아트 (Hawthorn / 산사나무)',
    koreanName: '성역의 문과 깊은 인내의 산사나무',
    calendarRange: '5월 13일 ~ 6월 9일',
    sacredAttribute: '가시덤불 속에 순결한 꽃을 피우듯 시련 속에서 영혼을 보호하고 연마함',
    druidTreeOmen: '성급함을 버리고 때를 기다려라. 가시를 통과한 자만이 신비한 정원으로 들어선다.',
  },
  {
    oghamLetter: 'ᚇ (Duir)',
    celticName: '두이르 (Oak / 참나무)',
    koreanName: '숲의 군주와 영원한 힘의 참나무',
    calendarRange: '6월 10일 ~ 7월 7일',
    sacredAttribute: '드루이드의 상징이자 어떤 시련에도 흔들리지 않는 확고부동한 주권과 지구력',
    druidTreeOmen: '대지 깊숙이 뿌리를 내리고 숲의 왕처럼 당당하게 당신의 자리를 지켜라.',
  },
  {
    oghamLetter: 'ᚈ (Tinne)',
    celticName: '티네 (Holly / 호랑가시나무)',
    koreanName: '전사의 정의와 승리의 호랑가시나무',
    calendarRange: '7월 8일 ~ 8월 4일',
    sacredAttribute: '겨울에도 푸른 잎을 잃지 않는 기개와 공정한 도덕적 결단력',
    druidTreeOmen: '명분 없는 싸움을 피하고, 옳다고 믿는 일에는 목숨을 건 전사처럼 단호하라.',
  },
  {
    oghamLetter: 'ᚉ (Coll)',
    celticName: '콜 (Hazel / 개암나무)',
    koreanName: '지혜의 샘물과 시적 영감의 개암나무',
    calendarRange: '8월 5일 ~ 9월 1일',
    sacredAttribute: '지식의 정수를 단단한 껍질 속에 품어내는 뛰어난 지성과 창작적 통찰',
    druidTreeOmen: '내면의 침묵에서 영감의 샘물을 길어 올려라. 지혜가 당신을 자유롭게 하리라.',
  },
  {
    oghamLetter: 'ᚋ (Muin)',
    celticName: '무인 (Vine / 포도나무)',
    koreanName: '풍요로운 환희와 예언의 포도나무',
    calendarRange: '9월 2일 ~ 9월 29일',
    sacredAttribute: '달콤한 결실과 미래를 내다보는 맑은 예지, 대인관계의 풍성한 조화',
    druidTreeOmen: '당신이 땀 흘려 가꾼 수확을 마음껏 축하하고 사람들과 따스하게 나누어라.',
  },
  {
    oghamLetter: 'ᚌ (Gort)',
    celticName: '고르트 (Ivy / 담쟁이덩굴)',
    koreanName: '강인한 생명력과 끈기 있는 담쟁이덩굴',
    calendarRange: '9월 30일 ~ 10월 27일',
    sacredAttribute: '험난한 바위벽을 타고 올라 마침내 정상에 이르는 끈기와 회복력',
    druidTreeOmen: '한 걸음씩 꾸준히 전진하라. 포기하지 않는 끈기가 모든 미로를 뚫어낸다.',
  },
  {
    oghamLetter: 'ᚍ (Ngetal)',
    celticName: '게탈 (Reed / 갈대)',
    koreanName: '치유의 속삭임과 조화로운 소통의 갈대',
    calendarRange: '10월 28일 ~ 11월 24일',
    sacredAttribute: '바람에 실려오는 숨은 진실을 감지하고 갈등을 평화롭게 치유하는 유연성',
    druidTreeOmen: '마음을 비우고 바람의 소리에 귀 기울여라. 유연한 태도가 막힌 대화를 푼다.',
  },
  {
    oghamLetter: 'ᚎ (Ruis)',
    celticName: '루이스 (Elder / 엘더나무)',
    koreanName: '순환의 완성과 성숙한 지혜의 엘더나무',
    calendarRange: '11월 25일 ~ 12월 23일',
    sacredAttribute: '한 주기를 마무리하고 새로운 재생을 준비하는 깊은 통찰과 영혼의 안식',
    druidTreeOmen: '끝은 곧 새로운 시작이다. 감사함으로 정리하고 다음 도약을 준비하라.',
  },
];

function getKstDruidParts(now: Date): { hour: number; month: number } {
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

function buildDruidTreeSituationalAudit(
  question: string,
  birthTree: DruidMoonTreeInfo,
  activeTree: DruidMoonTreeInfo
): DruidTreeSituationalAudit {
  const q = question.toLowerCase();
  if (/일|선택|결정|새로|시작|이직|도전/.test(q)) {
    return {
      groveFocus: `[${activeTree.koreanName}] 달나무 주기 — 뿌리와 새 가지의 균형`,
      oghamGuidance: activeTree.sacredAttribute,
      forestAction: `${birthTree.koreanName}의 본질을 바탕으로, 오늘 뻗어낼 가장 현실적인 작은 가지 하나를 선택하십시오.`,
      rootCaution: '뿌리를 내리기도 전에 수관만 무성하게 키우려는 조급함을 경계하십시오.',
    };
  }
  if (/관계|사람|가족|사랑|갈등|지치|치유/.test(q)) {
    return {
      groveFocus: `${birthTree.oghamLetter} · 숲의 경계와 순환 치유`,
      oghamGuidance: birthTree.sacredAttribute,
      forestAction: '나무와 나무가 적당한 간격을 둘 때 함께 자라듯, 감정의 거리와 휴식을 확보하십시오.',
      rootCaution: '타인의 계절에 내 리듬을 억지로 맞추느라 소진되지 마십시오.',
    };
  }
  return {
    groveFocus: `${activeTree.koreanName} · 오검 숲 순환`,
    oghamGuidance: activeTree.druidTreeOmen,
    forestAction: '잠시 호흡을 고르며 오늘 내 안의 나무가 필요로 하는 햇빛과 물이 무엇인지 살피십시오.',
    rootCaution: '계절의 속도를 앞지르려 하지 마십시오.',
  };
}

function buildDruidTreeTemporalRhythm(now: Date): DruidTreeTemporalRhythm {
  const { hour, month } = getKstDruidParts(now);

  let sacredGroveWindow = '여명 네메톤(Nemeton) 이슬 창';
  let treeTempo: DruidTreeTemporalRhythm['treeTempo'] = '발아';
  let groveTimingDirective = '이슬을 머금은 나무처럼 맑은 정신으로 하루의 방향을 정하기 좋습니다.';

  if (hour >= 5 && hour < 10) {
    sacredGroveWindow = '여명 네메톤(Nemeton) 이슬 창 (05~10시)';
    treeTempo = '발아';
    groveTimingDirective = '새로운 생각과 가벼운 시작을 열기에 가장 청명한 시간입니다.';
  } else if (hour >= 10 && hour < 17) {
    sacredGroveWindow = '주간 참나무 수관 태양 창 (10~17시)';
    treeTempo = '번성';
    groveTimingDirective = '햇빛을 받아 잎을 틔우듯 실무와 대외 활동을 왕성히 펼칠 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    sacredGroveWindow = '황혼 버드나무 달빛 정돈 창 (17~21시)';
    treeTempo = '침잠';
    groveTimingDirective = '바람을 흘려보내는 버드나무처럼 오늘의 긴장을 부드럽게 내려놓으십시오.';
  } else {
    sacredGroveWindow = '심야 뿌리 영양 축적 창 (21~05시)';
    treeTempo = '침잠';
    groveTimingDirective = '땅속 깊은 뿌리로 수분을 모으듯 조용한 수면과 안식에 들 시간입니다.';
  }

  let lunarTreeSeason = '13달나무 순환절';
  if (month >= 3 && month <= 5) lunarTreeSeason = '봄 · 오리나무·버드나무 발아절';
  else if (month >= 6 && month <= 8) lunarTreeSeason = '여름 · 참나무·개암나무 번성절';
  else if (month >= 9 && month <= 11) lunarTreeSeason = '가을 · 포도나무·갈대 수확절';
  else lunarTreeSeason = '겨울 · 자작나무·엘더나무 정화절';

  return {
    kstHour: hour,
    sacredGroveWindow,
    lunarTreeSeason,
    groveTimingDirective,
    treeTempo,
  };
}

export function calculateDruidMoonTrees(
  profile?: UserProfile,
  now: Date = new Date(),
  question: string = ''
): DruidMoonTreesReport {
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Druid';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 19 + nameStr.charCodeAt(i)) & 0x7fffffff;

  // 생일 기준 달나무 매핑
  const birthMonth = parseInt(birthStr.slice(5, 7), 10) || 1;
  const birthDay = parseInt(birthStr.slice(8, 10), 10) || 1;
  const birthTreeIdx = ((birthMonth - 1) + Math.floor(birthDay / 3)) % THIRTEEN_TREES.length;
  const birthTree = THIRTEEN_TREES[birthTreeIdx];

  // 현재 날짜 기준 활성 달나무
  const activeTreeIdx = (now.getUTCMonth() + Math.floor(now.getUTCDate() / 3)) % THIRTEEN_TREES.length;
  const activeCycleTree = THIRTEEN_TREES[activeTreeIdx];

  const resonanceScore = 74 + ((seed * 7 + now.getUTCDate() * 5) % 25);

  const forestGuidance = `당신의 탄생 수호목 [${birthTree.koreanName}]의 뿌리 깊은 힘과 오늘의 활성목 [${activeCycleTree.koreanName}]의 신탁이 어우러져 "${activeCycleTree.druidTreeOmen}"의 지혜를 전합니다.`;

  const resonanceGrade: DruidTreeSynthesisMatrix['resonanceGrade'] =
    resonanceScore >= 90 ? '고목공명' : resonanceScore >= 82 ? '유연조화' : '뿌리안정';
  const synthesisMessage = `켈트 드루이드 13달나무 역법에 따라, 당신은 [${birthTree.koreanName}]의 본질적 기질을 품고 있으며 현재 숲 공명은 [${resonanceGrade}] 상태입니다.`;
  const situationalTreeAudit = buildDruidTreeSituationalAudit(question, birthTree, activeCycleTree);
  const temporalTreeRhythm = buildDruidTreeTemporalRhythm(now);
  const treeSynthesisMatrix: DruidTreeSynthesisMatrix = {
    resonanceGrade,
    birthCycleLink: `탄생 수호목 [${birthTree.koreanName}]과 활성목 [${activeCycleTree.koreanName}]이 ${temporalTreeRhythm.sacredGroveWindow}에서 어우러집니다.`,
    nextGroveStep: situationalTreeAudit.forestAction,
  };

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
  const interpretiveBoundary = '본 켈트 드루이드 13달나무 리포트는 수목 역법의 자연 상징에 기반한 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.';
  const ritualAction = `${situationalTreeAudit.forestAction} · ${temporalTreeRhythm.groveTimingDirective}`;
  const reflectionFocus = question.trim()
    ? `‘${question.trim()}’ 앞에서 탄생 수호목 [${birthTree.koreanName}]과 활성목 [${activeCycleTree.koreanName}]이 가리키는 오늘의 균형점은 무엇입니까?`
    : `오늘 [${activeCycleTree.koreanName}] 달나무의 주기 속에서 내가 뿌리를 내리고 지키고 싶은 내면의 성역은 무엇입니까?`;

  return {
    engineVersion: DRUID_MOON_TREES_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    birthTree,
    activeCycleTree,
    resonanceScore,
    situationalTreeAudit,
    temporalTreeRhythm,
    treeSynthesisMatrix,
    forestGuidance,
    synthesisMessage,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: reflectionFocus,
    interpretiveBoundary,
  };
}

export function formatDruidMoonTreesPrompt(report: DruidMoonTreesReport): string {
  return `### 🌲 켈트 드루이드 13대 달나무(Moon Trees) & 오검 주술 엔진 (${DRUID_MOON_TREES_VERSION})
- **기준 시각(KST)**: ${report.calculatedAtKst}
- **당신의 탄생 수호목**: **${report.birthTree.koreanName}** [오검: ${report.birthTree.oghamLetter}]
  - 관할 기간: ${report.birthTree.calendarRange}
  - 신성한 권능: ${report.birthTree.sacredAttribute}
- **현재 주기 활성 수호목**: **${report.activeCycleTree.koreanName}**
  - 드루이드 신탁: "${report.activeCycleTree.druidTreeOmen}"
- **드루이드 신성 숲 공명 위상**: **${report.treeSynthesisMatrix.resonanceGrade}** (대자연 수목과의 조화 상태)
- **질문 맥락 감사**: ${report.situationalTreeAudit.groveFocus} · 실천(${report.situationalTreeAudit.forestAction}) · 경계(${report.situationalTreeAudit.rootCaution})
- **KST 시공간 리듬 (${report.temporalTreeRhythm.kstHour}시)**: ${report.temporalTreeRhythm.sacredGroveWindow} · ${report.temporalTreeRhythm.lunarTreeSeason} (${report.temporalTreeRhythm.treeTempo})
  - 시간대 지침: ${report.temporalTreeRhythm.groveTimingDirective}
- **교차 매트릭스**: ${report.treeSynthesisMatrix.birthCycleLink}
- **숲의 지혜 처방**: ${report.forestGuidance}
- **드루이드 통합 나침반**: ${report.synthesisMessage}
- **성찰 초점**: ${report.reflectionFocus}
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
