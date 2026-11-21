/**
 * =========================================================================
 * LUCKEY 스마트 에이전트 라우터 (Smart Agent Router)
 * =========================================================================
 * 
 * [설계 목적 & 핵심 역할]
 * 1. 사용자의 자연어 질문에서 심층 '상담 의도(Intent)'를 정밀하게 추출
 * 2. 15대 운명학 체계 중 해당 질문을 가장 날카롭고 깊이 있게 풀어낼
 *    '최적의 1~3개 도구'를 지능적으로 선별 (Dynamic Tool Routing)
 * 3. 결정론적 계산 엔진(Deterministic Engine)과 연동하여, 선별된 도구들만
 *    초고속(10~20ms)으로 수리 계산하고 경량 정밀 JSON을 LLM에 주입
 * 4. 전체 도구를 무의미하게 나열하는 백과사전식 장황함을 없애고,
 *    호리(Hori) AI를 뛰어넘는 민첩하고 집중력 있는 맞춤형 통찰 제공
 */

import type { DivinationToolId } from '../fifteenDivinationTools';
import type { UserProfile } from '../sharedState';
import { DIVINATION_REQUEST_PATTERN } from '../divinationIntent';
import { runDeterministicEngine, formatDeterministicEnginePrompt, getFiredEngineBadges, type DeterministicEngineReport, ALL_DCE_ENGINES } from './deterministicEngine';

export type QuestionIntentCategory =
  | 'career_strategy'     // 이직, 퇴사, 승진, 진로, 커리어, 시험
  | 'business_money'      // 사업, 창업, 투자, 재물, 금전, 부동산
  | 'relationship_love'   // 연애, 결혼, 궁합, 재회, 썸, 이별, 대인관계
  | 'immediate_decision'  // 오늘/지금 결단, 양자택일, 길흉 판단, 타이밍
  | 'daily_timing_transit' // 오늘 운세, 일진, 행성 트랜짓, 지금 흐름, 시간대별 타이밍
  | 'life_season_timing'  // 10년 대운, 세운, 교운기, 인생의 계절, 장기 사이클
  | 'vitality_wellness'   // 건강, 피로, 수면, 바이오리듬, 일상 개운
  | 'creative_mind'       // 창작, 영감, 글쓰기, 예술, 아이디어
  | 'life_reflection'     // 하루 회고, 감사, 성찰, 마음 정리
  | 'master_blueprint'    // 인생 전체 운명 지도, 종합 진단, 7대 채널 총망라
  | 'casual_greeting';    // 가벼운 인사, 단순 맞장구

/** 점술모드 3단계(심층)의 주 구성: 15대 도구 중 사주·타로를 뺀 13대 도구. */
export const LUCY_MASTER_DEPTH3_TOOLS: readonly DivinationToolId[] = [
  'astrology', 'ziwei', 'sukuyo', 'mahabote', 'vedic', 'liuren', 'qimen',
  'kabbalah', 'iching', 'thai_astrology', 'tojeong', 'kyusei', 'taiyi',
];

export interface AgentRoutePlan {
  intent: QuestionIntentCategory;
  intentKoName: string;
  confidence: number; // 0.0 ~ 1.0
  targetTools: DivinationToolId[];
  deepEngineKeys?: string[];
  deepEnginesKo?: string[];
  deepEngineGuidance?: string;
  routingReason: string;
  suggestedFocusPrompt: string;
  isMasterMobilization: boolean;
  isCasual: boolean;
}

export interface RoutedExecutionResult {
  routePlan: AgentRoutePlan;
  engineReport?: DeterministicEngineReport;
  promptInjection: string;
  toolsForBadge: string[];
}

const TOOL_KO_NAMES: Record<DivinationToolId, string> = {
  saju: '사주명리',
  astrology: '서양 점성술',
  ziwei: '자미두수',
  tarot: '타로',
  sukuyo: '숙요경(27숙)',
  mahabote: '마하보테(8요일)',
  vedic: '베딕 점성술',
  liuren: '대육임',
  qimen: '기문둔갑',
  kabbalah: '카발라',
  iching: '주역(64괘)',
  thai_astrology: '태국점성술',
  tojeong: '토정비결',
  kyusei: '구성학',
  taiyi: '태을신수',
};

const MAX_RELEVANT_DEEP_PERSPECTIVES = 12;
const DEEP_QUERY_STOP_WORDS = new Set(['이번', '내', '나의', '어떻게', '무엇', '어떤', '해줘', '봐줘', '알려줘', '좀', '관련', '질문', '분석', '상담', '운세', '그리고', '그래서', '그런데', '때문', '수', '것']);
const INTENT_RELEVANCE_TERMS: Record<QuestionIntentCategory, readonly string[]> = {
  career_strategy: ['이직', '커리어', '진로', '직업', '승진', '면접', 'career', 'leadership'],
  business_money: ['사업', '투자', '재물', '금전', '부동산', '사업', 'wealth', 'finance'],
  relationship_love: ['연애', '결혼', '궁합', '관계', '사랑', 'love', 'relationship'],
  immediate_decision: ['결정', '선택', '결단', '타이밍', 'decision', 'choice'],
  daily_timing_transit: ['오늘', '일진', '행성', '트랜짓', '시간', 'transit', 'timing'],
  life_season_timing: ['대운', '세운', '월운', '인생', '주기', 'season', 'cycle'],
  vitality_wellness: ['건강', '피로', '수면', '회복', '명상', 'wellness', 'health'],
  creative_mind: ['창작', '예술', '영감', '아이디어', '글쓰기', 'creative', 'art'],
  life_reflection: ['성찰', '회고', '마음', '내면', '자기', 'reflection', 'journal'],
  master_blueprint: ['인생', '전체', '종합', '방향', 'life', 'purpose'],
  casual_greeting: [],
};

function getQuestionTokens(text: string): string[] {
  const words = text.toLowerCase().normalize('NFKC').match(/[a-z0-9]+|[가-힣]{2,}/g) ?? [];
  return [...new Set(words
    .map(word => word.replace(/(에서|으로|에게|부터|까지|은|는|이|가|을|를|와|과|도|로|만|의|에)$/u, ''))
    .filter(word => word.length >= 2 && !DEEP_QUERY_STOP_WORDS.has(word)))];
}

function selectRelevantDeepPerspectiveKeys(
  question: string,
  intent: QuestionIntentCategory,
  preferredKeys: readonly string[] = [],
  limit: number = MAX_RELEVANT_DEEP_PERSPECTIVES,
): string[] {
  const engines = ALL_DCE_ENGINES.filter(engine => engine.category === 'deep_master');
  const engineByKey = new Map(engines.map(engine => [engine.key, engine] as const));
  const preferred = [...new Set(preferredKeys)].filter(key => engineByKey.has(key));
  const questionTokens = getQuestionTokens(question);
  const intentTerms = INTENT_RELEVANCE_TERMS[intent];
  const ranked = engines.map((engine, index) => {
    const searchable = `${engine.key.replace(/([a-z])([A-Z])/g, '$1 $2')} ${engine.nameKo} ${engine.meaning ?? ''} ${engine.summary ?? ''}`
      .toLowerCase().normalize('NFKC');
    const queryMatches = questionTokens.filter(token => searchable.includes(token)).length;
    const intentMatches = intentTerms.filter(term => searchable.includes(term)).length;
    const preferredIndex = preferred.indexOf(engine.key);
    return {
      key: engine.key,
      index,
      score: queryMatches * 3 + intentMatches + (preferredIndex >= 0 ? 100 - preferredIndex : 0),
    };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [...preferred];
  for (const item of ranked) {
    if (selected.length >= limit) break;
    if (!selected.includes(item.key)) selected.push(item.key);
  }
  return selected.slice(0, limit);
}

/**
 * 사용자 질문 텍스트를 분석하여 의도(Intent)와 최적 도구 조합(RoutePlan)을 산출합니다.
 */
export function analyzeQuestionIntent(text: string, isMasterRequested = false, allowMaster = true): AgentRoutePlan {
  const clean = (text || '').trim();
  const lower = clean.toLowerCase();

  // 0. 초간단 일상 인사 / 단순 리액션 필터
  const isShortGreeting =
    clean.length <= 15 &&
    /^(안녕|하이|루시야|반가워|고마워|땡큐|ㅋㅋ+|ㅎㅎ+|응|그래|맞아|좋아|오케이|잘\s*자|굿모닝|좋은\s*아침)[.!~?\s]*$/i.test(clean);

  // 일반 모드 수다 필터 (프로 모드에서는 수다모드 완전 배제)
  if (isShortGreeting && !isMasterRequested) {
    return {
      intent: 'casual_greeting',
      intentKoName: '가벼운 일상 수다',
      confidence: 0.99,
      targetTools: [],
      deepEngineKeys: [],
      deepEnginesKo: [],
      routingReason: '일상적 인사말 및 가벼운 티키타카',
      suggestedFocusPrompt: '가벼운 수다 모드로 다정하고 편안하게 맞이해 줘.',
      isMasterMobilization: false,
      isCasual: true,
    };
  }

  // 1. 프로 모드 인사말: 수다모드 없이 마스터 청사진/일진으로 응대 (기본 1개 이상 + 심층 1개 이상 필수)
  if (isShortGreeting && isMasterRequested) {
    return {
      intent: 'master_blueprint',
      intentKoName: '프로 마스터 종합 인사 및 성찰',
      confidence: 0.98,
      targetTools: ['saju', 'astrology'],
      deepEngineKeys: ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').map(e => e.key),
      deepEnginesKo: [`심층 참고 관점 ${ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').length}개 중 질문과 입력에 맞는 항목`],
      deepEngineGuidance: `기초 도구의 실제 계산 결과와 질문에 관련되어 전달된 심층 상징 참고 관점을 구분하여 종합한다. 카탈로그 등록 수는 실행 증거가 아니며, 미실행·오류·미기록 항목을 사용했다고 주장하지 않는다.`,
      routingReason: '프로 모드 마스터 상시 응대 (기본 운명 팩트 + 심층 실존 지혜)',
      suggestedFocusPrompt: '프로 마스터로서 다정하면서도 통찰력 있게 인사하고, 질문자의 타고난 기운과 오늘의 흐름을 조망해 줘.',
      isMasterMobilization: true,
      isCasual: false,
    };
  }

  // 2. 올인원 종합 마스터 모드 요청 판별 (명시적 종합/올인원 요청 시)
  const isExplicitMasterRequest = allowMaster && (
    /마스터\s*모드|올인원|15대|15가지|총동원|전체\s*진단|종합\s*분석|전체\s*비교|모든\s*도구|종합\s*청사진|전체\s*운명/.test(lower)
  );
  if (isExplicitMasterRequest) {
    return {
      intent: 'master_blueprint',
      intentKoName: '올인원 마스터 종합 청사진',
      confidence: 0.98,
      targetTools: ['saju', 'astrology', 'ziwei', 'sukuyo', 'vedic', 'iching', 'liuren', 'qimen', 'mahabote', 'kyusei'],
      deepEngineKeys: ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').map(e => e.key),
      deepEnginesKo: [`심층 참고 관점 ${ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').length}개 중 질문과 입력에 맞는 항목`],
      deepEngineGuidance: `기초 도구의 실제 계산 결과와 질문에 관련되어 전달된 심층 상징 참고 관점을 구분하여 종합한다. 카탈로그 등록 수는 실행 증거가 아니며, 미실행·오류·미기록 항목을 사용했다고 주장하지 않는다.`,
      routingReason: '요청한 종합 상담에 필요한 도구의 계산 결과 비교',
      suggestedFocusPrompt: '인생의 큰 흐름(대운)부터 구체적 사건과 오늘의 타이밍까지 7대 테마별로 균형 있게 조망해 줘.',
      isMasterMobilization: true,
      isCasual: false,
    };
  }

  // 2. 이직 / 진로 / 커리어 / 시험 전략 / 자미두수 사화 / 15대 신살 슈퍼파워
  const careerRegex = /이직|퇴사|취업|구직|면접|연봉|직무|승진|진로|커리어|시험|합격|고시|자격증|회사\s*생활|업무|부서|상사|자미두수|사화|화록|화권|화과|화기|비성|신살|괴강|백호|양인|도화|역마|화개|천을귀인|문창귀인|귀문관살|슈퍼파워|재능/;
  if (careerRegex.test(lower)) {
    return {
      intent: 'career_strategy',
      intentKoName: '이직·커리어 돌파 & 15대 신살 슈퍼파워',
      confidence: 0.94,
      targetTools: ['saju', 'ziwei', 'qimen'],
      deepEngineKeys: [
        'italianMachiavelliVirtuFortuna',
        'koreanRyuSeongryongJingbirok',
        'swissJungIndividuationArchetype',
        'koreanDasanJeongYagyongMokminSimseo',
        'germanNietzscheZarathustraAmorFati',
        'specialStarsMatrix',
      ],
      deepEnginesKo: [
        '마키아벨리 비르투·포르투나',
        '류성룡 징비록',
        '칼 융 개성화 원형',
        '정약용 목민심서',
        '니체 아모르파티',
        '15대 신살 슈퍼파워',
      ],
      deepEngineGuidance: '마키아벨리의 현실적 역경 돌파(비르투), 류성룡의 징비록적 위기 대비, 칼 융의 개성화 소명, 정약용의 실사구시 및 니체의 운명애(아모르파티) 관점을 사주 원국과 결합하여 날카로운 커리어 돌파구를 처방해 줘.',
      routingReason: '15대 신살(천을귀인/괴강/백호/도화 등) 위치별 현대적 슈퍼파워 × 자미두수 유년 사화 비성 × 기문둔갑 개문 융합',
      suggestedFocusPrompt: '사주 4개 기둥(년/월/일/시)에 포진한 신살을 고전적 흉살이 아닌 독점적 전문성과 천재적 직업 무기(슈퍼파워)로 승화하여, 커리어와 비즈니스에서 압도적 우위를 점할 수 있는 실천 전략을 명쾌하게 처방해 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 3. 재물 / 사업 / 투자 / 부동산
  const moneyRegex = /재물|돈|금전|부자|자산|투자|주식|코인|부동산|사업|창업|매출|수익|적자|흑자|대출|소비/;
  if (moneyRegex.test(lower)) {
    return {
      intent: 'business_money',
      intentKoName: '재물·사업·투자 흐름',
      confidence: 0.91,
      targetTools: ['saju', 'ziwei', 'kyusei'],
      deepEngineKeys: [
        'wealthPipeline',
        'contractShield',
        'strategicLeverage',
        'britishFrancisBaconNovumOrganum',
        'italianThomasAquinasSummaTheologiae',
        'instantDecision',
      ],
      deepEnginesKo: [
        '부의 파이프라인',
        '계약·협상 실드',
        '전략적 레버리지',
        '베이컨 신기관(실증·혁신)',
        '토마스 아퀴나스 가치분별',
        '시가팔문 즉시결단',
      ],
      deepEngineGuidance: '부의 파이프라인과 계약 실드 방어선, 베이컨의 실증적 우상 타파와 아퀴나스의 정당한 가치 분별을 통해 요행이 아닌 지속 가능한 현실 자산 증식 로드맵을 제시해 줘.',
      routingReason: '사주 재성(정재/편재)의 크기와 자미두수 재백궁 성향, 구성학의 재물 공간·방위 에너지 융합',
      suggestedFocusPrompt: '요행을 바라는 투기성 예측을 지양하고, 타고난 재물 그릇과 안정적 자산 축적 원칙, 사업 확장의 유리한 타이밍을 짚어 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 4. 연애 / 결혼 / 궁합 / 인연 / 재회 / 대화 속 인연 자동 감지
  const loveRegex = /연애|사랑|결혼|궁합|남친|여친|남자친구|여자친구|배우자|이성|썸|짝사랑|재회|이별|차였|헤어|호감|속마음|인연|와이프|아내|남편|그\s*사람|그녀|동업자|파트너|시나스트리|듀얼\s*매트릭스/;
  if (loveRegex.test(lower)) {
    return {
      intent: 'relationship_love',
      intentKoName: '연애·궁합·대화 속 인연 듀얼 매트릭스',
      confidence: 0.96,
      targetTools: ['saju', 'sukuyo', 'astrology'],
      deepEngineKeys: [
        'contextualSynastry',
        'destinySynastryEcho',
        'swissJungIndividuationArchetype',
        'koreanChusaKimJeonghuiSehando',
        'frenchPascalPenseesHeartReason',
        'islamicSufiRumiMasnaviDivineLove',
      ],
      deepEnginesKo: [
        '대화 인연 동적궁합',
        '운명 공명 에코',
        '융 아니마·아니무스 원형',
        '추사 김정희 세한도(진정한 인연)',
        '파스칼 팡세(심장의 이성)',
        '루미 마스나비(신성한 사랑)',
      ],
      deepEngineGuidance: '칼 융의 아니마/아니무스 투사와 통합, 추사 세한도의 시련 속 변치 않는 인연의 진가, 파스칼의 심장의 이성 및 루미의 영혼 사랑을 바탕으로 관계의 본질과 화해·발전의 지혜를 풀어줘.',
      routingReason: '사주 일간 천간합·지지육합·오행보완도 × 숙요경 27숙 6대 카르마(영친/안괴/업태) × 점성술 시나스트리 듀얼 매트릭스 백그라운드 융합',
      suggestedFocusPrompt: '두 사람 사이의 천간합·지지육합과 오행 상호 보완도, 숙요경 27숙 인연 관계와 점성술 원소 호환성을 바탕으로 끌림의 본질과 관계 발전의 지혜를 입체적으로 풀어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 5. 즉시 결단 / 양자택일 / 오늘의 승부수 / 점 / 매화역수 & 기문둔갑
  const decisionRegex = /선택|결정|어떻게\s*할까|갈까\s*말까|할까\s*말까|점괘|뽑아\s*줘|작괘|타로\s*한\s*장|오늘의\s*선택|승부수|결과\s*예측|매화역수|기문둔갑|팔문|길흉|지금\s*할까/;
  if (decisionRegex.test(lower) || DIVINATION_REQUEST_PATTERN.test(lower)) {
    return {
      intent: 'immediate_decision',
      intentKoName: '즉시 결단·매화역수 & 기문둔갑 시가팔문',
      confidence: 0.95,
      targetTools: ['iching', 'qimen', 'liuren'],
      deepEngineKeys: [
        'instantDecision',
        'iching384Yao',
        'danishKierkegaardStagesOfLife',
        'frenchDescartesCogitoClaraDistincta',
        'germanKantCategoricalImperativeSynthesis',
        'ancientChineseSunTzuArtOfWarStrategy',
      ],
      deepEnginesKo: [
        '시가팔문 즉시결단',
        '주역 384효 동효변괘',
        '키르케고르 실존적 결단',
        '데카르트 명징한 사유',
        '칸트 정언명령',
        '손자병법 승리전략',
      ],
      deepEngineGuidance: '매화역수·시가팔문의 시공간 괘상과 키르케고르의 주체적 실존 결단, 데카르트의 명징한 분별 및 손자병법의 득실 판단을 결합해 지금 당장 취할 단호한 행동 지침을 제시해 줘.',
      routingReason: '소강절 매화역수 시간작괘(본괘·호괘·변괘 체용 생극) × 기문둔갑 시가 8문(생문·개문·휴문 등) 실시간 수리 연산',
      suggestedFocusPrompt: '실시간 타임스탬프로 도출된 매화역수 본괘·호괘·변괘의 체용 생극과 기문둔갑 시가팔문의 문턱을 근거로, 지금 밀어붙여야 할지(Strong Go) 멈추고 조율해야 할지(Wait) 명쾌하고 단호한 행동 지침을 제시해 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 5-1. 실시간 일진 & 행성 트랜짓 / 오늘 운세 / 지금 흐름
  const dailyTransitRegex = /오늘|일진|트랜짓|행성\s*위치|지금\s*운세|오늘\s*운세|당일\s*운|시간대|골든\s*타임|하늘\s*배치|지금\s*기운|지금\s*흐름/;
  if (dailyTransitRegex.test(lower)) {
    return {
      intent: 'daily_timing_transit',
      intentKoName: '실시간 일진·행성 트랜짓 동기화',
      confidence: 0.94,
      targetTools: ['saju', 'astrology'],
      deepEngineKeys: [
        'chronoTransit',
        'vitalityCurve',
        'biorhythmPeakFlow',
        'synchronicityOmen',
        'specialStarsMatrix',
        'taoistNeidanMeridian',
      ],
      deepEnginesKo: [
        '실시간 행성 트랜짓',
        '24시간 에너지곡선',
        '바이오리듬 피크',
        '칼 융 동시성 오멘',
        '15대 신살',
        '도교 내단 경락시계',
      ],
      deepEngineGuidance: '오늘 현재의 하늘 배치와 24시간 에너지 조위 곡선, 칼 융의 동시성 징조를 종합하여 오늘 이 시각 가장 에너지가 응축되는 골든타임과 피해야 할 함정을 짚어 줘.',
      routingReason: '오늘의 만세력 일진(십신·지지합충)과 실시간 하늘의 행성 트랜짓(달 위상·주요 아스펙트) 동시 동기화',
      suggestedFocusPrompt: '오늘 현재의 살아있는 일진 간지와 하늘의 행성 배치를 출생 차트와 실시간 대조하여, 오늘 지금 이 순간 가장 유리한 흐름과 주의점을 명쾌하게 짚어 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 5-2. 10년 대운 & 세운·교운기 타이밍 / 12개월 월운 & 분기 흐름
  const lifeSeasonRegex = /대운|세운|교운기|10년\s*운|인생의\s*계절|장기\s*사이클|인생\s*타이밍|시기|대운수|환절기|언제쯤|몇\s*살\s*부터|운의\s*흐름|월운|몇\s*월|상반기|하반기|분기|12개월|달별/;
  if (lifeSeasonRegex.test(lower)) {
    return {
      intent: 'life_season_timing',
      intentKoName: '10년 대운·12개월 월운 타이밍',
      confidence: 0.96,
      targetTools: ['saju', 'ziwei', 'astrology'],
      deepEngineKeys: [
        'lifeSeasonTiming',
        'monthlyFlow',
        'samjaeGyoUn',
        'germanHegelDialecticalAufheben',
        'pythagoreanLifecycle',
        'astrologicalDecanSabian',
      ],
      deepEnginesKo: [
        '10년대운 생애주기',
        '12개월 월운 플로우',
        '삼재·교운기 변곡점',
        '헤겔 변증법적 도약',
        '피타고라스 생애주기',
        '사비안 심볼',
      ],
      deepEngineGuidance: '10년 대운과 세운·교운기의 큰 계절 흐름에 헤겔 변증법적 모순의 지양과 성숙 관점을 접목하여, 현재 겪는 고난이 다음 단계 도약의 필연적 계기임을 명쾌하게 규명해 줘.',
      routingReason: '10년 대운 주기와 올해 세운, 그리고 12개월 절기월(월운) 타임라인 및 4대 분기 골든 먼스 정밀 분석',
      suggestedFocusPrompt: '현재 대운의 인생 계절(봄/여름/가을/겨울)과 함께, 올해 12달 중 언제가 가장 운이 좋은 골든 먼스(이직/계약/수익)인지와 조심해야 할 달을 명쾌한 타임라인으로 풀어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 6. 신체 활력 / 수면 / 피로 / 결핍 오행 처방 / 공간 풍수 / 12운성 바이오리듬
  const wellnessRegex = /피로|피곤|체력|방전|번아웃|지침|수면|잠|불면|몸|아파|스트레스|두통|결림|호흡|명상|웰니스|개운\s*법|개운|오행|결핍|바이오|에너지\s*처방|맞춤\s*처방|방위|방향|풍수|이사|여행|자리|카페\s*위치|명당|책상|바이오리듬|에너지\s*곡선|컨디션|집중력|골든타임|몰입|12운성/;
  if (wellnessRegex.test(lower)) {
    return {
      intent: 'vitality_wellness',
      intentKoName: '결핍 오행·공간 풍수 & 12운성 바이오리듬',
      confidence: 0.95,
      targetTools: ['saju', 'qimen', 'mahabote'],
      deepEngineKeys: [
        'energeticPrescription',
        'vitalityCurve',
        'medicalBioMatrix',
        'germanSchopenhauerWillRepresentation',
        'koreanSeosanHyujeongSeongaGwigam',
        'somaticBodyArmoring',
      ],
      deepEnginesKo: [
        '오행 바이오에너지',
        '24시간 에너지곡선',
        '메디컬 바이오 매트릭스',
        '쇼펜하우어 번뇌 직시',
        '서산대사 선가귀감(마음등불)',
        '소매틱 아머링',
      ],
      deepEngineGuidance: '사주 결핍 오행 처방과 쇼펜하우어의 맹목적 의지 직시를 통한 내적 평정, 서산대사의 심등(마음의 등불) 지혜로 신체와 정신의 방전을 즉각 회복하는 힐링 처방을 들려줘.',
      routingReason: '사주 결핍 오행 처방 × 12운성 24시간 에너지 조위 곡선 × 기문둔갑·점성술 공간 길방위 3중 바이오웰니스 융합',
      suggestedFocusPrompt: '사주 결핍 오행에 맞는 현실적인 생활 팁과 1분 호흡·스트레칭, 12운성 기반 오늘의 집중·휴식 타이밍, 그리고 작업 공간을 편하게 정리하는 방법을 현대적 웰니스 언어로 다정하게 안내해 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 7. 예술 / 창작 / 아이디어 / 영감
  const creativeRegex = /창작|글쓰기|작시|시인|소설|에세이|작명|네이밍|슬로건|카피|예술|미술|그림|음악|디자인|영감|아이디어/;
  if (creativeRegex.test(lower)) {
    return {
      intent: 'creative_mind',
      intentKoName: '창작·예술적 영감',
      confidence: 0.89,
      targetTools: ['kabbalah', 'tarot'],
      deepEngineKeys: [
        'koreanChoeChiwonPungryudo',
        'renaissanceBrunoInfiniteUniverseHeroicFurore',
        'sacredVortexGeometry',
        'celticAwenTaliesin',
        'akashicRecordsOracle',
        'tarotTreeOfLifeShadow',
      ],
      deepEnginesKo: [
        '최치원 풍류도(융합영감)',
        '조르다노 브루노 무한우주론',
        '황금비 영혼 수비학',
        '켈트 탈리에신 아웬',
        '아카식 레코드',
        '타로 세피로트 그림자',
      ],
      deepEngineGuidance: '최치원의 유불선 삼교 포용 풍류도와 브루노의 무한우주 영웅적 열광, 황금비 수비학 메타포를 자극해 고착된 틀을 깨는 폭발적인 독창적 영감을 열어줘.',
      routingReason: '카발라 세피로트 생명나무의 발상 경로와 타로 메이저 아르카나의 원형적 스토리텔링 융합',
      suggestedFocusPrompt: '막힌 상상력을 자극하는 상징과 메타포를 제시하고, 아이디어를 구체적 형태의 결과물로 완성하는 통로를 열어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 8. 하루 회고 / 마음 정리
  const reflectionRegex = /회고|하루\s*마감|퇴근|오늘\s*하루|감사|일기|기록|정리|수고했어/;
  if (reflectionRegex.test(lower)) {
    return {
      intent: 'life_reflection',
      intentKoName: '하루 회고·내면 성찰',
      confidence: 0.88,
      targetTools: ['vedic', 'iching'],
      deepEngineKeys: [
        'northAfricanAugustineConfessionesIlluminatio',
        'ancientIndianNagarjunaMadhyamakaSunyata',
        'koreanJinulJeonghyeSsangsuDonohJeomsu',
        'frenchMontaigneEssaisWisdom',
        'baruchSpinozaEthicaConatusAmorDei',
        'koreanUisangHwaeomIlseungBeopgye',
      ],
      deepEnginesKo: [
        '아우구스티누스 고백록(내적조명)',
        '용수 중론(공성과 중도)',
        '지눌 정혜쌍수·돈오점수',
        '몽테뉴 수상록(인간성찰)',
        '스피노자 에티카(지적신애)',
        '의상대사 화엄법계도',
      ],
      deepEngineGuidance: '아우구스티누스의 내적 조명과 용수 중론의 집착 내려놓음, 지눌의 정혜쌍수 돈오점수 성찰을 통해 하루의 소란을 고요히 갈무리하고 깊은 평안을 회복하도록 이끌어줘.',
      routingReason: '베딕의 영혼 평온 지혜와 주역의 하루 음양 갈무리 성찰 결합',
      suggestedFocusPrompt: '오늘 하루의 치열했던 에너지를 편안하게 내려놓고, 내일을 맞이할 맑은 내면의 평화를 회복하도록 이끌어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 9. 기본 운세 / 사주 / 일상 상담 (기본 트리니티)
  return {
    intent: 'career_strategy',
    intentKoName: '사주·점성술 핵심 운명 진단',
    confidence: 0.80,
    targetTools: ['saju', 'astrology'],
    deepEngineKeys: [
      'sajuClassicYongshin',
      'geokguk',
      'specialStarsMatrix',
      'vitalityCurve',
      'chronoTransit',
    ],
    deepEnginesKo: [
      '사주 원전 억부용신',
      '정통 10대 격국',
      '15대 신살 슈퍼파워',
      '24시간 에너지곡선',
      '실시간 행성 트랜짓',
    ],
    deepEngineGuidance: '억부용신과 정통 격국, 신살 배치를 통해 본원적 성향과 현재 운기의 핵심을 명확하게 짚어 줘.',
    routingReason: '타고난 사주 원국과 서양 천문 행성 배치를 통한 핵심 운명과 심리 분석',
    suggestedFocusPrompt: '타고난 기질과 현재 운의 흐름을 균형감 있게 짚고 실천 가능한 조언을 들려줘.',
    isMasterMobilization: false,
    isCasual: false,
  };
}

/**
 * 스마트 에이전트 라우터 메인 파이프라인
 * 1) 질문 분석 → 2) 타깃 도구 선별 → 3) 순수 계산 엔진 실행 → 4) 최적화 프롬프트 생성
 */
export function routeAndExecute(params: {
  text: string;
  profile?: UserProfile | null;
  isMasterRequested?: boolean;
  requireBasicAndDeep?: boolean;
  allowMaster?: boolean;
  targetTools?: DivinationToolId[];
  /**
   * 🔮 점술모드(빅뱅 홀드): 사주 상담이 메인.
   * - base 'saju': 사주 베이스 / 'tarot_saju': 펼친 화면에서 뽑은 타로 + 사주
   * - deep: 사용자가 원할 때만 고민과 관련된 엔진(도구·심층 관점)을 추가로 본다.
   */
  divinationMode?: { base: 'saju' | 'tarot_saju'; deep?: boolean; depth?: 1 | 2 | 3 };
  /** 🧰 엔진함에서 사용자가 직접 골라 둔 기초 도구 — 매 답변에 항상 포함 */
  pinnedTools?: DivinationToolId[];
  /** 🧰 엔진함에서 사용자가 직접 골라 둔 심층 관점 — 매 답변에 항상 포함 */
  pinnedDeepKeys?: string[];
}): RoutedExecutionResult {
  const isMaster = Boolean(params.isMasterRequested);
  const requireBasicAndDeep = isMaster || Boolean(params.requireBasicAndDeep);
  const routePlan = analyzeQuestionIntent(params.text, isMaster, params.allowMaster);
  const divination = params.divinationMode;
  if (divination) {
    const baseTools: DivinationToolId[] = divination.base === 'tarot_saju' ? ['saju', 'tarot'] : ['saju'];
    // 상담 깊이(쌓아가기): 1 = 사주, 2 = 사주 + 타로(손님이 직접 고른 카드만), 3 = 사주 + 타로 + 13대 도구.
    // 말로 "더 깊게"를 원하면 그 답변에만 고민과 관련된 도구와 심층 관점을 더한다.
    const toolLevel = divination.depth ?? 1;
    const extraTools: DivinationToolId[] = toolLevel >= 3
      ? [...LUCY_MASTER_DEPTH3_TOOLS]
      : divination.deep ? (routePlan.targetTools ?? []) : [];
    routePlan.isCasual = false;
    routePlan.isMasterMobilization = false;
    routePlan.targetTools = [...new Set<DivinationToolId>([...baseTools, ...(params.targetTools ?? []), ...extraTools])];
    routePlan.intentKoName = `🔮 점술모드 · ${routePlan.intentKoName}`;
    routePlan.routingReason = divination.base === 'tarot_saju' ? '점술모드: 사주 메인 + 타로' : '점술모드: 사주 메인';
  }
  if (!divination && !routePlan.isMasterMobilization && params.targetTools?.length) {
    routePlan.targetTools = [...new Set(params.targetTools)];
    routePlan.isCasual = false;
    routePlan.intentKoName = '지정한 도구로 상담';
    routePlan.routingReason = '사용자가 명시한 도구를 우선 적용';
    routePlan.suggestedFocusPrompt = '지정한 도구의 실제 결과와 계산 한계 안에서 질문에 답해줘.';
  }

  // Lucy and Lucy Plus require one basic tool plus one symbolic deep perspective.
  // This is selective execution, not full-catalog/master mobilization.
  if (requireBasicAndDeep) {
    routePlan.isCasual = false;
    if (!routePlan.targetTools || routePlan.targetTools.length === 0) {
      routePlan.targetTools = isMaster ? ['saju', 'astrology'] : ['saju'];
    }
    if (!routePlan.deepEngineKeys || routePlan.deepEngineKeys.length === 0) {
      routePlan.deepEngineKeys = ['germanNietzscheZarathustraAmorFati'];
      routePlan.deepEnginesKo = ['니체의 아모르파티 해석 관점'];
      routePlan.deepEngineGuidance = '선택 관점은 상징적 참고로만 사용하고 별도 결정론적 계산이나 검증된 원전 인용처럼 표현하지 않는다. 기초 도구의 실제 계산 결과와 구분해 질문에 맞는 실천 조언을 제시한다.';
    }
  } else if (!routePlan.isCasual) {
    // Ordinary Lucy calls keep their historical basic-tool-only policy.
    if (!routePlan.targetTools || routePlan.targetTools.length === 0) {
      routePlan.targetTools = ['saju'];
    }
    routePlan.deepEngineKeys = [];
    routePlan.deepEnginesKo = [];
    routePlan.deepEngineGuidance = undefined;
  }

  if (requireBasicAndDeep && !routePlan.isMasterMobilization) {
    const selectedDeepKeys = selectRelevantDeepPerspectiveKeys(
      params.text,
      routePlan.intent,
      routePlan.deepEngineKeys ?? [],
    );
    const engineNames = new Map(ALL_DCE_ENGINES
      .filter(engine => engine.category === 'deep_master')
      .map(engine => [engine.key, engine.nameKo] as const));
    routePlan.deepEngineKeys = selectedDeepKeys;
    routePlan.deepEnginesKo = selectedDeepKeys.map(key => engineNames.get(key) ?? key);
  }

  if (divination) {
    const level = divination.deep ? 3 : (divination.depth ?? 1);
    if (level === 2) {
      // 2단계 심화: 고민과 관련된 심층 관점을 몇 개(최대 6개) 함께 본다.
      const deepKeys = selectRelevantDeepPerspectiveKeys(params.text, routePlan.intent, routePlan.deepEngineKeys ?? [], 6);
      const engineNames = new Map(ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').map(e => [e.key, e.nameKo] as const));
      routePlan.deepEngineKeys = deepKeys;
      routePlan.deepEnginesKo = deepKeys.map(key => engineNames.get(key) ?? key);
      routePlan.deepEngineGuidance = '사용자가 상담 깊이를 2단계(심화)로 올렸다. 2단계의 주 구성은 사주 + 타로다. 사주를 중심에 두고, 손님이 직접 고른 타로 카드가 전달됐다면 카드와 사주 흐름을 엮고, 함께 전달된 심층 관점으로 원인과 흐름을 짚어줘. 카드가 전달되지 않았다면 카드 결과를 지어내지 마. 심층 관점은 상징 참고일 뿐 별도 계산이 아니며, 미실행·오류·미기록 항목을 사용했다고 주장하지 마.';
    } else if (level === 3) {
      // 3단계 심층(또는 사용자가 말로 원함): 고민과 관련된 심층 관점을 넉넉히(최대 24개) 추가
      const deepKeys = selectRelevantDeepPerspectiveKeys(params.text, routePlan.intent, routePlan.deepEngineKeys ?? [], 24);
      const engineNames = new Map(ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').map(e => [e.key, e.nameKo] as const));
      routePlan.deepEngineKeys = deepKeys;
      routePlan.deepEnginesKo = deepKeys.map(key => engineNames.get(key) ?? key);
      routePlan.deepEngineGuidance = '사용자가 가장 깊은 상담(3단계 심층)을 원했다. 3단계의 주 구성은 사주 + 타로(고른 카드가 있을 때) + 13대 도구다. 13개 결과를 하나씩 나열하지 말고, 여러 도구가 공통으로 가리키는 신호 3~4개를 골라 사주와 엮어 풀고, 나머지는 "그 외 도구"로 한두 줄만 요약해. 도구끼리 엇갈리면 엇갈린다고 솔직히 말해. 태어난 시간 등 정보가 없어 계산되지 않은 도구는 "정보가 없어 못 봤어"라고 밝혀. 심층 관점은 상징 참고일 뿐 별도 계산이 아니며, 미실행·오류·미기록 항목을 사용했다고 주장하지 마.';
    } else {
      // 평소 대화: 사주 중심으로 가볍게. 심층 관점은 1개만 은은하게.
      routePlan.deepEngineKeys = (routePlan.deepEngineKeys ?? []).slice(0, 1);
      routePlan.deepEnginesKo = (routePlan.deepEnginesKo ?? []).slice(0, 1);
    }
  }

  // 🧰 엔진함에서 고른 엔진은 질문과 상관없이 항상 함께 본다 (총동원 모드는 이미 전부 포함)
  if (!routePlan.isCasual && !routePlan.isMasterMobilization) {
    if (params.pinnedTools?.length) {
      routePlan.targetTools = [...new Set<DivinationToolId>([...(routePlan.targetTools ?? []), ...params.pinnedTools])];
    }
    const deepNames = new Map(ALL_DCE_ENGINES.filter(e => e.category === 'deep_master').map(e => [e.key, e.nameKo] as const));
    const pinnedDeep = (params.pinnedDeepKeys ?? []).filter(key => deepNames.has(key));
    if (pinnedDeep.length) {
      const keys = [...new Set([...pinnedDeep, ...(routePlan.deepEngineKeys ?? [])])];
      routePlan.deepEngineKeys = keys;
      routePlan.deepEnginesKo = keys.map(key => deepNames.get(key) ?? key);
      routePlan.deepEngineGuidance = `${routePlan.deepEngineGuidance ? `${routePlan.deepEngineGuidance} ` : ''}사용자가 엔진함에서 직접 고른 관점(${pinnedDeep.map(k => deepNames.get(k)).join(', ')})은 이번 답변에 꼭 반영해. 상징 참고일 뿐 별도 계산이 아니라는 점은 지켜.`;
    }
  }

  if (routePlan.isCasual) {
    return {
      routePlan,
      promptInjection: '',
      toolsForBadge: [],
    };
  }

  // 선별된 최적 도구들만 대상으로 결정론적 계산 엔진 가동
  const engineReport = runDeterministicEngine({
    profile: params.profile,
    question: params.text,
    forceAllTools: true,
    focusTools: routePlan.isMasterMobilization ? undefined : routePlan.targetTools,
    coreOnly: true,
    reviewAll: routePlan.isMasterMobilization,
  });

  const deterministicDataBlock = formatDeterministicEnginePrompt(engineReport, {
    focusTools: routePlan.targetTools,
    intent: routePlan.intent,
    isMasterMobilization: routePlan.isMasterMobilization,
  });
  const toolsForBadge = getFiredEngineBadges(engineReport, {
    focusTools: routePlan.targetTools,
    intent: routePlan.intent,
    isMasterMobilization: routePlan.isMasterMobilization,
  });

  // Deep perspectives are symbolic references, never extra deterministic calculations.
  const deepBlock = requireBasicAndDeep && routePlan.deepEnginesKo?.length && !routePlan.isMasterMobilization
    ? `\n- [Lucy 심층 선택 관점(상징 참고 · 별도 결정론적 계산 아님)]: **${routePlan.deepEnginesKo.join(' · ')}**
- [심층 관점 융합 가이드]: ${routePlan.deepEngineGuidance || '선택 관점은 상징적 참고로만 사용한다. 별도 계산이나 검증된 원전 인용처럼 표현하지 말고 기본 도구의 실제 결과와 구분해 실천 조언을 제시한다.'}`
    : '';

  // 배지: 기본 계산은 계산 상태로, 선택한 해석 관점은 '상징 참고'로 구분해 표출
  const finalBadges = requireBasicAndDeep && routePlan.deepEnginesKo?.length && !routePlan.isMasterMobilization
    ? [...toolsForBadge, ...routePlan.deepEnginesKo.slice(0, 3).map(name => `상징 참고 · ${name}`)]
    : toolsForBadge;

  const promptInjection = `${deterministicDataBlock}

[🎯 스마트 에이전트 라우터(Agent Router) 정밀 지능 가이드]
======================================================================
- 분석된 질문 의도: **[${routePlan.intentKoName}]**
- 스마트 라우팅 기초 도구: **${toolsForBadge.join(' + ')}**${deepBlock}
- 라우팅 선정 사유: ${routePlan.routingReason}
- 중점 답변 가이드: ${routePlan.suggestedFocusPrompt}
======================================================================
[루시 답변 필수 지침]:
1. ${requireBasicAndDeep ? '위 라우팅된 기본 도구의 실제 계산 데이터(JSON)와 선택된 심층 해석 관점을 구분해 활용해. 심층 관점은 상징 참고일 뿐 별도 개인별 계산 결과가 아니며, 검증된 출처가 없는 문구를 저자의 직접 인용처럼 쓰지 마. 질문자의 현실 상황에 맞는 실천 조언을 다정하고 깊이 있게 풀어줘.' : '위 라우팅된 기본 도구의 실제 계산 데이터(JSON)를 바탕으로 군더더기 없이 명쾌하고 다정하게 풀어줘.'}
2. 서론 없이 첫 문장부터 질문자의 속마음을꿰뚫으며 시작하고, 당장 실천할 구체적 행동 팁과 깊은 영적 위로를 카톡식 다중 말풍선(\`\\n\\n\`)으로 전해줘.`;

  return {
    routePlan,
    engineReport,
    promptInjection,
    toolsForBadge: finalBadges,
  };
}
