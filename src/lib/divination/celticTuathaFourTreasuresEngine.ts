/**
 * 고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 & 영웅 운명 엔진 (celticTuathaFourTreasuresEngine.ts)
 *
 * 에린(Erin) 신화 원전 《에린 침략의 서(Lebor Gabála Érenn)》 기반:
 * 신들의 민족 투아하 데 다난이 북방 4대 신성 도시(파리아스·고리아스·핀디아스·무리아스)에서 가져온 4대 신성 보물과
 * 질문 맥락별 영웅 감사, KST 켈트 시공간 리듬을 교차 해독합니다.
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION = 'LUCKEY-CELTIC-TUATHA-v2.1.0';

export interface TuathaTreasure {
  id: 'lia_fail' | 'spear_of_lugh' | 'sword_of_nuada' | 'cauldron_of_dagda';
  nameKo: string;
  irishName: string;
  element: '흙(Earth)' | '불(Fire)' | '공기(Air)' | '물(Water)';
  direction: '북쪽(파리아스)' | '동쪽(고리아스)' | '남쪽(핀디아스)' | '서쪽(무리아스)';
  archetype: string;
  resonanceScore: number; // 0 ~ 100 (내부 정량 연산용)
  divineVow: string;
}

export interface CelticTuathaSituationalAudit {
  battlefieldTheme: string;
  requiredTreasureVirtue: string;
  legendaryPrecedent: string;
  shadowWarning: string;
}

export interface CelticTuathaTemporalRhythm {
  kstHour: number;
  celticDayWindow: string;
  wheelOfTheYearSeason: string;
  rhythmDirective: string;
  heroicTempo: '돌파' | '수호' | '치유';
}

export interface CelticTuathaSynthesisMatrix {
  sovereigntyAlignment: '왕권확립' | '전선균형' | '자양충전';
  elementBalanceNote: string;
  nextHeroicStep: string;
}

export interface CelticTuathaFourTreasuresReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  tuathaHeroResonance: number;
  treasures: {
    liaFail: TuathaTreasure;
    spearOfLugh: TuathaTreasure;
    swordOfNuada: TuathaTreasure;
    cauldronOfDagda: TuathaTreasure;
    dominantTreasure: TuathaTreasure;
  };
  situationalTuathaAudit: CelticTuathaSituationalAudit;
  temporalTuathaRhythm: CelticTuathaTemporalRhythm;
  tuathaSynthesisMatrix: CelticTuathaSynthesisMatrix;
  danaGoddessBlessing: string;
  heroicActionPrescription: string;
  interpretiveBoundary: string;
}

const TREASURES_DEF: Record<TuathaTreasure['id'], Omit<TuathaTreasure, 'resonanceScore'>> = {
  lia_fail: {
    id: 'lia_fail',
    nameKo: '운명의 돌 (리아 팔)',
    irishName: 'Lia Fáil',
    element: '흙(Earth)',
    direction: '북쪽(파리아스)',
    archetype: '진정한 소명과 흔들리지 않는 중심',
    divineVow: '진정한 소명에 발을 딛는 자에게 대지가 응답하여 승리의 길을 열어준다.',
  },
  spear_of_lugh: {
    id: 'spear_of_lugh',
    nameKo: '루의 승리 창 (슬라우 고르마흐)',
    irishName: 'Sleá Lugh',
    element: '불(Fire)',
    direction: '동쪽(고리아스)',
    archetype: '장애물을 꿰뚫는 불굴의 관통력과 추진력',
    divineVow: '목표를 정조준한 의지의 불꽃은 어떤 견고한 장벽도 일격에 무너뜨린다.',
  },
  sword_of_nuada: {
    id: 'sword_of_nuada',
    nameKo: '누아다의 은빛 검 (클라우 솔리스)',
    irishName: 'Claíomh Solais',
    element: '공기(Air)',
    direction: '남쪽(핀디아스)',
    archetype: '거짓과 미련을 베어내는 명쾌한 지성과 결단',
    divineVow: '칼집에서 뽑힌 진실의 검 앞에서는 어둠과 속임수가 스스로 물러난다.',
  },
  cauldron_of_dagda: {
    id: 'cauldron_of_dagda',
    nameKo: '다그다의 마르지 않는 솥 (운드뤼)',
    irishName: 'Coire Ansic',
    element: '물(Water)',
    direction: '서쪽(무리아스)',
    archetype: '생명을 살리는 무한한 자비와 풍요로운 포용',
    divineVow: '베풀고 나누는 마음에 신성한 자양이 끝없이 채워져 고갈되지 않는다.',
  },
};

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

function buildSituationalAudit(question: string, dominant: TuathaTreasure): CelticTuathaSituationalAudit {
  const q = question.toLowerCase();
  if (/일|사업|프로젝트|직업|시험|성공|경쟁|돌파/.test(q)) {
    return {
      battlefieldTheme: '타라(Tara)의 왕좌와 소명 입증 전선',
      requiredTreasureVirtue: `${dominant.nameKo}의 ${dominant.archetype}`,
      legendaryPrecedent: '모이투라(Mag Tuired) 전투에서 루가 모든 기술의 대가(Samildánach)로서 적진을 뚫었듯, 분산된 힘을 하나로 모을 때입니다.',
      shadowWarning: '완벽한 준비만을 기다리다 결정적 타이밍을 놓치는 우유부단함을 경계하십시오.',
    };
  }
  if (/관계|사랑|이별|결혼|사람|갈등|결정|선택/.test(q)) {
    return {
      battlefieldTheme: '진실의 검과 자비의 솥이 만나는 인연의 관문',
      requiredTreasureVirtue: '모호함을 정리하는 분별과 상대를 품는 넉넉함의 균형',
      legendaryPrecedent: '은빛 손의 왕 누아다가 명예를 회복했듯, 감정에 휘둘리지 않고 정직한 경계를 세울 때 관계가 바로 섭니다.',
      shadowWarning: '미련 때문에 끊어야 할 매듭을 질질 끌거나, 반대로 성급한 칼날로 인연을 베지 마십시오.',
    };
  }
  if (/건강|피로|휴식|마음|치유|불안|재물|생활/.test(q)) {
    return {
      battlefieldTheme: '다그다의 솥을 채우는 생명력 회복의 터전',
      requiredTreasureVirtue: '고갈되지 않는 내면 자양분과 대지의 안정감',
      legendaryPrecedent: '다그다의 마르지 않는 솥이 지친 전사들을 먹였듯, 먼저 자신의 그릇을 채워야 다음 싸움을 치를 수 있습니다.',
      shadowWarning: '기력이 바닥난 상태에서 무리한 돌파를 강행하면 오히려 중심축이 흔들립니다.',
    };
  }
  return {
    battlefieldTheme: `${dominant.direction}에서 열린 투아하 영웅의 소명`,
    requiredTreasureVirtue: dominant.archetype,
    legendaryPrecedent: `신성 보물 ${dominant.nameKo}의 서약처럼("${dominant.divineVow}") 지금 선 자리에서 흔들리지 않는 원칙을 세우십시오.`,
    shadowWarning: '외부의 소음에 시선을 빼앗겨 본래의 서약을 잊지 않도록 주의하십시오.',
  };
}

function buildTemporalRhythm(now: Date): CelticTuathaTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let celticDayWindow = '루(Lugh)의 정오 광명 창';
  let heroicTempo: CelticTuathaTemporalRhythm['heroicTempo'] = '돌파';
  let rhythmDirective = '태양의 기운이 가장 왕성한 시간대이므로 핵심 목표를 정조준해 추진하기 좋습니다.';

  if (hour >= 5 && hour < 10) {
    celticDayWindow = '브리짓(Brigid)의 여명 화로 창';
    heroicTempo = '돌파';
    rhythmDirective = '새로운 하루의 영감과 창조적 불꽃을 지펴 첫 과업을 시작하기 가장 알맞은 시간입니다.';
  } else if (hour >= 10 && hour < 16) {
    celticDayWindow = '루(Lugh)의 태양 창공 창';
    heroicTempo = '돌파';
    rhythmDirective = '실무와 결단, 외부 협의 등 직접적인 전진과 돌파가 필요한 일에 힘을 실으십시오.';
  } else if (hour >= 16 && hour < 21) {
    celticDayWindow = '누아다(Nuada)의 황혼 정돈 창';
    heroicTempo = '수호';
    rhythmDirective = '오늘 거둔 성과와 남은 과제를 선명히 구분하고 불필요한 잡념을 정리할 시간입니다.';
  } else {
    celticDayWindow = '다그다(Dagda)의 심야 솥 안식 창';
    heroicTempo = '치유';
    rhythmDirective = '칼과 창을 내려놓고 깊은 휴식과 회복으로 내일의 생명력을 비축할 시간입니다.';
  }

  let wheelOfTheYearSeason = '임볼크(Imbolc) · 빛의 싹틈';
  if (month >= 2 && month <= 4) wheelOfTheYearSeason = '임볼크~벨타네(Imbolc–Beltane) · 여명과 도약';
  else if (month >= 5 && month <= 7) wheelOfTheYearSeason = '벨타네~루나사(Beltane–Lughnasadh) · 열정과 만개';
  else if (month >= 8 && month <= 10) wheelOfTheYearSeason = '루나사~삼하인(Lughnasadh–Samhain) · 수확과 정돈';
  else wheelOfTheYearSeason = '삼하인~율(Samhain–Yule) · 침잠과 뿌리 수호';

  return {
    kstHour: hour,
    celticDayWindow,
    wheelOfTheYearSeason,
    rhythmDirective,
    heroicTempo,
  };
}

export function calculateCelticTuathaFourTreasures(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): CelticTuathaFourTreasuresReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 4321;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 41 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 29 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCDate() * 7 + now.getUTCHours()) % 1000003;

  const liaPower = 42 + ((seed * 7) % 55);
  const spearPower = 42 + ((seed * 11) % 55);
  const swordPower = 42 + ((seed * 13) % 55);
  const cauldronPower = 42 + ((seed * 19) % 55);

  const liaFail: TuathaTreasure = { ...TREASURES_DEF.lia_fail, resonanceScore: liaPower };
  const spearOfLugh: TuathaTreasure = { ...TREASURES_DEF.spear_of_lugh, resonanceScore: spearPower };
  const swordOfNuada: TuathaTreasure = { ...TREASURES_DEF.sword_of_nuada, resonanceScore: swordPower };
  const cauldronOfDagda: TuathaTreasure = { ...TREASURES_DEF.cauldron_of_dagda, resonanceScore: cauldronPower };

  const all = [liaFail, spearOfLugh, swordOfNuada, cauldronOfDagda];
  all.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantTreasure = all[0];

  const tuathaHeroResonance = Math.min(100, Math.max(35, Math.floor((liaPower + spearPower + swordPower + cauldronPower) / 4)));

  const situationalTuathaAudit = buildSituationalAudit(question, dominantTreasure);
  const temporalTuathaRhythm = buildTemporalRhythm(now);

  const sovereigntyAlignment: CelticTuathaSynthesisMatrix['sovereigntyAlignment'] =
    dominantTreasure.id === 'lia_fail' || dominantTreasure.id === 'spear_of_lugh'
      ? '왕권확립'
      : dominantTreasure.id === 'sword_of_nuada'
        ? '전선균형'
        : '자양충전';

  const elementBalanceNote = `주재 보물 [${dominantTreasure.nameKo}(${dominantTreasure.element})]가 전면에 서고, ${all[1].nameKo}(${all[1].element})가 보조 축으로 받쳐주는 구도입니다.`;
  const nextHeroicStep = `${temporalTuathaRhythm.celticDayWindow} 리듬(${temporalTuathaRhythm.heroicTempo})에 맞춰 ${situationalTuathaAudit.battlefieldTheme}의 핵심 과제를 실행하십시오.`;

  const tuathaSynthesisMatrix: CelticTuathaSynthesisMatrix = {
    sovereigntyAlignment,
    elementBalanceNote,
    nextHeroicStep,
  };

  let danaGoddessBlessing = '';
  let heroicActionPrescription = '';

  if (dominantTreasure.id === 'lia_fail') {
    danaGoddessBlessing = '운명의 돌 리아 팔이 그대의 발밑에서 단단한 대지의 권능을 선언합니다.';
    heroicActionPrescription = '주변의 요동침에 흔들리지 말고 자신의 핵심 원칙과 자리를 확고히 지키며 묵직하게 버텨내십시오.';
  } else if (dominantTreasure.id === 'spear_of_lugh') {
    danaGoddessBlessing = '광명의 신 루의 승리 창이 어둠을 가르고 목표를 향해 날아갑니다.';
    heroicActionPrescription = '좌고우면하지 말고 가장 중요한 핵심 한 가지에 모든 집중력을 쏟아부어 돌파구를 여십시오.';
  } else if (dominantTreasure.id === 'sword_of_nuada') {
    danaGoddessBlessing = '은빛 손의 왕 누아다의 검이 혼란스러운 매듭을 베어내고 선명한 진실을 드러냅니다.';
    heroicActionPrescription = '불필요한 관계나 미련, 모호한 결정을 이성적이고 단호하게 정리하여 불확실성을 제거하십시오.';
  } else {
    danaGoddessBlessing = '위대한 신 다그다의 솥이 삶의 메마름을 적시고 치유의 풍요를 부어줍니다.';
    heroicActionPrescription = '초조함을 내려놓고 자신과 타인에게 너그러운 자양분을 나누며 회복의 시간을 충분히 가지십시오.';
  }

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const interpretiveBoundary = '본 켈트 투아하 데 다난 4대 보물 리포트는 에린 신화 원형에 기반한 정성적 영웅 성찰 안내이며, 확정적 승패 예단이 아닙니다.';

  return {
    engineVersion: CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    tuathaHeroResonance,
    treasures: {
      liaFail,
      spearOfLugh,
      swordOfNuada,
      cauldronOfDagda,
      dominantTreasure,
    },
    situationalTuathaAudit,
    temporalTuathaRhythm,
    tuathaSynthesisMatrix,
    danaGoddessBlessing,
    heroicActionPrescription,
    interpretiveBoundary,
  };
}

export function formatCelticTuathaFourTreasuresPrompt(rep: CelticTuathaFourTreasuresReport): string {
  return `[고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 영웅 운명 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 기준 시각(KST): ${rep.calculatedAtKst}
· 핵심 지배 신성 보물: ${rep.treasures.dominantTreasure.nameKo} (${rep.treasures.dominantTreasure.irishName})
  - 방위 및 원소: ${rep.treasures.dominantTreasure.direction} | ${rep.treasures.dominantTreasure.element}
  - 영웅 원형: ${rep.treasures.dominantTreasure.archetype}
  - 신성 서약: "${rep.treasures.dominantTreasure.divineVow}"
· 질문 맥락 감사: ${rep.situationalTuathaAudit.battlefieldTheme} · 필요 덕목(${rep.situationalTuathaAudit.requiredTreasureVirtue})
  - 원전 선례: ${rep.situationalTuathaAudit.legendaryPrecedent}
  - 경계할 그림자: ${rep.situationalTuathaAudit.shadowWarning}
· KST 시공간 리듬 (${rep.temporalTuathaRhythm.kstHour}시): ${rep.temporalTuathaRhythm.celticDayWindow} · ${rep.temporalTuathaRhythm.wheelOfTheYearSeason} (${rep.temporalTuathaRhythm.heroicTempo})
  - 시간대 지침: ${rep.temporalTuathaRhythm.rhythmDirective}
· 사대 보물 교차 매트릭스: ${rep.tuathaSynthesisMatrix.sovereigntyAlignment} — ${rep.tuathaSynthesisMatrix.elementBalanceNote}
  - 다음 영웅적 발걸음: ${rep.tuathaSynthesisMatrix.nextHeroicStep}
· 모신 다누의 신성 축복: ${rep.danaGoddessBlessing}
· 현실 돌파 영웅 행동 처방: ${rep.heroicActionPrescription}
· 해석 경계: ${rep.interpretiveBoundary}`;
}
