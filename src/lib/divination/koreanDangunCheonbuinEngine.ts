/**
 * 고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 엔진 (koreanDangunCheonbuinEngine.ts)
 *
 * 《삼국유사(三國遺事)》 기이편 고조선 원전 기반:
 * 환인(桓因)이 환웅(桓雄)에게 하강을 허락하며 전수한 세 가지 하늘의 징표인 '천부삼인(天符三印)'
 * 1. 거울 (명경지수·영적 지혜와 내면 자각)
 * 2. 칼 (벽사결단·부정함 척결과 단호한 실행력)
 * 3. 방울 (천지화합·영혼의 소통과 우주적 공명)
 *
 * 3대 천계 관직(풍백·우사·운사)의 기운 조율과 '홍익인간(弘益人間)·이화세계(理化世界)' 원리를 통해
 * 내담자의 현실적 번영 지수와 세상과의 상생 조화도를 100% 결정론적으로 도출합니다.
 */

import { UserProfile } from '../../types';

export const KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION = '1.0.0';

export interface CheonbuTreasure {
  id: 'mirror' | 'sword' | 'bell';
  nameKo: string;
  hanja: string;
  archetype: string;
  symbolism: string;
  activationPower: number; // 0 ~ 100
  divineDecree: string;
}

export interface HeavenlyMinister {
  id: 'wind_master' | 'rain_master' | 'cloud_master';
  nameKo: string;
  hanja: string;
  element: '풍(風)' | '우(雨)' | '운(雲)';
  role: string;
  guidance: string;
}

export interface KoreanDangunCheonbuinReport {
  engineVersion: string;
  timestamp: string;
  hongikProsperityIndex: number; // 0 ~ 100 홍익인간 상생 번영 지수
  cosmicHarmonyIndex: number; // 0 ~ 100 천지인(天地人) 조화율
  treasures: {
    mirror: CheonbuTreasure;
    sword: CheonbuTreasure;
    bell: CheonbuTreasure;
    dominantTreasure: CheonbuTreasure;
  };
  activeMinister: HeavenlyMinister;
  ihwaSegyeRemedy: string; // 이화세계 개운 처방
}

const TREASURES_DEF: Record<'mirror' | 'sword' | 'bell', Omit<CheonbuTreasure, 'activationPower'>> = {
  mirror: {
    id: 'mirror',
    nameKo: '천부경의 거울 (명경/明鏡)',
    hanja: '鏡',
    archetype: '지혜와 자각의 거울',
    symbolism: '한 점의 왜곡 없이 사물의 본질과 자신의 무의식을 비추는 맑고 고요한 영적 통찰',
    divineDecree: '마음의 티끌을 닦아내면 세상의 모든 인연과 기회가 거울 속 달처럼 선명히 드러난다.',
  },
  sword: {
    id: 'sword',
    nameKo: '천부인의 칼 (벽사보검/寶劍)',
    hanja: '劍',
    archetype: '결단과 벽사의 보검',
    symbolism: '미련과 우유부단함, 부정적인 탁기를 일도양단으로 베어내는 단호한 결단력과 정의',
    divineDecree: '주저함을 칼집에 넣고 단호한 행동으로 나아가 사악한 장애를 베어 넘겨라.',
  },
  bell: {
    id: 'bell',
    nameKo: '천부인의 방울 (화합천령/天鈴)',
    hanja: '鈴',
    archetype: '소통과 화합의 영령',
    symbolism: '하늘과 땅, 인간의 마음을 진동으로 연결하여 적대감을 녹이고 깊은 화합을 부르는 영혼의 파동',
    divineDecree: '진심 어린 소통의 울림을 세상에 전파하면 닫힌 문이 스스로 열리고 귀인이 모여든다.',
  },
};

const MINISTERS_DEF: HeavenlyMinister[] = [
  {
    id: 'wind_master',
    nameKo: '풍백(風伯)',
    hanja: '風伯',
    element: '풍(風)',
    role: '정체된 기운을 흩고 새로운 변화의 바람을 불어넣는 창조의 주재자',
    guidance: '과거의 관성에 머무르지 말고 변화의 기류에 몸을 실어 유연하고 민첩하게 전진하십시오.',
  },
  {
    id: 'rain_master',
    nameKo: '우사(雨師)',
    hanja: '雨師',
    element: '우(雨)',
    role: '메마른 현실에 생명의 자양분을 적셔 결실을 촉진하는 풍요의 주재자',
    guidance: '서두르는 조급함을 가라앉히고, 목표하는 일의 토양에 정성과 자원을 꾸준히 공급하십시오.',
  },
  {
    id: 'cloud_master',
    nameKo: '운사(雲師)',
    hanja: '雲師',
    element: '운(雲)',
    role: '드넓은 지평을 감싸 안아 위험을 차폐하고 도약의 기회를 품는 포용의 주재자',
    guidance: '시야를 넓게 열어 전모를 조망하고, 중요한 때가 무르익을 때까지 내실을 은밀히 품으십시오.',
  },
];

export function calculateKoreanDangunCheonbuin(options?: {
  profile?: UserProfile | null;
  question?: string;
}): KoreanDangunCheonbuinReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();

  let seed = 777;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 17 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 19 + question.charCodeAt(i)) % 1000003;

  const mirrorPower = 40 + ((seed * 7) % 56);
  const swordPower = 40 + ((seed * 13) % 56);
  const bellPower = 40 + ((seed * 23) % 56);

  const mirrorObj: CheonbuTreasure = { ...TREASURES_DEF.mirror, activationPower: mirrorPower };
  const swordObj: CheonbuTreasure = { ...TREASURES_DEF.sword, activationPower: swordPower };
  const bellObj: CheonbuTreasure = { ...TREASURES_DEF.bell, activationPower: bellPower };

  let dominant: CheonbuTreasure = mirrorObj;
  if (swordPower >= mirrorPower && swordPower >= bellPower) dominant = swordObj;
  else if (bellPower >= mirrorPower && bellPower >= swordPower) dominant = bellObj;

  const hongikProsperityIndex = Math.min(100, Math.max(30, Math.floor((mirrorPower + swordPower + bellPower) / 3)));
  const cosmicHarmonyIndex = Math.min(100, Math.max(35, 100 - Math.abs(mirrorPower - swordPower) - Math.abs(swordPower - bellPower)));

  const ministerIdx = seed % 3;
  const activeMinister = MINISTERS_DEF[ministerIdx];

  let ihwaSegyeRemedy = '';
  if (dominant.id === 'mirror') {
    ihwaSegyeRemedy = '혼란스러운 외부에 휘둘리지 말고 아침마다 3분간 내면의 고요한 관찰자(거울) 상태를 유지하여 최선의 판단을 직관적으로 내리십시오.';
  } else if (dominant.id === 'sword') {
    ihwaSegyeRemedy = '미뤄왔던 관계나 불필요한 지출, 우유부단한 타협을 보검처럼 단칼에 정리하여 새 운이 유입될 맑은 통로를 확보하십시오.';
  } else {
    ihwaSegyeRemedy = '자신의 이익만을 주장하기보다 상대방의 입장을 먼저 수용하고 부드러운 소통(방울)으로 주변 귀인의 조력을 이끌어내십시오.';
  }

  return {
    engineVersion: KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    hongikProsperityIndex,
    cosmicHarmonyIndex,
    treasures: {
      mirror: mirrorObj,
      sword: swordObj,
      bell: bellObj,
      dominantTreasure: dominant,
    },
    activeMinister,
    ihwaSegyeRemedy,
  };
}

export function formatKoreanDangunCheonbuinPrompt(rep: KoreanDangunCheonbuinReport): string {
  return `[고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 홍익인간 상생 번영 지수: ${rep.hongikProsperityIndex}/100 | 천지인 조화율: ${rep.cosmicHarmonyIndex}%
· 핵심 지배 천부보물: ${rep.treasures.dominantTreasure.nameKo} (${rep.treasures.dominantTreasure.hanja}) — 활력도 ${rep.treasures.dominantTreasure.activationPower}%
  - 상징 원형: ${rep.treasures.dominantTreasure.archetype} (${rep.treasures.dominantTreasure.symbolism})
  - 천부 비전 칙령: "${rep.treasures.dominantTreasure.divineDecree}"
· 천부 3보 활성 밸런스:
  1) 거울 (지혜/자각): ${rep.treasures.mirror.activationPower}%
  2) 칼 (벽사/결단): ${rep.treasures.sword.activationPower}%
  3) 방울 (화합/소통): ${rep.treasures.bell.activationPower}%
· 감응 천계 관직: ${rep.activeMinister.nameKo} (${rep.activeMinister.element}) — ${rep.activeMinister.role}
  - 주재자 조언: ${rep.activeMinister.guidance}
· 이화세계(理化世界) 현실 개운 처방: ${rep.ihwaSegyeRemedy}`;
}
