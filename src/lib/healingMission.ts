import { z } from 'zod';
import { invokeLLMStructured } from '@/lib/ai';
import { auth, db, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc } from '@/lib/firebase';
import { recordPrismFeature } from '@/lib/prismOmniSync';

export interface MissionCategory {
  id: 'body' | 'mindful' | 'digital' | 'nature' | 'compassion' | 'breath';
  label: string;
  subLabel: string;
  emoji: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  gradient: string;
  description: string;
}

export const MISSION_CATEGORIES: MissionCategory[] = [
  {
    id: 'body',
    label: '신체 이완 & 스트레칭',
    subLabel: 'Body Release & Stretch',
    emoji: '🧘',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-900/40 via-teal-900/30 to-zinc-950/20',
    description: '목·어깨·골반에 뭉친 근육 긴장을 풀고 신체 혈류를 원활히 순환시키는 미션',
  },
  {
    id: 'mindful',
    label: '마음 챙김 & 감각 깨우기',
    subLabel: 'Mindful Senses',
    emoji: '🌿',
    color: 'text-teal-300',
    badgeBg: 'bg-teal-500/20 text-teal-200 border-teal-500/30',
    borderColor: 'border-teal-500/30',
    gradient: 'from-teal-900/40 via-cyan-900/30 to-zinc-950/20',
    description: '과부하된 뇌를 식히고 지금 이 순간의 오감에 온전히 접속하는 감각 정화 미션',
  },
  {
    id: 'digital',
    label: '디지털 디톡스 & 쉼',
    subLabel: 'Digital Detox & Rest',
    emoji: '🌙',
    color: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
    borderColor: 'border-indigo-500/30',
    gradient: 'from-indigo-900/40 via-purple-900/30 to-emerald-950/20',
    description: '스마트폰과 블루라이트에서 벗어나 시신경과 뇌파를 알파파로 이끄는 침묵 휴식',
  },
  {
    id: 'nature',
    label: '자연 교감 & 그라운딩',
    subLabel: 'Nature Grounding',
    emoji: '🌲',
    color: 'text-lime-300',
    badgeBg: 'bg-lime-500/20 text-lime-200 border-lime-500/30',
    borderColor: 'border-lime-500/30',
    gradient: 'from-lime-900/40 via-emerald-900/30 to-zinc-950/20',
    description: '햇살, 흙, 바람, 식물과 교감하며 지표면의 음이온 전하로 신체를 안정화하는 접지 미션',
  },
  {
    id: 'compassion',
    label: '감정 정화 & 자기 자비',
    subLabel: 'Self-Compassion & Cleanse',
    emoji: '💖',
    color: 'text-rose-300',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    borderColor: 'border-rose-500/30',
    gradient: 'from-rose-900/40 via-pink-900/30 to-zinc-950/20',
    description: '자책감과 완벽주의를 내려놓고 내면의 아이에게 무조건적 지지와 다정함을 건네는 미션',
  },
  {
    id: 'breath',
    label: '호흡 조율 & 에너지 충전',
    subLabel: 'Pranic Breath & Vitality',
    emoji: '✨',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-900/40 via-orange-900/30 to-emerald-950/20',
    description: '단전 호흡과 리드미컬한 프라나 기식으로 흩어진 오라 파장을 정렬하고 생기를 채우는 미션',
  },
];

export type MissionCategoryId = MissionCategory['id'];

export const HealingMissionSchema = z.object({
  missionTitle: z.string().describe("힐링미션의 명확하고 매력적인 제목 (예: '3분 흉곽 확장 & 날개뼈 롤링 스트레칭', '창밖 먼 하늘 응시하며 10회 복식호흡')"),
  missionSubtitle: z.string().describe("이 미션이 선사하는 핵심 치유 목적 한 줄 요약 (예: '구부정한 흉곽을 열어 뇌로 가는 산소 공급량을 즉각 회복하기')"),
  emoji: z.string().describe("이 미션을 가장 잘 나타내는 상징 이모지 1개 (예: 🧘, 🌿, 🌙, 🌲, 💖, ✨)"),
  durationText: z.string().describe("미션 실천 권장 소요 시간 (예: '3분', '5분', '10분')"),
  actionSteps: z.array(z.string()).describe("누구나 즉시 따라할 수 있는 구체적인 3~4단계 실천 가이드"),
  wellnessEffect: z.string().describe("이 미션이 신체 근육, 신경계, 생체 오라 에너지에 미치는 구체적 효능 (2~3문장, 약 100~140자)"),
  mindfulTip: z.string().describe("미션을 수행하는 동안 마음에 품을 마인드풀 조언 (1~2문장, 30~60자)"),
  affirmation: z.string().describe("미션 완료 후 스스로에게 들려줄 다정한 치유 확언 (1문장, 20~40자)"),
  auraEnergyKeyword: z.string().describe("이 미션으로 활성화되는 오라 생체 에너지 키워드 (예: '차크라 안정의 에메랄드', '부드러운 이완의 바이올렛')"),
});

export type HealingMission = z.infer<typeof HealingMissionSchema> & {
  id?: string;
  category: MissionCategoryId;
  categoryLabel?: string;
  createdAt?: string | number;
  completed?: boolean;
  completedAt?: string | number;
  userInput?: string;
};

export const DEFAULT_HEALING_MISSIONS: Record<MissionCategoryId, HealingMission[]> = {
  body: [
    {
      missionTitle: "3단 승모근 롤링 & 흉곽 오픈 스트레칭",
      missionSubtitle: "어깨와 목덜미의 만성 긴장을 풀고 척추 정렬을 회복하는 리셋",
      emoji: "🧘",
      durationText: "3분",
      category: "body",
      categoryLabel: "신체 이완 & 스트레칭",
      actionSteps: [
        "양 어깨를 귀 끝까지 바짝 끌어올렸다가 숨을 '하-' 내쉬며 툭 떨어뜨립니다. (5회 반복)",
        "양손을 깍지 껴 머리 뒤를 받치고, 팔꿈치를 활짝 열며 가슴을 천장 쪽으로 부드럽게 젖힙니다.",
        "목덜미에 힘을 빼고 천천히 턱 끝으로 허공에 완만한 원을 그리며 3바퀴 회전합니다."
      ],
      wellnessEffect: "승모근과 견갑골 주변 혈류를 즉각 개선하고 뇌로 공급되는 혈류량을 증가시켜 두통과 뻐근함을 시원하게 씻어냅니다.",
      mindfulTip: "스트레칭할 때 억지로 늘리지 말고, 몸이 허용하는 기분 좋은 한계선에서 편안히 호흡하세요.",
      affirmation: "내 몸은 긴장을 털어내고 매 순간 가볍고 유연하게 숨 쉽니다.",
      auraEnergyKeyword: "척추 순환의 에메랄드 그린",
      completed: false,
    },
  ],
  mindful: [
    {
      missionTitle: "5-4-3-2-1 오감 그라운딩 리추얼",
      missionSubtitle: "머릿속 복잡한 생각을 멈추고 지금 이 순간의 생생한 현실 감각으로 복귀하기",
      emoji: "🌿",
      durationText: "3분",
      category: "mindful",
      categoryLabel: "마음 챙김 & 감각 깨우기",
      actionSteps: [
        "눈에 보이는 사물 5가지를 마음속으로 조용히 읊어봅니다. (예: 찻잔의 무늬, 나무 책상의 결)",
        "손끝에 닿는 촉감 4가지를 느껴봅니다. (예: 옷감의 부드러움, 의자의 단단함)",
        "귀에 들리는 소리 3가지에 집중합니다. (예: 시계 초침 소리, 바람 소리)",
        "코로 맡아지는 냄새 2가지와 입안의 감각 1가지를 의식하며 깊은 숨을 들이쉽니다."
      ],
      wellnessEffect: "과도하게 활성화된 편도체(불안 중추)를 진정시키고 전두엽을 깨워 불안과 잡념의 연결고리를 즉시 끊어냅니다.",
      mindfulTip: "판단이나 평가 없이, 그저 어린아이의 호기심 어린 눈으로 감각을 바라보세요.",
      affirmation: "나는 지금 이 순간, 가장 안전하고 평온한 현실 속에 존재합니다.",
      auraEnergyKeyword: "현존의 맑은 딥 아쿠아",
      completed: false,
    },
  ],
  digital: [
    {
      missionTitle: "10분 스크린 오프 & 침묵의 티 타임",
      missionSubtitle: "스마트폰을 시야 밖으로 치우고 따뜻한 온기에 오롯이 머무는 디지털 해독",
      emoji: "🌙",
      durationText: "10분",
      category: "digital",
      categoryLabel: "디지털 디톡스 & 쉼",
      actionSteps: [
        "스마트폰 화면을 뒤집어 다른 방이나 가방 속에 넣고 알림을 무음으로 전환합니다.",
        "따뜻한 물이나 허브차 한 잔을 두 손으로 감싸 쥐고 손바닥으로 퍼지는 온기를 음미합니다.",
        "벽이나 창밖을 멍하니 바라보며 아무것도 '생산'하지 않는 10분의 온전한 무위(無爲)를 즐깁니다."
      ],
      wellnessEffect: "도파민 과잉 자극과 시각 피로를 중단시키고 부교감 신경계를 활성화하여 심박수를 차분하게 안정시킵니다.",
      mindfulTip: "스마트폰을 보지 않아도 아무런 문제가 일어나지 않는다는 자유로움을 온몸으로 느껴보세요.",
      affirmation: "자극을 멈추고 온전히 쉬어갈 때, 나의 내면은 더욱 깊고 단단해집니다.",
      auraEnergyKeyword: "신경 안정의 딥 바이올렛",
      completed: false,
    },
  ],
  nature: [
    {
      missionTitle: "창문 열고 5분 햇살 광합성 & 바람 샤워",
      missionSubtitle: "자연의 빛과 공기를 들이마셔 생체 리듬과 면역 에너지를 일깨우기",
      emoji: "🌲",
      durationText: "5분",
      category: "nature",
      categoryLabel: "자연 교감 & 그라운딩",
      actionSteps: [
        "창문을 활짝 열고 맑은 바깥바람이 실내로 흘러들어오게 합니다.",
        "창가나 베란다에 서서 햇살이 얼굴과 손등에 닿는 따스함을 온몸으로 수용합니다.",
        "자연의 바람이 나의 묵은 피로를 쓸어가고, 맑은 산소가 온몸 세포를 채운다고 시각화하며 10번 호흡합니다."
      ],
      wellnessEffect: "세로토닌 분비를 촉진하여 우울감과 피로를 낮추고, 자연 음이온이 체내 활성산소를 중화시켜 활력을 줍니다.",
      mindfulTip: "빛을 쬘 때 눈을 감고 미간 사이로 스며드는 온화한 황금빛 파동을 느껴보세요.",
      affirmation: "대자연의 풍요로운 생명 에너지가 나의 모든 세포를 건강하게 채웁니다.",
      auraEnergyKeyword: "광합성 활력의 골든 앰버",
      completed: false,
    },
  ],
  compassion: [
    {
      missionTitle: "나를 향한 손 얹기 & 자비의 확언 건네기",
      missionSubtitle: "고단했던 나를 안아주고 가슴 속 긴장을 따뜻한 온기로 녹여내는 위로",
      emoji: "💖",
      durationText: "3분",
      category: "compassion",
      categoryLabel: "감정 정화 & 자기 자비",
      actionSteps: [
        "한 손은 가슴 중앙(심장 차크라)에, 다른 한 손은 아랫배에 얹고 손바닥의 온기를 느낍니다.",
        "오늘 하루 잘 버텨준 나 자신에게 '오늘도 정말 애썼어. 완벽하지 않아도 너는 충분히 소중해'라고 나직이 속삭입니다.",
        "가슴 속 뭉쳐있던 답답한 감정이 따뜻한 눈물이나 한숨과 함께 밖으로 흘러나가도록 허용합니다."
      ],
      wellnessEffect: "옥시토신(치유 호르몬) 분비를 유도하여 자기 비판과 죄책감을 가라앉히고 심장 박동의 변이도(HRV)를 조화롭게 만듭니다.",
      mindfulTip: "가장 사랑하는 단짝 친구에게 건네듯, 세상에서 가장 다정한 목소리로 나를 불러주세요.",
      affirmation: "나는 내 모습 그대로 온전하며, 나 자신을 무한한 사랑과 신뢰로 품어줍니다.",
      auraEnergyKeyword: "심장 치유의 로즈 쿼츠 핑크",
      completed: false,
    },
  ],
  breath: [
    {
      missionTitle: "4-7-8 골든 릴랙스 수면·이완 호흡",
      missionSubtitle: "부교감 신경을 즉각 켜고 심신을 고요한 우주의 요람으로 이끄는 호흡법",
      emoji: "✨",
      durationText: "5분",
      category: "breath",
      categoryLabel: "호흡 조율 & 에너지 충전",
      actionSteps: [
        "입으로 '후-' 하고 숨을 끝까지 완전히 내보냅니다.",
        "코로 4초 동안 천천히 맑은 생명력을 들이마십니다.",
        "숨을 멈추고 7초 동안 온몸에 에너지가 고루 퍼지는 것을 머금습니다.",
        "입을 오므려 8초 동안 길고 부드럽게 모든 탁기를 비워냅니다. (4세트 반복)"
      ],
      wellnessEffect: "미주신경(Vagus Nerve)을 자극하여 투쟁-도피 모드를 즉시 해제하고 혈압과 스트레스 호르몬 수치를 안정적으로 낮춥니다.",
      mindfulTip: "숨을 내쉴 때마다 어깨와 턱, 미간에 남아있던 힘이 물처럼 사르르 빠져나간다고 상상하세요.",
      affirmation: "숨을 들이쉴 때마다 평화가 채워지고, 내쉴 때마다 모든 걱정이 사라집니다.",
      auraEnergyKeyword: "프라나 충전의 일렉트릭 시안",
      completed: false,
    },
  ],
};

const LOCAL_STORAGE_KEY_PREFIX = 'aura_healing_missions_';

export function getPersonalizedMissionFallback(note = '', category: MissionCategoryId = 'body'): HealingMission {
  const candidates = DEFAULT_HEALING_MISSIONS[category] || DEFAULT_HEALING_MISSIONS.body;
  const base = candidates[0];
  const catMeta = MISSION_CATEGORIES.find((c) => c.id === category) || MISSION_CATEGORIES[0];

  return {
    ...base,
    id: `mission_local_${Date.now()}`,
    category,
    categoryLabel: catMeta.label,
    createdAt: Date.now(),
    userInput: note.trim() || undefined,
    completed: false,
  };
}

export async function generateHealingMissionRecommendation(
  uid: string,
  category: MissionCategoryId,
  note = '',
): Promise<HealingMission> {
  const catMeta = MISSION_CATEGORIES.find((c) => c.id === category) || MISSION_CATEGORIES[0];

  const systemInstruction = `당신은 PRISM의 최고 존엄 웰니스 코치 'AURA(아우라)'입니다.
사용자의 지친 신체 상태, 신경계 긴장도, 생체 오라 에너지, 그리고 현재 컨디션에 딱 맞춘 '오늘의 맞춤 힐링미션(Healing Micro-Mission)'을 정성스럽게 처방해주세요.

[힐링미션 원칙]
1. 누구나 당장 방 안에서 3~10분 안에 쉽게 실천할 수 있는 초간단 마이크로 힐링 리추얼이어야 합니다.
2. 장황하거나 부담스러운 과제가 아닌, 즉시 기분이 환기되고 몸과 마음에 온기가 도는 친절한 실천 단계여야 합니다.
3. 단계별 실천 가이드(actionSteps)는 번호별로 3~4단계로 읽기 쉽게 구성해주세요.
4. 사용자가 호소한 컨디션/증상 메모(${note || '전반적인 심신 회복'})가 있다면, 그 부분을 짚어서 맞춤형 효과를 설명해주세요.

[반환 필드 가이드]
- missionTitle: 매력적이고 직관적인 미션 제목 (예: '3분 흉곽 확장 & 날개뼈 롤링 스트레칭')
- missionSubtitle: 핵심 목적 한 줄 (예: '굳어있던 흉곽을 열고 뇌로 가는 산소 공급량을 회복하기')
- emoji: 상징 이모지 1개
- durationText: 소요 시간 (예: '3분', '5분', '10분')
- actionSteps: 3~4단계 구체적 실천법 (배열)
- wellnessEffect: 신경계/신체 및 오라 에너지 치유 효능 (2~3문장, 약 100~140자)
- mindfulTip: 마인드풀 조언 (1~2문장)
- affirmation: 미션 후 마음에 새길 치유 확언 (1문장)
- auraEnergyKeyword: 오라 생체 에너지 키워드 (예: '차크라 안정의 에메랄드 그린')`;

  try {
    const aiResult = await invokeLLMStructured({
      schema: HealingMissionSchema,
      messages: [
        {
          role: 'system',
          content: systemInstruction,
        },
        {
          role: 'user',
          content: `선택 미션 카테고리: ${catMeta.label} (${catMeta.subLabel})\n사용자 컨디션 메모: ${note || '전반적인 긴장 완화 및 밸런스 회복'}\n\n위 요청에 맞춘 오늘의 맞춤 힐링미션을 상세히 처방해주세요.`,
        },
      ],
    });

    const mission: HealingMission = {
      ...aiResult,
      id: `mission_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      category,
      categoryLabel: catMeta.label,
      createdAt: Date.now(),
      completed: false,
      userInput: note.trim() || undefined,
    };

    // Save to Firestore & LocalStorage
    saveMissionToLocal(uid, mission);
    void saveMissionToFirestore(uid, mission);

    // Omni Sync
    recordPrismFeature({
      app: 'heal',
      appName: 'AURA',
      featureName: '오늘의 힐링미션',
      summary: `${mission.emoji} ${mission.missionTitle} - ${mission.missionSubtitle}`,
      details: {
        category: mission.category,
        duration: mission.durationText,
      },
    });

    return mission;
  } catch (error) {
    console.warn('[HealingMission] AI generation failed, using rich fallback:', error);
    const fallback = getPersonalizedMissionFallback(note, category);
    saveMissionToLocal(uid, fallback);
    return fallback;
  }
}

function saveMissionToLocal(uid: string, mission: HealingMission) {
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${uid || 'guest'}`;
    const raw = localStorage.getItem(key);
    const existing: HealingMission[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((item) => item.id !== mission.id);
    const updated = [mission, ...filtered].slice(0, 30);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('[HealingMission] Local save failed:', e);
  }
}

async function saveMissionToFirestore(uid: string, mission: HealingMission) {
  if (!uid || uid === 'guest') return;
  try {
    await addDoc(collection(db, 'aura_healing_missions', uid, 'missions'), {
      ...mission,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('[HealingMission] Firestore save failed:', e);
  }
}

export async function toggleMissionCompleted(uid: string, missionId: string, currentCompleted: boolean): Promise<boolean> {
  const nextCompleted = !currentCompleted;
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${uid || 'guest'}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const existing: HealingMission[] = JSON.parse(raw);
      const updated = existing.map((m) =>
        m.id === missionId ? { ...m, completed: nextCompleted, completedAt: nextCompleted ? Date.now() : undefined } : m
      );
      localStorage.setItem(key, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('[HealingMission] Local toggle failed:', e);
  }
  return nextCompleted;
}

export async function loadMissionHistory(uid: string): Promise<HealingMission[]> {
  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${uid || 'guest'}`;
  let localList: HealingMission[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      localList = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[HealingMission] Failed to read local storage:', e);
  }

  if (!uid || uid === 'guest') {
    return localList;
  }

  try {
    const q = query(
      collection(db, 'aura_healing_missions', uid, 'missions'),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    const remoteList: HealingMission[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...(data as HealingMission),
        id: docSnap.id,
        createdAt: (data.createdAt as { toMillis?: () => number })?.toMillis?.() || Date.now(),
      };
    });

    if (remoteList.length > 0) {
      const map = new Map<string, HealingMission>();
      for (const item of [...remoteList, ...localList]) {
        const key = item.id || `${item.missionTitle}_${item.createdAt}`;
        if (!map.has(key)) map.set(key, item);
      }
      const merged = Array.from(map.values()).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, 30);
      try {
        localStorage.setItem(localKey, JSON.stringify(merged));
      } catch {}
      return merged;
    }
  } catch (error) {
    console.warn('[HealingMission] Firestore history fetch failed, using local:', error);
  }

  return localList;
}
