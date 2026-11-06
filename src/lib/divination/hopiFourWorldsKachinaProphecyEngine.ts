/**
 * 아메리카 호피족 4대 우주 시대 순환·카치나 정령 지혜·코양니스카시 치유 엔진 (hopiFourWorldsKachinaProphecyEngine.ts)
 *
 * 북미 대륙 최고(最古)의 원주민 영성 호피(Hopi, '평화의 백성') 구전 원전 기반:
 * 태양령 타이오와(Taiowa)와 대지모신 거미할머니(Spider Grandmother, Kokyangwuti)가 이끈
 * 4대 우주 세계(Four Worlds: Tokpela · Tokpa · Kuskurza · Tuwaqachi)의 순환과
 * 균형을 잃은 삶(Koyaanisqatsi)을 치유하는 카치나(Katsina) 신성 정령 지혜 수리 모델링.
 *
 * 4대 세계 순환:
 * 1. Tokpela (끝없는 공간): 순수한 조화와 창조의 제1세계.
 * 2. Tokpa (암흑의 세계): 물질 축적과 분리의 제2세계.
 * 3. Kuskurza (파멸의 세계): 기술 만능과 오만의 제3세계.
 * 4. Tuwaqachi (완전한 세계): 겸허한 농경과 영적 현존을 시험받는 제4세계.
 */

import type { UserProfile } from '../sharedState';

export const HOPI_FOUR_WORLDS_ENGINE_VERSION = '1.0.0';

export interface HopiKachinaSpirit {
  id: string;
  nameKo: string;
  hopiName: string;
  spiritualDomain: string;
  healingMedicine: string;
  ceremonialSeason: string;
  kachinaBlessingAffirmation: string;
  spiritResonanceScore: number; // 0 ~ 100
}

export interface HopiFourWorldsReport {
  engineVersion: string;
  timestamp: string;
  fourWorldsEvolutionScore: number; // 0 ~ 100 4대 세계 진화 영성 지수
  koyaanisqatsiHealingPower: number; // 0 ~ 100 코양니스카시(불균형) 치유력
  kivaSacredCenterAlignment: number; // 0 ~ 100 키바(Kiva) 지하 성소 영적 정렬도
  spiderGrandmotherWisdom: number; // 0 ~ 100 거미할머니 운명의 그물 통찰력
  dominantKachina: HopiKachinaSpirit; // 현재 운명을 수호하는 카치나 정령
  hopiProphecyGuidance: string; // 호피 평화 예언 처방
  pikiBreadSacredOffering: string; // 대지와 연결되는 소박한 평화 리추얼
}

const HOPI_KACHINAS_BASE: Omit<HopiKachinaSpirit, 'spiritResonanceScore'>[] = [
  {
    id: 'soyal-kachina',
    nameKo: '소얄 카치나 (동지 태양 부활과 신성한 새해 점화)',
    hopiName: 'Soyal Katsina',
    spiritualDomain: '가장 긴 어둠의 밤을 지나 다시 떠오르는 태양의 첫 숨결과 영적 갱신',
    healingMedicine: '절망의 끝에서 희망의 불씨를 지피고 새로운 시작을 축복하는 불사조 의식',
    ceremonialSeason: '동지 제의 (Soyalangw)',
    kachinaBlessingAffirmation: '가장 어두운 순간이 바로 가장 찬란한 빛이 잉태되는 순간임을 굳게 믿으십시오.',
  },
  {
    id: 'eototo-chief',
    nameKo: '에오토토 (모든 카치나의 최고 영적 추장 정령)',
    hopiName: 'Eototo Katsina',
    spiritualDomain: '고대 지혜의 최고 수호자이자 우주의 근원적 질서와 대지의 영원한 법칙 관장',
    healingMedicine: '복잡한 갈등을 단숨에 꿰뚫는 원숙한 통찰력과 공동체를 화합시키는 자애로운 리더십',
    ceremonialSeason: '파와무 축제 (Powamuya, 콩 싹트기 의식)',
    kachinaBlessingAffirmation: '우주의 근원적 법칙은 언제나 당신을 지지하고 있으니 흔들림 없이 바른 도리를 지키십시오.',
  },
  {
    id: 'hemis-abundance',
    nameKo: '헤미스 카치나 (한여름 옥수수 수확과 축복의 단비)',
    hopiName: 'Hemis Katsina',
    spiritualDomain: '구름과 단비를 몰고 와 메마른 대지를 적시고 영혼의 열매를 풍성하게 익히는 정령',
    healingMedicine: '결핍에 대한 두려움을 씻어내고 온 존재로 풍요의 순환을 신뢰하는 대지의 은총',
    ceremonialSeason: '니만 제의 (Niman, 카치나 고향 귀환제)',
    kachinaBlessingAffirmation: '성실히 땀 흘려 심은 영혼의 씨앗은 때가 되면 반드시 풍성한 열매로 당신을 찾아옵니다.',
  },
  {
    id: 'kokopelli-flute',
    nameKo: '코코펠리 (생명의 피리를 부는 기쁨과 다산의 전령)',
    hopiName: 'Kokopelli Katsina',
    spiritualDomain: '등 뒤에 온갖 씨앗을 짊어지고 피리를 불며 생명력과 웃음을 퍼뜨리는 유쾌한 방랑자',
    healingMedicine: '굳어버린 심장을 말랑말랑하게 녹이고 삶에 생기와 창의적 유머를 되찾아주는 음악 의식',
    ceremonialSeason: '봄날 파종 제의',
    kachinaBlessingAffirmation: '삶을 너무 심각하게 쥐려 하지 말고 한 곡의 아름다운 춤과 피리 소리처럼 가볍게 즐기십시오.',
  },
  {
    id: 'angwusnasomtaka-crow-mother',
    nameKo: '까마귀 어머니 (모든 카치나의 자비로운 어머니이자 영적 입문관)',
    hopiName: 'Angwusnasomtaka (Crow Mother)',
    spiritualDomain: '어린 영혼을 영적 성인으로 도약시키는 자비로운 훈육과 깊은 모성적 카르마 정화',
    healingMedicine: '과거의 상처와 두려운 기억을 지혜의 양분으로 승화시키는 근본적 영혼 치유력',
    ceremonialSeason: '파와무 입문 의식 (Powamuya)',
    kachinaBlessingAffirmation: '당신이 겪은 모든 시련은 당신을 더 깊고 강인한 영혼으로 빚어내기 위한 성스러운 입문이었습니다.',
  },
  {
    id: 'mastop-death-rebirth',
    nameKo: '마스톱 카치나 (지하 세계의 신비와 대지 다산의 씨앗)',
    hopiName: 'Mastop Katsina',
    spiritualDomain: '보이지 않는 땅속 깊은 곳에서 생명의 씨앗을 일깨우는 신비로운 잠재력의 수호자',
    healingMedicine: '무의식의 깊은 그림자를 수용하고 내면의 잠자던 거대한 잠재의식을 깨우는 힘',
    ceremonialSeason: '소얄랑우 비밀 의식',
    kachinaBlessingAffirmation: '어둠을 두려워하지 마십시오. 가장 위대한 생명의 싹은 아무도 보지 않는 땅속 어둠에서 움틉니다.',
  },
];

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateHopiFourWorldsKachina(profile?: UserProfile | null): HopiFourWorldsReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_hopi_kachina_v1`;
  const seed = djb2Hash(seedStr);

  const fourWorldsEvolutionScore = 61 + (seed % 38);
  const koyaanisqatsiHealingPower = 64 + ((seed >> 2) % 35);
  const kivaSacredCenterAlignment = 59 + ((seed >> 4) % 41);
  const spiderGrandmotherWisdom = 66 + ((seed >> 6) % 33);

  const kachinaIdx = seed % HOPI_KACHINAS_BASE.length;
  const base = HOPI_KACHINAS_BASE[kachinaIdx];
  const spiritResonanceScore = 68 + ((seed >> 8) % 31);

  const dominantKachina: HopiKachinaSpirit = {
    ...base,
    spiritResonanceScore,
  };

  const hopiProphecyGuidance = `호피족의 평화 예언은 세상이 균형을 잃고 요동치는 '코양니스카시(Koyaanisqatsi)'의 시기일수록, 대지와 겸허히 소통하는 소박한 영혼만이 제4세계(Tuwaqachi)의 안식을 누린다고 전합니다. 현재 [${dominantKachina.nameKo}]의 성스러운 가호를 받아 내면의 중심을 바로잡으십시오.`;

  const pikiBreadSacredOffering = `신발을 벗고 잠시 조용히 서서 발바닥 아래 흙과 대지모신의 호흡을 느껴보십시오. 심장에서부터 어머니 대지의 심장까지 굵고 따뜻한 붉은 뿌리가 뻗어나가 당신을 든든하게 받쳐주고 있음을 자각하십시오.`;

  return {
    engineVersion: HOPI_FOUR_WORLDS_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    fourWorldsEvolutionScore,
    koyaanisqatsiHealingPower,
    kivaSacredCenterAlignment,
    spiderGrandmotherWisdom,
    dominantKachina,
    hopiProphecyGuidance,
    pikiBreadSacredOffering,
  };
}

export function formatHopiFourWorldsPrompt(report: HopiFourWorldsReport): string {
  const k = report.dominantKachina;
  return `[아메리카 호피족 4대 우주 시대 & 카치나 정령 지혜 실측 데이터]
- 엔진 버전: v${report.engineVersion}
- 4대 세계 진화 영성 지수: ${report.fourWorldsEvolutionScore}/100
- 코양니스카시(불균형 치유력): ${report.koyaanisqatsiHealingPower}/100
- 키바(Kiva) 지하 성소 영적 정렬도: ${report.kivaSacredCenterAlignment}/100
- 거미할머니 운명의 그물 통찰력: ${report.spiderGrandmotherWisdom}/100
- 주재 수호 카치나 정령: ${k.nameKo} (${k.hopiName} / ${k.ceremonialSeason})
  * 영적 영역: ${k.spiritualDomain}
  * 치유의 약성: ${k.healingMedicine}
  * 정령 공명도: ${k.spiritResonanceScore}/100
  * 축복 확언: ${k.kachinaBlessingAffirmation}
- 호피 평화 예언 지혜 지침: ${report.hopiProphecyGuidance}
- 대지모신 연결 평화 리추얼: ${report.pikiBreadSacredOffering}`;
}
