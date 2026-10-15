import type { TarotConcernTheme, TarotSpreadRecommendation } from './utils';

export interface SpreadStructureStep {
  stepNumber: number;
  emoji: string;
  title: string;
  subtitle: string;
  instruction: string;
}

export interface SpreadThemeStructure {
  theme: TarotConcernTheme;
  spreadTitle: string;
  themeBadge: string;
  themeColor: string;
  steps: SpreadStructureStep[];
  summaryTags: [string, string, string];
  blessingTitle: string;
}

export const THEME_STRUCTURES: Record<TarotConcernTheme, (spread: TarotSpreadRecommendation, opts?: { optionA?: string; optionB?: string }) => SpreadThemeStructure> = {
  daily: (spread) => ({
    theme: 'daily',
    spreadTitle: '☀️ 오늘의 타로 — 일일 우주 계시 & 데일리 나침반',
    themeBadge: '데일리 원카드',
    themeColor: 'from-amber-400 to-yellow-500',
    steps: [
      {
        stepNumber: 1,
        emoji: '☀️',
        title: '오늘 나를 관통하는 우주적 지배 에너지 & 카드 상징',
        subtitle: '오늘 하루의 기저 흐름과 원형 상징',
        instruction: '뽑힌 카드의 도상(인물, 도구, 배경, 색채, 원소)과 정·역방향 본래 뜻을 상세히 짚으며, 오늘 하루 질문자의 운기를 지배하는 핵심 파동을 밝혀주십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🧭',
        title: '오늘 마주할 현실적 상황과 마음가짐의 나침반',
        subtitle: '현실에서의 구체적 작용과 심리 흐름',
        instruction: '이 카드의 에너지가 오늘 직장, 일상, 인간관계에서 어떤 상황으로 발현될지 생생하게 예견하고, 중심을 잡을 수 있는 내면의 태도를 제시하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '⚡',
        title: '오늘 경계해야 할 그림자와 숨은 변수',
        subtitle: '주의점과 에너지 과잉/결핍 예방',
        instruction: '카드가 경고하는 맹점이나 조급함, 오해의 소지를 짚어주고, 피해야 할 행동을 단호하고 명쾌하게 짚어주십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🌿',
        title: '오늘의 1일 1실천 개운 행동 & 행운 스위치',
        subtitle: '오늘 즉시 실행할 구체적 행동 처방',
        instruction: '오늘 즉각 실천할 수 있는 1~2가지 현실적인 행동 팁(소통 방식, 휴식법, 정리, 마음 챙김 등)을 다정하고 명확하게 처방하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '✨',
        title: '오늘 하루를 지켜줄 황금빛 축복과 확언',
        subtitle: '영혼을 지탱하는 데일리 축복',
        instruction: '오늘 하루 내내 질문자의 마음에 깃들 용기와 평온의 축복 문장을 전하며 마무리하십시오.',
      },
    ],
    summaryTags: ['오늘의 에너지', '상황 나침반', '개운 액션'],
    blessingTitle: '오늘 하루를 지켜줄 황금빛 축복',
  }),

  super_money: () => ({
    theme: 'super_money',
    spreadTitle: '💎 볼수록 돈을 끌어당기는 4대 슈퍼타로 재물자석 리포트',
    themeBadge: '슈퍼타로 재물자석',
    themeColor: 'from-amber-300 via-yellow-400 to-emerald-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '💎',
        title: '결핍의 무의식을 소멸시키는 황금빛 머니 마인드셋',
        subtitle: '1번 카드: 무의식의 부의 주파수 진단',
        instruction: '1번 카드의 도상과 상징을 통해 내담자의 무의식 속에 숨어 있던 돈에 대한 두려움이나 결핍감을 정화하고, 부를 온전히 받아들일 수 있는 심리적 토대를 해독하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🌊',
        title: '나를 향해 쏟아져 들어오는 거대한 현금 흐름 (머니 스트림)',
        subtitle: '2번 카드: 재물 운의 통로와 유입 기회',
        instruction: '2번 카드의 상징을 바탕으로 현재와 가까운 미래에 열릴 구체적인 재물 통로, 사업·투자·수익의 기회와 자금의 유입 방향을 입체적으로 풀어내십시오.',
      },
      {
        stepNumber: 3,
        emoji: '⚡',
        title: '오늘 즉시 켤 돈맥 스위치 & 슈퍼 부자 액션 (머니 트리거)',
        subtitle: '3번 카드: 당장 실천할 재물 유입 행동',
        instruction: '3번 카드의 본질적 조언에 근거하여, 돈의 흐름을 막는 장벽을 뚫고 즉각적인 부의 회전을 만들어낼 1일 1실전 부자 행동 수칙을 구체적으로 지시하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '👑',
        title: '평생 누릴 압도적 경제적 자유와 황금 창고의 최종 결실',
        subtitle: '4번 카드: 장기적 번영과 자산 성취',
        instruction: '4번 카드가 약속하는 궁극의 경제적 독립, 풍요의 수확, 그리고 지켜야 할 자산의 형태를 장기적 번영의 비전으로 완성하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '💰',
        title: '부의 주파수를 100배 깨우는 황금빛 선언과 축복',
        subtitle: '부의 마인드셋 완성 확언',
        instruction: '볼수록 돈이 불어나고 모든 재물 흐름이 내게로 흘러들어온다는 확신에 찬 황금빛 머니 확언과 축복을 건네십시오.',
      },
    ],
    summaryTags: ['머니 마인드셋', '현금 흐름', '부자 액션'],
    blessingTitle: '부의 주파수를 깨우는 황금빛 선언',
  }),

  lucky: () => ({
    theme: 'lucky',
    spreadTitle: '🍀 볼수록 운이 좋아지는 4대 럭키 대길(大吉) 개운 리포트',
    themeBadge: '볼수록 운 상승',
    themeColor: 'from-emerald-400 via-teal-300 to-amber-300',
    steps: [
      {
        stepNumber: 1,
        emoji: '🍃',
        title: '침체된 탁기 정화와 내 안에서 깨어나는 행운의 씨앗',
        subtitle: '1번 카드: 에너지 정화와 잠재 럭키 발굴',
        instruction: '1번 카드의 상징을 바탕으로 내면의 피로와 침체된 에너지를 정화하고, 이미 준비되어 있는 고유한 행운의 잠재력을 명쾌하게 규명하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🚪',
        title: '운을 기하급수적으로 불려줄 대길(大吉) 기회의 문',
        subtitle: '2번 카드: 운의 증폭과 귀인의 통로',
        instruction: '2번 카드가 가리키는 대운의 확장 통로, 찾아올 뜻밖의 행운과 기회, 귀인의 인연을 생동감 넘치게 해독하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🪄',
        title: '행운을 즉각 끌어당길 1일 1실천 럭키 개운 비법',
        subtitle: '3번 카드: 대박을 부르는 개운 행동 스위치',
        instruction: '3번 카드의 지혜에 근거하여 오늘 즉시 행운의 스위치를 켤 수 있는 명쾌한 일상 행동(색상, 말투, 장소, 소지품 등)을 제시하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🎁',
        title: '쏟아져 들어올 황금빛 결실과 기적의 선물',
        subtitle: '4번 카드: 대길 대박의 최종 결실',
        instruction: '4번 카드가 예견하는 운의 최고조 상태와 마침내 손에 쥐게 될 기적 같은 성취의 열매를 짚어주십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🌈',
        title: '온 우주가 내 편이 되는 럭키 주문과 대길 축복',
        subtitle: '행운 증폭의 영혼 축복',
        instruction: '카드를 볼수록, 하루를 살아갈수록 모든 것이 술술 풀리고 운이 상승한다는 우주의 대길 축복을 전하십시오.',
      },
    ],
    summaryTags: ['잠재 럭키', '기회의 문', '개운 비법'],
    blessingTitle: '온 우주가 내 편이 되는 럭키 주문',
  }),

  fortune_boost: () => ({
    theme: 'fortune_boost',
    spreadTitle: '🍀 볼수록 운이 좋아지는 4대 럭키 대길(大吉) 개운 리포트',
    themeBadge: '볼수록 운 상승',
    themeColor: 'from-emerald-400 via-teal-300 to-amber-300',
    steps: [
      {
        stepNumber: 1,
        emoji: '🍃',
        title: '침체된 탁기 정화와 내 안에서 깨어나는 행운의 씨앗',
        subtitle: '1번 카드: 에너지 정화와 잠재 럭키 발굴',
        instruction: '1번 카드의 상징을 바탕으로 내면의 피로와 침체된 에너지를 정화하고, 이미 준비되어 있는 고유한 행운의 잠재력을 명쾌하게 규명하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🚪',
        title: '운을 기하급수적으로 불려줄 대길(大吉) 기회의 문',
        subtitle: '2번 카드: 운의 증폭과 귀인의 통로',
        instruction: '2번 카드가 가리키는 대운의 확장 통로, 찾아올 뜻밖의 행운과 기회, 귀인의 인연을 생동감 넘치게 해독하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🪄',
        title: '행운을 즉각 끌어당길 1일 1실천 럭키 개운 비법',
        subtitle: '3번 카드: 대박을 부르는 개운 행동 스위치',
        instruction: '3번 카드의 지혜에 근거하여 오늘 즉시 행운의 스위치를 켤 수 있는 명쾌한 일상 행동(색상, 말투, 장소, 소지품 등)을 제시하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🎁',
        title: '쏟아져 들어올 황금빛 결실과 기적의 선물',
        subtitle: '4번 카드: 대길 대박의 최종 결실',
        instruction: '4번 카드가 예견하는 운의 최고조 상태와 마침내 손에 쥐게 될 기적 같은 성취의 열매를 짚어주십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🌈',
        title: '온 우주가 내 편이 되는 럭키 주문과 대길 축복',
        subtitle: '행운 증폭의 영혼 축복',
        instruction: '카드를 볼수록, 하루를 살아갈수록 모든 것이 술술 풀리고 운이 상승한다는 우주의 대길 축복을 전하십시오.',
      },
    ],
    summaryTags: ['잠재 럭키', '기회의 문', '개운 비법'],
    blessingTitle: '온 우주가 내 편이 되는 럭키 주문',
  }),

  angel: () => ({
    theme: 'angel',
    spreadTitle: '👼 천사의 날개 — 4대 수호천사 영적 성장 & 은총 리포트',
    themeBadge: '천사의 날개',
    themeColor: 'from-indigo-300 via-sky-200 to-purple-300',
    steps: [
      {
        stepNumber: 1,
        emoji: '🕊️',
        title: '영혼의 현재 주파수와 수호천사의 첫 계시',
        subtitle: '1번 카드: 영혼의 현주소와 빛의 연결',
        instruction: '1번 카드의 신성한 상징을 통해 내담자의 영혼이 지금 우주와 어떤 주파수로 공명하고 있는지 진단하고, 수호천사가 건네는 첫 전언을 해독하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🛡️',
        title: '정화해야 할 에고의 두려움과 무의식 장벽',
        subtitle: '2번 카드: 에고의 정화와 집착의 해체',
        instruction: '2번 카드가 비추는 마음의 불안, 상처, 혹은 집착의 실체를 온전히 드러내고, 천사의 빛으로 이를 녹여내는 지혜를 설명하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🧭',
        title: '수호천사가 건네는 고차원 지혜와 빛의 나침반',
        subtitle: '3번 카드: 영적 성장과 삶의 나침반',
        instruction: '3번 카드의 도상을 근거로 현 상황을 초월적 시선에서 바라보고 올바른 선택을 내릴 수 있는 영적 가이드를 전하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🌟',
        title: '영혼이 도달할 궁극의 평화와 영적 승화 (천상의 축복)',
        subtitle: '4번 카드: 신성한 안식과 은총의 결실',
        instruction: '4번 카드가 약속하는 내면의 온전한 평화, 영혼의 성숙, 그리고 삶에서 누릴 기적 같은 은총을 묘사하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🪽',
        title: '천사의 날개 아래 안식하는 사랑과 보호의 기도',
        subtitle: '수호천사의 영원한 가호',
        instruction: '당신은 언제나 사랑받고 보호받고 있다는 수호천사의 따스한 품과 같은 축복으로 마무리하십시오.',
      },
    ],
    summaryTags: ['영혼 주파수', '빛의 나침반', '천상의 은총'],
    blessingTitle: '천사의 날개 아래 전하는 안식과 은총',
  }),

  healing: () => ({
    theme: 'healing',
    spreadTitle: '🌿 내면 아이 & 영혼 치유 4대 심층 힐링 리포트',
    themeBadge: '내면아이 치유',
    themeColor: 'from-emerald-300 via-teal-200 to-rose-300',
    steps: [
      {
        stepNumber: 1,
        emoji: '💧',
        title: '지친 마음과 오랜 상처의 근원 (상처의 자각과 깊은 공감)',
        subtitle: '1번 카드: 아픔의 뿌리와 무의식의 눈물',
        instruction: '1번 카드의 상징을 마주하며, 내담자가 혼자 짊어져 온 마음의 무게와 오랜 결핍·상처의 뿌리를 온전한 자비심으로 어루만지십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🧸',
        title: '내면 아이가 들려주는 진정한 갈망과 목소리',
        subtitle: '2번 카드: 내면 아이와의 대화',
        instruction: '2번 카드를 통해 마음 깊은 곳에 웅크린 내면 아이가 진짜 원했던 인정, 사랑, 혹은 온전한 휴식의 갈망을 통역해 주십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🌿',
        title: '마음을 어루만지는 자기 자비와 셀프 힐링 마음약방',
        subtitle: '3번 카드: 온전한 치유와 회복의 처방',
        instruction: '3번 카드의 본질적 교훈에 기대어, 스스로를 채찍질하지 않고 따스하게 안아줄 수 있는 구체적인 자기 자비와 마음 치유 실천법을 처방하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🕊️',
        title: '회복된 평온과 온전한 자아의 참된 안식',
        subtitle: '4번 카드: 치유의 열매와 영혼의 평화',
        instruction: '4번 카드가 비추는 치유된 자아의 맑은 미소, 자유로워진 에너지, 그리고 삶을 다시 사랑하게 되는 회복의 상태를 밝혀주십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🌸',
        title: '나 자신을 따뜻하게 안아주는 용서와 화해의 포옹',
        subtitle: '영혼의 자비로운 축복',
        instruction: '그동안 고생 많았다고, 이제는 안심해도 된다고 자신을 온전히 수용하는 깊은 용서와 사랑의 축복을 건네십시오.',
      },
    ],
    summaryTags: ['상처의 자각', '내면아이 목소리', '셀프 힐링'],
    blessingTitle: '온전한 자아와 마주하는 사랑의 포옹',
  }),

  new_year: () => ({
    theme: 'new_year',
    spreadTitle: '🌸 신년 4계절 대운 — 봄·여름·가을·겨울 운명 휠 리포트',
    themeBadge: '신년 사계절 대운',
    themeColor: 'from-pink-400 via-amber-300 to-sky-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '🌱',
        title: '1분기(봄 / 春): 새로운 시작의 씨앗과 도약의 기회',
        subtitle: '1번 카드: 봄의 태동과 첫 출발 에너지',
        instruction: '1번 카드의 상징을 통해 연초에 싹트는 새로운 기회와 결단, 준비해야 할 계획과 도약의 발판을 해독하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '☀️',
        title: '2분기(여름 / 夏): 열정적 성장과 활동 무대의 대확장',
        subtitle: '2번 카드: 여름의 불꽃과 추진력',
        instruction: '2번 카드가 가리키는 활동의 정점, 인간관계와 커리어의 폭발적 전개, 그리고 추진해야 할 도전 과제를 명쾌히 짚으십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🌾',
        title: '3분기(가을 / 秋): 풍요로운 결실의 수확과 삶의 전환점',
        subtitle: '3번 카드: 가을의 수확과 결실',
        instruction: '3번 카드의 도상에 비추어 한 해의 노력이 맺는 실질적 결실과 보상, 그리고 다음 계절을 위한 정리 정돈을 조언하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '❄️',
        title: '4분기(겨울 / 冬): 내실 다지기와 지혜로운 완결',
        subtitle: '4번 카드: 겨울의 갈무리와 내면의 힘',
        instruction: '4번 카드를 통해 한 해를 평온하게 매듭짓고 내적 자산을 축적하는 지혜로운 안식의 비결을 제시하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '👑',
        title: '올 한 해 전체를 관통하는 핵심 대운 조언 & 나침반',
        subtitle: '5번 카드: 1년 전체를 이끄는 황금 나침반',
        instruction: '5번 카드의 지배 에너지를 바탕으로, 1년 내내 가슴에 새길 단 하나의 결정적 원칙과 대운의 축복을 선언하십시오.',
      },
    ],
    summaryTags: ['신년 봄·여름 흐름', '가을·겨울 결실', '대운 핵심 나침반'],
    blessingTitle: '올 한 해를 관통하는 황금빛 대운 축복',
  }),

  saju: () => ({
    theme: 'saju',
    spreadTitle: '🔮 사주 4주(四柱) 융합 — 년·월·일·시 명리 타로 매트릭스',
    themeBadge: '사주 4주 융합',
    themeColor: 'from-amber-400 via-yellow-500 to-purple-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '🌳',
        title: '년주(年柱 / 根): 타고난 조상 기운과 삶의 근본 뿌리',
        subtitle: '1번 카드: 선천적 바탕과 유전적 기질',
        instruction: '1번 카드의 상징을 사주 년주에 투영하여, 타고난 배경과 본질적 잠재력, 삶의 뿌리가 되는 기운을 해독하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🏛️',
        title: '월주(月柱 / 苗): 사회적 활동 무대와 직업적 성취 환경',
        subtitle: '2번 카드: 사회 활동과 직업·커리어 흐름',
        instruction: '2번 카드를 사주 월주와 결합하여, 사회에서 펼쳐질 재능의 무대와 직업적 성취, 대인관계의 환경을 분석하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '☀️',
        title: '일주(日柱 / 花): 본인의 고유한 정체성과 내면의 본질',
        subtitle: '3번 카드: 일간 본원과 마음의 중심',
        instruction: '3번 카드의 도상을 일주(나 자신)에 비추어, 지금 내가 지닌 핵심 고민의 심리적 본질과 흔들리지 않는 자아의 빛을 규명하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🍇',
        title: '시주(時柱 / 實): 미래의 운명 흐름과 최종 인생 결실',
        subtitle: '4번 카드: 미래의 결실과 노후·완성',
        instruction: '4번 카드를 시주와 맞물려, 앞으로 열릴 최종 결실과 자손·후반기 운세의 완결을 입체적으로 풀어내십시오.',
      },
      {
        stepNumber: 5,
        emoji: '☯️',
        title: '사주 오행과 타로가 빚어낸 개운 연금술 비책',
        subtitle: '명리 ✕ 타로 융합의 최종 처방',
        instruction: '부족한 오행을 채우고 과다한 기운을 다스리는 사주 맞춤 개운 비책과 영혼의 축복을 전하십시오.',
      },
    ],
    summaryTags: ['년·월주 사회성', '일주 본질', '시주 결실 처방'],
    blessingTitle: '사주 오행과 타로의 개운 연금술 축복',
  }),

  binary_choice: (_spread, opts) => {
    const optA = opts?.optionA || 'A';
    const optB = opts?.optionB || 'B';
    return {
      theme: 'binary_choice',
      spreadTitle: `⚖️ 양자택일 갈림길 비교 판정 — [${optA}] vs [${optB}]`,
      themeBadge: '양자택일 비교',
      themeColor: 'from-amber-400 to-indigo-400',
      steps: [
        {
          stepNumber: 1,
          emoji: '⚖️',
          title: '갈림길에 선 현재 상황과 에너지 상태',
          subtitle: '1번 카드: 질문자의 현실적 딜레마',
          instruction: '1번 카드의 상징을 통해 두 선택지 사이에서 갈등하는 원인과 현재 상황의 숨은 진실을 짚어내십시오.',
        },
        {
          stepNumber: 2,
          emoji: '🅰️',
          title: `[${optA}] 길을 걸어갈 때 펼쳐질 인과와 결말`,
          subtitle: `2번 카드: ${optA} 선택 시의 득과 실`,
          instruction: `2번 카드의 도상과 본래 뜻을 상세히 분석하여, ${optA}를 선택했을 때 찾아올 현실적 기회와 마주할 위험 요소를 가감 없이 밝히십시오.`,
        },
        {
          stepNumber: 3,
          emoji: '🅱️',
          title: `[${optB}] 길을 걸어갈 때 펼쳐질 인과와 결말`,
          subtitle: `3번 카드: ${optB} 선택 시의 득과 실`,
          instruction: `3번 카드의 도상과 본래 뜻을 분석하여, ${optB}를 선택했을 때 얻게 될 가치와 감수해야 할 대가를 냉철하게 분석하십시오.`,
        },
        {
          stepNumber: 4,
          emoji: '🎯',
          title: `트리니티 마스터의 결정적 최종 선택: [${optA} / ${optB}] 선언`,
          subtitle: '4번 카드: 두 선택지를 가르는 최종 조언',
          instruction: `반드시 첫 줄에 **최종 선택: [${optA}]** 또는 **최종 선택: [${optB}]**를 명확히 선언하고, 왜 이쪽을 골라야만 하는지 카드의 근거로 단호하게 판정하십시오.`,
        },
        {
          stepNumber: 5,
          emoji: '🛤️',
          title: '선택 후 후회 없이 밀고 나갈 결단의 행동 수칙',
          subtitle: '선택을 현실로 만드는 행동 처방',
          instruction: '선택한 길에서 최고의 결실을 거두기 위한 행동 지침과 마음가짐을 축복과 함께 전하십시오.',
        },
      ],
      summaryTags: ['현재 딜레마', '최종 선택 판정', '결단 행동 수칙'],
      blessingTitle: '새로운 길을 향한 확신의 축복',
    };
  },

  yes_no: () => ({
    theme: 'yes_no',
    spreadTitle: '🎯 예·아니오 결단 게이트 — 명쾌한 YES/NO 판정과 리스크 진단',
    themeBadge: 'YES/NO 판정',
    themeColor: 'from-amber-400 via-rose-400 to-emerald-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '⚡',
        title: '질문을 둘러싼 현재 상황과 기저 에너지',
        subtitle: '1번 카드: 현실의 토대와 흐름',
        instruction: '1번 카드의 상징을 근거로 질문이 발생한 배경과 지금 이 질문을 둘러싼 우주의 흐름을 진단하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🔍',
        title: '판정을 뒤흔들 수 있는 숨은 변수와 리스크',
        subtitle: '2번 카드: 보이지 않는 복병과 주의점',
        instruction: '2번 카드의 상징을 통해 내담자가 미처 보지 못한 변수, 방심하기 쉬운 맹점, 혹은 주의해야 할 사람이나 조건을 날카롭게 짚어주십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🎯',
        title: '트리니티 마스터의 최종 판정: [YES / NO / 조건부 YES]',
        subtitle: '3번 카드: 명쾌하고 단호한 결정',
        instruction: '반드시 첫 줄에 **최종 판정: [YES]** 또는 **최종 판정: [NO]** (또는 **최종 판정: [조건부 YES]**)를 대괄호 안에 굵게 선언하고, 카드의 뜻을 근거로 그 이유를 들려주십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🚀',
        title: '판정 결과에 따른 즉시 실행 지침과 전략',
        subtitle: '결정에 맞춘 실전 행동 수칙',
        instruction: 'YES일 경우 속도를 낼 전략을, NO일 경우 멈추고 보완할 대안을 구체적이고 현실적인 행동으로 지시하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🧭',
        title: '어떤 결과 앞에서도 흔들리지 않는 내면의 확언',
        subtitle: '운명의 주인이 되는 축복',
        instruction: '결과가 무엇이든 질문자의 지혜와 의지가 최고의 길을 만들어낼 것이라는 확신을 건네며 축복하십시오.',
      },
    ],
    summaryTags: ['현재 에너지', '최종 판정 (YES/NO)', '실행 지침'],
    blessingTitle: '흔들리지 않는 결단을 위한 축복',
  }),

  love: () => ({
    theme: 'love',
    spreadTitle: '💖 관계의 거울 — 속마음·현실·장애물 5단 심층 리딩',
    themeBadge: '연애·관계 거울',
    themeColor: 'from-rose-400 via-pink-400 to-purple-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '🪞',
        title: '관계의 거울에 비친 나의 속마음과 무의식적 갈망',
        subtitle: '1번 카드: 내 가슴속 진짜 감정',
        instruction: '1번 카드의 도상을 통해 겉으로 드러난 말 뒤에 숨겨진 내담자의 진정한 마음과 애착의 패턴을 솔직하게 짚어내십시오.',
      },
      {
        stepNumber: 2,
        emoji: '💭',
        title: '상대방의 깊은 속마음과 나를 바라보는 시선',
        subtitle: '2번 카드: 상대방의 감정과 심리 상태',
        instruction: '2번 카드의 상징과 정·역방향 의미를 해독하여, 상대방이 지금 느끼는 감정, 말하지 못하는 속내, 나에 대한 인식을 통찰하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🌊',
        title: '두 사람 사이에 흐르는 현실적 역동과 관계의 본질',
        subtitle: '3번 카드: 관계가 놓인 실제 토대',
        instruction: '3번 카드를 통해 이상과 기대를 걷어낸 두 사람의 현실적 거리감, 역동, 그리고 관계의 현주소를 진단하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🚧',
        title: '두 사람을 가로막는 장애물과 오해의 실체',
        subtitle: '4번 카드: 갈등의 원인과 경계점',
        instruction: '4번 카드가 지목하는 소통의 단절, 자존심의 충돌, 혹은 외부 환경의 방해 요소를 명확히 짚어주십시오.',
      },
      {
        stepNumber: 5,
        emoji: '💌',
        title: '사랑을 꽃피울 트리니티의 결정적 관계 처방 & 축복',
        subtitle: '5번 카드: 관계의 발전과 미래 조언',
        instruction: '5번 카드의 최종 조언에 근거하여 관계의 온도를 높이고 오해를 풀 수 있는 실천적 대화법과 축복을 전하십시오.',
      },
    ],
    summaryTags: ['나의 속마음', '상대의 속마음', '사랑의 해법'],
    blessingTitle: '두 사람의 인연을 밝히는 사랑의 축복',
  }),

  career: () => ({
    theme: 'career',
    spreadTitle: '💼 성공의 계단 — 커리어·목표 달성 5단계 성장 마스터플랜',
    themeBadge: '성공의 계단',
    themeColor: 'from-amber-400 via-sky-400 to-blue-500',
    steps: [
      {
        stepNumber: 1,
        emoji: '📍',
        title: '출발선 진단: 현재 나의 위치와 역량 에너지',
        subtitle: '1번 카드: 커리어 현주소와 기본기',
        instruction: '1번 카드의 상징을 통해 지금 서 있는 커리어의 현실적 위치, 장점과 잠재력을 명쾌하게 분석하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🪜',
        title: '첫 번째 돌파구: 당장 시작해야 할 구체적 실행 단계',
        subtitle: '2번 카드: 다음 계단으로 오르는 행동',
        instruction: '2번 카드가 가리키는 다음 단계의 핵심 과업, 습득해야 할 역량, 혹은 취해야 할 전략을 제시하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '⚠️',
        title: '경계해야 할 함정과 현실적 장애물',
        subtitle: '3번 카드: 성장을 가로막는 병목 지점',
        instruction: '3번 카드의 경고를 통해 매너리즘, 인간관계의 갈등, 자원 부족 등 피해야 할 악수를 냉철하게 짚으십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🤝',
        title: '성공을 이끌어줄 결정적 조력자와 숨은 자원',
        subtitle: '4번 카드: 협력과 기회의 발판',
        instruction: '4번 카드가 가리키는 귀인의 형태, 네트워크, 혹은 내면에 숨겨진 비장의 무기를 밝혀내십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🏆',
        title: '최종 성취 비전과 장기적 커리어 마스터플랜',
        subtitle: '5번 카드: 정상에서 거둘 승리의 결실',
        instruction: '5번 카드가 약속하는 궁극의 성취와 명예, 그리고 커리어의 정상에 서기 위한 격려와 축복으로 마무리하십시오.',
      },
    ],
    summaryTags: ['현재 역량', '돌파 전략', '성공 비전'],
    blessingTitle: '정상을 향한 승리와 도약의 축복',
  }),

  money: () => ({
    theme: 'money',
    spreadTitle: '💰 재물 흐름 — 금전 상태·막힘 해소·유입 기회 4단 리포트',
    themeBadge: '재물 흐름',
    themeColor: 'from-yellow-400 via-amber-400 to-emerald-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '🪙',
        title: '현재 나의 금전 에너지와 재정 상태 진단',
        subtitle: '1번 카드: 지갑과 자산의 현주소',
        instruction: '1번 카드의 상징을 근거로 현재 재정 상태의 건강도와 금전적 파동을 냉철하게 분석하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🛑',
        title: '돈의 흐름이 막히는 핵심 누수 지점 (원인 규명)',
        subtitle: '2번 카드: 불필요한 지출과 장애물',
        instruction: '2번 카드를 통해 어디서 돈이 새고 있는지, 어떤 오판이나 습관이 금전운을 가로막고 있는지 규명하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🌊',
        title: '앞으로 열릴 재물 유입의 기회와 타이밍',
        subtitle: '3번 카드: 소득 증대와 수익의 창구',
        instruction: '3번 카드가 비추는 새로운 수입원, 투자 기회, 혹은 예상치 못한 재물운의 통로를 짚어주십시오.',
      },
      {
        stepNumber: 4,
        emoji: '💡',
        title: '자산을 불리고 지키는 실전 금전 관리 & 개운 행동',
        subtitle: '4번 카드: 지속 가능한 부의 실천',
        instruction: '4번 카드의 지혜에 근거하여 오늘 당장 실천할 수 있는 현금 관리와 자산 증식 팁을 처방하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '💰',
        title: '풍요로운 삶을 완성할 부의 마인드셋 확언',
        subtitle: '마르지 않는 풍요의 축복',
        instruction: '필요한 모든 자원이 적시에 공급된다는 확신과 경제적 평안의 축복을 건네십시오.',
      },
    ],
    summaryTags: ['재정 상태', '막힘 해소', '유입 기회'],
    blessingTitle: '마르지 않는 풍요와 번영의 축복',
  }),

  timing: () => ({
    theme: 'timing',
    spreadTitle: '⏳ 시기 점검 — 과거 영향·현재 타이밍·예상 시점 3단 리포트',
    themeBadge: '시기·타이밍',
    themeColor: 'from-indigo-400 via-sky-300 to-teal-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '⏳',
        title: '지금까지 영향을 미친 과거의 씨앗과 원인',
        subtitle: '1번 카드: 지나온 시간의 흔적',
        instruction: '1번 카드의 도상을 통해 지금까지 일이 지연되거나 준비되어 온 과거의 인과를 짚어내십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🕰️',
        title: '지금이 적기인가: 현재 타이밍의 기운 분석',
        subtitle: '2번 카드: 바로 지금의 움직임 가능성',
        instruction: '2번 카드의 기운을 바탕으로 지금이 적극적으로 움직일 때인지, 아니면 호흡을 가다듬고 기다릴 때인지 단호하게 판별하십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🗓️',
        title: '최적의 실행 타이밍과 예상되는 결실의 순간',
        subtitle: '3번 카드: 운이 열리는 결정적 시점',
        instruction: '3번 카드의 계절·숫자·원소 상징을 토대로 일이 풀릴 결정적 골든타임과 결실의 시기를 명시하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🏃',
        title: '시기를 놓치지 않기 위해 지금 준비할 행동',
        subtitle: '타이밍을 잡기 위한 준비 태세',
        instruction: '때가 왔을 때 즉각 도약할 수 있도록 지금 당장 마쳐야 할 준비 행동을 조언하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🌟',
        title: '시간의 파도를 타고 도약할 운명의 나침반',
        subtitle: '시절인연을 맞이하는 축복',
        instruction: '모든 것은 가장 알맞은 때에 완벽하게 일어난다는 믿음과 함께 최적의 타이밍을 축복하십시오.',
      },
    ],
    summaryTags: ['과거 인과', '현재 타이밍', '결정적 시점'],
    blessingTitle: '가장 완벽한 타이밍을 위한 축복',
  }),

  obstacle: () => ({
    theme: 'obstacle',
    spreadTitle: '🧱 장애물 돌파 — 현 상황·핵심 장벽·돌파 전략 3단 리포트',
    themeBadge: '장애물 돌파',
    themeColor: 'from-rose-500 via-amber-400 to-emerald-400',
    steps: [
      {
        stepNumber: 1,
        emoji: '🏔️',
        title: '마주한 현실 상황과 가로막힌 흐름',
        subtitle: '1번 카드: 문제의 현주소',
        instruction: '1번 카드의 상징을 근거로 질문자가 현재 겪고 있는 답답함과 상황의 전모를 객관적으로 짚어내십시오.',
      },
      {
        stepNumber: 2,
        emoji: '⚡',
        title: '나를 가로막는 진짜 핵심 장애물의 실체 (내적/외적 장벽)',
        subtitle: '2번 카드: 장벽의 본질과 원인',
        instruction: '2번 카드를 통해 표면적 이유가 아닌, 문제의 진짜 핵심 원인(내면의 두려움, 고집, 혹은 외부의 벽)을 날카롭게 도려내듯 밝히십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🔨',
        title: '벽을 문으로 바꿀 강력한 돌파 전략과 행동',
        subtitle: '3번 카드: 장벽을 무너뜨릴 열쇠',
        instruction: '3번 카드의 교훈에 입각하여 이 장애물을 단숨에 허물거나 우회하여 전진할 수 있는 파격적이고 명쾌한 돌파 해법을 제시하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🛡️',
        title: '돌파 과정에서 소모되지 않는 에너지 방어법',
        subtitle: '멘탈 보호와 번아웃 예방',
        instruction: '싸우는 과정에서 지치거나 다치지 않도록 내면의 에너지를 지키는 지혜를 처방하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '🌅',
        title: '장벽 너머로 펼쳐질 새로운 지평과 승리의 축복',
        subtitle: '돌파 후 맞이할 빛의 세계',
        instruction: '이 장벽은 더 큰 성장을 위한 디딤돌일 뿐이라는 진실과 함께 승리의 축복을 건네십시오.',
      },
    ],
    summaryTags: ['상황 진단', '장애물 실체', '돌파 전략'],
    blessingTitle: '장벽을 허물고 맞이할 승리의 축복',
  }),

  celtic_cross: () => ({
    theme: 'celtic_cross',
    spreadTitle: '✨ 셀틱 크로스 — 10장의 카드로 꿰뚫는 대서사 심층 입체 리포트',
    themeBadge: '셀틱 크로스 (10장)',
    themeColor: 'from-purple-400 via-indigo-400 to-amber-300',
    steps: [
      {
        stepNumber: 1,
        emoji: '✝️',
        title: '셀틱의 심장: 현재의 중심 상황과 맞부딪힌 도전 (1·2번 카드)',
        subtitle: '중심 축: 현재 상태와 교차하는 장애물',
        instruction: '1번 카드(현재 중심 에너지)와 2번 카드(가로막는 도전)의 상호작용을 통해 고민의 핵심 본질을 입체적으로 규명하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🏛️',
        title: '의식과 무의식의 두 기둥: 이상과 깊은 뿌리 (3·5번 카드)',
        subtitle: '수직 축: 의식적 목표와 무의식의 기반',
        instruction: '3번 카드(의식적 이상/목표)와 5번 카드(무의식의 뿌리/원인)를 연결하여 질문자의 내면 갈등과 진정한 지향점을 밝히십시오.',
      },
      {
        stepNumber: 3,
        emoji: '⏳',
        title: '시간의 수평 축: 지나온 과거와 다가올 가까운 미래 (4·6번 카드)',
        subtitle: '수평 축: 흘러온 과거와 곧 닥칠 미래',
        instruction: '4번 카드(지나온 과거의 영향)와 6번 카드(곧 펼쳐질 가까운 미래)를 엮어 사건의 전개 방향을 역동적으로 해독하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🪜',
        title: '운명의 기둥: 내면의 태도, 환경, 희망과 두려움 (7·8·9번 카드)',
        subtitle: '측면 축: 자기인식, 외부환경, 내적 심리',
        instruction: '7번(자신의 태도), 8번(주변 환경과 타인의 시선), 9번(희망과 은밀한 두려움)을 유기적으로 엮어 현실의 입체성을 풀어내십시오.',
      },
      {
        stepNumber: 5,
        emoji: '👑',
        title: '대서사의 최종 결말과 마스터의 총체적 조언 (10번 카드)',
        subtitle: '10번 카드: 궁극의 결과와 마스터 비전',
        instruction: '10번 카드가 가리키는 최종 결과와 더불어, 10장의 드라마를 총괄하는 트리니티 마스터의 깊이 있는 운명 나침반을 완성하십시오.',
      },
    ],
    summaryTags: ['현재와 도전', '시간과 심리 축', '최종 마스터 결말'],
    blessingTitle: '셀틱의 대서사를 관통하는 영혼의 축복',
  }),

  general: () => ({
    theme: 'general',
    spreadTitle: '🌌 3카드 시간 흐름 — 과거 원인·현재 상황·미래 결과 리포트',
    themeBadge: '3카드 시간 배열',
    themeColor: 'from-amber-400 to-yellow-500',
    steps: [
      {
        stepNumber: 1,
        emoji: '🕯️',
        title: '과거의 씨앗과 원인: 현재를 만든 배경 에너지',
        subtitle: '1번 카드: 과거의 인과와 배경',
        instruction: '1번 카드의 상징을 통해 지금의 고민이 시작된 과거의 사건, 감정적 원인, 그리고 쌓여온 카르마적 배경을 해독하십시오.',
      },
      {
        stepNumber: 2,
        emoji: '🎴',
        title: '현재 상황의 진실: 마주한 현실과 마음의 흐름',
        subtitle: '2번 카드: 지금 서 있는 자리',
        instruction: '2번 카드의 도상과 본래 뜻을 바탕으로 질문자가 직면한 현재 상황의 본질과 미처 깨닫지 못한 내면의 흐름을 밝혀주십시오.',
      },
      {
        stepNumber: 3,
        emoji: '🔮',
        title: '다가올 미래의 결말: 카드가 가리키는 필연적 흐름',
        subtitle: '3번 카드: 예상되는 결과와 결실',
        instruction: '3번 카드가 예견하는 앞으로의 전개, 맞이할 결과와 전환점을 명확하고 생생하게 서술하십시오.',
      },
      {
        stepNumber: 4,
        emoji: '🌿',
        title: '운의 흐름을 최선으로 바꿀 마스터의 실천 처방',
        subtitle: '미래를 개척하는 행동 지침',
        instruction: '미래 카드의 좋은 기운을 증폭하고 위험을 방지하기 위해 오늘 당장 실천할 수 있는 구체적인 행동 조언을 처방하십시오.',
      },
      {
        stepNumber: 5,
        emoji: '✨',
        title: '당신의 앞길을 환히 밝히는 영혼의 한마디',
        subtitle: '따뜻한 용기와 희망의 축복',
        instruction: '질문자가 스스로의 운명을 주도할 수 있도록 용기와 지혜의 축복을 전하며 마무리하십시오.',
      },
    ],
    summaryTags: ['과거 원인', '현재 상황', '미래 결실'],
    blessingTitle: '운명의 길을 밝히는 빛의 축복',
  }),
};

/**
 * 테마와 배열법에 완벽히 맞춤화된 시스템 프롬프트 가이드 문자열 생성
 */
export function buildSpreadTailoredReadingGuide(
  theme: TarotConcernTheme,
  spread: TarotSpreadRecommendation,
  opts?: {
    optionA?: string;
    optionB?: string;
    concern?: string;
    sajuSummary?: string;
    dayMaster?: string;
    yongsin?: string;
    dominantEl?: string;
    lackingEl?: string;
  }
): {
  structure: SpreadThemeStructure;
  promptTemplate: string;
} {
  const getStructure = THEME_STRUCTURES[theme] || THEME_STRUCTURES.general;
  const structure = getStructure(spread, opts);

  const stepsMarkdown = structure.steps
    .map(
      (s) => `### ${s.emoji} ${s.stepNumber}. ${s.title}\n- **[${s.subtitle}]**: ${s.instruction}`
    )
    .join('\n\n');

  const [tag1, tag2, tag3] = structure.summaryTags;

  const findStepTitleForTag = (tag: string, defaultStepIdx: number): string => {
    const cleanTag = tag.replace(/[^가-힣a-zA-Z0-9]/g, '');
    const matched = structure.steps.find((s) => {
      const combined = `${s.title} ${s.subtitle}`.replace(/[^가-힣a-zA-Z0-9]/g, '');
      return (
        combined.includes(cleanTag) ||
        (cleanTag.length >= 2 && combined.includes(cleanTag.slice(0, 2)))
      );
    });
    const chosen = matched || structure.steps[defaultStepIdx] || structure.steps[0];
    return chosen ? `${chosen.stepNumber}. ${chosen.title}` : tag;
  };

  const step1Title = findStepTitleForTag(tag1, 0);
  const step2Title = findStepTitleForTag(tag2, Math.min(1, structure.steps.length - 1));
  const step3Title = findStepTitleForTag(tag3, Math.min(3, structure.steps.length - 1));

  const sajuDirective = opts?.dayMaster || opts?.yongsin
    ? `\n- [사주 원국 연계]: 질문자의 사주 본원 [${opts.dayMaster || '본원 기질'}]${opts.yongsin ? ` 및 용신 [${opts.yongsin}]` : ''} 기운을 뽑힌 카드의 도상과 유기적으로 결합하여 서술하십시오.`
    : '';

  const promptTemplate = `[✨ 테마 특화 리딩 구성 형식 — 반드시 아래 순서대로 감동적이고 흡입력 있게 전개하세요]

[✨ 핵심 3줄 요약 — 리딩 결과의 최상단에 질문자의 마음에 깊은 울림과 명쾌함을 주는 고밀도 3줄 요약을 반드시 가장 먼저 작성하십시오]
[핵심 3줄 요약]
- [${tag1}] 뽑힌 카드의 구체적 도상 상징(카드 명칭 및 시각적 모티브)과 사주 기운(본원/오행)을 결합하여, 질문자의 현재 상황과 내면 흐름을 날카롭게 짚어낸 심층 진단 (형식적 요약 절대 금지, 공백 포함 50~70자 내외의 명료한 완결된 1문장)
- [${tag2}] ${step2Title}의 핵심을 바탕으로 카드의 교훈과 사주 전환점의 지혜(용신/행운)를 융합하여 앞으로 나아갈 운명의 나침반을 명쾌하게 선언하는 깊은 해답 (공백 포함 50~70자 내외의 명료한 완결된 1문장)
- [${tag3}] ${step3Title}의 핵심을 바탕으로 오늘 질문자가 일상생활에서 즉시 실천할 수 있는 구체적이고 현실적인 행동 처방 (공백 포함 50~70자 내외의 명료한 완결된 1문장, 추상적 다짐 금지)

[★ 핵심 3줄 요약 작성 대원칙 — 성의 없는 요약 절대 금지]
1. [카드 상징 ✕ 사주 결합 심층 서술]: 단순한 상황 요약이나 뻔한 위로가 아닌, 뽑힌 카드의 고유 도상 상징(지팡이/컵/검/펜타클 또는 메이저 카드의 시각적 상징물)과 사주 원국 기운(일간 본원, 오행 균형, 용신)을 명확히 맞물려 고밀도로 통찰하십시오.${sajuDirective}
2. [각 줄당 50~70자 분량 엄수]: 너무 짧아 무성의해 보이거나(35자 미만 금지) 너무 길어 늘어지지 않도록, 각 항목당 핵심을 날카롭게 압축한 공백 포함 50~70자 내외의 품격 있는 완결 문장으로 작성하십시오.
3. [오늘 즉시 실천 처방 필수]: 세 번째 줄([${tag3}])은 모호한 마음가짐이 아니라, 질문자가 오늘 당장 생활 속에서 실행할 수 있는 현실적이고 구체적인 행동 미션(행동·시간·방식 명시)을 반드시 처방하십시오.
4. [핵심 3줄 요약] 블록은 오직 리딩 결과의 최상단에 단 1회만 출력해야 합니다.
5. 요약 블록 출력 후에는 해당 요약 내용을 중복 기입하지 마십시오.
6. 이어지는 본문 단계(1단계~${structure.steps.length}단계) 내부나 리딩 맨 마지막(끝부분)에 [핵심 3줄 요약] 또는 요약 블록을 절대로 다시 작성하거나 중복 기입해서는 안 됩니다. 리딩 본문 마지막에는 어떠한 형태의 요약 블록도 절대 기재하지 마십시오.

[✨ 본문 심층 리딩 — 최상단 3줄 요약 출력 완료 후, 아래 ${structure.steps.length}단계 맞춤 마크다운 구조로 순서대로 전개하세요]

${stepsMarkdown}

[⚠️ 필수 완결성 및 요약 중복 배제 원칙 — 리딩 끝까지 완전 작성]
- 중간에 서술을 멈추거나 생략하지 마십시오.
- 최상단 [핵심 3줄 요약]부터 1단계~${structure.steps.length}단계 마지막 축복까지 한 문장도 끊김 없이 끝까지 완결된 형태로 작성하여 주십시오.
- 마지막 단계의 영혼의 축복 작성 시 "카드는 정해진 운명을 가두는 틀이 아니라..." 등 기존에 반복되던 진부한 클리셰 문장은 절대로 작성하지 마십시오. 뽑힌 카드의 고유한 도상 상징과 질문자의 상황에 밀착된 오직 이 카드만의 개성 넘치는 황금빛 축복 문장을 작성하십시오.
- 본문 마지막에 [핵심 3줄 요약]이나 어떠한 형태의 요약 블록도 절대로 다시 작성하지 마십시오.`;

  return { structure, promptTemplate };
}
