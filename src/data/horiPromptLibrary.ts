/**
 * hori.chat/prompts 13페이지 (총 77개) 추천질문 라이브러리 데이터셋
 * 카테고리: 인연(20), 발견(18), 운세(14), 고민(14), 성공(11) - 총 77개 / 13페이지 (페이지당 6개)
 */

export interface HoriPromptItem {
  id: string;
  category: 'relationship' | 'discovery' | 'fortune' | 'worry' | 'success';
  categoryLabel: string;
  title: string;
  hint?: string;
  tools: string[];
  tool_ids: string[];
  body: string;
  questionCount: number;
}

export interface PromptCategoryMeta {
  key: string;
  name: string;
  icon: string;
  color: string;
}

export interface ToolCategoryMeta {
  key: string;
  name: string;
  icon: string;
  color: string;
}

export const PROMPT_CATEGORIES: Record<string, PromptCategoryMeta> = {
  "discovery": {
    "key": "discovery",
    "name": "발견",
    "icon": "fa-comment-dots",
    "color": "#16C1DC"
  },
  "relationship": {
    "key": "relationship",
    "name": "인연",
    "icon": "fa-heart",
    "color": "#FF6575"
  },
  "success": {
    "key": "success",
    "name": "성공",
    "icon": "fa-rocket",
    "color": "#FF9416"
  },
  "worry": {
    "key": "worry",
    "name": "고민",
    "icon": "fa-circle-question",
    "color": "#7E8CE0"
  },
  "fortune": {
    "key": "fortune",
    "name": "운세",
    "icon": "fa-clover",
    "color": "#9BCB45"
  }
};

export const TOOL_CATEGORIES: Record<string, ToolCategoryMeta> = {
  "saju": {
    "key": "saju",
    "name": "사주",
    "icon": "fa-broom",
    "color": "#f59e0b"
  },
  "astrology": {
    "key": "astrology",
    "name": "점성술",
    "icon": "fa-star",
    "color": "#3b82f6"
  },
  "jami": {
    "key": "jami",
    "name": "자미두수",
    "icon": "fa-moon",
    "color": "#8b5cf6"
  },
  "tarot": {
    "key": "tarot",
    "name": "타로",
    "icon": "fa-layer-group",
    "color": "#ec4899"
  },
  "thai": {
    "key": "thai",
    "name": "태국 점성술",
    "icon": "fa-tools",
    "color": "#f2d364"
  },
  "syukuyo": {
    "key": "syukuyo",
    "name": "숙요",
    "icon": "fa-torii-gate",
    "color": "#ef4444"
  },
  "mahabote": {
    "key": "mahabote",
    "name": "마하보테",
    "icon": "fa-tools",
    "color": "#abf264"
  },
  "liuren": {
    "key": "liuren",
    "name": "육임",
    "icon": "fa-compass",
    "color": "#0ea5e9"
  },
  "vedic": {
    "key": "vedic",
    "name": "베딕",
    "icon": "fa-om",
    "color": "#f97316"
  },
  "hongguk": {
    "key": "hongguk",
    "name": "홍국기문",
    "icon": "fa-door-closed",
    "color": "#10b981"
  },
  "kabbalistic": {
    "key": "kabbalistic",
    "name": "카발라",
    "icon": "fa-tree",
    "color": "#84cc16"
  },
  "iching": {
    "key": "iching",
    "name": "주역",
    "icon": "fa-table-cells",
    "color": "#64748b"
  },
  "tojeong": {
    "key": "tojeong",
    "name": "토정비결",
    "icon": "fa-book-open",
    "color": "#a16207"
  },
  "ninestarki": {
    "key": "ninestarki",
    "name": "구성학",
    "icon": "fa-border-all",
    "color": "#06b6d4"
  },
  "taiyi": {
    "key": "taiyi",
    "name": "태을신수",
    "icon": "fa-chess-board",
    "color": "#14b8a6"
  }
};

export const HORI_PROMPT_LIBRARY: HoriPromptItem[] = [
  {
    "id": "hori-5c-030",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "우리가 다시 만날 수 있을까",
    "hint": "",
    "tools": [
      "tarot",
      "astrology"
    ],
    "tool_ids": [
      "tarot",
      "astrology"
    ],
    "body": "지금 이 순간을 기준으로 타로 스프레드를 펼치고 점성술 현재 트랜짓을 함께 봐서, 헤어진 그 사람과 다시 이어질 여지가 있는지 봐줘. 카드의 상징과 지금 내 차트를 지나는 행성의 흐름을 통합해서, 재회의 가능성과 시기를 짚어줘.",
    "questionCount": 809
  },
  {
    "id": "fortune-life-turning-point",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "인생 대전환기는 언제?",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "사주 대운 교체기와 자미두수 대한 변화 시점을 겹쳐서 분석해줘. 과거 전환기도 검증하고, 앞으로 올 전환기의 시기·주제·준비법을 알려줘.",
    "questionCount": 712
  },
  {
    "id": "general-personality-composite",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "사주·점성술·자미두수 종합 성격 분석",
    "hint": "",
    "tools": [
      "saju",
      "astrology",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "jami"
    ],
    "body": "내 사주, 점성술, 자미두수를 종합해서 타고난 성격과 기질을 입체적으로 분석해줘. 세 체계에서 겹치는 특성과 고유한 면을 구분해서 설명하고, 나라는 사람을 한 문단으로 요약해줘.",
    "questionCount": 702
  },
  {
    "id": "fortune-10year-flow",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "향후 10년 흐름과 전환점",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 대한·소한으로 향후 10년의 흐름을 정리해줘. 각 구간의 인생 테마를 설명하고, 가장 중요한 전환점 2~3개와 준비 방법을 알려줘.",
    "questionCount": 560
  },
  {
    "id": "general-ruler-shine",
    "category": "success",
    "categoryLabel": "성공",
    "title": "내가 가장 빛나는 분야",
    "hint": "",
    "tools": [
      "astrology",
      "jami"
    ],
    "tool_ids": [
      "astrology",
      "jami"
    ],
    "body": "점성술 차트 룰러·MC 지배성과 자미두수 명궁 주성을 교차 분석해서 내가 가장 빛날 수 있는 분야를 3가지 이상 추천하고 근거를 설명해줘.",
    "questionCount": 444
  },
  {
    "id": "fun-love-style",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "나와 찰떡인 연애 스타일",
    "hint": "",
    "tools": [
      "jami",
      "astrology"
    ],
    "tool_ids": [
      "jami",
      "astrology"
    ],
    "body": "자미두수 부처궁과 점성술 금성을 함께 보고 나와 잘 맞는 연애 스타일을 알려줘. 사랑 표현 방식, 이상적 데이트, 끌리는 유형까지 정리해줘.",
    "questionCount": 419
  },
  {
    "id": "fun-ideal-type",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "내 이상형 캐릭터 설정서",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 명궁과 부처궁을 엮어 내 이상형을 캐릭터 설정서처럼 묘사해줘. 외모 분위기, 성격, 말투, 직업, 첫 만남 장면까지 써줘.",
    "questionCount": 366
  },
  {
    "id": "hori-5c-032",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "그 사람과 나, 다시 엮일 인연일까",
    "hint": "",
    "tools": [
      "kabbalistic",
      "astrology"
    ],
    "tool_ids": [
      "kabbalistic",
      "astrology"
    ],
    "body": "내 출생 차트를 카발라식 상징 체계와 연결해서, 그 사람과 나 사이에 아직 풀리지 않은 카르마적 주제가 남아 있는지 봐줘. 생명나무 위 두 사람의 에너지가 어떻게 연결되는지 상징으로 풀어서, 이 인연을 붙잡는 게 성장인지 집착인지 짚어줘.",
    "questionCount": 343
  },
  {
    "id": "fortune-month-tarot-saju",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "이번 달 타로 + 사주 월운",
    "hint": "",
    "tools": [
      "tarot",
      "saju"
    ],
    "tool_ids": [
      "tarot",
      "saju"
    ],
    "body": "이번 달 운세를 타로 3장(과거·현재·미래)과 사주 월운으로 함께 뽑아줘. 타로 메시지와 월운을 통합한 이달의 종합 가이드를 정리해줘.",
    "questionCount": 302
  },
  {
    "id": "decision-career-direction",
    "category": "success",
    "categoryLabel": "성공",
    "title": "진로 방향 결정 가이드",
    "hint": "",
    "tools": [
      "astrology",
      "jami"
    ],
    "tool_ids": [
      "astrology",
      "jami"
    ],
    "body": "점성술 10하우스와 자미두수 관록궁을 묶어 분석하고, 직업적 적성에 맞는 구체적 직업군을 3~5개 추천해줘. 진로 전환에 유리한 시기도 알려줘.",
    "questionCount": 296
  },
  {
    "id": "decision-marriage-fit",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "결혼 적합도와 갈등 포인트",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "사주 궁합과 자미두수 부처궁을 함께 보고 결혼 적합도를 분석해줘. 성격·가치관 충돌 포인트와 갈등을 줄이기 위해 노력할 부분도 짚어줘.",
    "questionCount": 294
  },
  {
    "id": "general-identity-persona",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나를 한 인물상으로 그려줘",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "사주 일주와 자미두수 명궁 주성을 엮어서 내 정체성을 한 인물상으로 그려줘. 직업, 가치관, 행동 습관, 인생 모토까지 캐릭터 소개서처럼 써줘.",
    "questionCount": 291
  },
  {
    "id": "hori-5c-024",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "연락 올까, 내가 먼저 할까",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "지금 이 순간을 기준으로 육임 명반을 뽑아서, 내가 기다리는 그 사람에게서 연락이 올 가능성과 시기를 봐줘. 내가 먼저 움직이는 게 나은지, 기다리는 게 나은지 흐름으로 짚어줘.",
    "questionCount": 285
  },
  {
    "id": "worry-complex-mind",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "요즘 마음이 복잡한 이유",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "요즘 마음이 복잡한데 사주 대운/세운과 자미두수 대한 흐름을 함께 보고 원인을 분석해줘. 이 시기가 언제까지인지, 마음을 편하게 할 조언도 알려줘.",
    "questionCount": 252
  },
  {
    "id": "hori-5c-025",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "지금 우리 사이, 어디로 가고 있을까",
    "hint": "",
    "tools": [
      "iching"
    ],
    "tool_ids": [
      "iching"
    ],
    "body": "지금 이 순간을 기준으로 주역 괘를 뽑아서, 내가 마음 쓰고 있는 이 관계가 지금 어떤 국면에 있고 앞으로 어느 방향으로 흘러갈지 봐줘. 괘의 상징을 풀어서 지금 내가 취하면 좋은 태도도 조언해줘.",
    "questionCount": 248
  },
  {
    "id": "hori-5c-034",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람과 결혼까지 갈 수 있을까",
    "hint": "",
    "tools": [
      "saju",
      "jami",
      "mahabote"
    ],
    "tool_ids": [
      "saju",
      "jami",
      "mahabote"
    ],
    "body": "사주, 자미두수, 마하보테를 함께 이용해서 지금 만나는 사람과 결혼까지 이어질 인연인지 봐줘. 세 관점에서 본 궁합과 흐름을 엮어서, 결실을 맺기 좋은 시기와 넘어야 할 고비를 짚어줘.",
    "questionCount": 244
  },
  {
    "id": "fortune-3month-money",
    "category": "success",
    "categoryLabel": "성공",
    "title": "3개월 재물 흐름 전망",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "다음 3개월의 재물 흐름을 사주 월운과 자미두수 재백궁 유년운으로 함께 봐줘. 돈이 들어오기 쉬운 달과 지출 조심할 달을 월별로 짚어줘.",
    "questionCount": 242
  },
  {
    "id": "decision-job-change-timing",
    "category": "success",
    "categoryLabel": "성공",
    "title": "이직 적정 시기 분석",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "이직을 지금 해도 될지 사주 대운·세운·월운을 모두 분석해줘. 향후 6개월 내 움직이기 좋은 달과 피해야 할 시기를 구체적으로 추천해줘.",
    "questionCount": 241
  },
  {
    "id": "general-jami-life-halves",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "인생 전반부 vs 후반부 흐름",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 명궁과 신궁을 함께 보고 인생 전반부와 후반부의 흐름 차이를 알려줘. 두 궁의 에너지가 충돌하는 시기와 대처법도 짚어줘.",
    "questionCount": 214
  },
  {
    "id": "hori-5c-075",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "이번 달 무슨 일이 생길까",
    "hint": "",
    "tools": [
      "liuren",
      "tojeong"
    ],
    "tool_ids": [
      "liuren",
      "tojeong"
    ],
    "body": "육임과 토정비결을 함께 이용해서 이번 달 나에게 어떤 일이 생길지 봐줘. 지금 이 시점의 육임 흐름과 토정비결 월별 괘를 엮어서, 이달의 핵심 흐름과 조심할 점, 기대할 만한 일을 짚어줘.",
    "questionCount": 210
  },
  {
    "id": "hori-5c-035",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람과 나는 어떤 인연일까",
    "hint": "",
    "tools": [
      "syukuyo"
    ],
    "tool_ids": [
      "syukuyo"
    ],
    "body": "숙요를 이용해서 지금 내 곁에 있는 이 사람과 나 사이가 숙요 궁합으로 어떤 관계인지 봐줘. 서로에게 끌어당기는 힘과 부딪히기 쉬운 지점을 짚고, 이 인연을 어떻게 대하면 오래갈지 조언해줘.",
    "questionCount": 207
  },
  {
    "id": "worry-repeating-challenge",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "반복되는 인생 과제의 정체",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 토성의 배치와 사주 기신을 함께 보고 인생에서 반복적으로 부딪히는 과제를 알려줘. 이 과제를 성장의 도구로 바꾸는 마인드셋도 조언해줘.",
    "questionCount": 196
  },
  {
    "id": "worry-tarot-saju-spread",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "타로 3장 + 사주로 고민 풀기",
    "hint": "",
    "tools": [
      "tarot",
      "saju"
    ],
    "tool_ids": [
      "tarot",
      "saju"
    ],
    "body": "타로 3장으로 과거·현재·미래를 뽑고, 현재 사주 대운·세운 흐름과 연결해서 타로 메시지를 통합 해석해줘.",
    "questionCount": 196
  },
  {
    "id": "hori-5c-028",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 관계가 나에게 남길 것",
    "hint": "",
    "tools": [
      "tarot"
    ],
    "tool_ids": [
      "tarot"
    ],
    "body": "타로 3장으로 이 관계의 지난 흐름, 지금의 마음, 앞으로 남게 될 의미를 뽑아줘. 각 카드의 상징을 풀어서, 내가 이 사람을 통해 무엇을 배우고 있는지와 지금 내가 놓치지 말아야 할 것을 알려줘.",
    "questionCount": 183
  },
  {
    "id": "decision-job-fit",
    "category": "success",
    "categoryLabel": "성공",
    "title": "이 직장이 나한테 맞을까?",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 관록궁의 주성·사화·살성으로 이 직장이 나에게 맞는지 판단해줘. 이상적 업무 환경과 현재 상황의 부합도를 비교하고 대안도 조언해줘.",
    "questionCount": 183
  },
  {
    "id": "hori-5c-038",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람이 나에게 어떤 존재일까",
    "hint": "",
    "tools": [
      "syukuyo"
    ],
    "tool_ids": [
      "syukuyo"
    ],
    "body": "숙요를 이용해서 지금 마음 쓰이는 그 사람이 숙요 관계에서 나에게 어떤 자리에 있는지 봐줘. 나를 성장시키는 인연인지 기대게 되는 인연인지 풀어서, 이 관계에서 내가 어떤 태도를 가지면 좋을지 조언해줘.",
    "questionCount": 177
  },
  {
    "id": "fortune-jami-year-keyword",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "자미두수 올해 키워드 & 월별 주의점",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 유년 운세로 올해 핵심 키워드 3개를 뽑고, 살성이 강하게 작용하거나 사화가 만나는 달을 콕 짚어 월별 코멘트로 정리해줘.",
    "questionCount": 170
  },
  {
    "id": "fortune-year-overview",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "올해 신년운세 5대 분야",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "올해 신년운세를 사주 세운 기준으로 총운·재물·직업·관계·건강 5분야로 풀어줘. 상반기와 하반기를 나눠 설명하고 가장 중요한 달 3개를 짚어줘.",
    "questionCount": 166
  },
  {
    "id": "worry-family-friends",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "가족·친구·동료 관계의 결",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 부모궁·형제궁·노복궁을 각각 분석해서 가족·친구·동료 관계의 특성과 긴장 포인트, 관계를 더 좋게 가꾸는 방법을 궁별로 설명해줘.",
    "questionCount": 149
  },
  {
    "id": "fortune-best-worst-month",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "올해 최고의 달 vs 조심할 달",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "사주 세운과 자미두수 유년운을 교차해서 올해 가장 좋은 달 TOP 3와 조심할 달 TOP 3를 선정해줘. 각 달의 근거와 실천 리스트도 정리해줘.",
    "questionCount": 149
  },
  {
    "id": "hori-5c-016",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나에게 흐르는 가장 강한 기운",
    "hint": "",
    "tools": [
      "hongguk"
    ],
    "tool_ids": [
      "hongguk"
    ],
    "body": "홍국기문을 이용해서 내 타고난 성격과 기질을 분석해줘. 나에게 가장 강하게 작용하는 기운이 무엇인지, 그 기운이 성격이나 삶의 방식에서 어떻게 드러나는지 설명하고, 나라는 사람을 한 문단으로 요약해줘.",
    "questionCount": 139
  },
  {
    "id": "hori-5c-076",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "자세한 올해 운세, 솔라리턴과 토정비결로",
    "hint": "",
    "tools": [
      "astrology",
      "tojeong",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "tojeong",
      "saju"
    ],
    "body": "점성술 솔라리턴, 토정비결, 사주를 함께 이용해서 올해 운세를 자세히 봐줘. 세 관점이 가리키는 올해의 큰 테마와 재물, 관계, 건강 흐름을 엮고, 특히 중요한 시기 몇 달을 콕 짚어줘.",
    "questionCount": 129
  },
  {
    "id": "hori-5c-018",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "아홉 별로 보는 나의 기질",
    "hint": "",
    "tools": [
      "ninestarki"
    ],
    "tool_ids": [
      "ninestarki"
    ],
    "body": "구성학을 이용해서 내 본명성으로 타고난 성격과 행동 방식을 분석해줘. 나에게 강하게 드러나는 기운이 무엇인지, 그 기운이 일상과 대인관계에서 어떻게 나타나는지 풀어서 나라는 사람을 한 문단으로 요약해줘.",
    "questionCount": 120
  },
  {
    "id": "general-jami-strong-weak",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "자미두수 12궁 강약 TOP 3",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 12궁 중 가장 강한 궁 3개와 약한 궁 3개를 짚어줘. 각 궁의 주성·사화·살성 근거와 실제 인생에서의 발현 예시도 설명해줘.",
    "questionCount": 118
  },
  {
    "id": "hori-5c-047",
    "category": "success",
    "categoryLabel": "성공",
    "title": "돈과 사람이 모이는 방식",
    "hint": "",
    "tools": [
      "hongguk"
    ],
    "tool_ids": [
      "hongguk"
    ],
    "body": "홍국기문을 이용해서 나의 재물운과 인간관계의 흐름을 분석해줘. 타고난 재물 운용 스타일과 돈이 모이는 방식, 그리고 사람들과의 관계에서 자주 나타나는 패턴을 함께 정리해줘.",
    "questionCount": 118
  },
  {
    "id": "general-chart-gravity",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내 인생의 무게중심은 어디?",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "점성술 차트의 행성 분포를 반구·사분면 기준으로 분석해서 내 인생의 무게중심이 어디 쏠려 있는지 알려줘. 비어 있는 영역의 보완법도 설명해줘.",
    "questionCount": 116
  },
  {
    "id": "worry-relationship-conflict",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "인간관계 갈등 패턴 분석",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주 십성 구조에서 인간관계 갈등이 잘 생기는 지점을 분석해줘. 어떤 유형과 부딪히기 쉬운지, 관계를 부드럽게 만드는 팁도 알려줘.",
    "questionCount": 116
  },
  {
    "id": "fortune-year-focus-area",
    "category": "success",
    "categoryLabel": "성공",
    "title": "올해 주력해야 할 분야",
    "hint": "",
    "tools": [
      "astrology",
      "jami"
    ],
    "tool_ids": [
      "astrology",
      "jami"
    ],
    "body": "솔라리턴 차트 강조 하우스와 자미두수 유년 명궁을 묶어 올해 주력할 분야를 짚어줘. 왜 그 분야에 에너지를 쏟아야 하는지 근거와 행동 플랜도 줘.",
    "questionCount": 115
  },
  {
    "id": "hori-5c-074",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "이번 주 나에게 흐르는 기운",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "지금 이 순간을 기준으로 육임 명반을 뽑아서, 앞으로 일주일 동안 나에게 어떤 흐름이 흐르는지 봐줘. 특히 신경 써야 할 날이나 기회가 올 만한 타이밍이 있으면 짚어줘.",
    "questionCount": 114
  },
  {
    "id": "fun-catchphrase",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내 사주 한 줄 캐치프레이즈",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주의 핵심을 기억에 남는 한 줄 캐치프레이즈와 해시태그 3개로 표현해줘. 일주·용신·십성을 근거로 왜 이 문구가 나를 잘 표현하는지 설명해줘.",
    "questionCount": 112
  },
  {
    "id": "decision-invest-business",
    "category": "success",
    "categoryLabel": "성공",
    "title": "투자·사업 적합도 분석",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "자미두수 재백궁과 사주 재성을 함께 보고 이 투자·사업이 내게 맞는지 분석해줘. 타고난 재물 운용 스타일과 현재 시기의 리스크를 짚어줘.",
    "questionCount": 111
  },
  {
    "id": "general-oheng-yongshin",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "오행 균형과 용신 보완법",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주 오행 균형과 용신·희신을 분석하고, 부족한 오행을 색상·음식·방향·습관으로 보완하는 방법을 카테고리별로 정리해줘.",
    "questionCount": 110
  },
  {
    "id": "hori-5c-063",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "이 고민, 지금 결론이 나 있을까",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "지금 이 순간을 기준으로 육임 명반을 뽑아서, 요즘 머릿속을 떠나지 않는 이 고민이 어느 방향으로 움직이고 있는지 봐줘. 이미 답이 정해진 흐름인지, 아직 바뀔 여지가 있는지 알려줘.",
    "questionCount": 110
  },
  {
    "id": "hori-5c-029",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "식은 마음, 다시 살아날 수 있을까",
    "hint": "",
    "tools": [
      "iching",
      "tarot"
    ],
    "tool_ids": [
      "iching",
      "tarot"
    ],
    "body": "지금 이 순간을 기준으로 주역 괘를 뽑고 타로 한 장을 더해서, 요즘 미지근해진 이 관계가 다시 뜨거워질 여지가 있는지 봐줘. 괘와 카드가 함께 가리키는 흐름을 통합해서, 지금 내가 붙잡아야 할지 놓아야 할지 조언해줘.",
    "questionCount": 109
  },
  {
    "id": "hori-5c-037",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 친구와 오래 갈 수 있을까",
    "hint": "",
    "tools": [
      "syukuyo"
    ],
    "tool_ids": [
      "syukuyo"
    ],
    "body": "숙요를 이용해서 이 친구와 나 사이의 숙요 관계를 봐줘. 둘 사이에 흐르는 기운이 오래 이어질 인연인지, 시간이 지나며 멀어지기 쉬운지 짚고, 관계를 지키려면 무엇을 신경 쓰면 좋을지 알려줘.",
    "questionCount": 105
  },
  {
    "id": "fortune-12month-wheel",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "타로 3장 올해 운세",
    "hint": "",
    "tools": [
      "tarot",
      "saju"
    ],
    "tool_ids": [
      "tarot",
      "saju"
    ],
    "body": "타로 3장으로 올해 상반기·하반기·핵심 조언을 펼치고, 사주 월운과 교차 분석해줘. 두 해석이 같은 방향을 가리키는 시기와 엇갈리는 시기를 구분해서 올해 핵심 흐름을 요약해줘.",
    "questionCount": 105
  },
  {
    "id": "worry-blind-spot",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내가 놓치고 있는 영역",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "점성술 12하우스 중 행성이 없는 빈 하우스를 찾고, 내가 무의식적으로 놓치고 있는 삶의 영역과 그 영역을 활성화하는 방법을 알려줘.",
    "questionCount": 103
  },
  {
    "id": "hori-5c-017",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "두 눈으로 보는 나의 성격",
    "hint": "",
    "tools": [
      "hongguk",
      "saju"
    ],
    "tool_ids": [
      "hongguk",
      "saju"
    ],
    "body": "홍국기문과 사주를 함께 이용해서 내 성격과 기질을 입체적으로 분석해줘. 두 관점에서 겹치는 특성과 서로 다르게 보이는 면을 구분해서 설명하고, 종합적으로 나를 어떤 사람이라 할 수 있는지 정리해줘.",
    "questionCount": 103
  },
  {
    "id": "hori-5c-036",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "나랑 잘 맞는 사람은 어떤 유형",
    "hint": "",
    "tools": [
      "syukuyo"
    ],
    "tool_ids": [
      "syukuyo"
    ],
    "body": "숙요를 이용해서 내 별자리 기준으로 나와 가장 잘 맞는 사람과 어긋나기 쉬운 사람의 유형을 알려줘. 어떤 결을 가진 사람에게 편안함을 느끼고, 어떤 유형과는 노력이 필요한지 정리해줘.",
    "questionCount": 103
  },
  {
    "id": "general-sipseong-structure",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "십성으로 보는 강점과 약점",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주 십성 구조로 타고난 강점과 약점을 정리해줘. 두드러진 십성 2~3개의 작용과, 서로 충돌하는 조합이 실생활에서 어떻게 나타나는지 짚어줘.",
    "questionCount": 101
  },
  {
    "id": "hori-5c-033",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "다시 시작한다면 무엇이 달라질까",
    "hint": "",
    "tools": [
      "kabbalistic",
      "tarot"
    ],
    "tool_ids": [
      "kabbalistic",
      "tarot"
    ],
    "body": "카발라 생명나무와 타로를 함께 이용해서, 만약 이 관계를 다시 시작한다면 지난번과 무엇이 달라질 수 있는지 봐줘. 내가 성장시켜야 할 세피라의 에너지와 카드가 가리키는 흐름을 통합해서, 반복하지 않으려면 무엇을 바꿔야 하는지 알려줘.",
    "questionCount": 101
  },
  {
    "id": "fortune-solar-return-theme",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "솔라리턴으로 보는 올해 테마",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "솔라리턴 차트로 올해의 큰 테마를 알려줘. 행성이 몰린 하우스, 목성의 기회 영역과 토성의 과제 영역을 구분하고, 역행 주의 시기도 정리해줘.",
    "questionCount": 98
  },
  {
    "id": "fun-life-movie",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내 인생 영화 만들어줘",
    "hint": "",
    "tools": [
      "tarot"
    ],
    "tool_ids": [
      "tarot"
    ],
    "body": "타로 3장으로 내 인생 영화를 만들어줘. 1막(시작)·2막(갈등)·3막(결말)을 해석해서 영화 제목, 장르, 명대사, 엔딩 장면, 포스터 카피를 써줘.",
    "questionCount": 90
  },
  {
    "id": "worry-emotion-pattern",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "자주 빠지는 감정 패턴의 뿌리",
    "hint": "",
    "tools": [
      "saju",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "jami"
    ],
    "body": "사주 일간과 자미두수 명궁을 보고 내가 자주 빠지는 감정 패턴(완벽주의, 감정 회피 등)의 뿌리를 분석하고, 바로 써먹을 수 있는 대처법을 알려줘.",
    "questionCount": 89
  },
  {
    "id": "fun-animal-character",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나와 어울리는 동물 캐릭터",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "점성술 태양·달·ASC를 종합해서 나와 가장 어울리는 동물 캐릭터를 정하고, 그 동물의 성격이 내 차트와 어떻게 닮았는지 재미있게 설명해줘.",
    "questionCount": 88
  },
  {
    "id": "worry-external-stress",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "밖에서 받는 스트레스 흐름",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 천이궁으로 외부 환경에서 받는 스트레스 원인과 패턴을 짚어줘. 겉으로 비치는 이미지와 내면의 간극, 편안하게 지내는 방법도 설명해줘.",
    "questionCount": 87
  },
  {
    "id": "fun-color-fashion",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "오행 맞춤 컬러·패션 추천",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주 오행 균형에 맞는 컬러 팔레트, 패션 스타일, 소재감, 추천 액세서리까지 코디 가이드처럼 정리해줘. 용신 오행에 맞는 메인 컬러도 알려줘.",
    "questionCount": 85
  },
  {
    "id": "hori-5c-039",
    "category": "success",
    "categoryLabel": "성공",
    "title": "우리 아이, 어떤 재능을 타고날까",
    "hint": "",
    "tools": [
      "astrology",
      "hongguk",
      "thai"
    ],
    "tool_ids": [
      "astrology",
      "hongguk",
      "thai"
    ],
    "body": "점성술, 홍국기문, 호라삿타이를 함께 이용해서 우리 아이가 타고난 재능과 기질을 봐줘. 세 관점에서 공통으로 드러나는 강점과 어울리는 성장 방향을 정리하고, 부모로서 어떻게 이끌면 좋을지 조언해줘.",
    "questionCount": 84
  },
  {
    "id": "worry-health-stress",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "건강과 스트레스 패턴 진단",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 질액궁의 주성·살성으로 내 건강 취약 부위와 스트레스 패턴을 짚어줘. 현재 대한·유년에서 주의할 건강 이슈와 관리 팁도 알려줘.",
    "questionCount": 84
  },
  {
    "id": "hori-5c-049",
    "category": "success",
    "categoryLabel": "성공",
    "title": "내가 일할 때 빛나는 순간",
    "hint": "",
    "tools": [
      "hongguk"
    ],
    "tool_ids": [
      "hongguk"
    ],
    "body": "홍국기문을 이용해서 나의 직업 적성과 사회생활 스타일을 분석해줘. 조직에서 어떤 방식으로 일할 때 강점이 살아나는지, 어울리는 직업 방향과 함께 사람들과 관계 맺는 특성도 짚어줘.",
    "questionCount": 83
  },
  {
    "id": "hori-5c-048",
    "category": "success",
    "categoryLabel": "성공",
    "title": "이 면접/지원 결과 가능성",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "방금 이 질문을 던진 시점으로 육임 명반을 뽑아서, 내가 기다리는 합격이나 결과 소식의 가능성과 언제쯤 윤곽이 잡힐지 봐줘. 지금 내가 더 준비하거나 챙길 부분이 있으면 조언해줘.",
    "questionCount": 80
  },
  {
    "id": "decision-moving-direction",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "이사 시기와 방향 추천",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "사주 방위론과 용신 오행 기준으로 나에게 유리한 이사 방향과 시기를 추천해줘. 피해야 할 방향이나 시기가 있다면 이유도 알려줘.",
    "questionCount": 78
  },
  {
    "id": "hori-5c-026",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람과 나, 결이 맞을까",
    "hint": "",
    "tools": [
      "saju",
      "iching"
    ],
    "tool_ids": [
      "saju",
      "iching"
    ],
    "body": "내 사주와 주역을 함께 이용해서 지금 마음이 가는 상대와 내가 얼마나 잘 맞는지 봐줘. 사주로 본 나의 연애 기질과 지금 뽑은 괘가 가리키는 두 사람 사이의 흐름을 엮어서, 이 인연을 어떻게 대하면 좋을지 정리해줘.",
    "questionCount": 77
  },
  {
    "id": "decision-solar-return-timing",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "올해 결정하기 좋은 시기",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "솔라리턴 차트로 올해 큰 결정을 내리기 좋은 시기와 피할 시기를 월 단위로 알려줘. 목성·토성·역행 기간을 고려해서 주의사항도 정리해줘.",
    "questionCount": 75
  },
  {
    "id": "general-element-modality",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "4원소·3양태로 보는 행동 패턴",
    "hint": "",
    "tools": [
      "astrology"
    ],
    "tool_ids": [
      "astrology"
    ],
    "body": "점성술의 4원소와 3양태 분포를 분석해서 내 행동 패턴과 에너지 사용법을 알려줘. 부족한 원소·양태의 맹점과 일상 보완법도 포함해줘.",
    "questionCount": 73
  },
  {
    "id": "general-keyword-compare",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "세 관점 핵심 키워드 비교",
    "hint": "",
    "tools": [
      "saju",
      "astrology",
      "jami"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "jami"
    ],
    "body": "사주, 점성술, 자미두수 세 관점에서 나를 설명하는 키워드를 각각 3개씩 뽑아 표로 정리하고, 공통점과 차이점을 비교한 뒤 한 줄로 요약해줘.",
    "questionCount": 72
  },
  {
    "id": "decision-tarot-timeline",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "타로 3장 시간순 전망",
    "hint": "",
    "tools": [
      "tarot"
    ],
    "tool_ids": [
      "tarot"
    ],
    "body": "타로 3장으로 결정 직후·중기 흐름·핵심 조언을 시간순으로 보여줘. 시간에 따른 에너지 변화의 큰 그림도 요약해줘.",
    "questionCount": 71
  },
  {
    "id": "fun-movie-recommendation",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내 사주에 맞는 영화 추천",
    "hint": "",
    "tools": [
      "saju"
    ],
    "tool_ids": [
      "saju"
    ],
    "body": "내 사주 오행과 십성에 어울리는 영화 장르, 주인공 유형, 추천작 3편을 골라줘. 각 영화가 왜 나와 맞는지, 닮은 캐릭터가 누군지도 알려줘.",
    "questionCount": 69
  },
  {
    "id": "worry-mood-swing",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "정서 기복의 원인 파악",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 달의 사인·하우스와 사주 일지를 함께 보고 정서 기복의 근본 원인을 풀어줘. 기복이 심해지는 트리거와 안정을 위한 실천법도 알려줘.",
    "questionCount": 68
  },
  {
    "id": "hori-5c-077",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "올해 나는 나아갈 때일까 다질 때일까",
    "hint": "",
    "tools": [
      "ninestarki",
      "saju"
    ],
    "tool_ids": [
      "ninestarki",
      "saju"
    ],
    "body": "구성학과 사주를 이용해서 올해 나에게 흐르는 기운과 운의 흐름을 봐줘. 본명성 흐름에서 올해가 움직이기 좋은 해인지 자리를 다지기 좋은 해인지 짚고, 유리한 방향과 조심할 시기를 알려줘.",
    "questionCount": 67
  },
  {
    "id": "fun-rpg-character",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나는 어떤 RPG 캐릭터?",
    "hint": "",
    "tools": [
      "jami"
    ],
    "tool_ids": [
      "jami"
    ],
    "body": "자미두수 주성 조합을 RPG 캐릭터로 만들어줘. 직업, 6스탯 수치(100점 만점), 고유 스킬 2개, 패시브 1개를 게임 설명서처럼 재미있게 써줘.",
    "questionCount": 66
  },
  {
    "id": "hori-5c-031",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 이별이 나에게 남긴 과제",
    "hint": "",
    "tools": [
      "kabbalistic"
    ],
    "tool_ids": [
      "kabbalistic"
    ],
    "body": "카발라 생명나무의 세피라 배치로 이 이별이 내 안에 어떤 과제를 남겼는지 봐줘. 반복되는 관계 패턴이 어느 세피라의 흐름에서 비롯되는지 풀어서, 재회를 바라기 전에 내가 먼저 마주해야 할 내면의 주제를 알려줘.",
    "questionCount": 66
  },
  {
    "id": "fun-today-mood",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "타로 한 장 오늘의 무드 보드",
    "hint": "",
    "tools": [
      "tarot"
    ],
    "tool_ids": [
      "tarot"
    ],
    "body": "타로 한 장으로 오늘의 무드 보드를 뽑아줘. 카드 상징을 묘사하고 어울리는 음악 분위기, 오늘의 컬러, 추천 음식, 한마디 조언을 정리해줘.",
    "questionCount": 66
  },
  {
    "id": "hori-5c-027",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "고백할까, 조금 더 기다릴까",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "지금 이 순간을 기준으로 육임 명반을 뽑아서, 내가 마음을 표현하려는 지금이 타이밍이 맞는지 봐줘. 지금 움직이는 게 좋은지 조금 더 기다리는 게 나은지, 그리고 상대의 마음이 지금 어느 쪽으로 기울어 있는지 흐름으로 짚어줘.",
    "questionCount": 63
  },
  {
    "id": "decision-tarot-choice",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "타로 3장 양자택일",
    "hint": "",
    "tools": [
      "tarot"
    ],
    "tool_ids": [
      "tarot"
    ],
    "body": "타로 3장으로 A안의 흐름·B안의 흐름·핵심 조언을 펼쳐줘. 각 카드 상징을 풀어주고 두 선택지의 장단점을 비교한 뒤 종합 추천을 내려줘.",
    "questionCount": 63
  },
  {
    "id": "hori-5c-062",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "오늘 이 결정 밀어붙여도 될까",
    "hint": "",
    "tools": [
      "liuren"
    ],
    "tool_ids": [
      "liuren"
    ],
    "body": "지금 이 순간을 기준으로 육임 명반을 뽑아서, 내가 지금 밀어붙이려는 이 선택이 흐름을 타고 있는지 거스르고 있는지 봐줘. 바로 움직여도 되는지, 조금 기다렸다 가는 게 나은지 결론을 내려줘.",
    "questionCount": 57
  },
  {
    "id": "decision-ab-compare",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "A안 vs B안 비교 분석",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "A안과 B안을 사주 용신과 점성술 트랜짓 관점에서 비교 분석해줘. 각 선택지가 나의 에너지와 얼마나 부합하는지 설명하고 명확한 결론을 내려줘.",
    "questionCount": 44
  }
];

export const PROMPTS_PER_PAGE = 6;
export const TOTAL_PAGES = Math.ceil(HORI_PROMPT_LIBRARY.length / PROMPTS_PER_PAGE); // 13페이지

export function filterPrompts(
  prompts: HoriPromptItem[],
  categoryFilter: string = 'all',
  toolFilter: string = 'all',
  searchQuery: string = ''
): HoriPromptItem[] {
  const query = searchQuery.trim().toLowerCase();

  return prompts.filter((item) => {
    // 1. 카테고리 필터
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    // 2. 도구 필터
    if (toolFilter !== 'all') {
      const hasTool = item.tools.includes(toolFilter) || item.tool_ids.includes(toolFilter);
      if (!hasTool) return false;
    }

    // 3. 검색어 필터
    if (query) {
      const inTitle = item.title.toLowerCase().includes(query);
      const inBody = item.body.toLowerCase().includes(query);
      const inCat = item.categoryLabel.toLowerCase().includes(query);
      const inTools = item.tools.some((t) => {
        const toolMeta = TOOL_CATEGORIES[t];
        return (toolMeta?.name || t).toLowerCase().includes(query);
      });
      if (!inTitle && !inBody && !inCat && !inTools) {
        return false;
      }
    }

    return true;
  });
}

export function paginatePrompts(
  prompts: HoriPromptItem[],
  page: number,
  pageSize: number = PROMPTS_PER_PAGE
): { items: HoriPromptItem[]; totalPages: number; currentPage: number; totalCount: number } {
  const totalCount = prompts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const items = prompts.slice(start, start + pageSize);

  return {
    items,
    totalPages,
    currentPage,
    totalCount,
  };
}
