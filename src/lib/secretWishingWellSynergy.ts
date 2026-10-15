import { loadCachedSecret, loadWish, loadWishApplied, DailySecretData } from '@/components/orange/DailySecret';
import { generateDynamicSecretKit, SECRET_CATALOG } from '@/components/orange/dailySecretCatalog';
import { WishCategoryId, WISH_CATEGORIES } from '@/lib/wishingWell';
import { invokeLLM } from '@/lib/ai';

export interface TodaySecretContext {
  isReceived: boolean;
  theme: 'abundance' | 'success' | 'love' | 'health' | 'peace' | 'miracle';
  themeKo: string;
  effectiveWish: string;
  appliedWish?: string;
  affirmation: string;
  desire: string;
  feelingAnchor: string;
  reflection: string;
}

export interface SecretWellRecommendation {
  id: string;
  dimension: 'purify_release' | 'inner_child_trust' | 'subconscious_manifest';
  dimensionLabel: string;
  dimensionDesc: string;
  category: WishCategoryId;
  categoryLabel: string;
  categoryEmoji: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
  wishText: string;
  synergyReason: string;
}

const THEME_KO_MAP: Record<string, string> = {
  abundance: '부와 풍요',
  success: '성공 & 목표 성취',
  love: '사랑 & 따뜻한 인연',
  health: '건강 & 생명 활력',
  peace: '평온 & 불안 해방',
  miracle: '우주 조화 & 기적',
};

/**
 * Reads active Today's Secret kit if received, or falls back to today's scheduled catalog kit.
 */
export function getTodaySecretContext(name: string = '여행자'): TodaySecretContext {
  const cached = loadCachedSecret('', name);
  const wishApplied = loadWishApplied();
  const rawAppliedWish = loadWish();

  if (cached && (cached.isReceived || wishApplied || (cached.appliedWish && cached.appliedWish.trim().length > 0))) {
    // Derive theme from catalog match or default
    let detectedTheme: TodaySecretContext['theme'] = 'abundance';
    const match = SECRET_CATALOG.find(
      (c) => c.affirmation === cached.affirmation || c.desire === cached.desire
    );
    if (match) {
      detectedTheme = match.theme;
    } else {
      const lower = ((cached.appliedWish || '') + ' ' + cached.affirmation + ' ' + cached.desire).toLowerCase();
      if (/(돈|부자|부|풍요|수입|재정|자유|수익|매출|통장|금전)/.test(lower)) detectedTheme = 'abundance';
      else if (/(성공|합격|목표|시험|커리어|승리|역량|성취|도약)/.test(lower)) detectedTheme = 'success';
      else if (/(사랑|인연|결혼|애인|화해|연애|가족|친구|다정)/.test(lower)) detectedTheme = 'love';
      else if (/(건강|치유|몸|피로|통증|세포|활력|숙면|체력)/.test(lower)) detectedTheme = 'health';
      else if (/(평온|불안|고요|내면|안식|쉼|현존|이완)/.test(lower)) detectedTheme = 'peace';
      else detectedTheme = 'miracle';
    }

    const effectiveWish =
      cached.appliedWish?.trim() ||
      rawAppliedWish.trim() ||
      cached.desire.replace(/^우주여,\s*/, '').replace(/하옵소서\.?$/, '').trim() ||
      '오늘 하루 우주의 무한한 풍요와 조화';

    return {
      isReceived: true,
      theme: detectedTheme,
      themeKo: THEME_KO_MAP[detectedTheme] || '오늘의 시크릿',
      effectiveWish,
      appliedWish: cached.appliedWish || rawAppliedWish || undefined,
      affirmation: cached.affirmation,
      desire: cached.desire,
      feelingAnchor: cached.feelingAnchor,
      reflection: cached.reflection,
    };
  }

  // Not yet received: provide today's scheduled secret from catalog
  const defaultKit = generateDynamicSecretKit('', name, 0);
  const match = SECRET_CATALOG.find((c) => c.affirmation === defaultKit.affirmation) || SECRET_CATALOG[0];

  return {
    isReceived: false,
    theme: match.theme,
    themeKo: match.themeKo,
    effectiveWish: match.desire.replace(/^우주여,\s*/, '').replace(/하옵소서\.?$/, '').trim(),
    affirmation: defaultKit.affirmation,
    desire: defaultKit.desire,
    feelingAnchor: defaultKit.feelingAnchor,
    reflection: defaultKit.reflection,
  };
}

/**
 * High-fidelity deterministic generator matching Today's Secret frequency with Wishing Well
 */
export function generateDeterministicSecretWellRecommendations(
  ctx: TodaySecretContext,
  seed: number = 0
): SecretWellRecommendation[] {
  const cleanWish = (ctx.appliedWish || ctx.effectiveWish || '').trim().replace(/^"|"$/g, '');
  const theme = ctx.theme;

  const getCategoryMeta = (catId: WishCategoryId) =>
    WISH_CATEGORIES.find((c) => c.id === catId) || WISH_CATEGORIES[0];

  // 1. Dimension 1: Purification & Releasing Resistance (정화 & 저항 방출) -> inner_peace
  let dim1Wish = '';
  let dim1Synergy = '';
  if (theme === 'abundance') {
    dim1Wish = cleanWish
      ? `"${cleanWish}"을(를) 향한 마음속 모든 결핍감과 조급함을 우물의 맑은 수면에 흘려보내고, 마르지 않는 풍요의 타이밍을 온전히 신뢰합니다.`
      : '돈과 미래에 대한 모든 결핍과 조급함을 맑은 우물에 던져버리고, 우주가 예비한 풍요의 완전한 타이밍을 신뢰하는 깊은 평온을 누립니다.';
    dim1Synergy = '소원에 대한 집착과 결핍의 주파수를 씻어내어, 시크릿에서 확언한 풍요의 통로를 활짝 개방합니다.';
  } else if (theme === 'success') {
    dim1Wish = cleanWish
      ? `"${cleanWish}"의 결과에 대한 두려움과 압박감을 우물의 고요한 물결에 씻어내고, 흔들리지 않는 맑은 집중력과 내면의 평온을 회복합니다.`
      : '시험과 평가에 대한 모든 두려움과 긴장을 우물에 부드럽게 내려놓고, 가장 편안하고 맑은 집중력으로 내 안의 평온에 머뭅니다.';
    dim1Synergy = '평가에 대한 불안 저항을 정화하여, 최고의 역량과 직관이 결정적인 순간 막힘없이 발휘되도록 돕습니다.';
  } else if (theme === 'love') {
    dim1Wish = cleanWish
      ? `"${cleanWish}"(으)로 향하는 길목의 오랜 서운함과 방어적인 벽을 우물에 흘려보내고, 진실한 이해와 사랑의 여백을 맞이합니다.`
      : '과거의 오해와 상처로 닫혔던 마음의 문을 우물의 맑은 정화수로 씻어내고, 있는 그대로 다정하게 품어주는 사랑의 평온을 회복합니다.';
    dim1Synergy = '상처받을까 두려워 닫았던 마음을 우물의 치유수로 씻어내어 진실한 사랑의 공명을 촉진합니다.';
  } else if (theme === 'health') {
    dim1Wish = cleanWish
      ? `"${cleanWish}"을(를) 방해하던 몸과 마음의 오랜 피로와 무거운 짐을 우물에 내려놓고, 세포 하나하나가 깊은 쉼과 재생을 얻습니다.`
      : '지친 몸과 마음에 쌓인 긴장의 무게를 우물의 차가운 치유수에 툭 내려놓고, 자연스럽게 피어나는 생명력의 평화에 안식합니다.';
    dim1Synergy = '억지로 버티던 신체적 긴장과 스트레스를 방출하여, 세포 고유의 자기 치유 에너지를 활성화합니다.';
  } else if (theme === 'peace') {
    dim1Wish = cleanWish
      ? `"${cleanWish}"을(를) 둘러싼 과거의 후회와 미래의 불안을 우물에 던지고, 오직 선물처럼 주어진 지금 이 순간의 안식에 머뭅니다.`
      : '머릿속을 맴돌던 과거의 후회와 미래의 불안을 우물의 깊은 심연에 놓아주고, 완전한 현존의 자리에서 고요한 숨을 쉽니다.';
    dim1Synergy = '시간에 쫓기던 마음을 정화하여, 지금 이 순간 우주와 연결된 무한한 안식을 확립합니다.';
  } else {
    dim1Wish = cleanWish
      ? `"${cleanWish}"의 실현 방법을 인간적인 좁은 계산으로 한정 짓지 않고 우물에 맡기며, 상상 이상의 기적을 받아들일 고요한 여백을 엽니다.`
      : '내 모든 한계와 의심을 우물의 맑은 수면에 내려놓고, 우주의 무한한 지혜와 선한 질서가 펼쳐내는 완전한 기적에 안식합니다.';
    dim1Synergy = '어떻게 이루어질지에 대한 조급한 계산을 우물에 맡김으로써 기적의 통로를 넓힙니다.';
  }

  // 2. Dimension 2: Self-Worth & Inner Child Trust (자격 & 내면아이 신뢰) -> self_love
  let dim2Wish = '';
  let dim2Synergy = '';
  if (theme === 'abundance') {
    dim2Wish = cleanWish
      ? `나는 이미 "${cleanWish}"의 눈부신 풍요를 온전히 누릴 자격이 충분한 존재임을 내면 아이와 함께 따뜻하게 안아주고 긍정합니다.`
      : '풍요는 내 타고난 본성임을 기억하며, 죄책감이나 결핍감 없이 모든 우주의 선물을 기쁘게 영접하는 내 안의 자존감을 채웁니다.';
    dim2Synergy = '무의식의 결핍과 자격지심을 치유하여, 풍요의 축복을 저항 없이 받아들이는 그릇을 완성합니다.';
  } else if (theme === 'success') {
    dim2Wish = cleanWish
      ? `"${cleanWish}"을(를) 위해 묵묵히 땀 흘려온 내 안의 아이를 다정하게 토닥이며, 나는 마침내 승리할 자격이 있음을 확신합니다.`
      : '어떤 결과 앞에서도 변함없이 소중하고 빛나는 나 자신을 긍정하며, 내 안의 무한한 가능성과 잠재력을 굳게 신뢰합니다.';
    dim2Synergy = '성취에 대한 압박을 내면 아이를 향한 따뜻한 격려로 전환하여, 든든한 심리적 안정감을 세웁니다.';
  } else if (theme === 'love') {
    dim2Wish = cleanWish
      ? `애써 증명하지 않아도 사랑받기에 충분한 나를 먼저 꼭 안아주고, "${cleanWish}"의 다정한 행복을 기꺼이 받아들입니다.`
      : '조건 없이 나를 온전히 사랑하고 아껴줄 때 비로소 타인과의 관계에서도 건강하고 조화로운 사랑이 샘솟음을 신뢰합니다.';
    dim2Synergy = '셀프러브의 주파수를 먼저 채움으로써 타인과의 관계에서 불안과 의존을 걷어내고 건강한 연결을 맺습니다.';
  } else if (theme === 'health') {
    dim2Wish = cleanWish
      ? `매 순간 나를 지켜주고 회복시키는 내 몸의 모든 세포에게 감사를 전하며, "${cleanWish}"의 가벼운 생명력을 사랑으로 환영합니다.`
      : '오늘 하루 묵묵히 버텨준 내 몸과 마음에 다정한 칭찬을 건네며, 있는 그대로의 소중한 나를 가장 따뜻하게 돌봅니다.';
    dim2Synergy = '내 몸과의 진실한 화해와 자기 사랑을 통해 자연 치유 파동의 수용성을 극대화합니다.';
  } else if (theme === 'peace') {
    dim2Wish = cleanWish
      ? `아무것도 증명할 필요 없는 완전한 존재로서 나를 인정하고, "${cleanWish}"의 투명한 평화를 내 영혼에 가득 선물합니다.`
      : '남들의 시선에서 벗어나 내 삶의 중심을 잡고, 지금 존재하는 나 자신만으로도 충분히 아름답고 온전함을 자각합니다.';
    dim2Synergy = '자기 수용의 깊은 안식을 통해 외부 환경에 흔들리지 않는 내면의 절대적인 안전지대를 구축합니다.';
  } else {
    dim2Wish = cleanWish
      ? `온 우주의 무조건적인 지지와 사랑을 받는 귀한 존재로서, "${cleanWish}"의 기적을 기쁜 마음으로 선물받습니다.`
      : '나는 기적을 누리기에 충분히 가치 있는 영혼임을 내면 깊이 새기고, 우주가 내게 베푸는 모든 호의를 활짝 웃으며 맞이합니다.';
    dim2Synergy = '우주적 자존감을 회복하여, 시크릿에서 끌어당긴 기적의 결실을 온전히 내 것으로 정착시킵니다.';
  }

  // 3. Dimension 3: Subconscious Manifestation & Seeding (씨앗 심기 & 현실화) -> dream or courage
  let dim3Category: WishCategoryId = 'dream';
  let dim3Wish = '';
  let dim3Synergy = '';
  if (theme === 'abundance') {
    dim3Category = 'dream';
    dim3Wish = cleanWish
      ? `오늘 시크릿에서 선포한 "${cleanWish}"의 주파수가 우물의 깊은 잠재의식 수면에 단단히 뿌리내려, 가장 아름답고 풍성한 현실로 피어납니다.`
      : '마르지 않는 풍요의 샘물이 내 삶의 모든 길목마다 솟아나, 재정적 자유와 함께 세상에 선한 빛을 나누는 위대한 꿈을 이룹니다.';
    dim3Synergy = '시크릿의 확언을 우물의 무의식 수면에 단단히 각인하여 현실 창조의 가속도를 극대화합니다.';
  } else if (theme === 'success') {
    dim3Category = 'courage';
    dim3Wish = cleanWish
      ? `"${cleanWish}"의 눈부신 성취를 향해 오늘 한 걸음 더 담대히 나아가며, 우주의 완벽한 타이밍에 최고의 결실로 당당히 증명됩니다.`
      : '두려움을 넘어 새로운 도전의 문을 활짝 열어젖히고, 내 분야에서 가장 눈부신 합격과 성공의 영광을 온 세상에 펼쳐냅니다.';
    dim3Synergy = '용기의 불꽃을 우물에 심어, 확언에 머물지 않고 실제 행동과 현실 승리로 이끄는 추진력을 부여합니다.';
  } else if (theme === 'love') {
    dim3Category = 'relationship';
    dim3Wish = cleanWish
      ? `오늘 시크릿에서 품은 사랑의 파동이 맑은 우물 수면을 타고 퍼져나가, "${cleanWish}"의 기적 같은 화해와 평생의 축복으로 결실을 맺습니다.`
      : '서로를 깊이 신뢰하고 아끼는 운명적인 인연들과 함께, 매일 기쁨과 감사가 넘쳐나는 따뜻하고 든든한 관계의 낙원을 일굽니다.';
    dim3Synergy = '사랑의 확언을 관계의 우물에 공명시켜, 상대방의 마음에도 저항 없이 따뜻한 울림이 전달되도록 연결합니다.';
  } else if (theme === 'health') {
    dim3Category = 'courage';
    dim3Wish = cleanWish
      ? `"${cleanWish}"의 눈부신 활력과 균형 잡힌 에너지를 회복하여, 매일 아침 가벼운 발걸음으로 가슴 뛰는 하루를 시작합니다.`
      : '지치지 않는 강인한 체력과 맑은 정신력으로 거듭나, 내가 사랑하는 모든 일과 사람들을 위해 활기차게 살아갑니다.';
    dim3Synergy = '치유의 확언을 활력과 실천의 에너지로 전환하여 하루 전체의 쾌활한 컨디션을 완성합니다.';
  } else if (theme === 'peace') {
    dim3Category = 'inner_peace';
    dim3Wish = cleanWish
      ? `"${cleanWish}"의 고요한 침묵과 거룩한 평화가 내 삶의 모든 순간을 호위하며, 어떤 풍랑 속에서도 흔들림 없는 안식처가 됩니다.`
      : '세상의 소란 속에서도 영혼의 중심을 잃지 않는 깊은 고요함을 체화하여, 만나는 모든 이들에게도 온화한 평화를 선물합니다.';
    dim3Synergy = '내면의 평화를 깊은 무의식의 닻으로 내림으로써 일상의 어떤 자극에도 평정을 유지하도록 만듭니다.';
  } else {
    dim3Category = 'dream';
    dim3Wish = cleanWish
      ? `오늘 시크릿에서 끌어당긴 "${cleanWish}"의 무한한 가능성이 우물의 신비로운 샘에서 솟아나, 상상 그 이상의 눈부신 기적으로 실현됩니다.`
      : '가슴속에 품은 가장 거대한 비전과 기적의 씨앗이 우주의 은혜 속에서 활짝 꽃피어나, 세상에 눈부신 영감을 전합니다.';
    dim3Synergy = '우주의 전폭적인 지지를 우물의 깊은 잠재의식에 봉헌하여, 기적의 현실화를 촉진합니다.';
  }

  const cat1 = getCategoryMeta('inner_peace');
  const cat2 = getCategoryMeta('self_love');
  const cat3 = getCategoryMeta(dim3Category);

  return [
    {
      id: `synergy_purify_${seed}`,
      dimension: 'purify_release',
      dimensionLabel: '정화 & 저항 방출',
      dimensionDesc: '집착과 조급함을 우물의 맑은 수면에 내려놓기',
      category: 'inner_peace',
      categoryLabel: cat1.label,
      categoryEmoji: cat1.emoji,
      colorClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      borderClass: 'border-emerald-400/30 hover:border-emerald-400/60',
      wishText: dim1Wish,
      synergyReason: dim1Synergy,
    },
    {
      id: `synergy_trust_${seed}`,
      dimension: 'inner_child_trust',
      dimensionLabel: '자격 & 내면아이 신뢰',
      dimensionDesc: '소원을 누릴 자격이 충분함을 온전히 긍정하기',
      category: 'self_love',
      categoryLabel: cat2.label,
      categoryEmoji: cat2.emoji,
      colorClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      borderClass: 'border-amber-400/30 hover:border-amber-400/60',
      wishText: dim2Wish,
      synergyReason: dim2Synergy,
    },
    {
      id: `synergy_manifest_${seed}`,
      dimension: 'subconscious_manifest',
      dimensionLabel: '씨앗 심기 & 우주적 현실화',
      dimensionDesc: '우물의 잠재의식 수면에 단단히 각인하여 결실 맺기',
      category: dim3Category,
      categoryLabel: cat3.label,
      categoryEmoji: cat3.emoji,
      colorClass: 'text-orange-300',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      borderClass: 'border-orange-400/30 hover:border-orange-400/60',
      wishText: dim3Wish,
      synergyReason: dim3Synergy,
    },
  ];
}

/**
 * Real-time Gemini LLM AI Enhancement with instant fallback protection
 */
export async function fetchAiSecretWellRecommendations(
  ctx: TodaySecretContext,
  seed: number = 0
): Promise<SecretWellRecommendation[]> {
  const fallback = generateDeterministicSecretWellRecommendations(ctx, seed);

  try {
    const prompt = `당신은 치유와 성찰의 오렌지(ORANGE) 유니버스에서 [오늘의 시크릿(The Secret)]과 [별에게 소원빌기(Wish Upon a Star)]의 에너지를 잇는 '시크릿-별빛 AI 공명 안내자'입니다.

사용자의 오늘 시크릿 상태:
- 시크릿 테마: ${ctx.themeKo} (${ctx.theme})
- 시크릿 확언: "${ctx.affirmation}"
- 사용자 소원/염원: "${ctx.effectiveWish}"
- 시크릿 감정 닻: "${ctx.feelingAnchor}"

별에게 소원빌기는 시크릿의 확언을 밤하늘 별에 띄워 '조급함과 집착을 내려놓고 은하수에 맡기며(Letting Go)', '내면 아이를 별빛처럼 사랑하고', '잠재의식에 찬란한 별빛 씨앗을 심는' 성소입니다.
위 시크릿과 공명하는 3가지 서로 다른 차원의 맞춤 별빛 소망 문구를 JSON 형식으로 작성해 주세요.

규칙:
1. wish1 (정화 & 저항 방출): category는 "inner_peace". 시크릿 소원에 대한 조급함, 결핍, 불안을 밤하늘에 띄워 보내는 문장 (60~85자).
2. wish2 (자격 & 내면아이 신뢰): category는 "self_love". 이 시크릿 축복을 누릴 자격이 충분함을 밤하늘 별빛과 확신하는 문장 (60~85자).
3. wish3 (씨앗 심기 & 현실화): category는 "dream" 또는 "courage" 또는 "relationship". 시크릿 주파수를 별빛에 각인하여 현실 결실을 맺는 문장 (60~85자).
4. 각 항목별로 synergyReason(왜 이 소망이 오늘의 시크릿과 시너지를 내는지 1문장, 30~50자)을 작성하세요.

반드시 마크다운 없이 유효한 JSON 문자열로만 응답하세요:
{
  "items": [
    {
      "dimension": "purify_release",
      "category": "inner_peace",
      "wish": "...",
      "synergyReason": "..."
    },
    {
      "dimension": "inner_child_trust",
      "category": "self_love",
      "wish": "...",
      "synergyReason": "..."
    },
    {
      "dimension": "subconscious_manifest",
      "category": "dream",
      "wish": "...",
      "synergyReason": "..."
    }
  ]
}`;

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));

    const aiPromise = async (): Promise<SecretWellRecommendation[] | null> => {
      try {
        const raw = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'You are the Secret-Well Resonance AI for the Orange universe. Respond ONLY in valid JSON format in Korean.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          responseFormat: { type: 'json_object' },
        });

        if (!raw) return null;
        let cleanJson = raw.trim();
        const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) cleanJson = match[1].trim();
        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(cleanJson);
        const list = Array.isArray(parsed?.items) ? parsed.items : [];
        if (list.length >= 3) {
          const enhanced = fallback.map((fb, idx) => {
            const aiItem = list[idx];
            if (aiItem && typeof aiItem.wish === 'string' && aiItem.wish.trim().length >= 20) {
              const catId = (aiItem.category as WishCategoryId) || fb.category;
              const catMeta = WISH_CATEGORIES.find((c) => c.id === catId) || WISH_CATEGORIES[0];
              return {
                ...fb,
                category: catId,
                categoryLabel: catMeta.label,
                categoryEmoji: catMeta.emoji,
                wishText: aiItem.wish.trim(),
                synergyReason: typeof aiItem.synergyReason === 'string' && aiItem.synergyReason.trim().length > 10
                  ? aiItem.synergyReason.trim()
                  : fb.synergyReason,
              };
            }
            return fb;
          });
          return enhanced;
        }
        return null;
      } catch (e) {
        console.warn('[secretWishingWellSynergy] AI parsing failed, falling back:', e);
        return null;
      }
    };

    const res = await Promise.race([aiPromise(), timeoutPromise]);
    return res || fallback;
  } catch (err) {
    console.warn('[secretWishingWellSynergy] AI error, falling back:', err);
    return fallback;
  }
}
