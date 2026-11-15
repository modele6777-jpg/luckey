/**
 * 스페인 미겔 데 세르반테스(Miguel de Cervantes) 《돈키호테》 불가능한 꿈을 향한 고결한 이상주의·풍차 앞 불굴의 용기·해학적 회복탄력성 지혜 엔진
 *
 * 근대 소설의 아버지이자 불멸의 고전 《돈키호테》(1605/1615)의 저자 미겔 데 세르반테스(1547~1616)의 원전 기반:
 * 1. 불가능한 꿈을 향한 고결한 이상주의 (Noble Idealism & Knight-Errant Spirit Score): 비루한 세속의 타협을 거부하고 정의와 명예, 약자를 위해 헌신하는 숭고한 기사도 정신.
 * 2. 거대한 풍차 앞에서도 물러서지 않는 불굴의 용기 (Courage Against Windmills & Adverse Giants Index): 세상의 조소와 거대한 장벽 앞에서도 신념을 굽히지 않고 돌진하는 담대한 기개.
 * 3. 이상과 현실의 상호보완적 조화와 진솔한 우정 (Quixote-Sancho Dynamic Balance & True Fellowship Score): 돈키호테의 드높은 이상과 산초 판사의 따스하고 소박한 현실 감각의 조화로운 연대.
 * 4. 상처와 실패를 유쾌한 웃음으로 승화하는 해학적 회복탄력성 (Satirical Wit & Compassionate Humor Resilience Index): 비극과 환멸 앞에서도 인간을 향한 따스한 해학과 연민을 잃지 않는 명랑한 힘.
 * 5. 세상의 규정을 넘어 스스로 기사가 되는 자기창조적 주체성 (Autonomous Self-Creation & Sovereign Identity Score): 늙은 시골 귀족 아론소 키하노의 무력함을 딛고 고결한 돈키호테로 다시 태어나는 주체적 결단.
 *
 * @version LUCKEY-CERVANTES-DON-QUIXOTE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const SPANISH_MIGUEL_DE_CERVANTES_DON_QUIXOTE_VERSION = 'LUCKEY-CERVANTES-DON-QUIXOTE-v2.0.0';

export interface CervantesTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface CervantesAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismSpanish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface SpanishMiguelDeCervantesDonQuixoteResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 세르반테스 핵심 지표 (0~100)
  nobleIdealismScore: number;                           // 고결한 이상주의와 기사도 정신 (Noble Idealism)
  courageAgainstWindmillsIndex: number;                 // 거대한 풍차 앞 불굴의 용기 (Courage Against Windmills)
  quixoteSanchoBalanceScore: number;                    // 이상과 현실의 조화·진솔한 우정 (Quixote-Sancho Balance)
  compassionateHumorResilienceIndex: number;            // 실패를 승화하는 해학적 회복탄력성 (Compassionate Humor Resilience)
  autonomousSelfCreationScore: number;                  // 스스로 기사가 되는 자기창조적 주체성 (Autonomous Self-Creation)
  // 세부 분석
  activeCervantesTheme: CervantesTheme;
  focalCervantesAphorism: CervantesAphorism;
  cervantesComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  cervantesSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatCervantesKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export const CERVANTES_THEMES: CervantesTheme[] = [
  {
    themeKey: 'theImpossibleDream',
    themeTitleEn: 'The Noble Quest: Courage to Pursue the Impossible Ideal in a Cynical World',
    themeTitleKo: '불가능한 꿈을 향한 출정 — 냉소적인 세속의 계산을 넘어 고결한 신념에 불을 지피기',
    literaryInsight: '세르반테스의 돈키호테는 미치광이가 아닙니다. 남들이 눈앞의 이익과 안락에 영혼을 팔 때, 홀로 정의와 약자의 구원, 변치 않는 이상을 향해 녹슨 갑옷을 입고 길을 나선 가장 맑고 숭고한 영혼입니다.',
    practicalCounsel: '현실의 핑계 뒤에 숨어 당신의 오랜 꿈과 가치를 포기하지 마십시오. 세상이 무모하다고 조소할지라도, 당신의 가슴을 뛰게 하는 고결한 신념을 향해 당당히 첫 발걸음을 내딛으십시오.',
  },
  {
    themeKey: 'tiltingAtWindmills',
    themeTitleEn: 'Confronting Giants: Unyielding Valor Before Overwhelming and Absurd Obstacles',
    themeTitleKo: '풍차 앞의 불굴의 창끝 — 압도적인 난관과 부조리 앞에서도 무릎 꿇지 않는 기개',
    literaryInsight: '거인으로 보였던 풍차에 부딪혀 나가떨어질지라도 돈키호테는 비겁하게 도망치지 않습니다. 패배보다 더 두려운 것은 비열한 굴종이며, 신념을 위해 던진 상처는 가장 명예로운 훈장입니다.',
    practicalCounsel: '난관의 거대함에 지레 겁먹지 마십시오. 부러진 창자루를 쥐고서라도 정면으로 마주할 때, 위축되었던 당신 안의 영웅적 의지가 활활 타오릅니다.',
  },
  {
    themeKey: 'quixoteAndSancho',
    themeTitleEn: 'Harmony of Ideal and Earth: Quixote\'s Stars and Sancho\'s Bread in True Friendship',
    themeTitleKo: '별과 빵의 공명 — 드높은 이상과 소박한 현실의 발걸음을 함께 맞추는 지혜',
    literaryInsight: '돈키호테 곁에는 언제나 당나귀를 탄 산초 판사가 있었습니다. 하늘의 별을 바라보는 기사와 대지의 빵과 포도주를 챙기는 종자의 동행이야말로, 이상이 망상으로 끝나지 않고 현실에 뿌리내리게 하는 위대한 연대입니다.',
    practicalCounsel: '원대한 비전을 품되, 발은 단단한 현실의 일상에 두십시오. 당신의 이상을 현실의 언어로 다듬어주고 든든하게 곁을 지켜주는 동반자의 지혜에 귀를 기울이십시오.',
  },
  {
    themeKey: 'satiricalGrace',
    themeTitleEn: 'Grace Through Laughter: Transmuting Suffering into Wisdom and Gentle Benevolence',
    themeTitleKo: '해학과 자비의 방패 — 상처와 좌절 속에서도 인간을 향한 웃음과 품격을 잃지 않기',
    literaryInsight: '레판토 해전의 부상과 5년간의 알제리 해적 포로 생활이라는 신산고초 속에서도 세르반테스는 원한 대신 유쾌한 해학과 따스한 인간애로 세상을 품어 안았습니다.',
    practicalCounsel: '일이 뜻대로 풀리지 않는다고 비관이나 독설에 빠지지 마십시오. 실패를 한바탕 너털웃음으로 털어내고, 스스로와 타인을 너그럽게 품는 유머 감각이야말로 가장 강력한 회복탄력성입니다.',
  },
];

export const CERVANTES_APHORISMS: CervantesAphorism[] = [
  {
    aphorismKey: 'dreamImpossibleQuote',
    aphorismKo: '이룰 수 없는 꿈을 꾸고, 이길 수 없는 적과 싸우며, 견딜 수 없는 고통을 견디고, 잡을 수 없는 저 밤하늘의 별을 잡으려 길을 떠난다.',
    aphorismSpanish: 'Soñar el sueño imposible, luchar contra el enemigo invencible, soportar el dolor insoportable, correr donde los valientes no se atrevieron, alcanzar la estrella inalcanzable.',
    sourceContext: '《돈키호테(Don Quijote de la Mancha)》 기사 서약의 정신',
    actionGuidance: '현실의 한계에 가두지 말고 당신의 이상을 가장 높은 하늘에 두십시오. 그 숭고한 지향 자체가 당신의 삶을 거룩하게 빚어냅니다.',
  },
  {
    aphorismKey: 'freedomPreciousQuote',
    aphorismKo: '자유란 하늘이 인간에게 내린 가장 값진 보물 중 하나이다. 대지가 품은 보화나 바다가 감춘 진귀함도 자유와는 비할 바가 못 된다. 자유를 위해서라면, 명예를 위해서라면 목숨조차 바쳐 모험에 뛰어들 수 있는 법이다.',
    aphorismSpanish: 'La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos; con ella no pueden igualarse los tesoros que encierra la tierra ni el mar encubre; por la libertad, así como por la honra, se puede y debe aventurar la vida.',
    sourceContext: '《돈키호테》 제2권 제58장',
    actionGuidance: '안락한 예속보다 험난한 자유를 택하십시오. 내 삶의 주권을 남의 손에 맡기지 않을 때 비로소 진정한 존엄이 빛납니다.',
  },
  {
    aphorismKey: 'whoAmIQuote',
    aphorismKo: '나는 내가 누구인지 안다. 나는 내가 원한다면 세상의 모든 기사들뿐 아니라, 그 어느 전설의 영웅보다 더 위대한 자가 될 수 있음을 안다.',
    aphorismSpanish: 'Yo sé quién soy, y sé que puedo ser no solo los que he dicho, sino todos los doce Pares de Francia.',
    sourceContext: '《돈키호테》 제1권 제5장',
    actionGuidance: '남들이 붙여준 초라한 이름표에 갇히지 마십시오. 당신은 스스로 선언하고 결단한 그 위대한 존재가 될 자격이 있습니다.',
  },
  {
    aphorismKey: 'virtueTrueNobilityQuote',
    aphorismKo: '혈통은 상속되는 것이지만 덕성은 획득하는 것이다. 덕성은 그 자체로 피의 혈통보다 비교할 수 없이 고귀하다.',
    aphorismSpanish: 'La sangre se hereda y la virtud se adquiere, y la virtud vale por sí sola lo que la sangre no vale.',
    sourceContext: '《돈키호테》 제2권 제42장 산초 판사를 향한 조언',
    actionGuidance: '배경이나 겉치레가 아닌 오직 당신의 행동과 덕성으로 당신의 품격을 증명하십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function calculateSpanishMiguelDeCervantesDonQuixote(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): SpanishMiguelDeCervantesDonQuixoteResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `CERVANTES-DON-QUIXOTE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const nobleIdealismScore = 91 + ((absHash >> 1) % 9);
  const courageAgainstWindmillsIndex = 90 + ((absHash >> 4) % 10);
  const quixoteSanchoBalanceScore = 88 + ((absHash >> 7) % 11);
  const compassionateHumorResilienceIndex = 89 + ((absHash >> 10) % 10);
  const autonomousSelfCreationScore = 92 + ((absHash >> 13) % 8);

  const themeIndex = (absHash >> 5) % CERVANTES_THEMES.length;
  const aphorismIndex = (absHash >> 8) % CERVANTES_APHORISMS.length;

  const activeCervantesTheme = CERVANTES_THEMES[themeIndex];
  const focalCervantesAphorism = CERVANTES_APHORISMS[aphorismIndex];

  const guidanceTitle = `미겔 데 세르반테스 돈키호테의 고결한 이상주의: ${activeCervantesTheme.themeTitleKo}`;
  const philosophicalCounsel = `근대 서사문학의 개척자 미겔 데 세르반테스 선생은 《돈키호테》를 통해 ` +
    `비루한 세속의 계산과 냉소에 굴복하지 않고 불가능한 꿈을 향해 창을 겨누는 고결한 이상주의, ` +
    `거대한 풍차 앞에서도 물러서지 않는 숭고한 용기, 이상과 현실을 잇는 따스한 인간애와 진솔한 우정, ` +
    `그리고 비극을 품어 안는 유쾌한 해학적 회복탄력성의 길을 선물했습니다. ` +
    `지금 당신의 앞길을 밝히는 기사의 횃불은 '${activeCervantesTheme.themeTitleKo}'입니다. ` +
    `${activeCervantesTheme.practicalCounsel} 세르반테스의 명언 "${focalCervantesAphorism.aphorismKo}" (${focalCervantesAphorism.aphorismSpanish})을 마음에 새기고, ` +
    `${focalCervantesAphorism.actionGuidance}`;

  const calculatedAtKst = formatCervantesKstTimestamp(now);
  const cervantesSynthesisMatrix = {
    dominantTension: `${activeCervantesTheme.themeTitleKo} ↔ 현실의 풍차`,
    alignmentState: `${focalCervantesAphorism.sourceContext}`,
    integratedAction: `${activeCervantesTheme.practicalCounsel} · ${focalCervantesAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: SPANISH_MIGUEL_DE_CERVANTES_DON_QUIXOTE_VERSION,
    calculatedAtKst,
    nobleIdealismScore,
    courageAgainstWindmillsIndex,
    quixoteSanchoBalanceScore,
    compassionateHumorResilienceIndex,
    autonomousSelfCreationScore,
    activeCervantesTheme,
    focalCervantesAphorism,
    cervantesComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    cervantesSynthesisMatrix,
  };
}

export function formatSpanishMiguelDeCervantesDonQuixotePrompt(
  res: SpanishMiguelDeCervantesDonQuixoteResult,
): string {
  const lines = [
    `【미겔 데 세르반테스 《돈키호테》 고결한 이상주의·풍차 앞 불굴의 용기 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion}`,
    `- 핵심 세르반테스 테마: ${res.activeCervantesTheme.themeTitleKo} [${res.activeCervantesTheme.themeTitleEn}]`,
    `- 문학적 통찰: ${res.activeCervantesTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeCervantesTheme.practicalCounsel}`,
    `- 세르반테스 원전 테제: "${res.focalCervantesAphorism.aphorismKo}"`,
    `- 원문: (${res.focalCervantesAphorism.aphorismSpanish})`,
    `- 원전 출처: [${res.focalCervantesAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalCervantesAphorism.actionGuidance}`,
    `- 종합 세르반테스 권면: ${res.cervantesComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.cervantesSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.cervantesSynthesisMatrix.dominantTension} | 조율 상태: ${res.cervantesSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.cervantesSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
