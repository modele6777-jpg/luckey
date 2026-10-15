import { getTodayDateKey } from '@/lib/dailyCache';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { auth, db, collection, addDoc, serverTimestamp } from '@/lib/firebase';

export interface BluebirdStreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
  completedDates: string[]; // List of unique completed date keys
  journeyDay: number; // Current day in 40-day cycle (1-40)
  completedCycles: number; // How many 40-day journeys completed
  totalCompletedDays: number;
  journeyStartDate: string;
  lastStreakCheckDate?: string;
}

export interface BluebirdDailyMissionItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'chant' | 'cleanse' | 'breathe' | 'compassion' | 'blessing' | 'custom';
  emoji: string;
  points: number; // FPS points
  duration: string;
  completed: boolean;
  actionTip: string;
  autoDetectType?: 'chant' | 'cleanse' | 'binaural';
}

export interface JourneyMilestone {
  day: number;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  description: string;
  rewardPoints: number;
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    day: 1,
    title: '첫 발걸음의 평화',
    subtitle: 'First Step of Sanctuary',
    badgeEmoji: '🕊️',
    description: '40일 잠재의식 치유 여정에 첫 발을 내딛었습니다.',
    rewardPoints: 50,
  },
  {
    day: 7,
    title: '정화의 씨앗',
    subtitle: 'Seed of Pure Zero',
    badgeEmoji: '🌱',
    description: '1주일 연속 정화를 달성하여 마음에 평화의 싹을 틔웠습니다.',
    rewardPoints: 100,
  },
  {
    day: 14,
    title: '고요한 호수의 평정',
    subtitle: 'Calm Lake Horizon',
    badgeEmoji: '🌊',
    description: '2주 연속 치유로 감정의 동요가 맑은 수면처럼 가라앉았습니다.',
    rewardPoints: 150,
  },
  {
    day: 21,
    title: '신경가소성 전환',
    subtitle: '21-Day Habit Shift',
    badgeEmoji: '🧠',
    description: '21일의 기적! 뇌 신경망과 무의식이 평화의 자동 반응을 형성했습니다.',
    rewardPoints: 200,
  },
  {
    day: 30,
    title: '우니히피리와의 합일',
    subtitle: 'Inner Child Harmony',
    badgeEmoji: '💖',
    description: '내면 아이 우니히피리와 깊은 신뢰와 사랑으로 하나가 되었습니다.',
    rewardPoints: 300,
  },
  {
    day: 40,
    title: '40일 성소 마스터 완성',
    subtitle: 'Sanctuary Master Rebirth',
    badgeEmoji: '👑',
    description: '40일 치유 여정을 완주하여 영혼의 온전한 자유와 거듭남을 성취했습니다!',
    rewardPoints: 500,
  },
];

export const DAILY_40_QUOTES: Record<number, { quote: string; author: string; focus: string }> = {
  1: { quote: '모든 치유의 시작은 내면의 소리를 판단 없이 들어주는 것입니다.', author: '모르나 시메오나', focus: '수용과 시작' },
  2: { quote: '기억은 끊임없이 반복되지만, 당신에게는 그것을 놓아줄 힘이 있습니다.', author: '휴 렌 박사', focus: '기억 놓아주기' },
  3: { quote: '미안합니다라는 말은 자책이 아니라 영혼을 향한 정중한 노크입니다.', author: '호오포노포노 지혜', focus: '내면 인정' },
  4: { quote: '우니히피리는 당신의 따뜻한 시선과 한마디를 기다려왔습니다.', author: '카마일레 라파엘로비치', focus: '내면아이 교감' },
  5: { quote: '마음이 고요해지면 세상의 모든 소음은 배경음악이 됩니다.', author: '파랑새의 성소', focus: '내면 평정' },
  6: { quote: '과거에 얽힌 응어리를 지우는 순간, 현재의 생명력이 되살아납니다.', author: '모르나 시메오나', focus: '현재성 회복' },
  7: { quote: '7일간의 정화로 심어진 작은 평화의 씨앗이 단단히 뿌리를 내립니다.', author: '1주 마일스톤', focus: '씨앗의 정착' },
  8: { quote: '용서는 타인을 위한 것이 아닌, 나 자신을 감옥에서 풀어주는 열쇠입니다.', author: '치유의 격언', focus: '해방과 자유' },
  9: { quote: '감사합니다는 마음의 진동수를 가장 순수한 영점으로 끌어올립니다.', author: '휴 렌 박사', focus: '감사의 파동' },
  10: { quote: '통제하려는 손을 놓을 때, 우주가 당신을 위해 일하기 시작합니다.', author: '제로 리미츠', focus: '통제 내려놓기' },
  11: { quote: '사랑합니다는 우주에서 가장 강력한 지우개이자 치유의 빛입니다.', author: '호오포노포노 지혜', focus: '무조건적 사랑' },
  12: { quote: '상처 입었던 기억 속에 머물지 말고, 그 기억을 정화의 제단에 바치세요.', author: '모르나 시메오나', focus: '기억의 승화' },
  13: { quote: '숨을 들이쉬며 생기를 채우고, 내쉬며 묵은 무거움을 비워냅니다.', author: '프라나 호흡 지혜', focus: '호흡 정화' },
  14: { quote: '2주의 도정으로 당신의 내면은 맑고 잔잔한 호수를 닮아가고 있습니다.', author: '2주 마일스톤', focus: '고요한 수면' },
  15: { quote: '우리는 매 순간 무의식의 기억을 재생할 것인가, 영감을 따를 것인가를 선택합니다.', author: '휴 렌 박사', focus: '영감의 수용' },
  16: { quote: '불완전한 나를 따뜻하게 껴안을 때 비로소 진정한 온전함이 찾아옵니다.', author: '자기 자비 지혜', focus: '자기 사랑' },
  17: { quote: '외부 상황을 바꾸려 애쓰기보다 내 안의 투사를 먼저 닦아내세요.', author: '내적 책임', focus: '100% 책임' },
  18: { quote: '비워진 마음에만 신성한 은혜의 영감이 머물 자리가 생깁니다.', author: '모르나 시메오나', focus: '공(空)의 공간' },
  19: { quote: '작은 정화의 실천이 모여 영혼의 웅장한 강물을 이룹니다.', author: '파랑새의 성소', focus: '꾸준한 축적' },
  20: { quote: '스스로를 정죄하던 오랜 습관에서 벗어나 자비의 옷을 입으세요.', author: '자비의 회복', focus: '자비와 온기' },
  21: { quote: '21일의 신경가소성 전환! 뇌와 무의식이 새로운 평화의 길을 기억합니다.', author: '21일 마일스톤', focus: '신경망 재배선' },
  22: { quote: '내면 아이에게 가장 필요한 것은 결과가 아닌 당신의 다정한 눈맞춤입니다.', author: '우니히피리 대화', focus: '애착 치유' },
  23: { quote: '마음의 짐을 우주에 가볍게 맡기세요. 당신 혼자 짊어질 필요가 없습니다.', author: '신탁의 평화', focus: '맡김의 지혜' },
  24: { quote: '평화는 고요한 곳에 머무는 것이 아니라, 소란 속에서도 중심을 지키는 것입니다.', author: '내면의 닻', focus: '중심 잡기' },
  25: { quote: '어제의 후회와 내일의 염려를 내려놓고 오늘 이 순간에 현존하세요.', author: '현존의 힘', focus: '현재의 닻' },
  26: { quote: '정화된 영혼은 거울과 같아서 세상의 빛을 왜곡 없이 비추어 냅니다.', author: '모르나 시메오나', focus: '투명한 영혼' },
  27: { quote: '상대의 분노에 반응하지 않고 내면의 평화로 화답할 수 있는 단단함이 자랍니다.', author: '평화의 방패', focus: '비반응성' },
  28: { quote: '4주의 정화는 당신의 오라 장막을 맑고 투명한 청청색으로 물들였습니다.', author: '오라 정화', focus: '생체장 정렬' },
  29: { quote: '내 안의 신성을 인정하는 순간, 모든 두려움은 환영처럼 흩어집니다.', author: '신성의 자각', focus: '두려움 해소' },
  30: { quote: '우니히피리와의 온전한 합일! 내면아이와 손을 잡고 세상과 조화를 이룹니다.', author: '30일 마일스톤', focus: '내면아이 합일' },
  31: { quote: '정상의 문턱에 섰습니다. 당신이 걸어온 30일의 발자국이 눈부십니다.', author: '여정의 완성선', focus: '용기와 인내' },
  32: { quote: '평화는 찾는 것이 아니라, 이미 내면에 깃들어 있던 영점을 발견하는 것입니다.', author: '휴 렌 박사', focus: '영점 회귀' },
  33: { quote: '마음속 모든 판단을 내려놓으면 모든 순간이 거룩한 기적으로 다가옵니다.', author: '비판단', focus: '기적의 시선' },
  34: { quote: '당신의 정화 파동은 당신뿐 아니라 연결된 모든 이들에게 은은히 전달됩니다.', author: '상호연결성', focus: '파동의 확산' },
  35: { quote: '오래된 상처의 흉터는 이제 가장 아름다운 지혜의 별자리로 빛납니다.', author: '상처의 승화', focus: '황금빛 회복' },
  36: { quote: '어떤 폭풍우 속에서도 흔들리지 않는 파랑새의 영원한 쉼터가 내면에 완성되었습니다.', author: '성소 완성', focus: '영원의 안식' },
  37: { quote: '나를 사랑하는 힘이 세상을 치유하는 가장 따뜻하고 순수한 원동력입니다.', author: '자기 사랑 완성', focus: '사랑의 발원' },
  38: { quote: '기적은 거창한 것이 아니라 오늘 하루 마음에 평화를 선택하는 그 결단입니다.', author: '매일의 기적', focus: '평화의 선택' },
  39: { quote: '내일이면 40일의 찬란한 결실을 맺습니다. 스스로를 깊이 축복하고 안아주세요.', author: '결실의 전야', focus: '자축과 축복' },
  40: { quote: '축하합니다! 40일간의 기적 같은 치유 여정을 완주하셨습니다. 평화가 당신과 영원히 함께합니다.', author: '40일 완주 성취', focus: '완전한 거듭남' },
};

export const DEFAULT_BLUEBIRD_DAILY_MISSIONS: BluebirdDailyMissionItem[] = [
  {
    id: 'bb_m_chant',
    title: '4대 정화 어구 소리내어 읊기',
    subtitle: '미안합니다, 용서하세요, 감사합니다, 사랑합니다 각 4회 이상 암송',
    category: 'chant',
    emoji: '📿',
    points: 20,
    duration: '2분',
    completed: false,
    actionTip: '파랑새 대시보드의 네 가지 정화 카드를 클릭하거나 소리 내어 마음을 울려보세요.',
    autoDetectType: 'chant',
  },
  {
    id: 'bb_m_cleanse',
    title: '우니히피리 기억 비우기 & 정화',
    subtitle: '오늘 비워내고 싶은 생각/감정 1개 입력 및 처방 의식 완료',
    category: 'cleanse',
    emoji: '🕊️',
    points: 25,
    duration: '3분',
    completed: false,
    actionTip: '기억 소거 소망란에 마음의 응어리를 적고 정화 의식을 실행하세요.',
    autoDetectType: 'cleanse',
  },
  {
    id: 'bb_m_breathe',
    title: '1분 평화 호흡 & 바이노럴 비트',
    subtitle: '파랑새 힐링 주파수를 켜고 1분간 깊은 복식호흡으로 이완',
    category: 'breathe',
    emoji: '🌬️',
    points: 20,
    duration: '1분',
    completed: false,
    actionTip: '좌측 상단의 파랑새 바이노럴 비트 아이콘을 켜고 차분하게 숨을 고르세요.',
    autoDetectType: 'binaural',
  },
  {
    id: 'bb_m_compassion',
    title: '나를 향한 무조건적 지지와 자비',
    subtitle: '오늘 고단했던 나 자신에게 자책 대신 따뜻한 포용의 말 건네기',
    category: 'compassion',
    emoji: '💖',
    points: 20,
    duration: '2분',
    completed: false,
    actionTip: '가슴에 손을 얹고 "오늘도 정말 애썼어, 너는 충분히 온전해"라고 들려주세요.',
  },
  {
    id: 'bb_m_blessing',
    title: '마음 쓰이던 인연에 평화의 빛 보내기',
    subtitle: '마찰이나 서운함이 있던 사람의 행복과 자유를 마음속으로 빌어주기',
    category: 'blessing',
    emoji: '🌟',
    points: 15,
    duration: '1분',
    completed: false,
    actionTip: '상대를 떠올리며 "나의 평화가 당신에게 전해집니다"라고 축복을 보냅니다.',
  },
];

const STREAK_KEY_PREFIX = 'bluebird_40day_streak_';
const MISSIONS_KEY_PREFIX = 'bluebird_daily_missions_';

export function getYesterdayDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadBluebirdStreak(uid?: string): BluebirdStreakData {
  const userKey = uid && uid !== 'guest' ? uid : 'guest';
  const storageKey = `${STREAK_KEY_PREFIX}${userKey}`;
  const todayKey = getTodayDateKey();
  const yesterdayKey = getYesterdayDateKey();

  const defaultStreak: BluebirdStreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: '',
    completedDates: [],
    journeyDay: 1,
    completedCycles: 0,
    totalCompletedDays: 0,
    journeyStartDate: todayKey,
    lastStreakCheckDate: todayKey,
  };

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultStreak;

    const data: BluebirdStreakData = JSON.parse(raw);
    
    // Check if streak was broken (last completed is older than yesterday and not today)
    if (data.lastCompletedDate) {
      if (data.lastCompletedDate !== todayKey && data.lastCompletedDate !== yesterdayKey) {
        // Streak broken
        data.currentStreak = 0;
      }
    }

    // Ensure journeyDay is in sync (1 to 40)
    const effectiveDays = data.completedDates?.length || 0;
    data.totalCompletedDays = effectiveDays;
    data.journeyDay = ((effectiveDays) % 40) + 1;
    data.completedCycles = Math.floor(effectiveDays / 40);

    return data;
  } catch (e) {
    console.warn('[BluebirdStreak] Failed loading streak:', e);
    return defaultStreak;
  }
}

export function saveBluebirdStreak(streak: BluebirdStreakData, uid?: string): void {
  const userKey = uid && uid !== 'guest' ? uid : 'guest';
  const storageKey = `${STREAK_KEY_PREFIX}${userKey}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(streak));
  } catch (e) {
    console.warn('[BluebirdStreak] Failed saving streak:', e);
  }
}

export function loadTodayBluebirdMissions(todayKey: string, uid?: string): BluebirdDailyMissionItem[] {
  const userKey = uid && uid !== 'guest' ? uid : 'guest';
  const storageKey = `${MISSIONS_KEY_PREFIX}${userKey}_${todayKey}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[BluebirdStreak] Failed loading missions:', e);
  }

  // Return fresh defaults with cloned objects
  return DEFAULT_BLUEBIRD_DAILY_MISSIONS.map(m => ({ ...m }));
}

export function saveTodayBluebirdMissions(
  todayKey: string,
  missions: BluebirdDailyMissionItem[],
  uid?: string
): void {
  const userKey = uid && uid !== 'guest' ? uid : 'guest';
  const storageKey = `${MISSIONS_KEY_PREFIX}${userKey}_${todayKey}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(missions));
  } catch (e) {
    console.warn('[BluebirdStreak] Failed saving missions:', e);
  }
}

export interface CompleteSetResult {
  updatedStreak: BluebirdStreakData;
  isNewStreakIncrement: boolean;
  reachedMilestone?: JourneyMilestone;
  is40DayCompleted: boolean;
}

export function completeDailyMissionsForToday(
  currentStreakData: BluebirdStreakData,
  todayKey: string,
  uid?: string
): CompleteSetResult {
  const yesterdayKey = getYesterdayDateKey();
  const alreadyDoneToday = currentStreakData.lastCompletedDate === todayKey;

  if (alreadyDoneToday) {
    return {
      updatedStreak: currentStreakData,
      isNewStreakIncrement: false,
      is40DayCompleted: false,
    };
  }

  // Calculate new streak count
  let newCurrentStreak: number;
  if (currentStreakData.lastCompletedDate === yesterdayKey) {
    newCurrentStreak = currentStreakData.currentStreak + 1;
  } else {
    newCurrentStreak = 1;
  }

  const updatedCompletedDates = Array.from(new Set([...currentStreakData.completedDates, todayKey]));
  const totalCompleted = updatedCompletedDates.length;
  const newLongest = Math.max(currentStreakData.longestStreak, newCurrentStreak);
  const journeyDay = ((totalCompleted - 1) % 40) + 1;
  const completedCycles = Math.floor(totalCompleted / 40);
  const is40DayCompleted = totalCompleted > 0 && totalCompleted % 40 === 0;

  const updatedStreak: BluebirdStreakData = {
    ...currentStreakData,
    currentStreak: newCurrentStreak,
    longestStreak: newLongest,
    lastCompletedDate: todayKey,
    completedDates: updatedCompletedDates,
    totalCompletedDays: totalCompleted,
    journeyDay,
    completedCycles,
    lastStreakCheckDate: todayKey,
  };

  saveBluebirdStreak(updatedStreak, uid);

  // Check if reached milestone
  const reachedMilestone = JOURNEY_MILESTONES.find(m => m.day === journeyDay);

  // Sync to Firestore if signed in
  if (uid && uid !== 'guest') {
    void addDoc(collection(db, 'bluebird_history', uid, 'entries'), {
      type: '40day_streak_progress',
      title: `40일 치유 여정 ${journeyDay}일차 미션 올클리어!`,
      content: `연속 ${newCurrentStreak}일 스트릭 달성 (누적 ${totalCompleted}일 수행)`,
      streakDays: newCurrentStreak,
      journeyDay,
      createdAt: serverTimestamp(),
    }).catch(err => console.warn('[BluebirdStreak] Firestore log error:', err));
  }

  // Record to OmniSync
  recordPrismFeature({
    app: 'bluebird',
    appName: 'BLUEBIRD',
    featureName: '40일 치유 여정 데일리 미션',
    summary: `40일 치유 여정 Day ${journeyDay} 완수 · ${newCurrentStreak}일 연속 스트릭`,
    details: {
      streak: newCurrentStreak,
      journeyDay,
      totalCompletedDays: totalCompleted,
      is40DayCompleted,
      milestone: reachedMilestone?.title || null,
    },
  });

  return {
    updatedStreak,
    isNewStreakIncrement: true,
    reachedMilestone,
    is40DayCompleted,
  };
}
