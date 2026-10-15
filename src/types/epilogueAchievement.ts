import type { EpilogueDiaryEntry } from '@/components/epilogue/EpilogueDiaryView';
import { getTodayDateKey } from '@/lib/dailyCache';

export interface EpilogueAchievementStats {
  totalDiaries: number;
  streakDays: number;
  totalGratitudes: number;
  topMood: string;
  topMoodEmoji: string;
  moodCounts: Record<string, number>;
  activeUniversesCount: number;
  soulEvolutionLevel: string;
  todayQuote: string;
  todayDateKey: string;
  userName: string;
}

export interface EpilogueCommunityPost {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  dateKey: string;
  streakDays: number;
  totalDiaries: number;
  totalGratitudes: number;
  topMood: string;
  topMoodEmoji: string;
  soulEvolutionLevel: string;
  mindDiarySnippet: string;
  imageData?: string;
  cheersCount: number;
  sharedAt: string;
}

/**
 * Calculates achievement metrics from diary entries and user profile
 */
export function calculateEpilogueAchievementStats(
  entries: EpilogueDiaryEntry[],
  userName = '빛나는 여행자',
  soulLevel = 'Mastery Level IX · 초월적 황금 의식'
): EpilogueAchievementStats {
  const totalDiaries = entries.length;
  const todayKey = getTodayDateKey();

  // Calculate consecutive streak
  const dateKeys = Array.from(new Set(entries.map((e) => e.dateKey))).sort().reverse();
  let streak = 0;
  
  if (dateKeys.length > 0) {
    const today = new Date();
    // Check if recorded today or yesterday
    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    if (dateKeys.includes(todayStr) || dateKeys.includes(yesterday)) {
      streak = 1;
      let checkDate = new Date(dateKeys.includes(todayStr) ? todayStr : yesterday);
      for (let i = 1; i < 365; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const prevStr = checkDate.toISOString().slice(0, 10);
        if (dateKeys.includes(prevStr)) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // Ensure minimum streak of 1 if user has written today
  if (streak === 0 && totalDiaries > 0) {
    streak = 1;
  }

  // Gratitude count
  let totalGratitudes = 0;
  const moodCounts: Record<string, number> = {};

  entries.forEach((e) => {
    if (Array.isArray(e.gratitudes)) {
      totalGratitudes += e.gratitudes.filter((g) => g && g.trim()).length;
    }
    if (e.mood) {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    }
  });

  // Top mood calculation
  let topMood = '평온함';
  let maxMoodCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      topMood = mood;
    }
  });

  const MOOD_EMOJI_MAP: Record<string, string> = {
    '평온함': '😌',
    '성취감': '✨',
    '비움과 자유': '🌊',
    '따뜻한 감사': '💖',
    '포근한 휴식': '🌙',
    '새로운 영감': '💡',
  };

  const topMoodEmoji = MOOD_EMOJI_MAP[topMood] || '✨';

  // Today's entry or latest entry
  const latestEntry = entries.find((e) => e.dateKey === todayKey) || entries[0];
  const activeUniversesCount = latestEntry?.cosmicFootprint
    ? Object.values(latestEntry.cosmicFootprint).filter(Boolean).length
    : Math.min(5, Math.max(2, totalDiaries));

  const todayQuote =
    latestEntry?.mindDiary?.slice(0, 95) ||
    latestEntry?.reflection?.slice(0, 95) ||
    latestEntry?.gratitudes?.filter(Boolean)[0] ||
    '오늘 하루의 사유와 성찰이 빛나는 황금빛 궤적으로 기록되었습니다.';

  return {
    totalDiaries,
    streakDays: Math.max(1, streak),
    totalGratitudes: Math.max(totalGratitudes, totalDiaries * 3 || 3),
    topMood,
    topMoodEmoji,
    moodCounts,
    activeUniversesCount,
    soulEvolutionLevel: soulLevel,
    todayQuote,
    todayDateKey: todayKey,
    userName,
  };
}
