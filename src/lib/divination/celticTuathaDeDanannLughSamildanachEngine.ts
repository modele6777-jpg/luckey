/**
 * 아일랜드 켈트 신화 투아하 데 다난 《루 라바다(Lugh Samildánach)》 8대 만능 기예 & 마그 투이레드 승전 엔진
 *
 * 서기 12세기 고대 아일랜드 신화 비전서 《에린 침략의 서(Lebor Gabála Érenn)》 및 《마그 투이레드 2차 전투》 원전 기반.
 * 1. 신들의 도시 타라(Tara)의 문지기에게 단 하나의 기예가 아닌 '세상의 모든 기예를 한 몸에 갖춘 자(Samildánach, All-Craftsman)'로서 당당히 입성한 빛의 신 루 라바다(긴 팔의 루).
 * 2. 8대 신성 만능 기예(Eight Polymathic Arts):
 *    - 사오르(Saor, 목수·건축): 단단한 기틀을 세우고 구조를 축조함.
 *    - 고바(Goba, 대장장이): 불굴의 도구와 무기를 벼려냄.
 *    - 쿠라드(Curadh, 영웅·전사): 두려움 없이 최전선을 돌파함.
 *    - 크루이트레(Cruitire, 하프 연주자): 음악과 예술로 영혼을 치유하고 감동시킴.
 *    - 필리(Filí, 시인·역사가): 지혜와 언어로 진실을 노래하고 전승함.
 *    - 루아그레(Luamaire, 항해사·천문학자): 별자리를 읽고 바른 방향을 인도함.
 *    - 리아그(Liaig, 의원·약사): 상처를 꿰매고 생명력을 회복시킴.
 *    - 다일렘(Dáilem, 헌작관·환대자): 화합과 환대의 잔치를 베풂.
 * 3. 7대 다재다능 품계 및 루의 신성 투석구 타흘룸 조언 산출
 *
 * @version LUCKEY-LUGH-SAMILDANACH-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const LUGH_SAMILDANACH_VERSION = 'LUCKEY-LUGH-SAMILDANACH-v2.2.0';

export interface LughCraftRank {
  rankLevel: number;
  rankNameOldIrish: string;
  rankNameKo: string;
  artisanDomain: string;
  polymathicBlessing: string;
}

export interface LughSamildanachResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  samildanachPolymathIntegrityIndex: number; // 사밀다나크 만능 융합 및 다재다능 지수
  areadbharSpearOfLightPrecision: number; // 빛의 창 아레아드바르 정밀 타격력
  taraHallAdmissionWorthiness: number; // 타라 왕궁 입성 자격 및 위엄도
  magTuiredStrategicVictoryPower: number; // 마그 투이레드 전황 반전 및 전략 승전력
  eightArtsHarmoniousMastery: number; // 8대 신성 기예의 고른 숙달도
  // 세부 명세
  activeCraftRank: LughCraftRank;
  primaryPolymathVirtue: {
    virtueNameKo: string;
    gaelicMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  magTuiredEpiphany: {
    battleSceneTitle: string;
    celticWisdom: string;
  };
  situationalLughAudit: {
    focusTheme: string;
    craftNote: string;
    tacticalStep: string;
  };
  temporalLughRhythm: {
    kstTimeLabel: string;
    taraWatchWindow: string;
    seasonalSolarTone: string;
    temporalGuidance: string;
  };
  lughSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

export type LughSamildanachReport = LughSamildanachResult;

const LUGH_RANKS: LughCraftRank[] = [
  { rankLevel: 1, rankNameOldIrish: 'Samildánach (모든 기예의 주인)', rankNameKo: '모든 영역을 통섭하여 기적을 이루는 만능 지도자', artisanDomain: '다양한 재능과 자원을 하나로 융합하여 결정적 승리를 쟁취', polymathicBlessing: '어떤 난관에 부딪혀도 적절한 해결책을 찾아내는 무한한 융통성' },
  { rankLevel: 2, rankNameOldIrish: 'Lámhfhada (태양 빛의 긴 팔)', rankNameKo: '먼 곳까지 선한 영향력을 뻗치는 원거리 전략관', artisanDomain: '시야를 넓히고 미래의 위기를 한발 앞서 차단함', polymathicBlessing: '정확한 타이밍에 핵심을 꿰뚫는 탁월한 집중력' },
  { rankLevel: 3, rankNameOldIrish: 'Ollamh (지혜의 최고 학사)', rankNameKo: '원칙과 지식을 체계화하는 학술관', artisanDomain: '깊이 있는 이론과 실천을 조화시키는 교육과 기록', polymathicBlessing: '상황의 본질을 명확히 이해하고 타인을 올바르게 이끄는 지혜' },
  { rankLevel: 4, rankNameOldIrish: 'Dagda Aite (선한 신들의 동반자)', rankNameKo: '동료들과 어깨를 맞대고 협력하는 신의관', artisanDomain: '상호 존중과 신뢰로 구축하는 강력한 팀워크', polymathicBlessing: '혼자의 영광보다 함께 이루는 승리의 기쁨' },
  { rankLevel: 5, rankNameOldIrish: 'Creidne Cerdd (황금과 청동의 명장)', rankNameKo: '실용적인 가치를 창조하는 실무관', artisanDomain: '탁월한 도구 개발과 현실적 결과물 도출', polymathicBlessing: '묵묵한 정성으로 사람들의 삶을 이롭게 하는 기술력' },
  { rankLevel: 6, rankNameOldIrish: 'Cairpre Filí (진리의 음유시인)', rankNameKo: '언어로 부조리를 깨뜨리는 비판관', artisanDomain: '거짓을 고발하고 정의를 바로 세우는 정론', polymathicBlessing: '마음을 울리는 진실된 언어로 용기를 북돋움' },
  { rankLevel: 7, rankNameOldIrish: 'Óclach Tara (타라 궁정의 젊은 도전자)', rankNameKo: '배움을 두려워하지 않는 열정의 순례자', artisanDomain: '기초 연마와 새로운 도전을 향한 호기심', polymathicBlessing: '실패를 딛고 계속 성장하는 유연한 회복력' },
];

const POLYMATH_VIRTUES = [
  { virtueNameKo: '한 분야에 안주하지 말고 지평을 넓혀라', gaelicMotto: 'Ildánacht (다양한 재능)', coreEssence: '전문성에 매몰되지 않고 다양한 안목을 키워 입체적으로 사고함', actionableDirective: '익숙한 방식에만 머무르지 말고 새로운 분야의 지혜를 열린 마음으로 배우십시오.' },
  { virtueNameKo: '가장 결정적인 순간에 전력을 집중하라', gaelicMotto: 'Tathlum (빛의 일격)', coreEssence: '에너지를 낭비하지 않고 핵심 목표에 단호히 집중함', actionableDirective: '자잘한 일들에 주의를 빼앗기지 말고 성패를 가를 단 하나의 본질에 승부를 거십시오.' },
  { virtueNameKo: '나의 재능을 세상의 해방을 위해 쓰라', gaelicMotto: 'Saoradh Tuatha (겨레의 해방)', coreEssence: '개인의 영달을 넘어 공동체의 고통을 덜어주는 대의를 품음', actionableDirective: '내가 가진 재주와 기회를 주변 사람들을 돕고 세상을 밝히는 데 사용하십시오.' },
  { virtueNameKo: '실패 속에서도 당당한 위엄을 잃지 말라', gaelicMotto: 'Grianán Tara (타라의 햇살)', coreEssence: '일시적인 패배에 기죽지 않고 태양처럼 밝은 자존감을 지킴', actionableDirective: '남들의 평가에 흔들리지 말고 스스로의 가치를 믿으며 묵묵히 전진하십시오.' },
];

const MAG_TUIRED_EPIPHANIES = [
  { battleSceneTitle: '타라 궁전 문지기와의 문답', celticWisdom: '세상에 한 가지 재주를 가진 자는 많으나, 모든 것을 엮어내는 통합의 지혜를 가진 자만이 진정한 지도자의 문을 통과한다.' },
  { battleSceneTitle: '빛의 투석구 타흘룸의 비상', celticWisdom: '거대한 어둠의 눈앞에서도 결코 물러서지 않고 정성을 다해 던진 한 알의 빛이 마침내 폭정을 무너뜨린다.' },
  { battleSceneTitle: '마그 투이레드 들판의 평화 잔치', celticWisdom: '진정한 승리는 적을 파멸시키는 것이 아니라, 전쟁의 상처를 치유하고 모든 이가 함께 누릴 평화의 들판을 일구는 데 있다.' },
  { battleSceneTitle: '수확의 제왕 루그나사드의 축복', celticWisdom: '봄에 뿌린 정성과 여름에 흘린 땀은 가을의 풍성한 식탁으로 돌아오나니, 때를 기다리는 자에게 결실은 필연이다.' },
];

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function getTemporalLughRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const taraWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 타라(Tara) 입성창 — 다양한 역량을 한 방향으로 모아 하루의 첫 기세를 여는 시간'
      : hour >= 11 && hour < 17
        ? '정오 아레아드바르(Areadbhar) 집중창 — 핵심 과업에 빛의 창처럼 정밀하게 집중하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 하프·환대창 — 긴장을 풀고 협력자들과 성과를 나누며 조율을 다지는 시간'
          : '심야 사밀다나크 관조창 — 흩어진 아이디어를 통합의 지혜로 엮어내는 시간';

  const seasonalSolarTone =
    month >= 3 && month <= 5
      ? '봄 · 기술 연마절 (새로운 도구와 지식을 익혀 지평을 넓히는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 루그나사드(Lughnasadh) 도약절 (재능이 가장 밝게 빛나고 결실을 빚는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 마그 투이레드 수확절 (전략적 완성도와 실행력을 증명하는 시기)'
          : '겨울 · 내면 연단절 (묵묵히 기본기를 벼려 다음 승부를 준비하는 시기)';

  return {
    kstTimeLabel: getKstDateString(now),
    taraWatchWindow,
    seasonalSolarTone,
    temporalGuidance: `${taraWatchWindow} · ${seasonalSolarTone}의 결에 맞추어 기예를 펼치십시오.`,
  };
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateLughSamildanach(
  profile?: UserProfile,
  nowArg?: Date,
  question?: string
): LughSamildanachResult {
  const now = nowArg || new Date();
  const q = (question || '').trim();
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`LUGH-SAMILDANACH-${birthdate}-${birthtime}-${name}`);

  const samildanachPolymathIntegrityIndex = (seed % 41) + 60; // 60~100
  const areadbharSpearOfLightPrecision = ((seed >> 3) % 43) + 58; // 58~100
  const taraHallAdmissionWorthiness = ((seed >> 5) % 39) + 62; // 62~100
  const magTuiredStrategicVictoryPower = ((seed >> 7) % 45) + 55; // 55~99
  const eightArtsHarmoniousMastery = ((seed >> 9) % 38) + 63; // 63~100

  const rankIdx = (seed >> 2) % LUGH_RANKS.length;
  const activeCraftRank = LUGH_RANKS[rankIdx];

  const virtueIdx = (seed >> 4) % POLYMATH_VIRTUES.length;
  const primaryPolymathVirtue = POLYMATH_VIRTUES[virtueIdx];

  const epiphanyIdx = (seed >> 6) % MAG_TUIRED_EPIPHANIES.length;
  const magTuiredEpiphany = MAG_TUIRED_EPIPHANIES[epiphanyIdx];

  const temporalLughRhythm = getTemporalLughRhythm(now);
  const situationalLughAudit = /일|커리어|프로젝트|창작|도전/.test(q)
    ? {
        focusTheme: `${activeCraftRank.rankNameKo} · 실전 다재다능 감사`,
        craftNote: activeCraftRank.artisanDomain,
        tacticalStep: primaryPolymathVirtue.actionableDirective,
      }
    : {
        focusTheme: `${primaryPolymathVirtue.gaelicMotto} · 내면 통합`,
        craftNote: primaryPolymathVirtue.coreEssence,
        tacticalStep: primaryPolymathVirtue.actionableDirective,
      };

  const lughSynthesisMatrix = {
    coreInsight: `[${activeCraftRank.rankNameKo}] ${activeCraftRank.polymathicBlessing}`,
    recommendedAction: primaryPolymathVirtue.actionableDirective,
    cautionNotice: magTuiredEpiphany.celticWisdom,
  };

  return {
    engineVersion: LUGH_SAMILDANACH_VERSION,
    calculatedAtKst: temporalLughRhythm.kstTimeLabel,
    samildanachPolymathIntegrityIndex,
    areadbharSpearOfLightPrecision,
    taraHallAdmissionWorthiness,
    magTuiredStrategicVictoryPower,
    eightArtsHarmoniousMastery,
    activeCraftRank,
    primaryPolymathVirtue,
    magTuiredEpiphany,
    situationalLughAudit,
    temporalLughRhythm,
    lughSynthesisMatrix,
    ritualAction: primaryPolymathVirtue.actionableDirective,
    reflectionFocus: `${activeCraftRank.rankNameKo}의 자리에서 지금 내가 흩어진 재주를 모아 일격을 가해야 할 단 하나의 과녁은 무엇인가요?`,
    boundaryNotice: '본 결과는 켈트 신화 루 삼힐다나크의 8대 만능 기예 원형에 기반한 정성적 역량·실행 가이드이며, 확정적 예언이 아닙니다.',
    interpretiveBoundary: '본 결과는 켈트 신화 루 삼힐다나크의 8대 만능 기예 원형에 기반한 정성적 역량·실행 가이드이며, 확정적 예언이 아닙니다.',
  };
}

export function formatLughSamildanachPrompt(result: LughSamildanachResult): string {
  const polymathTone = result.samildanachPolymathIntegrityIndex >= 85 ? '높은 융합 통섭력' : result.samildanachPolymathIntegrityIndex >= 70 ? '안정적 다재다능 균형' : '핵심 역량 집중 필요';
  const precisionTone = result.areadbharSpearOfLightPrecision >= 85 ? '예리한 핵심 관통력' : '정밀한 목표 정렬';
  const taraTone = result.taraHallAdmissionWorthiness >= 85 ? '충만한 자격과 위엄' : '견실한 실력 축적';
  const victoryTone = result.magTuiredStrategicVictoryPower >= 82 ? '강한 반전 돌파력' : '꾸준한 전략 우위';
  const artsTone = result.eightArtsHarmoniousMastery >= 85 ? '고른 만능 숙달' : '균형 잡힌 기예 조화';

  return `[⚡ 켈트 투아하 데 다난 《루 라바다(Lugh Samildánach)》 8대 만능 기예 리포트]
- 엔진 버전: ${result.engineVersion} | 연산 시각: ${result.calculatedAtKst}
- 사밀다나크 만능 융합 기조: ${polymathTone}
- 빛의 창 아레아드바르 정밀 기조: ${precisionTone}
- 타라 왕궁 입성 위엄 기조: ${taraTone}
- 마그 투이레드 전략 승전 기조: ${victoryTone}
- 8대 신성 기예 숙달 기조: ${artsTone}
- 현행 다재다능 품계: **[${result.activeCraftRank.rankNameKo} (${result.activeCraftRank.rankNameOldIrish})]**
  → 관장 영역: ${result.activeCraftRank.artisanDomain}
  → 만능 기예 축복: ${result.activeCraftRank.polymathicBlessing}
- 최우선 켈트 덕목: **[${result.primaryPolymathVirtue.virtueNameKo} (${result.primaryPolymathVirtue.gaelicMotto})]**
  → 핵심 본질: ${result.primaryPolymathVirtue.coreEssence}
  → 실천 지침: ${result.primaryPolymathVirtue.actionableDirective}
- 마그 투이레드 신화의 계시: 《${result.magTuiredEpiphany.battleSceneTitle}》
  → 켈트의 불멸 지혜: "${result.magTuiredEpiphany.celticWisdom}"
- 질문 맥락 감사 (${result.situationalLughAudit.focusTheme}): ${result.situationalLughAudit.tacticalStep}
- KST 시공간 리듬: ${result.temporalLughRhythm.taraWatchWindow} / ${result.temporalLughRhythm.seasonalSolarTone}
- 루 교차 매트릭스: 핵심(${result.lughSynthesisMatrix.coreInsight}) | 실행(${result.lughSynthesisMatrix.recommendedAction}) | 계시(${result.lughSynthesisMatrix.cautionNotice})
- 해석 경계: ${result.boundaryNotice}`;
}
