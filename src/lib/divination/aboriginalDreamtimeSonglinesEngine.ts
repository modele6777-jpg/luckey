/**
 * =========================================================================
 * LUCKEY 호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반 엔진
 * (Aboriginal Dreamtime [Jukurrpa] Songlines & Ancestral Totem Compass Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 인류 역사상 가장 오래된 6만 년 연속 구전 전승인 호주 원주민(Aboriginal)의
 * 영적 우주관 드림타임(주쿠르파, Jukurrpa / Tjukurpa)과 송라인(Songlines) 원전.
 * 
 * 1. 주쿠르파(Jukurrpa, The Dreaming):
 *    - 과거, 현재, 미래가 분리되지 않고 영원한 현재로 맥동하는 창조와 법칙의 세계.
 * 2. 송라인(Songlines, Yiri):
 *    - 창조 선조들이 노래를 부르며 대지를 걸어갈 때 새겨진 신성한 에너지 길이자 기억의 지도.
 * 3. 8대 선조 토템 정령(Ancestral Totems):
 *    - 무지개 뱀 (Rainbow Serpent / Wagyl) - 물과 생명의 근원, 심오한 변용
 *    - 붉은 캥거루 (Red Kangaroo) - 전진, 역경을 가뿐히 뛰어넘는 추진력
 *    - 에뮤 (Emu) - 지상의 겸허함, 계절과 대지의 나침반
 *    - 딩고 (Dingo) - 지혜로운 생존 본능, 무리의 결속과 수호
 *    - 웜뱃 (Wombat) - 흔들리지 않는 끈기와 깊은 기초 구축
 *    - 쿠카부라 (Kookaburra) - 새벽을 깨우는 웃음, 그림자를 흩뜨리는 기쁨
 *    - 흑고니 (Black Swan) - 미지의 신비, 상식을 뛰어넘는 우아한 기적
 *    - 오리너구리 (Platypus) - 고유한 독창성, 이질적 요소들의 완벽한 융합
 * 4. 쿠룬파(Kurunpa, 생명 영혼 에너지):
 *    - 대지와 인간, 만물을 관통하는 영적 생명력 지수.
 * 5. 다디리(Dadirri) 깊은 고요의 경청 수련:
 *    - 자연과 조상의 목소리를 가슴으로 듣는 무언의 성찰 처방.
 */

import type { UserProfile } from '../sharedState';

export const ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION = '2.3.0';

export type DreamtimeQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface AncestralTotem {
  name: string;
  nameIndigenous: string;
  element: string;
  spiritualGift: string;
  coreMessage: string;
}

export interface DreamtimeSituationalAudit {
  songlineFocus: string;
  totemMedicine: string;
  walkaboutPrescription: string;
  driftCaution: string;
}

export interface DreamtimeTemporalRhythm {
  kstHour: number;
  countryWatchWindow: string;
  seasonalCountryPhase: string;
  timingDirective: string;
  dreamingTempo: '깨어남' | '동행' | '고요';
}

export interface DreamtimeSynthesisMatrix {
  kurunpaState: '충만' | '균형' | '회복필요';
  totemSonglineLink: string;
  nextWalkaboutStep: string;
}

export interface DreamtimeSonglineReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTheme: DreamtimeQuestionTheme;
  kurunpaLifeForceIndex: number; // 내부 참조용
  kurunpaPosture: string; // 쿠룬파 정성적 상태
  activeTotem: AncestralTotem;
  songlineDirection: string; // 송라인 주재 방향
  songlineTheme: string; // 대지의 노래 테마
  dadirriPractice: string; // 다디리(Dadirri) 고요의 경청 실천
  dreamtimeWisdom: string; // 드림타임 지혜 조언
  situationalDreamtimeAudit: DreamtimeSituationalAudit;
  temporalDreamtimeRhythm: DreamtimeTemporalRhythm;
  dreamtimeSynthesisMatrix: DreamtimeSynthesisMatrix;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

const TOTEMS: AncestralTotem[] = [
  {
    name: '무지개 뱀 (Rainbow Serpent)',
    nameIndigenous: '와갈 (Wagyl / Borlung)',
    element: '수(水)와 천둥 · 생명의 근원',
    spiritualGift: '마른 대지에 비를 부르고 낡은 허물을 벗겨 새로운 창조를 촉발하는 근원적 생명력',
    coreMessage: '고정된 틀을 벗어나 흐르는 물처럼 유연하게 변화를 수용할 때 가장 위대한 창조가 일어납니다.'
  },
  {
    name: '붉은 캥거루 (Red Kangaroo)',
    nameIndigenous: '마루 (Malu)',
    element: '화(火)와 대지 · 돌파의 힘',
    spiritualGift: '뒷걸음질 치지 않고 오직 앞을 향해 큰 보폭으로 장애물을 뛰어넘는 결단과 추진력',
    coreMessage: '과거에 얽매이지 말고 당신 앞의 광활한 지평선을 향해 단숨에 도약하십시오.'
  },
  {
    name: '에뮤 (Emu)',
    nameIndigenous: '칼라야 (Kalaya)',
    element: '토(土)와 바람 · 대지의 나침반',
    spiritualGift: '날지 못하는 대신 두 발로 대지의 리듬을 정직하게 딛으며 큰 그림을 살피는 겸허한 지혜',
    coreMessage: '가장 화려한 날개보다 대지에 단단히 뿌리박은 묵묵한 발걸음이 더 먼 곳에 도달합니다.'
  },
  {
    name: '딩고 (Dingo)',
    nameIndigenous: '미란야 (Miranya)',
    element: '풍(風)과 야성 · 직관의 수호',
    spiritualGift: '황야의 거친 비바람 속에서도 무리를 지키고 위험을 사전에 감지하는 예리한 감각',
    coreMessage: '당신의 야성적 직관을 신뢰하십시오. 타협하지 않는 영혼의 경계선을 세울 때입니다.'
  },
  {
    name: '웜뱃 (Wombat)',
    nameIndigenous: '왈가 (Walga)',
    element: '지(地)와 암석 · 끈기의 요새',
    spiritualGift: '보이지 않는 땅속 깊은 곳까지 단단한 터널을 파내어 굳건한 기반을 닦는 우직한 인내',
    coreMessage: '눈앞의 요란한 성과보다 흔들리지 않는 내면의 반석과 기초를 먼저 다지십시오.'
  },
  {
    name: '쿠카부라 (Kookaburra)',
    nameIndigenous: '구구라가 (Gugurrga)',
    element: '천공(天)과 광명 · 환희의 전령',
    spiritualGift: '어둠이 채 가시지 않은 새벽녘 호탕한 웃음소리로 숲의 모든 두려움을 몰아내는 환희',
    coreMessage: '어떤 무거운 문제도 웃음과 유쾌한 관점으로 바라보면 그 무게를 잃게 됩니다.'
  },
  {
    name: '흑고니 (Black Swan)',
    nameIndigenous: '마알리 (Maali)',
    element: '심연(水)과 신비 · 우아한 기적',
    spiritualGift: '세상의 고정관념을 깨뜨리며 고요한 수면 아래에서 펼치는 우아한 전환과 기적',
    coreMessage: '남들의 상식에 갇히지 마십시오. 당신만의 독특한 빛깔이 세상에 신선한 영감을 줍니다.'
  },
  {
    name: '오리너구리 (Platypus)',
    nameIndigenous: '빌라봉 (Billabong Hermit)',
    element: '수륙양용 · 융합의 마법',
    spiritualGift: '포유류이면서 알을 낳고 물과 땅을 자유로이 넘나드는 독창적 공존의 조화',
    coreMessage: '어느 한 범주에 자신을 규정짓지 마십시오. 모순되어 보이는 다름이 당신의 최고 무기입니다.'
  }
];

const SONGLINE_DIRECTIONS = [
  { direction: '동쪽 여명의 송라인 (East Dawn Line)', theme: '새로운 씨앗 파종과 지혜로운 시작' },
  { direction: '북쪽 태양의 송라인 (North Red Earth Line)', theme: '열정과 에너지의 최고조 발산' },
  { direction: '서쪽 석양의 송라인 (West Crimson Line)', theme: '성찰과 통합, 성과의 갈무리' },
  { direction: '남쪽 별빛의 송라인 (South Southern Cross Line)', theme: '깊은 내면의 휴식과 영적 나침반' }
];

/**
 * 드림타임 송라인 및 선조 토템 나침반을 결정론적으로 연산합니다.
 */
function classifyDreamtimeTheme(question?: string): DreamtimeQuestionTheme {
  const q = (question || '').toLowerCase();
  if (/관계|연애|사랑|사람|가족|친구|이별|갈등|소통/.test(q)) return 'relationship';
  if (/선택|결정|진로|이직|사업|일|직장|시험|투자|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|회복|치유|휴식|건강|마음|위로/.test(q)) return 'healing';
  return 'reflection';
}

function getKstDreamtimeParts(now: Date): { hour: number; month: number } {
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

function buildDreamtimeSituationalAudit(
  theme: DreamtimeQuestionTheme,
  totem: AncestralTotem,
  songlineDirection: string
): DreamtimeSituationalAudit {
  if (theme === 'decision') {
    return {
      songlineFocus: `${songlineDirection} · 장기적 발걸음 방향 정렬`,
      totemMedicine: `${totem.name}의 시선으로 단기 이해득실 너머의 길 판별`,
      walkaboutPrescription: '결정을 서두르기 전에 5분간 걸으며 호흡과 발걸음이 가장 편안히 놓이는 선택을 점검하십시오.',
      driftCaution: '남의 송라인을 흉내 내느라 내 발에 맞지 않는 신발을 신지 마십시오.',
    };
  }
  if (theme === 'relationship') {
    return {
      songlineFocus: '상호 송라인 존중과 영혼의 경계선 조율',
      totemMedicine: `${totem.name}의 품성으로 다름을 인정하며 맑은 거리 유지`,
      walkaboutPrescription: '대화 전 상대의 말을 판단 없이 끝까지 듣는 다디리 경청을 먼저 실천하십시오.',
      driftCaution: '불안감으로 상대의 영역을 침범하거나 반대로 자신을 지우지 마십시오.',
    };
  }
  if (theme === 'healing') {
    return {
      songlineFocus: '쿠룬파(Kurunpa) 대지 접지 및 생명력 복원',
      totemMedicine: `${totem.name}의 자연 리듬을 빌려 소진된 기운 회복`,
      walkaboutPrescription: '자연광과 바람을 접하며 오늘 하루는 해결보다 쉼과 비움에 우선순위를 두십시오.',
      driftCaution: '지친 상태에서 억지로 속도를 올리면 길의 표지판을 놓치게 됩니다.',
    };
  }
  return {
    songlineFocus: `${songlineDirection} · 현재 순간(Jukurrpa) 각성`,
    totemMedicine: totem.spiritualGift,
    walkaboutPrescription: '오늘 마주치는 작은 우연과 느낌을 흘려보내지 말고 고요히 음미하십시오.',
    driftCaution: '과거의 후회나 미래의 불안으로 현재의 발밑을 흐리지 마십시오.',
  };
}

function buildDreamtimeTemporalRhythm(now: Date): DreamtimeTemporalRhythm {
  const { hour, month } = getKstDreamtimeParts(now);

  let countryWatchWindow = '여명 쿠카부라 새벽 노래 창';
  let dreamingTempo: DreamtimeTemporalRhythm['dreamingTempo'] = '깨어남';
  let timingDirective = '맑은 새벽 공기와 함께 오늘의 핵심 의도를 세우기 좋은 시간입니다.';

  if (hour >= 5 && hour < 10) {
    countryWatchWindow = '여명 송라인 발걸음 창 (05~10시)';
    dreamingTempo = '깨어남';
    timingDirective = '첫 발걸음을 가볍게 내딛고 오늘 집중할 한 가지 길을 정하십시오.';
  } else if (hour >= 10 && hour < 17) {
    countryWatchWindow = '정오 태양의 송라인 활동 창 (10~17시)';
    dreamingTempo = '동행';
    timingDirective = '대지 위에서 실질적인 과업과 대화를 힘차게 이어가기 알맞은 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    countryWatchWindow = '황혼 다디리(Dadirri) 경청 창 (17~21시)';
    dreamingTempo = '고요';
    timingDirective = '하루의 소음을 가라앉히고 내면의 목소리에 귀 기울일 시간입니다.';
  } else {
    countryWatchWindow = '심야 남십자성 주쿠르파 휴식 창 (21~05시)';
    dreamingTempo = '고요';
    timingDirective = '꿈과 무의식이 대지와 이어지는 시간대이므로 깊은 휴식으로 기운을 모으십시오.';
  }

  let seasonalCountryPhase = '대지 소생의 바람절';
  if (month >= 3 && month <= 5) seasonalCountryPhase = '봄 · 새싹과 씨앗 파종절';
  else if (month >= 6 && month <= 8) seasonalCountryPhase = '여름 · 태양과 생명력 발산절';
  else if (month >= 9 && month <= 11) seasonalCountryPhase = '가을 · 성찰과 갈무리절';
  else seasonalCountryPhase = '겨울 · 별빛과 내면 응축절';

  return {
    kstHour: hour,
    countryWatchWindow,
    seasonalCountryPhase,
    timingDirective,
    dreamingTempo,
  };
}

export function calculateAboriginalDreamtimeSonglines(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
}): DreamtimeSonglineReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();
  const question = options?.question?.trim() || '';
  const questionTheme = classifyDreamtimeTheme(question);

  let seed = 60000; // 호주 6만년 원주민 역사 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 19 + (parts[1] || 1) * 37 + (parts[2] || 1) * 13;
  } else {
    seed += now.getFullYear() * 17 + (now.getMonth() + 1) * 31 + now.getDate() * 23;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 23 + (m || 0) * 7;
  }

  for (let i = 0; i < question.length; i++) {
    seed = (seed * 31 + question.charCodeAt(i)) & 0x7fffffff;
  }

  // 1. 쿠룬파(Kurunpa) 대지 영혼 활력 상태
  const kurunpaLifeForceIndex = 55 + (seed % 44);
  const kurunpaPosture = kurunpaLifeForceIndex >= 85
    ? '대지의 리듬과 깊게 공명하며 생명력이 충만하게 깨어 있는 국면'
    : kurunpaLifeForceIndex >= 70
      ? '안정된 호흡 속에서 자기만의 길을 차분히 걸어가는 균형 국면'
      : '잠시 멈춰 서서 다디리(Dadirri)의 고요로 기운을 되채워야 할 회복 국면';

  // 2. 8대 선조 토템 선정
  const totemIdx = seed % TOTEMS.length;
  const activeTotem = TOTEMS[totemIdx];

  // 3. 송라인 방향 및 테마
  const dirIdx = (seed + 2) % SONGLINE_DIRECTIONS.length;
  const songline = SONGLINE_DIRECTIONS[dirIdx];

  // 4. 다디리(Dadirri) 명상 실천
  const dadirriPractices = [
    '맨발로 흙이나 잔디를 5분간 밟으며 발바닥을 통해 대지와 호흡을 주고받는 접지(Earthing) 명상',
    '말을 멈추고 바람이 나뭇잎을 스치는 소리와 주변의 자연음에 3분간 온전히 귀 기울이기',
    '흐르는 물을 응시하며 내면의 조급함을 강물에 띄워 보내는 마음의 강(Billabong) 비우기',
    '밤하늘의 남십자성과 별자리를 올려다보며 시간의 영원함 속에 내 고민의 크기를 관조하기'
  ];
  const dadirriPractice = dadirriPractices[seed % dadirriPractices.length];

  const themeGuidanceMap: Record<DreamtimeQuestionTheme, { practice: string; ritual: string; reflection: string }> = {
    relationship: {
      practice: `${activeTotem.name}의 기질처럼 상대를 통제하려 하기보다, 각자의 송라인이 존중받는 거리와 경계를 유지해 보세요.`,
      ritual: '오늘 대화를 나누기 전 3번 깊게 숨을 들이쉬며 상대의 말 이면에 있는 감정을 먼저 경청하기',
      reflection: '지금 이 관계에서 내가 지켜야 할 영혼의 경계선과 내려놓아야 할 집착은 무엇인가요?',
    },
    decision: {
      practice: `${songline.direction}이 가리키는 방향처럼, 눈앞의 유불리보다 내가 오래 걸어도 지치지 않을 길인지를 기준으로 선택하세요.`,
      ritual: '결정을 내리기 전 5분간 스마트폰을 내려놓고 조용한 산책으로 몸의 감각을 확인하기',
      reflection: '이 선택은 1년 뒤의 나에게도 대지 위에 단단히 뿌리내린 발걸음으로 남을 수 있나요?',
    },
    healing: {
      practice: `지금은 속도를 높일 때가 아니라 다디리(Dadirri)의 고요 속에서 흐트러진 쿠룬파 생명력을 다시 모을 때입니다.`,
      ritual: dadirriPractice,
      reflection: '요즘 내 마음의 땅을 가장 메마르게 만든 생각은 무엇이며, 어떤 쉼이 그 땅을 적셔 줄까요?',
    },
    reflection: {
      practice: `${activeTotem.coreMessage} 오늘 하루의 작은 징후들을 대지가 건네는 다정한 신호로 읽어 보세요.`,
      ritual: '잠들기 전 오늘 내 발걸음이 머물렀던 가장 평온한 순간 하나를 떠올리며 감사하기',
      reflection: '과거와 미래의 소음을 끄고 지금 이 순간(Jukurrpa)에 온전히 머문다면 무엇이 보이나요?',
    },
  };
  const themed = themeGuidanceMap[questionTheme];

  // 5. 드림타임 지혜 조언 (점수 노출 제거)
  const dreamtimeWisdom = `선조 정령 [${activeTotem.nameIndigenous}]의 가호 아래, 지금 당신의 발밑에는 [${songline.theme}]을 향한 송라인이 흐르고 있습니다. ${kurunpaPosture}에서 ${activeTotem.coreMessage}`;

  const situationalDreamtimeAudit = buildDreamtimeSituationalAudit(questionTheme, activeTotem, songline.direction);
  const temporalDreamtimeRhythm = buildDreamtimeTemporalRhythm(now);
  const kurunpaState: DreamtimeSynthesisMatrix['kurunpaState'] =
    kurunpaLifeForceIndex >= 85 ? '충만' : kurunpaLifeForceIndex >= 70 ? '균형' : '회복필요';
  const dreamtimeSynthesisMatrix: DreamtimeSynthesisMatrix = {
    kurunpaState,
    totemSonglineLink: `${activeTotem.name}의 파동이 ${temporalDreamtimeRhythm.countryWatchWindow} (${temporalDreamtimeRhythm.dreamingTempo} · ${temporalDreamtimeRhythm.seasonalCountryPhase}) 리듬과 공명합니다.`,
    nextWalkaboutStep: `${situationalDreamtimeAudit.songlineFocus} — ${situationalDreamtimeAudit.walkaboutPrescription}`,
  };

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
  const qLabel = question.trim() ? `"${question.trim()}"에 대해 ` : '';
  const reflectiveQuestion = `${qLabel}${themed.reflection}`;

  return {
    engineVersion: ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTheme,
    kurunpaLifeForceIndex,
    kurunpaPosture,
    activeTotem,
    songlineDirection: songline.direction,
    songlineTheme: songline.theme,
    dadirriPractice,
    dreamtimeWisdom,
    situationalDreamtimeAudit,
    temporalDreamtimeRhythm,
    dreamtimeSynthesisMatrix,
    practiceGuidance: themed.practice,
    ritualAction: themed.ritual,
    reflectionFocus: themed.reflection,
    reflectiveQuestion,
    counselNote: `[드림타임 송라인 성찰] ${activeTotem.name} · ${songline.direction} — ${themed.practice}`,
    boundaryNotice: '호주 원주민 드림타임(Jukurrpa)과 다디리(Dadirri) 개념을 바탕으로 한 상징적·성찰적 관점이며, 확정적 예언이나 의학적·재정적 진단이 아닙니다.',
    interpretiveBoundary: '호주 원주민 드림타임(Jukurrpa)과 다디리(Dadirri) 개념을 바탕으로 한 상징적·성찰적 관점이며, 확정적 예언이나 의학적·재정적 진단이 아닙니다.',
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatAboriginalDreamtimeSonglinesPrompt(report: DreamtimeSonglineReport): string {
  const t = report.activeTotem;

  return `[🪃 호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반 성찰 관점]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각(KST): ${report.calculatedAtKst} | 질문 맥락: ${report.questionTheme}
쿠룬파(Kurunpa) 상태: ${report.kurunpaPosture}
======================================================================
1. [주재 선조 토템 정령 (Ancestral Totem)]:
   - 토템명: [${t.name}] (${t.nameIndigenous})
   - 주재 원소: ${t.element}
   - 영적 선물: ${t.spiritualGift}
   - 핵심 전언: "${t.coreMessage}"

2. [송라인(Songline) 대지의 길 & 테마]:
   - 송라인 방향: ${report.songlineDirection}
   - 대지의 노래 테마: ${report.songlineTheme}

3. [다디리(Dadirri) 고요의 경청 & 실천 성찰]:
   - 다디리 수련 실천: ${report.dadirriPractice}
   - 맥락별 실천 조언: ${report.practiceGuidance}
   - 일상 의례: ${report.ritualAction}
   - 성찰 질문: ${report.reflectiveQuestion}
   - 드림타임 총평: ${report.dreamtimeWisdom}

4. [질문 맥락 감사 & KST 시공간 리듬 (${report.temporalDreamtimeRhythm.kstHour}시)]:
   - 송라인 초점: ${report.situationalDreamtimeAudit.songlineFocus} · 토템 약(Medicine): ${report.situationalDreamtimeAudit.totemMedicine}
   - 워크어바웃 처방: ${report.situationalDreamtimeAudit.walkaboutPrescription} (주의: ${report.situationalDreamtimeAudit.driftCaution})
   - 시공간 리듬: ${report.temporalDreamtimeRhythm.countryWatchWindow} · ${report.temporalDreamtimeRhythm.seasonalCountryPhase} (${report.temporalDreamtimeRhythm.dreamingTempo})
   - 시간대 지침: ${report.temporalDreamtimeRhythm.timingDirective}
   - 교차 매트릭스(${report.dreamtimeSynthesisMatrix.kurunpaState}): ${report.dreamtimeSynthesisMatrix.totemSonglineLink}
   - 해석 경계: ${report.boundaryNotice}
======================================================================`;
}
