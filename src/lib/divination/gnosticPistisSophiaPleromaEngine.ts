/**
 * 고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 영적 각성 엔진 (v2.0.0)
 * (gnosticPistisSophiaPleromaEngine.ts)
 *
 * 나그 함마디 문서 및 《피스티스 소피아(Pistis Sophia)》 원전 기반:
 * 질문 맥락 그노시스 감사, KST 플레로마 시공간 리듬, 에온 교차 매트릭스를
 * 백분율/점수 노출 없이 정성적으로 제공합니다.
 */

import type { UserProfile } from '../sharedState';

export const GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION = '2.2.0';

export type GnosticQuestionFocus = 'career' | 'relationship' | 'anxiety' | 'decision' | 'spiritual';

export interface DivineAeon {
  id: string;
  nameKo: string;
  greekName: string;
  divineAttribute: string;
  illuminationGift: string;
  resonanceScore: number; // 0 ~ 100 내부 계산용
}

export interface SituationalGnosticAudit {
  focus: GnosticQuestionFocus;
  pistisSophiaVerse: string;
  archonIllusionDiagnosis: string;
  demiurgeTrapWarning: string;
  pneumaLiberationStep: string;
}

export interface TemporalPleromaRhythm {
  kstHour: number;
  pleromaHourWindow: string;
  seasonalAeonFlow: string;
  pneumaClarityState: string;
  timingAdvice: string;
}

export interface PleromaSynthesisMatrix {
  pneumaSparkLabel: string;
  archonDissolutionLabel: string;
  pleromaFullnessLabel: string;
  synthesizedVerdict: string;
}

export interface GnosticPistisSophiaPleromaReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  questionFocus: GnosticQuestionFocus;
  pneumaSpiritualSparkScore: number;
  gnosisLiberationIndex: number;
  archonMatrixDissolutionRate: number;
  pleromaLightFullnessScore: number;
  primaryAeon: DivineAeon;
  secondaryAeon: DivineAeon;
  sophiaRepentanceStage: string;
  situationalGnosticAudit: SituationalGnosticAudit;
  temporalPleromaRhythm: TemporalPleromaRhythm;
  pleromaSynthesisMatrix: PleromaSynthesisMatrix;
  gnosticAwakeningGuidance: string;
  pneumaIgnitionRitual: string;
  interpretiveBoundary: string;
}

const TWELVE_AEONS_BASE: Omit<DivineAeon, 'resonanceScore'>[] = [
  {
    id: 'nous',
    nameKo: '누스',
    greekName: 'Nous',
    divineAttribute: '신성한 직관적 지성',
    illuminationGift: '물질계의 환영을 단번에 꿰뚫어 보는 본질적 혜안',
  },
  {
    id: 'aletheia',
    nameKo: '알레테이아',
    greekName: 'Aletheia',
    divineAttribute: '가면 없는 원초적 진리',
    illuminationGift: '자아를 속이는 모든 기만과 사회적 가식을 허무는 순수성',
  },
  {
    id: 'logos',
    nameKo: '로고스',
    greekName: 'Logos',
    divineAttribute: '시공간을 정렬하는 살아있는 말씀',
    illuminationGift: '혼돈 속에서 창조적 질서와 확고한 방향성을 세우는 언어력',
  },
  {
    id: 'zoe',
    nameKo: '조에',
    greekName: 'Zoe',
    divineAttribute: '마르지 않는 영원한 생명력',
    illuminationGift: '육체적 한계를 넘어 영혼 자체에서 솟아나는 활력과 회복력',
  },
  {
    id: 'anthropos',
    nameKo: '안트로포스',
    greekName: 'Anthropos',
    divineAttribute: '태초의 순수한 영적 인간 원형',
    illuminationGift: '물질에 갇힌 유한한 자아가 아닌 우주적 신성한 존재로서의 자각',
  },
  {
    id: 'ecclesia',
    nameKo: '에클레시아',
    greekName: 'Ecclesia',
    divineAttribute: '빛의 존재들의 거룩한 연대',
    illuminationGift: '고립감을 덜고 비슷한 가치관을 나누는 사람과의 깊은 유대',
  },
  {
    id: 'bythos',
    nameKo: '비토스',
    greekName: 'Bythos',
    divineAttribute: '모든 것의 근원인 무한한 신성 심연',
    illuminationGift: '판단과 분별이 멈춘 태초의 평온 속에서 얻는 궁극의 안식',
  },
  {
    id: 'sige',
    nameKo: '시게',
    greekName: 'Sige',
    divineAttribute: '소음을 잠재우는 원초적 거룩한 침묵',
    illuminationGift: '마음의 분주한 독백을 꺼뜨리고 빛의 음성을 듣는 경청의 힘',
  },
  {
    id: 'sophia',
    nameKo: '소피아',
    greekName: 'Sophia',
    divineAttribute: '하강을 거쳐 빛으로 비상하는 신성 지혜',
    illuminationGift: '어둠과 방황의 경험을 지고한 영적 나침반으로 바꾸어내는 연금술',
  },
  {
    id: 'theletos',
    nameKo: '텔레토스',
    greekName: 'Theletos',
    divineAttribute: '신성한 목적을 실현하는 절대 의지',
    illuminationGift: '의심과 유혹 앞에서도 영혼의 사명을 끝까지 밀고 나가는 부동심',
  },
  {
    id: 'agape',
    nameKo: '아가페',
    greekName: 'Agape',
    divineAttribute: '조건과 거래가 없는 우주적 순수 사랑',
    illuminationGift: '타인의 허물과 결핍을 감싸 안는 편견 없는 온기',
  },
  {
    id: 'pistis',
    nameKo: '피스티스',
    greekName: 'Pistis',
    divineAttribute: '흔들림 없는 내면의 빛에 대한 신뢰',
    illuminationGift: '눈앞의 상황이 캄캄할 때조차 플레로마의 귀환을 의심치 않는 믿음',
  },
];

const SOPHIA_REPENTANCE_STAGES = [
  '제1회개: 혼돈의 깊은 물속에서 빛의 근원을 올려다보며 부르짖음',
  '제4회개: 어둠의 아르콘들이 가하는 시련 속에서 신성한 빛의 불꽃을 사수함',
  '제7회개: 거짓 지배자들의 환영을 꿰뚫고 본래의 순수한 영적 지위를 기억함',
  '제9회개: 자아의 교만을 내려놓고 플레로마의 참된 조화에 의식을 맡김',
  '제13회개: 모든 족쇄를 끊고 플레로마의 빛의 방주에 안착하여 대자유를 얻음',
];

function detectGnosticFocus(question: string): GnosticQuestionFocus {
  const q = question.toLowerCase();
  if (/일|직장|사업|돈|재물|성공|시험|승진/.test(q)) return 'career';
  if (/사람|관계|연애|가족|친구|갈등|상처/.test(q)) return 'relationship';
  if (/불안|걱정|두려|초조|스트레스|우울|힘들/.test(q)) return 'anxiety';
  if (/선택|결정|방향|고민|시작|변화/.test(q)) return 'decision';
  return 'spiritual';
}

function buildSituationalGnosticAudit(
  focus: GnosticQuestionFocus,
  primaryAeon: DivineAeon
): SituationalGnosticAudit {
  switch (focus) {
    case 'career':
      return {
        focus,
        pistisSophiaVerse: '《도마복음》 70 — "네 안에 있는 것을 밖으로 끌어낸다면 그것은 너를 구원할 것이나, 끌어내지 못하면 그것은 너를 삼킬 것이다."',
        archonIllusionDiagnosis: `세속의 평가와 경쟁 압박은 아르콘의 통제망입니다. [${primaryAeon.nameKo}(${primaryAeon.greekName})]의 [${primaryAeon.illuminationGift}]으로 내적 기준을 세우세요.`,
        demiurgeTrapWarning: '남이 만든 성공 사다리 위에서만 나를 증명하려 들면 영적 불꽃(Pneuma)이 고갈됩니다.',
        pneumaLiberationStep: '오늘 일에서 남에게 보이기 위한 형식 한 가지를 줄이고, 내 진짜 진심이 담긴 핵심 작업에 집중하세요.',
      };
    case 'relationship':
      return {
        focus,
        pistisSophiaVerse: '《피스티스 소피아》 32 — "빛을 찾는 영혼은 어둠의 사자들이 놓은 오해와 시기의 그물을 찢고 서로의 빛을 알아본다."',
        archonIllusionDiagnosis: `관계의 답답함은 거짓 자아가 씌운 방어막 때문입니다. [${primaryAeon.nameKo}]의 은사가 본심을 비추고 있습니다.`,
        demiurgeTrapWarning: '상대의 반응에 따라 내 가치를 재단하는 거래적 태도를 경계하세요.',
        pneumaLiberationStep: '오해가 생긴 상대에게 완벽한 해명보다 솔직하고 꾸밈없는 한 문장의 진심을 건네 보세요.',
      };
    case 'anxiety':
      return {
        focus,
        pistisSophiaVerse: '《피스티스 소피아》 39 — "어둠이 아무리 깊어도 위로부터 내려온 빛의 한 줄기를 삼킬 수는 없느니라."',
        archonIllusionDiagnosis: `지금 느끼는 두려움은 운명 통제망(Heimarmene)이 만들어낸 그림자일 뿐입니다. 내 안의 [${primaryAeon.nameKo}] 불꽃은 다치지 않았습니다.`,
        demiurgeTrapWarning: '아직 일어나지 않은 최악의 시나리오를 사실처럼 믿는 것은 아르콘의 최면에 응하는 일입니다.',
        pneumaLiberationStep: '불안이 올라올 때마다 "이것은 바깥의 그림자일 뿐 내 본질이 아니다"라고 속으로 선을 그으세요.',
      };
    case 'decision':
      return {
        focus,
        pistisSophiaVerse: '《진리의 복음》 — "무지는 악몽과 같으나, 영지(Gnosis)가 도래하면 그 모든 혼란은 아침 안개처럼 사라진다."',
        archonIllusionDiagnosis: `선택의 망설임은 거짓 정보와 내면의 직관이 뒤섞였기 때문입니다. [${primaryAeon.nameKo}]의 명철함이 길을 가르고 있습니다.`,
        demiurgeTrapWarning: '두려움 때문에 선택한 타협안은 결국 더 큰 갈증을 남깁니다.',
        pneumaLiberationStep: '손익 계산을 잠시 덮고, 내 안의 양심과 영혼이 가장 맑게 숨 쉴 수 있는 선택지를 고르세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        pistisSophiaVerse: '《피스티스 소피아》 58 — "피스티스 소피아가 회개의 노래를 마치자, 빛의 보화가 열려 그녀를 본래의 자리로 이끌었느니라."',
        archonIllusionDiagnosis: `[${primaryAeon.nameKo}(${primaryAeon.greekName})] 에온이 [${primaryAeon.illuminationGift}]을 통해 플레로마의 기억을 일깨우고 있습니다.`,
        demiurgeTrapWarning: '고통이나 방황을 단순한 저주로 여기고 자책에 머무르지 마세요.',
        pneumaLiberationStep: '하루 3분 조용히 눈을 감고, 외부 소음이 닿지 않는 가슴 깊숙한 빛의 자리에 머무르세요.',
      };
  }
}

function buildTemporalPleromaRhythm(now: Date): TemporalPleromaRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let pleromaHourWindow = '심야 시게(Sige) 거룩한 침묵 시간 (22:00~05:59)';
  let pneumaClarityState = '외부 소음이 잦아들고 프뉴마(영적 불꽃)가 고요히 타오르는 시간';
  let timingAdvice = '세상의 조급함을 내려놓고 내면의 침묵 속에서 본질을 회복하세요.';

  if (kstHour >= 6 && kstHour < 12) {
    pleromaHourWindow = '오전 알레테이아(Aletheia) 진리 각성 시간 (06:00~11:59)';
    pneumaClarityState = '맑은 직관(Nous)과 진실의 시야가 가장 또렷하게 열리는 시간';
    timingAdvice = '중요한 판단과 본질적인 과업을 이른 시간에 명료하게 정리하세요.';
  } else if (kstHour >= 12 && kstHour < 18) {
    pleromaHourWindow = '오후 텔레토스(Theletos) 의지 실행 시간 (12:00~17:59)';
    pneumaClarityState = '물질계의 마찰 속에서도 영적 중심을 잃지 않고 행동하는 시간';
    timingAdvice = '현실의 과제를 담담히 처리하되 내면의 평온을 지키는 경계선을 유지하세요.';
  } else if (kstHour >= 18 && kstHour < 22) {
    pleromaHourWindow = '저녁 소피아(Sophia) 성찰 귀환 시간 (18:00~21:59)';
    pneumaClarityState = '낮의 방황과 피로를 빛의 지혜로 회수하는 정화의 시간';
    timingAdvice = '하루 동안 얽힌 감정과 오해를 털어내고 마음의 불꽃을 다시 모으세요.';
  }

  let seasonalAeonFlow = '겨울 비토스(Bythos) — 깊은 근원 속에서 내면의 빛을 보존하는 계절';
  if (kstMonth >= 3 && kstMonth <= 5) {
    seasonalAeonFlow = '봄 조에(Zoe) — 새로운 영적 생명력이 싹트고 기지개를 켜는 계절';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    seasonalAeonFlow = '여름 로고스(Logos) — 명료한 의지와 열정이 현실을 정렬하는 계절';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    seasonalAeonFlow = '가을 피스티스(Pistis) — 흔들리지 않는 내면의 신뢰를 수확하는 계절';
  }

  return {
    kstHour,
    pleromaHourWindow,
    seasonalAeonFlow,
    pneumaClarityState,
    timingAdvice,
  };
}

export interface GnosticPistisSophiaPleromaOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateGnosticPistisSophiaPleroma(
  optionsOrProfile?: GnosticPistisSophiaPleromaOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): GnosticPistisSophiaPleromaReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as GnosticPistisSophiaPleromaOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 91237;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 31) % 1000003;

  const aeonsWithScores = TWELVE_AEONS_BASE.map((aeon, idx) => {
    const score = 48 + ((seed * (idx + 3) + idx * 19) % 50);
    return { ...aeon, resonanceScore: Math.min(98, Math.max(38, score)) };
  });

  aeonsWithScores.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const primaryAeon = aeonsWithScores[0];
  const secondaryAeon = aeonsWithScores[1];

  const pneumaSpiritualSparkScore = Math.min(100, Math.max(45, Math.floor((primaryAeon.resonanceScore + secondaryAeon.resonanceScore) / 2)));
  const gnosisLiberationIndex = Math.min(100, Math.max(40, 52 + ((seed * 23) % 45)));
  const archonMatrixDissolutionRate = Math.min(100, Math.max(42, 50 + ((seed * 29) % 47)));
  const pleromaLightFullnessScore = Math.min(100, Math.max(48, Math.floor(pneumaSpiritualSparkScore * 0.5 + gnosisLiberationIndex * 0.5)));

  const stageIdx = (seed + now.getUTCDate()) % SOPHIA_REPENTANCE_STAGES.length;
  const sophiaRepentanceStage = SOPHIA_REPENTANCE_STAGES[stageIdx];

  const questionFocus = detectGnosticFocus(question);
  const situationalGnosticAudit = buildSituationalGnosticAudit(questionFocus, primaryAeon);
  const temporalPleromaRhythm = buildTemporalPleromaRhythm(now);

  const pleromaSynthesisMatrix: PleromaSynthesisMatrix = {
    pneumaSparkLabel:
      pneumaSpiritualSparkScore >= 78
        ? '내면의 프뉴마(신성한 불꽃)가 밝게 점화되어 환영을 꿰뚫는 상태'
        : '외부 소음 속에서 내면의 작은 불꽃을 조용히 지켜내야 하는 상태',
    archonDissolutionLabel: `[${primaryAeon.nameKo}]와 [${secondaryAeon.nameKo}]의 이중 조명으로 운명 통제망 해체 중`,
    pleromaFullnessLabel:
      pleromaLightFullnessScore >= 76
        ? '플레로마의 빛과 평온이 일상의 선택에 자연스럽게 스며드는 흐름'
        : '성급한 외부 증명보다 내면의 순수한 기준부터 회복할 흐름',
    synthesizedVerdict: `${primaryAeon.nameKo}(${primaryAeon.greekName})의 [${primaryAeon.illuminationGift}]을 붙들고 ${temporalPleromaRhythm.pleromaHourWindow}에 맞춰 마음을 정렬하세요.`,
  };

  const gnosticAwakeningGuidance = `당신은 물질계의 결핍에 종속된 피조물이 아니라, 플레로마의 빛에서 발원한 순수한 '프뉴마(영적 불꽃)'입니다. 현재 주재 에온 [${primaryAeon.nameKo}(${primaryAeon.greekName})]이 부여하는 [${primaryAeon.illuminationGift}]을 가동할 때 아르콘의 망상이 해체됩니다.`;
  const pneumaIgnitionRitual = `가슴 한가운데 꺼지지 않는 황금빛 백색 불꽃을 관조하며 선언하십시오: "나는 이 세상에 속해 있으나 이 세상의 물질적 조건에 갇히지 않는다. 내 안의 프뉴마는 플레로마의 영원한 빛과 하나이다."`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;

  return {
    engineVersion: GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    questionFocus,
    pneumaSpiritualSparkScore,
    gnosisLiberationIndex,
    archonMatrixDissolutionRate,
    pleromaLightFullnessScore,
    primaryAeon,
    secondaryAeon,
    sophiaRepentanceStage,
    situationalGnosticAudit,
    temporalPleromaRhythm,
    pleromaSynthesisMatrix,
    gnosticAwakeningGuidance,
    pneumaIgnitionRitual,
    interpretiveBoundary: '본 리포트는 나그 함마디 문서와 《피스티스 소피아》 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.',
  };
}

export function formatGnosticPistisSophiaPleromaPrompt(rep: GnosticPistisSophiaPleromaReport): string {
  return `[고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 연산 시각: ${rep.calculatedAtKst}
· 프뉴마·플레로마 정성 상태: ${rep.pleromaSynthesisMatrix.pneumaSparkLabel} (${rep.pleromaSynthesisMatrix.pleromaFullnessLabel})
· 주재 공명 에온: [${rep.primaryAeon.nameKo} (${rep.primaryAeon.greekName})]
  - 신성한 속성: ${rep.primaryAeon.divineAttribute}
  - 영적 조명 은사: ${rep.primaryAeon.illuminationGift}
· 보조 에온: [${rep.secondaryAeon.nameKo} (${rep.secondaryAeon.greekName})] (${rep.secondaryAeon.divineAttribute})
· 소피아의 영혼 정화 관문: ${rep.sophiaRepentanceStage}
· 질문 맥락 그노시스 감사 (${rep.situationalGnosticAudit.focus}):
  - 원전 구절: ${rep.situationalGnosticAudit.pistisSophiaVerse}
  - 통제망 진단: ${rep.situationalGnosticAudit.archonIllusionDiagnosis}
  - 환영 주의: ${rep.situationalGnosticAudit.demiurgeTrapWarning}
  - 해방 한 걸음: ${rep.situationalGnosticAudit.pneumaLiberationStep}
· KST 플레로마 시공간 리듬 (${rep.temporalPleromaRhythm.pleromaHourWindow}):
  - 프뉴마 상태: ${rep.temporalPleromaRhythm.pneumaClarityState}
  - 계절 에온 흐름: ${rep.temporalPleromaRhythm.seasonalAeonFlow}
  - 시의성 지침: ${rep.temporalPleromaRhythm.timingAdvice}
· 플레로마 교차 종합: ${rep.pleromaSynthesisMatrix.synthesizedVerdict}
· 영지주의 각성 지침: ${rep.gnosticAwakeningGuidance}
· 프뉴마 점화 명상 리추얼: ${rep.pneumaIgnitionRitual}
· 해석 경계: 본 리포트는 나그 함마디 문서와 《피스티스 소피아》 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.`;
}
