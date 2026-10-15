export interface TarotCardBackTheme {
  id: string;
  nameKo: string;
  nameEn: string;
  category: 'cosmic' | 'sacred' | 'nature' | 'mystic' | 'classic' | 'modern';
  categoryLabelKo: string;
  badge: string;
  description: string;
  accentColor: string;
  borderClass: string;
}

export const TAROT_CARD_BACKS: TarotCardBackTheme[] = [
  {
    id: 'celestial_gold',
    nameKo: '셀레스티얼 골드',
    nameEn: 'Celestial Gold',
    category: 'sacred',
    categoryLabelKo: '신성기하학',
    badge: '시그니처',
    description: '황금빛 태양과 달, 메타트론 큐브와 성좌가 수놓인 클래식 천상 기하학',
    accentColor: '#eab308',
    borderClass: 'border-amber-400/50',
  },
  {
    id: 'cosmic_midnight',
    nameKo: '코스믹 미드나잇',
    nameEn: 'Cosmic Midnight',
    category: 'cosmic',
    categoryLabelKo: '심우주 성운',
    badge: '베스트',
    description: '칠흑의 심우주 속 은하수 성운과 보랏빛 신비가 소용돌이치는 코스믹 벨벳',
    accentColor: '#8b5cf6',
    borderClass: 'border-purple-400/50',
  },
  {
    id: 'mystic_moon',
    nameKo: '미스틱 문라이트',
    nameEn: 'Mystic Moonlight',
    category: 'mystic',
    categoryLabelKo: '오컬트 문',
    badge: '인기',
    description: '은빛 초승달의 주기와 고대 수호 룬 문자 마법진이 깃든 신비의 달',
    accentColor: '#38bdf8',
    borderClass: 'border-sky-400/50',
  },
  {
    id: 'cyber_quantum',
    nameKo: '사이버 퀀텀 네온',
    nameEn: 'Cyber Quantum Neon',
    category: 'modern',
    categoryLabelKo: '미래 사이버',
    badge: '트렌드',
    description: '홀로그래픽 시안 그리드와 마젠타 네온 레이저가 교차하는 영점 차원',
    accentColor: '#06b6d4',
    borderClass: 'border-cyan-400/50',
  },
  {
    id: 'botanical_vintage',
    nameKo: '보태니컬 빈티지',
    nameEn: 'Botanical Herbs',
    category: 'nature',
    categoryLabelKo: '자연·치유',
    badge: '힐링',
    description: '달맞이꽃과 세이지 약초, 황금 월계수 잎맥이 어우러진 앤틱 식물 도감',
    accentColor: '#84cc16',
    borderClass: 'border-lime-500/50',
  },
  {
    id: 'mystic_cat',
    nameKo: '묘연(猫緣) 캣 타로',
    nameEn: 'Mystic Familiar Cat',
    category: 'mystic',
    categoryLabelKo: '패밀리어',
    badge: '매니아',
    description: '보름달 아래 영험한 검은 고양이와 오망성 수호 펜타클의 신비로운 조우',
    accentColor: '#f43f5e',
    borderClass: 'border-rose-400/50',
  },
  {
    id: 'five_elements_emerald',
    nameKo: '오행 비취 에메랄드',
    nameEn: 'Five Elements Emerald',
    category: 'nature',
    categoryLabelKo: '사주·오행',
    badge: '행운',
    description: '청옥빛 에메랄드 옥환과 생명의 나무, 음양오행의 조화로운 생기',
    accentColor: '#10b981',
    borderClass: 'border-emerald-400/50',
  },
  {
    id: 'solfeggio_violet',
    nameKo: '솔페지오 바이올렛',
    nameEn: 'Solfeggio Harmonic Violet',
    category: 'sacred',
    categoryLabelKo: '주파수 치유',
    badge: '528Hz',
    description: '사랑과 DNA 복원의 528Hz 주파수 동심원 파동과 자수정 만다라',
    accentColor: '#a855f7',
    borderClass: 'border-violet-400/50',
  },
  {
    id: 'sedona_red_rock',
    nameKo: '세도나 붉은 석양',
    nameEn: 'Sedona Red Sunset',
    category: 'nature',
    categoryLabelKo: '볼텍스',
    badge: '정화',
    description: '세도나 대지의 붉은 암석 볼텍스와 지평선 너머 타오르는 황금빛 일몰',
    accentColor: '#f97316',
    borderClass: 'border-orange-400/50',
  },
  {
    id: 'hoponopono_pearl',
    nameKo: '호오포노포노 펄',
    nameEn: 'Ho\'oponopono Pure Pearl',
    category: 'nature',
    categoryLabelKo: '하와이안',
    badge: '순백',
    description: '청정 태평양의 투명한 물결과 무지개빛 광채를 머금은 순결한 진주',
    accentColor: '#2dd4bf',
    borderClass: 'border-teal-400/50',
  },
  {
    id: 'golden_scarab',
    nameKo: '골든 스카라브',
    nameEn: 'Golden Egyptian Scarab',
    category: 'mystic',
    categoryLabelKo: '고대 이집트',
    badge: '태양신',
    description: '고대 이집트 태양신 라의 부활 풍뎅이와 호루스의 전지적 눈',
    accentColor: '#f59e0b',
    borderClass: 'border-amber-500/50',
  },
  {
    id: 'dark_gothic',
    nameKo: '다크 고딕 벨벳',
    nameEn: 'Dark Gothic Velvet',
    category: 'mystic',
    categoryLabelKo: '고딕 벨벳',
    badge: '다크',
    description: '흑요석의 깊은 그림자와 버건디 와인 벨벳, 고딕 성당의 장미창 문양',
    accentColor: '#e11d48',
    borderClass: 'border-rose-600/50',
  },
  {
    id: 'classic_waite',
    nameKo: '클래식 라이더-웨이트',
    nameEn: 'Classic Rider-Waite Cross',
    category: 'classic',
    categoryLabelKo: '오리지널',
    badge: '정통 1909',
    description: '1909년 아서 에드워드 웨이트와 파멜라 스미스의 전통 체크 십자가와 붉은 장미',
    accentColor: '#3b82f6',
    borderClass: 'border-blue-400/50',
  },
  {
    id: 'aurora_borealis',
    nameKo: '오로라 보레알리스',
    nameEn: 'Aurora Borealis',
    category: 'cosmic',
    categoryLabelKo: '극광',
    badge: '환상',
    description: '극지방의 맑은 설원 위로 춤추는 영롱한 에메랄드빛 천상의 오로라 커튼',
    accentColor: '#34d399',
    borderClass: 'border-emerald-300/50',
  },
  {
    id: 'solomon_pentacle',
    nameKo: '솔로몬의 황금 인장',
    nameEn: 'Solomon Gold Pentacle',
    category: 'sacred',
    categoryLabelKo: '대천사 수호',
    badge: '수호',
    description: '지혜의 왕 솔로몬의 육망성과 대천사 미카엘의 불꽃 방패 수호진',
    accentColor: '#fbbf24',
    borderClass: 'border-yellow-400/60',
  },
  {
    id: 'obsidian_minimal',
    nameKo: '옵시디언 미니멀',
    nameEn: 'Obsidian Minimalist',
    category: 'modern',
    categoryLabelKo: '미니멀',
    badge: '모던',
    description: '절제된 매트 블랙 바디와 섬세한 헤어라인 실버 기하학 라인의 극치',
    accentColor: '#94a3b8',
    borderClass: 'border-slate-400/40',
  },
  {
    id: 'sacred_mandala',
    nameKo: '신성 로터스 만다라',
    nameEn: 'Sacred Lotus Mandala',
    category: 'sacred',
    categoryLabelKo: '차크라 연꽃',
    badge: '영성',
    description: '1000장의 연꽃잎이 개화하며 우주 의식과 합일되는 사하스라라 만다라',
    accentColor: '#ec4899',
    borderClass: 'border-pink-400/50',
  },
  {
    id: 'alchemical_ouroboros',
    nameKo: '연금술 우로보로스',
    nameEn: 'Alchemical Ouroboros',
    category: 'mystic',
    categoryLabelKo: '연금술',
    badge: '불멸',
    description: '자신의 꼬리를 문 영원의 뱀 우로보로스와 불·물·흙·공기 4원소 연금 인장',
    accentColor: '#d97706',
    borderClass: 'border-amber-600/50',
  },
  {
    id: 'starlight_constellation',
    nameKo: '황도 12궁 성좌도',
    nameEn: 'Zodiac Constellation Map',
    category: 'cosmic',
    categoryLabelKo: '점성학',
    badge: '아스트로',
    description: '황도 12궁의 고대 라틴 성좌도와 북극성으로 향하는 천구의 나침반',
    accentColor: '#60a5fa',
    borderClass: 'border-blue-400/50',
  },
  {
    id: 'rose_gold_angel',
    nameKo: '로즈골드 엔젤 윙',
    nameEn: 'Rose Gold Angel Wings',
    category: 'sacred',
    categoryLabelKo: '천사의 날개',
    badge: '포근함',
    description: '수호천사의 부드러운 깃털 날개와 따스한 로즈골드빛 축복 헤일로',
    accentColor: '#fb7185',
    borderClass: 'border-rose-300/50',
  },
];

export const DEFAULT_TAROT_CARD_BACK_ID = 'celestial_gold';

const STORAGE_KEY = 'luckey_tarot_card_back_id';

export function getSavedTarotCardBackId(): string {
  if (typeof window === 'undefined') return DEFAULT_TAROT_CARD_BACK_ID;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && TAROT_CARD_BACKS.some((b) => b.id === saved)) {
      return saved;
    }
  } catch (_) {}
  return DEFAULT_TAROT_CARD_BACK_ID;
}

export function saveTarotCardBackId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent('luckey-tarot-card-back-changed', { detail: { cardBackId: id } }));
  } catch (_) {}
}

export function getTarotCardBackTheme(id?: string): TarotCardBackTheme {
  const targetId = id || getSavedTarotCardBackId();
  return (
    TAROT_CARD_BACKS.find((b) => b.id === targetId) ||
    TAROT_CARD_BACKS[0]
  );
}
