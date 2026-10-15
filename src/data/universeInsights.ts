export type InsightCategory = 
  | 'all'
  | 'favorites'
  | 'stoic_fate'
  | 'zen_mind'
  | 'gnosis_jung'
  | 'acim_peace'
  | 'art_muse'
  | 'healing_love'
  | 'cosmos_truth';

export interface UniverseInsightItem {
  id: string;
  quote: string;
  author: string;
  source: string;
  category: InsightCategory;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  resonance: string;
  tags: string[];
}

export const INSIGHT_CATEGORIES: Array<{
  id: InsightCategory;
  label: string;
  icon: string;
  desc: string;
  color: string;
}> = [
  { id: 'all', label: '전체 지혜', icon: '🌌', desc: '모든 우주적 통찰과 클래식 명언', color: 'from-amber-400 to-indigo-500' },
  { id: 'stoic_fate', label: '운명 & 스토아', icon: '⚖️', desc: '운명을 사랑하고 내면의 통제력을 세우는 지혜', color: 'from-amber-400 to-orange-500' },
  { id: 'zen_mind', label: '선(禪) & 마음챙김', icon: '🧘', desc: '현재의 자각, 무집착과 있는 그대로의 평온', color: 'from-emerald-400 to-teal-500' },
  { id: 'gnosis_jung', label: '영지 & 심층심리', icon: '🔮', desc: '신성한 불꽃의 각성과 무의식의 자기실현', color: 'from-purple-400 to-indigo-500' },
  { id: 'acim_peace', label: '용서 & 순수평화', icon: '🕊️', desc: '두려움을 걷어내고 사랑과 평화를 선택하는 길', color: 'from-sky-400 to-blue-500' },
  { id: 'art_muse', label: '창조 & 예술혼', icon: '🎨', desc: '영감의 스파크와 불멸의 창작적 열정', color: 'from-pink-400 to-rose-500' },
  { id: 'healing_love', label: '치유 & 하트', icon: '🌿', desc: '내면아이의 위로, 수용과 무조건적 사랑', color: 'from-rose-400 to-amber-500' },
  { id: 'cosmos_truth', label: '우주 & 초월진리', icon: '✨', desc: '광대한 우주 질서와 존재의 원초적 신비', color: 'from-cyan-400 to-blue-600' },
];

export const UNIVERSE_INSIGHTS: UniverseInsightItem[] = [
  // ==========================================
  // 1. 운명 & 스토아 (stoic_fate)
  // ==========================================
  {
    id: 'stoic-01',
    quote: "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 가지는 데 있다.",
    author: "마르셀 프루스트",
    source: "잃어버린 시간을 찾아서",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "외부 환경을 바꾸려 애쓰기보다 세상을 바라보는 나의 내적 시선(Perspective)을 전환할 때 새로운 세상이 열립니다.",
    tags: ['시선', '발견', '의식의 전환', '통찰']
  },
  {
    id: 'stoic-02',
    quote: "너에게 일어나는 모든 일을 사랑하라(Amor Fati). 그것이야말로 너의 운명이자 가장 위대한 성장의 질료이다.",
    author: "프리드리히 니체",
    source: "이 사람을 보라 (Ecce Homo)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "피할 수 없는 삶의 파도를 거부하지 않고 온전히 끌어안을 때, 운명은 나를 짓누르는 짐이 아니라 나를 비상하게 하는 날개가 됩니다.",
    tags: ['아모르파티', '운명애', '수용', '내적용기']
  },
  {
    id: 'stoic-03',
    quote: "우리를 괴롭히는 것은 사물 자체가 아니라, 사물에 대해 우리가 품는 판단과 생각이다.",
    author: "에픽테토스",
    source: "담화록 (Enchiridion)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "어떤 사건도 나를 불행하게 만들 수 없습니다. 오직 그 사건에 내가 부여한 해석만이 나의 고통을 결정합니다.",
    tags: ['통제력', '자유', '인지적 거리두기', '스토아']
  },
  {
    id: 'stoic-04',
    quote: "새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야만 한다.",
    author: "헤르만 헤세",
    source: "데미안 (Demian)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "과거의 안전한 껍질을 깨뜨리는 고통 없이는 진정한 영혼의 탄생과 자기 자신이 되는 길을 걸을 수 없습니다.",
    tags: ['데미안', '탈피', '진정한 자아', '성장']
  },
  {
    id: 'stoic-05',
    quote: "너 자신 안으로 물러서라. 인간의 영혼만큼 평화롭고 번잡함 없는 안식처는 그 어디에도 없다.",
    author: "마르쿠스 아우렐리우스",
    source: "명상록 (Meditations)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "세상의 소음이 거세질수록 밖으로 달려가지 말고 고요한 내면의 성채(Inner Citadel)로 돌아와 숨을 고르세요.",
    tags: ['내면의 안식', '명상록', '평온', '마인드셋']
  },
  {
    id: 'stoic-06',
    quote: "시련은 사람을 만드는 것이 아니라, 그가 어떤 사람인지를 그 자신에게 드러내 보여줄 뿐이다.",
    author: "에픽테토스",
    source: "스토아 어록집",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "지금 마주한 도전은 나를 무너뜨리기 위함이 아니라 내 안에 숨겨진 무한한 잠재력과 회복탄력성을 일깨우는 거울입니다.",
    tags: ['시련', '성장', '자아발견', '회복탄력성']
  },
  {
    id: 'stoic-07',
    quote: "행운이란 철저한 준비가 천재일우의 기회를 만났을 때 비로소 탄생하는 것이다.",
    author: "루키우스 세네카",
    source: "인생의 짧음에 관하여",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "우연한 행운을 기다리지 말고 오늘 나의 내면과 역량을 묵묵히 닦아두세요. 우주의 문은 준비된 자에게 반드시 열립니다.",
    tags: ['세네카', '준비', '기회', '스토아지혜']
  },
  {
    id: 'stoic-08',
    quote: "자극과 반응 사이에는 공간이 있다. 그 공간에는 자신의 반응을 선택할 수 있는 자유와 힘이 존재한다.",
    author: "빅터 프랭클",
    source: "죽음의 수용소에서 (Man's Search for Meaning)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "어떤 비극적 환경에서도 반응의 주도권을 쥐는 찰나의 침묵이 인간을 가장 거룩하고 자유로운 존재로 만듭니다.",
    tags: ['선택의자유', '의미치료', '반응과자극', '존엄성']
  },
  {
    id: 'stoic-09',
    quote: "자신을 믿어라. 모든 심장은 그 신성한 철선에 맞춰 공명하며 뛴다.",
    author: "랄프 왈도 에머슨",
    source: "자기 신뢰 (Self-Reliance)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "타인의 평판과 사회적 관습에 굴복하지 않고 내면의 깊은 직관과 목소리를 따를 때 세상은 당신의 길에 길을 내어줍니다.",
    tags: ['자기신뢰', '에머슨', '초월주의', '내적확신']
  },
  {
    id: 'stoic-10',
    quote: "아침에 눈을 뜰 때마다 살아 숨 쉬고, 생각하고, 즐기고, 사랑할 수 있는 거룩한 특권에 감사하라.",
    author: "마르쿠스 아우렐리우스",
    source: "명상록 (Meditations)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "새로운 하루는 당연한 일상이 아니라 온 우주가 내게 베푼 또 하나의 찬란한 생명의 선물입니다.",
    tags: ['아침확언', '감사', '명상록', '생명의특권']
  },
  {
    id: 'stoic-11',
    quote: "우리는 실제 현실에서보다 우리 자신의 불안한 상상 속에서 훨씬 더 자주 고통받는다.",
    author: "루키우스 세네카",
    source: "루킬리우스에게 보낸 편지",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "아직 일어나지 않은 미래의 두려움을 미리 끌어당겨 가슴을 태우지 마세요. 지금 마주한 현재는 생각보다 평온합니다.",
    tags: ['상상과불안', '세네카', '현재집중', '평정심']
  },
  {
    id: 'stoic-12',
    quote: "삶은 오직 뒤를 돌아볼 때에만 온전히 이해되지만, 우리는 반드시 앞을 향해서만 살아가야 한다.",
    author: "쇠렌 키에르케고르",
    source: "일기 (Journals)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "지금의 혼란과 아픔도 훗날 뒤돌아보면 가장 위대한 축복과 성장의 디딤돌이었음을 확신하며 당당히 전진하세요.",
    tags: ['키에르케고르', '실존주의', '전진', '이해']
  },
  {
    id: 'stoic-13',
    quote: "세상에서 가장 위대하고 영광스러운 일은, 어떻게 온전히 자기 자신이 되는가를 아는 것이다.",
    author: "미셸 드 몽테뉴",
    source: "수상록 (Essais)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "남의 시선에 맞춘 껍데기의 삶을 벗어던지고 내 본연의 고유한 결을 발견하고 누리는 것이 인생 최고의 성취입니다.",
    tags: ['몽테뉴', '자기다움', '진정성', '성숙']
  },
  {
    id: 'stoic-14',
    quote: "슬픔이 당신의 영혼을 깊이 파낼수록, 당신은 훗날 더 넘치는 기쁨을 담을 수 있게 된다.",
    author: "칼릴 지브란",
    source: "예언자 (The Prophet)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "고통과 시련은 당신의 내면 그릇을 더 넓고 깊게 빚어내는 성스러운 장인의 손길입니다.",
    tags: ['칼릴지브란', '슬픔과기쁨', '영혼의그릇', '수용']
  },
  {
    id: 'stoic-15',
    quote: "인간의 행복을 결정하는 것은 그가 무엇을 소유했는가가 아니라, 그가 본질적으로 어떤 사람인가이다.",
    author: "아르투어 쇼펜하우어",
    source: "인생론 (Aphorismen zur Lebensweisheit)",
    category: 'stoic_fate',
    categoryName: '운명 & 스토아',
    categoryColor: 'text-amber-400',
    categoryIcon: '⚖️',
    resonance: "외적인 재물과 명예는 흘러가는 바람일 뿐, 맑은 정신과 평온한 가슴이야말로 영원히 빼앗기지 않는 참된 부입니다.",
    tags: ['쇼펜하우어', '내적풍요', '행복론', '품격']
  },

  // ==========================================
  // 2. 선(禪) & 마음챙김 (zen_mind)
  // ==========================================
  {
    id: 'zen-01',
    quote: "마음이 모든 것에 앞서가고, 마음이 으뜸이며, 모든 것은 마음으로 지어진다.",
    author: "석가모니 부처",
    source: "법구경 (Dhammapada)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "맑고 평화로운 마음으로 생각하고 행동할 때, 행복은 그림자가 형상을 따르듯 당신의 곁을 결코 떠나지 않습니다.",
    tags: ['법구경', '일체유심조', '마음의 힘', '행복']
  },
  {
    id: 'zen-02',
    quote: "그물에 걸리지 않는 바람처럼, 소리에 놀라지 않는 사자처럼, 흙탕물에 물들지 않는 연꽃처럼 가라.",
    author: "초기불전 수타니파타",
    source: "수타니파타 (Sutta Nipata)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "세상의 시선과 칭찬, 비난의 바람에 휘둘리지 않고 내면의 순수한 진실을 따라 당당하고 담담하게 걸어가세요.",
    tags: ['초연함', '독존', '순수성', '수타니파타']
  },
  {
    id: 'zen-03',
    quote: "과거를 뒤쫓지 말고, 미래를 바라지도 말라. 오직 현재의 현상을 있는 그대로 깊이 통찰하라.",
    author: "석가모니 부처",
    source: "맛지마 니까야 (Bhaddekaratta Sutta)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "지나간 일에 대한 후회와 오지 않은 미래에 대한 불안을 내려놓을 때 오직 지금 이 순간(Here and Now)에만 온전한 생명이 머뭅니다.",
    tags: ['현재존재', '지금여기', '마음챙김', '자각']
  },
  {
    id: 'zen-04',
    quote: "강물은 결코 서두르지 않지만, 결국 바다에 닿는다. 만물은 제자리에 흐르고 있다.",
    author: "노자 (Laozi)",
    source: "도덕경 (Tao Te Ching)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "억지로 밀어붙이거나 통제하려 하지 않는 무위자연(無爲自然)의 태도가 가장 자연스럽고 완전한 결실을 맺게 합니다.",
    tags: ['무위자연', '도덕경', '흐름', '순리']
  },
  {
    id: 'zen-05',
    quote: "자신을 등불로 삼고, 진리를 등불로 삼으라. 결코 밖의 것에 맹목적으로 의지하지 말라.",
    author: "석가모니 부처",
    source: "대반열반경 (Maha-parinibbana Sutta)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "자등명 법등명(自燈明 法燈明) — 인생의 가장 어두운 순간에도 당신의 내면에 이미 꺼지지 않는 지혜의 등불이 밝혀져 있습니다.",
    tags: ['자등명', '내적빛', '주체성', '깨달음']
  },
  {
    id: 'zen-06',
    quote: "초심자의 마음에는 수많은 가능성이 열려 있지만, 전문가의 굳은 마음에는 가능성이 거의 없다.",
    author: "스즈키 순류",
    source: "선심초심 (Zen Mind, Beginner's Mind)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "선입견과 고정관념을 비우고 갓 태어난 아이처럼 열린 마음으로 세상을 마주할 때 진정한 통찰과 배움이 일어납니다.",
    tags: ['초심', '선심초심', '유연성', '지혜']
  },
  {
    id: 'zen-07',
    quote: "현재의 순간에 온전히 머물며 저항하지 않을 때, 삶의 모든 순간은 살아 숨 쉬는 기적이 된다.",
    author: "에크하르트 톨레",
    source: "지금 이 순간을 살아라 (The Power of Now)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "머릿속 생각의 지옥에서 빠져나와 오직 현존(Presence)의 고요 속으로 들어오세요. 평화는 이미 여기에 있습니다.",
    tags: ['현존', '에크하르트톨레', '지금이순간', '깨어있음']
  },
  {
    id: 'zen-08',
    quote: "달을 가리키는 손가락을 보지 말고, 손가락이 가리키는 저 밝은 달을 바라보라.",
    author: "능엄경 (Surangama Sutra)",
    source: "선종 고사",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "언어와 형식, 겉치레에 얽매이지 말고 그 이면에 흐르는 본질적인 진실과 마음의 본바탕을 꿰뚫어 보세요.",
    tags: ['지월지망', '본질직시', '선종', '통찰']
  },
  {
    id: 'zen-09',
    quote: "진정한 승리자는 수천 명의 적을 굴복시키는 자가 아니라, 오직 자기 자신의 탐욕과 분노를 다스리는 자이다.",
    author: "석가모니 부처",
    source: "법구경 103절",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "외부와의 경쟁과 다툼을 내려놓고 내면의 어지러운 감정을 고요히 통어하는 자가 세상에서 가장 존귀한 영웅입니다.",
    tags: ['자기정복', '내면평화', '자비', '법구경']
  },
  {
    id: 'zen-10',
    quote: "모든 사물은 홀로 독립하여 존재하지 않고 서로 기대어 피어난다. 그러므로 본래 나라고 고집할 실체가 없다.",
    author: "나가르주나 (용수)",
    source: "중론 (Mulamadhyamakakarika)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "고립된 나라는 집착(에고)을 내려놓을 때 우리는 온 우주와 연결된 거대한 생명의 그물망임을 깨닫습니다.",
    tags: ['연기법', '공사상', '상호연결', '중관']
  },
  {
    id: 'zen-11',
    quote: "불도를 배운다는 것은 자기를 배우는 것이요, 자기를 배운다는 것은 자기를 잊는 것이다.",
    author: "도겐 선사",
    source: "정법안장 (Shobogenzo)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "작은 자아(에고)를 잊고 무아의 경지에 이를 때, 만물이 스스로 다가와 나의 참된 본성을 깨우쳐 줍니다.",
    tags: ['무아', '도겐', '정법안장', '해탈']
  },
  {
    id: 'zen-12',
    quote: "마음이 생겨나면 온갖 현상이 생겨나고, 마음이 사라지면 해골물도 감로수로 변하도다.",
    author: "원효 대사",
    source: "송고승전 (대승기신론소)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "세상의 모든 기쁨과 고통은 외부 사물이 아니라 내 마음의 렌즈가 빚어낸 그림자일 뿐입니다.",
    tags: ['원효대사', '해골물', '일심', '각성']
  },
  {
    id: 'zen-13',
    quote: "‘나는 누구인가’라는 질문을 깊이 파고들 때, 모든 생각의 파도는 잠잠해지고 순수한 참자아가 드러난다.",
    author: "라마나 마하르쉬",
    source: "나는 누구인가 (Who Am I?)",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "이름, 직업, 몸, 생각이라는 옷을 벗겨내고 남는 그 순수한 앎(Awareness)이 바로 당신의 영원한 실체입니다.",
    tags: ['마하르쉬', '자기탐구', '순수의식', '진아']
  },
  {
    id: 'zen-14',
    quote: "색이 곧 공이요 공이 곧 색이니, 번뇌의 거친 파도 밑에 본래 거룩하게 청정한 바다가 있도다.",
    author: "반야심경",
    source: "반야바라밀다심경",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "현실의 문제에 일희일비하지 마세요. 형상과 공함이 하나임을 깨달을 때 마음은 지극한 안심인명(安心立命)을 얻습니다.",
    tags: ['반야심경', '색즉시공', '대지혜', '해방']
  },
  {
    id: 'zen-15',
    quote: "숨을 들이쉬며 내 몸을 고요히 하고, 숨을 내쉬며 세상에 따스한 미소를 보낸다.",
    author: "틱낫한",
    source: "마음에는 평화 얼굴에는 미소",
    category: 'zen_mind',
    categoryName: '선(禪) & 마음챙김',
    categoryColor: 'text-emerald-400',
    categoryIcon: '🧘',
    resonance: "단 한 번의 온전하고 의식적인 호흡만으로도 우리는 즉시 번뇌의 사슬을 끊고 천국의 평화로 귀환할 수 있습니다.",
    tags: ['호흡명상', '미소', '틱낫한', '마음챙김']
  },

  // ==========================================
  // 3. 영지 & 심층심리 (gnosis_jung)
  // ==========================================
  {
    id: 'gnosis-01',
    quote: "너 자신을 아는 자는 우주의 근원을 알게 되며, 빛의 세계로 즉시 귀환하리라.",
    author: "도마 복음서",
    source: "낙함마디 문서 (Nag Hammadi)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "외부의 교리와 형식에 매이지 않고 당신의 본래 신성(Divine Spark)을 직관적으로 자각할 때 본향의 충만(Pleroma)이 열립니다.",
    tags: ['그노시스', '신성한불꽃', '낙함마디', '영지']
  },
  {
    id: 'gnosis-02',
    quote: "무의식을 의식화하지 않으면, 무의식이 삶의 방향을 결정하게 되고 우리는 그것을 '운명'이라 부른다.",
    author: "칼 구스타프 융",
    source: "원형과 무의식 (Archetypes and the Collective Unconscious)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "그림자와 억압된 내면의 목소리를 회피하지 않고 다정하게 대면하여 의식의 빛으로 비출 때 진정한 개성화(Individuation)가 시작됩니다.",
    tags: ['칼융', '무의식', '개성화', '그림자작업']
  },
  {
    id: 'gnosis-03',
    quote: "밖을 보는 자는 꿈을 꾸지만, 안을 들여다보는 자는 깨어난다.",
    author: "칼 구스타프 융",
    source: "융 서간집",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "타인과의 비교와 외부 세상의 인정을 좇는 잠에서 깨어나, 내면의 깊은 심연과 만나는 자만이 진정한 깨어남을 경험합니다.",
    tags: ['자각', '내면탐구', '심층심리', '각성']
  },
  {
    id: 'gnosis-04',
    quote: "신(God)이 내 안에 있고 내가 신 안에 있음을 아는 눈은, 내가 신을 보는 바로 그 눈이다.",
    author: "마이스터 에크하르트",
    source: "독일어 설교집 (Sermons)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "보는 나와 보여지는 대상의 분리가 사라질 때, 당신의 영혼은 우주의 무한한 지성과 완전히 하나로 호흡합니다.",
    tags: ['합일', '에크하르트', '비이원', '신비주의']
  },
  {
    id: 'gnosis-05',
    quote: "너의 내면에 있는 것을 밖으로 드러내면 그것이 너를 구원할 것이요, 드러내지 않으면 너를 파괴하리라.",
    author: "도마 복음서",
    source: "낙함마디 도마복음 70절",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "내면에 잠든 창의성, 고유한 진실, 진정한 열정을 억누르지 말고 세상에 표현하세요. 그것이 영혼의 궁극적 치유입니다.",
    tags: ['표현', '영혼의진실', '잠재력', '창조']
  },
  {
    id: 'gnosis-06',
    quote: "나는 나에게 일어난 사건들의 산물이 아니다. 나는 내가 되기로 능동적으로 선택한 바로 그 존재이다.",
    author: "칼 구스타프 융",
    source: "심리학과 연금술",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "과거의 상처와 트라우마가 당신의 미래를 결정하지 못합니다. 지금 이 순간 당신이 어떤 빛을 선택하느냐가 당신의 본질입니다.",
    tags: ['칼융', '선택', '자기창조', '심층심리']
  },
  {
    id: 'gnosis-07',
    quote: "당신이 들어가기를 가장 두려워하는 그 어두운 동굴 속에, 당신이 그토록 찾던 최고의 보물이 숨겨져 있다.",
    author: "조셉 캠벨",
    source: "천의 얼굴을 가진 영웅 (The Hero with a Thousand Faces)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "두려움과 저항을 피해 달아나지 마세요. 그 어둠을 마주하고 돌파할 때 당신은 영웅의 황금 같은 지혜를 품에 안게 됩니다.",
    tags: ['조셉캠벨', '영웅의여정', '용기', '보물']
  },
  {
    id: 'gnosis-08',
    quote: "한 알의 모래 속에서 세계를 보고, 한 송이 들꽃 속에서 천국을 보며, 손바닥 안에 무한을 쥐어라.",
    author: "윌리엄 블레이크",
    source: "순수의 전조 (Auguries of Innocence)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "지극히 작고 사소한 일상의 순간 속에 우주의 거룩한 전체성과 무한한 신비가 고스란히 깃들어 있습니다.",
    tags: ['윌리엄블레이크', '신비주의', '무한', '순수']
  },
  {
    id: 'gnosis-09',
    quote: "당신이 그토록 애타게 찾고 있는 그것이, 실은 당신 안에서 당신을 찾고 있다.",
    author: "잘랄 앗딘 루미",
    source: "디완 (Diwan-e Shams)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "진리와 사랑, 궁극의 평화는 외부에서 찾아 헤매는 것이 아니라 내면에서 이미 나를 기다리고 있는 영원한 고향입니다.",
    tags: ['루미', '수피즘', '본향', '영혼의빛']
  },
  {
    id: 'gnosis-10',
    quote: "위에서와 같이 아래에서도, 안에서와 같이 밖에서도. 우주의 삼라만상은 하나의 신성한 질서로 춤춘다.",
    author: "헤르메스 트리스메기스투스",
    source: "에메랄드 타블렛 (Tabula Smaragdina)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "내면의 마음 풍경이 정돈되고 밝아질 때, 당신의 외부 현실 또한 그 주파수에 맞춰 거짓말처럼 조화롭게 재정렬됩니다.",
    tags: ['헤르메티시즘', '상응의법칙', '내면투사', '우주법칙']
  },
  {
    id: 'gnosis-11',
    quote: "자신의 어둠을 직시하고 껴안는 자만이 타인의 어둠을 다루는 진정한 자비와 힘을 지닌다.",
    author: "칼 구스타프 융",
    source: "융 심리학 해제",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "빛만을 좇으며 어둠을 부인하지 마세요. 내면의 그림자를 통합할 때 영혼은 온전한(Whole) 빛의 성숙에 도달합니다.",
    tags: ['그림자통합', '칼융', '온전함', '자기수용']
  },
  {
    id: 'gnosis-12',
    quote: "무지는 결핍과 두려움을 낳았으나, 영지(Gnosis)의 맑은 빛이 비추자 어둠은 안개처럼 소멸하였도다.",
    author: "발렌티누스 파",
    source: "낙함마디 진리의 복음서 (Gospel of Truth)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "두려움은 실체가 있는 괴물이 아니라 참된 앎의 부재일 뿐입니다. 영혼의 눈을 뜰 때 모든 악몽은 즉시 끝납니다.",
    tags: ['낙함마디', '진리의복음', '영지', '빛의각성']
  },
  {
    id: 'gnosis-13',
    quote: "마음속에 풀리지 않는 모든 질문 자체를 사랑하라. 잠긴 방처럼, 낯선 외국어로 쓰인 책처럼.",
    author: "라이너 마리아 릴케",
    source: "젊은 시인에게 주는 편지",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "조급하게 답을 구하려 애쓰지 마세요. 질문을 품고 묵묵히 살아갈 때 언젠가 당신은 질문했던 바로 그 해답 속에서 살고 있을 것입니다.",
    tags: ['릴케', '질문의힘', '인내', '지혜']
  },
  {
    id: 'gnosis-14',
    quote: "영혼의 가장 깊은 침묵과 비움 속에서, 우주의 신성한 불꽃은 꺼지지 않고 영원히 타오른다.",
    author: "마이스터 에크하르트",
    source: "설교집 (Sermon 48)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "잡다한 생각과 욕망의 소음을 내려놓을 때, 영혼의 성소에서 우주의 가장 감미롭고 지혜로운 속삭임이 울려 퍼집니다.",
    tags: ['침묵', '에크하르트', '신성한불꽃', '비움']
  },
  {
    id: 'gnosis-15',
    quote: "알레프(Aleph)를 본 자는 온 우주의 모든 장소와 모든 순간이 하나의 점 안에 동시에 현존함을 안다.",
    author: "호르헤 루이스 보르헤스",
    source: "알레프 (El Aleph)",
    category: 'gnosis_jung',
    categoryName: '영지 & 심층심리',
    categoryColor: 'text-purple-400',
    categoryIcon: '🔮',
    resonance: "시공간의 환상을 넘어선 이 순간, 당신의 심장 안에는 과거와 미래, 온 은하계의 지혜가 온전히 숨 쉬고 있습니다.",
    tags: ['보르헤스', '알레프', '홀로그램우주', '영원']
  },

  // ==========================================
  // 4. 용서 & 순수평화 (acim_peace)
  // ==========================================
  {
    id: 'acim-01',
    quote: "실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다.",
    author: "기적수업 (ACIM)",
    source: "A Course in Miracles 서문",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "세상의 어떤 풍파도 당신의 참된 본질인 영원한 사랑과 평화를 털끝만큼도 해칠 수 없습니다.",
    tags: ['기적수업', '불변의평화', '진실', 'ACIM']
  },
  {
    id: 'acim-02',
    quote: "나는 이것 대신 언제나 평화를 보기를 선택할 수 있다.",
    author: "기적수업 (ACIM)",
    source: "워크북 레슨 34",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "분노와 갈등의 상황 속에서도 한 걸음 물러서서 평화를 선택할 수 있는 주권은 오직 나 자신에게 있습니다.",
    tags: ['선택의힘', '평화', '마음의결단', '용서']
  },
  {
    id: 'acim-03',
    quote: "놓아버림(Letting Go)이란 붙잡고 있던 감정적 에너지를 저항 없이 인정하고 떠나보내는 지극히 자연스러운 해방이다.",
    author: "데이비드 호킨스",
    source: "놓아버림 (Letting Go)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "감정을 억누르거나 표출하지 않고, 그저 가슴 속에 일어나는 에너지의 느낌을 온전히 허용할 때 감정은 저절로 녹아내립니다.",
    tags: ['놓아버림', '데이비드호킨스', '정화', '해방']
  },
  {
    id: 'acim-04',
    quote: "용서는 다른 사람을 위한 호의가 아니라, 나 자신을 원한의 감옥에서 해방시키는 가장 완벽한 열쇠이다.",
    author: "레스터 레븐슨",
    source: "세도나 메서드 (Sedona Method)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "원망을 쥐고 있는 손은 가장 먼저 나를 태웁니다. 손을 펴고 놓아줄 때 나의 가슴에 다시 따스한 자유가 깃듭니다.",
    tags: ['용서', '세도나메서드', '자유', '해방']
  },
  {
    id: 'acim-05',
    quote: "기적이란 외부 환경이 바뀌는 것이 아니라, 마음의 시선이 두려움에서 사랑으로 전환되는 순간이다.",
    author: "기적수업 (ACIM)",
    source: "ACIM 본문 1장",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "상황을 원망하기보다 사랑의 눈으로 다시 바라보세요. 마음이 바뀌는 찰나 세상도 기적처럼 변모합니다.",
    tags: ['기적', '시선의전환', '사랑', '기적수업']
  },
  {
    id: 'acim-06',
    quote: "현실과 다툴 때 당신은 100% 패배한다. 하지만 현실을 있는 그대로 사랑할 때 마음은 지극한 자유를 얻는다.",
    author: "바이런 케이티",
    source: "네 가지 질문 (Loving What Is)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "‘이래서는 안 돼’라는 고집을 내려놓고 일어난 사실을 겸허히 수용할 때, 불필요한 고통은 즉시 사라집니다.",
    tags: ['바이런케이티', '현실수용', '작업', '자유']
  },
  {
    id: 'acim-07',
    quote: "나는 오직 나 자신만을 용서할 수 있다. 왜냐하면 내가 타인에게서 본 죄책감은 실은 내 두려움의 투사였기 때문이다.",
    author: "기적수업 (ACIM)",
    source: "워크북 레슨 198",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "타인을 비난하던 손가락을 거두고 내 안의 불안과 상처를 보듬을 때, 세상 모든 존재와의 갈등이 눈 녹듯 사라집니다.",
    tags: ['투사의철회', '참된용서', '구원', '평화']
  },
  {
    id: 'acim-08',
    quote: "영적 성장이란 새로운 지식을 축적하는 것이 아니라, 가로막고 있던 에고의 두터운 껍질들을 벗겨내는 과정이다.",
    author: "데이비드 호킨스",
    source: "나의 눈 (The Eye of the I)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "더 대단한 사람이 되려 애쓰지 마세요. 거짓된 가면을 하나씩 내려놓을 때 본래 눈부신 당신의 신성이 빛납니다.",
    tags: ['에고해체', '데이비드호킨스', '순수의식', '빛']
  },
  {
    id: 'acim-09',
    quote: "미움이 있는 곳에 사랑을, 상처가 있는 곳에 용서를, 절망이 있는 곳에 희망을 심는 평화의 통로가 되게 하소서.",
    author: "아시시의 성 프란치스코",
    source: "평화의 기도 (Peace Prayer)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "받기만을 바라기보다 먼저 용서와 따스한 온기를 건넬 때, 당신의 영혼은 마르지 않는 은총의 샘이 됩니다.",
    tags: ['평화의기도', '프란치스코', '봉헌', '사랑']
  },
  {
    id: 'acim-10',
    quote: "과거는 이미 끝났고 지나갔다. 지금 이 영원한 현재에는 오직 순수한 무죄함과 하나님의 자비만이 숨 쉰다.",
    author: "게리 레너드",
    source: "우주가 사라지다 (The Disappearance of the Universe)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "과거의 망령에 얽매여 오늘을 괴롭히지 마세요. 시간의 환상을 걷어내면 당신은 본래 상처 입은 적이 없습니다.",
    tags: ['시간의초월', '무죄성', '게리레너드', '용서']
  },
  {
    id: 'acim-11',
    quote: "형제의 사소한 허물을 간과(Overlook)하고 그의 본래 신성을 바라보는 거룩한 시선 속에 나의 구원이 있다.",
    author: "켄 왑닉",
    source: "기적수업 메시지",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "상대의 실수와 결점을 심판하지 않고 빛으로 감싸 안아줄 때, 나 역시 세상의 모든 심판으로부터 영원히 해방됩니다.",
    tags: ['심판의포기', '간과', '형제애', '구원']
  },
  {
    id: 'acim-12',
    quote: "세상에 평화를 퍼뜨리고 싶다면, 지금 집으로 돌아가 당신 곁의 소중한 사람에게 따스한 미소를 건네라.",
    author: "마더 테레사",
    source: "사랑의 말씀",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "거창한 구호보다 오늘 곁에 있는 이에게 건네는 다정한 말 한마디가 세상을 치유하는 가장 위대한 불씨입니다.",
    tags: ['마더테레사', '소박한사랑', '환대', '평화']
  },
  {
    id: 'acim-13',
    quote: "오직 사랑만이 영원히 실재하며, 두려움과 분노는 사랑을 애타게 갈망하는 영혼의 부르짖음일 뿐이다.",
    author: "기적수업 (ACIM)",
    source: "ACIM 교사를 위한 지침서",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "누군가의 공격에 방어하거나 맞서 싸우지 마세요. 그 이면에 숨은 도움의 요청을 알아보고 사랑으로 응답하세요.",
    tags: ['사랑의응답', '두려움의진실', '치유', '화해']
  },
  {
    id: 'acim-14',
    quote: "당신이 마음의 고요와 평화를 최우선으로 삼을 때, 세상의 모든 문제는 저절로 가장 올바른 자리를 찾아간다.",
    author: "레스터 레븐슨",
    source: "궁극의 자유 (The Ultimate Freedom)",
    category: 'acim_peace',
    categoryName: '용서 & 순수평화',
    categoryColor: 'text-sky-400',
    categoryIcon: '🕊️',
    resonance: "외적인 해결책을 찾아 분주하기보다 내면의 평화를 먼저 회복하세요. 평화로운 의식이 최고의 현실을 창조합니다.",
    tags: ['내적평화', '레스터레븐슨', '순수존재', '해결']
  },

  // ==========================================
  // 5. 창조 & 예술혼 (art_muse)
  // ==========================================
  {
    id: 'art-01',
    quote: "예술은 영혼에 묻은 일상의 먼지를 털어내 준다.",
    author: "파블로 피카소",
    source: "피카소의 예술론",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "단조로운 일상과 반복되는 피로 속에서도 한 편의 시, 한 줄의 음악, 한 폭의 그림은 우리 영혼을 단숨에 정화합니다.",
    tags: ['예술', '영혼의정화', '창작', '피카소']
  },
  {
    id: 'art-02',
    quote: "너의 내면에 있는 고독을 사랑하라. 위대한 작품과 비범한 생각은 오직 고독의 성소에서만 잉태된다.",
    author: "라이너 마리아 릴케",
    source: "젊은 시인에게 주는 편지",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "외로움을 두려워하지 마세요. 고독은 영혼이 자신의 깊은 샘에서 가장 순수한 영감의 물을 길어 올리는 시간입니다.",
    tags: ['릴케', '고독', '창조성', '영감']
  },
  {
    id: 'art-03',
    quote: "네가 영혼으로 하는 모든 일은 결국 세상 사람들의 가슴에 가닿을 것이다.",
    author: "빈센트 반 고흐",
    source: "테오에게 보낸 편지",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "완벽함이나 세상의 평가에 연연하지 않고 온 정성을 다해 쏟아부은 진심은 시공간을 초월하여 공명합니다.",
    tags: ['반고흐', '진심', '울림', '열정']
  },
  {
    id: 'art-04',
    quote: "창조는 지성이 유희하는 법을 배울 때 일어난다.",
    author: "알베르트 아인슈타인",
    source: "사유와 상상력",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "엄격한 틀과 강박을 내려놓고 어린아이처럼 호기심을 갖고 상상의 날개를 펼칠 때 독창적인 영감이 번뜩입니다.",
    tags: ['상상력', '유희', '창의성', '아인슈타인']
  },
  {
    id: 'art-05',
    quote: "색채는 영혼에 직접적인 영향을 미치는 건반이며, 예술가는 영혼을 울려 퍼지게 하는 피아니스트의 손이다.",
    author: "바실리 칸딘스키",
    source: "예술에서의 정신적인 것에 대하여",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "예술은 눈에 보이는 사물의 복제가 아니라, 인간 내면의 보이지 않는 영적 진동과 감정을 시각적 화음으로 울리는 일입니다.",
    tags: ['칸딘스키', '추상예술', '영혼의공명', '색채']
  },
  {
    id: 'art-06',
    quote: "단순함이란 궁극의 정교함이다.",
    author: "레오나르도 다빈치",
    source: "다빈치 노트 (Notebooks)",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "군더더기와 겉치레를 깎아내고 오직 가장 본질적인 정수만을 남길 때, 작품과 삶은 가장 우아한 빛을 발합니다.",
    tags: ['다빈치', '단순함', '본질', '우아함']
  },
  {
    id: 'art-07',
    quote: "자연을 깊이 관찰하라. 아름다움은 숨겨져 있지 않으며, 볼 줄 아는 눈을 가진 자에게 온전히 드러나 있다.",
    author: "오귀스트 로댕",
    source: "로댕의 예술관",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "스쳐 지나가는 빛과 그림자, 스치는 바람과 나무의 결 속에 이미 우주 최고의 걸작이 펼쳐져 있습니다.",
    tags: ['로댕', '관찰', '자연미', '조각']
  },
  {
    id: 'art-08',
    quote: "창조에는 용기가 필요하다. 익숙한 해안선을 떠날 용기가 없는 자는 결코 새로운 대륙을 발견할 수 없다.",
    author: "앙리 마티스",
    source: "화가의 노트",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "안전지대에 머무르기를 거부하고 낯선 세계로 붓을 내딛는 대담함이 새로운 예술적 차원을 탄생시킵니다.",
    tags: ['마티스', '용기', '모험', '창작혼']
  },
  {
    id: 'art-09',
    quote: "오직 가슴에서 우러나온 진실한 소리만이, 다른 인간의 가슴을 흔들어 깨울 수 있다.",
    author: "루트비히 판 베토벤",
    source: "베토벤 서간집",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "기교와 기술을 넘어 영혼의 가장 깊은 고뇌와 환희를 담아낼 때, 음악은 시공을 초월해 인류를 치유합니다.",
    tags: ['베토벤', '진정성', '음악', '영혼의울림']
  },
  {
    id: 'art-10',
    quote: "당신이 할 수 있거나 꿈꿀 수 있는 모든 것을 지금 당장 시작하라. 대담함 속에는 천재성과 힘과 마법이 깃들어 있다.",
    author: "요한 볼프강 폰 괴테",
    source: "파우스트 서곡",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "망설임을 멈추고 첫 획을 긋는 순간, 온 우주가 당신의 창조적 불꽃을 돕기 위해 보이지 않게 움직이기 시작합니다.",
    tags: ['괴테', '결단과행동', '마법', '창조']
  },
  {
    id: 'art-11',
    quote: "나는 사물 자체를 그리지 않는다. 사물과 나 사이에 흐르는 눈부신 빛과 공기의 춤을 그릴 뿐이다.",
    author: "클로드 모네",
    source: "인상주의 회화록",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "고정된 실체라는 관념을 넘어 매 순간 새롭게 변모하는 빛의 파동과 찬란한 찰나를 온몸으로 만끽하세요.",
    tags: ['모네', '빛의화가', '인상주의', '순간의미']
  },
  {
    id: 'art-12',
    quote: "꽃을 진정으로 바라본다는 것은 시간을 들이는 일이며, 그것은 마치 소중한 벗과 깊은 우정을 나누는 일과 같다.",
    author: "조지아 오키프",
    source: "오키프의 회고록",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "서두름을 멈추고 대상을 향해 깊은 애정과 시간을 쏟을 때, 평범한 한 송이 꽃도 우주의 장엄한 신비로 피어납니다.",
    tags: ['오키프', '몰입', '꽃', '우아한시선']
  },
  {
    id: 'art-13',
    quote: "밤하늘의 찬란한 별들을 올려다보는 것만으로도, 나는 언제나 가슴 벅차게 꿈을 꾼다.",
    author: "빈센트 반 고흐",
    source: "별이 빛나는 밤 서신",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "차가운 현실의 어둠 속에서도 하늘을 우러러 빛나는 별을 품을 수 있는 자는 결코 영혼이 꺾이지 않습니다.",
    tags: ['별이빛나는밤', '반고흐', '순수열정', '꿈']
  },
  {
    id: 'art-14',
    quote: "예술가의 유일한 소명과 의무는, 오직 자기 자신만의 독창적인 꿈을 증언하는 데 있다.",
    author: "페데리코 펠리니",
    source: "영화 예술론",
    category: 'art_muse',
    categoryName: '창조 & 예술혼',
    categoryColor: 'text-pink-400',
    categoryIcon: '🎨',
    resonance: "남들의 모방에 머물지 말고 당신의 내면 깊은 곳에 깃든 고유한 우주와 환상을 세상에 당당히 드러내세요.",
    tags: ['독창성', '예술혼', '펠리니', '자기표현']
  },

  // ==========================================
  // 6. 치유 & 하트 (healing_love)
  // ==========================================
  {
    id: 'heal-01',
    quote: "미안합니다, 용서하세요, 고맙습니다, 사랑합니다. 이 네 마디는 기억의 정화를 통해 신성의 빛을 맞이하는 길이다.",
    author: "모르나 시메오나 & 이하레아칼라 휴 렌",
    source: "호오포노포노의 비밀 (Zero Limits)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "내 앞에 펼쳐진 현실에 대해 100% 책임을 지고 잠재의식 속 아픈 기억을 정화할 때 무한한 영점(Zero)의 평온이 깃듭니다.",
    tags: ['호오포노포노', '정화', '사랑합니다', '치유']
  },
  {
    id: 'heal-02',
    quote: "상처는 빛이 당신 안으로 들어오는 바로 그 문이다.",
    author: "잘랄 앗딘 루미 (Rumi)",
    source: "마스나비 (Masnavi)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "가장 아프고 깨어진 그 자리가 바로 우주의 무한한 자비와 깊은 치유의 빛이 스며드는 성스러운 통로입니다.",
    tags: ['루미', '상처와빛', '가슴치유', '희망']
  },
  {
    id: 'heal-03',
    quote: "평화는 나로부터 시작된다. 내 마음이 고요할 때 세상도 나와 함께 고요해진다.",
    author: "틱낫한 (Thich Nhat Hanh)",
    source: "평화로움에 안주하기 (Peace Is Every Step)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "세상을 바꾸려 분주하기보다 나의 호흡과 발걸음에 먼저 따스한 미소를 머금으세요. 평화는 이미 당신의 한 걸음에 있습니다.",
    tags: ['틱낫한', '평화', '자비', '마음의고요']
  },
  {
    id: 'heal-04',
    quote: "우리가 서로에게 줄 수 있는 가장 큰 선물은 판단 없는 온전한 현존과 경청이다.",
    author: "칼릴 지브란",
    source: "예언자 (The Prophet)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "상대를 평가하거나 바꾸려 하지 않고 있는 그대로의 존재를 가슴으로 품어주는 것, 그것이 가장 위대한 치유입니다.",
    tags: ['칼릴지브란', '경청', '존중', '사랑']
  },
  {
    id: 'heal-05',
    quote: "나 자신을 있는 그대로 온전히 인정하고 사랑할 때, 삶의 모든 막혔던 문이 기적처럼 열리기 시작한다.",
    author: "루이스 헤이",
    source: "치유 (You Can Heal Your Life)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "자기 비난과 자책의 채찍을 내려놓고 내면아이를 따뜻하게 안아주세요. 자기 사랑이 모든 치유의 시작입니다.",
    tags: ['루이스헤이', '자기사랑', '확언치유', '수용']
  },
  {
    id: 'heal-06',
    quote: "고통을 피하려 발버둥 치지 않고 있는 그대로 급진적으로 수용(Radical Acceptance)할 때 내면의 투쟁은 비로소 멈춘다.",
    author: "타라 브랙",
    source: "받아들임 (Radical Acceptance)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "‘지금 이 감정도 괜찮다’고 다정하게 허용해 줄 때, 응어리진 감정의 매듭은 스스로 부드럽게 풀려나갑니다.",
    tags: ['타라브랙', '수용', '마음의쉼', '자비']
  },
  {
    id: 'heal-07',
    quote: "취약성(Vulnerability)은 나약함이 아니라, 진정한 사랑과 소속감, 기쁨과 용기가 솟아나는 가장 거룩한 샘물이다.",
    author: "브레네 브라운",
    source: "마음가면 (Daring Greatly)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "완벽한 척 갑옷을 두르지 않고 나의 부족함과 진솔함을 드러낼 때, 타인의 가슴과 진정한 영적 연결이 일어납니다.",
    tags: ['브레네브라운', '취약성의힘', '진정성', '연결']
  },
  {
    id: 'heal-08',
    quote: "몰아치는 파도를 억지로 멈출 수는 없지만, 그 파도를 타고 부드럽게 서핑하는 법을 배울 수는 있다.",
    author: "존 카밧진",
    source: "마음챙김 명상 (Full Catastrophe Living)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "삶의 역경을 없애려 싸우기보다 호흡과 자각의 서핑보드 위에 올라타 평정심으로 파도를 유영하세요.",
    tags: ['존카밧진', '스트레스완화', '파도와서핑', '평정']
  },
  {
    id: 'heal-09',
    quote: "자신의 깊은 상처를 직시하고 치유해 본 사람만이, 타인의 아픔을 진심으로 보듬는 '상처 입은 치유자'가 될 수 있다.",
    author: "헨리 나우웬",
    source: "상처 입은 치유자 (The Wounded Healer)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "당신이 겪은 아픔은 결코 헛되지 않습니다. 그것은 훗날 수많은 길 잃은 영혼을 따스하게 비추는 등대가 됩니다.",
    tags: ['헨리나우웬', '상처입은치유자', '공감', '치유']
  },
  {
    id: 'heal-10',
    quote: "분노가 차오를 때 그것을 억압하거나 터뜨리지 말고, 어린 아기를 안듯 가슴에 품고 '내가 너를 돌보아주마' 속삭여라.",
    author: "틱낫한",
    source: "화 (Anger)",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "부정적인 감정도 실은 사랑받고 인정받기를 갈망하는 내면의 호소입니다. 자비로운 돌봄이 화를 평온으로 바꿉니다.",
    tags: ['감정돌봄', '화의치유', '틱낫한', '자비']
  },
  {
    id: 'heal-11',
    quote: "사랑은 모든 생명의 거룩한 호흡이며, 심장의 고요한 침묵 속에서 우주 전체의 위대한 음악이 흐른다.",
    author: "하즈랏 이나야트 칸",
    source: "마음의 음악",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "가슴의 문을 활짝 열고 호흡할 때, 당신은 고립된 개인이 아니라 우주의 사랑 그 자체로 숨 쉬게 됩니다.",
    tags: ['수피즘', '가슴의음악', '무조건적사랑', '생명력']
  },
  {
    id: 'heal-12',
    quote: "함께 서 있으되 너무 가까이 밀착하지는 말라. 거룩한 신전의 기둥들도 서로 알맞은 거리를 두고 서 있나니.",
    author: "칼릴 지브란",
    source: "예언자 결혼에 대하여",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "진정한 사랑은 상대를 구속하거나 소유하는 것이 아니라, 서로의 고유한 영혼이 자유롭게 꽃필 수 있는 공간을 지켜주는 일입니다.",
    tags: ['칼릴지브란', '건강한거리', '존중', '사랑의성숙']
  },
  {
    id: 'heal-13',
    quote: "과거의 아픔은 이미 끝났고 지나갔다. 지금 이 순간 내 마음의 생각을 긍정의 빛으로 선택하는 힘이 오직 내게 있다.",
    author: "루이스 헤이",
    source: "나를 치유하는 생각",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "낡은 원망의 레코드를 멈추고 지금 내 영혼을 향해 사랑과 감사의 축복을 건네세요. 지금이 바로 새 출발의 순간입니다.",
    tags: ['루이스헤이', '확언', '재탄생', '치유']
  },
  {
    id: 'heal-14',
    quote: "어둠을 쫓아내기 위해 어둠과 싸울 필요는 없다. 오직 불을 켜면 어둠은 스스로 물러난다.",
    author: "마하트마 간디",
    source: "간디 자서전",
    category: 'healing_love',
    categoryName: '치유 & 하트',
    categoryColor: 'text-rose-400',
    categoryIcon: '🌿',
    resonance: "부정적인 생각과 싸우느라 에너지를 소모하지 말고, 가슴속에 사랑과 감사의 불씨를 밝히세요.",
    tags: ['빛과어둠', '간디', '사랑의힘', '치유']
  },

  // ==========================================
  // 7. 우주 & 초월진리 (cosmos_truth)
  // ==========================================
  {
    id: 'cosmos-01',
    quote: "우리는 별들의 먼지(Stardust)로 만들어진 존재이며, 우주가 스스로를 인식하기 위한 생각하는 창이다.",
    author: "칼 세이건 (Carl Sagan)",
    source: "코스모스 (Cosmos)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "당신은 광막한 우주에 던져진 보잘것없는 티끌이 아니라, 우주 138억 년의 역사가 빚어낸 찬란한 지성이자 기적입니다.",
    tags: ['코스모스', '칼세이건', '스타더스트', '우주']
  },
  {
    id: 'cosmos-02',
    quote: "천지만물은 나와 한 몸이며, 도와 나는 결코 둘로 나뉠 수 없다.",
    author: "장자 (Zhuangzi)",
    source: "장자 제물론 (齊物論)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "시비분별과 나/남의 경계를 지우고 우주 만물과 하나로 춤추는 대자유(逍遙遊)를 누리세요.",
    tags: ['장자', '제물론', '만물일체', '자유']
  },
  {
    id: 'cosmos-03',
    quote: "인생에서 가장 아름다운 경험은 '신비로움'을 마주하는 것이다. 그것이야말로 모든 참된 예술과 과학의 원천이다.",
    author: "알베르트 아인슈타인",
    source: "나의 세계관 (The World As I See It)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "알 수 없는 우주의 신비 앞에 겸허히 감탄할 수 있는 가슴이야말로 진정 살아 숨 쉬는 지혜로운 자의 특권입니다.",
    tags: ['신비', '경외감', '아인슈타인', '우주의식']
  },
  {
    id: 'cosmos-04',
    quote: "신은 곧 자연이자 우주 전체이며(Deus sive Natura), 모든 것은 무한한 신성한 본질의 필연적 발현이다.",
    author: "바뤼흐 스피노자",
    source: "에티카 (Ethica)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "두려움과 맹신을 넘어 우주 전체를 살아 숨 쉬는 신성으로 바라볼 때, 우리는 영원의 관점(Sub specie aeternitatis)에서 지극한 지복을 얻습니다.",
    tags: ['스피노자', '에티카', '범신론', '지복']
  },
  {
    id: 'cosmos-05',
    quote: "우주의 모든 위대한 비밀을 밝혀내고 싶다면, 에너지와 주파수, 그리고 진동(Vibration)의 관점에서 생각하라.",
    author: "니콜라 테슬라",
    source: "테슬라 회고록",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "모든 물질과 감정은 고유한 주파수를 지닙니다. 당신의 의식 진동을 높일 때 더 높은 차원의 기적이 현실로 끌려옵니다.",
    tags: ['테슬라', '에너지', '주파수', '진동']
  },
  {
    id: 'cosmos-06',
    quote: "의식이야말로 물질의 근본이며, 모든 물질은 의식이라는 보이지 않는 매트릭스 위에서만 파동 친다.",
    author: "막스 플랑크",
    source: "양자역학 강연록",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "물질적인 한계에 갇혀 절망하지 마세요. 당신의 순수한 관찰과 의식의 선택이 물질세계를 빚어내는 궁극의 원동력입니다.",
    tags: ['양자역학', '막스플랑크', '의식의근원', '창조']
  },
  {
    id: 'cosmos-07',
    quote: "참된 영혼은 칼로 벨 수 없고, 불로 태울 수 없으며, 물에 젖지 않고, 바람에 마르지 않는 불멸의 존재이다.",
    author: "바가바드 기타 (Bhagavad Gita)",
    source: "바가바드 기타 2장 23절",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "육체의 죽음과 쇠락을 두려워하지 마세요. 당신의 영원한 영혼은 영원토록 흠 없이 빛나는 우주의 거룩한 빛입니다.",
    tags: ['바가바드기타', '불멸의영혼', '아트만', '초월']
  },
  {
    id: 'cosmos-08',
    quote: "그것이 바로 너다 (Tat Tvam Asi). 온 우주의 궁극적인 본질과 당신의 가장 깊은 참자아는 결코 둘이 아니다.",
    author: "찬도가 우파니샤드",
    source: "우파니샤드 (Upanishads)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "분리감이라는 환상의 베일을 걷어내면, 당신이 곧 별을 운행하고 생명을 숨 쉬게 하는 우주의 거룩한 중심입니다.",
    tags: ['우파니샤드', '타트트밤아시', '범아일여', '합일']
  },
  {
    id: 'cosmos-09',
    quote: "당신은 우주에 던져진 외로운 이방인이 아니다. 파도가 바다에서 솟아오르듯, 당신은 우주가 피워낸 찬란한 생명의 파도이다.",
    author: "앨런 와츠 (Alan Watts)",
    source: "지혜의 길 (The Book)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "우주와 싸우거나 분투할 필요가 없습니다. 당신은 온 우주가 138억 년 동안 정성껏 빚어낸 거룩한 꽃봉오리입니다.",
    tags: ['앨런와츠', '자연스러움', '우주와의하나됨', '생명']
  },
  {
    id: 'cosmos-10',
    quote: "같은 강물에 발을 두 번 담글 수 없나니, 만물은 끊임없이 생성되고 변화하며 거룩하게 흐른다.",
    author: "헤라클레이토스",
    source: "자연에 관하여 단편",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "변화를 두려워하며 낡은 과거를 붙잡지 마세요. 끊임없는 유전(Panta Rhei) 속에서 매 순간 새로운 나로 거듭나세요.",
    tags: ['만물유전', '변화의지혜', '헤라클레이토스', '흐름']
  },
  {
    id: 'cosmos-11',
    quote: "가장 거대한 형상은 모양이 없고(大象無形), 가장 위대한 도(道)는 고요하여 이름이 없도다.",
    author: "노자 (Laozi)",
    source: "도덕경 41장",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "작은 잣대로 세상과 자신을 규정짓지 마세요. 무한한 허공처럼 열려 있을 때 만유의 지혜가 당신을 채웁니다.",
    tags: ['대상무형', '도덕경', '무한성', '허공']
  },
  {
    id: 'cosmos-12',
    quote: "과거, 현재, 미래의 구분이란 지극히 집요하게 지속되는 환상(Illusion)에 불과하다.",
    author: "알베르트 아인슈타인",
    source: "베소에게 보낸 편지",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "시간의 강박에서 벗어나 영원한 지금(Eternal Now) 속에 닻을 내리세요. 모든 가능성은 바로 지금 이 순간에 존재합니다.",
    tags: ['상대성이론', '시간의초월', '영원한현재', '아인슈타인']
  },
  {
    id: 'cosmos-13',
    quote: "한 잔의 와인 속에 온 우주가 담겨 있다. 물리학, 화학, 생물학, 그리고 별들의 모든 역사가 그 안에서 춤춘다.",
    author: "리처드 파인만",
    source: "파인만의 물리학 강의",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "지금 당신이 마시는 한 모금의 물, 스치는 한 줄기 바람 속에 온 우주의 삼라만상이 거룩하게 깃들어 있습니다.",
    tags: ['파인만', '와인과우주', '경이로움', '만물연결']
  },
  {
    id: 'cosmos-14',
    quote: "내가 나비가 된 꿈을 꾸었는가, 나비가 내가 된 꿈을 꾸고 있는가. 경계를 넘어설 때 지극한 자유가 열린다.",
    author: "장자 (Zhuangzi)",
    source: "장자 제물론 호접지몽 (胡蝶之夢)",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "꿈과 생시, 나와 너의 분별을 잊고 온 우주의 거대한 꿈결 위에서 자유롭게 노니는 대자유를 누리세요.",
    tags: ['호접지몽', '장자', '경계초월', '물아일체']
  },
  {
    id: 'cosmos-15',
    quote: "광대한 우주의 깊은 침묵 속에서, 별들은 당신의 영혼이 진정한 본향으로 귀환하기를 영원히 기다리고 있다.",
    author: "칼 세이건",
    source: "잊혀진 조상의 그림자",
    category: 'cosmos_truth',
    categoryName: '우주 & 초월진리',
    categoryColor: 'text-cyan-400',
    categoryIcon: '✨',
    resonance: "외로움에 지칠 때 밤하늘을 올려다보세요. 당신은 저 무한한 별들의 고향에서 온 찬란한 영적 순례자입니다.",
    tags: ['우주적귀환', '칼세이건', '별들의고향', '영적순례']
  }
];

export function getDailyInsight(category: InsightCategory = 'all', seedOffset: number = 0): UniverseInsightItem {
  const filtered = category === 'all' 
    ? UNIVERSE_INSIGHTS 
    : UNIVERSE_INSIGHTS.filter(item => item.category === category);
  
  if (filtered.length === 0) return UNIVERSE_INSIGHTS[0];

  // Daily deterministic index based on YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  // Deterministic hash to evenly distribute across days
  let hash = 0x811c9dc5;
  for (let i = 0; i < dateStr.length; i++) {
    hash ^= dateStr.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash = Math.abs(hash + seedOffset);

  const index = hash % filtered.length;
  return filtered[index];
}

export function getRandomInsight(category: InsightCategory = 'all', excludeId?: string): UniverseInsightItem {
  const filtered = category === 'all'
    ? UNIVERSE_INSIGHTS
    : UNIVERSE_INSIGHTS.filter(item => item.category === category);
  
  const pool = excludeId ? filtered.filter(item => item.id !== excludeId) : filtered;
  const targetPool = pool.length > 0 ? pool : filtered;
  const randomIndex = Math.floor(Math.random() * targetPool.length);
  return targetPool[randomIndex];
}
