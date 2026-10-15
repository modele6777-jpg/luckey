import { db, collection, getDocs, addDoc, updateDoc, doc, query, orderBy, limit, serverTimestamp, increment } from '@/lib/firebase';
import type { EpilogueCommunityPost } from '@/types/epilogueAchievement';

const COMMUNITY_LOCAL_KEY = 'luckey_epilogue_community_posts_v1';

const MOCK_INITIAL_COMMUNITY_POSTS: EpilogueCommunityPost[] = [
  {
    id: 'comm-init-1',
    userId: 'traveler-celestial',
    userName: '은하의 방랑자',
    dateKey: '2026-09-24',
    streakDays: 14,
    totalDiaries: 28,
    totalGratitudes: 84,
    topMood: '평온함',
    topMoodEmoji: '😌',
    soulEvolutionLevel: 'Mastery Level IX · 초월적 황금 의식',
    mindDiarySnippet: '오늘 하루 모든 일정을 마치고 조용히 밤하늘을 바라보며 마음에 깊은 쉼표를 찍었습니다.',
    cheersCount: 18,
    sharedAt: '2026-09-24T05:00:00.000Z',
  },
  {
    id: 'comm-init-2',
    userId: 'traveler-aurora',
    userName: '오로라 힐러',
    dateKey: '2026-09-23',
    streakDays: 7,
    totalDiaries: 15,
    totalGratitudes: 45,
    topMood: '따뜻한 감사',
    topMoodEmoji: '💖',
    soulEvolutionLevel: 'Adept Level VII · 은빛 조화 의식',
    mindDiarySnippet: '작은 일에도 감사의 파동을 보냈더니 온종일 가슴이 따뜻해지는 기적을 경험했습니다.',
    cheersCount: 24,
    sharedAt: '2026-09-23T22:30:00.000Z',
  },
  {
    id: 'comm-init-3',
    userId: 'traveler-prism',
    userName: '빛나는 루시',
    dateKey: '2026-09-23',
    streakDays: 21,
    totalDiaries: 42,
    totalGratitudes: 126,
    topMood: '성취감',
    topMoodEmoji: '✨',
    soulEvolutionLevel: 'Mastery Level X · 코스믹 깨어남',
    mindDiarySnippet: '7대 우주 프리즘을 온전히 경험하며 나만의 창작 에너지를 완전히 피워냈습니다.',
    cheersCount: 31,
    sharedAt: '2026-09-23T19:15:00.000Z',
  },
];

export async function fetchCommunityPosts(): Promise<EpilogueCommunityPost[]> {
  let localPosts: EpilogueCommunityPost[] = [];
  try {
    const raw = localStorage.getItem(COMMUNITY_LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localPosts = parsed;
      }
    }
  } catch (e) {
    console.warn('[Community] Failed to parse local posts:', e);
  }

  // Attempt Firestore fetch
  try {
    const q = query(collection(db, 'epilogue_community'), orderBy('sharedAt', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const cloudPosts: EpilogueCommunityPost[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId || 'anonymous',
          userName: d.userName || '빛나는 여행자',
          userPhotoURL: d.userPhotoURL,
          dateKey: d.dateKey || new Date().toISOString().slice(0, 10),
          streakDays: Number(d.streakDays) || 1,
          totalDiaries: Number(d.totalDiaries) || 1,
          totalGratitudes: Number(d.totalGratitudes) || 3,
          topMood: d.topMood || '평온함',
          topMoodEmoji: d.topMoodEmoji || '✨',
          soulEvolutionLevel: d.soulEvolutionLevel || 'Mastery Level IX · 초월적 황금 의식',
          mindDiarySnippet: d.mindDiarySnippet || '',
          imageData: d.imageData,
          cheersCount: Number(d.cheersCount) || 0,
          sharedAt: typeof d.sharedAt === 'string' ? d.sharedAt : new Date().toISOString(),
        };
      });

      // Merge cloud posts with local posts
      const mergedMap = new Map<string, EpilogueCommunityPost>();
      cloudPosts.forEach((p) => mergedMap.set(p.id, p));
      localPosts.forEach((p) => {
        if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      );
      try {
        localStorage.setItem(COMMUNITY_LOCAL_KEY, JSON.stringify(merged));
      } catch (_) {}
      return merged;
    }
  } catch (cloudErr) {
    console.warn('[Community] Cloud fetch skipped or permission issue, using cached/mock:', cloudErr);
  }

  if (localPosts.length === 0) {
    localPosts = MOCK_INITIAL_COMMUNITY_POSTS;
    try {
      localStorage.setItem(COMMUNITY_LOCAL_KEY, JSON.stringify(localPosts));
    } catch (_) {}
  }

  return localPosts;
}

export async function shareAchievementToCommunity(post: EpilogueCommunityPost): Promise<boolean> {
  // 1. Immediately store in local storage (instant feedback)
  try {
    const raw = localStorage.getItem(COMMUNITY_LOCAL_KEY);
    const existing: EpilogueCommunityPost[] = raw ? JSON.parse(raw) : [];
    const updated = [post, ...existing.filter((p) => p.id !== post.id)];
    localStorage.setItem(COMMUNITY_LOCAL_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luckey-community-updated', { detail: updated }));
  } catch (err) {
    console.error('[Community] Local store failed:', err);
  }

  // 2. Try persisting to Firestore if available
  try {
    await addDoc(collection(db, 'epilogue_community'), {
      ...post,
      serverSharedAt: serverTimestamp(),
    });
    return true;
  } catch (cloudErr) {
    console.warn('[Community] Cloud save fallback to local:', cloudErr);
    return true;
  }
}

export async function cheerCommunityPost(postId: string): Promise<number> {
  let updatedCount = 1;
  try {
    const raw = localStorage.getItem(COMMUNITY_LOCAL_KEY);
    if (raw) {
      const existing: EpilogueCommunityPost[] = JSON.parse(raw);
      const updated = existing.map((p) => {
        if (p.id === postId) {
          updatedCount = (p.cheersCount || 0) + 1;
          return { ...p, cheersCount: updatedCount };
        }
        return p;
      });
      localStorage.setItem(COMMUNITY_LOCAL_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('luckey-community-updated', { detail: updated }));
    }
  } catch (err) {
    console.warn('[Community] Cheer local save failed:', err);
  }

  try {
    const postRef = doc(db, 'epilogue_community', postId);
    await updateDoc(postRef, {
      cheersCount: increment(1),
    });
  } catch (_) {
    // ignore
  }

  return updatedCount;
}
