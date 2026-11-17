/**
 * 고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁 & 태양신 레-호라크티 엔진 (egyptianSphinxDreamOracleEngine.ts)
 *
 * 기원전 1401년 이집트 신왕국 제18왕조 투트모세 4세의 '꿈의 비석(Dream Stele)' 정통 원전 기반:
 * 스핑크스 4대 신성 테트라모르프(인간의 머리·사자의 가슴·황소의 하체·독수리의 날개),
 * 질문 맥락 정성 감사, KST 태양신 레-호라크티 시공간 리듬을 교차 해독합니다.
 */

import type { UserProfile } from '../sharedState';

export const EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION = 'LUCKEY-EGYPTIAN-SPHINX-v2.3.0';

export interface SphinxVirtue {
  nameKo: string;
  symbol: string;
  score: number; // 0 ~ 100 (내부 정량 연산용)
  powerDesc: string;
}

export interface SphinxTetramorphAspects {
  humanHead: SphinxVirtue;
  lionHeart: SphinxVirtue;
  bullStrength: SphinxVirtue;
  eagleVision: SphinxVirtue;
}

export interface SphinxSituationalAudit {
  sandObstacleType: string;
  tetramorphCounterforce: string;
  dreamStelePrescription: string;
  mirageWarning: string;
}

export interface SphinxTemporalRhythm {
  kstHour: number;
  solarBarqueStage: string;
  nileHorizonSeason: string;
  dawnDirective: string;
  solarPhaseMode: '여명' | '정오' | '황혼' | '잠행';
}

export interface SphinxSynthesisMatrix {
  sandClearanceGrade: '맑음' | '걷히는중' | '정화필요';
  tetramorphSynergy: string;
  sovereignStep: string;
}

export interface EgyptianSphinxDreamOracleReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  tetramorph: SphinxTetramorphAspects;
  dominantVirtue: string;
  sandCleansingIndex: number;
  situationalSphinxAudit: SphinxSituationalAudit;
  temporalSphinxRhythm: SphinxTemporalRhythm;
  sphinxSynthesisMatrix: SphinxSynthesisMatrix;
  thutmosePromise: string;
  sphinxRiddleInsight: string;
  reHorakhtyDawnCommand: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getKstParts(now: Date): { hour: number; month: number } {
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

function buildSituationalAudit(question: string, dominantVirtue: string): SphinxSituationalAudit {
  const q = question.toLowerCase();
  if (/일|사업|직업|시험|프로젝트|승진|목표|결정/.test(q)) {
    return {
      sandObstacleType: '주도권을 가리는 과도한 신중함과 사소한 잡무의 모래',
      tetramorphCounterforce: `${dominantVirtue} 중심의 단호한 우선순위 정리`,
      dreamStelePrescription: '왕자 투트모세가 스핑크스 발치의 모래를 걷어냈듯, 오늘 가장 무거운 미결 과제 하나부터 직접 손을 대십시오.',
      mirageWarning: '완벽한 타이밍을 기다리다가 정작 행동할 시간을 모래 속에 묻어버리지 마십시오.',
    };
  }
  if (/사랑|연애|관계|배우자|사람|가족|갈등/.test(q)) {
    return {
      sandObstacleType: '말하지 못한 오해와 체면이라는 침묵의 모래',
      tetramorphCounterforce: '인간의 지혜와 사자의 진정성이 만나는 솔직한 대화',
      dreamStelePrescription: '상대의 반응을 미리 재단하지 말고, 내 마음의 중심에서 우러나는 진실을 분명한 언어로 전하십시오.',
      mirageWarning: '자존심을 지키려다 진짜 소중한 마음을 사막 바람에 날려 보내지 마십시오.',
    };
  }
  if (/건강|피로|마음|불안|잠|꿈|휴식/.test(q)) {
    return {
      sandObstacleType: '과로와 누적된 긴장이 만든 영혼의 피로',
      tetramorphCounterforce: '황소의 묵직한 안정감과 독수리의 한 발 물러선 조망',
      dreamStelePrescription: '지금 당장 모든 답을 내려 하지 말고, 충분한 수면과 고요한 휴식으로 내면의 모래 먼지를 가라앉히십시오.',
      mirageWarning: '지친 상태에서 떠오르는 불안한 생각을 현실의 예언처럼 믿지 마십시오.',
    };
  }
  return {
    sandObstacleType: '본질을 흐리는 일상의 잡념과 미뤄둔 결단',
    tetramorphCounterforce: dominantVirtue,
    dreamStelePrescription: '스핑크스 앞에서 스스로에게 가장 정직한 질문을 던지고, 핑계 없이 오늘 할 일 한 가지를 실행하십시오.',
    mirageWarning: '외부의 평가에 흔들려 자신의 왕권을 남에게 넘기지 마십시오.',
  };
}

function buildTemporalRhythm(now: Date): SphinxTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let solarBarqueStage = '케프리(Khepri) · 지평선 여명의 태양선';
  let solarPhaseMode: SphinxTemporalRhythm['solarPhaseMode'] = '여명';
  let dawnDirective = '아침 햇살이 스핑크스의 이마를 비추는 시간대이므로 새로운 결심과 첫 실행을 열기 좋습니다.';

  if (hour >= 5 && hour < 10) {
    solarBarqueStage = '레-호라크티(Re-Horakhty) · 동쪽 지평선 상승 창';
    solarPhaseMode = '여명';
    dawnDirective = '하루의 가장 맑은 집중력으로 핵심 과업을 먼저 세우십시오.';
  } else if (hour >= 10 && hour < 16) {
    solarBarqueStage = '라(Ra) · 정오 천정 태양선 창';
    solarPhaseMode = '정오';
    dawnDirective = '빛이 가장 강하므로 숨김없는 소통과 정면 돌파에 유리합니다.';
  } else if (hour >= 16 && hour < 20) {
    solarBarqueStage = '아툼(Atum) · 서쪽 지평선 황혼 창';
    solarPhaseMode = '황혼';
    dawnDirective = '낮 동안 쌓인 감정의 모래를 털어내고 하루를 정돈하기 알맞습니다.';
  } else {
    solarBarqueStage = '두아트의 밤(Duat) · 내면 잠행 재생 창';
    solarPhaseMode = '잠행';
    dawnDirective = '투트모세의 꿈처럼 깊은 휴식 속에서 내일의 통찰이 무르익는 시간입니다.';
  }

  let nileHorizonSeason = '아케트(Akhet) · 나일 범람과 비옥의 계절';
  if (month >= 3 && month <= 5) nileHorizonSeason = '페레트(Peret) · 대지 발아와 성숙의 계절';
  else if (month >= 6 && month <= 9) nileHorizonSeason = '셰무(Shemu) · 태양과 수확의 계절';
  else nileHorizonSeason = '아케트(Akhet) · 범람과 새 토대 준비의 계절';

  return {
    kstHour: hour,
    solarBarqueStage,
    nileHorizonSeason,
    dawnDirective,
    solarPhaseMode,
  };
}

export function calculateEgyptianSphinxDreamOracle(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): EgyptianSphinxDreamOracleReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  const bdate = profile?.basic?.birthdate || (profile as any)?.birthDate || (profile as any)?.birthdate || '1985-05-15';
  const btime = profile?.basic?.birthtime || (profile as any)?.birthTime || (profile as any)?.birthtime || '06:00';
  const seedStr = `${bdate}_${btime}_${question || 'sphinx'}_${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const seed = simpleHash(seedStr);

  const humanScore = 45 + (seed % 53);
  const lionScore = 45 + ((seed >> 2) % 53);
  const bullScore = 45 + ((seed >> 4) % 53);
  const eagleScore = 45 + ((seed >> 6) % 53);

  const tetramorph: SphinxTetramorphAspects = {
    humanHead: {
      nameKo: '인간의 지혜 (Human Wisdom)',
      symbol: '🧠',
      score: humanScore,
      powerDesc: humanScore >= 70
        ? '감정에 휘둘리지 않고 본질을 꿰뚫어 보는 이성적 통찰과 분별력이 극에 달해 있습니다.'
        : '복잡한 상황 속에서 논리적 인과관계를 냉철하게 재정립해야 할 때입니다.',
    },
    lionHeart: {
      nameKo: '사자의 용맹 (Lion Courage)',
      symbol: '🦁',
      score: lionScore,
      powerDesc: lionScore >= 70
        ? '두려움을 넘어서 당당히 영역을 개척하는 왕자다운 담대함이 가득합니다.'
        : '정면 돌파를 망설이지 말고 정당한 자기주장을 세상에 드러내십시오.',
    },
    bullStrength: {
      nameKo: '황소의 인내 (Bull Endurance)',
      symbol: '🐂',
      score: bullScore,
      powerDesc: bullScore >= 70
        ? '사막의 풍파에도 결코 흔들리지 않는 묵직한 하중과 완강한 지구력을 발휘합니다.'
        : '조급함을 버리고 기본기를 다지며 바닥부터 단단히 다져야 승기를 잡습니다.',
    },
    eagleVision: {
      nameKo: '독수리의 조망 (Eagle Vision)',
      symbol: '🦅',
      score: eagleScore,
      powerDesc: eagleScore >= 70
        ? '당장의 눈앞을 넘어 10년 뒤의 큰 흐름을 내려다보는 영적 혜안이 열려 있습니다.'
        : '지엽적인 손익에 얽매이지 말고 전체 판세를 조망하는 시야를 확보하십시오.',
    },
  };

  const scores = [
    { name: '인간의 지혜(명석한 판단)', score: humanScore },
    { name: '사자의 용맹(과감한 돌파)', score: lionScore },
    { name: '황소의 인내(흔들림 없는 끈기)', score: bullScore },
    { name: '독수리의 조망(거시적 비전)', score: eagleScore },
  ];
  scores.sort((a, b) => b.score - a.score);
  const dominantVirtue = scores[0].name;

  const sandCleansingIndex = Math.round((humanScore * 0.25 + lionScore * 0.25 + bullScore * 0.25 + eagleScore * 0.25));

  const situationalSphinxAudit = buildSituationalAudit(question, dominantVirtue);
  const temporalSphinxRhythm = buildTemporalRhythm(now);

  const sandClearanceGrade: SphinxSynthesisMatrix['sandClearanceGrade'] =
    sandCleansingIndex >= 76 ? '맑음' : sandCleansingIndex >= 62 ? '걷히는중' : '정화필요';
  const tetramorphSynergy = `전면에 선 [${dominantVirtue}]을(를) ${scores[1].name}이(가) 뒷받침하는 테트라모르프 구도입니다.`;
  const sovereignStep = `${temporalSphinxRhythm.solarBarqueStage} 리듬(${temporalSphinxRhythm.solarPhaseMode})에 맞추어 ${situationalSphinxAudit.tetramorphCounterforce}을 실천하십시오.`;

  const sphinxSynthesisMatrix: SphinxSynthesisMatrix = {
    sandClearanceGrade,
    tetramorphSynergy,
    sovereignStep,
  };

  const thutmosePromise = sandCleansingIndex >= 70
    ? '오랜 세월 당신의 본질을 덮고 있던 혼란과 번민의 모래가 말끔히 걷히고 있습니다. 진정한 당신의 왕권(주도권)을 되찾을 때입니다.'
    : '주변의 잡음과 사소한 걱정이라는 모래를 스스로 털어내야 비로소 당신의 온전한 위엄이 빛을 발합니다.';

  const sphinxRiddleInsight = `스핑크스가 던지는 영혼의 수수께끼: "당신을 구속하는 것은 환경인가, 스스로 만든 두려움인가?" ` +
    `현재 당신이 지닌 가장 날카로운 무기는 [${dominantVirtue}]입니다. 이를 온전히 긍정할 때 모든 문이 열립니다.`;

  const reHorakhtyDawnCommand = `지평선에서 솟구치는 아침 태양 레-호라크티의 빛이 당신을 비춥니다. ` +
    `어둠과 나태를 떨치고 오늘 가장 먼저 매듭지어야 할 핵심 과업을 향해 한 치의 망설임 없이 전진하십시오.`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';
  const ritualAction = `${situationalSphinxAudit.dreamStelePrescription} · ${sphinxSynthesisMatrix.sovereignStep}`;
  const reflectionFocus = question
    ? `‘${question}’ 앞에서 내 본질을 덮고 있던 모래(${situationalSphinxAudit.sandObstacleType})를 걷어내고 세울 [${dominantVirtue}]의 왕권은 무엇입니까?`
    : `오늘 레-호라크티의 여명 앞에서 내가 두려움을 내려놓고 [${dominantVirtue}]으로 먼저 매듭지을 과업은 무엇입니까?`;

  return {
    engineVersion: EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    tetramorph,
    dominantVirtue,
    sandCleansingIndex,
    situationalSphinxAudit,
    temporalSphinxRhythm,
    sphinxSynthesisMatrix,
    thutmosePromise,
    sphinxRiddleInsight,
    reHorakhtyDawnCommand,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary: '투트모세 4세 꿈의 비석과 스핑크스 4대 테트라모르프 상징을 빌린 정성적 조망 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.',
  };
}

export function formatEgyptianSphinxDreamOraclePrompt(rep: EgyptianSphinxDreamOracleReport): string {
  return `[고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁 & 태양신 레-호라크티 상징 관점]
· 엔진 버전: v${rep.engineVersion} | 기준 시각: ${rep.calculatedAtKst}
· 스핑크스 지배적 신성 원형: ${rep.dominantVirtue} (정화 상태: ${rep.sphinxSynthesisMatrix.sandClearanceGrade})
· 인간의 머리(지혜): ${rep.tetramorph.humanHead.powerDesc}
· 사자의 심장(용기): ${rep.tetramorph.lionHeart.powerDesc}
· 황소의 힘(인내): ${rep.tetramorph.bullStrength.powerDesc}
· 독수리의 시야(조망): ${rep.tetramorph.eagleVision.powerDesc}
· 질문 맥락 감사: 걷어낼 모래(${rep.situationalSphinxAudit.sandObstacleType}) · 대응 원형(${rep.situationalSphinxAudit.tetramorphCounterforce})
  - 꿈의 비석 처방: ${rep.situationalSphinxAudit.dreamStelePrescription}
  - 신기루 경계: ${rep.situationalSphinxAudit.mirageWarning}
· KST 시공간 리듬 (${rep.temporalSphinxRhythm.kstHour}시): ${rep.temporalSphinxRhythm.solarBarqueStage} · ${rep.temporalSphinxRhythm.nileHorizonSeason} (${rep.temporalSphinxRhythm.solarPhaseMode})
  - 여명 지침: ${rep.temporalSphinxRhythm.dawnDirective}
· 테트라모르프 교차 매트릭스: ${rep.sphinxSynthesisMatrix.tetramorphSynergy}
  - 왕권 행동: ${rep.sphinxSynthesisMatrix.sovereignStep}
· 꿈의 비석 신성 약조: ${rep.thutmosePromise}
· 스핑크스 수수께끼 해법: ${rep.sphinxRiddleInsight}
· 레-호라크티 여명 행동 명령: ${rep.reHorakhtyDawnCommand}
· 해석 경계: 투트모세 4세 꿈의 비석과 스핑크스 4대 테트라모르프 상징을 빌린 정성적 조망 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.`;
}
