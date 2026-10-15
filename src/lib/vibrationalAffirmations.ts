/**
 * High-Vibrational Anchor Affirmations Library & Dynamic Quantum Generator
 * Designed to eliminate repetitive affirmations and provide profound, inspiring,
 * counseling-topic and mood/vibe tailored dynamic affirmations.
 */

import { getLucyChatSummary } from '@/lib/prismOmniSync';
import { loadSavedUnifiedMessages } from '@/lib/chatHistorySync';
import { getPersistentUserProfile } from '@/contexts/AppContext';
import { safeLocalStorage } from '@/utils/safeStorage';
import { invokeLLM } from '@/lib/ai';

export interface VibrationalAffirmationItem {
  id: string;
  category: string;
  text: string;
  theme: string;
  frequency?: number;
}

export interface UserCounselingVibeContext {
  counselingTopic: string;
  counselingSummary?: string;
  currentVibe: string;
  vibeId: string;
  hasRecentCounseling: boolean;
  sourceDescription: string;
}

export interface VibePreset {
  id: string;
  label: string;
  icon: string;
  theme: string;
  keywords: string[];
}

export const VIBE_PRESETS: VibePreset[] = [
  { id: 'confidence', label: '자신감 & 강력한 돌파', icon: '⚡', theme: '승리와 당당한 자기 확신', keywords: ['돌파', '당당함', '승리'] },
  { id: 'abundance', label: '무한 풍요 & 기적', icon: '💎', theme: '마르지 않는 번영과 결실', keywords: ['풍요', '기적', '번영'] },
  { id: 'peace', label: '평온 & 불안 정화', icon: '🌿', theme: '깊은 이완과 흔들림 없는 평화', keywords: ['평온', '정화', '안도감'] },
  { id: 'love', label: '사랑 & 온기 회복', icon: '💖', theme: '따뜻한 유대와 가슴 벅찬 사랑', keywords: ['사랑', '온기', '연결'] },
  { id: 'passion', label: '열정 & 거침없는 실행', icon: '🔥', theme: '불타는 에너지와 추진력', keywords: ['열정', '추진력', '실행'] },
  { id: 'clarity', label: '명료한 통찰 & 직관', icon: '🔮', theme: '맑은 의식과 창조적 영감', keywords: ['통찰', '영감', '명료함'] },
];

export const VIBRATIONAL_AFFIRMATIONS_BY_CATEGORY: Record<string, string[]> = {
  wealth: [
    "나의 존재 주파수는 무한한 우주의 부와 번영에 완전히 정렬되었으며, 돈과 기회는 밤낮없이 자연스러운 강물처럼 흘러든다.",
    "나는 결핍을 메우려는 자가 아니라 풍요의 발원지이며, 나의 모든 영감과 실행은 황금빛 결실로 즉각 물질화된다.",
    "부와 성공은 나의 타고난 상태이며, 오늘 내 계좌와 삶의 모든 영역에 상상 이상의 풍성한 기적이 쏟아져 들어온다.",
    "결핍과 조급함의 환상은 완전히 녹아내렸고, 나는 이미 이루어진 경제적 자유의 깊은 안도감 속에서 당당히 숨 쉰다.",
    "내가 세상에 베푸는 진심과 가치는 수만 배의 축복과 번영이 되어 가장 완벽한 타이밍에 내게 되돌아온다.",
    "나의 신경계는 마르지 않는 재정적 축복의 파동에 닻을 내렸으며, 나는 그 모든 풍요를 평온하고 감사하게 누린다.",
    "우주의 거대한 보고가 나를 향해 활짝 열려 있으며, 나는 매 순간 최상의 부와 기회를 자석처럼 끌어당긴다.",
    "돈은 나를 자유롭게 하고 타인을 살리는 선한 생명 에너지이며, 내게 올수록 세상 또한 더욱 풍요로워진다."
  ],
  career: [
    "나의 잠재력과 전문성은 오늘 가장 높은 차원에서 빛을 발하며, 내가 도약해야 할 최고의 자리와 영광의 문이 활짝 열린다.",
    "원하는 합격과 성취는 이미 영적 시공간에서 확정되었으며, 나는 온 우주의 전폭적인 지지를 받으며 당당히 행진한다.",
    "모든 면접, 시험, 협상, 프로젝트 현장에서 나의 고유한 지혜와 당당한 아우라가 압도적인 신뢰와 호감을 이끌어낸다.",
    "나는 기회를 기다리는 자가 아니라 기회의 주인이자 창조자이며, 세상은 나의 뛰어난 역량을 열렬히 환영한다.",
    "최고의 팀과 프로젝트가 나의 에너지를 알아보고 강력히 손짓하며, 나의 성장은 거스를 수 없는 우주의 흐름이다.",
    "실패에 대한 모든 의심과 긴장이 씻겨 나갔고, 나의 온몸은 승리와 달성의 벅찬 전율로 가득 차 있다.",
    "오늘 내가 내딛는 단 하나의 걸음이 거대한 기적의 도미노를 일으켜 눈부신 성공을 완성한다."
  ],
  love: [
    "나의 가슴 중심에서 뿜어져 나오는 순수한 사랑의 파동이 나와 영혼의 결이 완벽히 일치하는 인연을 지금 자석처럼 끌어당긴다.",
    "나는 있는 그대로 온전하고 사랑받기에 마땅한 존재이며, 서로를 깊이 존중하고 영혼을 치유하는 진실한 관계가 이미 시작되었다.",
    "외로움과 결핍의 주파수는 봄눈 녹듯 사라졌고, 충만한 온기와 신뢰가 나와 그 사람의 시공간을 가득 채운다.",
    "우리는 이미 서로의 주파수를 알아보고 있으며, 우주는 가장 완벽하고 다정한 타이밍에 우리의 만남을 기적처럼 성사시킨다.",
    "내 삶에 흐르는 모든 사랑은 날마다 더 깊어지고, 매 순간 따뜻한 눈빛과 진심 어린 연결로 가득하다.",
    "과거의 상처는 가장 단단한 다이아몬드가 되었으며, 나는 다시 사랑하고 사랑받을 완전한 준비가 되었다.",
    "우리의 관계는 우주의 축복 속에 매일 더 맑고 순수한 기쁨으로 피어난다."
  ],
  health: [
    "내 몸의 수십조 개 세포는 지금 이 순간 기적의 빛으로 샤워하며 본래의 완벽한 생명력과 치유 파동을 회복한다.",
    "모든 피로와 긴장은 숨을 내쉴 때마다 흩어지고, 맑고 신선한 우주의 생기 에너지가 정수리부터 발끝까지 가득 찬다.",
    "나의 면역계와 신경계는 완벽한 조화를 이루고 있으며, 잠들 때마다 깊고 평온한 세포 재생의 기적이 일어난다.",
    "나는 지치지 않는 활력과 가벼운 몸, 맑고 긍정적인 정신으로 오늘 하루를 경쾌하게 살아간다.",
    "자연의 치유 에너지가 내 혈관과 장기를 부드럽게 감싸며, 매일매일 더 젊고 탄력 있는 몸으로 거듭난다.",
    "몸의 통증과 굳어짐은 생명의 물결에 녹아내리고, 내 안의 자연 치유력이 기적처럼 깨어났다.",
    "나는 내 몸을 지극히 아끼고 사랑하며, 내 몸 또한 내 사랑에 건강한 활력으로 화답한다."
  ],
  creative: [
    "우주의 무한한 지성과 영감이 내 의식을 통해 맑은 샘물처럼 막힘없이 분출되며, 위대한 작품이 세상에 태어난다.",
    "나의 직관은 초정밀 나침반처럼 정확하며, 창조의 환희와 몰입이 내 손끝을 통해 눈부신 형태로 형상화된다.",
    "두려움 없이 내 안의 가장 진실한 목소리를 표현할 때, 온 세상은 깊은 전율과 찬사로 응답한다.",
    "상상력의 한계는 이미 깨어졌으며, 모든 독창적인 아이디어는 완벽한 시기와 형태로 물질세계에 안착한다.",
    "나는 우주의 신성한 영감이 흐르는 가장 깨끗하고 당당한 통로이며, 나의 창작은 수많은 이들의 영혼을 깨운다.",
    "창작의 모든 막힘은 뚫렸고, 아이디어의 은하수가 내 의식 속에 쉼 없이 소용돌이친다."
  ],
  freedom: [
    "나는 시간과 장소에 구애받지 않고 내가 원하는 곳에서 원하는 사람들과 최고의 삶을 설계하는 자유로운 창조자다.",
    "내 삶의 주도권은 온전히 내 손에 있으며, 나의 모든 선택은 더 깊은 평화와 광활한 자유의 지평으로 이어진다.",
    "세상의 틀과 타인의 시선에서 완전히 해방되어, 내 영혼이 노래하는 가장 진실한 속도로 우주를 유영한다.",
    "풍요와 자유는 완벽히 결합되어 있으며, 나의 매일은 여유로운 탐험과 설레는 자율성으로 가득 차 있다.",
    "나는 어디에 있든 내면의 평화를 잃지 않으며, 온 세상이 나의 편안한 집이자 놀이터다."
  ],
  inner_peace: [
    "거센 파도 밑바닥 심해처럼 내 중심은 흔들림 없는 고요 속에 머물며, 모든 상황을 자비롭고 담담하게 관조한다.",
    "지금 이 순간 모든 애씀을 내려놓습니다. 이미 모든 것은 있어야 할 자리에 있고, 나는 안전하며 평화롭습니다.",
    "숨을 들이쉬며 순수한 빛을 채우고, 숨을 내쉬며 모든 묵은 생각과 집착을 우주로 방하착(放下着)합니다.",
    "내면의 고요함이 곧 나의 가장 위대한 힘이며, 이 평온의 파동이 내 주변 모든 환경을 부드럽게 정화한다.",
    "어떤 소음도 내 영혼의 성소를 침범할 수 없으며, 나는 지금 온 우주의 품 안에서 깊은 안식을 누린다."
  ],
  courage: [
    "두려움은 내 영혼이 거대하게 도약하고 있다는 신호일 뿐, 나는 심장의 고동을 느끼며 당당하게 전진한다.",
    "내 안에 잠들어 있던 거인이 마침내 깨어났으며, 어떤 불확실성도 나의 불굴의 신념을 꺾을 수 없다.",
    "어제의 한계는 오늘의 디딤돌이 되었고, 나는 날마다 더 강하고 지혜로운 존재로 찬란히 거듭난다.",
    "새로운 길을 여는 자의 담대함이 내 피 속에 흐르며, 나는 기적의 선구자로서 당당히 승리한다."
  ]
};

export const FREQUENCY_AFFIRMATIONS: Record<number, string> = {
  396: "396Hz 근원 정화 주파수가 내 안의 모든 죄책감과 두려움을 해체하고, 순수한 자기 확신의 터전을 다시 세운다.",
  417: "417Hz 변화 촉진 파동이 과거의 부정적 굴레와 정체된 카르마를 부드럽게 씻어내어 새로운 기적의 장을 연다.",
  432: "432Hz 우주 자연 배음의 파동이 내 신체와 의식을 정화하며, 자연의 완벽한 순리와 조화로운 리듬에 나를 일치시킨다.",
  528: "528Hz 기적과 변형의 빛이 세포 핵과 DNA를 깨우며, 불가능을 가능으로 뒤바꾸는 양자 도약이 지금 이 순간 현실화된다.",
  639: "639Hz 사랑과 융합의 주파수가 나와 세상의 모든 단절을 치유하며, 서로를 성장시키는 깊은 신뢰의 다리를 놓는다.",
  741: "741Hz 직관과 내면 각성의 파동이 모든 영적 막힘을 뚫어내고, 명료한 통찰과 진실의 빛으로 나의 길을 환히 비춘다.",
  852: "852Hz 순수 영적 질서의 주파수가 나를 가장 높은 차원의 신성한 자아와 직결시키며, 영혼의 궁극적 안식을 선사한다.",
  963: "963Hz 왕관 차크라 신성 연결음이 내 의식을 무한한 우주 의식과 하나로 합일시키며 기적을 일상으로 창조한다."
};

/**
 * Automatically extracts the user's latest counseling theme and current emotional vibe (mood)
 * from cross-service stores (Lucy Chat Summary, Unified Messages, Profile Psych, Art Mood, Sedona).
 */
export function getUserCounselingVibeContext(): UserCounselingVibeContext {
  let counselingTopic = "새로운 도약과 영혼의 자유";
  let counselingSummary: string | undefined = undefined;
  let hasRecentCounseling = false;
  let sourceDescription = "통합 라이프 여정";

  try {
    // 1. Check Lucy chat summary
    const summaryData = getLucyChatSummary();
    if (summaryData?.summary && summaryData.summary.length > 5) {
      counselingSummary = summaryData.summary;
      const cleanSummary = summaryData.summary.replace(/[\[\]]/g, '').trim();
      counselingTopic = cleanSummary.length > 25 ? cleanSummary.slice(0, 25) + '...' : cleanSummary;
      hasRecentCounseling = true;
      sourceDescription = "최근 루시 상담 대화";
    }

    // 2. Check recent user messages in chatHistory
    if (!hasRecentCounseling) {
      const messages = loadSavedUnifiedMessages();
      const userMsgs = (messages || []).filter(m => m.role === 'user' && typeof m.content === 'string' && m.content.trim().length > 3);
      if (userMsgs.length > 0) {
        const lastMsg = userMsgs[userMsgs.length - 1].content as string;
        const cleanMsg = lastMsg.replace(/\n/g, ' ').trim();
        counselingTopic = cleanMsg.length > 24 ? cleanMsg.slice(0, 24) + '...' : cleanMsg;
        hasRecentCounseling = true;
        sourceDescription = "최근 대화 질문";
      }
    }
  } catch (e) {
    console.warn('[vibrationalAffirmations] Error inspecting chat memory:', e);
  }

  // 3. Current Mood / Vibe
  let currentVibe = "충만한 확신과 안도감";
  let vibeId = "confidence";

  try {
    const profile = getPersistentUserProfile();
    const psychMood = profile?.psych?.currentMood;
    const artMood = safeLocalStorage.getItem('art_current_mood') || safeLocalStorage.getItem('muse_today_art_mood_label');
    const customVibe = safeLocalStorage.getItem('orange_catalyst_user_vibe');

    if (customVibe && customVibe.trim().length > 0) {
      currentVibe = customVibe.trim();
      const matched = VIBE_PRESETS.find(p => p.label.includes(currentVibe) || currentVibe.includes(p.label));
      if (matched) vibeId = matched.id;
    } else if (psychMood && psychMood.trim().length > 0) {
      currentVibe = psychMood.trim();
      if (currentVibe.includes('불안') || currentVibe.includes('지침') || currentVibe.includes('답답')) {
        currentVibe = `${currentVibe}을(를) 넘어서는 깊은 이완과 회복`;
        vibeId = "peace";
      } else if (currentVibe.includes('열정') || currentVibe.includes('설렘')) {
        vibeId = "passion";
      }
    } else if (artMood && artMood.trim().length > 0) {
      currentVibe = artMood.trim();
    }
  } catch (e) {
    console.warn('[vibrationalAffirmations] Error reading user mood:', e);
  }

  return {
    counselingTopic,
    counselingSummary,
    currentVibe,
    vibeId,
    hasRecentCounseling,
    sourceDescription
  };
}

/**
 * Procedural synthesizer combining:
 * 1. User's counseling context (resolving past tensions)
 * 2. Current emotional vibe (enhancing resonant energy)
 * 3. User's specific target wish
 * 4. Frequency tone alignment
 */
export function synthesizeVibeAttunedAffirmation(params: {
  category: string;
  wish: string;
  frequency: number;
  counselingTopic: string;
  currentVibe: string;
  cycleOffset?: number;
}): string {
  const { wish, frequency, counselingTopic, currentVibe, cycleOffset = 0 } = params;

  const cleanWish = (wish || '간절한 소망의 완전한 성취').trim().replace(/['"“”.]/g, '');
  const shortWish = cleanWish.length > 25 ? cleanWish.slice(0, 25) + '...' : cleanWish;

  const cleanTopic = (counselingTopic || '내면의 성장과 도약').replace(/['"“”]/g, '').trim();
  const shortTopic = cleanTopic.length > 20 ? cleanTopic.slice(0, 20) : cleanTopic;

  const cleanVibe = (currentVibe || '충만한 확신과 안도감').replace(/['"“”]/g, '').trim();

  // Dynamic templates designed to address counseling resolution, emotional vibe transformation, and quantum wish realization
  const templates = [
    // Template 1: Emotional Vibe + Quantum Collapse
    `내 안에 차오르는 '${cleanVibe}'의 기운이 ${frequency}Hz 기적의 파동과 완벽히 공명하며, '${shortWish}'의 눈부신 성취를 지금 이 순간 즉각 물질화한다.`,

    // Template 2: Counseling Resolution to Breakthrough
    `'${shortTopic}'에 얽매였던 과거의 모든 저항은 봄눈 녹듯 사라졌고, '${cleanVibe}'의 높은 주파수 속에서 '${shortWish}'은(는) 이미 확정된 현실로 펼쳐진다.`,

    // Template 3: Frequency Grounding + Sensory Presence
    `${frequency}Hz 황금빛 공명 속에서 나는 더 이상 바라는 결핍의 상태가 아니며, '${cleanVibe}'의 충만한 미소로 '${shortWish}'의 결실을 평온히 누린다.`,

    // Template 4: Soul Journey Alignment
    `'${shortTopic}'을(를) 거치며 단단해진 나의 영혼은 지금 온 우주의 전폭적인 사랑을 받고 있으며, '${shortWish}'을(를) 향한 길마다 상상 이상의 은총이 쏟아져 내린다.`,

    // Template 5: Absolute Certainty & Cellular Vibrancy
    `나의 온몸 수십조 개 세포는 '${cleanVibe}'의 찬란한 빛으로 진동하고 있으며, '${shortWish}'의 실현으로 인한 벅찬 안도감과 감사가 내 신경계를 가득 채운다.`,

    // Template 6: Energetic Magnetism
    `우주는 나의 고요하고 흔들림 없는 '${cleanVibe}' 파동에 열렬히 화답하며, '${shortWish}'의 완성을 위해 필요한 사람, 기회, 재물을 자석처럼 끌어당긴다.`,

    // Template 7: Quantum Leap Alchemy
    `시공간의 장벽은 이미 무너졌다. '${shortTopic}'을(를) 넘어선 나의 의식은 이미 '${shortWish}'이(가) 완성된 시점에 닻을 내렸으며, 현실은 그 진동을 따라 즉각 재배열된다.`,

    // Template 8: Divine Freedom & Abundance
    `나는 '${cleanVibe}'의 자유로운 창조자로서 당당히 숨 쉬며, '${shortWish}'의 기적적인 결실을 온 세상과 함께 나눌 가장 완전한 그릇이 되었다.`
  ];

  // Dynamic hash variation ensuring non-repetition across cycle offsets
  const seed = (cleanWish.length * 17 + frequency * 11 + cleanVibe.length * 7 + Math.abs(cycleOffset)) % templates.length;
  return templates[seed];
}

/**
 * Returns a diverse, non-repeating affirmation incorporating:
 * - Specific user counseling topic
 * - User's current vibe
 * - Category & target wish
 * - Frequency
 */
export function getDynamicVibrationalAffirmation(
  category: string,
  wish?: string,
  frequency: number = 528,
  cycleOffset: number = 0,
  contextOverride?: Partial<UserCounselingVibeContext>
): { affirmation: string; totalOptions: number; currentIndex: number; context: UserCounselingVibeContext } {
  const baseContext = getUserCounselingVibeContext();
  const context: UserCounselingVibeContext = {
    ...baseContext,
    ...(contextOverride || {})
  };

  const pool = VIBRATIONAL_AFFIRMATIONS_BY_CATEGORY[category] || VIBRATIONAL_AFFIRMATIONS_BY_CATEGORY.wealth;
  const total = pool.length + 5; // pool items + frequency item + 3 vibe-attuned procedural variations
  const safeIndex = Math.abs(cycleOffset) % total;

  if (safeIndex < 2) {
    // Top Priority: Synthesize directly with current counseling topic and current Vibe!
    const synthesized = synthesizeVibeAttunedAffirmation({
      category,
      wish: wish || '간절한 소망의 완전한 성취',
      frequency,
      counselingTopic: context.counselingTopic,
      currentVibe: context.currentVibe,
      cycleOffset: safeIndex + cycleOffset
    });
    return {
      affirmation: synthesized,
      totalOptions: total,
      currentIndex: safeIndex,
      context
    };
  } else if (safeIndex < pool.length + 2) {
    const poolIdx = (safeIndex - 2) % pool.length;
    return {
      affirmation: pool[poolIdx],
      totalOptions: total,
      currentIndex: safeIndex,
      context
    };
  } else if (safeIndex === pool.length + 2 && FREQUENCY_AFFIRMATIONS[frequency]) {
    return {
      affirmation: FREQUENCY_AFFIRMATIONS[frequency],
      totalOptions: total,
      currentIndex: safeIndex,
      context
    };
  } else {
    // Secondary vibe variation
    const synthesized = synthesizeVibeAttunedAffirmation({
      category,
      wish: wish || '간절한 소망의 완전한 성취',
      frequency,
      counselingTopic: context.counselingTopic,
      currentVibe: context.currentVibe,
      cycleOffset: cycleOffset + 5
    });
    return {
      affirmation: synthesized,
      totalOptions: total,
      currentIndex: safeIndex,
      context
    };
  }
}

/**
 * Asynchronously generates an ultra-dynamic, tailor-made AI vibrational anchor affirmation
 * dynamically attuned to the user's latest counseling themes and real-time emotional vibe.
 */
export async function generateAIVibrationalAffirmation(params: {
  category: string;
  wish: string;
  frequency: number;
  counselingTopic: string;
  currentVibe: string;
  cycleOffset?: number;
}): Promise<string> {
  const { category, wish, frequency, counselingTopic, currentVibe, cycleOffset = 0 } = params;

  const fallback = synthesizeVibeAttunedAffirmation({
    category,
    wish,
    frequency,
    counselingTopic,
    currentVibe,
    cycleOffset
  });

  try {
    const prompt = `[양자 현실화 고진동 확언(VIBRATIONAL ANCHOR AFFIRMATION) 실시간 생성]
- 사용자 최근 상담 주제/고민: "${counselingTopic}"
- 사용자 현재 기분(Vibe): "${currentVibe}"
- 현실화 소망 목표: "${wish}"
- 동조 솔페지오 주파수: ${frequency}Hz
- 셔플 회차 시드: ${cycleOffset}

[요구사항]:
1. 상투적이거나 형식적인 뻔한 문장을 절대 금지합니다.
2. 사용자의 최근 상담 주제("${counselingTopic}")에서 오는 내면의 불안이나 저항을 깨끗이 해소하고, 현재 기분("${currentVibe}")의 높은 주파수와 결합하여 소원("${wish}")이 이미 이루어진 감격을 표현하세요.
3. 1인칭 현재형("나는 ~이다", "나의 존재는 ~한다")으로 40자~75자 내외의 1문장으로만 작성하세요.
4. 따옴표나 기타 서두 인사말 없이 순수 확언 문장만 출력하세요.`;

    const safetyTimeout = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 4500));
    const aiCall = (async () => {
      const resp = await invokeLLM({
        messages: [
          { role: 'system', content: '당신은 양자 현실화 고진동 확언 마스터입니다. 사용자의 상담 주제와 감정 Vibe를 완벽히 융합한 전율 돋는 1문장 고진동 확언을 출력하세요.' },
          { role: 'user', content: prompt }
        ]
      });
      const clean = (typeof resp === 'string' ? resp : (resp as any)?.text || '')
        .replace(/["“”`]/g, '')
        .trim();
      if (clean && clean.length >= 15 && clean.length <= 130) {
        return clean;
      }
      throw new Error('invalid format');
    })();

    const result = await Promise.race([aiCall, safetyTimeout]);
    return result;
  } catch (e) {
    console.warn('[vibrationalAffirmations] generateAIVibrationalAffirmation fallback:', e);
    return fallback;
  }
}
