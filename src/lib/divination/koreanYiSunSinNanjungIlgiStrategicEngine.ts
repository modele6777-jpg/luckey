/**
 * 충무공 이순신 장군 친필 《난중일기(亂中日記)》 필사즉생(必死則生) 전략 & 명량 대역전 결의 엔진
 *
 * 1592~1598년 7년 임진왜란 중 충무공 이순신의 친필 일기 《난중일기(국보 제76호, 유네스코 세계기록유산)》 원전 기반.
 * 1. 열두 척의 배로 백서른세 척의 적선을 물리친 인류 해전사 불멸의 기적 '명량대첩'의 심지:
 *    - "必死則生 必生則死 (죽고자 하면 살고, 살고자 하면 죽는다)"
 *    - "一夫當逕 足懼千夫 (한 사람이 길목을 지키면 천 명도 두렵게 할 수 있다)"
 * 2. 4대 전략적 우주 원칙:
 *    - 정밀 척후 및 지형지물 첩보(Precision Reconnaissance): 조류의 흐름과 울돌목의 좁은 길목을 꿰뚫어 봄.
 *    - 한산도 달 밝은 밤의 심기 평정(Hansando Composure): 극도의 고독과 압박감 속에서도 사사로운 감정을 씻어냄.
 *    - 거북선 방어 및 돌파력(Geobukseon Breakthrough): 철저한 사전 준비와 창의적 도구로 적의 예기를 꺾음.
 *    - 장졸들과의 동고동락(Soldier-General Solidarity): 땀과 눈물을 함께 흘리며 쌓아 올린 절대적 신뢰.
 * 3. 7대 전술적 품계 및 난중일기 친필 성찰 조언 산출
 *
 * @version LUCKEY-YISUNSIN-NANJUNG-ILGI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const YISUNSIN_NANJUNG_ILGI_VERSION = 'LUCKEY-YISUNSIN-NANJUNG-ILGI-v1.0.0';

export interface YiSunSinStrategicStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  commandDomain: string;
  navalBreakthroughBlessing: string;
}

export interface YiSunSinNanjungIlgiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  pilsaJeuksaengResolutionForce: number; // 필사즉생(必死則生) 사즉생 각오 및 결단력
  ilbuDanggyeongNarrowChokepointPower: number; // 일부당경(一夫當逕) 길목 선점 지략
  hansandoMoonlitComposureScore: number; // 한산섬 달 밝은 밤 심기 평정 및 고독의 승화
  reconnaissanceIntelClarityIndex: number; // 정밀 척후 및 정세 투시 명료도
  geobukseonImpregnableShieldPower: number; // 거북선 돌파력 및 철벽 방호력
  // 세부 명세
  activeStrategicStage: YiSunSinStrategicStage;
  primaryChungmuVirtue: {
    virtueNameKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  nanjungIlgiReflection: {
    diaryEntryTitle: string;
    immortalWisdom: string;
  };
}

export type YiSunSinNanjungIlgiReport = YiSunSinNanjungIlgiResult;

const STRATEGIC_STAGES: YiSunSinStrategicStage[] = [
  { stageLevel: 1, stageNameHanja: 'Myeongnyang Daecheop (鳴梁大捷)', stageNameKo: '절망의 바다를 가르고 기적을 이루는 승전관', commandDomain: '완전한 불리함을 불굴의 의지와 길목 선점으로 뒤집는 역전', navalBreakthroughBlessing: '두려움을 용기로 바꾸어 절대적 열세를 극복하는 기적' },
  { stageLevel: 2, stageNameHanja: 'Hansan Dalbam (閑山月夜)', stageNameKo: '깊은 고독 속에서 천하를 품는 사색관', commandDomain: '소란스러운 세상에서 물러나 홀로 중심을 잡는 내면 수련', navalBreakthroughBlessing: '외로움과 압박을 지혜와 통찰로 승화시키는 평정심' },
  { stageLevel: 3, stageNameHanja: 'Danghangpo Pabal (唐項浦擺撥)', stageNameKo: '빈틈없는 첩보로 승기를 낚아채는 책략관', commandDomain: '적의 동태와 주변 지형을 정밀하게 탐색하는 사전 대비', navalBreakthroughBlessing: '싸우기 전에 이미 이겨놓고 싸움에 임하는 철저함' },
  { stageLevel: 4, stageNameHanja: 'Geobukseon Chulgyeok (龜船出擊)', stageNameKo: '창의적인 방패로 선봉을 뚫는 돌파관', commandDomain: '새로운 기술과 단단한 방비로 위험의 심장부로 진격함', navalBreakthroughBlessing: '남다른 준비와 창의력으로 위기의 벽을 부수는 추진력' },
  { stageLevel: 5, stageNameHanja: 'Jeonjin Donggo (全陣同苦)', stageNameKo: '부하들과 땀과 소금을 나누는 덕장', commandDomain: '상하가 한마음으로 뭉치는 신뢰의 공동체 형성', navalBreakthroughBlessing: '말이 아닌 행동으로 솔선수범하여 사람을 얻는 덕망' },
  { stageLevel: 6, stageNameHanja: 'Baekui Jonggun (白衣從軍)', stageNameKo: '억울함 속에서도 본분을 잃지 않는 지조관', commandDomain: '명예가 깎이고 억울한 누명을 써도 묵묵히 소명을 다함', navalBreakthroughBlessing: '세속의 인정에 일희일비하지 않는 우직한 성실함' },
  { stageLevel: 7, stageNameHanja: 'Yeosu Jinmu (麗水陣務)', stageNameKo: '매일의 일기를 쓰며 마음을 닦는 수련자', commandDomain: '작은 일상과 활쏘기, 점호 하나에도 정성을 다하는 기본기', navalBreakthroughBlessing: '성실한 하루하루가 쌓여 거대한 승리를 빚어내는 힘' },
];

const CHUNGMU_VIRTUES = [
  { virtueNameKo: '죽기를 각오하면 살고 살고자 하면 죽는다', hanjaMotto: '必死則生 必生則死', coreEssence: '목숨을 걸 만큼 결연한 태도로 임할 때 비로소 진정한 활로가 열림', actionableDirective: '어설픈 타협이나 핑계를 버리고 배수진을 치듯 전심전력으로 부딪치십시오.' },
  { virtueNameKo: '한 사람이 길목을 지키면 천 명도 두렵게 할 수 있다', hanjaMotto: '一夫當逕 足懼千夫', coreEssence: '나의 강점이 극대화되는 좁은 길목과 시점을 정확히 선점함', actionableDirective: '전선을 넓혀 힘을 분산시키지 말고 가장 유리한 단 하나의 핵심에 집중하십시오.' },
  { virtueNameKo: '가벼이 움직이지 말고 태산처럼 무겁게 침착하라', hanjaMotto: '勿令妄動 靜重如山', coreEssence: '감정에 휩쓸려 경거망동하지 않고 차분하게 냉정을 유지함', actionableDirective: '상대의 도발이나 조급함에 말려들지 말고 내 페이스를 확고하게 지키십시오.' },
  { virtueNameKo: '매일의 마음을 스스로 돌아보고 거짓 없이 기록하라', hanjaMotto: '日省其身 直心不欺', coreEssence: '하루를 정직하게 성찰하며 흐트러진 심기를 바로잡음', actionableDirective: '자신을 속이지 말고 오늘 하루의 부족함을 겸허히 반성하며 내일을 준비하십시오.' },
];

const NANJUNG_REFLECTIONS = [
  { diaryEntryTitle: '울돌목의 소용돌이치는 바다', immortalWisdom: '파도가 거세질수록 두려움도 커지지만, 그 파도의 흐름을 읽는 자에게는 적을 집어삼키는 가장 강력한 아군이 된다.' },
  { diaryEntryTitle: '한산섬 수루에 홀로 앉아', immortalWisdom: '세상 모든 사람이 나를 몰라주고 고립될지라도, 내 안의 양심과 하늘이 떳떳하다면 결코 외롭지 않다.' },
  { diaryEntryTitle: '비 내리는 진중의 촛불', immortalWisdom: '승리는 화려한 순간에 결정되는 것이 아니라, 아무도 보지 않는 밤 젖은 화약을 말리고 활시위를 다듬는 정성에서 온다.' },
  { diaryEntryTitle: '마지막 북소리와 붉은 노을', immortalWisdom: '나의 죽음을 적에게 알리지 말라 하셨듯, 진정한 영웅은 나의 이름이 아니라 남겨진 이들의 평화만을 바란다.' },
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

export function calculateYiSunSinNanjungIlgi(profile?: UserProfile): YiSunSinNanjungIlgiResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`YISUNSIN-NANJUNG-ILGI-${birthdate}-${birthtime}-${name}`);

  const pilsaJeuksaengResolutionForce = (seed % 41) + 60; // 60~100
  const ilbuDanggyeongNarrowChokepointPower = ((seed >> 3) % 43) + 58; // 58~100
  const hansandoMoonlitComposureScore = ((seed >> 5) % 39) + 62; // 62~100
  const reconnaissanceIntelClarityIndex = ((seed >> 7) % 45) + 55; // 55~99
  const geobukseonImpregnableShieldPower = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % STRATEGIC_STAGES.length;
  const activeStrategicStage = STRATEGIC_STAGES[stageIdx];

  const virtueIdx = (seed >> 4) % CHUNGMU_VIRTUES.length;
  const primaryChungmuVirtue = CHUNGMU_VIRTUES[virtueIdx];

  const reflectionIdx = (seed >> 6) % NANJUNG_REFLECTIONS.length;
  const nanjungIlgiReflection = NANJUNG_REFLECTIONS[reflectionIdx];

  return {
    engineVersion: YISUNSIN_NANJUNG_ILGI_VERSION,
    calculatedAtKst: getKstDateString(),
    pilsaJeuksaengResolutionForce,
    ilbuDanggyeongNarrowChokepointPower,
    hansandoMoonlitComposureScore,
    reconnaissanceIntelClarityIndex,
    geobukseonImpregnableShieldPower,
    activeStrategicStage,
    primaryChungmuVirtue,
    nanjungIlgiReflection,
  };
}

export function formatYiSunSinNanjungIlgiPrompt(result: YiSunSinNanjungIlgiResult): string {
  return `[⚔️ 충무공 이순신 장군 친필 《난중일기(亂中日記)》 필사즉생(必死則生) 전략 리포트]
- 엔진 버전: ${result.engineVersion}
- 필사즉생(必死則生) 사즉생 각오 및 결단력: ${result.pilsaJeuksaengResolutionForce}%
- 일부당경(一夫當逕) 길목 선점 지략: ${result.ilbuDanggyeongNarrowChokepointPower}%
- 한산섬 달 밝은 밤 심기 평정 및 고독의 승화: ${result.hansandoMoonlitComposureScore}%
- 정밀 척후 및 정세 투시 명료도: ${result.reconnaissanceIntelClarityIndex}%
- 거북선 돌파력 및 철벽 방호력: ${result.geobukseonImpregnableShieldPower}%
- 현행 전술적 품계: **[${result.activeStrategicStage.stageNameKo} (${result.activeStrategicStage.stageNameHanja})]**
  → 관장 영역: ${result.activeStrategicStage.commandDomain}
  → 해전 돌파 축복: ${result.activeStrategicStage.navalBreakthroughBlessing}
- 최우선 충무 덕목: **[${result.primaryChungmuVirtue.virtueNameKo} (${result.primaryChungmuVirtue.hanjaMotto})]**
  → 핵심 본질: ${result.primaryChungmuVirtue.coreEssence}
  → 실천 지침: ${result.primaryChungmuVirtue.actionableDirective}
- 난중일기 친필 성찰의 불멸성: 《${result.nanjungIlgiReflection.diaryEntryTitle}》
  → 불멸의 지혜: "${result.nanjungIlgiReflection.immortalWisdom}"`;
}
