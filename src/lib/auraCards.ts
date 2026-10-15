export interface AuraThemeCard {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  keywords: string[];
  desc: string;
}

export const AURA_CARDS: AuraThemeCard[] = [
  {
    id: "white_purifier",
    name: "White Purifier",
    nameKo: "정화의 백색",
    emoji: "🤍",
    keywords: ["정화", "순수", "시작", "명료함"],
    desc: "모든 것을 비워내고 새롭게 시작할 수 있는 맑고 순수한 백색의 에너지입니다."
  },
  {
    id: "emerald_healer",
    name: "Emerald Healer",
    nameKo: "치유의 녹색",
    emoji: "💚",
    keywords: ["치유", "성장", "균형", "자연"],
    desc: "지친 마음과 몸을 어루만지고 생명력을 채워주는 싱그러운 녹색의 치유 파동입니다."
  },
  {
    id: "indigo_sage",
    name: "Indigo Sage",
    nameKo: "통찰의 남색",
    emoji: "💙",
    keywords: ["통찰", "지혜", "직관", "고요"],
    desc: "내면의 목소리에 귀 기울이며 본질을 꿰뚫어 보게 돕는 깊고 신비로운 남색 광채입니다."
  },
  {
    id: "golden_sun",
    name: "Golden Sun",
    nameKo: "풍요의 금색",
    emoji: "💛",
    keywords: ["풍요", "성공", "기쁨", "자신감"],
    desc: "태양처럼 따스하고 빛나며 내재된 가능성과 풍요를 일깨우는 황금빛 활력입니다."
  },
  {
    id: "crimson_fire",
    name: "Crimson Fire",
    nameKo: "열정의 적색",
    emoji: "❤️",
    keywords: ["열정", "행동", "활력", "용기"],
    desc: "망설임을 걷어내고 힘차게 도약할 수 있도록 용기와 생명력을 불어넣는 붉은 불꽃입니다."
  },
  {
    id: "solar_yellow",
    name: "Solar Yellow",
    nameKo: "활력의 황색",
    emoji: "☀️",
    keywords: ["소통", "밝음", "긍정", "창의성"],
    desc: "긍정적인 생각과 지치지 않는 호기심으로 매 순간에 미소를 선사하는 따사로운 노란빛입니다."
  },
  {
    id: "violet_mystic",
    name: "Violet Mystic",
    nameKo: "신비의 자색",
    emoji: "💜",
    keywords: ["신비", "직관", "고귀", "예술"],
    desc: "현실을 뛰어넘어 깊은 영적 조화와 예술적인 상상력을 깨워내는 자줏빛 신비의 에너지입니다."
  },
  {
    id: "pink_harmony",
    name: "Pink Harmony",
    nameKo: "조화의 분홍",
    emoji: "💖",
    keywords: ["사랑", "조화", "공감", "따뜻함"],
    desc: "타인과 나 자신을 향한 무조건적인 사랑과 연민으로 가득 찬 포근한 분홍빛 치유 에너지입니다."
  },
  {
    id: "turquoise_flow",
    name: "Turquoise Flow",
    nameKo: "흐름의 청록",
    emoji: "🩵",
    keywords: ["자유", "표현", "창조", "흐름"],
    desc: "막힘 없는 생각의 흐름과 진정한 나를 세상에 조화롭게 표현하게 돕는 맑은 청록색의 물결입니다."
  },
  {
    id: "silver_moon",
    name: "Silver Moon",
    nameKo: "직관의 은색",
    emoji: "🌙",
    keywords: ["민감", "수용", "치유", "은혜"],
    desc: "달빛처럼 부드럽고 섬세하게 감정을 수용하고 어루만지는 고요한 은빛 아우라입니다."
  },
  {
    id: "amber_earth",
    name: "Amber Earth",
    nameKo: "대지의 황토",
    emoji: "🤎",
    keywords: ["안정", "접지", "신뢰", "인내"],
    desc: "흔들리지 않는 대지처럼 단단하게 중심을 잡아주고 깊은 안정감을 주는 든든한 흙빛 에너지입니다."
  },
  {
    id: "coral_passion",
    name: "Coral Passion",
    nameKo: "열망의 산호",
    emoji: "🧡",
    keywords: ["창의", "사교", "기쁨", "친밀"],
    desc: "삶의 다채로운 순간들을 축제처럼 즐기며 소중한 이들과 따스하게 공명하게 해주는 산호빛 따스함입니다."
  },
  {
    id: "rainbow_light",
    name: "Rainbow Light",
    nameKo: "통합의 무지개",
    emoji: "🌈",
    keywords: ["통합", "다양성", "자유", "완성"],
    desc: "모든 아우라 주파수가 완벽한 어울림을 이루어 눈부신 생명을 그려내는 무지개 스펙트럼입니다."
  },
  {
    id: "obsidian_protection",
    name: "Obsidian Protection",
    nameKo: "보호의 흑색",
    emoji: "🖤",
    keywords: ["보호", "단단함", "정화", "독립"],
    desc: "불필요한 외부의 자극이나 부정적 에너지를 완벽히 차단하고 스스로를 온전히 지켜내는 강력한 아우라입니다."
  },
  {
    id: "sapphire_peace",
    name: "Sapphire Peace",
    nameKo: "평화의 사파이어",
    emoji: "🔷",
    keywords: ["평화", "신뢰", "차분", "충실"],
    desc: "고요하고 깊은 바다처럼 마음을 진정시키고 영원한 안식과 상호 간의 신뢰를 다져주는 사파이어의 파동입니다."
  },
  {
    id: "pearl_purity",
    name: "Pearl Purity",
    nameKo: "순수의 진주",
    emoji: "🦪",
    keywords: ["순결", "성찰", "내면의 미", "귀함"],
    desc: "인내와 아픔 속에서 빚어진 깊은 성찰을 거쳐 마침내 영롱하게 우러나온 조화로운 진주의 빛깔입니다."
  },
  {
    id: "copper_grounding",
    name: "Copper Grounding",
    nameKo: "접지의 구리",
    emoji: "🪙",
    keywords: ["연결", "정렬", "전도", "균형"],
    desc: "하늘과 땅의 활력을 막힘 없이 이어주고 신체의 에너지를 조화롭게 활성화하는 구리빛 주파수입니다."
  },
  {
    id: "platinum_evolution",
    name: "Platinum Evolution",
    nameKo: "진화의 백금",
    emoji: "🔘",
    keywords: ["변화", "초월", "영성", "도약"],
    desc: "더 높은 차원으로 한 걸음 나아갈 수 있도록 낡은 관념을 녹이고 변화와 정화를 가져오는 백금빛 에너지입니다."
  },
  {
    id: "bronze_strength",
    name: "Bronze Strength",
    nameKo: "강인함의 청동",
    emoji: "🛡️",
    keywords: ["강인함", "안정", "전통", "인내"],
    desc: "모진 풍파를 견디며 한결같은 가치로 자리하는 청동 거울처럼 깊고 진한 내면의 단단함을 선사합니다."
  },
  {
    id: "jade_balance",
    name: "Jade Balance",
    nameKo: "조화의 비취",
    emoji: "🔋",
    keywords: ["비취", "건강", "장수", "행운"],
    desc: "부귀와 안녕을 뜻하는 푸른 비취처럼 지혜를 돋우고 전신에 부드러운 안도감을 선사하는 조화로운 수호 아우라입니다."
  },
  {
    id: "crystal_clarity",
    name: "Crystal Clarity",
    nameKo: "선명함의 수정",
    emoji: "🔮",
    keywords: ["선명", "투명", "집중", "조율"],
    desc: "티 없이 깨끗한 수정처럼 잡념을 모두 지우고 나아갈 길과 목표를 흐트러짐 없이 드러내는 광채입니다."
  },
  {
    id: "cosmic_nebula",
    name: "Cosmic Nebula",
    nameKo: "우주의 성운",
    emoji: "🌌",
    keywords: ["무한", "우주", "창조", "동조"],
    desc: "끝없이 팽창하는 우주의 신비로운 성운처럼 모든 생명과 운명의 순환이 엮인 우주적 포용의 아우라입니다."
  }
];

export interface AuraCardSedonaRecommendation {
  themeId: "apathy" | "grief" | "fear" | "anger" | "control" | "approval" | "security";
  reason: string;
  briefTip: string;
}

export const AURA_CARD_SEDONA_MAP: Record<string, AuraCardSedonaRecommendation> = {
  white_purifier: {
    themeId: "apathy",
    reason: "[정화의 백색] 카드는 모든 묵은 것을 비워내고 맑은 순수로 돌아갈 것을 권합니다. 내면에 쌓인 무기력과 '어쩔 수 없다'는 체념의 전압을 먼저 흘려보낼 때 새로운 생명력의 빛이 차오릅니다.",
    briefTip: "[정화의 백색]의 맑은 빛으로 묵은 체념 흘려보내기"
  },
  emerald_healer: {
    themeId: "control",
    reason: "[치유의 녹색] 카드는 자연스러운 균형과 성장의 치유 파동을 상징합니다. 억지로 상황을 쥐고 흔들려던 통제 욕구를 내려놓고 우주의 생명력에 온전히 내맡길 때 진정한 치유가 시작됩니다.",
    briefTip: "상황을 조종하려는 긴장을 풀고 자연 치유에 내맡기기"
  },
  indigo_sage: {
    themeId: "fear",
    reason: "[통찰의 남색] 카드는 깊은 지혜와 본질을 꿰뚫는 직관의 힘을 전합니다. 미래에 대한 불안과 에고의 두려움을 흘려보내면 고요 속에서 가장 명확한 통찰이 떠오릅니다.",
    briefTip: "미래 불안을 허공에 녹이고 깊은 내면의 침묵 듣기"
  },
  golden_sun: {
    themeId: "approval",
    reason: "[풍요의 금색] 카드는 이미 내면에 충만한 황금빛 자신감과 성공의 씨앗을 일깨웁니다. 타인의 칭찬과 인정을 갈망하며 스스로를 검열하던 얽매임을 내려놓을 때 본연의 풍요가 빛납니다.",
    briefTip: "타인의 인정 갈망을 풀고 내 안의 황금빛 태양 신뢰하기"
  },
  crimson_fire: {
    themeId: "anger",
    reason: "[열정의 적색] 카드는 지체 없이 도약하는 붉은 불꽃의 에너지를 품고 있습니다. 가슴속에 응어리진 억울함과 날 선 분노 전압을 시원하게 정화해야 순수한 행동의 용기로 승화됩니다.",
    briefTip: "마음속 분노 전하를 날숨으로 태워버리고 순수 열정 깨우기"
  },
  solar_yellow: {
    themeId: "control",
    reason: "[활력의 황색] 카드는 따스한 미소와 유쾌한 소통의 창의적 파동입니다. 모든 결과를 내 뜻대로 통제하려 굳어있던 긴장을 풀고 가볍고 유연하게 세상과 교감해 보세요.",
    briefTip: "경직된 완벽주의를 풀고 밝은 호기심으로 마주하기"
  },
  violet_mystic: {
    themeId: "fear",
    reason: "[신비의 자색] 카드는 깊은 영적 조화와 예술적 상상력을 열어주는 파동입니다. 미지의 영역에 대한 에고의 두려움과 불안을 흘려보내면 보이지 않던 거룩한 길이 환히 열립니다.",
    briefTip: "미지의 두려움을 내려놓고 고귀한 영적 흐름 수용하기"
  },
  pink_harmony: {
    themeId: "approval",
    reason: "[조화의 분홍] 카드는 조건 없는 사랑과 포근한 연민의 치유 에너지를 상징합니다. 사랑받지 못할까 전전긍긍하며 타인의 눈치를 보던 인정 욕구를 내려놓을 때 참된 조화가 깃듭니다.",
    briefTip: "남의 평가를 의식하던 자가 검열을 포근히 안아주기"
  },
  turquoise_flow: {
    themeId: "control",
    reason: "[흐름의 청록] 카드는 막힘없이 유영하는 강물 같은 자유와 진정한 표현의 힘입니다. 상황을 억지로 틀어쥐려는 통제 욕구를 강물에 띄워 보낼 때 가장 자연스러운 창조가 일어납니다.",
    briefTip: "억지 통제를 멈추고 맑은 청록의 물결에 몸을 싣기"
  },
  silver_moon: {
    themeId: "grief",
    reason: "[직관의 은색] 카드는 달빛처럼 은은하게 마음의 상처를 보듬는 은혜의 아우라입니다. 과거에 대한 아릿한 그리움, 지나간 일에 대한 자책과 슬픔을 고요한 달빛 속에 비워내세요.",
    briefTip: "오래된 슬픔과 자책을 은빛 달빛에 비추어 흘려보내기"
  },
  amber_earth: {
    themeId: "security",
    reason: "[대지의 황토] 카드는 흔들리지 않는 대지의 단단한 접지와 깊은 안정감을 상징합니다. 기반이 무너질까 조마조마해하던 원초적 안전 욕구와 생존 불안을 어머니 대지의 품에 항복하세요.",
    briefTip: "미래 결핍 불안을 내려놓고 대지의 단단한 지지 신뢰하기"
  },
  coral_passion: {
    themeId: "grief",
    reason: "[열망의 산호] 카드는 삶의 축제를 즐기며 사람들과 따뜻하게 공명하는 산호빛 온기입니다. 마음을 닫게 만들었던 과거의 단절감과 관계의 상처를 따뜻하게 녹여내세요.",
    briefTip: "관계의 외로움과 상처를 산호빛 온기로 어루만지기"
  },
  rainbow_light: {
    themeId: "control",
    reason: "[통합의 무지개] 카드는 모든 빛깔이 완벽한 조화를 이루는 다차원 통합의 장입니다. 옳고 그름을 흑백으로 재단하고 타인을 통제하려던 분열적 에고를 내려놓고 온전함을 선택하세요.",
    briefTip: "흑백 판단의 칼날을 거두고 모든 다채로움 포용하기"
  },
  obsidian_protection: {
    themeId: "fear",
    reason: "[보호의 흑색] 카드는 부정적 에너지를 차단하고 스스로를 굳건히 지키는 수호의 아우라입니다. 상처받을까 봐 주변을 경계하며 뾰족하게 세워둔 피해의식과 두려움을 단호히 흘려보내세요.",
    briefTip: "가시 돋친 방어기제를 풀고 내면의 단단한 참나 의지하기"
  },
  sapphire_peace: {
    themeId: "fear",
    reason: "[평화의 사파이어] 카드는 깊은 바다처럼 영원한 안식과 신뢰를 주는 파동입니다. 모든 일이 잘못될까 조급해하며 상황을 의심하던 불안을 맑고 푸른 사파이어 바다에 비워내세요.",
    briefTip: "조급한 의심을 거두고 푸른 바다의 영원한 평화에 내맡기기"
  },
  pearl_purity: {
    themeId: "approval",
    reason: "[순수의 진주] 카드는 아픔을 이겨내고 빚어낸 거룩하고 영롱한 내면의 보석입니다. 타인에게 감추고 싶던 은밀한 열등감과 남의 평가에 목매던 인정 갈망을 평화롭게 내려놓으세요.",
    briefTip: "남과 비교하던 열등감을 내려놓고 본연의 귀함 자각하기"
  },
  copper_grounding: {
    themeId: "control",
    reason: "[접지의 구리] 카드는 머리끝부터 발끝까지 신체 에너지를 막힘없이 순환시키는 접지의 도체입니다. 뇌를 혹사하며 생각으로만 상황을 쥐어짜려던 통제의 열기를 대지로 방전하세요.",
    briefTip: "머리의 과열된 생각 전압을 발바닥을 통해 대지로 방전하기"
  },
  platinum_evolution: {
    themeId: "apathy",
    reason: "[진화의 백금] 카드는 낡은 자아를 벗고 더 높은 차원으로 도약하는 영적 비상을 이끕니다. 익숙한 틀에 머무르려던 나태함과 '해봤자 안 된다'는 무기력의 껍질을 미련 없이 벗어던지세요.",
    briefTip: "낡은 안주와 체념을 벗고 백금빛 도약의 날개 펴기"
  },
  bronze_strength: {
    themeId: "control",
    reason: "[강인함의 청동] 카드는 풍파를 견뎌낸 깊고 진한 내면의 단단함을 선사합니다. 누구에게도 기대지 못하고 홀로 모든 짐을 짊어지려 했던 무쇠 갑옷 같은 강박과 통제욕을 내려놓으세요.",
    briefTip: "강한 척 버티던 무거운 갑옷을 벗고 부드러운 유연함 회복하기"
  },
  jade_balance: {
    themeId: "security",
    reason: "[조화의 비취] 카드는 전신에 부드러운 안도감과 생명 균형을 선물하는 수호 파동입니다. 몸의 균형이나 운명이 무너질까 전전긍긍하던 안전 결핍의 공포를 맑은 비취의 생명수에 씻어내세요.",
    briefTip: "무너짐에 대한 결핍 공포를 풀고 비취의 자비로운 안도감 신뢰하기"
  },
  crystal_clarity: {
    themeId: "fear",
    reason: "[선명함의 수정] 카드는 잡념의 안개를 걷어내고 한 점 흐림 없이 나아갈 길을 비추는 광채입니다. 결정을 내리지 못하고 갈팡질팡 에너지를 흩뜨리던 우유부단함과 불안을 투명하게 정화하세요.",
    briefTip: "갈팡질팡하던 생각 안개를 걷어내고 수정 구슬의 명료함에 집중하기"
  },
  cosmic_nebula: {
    themeId: "apathy",
    reason: "[우주의 성운] 카드는 은하계의 무한한 숨결과 하나로 호흡하는 광대한 우주 의식입니다. 스스로를 하찮고 작은 존재로 여기며 가두었던 왜소한 무력감과 고립감을 광활한 성운의 품에 녹여내세요.",
    briefTip: "왜소한 에고의 무력감을 벗고 광대무변한 우주 참나 호흡하기"
  }
};

export function getAuraCardSedonaRecommendation(card?: AuraThemeCard | null): AuraCardSedonaRecommendation {
  if (!card) {
    return {
      themeId: "control",
      reason: "에고가 상황을 억지로 통제하려는 긴장을 내려놓고, 우주의 자연스러운 순리에 내맡길 때 깊은 평온이 찾아옵니다.",
      briefTip: "상황을 조종하려는 긴장을 풀고 순리에 내맡기기"
    };
  }
  const found = AURA_CARD_SEDONA_MAP[card.id];
  if (found) return found;

  const cardName = card.nameKo || card.name || "방하착 힐링카드";
  const kw = (card.keywords || []).join(", ");
  return {
    themeId: "control",
    reason: `[${cardName}] 카드가 비추는 무의식의 억압(${kw})을 자각하며, 억지로 쥐고 있던 에고의 긴장을 내려놓고 깊은 평온을 회복합니다.`,
    briefTip: `[${cardName}]의 치유 파동을 상기하며 마음의 짐 흘려보내기`
  };
}
