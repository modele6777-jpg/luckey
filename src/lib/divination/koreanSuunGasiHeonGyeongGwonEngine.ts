/**
 * 동학 수운 최제우 《용담유사(龍潭遺詞)》 검결(劍訣) 심기수련 & 삼경사상(三敬思想) 신탁 엔진
 *
 * 1860년 수운 최제우 대신사 경주 용담정 창도 원전 기반.
 * 1. 《용담유사》 검결(劍訣):
 *    - "시호시호 이내시호 부재래지 시호로다 (時乎時乎 이내時乎 不再來之 時乎로다)"
 *    - "용천검 드는 칼을 아니 쓰고 무엇하리" — 번뇌를 끊고 정기를 세우는 용천검 심검(心劍) 수련
 * 2. 3대 신성 공경 삼경(三敬) 사상:
 *    - 경천(敬天): 내 안의 한울님을 지극정성으로 모시고 경외함
 *    - 경인(敬人): 모든 인간을 한울님처럼 모시는 사인여천(事人如天)
 *    - 경물(敬物): 미물과 자연 만물까지도 함부로 대하지 않는 지극한 생명 공경
 * 3. 4대 심기 수련(지기금지원위대강) 및 운기 대반전 성화력 산출
 *
 * @version LUCKEY-SUUN-GASI-HEON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SUUN_GASI_HEON_VERSION = 'LUCKEY-SUUN-GASI-HEON-v1.0.0';

export interface SuunCultivationStage {
  stageLevel: number;
  stageNameKo: string;
  stageHanja: string;
  innerSwordState: string;
  cosmicResonanceDomain: string;
}

export interface SuunGasiHeonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  yongcheonSwordSeverancePower: number; // 용천검 심검 번뇌 결단력
  samgyeongReverenceHarmony: number; // 삼경(경천·경인·경물) 합일 조화율
  buJaeRaeTimingAwakening: number; // 부재래지 시호(다시 오지 않을 때) 타이밍 각성력
  jiGiGeumJiCosmicQiFlow: number; // 지기금지(至氣今至) 원초 우주기 수용도
  sudeokHeartPurityIndex: number; // 수덕문(修德文) 덕성 정화 및 덕행 실천력
  // 세부 명세
  activeCultivationStage: SuunCultivationStage;
  primarySamgyeongVirtue: {
    virtueNameKo: string;
    virtueHanja: string;
    coreEssence: string;
    actionablePractice: string;
  };
  geomgyeolVerse: {
    verseTitle: string;
    hangeulText: string;
    spiritualMeaning: string;
  };
}

export type SuunGasiHeonReport = SuunGasiHeonResult;

const SUUN_STAGES: SuunCultivationStage[] = [
  { stageLevel: 1, stageNameKo: '무극대도 성화경', stageHanja: '無極大道 聖化境', innerSwordState: '칼과 마음이 하나 되어 맑은 빛을 뿜는 심검무적', cosmicResonanceDomain: '다시 개벽의 대운을 온몸으로 이끄는 선도자' },
  { stageLevel: 2, stageNameKo: '용천심검 결단경', stageHanja: '龍泉心劍 決斷境', innerSwordState: '미혹과 주저함을 단칼에 베어내는 단호한 결의', cosmicResonanceDomain: '오랜 악연과 지체된 정체를 끊어내는 혁신' },
  { stageLevel: 3, stageNameKo: '삼경화평 공경경', stageHanja: '三敬和平 恭敬境', innerSwordState: '만물을 한울님으로 공경하여 적을 감화시키는 덕검', cosmicResonanceDomain: '대인관계와 사회적 신뢰의 대통합' },
  { stageLevel: 4, stageNameKo: '지기수련 기화경', stageHanja: '至氣修練 氣化境', innerSwordState: '우주의 지극한 기운이 내 몸과 마음에 가득 차는 상태', cosmicResonanceDomain: '생체 활력 및 영적 회복탄력성 극대화' },
  { stageLevel: 5, stageNameKo: '용담수도 각성경', stageHanja: '龍潭修道 覺醒境', innerSwordState: '깊은 연못처럼 고요하게 때를 기다리며 칼을 벼리는 심기', cosmicResonanceDomain: '내면적 기초 체력 및 인내심 강화' },
  { stageLevel: 6, stageNameKo: '시호포착 직관경', stageHanja: '時乎捕捉 直觀境', innerSwordState: '다시 오지 않을 결정적 기회의 바람을 감지하는 예지', cosmicResonanceDomain: '선택과 결단의 골든타임 수호' },
  { stageLevel: 7, stageNameKo: '수덕정심 입문경', stageHanja: '修德正心 入門境', innerSwordState: '작은 허물부터 털어내며 바른 마음을 세우는 첫걸음', cosmicResonanceDomain: '일상의 사소한 습관 정돈과 정화' },
];

const SAMGYEONG_VIRTUES = [
  { virtueNameKo: '경천(敬天)', virtueHanja: '敬天', coreEssence: '내 안의 한울님을 지극정성으로 모심', actionablePractice: '내 양심의 소리를 하늘의 명으로 여겨 한 치의 부끄러움도 없이 결단하십시오.' },
  { virtueNameKo: '경인(敬人)', virtueHanja: '敬人', coreEssence: '사람을 대할 때 한울님 대하듯 정성을 다함 (사인여천)', actionablePractice: '가장 가까운 사람부터 귀한 손님 모시듯 존중하고 말을 아끼십시오.' },
  { virtueNameKo: '경물(敬物)', virtueHanja: '敬物', coreEssence: '물건과 자연 만물도 함부로 낭비하지 않는 생명 공경', actionablePractice: '주변의 사물과 자원을 소중히 다루고 어지러운 환경을 단정히 정돈하십시오.' },
  { virtueNameKo: '동귀일체(同歸一體)', virtueHanja: '同歸一體', coreEssence: '나와 타인과 우주가 하나의 큰 생명체임을 자각함', actionablePractice: '남을 돕는 것이 곧 나를 돕는 것임을 깨닫고 너그러운 포용을 베푸십시오.' },
];

const GEOMGYEOL_VERSES = [
  { verseTitle: '용담유사 검결 제1절', hangeulText: '시호시호 이내시호 부재래지 시호로다. 만세일지 장부로서 이러한 때 만날런가.', spiritualMeaning: '지금 마주한 순간은 일생에 두 번 오지 않는 천재일우의 기회이니 주저하지 말고 칼을 뽑아 전진하십시오.' },
  { verseTitle: '용담유사 검결 제2절', hangeulText: '용천검 드는 칼을 아니 쓰고 무엇하리. 무수장삼 떨쳐입고 이 칼 저 칼 넌츳 추어.', spiritualMeaning: '마음속에 품은 재능과 지혜를 감추어 두지 말고, 세상을 밝히는 선한 결단으로 과감히 펼치십시오.' },
  { verseTitle: '동경대전 수덕문 제3장', hangeulText: '도기장존 만사지(道氣長存 萬事知)요, 덕화유행 만민화(德化流行 萬民化)라.', spiritualMeaning: '도의 기운이 길게 보존되면 모든 일을 알게 되고, 덕의 감화가 흐르면 온 세상이 화평해집니다.' },
  { verseTitle: '용담유사 몽중노소문답가', hangeulText: '착한 마음 먹었으니 하늘인들 무심할까. 어질고 착한 길로 나아가면 형통하리라.', spiritualMeaning: '선하고 곧은 중심을 지키는 한, 우주 전체가 보이지 않는 손길로 그대의 뒤를 밀어줍니다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateSuunGasiHeon(profile?: UserProfile): SuunGasiHeonResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`SUUN-GASI-HEON-${birthdate}-${birthtime}-${name}`);

  const yongcheonSwordSeverancePower = (seed % 41) + 60; // 60~100
  const samgyeongReverenceHarmony = ((seed >> 3) % 39) + 62; // 62~100
  const buJaeRaeTimingAwakening = ((seed >> 5) % 43) + 58; // 58~100
  const jiGiGeumJiCosmicQiFlow = ((seed >> 7) % 45) + 55; // 55~99
  const sudeokHeartPurityIndex = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % SUUN_STAGES.length;
  const activeCultivationStage = SUUN_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % SAMGYEONG_VIRTUES.length;
  const primarySamgyeongVirtue = SAMGYEONG_VIRTUES[virtueIdx];

  const verseIdx = (seed >> 6) % GEOMGYEOL_VERSES.length;
  const geomgyeolVerse = GEOMGYEOL_VERSES[verseIdx];

  return {
    engineVersion: SUUN_GASI_HEON_VERSION,
    calculatedAtKst: getKstDateString(),
    yongcheonSwordSeverancePower,
    samgyeongReverenceHarmony,
    buJaeRaeTimingAwakening,
    jiGiGeumJiCosmicQiFlow,
    sudeokHeartPurityIndex,
    activeCultivationStage,
    primarySamgyeongVirtue,
    geomgyeolVerse,
  };
}

export function formatSuunGasiHeonPrompt(result: SuunGasiHeonResult): string {
  return `[🗡️ 동학 수운 최제우 《용담유사》 검결(劍訣) 심기수련 & 삼경사상(三敬) 신탁 리포트]
- 엔진 버전: ${result.engineVersion}
- 용천검(龍泉劍) 심검 번뇌 결단력: ${result.yongcheonSwordSeverancePower}% (미혹과 악연을 베어내는 단호함)
- 삼경(경천·경인·경물) 합일 조화율: ${result.samgyeongReverenceHarmony}% (사인여천의 지극한 공경력)
- 부재래지 시호(不再來之時乎) 타이밍 각성력: ${result.buJaeRaeTimingAwakening}% (천재일우 골든타임 포착)
- 지기금지(至氣今至) 원초 우주기 수용도: ${result.jiGiGeumJiCosmicQiFlow}% (대자연의 지극한 생명력 순환)
- 수덕문(修德文) 덕성 정화 및 덕행 실천력: ${result.sudeokHeartPurityIndex}%
- 현행 심기 수련 단계: **[${result.activeCultivationStage.stageNameKo} (${result.activeCultivationStage.stageHanja})]**
  → 심검 상태: ${result.activeCultivationStage.innerSwordState}
  → 운기 영역: ${result.activeCultivationStage.cosmicResonanceDomain}
- 최우선 삼경(三敬) 실천 덕목: **[${result.primarySamgyeongVirtue.virtueNameKo} (${result.primarySamgyeongVirtue.virtueHanja})]**
  → 본질: ${result.primarySamgyeongVirtue.coreEssence}
  → 실천 지침: ${result.primarySamgyeongVirtue.actionablePractice}
- 용담유사 비전 가사: 《${result.geomgyeolVerse.verseTitle}》
  → 원문: "${result.geomgyeolVerse.hangeulText}"
  → 영적 해석: ${result.geomgyeolVerse.spiritualMeaning}`;
}
