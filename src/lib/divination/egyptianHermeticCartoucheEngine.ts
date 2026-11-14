import { UserProfile } from '../sharedState';

export const EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION = '2.0.0';

export type HermeticQuestionFocus = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface EgyptianHermeticCartoucheReport {
  engineVersion: string;
  calculatedAtKst: string;
  questionFocus: HermeticQuestionFocus;
  primaryCartoucheName: string;
  hieroglyphSymbol: string;
  divineArchetype: string;
  sacredDomain: string;
  soulTriad: {
    kaVitalityIndex: number;      // 내부 정렬용 (프롬프트 비노출)
    baIndividualityIndex: number; // 내부 정렬용 (프롬프트 비노출)
    akhLuminousPurity: number;    // 내부 정렬용 (프롬프트 비노출)
  };
  triadHarmonyState: string;
  emeraldMaxim: string;
  hermeticDecree: string;
  resurrectionMatrixScore: number; // 내부 정렬용 (프롬프트 비노출)
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  temporalHermeticRhythm: {
    kstTimeLabel: string;
    nileWatchWindow: string;
    seasonalSolarTone: string;
    temporalGuidance: string;
  };
  hermeticSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  synthesisPrompt: string;
}

function getTemporalHermeticRhythm(kst: Date) {
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const nileWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 케프리(Khepri) 여명창 — 새로운 의도를 세우고 실행의 첫 빛을 여는 시간'
      : hour >= 11 && hour < 17
        ? '정오 라(Ra) 천정창 — 핵심 사안을 명료하게 직시하고 결단하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 아툼(Atum) 수렴창 — 하루의 경험을 차분히 정리하고 내면의 균형을 맞추는 시간'
          : '심야 두아트(Duat) 성찰창 — 깊은 침묵 속에서 내일의 재생을 준비하는 시간';

  const seasonalSolarTone =
    month >= 3 && month <= 5
      ? '봄 · 아케트(발아기) — 새로운 질서를 싹틔우는 시기'
      : month >= 6 && month <= 8
        ? '여름 · 태양 정점기 — 실행력과 생명력이 충만한 시기'
        : month >= 9 && month <= 11
          ? '가을 · 마트(Maat) 균형기 — 과실을 수확하고 질서를 가다듬는 시기'
          : '겨울 · 페레트(재생기) — 내면의 빛을 응축하며 다음 도약을 준비하는 시기';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    nileWatchWindow,
    seasonalSolarTone,
    temporalGuidance: `${nileWatchWindow} · ${seasonalSolarTone}의 리듬에 맞추어 카르투슈의 뜻을 실천하십시오.`,
  };
}

const CARTOUCHES = [
  { name: '오시리스 (Osiris)', symbol: '크룩과 플레일 (왕권과 지혜의 홀)', archetype: '영적 부활과 재생의 군주', domain: '역경을 통과한 뒤 맞이하는 회복과 재정비', decree: '부서진 파편들도 더 단단한 질서 속에서 다시 맞추어지리라.' },
  { name: '이시스 (Isis)', symbol: '왕좌의 관과 날개', archetype: '위대한 모성과 조화의 여신', domain: '치유와 돌봄, 흩어진 힘을 하나로 모으는 지혜', decree: '헌신과 돌봄의 시선 앞에서는 어떤 막막함도 길을 내어주리라.' },
  { name: '호루스 (Horus)', symbol: '우자트 (호루스의 맑은 눈)', archetype: '명료한 통찰과 복원의 수호자', domain: '시련 극복, 본질을 꿰뚫어 보는 높은 안목', decree: '높은 하늘을 나는 매의 시선으로 상황의 핵심을 직시하라.' },
  { name: '토트 (Thoth)', symbol: '이비스 따오기와 갈대 펜', archetype: '기록자이자 지혜와 역법의 신', domain: '기록과 정리, 말과 생각의 명료한 체계화', decree: '말과 생각에 깃든 질서가 곧 현실을 빚어내는 열쇠이니라.' },
  { name: '아누비스 (Anubis)', symbol: '자칼 머리와 황금 저울', archetype: '진실의 무게를 헤아리는 인도자', domain: '양심의 순도와 불필요한 짐을 비우는 분별', decree: '마음을 깃털처럼 가볍게 비울 때 진정한 통과가 이루어지리라.' },
  { name: '바스트 (Bastet)', symbol: '시스트럼 방울과 암고양이', archetype: '기쁨과 유연한 수호의 여신', domain: '직관적 유연성, 일상의 평화와 밝은 리듬', decree: '부드러운 미소와 가벼운 발걸음 속에 가장 단단한 방패가 있다.' },
  { name: '세크메트 (Sekhmet)', symbol: '태양 원반을 얹은 암사자', archetype: '정화하는 불꽃과 결단의 전사', domain: '낡은 미련을 태우는 용기와 정직한 돌파력', decree: '두려움 없이 핵심을 마주할 때 비로소 순수한 본질이 남으리라.' },
  { name: '프타 (Ptah)', symbol: '제드 기둥과 장인의 지팡이', archetype: '언어와 손길로 형상을 빚는 창조신', domain: '구체화, 정밀한 장인정신과 꾸준한 실행', decree: '마음에서 설계된 진실한 형상이 단단한 현실로 세워지리라.' },
  { name: '하토르 (Hathor)', symbol: '소의 뿔과 태양 원반, 거울', archetype: '사랑과 미, 축제의 여신', domain: '풍요와 감성, 일상의 기쁨을 회복하는 자비', decree: '스스로를 메마르게 두지 말고 따뜻한 기쁨으로 마음을 채워라.' },
  { name: '아문-라 (Amun-Ra)', symbol: '태양의 깃털 관', archetype: '보이지 않는 근원에서 비추는 빛', domain: '묵묵한 내면의 힘과 흔들리지 않는 중심', decree: '보이지 않는 중심에서 타오르는 너 자신의 빛을 신뢰하라.' },
  { name: '마트 (Maat)', symbol: '타조의 깃털', archetype: '우주적 정의와 균형의 여신', domain: '균형과 공정, 혼돈을 잠재우는 절제된 질서', decree: '한 치의 과장도 없는 균형 위에서 평온한 질서가 머무리라.' },
  { name: '소베크 (Sobek)', symbol: '악어 머리와 신성한 왕관', archetype: '나일의 원초적 생명력과 돌파의 수호신', domain: '생존 본능, 거친 물살을 박차고 나아가는 추진력', decree: '깊은 물살을 두려워하지 않고 앞으로 나아가는 자가 흐름을 탄다.' },
];

function classifyHermeticQuestion(question?: string): HermeticQuestionFocus {
  const q = (question || '').toLowerCase();
  if (/관계|사람|연애|가족|친구|동료|갈등|이별|약속|대화/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|시작|이직|사업|투자|계획|실행|방향|도전/.test(q)) {
    return 'decision';
  }
  if (/휴식|피로|치유|회복|불안|지침|건강|마음|상처|슬픔/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function buildHermeticGuidance(
  dominantAxis: 'ka' | 'ba' | 'akh',
  focus: HermeticQuestionFocus,
  cartoucheName: string
): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
} {
  const byAxis: Record<'ka' | 'ba' | 'akh', Record<HermeticQuestionFocus, { practice: string; ritual: string; reflection: string; counsel: string }>> = {
    ka: {
      relationship: {
        practice: '말로만 마음을 재확인하려 하기보다 작은 배려나 약속 이행처럼 눈에 보이는 행동으로 신뢰를 전해 보세요.',
        ritual: '가까운 사람과의 약속이나 작은 선물·식사 자리를 구체적인 날짜로 잡거나 정성껏 챙겨 보세요.',
        reflection: '지금 이 관계에서 말보다 실제 행동과 태도로 보여주어야 할 진심은 무엇인가요?',
        counsel: '카(Ka·실천적 생명력)가 주도할 때는 구체적인 행동 하나가 백 마디 설명을 대신합니다.',
      },
      decision: {
        practice: '거창한 구상보다 오늘 손에 잡히는 예산·체력·시간 조건을 먼저 확인하고 현실적 토대를 세우세요.',
        ritual: '결정을 실행하기 위해 당장 필요한 현실 자원 3가지를 체크리스트로 적어 점검해 보세요.',
        reflection: '이상적인 그림을 잠시 내려놓고 지금 내 체력과 시간으로 감당 가능한 첫 단계는 무엇인가요?',
        counsel: '단단한 현실 감각이 뒷받침될 때 비로소 아이디어가 실제 성과로 빚어집니다.',
      },
      healing: {
        practice: '생각을 파고들기보다 수면·식사·체온 같은 몸의 기본 리듬을 먼저 돌보는 데 집중하세요.',
        ritual: '따뜻한 물로 샤워하거나 가벼운 스트레칭을 하며 몸에 쌓인 물리적 긴장을 풀어 주세요.',
        reflection: '마음의 고민이라고 여겼던 것 중 몸이 먼저 지쳐서 신호를 보내고 있는 부분은 없나요?',
        counsel: '카(Ka)의 회복은 생각의 설득이 아니라 몸의 온기와 리듬을 되살리는 데서 시작됩니다.',
      },
      reflection: {
        practice: '머릿속에만 맴도는 생각을 일상 속 작은 루틴이나 정리 정돈이라는 물질적 행위로 옮겨 보세요.',
        ritual: '책상이나 지갑 속 어지러운 물건 3가지를 제자리에 돌려놓으며 마음의 질서를 맞춰 보세요.',
        reflection: '내 공간과 일상의 습관은 지금 내가 바라는 삶의 모습과 얼마나 닮아 있나요?',
        counsel: `${cartoucheName}의 기운 아래 몸과 공간이 정돈되면 생각도 자연스레 맑아집니다.`,
      },
    },
    ba: {
      relationship: {
        practice: '상대의 기대에 맞추느라 내 고유한 색깔을 지우지 말고, 진솔한 표현으로 나만의 경계를 드러내세요.',
        ritual: '눈치를 보며 미뤄두었던 내 진심이나 취향을 부드러운 1인칭 문장으로 표현해 보세요.',
        reflection: '관계의 평화를 지키려다 정작 나다운 솔직함을 숨기고 있는 지점은 어디인가요?',
        counsel: '바(Ba·고유한 인격)가 살아날 때 관계는 억지 맞춤이 아닌 진정한 교감으로 깊어집니다.',
      },
      decision: {
        practice: '남들이 다 가는 무난한 길보다 내 기질과 강점이 자연스럽게 빛나는 독창적인 방식을 택하세요.',
        ritual: '선택지마다 "내가 가장 나답게 일할 수 있는가?"라는 기준을 1순위로 붙여 평가해 보세요.',
        reflection: '남의 시선에서 안전해 보이는 길과 나만의 개성이 살아 숨 쉬는 길 중 무엇이 더 끌리나요?',
        counsel: '나만의 고유한 결을 살리는 선택이 결국 가장 오래 지치지 않는 길입니다.',
      },
      healing: {
        practice: '억눌렀던 감정이나 표현 욕구를 글·그림·음악 등 나만의 창조적인 통로로 안전하게 흘려보내세요.',
        ritual: '누구에게도 보여주지 않을 자유로운 메모장에 지금 마음속 말을 거르지 말고 적어 보세요.',
        reflection: '최근 나는 내 감정을 있는 그대로 표현할 나만의 안전한 출구를 가지고 있었나요?',
        counsel: '고유한 감정과 개성을 억압하지 않고 표현할 때 내면의 답답함이 풀립니다.',
      },
      reflection: {
        practice: '획일적인 기준에 나를 끼워 맞추기보다, 내가 고유하게 반응하고 기뻐하는 지점을 재발견하세요.',
        ritual: '최근 나를 가장 나답게 웃게 만들었던 순간 하나를 떠올려 그 이유를 적어 보세요.',
        reflection: '세상이 정한 역할들을 모두 내려놓았을 때 남는 고유한 나의 이름은 무엇인가요?',
        counsel: `${cartoucheName}의 인도는 남을 흉내 내는 삶이 아닌 자기만의 목소리를 깨우는 데 있습니다.`,
      },
    },
    akh: {
      relationship: {
        practice: '당장의 이해타산이나 감정의 기복을 넘어, 이 관계가 장기적으로 서로를 성장시키는지 높은 시선으로 보세요.',
        ritual: '상대의 단점 하나보다 그 사람과 함께하며 내가 배웠던 점 하나를 먼저 떠올려 보세요.',
        reflection: '사소한 오해 너머에서 이 인연이 지금 내 삶에 건네고 있는 더 큰 배움은 무엇인가요?',
        counsel: '아크(Akh·맑은 지혜)의 시선은 일시적 서운함을 넘어 관계의 본질을 보게 합니다.',
      },
      decision: {
        practice: '단기적인 유불리에 흔들리지 말고, 1년 뒤의 내가 보았을 때도 떳떳하고 명료한 원칙을 고르세요.',
        ritual: '결정을 내리기 전 1분간 눈을 감고 미래의 성숙한 내가 지금의 나에게 해줄 조언을 적어 보세요.',
        reflection: '눈앞의 급한 이익을 거두고 나면 이 선택의 가장 본질적인 가치는 무엇으로 남나요?',
        counsel: '높은 안목으로 중심 원칙을 세우면 자잘한 시행착오에 흔들리지 않습니다.',
      },
      healing: {
        practice: '지나간 상처에 묶여 있기보다 그 시간을 통과하며 얻은 내면의 단단함과 통찰을 스스로 인정해 주세요.',
        ritual: '조용한 차 한 잔을 마시며 "이 시기도 나를 더 맑게 벼려내는 과정"이라고 차분히 되새겨 보세요.',
        reflection: '힘들었던 시간을 통해 내 안에서 오히려 더 선명해지고 단단해진 가치는 무엇인가요?',
        counsel: '고통이 의미 있는 통찰로 승화될 때 마음의 무거운 껍질이 벗겨집니다.',
      },
      reflection: {
        practice: '복잡하게 얽힌 생각들을 한 문장의 명료한 원칙으로 압축해 오늘의 나침반으로 삼으세요.',
        ritual: '오늘 하루 나를 이끌어 줄 핵심 문장 하나를 정해 수첩이나 화면 첫머리에 적어 두세요.',
        reflection: '지금 내 삶의 여러 조각을 위에서 내려다볼 때 하나의 주제로 관통하는 실마리는 무엇인가요?',
        counsel: `${cartoucheName}의 빛은 흩어진 생각을 하나의 명료한 지혜로 모아 줍니다.`,
      },
    },
  };

  const entry = byAxis[dominantAxis][focus];
  return {
    practiceGuidance: entry.practice,
    ritualAction: entry.ritual,
    reflectionFocus: entry.reflection,
    counselNote: entry.counsel,
  };
}

export function calculateEgyptianHermeticCartouche(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question?: string
): EgyptianHermeticCartoucheReport {
  const kst = new Date(targetDate.getTime() + 9 * 3600000);
  const q = question || '';
  const questionFocus = classifyHermeticQuestion(q);

  let birthYear = 1990;
  let birthMonth = 1;
  let birthDay = 1;

  const bDate = profile?.basic?.birthdate;
  if (bDate) {
    const parts = bDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  let seed = birthYear * 365 + birthMonth * 31 + birthDay;
  const nameStr = profile?.basic?.name || 'Hermes';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 37 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }
  for (let i = 0; i < q.length; i++) {
    seed = (seed * 17 + q.charCodeAt(i) * (i + 3)) & 0x7fffffff;
  }

  const cartoucheIdx = Math.abs(seed + kst.getUTCMonth() + kst.getUTCDate()) % CARTOUCHES.length;
  const cartouche = CARTOUCHES[cartoucheIdx];

  const kaVitality = 72 + ((seed * 3 + kst.getUTCHours() * 7) % 27);
  const baIndividuality = 70 + ((seed * 5 + kst.getUTCDate() * 9) % 29);
  const akhPurity = 75 + ((seed * 11 + kst.getUTCMonth() * 13) % 24);

  const resurrectionScore = Math.round((kaVitality * 0.3) + (baIndividuality * 0.3) + (akhPurity * 0.4));

  const dominantAxis: 'ka' | 'ba' | 'akh' =
    kaVitality >= baIndividuality && kaVitality >= akhPurity
      ? 'ka'
      : baIndividuality >= akhPurity
        ? 'ba'
        : 'akh';

  const triadHarmonyState =
    dominantAxis === 'ka'
      ? '카(Ka·실천 생명력) 주도 — 추상적 고민을 구체적인 행동과 일상 리듬으로 옮길 때 힘이 붙는 상태'
      : dominantAxis === 'ba'
        ? '바(Ba·고유 개성) 주도 — 타인의 기준보다 자기만의 목소리와 진솔한 표현을 살릴 때 균형이 서는 상태'
        : '아크(Akh·명료한 통찰) 주도 — 눈앞의 소란을 넘어 높은 안목과 핵심 원칙으로 정리할 때 맑아지는 상태';

  const emeraldMaxim =
    dominantAxis === 'ka'
      ? '위에서 내려다본 뜻이 아래의 작은 실천 속에서 비로소 완성된다 (As above, so below).'
      : dominantAxis === 'ba'
        ? '내면의 진실한 결이 맑아질 때 바깥의 관계와 형태도 그 결을 따라 정돈된다.'
        : '부분의 혼란에 휩쓸리지 말고 전체의 질서를 비추는 중심의 빛을 먼저 회복하라.';

  const guidance = buildHermeticGuidance(dominantAxis, questionFocus, cartouche.name);
  const temporalHermeticRhythm = getTemporalHermeticRhythm(kst);
  const hermeticSynthesisMatrix = {
    coreInsight: `[${cartouche.name}] ${triadHarmonyState}`,
    recommendedAction: guidance.practiceGuidance,
    cautionNotice: guidance.reflectionFocus,
  };
  const boundaryNotice = '이는 고대 이집트 헤르메스주의 상징에 기반한 자기 성찰 참고일 뿐, 개인 점수·심리 진단·미래 예측이 아닙니다.';

  const synthesisPrompt = `
[고대 이집트 헤르메스 카르투슈 & 영혼 3위일체 오라클 실측 데이터]
======================================================================
엔진 버전: ${EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION} | 기준 일시: ${temporalHermeticRhythm.kstTimeLabel} | 질문 맥락: ${questionFocus}
----------------------------------------------------------------------
1. 𓋹 [주재 신성 카르투슈 심볼]:
   - 신성 원형: **${cartouche.name}**
   - 상형문자 표상: ${cartouche.symbol}
   - 원형 위격: ${cartouche.archetype}
   - 주재 영역: ${cartouche.domain}
2. 𓊹 [영혼 3위일체(Ka·Ba·Akh) 정성적 균형 상태]:
   - 공명 상태: ${triadHarmonyState}
   - 에메랄드 타블렛 원리: ${emeraldMaxim}
3. 📜 [헤르메스주의 칙령 & 시공간 성찰 가이드]:
   - 칙령: "${cartouche.decree}"
   - 실천 조언: ${guidance.practiceGuidance}
   - 일상 의례: ${guidance.ritualAction}
   - 성찰 질문: ${guidance.reflectionFocus}
   - 조언 요약: ${guidance.counselNote}
   - KST 시공간 리듬: ${temporalHermeticRhythm.nileWatchWindow} / ${temporalHermeticRhythm.seasonalSolarTone}
   - 교차 매트릭스: 핵심(${hermeticSynthesisMatrix.coreInsight}) | 실행(${hermeticSynthesisMatrix.recommendedAction}) | 성찰(${hermeticSynthesisMatrix.cautionNotice})
   - 경계 안내: ${boundaryNotice}
======================================================================
`.trim();

  return {
    engineVersion: EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION,
    calculatedAtKst: temporalHermeticRhythm.kstTimeLabel,
    questionFocus,
    primaryCartoucheName: cartouche.name,
    hieroglyphSymbol: cartouche.symbol,
    divineArchetype: cartouche.archetype,
    sacredDomain: cartouche.domain,
    soulTriad: {
      kaVitalityIndex: kaVitality,
      baIndividualityIndex: baIndividuality,
      akhLuminousPurity: akhPurity,
    },
    triadHarmonyState,
    emeraldMaxim,
    hermeticDecree: cartouche.decree,
    resurrectionMatrixScore: resurrectionScore,
    practiceGuidance: guidance.practiceGuidance,
    ritualAction: guidance.ritualAction,
    reflectionFocus: guidance.reflectionFocus,
    counselNote: guidance.counselNote,
    temporalHermeticRhythm,
    hermeticSynthesisMatrix,
    boundaryNotice,
    synthesisPrompt,
  };
}

export function formatEgyptianHermeticCartouchePrompt(report: EgyptianHermeticCartoucheReport): string {
  return report.synthesisPrompt;
}
