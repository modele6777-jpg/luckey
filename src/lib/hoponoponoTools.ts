import { z } from 'zod';
import { invokeLLMStructured } from '@/lib/ai';
import { PRISM_VOICE_RULES } from '@/lib/copyTone';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playAiResultNotification } from '@/lib/audioHaptics';

export const HOPONOPONO_LAST_TOOL_KEY = 'hoponopono_last_tool';

export type HoponoponoToolCategory = 'classic' | 'food';

export type HoponoponoToolId =
  | 'blue_solar_water'
  | 'ceeport'
  | 'ha'
  | 'eraser'
  | 'salt_water'
  | 'strawberries'
  | 'pancakes'
  | 'm_and_ms'
  | 'blueberries'
  | 'candy_canes'
  | 'coconut'
  | 'hot_chocolate'
  | 'vanilla_ice_cream'
  | 'jellybeans'
  | 'lifesavers'
  | 'pretzels'
  | 'toast'
  | 'bubble_gum'
  | 'auto';

export type HoponoponoToolRecipe = z.infer<typeof HoponoponoToolRecipeSchema>;

export const HoponoponoToolRecipeSchema = z.object({
  toolId: z.string(),
  toolName: z.string(),
  toolSubtitle: z.string(),
  whyThisTool: z.string(),
  materials: z.array(z.string()).min(2).max(6),
  steps: z.array(z.string()).min(3).max(6),
  usageMantra: z.string(),
  dailyPractice: z.string(),
});

export type HoponoponoToolCatalogItem = {
  id: HoponoponoToolId;
  name: string;
  nameEn: string;
  emoji: string;
  category: HoponoponoToolCategory;
  summary: string;
  coreEffect: string;
};

export const HOPONOPONO_TOOL_CATALOG: HoponoponoToolCatalogItem[] = [
  // Classic Tools
  {
    id: 'blue_solar_water',
    name: '블루솔라워터',
    nameEn: 'Blue Solar Water',
    emoji: '💧',
    category: 'classic',
    summary: '파란 유리병에 담은 햇빛 물. 마음의 탁함을 씻어냅니다.',
    coreEffect: '무의식의 오래된 탁한 기억과 감정 정화',
  },
  {
    id: 'ceeport',
    name: '치포트키',
    nameEn: 'Ceeport',
    emoji: '🔑',
    category: 'classic',
    summary: '잠재의식의 문을 여는 정화 열쇠. 시각화하며 사용합니다.',
    coreEffect: '막힌 잠재의식의 문을 열고 영감의 통로 개방',
  },
  {
    id: 'ha',
    name: '하 (Ha)',
    nameEn: 'Ha Breathing',
    emoji: '🌬️',
    category: 'classic',
    summary: '숨을 길게 내뱉으며 기억을 비우는 하와이안 호흡 정화법.',
    coreEffect: '생명 에너지(Mana) 충전 및 긴장·스트레스 즉각 방하착',
  },
  {
    id: 'eraser',
    name: '지우개',
    nameEn: 'Eraser',
    emoji: '🧽',
    category: 'classic',
    summary: '마음속 지우개로 판단과 집착, 오염된 기억을 지웁니다.',
    coreEffect: '판단, 비난, 고정관념의 데이터를 깨끗이 소거',
  },
  {
    id: 'salt_water',
    name: '하와이안 소금물',
    nameEn: 'Hawaiian Salt Water',
    emoji: '🧂',
    category: 'classic',
    summary: '천연 소금물로 공간과 마음의 에너지를 정화합니다.',
    coreEffect: '공간·신체에 엉킨 무거운 부정적 잔류 에너지 정화',
  },
  
  // Handbook Food & Sacred Items Tools
  {
    id: 'strawberries',
    name: '딸기',
    nameEn: 'Strawberries',
    emoji: '🍓',
    category: 'food',
    summary: '체중과 외모에 대한 부정적인 기억과 강박을 정화합니다.',
    coreEffect: '체중·신체 이미지에 얽힌 부정적 데이터와 불안 해소',
  },
  {
    id: 'pancakes',
    name: '팬케이크',
    nameEn: 'Pancakes',
    emoji: '🥞',
    category: 'food',
    summary: '학대, 상처, 모든 상실과 죽음의 기억을 정화합니다.',
    coreEffect: '과거의 학대, 이별, 깊은 상실감과 슬픔의 기억 정화',
  },
  {
    id: 'm_and_ms',
    name: 'M&M 초콜릿',
    nameEn: 'M&M’s',
    emoji: '🍫',
    category: 'food',
    summary: '지친 심신에 순수한 생체 활력과 맑은 에너지를 채워줍니다.',
    coreEffect: '침체된 에너지를 씻고 순수한 영적 활력 충전',
  },
  {
    id: 'blueberries',
    name: '블루베리',
    nameEn: 'Blueberries',
    emoji: '🫐',
    category: 'food',
    summary: '영적 성장과 자아실현의 길에서 앞으로 나아가도록 돕습니다.',
    coreEffect: '영적 성장의 장애물을 치우고 내면의 진실로 전진',
  },
  {
    id: 'candy_canes',
    name: '캔디 케인 (지팡이 사탕)',
    nameEn: 'Candy Canes',
    emoji: '🦯',
    category: 'food',
    summary: '살면서 놓쳐버린 기회와 타이밍을 다시 포착하고 회복합니다.',
    coreEffect: '놓쳐버린 기회와 인연에 대한 후회를 지우고 기회 회복',
  },
  {
    id: 'coconut',
    name: '코코넛',
    nameEn: 'Coconut',
    emoji: '🥥',
    category: 'food',
    summary: '신성(Divine, 디바인)과의 연결을 깊게 하여 영감을 받습니다.',
    coreEffect: '신성한 근원(Divine)과의 직접적인 공명과 영감 수신',
  },
  {
    id: 'hot_chocolate',
    name: '핫초콜릿',
    nameEn: 'Hot Chocolate',
    emoji: '☕',
    category: 'food',
    summary: '돈과 물질을 최우선으로 두는 집착과 결핍의 두려움을 정화합니다.',
    coreEffect: '물질 만능주의, 돈에 대한 집착과 결핍의 공포 정화',
  },
  {
    id: 'vanilla_ice_cream',
    name: '바닐라 아이스크림',
    nameEn: 'Vanilla Ice Cream',
    emoji: '🍨',
    category: 'food',
    summary: '소란스러운 일상에 깊고 고요한 평화를 가져다줍니다.',
    coreEffect: '마음의 분노와 불안을 달래고 삶에 고요한 평화 안착',
  },
  {
    id: 'jellybeans',
    name: '젤리빈',
    nameEn: 'Jellybeans',
    emoji: '🍬',
    category: 'food',
    summary: '가장 알맞은 시간과 장소(적재적소)에 머물도록 조율합니다.',
    coreEffect: '올바른 시공간의 일치(Right Place & Right Time) 조율',
  },
  {
    id: 'lifesavers',
    name: '라이프세이버 사탕',
    nameEn: 'Lifesavers',
    emoji: '🛟',
    category: 'food',
    summary: '삶의 위기와 영혼의 조난 상태에서 생명을 구하도록 돕습니다.',
    coreEffect: '영혼과 생명의 위기 상황에서 신성한 보호와 구원',
  },
  {
    id: 'pretzels',
    name: '프레첼',
    nameEn: 'Pretzels',
    emoji: '🥨',
    category: 'food',
    summary: '밀과 대지, 소금 평원과 연결되어 근원적 접지 정화를 이룹니다.',
    coreEffect: '지구 대지의 소금 평원과 연결된 깊은 그라운딩 정화',
  },
  {
    id: 'toast',
    name: '토스트',
    nameEn: 'Toast',
    emoji: '🍞',
    category: 'food',
    summary: '축적된 독성 데이터와 오염된 기억을 순수한 에너지로 복원합니다.',
    coreEffect: '독성 메모리 소거 및 맑고 순수한 에너지로의 환원',
  },
  {
    id: 'bubble_gum',
    name: '풍선껌',
    nameEn: 'Bubble Gum',
    emoji: '🫧',
    category: 'food',
    summary: '지나친 지성주의, 머리로만 따지는 생각과 통제욕을 내려놓게 합니다.',
    coreEffect: '에고의 과도한 지성주의, 분석 강박과 통제욕 해방',
  },
  {
    id: 'auto',
    name: 'AI 맞춤 추천',
    nameEn: 'AI Pick',
    emoji: '✨',
    category: 'classic',
    summary: '지금 나의 내면 상태에 가장 알맞은 정화 도구를 골라줍니다.',
    coreEffect: '영혼의 주파수에 맞춘 최적의 정화 도구 자동 처방',
  },
];

export type SavedHoponoponoTool = HoponoponoToolRecipe & {
  id: string;
  createdAt: string;
  cleansingSubject: string;
  imageUrl: string | null;
};

export const HOPONOPONO_TOOLS_STORAGE_KEY = 'hoponopono_saved_tools';

export function loadSavedHoponoponoTools(): SavedHoponoponoTool[] {
  try {
    const raw = localStorage.getItem(HOPONOPONO_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHoponoponoTool(tool: SavedHoponoponoTool): SavedHoponoponoTool[] {
  const existing = loadSavedHoponoponoTools();
  const next = [tool, ...existing.filter((t) => t.id !== tool.id)].slice(0, 16);
  localStorage.setItem(HOPONOPONO_TOOLS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteHoponoponoTool(toolId: string): SavedHoponoponoTool[] {
  const next = loadSavedHoponoponoTools().filter((t) => t.id !== toolId);
  localStorage.setItem(HOPONOPONO_TOOLS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getHoponoponoToolById(id: HoponoponoToolId): HoponoponoToolCatalogItem | undefined {
  return HOPONOPONO_TOOL_CATALOG.find((t) => t.id === id);
}

export function inferBestHoponoponoTool(subject: string, offset = 0): Exclude<HoponoponoToolId, 'auto'> {
  const text = (subject || '').toLowerCase();
  if (/체중|외모|다이어트|거울|몸매|얼굴|살찌/i.test(text)) return 'strawberries';
  if (/상실|이별|슬픔|학대|상처|죽음|애도|우울/i.test(text)) return 'pancakes';
  if (/돈|재정|가난|부자|결핍|물질|빚|투자|직장|생계/i.test(text)) return 'hot_chocolate';
  if (/신성|영감|우주|영혼|디바인|초월/i.test(text)) return 'coconut';
  if (/평화|분노|화가|짜증|고요|마음의 평온/i.test(text)) return 'vanilla_ice_cream';
  if (/타이밍|약속|시간|때|장소|적재적소/i.test(text)) return 'jellybeans';
  if (/위기|조난|절체절명|구원|위험|벼랑/i.test(text)) return 'lifesavers';
  if (/접지|그라운딩|붕|산만|어지러|생각이 많/i.test(text)) return 'pretzels';
  if (/독성|험담|원망|비난|악의|가스라이팅/i.test(text)) return 'toast';
  if (/분석|따지|지성|통제|계산|머리/i.test(text)) return 'bubble_gum';
  if (/피로|번아웃|활력|기운|무기력|지쳤/i.test(text)) return 'm_and_ms';
  if (/영적|성장|자아실현|전진|정체/i.test(text)) return 'blueberries';
  if (/기회|후회|놓친|되찾/i.test(text)) return 'candy_canes';
  if (/자책|비판|집착|지우/i.test(text)) return 'eraser';
  if (/공간|방|소금|무거운 공기/i.test(text)) return 'salt_water';
  if (/숨|호흡|답답|가슴/i.test(text)) return 'ha';
  if (/문|잠재의식|열쇠|비밀/i.test(text)) return 'ceeport';

  // 18종 도구 날짜 기반 일일 로테이션 풀
  const toolIds: Array<Exclude<HoponoponoToolId, 'auto'>> = [
    'strawberries',
    'hot_chocolate',
    'pancakes',
    'coconut',
    'vanilla_ice_cream',
    'jellybeans',
    'lifesavers',
    'pretzels',
    'toast',
    'bubble_gum',
    'm_and_ms',
    'blueberries',
    'candy_canes',
    'ceeport',
    'ha',
    'eraser',
    'salt_water',
    'blue_solar_water',
  ];
  const dateKey = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash += dateKey.charCodeAt(i);
  const idx = Math.abs(hash + offset) % toolIds.length;
  return toolIds[idx];
}

export function buildHoponoponoToolPrompt(
  toolId: HoponoponoToolId,
  cleansingSubject: string,
  userContext: string,
): string {
  const inferred = toolId === 'auto' ? inferBestHoponoponoTool(cleansingSubject) : toolId;
  const selected = getHoponoponoToolById(inferred);
  const toolLine =
    toolId === 'auto'
      ? `[오늘 추천 정화 도구 모티브: ${selected?.name} (${selected?.nameEn}) — ${selected?.summary}]\n지금 정화 주제("${cleansingSubject}")의 감정적 결에 가장 알맞은 호오포노포노 정화 도구를 선정하여 처방해 주세요. (주의: 매일 블루솔라워터만 편중 처방하지 말고, 고민에 맞춰 딸기, 핫초콜릿, 팬케이크, 코코넛, 바닐라 아이스크림, 젤리빈, 라이프세이버, 프레첼, 토스트, 풍선껌, M&M 초콜릿, 캔디케인, 블루베리, 지우개, 하, 소금물, 치포트키 등 18종 도구 중 가장 생생하고 다채로운 도구를 처방하세요.)`
      : `선택된 도구: ${selected?.name} (${selected?.nameEn}) — ${selected?.summary} [핵심 효능: ${selected?.coreEffect}]`;

  return `당신은 호오포노포노(The Ho'oponopono Prayer & Cleaning Tools Handbook) 실천을 돕는 정화 도구 가이드입니다.
사용자가 일상에서 바로 실천하고 먹거나 시각화하며 쓸 수 있는 '실제 정화 도구' 처방을 JSON으로 만들어 주세요.

정화 주제: "${cleansingSubject}"
${toolLine}
추가 맥락: ${userContext || '없음'}

[도구 핸드북 원리 참고]
- 블루솔라워터: 파란 유리병 + 물 + 햇빛. 마시거나 바르며 탁한 기억 씻기.
- 치포트키(Ceeport): 잠재의식의 닫힌 문을 여는 정화 열쇠 시각화.
- 하(Ha): 입을 열고 "하——" 길게 내쉬며 생명력 충전 및 긴장 해소.
- 지우개: 마음속 지우개로 판단, 비난, 고정관념 지우기.
- 하와이안 소금물: 천연 소금물로 공간과 신체 잔류 에너지 정화.
- 딸기(Strawberries): 체중과 체형, 외모에 대한 부정적인 기억과 강박 데이터 정화.
- 팬케이크(Pancakes): 과거의 학대와 상처, 모든 상실과 죽음의 아픈 기억 정화.
- M&M 초콜릿(M&M’s): 순수한 생체 활력과 맑은 에너지 충전.
- 블루베리(Blueberries): 영적 성장과 자아실현의 길에서 막힘 없이 전진.
- 캔디 케인(Candy Canes): 살면서 놓쳐버린 기회와 어긋난 타이밍의 회복.
- 코코넛(Coconut): 신성(Divine)과의 깊은 연결과 순수한 영감 수신.
- 핫초콜릿(Hot Chocolate): 돈과 물질을 최우선으로 두는 집착과 결핍 공포 정화.
- 바닐라 아이스크림(Vanilla Ice Cream): 삶과 마음에 고요하고 부드러운 평화 안착.
- 젤리빈(Jellybeans): 가장 알맞은 시간과 장소(적재적소, Right Place & Right Time) 조율.
- 라이프세이버 사탕(Lifesavers): 삶의 위기와 영혼의 조난 상태에서 생명 보호와 구원.
- 프레첼(Pretzels): 밀과 대지, 소금 평원과 연결된 근원적 접지(Grounding) 정화.
- 토스트(Toast): 축적된 독성 데이터 소거 및 순수 에너지 복원.
- 풍선껌(Bubble Gum): 지나친 지성주의, 머리로만 따지는 분석 강박과 통제욕 해방.

[출력 규칙]
- toolId: 최종 선택 도구 id (blue_solar_water | ceeport | ha | eraser | salt_water | strawberries | pancakes | m_and_ms | blueberries | candy_canes | coconut | hot_chocolate | vanilla_ice_cream | jellybeans | lifesavers | pretzels | toast | bubble_gum)
- toolName: 한국어 도구 이름
- toolSubtitle: 한 줄 설명 (20자 내외)
- whyThisTool: 이 주제에 이 도구가 맞는 이유 1~2문장
- materials: 준비물 2~6개 (음식이면 먹는 방법이나 시각화 준비물)
- steps: 만들기·준비·섭취·시각화 실천 순서 3~6단계 (짧고 다정하게)
- usageMantra: 도구를 쓰거나 섭취하며 읊을 네 구절 맞춤 주문 (미안합니다, 용서하세요, 감사합니다, 사랑합니다)
- dailyPractice: 일상에서 반복할 간단한 실천 습관 1~2문장

[문체]
- 짧고 명확하게. 다정한 구어체 사용.
- "미안합니다, 용서하세요, 감사합니다, 사랑합니다"의 4구절이 자연스럽게 스며들도록 작성.`;
}

const TOOL_IMAGE_BASE: Record<Exclude<HoponoponoToolId, 'auto'>, string> = {
  blue_solar_water:
    'A beautiful cobalt blue glass water bottle filled with clear sparkling water, sun rays passing through, tropical Hawaiian peaceful atmosphere, product photography style, soft golden light',
  ceeport:
    'An ornate golden spiritual purification key (Ceeport) with Hawaiian tribal engravings, glowing softly on dark wood, mystical but calm, high detail product render',
  ha:
    'Peaceful person exhaling a long breath "Ha" visualization, soft turquoise and emerald mist flowing outward, meditative Hawaiian nature background, gentle illustration',
  eraser:
    'A clean white eraser on a serene desk with four Hawaiian words written faintly, soft emerald light, minimalist spiritual cleansing concept art',
  salt_water:
    'A glass bowl of Hawaiian salt water with natural sea salt crystals, tropical flowers nearby, calm ocean blue tones, ritual cleansing still life photography',
  strawberries:
    'Fresh ripe red strawberries glistening with morning dew drops, peaceful serene kitchen table, warm sunlight, gentle healing atmosphere, food photography',
  pancakes:
    'Warm fluffy golden pancakes stacked neatly with melting butter and pure maple syrup, cozy comforting gentle morning light, peaceful healing breakfast',
  m_and_ms:
    'Vibrant colorful chocolate candies in a clear glass bowl, sparkling pure joyful energy, soft radiant ambient light, high quality macro photography',
  blueberries:
    'Fresh wild blueberries covered in delicate water droplets, deep indigo blue spiritual tones, serene nature background, soft mystical glow',
  candy_canes:
    'Traditional red and white striped peppermint candy cane resting gently on soft linen, warm comforting holiday light, peaceful sweet atmosphere',
  coconut:
    'A freshly cracked open coconut on a tropical Hawaiian white sand beach overlooking turquoise ocean, radiant divine light, serene peaceful atmosphere',
  hot_chocolate:
    'A warm ceramic mug of rich velvety hot chocolate with gentle steam rising, cozy calming candlelight, serene comfort still life',
  vanilla_ice_cream:
    'A delicate scoop of pure creamy vanilla ice cream in a crystal dessert bowl, ethereal peaceful white tones, soft gentle glow, tranquility',
  jellybeans:
    'A glowing glass jar filled with colorful pastel jellybeans, rainbow harmony, auspicious serendipity, soft dreamy focus, food art photography',
  lifesavers:
    'Colorful ring shaped lifesaver fruit candies arranged in a sacred circle, protective radiant aura, life saving beacon of light, beautiful composition',
  pretzels:
    'Traditional twisted golden baked pretzels sprinkled with coarse sea salt crystals on rustic wooden board, earth wheat grounding energy',
  toast:
    'Golden warm crisp toasted bread slice on a white ceramic plate, pure morning sunlight, detoxifying pure clean energy, simple comforting breakfast',
  bubble_gum:
    'A playful pastel pink bubble gum bubble, lighthearted freedom from mental burden, soft gentle whimsical aesthetic, carefree joyful feeling',
};

export function buildHoponoponoToolImagePrompt(
  toolId: string,
  toolName: string,
  cleansingSubject: string,
): string {
  const base =
    toolId in TOOL_IMAGE_BASE
      ? TOOL_IMAGE_BASE[toolId as Exclude<HoponoponoToolId, 'auto'>]
      : 'A serene Ho\'oponopono purification tool on a Hawaiian meditation altar, soft emerald and sky blue tones';

  return `${base}. Tool: "${toolName}". Cleansing theme: "${cleansingSubject}". Meditative digital painting, NanoBanana style, high resolution, no text, no watermark.`;
}

export const VERIFIED_TOOL_FALLBACK_IMAGES: Record<Exclude<HoponoponoToolId, 'auto'>, string[]> = {
  blue_solar_water: [
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  ],
  ceeport: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  ],
  ha: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  ],
  eraser: [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80',
  ],
  salt_water: [
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  ],
  strawberries: [
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&auto=format&fit=crop&q=80',
  ],
  pancakes: [
    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
  ],
  m_and_ms: [
    'https://images.unsplash.com/photo-1581798459219-318e76aecc0b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80',
  ],
  blueberries: [
    'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800&auto=format&fit=crop&q=80',
  ],
  candy_canes: [
    'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=800&auto=format&fit=crop&q=80',
  ],
  coconut: [
    'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
  ],
  hot_chocolate: [
    'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
  ],
  vanilla_ice_cream: [
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop&q=80',
  ],
  jellybeans: [
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&auto=format&fit=crop&q=80',
  ],
  lifesavers: [
    'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581798459219-318e76aecc0b?w=800&auto=format&fit=crop&q=80',
  ],
  pretzels: [
    'https://images.unsplash.com/photo-1584947942718-47e0bfcf1c33?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80',
  ],
  toast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=800&auto=format&fit=crop&q=80',
  ],
  bubble_gum: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514849302-984523450ce4?w=800&auto=format&fit=crop&q=80',
  ],
};

export function getHoponoponoToolFallbackImageUrl(toolId: string): string {
  const pool = (toolId in VERIFIED_TOOL_FALLBACK_IMAGES)
    ? VERIFIED_TOOL_FALLBACK_IMAGES[toolId as Exclude<HoponoponoToolId, 'auto'>]
    : [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800&auto=format&fit=crop&q=80',
      ];

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx] || pool[0];
}

export function buildHoponoponoToolImageUrl(prompt: string): string {
  const seed = Math.floor(Math.random() * 1_000_000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&seed=${seed}&nologo=true`;
}

export const HOPONOPONO_TOOL_FALLBACKS: Record<
  Exclude<HoponoponoToolId, 'auto'>,
  HoponoponoToolRecipe
> = {
  blue_solar_water: {
    toolId: 'blue_solar_water',
    toolName: '블루솔라워터',
    toolSubtitle: '햇빛 담은 파란 물',
    whyThisTool: '마음의 탁함을 물처럼 씻어내기 좋아요. 집에서 바로 만들 수 있어요.',
    materials: ['파란 유리병', '깨끗한 물', '햇빛이 드는 창가'],
    steps: [
      '파란 유리병을 깨끗이 씻어요.',
      '병의 3분의 2까지 물을 담아요.',
      '창가에 20분~1시간 햇빛을 쬐어요.',
      '한 모금 마시거나 손에 조금 바른 뒤 네 구절을 읊어요.',
    ],
    usageMantra:
      '이 물이 담은 맑음으로\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '아침에 한 모금 마시며 오늘 씻고 싶은 생각 하나를 떠올려 보세요.',
  },
  ceeport: {
    toolId: 'ceeport',
    toolName: '치포트키',
    toolSubtitle: '정화 열쇠',
    whyThisTool: '막힌 마음의 문을 연다고 상상하면, 반복되는 생각을 내려놓기 쉬워요.',
    materials: ['조용한 자리', '작은 열쇠(있으면)', '편한 호흡'],
    steps: [
      '눈을 감고 가슴에 손을 얹어요.',
      '마음속에 빛나는 열쇠(치포트키)를 그려요.',
      '지금 씻고 싶은 생각 앞에서 열쇠로 문을 연다고 상상해요.',
      '문이 열리면 네 구절을 천천히 읊어요.',
    ],
    usageMantra:
      '이 열쇠로 열린 문 너머로\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '하루 한 번, 걱정이 올라올 때 열쇠로 문을 여는 상상을 30초만 해 보세요.',
  },
  ha: {
    toolId: 'ha',
    toolName: '하 (Ha)',
    toolSubtitle: '숨으로 지우기',
    whyThisTool: '몸으로 바로 쓸 수 있어요. 숨을 길게 내뱉으며 긴장을 보내기 좋아요.',
    materials: ['편한 자세', '조용한 공간'],
    steps: [
      '어깨를 내리고 편하게 앉아요.',
      '코로 깊게 들이마셔요.',
      '입을 크게 벌리고 "하——" 하고 길게 내쉬어요.',
      '내쉬는 동안 씻고 싶은 생각을 연기처럼 보낸다고 상상해요.',
      '네 구절을 속삭이며 마무리해요.',
    ],
    usageMantra:
      '하—— 하고 내쉬며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '스트레스가 올라올 때마다 "하" 한 번으로 시작해 보세요.',
  },
  eraser: {
    toolId: 'eraser',
    toolName: '지우개',
    toolSubtitle: '마음속 지우개',
    whyThisTool: '판단과 집착을 지운다는 이미지가 직관적이에요. 네 구절과 잘 맞아요.',
    materials: ['작은 지우개(있으면)', '조용한 자리'],
    steps: [
      '손에 지우개를 쥐거나, 마음속 지우개를 상상해요.',
      '씻고 싶은 생각을 종이에 쓴 것처럼 떠올려요.',
      '지우개로 천천히 문지르며 네 구절을 읊어요.',
      '지워진 빈 공간에 평온이 남는다고 상상해요.',
    ],
    usageMantra:
      '지우개로 비워 가며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '자책이 올라올 때 지우개를 한 번 문지르는 동작으로 시작해 보세요.',
  },
  salt_water: {
    toolId: 'salt_water',
    toolName: '하와이안 소금물',
    toolSubtitle: '소금물 정화',
    whyThisTool: '공간과 몸을 함께 정리하기 좋아요. 집에서 간단히 만들 수 있어요.',
    materials: ['천연 소금 1스푼', '물 1컵', '작은 그릇 또는 분무기'],
    steps: [
      '물에 소금을 녹여요.',
      '손을 씻거나 공간 모서리에 조금 뿌려요.',
      '뿌리거나 바르는 동안 네 구절을 읊어요.',
      '마무리로 창문을 잠깐 열어 공기를 순환시켜요.',
    ],
    usageMantra:
      '소금물이 씻어 주는 맑음으로\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '저녁에 손을 소금물로 씻으며 하루의 무거운 생각을 내려놓아 보세요.',
  },
  strawberries: {
    toolId: 'strawberries',
    toolName: '딸기 (Strawberries)',
    toolSubtitle: '체중·외모 기억 정화',
    whyThisTool: '딸기는 체중과 몸매, 신체 외모에 대한 부정적인 기억과 강박 데이터를 가볍게 덜어냅니다.',
    materials: ['싱싱한 딸기 1~2알 (또는 딸기 시각화)', '편안한 마음'],
    steps: [
      '딸기를 바라보며 몸에 대한 불안과 비교의식을 솔직히 마주해요.',
      '딸기를 한 입 베어 물거나 딸기의 붉은 생명력을 상상해요.',
      '몸을 향한 자책을 내려놓으며 네 구절을 속삭여요.',
      '몸이 본래의 가장 자연스러운 조화를 되찾음을 느껴요.',
    ],
    usageMantra:
      '내 몸을 옥죄던 생각들을 내려놓으며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '거울을 보거나 식사할 때 딸기의 상큼함을 떠올리며 몸에 감사를 전해보세요.',
  },
  pancakes: {
    toolId: 'pancakes',
    toolName: '팬케이크 (Pancakes)',
    toolSubtitle: '상처와 상실의 치유',
    whyThisTool: '팬케이크는 과거의 학대, 상처, 그리고 모든 형태의 죽음·상실·이별의 슬픔에 얽힌 아픈 기억을 따뜻하게 정화합니다.',
    materials: ['팬케이크 1조각 (또는 따뜻한 상상)', '시럽 또는 버터'],
    steps: [
      '마음속 깊이 남은 상실의 아픔과 상처받은 기억을 떠올려요.',
      '따뜻한 팬케이크의 온기가 상처를 부드럽게 감싼다고 느껴요.',
      '아픈 기억들을 향해 사랑의 온기로 네 구절을 읊어요.',
      '슬픔이 녹아내리고 그 자리에 평온한 안식이 깃들어요.',
    ],
    usageMantra:
      '모든 상실과 아픈 상처를 보듬으며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '가슴 한구석이 시릴 때 따뜻한 팬케이크의 포근한 위로를 떠올려보세요.',
  },
  m_and_ms: {
    toolId: 'm_and_ms',
    toolName: 'M&M 초콜릿 (M&M’s)',
    toolSubtitle: '순수한 에너지 충전',
    whyThisTool: '알록달록한 M&M은 침체되고 굳어버린 에너지를 씻어내고 순수한 생체 활력과 기쁨을 불어넣습니다.',
    materials: ['M&M 초콜릿 몇 알 (또는 무지개빛 상상)', '밝은 마음'],
    steps: [
      '손바닥에 알록달록한 초콜릿을 올리거나 상상해요.',
      '무겁고 지친 피로감을 있는 그대로 인정해요.',
      '달콤함을 맛보며 세포 하나하나가 순수한 빛으로 깨어난다고 느껴요.',
      '가벼워진 마음으로 네 구절을 읊어요.',
    ],
    usageMantra:
      '순수한 활력의 빛으로 다시 태어나며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '기운이 처질 때 M&M의 다채로운 색채를 떠올리며 기쁨을 회복해보세요.',
  },
  blueberries: {
    toolId: 'blueberries',
    toolName: '블루베리 (Blueberries)',
    toolSubtitle: '영적 성장의 전진',
    whyThisTool: '블루베리는 영적 성장과 자아실현의 여정에서 막힌 길을 뚫고 앞으로 전진할 수 있도록 이끕니다.',
    materials: ['블루베리 몇 알 (또는 짙은 남색 빛깔 상상)', '맑은 물 한 잔'],
    steps: [
      '성장을 가로막는 영적 혼란이나 답답한 정체감을 떠올려요.',
      '블루베리의 짙은 인디고 빛이 의식을 맑게 정화한다고 상상해요.',
      '걸음을 멈추게 한 두려움에게 네 구절을 속삭여요.',
      '내면의 나침반이 밝아지며 앞으로 나아갈 용기가 솟아나요.',
    ],
    usageMantra:
      '영혼의 맑은 눈을 뜨며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '앞길이 막막할 때 블루베리의 청명함을 떠올리며 다음 발걸음을 내디뎌보세요.',
  },
  candy_canes: {
    toolId: 'candy_canes',
    toolName: '캔디 케인 (Candy Canes)',
    toolSubtitle: '놓친 기회의 회복',
    whyThisTool: '지팡이 모양 캔디 케인은 살아가며 놓쳐버린 기회, 어긋난 타이밍에 대한 후회를 지우고 새로운 가능성을 붙잡아줍니다.',
    materials: ['지팡이 사탕 (또는 빨강·흰색 줄무늬 상상)', '편안한 호흡'],
    steps: [
      '‘그때 그랬더라면’ 하는 후회와 지나간 기회를 떠올려요.',
      '캔디 케인의 지팡이 굽은 고리가 어긋난 인연과 기회를 다시 끌어당긴다고 느껴요.',
      '후회의 마음을 정화하며 네 구절을 천천히 읊어요.',
      '지금 이 순간 더 나은 신성의 기회가 찾아옴을 믿어요.',
    ],
    usageMantra:
      '지나간 후회를 놓아주고 새로운 길을 열며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '아쉬움이 남을 때 지팡이 사탕으로 좋은 기회를 낚아채는 유쾌한 상상을 해보세요.',
  },
  coconut: {
    toolId: 'coconut',
    toolName: '코코넛 (Coconut)',
    toolSubtitle: '신성과의 깊은 연결',
    whyThisTool: '코코넛은 신성(Divine)과의 영적 연결을 깊게 하여 에고의 소음을 잠재우고 순수한 영감을 받게 합니다.',
    materials: ['코코넛 워터/밀크 (또는 야자나무 바다 상상)', '조용한 공간'],
    steps: [
      '혼자서 모든 것을 해결하려 했던 에고의 무거운 짐을 느껴요.',
      '코코넛의 맑고 순수한 생명수가 신성의 사랑과 연결된다고 상상해요.',
      '내면을 비우며 겸허히 네 구절을 읊어요.',
      '신성의 순수한 영감이 의식 속으로 흘러들어옴을 느껴요.',
    ],
    usageMantra:
      '신성한 품에 온전히 맡기며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '결정이 어려울 때 코코넛의 맑은 물방울을 떠올리며 신성에게 맡겨보세요.',
  },
  hot_chocolate: {
    toolId: 'hot_chocolate',
    toolName: '핫초콜릿 (Hot Chocolate)',
    toolSubtitle: '물질·돈 집착 정화',
    whyThisTool: '따뜻한 핫초콜릿은 돈과 물질을 삶의 최우선으로 두는 집착, 결핍에 대한 원초적 두려움을 부드럽게 녹여줍니다.',
    materials: ['따뜻한 핫초콜릿 1잔 (또는 김이 나는 머그컵 상상)', '머그잔'],
    steps: [
      '재정적 불안이나 물질에 대한 조급한 집착을 가슴에 올려두어요.',
      '따뜻하고 달콤한 핫초콜릿을 한 모금 마시며 차가운 결핍감을 녹여요.',
      '물질보다 소중한 내면의 풍요를 기억하며 네 구절을 읊어요.',
      '진정한 번영과 평화가 마음속에서 차오름을 느껴요.',
    ],
    usageMantra:
      '결핍의 두려움을 녹여 풍요로 바꾸며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '돈 걱정이 일어날 때 따뜻한 핫초콜릿의 부드러운 온기를 상상하며 네 구절을 외워보세요.',
  },
  vanilla_ice_cream: {
    toolId: 'vanilla_ice_cream',
    toolName: '바닐라 아이스크림 (Vanilla Ice Cream)',
    toolSubtitle: '고요한 평화 안착',
    whyThisTool: '바닐라 아이스크림은 소란스럽고 들뜬 감정을 차분하게 가라앉히며 우리 삶에 깊고 순수한 평화를 안겨줍니다.',
    materials: ['바닐라 아이스크림 1스푼 (또는 순백의 눈송이 상상)', '작은 스푼'],
    steps: [
      '분주하고 지친 마음에 깃든 열기와 조급함을 바라보아요.',
      '부드러운 바닐라의 순백 크림이 가슴속 소란을 식혀준다고 느껴요.',
      '고요한 침묵 속에서 네 구절을 천천히 속삭여요.',
      '어떤 조건에도 흔들리지 않는 순수한 평화가 머물러요.',
    ],
    usageMantra:
      '하얗고 맑은 평화 속으로 스며들며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '짜증이 올라올 때 시원하고 달콤한 바닐라 아이스크림의 평화를 10초간 떠올려보세요.',
  },
  jellybeans: {
    toolId: 'jellybeans',
    toolName: '젤리빈 (Jellybeans)',
    toolSubtitle: '적재적소 우주적 타이밍',
    whyThisTool: '젤리빈은 가장 올바른 시간과 장소(Right Place at the Right Time)에 내가 머물 수 있도록 우주적 타이밍을 조율합니다.',
    materials: ['색색의 젤리빈 (또는 보석 같은 알갱이 상상)', '유쾌한 호흡'],
    steps: [
      '타이밍이 꼬였거나 자리가 어긋났다고 느끼는 상황을 떠올려요.',
      '젤리빈의 다채로운 조화가 우주의 톱니바퀴를 맞춘다고 상상해요.',
      '모든 어긋남을 신성한 질서에 맡기며 네 구절을 읊어요.',
      '내가 있어야 할 가장 완벽한 자리에 서 있음을 확신해요.',
    ],
    usageMantra:
      '가장 알맞은 시간과 장소로 조율하며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '약속 장소로 가거나 일과를 시작할 때 젤리빈의 완벽한 타이밍을 상상해보세요.',
  },
  lifesavers: {
    toolId: 'lifesavers',
    toolName: '라이프세이버 사탕 (Lifesavers)',
    toolSubtitle: '위기 구원과 생명 보호',
    whyThisTool: '둥근 튜브 모양의 라이프세이버는 삶의 극심한 위기, 영혼의 조난 상태에서 생명을 보호하고 구원의 빛을 비춥니다.',
    materials: ['도넛 모양 사탕 (또는 빛나는 구명튜브 상상)', '가슴에 얹은 손'],
    steps: [
      '위태롭고 궁지에 몰린 듯한 감정이나 두려움을 솔직히 느껴요.',
      '빛나는 라이프세이버 구명튜브가 내 영혼을 안전하게 감싼다고 그려요.',
      '구원의 신성한 손길을 믿으며 네 구절을 간절히 읊어요.',
      '모든 위험에서 안전하게 보호받고 있음을 느껴요.',
    ],
    usageMantra:
      '신성한 보호의 튜브 속에서 안전함을 느끼며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '불안과 공포가 덮쳐올 때 빛나는 라이프세이버가 나를 띄워 올리는 상상을 해보세요.',
  },
  pretzels: {
    toolId: 'pretzels',
    toolName: '프레첼 (Pretzels)',
    toolSubtitle: '대지와 소금 평원의 접지',
    whyThisTool: '프레첼은 밀과 대지, 지구의 소금 평원과 연결되어 붕 뜬 영혼을 단단하게 접지(Grounding)하고 중심을 잡아줍니다.',
    materials: ['소금이 뿌려진 프레첼 (또는 대지의 소금 평원 상상)', '발바닥 감각'],
    steps: [
      '생각이 너무 많아 머리만 뜨겁고 붕 뜬 상태를 자각해요.',
      '바삭한 프레첼과 소금의 결정이 지구 대지와 나를 굳건히 잇는다고 느껴요.',
      '대지의 묵직한 품을 신뢰하며 네 구절을 읊어요.',
      '뿌리가 깊게 박히듯 안정과 중심이 회복돼요.',
    ],
    usageMantra:
      '대지의 굳건한 평화에 뿌리를 내리며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '산만하거나 마음이 흩어질 때 발바닥을 바닥에 붙이고 프레첼의 접지력을 떠올려보세요.',
  },
  toast: {
    toolId: 'toast',
    toolName: '토스트 (Toast)',
    toolSubtitle: '독성 데이터 정화',
    whyThisTool: '구운 토스트는 우리 안에 쌓인 독성 데이터와 오염된 부정적 기억을 깨끗이 태워 순수한 에너지로 복원합니다.',
    materials: ['바삭하게 구운 식빵 (또는 황금빛 온기 상상)', '작은 접시'],
    steps: [
      '마음에 스며든 남의 원망이나 해로운 독성 감정을 마주해요.',
      '노릇하게 구워진 토스트처럼 독성이 모두 정화되어 날아간다고 느껴요.',
      '깨끗해진 내면의 맑은 빵 내음을 느끼며 네 구절을 읊어요.',
      '모든 오염이 사라지고 순수한 에너지만 남아요.',
    ],
    usageMantra:
      '모든 독성 기억을 태워 순수한 빛으로 바꾸며\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '부정적인 사람이나 험담을 들었을 때 토스트로 독성을 정화하는 상상을 해보세요.',
  },
  bubble_gum: {
    toolId: 'bubble_gum',
    toolName: '풍선껌 (Bubble Gum)',
    toolSubtitle: '지성주의와 통제욕 해방',
    whyThisTool: '풍선껌은 지나친 지성주의, 머리로만 따지고 분석하며 통제하려는 에고의 무거운 짐을 가볍게 터뜨려 날려보냅니다.',
    materials: ['달콤한 풍선껌 (또는 분홍빛 방울 상상)', '가벼운 미소'],
    steps: [
      '머리가 터질 듯 복잡하게 따지고 재단하는 에고의 생각을 관찰해요.',
      '풍선껌 방울을 불듯 무거운 생각들을 풍선 속에 불어넣어요.',
      '‘퐁!’ 하고 터지며 아무것도 남지 않음을 보며 네 구절을 유쾌하게 읊어요.',
      '머리가 맑아지고 아이 같은 가벼움이 차올라요.',
    ],
    usageMantra:
      '무거운 머리를 비우고 가벼운 마음으로\n미안합니다, 용서하세요\n감사합니다, 사랑합니다',
    dailyPractice: '생각이 너무 복잡해질 때 풍선껌 방울을 불어 가볍게 터뜨리는 상상을 해보세요.',
  },
};

export function getHoponoponoToolFallback(toolId: HoponoponoToolId, subject = ''): HoponoponoToolRecipe {
  const resolvedId = toolId === 'auto' ? inferBestHoponoponoTool(subject) : toolId;
  return HOPONOPONO_TOOL_FALLBACKS[resolvedId] || HOPONOPONO_TOOL_FALLBACKS.strawberries;
}

export function loadLastHoponoponoTool(): SavedHoponoponoTool | null {
  try {
    const raw = localStorage.getItem(HOPONOPONO_LAST_TOOL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function generateHoponoponoTool(
  toolId: HoponoponoToolId,
  subject: string,
  userContext = '',
): Promise<SavedHoponoponoTool> {
  const buildSaved = (recipe: HoponoponoToolRecipe): SavedHoponoponoTool => {
    const imagePrompt = buildHoponoponoToolImagePrompt(recipe.toolId, recipe.toolName, subject);
    return {
      ...recipe,
      id: `tool_${Date.now()}`,
      createdAt: new Date().toISOString(),
      cleansingSubject: subject,
      imageUrl: buildHoponoponoToolImageUrl(imagePrompt),
    };
  };

  try {
    const prompt = `${buildHoponoponoToolPrompt(toolId, subject, userContext)}\n${PRISM_VOICE_RULES}`;
    const recipe = await invokeLLMStructured({
      messages: [{ role: 'user', content: prompt }],
      schema: HoponoponoToolRecipeSchema,
    });
    return buildSaved(recipe);
  } catch (err) {
    console.warn('Hoponopono tool generation failed, using fallback.', err);
    const fallbackId = toolId === 'auto' ? inferBestHoponoponoTool(subject) : toolId;
    return buildSaved(getHoponoponoToolFallback(fallbackId, subject));
  }
}

export function persistHoponoponoTool(tool: SavedHoponoponoTool): void {
  localStorage.setItem(HOPONOPONO_LAST_TOOL_KEY, JSON.stringify(tool));
  saveHoponoponoTool(tool);

  try {
    playAiResultNotification();
  } catch (_) {}

  recordPrismFeature({
    app: 'bluebird',
    featureName: '호오포노포노 정화 도구 생성',
    summary: `도구명: ${tool.toolName} (${tool.toolSubtitle}), 정화 대상: "${tool.cleansingSubject}", 만트라: "${tool.usageMantra}"`,
    details: tool,
  });
}