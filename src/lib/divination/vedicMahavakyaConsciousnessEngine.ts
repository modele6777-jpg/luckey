/**
 * Vedic Upanishadic Four Mahavakyas Consciousness Awakening Engine
 * 고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 의식 각성 & 참자아 성찰 엔진
 *
 * Version: LUCKEY-VEDIC-MAHAVAKYA-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const VEDIC_MAHAVAKYA_ENGINE_VERSION = 'LUCKEY-VEDIC-MAHAVAKYA-v1.1.0';

export type MahavakyaQuestionFocus = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface VedicMahavakyaParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface VedicMahavakyaReport {
  engineVersion: string;
  questionFocus: MahavakyaQuestionFocus;
  brahmanRealizationScore: number; // 내부 정렬용 (프롬프트 비노출)
  mayaIllusionDispellingIndex: number; // 내부 정렬용 (프롬프트 비노출)
  innerSohamResonance: number; // 내부 정렬용 (프롬프트 비노출)
  vrittiPattern: string; // 마음의 파동(Vritti) 상태
  vivekaLens: string; // 아디 샹카라 비베카(분별지) 관점
  activeMahavakya: {
    vedaSourceKo: string;
    sanskritPhrase: string;
    koreanMeaning: string;
    philosophicalGnosis: string;
    realLifeAffirmation: string;
  };
  shankaraNonDualWisdom: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

const FOUR_MAHAVAKYAS = [
  {
    key: 'prajnanam',
    vedaSourceKo: '리그베다 (아이타레야 우파니샤드)',
    sanskritPhrase: '프라즈냐남 브라흐마 (Prajñānam Brahma)',
    koreanMeaning: '순수한 의식(앎)이 곧 우주의 궁극 실재(Brahma)이다.',
    philosophicalGnosis: '외부 조건이나 평가에 흔들리기보다, 지금 상황을 고요히 바라보고 알아차리는 순수한 자각이 본질입니다.',
    realLifeAffirmation: '나는 상황에 휘둘리는 수동적 존재가 아니라, 모든 흐름을 또렷이 자각하는 주체다.',
  },
  {
    key: 'tat_tvam_asi',
    vedaSourceKo: '사마베다 (찬도가 우파니샤드)',
    sanskritPhrase: '타트 트밤 아시 (Tat Tvam Asi)',
    koreanMeaning: '네가 바로 그것(우주의 온전함)이다.',
    philosophicalGnosis: '해답과 인정을 바깥에서만 찾아 헤매기보다, 이미 내 안에 있는 명료함과 용기를 먼저 신뢰할 때 시야가 열립니다.',
    realLifeAffirmation: '내가 밖에서 구하던 중심과 용기는 이미 내 안에 온전히 자리하고 있다.',
  },
  {
    key: 'aham_brahmasmi',
    vedaSourceKo: '야주르베다 (브리하다란야카 우파니샤드)',
    sanskritPhrase: '아함 브라흐마스미 (Aham Brahmāsmi)',
    koreanMeaning: '내가 곧 브라만(전체의 조화)이다.',
    philosophicalGnosis: '작고 위축된 자아상에서 벗어나, 전체 맥락 속에서 당당하게 자기 역할을 감당할 때 주저함이 줄어듭니다.',
    realLifeAffirmation: '타인의 시선이나 일시적 평가가 나의 본래 가치와 중심을 훼손할 수 없다.',
  },
  {
    key: 'ayam_atma',
    vedaSourceKo: '아타르바베다 (만두캬 우파니샤드)',
    sanskritPhrase: '아야마트마 브라흐마 (Ayam Ātmā Brahma)',
    koreanMeaning: '이 개별적 영혼(Atman)이 곧 전체 실재(Brahman)이다.',
    philosophicalGnosis: '파도와 바다가 둘이 아니듯, 고립된 것처럼 느껴지는 순간에도 삶의 큰 흐름과 연결되어 있음을 자각합니다.',
    realLifeAffirmation: '나는 고립된 섬이 아니라, 더 넓은 이해와 연결 속에 호흡하고 있다.',
  },
] as const;

const SHANKARA_NON_DUAL_ADVICES = [
  '아디 샹카라의 불이론 지혜: 줄을 뱀으로 오인해 떨던 자가 등불을 켜면 두려움이 사라지듯, 과장된 불안의 실체를 사실과 분리해 바라보세요.',
  '아디 샹카라의 불이론 지혜: 거울 속 먼지를 닦으려 애쓰기보다 지금 내 손에 쥔 집착과 조건을 한 겹 내려놓을 때 시야가 맑아집니다.',
  '아디 샹카라의 불이론 지혜: 파도가 일렁여도 바다의 본성은 변하지 않듯, 감정의 흔들림 너머의 고요한 중심을 먼저 확인하세요.',
  '아디 샹카라의 불이론 지혜: 변하는 현상(Anitya)과 변하지 않는 기준(Nitya)을 분별(Viveka)할 때 불필요한 소모가 멈춥니다.',
];

function classifyMahavakyaQuestion(question?: string): MahavakyaQuestionFocus {
  const q = (question || '').toLowerCase();
  if (/연애|사랑|관계|사람|가족|친구|이별|갈등|상대|배우자|대화|서운/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|진로|이직|사업|투자|계약|시험|프로젝트|시작|방향|고민/.test(q)) {
    return 'decision';
  }
  if (/지침|불안|우울|회복|치유|피로|건강|마음|상처|슬픔|잠|스트레스/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function buildMahavakyaGuidance(
  vakyaKey: typeof FOUR_MAHAVAKYAS[number]['key'],
  focus: MahavakyaQuestionFocus
): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
} {
  const guidanceMap: Record<
    typeof FOUR_MAHAVAKYAS[number]['key'],
    Record<MahavakyaQuestionFocus, { practice: string; ritual: string; reflection: string; counsel: string }>
  > = {
    prajnanam: {
      relationship: {
        practice: '상대의 말에 즉각 반응하기 전, 내 안에서 올라오는 감정과 해석을 먼저 알아차려 보세요.',
        ritual: '대화를 시작하기 전 세 번 숨을 고르며 "나는 감정이 아니라 감정을 바라보는 자각이다"라고 속으로 읊조려 보세요.',
        reflection: '내가 상대의 태도에서 실제로 본 사실과, 내 불안이 덧붙인 해석은 어디서 갈라지나요?',
        counsel: '명료한 알아차림이 감정의 과잉 해석을 거두어 관계의 오해를 줄여 줍니다.',
      },
      decision: {
        practice: '조급한 결론 대신 현재 선택지의 사실·조건·기한을 있는 그대로 종이에 적어 객관화해 보세요.',
        ritual: '결정을 앞둔 핵심 사실 3줄만 적고, 추측과 두려움 문장은 모두 지워 보세요.',
        reflection: '감정적 압박을 걷어내고 순수한 사실만 남겼을 때 가장 먼저 보이는 방향은 무엇인가요?',
        counsel: '순수한 앎의 시선으로 상황을 바라볼 때 가장 군더더기 없는 판단이 나옵니다.',
      },
      healing: {
        practice: '지친 마음을 억지로 다그치지 말고, 지금 몸과 마음이 피로하다는 사실 자체를 판단 없이 인정해 주세요.',
        ritual: '조용한 곳에서 3분간 눈을 감고 호흡이 드나드는 감각을 그저 지켜보는 사크시(증인 의식) 명상을 해보세요.',
        reflection: '피로와 불안을 내 정체성과 동일시하며 스스로를 몰아세우고 있지는 않나요?',
        counsel: '알아차림의 공간이 열릴 때 고통은 조금씩 거리를 두고 잦아듭니다.',
      },
      reflection: {
        practice: '오늘 하루 나를 가장 크게 흔들었던 생각 하나를 붙잡지 말고 지나가는 구름처럼 바라보세요.',
        ritual: '잠들기 전 오늘 내가 알아차린 감정 1가지와 그 감정이 지나간 뒤 남은 고요함을 기록해 보세요.',
        reflection: '생각이 멈춘 자리에도 여전히 또렷이 깨어 있는 나의 중심은 어떤 모습인가요?',
        counsel: '바라보는 자각이 깊어질수록 일상의 작은 파동에 쉽게 휩쓸리지 않습니다.',
      },
    },
    tat_tvam_asi: {
      relationship: {
        practice: '상대에게서 인정이나 확신을 구걸하기보다, 나 스스로가 먼저 존중받을 만한 태도로 서 보세요.',
        ritual: '거울을 보며 스스로에게 "나는 타인의 반응으로 가치가 정해지지 않는다"고 차분히 말해 주세요.',
        reflection: '상대에게 기대고 있던 안정감을 내 안의 기준으로 되돌린다면 관계가 어떻게 달라질까요?',
        counsel: '스스로 온전함을 자각할 때 타인에게 과도한 기대나 눈치를 부리지 않게 됩니다.',
      },
      decision: {
        practice: '외부의 모범 답안이나 남들의 기준을 좇기 전에, 내가 진짜로 감당하고 싶은 삶의 결을 먼저 확인하세요.',
        ritual: '누구의 시선도 없다고 가정했을 때 선택하고 싶은 안건에 별표를 표시해 보세요.',
        reflection: '남들이 좋다고 말하는 길과 내가 진정으로 살아있음을 느끼는 길 중 지금 더 가까운 것은 무엇인가요?',
        counsel: '이미 내 안에 답의 씨앗이 있음을 믿을 때 타인의 소음이 가라앉습니다.',
      },
      healing: {
        practice: '부족한 점을 고치려 애쓰기보다 이미 잘 버텨온 내면의 회복력과 온기를 먼저 알아봐 주세요.',
        ritual: '가슴 위에 손을 얹고 오늘 하루 묵묵히 견뎌낸 자신에게 짧은 감사의 말을 건네보세요.',
        reflection: '외부에서 찾으려던 위로 중 사실은 내가 나에게 가장 먼저 주어야 할 말은 무엇인가요?',
        counsel: '온전함은 어딘가에서 얻어오는 것이 아니라 본래의 나를 다시 알아보는 일입니다.',
      },
      reflection: {
        practice: '타인과 나를 비교하며 작아지는 순간마다, 나만의 고유한 리듬과 역량을 떠올려 보세요.',
        ritual: '부러워하던 타인의 장점 하나를 내 안의 잠재된 가능성으로 바꾸어 문장으로 적어 보세요.',
        reflection: '내가 밖에서 동경하던 빛은 사실 내 안의 어떤 가치와 닮아 있나요?',
        counsel: '타트 트밤 아시의 자각은 비교의 습관을 멈추고 본래의 당당함을 되찾아 줍니다.',
      },
    },
    aham_brahmasmi: {
      relationship: {
        practice: '작은 서운함이나 방어심에 갇히지 말고, 한 걸음 물러서서 더 크고 여유로운 태도로 상대를 대해 보세요.',
        ritual: '불편한 관계에서도 먼저 경계를 명확히 세우되, 말투에는 불필요한 가시를 거두어 보세요.',
        reflection: '자존심을 지키느라 오히려 더 넓은 관계의 여백을 좁히고 있지는 않나요?',
        counsel: '내면의 크기가 커질수록 사소한 마찰에 일희일비하지 않는 단단함이 생깁니다.',
      },
      decision: {
        practice: '실패에 대한 왜소한 두려움을 접고, 책임을 감당할 수 있는 주체로서 당당하게 한 걸음을 내디뎌 보세요.',
        ritual: '미루고 있던 핵심 결정 하나에 대해 "내가 이 선택의 주인이다"라고 선언하고 첫 행동을 실행하세요.',
        reflection: '위축된 자아의 변명을 내려놓고 가장 당당한 내가 선택한다면 어떤 행동을 할까요?',
        counsel: '주체적인 선언이 망설임의 안개를 걷고 실행의 추진력을 세워 줍니다.',
      },
      healing: {
        practice: '스스로를 작고 무력한 존재로 규정짓는 내면의 비난을 멈추고 숨을 깊게 들이마셔 보세요.',
        ritual: '어깨를 펴고 1분간 깊고 느린 복식호흡을 하며 몸의 긴장을 바닥으로 내려놓으세요.',
        reflection: '나를 가장 작게 만들고 있는 내면의 문장은 사실 누구의 목소리인가요?',
        counsel: '에고의 한계를 넘어설 때 비로소 숨 쉴 틈과 회복의 힘이 돌아옵니다.',
      },
      reflection: {
        practice: '오늘 마주하는 크고 작은 일들을 귀찮은 의무가 아니라 내가 주도적으로 빚어내는 장으로 바라보세요.',
        ritual: '오늘 해내고 싶은 작은 목표 하나를 정해 시작 전과 후에 스스로에게 분명한 마침표를 찍어 주세요.',
        reflection: '내가 스스로 설정한 한계선 바깥에서 기다리고 있는 가능성은 무엇인가요?',
        counsel: '당당한 주체 의식은 일상의 태도를 수동에서 창조로 전환해 줍니다.',
      },
    },
    ayam_atma: {
      relationship: {
        practice: '나와 타인을 완전히 분리된 벽 너머의 존재로 보지 말고, 같은 시대를 건너가는 동료로 바라보세요.',
        ritual: '가까운 사람 한 명에게 안부나 고마움을 담은 짧고 진심 어린 메시지를 보내 보세요.',
        reflection: '서로 다르다고 선을 그었던 부분 너머에서 우리가 공통으로 바라는 마음은 무엇인가요?',
        counsel: '연결감을 회복할 때 관계 속 외로움과 경계심이 자연스럽게 누그러집니다.',
      },
      decision: {
        practice: '혼자만의 이익이나 단기 시야보다 나와 주변이 함께 지속 가능할 수 있는 균형점을 찾아보세요.',
        ritual: '이번 선택이 나와 연결된 사람들의 일상에 어떤 여운을 남길지 세 줄로 그려 보세요.',
        reflection: '나 혼자만 옳은 결정이 아니라 전체의 조화 속에서 오래 살아남는 선택은 무엇인가요?',
        counsel: '큰 흐름과 맞닿은 결정은 시간이 지날수록 더 단단한 지지를 얻습니다.',
      },
      healing: {
        practice: '혼자라는 고립감에 잠기지 말고, 자연의 풍경이나 신뢰할 수 있는 연결 속에 몸을 기대어 보세요.',
        ritual: '잠시 밖으로 나가 하늘이나 나무를 바라보며 내가 더 큰 생명의 리듬 속에 있음을 느껴 보세요.',
        reflection: '모든 것을 혼자 짊어져야 한다는 생각에서 벗어나 잠시 도움을 청할 수 있는 곳은 어디인가요?',
        counsel: '파도가 바다와 연결되어 있음을 기억할 때 고립감의 무게가 가벼워집니다.',
      },
      reflection: {
        practice: '작은 일상 속에서도 내가 더 큰 세계와 이어져 있음을 느끼며 오늘의 순간을 정성껏 대하세요.',
        ritual: '마시는 물 한 잔이나 식사 한 끼를 대할 때 그 재료가 내게 오기까지의 연결을 떠올려 보세요.',
        reflection: '지금 내 삶이 이미 큰 조화의 일부로 연결되어 있다면, 무엇을 더 서두를 필요가 있을까요?',
        counsel: '전체와의 일체감은 조급함을 내려놓고 깊은 평온으로 나아가게 합니다.',
      },
    },
  };

  const entry = guidanceMap[vakyaKey][focus];
  return {
    practiceGuidance: entry.practice,
    ritualAction: entry.ritual,
    reflectionFocus: entry.reflection,
    counselNote: entry.counsel,
  };
}

export function calculateVedicMahavakya(params?: VedicMahavakyaParams): VedicMahavakyaReport {
  const profile = params?.profile;
  const question = params?.question || '';
  const now = params?.now || new Date();
  const kst = new Date(now.getTime() + 9 * 3600000);

  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const questionSeed = question.split('').reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 7), 0);
  const dateSeed = kst.getUTCFullYear() * 13 + (kst.getUTCMonth() + 1) * 31 + kst.getUTCDate() * 17;
  const baseSeed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = baseSeed + questionSeed + dateSeed;

  const brahman = ((seed * 23 + 47) % 53) + 47;
  const maya = ((seed * 31 + 61) % 55) + 45;
  const soham = ((seed * 41 + 79) % 57) + 43;

  const vakyaIdx = Math.abs(seed) % FOUR_MAHAVAKYAS.length;
  const activeVakya = FOUR_MAHAVAKYAS[vakyaIdx];
  const questionFocus = classifyMahavakyaQuestion(question);

  const vrittiPattern =
    brahman >= maya && brahman >= soham
      ? '삿트바(Sattva·명료한 관조) 우세 — 집착에서 물러나 본질을 비추는 상태'
      : maya > brahman
        ? '라자스(Rajas·분별적 동요) 활성 — 외부 조건과 평가에 시선이 흩어지기 쉬운 상태'
        : '프라나-소함(Soham·호흡 조화) 안정 — 내면의 리듬을 가다듬으며 중심을 세우는 상태';

  const vivekaLens =
    questionFocus === 'decision'
      ? '니티야-아니티야 비베카(영속적 가치와 일시적 유혹의 분별)'
      : questionFocus === 'relationship'
        ? '사마드리슈티(자타의 경계를 넘어 같은 본성을 보는 평등 시선)'
        : questionFocus === 'healing'
          ? '사크시 바바(고통과 피로를 판단 없이 지켜보는 증인 의식)'
          : '아드바이타 비차라(생각의 근원을 되묻는 순수 자아 탐구)';

  const guidance = buildMahavakyaGuidance(activeVakya.key, questionFocus);

  return {
    engineVersion: VEDIC_MAHAVAKYA_ENGINE_VERSION,
    questionFocus,
    brahmanRealizationScore: brahman,
    mayaIllusionDispellingIndex: maya,
    innerSohamResonance: soham,
    vrittiPattern,
    vivekaLens,
    activeMahavakya: {
      vedaSourceKo: activeVakya.vedaSourceKo,
      sanskritPhrase: activeVakya.sanskritPhrase,
      koreanMeaning: activeVakya.koreanMeaning,
      philosophicalGnosis: activeVakya.philosophicalGnosis,
      realLifeAffirmation: activeVakya.realLifeAffirmation,
    },
    shankaraNonDualWisdom: SHANKARA_NON_DUAL_ADVICES[Math.abs(seed) % SHANKARA_NON_DUAL_ADVICES.length],
    practiceGuidance: guidance.practiceGuidance,
    ritualAction: guidance.ritualAction,
    reflectionFocus: guidance.reflectionFocus,
    counselNote: guidance.counselNote,
    boundaryNotice: '이는 베다 우파니샤드 철학에 기반한 상징적 자기 성찰 참고일 뿐, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatVedicMahavakyaPrompt(report: VedicMahavakyaReport): string {
  return `[고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 실측 데이터]
- 엔진 버전: ${report.engineVersion} | 질문 맥락: ${report.questionFocus}
- 마음 파동(Vritti): ${report.vrittiPattern}
- 분별 렌즈(Viveka): ${report.vivekaLens}
- 활성 대선언: [${report.activeMahavakya.sanskritPhrase}] (${report.activeMahavakya.vedaSourceKo})
  * 뜻: ${report.activeMahavakya.koreanMeaning}
  * 영적 본질: ${report.activeMahavakya.philosophicalGnosis}
  * 현실 확언: "${report.activeMahavakya.realLifeAffirmation}"
- 샹카라 불이론(Non-duality) 조언: ${report.shankaraNonDualWisdom}
- 실천 조언: ${report.practiceGuidance}
- 일상 의례: ${report.ritualAction}
- 성찰 질문: ${report.reflectionFocus}
- 조언 요약: ${report.counselNote}
- 경계 안내: ${report.boundaryNotice}`;
}
