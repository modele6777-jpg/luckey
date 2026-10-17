/**
 * hori.chat/prompts 13페이지 (총 77개) 플랫폼 최적화 추천질문 라이브러리 데이터셋
 * 카테고리: 인연(20), 발견(18), 운세(14), 고민(14), 성공(11) - 총 77개 / 13페이지 (페이지당 6개, 13P 5개)
 * 럭키 9대 네이티브 엔진: 사주(saju), 점성술(astrology), 타로(tarot), 소매틱(somatic), 세도나(sedona), 1원칙전략(orange), 비폭력대화(bluebird), 영적지혜(rebible), 뮤즈영감(muse)
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
    "icon": "fa-scroll",
    "color": "#f59e0b"
  },
  "astrology": {
    "key": "astrology",
    "name": "점성술",
    "icon": "fa-star",
    "color": "#3b82f6"
  },
  "tarot": {
    "key": "tarot",
    "name": "타로",
    "icon": "fa-layer-group",
    "color": "#ec4899"
  },
  "somatic": {
    "key": "somatic",
    "name": "소매틱",
    "icon": "fa-leaf",
    "color": "#10b981"
  },
  "sedona": {
    "key": "sedona",
    "name": "세도나",
    "icon": "fa-feather-pointed",
    "color": "#a855f7"
  },
  "orange": {
    "key": "orange",
    "name": "1원칙전략",
    "icon": "fa-brain",
    "color": "#f97316"
  },
  "bluebird": {
    "key": "bluebird",
    "name": "비폭력대화",
    "icon": "fa-dove",
    "color": "#06b6d4"
  },
  "rebible": {
    "key": "rebible",
    "name": "영적지혜",
    "icon": "fa-book-open",
    "color": "#eab308"
  },
  "muse": {
    "key": "muse",
    "name": "뮤즈영감",
    "icon": "fa-palette",
    "color": "#6366f1"
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
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주의 10년 대운 변화와 점성술 주요 외행성 트랜짓(목성·토성 주기)을 결합해서, 내 인생의 가장 결정적인 대전환기가 언제 찾아오는지 짚어줘. 운의 흐름이 크게 바뀌는 분기점과 그때 내가 취해야 할 지혜로운 태도를 알려줘.",
    "questionCount": 712
  },
  {
    "id": "general-personality-composite",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "사주·점성술·타로 트리니티(Trinity) 종합 성격 분석",
    "hint": "",
    "tools": [
      "saju",
      "astrology",
      "tarot"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "tarot"
    ],
    "body": "내 사주 오행과 십신, 점성술 네이탈 차트(태양·달·상승궁), 그리고 타로의 소울 카드 상징을 결합해 나의 입체적인 성격과 잠재력을 종합 분석해줘. 세 관점이 가리키는 나의 고유한 영혼의 청사진을 알려줘.",
    "questionCount": 702
  },
  {
    "id": "fortune-10year-flow",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "향후 10년 흐름과 전환점",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주 대운(10년 주기)과 점성술 목성·토성 사이클을 분석해서 향후 10년간 펼쳐질 삶의 흐름과 핵심 전환점을 짚어줘. 어느 시기에 역량을 축적하고 언제 도약해야 하는지 주기별 로드맵을 알려줘.",
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
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 10하우스(MC)와 천직 지표, 그리고 내 사주의 관성(사회적 명예)과 식상(재능 발현)을 결합해서 내가 사회에서 가장 빛나고 성공할 수 있는 분야와 커리어 방향을 짚어줘.",
    "questionCount": 444
  },
  {
    "id": "fun-love-style",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "나와 찰떡인 연애 스타일",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 5·7하우스(금성과 화성 배치)와 내 사주의 일지(배우자궁) 및 십신을 분석해서, 나에게 꼭 맞는 연애 스타일과 편안함을 느끼는 상대의 유형을 짚어줘.",
    "questionCount": 419
  },
  {
    "id": "fun-ideal-type",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "내 이상형 캐릭터 설정서",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "내 점성술 7하우스(디센던트와 금성)와 사주 일지(배우자궁)의 기운을 바탕으로 내가 끌리는 이상형을 한 편의 캐릭터 프로필(외모 분위기, 성격, 행동 양식, 반전 매력)로 재미있게 정리해줘.",
    "questionCount": 366
  },
  {
    "id": "hori-5c-032",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "그 사람과 나, 다시 엮일 인연일까",
    "hint": "",
    "tools": [
      "astrology",
      "rebible"
    ],
    "tool_ids": [
      "astrology",
      "rebible"
    ],
    "body": "점성술 시나스트리(궁합 차트)와 기적수업(ACIM)의 관계 지혜를 바탕으로, 헤어진 그 사람과 내가 다시 엮일 인연인지 봐줘. 두 사람의 에너지적 흐름과 이 관계가 서로의 영혼 성장에 어떤 배움을 주는지 통찰해줘.",
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
      "saju",
      "orange"
    ],
    "tool_ids": [
      "astrology",
      "saju",
      "orange"
    ],
    "body": "점성술 2·6·10하우스(재물·일·성취)와 사주 격국/용신을 분석하고, 1원칙 사고(First Principles)를 적용해 내가 선택할 수 있는 진로 방향과 구체적인 현실 전략을 제시해줘.",
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
      "astrology",
      "bluebird"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "bluebird"
    ],
    "body": "사주 일지(배우자궁)와 점성술 7하우스 및 달 별자리를 교차 분석해서, 결혼 생활에서 발생하기 쉬운 갈등 포인트와 이를 비폭력 대화(NVC)로 지혜롭게 조율하는 해법을 알려줘.",
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
      "astrology",
      "muse"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "muse"
    ],
    "body": "내 사주 일간의 오행과 점성술 상승궁(어센던트)·태양 별자리를 결합해, 소설이나 영화 속 주인공처럼 나를 한 명의 매력적인 인물상(성격, 외모 분위기, 삶의 철학)으로 입체감 있게 그려줘.",
    "questionCount": 291
  },
  {
    "id": "hori-5c-024",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "연락 올까, 내가 먼저 할까",
    "hint": "",
    "tools": [
      "tarot",
      "astrology"
    ],
    "tool_ids": [
      "tarot",
      "astrology"
    ],
    "body": "지금 이 순간의 에너지로 타로 3장 스프레드를 펼치고 점성술 수성·금성 트랜짓을 함께 살펴서, 그 사람에게서 연락이 올 가능성이 높은지 아니면 내가 먼저 다가가는 게 나은지 타이밍과 흐름을 조언해줘.",
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
      "astrology",
      "sedona"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "sedona"
    ],
    "body": "내 사주 월운과 현재 점성술 행성 트랜짓(달·해왕성 영향)을 분석해 최근 마음이 복잡하고 불안했던 근본 원인을 짚어주고, 세도나 메서드 릴리징 질문을 통해 불필요한 집착과 불안을 즉시 흘려보내는 법을 알려줘.",
    "questionCount": 252
  },
  {
    "id": "hori-5c-025",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "지금 우리 사이, 어디로 가고 있을까",
    "hint": "",
    "tools": [
      "tarot",
      "astrology"
    ],
    "tool_ids": [
      "tarot",
      "astrology"
    ],
    "body": "지금 이 순간의 에너지로 타로 3장 스프레드(과거-현재-미래)를 펼치고 현재 점성술 관계 트랜짓을 결합해, 요즘 방향을 잃은 듯한 우리 사이가 어디로 향하고 있는지 흐름과 해법을 짚어줘.",
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
      "astrology",
      "tarot"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "tarot"
    ],
    "body": "사주 일지 합충과 오행 조화, 점성술 7하우스 시나스트리(토성·목성 결합), 그리고 타로 카드의 조언을 결합해서 이 사람과 장기적으로 결혼까지 이어질 가능성과 준비해야 할 점을 짚어줘.",
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
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주의 재성(정재·편재) 월운 흐름과 점성술 2하우스(재물/자원) 트랜짓을 분석해서 앞으로 3개월간의 금전 흐름과 수입·지출 타이밍, 재물운을 높이는 조언을 알려줘.",
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
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주의 년·월·일·시 4기둥과 대운의 흐름, 그리고 점성술 출생 차트의 상반기/하반기 에너지 구성을 비교해서 인생 전반부와 후반부의 성향 변화와 운의 상승기를 명확히 짚어줘.",
    "questionCount": 214
  },
  {
    "id": "hori-5c-075",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "이번 달 무슨 일이 생길까",
    "hint": "",
    "tools": [
      "saju",
      "tarot"
    ],
    "tool_ids": [
      "saju",
      "tarot"
    ],
    "body": "내 사주의 이번 달 월운(月運) 간지와 타로 3장 월별 스프레드를 통합해서, 이번 달 나에게 찾아올 가장 중요한 사건과 기회, 그리고 조심해야 할 변수를 미리 짚어줘.",
    "questionCount": 210
  },
  {
    "id": "hori-5c-035",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람과 나는 어떤 인연일까",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 시나스트리(노스노드 카르마 축과 달·금성 상호작용)와 사주 일지 궁합을 분석해, 이 사람과 내가 전생과 우주적 관점에서 어떤 인연의 고리로 엮여 있는지 그 깊은 의미를 알려줘.",
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
      "saju",
      "astrology",
      "orange"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "orange"
    ],
    "body": "내 사주의 관성(조직 적합성) 및 십신 격국과 점성술 6·10하우스를 분석하고, 1원칙 분석으로 지금 회사의 조직 문화와 내 기질이 얼마나 맞는지, 장기적 성장에 유리한지 진단해줘.",
    "questionCount": 183
  },
  {
    "id": "hori-5c-038",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 사람이 나에게 어떤 존재일까",
    "hint": "",
    "tools": [
      "astrology",
      "rebible"
    ],
    "tool_ids": [
      "astrology",
      "rebible"
    ],
    "body": "점성술 출생 차트와 기적수업(ACIM)의 '거룩한 관계' 관점을 통해, 이 사람이 내 삶에 찾아온 진정한 영적 의미와 내 내면의 투사를 거두고 배울 수 있는 지혜를 알려줘.",
    "questionCount": 177
  },
  {
    "id": "fortune-jami-year-keyword",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "올해 핵심 키워드 & 월별 주의점",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주의 신년 세운(歲運) 십신과 점성술 올해 주요 외행성 트랜짓을 종합해, 올해를 관통하는 핵심 키워드 3가지와 가장 유의해야 할 월별 타이밍을 짚어줘.",
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
      "saju",
      "astrology",
      "bluebird"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "bluebird"
    ],
    "body": "사주의 비겁(동료)·인성(가족) 궁위와 점성술 3·4·11하우스를 분석해 가족, 친구, 직장 동료와의 관계의 결을 짚어주고, 관계 스트레스를 줄이는 소통법을 알려줘.",
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
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주 원국과 올해 세운에 비추어 12개월 월운(月運)의 오행 합충과 점성술 행성 트랜짓을 대조해, 올해 나에게 가장 기회가 넘치는 최고의 달과 매사 조심해야 할 달을 짚어줘.",
    "questionCount": 149
  },
  {
    "id": "hori-5c-016",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나에게 흐르는 가장 강한 기운",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주의 오행 득령·득지 세력과 최강 십신, 그리고 점성술 네이탈 차트의 우세 원소(불·흙·공기·물)를 분석해 내 안에서 가장 지배적으로 작동하는 강한 기운과 이를 생산적으로 쓰는 법을 알려줘.",
    "questionCount": 139
  },
  {
    "id": "hori-5c-076",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "자세한 올해 운세, 솔라리턴과 사주 세운으로",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "점성술 1년 운세인 솔라리턴(Solar Return) 차트와 사주 신년 세운(歲運)을 정밀하게 결합해 올해 나에게 찾아올 주요 기회와 도전, 테마를 종합적으로 분석해줘.",
    "questionCount": 129
  },
  {
    "id": "hori-5c-018",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "사주 일주와 오행으로 보는 타고난 기질",
    "hint": "",
    "tools": [
      "saju",
      "somatic"
    ],
    "tool_ids": [
      "saju",
      "somatic"
    ],
    "body": "내 사주 일주(60간지 고유 에너지)와 오행의 편중 상태를 분석하고, 신체 신경계(소매틱) 관점에서 내가 스트레스를 받을 때 몸과 마음이 어떤 패턴으로 반응하는지 입체적으로 풀어줘.",
    "questionCount": 120
  },
  {
    "id": "general-jami-strong-weak",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "내 인생을 이끄는 핵심 하우스 & 십신 TOP 3",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "내 점성술 차트에서 행성들이 가장 집중된 강력한 12하우스 TOP 3와 사주에서 가장 발달한 십신을 뽑아서, 내 삶을 견인하는 핵심 엔진과 주의가 필요한 취약점을 알려줘.",
    "questionCount": 118
  },
  {
    "id": "hori-5c-047",
    "category": "success",
    "categoryLabel": "성공",
    "title": "돈과 사람이 모이는 방식",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "사주의 식상생재(재능이 돈이 되는 통로)와 관인상생 흐름, 그리고 점성술 2하우스(재물)와 11하우스(네트워크)를 분석해 나에게 돈과 귀인이 어떤 방식으로 모여드는지 알려줘.",
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
      "saju",
      "bluebird"
    ],
    "tool_ids": [
      "saju",
      "bluebird"
    ],
    "body": "사주 비견·겁재와 지지 형충파해를 분석해 내가 인간관계에서 반복해서 겪는 갈등의 원인을 파악하고, 비폭력 대화(NVC)를 활용해 관계의 상처를 지혜롭게 회복하는 법을 알려줘.",
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
      "saju",
      "orange"
    ],
    "tool_ids": [
      "astrology",
      "saju",
      "orange"
    ],
    "body": "점성술 올해 주요 트랜짓(목성·토성 위치)과 사주 세운을 대조해 올해 내가 가장 공을 들여야 할 핵심 분야를 정하고, 1원칙 전략으로 한 해의 성과를 극대화하는 실행 계획을 알려줘.",
    "questionCount": 115
  },
  {
    "id": "hori-5c-074",
    "category": "fortune",
    "categoryLabel": "운세",
    "title": "이번 주 나에게 흐르는 기운",
    "hint": "",
    "tools": [
      "tarot",
      "saju"
    ],
    "tool_ids": [
      "tarot",
      "saju"
    ],
    "body": "타로 오라클 카드와 내 사주의 이번 주 일진(日辰) 오행 흐름을 결합해서, 이번 주 나에게 흐르는 기운과 가장 운이 트이는 요일, 피해야 할 행동을 짚어줘.",
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
      "orange"
    ],
    "tool_ids": [
      "saju",
      "orange"
    ],
    "body": "사주의 편재·상관(사업적 수완과 리스크 성향)과 1원칙 인지 전략을 통해 내 기질이 사업이나 적극적 투자에 맞는지 진단하고, 리스크를 통제하는 현실적인 성공 방안을 알려줘.",
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
      "orange",
      "tarot"
    ],
    "tool_ids": [
      "orange",
      "tarot"
    ],
    "body": "1원칙 인지적 거리두기(사실과 두려움 분리)와 타로 결단 카드를 결합해서, 내가 오래 끌어온 이 고민이 실은 이미 마음속에 답이 정해져 있는지 비추어보고 결단을 내릴 수 있게 도와줘.",
    "questionCount": 110
  },
  {
    "id": "hori-5c-029",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "식은 마음, 다시 살아날 수 있을까",
    "hint": "",
    "tools": [
      "tarot",
      "bluebird"
    ],
    "tool_ids": [
      "tarot",
      "bluebird"
    ],
    "body": "타로 3장 스프레드와 비폭력 대화(NVC) 욕구 분석을 결합해, 요즘 미지근해진 이 관계가 다시 살아날 여지가 있는지 짚어주고, 지금 내가 붙잡아야 할지 아니면 마음을 놓아야 할지 진솔한 조언을 줘.",
    "questionCount": 109
  },
  {
    "id": "hori-5c-037",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 친구와 오래 갈 수 있을까",
    "hint": "",
    "tools": [
      "saju",
      "astrology",
      "bluebird"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "bluebird"
    ],
    "body": "내 사주의 비겁(친구/인연) 기운과 점성술 11하우스(우정·동료) 지표를 바탕으로 이 친구와 나의 기운이 오래 이어질 인연인지, 서로의 다름을 존중하며 관계를 돈독히 지키는 비결을 알려줘.",
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
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "동양의 사주명리학과 서양의 점성술 두 가지 관점을 결합해 내 성격과 기질을 입체적으로 분석해줘. 두 관점에서 겹치는 본질적인 특성과 서로 다르게 보이는 면을 구분해 종합적인 나를 정리해줘.",
    "questionCount": 103
  },
  {
    "id": "hori-5c-036",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "나랑 잘 맞는 사람은 어떤 유형",
    "hint": "",
    "tools": [
      "astrology",
      "saju"
    ],
    "tool_ids": [
      "astrology",
      "saju"
    ],
    "body": "내 점성술 7하우스(디센던트, 금성)와 사주 일지(배우자궁) 및 용신을 분석해, 나와 에너지가 가장 편안하게 맞는 사람과 서로 배려가 필요한 유형을 명확히 정리해줘.",
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
      "tarot",
      "sedona"
    ],
    "tool_ids": [
      "tarot",
      "sedona"
    ],
    "body": "타로 3장 스프레드와 세도나 메서드(Sedona Method)의 놓아버림 지혜를 결합해서, 만약 이 관계를 다시 시작한다면 과거의 어떤 집착과 통제 욕구를 내려놓아야 하는지, 똑같은 실수를 반복하지 않는 법을 알려줘.",
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
      "sedona",
      "somatic"
    ],
    "tool_ids": [
      "saju",
      "sedona",
      "somatic"
    ],
    "body": "사주 일간과 취약한 오행을 살피고, 세도나 메서드와 소매틱(신체 감각) 관점에서 내가 반복해서 빠지는 감정 패턴(완벽주의, 자책, 회피 등)의 뿌리를 찾아 바로 흘려보낼 수 있는 실전 대처법을 알려줘.",
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
      "astrology",
      "orange"
    ],
    "tool_ids": [
      "astrology",
      "orange"
    ],
    "body": "점성술 6·10하우스와 토성 배치로 사회 환경에서 받는 스트레스의 원인과 패턴을 짚어주고, 1원칙 인지적 거리두기(Fly-on-the-wall 관점)로 마음의 평정을 되찾는 팁을 알려줘.",
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
      "saju",
      "muse"
    ],
    "tool_ids": [
      "astrology",
      "saju",
      "muse"
    ],
    "body": "점성술 5하우스(창의성·재능)와 출생 차트, 그리고 사주의 식상(표현력)과 인성(학습 역량)을 결합해서 우리 아이가 타고난 고유한 잠재력과 강점을 짚어주고, 부모로서 어떻게 지지해주면 좋을지 조언해줘.",
    "questionCount": 84
  },
  {
    "id": "worry-health-stress",
    "category": "worry",
    "categoryLabel": "고민",
    "title": "건강과 스트레스 패턴 진단",
    "hint": "",
    "tools": [
      "saju",
      "somatic"
    ],
    "tool_ids": [
      "saju",
      "somatic"
    ],
    "body": "내 사주 오행의 과다·고립 상태와 소매틱(Somatic) 신경계 관점을 결합해 신체 건강 취약 부위와 만성 스트레스 패턴을 진단하고, 매일 1분 실천할 수 있는 신경계 안정 리셋 루틴을 알려줘.",
    "questionCount": 84
  },
  {
    "id": "hori-5c-049",
    "category": "success",
    "categoryLabel": "성공",
    "title": "내가 일할 때 빛나는 순간",
    "hint": "",
    "tools": [
      "saju",
      "orange"
    ],
    "tool_ids": [
      "saju",
      "orange"
    ],
    "body": "사주의 격국과 용신, 그리고 1원칙 커리어 분석을 통해 내가 조직이나 일터에서 어떤 방식으로 일할 때 최고의 성과와 빛을 발하는지, 나만의 독보적인 업무 강점과 최적의 역할을 알려줘.",
    "questionCount": 83
  },
  {
    "id": "hori-5c-048",
    "category": "success",
    "categoryLabel": "성공",
    "title": "이 면접/지원 결과 가능성",
    "hint": "",
    "tools": [
      "tarot",
      "saju"
    ],
    "tool_ids": [
      "tarot",
      "saju"
    ],
    "body": "타로 3장 스프레드와 내 사주의 이달 관운(시험·합격운)을 함께 분석해, 내가 기다리는 합격이나 면접 결과 소식의 긍정적 흐름과 윤곽이 드러날 시기를 짚어주고 막판에 챙겨야 할 실전 조언을 줘.",
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
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주와 상대방의 별자리 시나스트리를 함께 이용해서 지금 마음이 가는 상대와 나의 성향적 결이 얼마나 맞는지 봐줘. 두 사람 사이의 에너지 시너지와 현명하게 가까워지는 소통법을 정리해줘.",
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
    "title": "사주·점성술·타로 세 관점 핵심 키워드 비교",
    "hint": "",
    "tools": [
      "saju",
      "astrology",
      "tarot"
    ],
    "tool_ids": [
      "saju",
      "astrology",
      "tarot"
    ],
    "body": "사주, 점성술, 타로 오라클 세 관점에서 나를 설명하는 핵심 키워드를 각각 3개씩 뽑아 비교 표로 정리하고, 세 렌즈가 비추는 공통점과 차이점을 한 줄로 요약해줘.",
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
      "saju",
      "orange"
    ],
    "tool_ids": [
      "saju",
      "orange"
    ],
    "body": "내 사주 대운·세운의 십신 흐름과 1원칙 전략 분석을 결합해, 올해 내가 적극적으로 공격적인 확장을 해야 할 때인지 아니면 내실을 다지며 때를 기다려야 할 때인지 명확한 기준과 행동 지침을 알려줘.",
    "questionCount": 67
  },
  {
    "id": "fun-rpg-character",
    "category": "discovery",
    "categoryLabel": "발견",
    "title": "나는 어떤 RPG 캐릭터?",
    "hint": "",
    "tools": [
      "saju",
      "astrology"
    ],
    "tool_ids": [
      "saju",
      "astrology"
    ],
    "body": "내 사주 오행(목화토금수)과 점성술 태양·상승궁 조합을 바탕으로 나를 RPG 게임 캐릭터로 만들어줘. 직업, 6대 스탯(근력·민첩·지능 등 100점 만점), 고유 스킬 2개와 패시브 능력을 게임 캐릭터 설명서처럼 재치 있게 써줘.",
    "questionCount": 66
  },
  {
    "id": "hori-5c-031",
    "category": "relationship",
    "categoryLabel": "인연",
    "title": "이 이별이 나에게 남긴 과제",
    "hint": "",
    "tools": [
      "rebible",
      "sedona"
    ],
    "tool_ids": [
      "rebible",
      "sedona"
    ],
    "body": "기적수업(ACIM)의 용서 지혜와 세도나 메서드를 통해, 이 가슴 아픈 이별이 내 안에 어떤 영적 배움과 내면 과제를 남겼는지 비추어줘. 재회를 바라거나 자책하기 전에 내가 온전히 마주하고 놓아주어야 할 감정을 알려줘.",
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
      "tarot",
      "astrology"
    ],
    "tool_ids": [
      "tarot",
      "astrology"
    ],
    "body": "지금 이 순간의 기운으로 타로 3장 스프레드를 펼치고 점성술 금성·화성 배치를 살펴, 마음에 품은 고백을 지금 전하는 게 맞을지 조금 더 기다려 타이밍을 보는 게 나을지, 상대의 마음 흐름과 함께 짚어줘.",
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
      "orange",
      "tarot"
    ],
    "tool_ids": [
      "orange",
      "tarot"
    ],
    "body": "1원칙 현실 분석(Orange)과 타로 결단 오라클을 결합해, 내가 지금 밀어붙이려는 이 선택이 자연스러운 흐름을 타고 있는지 아니면 조급함에 의한 무리수인지 짚어주고, 지금 추진할지 완급을 조절할지 판단 기준을 제시해줘.",
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
export const TOTAL_PAGES = 13;

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
