/**
 * 고대 그리스 소크라테스(Socrates) 산파술(Maieutic) & 영혼의 배려(Epimeleia Heautou) 다이몬(Daimonion) 문답 엔진
 *
 * 플라톤 초기 대화편 《변론(Apology)》, 《테아이테토스(Theaetetus)》, 《향연(Symposium)》, 《크리톤(Crito)》, 《메논(Meno)》 원전 기반.
 * 1. 산파술(Maieutic): 스스로 진리를 낳도록 돕는 영혼의 산파술.
 * 2. 무지의 지(Docta Ignorantia): "내가 아무것도 모른다는 것을 안다." 성찰 없는 삶은 살 가치가 없다.
 * 3. 다이몬(Daimonion): 잘못된 길로 들어서려 할 때 내면에서 울리는 영적 경고의 신탁.
 * 4. 엘렌코스(Elenchus): 집요한 문답을 통해 헛된 편견을 허물고 참된 앎에 이르는 과정.
 * 5. 에피멜레이아 헤아우투(Epimeleia Heautou): 외적 명예와 부보다 영혼을 가장 훌륭하게 가꾸는 배려.
 *
 * @version LUCKEY-SOCRATIC-MAIEUTIC-DAIMON-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const SOCRATIC_MAIEUTIC_DAIMON_VERSION = 'LUCKEY-SOCRATIC-MAIEUTIC-DAIMON-v2.0.0';

export interface SocraticStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  dialecticalPrinciple: string;
  actionDirective: string;
}

export interface SituationalElenchus {
  detectedTheme: string;
  dialogueSource: string;
  blindSpotDiagnostic: string;
  elenchusQuestion: string;
  maieuticPrompt: string;
}

export interface TemporalDaimonionRhythm {
  kstPhaseLabel: string;
  seasonContext: string;
  daimonClarityIndex: number;
  recommendedPractice: string;
}

export interface DialecticSynthesisMatrix {
  aporiaCourage: number;
  daimonAttunement: number;
  maieuticClarity: number;
  primaryBottleneck: string;
  synthesisDirective: string;
}

export interface SocraticMaieuticDaimonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  maieuticDialogueScore: number;       // 산파술 산파 문답력
  daimonionWarningSensitivity: number; // 다이몬 내면 직관 감응도
  doctaIgnorantiaHumility: number;     // 무지의 지 지적 겸허성
  elenchusRefutationClarity: number;   // 엘렌코스 편견 타파 명료도
  epimeleiaSoulCareIntegrity: number;  // 영혼의 배려 돌봄 품격도
  // 세부 명세
  activeSocraticStage: SocraticStage;
  primarySocraticAphorism: {
    themeKo: string;
    greekClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  socraticPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  // v2.0.0 질적 성찰 & 시공간·다차원 교차 검증
  situationalElenchus: SituationalElenchus;
  temporalDaimonionRhythm: TemporalDaimonionRhythm;
  dialecticSynthesisMatrix: DialecticSynthesisMatrix;
}

export type SocraticMaieuticDaimonReport = SocraticMaieuticDaimonResult;

const SOCRATIC_STAGES: SocraticStage[] = [
  {
    stageLevel: 1,
    stageNameGreek: 'Aporia (아포리아)',
    stageNameKo: '기존의 거짓된 확신이 무너지는 지적 정화의 단계',
    dialecticalPrinciple: '자신이 안다고 착각했던 고정관념을 직시하고 근본적인 물음 앞에 서는 겸허함',
    actionDirective: '성급한 결론을 유보하고 모르는 것을 모른다고 인정하는 것에서부터 진짜 배움을 시작하십시오.',
  },
  {
    stageLevel: 2,
    stageNameGreek: 'Elenchus (엘렌코스)',
    stageNameKo: '내면의 모순을 날카롭게 해체하는 성찰적 반박',
    dialecticalPrinciple: '스스로의 동기와 욕망을 집요하게 검증하여 타인의 시선에서 비롯된 껍데기를 벗겨냄',
    actionDirective: '남들의 통념이나 관성에 기대지 말고 자신의 선택이 지닌 본래 이유를 스스로에게 되물으십시오.',
  },
  {
    stageLevel: 3,
    stageNameGreek: 'Maieusis (산파술)',
    stageNameKo: '영혼 깊은 곳에서 참된 통찰을 잉태하고 출산하는 과정',
    dialecticalPrinciple: '외부의 정답을 주입받는 것이 아니라 이미 영혼에 깃든 진실을 스스로 발견하여 낳음',
    actionDirective: '정답을 외부에서 구하지 말고, 이미 내면에 준비된 양심과 지혜의 목소리에 귀 기울여 실천으로 낳으십시오.',
  },
  {
    stageLevel: 4,
    stageNameGreek: 'Epimeleia Heautou (영혼의 돌봄)',
    stageNameKo: '외적 성공을 넘어 영혼의 탁월함을 가꾸는 삶의 완성',
    dialecticalPrinciple: '재물과 명예보다 정의와 지혜, 영혼의 온전함을 삶의 최우선 가치로 확립함',
    actionDirective: '세속의 분주함 속에서도 날마다 자신의 영혼이 바르고 고결하게 성장하고 있는지 살피십시오.',
  },
];

const SOCRATIC_APHORISMS = [
  {
    themeKo: '성찰하는 삶의 존엄',
    greekClassic: 'Ho de anexetastos bios ou biotos anthropo',
    coreEssence: '검토되지 않고 성찰 없는 삶은 인간으로서 살아갈 가치가 없다는 소크라테스의 단호한 선언입니다.',
    actionableDirective: '무의식적인 일상의 관성을 멈추고 오늘 나의 선택이 진정으로 영혼을 풍요롭게 하는지 물으십시오.',
  },
  {
    themeKo: '다이몬(Daimonion) - 내면의 신성한 경고',
    greekClassic: 'Theion ti kai daimonion gignetai',
    coreEssence: '부당하거나 그릇된 길로 나아가려 할 때 영혼 안에서 울리는 조용하지만 명확한 멈춤의 신호입니다.',
    actionableDirective: '불안이나 찝찝함이 마음을 스친다면 욕심으로 밀어붙이지 말고 즉시 멈추어 내면을 정돈하십시오.',
  },
  {
    themeKo: '무지의 지 - 진정한 지혜의 출발점',
    greekClassic: 'Hosa me oida oude oiomai eidenai',
    coreEssence: '자신이 알지 못하는 것을 안다고 착각하지 않는 진실한 태도가 모든 위대한 도약의 토대입니다.',
    actionableDirective: '모든 것을 통제하려는 오만을 내려놓고 열린 마음으로 사태의 본질을 겸허히 마주하십시오.',
  },
  {
    themeKo: '영혼의 탁월함(Aretē) 추구',
    greekClassic: 'Ou gar ek chrematon arete gignetai, all ek tes aretes chremata',
    coreEssence: '재물이 덕을 낳는 것이 아니라, 덕이 재물과 다른 모든 인간적인 좋은 것들을 가져다줍니다.',
    actionableDirective: '눈앞의 이익보다 과정의 고결함과 신뢰를 우선시할 때 오래 지속되는 성취가 찾아옵니다.',
  },
];

function getKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: kstDate.toISOString().replace('Z', '+09:00'),
  };
}

function analyzeSituationalElenchus(question: string | undefined, absHash: number): SituationalElenchus {
  const q = (question ?? '').trim();
  if (/선택|결정|갈등|고민|해야|말아야|이직|포기|계속/.test(q)) {
    return {
      detectedTheme: '선택의 기로와 내면 다이몬의 검증',
      dialogueSource: '플라톤 《변론(Apology)》 31d · 40a',
      blindSpotDiagnostic: '결과적 이해득실에만 매몰되어 내면의 다이몬이 보내는 불편함이나 양심의 신호를 외면하고 있을 가능성이 큽니다.',
      elenchusQuestion: '지금 망설이는 두 길 중 어느 쪽을 택했을 때, 타인의 박수가 사라진 뒤에도 스스로에게 떳떳할 수 있습니까?',
      maieuticPrompt: '이익의 계산표를 잠시 덮고, 내면의 다이몬이 멈추라고 속삭이는 지점이 어디인지 적나라하게 적어 보십시오.',
    };
  }
  if (/관계|사람|사랑|친구|가족|동료|연애|서운|배신|미움/.test(q)) {
    return {
      detectedTheme: '관계 속의 정의와 영혼의 배려',
      dialogueSource: '플라톤 《크리톤(Crito)》 49b · 《향연》 210a',
      blindSpotDiagnostic: '상대의 인정이나 평판(Doxa)을 진실한 유대와 혼동하여 영혼의 중심을 타인에게 넘겨주고 있을 수 있습니다.',
      elenchusQuestion: '내가 상대에게 바라는 것은 진정한 선(善)의 공유입니까, 아니면 내 불안을 달래줄 일시적 동의입니까?',
      maieuticPrompt: '부당함에 부당함으로 맞서지 않으면서도 나의 영혼을 훼손하지 않는 품격 있는 경계를 문장으로 세워 보십시오.',
    };
  }
  if (/돈|재물|성공|사업|돈벌이|취업|합격|승진|명예|인정/.test(q)) {
    return {
      detectedTheme: '외적 성취와 영혼 탁월함(Aretē)의 전도',
      dialogueSource: '플라톤 《변론(Apology)》 30b',
      blindSpotDiagnostic: '수단인 재물과 지위가 목적인 영혼의 건강을 앞질러, 성취할수록 오히려 공허해지는 역설에 놓여 있습니다.',
      elenchusQuestion: '당신이 얻으려는 외적 성취가 영혼의 덕을 키웁니까, 아니면 덕을 깎아내리면서까지 껍데기를 불리고 있습니까?',
      maieuticPrompt: '이 일이 끝난 뒤 나의 품격과 신뢰가 얼마나 더 단단해질지를 먼저 점검하고 방향을 조율하십시오.',
    };
  }
  if (/불안|두려|모르겠|막막|실패|후회|자책|외로|우울/.test(q)) {
    return {
      detectedTheme: '무지의 지(아포리아)와 두려움의 해체',
      dialogueSource: '플라톤 《메논(Meno)》 84a · 《테아이테토스》 150b',
      blindSpotDiagnostic: '아직 일어나지 않은 미래를 이미 다 아는 것처럼 단정 지어 스스로를 무력한 공포 속에 가두고 있습니다.',
      elenchusQuestion: '당신을 괴롭히는 그 두려움은 실제 경험한 사실입니까, 아니면 검증되지 않은 추측을 사실로 믿은 결과입니까?',
      maieuticPrompt: '모르는 것은 모른다고 인정하는 아포리아의 빈 공간에서 비로소 새로운 통찰이 잉태됨을 믿고 호흡을 고르십시오.',
    };
  }

  const fallbackIdx = absHash % 2;
  if (fallbackIdx === 0) {
    return {
      detectedTheme: '관성적 통념 해체와 자기 성찰',
      dialogueSource: '플라톤 《테아이테토스(Theaetetus)》 150c',
      blindSpotDiagnostic: '남들이 당연시하는 기준을 내 삶의 답으로 무비판적으로 받아들여 내면의 진짜 질문이 가려져 있습니다.',
      elenchusQuestion: '지금 내가 당연하다고 믿고 있는 전제 가운데, 한 번도 직접 검증해 보지 않은 것은 무엇입니까?',
      maieuticPrompt: '외부의 정답을 빌려오지 말고 오늘 나만의 언어로 단 하나의 정직한 질문을 새로 써 보십시오.',
    };
  }
  return {
    detectedTheme: '영혼의 돌봄(Epimeleia)과 본질 회복',
    dialogueSource: '플라톤 《변론(Apology)》 38a',
    blindSpotDiagnostic: '분주한 일정과 작은 성과에 시선을 빼앗겨 삶의 근본 방향을 점검하는 성찰의 시간을 미루고 있습니다.',
    elenchusQuestion: '오늘 하루의 분주함 속에서 정작 내 영혼을 가장 맑고 강건하게 만든 행동은 무엇이었습니까?',
    maieuticPrompt: '단 10분이라도 모든 소음을 끄고 내면의 다이몬과 마주 앉아 오늘의 선택을 검토하십시오.',
  };
}

function buildTemporalDaimonionRhythm(hour: number, month: number, daimonSensitivity: number): TemporalDaimonionRhythm {
  let kstPhaseLabel = '';
  let phaseBonus = 0;
  let recommendedPractice = '';

  if (hour >= 4 && hour < 9) {
    kstPhaseLabel = '아포리아 새벽 관조기 (04~09시)';
    phaseBonus = 8;
    recommendedPractice = '세속의 소음이 들리기 전, 어제의 편견을 비우고 내면 다이몬의 첫 신호를 듣는 침묵 문답이 가장 맑게 작동하는 시간입니다.';
  } else if (hour >= 9 && hour < 14) {
    kstPhaseLabel = '엘렌코스 오전 문답기 (09~14시)';
    phaseBonus = 5;
    recommendedPractice = '마주하는 의견과 선택지마다 "왜 그러한가"를 세 번 되물어 헛된 전제를 가려내기에 적합한 명료한 시간대입니다.';
  } else if (hour >= 14 && hour < 20) {
    kstPhaseLabel = '산파술 오후 실천기 (14~20시)';
    phaseBonus = 3;
    recommendedPractice = '타인과의 대화 속에서 정답을 강요하기보다 상대와 나 모두의 진실이 스스로 드러나도록 경청의 산파술을 행하십시오.';
  } else {
    kstPhaseLabel = '에피멜레이아 밤 성찰기 (20~04시)';
    phaseBonus = 7;
    recommendedPractice = '하루의 행적을 영혼의 법정 앞에 올려놓고, 다이몬의 경고를 거스른 지점은 없었는지 정직하게 회고하십시오.';
  }

  let seasonContext = '겨울(Winter · 내면 심화기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 진리 잉태기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 담대한 변증기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 영혼 수확기)';

  const daimonClarityIndex = Math.min(99, Math.max(45, daimonSensitivity + phaseBonus));

  return {
    kstPhaseLabel,
    seasonContext,
    daimonClarityIndex,
    recommendedPractice,
  };
}

export function calculateSocraticMaieuticDaimon(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): SocraticMaieuticDaimonResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'SocraticMaieuticDaimon';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const maieuticDialogueScore = 63 + (absHash % 36);
  const daimonionWarningSensitivity = 65 + ((absHash >> 3) % 34);
  const doctaIgnorantiaHumility = 60 + ((absHash >> 6) % 39);
  const elenchusRefutationClarity = 58 + ((absHash >> 9) % 41);
  const epimeleiaSoulCareIntegrity = 62 + ((absHash >> 12) % 37);

  const stageIndex = (absHash >> 4) % SOCRATIC_STAGES.length;
  const aphorismIndex = (absHash >> 7) % SOCRATIC_APHORISMS.length;

  const activeSocraticStage = SOCRATIC_STAGES[stageIndex];
  const primarySocraticAphorism = SOCRATIC_APHORISMS[aphorismIndex];

  const { hour, month, isoKst } = getKstComponents(now);
  const situationalElenchus = analyzeSituationalElenchus(question, absHash);
  const temporalDaimonionRhythm = buildTemporalDaimonionRhythm(hour, month, daimonionWarningSensitivity);

  const aporiaCourage = Math.round((doctaIgnorantiaHumility * 0.6 + elenchusRefutationClarity * 0.4));
  const daimonAttunement = Math.round((daimonionWarningSensitivity * 0.55 + temporalDaimonionRhythm.daimonClarityIndex * 0.45));
  const maieuticClarity = Math.round((maieuticDialogueScore * 0.55 + epimeleiaSoulCareIntegrity * 0.45));

  const minAxis = Math.min(aporiaCourage, daimonAttunement, maieuticClarity);
  let primaryBottleneck = '무지의 지(아포리아) 용기 보강 필요';
  let synthesisDirective = '완벽한 답을 쥐려는 긴장을 내려놓고 모르는 지점을 정직하게 인정할 때 돌파구가 열립니다.';
  if (minAxis === daimonAttunement) {
    primaryBottleneck = '내면 다이몬 신호 경청 강화 필요';
    synthesisDirective = '결정 직전 스치는 미세한 망설임과 양심의 멈춤 신호를 논리로 덮지 말고 1분간 유보하십시오.';
  } else if (minAxis === maieuticClarity) {
    primaryBottleneck = '산파술 자기 문답 구체화 필요';
    synthesisDirective = '타인의 조언을 수집하는 일을 멈추고 스스로의 말로 핵심 질문을 한 문장으로 빚어내십시오.';
  }

  const dialecticSynthesisMatrix: DialecticSynthesisMatrix = {
    aporiaCourage,
    daimonAttunement,
    maieuticClarity,
    primaryBottleneck,
    synthesisDirective,
  };

  const counselTitle = `소크라테스 문답과 다이몬: ${activeSocraticStage.stageNameGreek}`;
  const philosophicalGuidance =
    `현재 마주한 질문('${situationalElenchus.detectedTheme}')의 해법은 밖에서 주입되는 지식이 아니라 내면의 산파술(Maieutics)에 있습니다. ` +
    `${activeSocraticStage.dialecticalPrinciple}의 태도로 성찰하십시오. ` +
    `${activeSocraticStage.actionDirective} ${situationalElenchus.elenchusQuestion}`;

  return {
    engineVersion: SOCRATIC_MAIEUTIC_DAIMON_VERSION,
    calculatedAtKst: isoKst,
    maieuticDialogueScore,
    daimonionWarningSensitivity,
    doctaIgnorantiaHumility,
    elenchusRefutationClarity,
    epimeleiaSoulCareIntegrity,
    activeSocraticStage,
    primarySocraticAphorism,
    socraticPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    situationalElenchus,
    temporalDaimonionRhythm,
    dialecticSynthesisMatrix,
  };
}

export function formatSocraticMaieuticDaimonPrompt(res: SocraticMaieuticDaimonResult): string {
  return [
    `【고대 그리스 소크라테스 산파술 & 다이몬 영혼성찰 지표 (${res.engineVersion})】`,
    `- 산파술 문답 통찰력: ${res.maieuticDialogueScore}/100 | 다이몬 감응도: ${res.daimonionWarningSensitivity}/100 | 무지의 지: ${res.doctaIgnorantiaHumility}/100`,
    `- 엘렌코스 타파력: ${res.elenchusRefutationClarity}/100 | 영혼의 배려 품격도: ${res.epimeleiaSoulCareIntegrity}/100`,
    `- 현재 문답 단계: ${res.activeSocraticStage.stageNameGreek} (${res.activeSocraticStage.stageNameKo})`,
    `- 질문 맥락 진단(${res.situationalElenchus.dialogueSource}): ${res.situationalElenchus.detectedTheme} — ${res.situationalElenchus.blindSpotDiagnostic}`,
    `- 핵심 엘렌코스 질문: "${res.situationalElenchus.elenchusQuestion}"`,
    `- 산파술 실천: ${res.situationalElenchus.maieuticPrompt}`,
    `- KST 시공간 리듬: ${res.temporalDaimonionRhythm.kstPhaseLabel} · ${res.temporalDaimonionRhythm.seasonContext} (다이몬 명료도 ${res.temporalDaimonionRhythm.daimonClarityIndex}/100)`,
    `- 변증 통합 매트릭스: 아포리아 용기 ${res.dialecticSynthesisMatrix.aporiaCourage} / 다이몬 조율 ${res.dialecticSynthesisMatrix.daimonAttunement} / 산파 명료도 ${res.dialecticSynthesisMatrix.maieuticClarity} → [${res.dialecticSynthesisMatrix.primaryBottleneck}] ${res.dialecticSynthesisMatrix.synthesisDirective}`,
    `- 성찰 핵심 격언: "${res.primarySocraticAphorism.themeKo}" [${res.primarySocraticAphorism.greekClassic}]`,
    `- 철학적 처방: ${res.socraticPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
