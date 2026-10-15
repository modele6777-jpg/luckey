/**
 * 대화의 맥락과 페르소나, 사용자의 WHY/핵심 가치관에 맞춘 지능형 추천 질문 생성기
 */

import type { PersonaType, UnifiedMessage } from '@/contexts/AppContext';

export interface SuggestionContext {
  persona: PersonaType;
  messages: UnifiedMessage[];
  aiSuggestions?: string[];
  fallbackPrompts?: string[];
  activeRoute?: string;
  worry?: string;
  mbti?: string;
  sajuDigest?: string;
}

// Fisher-Yates array shuffling utility
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// WHY 리포트 & 감정 리포트 기반의 고요한 성찰 & 에너지 보호 키워드 템플릿
const CORE_WHY_CONTEXTUAL_PROMPTS: Record<PersonaType, string[]> = {
  lucy: [
    "지금 내 마음의 에너지를 갉아먹는 생각을 어떻게 흘려보낼까?",
    "오늘 나에게 가장 필요한 영혼의 쉼과 위로는 뭘까?",
    "방금 말한 그 흐름 속에서 내가 붙잡고 있는 집착은?",
    "내 직관과 잠재의식이 건네는 진짜 메시지는 뭘까?",
    "과도한 생각의 굴레에서 벗어나 편안해지는 법",
    "오늘의 나를 있는 그대로 다정하게 인정해주는 말",
    "내 영혼이 진정으로 갈망하는 성장 방향은 무엇일까?",
    "우주가 나를 위해 예비해 둔 다음 문은 무엇일까?",
    "삶의 불확실성을 담담히 수용하는 지혜",
    "나만의 고유한 진동수를 높이는 데일리 루틴"
  ],
  orange: [
    "방금 떠오른 이 감정을 자책 없이 온전히 안아주려면?",
    "내 안의 작은 아이(우니히피리)가 지금 원하는 건 뭘까?",
    "불안을 억누르지 않고 안전하게 달래는 연습",
    "마음의 에너지를 소모하지 않고 평온을 유지하는 팁",
    "오늘 나 스스로에게 건네고 싶은 따뜻한 한 문장",
    "복잡한 감정의 파도를 고요한 호수로 바꾸는 법",
    "상처받은 마음에 새 살이 돋아나는 위로의 문장",
    "완벽하지 않아도 온전히 사랑받을 자격이 있을까?",
    "지나간 일에 대한 후회를 털어내는 따뜻한 시선",
    "오늘 끌어당김의 법칙으로 우주에 전달할 긍정 확언"
  ],
  trinity: [
    "방금 나온 카드의 상징이 내 현실에 주는 깊은 조언은?",
    "이 운의 흐름에서 내가 주의해야 할 에너지 소모는?",
    "조급해하지 않고 순리대로 풀어나가는 지혜는?",
    "내 무의식이 가리키는 다음 단계의 방향성",
    "지금 상황에서 내 직관을 믿고 나아가는 법",
    "불확실성을 두려워하지 않고 평온을 지키는 비결",
    "타고난 사주 오행 중 부족한 기운을 채우는 개운법",
    "앞으로 겪을 큰 변화와 이에 대처하는 현명한 자세",
    "오늘 나에게 행운을 가져다줄 색상과 숫자",
    "인생의 터닝포인트에서 마주할 징조들"
  ],
  aura: [
    "지금 내 몸이 보내는 피로 신호와 즉각적인 웰니스 처방",
    "머리에 몰린 열을 발끝으로 내리는 1분 그라운딩",
    "신경계를 편안하게 진정시키는 부드러운 호흡법",
    "에너지가 방전되었을 때 안전하게 충전하는 법",
    "내 몸의 긴장을 풀고 깊은 이완으로 들어가는 루틴",
    "오늘 나를 지켜주는 따뜻한 수분과 차 처방",
    "가슴 차크라(아나하타)를 부드럽게 열어주는 호흡법",
    "잠들기 전 5분 동안 온몸을 이완하는 바디스캔 가이드",
    "스트레스로 소화가 안 될 때 손쉽게 자극하는 혈자리",
    "7대 차크라 에너지의 균형 상태를 진단해줘"
  ],
  bluebird: [
    "방금 느낀 무거운 기운을 맑게 씻어내는 정화 심상화",
    "호오포노포노 4개 단어를 마음속으로 울리는 방법",
    "지친 영혼에 촉촉한 생명력을 불어넣는 시와 음악",
    "과거의 기억과 묵은 상처를 가볍게 떠나보내기",
    "평온한 파도 소리처럼 내면을 채우는 주파수",
    "내면의 순수한 빛을 되찾아주는 영적 위로",
    "영혼의 안식을 주는 푸른 파랑새의 깃털 메시지",
    "슬픔이 밀려올 때 영혼을 맑게 씻어줄 음악 주파수",
    "나를 한 편의 서정시로 표현한다면 어떤 문장일까?",
    "영혼을 투명하게 씻어내는 432Hz 힐링 주파수"
  ],
  muse: [
    "마음의 부담을 덜고 자연스럽게 떠오르는 영감 잡기",
    "완벽주의를 내려놓고 편안하게 시작하는 창작 루틴",
    "내 안의 고유한 직관과 영혼의 목소리를 표현하는 법",
    "창작 과정에서 에너지를 소진하지 않는 지혜",
    "새로운 시야를 열어주는 신선하고 자유로운 영감",
    "오늘의 소소한 일상을 특별한 예술적 시선으로 바라보기",
    "막혀있는 작업의 돌파구를 찾는 무작위 발상 기법",
    "내 안의 예술적 열정에 불을 지피는 강렬한 동기부여",
    "창작 슬럼프를 기분 좋은 휴식과 도약의 기회로 바꾸기",
    "아이디어가 완전히 고갈됐을 때 뇌를 깨우는 처방"
  ]
};

// 라우트(현재 페이지) 맥락 기반의 보너스 추천 질문
const ROUTE_CONTEXT_PROMPTS: Record<string, string[]> = {
  "/orange": [
    "오늘 내 감정 일기에 담긴 마음의 온도는 어떨까?",
    "소원을 현실로 끌어당기는 68초 시각화 팁",
    "내면아이에게 오늘 밤 건네고 싶은 다정한 위로",
    "방하착(放下着)으로 집착을 훌훌 털어내는 지혜"
  ],
  "/trinity": [
    "오늘 내 사주 오행 중 가장 활성화된 기운은?",
    "오늘 타로 카드가 경고하는 주의할 상황은?",
    "내 별자리와 천궁도가 전하는 오늘의 타이밍",
    "재물과 인연의 흐름을 긍정적으로 여는 조언"
  ],
  "/heal": [
    "지금 내 몸의 피로도에 맞는 1분 맞춤 스트레칭",
    "자율신경계를 안정시키는 4-7-8 정화 호흡법",
    "온몸의 활력을 채우는 528Hz 주파수 웰니스 처방",
    "숙면을 위한 아우라 바디스캔 명상 가이드"
  ],
  "/bluebird": [
    "지금 내 마음에 꼭 필요한 한 줄의 치유 시(詩)",
    "비밀 쪽지에 담긴 무의식 짐을 정화하는 법",
    "호오포노포노 4가지 주문의 깊은 울림 실천법",
    "마음을 맑게 정화하는 432Hz 사운드스케이프"
  ],
  "/muse": [
    "오늘 나의 잠재된 창의성을 깨우는 수수께끼 질문",
    "완벽주의를 버리고 가볍게 시작하는 창작 루틴",
    "막힌 아이디어를 뚫어주는 아방가르드 발상법",
    "내 영혼의 고유한 개성을 작품에 담아내는 법"
  ]
};

/**
 * 최근 대화 내용에서 핵심 키워드/주제를 추출하여 후속 심층 질문을 동적으로 합성
 */
function extractContextualFollowups(persona: PersonaType, messages: UnifiedMessage[]): string[] {
  if (!messages || messages.length === 0) return [];

  // 최근 유저 및 어시스턴트 메시지 수집 (최근 5턴)
  const recentMessages = messages.slice(-5);
  const combinedText = recentMessages
    .map(m => (typeof m.content === 'string' ? m.content : ''))
    .join(' ')
    .toLowerCase();

  const results: string[] = [];

  // 1. 감정/불안/스트레스/두려움 맥락
  if (
    combinedText.includes('불안') || combinedText.includes('걱정') || combinedText.includes('두려') ||
    combinedText.includes('초조') || combinedText.includes('긴장') || combinedText.includes('압박')
  ) {
    results.push(
      "그 불안감이 올라올 때 몸과 마음을 즉시 가라앉히는 법은?",
      "이 걱정 뒤에 숨겨진 내 진짜 욕구는 뭘까?",
      "불안한 미래 대신 지금 여기에 뿌리내리는 그라운딩 호흡",
      "마음속 두려움을 따뜻하게 인정하고 안아주는 법"
    );
  }

  // 2. 피로/지침/번아웃/쉼/무기력 맥락
  if (
    combinedText.includes('피곤') || combinedText.includes('지쳤') || combinedText.includes('힘들') ||
    combinedText.includes('쉬고') || combinedText.includes('무기력') || combinedText.includes('방전') ||
    combinedText.includes('탈진') || combinedText.includes('버겁')
  ) {
    results.push(
      "지금 나에게 가장 죄책감 없는 온전한 휴식은 뭘까?",
      "에너지를 더 이상 낭비하지 않고 방어하는 방법",
      "마음의 짐을 잠시 내려놓고 깊이 이완하는 법",
      "몸과 마음에 생기를 불어넣는 긴급 에너지 회복 팁"
    );
  }

  // 3. 관계/사람/소통/상처/이별 맥락
  if (
    combinedText.includes('사람') || combinedText.includes('친구') || combinedText.includes('가족') ||
    combinedText.includes('관계') || combinedText.includes('대화') || combinedText.includes('상처') ||
    combinedText.includes('서운') || combinedText.includes('이별') || combinedText.includes('연인') ||
    combinedText.includes('갈등') || combinedText.includes('눈치')
  ) {
    results.push(
      "상대방의 감정에 휘둘리지 않고 내 중심을 지키려면?",
      "상처받은 마음에 건강한 심리적 경계선을 세우는 법",
      "억눌린 내 마음을 부드럽고 솔직하게 표현하는 지혜",
      "인연의 집착을 내려놓고 마음의 평화를 찾는 법"
    );
  }

  // 4. 결정/선택/진로/방향성/돈/재물 맥락
  if (
    combinedText.includes('선택') || combinedText.includes('결정') || combinedText.includes('고민') ||
    combinedText.includes('방향') || combinedText.includes('어떻게') || combinedText.includes('이직') ||
    combinedText.includes('퇴사') || combinedText.includes('돈') || combinedText.includes('재물') ||
    combinedText.includes('취업') || combinedText.includes('시험')
  ) {
    results.push(
      "머리로 계산하지 않고 내 직관이 가리키는 답은 뭘까?",
      "후회 없는 결정을 위해 지금 확인해야 할 한 가지",
      "조급한 마음을 내려놓고 타이밍을 기다리는 법",
      "풍요와 기회의 문을 여는 긍정적 마음가짐"
    );
  }

  // 5. 타로/운세/오라클/사주 맥락
  if (
    combinedText.includes('타로') || combinedText.includes('카드') || combinedText.includes('운세') ||
    combinedText.includes('기운') || combinedText.includes('오라클') || combinedText.includes('사주') ||
    combinedText.includes('별자리') || combinedText.includes('운명')
  ) {
    results.push(
      "방금 나온 메시지를 내 일상에서 구체적으로 실천하는 법",
      "이 기운을 긍정적으로 전환하기 위해 내가 취할 태도",
      "카드가 경고하는 위험을 지혜롭게 피해가는 법",
      "앞으로 다가올 기회의 흐름을 가장 잘 타는 팁"
    );
  }

  // 6. 호오포노포노/정화/내면아이/용서 맥락
  if (
    combinedText.includes('정화') || combinedText.includes('호오포노포노') || combinedText.includes('내면아이') ||
    combinedText.includes('우니히피리') || combinedText.includes('용서') || combinedText.includes('비우') ||
    combinedText.includes('방하착') || combinedText.includes('내려놓')
  ) {
    results.push(
      "정화 문구를 읊을 때 호흡과 마음가짐은 어떻게 해?",
      "내면 아이가 안심할 수 있도록 건네는 다정한 말",
      "기억의 재생을 멈추고 0의 상태(Zero Limits)로 돌아가기",
      "마음속 묵은 응어리를 시원하게 비워내는 방하착 주문"
    );
  }

  // 7. 건강/몸/수면/호흡/차크라 맥락
  if (
    combinedText.includes('잠') || combinedText.includes('수면') || combinedText.includes('통증') ||
    combinedText.includes('목') || combinedText.includes('어깨') || combinedText.includes('몸') ||
    combinedText.includes('두통') || combinedText.includes('호흡') || combinedText.includes('차크라')
  ) {
    results.push(
      "지금 당장 목과 어깨의 긴장을 풀어내는 1분 스트레칭",
      "잡념을 끊고 편안하게 숙면에 빠져드는 호흡",
      "내 몸의 생체 리듬을 부드럽게 회복하는 습관",
      "막힌 차크라 에너지를 맑게 순환시키는 방법"
    );
  }

  // 8. 창의성/영감/작업/몰입/예술 맥락
  if (
    combinedText.includes('글') || combinedText.includes('작업') || combinedText.includes('아이디어') ||
    combinedText.includes('영감') || combinedText.includes('창작') || combinedText.includes('시') ||
    combinedText.includes('음악') || combinedText.includes('슬럼프')
  ) {
    results.push(
      "막힌 생각을 뚫어주는 가벼운 마인드 브레이크",
      "완벽하려 하지 않고 가볍게 한 줄 적어보는 시작법",
      "내 영혼의 고유한 색깔을 작업에 담아내는 법",
      "창작 슬럼프를 돌파하는 기발한 영감 질문"
    );
  }

  return results;
}

/**
 * 대화의 흐름과 결에 꼭 맞는 최종 추천 질문 목록을 스마트하게 큐레이션하고 셔플합니다.
 * - 대화 맥락이 있는 경우: 맥락 추천 질문이 최우선 상위에 배치되며 그 안에서 다채롭게 셔플됩니다.
 * - 대화 시작 전/보충 시: 페르소나 및 코어 질문 풀 전체에서 신선하게 랜덤 셔플되어 매번 새로운 제안을 제공합니다.
 */
export function getContextAwarePrompts(context: SuggestionContext, count = 8): string[] {
  const { persona, messages = [], aiSuggestions = [], fallbackPrompts = [], activeRoute } = context;

  // 1순위: AI 모델이 최근 답변에서 대화 맥락에 기반해 직접 제안한 질문들
  const dynamicAiPrompts = aiSuggestions
    .filter(s => s && s.trim().length > 3)
    .map(s => s.trim());

  // 2순위: 최근 대화 내용(최근 1~5턴)에서 감지된 주제별 후속 심층 질문들
  const contextualFollowups = extractContextualFollowups(persona, messages);

  // 3순위: 현재 라우트(페이지) 기반 보너스 질문
  const routePrompts = activeRoute && ROUTE_CONTEXT_PROMPTS[activeRoute] 
    ? ROUTE_CONTEXT_PROMPTS[activeRoute] 
    : [];

  // 4순위: 페르소나 코어 WHY 질문들 + 전체 페르소나 프롬프트 풀
  const coreWhyPrompts = CORE_WHY_CONTEXTUAL_PROMPTS[persona] || CORE_WHY_CONTEXTUAL_PROMPTS.lucy;
  const basePool = [...coreWhyPrompts, ...routePrompts, ...fallbackPrompts];

  // 맥락 질문들 (AI 제안 + 문맥 감지)
  const contextualSet = new Set<string>();
  dynamicAiPrompts.forEach(p => contextualSet.add(p));
  contextualFollowups.forEach(p => contextualSet.add(p));
  const rawContextualList = Array.from(contextualSet);

  // 대화가 진행 중이고 맥락 질문이 감지된 경우
  if (messages && messages.length > 0 && rawContextualList.length > 0) {
    // 맥락 질문들을 무작위 셔플 (매번 닫고 열 때마다 맥락 질문들의 순서와 구성이 지루하지 않게 섞임)
    const shuffledContextual = shuffleArray(rawContextualList);

    // 맥락 질문에서 최대 (count - 2)개까지 우선 확보하여 전면에 배치 (대화 맥락 유지 보장)
    const primarySlots = Math.min(count, Math.max(3, shuffledContextual.length));
    const topTier = shuffledContextual.slice(0, primarySlots);

    // 남은 슬롯은 풍부한 기본/코어 질문 풀을 셔플하여 채움
    const remainingNeed = count - topTier.length;
    if (remainingNeed > 0) {
      const remainingPool = shuffleArray(basePool).filter(p => !topTier.includes(p));
      const secondaryTier = remainingPool.slice(0, remainingNeed);
      return [...topTier, ...secondaryTier].slice(0, count);
    }

    return topTier.slice(0, count);
  }

  // 대화가 없거나 맥락 질문이 없는 경우 (새 대화 / 초기 상태)
  // 전체 풀(코어 WHY + 라우트 + 기본 질문 30여 개)을 골고루 섞어서 매번 완전히 새로운 8개 질문을 생성!
  const fullShuffled = shuffleArray(Array.from(new Set(basePool)));
  return fullShuffled.slice(0, count);
}

