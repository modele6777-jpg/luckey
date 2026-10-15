import { getDateSeed } from './dailyCache';
import type { UserProfile } from './sharedState';
import { MUSE_ART_CATALOG } from './museDailyArt';

export type MasterpieceCategory = 'painting' | 'music' | 'poem' | 'quote';

export interface MasterArtwork {
  id: string;
  piece: string;
  pieceOriginal?: string;
  medium: string;
  imageUrl?: string;
  originalMuseum?: string;
  masterpieceInsight: string;
  masterDirectAdvice: string;
  creativeSparkTechnique: string;
  colorPalette: string[];
  inspirationAffirmation?: string;
  // Category specific payloads
  musicVideoId?: string;
  musicArtist?: string;
  musicListeningGuide?: string;
  poemText?: string;
  poet?: string;
  quoteText?: string;
  quoteSource?: string;
}

export interface MasterItem {
  id: string;
  name: string;
  title: string;
  piece: string;
  medium: string;
  category: MasterpieceCategory;
  icon: string;
  imageUrl?: string;
  originalMuseum?: string;
  musicVideoId?: string;
  musicArtist?: string;
  musicListeningGuide?: string;
  poemText?: string;
  poet?: string;
  quoteText?: string;
  quoteSource?: string;
  masterpieceInsight: string;
  masterDirectAdvice: string;
  creativeSparkTechnique: string;
  colorPalette: string[];
  inspirationAffirmation: string;
  artworks: MasterArtwork[];
}

export interface MasterpieceDialogueData {
  title: string;
  masterName: string;
  masterTitle: string;
  masterpieceName: string;
  masterpieceMedium: string;
  category: MasterpieceCategory;
  masterpieceInsight: string;
  masterDirectAdvice: string;
  creativeSparkTechnique: string;
  colorPalette: string[];
  inspirationAffirmation: string;
  // Category specific payloads
  musicVideoId?: string;
  musicArtist?: string;
  musicListeningGuide?: string;
  poemText?: string;
  poet?: string;
  quoteText?: string;
  quoteSource?: string;
  originalMuseum?: string;
}

export const MASTERS_CATALOG: MasterItem[] = [
  // 1. 빈센트 반 고흐 (Vincent van Gogh)
  {
    id: 'vangogh',
    name: '빈센트 반 고흐 (Vincent van Gogh)',
    title: '불꽃의 영혼 화가',
    piece: '별이 빛나는 밤 (The Starry Night, 1889)',
    medium: '유화 (Oil on Canvas) · 뉴욕 현대미술관(MoMA) 소장',
    category: 'painting',
    icon: '🌌',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    originalMuseum: '뉴욕 현대미술관 (The Museum of Modern Art, MoMA)',
    masterpieceInsight: '가장 짙고 불안한 어둠 속에서도 11개의 별과 황금빛 초승달은 격렬한 소용돌이로 타오르고 있습니다. 고통과 고독은 결코 장애물이 아니라, 영혼의 가장 찬란한 빛을 토해내게 만드는 거룩한 용광로입니다.',
    masterDirectAdvice: '나의 소중한 벗이여, 마음속의 폭풍과 정체기를 두려워하지 마십시오. 머리로 계산하고 남들의 눈치를 보지 말고, 심장의 심연에서 끓어오르는 순수한 감정의 원형을 세상에 쏟아내십시오. 그대의 상처가 바로 별이 빛나는 밤의 붓질이 됩니다.',
    creativeSparkTechnique: '임파스토(Impasto) 직관 돌파: 생각을 거치지 않고 가장 두텁고 솔직한 질감으로 지금 느껴지는 감정을 캔버스나 노트에 거침없이 쏟아붓기',
    colorPalette: ['#1E3A8A (심연의 딥 울트라마린)', '#F59E0B (소용돌이치는 황금빛 별)', '#065F46 (영원의 사이프러스 딥 그린)'],
    inspirationAffirmation: '나는 내 안의 모든 고뇌와 어둠을 눈부신 창조적 영감의 별빛으로 승화시킨다.',
    artworks: [
      {
        id: 'vg_starry_night',
        piece: '별이 빛나는 밤 (The Starry Night, 1889)',
        medium: '유화 (Oil on Canvas) · 뉴욕 현대미술관(MoMA) 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        originalMuseum: '뉴욕 현대미술관 (The Museum of Modern Art, MoMA)',
        masterpieceInsight: '생 레미 정신병원 창살 너머로 바라본 밤하늘의 소용돌이는 고통을 찬란한 우주적 생명력으로 승화시킨 불멸의 걸작입니다.',
        masterDirectAdvice: '마음속의 폭풍을 억누르지 마십시오. 당신의 고뇌는 가장 눈부신 별빛을 잉태하고 있는 거룩한 소용돌이입니다.',
        creativeSparkTechnique: '임파스토(Impasto) 직관 돌파: 감정을 거침없이 두텁고 솔직하게 쏟아붓기',
        colorPalette: ['#1E3A8A (딥 울트라마린)', '#F59E0B (황금빛 별)', '#065F46 (사이프러스 그린)'],
        inspirationAffirmation: '나는 내 안의 모든 어둠을 눈부신 창조적 별빛으로 승화시킨다.',
      },
      {
        id: 'vg_sunflowers',
        piece: '해바라기 (Sunflowers / Tournesols, 1888)',
        medium: '유화 (Oil on Canvas) · 런던 내셔널 갤러리 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1024px-Vincent_Willem_van_Gogh_127.jpg',
        originalMuseum: '런던 내셔널 갤러리 (The National Gallery, London)',
        masterpieceInsight: '12송이의 해바라기가 뿜어내는 크롬 옐로는 고독과 가난을 뚫고 타오르는 태양 같은 순수한 생명력의 찬가입니다.',
        masterDirectAdvice: '벗이여, 시들거나 꺾인 순간조차 있는 그대로 사랑하십시오. 그대의 생명력은 누구의 인정을 기다릴 필요 없는 찬란한 태양입니다.',
        creativeSparkTechnique: '크롬 옐로 레이어링: 회색빛 걱정 위에 가장 따뜻하고 선명한 노란빛 에너지와 온기를 덧칠하기',
        colorPalette: ['#FBBF24 (크롬 옐로)', '#D97706 (오커 앰버)', '#78350F (생명의 대지 브라운)'],
        inspirationAffirmation: '나는 내 안의 가장 뜨거운 태양빛 열정으로 온 세상을 비춘다.',
      },
      {
        id: 'vg_cafe_terrace',
        piece: '밤의 카페 테라스 (Café Terrace at Night, 1888)',
        medium: '유화 (Oil on Canvas) · 네덜란드 크뢸러 뮐러 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Vincent_Willem_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Yorck%29.jpg/1024px-Vincent_Willem_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Yorck%29.jpg',
        originalMuseum: '네덜란드 크뢸러 뮐러 미술관 (Kröller-Müller Museum)',
        masterpieceInsight: '단 한 방울의 검은 물감도 쓰지 않고 코발트 블루와 유황색 황금빛만으로 밤을 찬란한 축제로 바꾸어 놓았습니다.',
        masterDirectAdvice: '밤의 적막과 막막함에 움츠러들지 마십시오. 어둠 속에서도 불을 밝힌 작은 테라스처럼 그대 내면의 따스한 등불을 켜두세요.',
        creativeSparkTechnique: '보색 대비 축제: 불안한 감정과 대립되는 가장 따뜻한 보색을 동시에 배치해 생동감 찾기',
        colorPalette: ['#1D4ED8 (코발트 블루 밤)', '#FBBF24 (테라스 황금빛)', '#F8FAFC (별빛 페일 화이트)'],
        inspirationAffirmation: '어둠이 깊을수록 내 안의 온화한 등불은 더욱 찬란하게 빛난다.',
      },
      {
        id: 'vg_bedroom',
        piece: '아를의 침실 (The Bedroom in Arles, 1888)',
        medium: '유화 (Oil on Canvas) · 암스테르담 반 고흐 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 반 고흐 미술관 (Van Gogh Museum)',
        masterpieceInsight: '소박한 나무 침대와 두 개의 의자, 라일락 벽면이 절대적인 안식과 평화를 갈망하는 화가의 영혼을 순수하게 담아냅니다.',
        masterDirectAdvice: '서두르지 말고 그대의 일상과 작은 방을 먼저 포근히 안아주십시오. 진정한 예술은 영혼의 고요한 안식에서 싹틉니다.',
        creativeSparkTechnique: '공간의 성역화: 내가 머무는 책상과 공간을 온전히 내면의 쉼과 창조의 신전으로 정돈하기',
        colorPalette: ['#93C5FD (라일락 블루)', '#FDE047 (나무 침대 옐로)', '#86EFAC (창문 페일 그린)'],
        inspirationAffirmation: '나는 소박한 일상의 쉼터 속에서 가장 깊은 평화와 창조의 힘을 얻는다.',
      },
      {
        id: 'vg_rhone',
        piece: '론강의 별이 빛나는 밤 (Starry Night Over the Rhône, 1888)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Starry_Night_Over_the_Rhone.jpg/1280px-Starry_Night_Over_the_Rhone.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '밤하늘의 북두칠성과 론강 물결에 길게 부서져 내리는 아를 거리의 가스등 빛이 신비로운 공명을 이룹니다.',
        masterDirectAdvice: '마음의 호수가 파도칠지라도 괜찮습니다. 흔들리는 물결이야말로 별빛을 더 길고 아름답게 세상에 퍼뜨리는 붓질입니다.',
        creativeSparkTechnique: '리플렉션 하모니: 불안한 감정의 파동을 억누르지 않고 수면의 반사광처럼 유연하게 관찰하기',
        colorPalette: ['#172554 (심야 론강 네이비)', '#FACC15 (가스등 리플렉션 골드)', '#38BDF8 (북두칠성 아쿠아)'],
        inspirationAffirmation: '흔들리는 내 마음의 물결 위로 영원한 별빛이 찬란하게 쏟아져 내린다.',
      },
      {
        id: 'vg_almond',
        piece: '꽃 피는 아몬드 나무 (Almond Blossom, 1890)',
        medium: '유화 (Oil on Canvas) · 암스테르담 반 고흐 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 반 고흐 미술관 (Van Gogh Museum)',
        masterpieceInsight: '가장 혹독한 겨울의 끝, 조카의 탄생을 축하하며 터키석 푸른 하늘을 향해 터뜨린 순백의 꽃망울입니다.',
        masterDirectAdvice: '그대에게도 새로운 봄의 꽃망울이 맺히고 있습니다. 지나간 추위에 매몰되지 마십시오. 순결한 용기로 새 계절을 맞이하세요.',
        creativeSparkTechnique: '봄의 가지 뻗기: 낡은 틀을 깨고 맑은 하늘을 향해 거침없이 새로운 가지를 뻗어 나가듯 새로운 시도를 시작하기',
        colorPalette: ['#06B6D4 (터키석 청록 하늘)', '#FFFFFF (순백의 꽃잎 화이트)', '#78350F (생명의 나뭇가지 세피아)'],
        inspirationAffirmation: '어떤 추위도 나의 봄을 막을 수 없으며, 나는 눈부신 새 생명으로 꽃핀다.',
      },
      {
        id: 'vg_irises',
        piece: '아이리스 (Irises, 1889)',
        medium: '유화 (Oil on Canvas) · J. 폴 게티 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Irises-Vincent_van_Gogh.jpg/1280px-Irises-Vincent_van_Gogh.jpg',
        originalMuseum: '로스앤젤레스 J. 폴 게티 미술관 (J. Paul Getty Museum)',
        masterpieceInsight: '푸른 붓꽃들 사이에 당당히 피어난 단 한 송이의 하얀 붓꽃은 고독 속에서도 스스로의 존엄을 지켜내는 영혼의 표상입니다.',
        masterDirectAdvice: '남들과 다르다고 해서 불안해하지 마십시오. 무리 속에서 홀로 피어난 하얀 붓꽃처럼, 그대의 고유한 다름이 곧 걸작의 중심입니다.',
        creativeSparkTechnique: '솔리터리 하이라이트: 남들과 다른 나의 별난 개성 하나를 찾아 최고의 장점으로 승화시키기',
        colorPalette: ['#4338CA (기품 있는 인디고 퍼플)', '#22C55E (생명의 에메랄드 리프)', '#F8FAFC (홀로 선 순백)'],
        inspirationAffirmation: '나는 나만의 고유한 빛깔로 피어나는 세상에 단 하나뿐인 꽃이다.',
      },
      {
        id: 'vg_wheatfield_crows',
        piece: '까마귀가 나는 밀밭 (Wheatfield with Crows, 1890)',
        medium: '유화 (Oil on Canvas) · 암스테르담 반 고흐 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 반 고흐 미술관 (Van Gogh Museum)',
        masterpieceInsight: '소용돌이치는 짙푸른 폭풍의 하늘과 황금빛 밀밭 사이를 날아오르는 까마귀 떼는 고뇌 속에서도 타오르는 강렬한 생명력의 불꽃입니다.',
        masterDirectAdvice: '폭풍이 몰아치는 혼돈의 날에도 붓을 놓지 마십시오. 당신의 격렬한 감정은 두려움의 대상이 아니라 세상을 뒤흔들 예술의 거대한 에너지입니다.',
        creativeSparkTechnique: '폭풍의 붓질: 불안과 압박감을 억누르지 않고 역동적인 선과 거침없는 에너지로 전환해 쏟아내기',
        colorPalette: ['#1E3A8A (폭풍의 인디고 블루)', '#FBBF24 (타오르는 황금빛 밀밭)', '#09090B (비상하는 까마귀 블랙)'],
        inspirationAffirmation: '나는 거친 폭풍 속에서도 당당하게 날아오르는 불멸의 생명력이다.',
      },
      {
        id: 'vg_potato_eaters',
        piece: '감자 먹는 사람들 (The Potato Eaters, 1885)',
        medium: '유화 (Oil on Canvas) · 암스테르담 반 고흐 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Van-gogh-potato-eaters-1885.jpg/1280px-Van-gogh-potato-eaters-1885.jpg',
        originalMuseum: '네덜란드 암스테르담 반 고흐 미술관 (Van Gogh Museum)',
        masterpieceInsight: '희미한 등불 아래 거친 손으로 수확한 감자를 나누는 노동자들의 진실한 눈빛 속에 인간 삶의 가장 숭고한 존엄이 깃들어 있습니다.',
        masterDirectAdvice: '가식과 화려한 겉치레를 벗어던지십시오. 투박하고 정직한 노동과 진실한 마음이야말로 영혼을 가장 깊이 적시는 예술의 뿌리입니다.',
        creativeSparkTechnique: '정직한 질감: 화려한 기교 대신 거칠고 진솔한 본질의 감각에 온전히 집중하기',
        colorPalette: ['#78350F (대지의 흙빛 브라운)', '#FACC15 (희미한 등불 웜 옐로)', '#18181B (소박한 안식 딥 차콜)'],
        inspirationAffirmation: '나는 삶의 진실하고 소박한 뿌리 속에서 가장 숭고한 아름다움을 길어 올린다.',
      },
      {
        id: 'vg_church_auvers',
        piece: '오베르의 교회 (The Church at Auvers, 1890)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/The_Church_at_Auvers-sur-Oise.jpg/1024px-The_Church_at_Auvers-sur-Oise.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '직선으로 굳어 있던 고딕 성당의 벽체가 푸른 코발트 하늘 아래서 살아 숨 쉬는 유기체처럼 굽이치며 숭고한 영적 파동을 울립니다.',
        masterDirectAdvice: '경직된 세상의 틀에 갇히지 마십시오. 당신의 호흡과 생명력으로 굳어진 형태를 부드럽게 춤추게 만드세요.',
        creativeSparkTechnique: '형태의 유기화: 딱딱한 생각의 벽을 유연하고 리드미컬한 곡선으로 유연하게 풀어보기',
        colorPalette: ['#1D4ED8 (코발트 딥 스카이)', '#EAB308 (성당 지붕의 앤틱 옐로)', '#15803D (생명의 잔디 그린)'],
        inspirationAffirmation: '나는 경직된 세상의 틀을 넘어 살아 숨 쉬는 생명력의 아름다움을 창조한다.',
      },
      {
        id: 'vg_yellow_house',
        piece: '노란 집 (The Yellow House / La Maison Jaune, 1888)',
        medium: '유화 (Oil on Canvas) · 암스테르담 반 고흐 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vincent_van_Gogh_-_The_yellow_house_%28%27The_street%27%29_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_The_yellow_house_%28%27The_street%27%29_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 반 고흐 미술관 (Van Gogh Museum)',
        masterpieceInsight: '남프랑스 아를의 눈부신 햇살 아래 예술가 공동체를 꿈꾸었던 화가의 샛노란 이상향입니다. 고독한 영혼이 타인과 온기를 나누고자 했던 가장 따뜻한 공간의 시편입니다.',
        masterDirectAdvice: '외로운 방황 속에서도 영혼의 보금자리를 짓는 꿈을 포기하지 마십시오. 따스한 노란 집처럼, 그대의 가슴속에 세상을 맞이할 다정한 공간을 열어두세요.',
        creativeSparkTechnique: '빛의 성역 구축: 나만의 창작 공간에 햇살 같은 온기와 희망의 상징물을 두고 매일 축복하기',
        colorPalette: ['#FACC15 (햇살 가득 노란 집 골드)', '#0284C7 (지중해의 코발트 블루)', '#16A34A (창틀의 생명력 그린)'],
        inspirationAffirmation: '나는 내 삶의 중심에 따스한 빛과 우정의 보금자리를 짓는다.',
      },
      {
        id: 'vg_sower',
        piece: '씨 뿌리는 사람 (The Sower / Le Semeur, 1888)',
        medium: '유화 (Oil on Canvas) · 네덜란드 크뢸러 뮐러 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Vincent_van_Gogh_-_The_sower_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_The_sower_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 크뢸러 뮐러 미술관 (Kröller-Müller Museum)',
        masterpieceInsight: '지평선 위로 거대하게 솟아오른 황금빛 태양을 배경으로 대지에 생명의 씨앗을 뿌리는 농부의 장엄한 실루엣입니다. 보이지 않는 미래를 믿고 씨앗을 뿌리는 숭고한 창조의 비유입니다.',
        masterDirectAdvice: '당장 싹이 트지 않는다고 조급해하지 마십시오. 묵묵히 뿌린 모든 영감과 노력의 씨앗은 언젠가 대지를 뒤덮는 찬란한 황금빛 수확으로 되돌아옵니다.',
        creativeSparkTechnique: '매일의 파종 루틴: 결과에 연연하지 않고 오늘 하루 내가 할 수 있는 작은 씨앗 하나를 정성껏 심기',
        colorPalette: ['#EAB308 (거대한 태양의 옐로)', '#4338CA (보랏빛 황혼의 대지)', '#38BDF8 (하늘의 신비로운 틸 블루)'],
        inspirationAffirmation: '나는 미래를 의심치 않고 매일 희망과 사랑의 씨앗을 대지에 심는다.',
      },
      {
        id: 'vg_bandaged_ear',
        piece: '귀에 붕대를 감은 자화상 (Self-Portrait with Bandaged Ear, 1889)',
        medium: '유화 (Oil on Canvas) · 런던 코톨드 갤러리 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Vincent_van_Gogh_-_Self-Portrait_with_Bandaged_Ear_-_Google_Art_Project.jpg/1024px-Vincent_van_Gogh_-_Self-Portrait_with_Bandaged_Ear_-_Google_Art_Project.jpg',
        originalMuseum: '영국 런던 코톨드 갤러리 (The Courtauld Gallery)',
        masterpieceInsight: '치명적인 정신적 붕괴와 극심한 상처 속에서도 다시 붓을 들고 이젤 앞에 선 불굴의 예술혼입니다. 상처 입은 육신 뒤로 걸린 일본 판화는 예술을 향한 꺼지지 않는 갈망을 증언합니다.',
        masterDirectAdvice: '상처를 부끄러워하거나 숨기지 마십시오. 붕대를 감고도 붓을 놓지 않은 저처럼, 상처 입은 자화상이야말로 삶과 화해하고 다시 일어서는 영혼의 가장 진실한 승리입니다.',
        creativeSparkTechnique: '상처의 직면과 화해: 나의 연약함과 실패를 회피하지 않고 작품의 솔직한 중심 주제로 승화시키기',
        colorPalette: ['#15803D (작업복 딥 그린)', '#DC2626 (치열한 고뇌의 레드)', '#FEF08A (붕대와 캔버스의 크림 화이트)'],
        inspirationAffirmation: '어떤 시련과 상처도 나의 불꽃같은 예술혼을 결코 꺾을 수 없다.',
      },
      {
        id: 'vg_eternitys_gate',
        piece: '영원의 문턱에서 (At Eternity\'s Gate / Sorrowing Old Man, 1890)',
        medium: '유화 (Oil on Canvas) · 네덜란드 크뢸러 뮐러 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Van_Gogh_-_Trauernder_alter_Mann.jpeg/1024px-Van_Gogh_-_Trauernder_alter_Mann.jpeg',
        originalMuseum: '네덜란드 크뢸러 뮐러 미술관 (Kröller-Müller Museum)',
        masterpieceInsight: '난롯가에서 두 손으로 얼굴을 감싸 쥔 노인의 모습은 깊은 슬픔과 실존적 고뇌를 표현하면서도, 영원한 안식과 구원을 향한 지극한 기도를 담고 있습니다.',
        masterDirectAdvice: '때로는 마음껏 슬퍼하고 울어도 괜찮습니다. 두 손으로 얼굴을 감싼 채 쏟아내는 눈물은 영혼을 씻어내고 영원의 문턱에서 다시 빛을 맞이하게 합니다.',
        creativeSparkTechnique: '카타르시스 방출: 억눌린 슬픔과 울분을 온전히 흘려보내며 마음의 공간을 깨끗이 비워내기',
        colorPalette: ['#1E3A8A (깊은 슬픔의 블루)', '#D97706 (난롯가의 따스한 오커)', '#71717A (세월의 지혜 실버)'],
        inspirationAffirmation: '나의 가장 깊은 고뇌의 눈물은 영원한 평화와 빛으로 승화된다.',
      }
    ]
  },

  // 2. 클로드 모네 (Claude Monet)
  {
    id: 'monet',
    name: '클로드 모네 (Claude Monet)',
    title: '빛과 시간의 연금술사',
    piece: '수련 연작 (Water Lilies / Nymphéas, 1914–1926)',
    medium: '인상주의 유화 · 파리 오랑주리 미술관 / 메트로폴리탄 미술관 소장',
    category: 'painting',
    icon: '🪷',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg',
    originalMuseum: '파리 오랑주리 미술관 (Musée de l\'Orangerie) / 뉴욕 메트로폴리탄 미술관 (The Met)',
    masterpieceInsight: '지평선도 경계도 없는 수면 위에 하늘과 구름, 버드나무와 수련이 끝없이 겹쳐집니다. 고정된 실체란 없습니다. 끊임없이 흐르고 변화하는 빛의 찰나를 온몸으로 포착할 때 영원은 지금 이 순간에 깃듭니다.',
    masterDirectAdvice: '그대여, 완벽한 결과를 통제하려는 긴장을 내려놓으십시오. 수면이 바람에 흔들리듯 모든 상태를 그대로 허용하세요. 선명한 윤곽을 그리려 애쓰지 말고, 순간순간 스쳐 지나가는 빛과 감각의 부드러운 인상에 그저 몸을 맡기십시오.',
    creativeSparkTechnique: '연작(Series)의 시선: 하나의 대상을 시간의 흐름(새벽, 정오, 황혼)에 따라 가볍게 연속해서 스케치하며 집착을 해체하기',
    colorPalette: ['#38BDF8 (빛을 머금은 수면 스카이블루)', '#A855F7 (오후의 라벤더 바이올렛)', '#10B981 (생명의 부유 수련 에메랄드)'],
    inspirationAffirmation: '나는 흐르는 시간의 찰나 속에서 무한한 빛과 평화를 자유롭게 직조한다.',
    artworks: [
      {
        id: 'monet_water_lilies',
        piece: '수련 연작 (Water Lilies / Nymphéas, 1914–1926)',
        medium: '인상주의 유화 · 파리 오랑주리 미술관 / 메트로폴리탄 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오랑주리 미술관 (Musée de l\'Orangerie)',
        masterpieceInsight: '지평선도 경계도 없는 수면 위에 하늘과 구름, 버드나무와 수련이 끝없이 겹쳐지며 시공간의 무한한 평화를 선물합니다.',
        masterDirectAdvice: '완벽한 결과를 통제하려는 긴장을 내려놓으십시오. 흔들리는 물결처럼 모든 상태를 허용할 때 영원은 지금 이 순간에 깃듭니다.',
        creativeSparkTechnique: '연작(Series)의 시선: 집착을 버리고 시간의 흐름에 따라 변화하는 감각의 결을 부드럽게 관찰하기',
        colorPalette: ['#38BDF8 (스카이블루)', '#A855F7 (라벤더 바이올렛)', '#10B981 (에메랄드)'],
        inspirationAffirmation: '나는 흐르는 시간의 찰나 속에서 무한한 빛과 평화를 자유롭게 직조한다.',
      },
      {
        id: 'monet_sunrise',
        piece: '인상, 해돋이 (Impression, Sunrise / Impression, soleil levant, 1872)',
        medium: '인상주의 유화 · 파리 마르모탕 모네 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg',
        originalMuseum: '파리 마르모탕 모네 미술관 (Musée Marmottan Monet)',
        masterpieceInsight: '안개 낀 항구 위로 솟아오르는 붉은 태양이 미술사의 새로운 장을 열었습니다. 정형화된 형태 대신 찰나의 강렬한 인상을 포착했습니다.',
        masterDirectAdvice: '세상의 고루한 비평에 얽매이지 마십시오. 그대 눈에 비친 찰나의 떨림과 인상이 곧 당신만의 위대한 오리지널리티입니다.',
        creativeSparkTechnique: '알라 프리마(Alla Prima): 생각을 비우고 첫인상이 주는 원초적 감각을 캔버스나 노트에 빠르게 스케치하기',
        colorPalette: ['#EA580C (떠오르는 붉은 태양 오렌지)', '#64748B (항구의 새벽 안개 그레이)', '#0369A1 (바다의 심연 딥 블루)'],
        inspirationAffirmation: '나는 기존의 틀을 깨고 매 순간 세상을 새롭게 탄생시키는 아침 해다.',
      },
      {
        id: 'monet_woman_parasol',
        piece: '양산을 쓴 여인 (Woman with a Parasol - Madame Monet and Her Son, 1875)',
        medium: '유화 (Oil on Canvas) · 워싱턴 국립미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg/1024px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg',
        originalMuseum: '워싱턴 국립미술관 (National Gallery of Art, Washington D.C.)',
        masterpieceInsight: '언덕 위에서 부드러운 여름 바람을 맞으며 뒤돌아보는 카미유의 베일과 드레스가 보이지 않는 바람의 결을 가시화합니다.',
        masterDirectAdvice: '그대를 스쳐 가는 보이지 않는 바람의 감촉에 집중하십시오. 영혼을 간지럽히는 바람의 흐름에 몸을 맡길 때 가장 자유로운 표현이 터져 나옵니다.',
        creativeSparkTechnique: '바람의 붓질: 정지된 상태 대신 흐름과 운동감이 느껴지는 사선과 곡선의 역동성을 살리기',
        colorPalette: ['#93C5FD (눈부신 여름 하늘)', '#FEF08A (양산의 햇살 크림)', '#4ADE80 (바람에 춤추는 풀잎 초록)'],
        inspirationAffirmation: '나는 나를 스쳐 가는 모든 순간의 바람과 빛을 자유롭게 온몸으로 호흡한다.',
      },
      {
        id: 'monet_poppy_field',
        piece: '아르장퇴유의 양귀비 꽃밭 (Poppy Field, 1873)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Claude_Monet_-_Coquelicots.jpg/1280px-Claude_Monet_-_Coquelicots.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '완만한 언덕을 따라 붉은 반점으로 흐드러지게 피어난 양귀비 꽃밭이 전원의 평화로움과 빛의 향연을 노래합니다.',
        masterDirectAdvice: '사소한 디테일에 갇히지 말고 전체적인 색채의 리듬을 타십시오. 빨간 꽃잎처럼 가슴을 뛰게 하는 즐거운 요소들을 삶의 들판에 흩뿌리세요.',
        creativeSparkTechnique: '색채 점묘의 율동: 세밀한 묘사 대신 순수한 원색의 경쾌한 리듬으로 기쁨을 빠르게 배치하기',
        colorPalette: ['#DC2626 (선명한 양귀비 레드)', '#84CC16 (화사한 잔디 라임)', '#BAE6FD (맑은 전원 스카이블루)'],
        inspirationAffirmation: '내 삶의 들판은 매 순간 찬란한 환희와 평화로운 기쁨으로 만발한다.',
      },
      {
        id: 'monet_saint_lazare',
        piece: '생라자르 기차역 (Gare Saint-Lazare, 1877)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Claude_Monet_-_The_Saint-Lazare_Station_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_The_Saint-Lazare_Station_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '증기 기관차가 뿜어내는 푸른 연기와 유리 지붕을 뚫고 쏟아지는 햇살이 산업혁명 도시의 역동성을 신비로운 빛의 성전으로 바꿉니다.',
        masterDirectAdvice: '분주한 일상 속에서도 얼마든지 찬란한 미학적 빛을 발견할 수 있습니다. 잿빛 연기마저 빛을 머금으면 푸른 보석이 됩니다.',
        creativeSparkTechnique: '증기광 효과: 흐릿한 잡념과 복잡한 상황을 빛의 프리즘으로 투과시켜 영감의 배경으로 변환하기',
        colorPalette: ['#0284C7 (증기 연기의 시안 블루)', '#475569 (철골 구조물 슬레이트)', '#FEF08A (천창 햇살 골드)'],
        inspirationAffirmation: '나는 번잡하고 분주한 세상 속에서도 영롱한 빛의 성전을 창조한다.',
      },
      {
        id: 'monet_japanese_bridge',
        piece: '지베르니의 일본식 다리와 수련 연못 (The Water Lily Pond - Japanese Footbridge, 1899)',
        medium: '유화 (Oil on Canvas) · 런던 내셔널 갤러리 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_Monet_-_The_Water-Lily_Pond_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_The_Water-Lily_Pond_-_Google_Art_Project.jpg',
        originalMuseum: '런던 내셔널 갤러리 (The National Gallery, London)',
        masterpieceInsight: '초록빛 버드나무 덩굴과 수련이 어우러진 연못 위를 아치형으로 가로지르는 목조 다리는 자연과 인간의 영혼이 가장 완벽한 평화로 공존하는 낙원의 풍경입니다.',
        masterDirectAdvice: '당신만의 평화로운 정원을 가꾸십시오. 마음에 피어나는 작은 영감들을 소중히 보살피며, 조용하고 깊은 내면의 연못에서 지혜를 길어 올리세요.',
        creativeSparkTechnique: '내면 정원 가꾸기: 번잡한 외부 자극을 끄고 나만의 고요한 쉼터 이미지를 떠올리며 호흡 가다듬기',
        colorPalette: ['#15803D (싱그러운 버드나무 딥 그린)', '#38BDF8 (맑은 연못의 반영 스카이)', '#FEF08A (수련 꽃망울 크림)'],
        inspirationAffirmation: '내 마음은 언제나 맑은 수면과 싱그러운 생명력이 숨 쉬는 평화로운 낙원이다.',
      },
      {
        id: 'monet_rouen_cathedral',
        piece: '루앙 대성당 (Rouen Cathedral: The Portal, Morning Light, 1894)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Claude_Monet_-_Rouen_Cathedral%2C_the_West_Portal%2C_Dull_Weather_-_Google_Art_Project.jpg/1024px-Claude_Monet_-_Rouen_Cathedral%2C_the_West_Portal%2C_Dull_Weather_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '거대한 돌로 쌓은 차가운 대성당 정면이 아침 햇살을 받아 영롱한 빛의 조각으로 해체되며 빛의 시간에 따른 영적인 변주를 펼쳐 보입니다.',
        masterDirectAdvice: '단단하고 무거운 문제에 짓눌리지 마십시오. 빛의 각도를 바꾸면 거대한 돌벽조차 부드러운 빛의 아지랑이가 됩니다. 새로운 관점으로 바라보십시오.',
        creativeSparkTechnique: '빛의 각도 전환: 해결되지 않는 문제를 완전히 다른 시간대나 다른 기분으로 다시 관찰하기',
        colorPalette: ['#FDE047 (아침 햇살 웜 골드)', '#94A3B8 (석조 성당 페일 그레이)', '#60A5FA (여명 하늘 소프트 블루)'],
        inspirationAffirmation: '나는 어떤 견고한 장벽도 부드럽고 따뜻한 빛의 관점으로 녹여낸다.',
      },
      {
        id: 'monet_the_magpie',
        piece: '까치 (The Magpie / La Pie, 1869)',
        medium: '인상주의 유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Claude_Monet_-_The_Magpie_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_The_Magpie_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '새하얀 눈 덮인 시골 울타리 위에 단 한 마리의 까치가 앉아 있습니다. 햇살을 받은 눈밭의 푸르스름한 그림자와 빛의 찬란한 대조를 통해 고요한 겨울의 신성한 평화를 담아냈습니다.',
        masterDirectAdvice: '단조롭고 차가운 환경이라고 해서 실망하지 마십시오. 새하얀 눈밭 위에 내려앉은 파란 그림자처럼, 차분한 고요 속에서 세상에서 가장 영롱한 빛의 음영을 발견하십시오.',
        creativeSparkTechnique: '음영의 색채 발견: 검은 그림자 대신 푸른빛, 보랏빛 등 숨겨진 반사광의 다채로운 색채를 찾아내기',
        colorPalette: ['#F8FAFC (순백의 눈꽃 크림 화이트)', '#93C5FD (눈밭 위의 푸른 그림자)', '#1E293B (울타리 위의 까치 블랙)'],
        inspirationAffirmation: '나는 가장 차분하고 고요한 순간 속에서도 영롱한 빛의 숨결을 발견한다.',
      },
      {
        id: 'monet_haystacks',
        piece: '짚단 연작 - 늦여름의 아침 (Haystacks / Grainstacks, 1890–1891)',
        medium: '인상주의 유화 · 파리 오르세 미술관 / 시카고 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Claude_Monet_-_Wheatstacks_%28End_of_Summer%2C_Morning_Effect%29_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Wheatstacks_%28End_of_Summer%2C_Morning_Effect%29_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '수확이 끝난 시골 들판의 평범한 짚단이 아침 이슬과 분홍빛 여명 햇살을 받아 거대한 영적 모뉴먼트로 빛납니다. 같은 대상이라도 빛과 시간에 따라 영원히 새로운 우주가 탄생합니다.',
        masterDirectAdvice: '새로운 대상을 찾아 헤매지 마십시오. 당신 곁에 늘 머물던 평범한 일상도 빛과 시선을 바꾸면 경이로운 걸작의 무대가 됩니다. 사물을 관찰하는 당신의 눈을 새롭게 하십시오.',
        creativeSparkTechnique: '일상의 모뉴먼트화: 매일 보던 평범한 사물 하나를 골라 다른 시간대의 빛 아래서 새롭게 스케치하기',
        colorPalette: ['#FDE047 (아침 이슬의 골드)', '#F472B6 (여명의 페일 핑크)', '#854D0E (대지의 수확 브라운)'],
        inspirationAffirmation: '나는 일상의 소박한 풍경 속에서 매 순간 새로운 우주의 빛을 발견한다.',
      },
      {
        id: 'monet_houses_of_parliament',
        piece: '런던 국회의사당, 해질녘 (Houses of Parliament, Sunset, 1904)',
        medium: '유화 (Oil on Canvas) · 프랑스 릴 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Claude_Monet_-_Houses_of_Parliament%2C_Sunset_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Houses_of_Parliament%2C_Sunset_-_Google_Art_Project.jpg',
        originalMuseum: '프랑스 릴 미술관 (Palais des Beaux-Arts de Lille)',
        masterpieceInsight: '템스강의 짙은 안개와 스모그를 뚫고 타오르는 붉은 노을빛이 거대한 고딕 국회의사당의 실루엣을 신비로운 환영처럼 녹여냅니다.',
        masterDirectAdvice: '장애물이나 안개 같은 혼란을 미워하지 마십시오. 안개가 있었기에 햇살이 그토록 신비로운 보랏빛과 붉은빛으로 부서질 수 있었습니다. 혼란은 당신의 빛을 증폭시키는 캔버스입니다.',
        creativeSparkTechnique: '안개 필터링: 불투명하고 막막한 상황을 오히려 신비로운 분위기를 연출하는 미학적 필터로 활용하기',
        colorPalette: ['#EA580C (황혼의 타오르는 오렌지)', '#581C87 (템스강 안개의 딥 퍼플)', '#38BDF8 (강물의 잔물결 아쿠아)'],
        inspirationAffirmation: '어떤 안개와 혼란도 내 안의 타오르는 노을빛 영감을 가릴 수 없다.',
      },
      {
        id: 'monet_camille',
        piece: '카미유의 임종 (Camille Monet on Her Deathbed, 1879)',
        medium: '유화 (Oil on Canvas) · 파리 오르세 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Claude_Monet_-_Camille_sur_son_lit_de_mort.jpg/1280px-Claude_Monet_-_Camille_sur_son_lit_de_mort.jpg',
        originalMuseum: '파리 오르세 미술관 (Musée d\'Orsay)',
        masterpieceInsight: '사랑하는 아내의 마지막 숨결 앞에서도 창백한 얼굴 위로 스쳐 지나가는 회색빛, 푸른빛, 보랏빛 색채의 변화를 붓으로 기록한 슬프도록 잔혹하고 숭고한 예술혼입니다.',
        masterDirectAdvice: '가장 비통한 슬픔의 순간에도 예술가의 눈을 잃지 마십시오. 감정에 매몰되는 대신, 그 슬픔의 결을 색채와 언어로 정직하게 기록할 때 영혼은 상실을 딛고 영원으로 승화됩니다.',
        creativeSparkTechnique: '비극의 미학적 치유: 깊은 상실과 슬픔의 감정을 색채의 결로 기록하며 내면의 치유와 영원한 안식 얻기',
        colorPalette: ['#CBD5E1 (창백한 안식의 페일 그레이)', '#A855F7 (영혼의 승화 소프트 라벤더)', '#3B82F6 (영원한 사랑의 아이스 블루)'],
        inspirationAffirmation: '나는 삶의 가장 깊은 이별과 슬픔마저 거룩한 예술의 빛으로 품어 안는다.',
      },
      {
        id: 'monet_weeping_willow',
        piece: '수양버들 (Weeping Willow, 1918–1919)',
        medium: '유화 (Oil on Canvas) · 파리 오랑주리 미술관 / 킴벨 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Claude_Monet_-_Weeping_Willow_-_Google_Art_Project.jpg/1280px-Claude_Monet_-_Weeping_Willow_-_Google_Art_Project.jpg',
        originalMuseum: '파리 오랑주리 미술관 (Musée de l\'Orangerie)',
        masterpieceInsight: '제1차 세계대전의 비극 속에서 지베르니 정원의 늘어진 수양버들을 거칠고 소용돌이치는 격렬한 붓질로 담아낸 애도의 기념비입니다.',
        masterDirectAdvice: '고개 숙여 울고 있는 수양버들처럼 깊은 슬픔에 잠겨 있을지라도 결코 부러지지 마십시오. 바람에 유연하게 흔들리며 대지로 뿌리를 내리는 버드나무처럼 강인하게 버텨내십시오.',
        creativeSparkTechnique: '버드나무의 유연성: 강한 저항 대신 상황에 맞춰 부드럽게 고개 숙이며 내면의 뿌리를 더 깊이 내리기',
        colorPalette: ['#166534 (슬픔을 견디는 버드나무 딥 그린)', '#B45309 (대지의 인내 오커)', '#1E293B (애도의 심연 흑연)'],
        inspirationAffirmation: '나는 어떤 폭풍 속에서도 부러지지 않고 유연하고 강인하게 다시 일어선다.',
      }
    ]
  },

  // 3. 구스타프 클림트 (Gustav Klimt)
  {
    id: 'klimt',
    name: '구스타프 클림트 (Gustav Klimt)',
    title: '황금빛 관능과 생명의 거장',
    piece: '키스 (The Kiss / Der Kuss, 1907–1908)',
    medium: '금박 유화 (Oil & Gold Leaf) · 오스트리아 벨베데레 궁전 미술관 소장',
    category: 'painting',
    icon: '✨',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
    originalMuseum: '오스트리아 비엔나 벨베데레 궁전 미술관 (Österreichische Galerie Belvedere)',
    masterpieceInsight: '꽃이 만발한 벼랑 끝에서도 두 연인은 순수한 황금빛 아우라로 감싸여 영원한 일체감을 누립니다. 삶의 유한성과 죽음의 그림자조차 진정한 사랑과 창조의 에로스 앞에서는 찬란한 황금으로 변용됩니다.',
    masterDirectAdvice: '예술가여, 그대 자신을 둘러싼 평범한 한계를 거부하십시오. 가장 귀하고 화려한 영감은 바로 그대의 가장 깊은 본능과 순수한 열정 속에 있습니다. 두려움을 화려한 황금빛 장식과 대담한 색채로 감싸 안아 독보적인 아우라를 만드십시오.',
    creativeSparkTechnique: '골든 리프(Gold Leaf) 콘트라스트: 거친 일상의 소재 위에 가장 눈부신 찬란한 디테일(금빛, 빛나는 단어)을 입혀 비범한 상징으로 탈바꿈하기',
    colorPalette: ['#FBBF24 (초월적 오스트리아 임페리얼 골드)', '#E11D48 (생명의 붉은 꽃 루비)', '#312E81 (심연의 미드나이트 인디고)'],
    inspirationAffirmation: '나는 나 자신의 가장 깊은 열정과 생명력을 눈부신 황금빛 걸작으로 빚어낸다.',
    artworks: [
      {
        id: 'klimt_kiss',
        piece: '키스 (The Kiss / Der Kuss, 1907–1908)',
        medium: '금박 유화 (Oil & Gold Leaf) · 오스트리아 벨베데레 궁전 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
        originalMuseum: '오스트리아 비엔나 벨베데레 궁전 미술관 (Österreichische Galerie Belvedere)',
        masterpieceInsight: '꽃이 만발한 벼랑 끝에서도 두 연인은 순수한 황금빛 아우라로 감싸여 영원한 일체감을 누립니다.',
        masterDirectAdvice: '평범한 한계를 거부하십시오. 두려움을 화려한 황금빛 장식과 대담한 색채로 감싸 안아 독보적인 아우라를 만드세요.',
        creativeSparkTechnique: '골든 리프 콘트라스트: 일상의 소재 위에 가장 눈부신 찬란한 디테일을 입혀 비범한 상징으로 탈바꿈하기',
        colorPalette: ['#FBBF24 (임페리얼 골드)', '#E11D48 (루비 레드)', '#312E81 (미드나이트 인디고)'],
        inspirationAffirmation: '나는 내 안의 가장 깊은 열정과 생명력을 눈부신 황금빛 걸작으로 빚어낸다.',
      },
      {
        id: 'klimt_adele',
        piece: '아델레 블로흐-바우어의 초상 I (Portrait of Adele Bloch-Bauer I, 1907)',
        medium: '유화와 금은박 · 뉴욕 노이에 갈러리 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Gustav_Klimt_046.jpg/1024px-Gustav_Klimt_046.jpg',
        originalMuseum: '뉴욕 노이에 갈러리 (Neue Galerie New York)',
        masterpieceInsight: '황금빛 비잔틴 모자이크와 신비로운 눈동자 문양이 어우러진 인물을 신화적이고 영원불멸한 성역으로 끌어올렸습니다.',
        masterDirectAdvice: '자신을 평범한 기준에 가두지 마십시오. 정교한 디테일과 당당한 미적 확신으로 당신만의 독보적인 왕국을 세우십시오.',
        creativeSparkTechnique: '오너먼트 일루전: 일상의 사물과 생각에 정교하고 화려한 상징 문양을 부여하여 신화적 품격 입히기',
        colorPalette: ['#F59E0B (황금 모자이크 골드)', '#18181B (옵시디언 블랙)', '#FDE68A (영롱한 진주빛 크림)'],
        inspirationAffirmation: '나는 그 누구도 대체할 수 없는 고귀하고 찬란한 빛의 존재다.',
      },
      {
        id: 'klimt_tree_of_life',
        piece: '생명의 나무 (The Tree of Life - Stoclet Frieze, 1905–1909)',
        medium: '템페라 및 금박 스케치 · 비엔나 응용미술관(MAK) 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gustav_Klimt_-_The_Tree_of_Life_-_Google_Art_Project.jpg/1280px-Gustav_Klimt_-_The_Tree_of_Life_-_Google_Art_Project.jpg',
        originalMuseum: '오스트리아 비엔나 응용미술관 (MAK - Museum of Applied Arts)',
        masterpieceInsight: '나선형으로 굽이치며 뻗어나가는 황금 나뭇가지가 생명의 끝없는 순환과 지혜, 기다림과 포옹을 상징합니다.',
        masterDirectAdvice: '서두르지 말고 뿌리를 깊이 내리십시오. 나선형 가지가 천천히 맴돌며 자라나듯 그대의 배움과 방황은 모두 성장의 여정입니다.',
        creativeSparkTechnique: '나선형 성장: 일직선의 성취 대신 돌아가고 휘어지는 나선형 흐름을 긍정하며 축적하기',
        colorPalette: ['#D97706 (나선형 황금 가지)', '#78350F (대지 참나무 브라운)', '#FEF3C7 (신성한 여백 크림)'],
        inspirationAffirmation: '내 삶의 모든 굽이침은 더 풍성한 생명의 열매를 맺기 위한 거룩한 여정이다.',
      },
      {
        id: 'klimt_judith',
        piece: '유디트 I (Judith and the Head of Holofernes, 1901)',
        medium: '유화 및 금박 · 비엔나 벨베데레 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Gustav_Klimt_039.jpg/1024px-Gustav_Klimt_039.jpg',
        originalMuseum: '오스트리아 비엔나 벨베데레 궁전 미술관 (Österreichische Galerie Belvedere)',
        masterpieceInsight: '몽환적이고 당당한 시선으로 관람자를 응시하는 여인의 관능과 승리의 순간입니다. 운명을 스스로 쟁취하는 주체적 에너지를 담았습니다.',
        masterDirectAdvice: '주저하지 말고 당신의 당당한 힘을 표현하십시오. 세상의 시선에 위축되지 않고 주체성을 선언할 때 카리스마 넘치는 창조가 일어납니다.',
        creativeSparkTechnique: '당당한 시선 교환: 두려운 대상이나 문제를 피하지 않고 정면으로 똑바로 응시하며 주도권 되찾기',
        colorPalette: ['#B45309 (금박 초커 앤틱 골드)', '#881337 (위풍당당 버건디)', '#0F172A (신비로운 배경 딥 나이트)'],
        inspirationAffirmation: '나는 내 운명의 완전한 주인이자 세상을 매혹하는 당당한 창조자다.',
      },
      {
        id: 'klimt_three_ages',
        piece: '여성의 세 시기 (The Three Ages of Woman, 1905)',
        medium: '유화 (Oil on Canvas) · 로마 국립현대미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gustav_Klimt_047.jpg/1024px-Gustav_Klimt_047.jpg',
        originalMuseum: '이탈리아 로마 국립현대미술관 (Galleria Nazionale d\'Arte Moderna)',
        masterpieceInsight: '유아기의 순결, 젊음의 사랑과 포옹, 노년의 성찰을 하나의 화폭에 병치하며 시간의 도도한 흐름 속 인간 존재의 숭고한 순환을 성찰합니다.',
        masterDirectAdvice: '나이 들어감이나 변화를 두려워하지 마십시오. 모든 시기는 저마다의 대체 불가능한 고유한 아름다움과 깊은 성숙의 축복을 품고 있습니다.',
        creativeSparkTechnique: '생의 순환 긍정: 지금 내가 서 있는 생의 계절을 있는 그대로 긍정하고 가장 어울리는 결을 꽃피우기',
        colorPalette: ['#FDE047 (순결한 유아기의 골드)', '#FB7185 (청춘의 포옹 로즈)', '#475569 (지혜로운 황혼 슬레이트)'],
        inspirationAffirmation: '내 삶의 모든 계절은 거룩한 성숙과 눈부신 지혜로 아름답게 피어난다.',
      },
      {
        id: 'klimt_beethoven_frieze',
        piece: '베토벤 프리즈 (Beethoven Frieze, 1902)',
        medium: '카제인 물감, 금박, 회반죽 벽화 · 비엔나 분리파 전시관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Klimt_Beethovenfries_Detail_Die_K%C3%BCnste_der_Chor_der_Paradiesengel_und_Die_Umarmung.jpg/1280px-Klimt_Beethovenfries_Detail_Die_K%C3%BCnste_der_Chor_der_Paradiesengel_und_Die_Umarmung.jpg',
        originalMuseum: '오스트리아 비엔나 제체시온 전시관 (Vienna Secession)',
        masterpieceInsight: '베토벤 9번 교향곡의 환희의 송가를 회화로 옮겨, 고난과 악의 세력을 뚫고 마침내 예술과 사랑의 궁극적 포옹으로 승리하는 인류의 영적 구원을 노래합니다.',
        masterDirectAdvice: '예술을 통해 내면의 어둠을 돌파하십시오. 시련의 어두운 괴물들을 지나 마침내 당신이 도달할 곳은 순수한 환희와 사랑의 성소입니다.',
        creativeSparkTechnique: '환희의 송가 시각화: 시련의 끝에서 펼쳐질 가장 눈부신 승리와 포옹의 순간을 선명하게 그리고 용기 얻기',
        colorPalette: ['#F59E0B (초월적 환희 골드)', '#991B1B (시련 돌파 크림슨)', '#38BDF8 (천상의 찬가 아쿠아)'],
        inspirationAffirmation: '나는 모든 시련을 뛰어넘어 예술과 사랑의 숭고한 환희로 승리한다.',
      },
      {
        id: 'klimt_death_and_life',
        piece: '죽음과 삶 (Death and Life / Tod und Leben, 1915)',
        medium: '유화 (Oil on Canvas) · 비엔나 레오폴트 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gustav_Klimt_-_Death_and_Life_-_Google_Art_Project.jpg/1280px-Gustav_Klimt_-_Death_and_Life_-_Google_Art_Project.jpg',
        originalMuseum: '오스트리아 비엔나 레오폴트 미술관 (Leopold Museum)',
        masterpieceInsight: '해골의 죽음이 지켜보는 가운데 어머니와 아이, 연인들이 화려한 꽃무늬 이불 속에서 생명의 영원한 포옹을 나누고 있습니다. 죽음이라는 어두운 배경이 있기에 생명의 황홀한 빛은 더욱 찬란합니다.',
        masterDirectAdvice: '유한함을 슬퍼하지 마십시오. 끝이 있기에 지금 이 순간의 숨결과 사랑이 그토록 눈부신 보석입니다. 삶의 모든 찰나를 가장 뜨거운 포옹으로 축복하십시오.',
        creativeSparkTechnique: '생의 대비 극대화: 어둠과 한계를 의식하되, 그 반대편에 있는 생명의 따스한 온기를 가장 선명한 색채로 표현하기',
        colorPalette: ['#10B981 (생명의 꽃 에메랄드)', '#EC4899 (사랑의 포옹 마젠타)', '#0F172A (신비로운 심연 딥 네이비)'],
        inspirationAffirmation: '나는 삶의 유한함 속에서 영원히 빛나는 사랑과 생명의 축제를 노래한다.',
      },
      {
        id: 'klimt_water_serpents',
        piece: '물뱀 II (Water Serpents II / Wasserschlangen II, 1907)',
        medium: '유화 및 금박 · 개인 소장 (Private Collection)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Gustav_Klimt_-_Wasserschlangen_II_%28Freundinnen%29_-_1904-1907.jpg/1280px-Gustav_Klimt_-_Wasserschlangen_II_%28Freundinnen%29_-_1904-1907.jpg',
        originalMuseum: '비엔나 분리파 아카이브 / 개인 소장',
        masterpieceInsight: '환상적인 수중 세계에서 유영하는 여인들의 유려한 곡선과 붉은 머리칼, 황금빛 비늘 문양이 관능과 신비의 극치를 자아냅니다.',
        masterDirectAdvice: '당신의 상상력을 현실의 좁은 수조에 가두지 마십시오. 환상의 깊은 바닷속으로 잠수하여, 의식의 수면 아래 숨겨진 신비로운 본능과 감각의 물결을 온전히 탐험하십시오.',
        creativeSparkTechnique: '수중 유영의 자유: 중력을 벗어난 물속처럼 어떠한 규범에도 얽매이지 않고 감각의 흐름을 자유롭게 풀어놓기',
        colorPalette: ['#F59E0B (황금빛 수중 비늘)', '#DC2626 (신비로운 붉은 머리칼)', '#0284C7 (심해의 터키석 블루)'],
        inspirationAffirmation: '나는 내면의 깊은 환상 속에서 가장 유려하고 매혹적인 영감을 길어 올린다.',
      },
      {
        id: 'klimt_farm_garden',
        piece: '해바라기가 핀 시골 정원 (Farm Garden with Sunflowers, 1907)',
        medium: '유화 (Oil on Canvas) · 오스트리아 벨베데레 궁전 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Gustav_Klimt_-_Bauerngarten_mit_Sonnenblumen_-_Google_Art_Project.jpg/1280px-Gustav_Klimt_-_Bauerngarten_mit_Sonnenblumen_-_Google_Art_Project.jpg',
        originalMuseum: '오스트리아 비엔나 벨베데레 궁전 미술관 (Österreichische Galerie Belvedere)',
        masterpieceInsight: '화폭 가득 빈틈없이 피어난 수천 송이의 들꽃과 해바라기가 자연의 경이로운 모자이크 융단을 이룹니다. 질서와 우연이 어우러진 순수한 생명력의 향연입니다.',
        masterDirectAdvice: '단 하나의 꽃에만 집착하지 마십시오. 다양한 경험과 작은 기쁨들이 모여 당신의 삶을 거대한 꽃의 융단으로 만듭니다. 온갖 색채의 조화를 기쁘게 받아들이십시오.',
        creativeSparkTechnique: '자연의 모자이크 타일링: 서로 다른 아이디어들을 밀도 높게 모아 하나의 풍성한 영감 정원으로 완성하기',
        colorPalette: ['#FBBF24 (해바라기 옐로 골드)', '#15803D (싱그러운 잎사귀 그린)', '#EF4444 (만발한 들꽃 주홍)'],
        inspirationAffirmation: '내 삶은 다채롭고 풍성한 생명력이 가득한 아름다운 낙원의 정원이다.',
      },
      {
        id: 'klimt_hope_ii',
        piece: '희망 II (Hope II / Die Hoffnung II, 1908)',
        medium: '유화, 금은박 · 뉴욕 현대미술관(MoMA) 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gustav_Klimt_-_Hope%2C_II_-_Google_Art_Project.jpg/1024px-Gustav_Klimt_-_Hope%2C_II_-_Google_Art_Project.jpg',
        originalMuseum: '뉴욕 현대미술관 (The Museum of Modern Art, MoMA)',
        masterpieceInsight: '화려한 황금 장식 옷을 입은 임산부가 기도하는 자세로 고개를 숙이고, 옷자락 속에는 해골이 도사리고 있습니다. 그러나 여인의 가슴속에 잉태된 생명은 그 어떤 두려움도 뛰어넘는 절대적인 희망입니다.',
        masterDirectAdvice: '두려움이 곁에 도사리고 있을지라도, 당신 안에서 자라나고 있는 새로운 희망을 굳게 믿으십시오. 창조의 잉태는 언제나 어둠을 이깁니다.',
        creativeSparkTechnique: '희망의 잉태: 고난 속에서도 내 안에서 조용히 자라나고 있는 미래의 희망에 따스한 손을 얹고 축복하기',
        colorPalette: ['#F59E0B (성스러운 잉태 골드)', '#4F46E5 (비잔틴 모자이크 로열 블루)', '#18181B (어두운 그림자 블랙)'],
        inspirationAffirmation: '어떤 어둠 속에서도 내 안의 성스러운 희망은 흔들림 없이 자라난다.',
      },
      {
        id: 'klimt_the_virgin',
        piece: '처녀 (The Virgin / Die Jungfrau, 1913)',
        medium: '유화 (Oil on Canvas) · 체코 프라하 국립미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Gustav_Klimt_-_Die_Jungfrau_-_Google_Art_Project.jpg/1280px-Gustav_Klimt_-_Die_Jungfrau_-_Google_Art_Project.jpg',
        originalMuseum: '체코 프라하 국립미술관 (National Gallery Prague)',
        masterpieceInsight: '다채로운 꽃과 나선 문양의 소용돌이 속에서 꿈을 꾸는 듯 얽혀 있는 여인들의 모습은 순수한 처녀성에서 관능적인 여성성으로의 황홀한 변모를 노래합니다.',
        masterDirectAdvice: '성장과 변모의 과정을 자연스럽게 허락하십시오. 꿈결 속을 유영하듯, 당신의 내면이 새로운 차원의 성숙과 자유로 피어나는 신비로운 여정을 신뢰하세요.',
        creativeSparkTechnique: '꿈의 소용돌이: 현실의 계산을 내려놓고 꿈결 같은 나선형 패턴 속으로 생각을 부드럽게 침전시키기',
        colorPalette: ['#A855F7 (꿈결의 라벤더 퍼플)', '#38BDF8 (신비로운 각성 시안)', '#FDE047 (축복의 꽃잎 옐로)'],
        inspirationAffirmation: '나는 매 순간 더 깊고 찬란한 차원의 자아로 아름답게 변모한다.',
      },
      {
        id: 'klimt_danae',
        piece: '다나에 (Danaë, 1907–1908)',
        medium: '유화 (Oil on Canvas) · 비엔나 디히틀러 컬렉션 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gustav_Klimt_023.jpg/1280px-Gustav_Klimt_023.jpg',
        originalMuseum: '오스트리아 비엔나 디히틀러 컬렉션 (Galerie Würthle)',
        masterpieceInsight: '황금 소나기로 변신하여 쏟아져 내리는 제우스의 신성을 온몸으로 수용하는 다나에의 황홀경입니다. 신성한 영감과 인간 영혼이 가장 원초적으로 결합하는 순간의 포착입니다.',
        masterDirectAdvice: '하늘에서 쏟아지는 영감의 황금비를 온몸으로 받아들이십시오. 방어막을 거두고 우주의 풍요로운 에너지를 전율하듯 맞이할 때 기적이 탄생합니다.',
        creativeSparkTechnique: '황금 소나기 수용: 온몸의 긴장을 풀고 우주의 축복과 영감이 폭포수처럼 쏟아져 내리는 감각을 상상하기',
        colorPalette: ['#D97706 (제우스의 황금빛 소나기)', '#881337 (황홀경의 딥 버건디)', '#FEF3C7 (순결한 수용 크림)'],
        inspirationAffirmation: '나는 우주가 내려주는 풍요로운 영감의 황금비를 기쁘게 온몸으로 수용한다.',
      }
    ]
  },

  // 4. 요하네스 페르메이르 (Johannes Vermeer)
  {
    id: 'vermeer',
    name: '요하네스 페르메이르 (Johannes Vermeer)',
    title: '빛과 정적의 마스터',
    piece: '진주 귀걸이를 한 소녀 (Girl with a Pearl Earring, c. 1665)',
    medium: '유화 (Oil on Canvas) · 네덜란드 마우리츠하위스 왕립미술관 소장',
    category: 'painting',
    icon: '🧕',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1024px-1665_Girl_with_a_Pearl_Earring.jpg',
    originalMuseum: '네덜란드 헤이그 마우리츠하위스 미술관 (Mauritshuis)',
    masterpieceInsight: '어둠의 심연에서 고개를 돌리는 찰나, 터키석 블루 터번과 한 방울의 영롱한 진주가 온 우주의 빛을 응축합니다. 과장된 설명 없이 단 하나의 시선과 정적만으로도 인간 영혼의 순수한 신비를 증명합니다.',
    masterDirectAdvice: '많은 것을 말하려 애쓰지 마십시오. 진정한 울림은 장황한 웅변이 아니라 정적 속의 한 방울 빛에서 시작됩니다. 군더더기를 과감히 걷어내고, 오직 단 하나의 본질적인 시선과 감정에 온전히 집중하십시오.',
    creativeSparkTechnique: '카메라 옵스큐라(Camera Obscura) 미니멀리즘: 불필요한 배경 요소를 모두 지우고 단 하나의 영롱한 하이라이트 지점에만 시선을 모으기',
    colorPalette: ['#0284C7 (청금석 울트라마린 라피스라줄리)', '#FEF08A (영롱한 진주빛 크림 아이보리)', '#09090B (정적의 옵시디언 블랙)'],
    inspirationAffirmation: '나는 내면의 고요한 침묵 속에서 가장 맑고 순수한 영혼의 빛을 길어 올린다.',
    artworks: [
      {
        id: 'vermeer_pearl_earring',
        piece: '진주 귀걸이를 한 소녀 (Girl with a Pearl Earring, c. 1665)',
        medium: '유화 (Oil on Canvas) · 마우리츠하위스 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1024px-1665_Girl_with_a_Pearl_Earring.jpg',
        originalMuseum: '네덜란드 헤이그 마우리츠하위스 미술관 (Mauritshuis)',
        masterpieceInsight: '터키석 블루 터번과 한 방울의 영롱한 진주가 온 우주의 빛을 응축하여 정적 속 순수한 신비를 증명합니다.',
        masterDirectAdvice: '군더더기를 과감히 걷어내고 오직 단 하나의 본질적인 시선과 정적에 온전히 집중하십시오.',
        creativeSparkTechnique: '카메라 옵스큐라 미니멀리즘: 불필요한 요소를 지우고 단 하나의 영롱한 하이라이트에만 시선 모으기',
        colorPalette: ['#0284C7 (라피스라줄리 블루)', '#FEF08A (진주빛 크림)', '#09090B (옵시디언 블랙)'],
        inspirationAffirmation: '나는 내면의 고요한 침묵 속에서 가장 순수한 영혼의 빛을 길어 올린다.',
      },
      {
        id: 'vermeer_milkmaid',
        piece: '우유를 따르는 여인 (The Milkmaid, c. 1658)',
        medium: '유화 (Oil on Canvas) · 암스테르담 국립미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 국립미술관 (Rijksmuseum)',
        masterpieceInsight: '소박한 부엌 한구석, 질그릇 주전자에서 떨어지는 우유 한 줄기 위에 정적의 성스러움이 깃듭니다.',
        masterDirectAdvice: '지금 하고 있는 단순한 행위에 온전히 몰입하십시오. 잡념을 내려놓고 우유를 따르는 여인처럼 집중할 때 일상이 영원이 됩니다.',
        creativeSparkTechnique: '마인드풀 푸어링: 일상의 작은 행위 하나에 온 신경과 정성을 다해 3분간 몰입하기',
        colorPalette: ['#1D4ED8 (델프트 울트라마린 블루)', '#EAB308 (앞치마 옐로 오커)', '#78350F (질그릇 테라코타)'],
        inspirationAffirmation: '나는 일상의 소박한 순간 속에 깃든 거룩한 평온과 아름다움을 발견한다.',
      },
      {
        id: 'vermeer_view_of_delft',
        piece: '델프트 풍경 (View of Delft, c. 1660)',
        medium: '유화 (Oil on Canvas) · 마우리츠하위스 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vermeer-view-of-delft.jpg/1280px-Vermeer-view-of-delft.jpg',
        originalMuseum: '네덜란드 헤이그 마우리츠하위스 미술관 (Mauritshuis)',
        masterpieceInsight: '구름 사이로 쏟아지는 햇살이 강 건너 붉은 벽돌 지붕과 교회의 첨탑을 환하게 비추며 영혼을 정화합니다.',
        masterDirectAdvice: '한 걸음 뒤로 물러서서 당신 삶의 전체 풍경을 고요히 조망하십시오. 어둠 속에서도 햇빛을 받는 성벽처럼 당신에게도 빛이 내립니다.',
        creativeSparkTechnique: '롱샷 조망법: 좁은 문제에 매몰되지 않고 도시 전체를 조망하듯 삶의 큰 파노라마를 시각화하기',
        colorPalette: ['#38BDF8 (맑은 수면 반영 스카이)', '#B91C1C (델프트 붉은 벽돌)', '#64748B (비구름 슬레이트)'],
        inspirationAffirmation: '나는 넓은 시야로 내 삶의 아름다운 풍경 전체를 조망하며 평온을 유지한다.',
      },
      {
        id: 'vermeer_lacemaker',
        piece: '레이스를 뜨는 여인 (The Lacemaker, c. 1669)',
        medium: '캔버스에 유화 (목판 배접) · 파리 루브르 박물관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Johannes_Vermeer_-_The_Lacemaker_-_WGA24674.jpg/1024px-Johannes_Vermeer_-_The_Lacemaker_-_WGA24674.jpg',
        originalMuseum: '파리 루브르 박물관 (Musée du Louvre)',
        masterpieceInsight: '얇은 실을 엮는 소녀의 미간과 손끝에 세상의 모든 소음이 차단된 밀도 높은 정적이 머뭅니다.',
        masterDirectAdvice: '산만해진 시선을 좁히고 가장 작은 디테일에 정성을 다하십시오. 거대한 목표에 압도당하지 말고 한 올의 실을 꿰어가듯 나아가세요.',
        creativeSparkTechnique: '마이크로 포커스: 전체 결과에 대한 부담을 내려놓고 오늘 완성할 손바닥만 한 세부 작업에만 집중하기',
        colorPalette: ['#FACC15 (산뜻한 레몬 옐로 옷)', '#DC2626 (선명한 붉은 실)', '#334155 (정적의 딥 차콜)'],
        inspirationAffirmation: '나는 한 올 한 올 정성을 다해 내 삶의 아름다운 무늬를 직조한다.',
      },
      {
        id: 'vermeer_astronomer',
        piece: '천문학자 (The Astronomer, 1668)',
        medium: '유화 (Oil on Canvas) · 파리 루브르 박물관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Johannes_Vermeer_-_The_Astronomer_-_1668.jpg/1024px-Johannes_Vermeer_-_The_Astronomer_-_1668.jpg',
        originalMuseum: '파리 루브르 박물관 (Musée du Louvre)',
        masterpieceInsight: '창가로 쏟아지는 고요한 빛 속에서 천구의를 손끝으로 어루만지며 우주의 신비를 탐구하는 학자의 깊은 사유와 지적 열망입니다.',
        masterDirectAdvice: '우주의 거대한 진리를 탐구하듯 당신의 호기심을 확장하십시오. 빛이 드는 책상 머리에서 당신만의 신대륙을 발견할 수 있습니다.',
        creativeSparkTechnique: '천구의 관조: 눈앞의 일상을 넘어 더 넓은 지적 우주와 영적 지평으로 시야를 넓히기',
        colorPalette: ['#0284C7 (지혜의 천구의 시안 블루)', '#D97706 (천문 서적 앰버 골드)', '#334155 (사유의 방 차콜 그레이)'],
        inspirationAffirmation: '나는 호기심과 열린 마음으로 우주의 무한한 지혜와 영감을 탐구한다.',
      },
      {
        id: 'vermeer_art_of_painting',
        piece: '회화의 기술 / 화가의 아틀리에 (The Art of Painting, c. 1666–1668)',
        medium: '유화 (Oil on Canvas) · 비엔나 미술사 박물관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Johannes_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_The_Art_of_Painting_-_Google_Art_Project.jpg',
        originalMuseum: '오스트리아 비엔나 미술사 박물관 (Kunsthistorisches Museum)',
        masterpieceInsight: '커튼을 젖히고 엿보는 화실 안, 역사의 여신 클리오를 캔버스에 담는 화가의 뒷모습은 예술 창작의 신성한 소명에 바치는 최고의 헌사입니다.',
        masterDirectAdvice: '창작하는 당신 자신의 소명을 자랑스러워하십시오. 세상의 소음 뒤에서 조용히 붓을 들 때 당신은 역사를 기록하는 창조자입니다.',
        creativeSparkTechnique: '커튼 젖히기: 일상의 분주한 커튼을 젖히고 나만의 창작 신전으로 성스럽게 입장하기',
        colorPalette: ['#1E3A8A (역사의 여신 울트라마린)', '#FACC15 (화실의 황금빛 햇살)', '#78350F (고풍스러운 샹들리에 브라운)'],
        inspirationAffirmation: '나는 내 삶의 진실한 예술가로서 숭고한 창조의 소명을 기쁘게 살아낸다.',
      },
      {
        id: 'vermeer_little_street',
        piece: '골목길 (The Little Street / Het Straatje, c. 1658)',
        medium: '유화 (Oil on Canvas) · 암스테르담 국립미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Johannes_Vermeer_-_Het_straatje_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_Het_straatje_-_Google_Art_Project.jpg',
        originalMuseum: '네덜란드 암스테르담 국립미술관 (Rijksmuseum)',
        masterpieceInsight: '델프트의 고요한 골목길, 붉은 벽돌집 문턱에서 바느질하는 여인과 빗자루질을 하는 일상의 평화가 투명한 아침 햇살 아래 영원한 고요로 정지해 있습니다.',
        masterDirectAdvice: '평범한 일상의 골목길을 결코 하찮게 보지 마십시오. 벽돌 한 장, 마당의 빗자루질 한 번 속에도 온 우주의 성스러운 평온이 깃들어 있습니다.',
        creativeSparkTechnique: '골목길의 정적: 매일 걷는 길거리의 붉은 벽돌과 문턱의 디테일을 가만히 음미하며 마음 정돈하기',
        colorPalette: ['#991B1B (델프트 벽돌 테라코타)', '#F8FAFC (회칠한 벽면 페일 화이트)', '#334155 (조용한 아침 하늘 슬레이트)'],
        inspirationAffirmation: '나는 소박한 일상의 골목길 속에서 가장 깊고 따스한 영혼의 안식을 찾는다.',
      },
      {
        id: 'vermeer_lacemaker',
        piece: '레이스 뜨는 여인 (The Lacemaker, c. 1670)',
        medium: '유화 (Oil on Canvas) · 파리 루브르 박물관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/The_Lacemaker_by_Johannes_Vermeer_High_Res.jpg/1024px-The_Lacemaker_by_Johannes_Vermeer_High_Res.jpg',
        originalMuseum: '파리 루브르 박물관 (Musée du Louvre)',
        masterpieceInsight: '손바닥만 한 작은 캔버스 위에 한 올의 실을 섬세하게 엮어내는 여인의 극진한 몰입을 담았습니다. 깊은 집중의 순간, 인간의 영혼은 가장 거룩한 신성성을 띱니다.',
        masterDirectAdvice: '산만한 소음에 휘둘리지 마십시오. 단 하나의 바늘땀, 단 하나의 문장에 온 영혼을 모아 집중하십시오. 지극한 몰입이야말로 예술의 가장 순수한 기도입니다.',
        creativeSparkTechnique: '마이크로 포커스: 잡념을 내려놓고 지금 손끝에서 일어나는 단 1mm의 정밀한 작업에만 온 신경 집중하기',
        colorPalette: ['#FACC15 (집중의 노란 옷 골드)', '#DC2626 (재봉 쿠션의 크림슨)', '#F1F5F9 (순백의 레이스 실 화이트)'],
        inspirationAffirmation: '나는 눈앞의 작은 일에 온 마음을 다해 집중하며 성스러운 완성을 이룬다.',
      },
      {
        id: 'vermeer_woman_balance',
        piece: '저울을 든 여인 (Woman Holding a Balance, c. 1664)',
        medium: '유화 (Oil on Canvas) · 워싱턴 국립미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Johannes_Vermeer_-_Woman_Holding_a_Balance_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_Woman_Holding_a_Balance_-_Google_Art_Project.jpg',
        originalMuseum: '워싱턴 국립미술관 (National Gallery of Art, Washington D.C.)',
        masterpieceInsight: '보석과 금화가 놓인 테이블 앞에서 텅 빈 저울의 균형을 맞추는 여인의 뒤로 최후의 심판 그림이 걸려 있습니다. 세속의 가치와 영적인 무게 사이의 참된 균형을 성찰합니다.',
        masterDirectAdvice: '내면의 저울을 평온하게 유지하십시오. 세상의 화려한 인정과 내면의 참된 평화 사이에서, 영혼을 살찌우는 진실한 가치의 균형을 잡으십시오.',
        creativeSparkTechnique: '영혼의 영점 조절: 외부의 평가를 비우고 내 마음의 저울이 고요한 수평을 이루도록 호흡 가다듬기',
        colorPalette: ['#1E293B (깊은 성찰의 미드나이트)', '#D97706 (식탁 위 금화 오커)', '#E2E8F0 (순수한 균형 실버)'],
        inspirationAffirmation: '나는 세상의 소란함 속에서도 내면의 고요한 균형과 평화를 지켜낸다.',
      },
      {
        id: 'vermeer_geographer',
        piece: '지리학자 (The Geographer, c. 1669)',
        medium: '유화 (Oil on Canvas) · 프랑크푸르트 슈테델 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Johannes_Vermeer_-_The_Geographer_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_The_Geographer_-_Google_Art_Project.jpg',
        originalMuseum: '독일 프랑크푸르트 슈테델 미술관 (Städel Museum)',
        masterpieceInsight: '컴퍼스를 든 채 창밖의 빛을 응시하는 학자의 눈빛 속에 미지의 세계를 향한 지적 모험과 새로운 항로를 개척하려는 불굴의 탐구심이 빛납니다.',
        masterDirectAdvice: '익숙한 안락지대에 안주하지 마십시오. 새로운 지도를 그리고 컴퍼스를 펼쳐 미지의 바다로 당신의 영토를 넓혀가십시오. 탐험하는 자만이 새로운 대륙을 만납니다.',
        creativeSparkTechnique: '새로운 지도 그리기: 내가 한 번도 시도해보지 않은 낯선 영역의 가능성을 종이 위에 자유롭게 스케치하기',
        colorPalette: ['#0284C7 (미지의 대양 블루)', '#65A30D (학자의 가운 올리브 그린)', '#FEF08A (창가의 영감 햇살)'],
        inspirationAffirmation: '나는 두려움 없이 미지의 지평을 향해 새로운 항로를 담대하게 개척한다.',
      },
      {
        id: 'vermeer_girl_wineglass',
        piece: '포도주 잔을 든 여인 (The Girl with a Wine Glass, c. 1659)',
        medium: '유화 (Oil on Canvas) · 브라운슈바이크 안톤 울리히 공작 미술관 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Johannes_Vermeer_-_The_Girl_with_the_Wine_Glass_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_The_Girl_with_the_Wine_Glass_-_Google_Art_Project.jpg',
        originalMuseum: '독일 헤어초크 안톤 울리히 미술관 (Herzog Anton Ulrich Museum)',
        masterpieceInsight: '정면의 관람객을 향해 살며시 미소 짓는 여인의 진홍색 실크 드레스와 스테인드글라스 창문에서 새어 나오는 부드러운 빛이 삶의 유쾌한 매혹과 절제의 미학을 연출합니다.',
        masterDirectAdvice: '예술과 삶에 밝고 기분 좋은 미소를 더하십시오. 지나친 엄숙주의에 짓눌리지 말고, 포도주 한 잔의 온기처럼 삶을 따뜻하고 유쾌하게 축복하십시오.',
        creativeSparkTechnique: '빛나는 미소의 온기: 무거운 마음을 가볍게 털어내고 나 자신과 주변에 다정한 미소 한 조각 건네기',
        colorPalette: ['#DC2626 (실크 드레스 스칼렛 레드)', '#FBBF24 (스테인드글라스 앰버 골드)', '#334155 (고풍스러운 실내 슬레이트)'],
        inspirationAffirmation: '나는 삶의 모든 순간을 유쾌한 기쁨과 따뜻한 미소로 밝혀낸다.',
      },
      {
        id: 'vermeer_music_lesson',
        piece: '음악 수업 (The Music Lesson / Lady at the Virginals with a Gentleman, c. 1662)',
        medium: '유화 (Oil on Canvas) · 영국 왕실 컬렉션 소장',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Johannes_Vermeer_-_The_Music_Lesson_-_Google_Art_Project.jpg/1024px-Johannes_Vermeer_-_The_Music_Lesson_-_Google_Art_Project.jpg',
        originalMuseum: '영국 왕실 컬렉션 (The Royal Collection, Buckingham Palace)',
        masterpieceInsight: '버지널 악기 뚜껑에 새겨진 문구 "음악은 기쁨의 동반자이자 슬픔의 치유약"처럼, 거울에 비친 여인의 모습과 악기의 화음이 인간 영혼의 조화로운 공명을 상징합니다.',
        masterDirectAdvice: '당신의 삶을 불협화음 대신 조화로운 멜로디로 가꾸십시오. 상반된 감정과 사건들이 서로의 음을 보완할 때 가장 깊은 화음이 울려 퍼집니다.',
        creativeSparkTechnique: '화음의 튜닝: 갈등하는 두 가지 요소를 대립시키지 않고 음악의 화음처럼 서로 보완하는 관계로 재배치하기',
        colorPalette: ['#0284C7 (버지널의 라피스 블루)', '#F59E0B (타일 바닥의 체스판 골드)', '#1E293B (엄숙한 정적 흑단)'],
        inspirationAffirmation: '내 삶의 모든 경험은 가장 깊고 아름다운 화음으로 조화롭게 어우러진다.',
      }
    ]
  },

  // 5. 클로드 드뷔시 (Claude Debussy)
  {
    id: 'debussy',
    name: '클로드 드뷔시 (Claude Debussy)',
    title: '소리의 인상주의자',
    piece: '달빛 (Clair de Lune - 베르가마스크 모음곡 3악장)',
    medium: '인상주의 피아노 명곡 (Piano Solo & Impressionist Nocturne)',
    category: 'music',
    icon: '🎹',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Henri_Le_Sidaner_-_Clair_de_lune.jpg/1280px-Henri_Le_Sidaner_-_Clair_de_lune.jpg',
    musicVideoId: 'WNcsUNKlAKw',
    musicArtist: '클로드 드뷔시 (Claude Debussy)',
    musicListeningGuide: '달빛이 잔잔한 수면에 부서져 내리는 순간의 파동과 침묵의 여백에 귀를 기울여보세요. 규칙적인 박자를 잊고 음표와 음표 사이의 호흡을 온전히 음미합니다.',
    masterpieceInsight: '전통적인 화성학의 규칙을 허물고 온음계와 잔향의 여백으로 빚어낸 밤의 시입니다. 음악은 음표에 있는 것이 아니라 음표와 음표 사이의 고요한 침묵 속에 살아 숨쉽니다.',
    masterDirectAdvice: '기존의 틀이나 공식에 자신을 억지로 맞추지 마십시오. 세상의 규칙 대신 그대 귓가에 맴도는 은은한 감각의 속삭임에 귀를 기울이세요. 힘을 빼고 부드럽게 건반을 터치하듯, 가장 자유로운 호흡으로 그대만의 색채를 펼치십시오.',
    creativeSparkTechnique: '네거티브 스페이스(Negative Space) 침묵의 휴지: 말이나 작업 사이에 의도적인 3초의 쉼표를 두어 여운과 잔향의 깊이 증폭시키기',
    colorPalette: ['#E0F2FE (부서지는 달빛 펄 블루)', '#6366F1 (몽환의 인디고 트와일라잇)', '#F1F5F9 (은빛 안개 실버)'],
    inspirationAffirmation: '나는 세상의 정형화된 틀을 벗어나 자유로운 영혼의 선율로 세상을 물들인다.',
    artworks: [
      {
        id: 'debussy_clair_de_lune',
        piece: '달빛 (Clair de Lune - 베르가마스크 모음곡 3악장)',
        medium: '인상주의 피아노 명곡 (Piano Solo & Impressionist Nocturne)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Henri_Le_Sidaner_-_Clair_de_lune.jpg/1280px-Henri_Le_Sidaner_-_Clair_de_lune.jpg',
        musicVideoId: 'WNcsUNKlAKw',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '달빛이 잔잔한 수면에 부서져 내리는 순간의 파동과 침묵의 여백에 귀를 기울여보세요.',
        masterpieceInsight: '화성학의 규칙을 허물고 온음계와 잔향의 여백으로 빚어낸 밤의 시입니다.',
        masterDirectAdvice: '틀에 갇히지 말고 그대 귓가에 맴도는 은은한 감각의 속삭임에 귀를 기울이십시오.',
        creativeSparkTechnique: '네거티브 스페이스 침묵의 휴지: 의도적인 3초의 쉼표로 여운의 깊이 증폭시키기',
        colorPalette: ['#E0F2FE (달빛 펄 블루)', '#6366F1 (인디고 트와일라잇)', '#F1F5F9 (은빛 안개 실버)'],
        inspirationAffirmation: '나는 정형화된 틀을 벗어나 자유로운 영혼의 선율로 세상을 물들인다.',
      },
      {
        id: 'debussy_arabesque',
        piece: '아라베스크 1번 (Deux Arabesques No. 1, L. 66)',
        medium: '유려한 아르페지오 건반 명작 (Andantino con moto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: '28WUJbW457Q',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '식물 덩굴처럼 유려하게 뻗어나가는 우아한 아르페지오의 곡선과 멜로디의 춤을 느껴보세요.',
        masterpieceInsight: '직선과 각진 규칙을 벗어나 자연의 부드러운 곡선미를 소리로 옮겨낸 인상주의 음악의 정수입니다.',
        masterDirectAdvice: '삶의 경직된 규칙을 풀고 부드러운 아라베스크 곡선처럼 유연하게 흐르십시오. 물결은 저절로 바다로 흐릅니다.',
        creativeSparkTechnique: '유려한 곡선의 흐름: 직선적 압박 대신 상황에 따라 유연하게 굽이치며 나아가는 우아함 유지하기',
        colorPalette: ['#A7F3D0 (싱그러운 덩굴 민트)', '#38BDF8 (맑은 시냇물 블루)', '#FEF08A (오후의 햇살 샴페인)'],
        inspirationAffirmation: '나는 경직된 긴장을 내려놓고 자연의 순리처럼 유연하고 우아하게 흐른다.',
      },
      {
        id: 'debussy_faune',
        piece: '목신의 오후 전주곡 (Prélude à l\'après-midi d\'un faune)',
        medium: '인상주의 관현악 명작 (Orchestral Poem)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/L%27apr%C3%A8s-midi_d%27un_faune_%28Nijinsky%29.jpg/1024px-L%27apr%C3%A8s-midi_d%27un_faune_%28Nijinsky%29.jpg',
        musicVideoId: 'bYyK922PsUw',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '나른한 여름날 숲속 플루트의 몽환적인 첫 독주 선율을 타고 꿈과 현실의 경계가 부드럽게 지워집니다.',
        masterpieceInsight: '조성을 해체하고 오케스트라 관악기들이 빚어내는 신비로운 색채로 현대 음악의 문을 열었습니다.',
        masterDirectAdvice: '명확한 정답을 강요하지 마십시오. 모호함과 몽환적인 상상력이야말로 창조성이 가장 자유롭게 유영하는 신성한 숲입니다.',
        creativeSparkTechnique: '몽환적 데이드리밍: 눈을 감고 5분간 목적 없는 자유로운 공상의 나래를 펼쳐보며 직관 일깨우기',
        colorPalette: ['#FDE68A (나른한 황금빛 숲)', '#86EFAC (숲속 요정의 페일 그린)', '#93C5FD (아지랑이 스카이)'],
        inspirationAffirmation: '나는 상상력의 경계를 지우고 무한한 영감의 숲을 자유롭게 유영한다.',
      },
      {
        id: 'debussy_la_mer',
        piece: '바다 - 바람과 파도의 대화 (La Mer: Dialogue du vent et de la mer, L. 109)',
        medium: '인상주의 교향시 명작 (Three Symphonic Sketches)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg',
        musicVideoId: 'FOCucJw7iT8',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '거대한 파도가 솟구치고 햇살이 수면에 부서지는 바다의 역동적인 생명력과 바람의 숨결을 오케스트라의 찬란한 음색으로 느껴보세요.',
        masterpieceInsight: '호쿠사이의 파도 판화에 영감을 받아 완성한 걸작으로, 고정된 형태 대신 끊임없이 움직이고 변화하는 자연의 거대한 원초적 에너지를 소리로 빚어냈습니다.',
        masterDirectAdvice: '마음속의 거대한 파도를 두려워하지 마십시오. 파도가 칠 때 비로소 바다는 살아 숨쉽니다. 그대 안의 역동적인 에너지를 억누르지 말고 웅장하게 분출하십시오.',
        creativeSparkTechnique: '파도의 스웰(Swell): 감정과 에너지가 솟구칠 때 그 상승곡선을 타고 더 대담하고 웅장한 표현으로 도약하기',
        colorPalette: ['#0369A1 (격동하는 파도의 딥 마린)', '#38BDF8 (부서지는 물보라 시안)', '#FEF08A (수면 위 햇살 골드)'],
        inspirationAffirmation: '나는 거대한 바다처럼 끝없이 솟구치는 창조적 생명력의 물결이다.',
      },
      {
        id: 'debussy_reverie',
        piece: '꿈 (Rêverie, L. 68)',
        medium: '서정적 몽환 피아노 독주곡 (Andantino)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: 'y5OtA1xVf1Q',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '나른하고 아늑한 오후, 부드러운 아르페지오를 타고 현실의 모든 근심이 안개처럼 사라지는 평온한 꿈결을 감상하세요.',
        masterpieceInsight: '복잡한 기교를 배제하고 오직 순수한 선율과 잔향만으로 지친 영혼을 부드러운 침묵과 안식의 품으로 인도하는 피아노의 시편입니다.',
        masterDirectAdvice: '잠시 모든 긴장을 내려놓고 꿈꾸기를 허락하십시오. 목적 없는 고요한 몽상 속에서 가장 순수하고 투명한 영감이 싹틉니다.',
        creativeSparkTechnique: '레브리 릴랙세이션: 눈을 감고 부드러운 꿈의 선율을 들으며 온몸의 근육을 이완하고 순수한 상상력과 접속하기',
        colorPalette: ['#C084FC (몽환의 라일락 퍼플)', '#93C5FD (꿈결의 소프트 블루)', '#F8FAFC (평온한 안식 크림)'],
        inspirationAffirmation: '나는 나른한 꿈결처럼 평온한 침묵 속에서 가장 순수한 영감을 회복한다.',
      },
      {
        id: 'debussy_cheveux_de_lin',
        piece: '아마빛 머리의 소녀 (La fille aux cheveux de lin, L. 117)',
        medium: '인상주의 피아노 전주곡 (Préludes Book 1, No. 8)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: 'ctFfhUmSgU8',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '들판의 햇살을 머금은 소녀의 아마빛 머리칼처럼 순박하고 소박한 5음 음계의 투명한 서정에 귀를 기울여보세요.',
        masterpieceInsight: '과장된 드라마 대신 들꽃처럼 소박하고 무결한 아름다움을 담아낸 곡으로, 순수함이야말로 가장 강력한 감동의 근원임을 증명합니다.',
        masterDirectAdvice: '기교를 부리거나 겉멋을 내지 마십시오. 있는 그대로의 소박하고 순수한 진심이 담길 때, 가장 짧은 한마디도 세상을 울리는 음악이 됩니다.',
        creativeSparkTechnique: '5음 음계의 순수성: 복잡한 장식을 모두 걷어내고 가장 간결하고 솔직한 원형의 언어로 표현하기',
        colorPalette: ['#FEF08A (아마빛 머리칼 페일 골드)', '#86EFAC (시골 들판의 클로버 그린)', '#E0F2FE (맑은 여명 아쿠아)'],
        inspirationAffirmation: '나는 덧없는 기교를 벗고 순수한 진심의 선율로 세상을 맑게 밝힌다.',
      },
      {
        id: 'debussy_cathedrale',
        piece: '가라앉은 대성당 (La cathédrale engloutie, L. 117)',
        medium: '인상주의 피아노 전주곡 (Préludes Book 1, No. 10)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: 'NsdIkUSjXv8',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '안개 낀 바닷속에서 종소리와 파이프오르간 소리를 울리며 수면 위로 장엄하게 솟아올랐다가 다시 침잠하는 신비로운 전설의 성당입니다.',
        masterpieceInsight: '심연의 어둠 속에 가라앉아 있던 성스러운 영혼의 기억이 수면 위로 솟아오르는 신화적 영성을 묵직한 오르간 화음으로 그려냈습니다.',
        masterDirectAdvice: '잠시 잊혀진 듯 보이는 당신 안의 거대한 잠재력과 이상을 의심하지 마십시오. 때가 되면 깊은 바닷속 대성당처럼 찬란한 종소리를 울리며 솟아오를 것입니다.',
        creativeSparkTechnique: '심연의 종소리: 깊은 침묵 속에서 내면의 오래된 이상과 초심의 종소리를 다시 울려보기',
        colorPalette: ['#172554 (심해의 딥 네이비)', '#EAB308 (성당의 신비로운 황금빛 종소리)', '#64748B (수면의 신비로운 해무)'],
        inspirationAffirmation: '내 안의 깊은 영성과 신성한 잠재력은 때가 되면 장엄하게 솟아오른다.',
      },
      {
        id: 'debussy_isle_joyeuse',
        piece: '기쁨의 섬 (L\'Isle joyeuse, L. 106)',
        medium: '화려한 비르투오소 피아노 명작 (Quasi una cadenza)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: 'z-m5pX35u0M',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '와토의 명화 〈시테라 섬으로의 출항〉에 영감을 받아 작곡된 곡으로, 황홀한 사랑과 춤, 폭발하는 생명의 환희가 건반 위를 질주합니다.',
        masterpieceInsight: '우울과 망설임을 단숨에 날려버리는 디오니소스적 도취와 폭발적인 빛의 춤입니다. 삶을 온전히 긍정하는 생명력의 절정입니다.',
        masterDirectAdvice: '조심스러움과 주저함을 떨쳐내십시오! 찬란한 환희의 섬으로 돛을 올리듯, 당신의 모든 에너지를 기쁨과 열정의 불꽃으로 활활 태우십시오.',
        creativeSparkTechnique: '환희의 폭발: 망설임을 끊고 가장 화려하고 신나는 리듬으로 단숨에 작업의 활력을 끌어올리기',
        colorPalette: ['#F59E0B (태양빛 환희 골드)', '#EC4899 (사랑의 출항 루비 핑크)', '#38BDF8 (지중해의 눈부신 사파이어)'],
        inspirationAffirmation: '나는 모든 망설임을 떨쳐내고 찬란한 기쁨과 생명의 환희로 춤춘다.',
      },
      {
        id: 'debussy_golliwogg',
        piece: '어린이 코너 - 골리워크의 케이크워크 (Children\'s Corner: Golliwogg\'s Cake-walk)',
        medium: '해학과 리듬의 피아노 소품 (Allegro giusto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: '0Yg37wH4_iM',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '딸 슈슈를 위해 작곡한 곡으로, 래그타임의 엉뚱한 당김음 리듬과 바그너의 〈트리스탄과 이졸데〉를 익살스럽게 패러디한 유쾌한 재치를 느껴보세요.',
        masterpieceInsight: '예술이 항상 무겁고 심각할 필요는 없습니다. 아이의 맑은 눈으로 세상을 바라볼 때 유쾌한 유머와 위트가 새로운 창조적 활력을 줍니다.',
        masterDirectAdvice: '지나친 진지함의 무게에 짓눌려 있다면 잠시 장난꾸러기 어린이가 되어보십시오. 엉뚱한 유머와 가벼운 발걸음 속에 번뜩이는 영감이 숨어 있습니다.',
        creativeSparkTechnique: '아이의 놀이 본능: 결과에 대한 부담을 내려놓고 장난감 놀이를 하듯 유쾌한 실험과 변주 즐기기',
        colorPalette: ['#F97316 (장난기 넘치는 오렌지)', '#FACC15 (유쾌한 케이크워크 옐로)', '#18181B (경쾌한 리듬 턱시도)'],
        inspirationAffirmation: '나는 어린아이 같은 순수한 호기심과 유쾌한 유머로 세상을 새롭게 빚어낸다.',
      },
      {
        id: 'debussy_string_quartet',
        piece: '현악 사중주 G단조 3악장 (String Quartet in G minor, Op. 10 - Andantino)',
        medium: '실내악 명작 (Andantino, doucement expressif)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: '3U1xJ5B9Kj4',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '약음기를 낀 네 대의 현악기가 빚어내는 극도로 다정하고 은밀한 내면의 고백이 밤하늘의 성좌처럼 아련하게 흐릅니다.',
        masterpieceInsight: '전통적인 실내악의 틀 속에서 가장 혁신적이고 몽환적인 화음의 직조를 선보인 곡으로, 여리고 섬세한 음색의 진정한 위대함을 보여줍니다.',
        masterDirectAdvice: '조용히 속삭이는 소리에 더 큰 힘이 있습니다. 큰 소리로 외치지 않아도 영혼의 가장 깊은 곳을 울리는 은은한 떨림을 전하십시오.',
        creativeSparkTechnique: '약음기(Mute)의 신비: 자극적인 볼륨을 낮추고 가장 내밀하고 섬세한 뉘앙스로 상대의 가슴에 가닿기',
        colorPalette: ['#6366F1 (은밀한 황혼 인디고)', '#A78BFA (부드러운 벨벳 바이올렛)', '#FEF3C7 (다정한 촛불 웜 크림)'],
        inspirationAffirmation: '내면의 가장 부드럽고 다정한 속삭임이 온 세상을 깊이 울린다.',
      },
      {
        id: 'debussy_soiree_dans_grenade',
        piece: '판화 - 그라나다의 황혼 (Estampes: La soirée dans Grenade)',
        medium: '스페인풍 피아노 명작 (Mouvement de Habanera)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claude_Debussy_atelier_Nadar.jpg/800px-Claude_Debussy_atelier_Nadar.jpg',
        musicVideoId: 'bY_8w6ZqQ3g',
        musicArtist: '클로드 드뷔시 (Claude Debussy)',
        musicListeningGuide: '하바네라의 나른한 리듬 위에 기타 소리와 아라베스크 선율, 안달루시아의 밤공기가 피어오르는 이국적인 풍경입니다.',
        masterpieceInsight: '스페인에 단 몇 시간밖에 머물지 않았음에도 불구하고 오직 직관과 상상력만으로 스페인 음악의 정수를 구현해 낸 경이로운 영감의 산물입니다.',
        masterDirectAdvice: '경험의 부족을 한탄하지 마십시오. 예술가의 가장 강력한 날개는 상상력입니다. 깊은 감수성과 직관으로 당신만의 이국적인 세계를 창조하십시오.',
        creativeSparkTechnique: '직관적 풍경 재창조: 가보지 않은 미지의 세계나 감정을 오직 감각적 상상력으로 생생하게 묘사하기',
        colorPalette: ['#991B1B (안달루시아 석양 루비)', '#D97706 (기타 선율의 앰버)', '#1E1B4B (그라나다의 밤하늘 딥 퍼플)'],
        inspirationAffirmation: '나는 한계 없는 상상력의 날개로 어떤 미지의 세계도 생생하게 빚어낸다.',
      }
    ]
  },

  // 6. 요한 제바스티안 바흐 (J.S. Bach)
  {
    id: 'bach',
    name: '요한 제바스티안 바흐 (J.S. Bach)',
    title: '신성한 음악의 아버지',
    piece: '골드베르크 변주곡 (Goldberg Variations, BWV 988 - Aria)',
    medium: '대위법 건반 명작 (Sacred Counterpoint & Universal Harmony)',
    category: 'music',
    icon: '🎼',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
    musicVideoId: 'Ah392lnFHxM',
    musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
    musicListeningGuide: '32마디 베이스 저음 선율 위에 피어나는 30개의 정교한 우주적 변주입니다. 어지러운 생각들이 수학적인 완전한 질서와 거룩한 평온 속으로 단정하게 수렴됩니다.',
    masterpieceInsight: '단 하나의 소박한 아리아 저음 선율이 30개의 전혀 다른 우주로 꽃피어납니다. 반복되는 일상과 단조로운 삶이야말로 무한한 변주와 성장의 토양임을 수학적 신성성으로 증명합니다.',
    masterDirectAdvice: '작은 일상의 루틴을 가볍게 여기지 마십시오. 가장 위대한 걸작은 매일 반복되는 기본 저음의 충실함 위에 세워집니다. 지금 눈앞의 단순한 과정을 거룩한 마음으로 정성껏 다듬으십시오. 그것이 거대한 하모니의 시작입니다.',
    creativeSparkTechnique: '모티프 변주(Motif Variation): 하나의 작은 생각이나 습관을 3가지 다른 각도(느리게, 대담하게, 뒤집어서)로 변주해보기',
    colorPalette: ['#D97706 (장엄한 파이프오르간 앤틱 골드)', '#78350F (대지의 참나무 딥 브라운)', '#FEF3C7 (천상의 하모니 크림)'],
    inspirationAffirmation: '나는 일상의 소박한 박자 속에서 우주의 신성한 질서와 무한한 조화를 빚어낸다.',
    artworks: [
      {
        id: 'bach_goldberg',
        piece: '골드베르크 변주곡 (Goldberg Variations, BWV 988 - Aria)',
        medium: '대위법 건반 명작 (Sacred Counterpoint & Universal Harmony)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'Ah392lnFHxM',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '32마디 베이스 저음 선율 위에 피어나는 30개의 정교한 우주적 변주를 느껴보세요.',
        masterpieceInsight: '단 하나의 소박한 아리아 저음 선율이 30개의 완전한 우주로 피어납니다.',
        masterDirectAdvice: '작은 일상의 루틴을 가볍게 여기지 마십시오. 위대한 걸작은 매일 반복되는 기본의 충실함 위에 세워집니다.',
        creativeSparkTechnique: '모티프 변주: 하나의 작은 생각이나 습관을 3가지 다른 각도로 변주해보기',
        colorPalette: ['#D97706 (오르간 골드)', '#78350F (참나무 브라운)', '#FEF3C7 (하모니 크림)'],
        inspirationAffirmation: '나는 일상의 소박한 박자 속에서 우주의 신성한 질서와 조화를 빚어낸다.',
      },
      {
        id: 'bach_air',
        piece: 'G선상의 아리아 (Air on the G String - 관현악 모음곡 제3번 BWV 1068)',
        medium: '현악 합주 명곡 (Air for Strings)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bach-Haus_Eisenach.jpg/1024px-Bach-Haus_Eisenach.jpg',
        musicVideoId: 'GMkmQlfOJD8',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '단 하나의 가장 낮은 G현 위에서 펼쳐지는 숭고한 선율이 지친 가슴을 깊은 평화로 감싸 안습니다.',
        masterpieceInsight: '화려한 기교 대신 가장 소박한 현 하나로 영혼의 심연을 울리는 거룩한 기도이자 치유의 찬가입니다.',
        masterDirectAdvice: '많은 무기를 쥐려 하지 마십시오. 단 하나의 진실한 선율, 단 하나의 깊은 호흡만으로도 충분히 세상을 감동시킬 수 있습니다.',
        creativeSparkTechnique: '단일 현의 순수성: 가장 단순하고 진솔한 단 하나의 표현으로 본질에 도달하기',
        colorPalette: ['#475569 (고결한 첼로 슬레이트)', '#F59E0B (따뜻한 송진 골드)', '#F8FAFC (천상의 안식 화이트)'],
        inspirationAffirmation: '나는 가장 단순하고 진실한 마음으로 내 영혼의 가장 깊은 울림을 전한다.',
      },
      {
        id: 'bach_cello_suite',
        piece: '무반주 첼로 모음곡 1번 프렐류드 (Cello Suite No. 1, BWV 1007)',
        medium: '독주 첼로 명작 (Solo Cello Prélude)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: '1prweT95OD4',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '반주 없이 홀로 울려 퍼지는 첼로의 묵직한 호흡과 대위법적 울림이 우주의 기초 질서를 세웁니다.',
        masterpieceInsight: '하나의 악기가 스스로 저음과 고음을 넘나들며 홀로 완전한 화음을 이루는 영적 자립의 걸작입니다.',
        masterDirectAdvice: '타인의 반주나 박수를 기다리지 마십시오. 홀로 서 있는 바로 지금 이 순간, 당신의 영혼은 이미 온전한 우주입니다.',
        creativeSparkTechnique: '독주자의 자립: 외부의 의존 없이 내면의 중심축을 확고히 세우고 묵묵히 나의 길을 걷기',
        colorPalette: ['#9A3412 (고풍스러운 첼로 마호가니)', '#D97706 (영혼의 울림 호박석)', '#1E293B (정적의 배경 딥 블루)'],
        inspirationAffirmation: '나는 홀로 서서 나 자신의 완전한 우주와 성스러운 질서를 노래한다.',
      },
      {
        id: 'bach_toccata_fugue',
        piece: '토카타와 푸가 D단조 (Toccata and Fugue in D minor, BWV 565)',
        medium: '오르간 대작 (Organ Toccata and Fugue)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'ho9rZjlsyYY',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '거대한 파이프오르간이 포효하듯 뿜어내는 첫 하강 음형의 전율과 정교한 푸가의 우주적 건축미를 온몸으로 느껴보세요.',
        masterpieceInsight: '인간의 작은 지성을 압도하는 천둥 같은 신의 위엄과 절대적인 대위법적 질서를 소리로 세운 거대한 영적 대성당입니다.',
        masterDirectAdvice: '경외심을 잃지 마십시오. 당신의 삶 뒤편에는 눈앞의 고민을 가볍게 뛰어넘는 우주의 거대한 섭리와 질서가 흐르고 있습니다. 당당하게 그 흐름에 몸을 실으십시오.',
        creativeSparkTechnique: '장엄한 토카타의 선언: 머뭇거리지 않고 단숨에 가장 묵직하고 당당한 첫 문장을 선언하며 작업 시작하기',
        colorPalette: ['#18181B (파이프오르간 흑단 블랙)', '#D97706 (장엄한 성전의 황금빛)', '#991B1B (불꽃같은 영적 전율 크림슨)'],
        inspirationAffirmation: '나는 우주의 거대한 질서와 신성한 섭리 안에서 당당하게 울려 퍼진다.',
      },
      {
        id: 'bach_well_tempered',
        piece: '평균율 클라비어 곡집 1권 프렐류드 C장조 (The Well-Tempered Clavier, Book 1: Prelude in C major, BWV 846)',
        medium: '건반 음악의 구약성서 (Prelude in C major)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'gVah1cr3pU0',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '물방울이 떨어지듯 잔잔하게 반복되는 16분음표 아르페지오의 물결 속에서 마음의 모든 분주함이 깨끗이 정화됩니다.',
        masterpieceInsight: '멜로디조차 없이 오직 단순한 화음의 물결만으로 세상에서 가장 순결하고 평화로운 영적 기도를 빚어냈습니다.',
        masterDirectAdvice: '단순함의 위대한 힘을 믿으십시오. 화려한 기교를 보태려 애쓰지 말고, 맑은 물처럼 투명하게 흐르는 마음으로 하루의 첫 페이지를 시작하십시오.',
        creativeSparkTechnique: '아르페지오 명상: 단순한 호흡과 리듬을 규칙적으로 반복하며 내면의 잡념을 잔잔히 가라앉히기',
        colorPalette: ['#F8FAFC (순결한 아침 이슬 화이트)', '#BAE6FD (맑은 하늘빛 세레니티)', '#FEF08A (따스한 햇살 크림)'],
        inspirationAffirmation: '나는 가장 맑고 단순한 마음으로 내 영혼의 순결한 기도를 노래한다.',
      },
      {
        id: 'bach_jesu_joy',
        piece: '예수, 인간 소망의 기쁨 (Jesu, Joy of Man\'s Desiring, BWV 147)',
        medium: '영적 안식의 칸타타 합창 (Herz und Mund und Tat und Leben)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'd9EN27Zh_GQ',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '시냇물처럼 끊임없이 유려하게 흐르는 3연음부의 현악 선율 위에 장엄하고 따스한 합창의 위로가 겹쳐집니다.',
        masterpieceInsight: '영혼의 영원한 소망과 기쁨을 끊임없이 솟아나는 생명수의 흐름으로 형상화한 치유와 축복의 찬가입니다.',
        masterDirectAdvice: '지치고 메마른 날에는 이 거룩한 기쁨의 시냇물에 마음을 담그십시오. 당신을 향한 무조건적인 사랑과 소망이 늘 곁에 흐르고 있습니다.',
        creativeSparkTechnique: '흐르는 생명수 상상: 마르지 않는 기쁨의 시냇물이 내 가슴속을 통과해 세상을 적시는 이미지를 명상하기',
        colorPalette: ['#38BDF8 (맑은 생명수 아쿠아)', '#F59E0B (영원한 소망의 골드)', '#10B981 (안식의 에메랄드)'],
        inspirationAffirmation: '내 안에는 끊임없이 샘솟는 신성한 기쁨과 소망의 시냇물이 흐른다.',
      },
      {
        id: 'bach_chaconne',
        piece: '샤콘느 (Chaconne from Partita No. 2 in D minor, BWV 1004)',
        medium: '무반주 바이올린 파르티타의 절정 (Chaconne)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'QqA3qQMKueA',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '사랑하는 아내 마리아 바르바라를 잃은 깊은 비통 속에서, 단 한 대의 바이올린으로 인간의 모든 슬픔과 초월적 구원을 빚어낸 15분간의 대서사시입니다.',
        masterpieceInsight: '요하네스 브람스가 "단 하나의 악기로 온 세상의 모든 사유와 비통, 감정을 응축해냈다"고 경탄한 바이올린 음악의 에베레스트입니다.',
        masterDirectAdvice: '가장 뼈아픈 상실 속에서도 영혼의 현을 조율하십시오. 비통의 바닥까지 내려간 자만이 D장조의 찬란한 빛으로 다시 솟아오를 수 있습니다.',
        creativeSparkTechnique: '비통의 장조 전조: 가장 슬픈 어둠의 고백 한가운데서 의도적으로 찬란한 희망의 빛(장조)으로 전환해보기',
        colorPalette: ['#7F1D1D (상실의 피눈물 딥 버건디)', '#D97706 (구원의 촛불 호박석)', '#0F172A (고독한 심연 미드나이트)'],
        inspirationAffirmation: '나는 가장 깊은 슬픔을 통과하여 불멸의 빛과 숭고한 초월로 비상한다.',
      },
      {
        id: 'bach_brandenburg_5',
        piece: '브란덴부르크 협주곡 5번 D장조 1악장 (Brandenburg Concerto No. 5, BWV 1050)',
        medium: '합주 협주곡의 혁신 (Allegro with Harpsichord Cadenza)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'BnjqGhAlFzs',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '플루트와 바이올린의 우아한 대화 사이에서 반주에 불과했던 하프시코드가 마침내 폭풍 같은 독주 카덴차로 날아오르는 혁신의 순간입니다.',
        masterpieceInsight: '조연에 머물던 존재가 전면에 나서 주연이 되는 음악사 최초의 건반 협주곡으로, 억눌린 잠재력의 당당한 해방을 상징합니다.',
        masterDirectAdvice: '평생 무대 뒤편의 조연으로 남을 필요는 없습니다. 그대 안의 잠재력이 폭발하는 그 순간, 당당하게 중심 무대로 나와 당신만의 화려한 카덴차를 펼치십시오.',
        creativeSparkTechnique: '카덴차의 독주 도약: 눈치를 보던 태도를 버리고 오직 나만의 역량을 100% 쏟아붓는 독주 타이밍 포착하기',
        colorPalette: ['#F59E0B (하프시코드 골든 아르페지오)', '#2563EB (우아한 궁정 로열 블루)', '#10B981 (생동감 넘치는 라임 그린)'],
        inspirationAffirmation: '나는 당당하게 무대 중심에 서서 나만의 눈부신 독주를 펼쳐낸다.',
      },
      {
        id: 'bach_erbarme_dich',
        piece: '마태 수난곡 - 주여, 나를 불쌍히 여기소서 (St. Matthew Passion: Erbarme dich, BWV 244)',
        medium: '성스러운 수난곡 아리아 (Alto Aria with Solo Violin)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'aPAiH9XhTHc',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '베드로의 통곡과 참회를 담은 독주 바이올린의 애절한 눈물과 알토 음성의 지극한 자비가 가슴을 파고듭니다.',
        masterpieceInsight: '인간의 연약함과 배신, 실패를 정죄하지 않고 무한한 자비와 눈물의 사랑으로 감싸 안는 음악사상 가장 거룩한 용서의 기도입니다.',
        masterDirectAdvice: '실수와 연약함 때문에 스스로를 자책하지 마십시오. 진심 어린 참회의 눈물은 영혼을 가장 순결하고 아름답게 씻어내는 은총의 샘물입니다.',
        creativeSparkTechnique: '자비의 셀프 용서: 나의 부끄러운 과오를 자비로운 시선으로 끌어안으며 온전한 평화와 화해 회복하기',
        colorPalette: ['#312E81 (참회의 눈물 인디고)', '#93C5FD (자비로운 은총의 페일 블루)', '#F8FAFC (순백의 정화 화이트)'],
        inspirationAffirmation: '나는 나의 연약함과 화해하며 무한한 자비와 사랑의 평화를 입는다.',
      },
      {
        id: 'bach_double_violin',
        piece: '두 대의 바이올린을 위한 협주곡 D단조 2악장 (Concerto for Two Violins, BWV 1043 - Largo)',
        medium: '현악 협주곡의 시편 (Largo ma non tanto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'j8_XmCg8oD0',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '두 대의 바이올린이 마치 다정한 두 영혼처럼 서로를 감싸 안고 대화하며 천상의 평화 속을 거니는 서정미를 만끽하세요.',
        masterpieceInsight: '경쟁하거나 앞서려 하지 않고, 서로를 온전히 존중하며 완벽한 호흡으로 엮어내는 관계의 가장 거룩하고 아름다운 하모니입니다.',
        masterDirectAdvice: '혼자 모든 것을 짊어지려 하지 마십시오. 타인과의 다정한 호흡, 진솔한 대화 속에서 혼자서는 결코 닿을 수 없는 천상의 아름다운 하모니가 꽃핍니다.',
        creativeSparkTechnique: '영혼의 듀엣: 내 생각과 타인의 아이디어를 두 대의 바이올린처럼 부드럽게 주고받으며 시너지 만들기',
        colorPalette: ['#475569 (온화한 현악 슬레이트)', '#FBBF24 (다정한 대화의 웜 앰버)', '#FEF2F2 (평화로운 안식 로즈 크림)'],
        inspirationAffirmation: '나는 타인과 깊은 신뢰로 공명하며 가장 조화롭고 아름다운 하모니를 빚어낸다.',
      },
      {
        id: 'bach_sleepers_wake',
        piece: '눈뜨라고 부르는 소리 있도다 (Wachet auf, ruft uns die Stimme, BWV 645)',
        medium: '오르간 코랄 전주곡 (Schübler Chorales)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
        musicVideoId: 'VSgpXdyWhxY',
        musicArtist: '요한 제바스티안 바흐 (J.S. Bach)',
        musicListeningGuide: '경쾌하게 발걸음을 옮기는 유려한 현악 선율과 잠든 영혼을 깨우는 장엄한 코랄의 목소리가 어우러지는 영적 축제입니다.',
        masterpieceInsight: '영적인 잠과 무기력에 빠진 인간을 향해 축제의 날이 밝았으니 기쁨으로 깨어나라고 외치는 희망의 나팔소리입니다.',
        masterDirectAdvice: '무기력과 나태함의 잠에서 깨어나십시오! 새로운 날, 새로운 기쁨의 축제가 당신을 기다리고 있습니다. 환희의 발걸음으로 나아가십시오.',
        creativeSparkTechnique: '영혼의 모닝 콜: 아침을 맞이하며 내면의 에너지를 깨우는 활기찬 음악과 확언으로 생동감 충전하기',
        colorPalette: ['#F59E0B (각성의 아침 햇살 골드)', '#15803D (생명력 넘치는 전나무 그린)', '#FEF08A (환희의 등불 크림)'],
        inspirationAffirmation: '나는 어제의 무기력을 털고 깨어나 빛나는 기쁨과 희망의 축제로 나아간다.',
      }
    ]
  },

  // 7. 루트비히 판 베토벤 (Ludwig van Beethoven)
  {
    id: 'beethoven',
    name: '루트비히 판 베토벤 (Ludwig van Beethoven)',
    title: '운명을 극복한 거인',
    piece: '피아노 소나타 제14번 \'월광\' 1악장 (Moonlight Sonata, Op.27 No.2)',
    medium: '낭만주의 피아노 소나타 (Adagio Sostenuto)',
    category: 'music',
    icon: '🎹',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
    musicVideoId: '4Tr0otuiQuU',
    musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
    musicListeningGuide: '깊은 밤 잔잔한 호수 위에 부서지는 달빛의 고요한 슬픔과, 그 심연 속에서 단단하게 솟아오르는 불굴의 영혼 의지를 감상하세요.',
    masterpieceInsight: '청력을 잃어가는 절망의 벼랑 끝에서 베토벤은 귀가 아닌 영혼의 안쪽으로 울리는 천상의 울림을 기록했습니다. 운명의 거친 파도는 영혼을 굴복시키지 못하며, 오히려 심연의 깊이를 더해줄 뿐입니다.',
    masterDirectAdvice: '시련과 고통 앞에서 무릎 꿇지 마십시오. 그대가 겪는 절망은 창작과 영혼을 무너뜨리는 적이 아니라, 당신 안에 잠든 거인을 깨우는 거룩한 천둥소리입니다. 운명의 목덜미를 부여잡고 당신만의 당당한 선율을 연주하십시오.',
    creativeSparkTechnique: '아다지오 소스테누토(Sostenuto): 감정이 격해질 때 템포를 늦추고 깊은 복식호흡으로 심연의 묵직한 힘을 모으기',
    colorPalette: ['#1E1B4B (심야의 루체른 호수 미드나이트)', '#64748B (고독한 달빛 슬레이트)', '#F8FAFC (순백의 영혼 화이트)'],
    inspirationAffirmation: '나는 어떤 운명의 시련 속에서도 굴복하지 않고 내 영혼의 승리를 창조한다.',
    artworks: [
      {
        id: 'beethoven_moonlight',
        piece: '피아노 소나타 제14번 \'월광\' 1악장 (Moonlight Sonata, Op.27 No.2)',
        medium: '낭만주의 피아노 소나타 (Adagio Sostenuto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: '4Tr0otuiQuU',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '깊은 밤 잔잔한 호수 위에 부서지는 달빛의 고요한 슬픔과 불굴의 영혼 의지를 감상하세요.',
        masterpieceInsight: '청력을 잃어가는 절망의 벼랑 끝에서 귀가 아닌 영혼의 안쪽으로 울리는 천상의 울림을 기록했습니다.',
        masterDirectAdvice: '시련과 고통 앞에서 무릎 꿇지 마십시오. 그대의 절망은 당신 안의 거인을 깨우는 거룩한 천둥소리입니다.',
        creativeSparkTechnique: '아다지오 소스테누토: 템포를 늦추고 깊은 복식호흡으로 심연의 묵직한 힘을 모으기',
        colorPalette: ['#1E1B4B (루체른 호수 미드나이트)', '#64748B (달빛 슬레이트)', '#F8FAFC (영혼 화이트)'],
        inspirationAffirmation: '나는 어떤 운명의 시련 속에서도 굴복하지 않고 내 영혼의 승리를 창조한다.',
      },
      {
        id: 'beethoven_fate',
        piece: '교향곡 제5번 \'운명\' 1악장 (Symphony No. 5 \'Fate\', Op. 67)',
        medium: '고전·낭만 교향곡 명작 (Allegro con brio)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'jv2WJMVPQi8',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '"운명은 이처럼 문을 두드린다"는 4개의 강렬한 동기가 거침없이 전개되며 불굴의 투쟁을 선언합니다.',
        masterpieceInsight: '비극적 운명의 타격에 굴복하지 않고, 단 4개의 음표로 운명과 맞서 싸워 승리하는 영웅적 투쟁의 드라마입니다.',
        masterDirectAdvice: '시련의 문 두드림을 피하지 마십시오! 운명의 목덜미를 부여잡고 당당히 맞서십시오. 당신은 고난보다 훨씬 강대합니다.',
        creativeSparkTechnique: '동기(Motive)의 불꽃: 가장 짧고 강력한 결단의 문장 하나를 가슴에 품고 흔들림 없이 정면 돌파하기',
        colorPalette: ['#991B1B (불굴의 투쟁 크림슨)', '#D97706 (승리의 나팔 골드)', '#0F172A (어두운 운명 네이비)'],
        inspirationAffirmation: '나는 내 운명의 문을 스스로 열어젖히며 당당히 승리한다.',
      },
      {
        id: 'beethoven_pathetique',
        piece: '피아노 소나타 제8번 \'비창\' 2악장 (Pathétique Sonata - Adagio cantabile)',
        medium: '낭만주의 피아노 명곡 (Adagio cantabile)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'vGq3gO3hFLo',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '폭풍 같은 비장미를 지나 따뜻하고 자비롭게 흐르는 아다지오 선율이 지친 영혼을 다정하게 위로합니다.',
        masterpieceInsight: '슬픔과 비탄의 심연 속에서도 인간 존엄과 사랑을 노래하는 가장 거룩하고 순수한 안식처입니다.',
        masterDirectAdvice: '슬픔을 억누르지 마십시오. 눈물 속에 깃든 다정함이 당신을 가장 깊은 예술가로 빚어내는 보약입니다.',
        creativeSparkTechnique: '비창의 자비(Cantabile): 상처 입은 나 자신에게 가장 따뜻한 노래를 불러주듯 다정하게 위로 건네기',
        colorPalette: ['#BE185D (온화한 온기 로즈)', '#4338CA (슬픔의 벨벳 인디고)', '#FEF3C7 (자비로운 촛불 크림)'],
        inspirationAffirmation: '나의 모든 눈물은 영혼의 성숙을 위한 가장 거룩하고 따뜻한 위로로 변모한다.',
      },
      {
        id: 'beethoven_ode_to_joy',
        piece: '교향곡 제9번 \'합창\' - 환희의 송가 (Symphony No. 9 \'Ode to Joy\', Op. 125)',
        medium: '인류 화합의 대교향곡 (Ode to Joy)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'Wod-MudLNmg',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '인류애와 자유를 노래하는 합창의 웅장한 물결이 모든 경계를 허물고 전 우주적인 환희로 솟구칩니다.',
        masterpieceInsight: '완전한 청각 상실의 암흑 속에서 베토벤이 영혼으로 작곡한, 모든 인류가 형제가 되는 궁극의 승리입니다.',
        masterDirectAdvice: '그 어떤 한계도 당신의 영혼을 가둘 수 없습니다. 당신 내면의 깊은 환희를 세상과 담대히 나누십시오!',
        creativeSparkTechnique: '환희의 포옹: 갈등과 한계를 뛰어넘어 모든 이들을 품어 안는 거대한 사랑의 시선 갖기',
        colorPalette: ['#F59E0B (천상의 환희 엠페러 골드)', '#2563EB (우주적 자유 로열 블루)', '#FFFFFF (순수한 연대 화이트)'],
        inspirationAffirmation: '나는 모든 장벽을 뛰어넘어 온 우주와 함께 환희의 노래를 부른다.',
      },
      {
        id: 'beethoven_emperor',
        piece: '피아노 협주곡 제5번 \'황제\' 2악장 (Piano Concerto No. 5 \'Emperor\', Op. 73 - Adagio)',
        medium: '영웅적 협주곡의 숭고한 안식 (Adagio un poco mosso)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'qUni-6B5q8k',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '장엄한 전투의 포성을 뚫고 천상에서 내려오는 듯한 피아노의 거룩하고 온화한 찬송가 선율이 온 세상을 위로합니다.',
        masterpieceInsight: '나폴레옹 전쟁의 포화 속 지하 대피소에서 귀를 베개로 막은 채 작곡한, 폭력을 초월하는 평화와 영적 존엄의 승리입니다.',
        masterDirectAdvice: '세상의 거친 소음과 혼란에 흔들리지 마십시오. 그대의 가슴속 깊은 곳에는 어떤 포화도 파괴할 수 없는 성스러운 황제의 안식처가 있습니다.',
        creativeSparkTechnique: '내면의 성소 피난: 외부의 압박이 극에 달할 때 눈을 감고 흔들리지 않는 내면의 숭고한 평화의 방으로 입장하기',
        colorPalette: ['#1E3A8A (깊은 묵상의 코발트)', '#F59E0B (황제의 온화한 황금빛)', '#FEF3C7 (천상의 안식 샴페인)'],
        inspirationAffirmation: '나는 세상의 어떤 혼란 속에서도 내면의 고결한 존엄과 평화를 지켜낸다.',
      },
      {
        id: 'beethoven_appassionata',
        piece: '피아노 소나타 제23번 \'열정\' 3악장 (Appassionata Sonata, Op. 57 - Allegro)',
        medium: '비극적 격정의 소나타 (Allegro ma non troppo)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'QImFm4bZgno',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '거침없이 휘몰아치는 16분음표의 폭풍우와 맹렬한 아르페지오가 인간 한계를 돌파하려는 거대한 불꽃으로 타오릅니다.',
        masterpieceInsight: '통제할 수 없는 운명의 폭풍과 내면의 격렬한 분노를 파괴가 아닌 불멸의 창조적 에너지로 승화시킨 피아노의 화산 폭발입니다.',
        masterDirectAdvice: '당신 안의 뜨거운 분노와 열정을 부끄러워하지 마십시오! 그것을 낭비하지 않고 창조의 용광로에 쏟아부을 때 세상을 뒤흔들 걸작이 탄생합니다.',
        creativeSparkTechnique: '격정의 예술화: 억눌린 억울함이나 분노를 거침없는 추진력과 속도감 넘치는 작업 에너지로 전환하기',
        colorPalette: ['#B91C1C (타오르는 화산 크림슨)', '#D97706 (격정의 용암 앰버)', '#09090B (심연의 화강암 블랙)'],
        inspirationAffirmation: '나는 내 안의 모든 격정과 고통을 불멸의 창조적 에너지로 폭발시킨다.',
      },
      {
        id: 'beethoven_symphony_7',
        piece: '교향곡 제7번 2악장 알레그레토 (Symphony No. 7 in A major, Op. 92 - Allegretto)',
        medium: '리듬의 신화와 장엄한 행진 (Allegretto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'mgHxmAsINDk',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '반복되는 장엄한 dactylic 리듬의 발걸음 위에 현악기들이 겹겹이 쌓아 올리는 슬프도록 아름다운 영혼의 행진곡입니다.',
        masterpieceInsight: '단순한 리듬 하나의 집요한 축적이 거대한 감정의 파도를 일으키는 구조적 천재성의 절정으로, 삶의 도도한 걸음을 상징합니다.',
        masterDirectAdvice: '흔들리지 말고 묵묵히 당신의 박자로 걸어가십시오. 한 걸음 한 걸음이 모여 마침내 누구도 멈출 수 없는 웅장한 승리의 행진이 됩니다.',
        creativeSparkTechnique: '리듬의 최면적 축적: 단순한 기본 리듬을 유지하며 한 층씩 디테일을 누적해 거대한 몰입감 형성하기',
        colorPalette: ['#334155 (엄숙한 대리석 슬레이트)', '#E11D48 (깊은 영혼의 루비)', '#93C5FD (희망의 광채 페일 블루)'],
        inspirationAffirmation: '나는 흔들림 없는 나의 리듬으로 매일 묵묵히 위대한 승리를 향해 전진한다.',
      },
      {
        id: 'beethoven_fur_elise',
        piece: '엘리제를 위하여 (Für Elise, WoO 59)',
        medium: '서정적 바가텔 명작 (Poco moto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'wfF0zHeU3Zs',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '세상에서 가장 친숙한 E-D#-E의 아련한 선율 속에 숨겨진 베토벤의 가장 다정하고 순수한 내면의 고백을 느껴보세요.',
        masterpieceInsight: '거칠고 타협을 모르던 거인의 가슴 밑바닥에 흐르던 가장 맑고 순수한 사랑과 다정함의 결정체입니다.',
        masterDirectAdvice: '마음속의 다정함을 감추지 마십시오. 세상과의 치열한 싸움 속에서도 누군가를 향한 맑은 다정함을 품고 있을 때 영혼은 결코 메마르지 않습니다.',
        creativeSparkTechnique: '소박한 서정의 선물: 소중한 누군가에게 작은 메모를 남기듯 가장 친근하고 부드러운 마음으로 표현하기',
        colorPalette: ['#FB7185 (설레는 뺨의 로즈 핑크)', '#FEF08A (오후의 햇살 크림)', '#38BDF8 (맑은 동심의 스카이블루)'],
        inspirationAffirmation: '내 가슴속에는 언제나 세상을 따뜻하게 적시는 순수한 사랑과 다정함이 흐른다.',
      },
      {
        id: 'beethoven_pastoral',
        piece: '교향곡 제6번 \'전원\' 1악장 (Symphony No. 6 \'Pastoral\', Op. 68)',
        medium: '자연 찬가의 교향곡 (Allegro ma non troppo)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 't2VY33VXnrQ',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '도시의 답답함을 벗어나 시골 숲길에 들어섰을 때 온몸을 감싸는 상쾌한 바람과 지저귀는 새소리의 평화로운 축복을 느껴보세요.',
        masterpieceInsight: '"숲속의 나무들은 나에게 인간보다 더 많은 것을 가르쳐준다"는 고백처럼, 자연과의 깊은 영적 합일을 통해 치유받는 순수한 안식입니다.',
        masterDirectAdvice: '답답할 때는 자연의 품으로 걸어 들어가십시오. 나무와 숲, 흙의 향기를 호흡할 때 복잡했던 머리가 맑아지고 지친 영혼이 소생합니다.',
        creativeSparkTechnique: '포레스트 호흡: 창문을 열고 싱그러운 풀잎의 향기를 상상하며 깊은 자연의 숨결을 3번 들이마시기',
        colorPalette: ['#16A34A (싱그러운 전원의 에메랄드)', '#FDE047 (숲길의 따스한 햇살 옐로)', '#BAE6FD (맑고 푸른 시골 하늘)'],
        inspirationAffirmation: '나는 자연의 평화로운 품 안에서 온전한 쉼과 새로운 생명력을 얻는다.',
      },
      {
        id: 'beethoven_waldstein',
        piece: '피아노 소나타 제21번 \'발트슈타인\' 1악장 (Waldstein Sonata, Op. 53 - Allegro)',
        medium: '찬란한 빛의 피아노 소나타 (Allegro con brio)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'lbblOwpeurs',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '동틀 녘 대지를 두드리는 경쾌한 박동과 찬란하게 쏟아져 내리는 황금빛 아침 햇살의 눈부신 에너지를 경험하세요.',
        masterpieceInsight: '어둠을 뚫고 솟아오르는 태양의 찬란한 빛과 무한한 긍정의 에너지를 피아노 건반 전체의 눈부신 음향으로 혁신해 낸 걸작입니다.',
        masterDirectAdvice: '어둠에 머물러 있지 마십시오! 새로운 아침의 눈부신 빛이 쏟아져 내리고 있습니다. 가슴을 활짝 열고 찬란한 에너지를 온몸으로 맞이하십시오.',
        creativeSparkTechnique: '새벽의 여명 질주: 동트기 전의 고요함을 뚫고 가장 활기찬 템포로 하루의 첫 작업을 힘차게 시작하기',
        colorPalette: ['#F59E0B (쏟아지는 여명의 황금빛)', '#2563EB (청명한 새벽 하늘 사파이어)', '#F8FAFC (순결한 태양광 화이트)'],
        inspirationAffirmation: '나는 어둠을 뚫고 솟아오르는 찬란한 아침 햇살처럼 눈부시게 빛난다.',
      },
      {
        id: 'beethoven_quartet_15',
        piece: '현악 사중주 제15번 3악장 \'감사의 노래\' (String Quartet No. 15, Op. 132 - Heiliger Dankgesang)',
        medium: '후기 현악 사중주의 정점 (Molto adagio)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/800px-Beethoven.jpg',
        musicVideoId: 'U_i2s9tGq7w',
        musicArtist: '루트비히 판 베토벤 (L.v. Beethoven)',
        musicListeningGuide: '중병에서 회복된 후 리디아 선법의 순수한 화음으로 하나님께 바친, 인간의 언어를 초월한 성스러운 감사의 기도입니다.',
        masterpieceInsight: '생사의 갈림길을 지나 다시 숨을 쉴 수 있게 된 자가 바치는 지극한 감사의 송가로, 고통을 통과한 영혼만이 도달할 수 있는 영적 성소입니다.',
        masterDirectAdvice: '다시 살아 숨 쉬고 있는 지금 이 순간에 깊이 감사하십시오. 건강과 호흡, 작은 일상의 회복이야말로 창작을 가능케 하는 가장 거룩한 기적입니다.',
        creativeSparkTechnique: '치유된 자의 감사 기도: 내가 당연하게 여겼던 일상의 3가지에 대해 진심 어린 감사의 마음을 고요히 품기',
        colorPalette: ['#FDE68A (성스러운 감사의 촛불 골드)', '#E2E8F0 (순결한 영혼의 은빛)', '#1E293B (영원한 안식의 밤하늘)'],
        inspirationAffirmation: '나는 살아 숨 쉬는 모든 순간에 깊이 감사하며 성스러운 평화 속에 머문다.',
      }
    ]
  },

  // 8. 프레데리크 쇼팽 (Frédéric Chopin)
  {
    id: 'chopin',
    name: '프레데리크 쇼팽 (Frédéric Chopin)',
    title: '피아노의 영혼 시인',
    piece: '야상곡 제2번 E플랫 장조 (Nocturne Op.9 No.2)',
    medium: '서정적 낭만주의 피아노 명작 (Bel Canto Piano Nocturne)',
    category: 'music',
    icon: '🕊️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
    musicVideoId: '9E6b3swbnWg',
    musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
    musicListeningGuide: '섬세하게 노래하는 벨칸토 선율과 왼손의 부드러운 아르페지오를 타고 지친 마음의 상처가 벨벳처럼 따뜻하게 감싸 안깁니다.',
    masterpieceInsight: '조국을 잃은 슬픔과 병약한 육신의 한계 속에서도 쇼팽은 건반 위에 가장 우아하고 고결한 눈물을 꽃피웠습니다. 부드러움과 서정성은 나약함이 아니라 세상을 치유하는 가장 강력한 영적 무기입니다.',
    masterDirectAdvice: '억지로 강한 척하거나 거칠어질 필요가 없습니다. 그대의 가장 섬세하고 연약한 감수성이야말로 누구도 흉내 낼 수 없는 고유한 마법입니다. 가슴속에 머무는 아련한 그리움과 다정함을 솔직하게 표현하십시오.',
    creativeSparkTechnique: '템포 루바토(Tempo Rubato): 엄격한 시간에 얽매이지 않고 감정의 물결을 따라 완급을 조절하며 자연스러운 리듬 회복하기',
    colorPalette: ['#F43F5E (가슴 뭉클한 로즈 핑크)', '#8B5CF6 (황혼의 바이올렛 벨벳)', '#FFF1F2 (부드러운 실크 크림)'],
    inspirationAffirmation: '나는 내 안의 가장 여린 감수성을 온 세상을 적시는 따뜻한 예술로 꽃피운다.',
    artworks: [
      {
        id: 'chopin_nocturne',
        piece: '야상곡 제2번 E플랫 장조 (Nocturne Op.9 No.2)',
        medium: '서정적 낭만주의 피아노 명작 (Bel Canto Piano Nocturne)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: '9E6b3swbnWg',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '섬세하게 노래하는 벨칸토 선율과 부드러운 아르페지오를 타고 마음의 상처가 벨벳처럼 감싸 안깁니다.',
        masterpieceInsight: '부드러움과 서정성은 나약함이 아니라 세상을 치유하는 가장 강력한 영적 무기입니다.',
        masterDirectAdvice: '억지로 강한 척하지 마세요. 그대의 섬세한 감수성이야말로 누구도 흉내 낼 수 없는 고유한 마법입니다.',
        creativeSparkTechnique: '템포 루바토: 엄격한 시간에 얽매이지 않고 감정의 물결을 따라 완급을 조절하기',
        colorPalette: ['#F43F5E (로즈 핑크)', '#8B5CF6 (바이올렛 벨벳)', '#FFF1F2 (실크 크림)'],
        inspirationAffirmation: '나는 내 안의 가장 여린 감수성을 온 세상을 적시는 따뜻한 예술로 꽃피운다.',
      },
      {
        id: 'chopin_raindrop',
        piece: '빗방울 전주곡 (Raindrop Prelude, Op.28 No.15)',
        medium: '낭만주의 전주곡 명작 (Sostenuto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: '6OFHXmizp38',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '수도원 처마 끝에서 일정하게 떨어지는 A플랫 빗방울 소리 위에 처연하고 아름다운 멜로디가 젖어듭니다.',
        masterpieceInsight: '죽음의 공포와 폐병의 고통 속에서 단조로운 빗방울의 반복을 천상의 묵시록적 시로 승화시켰습니다.',
        masterDirectAdvice: '마음속에 비가 내릴 때 억지로 멈추려 하지 마세요. 빗소리에 귀를 기울이면 그 속에 담긴 가장 맑은 노래가 들립니다.',
        creativeSparkTechnique: '빗방울 관조(Raindrop Contemplation): 마음의 슬픔을 한 방울의 빗방울처럼 담담히 바라보며 영감으로 전환하기',
        colorPalette: ['#0284C7 (처마 끝의 빗물 시안)', '#64748B (수도원의 비구름 그레이)', '#FEF08A (빗속의 희미한 촛불)'],
        inspirationAffirmation: '내 마음에 내리는 비는 메마른 영혼을 적시고 새싹을 틔우는 축복의 단비다.',
      },
      {
        id: 'chopin_tristesse',
        piece: '연습곡 Op.10 No.3 \'이별의 곡\' (Etude Op.10 No.3 \'Tristesse\')',
        medium: '서정적 에튀드 명작 (Lento ma non troppo)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: '9G_0uHhXJxE',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '쇼팽 스스로 "내 평생 이토록 아름다운 선율을 써본 적이 없다"고 고백한 조국을 향한 애절한 향수입니다.',
        masterpieceInsight: '상실의 아픔과 이별의 눈물을 가장 고귀한 서정적 보석으로 연마해 낸 피아노의 절창입니다.',
        masterDirectAdvice: '무언가를 떠나보내야 하는 상실의 순간에도 품위를 잃지 마십시오. 이별의 눈물은 새로운 시작의 거름입니다.',
        creativeSparkTechnique: '애도의 미학화: 슬픈 상실의 기억을 가장 아름다운 시 한 편으로 기록해 영원한 보석으로 남기기',
        colorPalette: ['#9F1239 (애절한 노스탤지어 와인)', '#C084FC (황혼의 페일 바이올렛)', '#FEF2F2 (순결한 눈물빛 핑크)'],
        inspirationAffirmation: '나는 모든 이별과 상실을 더 성숙하고 숭고한 사랑의 노래로 승화시킨다.',
      },
      {
        id: 'chopin_heroic_polonaise',
        piece: '영웅 폴로네이즈 (Heroic Polonaise, Op.53)',
        medium: '장엄한 폴란드 춤곡 명작 (Maestoso)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'KCSEhaOXUAA',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '조국의 불굴의 기상을 노래하는 당당한 옥타브 연타와 영웅적인 행진곡 풍의 멜로디가 가슴을 뜨겁게 달굽니다.',
        masterpieceInsight: '병약한 육신의 한계를 뛰어넘어 조국의 자유와 긍지를 포효하듯 건반 위에 새겨 넣은 영혼의 승전가입니다.',
        masterDirectAdvice: '주저앉지 마십시오! 당신 안에는 세상을 울릴 영웅의 심장이 뛰고 있습니다. 당당하게 행진하십시오!',
        creativeSparkTechnique: '영웅적 옥타브 도약: 위축되는 순간 가슴을 활짝 펴고 당당한 승리의 선율을 상상하며 기운 북돋우기',
        colorPalette: ['#B91C1C (불굴의 영웅 레드)', '#F59E0B (당당한 승리의 골드)', '#1E1B4B (깊은 긍지의 미드나이트)'],
        inspirationAffirmation: '내 안에는 어떤 역경도 단숨에 돌파할 수 있는 영웅의 긍지와 힘이 살아 숨 쉰다.',
      },
      {
        id: 'chopin_ballade_1',
        piece: '발라드 제1번 G단조 (Ballade No. 1 in G minor, Op. 23)',
        medium: '피아노 대서사시 (Largo - Moderato)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'Ce8p0VcTbuA',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '미츠키에비치의 서사시에 영감을 받아 작곡된 곡으로, 가슴을 저미는 비장미와 폭풍 같은 코다의 거대한 격정이 펼쳐집니다.',
        masterpieceInsight: '단순한 소품의 영역을 넘어 피아노라는 악기로 문학적 대서사시의 깊은 영혼의 드라마를 구현해 낸 낭만주의 피아노의 금자탑입니다.',
        masterDirectAdvice: '당신의 삶에는 하나의 거대한 이야기가 흐르고 있습니다. 비극과 상처마저도 위대한 서사의 장대한 전환점으로 품어 안으십시오.',
        creativeSparkTechnique: '내러티브 드라마 빌드업: 하나의 묵직한 서사적 줄거리를 상상하며 도입, 전개, 절정, 파국의 흐름으로 표현하기',
        colorPalette: ['#1E1B4B (비극적 서사의 딥 인디고)', '#991B1B (폭풍 같은 코다 크림슨)', '#FEF08A (애잔한 회상의 촛불 골드)'],
        inspirationAffirmation: '내 삶의 모든 굴곡은 하나의 위대하고 아름다운 영혼의 서사시로 완성된다.',
      },
      {
        id: 'chopin_nocturne_csharp',
        piece: '야상곡 제20번 C샤프 단조 유작 (Nocturne in C-sharp minor, B. 49)',
        medium: '애수의 녹턴 (Lento con gran espressione)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'm5qeuVOIbHk',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '영화 〈피아니스트〉의 폐허 속에서 울려 퍼졌던 전설의 선율로, 죽음의 공포마저 눈물로 씻어내는 영혼의 가장 고결한 애수를 느껴보세요.',
        masterpieceInsight: '가장 비참한 절망의 순간에도 인간의 존엄과 순결한 아름다움을 지켜내는 예술의 불멸성을 증언합니다.',
        masterDirectAdvice: '모든 것이 무너져 내린 폐허 속에서도 아름다움을 향한 기도를 멈추지 마십시오. 당신의 순결한 선율이 어둠을 치유합니다.',
        creativeSparkTechnique: '폐허의 고결한 선율: 상황이 절망적일수록 더 깊고 진실한 품격의 언어와 태도를 회복하기',
        colorPalette: ['#475569 (폐허의 잿빛 슬레이트)', '#E11D48 (상처 입은 영혼의 루비)', '#F8FAFC (불멸의 순백 화이트)'],
        inspirationAffirmation: '어떤 폐허 속에서도 내 영혼의 고결한 아름다움은 영원히 꺼지지 않는다.',
      },
      {
        id: 'chopin_revolution',
        piece: '연습곡 Op. 10 제12번 \'혁명\' (Revolutionary Etude in C minor)',
        medium: '격정의 테크닉 에튀드 (Allegro con fuoco)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'w2vG2hxJ3r0',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '조국 바르샤바의 함락 소식을 듣고 격노한 쇼팽이 왼손의 폭풍 같은 패시지와 오른손의 비장한 외침으로 건반 위에 쏟아낸 분노입니다.',
        masterpieceInsight: '무기력한 탄식 대신 의로운 분노를 타오르는 예술적 불꽃으로 전환한 영혼의 사자후입니다.',
        masterDirectAdvice: '부당한 상황 앞에서 비겁하게 고개 숙이지 마십시오! 당신 안의 거룩한 분노를 정당한 창조와 혁신의 에너지로 폭발시키십시오.',
        creativeSparkTechnique: '혁명적 아르페지오: 억눌린 억울함과 슬픔을 단숨에 몰아치는 폭풍의 속도감으로 종이 위에 쏟아내기',
        colorPalette: ['#DC2626 (타오르는 조국애 스칼렛)', '#18181B (비장한 심연 옵시디언)', '#F59E0B (자유의 횃불 골드)'],
        inspirationAffirmation: '나는 내 안의 거룩한 열정으로 모든 속박을 뚫고 자유와 정의를 선포한다.',
      },
      {
        id: 'chopin_waltz_csharp',
        piece: '왈츠 Op. 64 제2번 C샤프 단조 (Waltz in C-sharp minor, Op. 64 No. 2)',
        medium: '애수 어린 살롱 왈츠 (Tempo giusto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'wTSu1gwQnvg',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '회전하는 무도회의 겉모습 이면에 숨겨진 쓸쓸한 눈물과 아련한 한숨이 우아한 스텝 사이로 슬며시 비쳐옵니다.',
        masterpieceInsight: '춤곡의 경쾌함 속에 슬픔의 베일을 씌운 쇼팽 특유의 잘(Żal, 애수)의 미학으로, 슬픔마저 우아하게 춤추게 만듭니다.',
        masterDirectAdvice: '슬픔이 찾아올 때도 품위를 잃지 마십시오. 눈물을 흘리면서도 가볍게 스텝을 밟을 수 있을 때 삶은 진정한 예술이 됩니다.',
        creativeSparkTechnique: '슬픔의 우아한 춤: 무거운 감정을 질질 끌지 않고 가벼운 왈츠 리듬처럼 유연하게 회전시키며 흘려보내기',
        colorPalette: ['#7C2D12 (고풍스러운 마호가니 살롱)', '#F43F5E (아련한 벨벳 로즈)', '#FEF3C7 (샹들리에의 촛불 크림)'],
        inspirationAffirmation: '나는 삶의 슬픔마저 가장 우아하고 고결한 춤으로 승화시킨다.',
      },
      {
        id: 'chopin_piano_concerto_1',
        piece: '피아노 협주곡 제1번 2악장 로망스 (Piano Concerto No. 1, Op. 11 - Romance)',
        medium: '청춘의 서정적 협주곡 (Larghetto)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: '61zXwG7rX6w',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '쇼팽 스스로 "달빛이 비치는 아름다운 봄밤의 몽상"이라고 묘사했던 첫사랑을 향한 순결하고 설레는 고백입니다.',
        masterpieceInsight: '스무 살 청년의 가장 순수한 설렘과 이상적인 사랑을 달빛 아래 반짝이는 영롱한 보석으로 빚어냈습니다.',
        masterDirectAdvice: '첫사랑의 순결한 설렘을 가슴에 품으십시오. 계산되지 않은 순수한 열정이야말로 가장 큰 창조의 기적을 낳습니다.',
        creativeSparkTechnique: '봄밤의 몽상(Romance): 가슴 뛰는 첫 설렘의 기억을 떠올리며 가장 따스하고 반짝이는 시선으로 작업하기',
        colorPalette: ['#38BDF8 (달빛 비치는 봄밤 스카이)', '#FDE68A (설레는 촛불 골드)', '#F472B6 (첫사랑의 페일 핑크)'],
        inspirationAffirmation: '내 가슴은 언제나 첫사랑의 설렘처럼 맑고 순수한 열정으로 반짝인다.',
      },
      {
        id: 'chopin_berceuse',
        piece: '자장가 D플랫 장조 (Berceuse in D-flat major, Op. 57)',
        medium: '피아노 음향의 극치 (Andante)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'wJ7eH7eU5wI',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '왼손의 흔들침대 같은 단조로운 요람 리듬 위로 오른손이 펼쳐 보이는 16개의 영롱한 레이스 장식 같은 변주를 감상하세요.',
        masterpieceInsight: '단 하나의 고요한 베이스 위에서 영롱한 빛의 입자들이 아지랑이처럼 피어오르는 피아노 음향 미학의 정점입니다.',
        masterDirectAdvice: '불안한 마음을 요람처럼 다정하게 토닥이십시오. 조급함을 내려놓고 편안한 리듬에 몸을 맡길 때 영혼은 가장 평온한 안식을 누립니다.',
        creativeSparkTechnique: '요람의 변주: 안정적인 기본 리듬을 유지한 채 그 위에서 가장 자유롭고 섬세한 디테일을 변주하기',
        colorPalette: ['#FDF4FF (포근한 요람의 실크 화이트)', '#E879F9 (영롱한 진주빛 마젠타)', '#38BDF8 (평온한 안식의 하늘빛)'],
        inspirationAffirmation: '나는 포근한 요람처럼 안전하고 평화로운 안식 속에서 깊이 쉰다.',
      },
      {
        id: 'chopin_fantasie_impromptu',
        piece: '즉흥환상곡 C샤프 단조 (Fantaisie-Impromptu, Op. posth. 66)',
        medium: '환상적 아라베스크 피아노 명작 (Allegro agitato)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/800px-Frederic_Chopin_photo.jpeg',
        musicVideoId: 'Gus4dnQuiGk',
        musicArtist: '프레데리크 쇼팽 (Frédéric Chopin)',
        musicListeningGuide: '오른손 16분음표 4개와 왼손 3연음부의 교차 리듬이 빚어내는 환상적인 질주와, 가운데 감미로운 칸타빌레의 대조를 느껴보세요.',
        masterpieceInsight: '쇼팽 사후에 출판되었으나 전 세계인의 가슴을 사로잡은 곡으로, 질주하는 열정과 달콤한 내면 고백의 완벽한 융합입니다.',
        masterDirectAdvice: '정형화된 박자에 갇히지 마십시오. 서로 다른 리듬이 겹쳐지듯 복잡한 일상 속에서도 가장 조화로운 환상의 선율을 엮어낼 수 있습니다.',
        creativeSparkTechnique: '복합 리듬 크로스오버: 상반된 두 가지 생각이나 리듬을 교차시키며 입체적인 생동감 창출하기',
        colorPalette: ['#9333EA (환상적인 바이올렛 플레임)', '#F59E0B (질주하는 황금빛 아르페지오)', '#1E1B4B (심야의 벨벳 네이비)'],
        inspirationAffirmation: '나는 상반된 삶의 리듬을 뛰어넘어 환상적인 조화와 생동감으로 비상한다.',
      }
    ]
  },

  // 9. 라이너 마리아 릴케 (Rainer Maria Rilke)
  {
    id: 'rilke',
    name: '라이너 마리아 릴케 (Rainer Maria Rilke)',
    title: '영혼의 고독과 장미의 시인',
    piece: '가을날 (Herbsttag)',
    medium: '상징주의 명시 (Symbolist Masterpiece Poem)',
    category: 'poem',
    icon: '🍂',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
    poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
    poemText: `주여, 때가 왔습니다. 여름은 참으로 위대했습니다.
해시계 위에 당신의 그림자를 얹으시고
들판에 바람을 풀어놓으십시오.

마지막 과일들이 무르익도록 명하시고
이틀만 더 남국의 햇빛을 베푸시어
과일들이 차오르도록 재촉하시고
독한 포도주 속에 마지막 단맛을 채워주십시오.

지금 집이 없는 사람은 이제 집을 짓지 않습니다.
지금 혼자인 사람은 오래도록 혼자로 남아
잠 못 이루고, 책을 읽고, 긴 편지를 쓸 것이며
낙엽이 뒹구는 날이면 불안스레
가로수 길을 이리저리 헤맬 것입니다.`,
    masterpieceInsight: '풍요로웠던 여름의 잎사귀들이 모두 떨어져 내리는 가을의 끝자락, 시인은 고독을 외면하지 않고 온전히 끌어안습니다. 잎사귀가 질 때 비로소 드러나는 나무의 뼈대처럼, 고독 속에서만 영혼의 참된 본질이 서늘하게 빛납니다.',
    masterDirectAdvice: '외로움과 고독을 두려워하지 마십시오. 세상의 소란함에서 벗어나 혼자 남겨진 바로 이 시간이 그대의 내면 서랍을 정리하고 가장 깊은 통찰을 건져 올리는 축복의 계절입니다. 불안을 피하지 말고 고요히 응시하십시오.',
    creativeSparkTechnique: '말테의 일기 관조법: 오늘 하루 마주친 평범한 사물 하나를 5분 동안 아무 판단 없이 가만히 바라보며 존재의 무게 느끼기',
    colorPalette: ['#B45309 (무르익은 가을 앰버)', '#78350F (떨어지는 낙엽 세피아)', '#FEF3C7 (희미한 햇살 베이지)'],
    inspirationAffirmation: '나는 고독의 품 안에서 내 영혼의 가장 깊고 영롱한 진실을 발견한다.',
    artworks: [
      {
        id: 'rilke_herbsttag',
        piece: '가을날 (Herbsttag)',
        medium: '상징주의 명시 (Symbolist Masterpiece Poem)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `주여, 때가 왔습니다. 여름은 참으로 위대했습니다.
해시계 위에 당신의 그림자를 얹으시고
들판에 바람을 풀어놓으십시오.

마지막 과일들이 무르익도록 명하시고
이틀만 더 남국의 햇빛을 베푸시어
과일들이 차오르도록 재촉하시고
독한 포도주 속에 마지막 단맛을 채워주십시오.

지금 집이 없는 사람은 이제 집을 짓지 않습니다.
지금 혼자인 사람은 오래도록 혼자로 남아
잠 못 이루고, 책을 읽고, 긴 편지를 쓸 것이며
낙엽이 뒹구는 날이면 불안스레
가로수 길을 이리저리 헤맬 것입니다.`,
        masterpieceInsight: '잎사귀가 질 때 비로소 드러나는 나무의 뼈대처럼, 고독 속에서만 영혼의 참된 본질이 서늘하게 빛납니다.',
        masterDirectAdvice: '혼자 남겨진 이 시간이 그대의 내면 서랍을 정리하고 깊은 통찰을 건져 올리는 축복의 계절입니다.',
        creativeSparkTechnique: '말테의 일기 관조법: 평범한 사물 하나를 5분간 아무 판단 없이 응시하며 존재의 무게 느끼기',
        colorPalette: ['#B45309 (가을 앰버)', '#78350F (낙엽 세피아)', '#FEF3C7 (햇살 베이지)'],
        inspirationAffirmation: '나는 고독의 품 안에서 내 영혼의 가장 깊고 영롱한 진실을 발견한다.',
      },
      {
        id: 'rilke_letters_to_a_young_poet',
        piece: '젊은 시인에게 보내는 편지 (Letters to a Young Poet)',
        medium: '영혼의 서간 에세이 명작',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `마음속의 풀리지 않는 문제들에 대해 인내심을 가지십시오.
문제 자체를 굳게 닫힌 방이나 낯선 언어로 쓰인 책처럼 사랑하십시오.
지금 당장 답을 얻으려 하지 마십시오.
당신은 아직 그것을 살아낼 수 없기 때문입니다.

모든 것을 그냥 살아내십시오.
그러다 보면 어느 날 당신도 모르게
답 속에 살고 있는 자신을 발견하게 될 것입니다.`,
        masterpieceInsight: '불확실성과 질문 자체를 사랑하며 시간을 견뎌내는 태도야말로 영혼의 성숙을 이끄는 참된 지혜입니다.',
        masterDirectAdvice: '조급하게 결론을 내리려 하지 마십시오. 지금 마주한 고민과 질문 자체를 온몸으로 살아내십시오.',
        creativeSparkTechnique: '질문 살아내기: 당장 답을 내지 않고 오늘 하루를 그 질문을 품은 채 충실히 살아보기',
        colorPalette: ['#047857 (인내의 딥 에메랄드)', '#D97706 (지혜의 앤틱 골드)', '#F8FAFC (순수한 양피지 화이트)'],
        inspirationAffirmation: '나는 내 안의 모든 질문을 사랑하며, 마침내 아름다운 답 속으로 걸어 들어간다.',
      },
      {
        id: 'rilke_inner_rose',
        piece: '장미의 내면 (The Inner Rose / Das Rosen-Innere)',
        medium: '신비주의 명시 (Mystic Lyric)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `어디에서 이 내면을 향한 외면이 오는가?
어떤 상처 위에 이런 부드러운 천이 덮이는가?
장미는 너무나 충만하여 스스로를 넘어 넘쳐흐르누나.

내면의 공간을 수많은 꽃잎으로 감싸 안으며,
세계 전체를 제 안으로 끌어당겨
침묵의 향기로 가득 채우는 꽃이여.`,
        masterpieceInsight: '수많은 겹의 꽃잎으로 내면을 감싸 안으면서도 온 세상에 은은한 향기를 퍼뜨리는 장미의 신비입니다.',
        masterDirectAdvice: '내면의 깊이를 단단히 가꾸십시오. 안쪽이 향기로 가득 차면 억지로 애쓰지 않아도 저절로 향기가 넘쳐납니다.',
        creativeSparkTechnique: '장미의 내면화: 외부의 시선보다 내면의 순수한 만족과 충만감을 가꾸는 데 집중하기',
        colorPalette: ['#BE185D (장미의 심연 마젠타)', '#FB7185 (부드러운 꽃잎 페일 핑크)', '#065F46 (보호하는 잎사귀 딥 그린)'],
        inspirationAffirmation: '내 영혼은 안으로부터 넘쳐흐르는 순수한 향기로 세상을 물들인다.',
      },
      {
        id: 'rilke_panther',
        piece: '표범 (The Panther / Der Panther, 1902)',
        medium: '사물시(Dinggedicht)의 정점',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `쇠창살이 지나가는 것에 지쳐
그의 눈길은 이제 아무것도 붙잡지 못한다.
그에게는 천 개의 창살만이 있는 것 같고,
창살 너머에는 아무런 세계도 없는 것 같다.

강력한 발걸음이 그리는 부드러운 유연한 행보는
가장 작은 원을 그리며 돌고 돌아
마비된 거대한 의지가 중심에 서 있는
하나의 힘의 춤과도 같다.

오직 때때로 눈동자의 커튼이 소리 없이 열릴 때가 있다.
그러면 한 줄기 형상이 안으로 들어가,
팽팽하게 긴장된 사지의 고요를 뚫고 지나가선,
마침내 심장에 이르러 사라져 버린다.`,
        masterpieceInsight: '철창에 갇힌 맹수의 지친 눈빛과 원을 그리며 맴도는 유연한 발걸음 속에서, 억압된 현대인의 내면과 침묵의 중심에 선 거대한 영혼의 의지를 응시합니다.',
        masterDirectAdvice: '세상의 답답한 쇠창살에 갇힌 듯 느껴질지라도 낙담하지 마십시오. 당신의 심장 중심에는 여전히 마비되지 않는 거대한 영혼의 불꽃이 살아 숨 쉽니다.',
        creativeSparkTechnique: '사물의 심연 투시: 감정을 투사하지 않고 대상의 본질과 긴장된 침묵을 있는 그대로 투명하게 응시하기',
        colorPalette: ['#18181B (창살 너머의 옵시디언 블랙)', '#F59E0B (표범의 황금빛 눈동자)', '#64748B (철창의 차가운 슬레이트)'],
        inspirationAffirmation: '어떤 구속 속에서도 내 심장 중심의 거대한 의지와 생명력은 꺾이지 않는다.',
      },
      {
        id: 'rilke_duino_elegy_1',
        piece: '두이노의 비가 제1비가 (Duino Elegies - First Elegy, 1912)',
        medium: '실존과 초월의 대서사시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `내가 소리친들, 천사들의 서열 중 그 누가
내 목소리를 들어줄 것인가?
설령 그들 중 하나가 나를 가슴에 껴안는다 해도,
나는 그의 강력한 존재감에 소멸하고 말리라.

아름다움이란 우리가 겨우 견뎌낼 수 있는
공포의 시작일 뿐이기에.
우리가 아름다움을 이토록 찬미하는 것은,
그것이 우리를 파멸시키길 태연히 거부하기 때문이다.
모든 천사는 두렵다.`,
        masterpieceInsight: '아드리아해의 거친 바위 절벽 위에서 들려온 영적 전율을 담은 비가로, 인간의 유한성과 숭고한 아름다움이 지닌 서늘한 공포의 본질을 직면합니다.',
        masterDirectAdvice: '경외심을 품고 전율하십시오. 참된 아름다움은 안락한 위로가 아니라, 우리를 뒤흔들고 더 높은 영적 차원으로 깨어나게 만드는 거룩한 두려움입니다.',
        creativeSparkTechnique: '숭고미의 전율: 나를 압도하는 거대한 자연과 예술 앞에서 겸허히 무릎 꿇고 영혼의 지평을 넓히기',
        colorPalette: ['#1E1B4B (천사의 심연 코스믹 인디고)', '#E2E8F0 (두이노 절벽의 대리석 실버)', '#D97706 (두려운 아름다움의 골드)'],
        inspirationAffirmation: '나는 두려운 아름다움을 담대히 직면하며 내 영혼의 높은 비상을 완성한다.',
      },
      {
        id: 'rilke_orpheus_sonnet',
        piece: '오르페우스에게 바치는 소네트 (Sonnets to Orpheus, 1922)',
        medium: '변용과 찬미의 소네트 (제1부 1편)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `거기에 한 그루 나무가 솟아올랐다. 오, 순수한 초월이여!
오, 오르페우스가 노래한다! 오, 귓속에 솟은 높은 나무여!
그리고 모든 것은 침묵했다. 그러나 그 침묵 속에서도
새로운 시작과 신호와 변화가 일어났다.

침묵의 동물들이 어둠의 숲을 지나
굴과 보금자리에서 걸어 나왔다.
그것은 교활함 때문도, 두려움 때문도 아니었고,
오직 귀 기울여 듣기 위함이었다.`,
        masterpieceInsight: '노래가 시작될 때 귓속에 나무가 솟아오르고 사나운 맹수들조차 귀를 기울이며 평화의 성전이 세워지는 예술의 기적적인 변용을 찬양합니다.',
        masterDirectAdvice: '당신의 진실한 노래와 언어로 혼란한 세상을 치유하십시오. 순수한 예술적 찬미가 울려 퍼질 때 야만의 숲은 거룩한 성전으로 변모합니다.',
        creativeSparkTechnique: '순수한 경청과 변용: 외부의 비난과 소음을 침묵 속에서 듣고 가장 아름다운 시의 선율로 되돌려주기',
        colorPalette: ['#047857 (귓속에 솟은 지혜의 녹색 나무)', '#F59E0B (오르페우스의 리라 골드)', '#FEF3C7 (순결한 침묵 크림)'],
        inspirationAffirmation: '내 영혼의 순수한 노래는 혼돈의 세상을 성스러운 평화의 숲으로 바꾼다.',
      },
      {
        id: 'rilke_life',
        piece: '인생 (Life / Das Leben)',
        medium: '삶의 수용과 자유의 명시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `인생을 꼭 이해할 필요는 없다.
인생은 하나의 축제와 같은 것.
하루하루를 있는 그대로 살아가라.
바람이 불어올 때면 떨어지는 꽃잎을 받아 쥐듯,
지나가는 바람을 두려워하지 마라.

아이들이 길가에 떨어진 꽃잎을 모아 화관을 만들듯,
너의 하루를 순수한 놀이로 채워라.
인생을 분석하려 애쓰지 마라.
그냥 꽃잎을 손에 쥐고 축제를 즐겨라.`,
        masterpieceInsight: '삶을 머리로 분석하고 통제하려는 강박을 내려놓고, 축제에 초대받은 아이처럼 하루하루를 선물로 누리는 무조건적 긍정입니다.',
        masterDirectAdvice: '모든 것을 통제하고 이해하려 애쓰지 마십시오. 인생은 풀려야 할 문제가 아니라 경험되어야 할 축제입니다. 가벼운 마음으로 걸어가세요.',
        creativeSparkTechnique: '축제의 꽃잎 수용: 골치 아픈 계산을 멈추고 오늘 주어진 사소한 순간을 향기로운 축제로 즐기기',
        colorPalette: ['#FB7185 (축제의 꽃잎 소프트 핑크)', '#FEF08A (따스한 햇살 골드)', '#E0F2FE (가벼운 바람 하늘빛)'],
        inspirationAffirmation: '나는 삶을 분석하려 애쓰지 않고 매 순간을 축제처럼 기쁘게 살아낸다.',
      },
      {
        id: 'rilke_give_me_your_anxiety',
        piece: '너의 불안을 내게 다오 (Give Me Your Anxiety / 기도 시집)',
        medium: '치유와 위로의 기도시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `너의 모든 불안과 두려움을 내게 다오.
나는 어둠 속에서도 너를 품어 안는 대지이며,
네가 쓰러질 때 기꺼이 너를 받아내는 깊은 밤이다.

두려워하지 마라, 어둠이 깊어지는 것을.
나무가 뿌리를 깊이 내리기 위해
어두운 흙속으로 파고들어야 하듯,
너의 영혼도 어둠 속에서 자라난다.
밤은 너를 해치지 않고 너를 성숙하게 한다.`,
        masterpieceInsight: '어둠과 불안을 배척해야 할 적이 아니라, 영혼이 더 깊은 뿌리를 내리기 위해 통과해야 하는 성스러운 대지의 자궁으로 품어 안습니다.',
        masterDirectAdvice: '불안이 밀려올 때 억지로 싸우려 하지 마십시오. 어둠을 품어주는 대지처럼 그 감정을 있는 그대로 안아주세요. 깊은 어둠 속에서 가장 단단한 뿌리가 자랍니다.',
        creativeSparkTechnique: '대지의 품 안기: 불안한 가슴 위에 두 손을 얹고 깊은 흙처럼 나 자신을 포근하게 품어주기',
        colorPalette: ['#78350F (품어주는 대지 브라운)', '#1E1B4B (성스러운 어둠 미드나이트)', '#FBBF24 (숨겨진 뿌리의 생명 골드)'],
        inspirationAffirmation: '나는 어둠을 두려워하지 않으며 내 영혼의 가장 깊은 뿌리를 단단히 내린다.',
      },
      {
        id: 'rilke_serious_hour',
        piece: '엄숙한 시간 (Ernste Stunde, 1900)',
        medium: '세계 고통의 연대 명시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `지금 세상 어디선가 까닭 없이 울고 있는 자는,
까닭 없이 세상에서 울고 있는 자는,
나를 위해 울고 있다.

지금 세상 어디선가 밤중에 까닭 없이 웃고 있는 자는,
밤중에 까닭 없이 웃고 있는 자는,
나를 비웃고 있다.

지금 세상 어디선가 까닭 없이 걷고 있는 자는,
정처 없이 세상 속을 걷고 있는 자는,
나를 향해 걸어오고 있다.

지금 세상 어디선가 까닭 없이 죽어가고 있는 자는,
세상에서 죽어가고 있는 자는,
나를 쳐다보고 있다.`,
        masterpieceInsight: '지구 반대편 누군가의 울음과 죽음이 결코 나와 무관하지 않다는 전 지구적 자비와 영적 연대의 서늘한 통찰입니다.',
        masterDirectAdvice: '고립된 섬으로 살지 마십시오. 당신의 고통은 세상 모든 이들의 눈물과 연결되어 있고, 당신의 창조적 회복은 온 세상을 치유하는 거룩한 나비효과입니다.',
        creativeSparkTechnique: '전 우주적 자비 연대: 나의 작은 작업이 지금 어딘가에서 울고 있는 한 사람을 위로할 수 있음을 상상하기',
        colorPalette: ['#334155 (엄숙한 시간 슬레이트)', '#E11D48 (연대의 뜨거운 눈물 루비)', '#F8FAFC (연결된 영혼 화이트)'],
        inspirationAffirmation: '나는 온 세상의 아픔과 자비로 연결되어 세상을 치유하는 빛이 된다.',
      },
      {
        id: 'rilke_widening_circles',
        piece: '나는 나의 삶을 살아간다 (I Live My Life in Widening Circles)',
        medium: '영적 성장의 원환 시편',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rainer_Maria_Rilke_1900.jpg/800px-Rainer_Maria_Rilke_1900.jpg',
        poet: '라이너 마리아 릴케 (Rainer Maria Rilke)',
        poemText: `나는 만물 위로 점점 넓혀가는
원(Circle)들을 그리며 나의 삶을 살아간다.
어쩌면 나는 마지막 원을 완성하지 못할지도 모른다.
하지만 나는 기꺼이 시도하리라.

나는 신을 중심으로, 태고의 탑을 중심으로 돌고 있다.
나는 수천 년을 돌아왔건만 아직도 알지 못한다.
내가 한 마리의 매인지, 폭풍인지,
아니면 위대한 하나의 노래인지.`,
        masterpieceInsight: '점점 더 넓은 동심원을 그리며 영적 중심을 향해 나아가는 인간 영혼의 끝없는 탐구와 초월적 확장을 노래합니다.',
        masterDirectAdvice: '마지막 원을 완성하지 못할까 두려워하지 마십시오. 매 순간 원을 넓혀가는 바로 그 시도와 여정 자체가 이미 완전한 예술입니다.',
        creativeSparkTechnique: '동심원 확장: 나의 관심과 사랑의 범위를 가족, 이웃, 생명 전체로 매일 한 뼘씩 넓혀보기',
        colorPalette: ['#4338CA (만물을 품는 코스믹 인디고)', '#F59E0B (태고의 중심 골드)', '#38BDF8 (확장하는 창공 시안)'],
        inspirationAffirmation: '나는 매일 더 넓고 자비로운 원을 그리며 무한한 생명의 중심으로 나아간다.',
      }
    ]
  },

  // 10. 윤동주 (Yoon Dong-ju)
  {
    id: 'yoondongju',
    name: '윤동주 (Yoon Dong-ju)',
    title: '별을 노래한 청년 시인',
    piece: '별 헤는 밤 (Counting the Stars at Night, 1941)',
    medium: '한국 근대 서정 명시 (Korean Pure Lyric Masterpiece)',
    category: 'poem',
    icon: '⭐',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Yun_Dong-ju.jpg/800px-Yun_Dong-ju.jpg',
    poet: '윤동주 (Yoon Dong-ju)',
    poemText: `계절이 지나가는 하늘에는
가을로 가득 차 있습니다.

나는 아무 걱정도 없이
가을 속의 별들을 다 헤일 듯합니다.

가슴 속에 하나 둘 새겨지는 별을
이제 다 못 헤는 것은
쉬이 아침이 오는 까닭이요,
내일 밤이 남은 까닭이요,
아직 나의 청춘이 다하지 않은 까닭입니다.

별 하나에 추억과
별 하나에 사랑과
별 하나에 쓸쓸함과
별 하나에 동경과
별 하나에 시와
별 하나에 어머니, 어머니...`,
    masterpieceInsight: '암흑의 시대 속에서도 한 점 부끄럼 없기를 소망하며 밤하늘의 별을 헤던 청년 시인의 고결한 영혼입니다. 어둠이 짙을수록 순결한 양심과 소망의 별빛은 시대를 넘어 영원히 꺼지지 않는 등대가 됩니다.',
    masterDirectAdvice: '세상이 거칠고 메말라 보일지라도, 그대 가슴속에 품은 순수한 이상과 다정함을 결코 잃지 마십시오. 남들이 알아주지 않아도 별 하나에 사랑과 시를 새기는 그대의 순결한 태도가 당신의 삶을 거룩하게 지켜줄 것입니다.',
    creativeSparkTechnique: '별빛 네이밍(Star Naming): 지금 나를 괴롭히는 감정이나 감사한 인연에게 가장 아름다운 이름을 붙여 가만히 불러보기',
    colorPalette: ['#1E3A8A (가을밤 깊은 청색)', '#FDE047 (순결한 소망의 별빛 옐로)', '#F1F5F9 (순백의 청춘 화이트)'],
    inspirationAffirmation: '나는 밤하늘의 별처럼 맑고 순결한 마음으로 나의 길을 묵묵히 걸어간다.',
    artworks: [
      {
        id: 'ydj_starry_night',
        piece: '별 헤는 밤 (Counting the Stars at Night, 1941)',
        medium: '한국 근대 서정 명시 (Korean Pure Lyric Masterpiece)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Yun_Dong-ju.jpg/800px-Yun_Dong-ju.jpg',
        poet: '윤동주 (Yoon Dong-ju)',
        poemText: `계절이 지나가는 하늘에는 가을로 가득 차 있습니다.
나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다.

가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은
쉬이 아침이 오는 까닭이요, 내일 밤이 남은 까닭이요,
아직 나의 청춘이 다하지 않은 까닭입니다.

별 하나에 추억과 별 하나에 사랑과
별 하나에 쓸쓸함과 별 하나에 동경과
별 하나에 시와 별 하나에 어머니, 어머니...`,
        masterpieceInsight: '어둠이 짙을수록 순결한 양심과 소망의 별빛은 시대를 넘어 영원히 꺼지지 않는 등대가 됩니다.',
        masterDirectAdvice: '세상이 거칠지라도 순수한 이상과 다정함을 잃지 마십시오. 별 하나에 시를 새기는 태도가 당신을 지켜줍니다.',
        creativeSparkTechnique: '별빛 네이밍: 감사한 인연과 소중한 가치에 아름다운 이름을 붙여 가만히 불러보기',
        colorPalette: ['#1E3A8A (가을밤 깊은 청색)', '#FDE047 (소망의 별빛 옐로)', '#F1F5F9 (순백의 청춘 화이트)'],
        inspirationAffirmation: '나는 밤하늘의 별처럼 맑고 순결한 마음으로 나의 길을 묵묵히 걸어간다.',
      },
      {
        id: 'ydj_prologue',
        piece: '서시 (Prologue / Foreword, 1941)',
        medium: '한국 최고의 불멸 명시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Yun_Dong-ju.jpg/800px-Yun_Dong-ju.jpg',
        poet: '윤동주 (Yoon Dong-ju)',
        poemText: `죽는 날까지 하늘을 우러러
한 점 부끄럼이 없기를,
잎새에 이는 바람에도
나는 괴로워했다.

별을 노래하는 마음으로
모든 죽어가는 것을 사랑해야지
그리고 나한테 주어진 길을
걸어가야겠다.

오늘 밤에도 별이 바람에 스치운다.`,
        masterpieceInsight: '잎새에 이는 미세한 바람에도 흔들리며 순결한 양심을 지키고자 했던 지고지순한 청년 시인의 기도입니다.',
        masterDirectAdvice: '작은 흔들림에 자책하지 마십시오. 그 부끄러움과 떨림이야말로 당신이 살아있다는 가장 순결한 증거입니다.',
        creativeSparkTechnique: '주어진 길 묵묵히 걷기: 남과의 비교를 멈추고 오직 나에게 주어진 길을 맑은 눈으로 한 걸음 내딛기',
        colorPalette: ['#0F172A (새벽 하늘 미드나이트)', '#38BDF8 (바람에 스치는 별빛)', '#E2E8F0 (순백의 양심 실버)'],
        inspirationAffirmation: '별을 노래하는 마음으로 나에게 주어진 길을 사랑하며 묵묵히 걸어간다.',
      },
      {
        id: 'ydj_self_portrait',
        piece: '자화상 (Self-Portrait, 1939)',
        medium: '내면 성찰 명시',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Yun_Dong-ju.jpg/800px-Yun_Dong-ju.jpg',
        poet: '윤동주 (Yoon Dong-ju)',
        poemText: `산모퉁이를 돌아 논가 외딴 우물을 홀로 찾아가선
가만히 들여다봅니다.

우물 속에는 달이 밝고 구름이 흐르고 하늘이 펼치고
파아란 바람이 불고 가을이 있습니다.

그리고 한 사나이가 있습니다.
어쩐지 그 사나이가 미워져 돌아갑니다.
돌아가다 생각하니 그 사나이가 가엾어집니다...`,
        masterpieceInsight: '우물 속에 비친 미움과 연민, 그리움의 갈등을 거쳐 마침내 자기 자신을 온전히 화해하고 끌어안습니다.',
        masterDirectAdvice: '자신을 너무 다그치거나 미워하지 마세요. 방황하는 당신 자신을 가만히 연민의 눈으로 바라보고 꼭 안아주십시오.',
        creativeSparkTechnique: '우물 들여다보기: 비판과 자책 없이 내 마음의 우물을 가만히 들여다보며 자아와 화해하기',
        colorPalette: ['#0284C7 (우물 속 파아란 가을 하늘)', '#334155 (사나이의 고뇌 슬레이트)', '#FEF08A (화해의 달빛 골드)'],
        inspirationAffirmation: '나는 방황하는 나 자신을 있는 그대로 따뜻하게 품어 안고 사랑한다.',
      }
    ]
  },

  // 11. 헤르만 헤세 (Hermann Hesse)
  {
    id: 'hesse',
    name: '헤르만 헤세 (Hermann Hesse)',
    title: '영혼의 탐도자 & 노벨문학상 거장',
    piece: '데미안 (Demian - 아프락사스의 날개, 1919)',
    medium: '철학 소설 & 자아 발견의 여정 (Self-Discovery Masterwork)',
    category: 'quote',
    icon: '🦅',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hermann_Hesse_1927.jpg/800px-Hermann_Hesse_1927.jpg',
    quoteSource: '헤르만 헤세, 〈데미안 (Demian)〉 제5장 중에서',
    quoteText: `새는 알에서 나오려고 투쟁한다. 알은 세계이다.
태어나려는 자는 하나의 세계를 깨뜨려야 한다.
새는 신을 향해 날아간다.
그 신의 이름은 아프락사스다.`,
    masterpieceInsight: '안전하고 익숙한 껍질을 깨뜨리지 않고는 새로운 존재로 비상할 수 없습니다. 밝음과 어두움, 선과 악, 이성과 본능을 모두 품어 안는 신 아프락사스처럼, 진정한 성장은 자신의 모든 그림자까지 온전히 통합하는 데서 완성됩니다.',
    masterDirectAdvice: '친애하는 벗이여, 지금 느끼는 답답함과 고통은 당신이 갇힌 알의 벽을 깨뜨리고 있다는 증거입니다. 과거의 안락한 껍질에 머물려 하지 마십시오. 껍질이 부서지는 파열음을 기쁘게 맞이하고, 당신 안의 날개를 활짝 펼치십시오.',
    creativeSparkTechnique: '알 깨기 브레이크스루: 내가 안전하다고 믿어온 고정관념 1가지를 적고, 그것의 정반대 관점을 3문장으로 수용해보기',
    colorPalette: ['#D97706 (알을 깨고 나오는 황금 독수리)', '#475569 (부서지는 세계의 회색 껍질)', '#0284C7 (신성한 아프락사스의 창공)'],
    inspirationAffirmation: '나는 낡은 껍질을 깨뜨리고 내 안의 진정한 자아를 향해 거침없이 비상한다.',
    artworks: [
      {
        id: 'hesse_demian',
        piece: '데미안 (Demian - 아프락사스의 날개, 1919)',
        medium: '철학 소설 & 자아 발견의 여정 (Self-Discovery Masterwork)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hermann_Hesse_1927.jpg/800px-Hermann_Hesse_1927.jpg',
        quoteSource: '헤르만 헤세, 〈데미안 (Demian)〉 제5장 중에서',
        quoteText: `새는 알에서 나오려고 투쟁한다. 알은 세계이다.
태어나려는 자는 하나의 세계를 깨뜨려야 한다.
새는 신을 향해 날아간다.
그 신의 이름은 아프락사스다.`,
        masterpieceInsight: '안전한 껍질을 깨뜨리지 않고는 비상할 수 없습니다. 자신의 모든 그림자까지 온전히 통합할 때 참된 성장이 완성됩니다.',
        masterDirectAdvice: '지금의 답답함은 껍질을 깨뜨리고 있다는 증거입니다. 파열음을 기쁘게 맞이하고 날개를 펼치십시오.',
        creativeSparkTechnique: '알 깨기 브레이크스루: 안전하다고 믿어온 고정관념의 반대 관점을 온전히 수용해보기',
        colorPalette: ['#D97706 (황금 독수리)', '#475569 (세계의 회색 껍질)', '#0284C7 (아프락사스의 창공)'],
        inspirationAffirmation: '나는 낡은 껍질을 깨뜨리고 내 안의 진정한 자아를 향해 거침없이 비상한다.',
      },
      {
        id: 'hesse_siddhartha',
        piece: '싯다르타 (Siddhartha - 강의 소리, 1922)',
        medium: '영적 각성의 소설 명작',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hermann_Hesse_1927.jpg/800px-Hermann_Hesse_1927.jpg',
        quoteSource: '헤르만 헤세, 〈싯다르타 (Siddhartha)〉 중에서',
        quoteText: `강은 모든 곳에 동시에 존재한다.
발원지에서도, 폭포에서도, 바다에서도 강은 항상 지금 이 순간에 존재한다.
강에게는 과거도 없고 미래도 없으며 오직 현재만이 있을 뿐이다.
싯다르타는 강의 물결에서 세상의 모든 목소리가 하나로 어우러져
거룩한 '옴(Om)'이라는 완전한 하모니를 이루는 것을 들었다.`,
        masterpieceInsight: '모든 분별과 시간의 집착을 내려놓고 흐르는 강물처럼 온 존재를 있는 그대로 수용할 때 깨달음이 찾아옵니다.',
        masterDirectAdvice: '과거나 미래의 불안에 매몰되지 마십시오. 흐르는 강물처럼 지금 이 순간의 숨결에 온전히 머무십시오.',
        creativeSparkTechnique: '강물의 수용: 마음에 떠오르는 번뇌를 막아서지 않고 강물처럼 부드럽게 흘려보내기',
        colorPalette: ['#0284C7 (흐르는 지혜의 강물 블루)', '#10B981 (보리수의 깨달음 그린)', '#FEF3C7 (완전한 옴 골드)'],
        inspirationAffirmation: '나는 과거와 미래의 집착을 내려놓고 흐르는 강물처럼 지금 이 순간에 온전히 현존한다.',
      },
      {
        id: 'hesse_wheel',
        piece: '수레바퀴 아래서 (Beneath the Wheel, 1906)',
        medium: '청춘의 성장과 자유의 소설',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hermann_Hesse_1927.jpg/800px-Hermann_Hesse_1927.jpg',
        quoteSource: '헤르만 헤세, 〈수레바퀴 아래서〉 중에서',
        quoteText: `수레바퀴 밑에 깔려 부서지지 않으려면
우리는 타인의 기대와 세속의 잣대 대신
자기 영혼의 진정한 목소리를 지켜내야 한다.`,
        masterpieceInsight: '사회의 억압적인 규율과 과도한 경쟁의 수레바퀴 밑에서 상처 입는 여린 영혼들에 바치는 절절한 위로입니다.',
        masterDirectAdvice: '남들이 강요하는 수레바퀴를 억지로 짊어지지 마십시오. 당신의 삶은 누구를 증명하기 위한 시험장이 아닙니다.',
        creativeSparkTechnique: '영혼의 목소리 경청: 세상의 요구를 잠시 차단하고 내 가슴이 진정으로 원하는 것에 귀 기울이기',
        colorPalette: ['#64748B (억압의 수레바퀴 슬레이트)', '#22C55E (숲속 자유의 풀잎 그린)', '#F8FAFC (해방의 화이트)'],
        inspirationAffirmation: '나는 세상의 부당한 수레바퀴를 벗어나 나만의 온전한 자유와 존엄을 누린다.',
      }
    ]
  },

  // 12. 프리드리히 니체 (Friedrich Nietzsche)
  {
    id: 'nietzsche',
    name: '프리드리히 니체 (Friedrich Nietzsche)',
    title: '망치를 든 철학자 & 춤추는 영혼',
    piece: '차라투스트라는 이렇게 말했다 (Also sprach Zarathustra, 1883)',
    medium: '실존 철학 명작 & 운명애(Amor Fati)',
    category: 'quote',
    icon: '⚡',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/800px-Nietzsche187a.jpg',
    quoteSource: '프리드리히 니체, 〈차라투스트라는 이렇게 말했다〉 머리말 중에서',
    quoteText: `사람은 자기 안에 혼돈(Chaos)을 지니고 있어야만,
춤추는 별 하나를 탄생시킬 수 있다.
나는 너희에게 말하노니,
너희 안에는 여전히 카오스가 살아 숨 쉬고 있다!`,
    masterpieceInsight: '모든 창조의 어머니는 질서가 아니라 통제되지 않은 생생한 혼돈입니다. 혼돈을 결핍이나 결함으로 보지 않고, 춤추는 별을 잉태한 거대한 에너지로 긍정할 때 인간은 자신의 운명을 열렬히 사랑하는 초인(Übermensch)이 됩니다.',
    masterDirectAdvice: '머릿속이 복잡하고 뒤죽박죽이라 해서 자책하지 마십시오! 그 혼돈이야말로 새로운 별이 폭발하듯 태어나기 직전의 성스러운 자궁입니다. 정돈된 모범생이 되려 하지 말고, 당신 안의 거친 혼돈을 긍정하며 춤추게 하십시오.',
    creativeSparkTechnique: '아모르 파티(Amor Fati) 역발상: 오늘 나를 가장 귀찮게 한 사건을 "나를 더 강하게 만들 우주의 선물"로 다시 명명하기',
    colorPalette: ['#EF4444 (타오르는 불꽃의 열정 레드)', '#F59E0B (춤추는 초신성의 골드)', '#0F172A (혼돈의 심연 딥 네이비)'],
    inspirationAffirmation: '나는 내 안의 모든 혼돈을 사랑하며 눈부시게 춤추는 별을 탄생시킨다.',
    artworks: [
      {
        id: 'nietzsche_zarathustra',
        piece: '차라투스트라는 이렇게 말했다 (Also sprach Zarathustra, 1883)',
        medium: '실존 철학 명작 & 초인(Übermensch)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/800px-Nietzsche187a.jpg',
        quoteSource: '프리드리히 니체, 〈차라투스트라는 이렇게 말했다〉 머리말 중에서',
        quoteText: `사람은 자기 안에 혼돈(Chaos)을 지니고 있어야만,
춤추는 별 하나를 탄생시킬 수 있다.
나는 너희에게 말하노니,
너희 안에는 여전히 카오스가 살아 숨 쉬고 있다!`,
        masterpieceInsight: '혼돈을 결함으로 보지 않고, 춤추는 별을 잉태한 거대한 에너지로 긍정할 때 인간은 초인이 됩니다.',
        masterDirectAdvice: '머릿속이 복잡하다고 자책하지 마십시오! 그 혼돈이야말로 새로운 별이 태어나기 직전의 성스러운 자궁입니다.',
        creativeSparkTechnique: '혼돈의 별 춤추기: 복잡한 생각들을 억누르지 않고 창작의 역동적인 연료로 긍정하기',
        colorPalette: ['#EF4444 (열정 레드)', '#F59E0B (초신성 골드)', '#0F172A (혼돈 딥 네이비)'],
        inspirationAffirmation: '나는 내 안의 모든 혼돈을 사랑하며 눈부시게 춤추는 별을 탄생시킨다.',
      },
      {
        id: 'nietzsche_amor_fati',
        piece: '즐거운 학문 (The Gay Science - 아모르 파티, 1882)',
        medium: '운명애(Amor Fati)의 철학',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/800px-Nietzsche187a.jpg',
        quoteSource: '프리드리히 니체, 〈즐거운 학문〉 제4서 276절 중에서',
        quoteText: `운명애(Amor Fati), 이것이 나의 가장 내밀한 본성이다.
나는 필연적인 것을 단지 견뎌내는 것에 그치지 않고 그것을 사랑하고자 한다.
네 삶을 다시 한번, 그리고 무수히 반복해서 살아도 좋다고 외칠 수 있는가?
그렇다면 지금 이 순간을 열렬히 긍정하라!`,
        masterpieceInsight: '겪어야 할 모든 고난과 우연, 상처까지도 내 삶의 필연적인 일부로 뜨겁게 껴안는 영혼의 궁극적 긍정입니다.',
        masterDirectAdvice: '후회와 한탄을 집어던지십시오! 지금 겪는 모든 고난조차 당신을 더 단단하게 만드는 운명의 선물로 포용하십시오.',
        creativeSparkTechnique: '아모르 파티 역발상: 오늘 나를 힘들게 한 사건을 "나를 더 단단하게 벼릴 우주의 선물"로 재정의하기',
        colorPalette: ['#DC2626 (타오르는 운명애 레드)', '#F59E0B (태양의 긍정 옐로)', '#18181B (굳건한 바위 흑연)'],
        inspirationAffirmation: '나는 내 운명의 모든 순간을 열렬히 사랑하며 당당하게 살아낸다.',
      },
      {
        id: 'nietzsche_tragedy',
        piece: '비극의 탄생 (The Birth of Tragedy, 1872)',
        medium: '예술 철학 명작 (Apollonian & Dionysian)',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/800px-Nietzsche187a.jpg',
        quoteSource: '프리드리히 니체, 〈비극의 탄생〉 중에서',
        quoteText: `질서와 조화의 아폴론적 명석함과,
도취와 생명력의 디오니소스적 광기가 충돌하고 화해할 때
가장 위대한 비극 예술이 꽃핀다.
오직 예술을 통해서만 삶은 정당화된다!`,
        masterpieceInsight: '삶의 혼돈과 고통을 외면하지 않고 예술적 도취로 승화시키는 그리스 비극의 근원적 에너지입니다.',
        masterDirectAdvice: '마음속의 거친 혼돈을 억누르지 마세요. 도취와 열정의 디오니소스 에너지를 당신의 정돈된 기술과 결합하십시오.',
        creativeSparkTechnique: '디오니소스 도취와 아폴론 정돈의 결합: 먼저 열정적으로 감정을 쏟아붓고 나중에 차분히 다듬기',
        colorPalette: ['#7C3AED (도취의 디오니소스 퍼플)', '#FACC15 (명석한 아폴론 태양광)', '#0369A1 (지중해의 파도 블루)'],
        inspirationAffirmation: '나는 내 안의 거대한 열정과 정교한 기술을 결합하여 독보적인 걸작을 창조한다.',
      }
    ]
  }
];

export function extractEnglishArtworkKey(str: string): string {
  if (!str) return '';
  const match = str.match(/\(([a-zA-Z\s,'’–—\-/]+)/);
  if (!match) return '';
  const cleaned = match[1]
    .split('/')[0]
    .replace(/\b(the|a|an|in|at|on|of|over|and)\b/gi, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()
    .trim();
  return cleaned;
}

export function normalizeArtworkTitle(str: string): string {
  if (!str) return '';
  const koreanPart = str.split('(')[0];
  return koreanPart
    .replace(/연작|꽃밭|들판|열두\s*송이|송이|의|를|을|에|과|와|에서|속|한\s*가운데|한\s*소녀|소녀/g, '')
    // Synonyms canonicalization
    .replace(/양산을\s*(쓴|든)\s*여인/g, '양산여인')
    .replace(/진주\s*(귀걸이|귀고리)/g, '진주귀걸이')
    .replace(/(론강|아를).*별.*밤/g, '별빛밤론강')
    .replace(/별.*밤/g, '별빛밤')
    .replace(/(아를.*침실|반\s*고흐.*방|침실)/g, '반고흐침실')
    .replace(/우유\s*(따르는|를\s*따르는)\s*여인/g, '우유따르는여인')
    .replace(/해바라기/g, '해바라기')
    .replace(/수련.*연못/g, '수련')
    .replace(/[^가-힣a-zA-Z0-9]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * 거장의 전체 예술작품 목록 반환 (한 작품도 빠짐없이 모두 포함하며, 중복은 영구 완전 박멸)
 */
export function getMasterAllArtworks(master: MasterItem): MasterArtwork[] {
  const rawList = master.artworks && master.artworks.length > 0
    ? [...master.artworks]
    : [{
        id: `${master.id}_primary`,
        piece: master.piece,
        medium: master.medium,
        imageUrl: master.imageUrl,
        originalMuseum: master.originalMuseum,
        masterpieceInsight: master.masterpieceInsight,
        masterDirectAdvice: master.masterDirectAdvice,
        creativeSparkTechnique: master.creativeSparkTechnique,
        colorPalette: master.colorPalette,
        inspirationAffirmation: master.inspirationAffirmation,
        musicVideoId: master.musicVideoId,
        musicArtist: master.musicArtist,
        musicListeningGuide: master.musicListeningGuide,
        poemText: master.poemText,
        poet: master.poet,
        quoteText: master.quoteText,
        quoteSource: master.quoteSource,
      }];

  // 1. 1차 내부 중복 제거 (한국어 어근 키 + 영문 원제 키 동시 대조)
  const seenKorTitles = new Set<string>();
  const seenEngTitles = new Set<string>();
  const baseArtworks: MasterArtwork[] = [];

  const registerArtwork = (art: MasterArtwork): boolean => {
    const korKey = normalizeArtworkTitle(art.piece);
    const engKey = extractEnglishArtworkKey(art.piece) || (art.pieceOriginal ? extractEnglishArtworkKey(`(${art.pieceOriginal})`) : '');

    // 중복 판별: 한국어 정규화 키가 이미 있거나, 유의미한 영문명이 이미 존재하는 경우 중복으로 간주
    if (korKey && seenKorTitles.has(korKey)) return false;
    if (engKey && engKey.length >= 4 && seenEngTitles.has(engKey)) return false;

    if (korKey) seenKorTitles.add(korKey);
    if (engKey && engKey.length >= 4) seenEngTitles.add(engKey);

    baseArtworks.push(art);
    return true;
  };

  for (const art of rawList) {
    registerArtwork(art);
  }

  // 2. MUSE_ART_CATALOG에서 거장의 추가 작품들을 매칭하여 전체 수록 (중복 및 타 작가 혼입 엄격 방지)
  const creatorKeywords: Record<string, string[]> = {
    vangogh: ['반 고흐', 'gogh', 'van gogh'],
    monet: ['모네', 'monet'],
    klimt: ['클림트', 'klimt'],
    vermeer: ['페르메이르', 'vermeer'],
    debussy: ['드뷔시', 'debussy'],
    bach: ['바흐', 'j.s. bach', 'johann sebastian bach'],
    beethoven: ['베토벤', 'beethoven'],
    chopin: ['쇼팽', 'chopin'],
    rilke: ['릴케', 'rilke'],
    yoondongju: ['윤동주', 'yoon dong-ju', 'yun dong-ju'],
    hesse: ['헤세', 'hesse'],
    nietzsche: ['니체', 'nietzsche'],
  };

  const keywords = creatorKeywords[master.id] || [master.name.split('(')[0].trim().toLowerCase()];

  try {
    for (const entry of MUSE_ART_CATALOG) {
      const creatorLower = (entry.creator || '').toLowerCase();
      const matchesCreator = keywords.some((kw) => creatorLower.includes(kw.toLowerCase()));
      if (matchesCreator) {
        const candidatePiece = `${entry.title} (${entry.titleOriginal || entry.title})`;
        const korKey = normalizeArtworkTitle(candidatePiece);
        const engKey = extractEnglishArtworkKey(candidatePiece) || (entry.titleOriginal ? extractEnglishArtworkKey(`(${entry.titleOriginal})`) : '');

        if ((korKey && seenKorTitles.has(korKey)) || (engKey && engKey.length >= 4 && seenEngTitles.has(engKey))) {
          continue; // 이미 수록된 대표작이므로 중복 등록 방지
        }

        registerArtwork({
          id: entry.id || `catalog_${korKey}`,
          piece: candidatePiece,
          pieceOriginal: entry.titleOriginal,
          medium: `${entry.artworkType || '유화'} · ${entry.era || '명작'}`,
          imageUrl: entry.imageUrl,
          originalMuseum: entry.era || '세계 미술관 소장',
          masterpieceInsight: entry.description || entry.quote || master.masterpieceInsight,
          masterDirectAdvice: entry.quote
            ? `"${entry.quote}" 이 작품에 깃든 깊은 미학적 울림을 마음에 품고, 당신만의 진솔한 예술 세계를 거침없이 펼치십시오.`
            : master.masterDirectAdvice,
          creativeSparkTechnique: entry.defaultChallenges?.[0] || master.creativeSparkTechnique,
          colorPalette: entry.aestheticTone
            ? [entry.aestheticTone, ...master.colorPalette.slice(1)]
            : master.colorPalette,
          inspirationAffirmation: entry.quote || master.inspirationAffirmation,
        });
      }
    }
  } catch (err) {
    console.warn('[getMasterAllArtworks] Catalog cross-reference error:', err);
  }

  return baseArtworks;
}

/**
 * 날짜 시드와 사용자 고민, 프로필, 선택된 작품을 결합하여 거장별 맞춤 조언 및 통찰 산출
 */
export function getMasterpieceDynamicDialogue(
  master: MasterItem,
  userDilemma?: string,
  userProfile?: UserProfile | null,
  dateSeedKey?: string,
  selectedArtwork?: MasterArtwork
): MasterpieceDialogueData {
  const art = selectedArtwork || master.artworks?.[0] || master;
  const seed = getDateSeed(dateSeedKey || `muse_master_${master.id}_${art.piece}_${new Date().toISOString().slice(0, 10)}`);
  const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
  const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
  const dilemmaText = (userDilemma || '').trim();

  // 날짜별 변화하는 다이내믹 변주 문구
  const dateMod = seed % 3;

  let customizedAdvice = art.masterDirectAdvice || master.masterDirectAdvice;
  const customizedInsight = art.masterpieceInsight || master.masterpieceInsight;
  let customizedAffirmation = art.inspirationAffirmation || master.inspirationAffirmation;

  if (dilemmaText) {
    customizedAdvice = `${nickname}님, 나누어 주신 이야기("${dilemmaText}")를 깊이 경청했습니다. ${customizedAdvice}`;
  } else {
    customizedAdvice = `${nickname}님, ${customizedAdvice}`;
  }

  if (dateMod === 1) {
    customizedAffirmation = `오늘 나는 ${master.name}의 거룩한 정신과 호흡을 맞추며, ${customizedAffirmation}`;
  } else if (dateMod === 2) {
    customizedAffirmation = `지금 이 순간, ${customizedAffirmation}`;
  }

  return {
    title: `〈${master.name.split('(')[0].trim()}〉 ${art.piece.split('(')[0].trim()} 예술 영감 마스터클래스`,
    masterName: master.name,
    masterTitle: master.title,
    masterpieceName: art.piece,
    masterpieceMedium: art.medium,
    category: master.category,
    masterpieceInsight: customizedInsight,
    masterDirectAdvice: customizedAdvice,
    creativeSparkTechnique: art.creativeSparkTechnique || master.creativeSparkTechnique,
    colorPalette: art.colorPalette || master.colorPalette,
    inspirationAffirmation: customizedAffirmation,
    musicVideoId: art.musicVideoId || master.musicVideoId,
    musicArtist: art.musicArtist || master.musicArtist,
    musicListeningGuide: art.musicListeningGuide || master.musicListeningGuide,
    poemText: art.poemText || master.poemText,
    poet: art.poet || master.poet,
    quoteText: art.quoteText || master.quoteText,
    quoteSource: art.quoteSource || master.quoteSource,
    originalMuseum: art.originalMuseum || master.originalMuseum,
  };
}
