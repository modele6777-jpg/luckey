/**
 * 신라 고운 최치원(孤雲 崔致遠) 선생 난랑비서(鸞郞碑序) & 《계원필경(桂苑筆耕)》
 * 국유현묘지도(國有玄妙之道) 풍류도(風流道) & 포함삼교(包含三敎) 접화군생(接化群生) 조화 엔진
 *
 * 한국 사상사의 태두이자 신라 말 최고의 문장가·사상가 고운 최치원(857~?) 선생의 금석문 〈난랑비서(鸞郞碑序)〉,
 * 한국 최고(最古)의 개인 문집 《계원필경(桂苑筆耕)》, 《사산비명(四山碑銘)》 원전 기반:
 * 1. 국유현묘지도 왈풍류(國有玄妙之道 曰風流): 우리 민족 고유의 신령스럽고 미묘한 도(道)로서, 자연의 생명력과 내면의 조화를 멋과 풍류로 체화하는 근원적 생명 사상.
 * 2. 실내포함삼교(實乃包含三敎): 유학의 충효(入則孝於家 出則忠於國), 도가의 무위자연(行無爲之事 竊不言之敎), 불교의 자비선행(諸惡莫作 衆善奉行)을 본래 하나로 융합 회통.
 * 3. 접화군생(接化群生): 사람뿐 아니라 모든 생명체를 따뜻하게 마주하여 감화시키고 상생의 조화로 이끄는 대자대비와 공존의 지혜.
 * 4. 격서필경(檄書筆耕)의 문기(文氣): 당나라를 뒤흔든 〈토황소격문(討黃巢檄文)〉처럼, 혼란한 시대 속에서도 붓끝으로 사악함을 물리치고 의로움을 세우는 명징한 지성.
 * 5. 지족은둔(知足隱遁)의 초연함: 가야산 해인사에 은둔하여 맑은 바람과 시내를 벗 삼아 세속의 덧없는 명리와 권세를 털어버리는 영적 해탈과 평정심.
 *
 * @version LUCKEY-KOREAN-CHOE-CHIWON-PUNGRYUDO-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_CHOE_CHIWON_VERSION = 'LUCKEY-KOREAN-CHOE-CHIWON-PUNGRYUDO-v2.3.0';

export interface ChoeChiwonTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  culturalInsight: string;
  pungryuCounsel: string;
}

export interface ChoeChiwonAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceOrigin: string;
  practicalAction: string;
}

export interface ChoeChiwonPungryudoResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 풍류도·삼교회통 지표 (0~100)
  pungryuMysticVitalityScore: number;         // 현묘지도(玄妙之道) 풍류 생명력 및 영성 지수
  threeTeachingsInclusionBalanceScore: number; // 포함삼교(유·불·선) 통합 회통 균형도
  jeophwaGunsaengHarmoniousLoveScore: number;  // 접화군생(接化群生) 만물 감화 및 상생 화합도
  literaryIntellectualInsightScore: number;    // 계원필경(桂苑筆耕) 명석한 문기(文氣) 및 지성 통찰력
  detachedTranscendentalPeaceScore: number;    // 세속 명리 초탈 및 가야산 은둔의 고요 평정심
  // 세부 체계
  activeChoeChiwonTheme: ChoeChiwonTheme;
  focalChoeChiwonAphorism: ChoeChiwonAphorism;
  secondaryChoeChiwonAphorism: ChoeChiwonAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  choeChiwonPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  pungryudoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatChoeChiwonKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describePungryudoStage(score: number): string {
  if (score >= 90) return '현묘원융(玄妙圓融) — 유·불·선 삼교의 지혜와 자연의 풍류가 막힘없이 어우러지는 흐름';
  if (score >= 80) return '접화상생(接化相生) — 따뜻한 감화와 품격 있는 문기가 주변을 밝히는 국면';
  return '지족정진(知足精進) — 세속의 시비를 내려놓고 내면의 맑은 멋을 가꾸는 흐름';
}

export const CHOE_CHIWON_THEMES: ChoeChiwonTheme[] = [
  {
    themeKey: 'pungryudo_hyunmyo',
    themeTitleHanja: '國有玄妙之道 曰風流',
    themeTitleKo: '국유현묘지도 왈풍류: 자연과 합일하는 신령한 내면의 멋',
    culturalInsight: '풍류도는 억지스러운 인위가 아니라, 하늘과 땅과 인간이 맑은 바람처럼 하나로 어우러지는 고유의 근원적 생명 조화입니다.',
    pungryuCounsel: '메마른 계산과 긴장을 풀고 마음속에 부드러운 바람과 여유를 불어넣으십시오. 자연의 리듬에 발을 맞출 때 엉킨 일들이 저절로 풀립니다.',
  },
  {
    themeKey: 'poham_samgyo',
    themeTitleHanja: '實乃包含三敎 會通圓融',
    themeTitleKo: '포함삼교 회통: 유·불·선을 아우르는 통섭의 지혜',
    culturalInsight: '충효의 실천(유교), 말 없는 실천과 초연함(도교), 악을 짓지 않고 선을 행하는 자비(불교)는 결코 모순되지 않고 한마음에서 흘러나옵니다.',
    pungryuCounsel: '흑백논리의 편협한 잣대를 내려놓고 다양한 관점을 포용하십시오. 서로 다른 원칙들을 융합할 때 그 어떤 대립도 상생의 지혜로 승화됩니다.',
  },
  {
    themeKey: 'jeophwa_gunsaeng',
    themeTitleHanja: '接化群生 物我同根',
    themeTitleKo: '접화군생: 온 생명을 따뜻하게 감화하는 상생의 덕',
    culturalInsight: '타인을 힘으로 굴복시키는 것이 아니라, 깊은 공감과 자비로 마주하여 스스로 변화하고 살아나게 돕는 것이 참된 감화력입니다.',
    pungryuCounsel: '주변 사람들을 수단이 아닌 존엄한 생명으로 따뜻하게 맞이하십시오. 당신의 온화한 품성이 상대를 저절로 돕고 화합을 이끌어냅니다.',
  },
  {
    themeKey: 'gyeowon_pilgyeong',
    themeTitleHanja: '桂苑筆耕 討黃巢檄',
    themeTitleKo: '계원필경의 문기: 시대를 일깨우고 정의를 세우는 지성',
    culturalInsight: '진실한 글과 지성은 칼보다 강하여 어둠을 가르고 마음을 움직입니다. 혼란할수록 명분과 원칙을 바로 세우는 언어가 천하를 바로잡습니다.',
    pungryuCounsel: '자신의 생각을 논리정연하고 품격 있는 언어로 표현하십시오. 정직하고 당당한 소통이 상대방의 마음을 움직이고 왜곡된 상황을 바로잡습니다.',
  },
  {
    themeKey: 'gayasan_chotal',
    themeTitleHanja: '伽倻山中 脫塵超然',
    themeTitleKo: '가야산 탈진초연: 세속의 명리를 털어낸 청정한 평정심',
    culturalInsight: '세상의 번잡한 시비와 권력 다툼에서 한 걸음 물러나 산천의 맑은 물과 바위 속에서 영원한 영적 자유를 누리는 지족의 경지입니다.',
    pungryuCounsel: '쓸데없는 인정 욕구와 타인의 평판 경쟁에서 벗어나십시오. 당신 영혼이 본래 지닌 맑고 청정한 자리로 돌아갈 때 진정한 안식을 얻습니다.',
  },
];

export const CHOE_CHIWON_APHORISMS: ChoeChiwonAphorism[] = [
  {
    aphorismKey: 'hyunmyo_jido_pungryu',
    aphorismKo: '나라에 현묘한 도가 있으니 풍류라 이른다. 실로 삼교를 포함하여 뭇 생명을 접하여 감화시킨다.',
    aphorismHanja: '國有玄妙之道 曰風流 說敎之源 備詳仙史 實乃包含三敎 接化群生',
    sourceOrigin: '〈난랑비서(鸞郞碑序)〉: 한국 고유의 풍류도와 삼교회통의 원형을 천명한 불후의 명문',
    practicalAction: '굳어진 틀에 얽매이지 말고, 만물을 유연하고 조화롭게 품어 안으며 상생의 멋을 실천하십시오.',
  },
  {
    aphorismKey: 'samgyo_silcheon',
    aphorismKo: '집에 들어서는 부모에게 효도하고 나가서는 나라에 충성하며, 무위의 일을 행하고 말 없는 가르침을 실천하며, 모든 악을 짓지 말고 온갖 선을 받들어 행하라.',
    aphorismHanja: '入則孝於家 出則忠於國 行無爲之事 竊不言之敎 諸惡莫作 衆善奉行',
    sourceOrigin: '〈난랑비서(鸞郞碑序)〉: 유교·도교·불교의 핵심 실천 덕목을 하나로 꿰뚫은 회통 강령',
    practicalAction: '일상의 책임을 성실히 다하되 내면은 자연의 무위에 맡기고, 언제나 선한 의도로 행동하십시오.',
  },
  {
    aphorismKey: 'mirae_myeongbeon',
    aphorismKo: '부당한 일은 만인의 질타를 받고, 순리는 천하의 지지를 얻는 법이다.',
    aphorismHanja: '夫不義而富且貴 於我如浮雲 義之所在 天下歸心',
    sourceOrigin: '〈토황소격문(討黃巢檄文)〉: 정의와 명분을 바로 세워 삿된 흐름을 일거에 꺾은 지성의 사자후',
    practicalAction: '눈앞의 얄팍한 술수나 편법에 기대지 말고, 명명백백한 대의와 정당성의 길을 떳떳하게 걸어가십시오.',
  },
  {
    aphorismKey: 'cheongsan_suyong',
    aphorismKo: '미친 듯 쏟아지는 물소리로 첩첩 바위 울리니, 사람의 말소리는 지척에서도 분간하기 어렵네. 시비하는 소리 귀에 닿을까 저어하여, 짐짓 흐르는 물로 온 산을 둘러 감쌌노라.',
    aphorismHanja: '狂奔疊石吼重巒 人語難分咫尺間 常恐是非聲到耳 故敎流水盡籠山',
    sourceOrigin: '〈제가야산독서당(題伽倻山讀書堂)〉: 세속의 시비와 소음을 끊고 고결한 내면의 평화를 지키는 결단',
    practicalAction: '불필요한 논쟁과 험담, 세상의 소음에서 단호히 귀를 닫고, 고요한 나만의 공간에서 심지를 굳히십시오.',
  },
  {
    aphorismKey: 'chupung_yuwon',
    aphorismKo: '가을바람에 오직 괴로운 노래 부르나니, 온 세상에 나를 알아주는 이 드물구나. 창밖엔 깊은 밤 비 내리는데, 등불 앞 내 마음은 만 리 밖을 내달리네.',
    aphorismHanja: '秋風唯苦吟 世路少知音 窓外三更雨 燈前萬里心',
    sourceOrigin: '〈추야우중(秋夜雨中)〉: 고독 속에서 자신을 깊이 응시하며 내면의 지혜를 벼리는 지식인의 고뇌',
    practicalAction: '외로움이나 몰이해에 위축되지 말고, 고독한 시간을 영적 성숙과 내적 역량을 심화하는 계기로 삼으십시오.',
  },
  {
    aphorismKey: 'dongdo_myeongjin',
    aphorismKo: '바른 도는 모나지 않고 원만하여 어디에나 통하니, 성실함과 지혜로써 만사를 마주하면 막힘이 없다.',
    aphorismHanja: '道不遠人 人能弘道 誠明相發 萬化該融',
    sourceOrigin: '《사산비명(四山碑銘)》: 도의 보편성과 지극한 성실함으로 이루는 만물의 원융회통',
    practicalAction: '어떤 난관에 부딪히더라도 지극한 정성과 투명한 지혜로 대처하면 반드시 활로가 열립니다.',
  },
];

export function calculateChoeChiwonPungryudo(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ChoeChiwonPungryudoResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `CHOE-CHIWON-PUNGRYUDO:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const pungryuMysticVitalityScore = 69 + (absHash % 30);
  const threeTeachingsInclusionBalanceScore = 70 + ((absHash >> 3) % 29);
  const jeophwaGunsaengHarmoniousLoveScore = 68 + ((absHash >> 6) % 31);
  const literaryIntellectualInsightScore = 71 + ((absHash >> 9) % 28);
  const detachedTranscendentalPeaceScore = 67 + ((absHash >> 12) % 32);

  const themeIndex = (absHash >> 4) % CHOE_CHIWON_THEMES.length;
  const aphorismIndex = (absHash >> 7) % CHOE_CHIWON_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (CHOE_CHIWON_APHORISMS.length - 1))) % CHOE_CHIWON_APHORISMS.length;

  const activeChoeChiwonTheme = CHOE_CHIWON_THEMES[themeIndex];
  const focalChoeChiwonAphorism = CHOE_CHIWON_APHORISMS[aphorismIndex];
  const secondaryChoeChiwonAphorism = CHOE_CHIWON_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 유·불·선 어느 한쪽에 치우치지 않고 '${activeChoeChiwonTheme.themeTitleKo}'의 넉넉함으로 조율할 수 있는 접점은 무엇인가요?`
    : `지금 내 일상에서 세속의 시비를 잠시 내려놓고 '${activeChoeChiwonTheme.themeTitleKo}'의 여유를 회복할 수 있는 고요한 틈은 어디에 있나요?`;
  const interpretiveBoundary = '고운 최치원 풍류도·삼교회통 관점은 미래의 길흉 예단이 아니라, 유연한 조화와 상생의 품격을 비추는 한국 사상 성찰 렌즈입니다.';

  const counselTitle = `고운 최치원 풍류도 지혜: ${activeChoeChiwonTheme.themeTitleKo}`;
  const philosophicalGuidance = `고운 최치원 선생의 풍류도(風流道) 사상은 유·불·선을 원융회통하여 모든 생명을 감화하고(接化群生) 자연과 하나 되는 대원융의 멋을 전합니다. ` +
    `현재 당신의 삶을 관통하는 화두는 '${activeChoeChiwonTheme.themeTitleKo}'에 있습니다. ` +
    `${activeChoeChiwonTheme.pungryuCounsel} 아울러 최치원 선생의 가르침인 "${focalChoeChiwonAphorism.aphorismKo}"(${focalChoeChiwonAphorism.aphorismHanja})을 마음에 품고, ` +
    `${focalChoeChiwonAphorism.practicalAction}`;

  const calculatedAtKst = formatChoeChiwonKstTimestamp(now);
  const avgScore = Math.round(
    (pungryuMysticVitalityScore +
      threeTeachingsInclusionBalanceScore +
      jeophwaGunsaengHarmoniousLoveScore +
      literaryIntellectualInsightScore +
      detachedTranscendentalPeaceScore) /
      5,
  );
  const pungryudoSynthesisMatrix = {
    dominantTension: `${activeChoeChiwonTheme.themeTitleKo} ↔ ${focalChoeChiwonAphorism.sourceOrigin}`,
    alignmentState: describePungryudoStage(avgScore),
    integratedAction: `${focalChoeChiwonAphorism.practicalAction}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeChoeChiwonTheme.themeTitleHanja}] ${focalChoeChiwonAphorism.practicalAction}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_CHOE_CHIWON_VERSION,
    calculatedAtKst,
    pungryuMysticVitalityScore,
    threeTeachingsInclusionBalanceScore,
    jeophwaGunsaengHarmoniousLoveScore,
    literaryIntellectualInsightScore,
    detachedTranscendentalPeaceScore,
    activeChoeChiwonTheme,
    focalChoeChiwonAphorism,
    secondaryChoeChiwonAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    choeChiwonPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    pungryudoSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatChoeChiwonPungryudoPrompt(res: ChoeChiwonPungryudoResult): string {
  const avgScore = Math.round(
    (res.pungryuMysticVitalityScore +
      res.threeTeachingsInclusionBalanceScore +
      res.jeophwaGunsaengHarmoniousLoveScore +
      res.literaryIntellectualInsightScore +
      res.detachedTranscendentalPeaceScore) /
      5,
  );
  const lines = [
    `【고운 최치원 풍류도(風流道) & 접화군생(接化群生) 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 풍류도 조화 국면: ${describePungryudoStage(avgScore)}`,
    `- 핵심 풍류 테마: ${res.activeChoeChiwonTheme.themeTitleKo} [${res.activeChoeChiwonTheme.themeTitleHanja}]`,
    `- 사상·문화적 통찰: ${res.activeChoeChiwonTheme.culturalInsight}`,
    `- 풍류도 권면: ${res.activeChoeChiwonTheme.pungryuCounsel}`,
    `- 핵심 명문: "${res.focalChoeChiwonAphorism.aphorismKo}"`,
    `- 보조 교차 명문: "${res.secondaryChoeChiwonAphorism.aphorismKo}" [${res.secondaryChoeChiwonAphorism.sourceOrigin}]`,
    `- 한문 원전: "${res.focalChoeChiwonAphorism.aphorismHanja}" [${res.focalChoeChiwonAphorism.sourceOrigin}]`,
    `- 실천적 행동 지침: ${res.focalChoeChiwonAphorism.practicalAction}`,
    `- 통합 풍류 권면: ${res.choeChiwonPersonalCounsel.philosophicalGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.pungryudoSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.pungryudoSynthesisMatrix.dominantTension} | 조율 상태: ${res.pungryudoSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.pungryudoSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
