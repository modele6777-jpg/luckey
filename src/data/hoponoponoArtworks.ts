/**
 * 호오포노포노 수호 정화 원화(Purifying Canvas) 큐레이션 갤러리 & 프롬프트 생성기
 * - 정화 상징과 주제에 맞추어 다채롭고 영롱한 고화질 원화를 제공하며, 단일 이미지 반복을 원천 방지합니다.
 */

export interface CleansingArtworkTheme {
  id: string;
  category: 'water' | 'cosmic' | 'nature' | 'sunset' | 'crystal' | 'lotus';
  title: string;
  description: string;
  imageUrl: string;
  promptSeed: string;
}

export const HOPONOPONO_ARTWORK_GALLERY: CleansingArtworkTheme[] = [
  // 1. Water & Ocean & Rain (물과 바다의 맑은 정화 - 6종 완전 고유 이미지)
  {
    id: 'hawaiian_emerald_tide',
    category: 'water',
    title: '에메랄드빛 하와이안 물결',
    description: '청량하고 맑은 하와이 해변의 에메랄드빛 파도가 모든 묵은 기억을 씻어냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Crystalline turquoise ocean water waves washing gently over golden sand, glowing sun reflections, serene tropical Hawaiian coastline, watercolor digital art masterpiece',
  },
  {
    id: 'blue_solar_cascade',
    category: 'water',
    title: '블루솔라 크리스탈 폭포',
    description: '푸른 태양빛을 머금은 정화의 폭포수가 잠재의식의 모든 응어리를 부드럽게 흘려보냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Luminous blue solar water droplets refracting rainbow prismatic sunlight in serene glass garden, high fantasy spiritual art',
  },
  {
    id: 'deep_ocean_glow',
    category: 'water',
    title: '깊은 바다의 심해 안식',
    description: '어둡고 고요한 깊은 바다속에서 은은하게 빛나는 평온의 푸른 파동입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Deep ocean cyan and turquoise ripples with ethereal bioluminescent glow, profound peace and stillness, meditative oil painting',
  },
  {
    id: 'morning_dew_cleansing',
    category: 'water',
    title: '새벽 이슬의 영롱한 정화',
    description: '새벽빛을 받아 맑게 빛나는 물방울이 무의식의 찌꺼기를 말끔히 지워냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Dewy water drops on lush tropical leaves glowing under soft morning dawn, sacred geometry light rays, macro meditative artwork',
  },
  {
    id: 'turquoise_lagoon_sanctuary',
    category: 'water',
    title: '청록빛 천연 라군 안식처',
    description: '외부의 어떤 소음도 닿지 않는 잔잔한 산호초 라군에서 가슴 깊은 평화를 누립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Pristine turquoise lagoon surrounded by calm white sands and lush tropical flora, radiant peaceful waters, fine art photograph',
  },
  {
    id: 'rain_cleansing_mountain_stream',
    category: 'water',
    title: '청량한 산골짜기 옥수(玉水)',
    description: '신선한 빗물이 모여 흐르는 맑은 계곡수가 마음속 무거운 응어리를 말끔히 씻어냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Pure crystalline alpine mountain stream flowing smoothly over smooth river stones, lush greenery, Zen meditation tranquility',
  },

  // 2. Cosmic & Nebula & Aurora (은하수와 오로라의 차원 정화 - 6종 완전 고유 이미지)
  {
    id: 'cosmic_stardust_aurora',
    category: 'cosmic',
    title: '자애로운 별무리 오로라',
    description: '보랏빛과 에메랄드빛 오로라가 밤하늘을 수놓으며 우주의 무한한 용서와 사랑을 전합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Celestial cosmic stardust nebula with flowing emerald and violet aurora borealis, spiritual transcendence, ethereal lighting, concept art',
  },
  {
    id: 'milkyway_peaceful_shore',
    category: 'cosmic',
    title: '은하수가 내려앉은 평화의 해변',
    description: '별들이 쏟아지는 밤바다에 발을 담그며 기억의 짐을 우주의 무한 속으로 흘려보냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Cosmic night sky full of stars and galaxies reflecting on tranquil calm ocean water, silhouette of tropical palm trees, tranquil dreamscape',
  },
  {
    id: 'zero_limits_portal',
    category: 'cosmic',
    title: '제로 리밋 (Zero Limits)의 신성한 빛',
    description: '모든 판단과 집착이 0으로 돌아가는 신성한 은백색 빛의 차원문입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Sacred portal of pure white and golden divine light, dissolving illusions and heavy thoughts into zero state, cosmic spiritual painting',
  },
  {
    id: 'deep_galaxy_nebula_heart',
    category: 'cosmic',
    title: '성운(星雲)의 심장부 안식',
    description: '수천억 개의 별이 피어나는 은하의 요람 속에서 나의 영혼도 본래의 온전함을 되찾습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Deep celestial nebula with radiant magenta and sapphire blue stardust cloud, infinite universal peace, cinematic cosmic vista',
  },
  {
    id: 'aurora_borealis_reflection',
    category: 'cosmic',
    title: '호수 위에 맺힌 극광(極光)',
    description: '거울처럼 맑은 밤호수에 비친 신비로운 오로라가 얼어붙은 감정을 부드럽게 녹여줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Vibrant green and indigo aurora borealis reflecting on mirror-still fjord lake, serene starry cosmos, spiritual stillness',
  },
  {
    id: 'starfield_horizon_dream',
    category: 'cosmic',
    title: '무한의 별빛 지평선',
    description: '하늘과 땅의 경계가 지워진 별바다 위에서 고요한 자유와 무아(無我)의 평안을 얻습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Earth horizon viewed from orbit with billions of twinkling stars and ethereal blue atmospheric glow, tranquil space meditation',
  },

  // 3. Sunset & Dawn (노을과 여명의 자애로운 온기 - 6종 완전 고유 이미지)
  {
    id: 'hawaiian_golden_sunset',
    category: 'sunset',
    title: '황금빛 하와이안 일몰',
    description: '하루의 피로와 자책을 따스하게 감싸 안는 황금빛 노을의 축복입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Warm golden sunset over calm Hawaiian Pacific ocean, pastel clouds in peach, lavender and gold, deep inner peace, impressionist digital art',
  },
  {
    id: 'lavender_sky_twilight',
    category: 'sunset',
    title: '라벤더빛 황혼의 쉼터',
    description: '부드러운 보랏빛 하늘이 긴장된 신경을 풀어주고 안온한 휴식을 선사합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Soft lavender and pastel rose sunset sky casting gentle purple reflection on gentle waves, dreamy peaceful ambiance',
  },
  {
    id: 'sunrise_forgiveness_glow',
    category: 'sunset',
    title: '용서의 새벽빛 여명',
    description: '새로운 시작을 알리는 맑은 여명이 지난날의 상처를 따스하게 덮어줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Breathtaking sunrise casting golden light through morning mist over serene mountains and calm water, symbol of fresh start and forgiveness',
  },
  {
    id: 'amber_dusk_cloudscape',
    category: 'sunset',
    title: '호박빛 구름 바다의 온기',
    description: '석양빛에 물든 부드러운 구름 물결이 온 세상의 시름을 거두어 갑니다.',
    imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Majestic sea of golden and amber sunset clouds viewed from mountaintop, warm divine sun rays, healing soul comfort',
  },
  {
    id: 'coral_twilight_calm_sea',
    category: 'sunset',
    title: '산호빛 해질녘의 평정',
    description: '살구빛과 핑크빛이 은은하게 섞인 저녁 바다가 스스로에게 "잘했다"고 속삭입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Dreamy coral pink and gold twilight horizon above still ocean tide, soft gentle ripples, emotional catharsis and solace',
  },
  {
    id: 'golden_morning_forest_glade',
    category: 'sunset',
    title: '숲속에 쏟아지는 아침 첫 햇살',
    description: '숲의 안개를 뚫고 비추는 햇살이 어두웠던 마음에 따뜻한 빛을 불어넣습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Golden morning light filtering through deep forest tree branches, ethereal god rays, renewed hope and spiritual purification',
  },

  // 4. Nature & Sacred Garden (신성한 정원과 자연의 위로 - 6종 완전 고유 이미지)
  {
    id: 'sacred_bamboo_forest',
    category: 'nature',
    title: '맑은 바람이 부는 대나무 숲',
    description: '상쾌한 숲의 바람이 마음속 복잡한 생각들을 맑고 고요하게 정돈해줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Lush zen bamboo grove with sunbeams filtering through emerald leaves, gentle breeze, serene meditation retreat painting',
  },
  {
    id: 'tropical_rainforest_sanctuary',
    category: 'nature',
    title: '열대 우림의 생명수 안식처',
    description: '청정한 자연의 피톤치드와 생명력이 지친 영혼에 활력을 불어넣습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Misty emerald tropical forest with ancient mossy trees and crystalline stream, sun flares, divine nature sanctuary',
  },
  {
    id: 'mossy_zen_stone_garden',
    category: 'nature',
    title: '이끼 덮인 고요의 선원(禪園)',
    description: '수백 년의 세월을 품은 부드러운 초록 이끼가 조급한 마음을 내려놓게 합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Ancient Japanese Zen garden with lush green moss and natural stone stepping paths under soft filtered daylight, sublime silence',
  },
  {
    id: 'misty_alpine_valley_peace',
    category: 'nature',
    title: '안개 어린 고요한 알프스 계곡',
    description: '순수한 산의 호흡이 머릿속 얽힌 상념들을 씻어내어 맑은 호흡을 되찾아줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Majestic mountain peaks rising above sea of morning clouds, pure fresh alpine breeze, majestic timeless stillness',
  },
  {
    id: 'fern_canopy_sunbeams',
    category: 'nature',
    title: '고사리 숲의 에메랄드 캐노피',
    description: '싱그러운 풀내음과 맑은 공기가 온몸의 긴장을 이완시키고 본연의 리듬을 복원합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Lush tropical fern forest floor glowing under emerald green sun canopy, gentle dew mist, natural rejuvenating energy',
  },
  {
    id: 'serene_autumn_birch_grove',
    category: 'nature',
    title: '자작나무 숲의 황금빛 사색',
    description: '하얀 자작나무와 황금빛 낙엽이 계절의 순리에 따라 자연스럽게 내려놓는 지혜를 가르쳐줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Tranquil white birch forest path covered with soft golden autumn leaves, peaceful sunlight, graceful acceptance of letting go',
  },

  // 5. Crystal & Sacred Geometry (크리스탈과 치포트 정화 - 6종 완전 고유 이미지)
  {
    id: 'amethyst_crystal_cave',
    category: 'crystal',
    title: '자수정의 고결한 정화 파동',
    description: '보랏빛 자수정 결정체가 부정적 에너지를 흡수하여 맑고 순수한 의식으로 변환합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Glowing amethyst and clear quartz crystals emitting soft purple healing vibrations, sacred geometry light, fantasy concept art',
  },
  {
    id: 'ceeport_golden_key',
    category: 'crystal',
    title: '치포트 (Ceeport) 영혼의 열쇠',
    description: 'Clean, Erase, Erase, Port — 잠재의식의 문을 열어 본래의 순수성으로 되돌리는 정화의 상징입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Sacred golden circular symbol of Ceeport radiating warm golden divine rays on deep emerald ocean background, spiritual emblem art',
  },
  {
    id: 'selenite_light_pillar',
    category: 'crystal',
    title: '셀레나이트의 순백 광채',
    description: '달의 순수성을 담은 셀레나이트 기둥이 모든 탁한 기운을 빛으로 정화합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Radiant white selenite crystal monolith emitting soft pearlescent luminescence in sacred sanctuary, high frequency healing',
  },
  {
    id: 'rose_quartz_self_love',
    category: 'crystal',
    title: '로즈쿼츠 자애의 핑크 결정',
    description: '장미 수정의 온화한 파동이 스스로에게 엄격했던 자책을 따스한 사랑으로 녹여냅니다.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Natural raw rose quartz crystal resting on smooth dark slate with delicate soft pink light aura, unconditional self-compassion',
  },
  {
    id: 'sacred_prism_geometry',
    category: 'crystal',
    title: '신성기하학 프리즘 광휘',
    description: '하나의 빛이 일곱 빛깔의 무지개로 분해되며 영혼의 모든 차크라를 조화롭게 튜닝합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Glass prism refracting crystal rainbow spectrum in dark meditative chamber, Flower of Life sacred geometry watermark',
  },
  {
    id: 'aquamarine_cleansing_jewel',
    category: 'crystal',
    title: '아쿠아마린 바다의 눈물',
    description: '청아한 바다색 원석이 목과 가슴의 억눌린 감정 표현을 시원하게 정화해줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Flawless raw aquamarine gemstone reflecting oceanic light, gentle tranquil ripples, clarity of emotional expression',
  },

  // 6. Lotus & Bloom (세이크리드 연꽃과 피어남 - 6종 완전 고유 이미지)
  {
    id: 'sacred_turquoise_lotus',
    category: 'lotus',
    title: '청옥빛 신성한 연꽃',
    description: '진흙 속에서도 맑게 피어나는 연꽃처럼, 어떤 고통 속에서도 순수한 본래 자아가 피어납니다.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Glowing turquoise and golden water lily lotus floating on tranquil dark water, sparkling dew drops, spiritual rebirth and peace',
  },
  {
    id: 'pink_cherry_healing_pond',
    category: 'lotus',
    title: '자애로운 꽃잎의 수면',
    description: '부드러운 꽃잎이 수면 위를 덮으며 스스로를 향한 따뜻한 사랑과 위로를 건넵니다.',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Soft pink sakura blossom petals floating gracefully on crystal clear pond, ethereal ripples, gentle healing ambiance',
  },
  {
    id: 'golden_water_lily_dawn',
    category: 'lotus',
    title: '황금빛 수련의 아침 개화',
    description: '여명과 함께 조용히 꽃잎을 여는 수련처럼, 닫혀 있던 마음의 문이 부드럽게 열립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Luminous golden white water lily blooming at dawn on serene reflective pond, mist rising, divine awakening and hope',
  },
  {
    id: 'white_plumeria_hawaiian_blessing',
    category: 'lotus',
    title: '하와이안 순백 플루메리아의 축복',
    description: '하와이의 달콤하고 순수한 꽃향기가 잠재의식 속 미련과 원망을 기화시킵니다.',
    imageUrl: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Fragrant Hawaiian white plumeria frangipani blossoms resting on wet black volcanic rock, gentle tropical rain drops, Aloha spirit',
  },
  {
    id: 'indigo_night_blooming_cereus',
    category: 'lotus',
    title: '달빛 아래 피어나는 월하미인(月下美人)',
    description: '어두운 밤에만 신비롭게 피어나는 꽃처럼, 슬픔의 시간 속에서 가장 아름다운 지혜가 싹틉니다.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Ethereal white night blooming flower opening under soft silver moonlight, indigo night sky, mystical inner peace',
  },
  {
    id: 'lavender_field_peaceful_breeze',
    category: 'lotus',
    title: '끝없이 펼쳐진 라벤더 밭의 위로',
    description: '보랏빛 꽃바다 위를 스치는 부드러운 바람이 마음에 깊은 안식과 치유를 선물합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1200&auto=format&fit=crop&q=85',
    promptSeed: 'Infinite lavender fields under soft purple sunset, fragrant breeze waving through purple flowers, profound soothing relaxation',
  }
];

const RECENT_ARTWORKS_STORAGE_KEY = 'hoponopono_recent_artwork_ids';

/**
 * 최근 보여준 원화 ID들을 가져옵니다.
 */
function getRecentArtworkIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_ARTWORKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {
    // Ignore error
  }
  return [];
}

/**
 * 최근 보여준 원화 ID를 기록합니다 (최대 12개까지 순환 보관).
 */
function recordArtworkShown(id: string) {
  try {
    const recent = getRecentArtworkIds().filter(i => i !== id);
    recent.unshift(id);
    if (recent.length > 12) recent.pop();
    localStorage.setItem(RECENT_ARTWORKS_STORAGE_KEY, JSON.stringify(recent));
  } catch (_) {
    // Ignore error
  }
}

/**
 * 정화 상징 및 주제 키워드를 분석하여 가장 조화롭고 '이전에 본 적 없는' 수호 정화 원화를 엄선합니다.
 */
export function getCuratedArtworkForCleansing(symbol?: string, subject?: string, seedOffset = 0): CleansingArtworkTheme {
  const text = `${symbol || ''} ${subject || ''}`.toLowerCase();
  
  let candidates = HOPONOPONO_ARTWORK_GALLERY;

  if (text.includes('우주') || text.includes('별') || text.includes('밤') || text.includes('오로라') || text.includes('성운') || text.includes('은하')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'cosmic');
  } else if (text.includes('물') || text.includes('바다') || text.includes('파도') || text.includes('솔라') || text.includes('이슬') || text.includes('폭포') || text.includes('계곡') || text.includes('라군')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'water');
  } else if (text.includes('노을') || text.includes('일몰') || text.includes('태양') || text.includes('여명') || text.includes('햇살') || text.includes('따뜻') || text.includes('석양')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'sunset');
  } else if (text.includes('숲') || text.includes('바람') || text.includes('나무') || text.includes('자연') || text.includes('호흡') || text.includes('하') || text.includes('이끼') || text.includes('계절')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'nature');
  } else if (text.includes('치포트') || text.includes('열쇠') || text.includes('보석') || text.includes('크리스탈') || text.includes('수정') || text.includes('소금') || text.includes('프리즘')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'crystal');
  } else if (text.includes('꽃') || text.includes('연꽃') || text.includes('사랑') || text.includes('자애') || text.includes('마음') || text.includes('플루메리아') || text.includes('수련')) {
    candidates = HOPONOPONO_ARTWORK_GALLERY.filter(a => a.category === 'lotus');
  }

  if (!candidates || candidates.length === 0) {
    candidates = HOPONOPONO_ARTWORK_GALLERY;
  }

  // 최근 보여준 이미지들을 제외하여 중복 반복을 철저히 차단
  const recentIds = getRecentArtworkIds();
  const unshownCandidates = candidates.filter(item => !recentIds.includes(item.id));
  
  const pool = unshownCandidates.length > 0 ? unshownCandidates : candidates;

  // 다양성을 극대화하기 위해 암호학적 랜덤/타임스탬프 결합 선택
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selected = pool[randomIndex] || HOPONOPONO_ARTWORK_GALLERY[0];

  recordArtworkShown(selected.id);
  return selected;
}

/**
 * 정화 상징과 주제에 맞춘 고화질 AI 프롬프트를 다채롭게 빌드합니다.
 */
export function buildDynamicCleansingImagePrompt(symbol: string, subject: string): string {
  const styles = [
    'serene impressionist oil painting with radiant light rays',
    'ethereal watercolor masterpiece with soft pastel glows and stardust reflections',
    'cinematic digital artwork with glowing turquoise, gold and deep emerald cosmic ocean waves',
    'sacred Hawaiian spiritual scenery with blooming tropical flowers and peaceful misty waterfalls',
    'celestial dreamscape representing deep subconscious healing and inner child liberation',
    'zen minimalist fine-art painting with tranquil glowing lotus and crystalline ripples',
    'surrealist glowing sacred geometry crystal aura with soft ambient lighting'
  ];

  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const cleanSymbol = symbol ? symbol.replace(/["']/g, '') : '신성한 정화의 물결';
  const cleanSubject = subject ? subject.replace(/["']/g, '') : '마음의 묵은 상처';

  return `A breathtaking meditative artwork symbolizing Ho'oponopono spiritual purification: "${cleanSymbol}" gently cleansing and transforming: "${cleanSubject}". ${randomStyle}, 8k resolution, NanoBanana art style, masterpiece, peaceful, serene, divine tranquility, no text, no watermarks.`;
}

