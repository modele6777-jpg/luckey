/**
 * 대한민국 서포 김만중(西浦 金萬重) 선생 《구운몽》 & 《사씨남정기》 일장춘몽 세속 환상 각성 & 금강경 공관·지극한 효성·초연한 회복탄력성 지혜 엔진
 *
 * 조선 중기 대문호 서포 김만중(1637~1692) 선생의 원전 기반:
 * 1. 일장춘몽 세속 영화의 허상 직시도 (Guunmong Illusory Fame Penetration Score): 양소유의 팔선녀 부귀영화가 한바탕 꿈이었음을 꿰뚫어 보듯 세속의 덧없는 집착을 벗겨내는 혜안.
 * 2. 금강경 반야공관 및 참된 본래면목 회복 지수 (Prajnaparamita Void & True Self Restoration Index): 번뇌와 미망을 털어내고 본래 맑고 고요한 영혼의 본성(성진의 각성)으로 돌아가는 지혜.
 * 3. 사씨남정기 정경순결 및 도의적 신의 지표 (Righteous Integrity & Moral Fidelity Index): 모함과 유혹 속에서도 사씨의 덕행처럼 도의와 절개를 흐트러뜨리지 않는 고결함.
 * 4. 남해 유배의 풍파 속 지극한 효심과 문학적 승화도 (Filial Devotion & Literary Sublimation Score): 귀양지의 처절한 고난 속에서도 홀어머니의 근심을 덜고자 명작을 써 내려간 지극한 효성과 승화력.
 * 5. 세속의 성패를 초월한 초연한 심신 회복탄력성 (Transcendent Equanimity & Serene Resilience Score): 득실과 영화, 궁달의 기복에 일희일비하지 않고 허공처럼 맑은 평정을 유지하는 회복탄력성.
 *
 * @version LUCKEY-SEOPO-KIM-MAN-JUNG-GUUNMONG-AWAKENING-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_SEOPO_KIM_MAN_JUNG_GUUNMONG_AWAKENING_VERSION = 'LUCKEY-SEOPO-KIM-MAN-JUNG-GUUNMONG-AWAKENING-v2.0.0';

export interface GuunmongTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  awakeningInsight: string;
  practicalCounsel: string;
}

export interface GuunmongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanSeopoKimManJungGuunmongAwakeningResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 서포 김만중 핵심 지표 (0~100)
  guunmongIllusoryFamePenetrationScore: number;          // 일장춘몽 세속 영화의 허상 직시도 (Illusory Fame Penetration)
  prajnaparamitaVoidTrueSelfIndex: number;               // 금강경 반야공관 및 본래면목 회복 지수 (Prajnaparamita Void & True Self)
  righteousIntegrityMoralFidelityIndex: number;          // 사씨남정기 정경순결 및 도의적 신의 지표 (Righteous Integrity & Fidelity)
  filialDevotionLiterarySublimationScore: number;        // 지극한 효심과 시련의 문학적 승화도 (Filial Devotion & Sublimation)
  transcendentEquanimityResilience: number;              // 세속 성패를 초월한 초연한 회복탄력성 (Transcendent Equanimity Resilience)
  // 세부 분석
  activeGuunmongTheme: GuunmongTheme;
  focalGuunmongAphorism: GuunmongAphorism;
  guunmongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  guunmongSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatGuunmongKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeGuunmongStage(score: number): string {
  if (score >= 95) return '몽각불이(夢覺不二) — 일장춘몽을 꿰뚫어 본 성진의 맑은 본래면목과 효심이 합일된 각성기';
  if (score >= 91) return '반야공관(般若空觀) — 세속의 성패와 모함에 흔들리지 않는 초연한 평정기';
  return '입몽성찰(入夢省察) — 화려한 영욕 너머의 본질을 조용히 비추어 보는 정돈기';
}

export const GUUNMONG_THEMES: GuunmongTheme[] = [
  {
    themeKey: 'springDreamAwakening',
    themeTitleEn: 'Awakening from the Illusory Dream: Seeing Beyond the Transience of Worldly Fame',
    themeTitleKo: '일장춘몽의 대오각성 — 양소유의 부귀영화를 꿰뚫어 보고 헛된 집착 내려놓기',
    awakeningInsight: '서포 김만중의 《구운몽》에서 양소유가 승상의 부귀와 팔선녀의 영화를 누린 뒤 육관대사의 석장을 맞고 본래의 수행자 성진으로 깨어나듯, 세상의 화려한 인정과 성패는 한바탕 봄꿈에 불과함을 알아채는 통찰입니다.',
    practicalCounsel: '타인의 찬사와 세속적 지위, 일시적인 손익에 마음을 빼앗기지 마십시오. 꿈속의 허상을 걷어내고, 진정으로 당신의 영혼을 평화롭고 순수하게 만드는 본래의 길에 집중하십시오.',
  },
  {
    themeKey: 'diamondSutraEmptiness',
    themeTitleEn: 'Prajnaparamita Void: Returning to the Untainted Purity of the Original Mind',
    themeTitleKo: '금강경 반야공관의 평정 — 색즉시공(色卽是空)의 지혜로 번뇌와 집착의 그물을 털어내기',
    awakeningInsight: '육관대사는 성진에게 "꿈과 생시가 둘이 아니거늘, 네가 아직 분별심을 버리지 못하였구나"라고 가르쳤습니다. 형상과 소리에 얽매이지 않는 맑은 본성을 회복할 때 일체의 두려움과 결핍이 사라집니다.',
    practicalCounsel: '마음속에 피어오르는 불안과 욕망을 억누르려 하지 말고 그저 텅 빈 구름처럼 흘려보내십시오. 본래 당신의 참마음은 어떠한 풍파에도 더럽혀지지 않는 맑은 거울과 같습니다.',
  },
  {
    themeKey: 'righteousSteadfastness',
    themeTitleEn: 'Righteous Integrity: Upholding Moral Truth Against Slander and Calumny',
    themeTitleKo: '사씨남정기의 정경순결 — 간계와 모함 앞에서도 바른 도리와 지조를 잃지 않기',
    awakeningInsight: '《사씨남정기》의 사씨 부인은 교씨의 모함으로 억울하게 쫓겨나면서도 끝내 남편과 가문을 원망하지 않고 도덕적 순결을 지켜냅니다. 사필귀정(事必歸正)의 순리를 믿는 의연함이 결국 악을 녹여냅니다.',
    practicalCounsel: '오해나 억울한 비난에 일일이 변명하거나 똑같이 감정적으로 맞서지 마십시오. 당신의 곧고 바른 행동을 흔들림 없이 이어가십시오. 시간은 언제나 거짓을 털어내고 진실의 편에 섭니다.',
  },
  {
    themeKey: 'filialSublimation',
    themeTitleEn: 'Filial Sublimation: Turning Exile and Suffering into Works of Eternal Love and Grace',
    themeTitleKo: '유배지의 효심과 승화 — 절해고도의 모진 풍파를 지극한 사랑과 문학의 걸작으로 빚기',
    awakeningInsight: '김만중 선생은 남해 노도 유배지의 참담한 환경 속에서도 홀어머니 윤씨 부인의 외로움과 시름을 덜어드리기 위해 단숨에 《구운몽》을 집필했습니다. 지극한 효심과 선한 의지는 어떤 고난도 불후의 걸작으로 승화시킵니다.',
    practicalCounsel: '주어진 환경이 척박하고 외로울수록 소중한 이를 향한 따스한 마음을 회복하십시오. 당신의 고통을 불평으로 낭비하지 않고, 누군가를 위로하는 따뜻한 창작과 선행으로 승화시키십시오.',
  },
];

export const GUUNMONG_APHORISMS: GuunmongAphorism[] = [
  {
    aphorismKey: 'dreamAndWakingNotTwo',
    aphorismKo: '꿈과 생시가 다르지 않거늘, 양소유가 꿈이고 성진이 생시인가, 성진이 꿈이고 양소유가 생시인가? 부귀영화는 헛된 구름이요, 오직 맑은 본성만이 영원하다.',
    aphorismHanja: '夢覺無二 幻化非眞',
    sourceContext: '서포 김만중 《구운몽(九雲夢)》 제16회 대오각성',
    actionGuidance: '성공에 교만하지 말고 실패에 낙담하지 마십시오. 모든 세속의 영욕은 지나가는 꿈결일 뿐이니 담담한 평정을 지키십시오.',
  },
  {
    aphorismKey: 'formIsVoidPurity',
    aphorismKo: '무릇 형상 있는 모든 것은 허망하나니, 모든 형상이 형상이 아님을 볼 때 곧 여래의 참된 본성을 보느니라.',
    aphorismHanja: '凡所有相 皆是虛妄 若見諸相非相 卽見如來',
    sourceContext: '《금강반야바라밀경(金剛般若波羅蜜經)》 구운몽 육관대사 전수 원리',
    actionGuidance: '외적인 겉모습이나 타인의 시선에 휘둘리지 마십시오. 겉껍질을 넘어 사물의 본질과 상대방의 참된 마음을 꿰뚫어 보십시오.',
  },
  {
    aphorismKey: 'righteousTruthTriumphs',
    aphorismKo: '바른 도리를 지키는 자는 당장은 고난을 겪을지라도 마침내 형통하나니, 사악한 간계는 영원히 진실을 가릴 수 없다.',
    aphorismHanja: '正道終亨 邪不犯正',
    sourceContext: '서포 김만중 《사씨남정기(謝氏南征記)》 결어',
    actionGuidance: '손쉬운 편법의 유혹을 단호히 뿌리치십시오. 묵묵히 정도를 걸을 때 가장 안전하고 확고한 번영이 찾아옵니다.',
  },
  {
    aphorismKey: 'filialHeartBeyondSorrow',
    aphorismKo: '몸은 비록 바다 끝 외로운 섬에 갇혀 있을지라도, 어머니를 그리는 효심은 천 리 구름을 넘어 밤마다 북두칠성을 향하네.',
    aphorismHanja: '身在海島 魂飛北辰',
    sourceContext: '서포 김만중 《서포만필(西浦漫筆)》 유배 시조',
    actionGuidance: '시련 속에서도 감사의 대상을 잊지 마십시오. 가장 어두운 순간에 품는 순수한 사랑과 효심이 기적 같은 돌파구를 엽니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function calculateKoreanSeopoKimManJungGuunmongAwakening(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanSeopoKimManJungGuunmongAwakeningResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `KIM-MAN-JUNG-GUUNMONG-AWAKENING:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const guunmongIllusoryFamePenetrationScore = 89 + ((absHash >> 1) % 10);
  const prajnaparamitaVoidTrueSelfIndex = 88 + ((absHash >> 4) % 11);
  const righteousIntegrityMoralFidelityIndex = 87 + ((absHash >> 7) % 12);
  const filialDevotionLiterarySublimationScore = 89 + ((absHash >> 10) % 10);
  const transcendentEquanimityResilience = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % GUUNMONG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % GUUNMONG_APHORISMS.length;

  const activeGuunmongTheme = GUUNMONG_THEMES[themeIndex];
  const focalGuunmongAphorism = GUUNMONG_APHORISMS[aphorismIndex];

  const guidanceTitle = `서포 김만중 구운몽 일장춘몽 각성과 초연의 지혜: ${activeGuunmongTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 대문호 서포 김만중 선생은 《구운몽》과 《사씨남정기》를 통해 ` +
    `세속의 덧없는 부귀영화를 꿰뚫어 보고 참된 본성을 회복하는 일장춘몽의 대오각성, 금강경 반야공관의 맑은 초연함, ` +
    `그리고 남해 유배의 풍파 속에서도 홀어머니를 위로하기 위해 불후의 명작을 빚어낸 지극한 효심과 승화의 지혜를 가르쳤습니다. ` +
    `지금 당신의 마음에 가장 청량한 감로수는 '${activeGuunmongTheme.themeTitleKo}'입니다. ` +
    `${activeGuunmongTheme.practicalCounsel} 서포 선생의 가르침 "${focalGuunmongAphorism.aphorismKo}" [${focalGuunmongAphorism.aphorismHanja}]을 마음에 품고, ` +
    `${focalGuunmongAphorism.actionGuidance}`;

  const calculatedAtKst = formatGuunmongKstTimestamp(now);
  const avgScore = Math.round(
    (guunmongIllusoryFamePenetrationScore +
      prajnaparamitaVoidTrueSelfIndex +
      righteousIntegrityMoralFidelityIndex +
      filialDevotionLiterarySublimationScore +
      transcendentEquanimityResilience) /
      5,
  );
  const guunmongSynthesisMatrix = {
    dominantTension: `${activeGuunmongTheme.themeTitleKo} ↔ ${focalGuunmongAphorism.sourceContext}`,
    alignmentState: describeGuunmongStage(avgScore),
    integratedAction: `${focalGuunmongAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_SEOPO_KIM_MAN_JUNG_GUUNMONG_AWAKENING_VERSION,
    calculatedAtKst,
    guunmongIllusoryFamePenetrationScore,
    prajnaparamitaVoidTrueSelfIndex,
    righteousIntegrityMoralFidelityIndex,
    filialDevotionLiterarySublimationScore,
    transcendentEquanimityResilience,
    activeGuunmongTheme,
    focalGuunmongAphorism,
    guunmongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    guunmongSynthesisMatrix,
  };
}

export function formatKoreanSeopoKimManJungGuunmongAwakeningPrompt(
  res: KoreanSeopoKimManJungGuunmongAwakeningResult,
): string {
  const avgScore = Math.round(
    (res.guunmongIllusoryFamePenetrationScore +
      res.prajnaparamitaVoidTrueSelfIndex +
      res.righteousIntegrityMoralFidelityIndex +
      res.filialDevotionLiterarySublimationScore +
      res.transcendentEquanimityResilience) /
      5,
  );
  const lines = [
    `【서포 김만중 《구운몽·사씨남정기》 일장춘몽 각성·반야공관 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 구운몽 각성 국면: ${describeGuunmongStage(avgScore)}`,
    `- 핵심 구운몽 테마: ${res.activeGuunmongTheme.themeTitleKo} [${res.activeGuunmongTheme.themeTitleEn}]`,
    `- 각성적 통찰: ${res.activeGuunmongTheme.awakeningInsight}`,
    `- 행동 조언: ${res.activeGuunmongTheme.practicalCounsel}`,
    `- 서포 원전 테제: "${res.focalGuunmongAphorism.aphorismKo}" [${res.focalGuunmongAphorism.aphorismHanja}]`,
    `- 원전 출처: [${res.focalGuunmongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalGuunmongAphorism.actionGuidance}`,
    `- 종합 서포 권면: ${res.guunmongComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.guunmongSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.guunmongSynthesisMatrix.dominantTension} | 조율 상태: ${res.guunmongSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.guunmongSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
