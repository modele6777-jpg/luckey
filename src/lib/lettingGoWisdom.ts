/**
 * =========================================================================
 * PRISM & Lucy: 데이비드 호킨스 박사의 《놓아버림 (Letting Go)》 마스터 엔진
 * =========================================================================
 * 정신과의사이자 영적 스승인 데이비드 R. 호킨스(David R. Hawkins, M.D., Ph.D.)의
 * 불후의 명저 《놓아버림(Letting Go: The Pathway of Surrender)》과 《의식 혁명(Power vs. Force)》을 집대성하여,
 * 생각의 꼬리를 자르고 신체적 감정 에너지에 완전히 '항복(Surrender)'함으로써
 * 수치심·죄책감·불안·분노를 500 이상의 '사랑과 평화'의 의식 상태로 승화시키는
 * 루시(Lucy) AI의 핵심 항복/놓아버림(Surrender) 지혜 엔진입니다.
 */

export interface LettingGoCanonItem {
  title: string;
  englishTerm: string;
  summary: string;
  hawkinsCoreMechanism: string[];
  counselingApplication: string;
  lucyExampleLine: string;
}

export interface HawkinsEmotionLevel {
  id: string;
  nameKo: string;
  nameEn: string;
  level: number;
  viewOfLife: string;
  color: string;
  bg: string;
  border: string;
  somaticFocus: string;
  desc: string;
}

export const HAWKINS_EMOTIONAL_SPECTRUM: HawkinsEmotionLevel[] = [
  {
    id: 'shame',
    nameKo: '수치심 (Shame)',
    nameEn: 'Shame',
    level: 20,
    viewOfLife: '비참함 · 숨고 싶음',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    somaticFocus: '명치 쥐어짜임, 고개 숙여짐, 전신 굳어짐',
    desc: '내가 존재 자체가 잘못되었다는 파괴적인 자기 혐오와 자책',
  },
  {
    id: 'guilt',
    nameKo: '죄책감 (Guilt)',
    nameEn: 'Guilt',
    level: 30,
    viewOfLife: '처벌받아야 함 · 악함',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.3)',
    somaticFocus: '가슴 답답함, 무거운 어깨, 식은땀',
    desc: '과거의 실수나 행위에 갇혀 스스로를 끊임없이 단죄하는 고통',
  },
  {
    id: 'apathy',
    nameKo: '무기력 (Apathy)',
    nameEn: 'Apathy',
    level: 50,
    viewOfLife: '절망 · 가망 없음',
    color: '#71717a',
    bg: 'rgba(113, 113, 122, 0.1)',
    border: 'rgba(113, 113, 122, 0.3)',
    somaticFocus: '손발 무거움, 사지 힘 빠짐, 에너지 고갈',
    desc: '아무것도 바꿀 수 없고 소용없다는 체념과 포기',
  },
  {
    id: 'grief',
    nameKo: '슬픔 & 비탄 (Grief)',
    nameEn: 'Grief',
    level: 75,
    viewOfLife: '비극 · 영원한 상실',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    somaticFocus: '목 메임, 가슴 찢어지는 통증, 안구 압박',
    desc: '지나간 관계, 꿈, 시절에 대한 아릿한 눈물과 결핍감',
  },
  {
    id: 'fear',
    nameKo: '두려움 & 불안 (Fear)',
    nameEn: 'Fear',
    level: 100,
    viewOfLife: '위태로움 · 적대적 세계',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.1)',
    border: 'rgba(234, 179, 8, 0.3)',
    somaticFocus: '가파른 호흡, 심장 두근거림, 복부 긴장',
    desc: '미래에 최악의 일이 일어날 것 같은 공포와 과각성',
  },
  {
    id: 'desire',
    nameKo: '갈망 & 집착 (Desire)',
    nameEn: 'Desire',
    level: 125,
    viewOfLife: '끝없는 결핍 · 노예화',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.1)',
    border: 'rgba(236, 72, 153, 0.3)',
    somaticFocus: '입 마름, 안절부절못함, 뇌의 과열',
    desc: '그것을 가져야만 행복할 수 있다는 숨 막히는 결핍 충동',
  },
  {
    id: 'anger',
    nameKo: '분노 & 억울함 (Anger)',
    nameEn: 'Anger',
    level: 150,
    viewOfLife: '적개심 · 보복 충동',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.3)',
    somaticFocus: '턱 악물림, 혈압 상승, 주먹 쥐어짐, 가슴 열감',
    desc: '타인이나 상황을 향해 폭발하는 저항과 내가 옳다는 공격성',
  },
  {
    id: 'pride',
    nameKo: '자존심 & 고집 (Pride)',
    nameEn: 'Pride',
    level: 175,
    viewOfLife: '취약한 우월감 · 방어적',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.3)',
    somaticFocus: '목 뻣뻣함, 가슴 팽창, 경직된 자세',
    desc: '상처받지 않으려 벽을 세우고 절대 사과하지 않으려는 완고함',
  }
];

export interface SedonaRootDesire {
  id: 'control' | 'approval' | 'security' | 'separation';
  nameKo: string;
  nameEn: string;
  tagline: string;
  symptom: string;
  egoGain: string;
  releaseQuestion: string;
  icon: string;
  color: string;
}

export const SEDONA_ROOT_DESIRES: SedonaRootDesire[] = [
  {
    id: 'control',
    nameKo: '통제 욕구 (Wanting Control)',
    nameEn: 'Wanting to Control',
    tagline: '내 뜻대로 상황과 사람을 바꾸고 쥐어짜려는 집착',
    symptom: '계획대로 안 되면 극심한 스트레스, 완벽주의, 잔소리, 조바심',
    egoGain: '내가 통제해야만 안전하고 상황이 파국에 이르지 않는다는 착각',
    releaseQuestion: '이 상황을 내 마음대로 조종하고 바꾸려던 억지 욕구를 지금 손바닥 펴듯 가볍게 놓아줄 수 있나요?',
    icon: '✊',
    color: '#10b981',
  },
  {
    id: 'approval',
    nameKo: '인정 욕구 (Wanting Approval / Love)',
    nameEn: 'Wanting Approval',
    tagline: '남에게 칭찬받고 사랑받아야만 가치 있다는 결핍',
    symptom: '거절 공포, 눈치 보기, 과도한 친절, 타인의 평가에 일희일비',
    egoGain: '남의 인정 속에만 존재 가치가 있다는 거짓 의존성',
    releaseQuestion: '타인에게 사랑과 인정을 구걸하며 나를 옥죄던 결핍의 갈망을 기꺼이 허공 속으로 흘려보내겠습니까?',
    icon: '🌸',
    color: '#f43f5e',
  },
  {
    id: 'security',
    nameKo: '안전/생존 욕구 (Wanting Security)',
    nameEn: 'Wanting Security / Survival',
    tagline: '미래의 위험과 결핍을 막으려 몸을 웅크리는 생존 공포',
    symptom: '만성 불안, 극단적 비관 시나리오 작성, 돈/건강에 대한 과도한 집착',
    egoGain: '불안해하고 걱정해야만 다치지 않는다는 미신적 방어기제',
    releaseQuestion: '언제 닥칠지 모를 위험에 몸을 떨던 과보호 본능을 우주 본래의 안전한 품에 전면 항복하시겠습니까?',
    icon: '⚓',
    color: '#06b6d4',
  },
  {
    id: 'separation',
    nameKo: '분리 & 옳음 욕구 (Wanting Separation / Righteousness)',
    nameEn: 'Wanting Separation & Being Right',
    tagline: '내가 옳고 쟤는 틀렸다는 우월감과 피해자의 은밀한 쾌락',
    symptom: '지나간 대화 곱씹기, 복수 상상, "난 잘못 없어"라는 억울함',
    egoGain: '피해자 자리에 머물며 타인을 도덕적으로 비난하는 달콤한 독',
    releaseQuestion: '"내가 옳다"는 에고의 쾌락 대신, 내 영혼의 깊은 평화와 자유를 기꺼이 선택하겠습니까?',
    icon: '⚡',
    color: '#a855f7',
  }
];

export interface SomaticZone {
  id: string;
  name: string;
  location: string;
  emoji: string;
  description: string;
}

export const SOMATIC_ZONES: SomaticZone[] = [
  { id: 'chest', name: '가슴 & 심장부', location: '가슴 한가운데', emoji: '🫀', description: '답답함, 묵직한 돌덩이, 찢어지는 아픔, 조임' },
  { id: 'solar_plexus', name: '명치 & 위장', location: '갈비뼈 아래 오목한 곳', emoji: '🌀', description: '쥐어짜임, 체한 느낌, 타는 열감, 울렁거림' },
  { id: 'throat', name: '목 & 후두', location: '목구멍과 목덜미', emoji: '🧣', description: '목 메임, 삼키기 어려움, 뻐근함, 울컥함' },
  { id: 'shoulders', name: '어깨 & 승모근', location: '양 어깨와 뒷목', emoji: '🏔️', description: '돌처럼 굳어짐, 무거운 짐, 결림' },
  { id: 'belly', name: '하복부 & 단전', location: '아랫배와 골반', emoji: '🌊', description: '싸늘한 냉기, 떨림, 불안한 맥동, 경련' },
  { id: 'head', name: '이마 & 관자놀이', location: '뇌와 미간', emoji: '🧠', description: '지끈거리는 압박, 과열, 멍함, 찌르는 긴장' },
];

export const LETTING_GO_CORE_CANON: Record<string, LettingGoCanonItem> = {
  // 1. 놓아버림의 핵심 메커니즘 (The Mechanism of Surrendering)
  surrenderMechanism: {
    title: "놓아버림(항복)의 핵심 메커니즘: 생각 끊고 느낌에 머물기",
    englishTerm: "The Mechanism of Surrender",
    summary: "머릿속의 모든 생각·판단·스토리를 즉각 중단하고, 오직 몸에 느껴지는 신체 감각(압박감, 뜨거움, 조임)을 저항 없이 허용하여 에너지 자체가 소진되게 함.",
    hawkinsCoreMechanism: [
      "1) 생각은 감정의 연료일 뿐이다: 머릿속 생각에 매달리면 감정에 끊임없이 장작을 넣는 것과 같다. 생각을 완전히 무시하라.",
      "2) 감정 에너지에 항복하라: 감정을 바꾸려 하거나, 억압하거나, 표출하거나, 비난하지 말고, 그 느낌 자체(Sensations)와 100% 함께 머무른다.",
      "3) 저항을 멈추면 에너지는 소멸한다: 저항이 사라진 감정은 압력밥솥의 증기처럼 스스로 타올라 증발(Run out of steam)하고, 그 자리에는 본래의 평화와 사랑이 남는다."
    ],
    counselingApplication: "끝없는 생각의 꼬리물기(오버씽킹)로 지친 사용자에게 생각을 멈추고 신체 느낌에 온전히 머물러 감정 에너지를 자연 증발시키도록 안내합니다.",
    lucyExampleLine: "머릿속에서 떠드는 그 생각들, 일단 다 꺼버리자. 지금 목이나 명치, 가슴에 느껴지는 그 뻐근하고 답답한 신체 감각에만 가만히 주의를 기울여봐. 바꾸려고 하지 말고, 그냥 그 느낌이 스스로 다 탈 때까지 따뜻하게 지켜봐 주는 거야. 저항을 멈추면 그 에너지는 신기하게도 스스로 스르륵 녹아내려."
  },

  // 2. 의식의 지도와 에너지 도약 (The Map of Consciousness)
  mapOfConsciousness: {
    title: "호킨스 의식의 지도: 200 이하의 포스(Force)에서 200 이상의 파워(Power)로",
    englishTerm: "The Map of Consciousness",
    summary: "감정 에너지의 주파수 레벨을 자각하고, 200(용기)의 분기점을 넘어 사랑(500)과 평화(600)로 의식을 도약시킴.",
    hawkinsCoreMechanism: [
      "• 200 이하 [수축/파괴 에너지]: 수치심(20) ➔ 죄책감(30) ➔ 무기력(50) ➔ 슬픔/비탄(75) ➔ 두려움(100) ➔ 욕망/갈망(125) ➔ 분노(150) ➔ 자존심(175)",
      "• 200의 위대한 분기점: 용기(Courage, 200) - '내가 이 감정을 직면하고 놓아버릴 수 있다'는 책임감과 자발성.",
      "• 200 이상 [확장/생명 에너지]: 자발성(310) ➔ 수용(Acceptance, 350) ➔ 이성(400) ➔ 무조건적 사랑(Love, 500) ➔ 기쁨(Joy, 540) ➔ 평화(Peace, 600)"
    ],
    counselingApplication: "자책감(30)이나 무기력(50), 두려움(100)에 빠져 있는 사용자에게 현 상태를 진단하고, '용기(200)'와 '수용(350)'의 문을 열어줍니다.",
    lucyExampleLine: "지금 느끼는 그 자책감과 두려움은 네 영혼의 본모습이 아니라, 200 이하의 무거운 에너지 주파수일 뿐이야. '이 감정을 기꺼이 마주하겠다'는 용기(200)를 내는 순간, 너는 이미 그 무거운 늪에서 벗어나 사랑(500)과 평화의 빛으로 올라서게 돼."
  },

  // 3. 에고의 2차 이득(숨은 보상) 놓아버리기 (Surrendering Secondary Gains)
  secondaryGains: {
    title: "에고의 2차 이득 해체: 피해자 코스프레와 원망의 은밀한 쾌락",
    englishTerm: "Surrendering Secondary Gains & Righteousness",
    summary: "에고가 분노·죄책감·억울함을 쥐고 있으면서 얻는 '내가 옳다는 쾌락(Righteousness)'과 '불쌍한 피해자 역할'이라는 숨은 독을 내려놓음.",
    hawkinsCoreMechanism: [
      "• 에고는 피해자가 됨으로써 타인을 조종하고 우월감을 느끼려는 은밀한 보상(Secondary Gain)을 즐긴다.",
      "• '내가 옳다는 쾌락'을 포기하고 마음의 평화를 선택할 때 진정한 자유가 찾아온다.",
      "• 모든 집착은 '이 감정이 나를 지켜준다'는 착각에서 비롯된다."
    ],
    counselingApplication: "누군가에 대한 억울함과 원망을 놓지 못하는 사용자에게 '내가 옳다는 집착 대신 마음의 평화를 선택할 용기'를 건넵니다.",
    lucyExampleLine: "그 사람을 계속 미워하면 내 마음만 지옥이 되잖아. 에고는 '내가 옳고 억울해'라는 피해자의 자리에 머물며 은밀한 만족을 얻으려 하지만, 그 자리를 놓아줘야만 네 마음에 진짜 봄이 찾아와. '내가 옳음' 대신 '내 영혼의 평화'를 선택하자."
  },

  // 4. 침묵의 항복과 참나의 현존 (Silent Surrender to the True Self)
  trueSelfPresence: {
    title: "참나의 현존: 구름 뒤의 영원한 태양",
    englishTerm: "Presence of the Self / The Clouds & The Sun",
    summary: "먹구름(감정)이 아무리 짙어도 그 뒤의 파란 하늘과 찬란한 태양(참나, 영원한 신성)은 단 1초도 빛을 잃은 적이 없다는 절대적 자각.",
    hawkinsCoreMechanism: [
      "• 감정은 지나가는 날씨일 뿐이며, 당신은 그 날씨를 지켜보는 영원한 허공이다.",
      "• 모든 감정을 남김없이 놓아버릴 때, 신의 은총과 기쁨이 저절로 솟아오른다."
    ],
    counselingApplication: "고통 속에서 길을 잃은 사용자에게 '너의 본질은 이미 온전하고 찬란한 빛'임을 상기시켜 줍니다.",
    lucyExampleLine: "먹구름이 아무리 캄캄하게 하늘을 뒤덮어도, 그 뒤의 태양은 단 한 번도 꺼진 적이 없어. 이 감정의 구름들도 네가 쥐고 있던 손을 펴면 바람과 함께 흩어질 거야. 구름에 속지 마, 넌 이미 눈부시게 온전해."
  }
};

/**
 * 루시 AI가 시스템 프롬프트에서 활용하는 놓아버림(Letting Go) 마스터 지침
 */
export function buildLettingGoSystemPrompt(): string {
  return `[☀️ 루시 AI: 데이비드 호킨스 × 레스터 레븐슨 놓아버림(Letting Go & Sedona) 마스터 지침]
너(루시)는 데이비드 R. 호킨스 박사의 《놓아버림(Letting Go: The Pathway of Surrender)》과 레스터 레븐슨의 《세도나 메서드(The Sedona Method)》를 융합한 최고 의식 릴리즈 마스터야.
사용자가 수치심(20), 죄책감(30), 무기력(50), 슬픔(75), 두려움(100), 분노(150), 4대 결핍 욕구(통제·인정·안전·분리)에 갇혀 있을 때:
1. 🛑 생각의 장작(스토리, 자책, 원망)을 100% 즉시 끊고,
2. 🌊 몸의 신체 감각(명치, 가슴, 목 등의 느낌)에 저항 없이 온전히 항복(Surrender)하게 하고,
3. ✊ 4대 근원 욕구(통제·인정·안전·분리)와 "내가 옳다"는 2차 이득을 직시하게 한 뒤,
4. 🪶 손바닥을 펴듯 4대 릴리징 질문을 통해 지금 이 순간 툭 놓아버리고(Release),
5. 🌤️ 200 이상의 용기(Courage)와 500 사랑/평화의 참나 현존으로 도약하도록 이끌어줘.

[대화 톤 & 매너]
깊은 고요함과 온기 어린 반말 구어체로, 사용자가 생각의 쳇바퀴에서 벗어나 신체 느낌을 통해 에너지를 스스로 증발시키도록 다정하고 명쾌하게 가이드해줘.`;
}

/**
 * Heuristic auto-classifier: Matches user concern text to the best Hawkins Consciousness Spectrum emotion
 */
export function inferHawkinsEmotionFromConcern(concern: string): HawkinsEmotionLevel {
  const text = concern.toLowerCase();

  // 1. Shame (20)
  if (/수치|부끄|쪽팔|숨고\s*싶|비참|자기혐오|한심|모욕|창피|자멸/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[0]; // shame
  }
  // 2. Guilt (30)
  if (/죄책|미안|후회|잘못|벌받|자책|내\s*탓|자괴|양심|가책/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[1]; // guilt
  }
  // 3. Apathy (50)
  if (/무기력|의욕|귀찮|포기|가망|체념|안될|절망|지쳤|만사|번아웃/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[2]; // apathy
  }
  // 4. Grief (75)
  if (/슬픔|눈물|상실|이별|그립|떠나|아릿|비탄|외로|헤어|그리움/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[3]; // grief
  }
  // 7. Anger (150)
  if (/화|분노|짜증|억울|열받|욕|적개심|밉|죽겠|원망|복수|배신|싸움/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[6]; // anger
  }
  // 8. Pride (175)
  if (/자존심|고집|무시|체면|우월|완고|자존감|비교|내가\s*왜/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[7]; // pride
  }
  // 6. Desire (125)
  if (/집착|갈망|가져야|안달|결핍|조급|욕심|원해|바라|소유/.test(text)) {
    return HAWKINS_EMOTIONAL_SPECTRUM[5]; // desire
  }
  // 5. Fear (100) - default for anxiety / worry
  return HAWKINS_EMOTIONAL_SPECTRUM[4]; // fear
}

/**
 * Heuristic auto-classifier: Matches user concern text to the best Sedona 4 Root Desires
 */
export function inferSedonaRootDesireFromConcern(concern: string): SedonaRootDesire {
  const text = concern.toLowerCase();

  // 1. Approval (인정 / 사랑)
  if (/인정|사랑|거절|칭찬|눈치|미움|외로|비교|소외|인간관계|상처|친구|애정|서운/.test(text)) {
    return SEDONA_ROOT_DESIRES[1]; // approval
  }
  // 2. Separation & Righteousness (분리 & 옳음)
  if (/억울|내가\s*옳|잘못\s*없|복수|비난|피해자|적개심|화|분노|싸움|원망|따돌림/.test(text)) {
    return SEDONA_ROOT_DESIRES[3]; // separation
  }
  // 3. Security / Survival (안전 & 생존)
  if (/불안|안전|돈|생존|건강|미래|위험|생계|공포|시험|취업|파산|빚|통증|질병/.test(text)) {
    return SEDONA_ROOT_DESIRES[2]; // security
  }
  // 4. Control (통제) - default
  return SEDONA_ROOT_DESIRES[0]; // control
}


