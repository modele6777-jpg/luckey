/**
 * 아즈텍 토날포왈리 20대 일진 & 13대 주천신 신성 역법 엔진 (aztecTonalamatlSacredCalendarEngine.ts)
 *
 * 고대 메소아메리카 아즈텍 문명의 260일 신성 역법 토날포왈리(Tonalpohualli)와 성력서 토날라마틀(Tonalamatl) 기반:
 * 인간의 운명과 영혼의 3대 에너지(토날리·테욜리아·이히요틀)를 조율하고,
 * 20대 신성 일진(Day Signs)과 13대 주천신(Thirteen Lords of the Day)의 천구 진동,
 * 질문 맥락별 정성 감사, KST 시공간 리듬을 해독하는 마스터 역법 엔진.
 */

import type { UserProfile } from '../sharedState';

export const AZTEC_TONALAMATL_ENGINE_VERSION = 'LUCKEY-AZTEC-TONALAMATL-v2.4.0';

export interface AztecDaySign {
  signNumber: number;
  nahuatlName: string;
  nameKo: string;
  patronDeity: string;
  elementNature: string;
  cosmicDestinyPower: string;
  resonanceScore: number; // 0 ~ 100 (내부 정량 연산용)
}

export interface AztecSituationalAudit {
  focusAxis: string;
  energyCenterFocus: string;
  codexPrescription: string;
  cautionNotice: string;
}

export interface AztecTemporalRhythm {
  kstHour: number;
  sunPhase: string;
  seasonElement: string;
  temporalPrescription: string;
  cosmicRhythmQuality: '상승' | '안정' | '성찰';
}

export interface AztecSynthesisMatrix {
  solarClarityGrade: '탁월' | '안정' | '보완';
  heartAlignmentState: string;
  ollinActionDirective: string;
}

export interface AztecTonalamatlReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  tonalliSolarVitalityScore: number;
  teyoliaHeartPurityIndex: number;
  ihiyotlBreathPowerScore: number;
  ollinCosmicMovementHarmony: number;
  dominantDaySign: AztecDaySign;
  thirteenLordOfTheDay: string;
  situationalTonalamatlAudit: AztecSituationalAudit;
  temporalTonalamatlRhythm: AztecTemporalRhythm;
  tonalamatlSynthesisMatrix: AztecSynthesisMatrix;
  aztecTonalamatlGuidance: string;
  tonalliSunSalutationRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function getKstParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hourPart = parts.find((p) => p.type === 'hour')?.value || '12';
  const monthPart = parts.find((p) => p.type === 'month')?.value || '1';
  return {
    hour: Number(hourPart) % 24,
    month: Number(monthPart),
  };
}

function buildSituationalAudit(question: string, sign: AztecDaySign): AztecSituationalAudit {
  const q = question.toLowerCase();
  if (/사랑|연애|관계|배우자|이별|결혼|사람|가족/.test(q)) {
    return {
      focusAxis: '심장 테욜리아(Teyolia) 정서 공명',
      energyCenterFocus: '가슴의 순수한 진심과 기억의 성실함',
      codexPrescription: `[${sign.nameKo}]의 기운 아래 상대방의 말 너머에 있는 본심을 살피고, 감정의 파도를 정화한 뒤 진실한 언어로 다가가십시오.`,
      cautionNotice: '충동적인 서운함에 휩쓸려 관계의 본질을 흐리지 않도록 숨을 고르십시오.',
    };
  }
  if (/일|직업|사업|이직|시험|프로젝트|돈|재물|계약|진로/.test(q)) {
    return {
      focusAxis: '정수리 토날리(Tonalli) 태양 소명과 현실 결실',
      energyCenterFocus: '머리 위의 명징한 목적의식과 흔들리지 않는 추진력',
      codexPrescription: `[${sign.nameKo}]가 부여하는 실행력을 바탕으로 오늘 가장 먼저 처리할 핵심 과업 하나를 정해 완수하십시오.`,
      cautionNotice: '불필요한 소모전에 에너지를 분산시키지 말고 주력 전선에 집중하십시오.',
    };
  }
  if (/건강|몸|피로|불안|마음|치유|잠|휴식/.test(q)) {
    return {
      focusAxis: '간·호흡 이히요틀(Ihiyotl) 생명 순환 회복',
      energyCenterFocus: '단전의 깊은 호흡과 긴장된 신경계의 이완',
      codexPrescription: '무리한 결단을 잠시 멈추고 따뜻한 물과 규칙적인 호흡으로 체내 순환의 불꽃을 안정시키십시오.',
      cautionNotice: '과도한 자기 채찍질이 오히려 생명의 리듬을 거스르지 않게 경계하십시오.',
    };
  }
  return {
    focusAxis: '토날리·테욜리아·이히요틀 삼위일체 조율',
    energyCenterFocus: '생각·감정·행동이 한 방향으로 정렬되는 올린(Ollin)의 중심',
    codexPrescription: `[${sign.nameKo}]의 원형인 "${sign.cosmicDestinyPower}"을 오늘의 나침반으로 삼아 차분히 한 걸음을 내딛으십시오.`,
    cautionNotice: '결과를 서둘러 단정 짓기보다 지금 손에 쥔 현장의 흐름을 먼저 정돈하십시오.',
  };
}

function buildTemporalRhythm(now: Date): AztecTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let sunPhase = '정오의 토나티우(Tonatiuh) 절정 창';
  let cosmicRhythmQuality: AztecTemporalRhythm['cosmicRhythmQuality'] = '상승';
  let temporalPrescription = '태양이 가장 높이 뜬 시간대이므로 핵심 결단과 외부 소통을 과감히 추진하기 좋습니다.';

  if (hour >= 4 && hour < 9) {
    sunPhase = '새벽별 틀라위스칼판테쿠틀리 여명 창';
    cosmicRhythmQuality = '상승';
    temporalPrescription = '새벽의 첫 빛과 함께 토날리(정수리 기운)를 정돈하고 하루의 의도를 선언하기 가장 좋은 시간입니다.';
  } else if (hour >= 9 && hour < 15) {
    sunPhase = '정오의 토나티우(Tonatiuh) 창공 창';
    cosmicRhythmQuality = '상승';
    temporalPrescription = '외부의 일과 창조적 실행을 힘있게 밀고 나가되 수분과 호흡을 함께 챙기십시오.';
  } else if (hour >= 15 && hour < 20) {
    sunPhase = '황혼의 숄로틀(Xolotl) 전환 창';
    cosmicRhythmQuality = '안정';
    temporalPrescription = '낮 동안 흩어진 마음을 거두고 진행 중인 과업의 마무리를 점검하기 알맞습니다.';
  } else {
    sunPhase = '밤하늘 시틀랄리쿠에(Citlalicue) 성찰 창';
    cosmicRhythmQuality = '성찰';
    temporalPrescription = '외부의 소음을 닫고 내면의 흑요석 거울 앞에서 하루의 진짜 의미를 비추어 볼 시간입니다.';
  }

  let seasonElement = '대지의 결실기 (Tonalco)';
  if (month >= 3 && month <= 5) seasonElement = '새싹과 바람의 부활기 (Xopan)';
  else if (month >= 6 && month <= 8) seasonElement = '틀랄록의 비와 성장기 (Xopantla)';
  else if (month >= 9 && month <= 11) seasonElement = '수확과 황금 바람의 결실기 (Tonalko)';
  else seasonElement = '동지 태양의 침잠과 내면 응축기 (Cecuiztli)';

  return {
    kstHour: hour,
    sunPhase,
    seasonElement,
    temporalPrescription,
    cosmicRhythmQuality,
  };
}

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

  const situationalTonalamatlAudit = buildSituationalAudit(question, dominantDaySign);
  const temporalTonalamatlRhythm = buildTemporalRhythm(now);

  const solarClarityGrade: AztecSynthesisMatrix['solarClarityGrade'] =
    tonalliSolarVitalityScore >= 78 ? '탁월' : tonalliSolarVitalityScore >= 60 ? '안정' : '보완';
  const heartAlignmentState =
    teyoliaHeartPurityIndex >= 72
      ? '테욜리아 심장 영혼이 고요하고 투명하게 정렬된 상태'
      : '감정의 잔물결을 호흡으로 가라앉히며 진심을 다시 확인해야 할 상태';
  const ollinActionDirective = `${temporalTonalamatlRhythm.sunPhase} 흐름에 맞추어 ${situationalTonalamatlAudit.focusAxis}을 우선 정돈하십시오.`;

  const tonalamatlSynthesisMatrix: AztecSynthesisMatrix = {
    solarClarityGrade,
    heartAlignmentState,
    ollinActionDirective,
  };

  const aztecTonalamatlGuidance = `아즈텍 토날포왈리 성력서는 가르칩니다: "태양의 전사는 자신의 토날리(Tonalli)를 의식의 불꽃으로 지피며 어둠을 가른다." 현재 당신의 운명을 비추는 성스러운 일진은 [${dominantDaySign.nameKo}]이며, 수호신은 [${dominantDaySign.patronDeity}]입니다. ${dominantDaySign.cosmicDestinyPower}.`;
  const tonalliSunSalutationRitual = `아침 태양을 마주하고 정수리를 곧게 펴며 심호흡하십시오: "제5의 태양 토나티우의 광명이 나의 토날리를 가득 채우니, 두려움 없이 올린(Ollin)의 거룩한 우주적 변화를 향해 나아간다."`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
  const interpretiveBoundary = '본 아즈텍 토날라마틀 성력 리포트는 고대 메소아메리카 260일 신성 역법 상징에 기반한 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.';

  const reflectionFocus = `${situationalTonalamatlAudit.focusAxis}에 비추어 오늘 나의 토날리 불꽃을 흐리는 습관 하나는 무엇인가요?`;
  const reflectiveQuestion = question.trim()
    ? `"${question.trim()}" 앞에서 오늘 [${dominantDaySign.nameKo}]의 기운으로 다시 지피고 싶은 나의 내면 불꽃(토날리)은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: AZTEC_TONALAMATL_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    tonalliSolarVitalityScore,
    teyoliaHeartPurityIndex,
    ihiyotlBreathPowerScore,
    ollinCosmicMovementHarmony,
    dominantDaySign,
    thirteenLordOfTheDay,
    situationalTonalamatlAudit,
    temporalTonalamatlRhythm,
    tonalamatlSynthesisMatrix,
    aztecTonalamatlGuidance,
    tonalliSunSalutationRitual,
    ritualAction: tonalliSunSalutationRitual,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatAztecTonalamatlPrompt(report: AztecTonalamatlReport): string {
  return `### ☀️ 고대 아즈텍 토날포왈리 20대 일진 & 토날라마틀 성력 실측 데이터 (v${report.engineVersion})
- **기준 시각(KST)**: ${report.calculatedAtKst}
- **주재 성스러운 일진**: ${report.dominantDaySign.nameKo} (${report.dominantDaySign.nahuatlName})
- **일진 수호 주재신**: ${report.dominantDaySign.patronDeity}
- **원소적 성질**: ${report.dominantDaySign.elementNature}
- **우주적 운명 권능**: ${report.dominantDaySign.cosmicDestinyPower}
- **13대 주천신 수호령**: ${report.thirteenLordOfTheDay}
- **질문 맥락 감사**: ${report.situationalTonalamatlAudit.focusAxis} — ${report.situationalTonalamatlAudit.energyCenterFocus}
  * 원전 처방: ${report.situationalTonalamatlAudit.codexPrescription}
  * 주의 경계: ${report.situationalTonalamatlAudit.cautionNotice}
- **KST 시공간 리듬 (${report.temporalTonalamatlRhythm.kstHour}시)**: ${report.temporalTonalamatlRhythm.sunPhase} · ${report.temporalTonalamatlRhythm.seasonElement} (${report.temporalTonalamatlRhythm.cosmicRhythmQuality})
  * 시공간 지침: ${report.temporalTonalamatlRhythm.temporalPrescription}
- **삼중 영혼 교차 매트릭스**: 토날리(${report.tonalamatlSynthesisMatrix.solarClarityGrade}) · ${report.tonalamatlSynthesisMatrix.heartAlignmentState}
  * 통합 행동 지침: ${report.tonalamatlSynthesisMatrix.ollinActionDirective}
- **토날라마틀 지혜 지침**: ${report.aztecTonalamatlGuidance}
- **토날리 태양 경배 리추얼**: ${report.tonalliSunSalutationRitual}
- **성찰 초점**: ${report.reflectionFocus}
- **성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
