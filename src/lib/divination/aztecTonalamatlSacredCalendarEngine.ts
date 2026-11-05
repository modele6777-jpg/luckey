/**
 * 아즈텍 토날포왈리 20대 일진 & 13대 주천신 신성 역법 엔진 (aztecTonalamatlSacredCalendarEngine.ts)
 *
 * 고대 메소아메리카 아즈텍 문명의 260일 신성 역법 토날포왈리(Tonalpohualli)와 성력서 토날라마틀(Tonalamatl) 기반:
 * 인간의 운명과 영혼의 3대 에너지(토날리·테욜리아·이히요틀)를 조율하고,
 * 20대 신성 일진(Day Signs)과 13대 주천신(Thirteen Lords of the Day)의 천구 진동을 해독하는 마스터 역법 엔진.
 *
 * 3대 영혼 에너지(Three Spiritual Centers):
 * 1. 토날리 (Tonalli): 정수리에 깃든 태양의 영적 활력과 운명적 기운 (Solar Vitality & Destiny Force)
 * 2. 테욜리아 (Teyolia): 심장에 거주하는 영혼, 정서적 순수성과 기억의 불멸성 (Heart Spirit & Emotional Purity)
 * 3. 이히요틀 (Ihiyotl): 간과 호흡에 깃든 생명력, 결단력과 역동적 추진력 (Breath Power & Willpower)
 *
 * 20대 신성 일진(Twenty Sacred Day Signs - Cipactli ~ Xochitl):
 * 악어(Cipactli), 바람(Ehecatl), 집(Calli), 도마뱀(Cuetzpalin), 뱀(Coatl),
 * 죽음(Miquiztli), 사슴(Mazatl), 토끼(Tochtli), 물(Atl), 개(Itzcuintli),
 * 원숭이(Ozomatli), 풀(Malinalli), 갈대(Acatl), 재규어(Ocelotl), 독수리(Cuauhtli),
 * 콘도르(Cozcacuauhtli), 움직임/올린(Ollin), 부싯돌(Tecpatl), 비(Quiahuitl), 꽃(Xochitl).
 */

import type { UserProfile } from '../sharedState';

export const AZTEC_TONALAMATL_ENGINE_VERSION = '1.0.0';

export interface AztecDaySign {
  signNumber: number;
  nahuatlName: string;
  nameKo: string;
  patronDeity: string;
  elementNature: string;
  cosmicDestinyPower: string;
  resonanceScore: number; // 0 ~ 100
}

export interface AztecTonalamatlReport {
  engineVersion: string;
  timestamp: string;
  tonalliSolarVitalityScore: number; // 0 ~ 100 정수리 토날리 태양 영혼 활력도
  teyoliaHeartPurityIndex: number; // 0 ~ 100 심장 테욜리아 순수성 지수
  ihiyotlBreathPowerScore: number; // 0 ~ 100 호흡과 결단력 이히요틀 기운
  ollinCosmicMovementHarmony: number; // 0 ~ 100 제5의 태양 올린 우주 진동 조화도
  dominantDaySign: AztecDaySign; // 현재 주재하는 아즈텍 신성 일진
  thirteenLordOfTheDay: string; // 13대 주천신 중 수호신
  aztecTonalamatlGuidance: string; // 토날라마틀 지혜 지침
  tonalliSunSalutationRitual: string; // 토날리 태양 경배 리추얼
}

const TWENTY_SIGNS_BASE: Omit<AztecDaySign, 'resonanceScore'>[] = [
  {
    signNumber: 1,
    nahuatlName: 'Cipactli',
    nameKo: '시팍틀리 (태초의 악어 / 원초적 대지)',
    patronDeity: '토나카테쿠틀리 (Tonacatecuhtli - 풍요의 시조신)',
    elementNature: '태고의 대지와 원초적 생명수',
    cosmicDestinyPower: '혼돈 속에서 굳건한 현실적 기반을 세우고 흔들림 없는 안정을 일구는 창조력',
  },
  {
    signNumber: 2,
    nahuatlName: 'Ehecatl',
    nameKo: '에헤카틀 (신성한 바람 / 영적 호흡)',
    patronDeity: '케찰코아틀 (Quetzalcoatl - 깃털 달린 뱀, 지혜의 신)',
    elementNature: '지혜의 바람과 영적 각성의 숨결',
    cosmicDestinyPower: '정체된 상황에 신선한 영감을 불어넣고 낡은 에고를 일순간에 정화하는 통찰력',
  },
  {
    signNumber: 3,
    nahuatlName: 'Calli',
    nameKo: '칼리 (평화의 집 / 내면의 안식처)',
    patronDeity: '테페욜로틀 (Tepeyollotl - 대지의 심장, 산의 재규어)',
    elementNature: '보호와 성스러운 내적 성소',
    cosmicDestinyPower: '외부의 풍파 속에서도 내면의 중심을 지키며 가족과 공동체를 품는 포용력',
  },
  {
    signNumber: 4,
    nahuatlName: 'Cuetzpalin',
    nameKo: '쿠에츠팔린 (푸른 도마뱀 / 끈질긴 생명력)',
    patronDeity: '우에우에코요틀 (Huehuecoyotl - 태고의 유쾌한 늑대신)',
    elementNature: '신속한 적응과 바위 같은 지구력',
    cosmicDestinyPower: '어떤 가혹한 환경에서도 유연하게 살아남아 생명력을 꽃피우는 불굴의 회복력',
  },
  {
    signNumber: 5,
    nahuatlName: 'Coatl',
    nameKo: '코아틀 (신성한 뱀 / 대지의 쿤달리니)',
    patronDeity: '찰치우틀리쿠에 (Chalchiuhtlicue - 옥빛 치마의 물의 여신)',
    elementNature: '변형과 상승하는 대지의 활력',
    cosmicDestinyPower: '허물을 벗듯 과거의 한계를 단호히 탈각하고 한 단계 높은 차원으로 도약하는 재생력',
  },
  {
    signNumber: 6,
    nahuatlName: 'Miquiztli',
    nameKo: '미키스틀리 (탈바꿈의 죽음 / 선조의 지혜)',
    patronDeity: '텍시스테카틀 (Tecciztecatl - 바다 고둥과 달의 신)',
    elementNature: '깊은 고요와 침묵 속의 재탄생',
    cosmicDestinyPower: '소멸을 두려워하지 않고 진정한 본질만을 남기며 낡은 집착을 내려놓는 해탈의 힘',
  },
  {
    signNumber: 7,
    nahuatlName: 'Mazatl',
    nameKo: '마사틀 (숲의 사슴 / 고결한 도약)',
    patronDeity: '틀랄록 (Tlaloc - 천둥과 생명의 비의 신)',
    elementNature: '순수한 직관과 기민한 민첩성',
    cosmicDestinyPower: '위험을 미리 감지하고 우아한 발걸음으로 장애물을 뛰어넘는 고결한 영성',
  },
  {
    signNumber: 8,
    nahuatlName: 'Tochtli',
    nameKo: '토치틀리 (풍요의 토끼 / 다산과 번영)',
    patronDeity: '마야우엘 (Mayahuel - 백만 개의 젖가슴을 지닌 아가베 여신)',
    elementNature: '자연의 풍요와 번영의 결실',
    cosmicDestinyPower: '작은 씨앗을 큰 수확으로 일구어내며 주변에 풍요로운 기쁨을 나누는 축복의 힘',
  },
  {
    signNumber: 9,
    nahuatlName: 'Atl',
    nameKo: '아틀 (정화의 물 / 감정의 신성한 불꽃)',
    patronDeity: '시우테쿠틀리 (Xiuhtecuhtli - 태고의 불과 시간의 군주)',
    elementNature: '신성한 불과 물의 변증법적 정화',
    cosmicDestinyPower: '억압된 감정을 시원하게 씻어내고 영혼의 진실한 갈망을 일깨우는 정화력',
  },
  {
    signNumber: 10,
    nahuatlName: 'Itzcuintli',
    nameKo: '이츠쿠인틀리 (충직한 개 / 영혼의 길잡이)',
    patronDeity: '믹틀란테쿠틀리 (Mictlantecuhtli - 저승의 군주 / 숄로틀)',
    elementNature: '어둠을 밝히는 충직함과 안내자',
    cosmicDestinyPower: '어둠의 터널 속에서도 길을 잃지 않고 소중한 이들을 안전한 빛으로 이끄는 안내력',
  },
  {
    signNumber: 11,
    nahuatlName: 'Ozomatli',
    nameKo: '오소마트리 (유희의 원숭이 / 창조적 예술)',
    patronDeity: '쇼치필리 (Xochipilli - 꽃과 춤, 예술의 왕자신)',
    elementNature: '창의적 유희와 축제의 환희',
    cosmicDestinyPower: '경직된 현실을 재치 있는 예술과 웃음으로 반전시키는 자유로운 창조력',
  },
  {
    signNumber: 12,
    nahuatlName: 'Malinalli',
    nameKo: '말리날리 (질긴 풀잎 / 불굴의 인내)',
    patronDeity: '파테카틀 (Patecatl - 약초와 치유의 신)',
    elementNature: '뿌리 깊은 생명력과 치유의 약성',
    cosmicDestinyPower: '짓밟혀도 다시 일어서며 상처 입은 이들의 아픔을 어루만져 회복시키는 치유력',
  },
  {
    signNumber: 13,
    nahuatlName: 'Acatl',
    nameKo: '아카틀 (지혜의 갈대 / 굳건한 중심)',
    patronDeity: '테스카틀리포카 (Tezcatlipoca - 연기 나는 흑요석 거울의 신)',
    elementNature: '수직의 기둥과 내적 엄정함',
    cosmicDestinyPower: '흔들리는 세상 속에서 하늘과 땅을 잇는 단단한 중심축이 되어 진실을 수호함',
  },
  {
    signNumber: 14,
    nahuatlName: 'Ocelotl',
    nameKo: '오셀로틀 (밤의 재규어 / 전사의 용기)',
    patronDeity: '틀라솔테오틀 (Tlazolteotl - 정화와 지혜의 대지 여신)',
    elementNature: '밤의 시야와 은밀한 침투력',
    cosmicDestinyPower: '보이지 않는 위험을 예리하게 꿰뚫어보고 두려움 없이 정면 돌파하는 전사의 기백',
  },
  {
    signNumber: 15,
    nahuatlName: 'Cuauhtli',
    nameKo: '쿠아우틀리 (태양의 독수리 / 높은 비상)',
    patronDeity: '시페 토텍 (Xipe Totec - 재생과 봄의 신)',
    elementNature: '태양의 빛과 거시적 통찰의 날개',
    cosmicDestinyPower: '낮은 차원의 혼란을 벗어나 높은 상공에서 전체 판세를 조망하는 위대한 안목',
  },
  {
    signNumber: 16,
    nahuatlName: 'Cozcacuauhtli',
    nameKo: '코스카쿠아우틀리 (장수의 콘도르 / 카르마 정화)',
    patronDeity: '이츠파팔로틀 (Itzpapalotl - 흑요석 나비의 여신)',
    elementNature: '과거의 잔해 정화와 불멸의 장수',
    cosmicDestinyPower: '부정적인 카르마와 찌꺼기를 말끔히 청소하여 새로운 순백의 공간을 여는 지혜',
  },
  {
    signNumber: 17,
    nahuatlName: 'Ollin',
    nameKo: '올린 (제5의 태양 움직임 / 우주적 진동)',
    patronDeity: '숄로틀 (Xolotl - 황혼의 별과 변화의 수호자)',
    elementNature: '역동적인 변화와 우주의 심장박동',
    cosmicDestinyPower: '정체를 타파하고 삶의 판도를 근본적으로 뒤흔들어 새로운 도약을 이끄는 추진력',
  },
  {
    signNumber: 18,
    nahuatlName: 'Tecpatl',
    nameKo: '텍파틀 (부싯돌 칼 / 진실의 결단)',
    patronDeity: '찰치우토톨린 (Chalchiuhtotolin - 신성한 칠면조신)',
    elementNature: '예리한 통찰과 단호한 절단',
    cosmicDestinyPower: '모호함과 거짓된 기만을 한 칼에 베어내고 오직 투명한 진실만을 가려내는 결단력',
  },
  {
    signNumber: 19,
    nahuatlName: 'Quiahuitl',
    nameKo: '키아위틀 (천상의 비 / 대지의 쇄신)',
    patronDeity: '토나티우 (Tonatiuh - 제5의 찬란한 태양신)',
    elementNature: '하늘의 축복과 번개 같은 깨달음',
    cosmicDestinyPower: '메마른 삶의 대지에 자비로운 은혜의 단비를 내려 만물을 소생시키는 쇄신력',
  },
  {
    signNumber: 20,
    nahuatlName: 'Xochitl',
    nameKo: '쇼치틀 (지고의 꽃 / 예술적 만개)',
    patronDeity: '케찰코아틀의 꽃 (Quetzalcoatl Flor / 지고의 미)',
    elementNature: '궁극의 조화와 아름다움의 완성',
    cosmicDestinyPower: '모든 시련을 거쳐 마침내 영혼의 가장 찬란한 향기와 잠재력을 세상에 피워내는 완성력',
  },
];

const THIRTEEN_LORDS: string[] = [
  '제1주천신 시우테쿠틀리 (불과 시간의 군주 - 원초적 불꽃)',
  '제2주천신 틀랄테쿠틀리 (대지의 군주 - 굳건한 토대)',
  '제3주천신 찰치우틀리쿠에 (옥빛 물의 여신 - 맑은 정화)',
  '제4주천신 토나티우 (제5의 태양신 - 승리와 광명)',
  '제5주천신 틀라솔테오틀 (정화의 여신 - 오물 변환의 지혜)',
  '제6주천신 믹틀란테쿠틀리 (저승의 군주 - 침묵과 비밀)',
  '제7주천신 센테오틀 (옥수수와 풍요의 신 - 풍성한 결실)',
  '제8주천신 틀랄록 (비와 천둥의 신 - 천상의 은총)',
  '제9주천신 케찰코아틀 (깃털 달린 뱀 - 지고의 지혜)',
  '제10주천신 테스카틀리포카 (흑요석 거울의 신 - 운명 조망)',
  '제11주천신 미크테카시와틀 (저승의 여왕 - 보호와 변모)',
  '제12주천신 틀라위스칼판테쿠틀리 (새벽별의 군주 - 새로운 시작)',
  '제13주천신 시틀랄리쿠에 (별들의 치마를 입은 밤하늘 여신 - 우주적 포용)',
];

export interface AztecTonalamatlOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateAztecTonalamatl(
  optionsOrProfile?: AztecTonalamatlOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): AztecTonalamatlReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as AztecTonalamatlOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 260260;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 43) % 1000003;

  const signs: AztecDaySign[] = TWENTY_SIGNS_BASE.map((sgn, idx) => {
    const score = 48 + ((seed * (idx + 7) + idx * 37) % 51);
    return { ...sgn, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  signs.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantDaySign = signs[0];

  const lordIndex = (seed + dominantDaySign.signNumber) % THIRTEEN_LORDS.length;
  const thirteenLordOfTheDay = THIRTEEN_LORDS[lordIndex];

  const tonalliSolarVitalityScore = Math.min(100, Math.max(45, 54 + ((seed * 29) % 44)));
  const teyoliaHeartPurityIndex = Math.min(100, Math.max(42, 52 + ((seed * 23) % 46)));
  const ihiyotlBreathPowerScore = Math.min(100, Math.max(44, 53 + ((seed * 19) % 45)));
  const ollinCosmicMovementHarmony = Math.min(100, Math.max(46, Math.floor((tonalliSolarVitalityScore * 0.5 + teyoliaHeartPurityIndex * 0.5))));

  const aztecTonalamatlGuidance = `아즈텍 토날포왈리 성력서는 가르칩니다: "태양의 전사는 자신의 토날리(Tonalli)를 의식의 불꽃으로 지피며 어둠을 가른다." 현재 당신의 운명을 비추는 성스러운 일진은 [${dominantDaySign.nameKo}]이며, 수호신은 [${dominantDaySign.patronDeity}]입니다. ${dominantDaySign.cosmicDestinyPower}. 정수리의 태양 에너지와 가슴의 테욜리아가 지금 힘차게 고동치고 있습니다.`;
  const tonalliSunSalutationRitual = `아침 태양을 마주하고 정수리를 곧게 펴며 심호흡하십시오: "제5의 태양 토나티우의 광명이 나의 토날리를 가득 채우니, 두려움 없이 올린(Ollin)의 거룩한 우주적 변화를 향해 나아간다."`;

  return {
    engineVersion: AZTEC_TONALAMATL_ENGINE_VERSION,
    timestamp: now.toISOString(),
    tonalliSolarVitalityScore,
    teyoliaHeartPurityIndex,
    ihiyotlBreathPowerScore,
    ollinCosmicMovementHarmony,
    dominantDaySign,
    thirteenLordOfTheDay,
    aztecTonalamatlGuidance,
    tonalliSunSalutationRitual,
  };
}

export function formatAztecTonalamatlPrompt(report: AztecTonalamatlReport): string {
  return `### ☀️ 고대 아즈텍 토날포왈리 20대 일진 & 토날라마틀 성력 실측 데이터 (v${report.engineVersion})
- **주재 성스러운 일진**: ${report.dominantDaySign.nameKo} (${report.dominantDaySign.nahuatlName})
- **일진 수호 주재신**: ${report.dominantDaySign.patronDeity}
- **원소적 성질**: ${report.dominantDaySign.elementNature}
- **우주적 운명 권능**: ${report.dominantDaySign.cosmicDestinyPower}
- **13대 주천신 수호령**: ${report.thirteenLordOfTheDay}
- **토날리(정수리 태양 활력도)**: ${report.tonalliSolarVitalityScore}/100
- **테욜리아(심장 영혼 순수성)**: ${report.teyoliaHeartPurityIndex}/100
- **이히요틀(호흡·결단력 기운)**: ${report.ihiyotlBreathPowerScore}/100
- **올린(우주 진동 조화도)**: ${report.ollinCosmicMovementHarmony}/100
- **토날라마틀 지혜 지침**: ${report.aztecTonalamatlGuidance}
- **토날리 태양 경배 리추얼**: ${report.tonalliSunSalutationRitual}`;
}
