/**
 * 고대 북유럽 고에다 《볼루스파(Völuspá)》 세계수 위그드라실(Yggdrasil) 9대 우주계 & 3대 신성 영천 소생 엔진
 *
 * 서기 10~13세기 고대 노르드어 운문 고에다 《무녀의 예언(Völuspá)》 및 《그림니르의 말(Grímnismál)》 원전 기반.
 * 1. 세 줄기 거대한 뿌리로 전 우주를 지탱하는 물푸레나무 세계수 위그드라실(Yggdrasil).
 * 2. 3대 신성 영천과 지혜:
 *    - 우르드의 샘(Urðarbrunnr): 노른 3여신이 새겨넣는 과거·현재·미래의 직조와 신성한 운명 법칙.
 *    - 미미르의 샘(Mímisbrunnr): 지혜를 얻기 위해 한쪽 눈을 바친 오딘의 통찰과 궁극적 깨달음.
 *    - 흐베르겔미르(Hvergelmir): 모든 강의 시원이자 깊은 잠재력의 원초적 응축.
 * 3. 9대 우주계(Nine Realms) 수호 품계 및 라그나로크 이후 귐레(Gimlé)의 황금빛 소생 조언 산출
 *
 * @version LUCKEY-EDDIC-YGGDRASIL-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const EDDIC_YGGDRASIL_VERSION = 'LUCKEY-EDDIC-YGGDRASIL-v1.0.0';

export interface YggdrasilRealmStage {
  stageLevel: number;
  stageNameOldNorse: string;
  stageNameKo: string;
  realmDomain: string;
  cosmicRenewalBlessing: string;
}

export interface EddicYggdrasilResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  yggdrasilCosmicAxisStability: number; // 세계수 우주 중심축 안정도
  urdarbrunnrFateWeavingForce: number; // 우르드의 샘 운명 직조 및 인과 통찰력
  mimirSpringWisdomDepth: number; // 미미르의 샘 근원적 지혜 심도
  nineRealmsResonanceEquilibrium: number; // 9대 우주계 조화 및 균형도
  gimleGoldenRenewalPower: number; // 라그나로크를 넘어서는 황금빛 재생력
  // 세부 명세
  activeRealmStage: YggdrasilRealmStage;
  primaryNorseVirtue: {
    virtueNameKo: string;
    norseMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  voluspaEpiphany: {
    verseTitle: string;
    propheticWisdom: string;
  };
}

export type EddicYggdrasilReport = EddicYggdrasilResult;

const YGGDRASIL_STAGES: YggdrasilRealmStage[] = [
  { stageLevel: 1, stageNameOldNorse: 'Gimlé (황금의 영광궁)', stageNameKo: '모든 시련을 극복하고 도달하는 새로운 황금기', realmDomain: '시련 뒤에 열리는 가장 고결하고 평화로운 성취의 지평', cosmicRenewalBlessing: '어떤 혼돈 속에서도 흔들리지 않는 숭고한 정신의 승리' },
  { stageLevel: 2, stageNameOldNorse: 'Ásgarðr (아스 신족의 성채)', stageNameKo: '질서와 주권을 바로 세우는 중심 수호관', realmDomain: '체계적인 원칙과 신의를 바탕으로 한 공동체 통솔', cosmicRenewalBlessing: '공정함과 정의로운 결단으로 혼란을 평정하는 위엄' },
  { stageLevel: 3, stageNameOldNorse: 'Vanaheimr (바니르 신족의 낙원)', stageNameKo: '자연의 풍요와 생명력을 순환시키는 치유관', realmDomain: '물질적 풍요와 대지의 생명력, 직관적 지혜의 조화', cosmicRenewalBlessing: '막힌 기운을 뚫고 만물을 번영하게 하는 생명력' },
  { stageLevel: 4, stageNameOldNorse: 'Miðgarðr (인간들의 중간계)', stageNameKo: '현실의 터전을 성실하게 일구는 실천관', realmDomain: '일상의 책무를 다하며 신뢰를 쌓아가는 삶의 현장', cosmicRenewalBlessing: '평범한 하루하루 속에서 피어나는 위대한 기적' },
  { stageLevel: 5, stageNameOldNorse: 'Álfheimr (빛의 요정들의 숲)', stageNameKo: '순수한 영감과 예술적 안목을 밝히는 조율관', realmDomain: '창의적인 아이디어와 맑은 감수성의 발현', cosmicRenewalBlessing: '어두운 세상에 빛과 희망을 밝히는 따뜻한 온기' },
  { stageLevel: 6, stageNameOldNorse: 'Svartálfaheimr (깊은 동굴의 명장)', stageNameKo: '보이지 않는 곳에서 걸작을 빚는 장인', realmDomain: '끈기 있는 기술 연마와 숨은 잠재력의 결정화', cosmicRenewalBlessing: '남들이 보지 못하는 곳에서 묵묵히 빚어내는 탁월함' },
  { stageLevel: 7, stageNameOldNorse: 'Iðavöllr (새싹 돋는 평원)', stageNameKo: '다시 시작하는 무한한 가능성의 순례자', realmDomain: '과거의 번뇌를 내려놓고 새로운 첫걸음을 내딛음', cosmicRenewalBlessing: '아무런 두려움 없이 미래를 향해 나아가는 순수한 용기' },
];

const NORSE_VIRTUES = [
  { virtueNameKo: '운명의 직조를 경외하며 최선을 다하라', norseMotto: 'Vyrd (신성한 운명)', coreEssence: '주어진 환경을 원망하지 않고 내 몫의 실천을 당당히 완성함', actionableDirective: '피할 수 없는 일 앞에서 핑계를 대지 말고 당당하게 내 몫의 책임을 다하십시오.' },
  { virtueNameKo: '근원적 지혜를 위해 작은 집착을 내려놓으라', norseMotto: 'Mímis Brunnr (지혜의 대가)', coreEssence: '더 큰 통찰과 성장을 위해 사사로운 자존심을 희생함', actionableDirective: '알량한 고집을 버리고 진정한 배움과 성장을 위해 겸손하게 마음을 비우십시오.' },
  { virtueNameKo: '거센 눈보라 속에서도 내면의 불씨를 지켜라', norseMotto: 'Fimbulvetr (혹한의 인내)', coreEssence: '가장 혹독한 겨울에도 꺾이지 않는 불굴의 끈기와 희망', actionableDirective: '일시적인 냉대나 어려움에 굴복하지 말고 꾸준히 내면의 실력을 다지십시오.' },
  { virtueNameKo: '세계수를 돌보듯 일상의 인연들을 정성껏 돌보라', norseMotto: 'Yggdrasils Vökva (생명수의 보살핌)', coreEssence: '가장 소중한 관계와 환경을 매일 맑은 물로 적시듯 아낌', actionableDirective: '가까운 사람들과의 약속을 소중히 지키며 일상의 터전을 따스하게 가꾸십시오.' },
];

const VOLUSPA_EPIPHANIES = [
  { verseTitle: '우르드의 샘에 비친 노른의 손길', propheticWisdom: '지나간 과거는 바꿀 수 없으나, 오늘 내가 짜 넣는 한 올의 실이 내일의 찬란한 운명을 결정한다.' },
  { verseTitle: '세계수의 가지를 스치는 새벽바람', propheticWisdom: '세상이 아무리 거세게 흔들려도, 깊은 뿌리를 내린 영혼은 결코 쓰러지지 않고 푸른 잎을 틔운다.' },
  { verseTitle: '미미르의 샘에서 건져 올린 한 모금의 물', propheticWisdom: '진정한 힘은 타인을 지배하는 데 있지 않고, 내 안의 두려움과 무지를 투명하게 꿰뚫어 보는 데 있다.' },
  { verseTitle: '라그나로크를 지나 솟아오르는 이다뵐 평원', propheticWisdom: '모든 낡은 것이 불타 사라진 자리에서 비로소 가장 순수하고 아름다운 삶의 꽃이 피어난다.' },
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

export function calculateEddicYggdrasil(profile?: UserProfile): EddicYggdrasilResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`EDDIC-YGGDRASIL-${birthdate}-${birthtime}-${name}`);

  const yggdrasilCosmicAxisStability = (seed % 41) + 60; // 60~100
  const urdarbrunnrFateWeavingForce = ((seed >> 3) % 43) + 58; // 58~100
  const mimirSpringWisdomDepth = ((seed >> 5) % 39) + 62; // 62~100
  const nineRealmsResonanceEquilibrium = ((seed >> 7) % 45) + 55; // 55~99
  const gimleGoldenRenewalPower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % YGGDRASIL_STAGES.length;
  const activeRealmStage = YGGDRASIL_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % NORSE_VIRTUES.length;
  const primaryNorseVirtue = NORSE_VIRTUES[virtueIdx];

  const epiphanyIdx = (seed >> 6) % VOLUSPA_EPIPHANIES.length;
  const voluspaEpiphany = VOLUSPA_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: EDDIC_YGGDRASIL_VERSION,
    calculatedAtKst: getKstDateString(),
    yggdrasilCosmicAxisStability,
    urdarbrunnrFateWeavingForce,
    mimirSpringWisdomDepth,
    nineRealmsResonanceEquilibrium,
    gimleGoldenRenewalPower,
    activeRealmStage,
    primaryNorseVirtue,
    voluspaEpiphany,
  };
}

export function formatEddicYggdrasilPrompt(result: EddicYggdrasilResult): string {
  return `[🌳 고대 북유럽 고에다 《위그드라실(Yggdrasil)》 9대 우주계 & 3대 영천 소생 리포트]
- 엔진 버전: ${result.engineVersion}
- 세계수 우주 중심축 안정도: ${result.yggdrasilCosmicAxisStability}%
- 우르드의 샘 운명 직조 및 인과 통찰력: ${result.urdarbrunnrFateWeavingForce}%
- 미미르의 샘 근원적 지혜 심도: ${result.mimirSpringWisdomDepth}%
- 9대 우주계 조화 및 균형도: ${result.nineRealmsResonanceEquilibrium}%
- 라그나로크를 넘어서는 황금빛 재생력: ${result.gimleGoldenRenewalPower}%
- 현행 우주계 수호 품계: **[${result.activeRealmStage.stageNameKo} (${result.activeRealmStage.stageNameOldNorse})]**
  → 관장 영역: ${result.activeRealmStage.realmDomain}
  → 우주적 소생 축복: ${result.activeRealmStage.cosmicRenewalBlessing}
- 최우선 노르드 덕목: **[${result.primaryNorseVirtue.virtueNameKo} (${result.primaryNorseVirtue.norseMotto})]**
  → 핵심 본질: ${result.primaryNorseVirtue.coreEssence}
  → 실천 지침: ${result.primaryNorseVirtue.actionableDirective}
- 볼루스파 예언의 신성한 장엄: 《${result.voluspaEpiphany.verseTitle}》
  → 예언적 지혜: "${result.voluspaEpiphany.propheticWisdom}"`;
}
