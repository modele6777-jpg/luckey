/**
 * 고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 & 영웅 운명 엔진 (celticTuathaFourTreasuresEngine.ts)
 *
 * 에린(Erin) 신화 원전 《에린 침략의 서(Lebor Gabála Érenn)》 기반:
 * 신들의 민족 투아하 데 다난이 북방 4대 신성 도시에서 가져온 4대 신성 보물.
 * 1. 리아 팔 (Lia Fáil, 운명의 돌) - 북쪽 파리아스(Falias) | 원소: 흙 | 진정한 왕권과 소명의 증명, 진실의 포효
 * 2. 루의 창 (Spear of Lugh / 슬라우 고르마흐) - 동쪽 고리아스(Gorias) | 원소: 불 | 필승의 관통력과 지칠 줄 모르는 영웅적 돌파
 * 3. 누아다의 검 (Sword of Nuada / 클라우 솔리스) - 남쪽 핀디아스(Findias) | 원소: 공기 | 누구도 피할 수 없는 정의의 섬광과 단호한 결단
 * 4. 다그다의 솥 (Cauldron of the Dagda / 무르안) - 서쪽 무리아스(Murias) | 원소: 물 | 아무도 굶주려 떠나지 않는 무한한 풍요와 치유
 *
 * 다누(Danu) 여신의 가호 아래 내담자의 현실 돌파력과 생명 자양분을 100% 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION = '1.0.0';

export interface TuathaTreasure {
  id: 'lia_fail' | 'spear_of_lugh' | 'sword_of_nuada' | 'cauldron_of_dagda';
  nameKo: string;
  irishName: string;
  element: '흙(Earth)' | '불(Fire)' | '공기(Air)' | '물(Water)';
  direction: '북쪽(파리아스)' | '동쪽(고리아스)' | '남쪽(핀디아스)' | '서쪽(무리아스)';
  archetype: string;
  resonanceScore: number; // 0 ~ 100
  divineVow: string;
}

export interface CelticTuathaFourTreasuresReport {
  engineVersion: string;
  timestamp: string;
  tuathaHeroResonance: number; // 0 ~ 100 영웅 운명 공명 지수
  treasures: {
    liaFail: TuathaTreasure;
    spearOfLugh: TuathaTreasure;
    swordOfNuada: TuathaTreasure;
    cauldronOfDagda: TuathaTreasure;
    dominantTreasure: TuathaTreasure;
  };
  danaGoddessBlessing: string; // 모신 다누의 신성 축복
  heroicActionPrescription: string; // 현실 돌파를 위한 투아하 영웅 행동 처방
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

  return {
    engineVersion: CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION,
    timestamp: now.toISOString(),
    tuathaHeroResonance,
    treasures: {
      liaFail,
      spearOfLugh,
      swordOfNuada,
      cauldronOfDagda,
      dominantTreasure,
    },
    danaGoddessBlessing,
    heroicActionPrescription,
  };
}

export function formatCelticTuathaFourTreasuresPrompt(rep: CelticTuathaFourTreasuresReport): string {
  return `[고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 영웅 운명 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 투아하 영웅 운명 공명 지수: ${rep.tuathaHeroResonance}/100
· 핵심 지배 신성 보물: ${rep.treasures.dominantTreasure.nameKo} (${rep.treasures.dominantTreasure.irishName}) — 공명력 ${rep.treasures.dominantTreasure.resonanceScore}%
  - 방위 및 원소: ${rep.treasures.dominantTreasure.direction} | ${rep.treasures.dominantTreasure.element}
  - 영웅 원형: ${rep.treasures.dominantTreasure.archetype}
  - 신성 서약: "${rep.treasures.dominantTreasure.divineVow}"
· 4대 보물 공명 밸런스:
  1) 리아 팔 (운명의 돌/흙): ${rep.treasures.liaFail.resonanceScore}%
  2) 루의 승리 창 (관통/불): ${rep.treasures.spearOfLugh.resonanceScore}%
  3) 누아다의 검 (결단/공기): ${rep.treasures.swordOfNuada.resonanceScore}%
  4) 다그다의 솥 (치유풍요/물): ${rep.treasures.cauldronOfDagda.resonanceScore}%
· 모신 다누의 신성 축복: ${rep.danaGoddessBlessing}
· 현실 돌파 영웅 행동 처방: ${rep.heroicActionPrescription}`;
}
