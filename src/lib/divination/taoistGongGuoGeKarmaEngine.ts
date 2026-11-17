import { UserProfile } from '../sharedState';

export const TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION = '2.1.0';

function formatGongGuoGeKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export type GongGuoGeQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export type MeritCultivationMode =
  | 'YIN_VIRTUE_SILENT'
  | 'SPEECH_PURIFICATION'
  | 'COMPASSION_ACTION'
  | 'SELF_RESTRAINT';

export interface TaoistGongGuoGeKarmaReport {
  engineVersion: string;
  calculatedAtKst: string;
  questionTheme: GongGuoGeQuestionTheme;
  cultivationMode: MeritCultivationMode;
  meritDomain: string;
  virtueMantra: string;
  netMeritScore: number; // 내부 호환용
  auspiciousConstellation: string;
  dailyGoodDeedPrescription: string;
  karmicShieldingIndex: number; // 내부 호환용
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  synthesisPrompt: string;
  gongGuoGeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

const MERIT_SYSTEMS = [
  {
    mode: 'COMPASSION_ACTION' as MeritCultivationMode,
    domain: '자비구제 (慈悲救濟 · 자애로 생명을 살리고 돕는 덕)',
    mantra: '화복무문 유인자소 선악지보 여영수형 (禍福無門 唯人自召 善惡之報 如影隨形)',
    prescription: '곤경에 처한 사람의 말을 끝까지 경청하고 작은 실질적 도움이나 따뜻한 위로를 아끼지 마십시오.',
    constellation: '북두 제1성 탐랑성(貪狼星) · 생기 생명 복덕',
  },
  {
    mode: 'SPEECH_PURIFICATION' as MeritCultivationMode,
    domain: '언덕순화 (言德純化 · 구업을 씻고 진실한 말을 베푸는 덕)',
    mantra: '불설인단 불긍기장 인유소실 제이기비 (不說人短 不矜己長 人有所失 濟以己備)',
    prescription: '타인의 허물이나 소문을 전하지 않고, 오직 용기와 자존감을 북돋우는 격려의 언어만 입 밖으로 내십시오.',
    constellation: '북두 제2성 거문성(巨門星) · 천을 신성 진리의 빛',
  },
  {
    mode: 'YIN_VIRTUE_SILENT' as MeritCultivationMode,
    domain: '음덕의행 (陰德義行 · 남이 보지 않는 곳에서 의로움을 행하는 덕)',
    mantra: '선인시선 개이불견 기복유장 유후불절 (善人是善 豈以不見 其福悠長 遺後不絶)',
    prescription: '칭찬이나 보상을 바라지 않고 주변의 어지러운 공간을 정리하거나 타인을 위한 작은 배려를 남겨두십시오.',
    constellation: '북두 제3성 녹존성(祿存星) · 화해 정화와 음덕의 곳간',
  },
  {
    mode: 'COMPASSION_ACTION' as MeritCultivationMode,
    domain: '지혜보시 (智慧布施 · 선한 배움과 올바른 길을 나누는 덕)',
    mantra: '견피소득 여기소득 견피소실 여기소실 (見彼所得 如己所得 見彼所失 如己所失)',
    prescription: '자신이 터득한 노하우나 유익한 통찰을 아낌없이 공유하여 타인의 시간을 아껴주고 눈을 밝혀주십시오.',
    constellation: '북두 제4성 문곡성(文曲星) · 문창 지혜와 총명 복덕',
  },
  {
    mode: 'SELF_RESTRAINT' as MeritCultivationMode,
    domain: '인욕화해 (忍辱和解 · 분노를 삭이고 원결을 푸는 덕)',
    mantra: '이덕보원 굴기종인 좌소무량재 화위상서 (以德報怨 屈己從人 坐消無量災 化爲祥瑞)',
    prescription: '화가 치밀어 오르는 순간 호흡을 가다듬고 침묵을 지키며, 억울함을 원망 대신 지혜로운 배움으로 승화하십시오.',
    constellation: '북두 제5성 염정성(廉貞星) · 옥형 오행 통어와 원결 용해',
  },
  {
    mode: 'SELF_RESTRAINT' as MeritCultivationMode,
    domain: '청정절제 (淸淨節制 · 욕망을 절제하고 심신을 맑히는 덕)',
    mantra: '적선이지 성신이통 적덕누공 가이장생 (積善以至 誠信以通 積德累功 可以長生)',
    prescription: '과도한 소비나 자극적인 쾌락을 멈추고 몸과 마음을 정갈하게 비워 맑은 천지 기운을 회복하십시오.',
    constellation: '북두 제6성 무곡성(武曲星) · 개양 단단한 수호 방패',
  },
  {
    mode: 'YIN_VIRTUE_SILENT' as MeritCultivationMode,
    domain: '결단구원 (決斷救援 · 용기를 내어 불의를 멈추고 약자를 돕는 덕)',
    mantra: '제위부도 긍과휼과 경노린유 물해충충 (濟危扶傾 矜寡恤孤 敬老憐幼 勿害昆蟲)',
    prescription: '부당한 상황에서 용기 있는 원칙을 견지하고, 소외되거나 상처받은 약자의 편에 서서 우산이 되어주십시오.',
    constellation: '북두 제7성 파군성(破軍星) · 요광 파사현정 결단',
  },
];

function classifyGongGuoGeTheme(question: string): GongGuoGeQuestionTheme {
  if (/(연애|사랑|관계|배우자|결혼|이별|친구|가족|동료|사람|갈등)/.test(question)) return 'relationship';
  if (/(이직|취업|사업|계약|돈|투자|선택|결정|진로|시험|합격|계획)/.test(question)) return 'decision';
  if (/(불안|우울|지침|스트레스|건강|수면|마음|회복|위로|휴식|힘들)/.test(question)) return 'healing';
  return 'reflection';
}

function buildGongGuoGeQualitativeFields(
  merit: (typeof MERIT_SYSTEMS)[number],
  theme: GongGuoGeQuestionTheme
) {
  const map: Record<GongGuoGeQuestionTheme, {
    practice: string;
    ritual: string;
    reflection: string;
    counsel: string;
  }> = {
    relationship: {
      practice: `${merit.domain}의 자리에서는 이기는 말보다 품는 태도가 더 큰 복을 부릅니다. ${merit.prescription}`,
      ritual: '오늘 누군가와 마주할 때 상대의 부족함 대신 고마웠던 점 한 가지를 먼저 떠올리고 짧게라도 표현해 보세요.',
      reflection: '최근의 관계에서 내가 받기만을 바랐던 몫은 무엇이고, 먼저 건넬 수 있는 작은 선의는 무엇인가요?',
      counsel: `공과격은 타인과의 매듭을 원망이 아닌 작은 배려로 풀 때 삶의 흐름이 가장 부드럽게 열린다고 가르칩니다.`,
    },
    decision: {
      practice: `눈앞의 단기 이익만 계산하기보다 ${merit.domain}에 부합하는 쪽을 고를 때 뒷탈이 남지 않습니다. ${merit.prescription}`,
      ritual: '중요한 결정을 앞두고 "이 선택이 나와 주변 사람 모두에게 부끄럽지 않은가?"를 한 문장으로 점검해 보세요.',
      reflection: '당장의 손익을 넘어 1년 뒤에도 마음이 떳떳할 선택은 어느 쪽인가요?',
      counsel: `태상감응편은 바른 뜻에서 나온 작은 실행이 결국 가장 견고한 신용과 기회로 돌아온다는 인과의 이치를 일깨웁니다.`,
    },
    healing: {
      practice: `지치고 흔들릴 때는 거창한 선행보다 스스로에게 가하는 자책과 과로를 멈추는 것이 먼저입니다. ${merit.prescription}`,
      ritual: '오늘 하루 나 자신을 향해 모질게 던졌던 말 한 마디를 거두고, 따뜻한 차 한 잔과 함께 휴식을 허락해 주세요.',
      reflection: '내가 남에게는 쉽게 내어주면서도 유독 나 자신에게는 인색했던 다정함은 무엇인가요?',
      counsel: `공과격의 맑은 비움은 억지스러운 의무감이 아니라, 마음을 정갈히 돌보며 내면의 평온을 회복하는 데 있습니다.`,
    },
    reflection: {
      practice: `${merit.constellation}이 비추는 오늘의 화두는 ${merit.domain}입니다. ${merit.prescription}`,
      ritual: '잠들기 전 오늘 내가 남몰래 베푼 작은 배려나 마음을 지킨 순간 하나를 마음속 장부에 조용히 적어보세요.',
      reflection: '아무도 보지 않는 자리에서 내가 지키고 싶은 삶의 품격과 기준은 무엇인가요?',
      counsel: `원료범의 《입명편》처럼 운명은 정해진 숫자가 아니라 오늘의 작은 마음씀과 실천으로 서서히 빚어지는 것입니다.`,
    },
  };
  return map[theme];
}

export function calculateTaoistGongGuoGeKarma(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question: string = ''
): TaoistGongGuoGeKarmaReport {
  const kst = new Date(targetDate.getTime() + 9 * 3600000);
  const trimmedQ = question.trim();
  const questionTheme = classifyGongGuoGeTheme(trimmedQ);

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

  let seed = birthYear * 1000 + birthMonth * 50 + birthDay;
  const nameStr = profile?.basic?.name || 'Tao';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }
  for (let i = 0; i < trimmedQ.length; i++) {
    seed = (seed * 19 + trimmedQ.charCodeAt(i)) & 0x7fffffff;
  }

  const meritIdx = (seed + kst.getUTCDay() + kst.getUTCDate()) % MERIT_SYSTEMS.length;
  const merit = MERIT_SYSTEMS[meritIdx];

  const netMeritScore = 85 + ((seed * 7 + kst.getUTCHours() * 3) % 36);
  const karmicShieldingIndex = 75 + ((seed * 13 + kst.getUTCDate() * 5) % 24);
  const qualitative = buildGongGuoGeQualitativeFields(merit, questionTheme);
  const calculatedAtKst = formatGongGuoGeKstTimestamp(targetDate);
  const gongGuoGeSynthesisMatrix = {
    dominantTension: `${questionTheme} ↔ ${merit.mode}`,
    alignmentState: `${merit.domain} · ${merit.constellation}`,
    integratedAction: `${qualitative.ritual}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const synthesisPrompt = `
[도교 태상감응편(太上感應篇) & 공과격(功過格) 적선개운 성찰 리포트 (${TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION} | ${calculatedAtKst})]
- **질문 맥락 & 수양 방향**: ${questionTheme} · ${merit.mode}
- **주재 공덕 영역**: ${merit.domain}
- **감응 북두성좌**: ${merit.constellation}
- **태상감응편 원전 훈언**: "${merit.mantra}"
- **실천 조언**: ${qualitative.practice}
- **일상 의례**: ${qualitative.ritual}
- **성찰 질문**: ${qualitative.reflection}
- **조언 요약**: ${qualitative.counsel}
- **공과격 교차 매트릭스**: 핵심 긴장(${gongGuoGeSynthesisMatrix.dominantTension}) · 조율 상태(${gongGuoGeSynthesisMatrix.alignmentState}) · 통합 실천(${gongGuoGeSynthesisMatrix.integratedAction})
- **해석 경계**: ${'태상감응편과 공과격 상징은 점수나 인과 심판이 아니라 오늘의 마음씀과 일상 행동을 성찰하기 위한 정성적 안내입니다.'}
`.trim();

  return {
    engineVersion: TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION,
    calculatedAtKst,
    questionTheme,
    cultivationMode: merit.mode,
    meritDomain: merit.domain,
    virtueMantra: merit.mantra,
    netMeritScore,
    auspiciousConstellation: merit.constellation,
    dailyGoodDeedPrescription: merit.prescription,
    karmicShieldingIndex,
    practiceGuidance: qualitative.practice,
    ritualAction: qualitative.ritual,
    reflectionFocus: qualitative.reflection,
    counselNote: qualitative.counsel,
    boundaryNotice: '태상감응편과 공과격 상징은 점수나 인과 심판이 아니라 오늘의 마음씀과 일상 행동을 성찰하기 위한 정성적 안내입니다.',
    synthesisPrompt,
    gongGuoGeSynthesisMatrix,
    interpretiveBoundary: '태상감응편과 공과격 상징은 점수나 인과 심판이 아니라 오늘의 마음씀과 일상 행동을 성찰하기 위한 정성적 안내입니다.',
  };
}

export function formatTaoistGongGuoGeKarmaPrompt(report: TaoistGongGuoGeKarmaReport): string {
  return report.synthesisPrompt;
}
