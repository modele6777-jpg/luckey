/**
 * 대한민국 만해 한용운(萬海 韓龍雲) 선사 《님의 침묵》·《조선불교유신론》·《심우장》 역설적 사랑 승화·서릿발 자주지조·대자비 보살행 및 불굴의 회복탄력성 지혜 엔진
 *
 * 민족의 영원한 등불이자 독립운동가, 대선사 만해 한용운(1879~1944)의 원전 기반:
 * 1. 이별을 새로운 사랑의 원천으로 돌려세우는 역설적 사랑 승화도 (Paradoxical Love Transcendence & Sublimation Score): "아아 님은 갔지마는 나는 님을 보내지 아니하였습니다. 제 곡조를 못 이기는 사랑의 노래는 님의 침묵을 휩싸고 돕니다."처럼 상실의 슬픔을 한탄에 머물게 하지 않고 더 거룩한 사랑의 에너지로 승화시키는 초극의 힘.
 * 2. 일제 암흑기에도 꺾이지 않은 서릿발 자주 지조 지수 (Unbending Integrity & Sovereign Dignity Index): 총독부를 등지고 북향으로 지은 성북동 심우장(尋牛莊)의 기개처럼, 세속의 압박과 회유 앞에서도 결코 양심과 자존을 굽히지 않는 서릿발 같은 주체성.
 * 3. 고통받는 중생을 온몸으로 품는 대자비 보살 서원도 (Great Compassion Bodhisattva Resolve Score): 《조선불교유신론》의 혁신 정신처럼 닫힌 산중 불교를 깨뜨리고 시대의 고통과 약자의 눈물을 현장에서 함께 짊어지는 파사현정(破邪顯正)의 자비 실천력.
 * 4. 고요한 침묵 속에서 진리의 본향을 마주하는 선적 통찰 지수 (Silence Listening & Zen Spiritual Attunement Index): 소란스러운 세상의 거짓 소음을 걷어내고, 침묵 속에서 울려 퍼지는 영혼의 참된 소리와 님의 본래면목을 또렷이 알아차리는 깊은 직관.
 * 5. 어둠의 겨울을 뚫고 찬란한 새벽을 여는 불굴의 회복탄력성 (Indomitable Dawn-Forging Resilience Score): 칼날 같은 시련과 옥고 속에서도 "님은 갔으나 반드시 다시 온다"는 절대적 신념으로 희망의 불씨를 지펴 올리는 민족적 생명력.
 *
 * @version LUCKEY-HAN-YONG-UN-SILENCE-OF-NIM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION = 'LUCKEY-HAN-YONG-UN-SILENCE-OF-NIM-v1.0.0';

export interface HanYongUnTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  poeticInsight: string;
  practicalCounsel: string;
}

export interface HanYongUnAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanHanYongUnSilenceOfNimResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 한용운 핵심 지표 (0~100)
  paradoxicalLoveTranscendenceScore: number;             // 역설적 사랑 승화도
  unbendingIntegritySovereigntyIndex: number;            // 서릿발 자주 지조 지수
  greatCompassionBodhisattvaResolveScore: number;         // 대자비 보살 서원도
  silenceListeningSpiritualDepthIndex: number;           // 침묵 속 진리 직관 지수
  indomitableDawnForgingResilienceScore: number;         // 불굴의 회복탄력성
  // 세부 분석
  activeHanYongUnTheme: HanYongUnTheme;
  focalHanYongUnAphorism: HanYongUnAphorism;
  hanYongUnComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const HAN_YONG_UN_THEMES: HanYongUnTheme[] = [
  {
    themeKey: 'silenceOfNimSublimation',
    themeTitleEn: 'Silence of Nim: Paradoxical Sublimation of Parting into Inexhaustible Love',
    themeTitleKo: '님의 침묵과 사랑의 역설 — 상실과 이별을 더 위대한 희망의 에너지로 승화하기',
    poeticInsight: '《님의 침묵》의 위대한 전환: "그러나 이별을 쓸데없는 눈물의 원천으로 만들고 마는 것은 스스로 사랑을 깨치는 것인 줄 아는 까닭에, 걷잡을 수 없는 슬픔의 힘을 옮겨서 새 희망의 정수박이에 들어부었습니다." 만해는 님의 부재를 절망이 아니라, 사랑을 더욱 깊고 거룩하게 완성하는 내면의 불꽃으로 승화시킵니다.',
    practicalCounsel: '소중한 대상의 상실이나 뜻밖의 이별에 절망의 눈물만 흘리고 있지 마십시오. 그 아픔의 에너지를 미래를 향한 새로운 창조와 결의의 정수리에 쏟아부을 때, 진정한 성숙과 영혼의 부활이 시작됩니다.',
  },
  {
    themeKey: 'simWooJangUnbendingIntegrity',
    themeTitleEn: 'SimWooJang Unbending Integrity: Uncompromising Sovereignty Facing Cold Adversity',
    themeTitleKo: '심우장의 서릿발 지조 — 세속의 회유와 압박 속에서도 굽히지 않는 주체적 존엄',
    poeticInsight: '만해는 조선총독부를 마주 보기 싫다 하여 볕이 들지 않는 성북동 골짜기에 북향집 심우장(尋牛莊)을 짓고 여생을 청빈하게 보냈습니다. 3·1 만세운동의 공약삼장을 기초하고 옥중에서도 서릿발 같은 독립의 기개를 지켰던 그의 삶은, 외적 조건에 영혼을 팔지 않는 주체적 존엄의 표상입니다.',
    practicalCounsel: '일시적 편안함이나 세속의 타협에 당신의 고결한 양심과 자존감을 양보하지 마십시오. 비록 북향의 서늘한 바람을 맞을지라도 스스로 떳떳한 자리는 세상 그 어떤 화려한 궁궐보다 찬란합니다.',
  },
  {
    themeKey: 'ferryboatAndPassengerCompassion',
    themeTitleEn: 'The Ferryboat and the Passenger: Unconditional Patience and Boundless Compassion',
    themeTitleKo: '나룻배와 행인 — 흙발로 짓밟혀도 묵묵히 저 언덕으로 건네주는 보살의 자비',
    poeticInsight: '《나룻배와 행인》: "나는 나룻배, 당신은 행인. 당신은 흙발로 나를 짓밟습니다. 나는 당신을 안고 물을 건너갑니다... 바람이 불고 눈비가 맞으며 밤에서 낮까지 당신을 기다리고 있습니다. 나는 흙발을 두려워하지 않습니다." 참된 사랑과 헌신은 대가를 바라지 않고 상대를 목적지로 건네주는 무한한 인내입니다.',
    practicalCounsel: '타인의 서툰 태도나 몰이해에 마음 상해 당신의 선한 뜻을 거두지 마십시오. 나룻배처럼 묵묵히 상대를 품어주고 건네주는 대자비의 품격이야말로 얼어붙은 사람들의 마음을 녹이는 가장 큰 힘입니다.',
  },
  {
    themeKey: 'obedienceOfFreeWill',
    themeTitleEn: 'Obedience of Free Will: Purest Devotion Chosen Freely through Supreme Love',
    themeTitleKo: '자유로운 복종 — 강요가 아닌 오직 지극한 사랑에서 우러나오는 고결한 헌신',
    poeticInsight: '《복종》: "남들은 자유를 사랑한다지마는, 나는 복종을 좋아하여요. 자유를 모르는 것은 아니지만, 당신에게는 복종만 하고 싶어요. 오직 당신에게 복종하고자 하는 것은 아름다운 자유보다도 달콤합니다. 그것이 나의 행복입니다." 외압에 의한 굴종이 아니라, 스스로 온전히 선택한 고결한 가치를 향한 헌신이야말로 자유의 최고 경지입니다.',
    practicalCounsel: '맹목적인 의무감이나 억지 희생 대신, 당신이 진심으로 사랑하고 소중히 여기는 일과 인연을 향해 온 마음을 다하십시오. 참된 사랑으로 선택한 헌신은 영혼에 더없는 평화와 자긍심을 선사합니다.',
  },
];

export const HAN_YONG_UN_APHORISMS: HanYongUnAphorism[] = [
  {
    aphorismKey: 'silenceOfNimQuote',
    aphorismKo: '님은 갔습니다. 아아, 사랑하는 나의 님은 갔습니다. 푸른 산빛을 깨치고 단풍나무 숲을 향하여 난 작은 길을 걸어서 차마 떨치고 갔습니다... 그러나 이별을 쓸데없는 눈물의 원천으로 만들고 마는 것은 스스로 사랑을 깨치는 것인 줄 아는 까닭에, 걷잡을 수 없는 슬픔의 힘을 옮겨서 새 희망의 정수박이에 들어부었습니다. 아아, 님은 갔지마는 나는 님을 보내지 아니하였습니다. 제 곡조를 못 이기는 사랑의 노래는 님의 침묵을 휩싸고 돕니다.',
    sourceContext: '《님의 침묵(沈默)》(1926년 회동서관 시집 표제시)',
    actionGuidance: '상실의 슬픔을 한탄에 머물게 하지 말고, 내면의 깊은 회복과 새로운 희망을 벼려내는 창조적 에너지로 전환하십시오.',
  },
  {
    aphorismKey: 'ferryboatQuote',
    aphorismKo: '나는 나룻배 / 당신은 행인. / 당신은 흙발로 나를 짓밟습니다. / 나는 당신을 안고 물을 건너갑니다. / 나는 당신을 안으면 깊으나 옅으나 급한 여울이나 건너갑니다. / 만일 당신이 아니 오시면 나는 바람을 맞고 눈비를 맞으며 밤에서 낮까지 당신을 기다리고 있습니다. / 나는 당신을 태우고 나면 돌아오지 않아도 서운하지 않습니다. / 당신만 무사히 건너가시면 그것으로 족합니다.',
    sourceContext: '《나룻배와 행인》(1926년 시집 님의 침묵 수록)',
    actionGuidance: '대가나 보상을 바라는 조급한 계산을 내려놓고, 대자비의 마음으로 상대를 묵묵히 지지하고 품어주십시오.',
  },
  {
    aphorismKey: 'simWooJangOathQuote',
    aphorismKo: '마음은 본래 자유로운 것이니 어떤 쇠사슬도 묶을 수 없고, 진리는 본래 당당한 것이니 어떤 칼날도 벨 수 없다. 어둠이 깊을수록 새벽은 더욱 가까우니, 결코 스스로의 양심을 굽히지 말라.',
    sourceContext: '성북동 심우장(尋牛莊) 만해 선생의 평생 어록',
    actionGuidance: '외부의 풍파와 시련 속에서도 당신의 중심과 양심을 단단히 지키며 불굴의 자존감을 유지하십시오.',
  },
  {
    aphorismKey: 'fateOfPartingQuote',
    aphorismKo: '우리는 만날 때에 떠날 것을 염려하는 것과 같이 떠날 때에 다시 만날 것을 믿습니다.',
    sourceContext: '《님의 침묵(沈默)》 본문',
    actionGuidance: '인연과 일의 순환을 신뢰하고, 끝이 곧 새로운 시작임을 확신하며 담담하게 다음 발걸음을 내딛으십시오.',
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

export function calculateKoreanHanYongUnSilenceOfNim(
  profile?: UserProfile,
  query?: string,
): KoreanHanYongUnSilenceOfNimResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HAN-YONG-UN-SILENCE-OF-NIM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const paradoxicalLoveTranscendenceScore = 92 + ((absHash >> 1) % 7);
  const unbendingIntegritySovereigntyIndex = 93 + ((absHash >> 4) % 6);
  const greatCompassionBodhisattvaResolveScore = 91 + ((absHash >> 7) % 8);
  const silenceListeningSpiritualDepthIndex = 90 + ((absHash >> 10) % 9);
  const indomitableDawnForgingResilienceScore = 92 + ((absHash >> 13) % 7);

  const themeIndex = (absHash >> 5) % HAN_YONG_UN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HAN_YONG_UN_APHORISMS.length;

  const activeHanYongUnTheme = HAN_YONG_UN_THEMES[themeIndex];
  const focalHanYongUnAphorism = HAN_YONG_UN_APHORISMS[aphorismIndex];

  const guidanceTitle = `만해 한용운 역설적 사랑과 서릿발 지조: ${activeHanYongUnTheme.themeTitleKo}`;
  const philosophicalCounsel = `민족의 영원한 등불이자 대선사 만해 한용운 선생은 《님의 침묵》과 《심우장》의 고결한 기개를 통해 ` +
    `이별과 상실의 슬픔을 새 희망의 정수리에 쏟아붓는 역설적 사랑의 승화, 일제 암흑기에도 타협하지 않은 서릿발 같은 자주 지조, ` +
    `흙발로 짓밟혀도 상대를 저 언덕으로 건네주는 나룻배의 대자비, 그리고 "우리는 떠날 때에 다시 만날 것을 믿는다"는 불굴의 새벽 회복탄력성을 일깨웠습니다. ` +
    `지금 당신의 영혼에 가장 절실한 지혜는 '${activeHanYongUnTheme.themeTitleKo}'입니다. ` +
    `${activeHanYongUnTheme.practicalCounsel} 만해 선생의 불멸의 원전 명시 "${focalHanYongUnAphorism.aphorismKo}"을 마음에 새기고, ` +
    `${focalHanYongUnAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION,
    calculatedAtKst: new Date().toISOString(),
    paradoxicalLoveTranscendenceScore,
    unbendingIntegritySovereigntyIndex,
    greatCompassionBodhisattvaResolveScore,
    silenceListeningSpiritualDepthIndex,
    indomitableDawnForgingResilienceScore,
    activeHanYongUnTheme,
    focalHanYongUnAphorism,
    hanYongUnComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanHanYongUnSilenceOfNimPrompt(
  res: KoreanHanYongUnSilenceOfNimResult,
): string {
  return [
    `【만해 한용운 《님의 침묵·심우장》 역설적 사랑·서릿발 자주지조 지표】`,
    `- 역설적 사랑 승화도(Paradoxical Love Transcendence): ${res.paradoxicalLoveTranscendenceScore}/100`,
    `- 서릿발 자주 지조 지수(Unbending Integrity & Sovereignty): ${res.unbendingIntegritySovereigntyIndex}/100`,
    `- 대자비 보살 서원도(Great Compassion Bodhisattva Resolve): ${res.greatCompassionBodhisattvaResolveScore}/100`,
    `- 침묵 속 진리 직관 지수(Silence Listening & Spiritual Depth): ${res.silenceListeningSpiritualDepthIndex}/100`,
    `- 불굴의 새벽 회복탄력성(Indomitable Dawn-Forging Resilience): ${res.indomitableDawnForgingResilienceScore}/100`,
    `- 핵심 만해 테마: ${res.activeHanYongUnTheme.themeTitleKo} [${res.activeHanYongUnTheme.themeTitleEn}]`,
    `- 시적·선적 사색: ${res.activeHanYongUnTheme.poeticInsight}`,
    `- 행동 조언: ${res.activeHanYongUnTheme.practicalCounsel}`,
    `- 만해 원전 명구: "${res.focalHanYongUnAphorism.aphorismKo}"`,
    `- 원전 출처: [${res.focalHanYongUnAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHanYongUnAphorism.actionGuidance}`,
    `- 종합 만해 권면: ${res.hanYongUnComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
