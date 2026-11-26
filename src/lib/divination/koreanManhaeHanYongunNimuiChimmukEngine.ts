/**
 * 대한민국 만해 한용운(萬海 韓龍雲) 선생 《님의 침묵(The Silence of Love)》 & 《조선불교유신론》 역설적 사랑 승화 & 불교 유신·자주독립 지조 실천 엔진
 *
 * 일제강점기 민족대표 33인이자 위대한 시인, 불교 혁신 선각자 만해 한용운(萬海 韓龍雲, 1879~1944) 선사의 불후의 명작 《님의 침묵(1926)》, 《조선불교유신론(朝鮮佛敎維新論, 1913)》, 《조선독립의 서(朝鮮獨立之書, 1919)》 핵심 원전 기반:
 * 1. 님의 침묵 초연한 역설적 사랑 승화도: "아아, 님은 갔지마는 나는 님을 보내지 아니하였습니다"라는 위대한 역설처럼, 외형적 상실과 이별의 슬픔을 새로운 만남의 희망과 불멸의 사랑으로 승화하는 고결한 영성.
 * 2. 3·1 독립선언 공약삼장(公約三章)의 당당한 자주평화 지수: 타인을 원망하거나 배타적 폭력에 기대지 않고, 온 인류와 후손 앞에 정정당당하게 생명과 자유, 평화의 대도를 천명하는 자주독립 기개.
 * 3. 낡은 인습을 타파하는 조선불교유신 혁신 정진력: 깊은 산속의 고립된 미신과 안일한 타성을 깨부수고, 대중의 구체적 고통을 구제하며 세상을 혁신하는 살아있는 불교 유신의 실천적 용기.
 * 4. 진흙 속에서도 물들지 않는 출오염(出汚染) 연꽃 지조: 어떤 회유와 탄압 속에서도 호적에 이름을 올리지 않고 북향집(심우장)을 지키며 끝까지 민족의 얼을 수호한 백절불굴의 순결한 절의.
 * 5. 대의단(大疑團)과 철저한 깨달음의 원융 평정심: 백담사와 오세암의 혹독한 참선 속에서 분별망상을 털어내고, 생사의 고뇌를 꿰뚫어 만유일체의 대자유에 도달한 선사(禪師)의 심령 평정.
 *
 * @version LUCKEY-MANHAE-HAN-YONGUN-NIMUI-CHIMMUK-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_MANHAE_HAN_YONGUN_VERSION = 'LUCKEY-MANHAE-HAN-YONGUN-NIMUI-CHIMMUK-v2.4.0';

export interface HanYongunTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface HanYongunAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanjaOrContext: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ManhaeHanYongunNimuiChimmukResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 만해 한용운 사랑과 지조 지표 (0~100)
  nimuiChimmukTranscendentLoveScore: number;             // 님의 침묵 초연한 역설적 사랑 승화도 (님을 보내지 않는 사랑)
  gongyakSamjangIndependenceSovereigntyScore: number;    // 공약삼장 자주독립 및 당당한 평화 지수 (公約三章 自主平和)
  buddhistYusinReformationEnergyScore: number;          // 낡은 타성 타파 조선불교유신 혁신 정진력 (朝鮮佛敎維新 實踐力)
  unyieldingLotusIntegrityIndex: number;                // 세파에 물들지 않는 출오염 연꽃 지조 (出汚染 淨節)
  hwaduGreatDoubtEnlightenmentScore: number;            // 대의단 타파 및 만유일체 원융 평정심 (大疑團 圓融平靜)
  // 세부 분석
  activeHanYongunTheme: HanYongunTheme;
  secondaryHanYongunTheme: HanYongunTheme;
  focalHanYongunAphorism: HanYongunAphorism;
  secondaryHanYongunAphorism: HanYongunAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  hanYongunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  manhaeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  manhaeCrossAxis: {
    themePair: string;
    aphorismPair: string;
    vowAnchor: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatManhaeKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeManhaeStage(score: number): string {
  if (score >= 90) return '만유일체 대각(萬有一體 大覺) — 상실의 침묵마저 자유와 사랑의 노래로 승화한 원숙기';
  if (score >= 80) return '출오염 빙옥(出汚染 氷玉) — 세파 속에서도 고결한 지조와 유신의 기개를 지키는 성숙기';
  return '대의단 참구(大疑團 參究) — 흔들리는 마음을 화두 삼아 본래의 자유를 찾아가는 정진기';
}

export const HAN_YONGUN_THEMES: HanYongunTheme[] = [
  {
    themeKey: 'transcendent_paradoxical_love',
    themeTitleHanja: '逆說的 愛慕 (역설적 애모와 회향)',
    themeTitleKo: '상실과 이별의 슬픔을 거름 삼아 더 깊은 사랑과 희망을 창조함',
    existentialInsight: '눈앞의 이별에 절망하여 눈물만 흘리면 사랑은 끝납니다. 참된 사랑은 겉모습의 부재를 넘어 내면의 영원한 일치로 승화되며, 그 깊은 침묵 속에서 다시 만날 신념을 빚어냅니다.',
    practicalCounsel: '지나간 인연이나 일시적인 상실에 낙담하지 마십시오. 그 시련을 계기 삼아 당신의 영혼을 더욱 성숙시키고, 가슴속에 새로운 희망의 노래를 품으십시오.',
  },
  {
    themeKey: 'sovereign_peaceful_dignity',
    themeTitleHanja: '公約三章 自主尊嚴 (공약삼장과 자주 존엄)',
    themeTitleKo: '남을 탓하거나 비굴해지지 않고 당당하고 의연하게 주권을 선언함',
    existentialInsight: '진정한 자주는 남을 원망하거나 폭력으로 맞서는 데서 오지 않습니다. 가장 정정당당한 도덕적 명분과 평화로운 기개로 자기 삶의 완전한 주권을 선포할 때 누구도 침범할 수 없습니다.',
    practicalCounsel: '환경이나 타인의 핑계를 대지 마십시오. 오늘 당신의 말과 행동에서 가장 의연하고 떳떳한 품격을 지키며, 스스로 삶의 온전한 주인이 되십시오.',
  },
  {
    themeKey: 'yusin_and_reformation',
    themeTitleHanja: '佛敎維新 實踐破邪 (불교유신과 파사현정)',
    themeTitleKo: '낡은 껍데기와 타성을 과감히 부수고 대중과 함께 호흡하는 새 생명을 염',
    existentialInsight: '과거의 전통이라 해서 낡은 인습에 안주하면 정신은 썩어버립니다. 파괴할 것은 과감히 파괴하고 건설할 것은 새롭게 건설할 때 비로소 진리의 참된 생명력이 솟아납니다.',
    practicalCounsel: '익숙하다는 이유로 붙들고 있는 낡은 습관과 무기력한 타성을 단호히 털어내십시오. 시대의 변화에 발맞추어 스스로를 끊임없이 쇄신하십시오.',
  },
  {
    themeKey: 'unyielding_lotus_purity',
    themeTitleHanja: '出汚染 氷玉志操 (출오염의 연꽃과 빙옥 같은 지조)',
    themeTitleKo: '탁한 세상의 유혹과 압박 속에서도 물들지 않는 맑고 곧은 절의를 지킴',
    existentialInsight: '진흙탕 속에서 피어나는 연꽃은 진흙에 물들지 않고 그윽한 향기를 온 누리에 퍼뜨립니다. 세상이 아무리 혼탁할지라도 자기 내면의 순수한 뜻을 지키는 사람은 결코 꺾이지 않습니다.',
    practicalCounsel: '눈앞의 사리사욕이나 시류의 눈치에 타협하지 마십시오. 당신의 고결한 원칙과 양심을 끝까지 수호할 때 세월이 흐를수록 그 빛이 더욱 영롱해집니다.',
  },
  {
    themeKey: 'great_doubt_and_awakening',
    themeTitleHanja: '大疑團 萬有一體 (대의단과 만유일체의 대자유)',
    themeTitleKo: '고뇌의 밑바닥까지 정면으로 파고들어 마침내 걸림 없는 대자유를 얻음',
    existentialInsight: '고민을 피하거나 미봉책으로 덮으려 하면 번뇌는 끊이지 않습니다. 의문의 덩어리를 온몸으로 품고 끝까지 뚫고 나아갈 때, 자타의 분별이 사라지고 온 우주와 하나 되는 대자유가 열립니다.',
    practicalCounsel: '마음속 의문이나 고뇌를 두려워하지 마십시오. 그 의문을 화두 삼아 깊이 응시하십시오. 의심이 지극한 곳에서 홀연히 눈앞이 환하게 트이는 대각(大覺)이 찾아옵니다.',
  },
];

export const HAN_YONGUN_APHORISMS: HanYongunAphorism[] = [
  {
    aphorismKey: 'nim_has_gone_not_sent',
    aphorismKo: '아아, 님은 갔지마는 나는 님을 보내지 아니하였습니다. 제 곡조를 못 이기는 사랑의 노래는 님의 침묵을 휩싸고 돕니다.',
    aphorismHanjaOrContext: '아아 님은 갔지마는 나는 님을 보내지 아니하였습니다',
    sourceContext: '《님의 침묵(1926)》 표제시 <님의 침묵>',
    actionGuidance: '상황의 외적인 결핍에 흔들리지 말고, 내면의 흔들리지 않는 신념과 사랑으로 상황을 장악하십시오.',
  },
  {
    aphorismKey: 'faith_in_reunion',
    aphorismKo: '우리는 만날 때에 떠날 것을 염려하는 것과 같이, 떠날 때에 다시 만날 것을 믿습니다.',
    aphorismHanjaOrContext: '떠날 때에 다시 만날 것을 믿습니다',
    sourceContext: '《님의 침묵》 <님의 침묵>',
    actionGuidance: '일시적인 막힘이나 이별을 끝이라 단정하지 말고, 더 큰 만남을 위한 성숙의 과정으로 긍정하십시오.',
  },
  {
    aphorismKey: 'freedom_life_of_all_beings',
    aphorismKo: '자유는 만유의 생명이요 평화는 인류의 행복이라. 한 사람의 자유를 뺏는 것은 모든 사람의 자유를 뺏는 것이다.',
    aphorismHanjaOrContext: '自由는 萬有의 生命이요 平和는 人類의 幸福이라',
    sourceContext: '《조선독립의 서(朝鮮獨立之書, 1919)》',
    actionGuidance: '나 자신의 주체적 자유를 지키는 동시에, 곁에 있는 모든 이들의 존엄과 자유를 깊이 공경하십시오.',
  },
  {
    aphorismKey: 'destroy_and_construct',
    aphorismKo: '파괴할 것은 파괴하고 건설할 것은 건설하라. 낡은 타성과 허위를 깨지 않고서는 새로운 생명을 피울 수 없다.',
    aphorismHanjaOrContext: '破壞할 것은 破壞하고 建設할 것은 建設하라',
    sourceContext: '《조선불교유신론(朝鮮佛敎維新論, 1913)》',
    actionGuidance: '과감하게 버릴 것은 과감히 결단하여 털어내고, 진정으로 가치 있는 일에 새 살을 돋우십시오.',
  },
];

export function calculateManhaeHanYongunNimuiChimmuk(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ManhaeHanYongunNimuiChimmukResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MANHAE-HAN-YONGUN-NIMUI-CHIMMUK:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const nimuiChimmukTranscendentLoveScore = 76 + (absHash % 23);
  const gongyakSamjangIndependenceSovereigntyScore = 75 + ((absHash >> 3) % 24);
  const buddhistYusinReformationEnergyScore = 74 + ((absHash >> 6) % 25);
  const unyieldingLotusIntegrityIndex = 77 + ((absHash >> 9) % 22);
  const hwaduGreatDoubtEnlightenmentScore = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % HAN_YONGUN_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 6) % (HAN_YONGUN_THEMES.length - 1))) % HAN_YONGUN_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HAN_YONGUN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (HAN_YONGUN_APHORISMS.length - 1))) % HAN_YONGUN_APHORISMS.length;

  const activeHanYongunTheme = HAN_YONGUN_THEMES[themeIndex];
  const secondaryHanYongunTheme = HAN_YONGUN_THEMES[secondaryThemeIndex];
  const focalHanYongunAphorism = HAN_YONGUN_APHORISMS[aphorismIndex];
  const secondaryHanYongunAphorism = HAN_YONGUN_APHORISMS[secondaryAphorismIndex];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `만해 한용운의 《님의 침묵》 '${activeHanYongunTheme.themeTitleHanja}'와 '${secondaryHanYongunTheme.themeTitleHanja}'를 비추어 볼 때, "${trimmedQuery}"에서 침묵 속에 지키며 승화해야 할 신념은 무엇인가요?`
    : `지금 마음을 다잡는 자리에서, '${activeHanYongunTheme.themeTitleHanja}'의 결기와 '${secondaryHanYongunTheme.themeTitleHanja}'의 지조를 함께 세우려면 무엇을 끊고 무엇을 지켜야 할까요?`;

  const interpretiveBoundary = '이 지표는 만해 한용운 선사의 《님의 침묵》·《조선불교유신론》·《조선독립의 서》에 담긴 역설적 사랑과 자주 지조 철학을 내면 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';

  const guidanceTitle = `만해 한용운 님의 침묵 사랑과 자주 지조: ${activeHanYongunTheme.themeTitleKo}`;
  const philosophicalCounsel = `만해 한용운 선사의 역설적 사랑과 백절불굴의 지조는 세속의 슬픔과 억압을 딛고, 불멸의 신념과 당당한 자유의 대도를 열어가도록 일깨웁니다. ` +
    `현재 당신의 삶을 비추는 독립과 상생의 화두는 '${activeHanYongunTheme.themeTitleKo}'입니다. ` +
    `${activeHanYongunTheme.practicalCounsel} 아울러 만해 선사의 불후의 명구 "${focalHanYongunAphorism.aphorismKo}"(${focalHanYongunAphorism.aphorismHanjaOrContext})를 깊이 마음에 새기고, ` +
    `${focalHanYongunAphorism.actionGuidance}`;

  const calculatedAtKst = formatManhaeKstTimestamp(now);
  const avgScore = Math.round(
    (nimuiChimmukTranscendentLoveScore +
      gongyakSamjangIndependenceSovereigntyScore +
      buddhistYusinReformationEnergyScore +
      unyieldingLotusIntegrityIndex +
      hwaduGreatDoubtEnlightenmentScore) /
      5,
  );
  const manhaeSynthesisMatrix = {
    dominantTension: `${activeHanYongunTheme.themeTitleKo} ↔ ${focalHanYongunAphorism.sourceContext}`,
    alignmentState: describeManhaeStage(avgScore),
    integratedAction: `${focalHanYongunAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };
  const manhaeCrossAxis = {
    themePair: `${activeHanYongunTheme.themeTitleHanja.split(' ')[0]} ↔ ${secondaryHanYongunTheme.themeTitleHanja.split(' ')[0]}`,
    aphorismPair: `${focalHanYongunAphorism.aphorismKey} · ${secondaryHanYongunAphorism.aphorismKey}`,
    vowAnchor: focalHanYongunAphorism.sourceContext,
  };

  const ritualAction = `[${activeHanYongunTheme.themeTitleHanja}] ${focalHanYongunAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_MANHAE_HAN_YONGUN_VERSION,
    calculatedAtKst,
    nimuiChimmukTranscendentLoveScore,
    gongyakSamjangIndependenceSovereigntyScore,
    buddhistYusinReformationEnergyScore,
    unyieldingLotusIntegrityIndex,
    hwaduGreatDoubtEnlightenmentScore,
    activeHanYongunTheme,
    secondaryHanYongunTheme,
    focalHanYongunAphorism,
    secondaryHanYongunAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    hanYongunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    manhaeSynthesisMatrix,
    manhaeCrossAxis,
    ritualAction,
    reflectionFocus,
  };
}

export function formatManhaeHanYongunNimuiChimmukPrompt(res: ManhaeHanYongunNimuiChimmukResult): string {
  const avgScore = Math.round(
    (res.nimuiChimmukTranscendentLoveScore +
      res.gongyakSamjangIndependenceSovereigntyScore +
      res.buddhistYusinReformationEnergyScore +
      res.unyieldingLotusIntegrityIndex +
      res.hwaduGreatDoubtEnlightenmentScore) /
      5,
  );
  const lines = [
    `【만해 한용운 《님의 침묵》 역설적 사랑 & 자주 지조 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 선시·지조 국면: ${describeManhaeStage(avgScore)}`,
    `- 핵심 선시·독립 테마: ${res.activeHanYongunTheme.themeTitleKo} [${res.activeHanYongunTheme.themeTitleHanja}]`,
    `- 보조 교차 테마: ${res.secondaryHanYongunTheme.themeTitleKo} [${res.secondaryHanYongunTheme.themeTitleHanja}]`,
    `- 실존적 통찰: ${res.activeHanYongunTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeHanYongunTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalHanYongunAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryHanYongunAphorism.aphorismKo}" [${res.secondaryHanYongunAphorism.sourceContext}]`,
    `- 원전 출처: "${res.focalHanYongunAphorism.aphorismHanjaOrContext}" [${res.focalHanYongunAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHanYongunAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 만해 독립정신·선사 권면: ${res.hanYongunComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.manhaeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.manhaeSynthesisMatrix.dominantTension} | 조율 상태: ${res.manhaeSynthesisMatrix.alignmentState}]`,
      `- 만해 침묵·지조 교차 축: ${res.manhaeCrossAxis.themePair} | ${res.manhaeCrossAxis.vowAnchor}`,
      `- 통합 실천: ${res.manhaeSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
