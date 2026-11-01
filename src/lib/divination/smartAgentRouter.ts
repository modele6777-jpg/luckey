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
import { runDeterministicEngine, formatDeterministicEnginePrompt, type DeterministicEngineReport } from './deterministicEngine';

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

export interface AgentRoutePlan {
  intent: QuestionIntentCategory;
  intentKoName: string;
  confidence: number; // 0.0 ~ 1.0
  targetTools: DivinationToolId[];
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

/**
 * 사용자 질문 텍스트를 분석하여 의도(Intent)와 최적 도구 조합(RoutePlan)을 산출합니다.
 */
export function analyzeQuestionIntent(text: string, isMasterRequested = false): AgentRoutePlan {
  const clean = (text || '').trim();
  const lower = clean.toLowerCase();

  // 0. 초간단 일상 인사 / 단순 리액션 필터
  const isShortGreeting =
    clean.length <= 15 &&
    /^(안녕|하이|루시야|반가워|고마워|땡큐|ㅋㅋ+|ㅎㅎ+|응|그래|맞아|좋아|오케이|잘\s*자|굿모닝|좋은\s*아침)[.!~?\s]*$/i.test(clean);

  if (isShortGreeting && !isMasterRequested) {
    return {
      intent: 'casual_greeting',
      intentKoName: '가벼운 일상 수다',
      confidence: 0.99,
      targetTools: [],
      routingReason: '일상적 인사말 및 가벼운 티키타카',
      suggestedFocusPrompt: '가벼운 수다 모드로 다정하고 편안하게 맞이해 줘.',
      isMasterMobilization: false,
      isCasual: true,
    };
  }

  // 1. 올인원 종합 마스터 모드 요청 판별
  if (
    isMasterRequested ||
    /마스터\s*모드|올인원|15대|15가지|총동원|전체\s*진단|종합\s*분석|전체\s*비교|모든\s*도구/.test(lower)
  ) {
    return {
      intent: 'master_blueprint',
      intentKoName: '올인원 마스터 종합 청사진',
      confidence: 0.98,
      targetTools: ['saju', 'astrology', 'ziwei', 'sukuyo', 'vedic', 'iching', 'liuren', 'qimen', 'mahabote', 'kyusei'],
      routingReason: '동서양 핵심 운명학 도구 전원 총동원 입체 교차 검증',
      suggestedFocusPrompt: '인생의 큰 흐름(대운)부터 구체적 사건과 오늘의 타이밍까지 7대 테마별로 균형 있게 조망해 줘.',
      isMasterMobilization: true,
      isCasual: false,
    };
  }

  // 2. 이직 / 진로 / 커리어 / 시험 전략
  const careerRegex = /이직|퇴사|취업|구직|면접|연봉|직무|승진|진로|커리어|시험|합격|고시|자격증|회사\s*생활|업무|부서|상사/;
  if (careerRegex.test(lower)) {
    return {
      intent: 'career_strategy',
      intentKoName: '이직·커리어 돌파 전략',
      confidence: 0.92,
      targetTools: ['saju', 'qimen', 'ziwei'],
      routingReason: '사주의 대운·관성(직업운)과 기문둔갑의 돌파구(개문/생문), 자미두수 관록궁 명반 융합',
      suggestedFocusPrompt: '사주 원국의 직무 적성과 대운의 기회 시점을 짚고, 기문둔갑으로 지금 결행해야 할 최적의 타이밍과 전략을 날카롭게 처방해 줘.',
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
      routingReason: '사주 재성(정재/편재)의 크기와 자미두수 재백궁 성향, 구성학의 재물 공간·방위 에너지 융합',
      suggestedFocusPrompt: '요행을 바라는 투기성 예측을 지양하고, 타고난 재물 그릇과 안정적 자산 축적 원칙, 사업 확장의 유리한 타이밍을 짚어 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 4. 연애 / 결혼 / 궁합 / 인연 / 재회
  const loveRegex = /연애|사랑|결혼|궁합|남친|여친|남자친구|여자친구|배우자|이성|썸|짝사랑|재회|이별|차였|헤어|호감|속마음|인연/;
  if (loveRegex.test(lower)) {
    return {
      intent: 'relationship_love',
      intentKoName: '연애·궁합·인연 역학',
      confidence: 0.95,
      targetTools: ['sukuyo', 'astrology', 'ziwei'],
      routingReason: '숙요경(27숙)의 깊은 전생 인연 관계(안괴/영친)와 점성술(금성/달)의 정서적 애착 패턴, 자미두수 부처궁 융합',
      suggestedFocusPrompt: '두 사람 사이의 감정 파동과 서로에게 끌리는 본질적 이유, 관계에서 부딪히기 쉬운 숨은 심리 역학을 다정하고 명쾌하게 풀어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 5. 즉시 결단 / 양자택일 / 오늘의 승부수 / 점
  const decisionRegex = /선택|결정|어떻게\s*할까|갈까\s*말까|할까\s*말까|점|점괘|뽑아\s*줘|작괘|타로\s*한\s*장|오늘의\s*선택|승부수|결과\s*예측/;
  if (decisionRegex.test(lower)) {
    return {
      intent: 'immediate_decision',
      intentKoName: '즉시 결단·타이밍 점술',
      confidence: 0.93,
      targetTools: ['iching', 'liuren'],
      routingReason: '주역 64괘의 음양 변화 시중(時中) 이치와 대육임 점시 기준 사건 진행(초전→중전→말전) 정밀 포국',
      suggestedFocusPrompt: '주역 괘상의 핵심 조언과 육임의 사건 진행 흐름을 통해, 지금 나아가야 할 때인지 멈춰야 할 때인지 명확한 행동 지침을 제시해 줘.',
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
      routingReason: '오늘의 만세력 일진(십신·지지합충)과 실시간 하늘의 행성 트랜짓(달 위상·주요 아스펙트) 동시 동기화',
      suggestedFocusPrompt: '오늘 현재의 살아있는 일진 간지와 하늘의 행성 배치를 출생 차트와 실시간 대조하여, 오늘 지금 이 순간 가장 유리한 흐름과 주의점을 명쾌하게 짚어 줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 5-2. 10년 대운 & 세운·교운기 타이밍 / 인생의 계절 / 장기 사이클
  const lifeSeasonRegex = /대운|세운|교운기|10년\s*운|인생의\s*계절|장기\s*사이클|인생\s*타이밍|시기|대운수|환절기|언제쯤|몇\s*살\s*부터|운의\s*흐름/;
  if (lifeSeasonRegex.test(lower)) {
    return {
      intent: 'life_season_timing',
      intentKoName: '10년 대운·세운·교운기 타이밍',
      confidence: 0.96,
      targetTools: ['saju', 'ziwei', 'astrology'],
      routingReason: '10년 대운의 주기 흐름과 교운기(인생의 환절기), 올해 세운과의 복합 작용 정밀 타이밍 분석',
      suggestedFocusPrompt: '현재 몇 번째 대운의 몇 년 차를 지나고 있는지, 인생의 어떤 계절(봄/여름/가을/겨울)에 와 있는지, 교운기 진입 여부와 다가올 최적의 도약 타이밍을 입체적으로 풀어줘.',
      isMasterMobilization: false,
      isCasual: false,
    };
  }

  // 6. 신체 활력 / 수면 / 피로 / 번아웃 / 결핍 오행 & 바이오 에너지 처방
  const wellnessRegex = /피로|피곤|체력|방전|번아웃|지침|수면|잠|불면|몸|아파|스트레스|두통|결림|호흡|명상|웰니스|개운\s*법|개운|오행|결핍|바이오|주파수|솔페지오|에너지\s*처방|맞춤\s*처방/;
  if (wellnessRegex.test(lower)) {
    return {
      intent: 'vitality_wellness',
      intentKoName: '결핍 오행·바이오 에너지 맞춤 처방',
      confidence: 0.95,
      targetTools: ['saju', 'mahabote', 'thai_astrology'],
      routingReason: '사주 결핍 오행 수리 연산 × 장부·차크라 진단 × 솔페지오 주파수 및 1분 마이크로 개운 행동 3중 처방',
      suggestedFocusPrompt: '사주 4주 8자의 결핍 오행과 취약 장부·차크라를 짚어주고, 전용 솔페지오 주파수 파동과 즉각 실천 가능한 1분 마이크로 개운 행동, 럭키 컬러 및 오미 식이를 현대적 바이오웰니스 언어로 다정하게 처방해 줘.',
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
}): RoutedExecutionResult {
  const routePlan = analyzeQuestionIntent(params.text, params.isMasterRequested);

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
    forceAllTools: routePlan.isMasterMobilization,
  });

  const deterministicDataBlock = formatDeterministicEnginePrompt(engineReport);
  const toolsForBadge = routePlan.targetTools.map((id) => TOOL_KO_NAMES[id] || id);

  const promptInjection = `${deterministicDataBlock}

[🎯 스마트 에이전트 라우터(Agent Router) 전략 배정 안내]
======================================================================
- 분석된 질문 의도: **[${routePlan.intentKoName}]**
- 스마트 라우팅 도구: **${toolsForBadge.join(' + ')}**
- 라우팅 선정 사유: ${routePlan.routingReason}
- 중점 답변 가이드: ${routePlan.suggestedFocusPrompt}
======================================================================
위 선정된 도구들의 실제 계산 데이터(JSON)를 중심으로, 사용자의 질문에 가장 날카롭고 깊이 있는 맞춤형 솔루션을 100% 친근하고 다정한 반말 구어체로 작성해 줘.`;

  return {
    routePlan,
    engineReport,
    promptInjection,
    toolsForBadge,
  };
}
