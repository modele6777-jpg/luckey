import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon,
  Sparkles,
  Heart,
  BookOpen,
  Calendar,
  Save,
  Check,
  Trash2,
  Edit3,
  RefreshCw,
  Compass,
  TreeDeciduous,
  Leaf,
  Bird,
  Music,
  Plus,
  PenLine,
  Copy,
  Volume2,
  Wand2,
  Share2,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getTodayDateKey } from '@/lib/dailyCache';
import { invokeEpilogueSummaryLLM, invokeMindDiaryLLM, invokeLucyMidnightWhisperLLM, createLucyMidnightWhisperFallback, isBrokenMidnightWhisper } from '@/lib/ai';
import { TTSButton } from '@/components/TTSButton';
import { EpilogueAchievementShareModal } from './EpilogueAchievementShareModal';
import { calculateEpilogueAchievementStats } from '@/types/epilogueAchievement';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface EpilogueDiaryEntry {
  id: string;
  dateKey: string;
  createdAt: number;
  mood: string;
  moodEmoji: string;
  gratitudes: string[];
  rawNotes?: string;
  mindDiary: string;
  reflection?: string;
  anchor?: string;
  aiFeedback?: string;
  cosmicFootprint?: {
    orange?: string;
    trinity?: string;
    heal?: string;
    bluebird?: string;
    muse?: string;
  };
}

const MOOD_OPTIONS = [
  { label: '평온함', emoji: '😌', color: 'rgba(56, 189, 248, 0.25)', border: 'rgba(56, 189, 248, 0.5)' },
  { label: '성취감', emoji: '✨', color: 'rgba(250, 204, 21, 0.25)', border: 'rgba(250, 204, 21, 0.5)' },
  { label: '비움과 자유', emoji: '🌊', color: 'rgba(168, 85, 247, 0.25)', border: 'rgba(168, 85, 247, 0.5)' },
  { label: '따뜻한 감사', emoji: '💖', color: 'rgba(244, 114, 182, 0.25)', border: 'rgba(244, 114, 182, 0.5)' },
  { label: '포근한 휴식', emoji: '🌙', color: 'rgba(129, 140, 248, 0.25)', border: 'rgba(129, 140, 248, 0.5)' },
  { label: '새로운 영감', emoji: '💡', color: 'rgba(251, 146, 60, 0.25)', border: 'rgba(251, 146, 60, 0.5)' },
];

const GRATITUDE_SUGGESTIONS = [
  '따뜻한 차 한 잔과 고요한 아침',
  '오늘 나를 지탱해 준 소중한 인연',
  '어려운 순간에도 중심을 지킨 나 자신',
  '마음을 편안하게 해 준 자연의 소리와 햇살',
  '오늘 배운 새로운 생각과 깨달음',
  '무사히 하루를 마무리할 수 있는 평화',
];

const DIARY_NOTE_IDEAS = [
  '오늘 유난히 분주했지만 끝까지 해낸 나를 칭찬함',
  '저녁 노을을 바라보며 마음에 고요한 쉼표를 찍음',
  '마음속 복잡한 걱정을 밤하늘에 가볍게 띄워 보냄',
  '작은 성취 속에서 나만의 소중한 보람을 발견함',
];

export function ensureGratitudes(raw?: string[]): string[] {
  const list = Array.isArray(raw)
    ? raw.map((item) => (typeof item === 'string' ? item : '')).filter((item) => Boolean(item && item.trim()))
    : [];
  const result = [...list];
  while (result.length < 3) {
    result.push('');
  }
  return result;
}

/**
 * Generates a normalized signature of diary contents.
 * Used to strictly determine whether the user made any actual modifications.
 */
export function getDiaryContentSignature(
  mood?: string,
  gratitudes?: string[],
  rawNotes?: string,
  mindDiary?: string,
  aiFeedback?: string
): string {
  const cleanGratitudes = (Array.isArray(gratitudes) ? gratitudes : [])
    .map((g) => (typeof g === 'string' ? g.trim() : ''))
    .filter(Boolean);
  return JSON.stringify({
    mood: (mood || '평온함').trim(),
    gratitudes: cleanGratitudes,
    rawNotes: (rawNotes || '').trim(),
    mindDiary: (mindDiary || '').trim(),
    aiFeedback: (aiFeedback || '').trim(),
  });
}

export function EpilogueDiaryView() {
  const { sharedState, updateSharedState } = useApp();
  const todayKey = getTodayDateKey();

  // Local & Shared History
  const [entries, setEntries] = useState<EpilogueDiaryEntry[]>(() => {
    let localList: EpilogueDiaryEntry[] = [];
    try {
      const cached = localStorage.getItem('epilogue_diary_history');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) localList = parsed;
      }
    } catch {
      // ignore
    }
    const fromShared = sharedState?.epilogueHistory;
    if (Array.isArray(fromShared) && fromShared.length > 0) {
      const map = new Map<string, EpilogueDiaryEntry>();
      localList.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
      (fromShared as EpilogueDiaryEntry[]).forEach((e) => {
        if (e?.dateKey) {
          const existing = map.get(e.dateKey);
          if (!existing || (e.createdAt || 0) >= (existing.createdAt || 0)) {
            map.set(e.dateKey, e);
          }
        }
      });
      return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return localList;
  });

  // Today's Form State
  const existingTodayEntry = useMemo(
    () => entries.find((e) => e.dateKey === todayKey),
    [entries, todayKey]
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const achievementStats = useMemo(
    () =>
      calculateEpilogueAchievementStats(
        entries,
        (sharedState?.userProfile?.basic?.nickname?.trim())
          ? sharedState.userProfile.basic.nickname.trim()
          : (sharedState?.userProfile?.basic?.name?.trim() || '제제')
      ),
    [entries, sharedState?.userProfile]
  );

  const cachedTodayDraft = useMemo(() => {
    try {
      const raw = localStorage.getItem(`epilogue_diary_draft_${todayKey}`);
      if (raw) return JSON.parse(raw) as Partial<EpilogueDiaryEntry>;
    } catch {}
    return null;
  }, [todayKey]);

  const [selectedMood, setSelectedMood] = useState<string>(() =>
    existingTodayEntry?.mood || cachedTodayDraft?.mood || '평온함'
  );
  const [gratitudes, setGratitudes] = useState<string[]>(() =>
    ensureGratitudes(existingTodayEntry?.gratitudes || cachedTodayDraft?.gratitudes)
  );
  const [rawNotes, setRawNotes] = useState<string>(() =>
    existingTodayEntry?.rawNotes || cachedTodayDraft?.rawNotes || ''
  );
  const [mindDiary, setMindDiary] = useState<string>(() =>
    existingTodayEntry?.mindDiary || existingTodayEntry?.reflection || cachedTodayDraft?.mindDiary || (cachedTodayDraft as any)?.reflection || ''
  );
  const [isEditingDiary, setIsEditingDiary] = useState(false);
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);

  const [aiFeedback, setAiFeedback] = useState<string>(() => {
    const raw = existingTodayEntry?.aiFeedback || cachedTodayDraft?.aiFeedback || '';
    return isBrokenMidnightWhisper(raw) ? '' : raw;
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Baseline signature tracking: autosave MUST only trigger when contents actually differ from last saved state
  const initialSignature = useMemo(() => {
    const initMood = existingTodayEntry?.mood || cachedTodayDraft?.mood || '평온함';
    const initGrat = existingTodayEntry?.gratitudes || cachedTodayDraft?.gratitudes || [];
    const initNotes = existingTodayEntry?.rawNotes || cachedTodayDraft?.rawNotes || '';
    const initDiary = existingTodayEntry?.mindDiary || existingTodayEntry?.reflection || cachedTodayDraft?.mindDiary || (cachedTodayDraft as any)?.reflection || '';
    const initFeedback = existingTodayEntry?.aiFeedback || cachedTodayDraft?.aiFeedback || '';
    return getDiaryContentSignature(initMood, initGrat, initNotes, initDiary, initFeedback);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastSavedSignatureRef = useRef<string>(initialSignature);
  const hasUserEditedRef = useRef<boolean>(false);

  // Sync entries from sharedState and real-time cross-device events with safe deduplicating merge
  useEffect(() => {
    const mergeIntoEntries = (incoming: any[]) => {
      if (!Array.isArray(incoming) || incoming.length === 0) return;
      setEntries((prev) => {
        const map = new Map<string, EpilogueDiaryEntry>();
        prev.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
        try {
          const cached = localStorage.getItem('epilogue_diary_history');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) parsed.forEach((e: any) => { if (e?.dateKey) map.set(e.dateKey, e); });
          }
        } catch {}

        incoming.forEach((e) => {
          if (e?.dateKey) {
            const existing = map.get(e.dateKey);
            if (!existing || (e.createdAt || 0) >= (existing.createdAt || 0)) {
              map.set(e.dateKey, e);
            }
          }
        });

        const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        try {
          localStorage.setItem('epilogue_diary_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    };

    if (Array.isArray(sharedState?.epilogueHistory) && sharedState.epilogueHistory.length > 0) {
      mergeIntoEntries(sharedState.epilogueHistory);
    }

    const handleFeatureUpdate = (e: any) => {
      const updatedHistory = e?.detail?.epilogueHistory;
      if (Array.isArray(updatedHistory) && updatedHistory.length > 0) {
        mergeIntoEntries(updatedHistory);
      }
    };

    window.addEventListener('prism:feature_updated', handleFeatureUpdate);
    window.addEventListener('prism:state_changed', handleFeatureUpdate);
    window.addEventListener('epilogue:diary_synced', handleFeatureUpdate);
    window.addEventListener('luckey:diary_synced', handleFeatureUpdate);
    return () => {
      window.removeEventListener('prism:feature_updated', handleFeatureUpdate);
      window.removeEventListener('prism:state_changed', handleFeatureUpdate);
      window.removeEventListener('epilogue:diary_synced', handleFeatureUpdate);
      window.removeEventListener('luckey:diary_synced', handleFeatureUpdate);
    };
  }, [sharedState?.epilogueHistory]);

  // Synchronize form state when existingTodayEntry is resolved/updated from cloud or cache
  useEffect(() => {
    if (existingTodayEntry) {
      if (existingTodayEntry.mood) setSelectedMood(existingTodayEntry.mood);
      if (Array.isArray(existingTodayEntry.gratitudes)) {
        setGratitudes((prev) => {
          // If the user already has content typed, merge smartly; otherwise use ensureGratitudes
          const hasUserContent = prev.some((g) => g.trim());
          if (hasUserContent && existingTodayEntry.gratitudes.length === 0) return prev;
          return ensureGratitudes(existingTodayEntry.gratitudes);
        });
      }
      if (existingTodayEntry.rawNotes) {
        setRawNotes((prev) => (prev.trim() ? prev : existingTodayEntry.rawNotes || ''));
      }
      if (existingTodayEntry.mindDiary || existingTodayEntry.reflection) {
        setMindDiary((prev) => (prev.trim() ? prev : (existingTodayEntry.mindDiary || existingTodayEntry.reflection || '')));
      }
      if (existingTodayEntry.aiFeedback) {
        const raw = existingTodayEntry.aiFeedback;
        if (!isBrokenMidnightWhisper(raw)) {
          setAiFeedback((prev) => (prev.trim() ? prev : raw));
        }
      }

      // If user has not actively edited yet, align the baseline saved signature with the resolved entry
      if (!hasUserEditedRef.current) {
        lastSavedSignatureRef.current = getDiaryContentSignature(
          existingTodayEntry.mood || '평온함',
          existingTodayEntry.gratitudes || [],
          existingTodayEntry.rawNotes || '',
          existingTodayEntry.mindDiary || existingTodayEntry.reflection || '',
          existingTodayEntry.aiFeedback || ''
        );
      }
    }
  }, [existingTodayEntry]);

  // Today's Cosmic Footprints
  const orangeData = sharedState?.dailySecrets?.[todayKey];
  const trinityData = sharedState?.trinityDailyLucky?.[todayKey];
  const hoponoponoData = sharedState?.hoponoponoDaily?.[todayKey];
  const museData = sharedState?.dailyArts?.[todayKey];
  const healData = (sharedState?.healHistory || [])[0];

  const footprints = useMemo(() => [
    {
      app: 'orange',
      name: 'Orange',
      title: 'Secret',
      icon: TreeDeciduous,
      color: '#f97316',
      active: Boolean(orangeData && (orangeData.affirmation || orangeData.desire || orangeData.appliedWish)),
      summary: orangeData?.appliedWish ? `소원: "${orangeData.appliedWish}"` : (orangeData?.affirmation || '데일리 시크릿 여정'),
    },
    {
      app: 'trinity',
      name: 'Trinity',
      title: 'Lucky',
      icon: Sparkles,
      color: '#eab308',
      active: Boolean(trinityData),
      summary: trinityData?.luckyData?.fortuneSummary || '천문 사주 & 타로 리딩',
    },
    {
      app: 'heal',
      name: 'Heal',
      title: 'Letting Go',
      icon: Leaf,
      color: '#10b981',
      active: Boolean(healData),
      summary: healData?.themeName || '세도나 방하착 릴리징',
    },
    {
      app: 'bluebird',
      name: 'Bluebird',
      title: "Ho'oponopono",
      icon: Bird,
      color: '#38bdf8',
      active: Boolean(hoponoponoData),
      summary: hoponoponoData?.completed ? '정화 4구절 실천 완료' : '호오포노포노 정화',
    },
    {
      app: 'muse',
      name: 'Muse',
      title: 'Art',
      icon: Music,
      color: '#a855f7',
      active: Boolean(museData),
      summary: museData?.recommendation?.title ? `명화 [${museData.recommendation.title}]` : '아트 테라피 처방',
    },
  ], [orangeData, trinityData, healData, hoponoponoData, museData]);

  // Real-time Auto-Save Engine: debounced auto-persist ONLY when there are actual content changes
  useEffect(() => {
    const currentSignature = getDiaryContentSignature(
      selectedMood,
      gratitudes,
      rawNotes,
      mindDiary,
      aiFeedback
    );

    // 1. Strictly bypass auto-save if content matches the last saved state (no changes)
    if (currentSignature === lastSavedSignatureRef.current) {
      return;
    }

    const validGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);
    const effectiveDiary = mindDiary.trim() || rawNotes.trim();

    // 2. Only auto-save if user has typed something
    if (!effectiveDiary && validGratitudes.length === 0 && !rawNotes.trim()) return;

    const timer = setTimeout(() => {
      const verifySignature = getDiaryContentSignature(
        selectedMood,
        gratitudes,
        rawNotes,
        mindDiary,
        aiFeedback
      );

      // Re-verify that content differs before triggering network/storage writes
      if (verifySignature === lastSavedSignatureRef.current) {
        return;
      }

      const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === selectedMood) || MOOD_OPTIONS[0];

      const newEntry: EpilogueDiaryEntry = {
        id: existingTodayEntry?.id || `epilogue_${todayKey}_${Date.now()}`,
        dateKey: todayKey,
        createdAt: existingTodayEntry?.createdAt || Date.now(),
        mood: selectedMood,
        moodEmoji: activeMoodObj.emoji,
        gratitudes: validGratitudes,
        rawNotes: rawNotes.trim(),
        mindDiary: effectiveDiary || '오늘 하루를 평온하게 마무리함',
        aiFeedback: aiFeedback.trim() || undefined,
        cosmicFootprint: {
          orange: orangeData ? 'Secret 완료' : undefined,
          trinity: trinityData ? 'Lucky 완료' : undefined,
          heal: healData ? 'Letting Go 완료' : undefined,
          bluebird: hoponoponoData ? 'Ho\'oponopono 완료' : undefined,
          muse: museData ? 'Art 완료' : undefined,
        },
      };

      let finalMerged: EpilogueDiaryEntry[] = [];
      setEntries((prev) => {
        let diskEntries: EpilogueDiaryEntry[] = [];
        try {
          const cached = localStorage.getItem('epilogue_diary_history');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) diskEntries = parsed;
          }
        } catch (_) {}

        const map = new Map<string, EpilogueDiaryEntry>();
        diskEntries.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
        prev.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
        map.set(todayKey, newEntry);

        const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        try {
          localStorage.setItem('epilogue_diary_history', JSON.stringify(merged));
          localStorage.setItem(`epilogue_diary_draft_${todayKey}`, JSON.stringify(newEntry));
        } catch (_) {}

        finalMerged = merged;
        return merged;
      });

      if (finalMerged.length > 0) {
        void updateSharedState(
          {
            epilogueHistory: finalMerged,
            epilogueMemory: effectiveDiary || aiFeedback || `${todayKey} 성찰 진행 중`,
          },
          'epilogue'
        ).catch(() => {});
      }

      // Mark this snapshot as saved to prevent redundant writes
      lastSavedSignatureRef.current = verifySignature;

      setAutoSaved(true);
      playAudioHaptic('save_auto');
      const hideTimer = setTimeout(() => setAutoSaved(false), 2000);
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    selectedMood,
    gratitudes,
    rawNotes,
    mindDiary,
    aiFeedback,
    todayKey,
    existingTodayEntry?.id,
    existingTodayEntry?.createdAt,
    orangeData,
    trinityData,
    healData,
    hoponoponoData,
    museData,
  ]);

  // Track if there are pending unsaved changes comparing against last saved snapshot
  const hasUnsavedChanges = useMemo(() => {
    const currentSig = getDiaryContentSignature(
      selectedMood,
      gratitudes,
      rawNotes,
      mindDiary,
      aiFeedback
    );
    if (currentSig === lastSavedSignatureRef.current) return false;
    const validGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);
    const effectiveDiary = mindDiary.trim() || rawNotes.trim();
    return Boolean(effectiveDiary || validGratitudes.length > 0 || rawNotes.trim());
  }, [selectedMood, gratitudes, rawNotes, mindDiary, aiFeedback]);

  // Handle Gratitude Update (maintains at least 3 slots)
  const updateGratitude = (index: number, val: string) => {
    hasUserEditedRef.current = true;
    setGratitudes((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const addGratitudeField = () => {
    hasUserEditedRef.current = true;
    setGratitudes((prev) => [...prev, '']);
  };

  const removeGratitudeField = (index: number) => {
    hasUserEditedRef.current = true;
    setGratitudes((prev) => {
      if (prev.length <= 3) {
        const updated = [...prev];
        updated[index] = '';
        return updated;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const addSuggestion = (text: string) => {
    hasUserEditedRef.current = true;
    setGratitudes((prev) => {
      const emptyIndex = prev.findIndex((g) => !g.trim());
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = text;
        return updated;
      }
      return [...prev, text];
    });
  };

  const appendNoteIdea = (text: string) => {
    hasUserEditedRef.current = true;
    setRawNotes((prev) => (prev ? `${prev}\n• ${text}` : text));
  };

  // 🪄 AI Mind Diary Generator: Transforms simple notes into polished diary
  const handleGenerateMindDiary = async () => {
    if (isGeneratingDiary) return;
    setIsGeneratingDiary(true);
    try {
      const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === selectedMood) || MOOD_OPTIONS[0];
      const validGratitudes = gratitudes.filter((g) => g.trim());
      const footprintSummary = footprints
        .filter((f) => f.active)
        .map((f) => `[${f.name}]: ${f.summary}`)
        .join(', ');

      const rawUser = sharedState?.userProfile?.basic?.nickname || sharedState?.userProfile?.basic?.name;
      const userName = (rawUser && rawUser !== '여행자') ? rawUser : '제제';

      const generated = await invokeMindDiaryLLM({
        rawNotes: rawNotes.trim(),
        mood: `${activeMoodObj.emoji} ${activeMoodObj.label}`,
        gratitudes: validGratitudes,
        footprintSummary,
        userName,
      });

      if (generated && generated.trim()) {
        hasUserEditedRef.current = true;
        setMindDiary(generated.trim());
        setIsEditingDiary(false);
      }
    } catch (err) {
      console.error('[EpilogueDiary] AI Diary generation failed:', err);
    } finally {
      setIsGeneratingDiary(false);
    }
  };

  // Request Lucy's Midnight Reflection
  const handleRequestAiReflection = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === selectedMood) || MOOD_OPTIONS[0];
      const validGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);
      
      const footprintSummary = footprints
        .filter((f) => f.active)
        .map((f) => `[${f.name}]: ${f.summary}`)
        .join(', ');

      const rawUser = sharedState?.userProfile?.basic?.nickname || sharedState?.userProfile?.basic?.name;
      const userName = (rawUser && rawUser !== '여행자') ? rawUser : '제제';

      const whisper = await invokeLucyMidnightWhisperLLM({
        userName,
        mood: `${activeMoodObj.emoji} ${activeMoodObj.label}`,
        gratitudes: validGratitudes,
        mindDiary: mindDiary.trim() || undefined,
        rawNotes: rawNotes.trim() || undefined,
        footprintSummary: footprintSummary || undefined,
      });

      hasUserEditedRef.current = true;
      if (whisper && !isBrokenMidnightWhisper(whisper)) {
        setAiFeedback(whisper);
      } else {
        const fallback = createLucyMidnightWhisperFallback({
          userName,
          mood: activeMoodObj.label,
          gratitudes: validGratitudes,
          footprintSummary: footprintSummary || undefined,
        });
        setAiFeedback(fallback);
      }
    } catch (err) {
      console.error('[handleRequestAiReflection] Error:', err);
      const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === selectedMood) || MOOD_OPTIONS[0];
      const validGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);
      const rawUser = sharedState?.userProfile?.basic?.nickname || sharedState?.userProfile?.basic?.name;
      const userName = (rawUser && rawUser !== '여행자') ? rawUser : '제제';
      const fallback = createLucyMidnightWhisperFallback({
        userName,
        mood: activeMoodObj.label,
        gratitudes: validGratitudes,
      });
      hasUserEditedRef.current = true;
      setAiFeedback(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save Diary Entry
  const handleSaveDiary = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === selectedMood) || MOOD_OPTIONS[0];
      const validGratitudes = gratitudes.map((g) => g.trim()).filter(Boolean);

      const effectiveDiary = mindDiary.trim() || rawNotes.trim() || '오늘 하루를 평온하게 마무리함';

      const newEntry: EpilogueDiaryEntry = {
        id: existingTodayEntry?.id || `epilogue_${todayKey}_${Date.now()}`,
        dateKey: todayKey,
        createdAt: Date.now(),
        mood: selectedMood,
        moodEmoji: activeMoodObj.emoji,
        gratitudes: validGratitudes,
        rawNotes: rawNotes.trim(),
        mindDiary: effectiveDiary,
        aiFeedback: aiFeedback.trim() || undefined,
        cosmicFootprint: {
          orange: orangeData ? 'Secret 완료' : undefined,
          trinity: trinityData ? 'Lucky 완료' : undefined,
          heal: healData ? 'Letting Go 완료' : undefined,
          bluebird: hoponoponoData ? 'Ho\'oponopono 완료' : undefined,
          muse: museData ? 'Art 완료' : undefined,
        },
      };

      let finalMergedEntries: EpilogueDiaryEntry[] = [];
      setEntries((prev) => {
        let diskEntries: EpilogueDiaryEntry[] = [];
        try {
          const cached = localStorage.getItem('epilogue_diary_history');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) diskEntries = parsed;
          }
        } catch (_) {}

        const map = new Map<string, EpilogueDiaryEntry>();
        diskEntries.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
        prev.forEach((e) => { if (e?.dateKey) map.set(e.dateKey, e); });
        map.set(todayKey, newEntry);

        const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        try {
          localStorage.setItem('epilogue_diary_history', JSON.stringify(merged));
          localStorage.setItem(`epilogue_diary_draft_${todayKey}`, JSON.stringify(newEntry));
        } catch (_) {}
        finalMergedEntries = merged;
        return merged;
      });

      await updateSharedState(
        {
          epilogueHistory: finalMergedEntries,
          epilogueMemory: effectiveDiary || aiFeedback || `${todayKey} 성찰 완료`,
        },
        'epilogue'
      ).catch(() => {});

      // Immediately sync lastSavedSignatureRef so auto-save won't redundantly fire
      lastSavedSignatureRef.current = getDiaryContentSignature(
        selectedMood,
        gratitudes,
        rawNotes,
        mindDiary,
        aiFeedback
      );
      setAutoSaved(false);
      setSavedSuccess(true);
      playAudioHaptic('save_success');
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('[EpilogueDiary] Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyText = async (key: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-home md:pt-home-md space-y-8 pb-16">
      {/* 🌟 Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-purple-500/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-4 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 opacity-70 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 font-mono">
                <Calendar size={12} className="text-purple-400" />
                {todayKey} • 오늘 하루의 피날레
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70 font-mono">
                SOUL DIARY
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
              오늘 하루의 소울 다이어리 &amp; 마음일기
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70 font-sans leading-relaxed">
              자유롭게 적은 생각과 감정이 AI의 감성 문체와 Kore 음성으로 살아 숨 쉬는 나만의 밤 공간입니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {autoSaved ? (
              <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1 animate-pulse px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Check size={12} className="text-emerald-400" />
                자동 저장됨
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-[11px] text-purple-300/90 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                변경 감지 (자동저장 대기)
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleSaveDiary}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white border border-purple-300/30"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : savedSuccess ? (
                <Check size={15} className="text-white animate-bounce" />
              ) : (
                <Save size={15} />
              )}
              <span>{savedSuccess ? '기록 저장됨' : '다이어리 저장'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 bg-white/10 hover:bg-white/20 text-white border border-purple-400/40 backdrop-blur-md"
              title="에필로그 성취 통계 데이터 이미지 렌더링 및 커뮤니티 공유"
            >
              <Share2 size={15} className="text-amber-300" />
              <span>공유하기</span>
            </button>
          </div>
        </div>

        {/* 🌟 Achievement Statistics Quick Bar */}
        <div className="pt-2 border-t border-white/10 relative z-10 flex flex-wrap items-center justify-between gap-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-amber-300 font-bold font-mono">
              <Flame size={14} className="text-amber-400" />
              {achievementStats.streakDays}일 연속 성찰
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-purple-200 font-mono">
              <BookOpen size={13} className="text-purple-400" />
              누적 다이어리 {achievementStats.totalDiaries}편
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-pink-300 font-mono">
              <Heart size={13} className="text-pink-400" />
              감사 {achievementStats.totalGratitudes}가지
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-white/70 font-mono">
              <span>{achievementStats.topMoodEmoji}</span>
              <span>{achievementStats.topMood}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1 rounded-xl text-[11px] font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles size={12} className="text-amber-400" />
            <span>성취 카드 이미지 생성 &amp; 커뮤니티 공유</span>
          </button>
        </div>

        {/* 5 Universe Footprints Micro Cards */}
        <div className="pt-2 border-t border-white/10 relative z-10 space-y-2">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest font-sans flex items-center gap-1.5">
            <Compass size={13} className="text-purple-400" />
            오늘의 5대 우주 발자취 (Cosmic Footprints)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {footprints.map((fp) => {
              const Icon = fp.icon;
              return (
                <div
                  key={fp.app}
                  className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 ${
                    fp.active
                      ? 'bg-white/10 border-white/20 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-white/70">{fp.name}</span>
                    <Icon size={14} style={{ color: fp.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white break-keep break-words">{fp.title}</p>
                    <p className="text-[9px] text-white/50 break-keep break-words font-mono">
                      {fp.active ? '기록 연동됨' : '여정 대기 중'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 🌟 Main Diary Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
      >
        {/* Section 1: Mood & Energy Spectrum */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-white/60 tracking-wider font-sans uppercase flex items-center gap-2">
            <Heart size={14} className="text-pink-400" />
            오늘 밤 나의 에너지 &amp; 마음 상태
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const active = selectedMood === mood.label;
              return (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => {
                    hasUserEditedRef.current = true;
                    setSelectedMood(mood.label);
                  }}
                  className="px-3 py-2.5 rounded-2xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
                  style={{
                    background: active ? mood.color : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${active ? mood.border : 'rgba(255, 255, 255, 0.08)'}`,
                    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: active ? `0 0 15px ${mood.color}` : 'none',
                    transform: active ? 'scale(1.02)' : 'none',
                  }}
                >
                  <span className="text-base">{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: 3 Gratitudes */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-xs font-bold text-white/80 tracking-wider font-sans uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              오늘 하루 감사한 일 3가지 (3 Gratitudes)
            </label>
            <span className="text-[10px] text-purple-200/60 font-mono">
              PC · 모바일 공통 최소 3가지 기록
            </span>
          </div>

          <div className="space-y-2.5">
            {gratitudes.map((g, idx) => (
              <div key={idx} className="flex items-center gap-2 group/input">
                <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-purple-300 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={g}
                  onChange={(e) => updateGratitude(idx, e.target.value)}
                  placeholder={`감사한 일 ${idx + 1} (예: ${GRATITUDE_SUGGESTIONS[idx] || '오늘 나를 웃게 해 준 일'})`}
                  className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none transition-all duration-200 bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-purple-400/60 focus:bg-white/[0.06]"
                />
                {g.trim() ? (
                  <button
                    type="button"
                    onClick={() => removeGratitudeField(idx)}
                    className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 text-white/30 hover:text-rose-300 border border-white/5 transition-all cursor-pointer shrink-0"
                    title={gratitudes.length > 3 ? "항목 삭제" : "입력 지우기"}
                  >
                    <Trash2 size={13} />
                  </button>
                ) : gratitudes.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => removeGratitudeField(idx)}
                    className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 text-white/30 hover:text-rose-300 border border-white/5 transition-all cursor-pointer shrink-0"
                    title="빈 항목 삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Action Row: Preset Chips & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-white/40 font-mono flex items-center gap-1 mr-1">
                <Plus size={10} /> 추천 키워드:
              </span>
              {GRATITUDE_SUGGESTIONS.slice(0, 4).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => addSuggestion(sug)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white/90 border border-white/5 transition-all cursor-pointer active:scale-95"
                >
                  + {sug}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={addGratitudeField}
              className="self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-bold font-sans bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0 shadow-xs"
            >
              <Plus size={11} className="text-purple-300" />
              <span>감사 항목 추가</span>
            </button>
          </div>
        </div>

        {/* 🌟 Section 3: 오늘의 마음일기 (Today's Mind Diary) */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-white/80 tracking-wider font-sans uppercase flex items-center gap-2">
                <PenLine size={15} className="text-purple-400" />
                오늘의 마음일기 (Today's Mind Diary)
              </label>
              <p className="text-[11px] text-purple-200/60 font-sans mt-0.5">
                생각이나 오늘 있었던 일을 자유롭게 적고 버튼을 누르면 AI가 아름다운 감성 일기로 완성해 줍니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateMindDiary}
              disabled={isGeneratingDiary}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer shadow-md shadow-purple-500/20 active:scale-95 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/30 self-start sm:self-auto shrink-0"
            >
              {isGeneratingDiary ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-purple-200" />
                  <span>AI 마음일기 짓는 중...</span>
                </>
              ) : (
                <>
                  <Wand2 size={13} className="text-amber-300" />
                  <span>✨ AI 마음일기로 완성하기</span>
                </>
              )}
            </button>
          </div>

          {/* User Raw Notes / Draft Input */}
          <div className="space-y-2">
            <textarea
              rows={3}
              value={rawNotes}
              onChange={(e) => {
                hasUserEditedRef.current = true;
                setRawNotes(e.target.value);
              }}
              placeholder="오늘 하루 있었던 일, 스쳐간 감정, 짧은 메모나 키워드를 자유롭게 적어보세요... (예: 오늘 프로젝트 끝내서 홀가분함. 저녁 산책 때 시원한 바람이 좋았음)"
              className="w-full p-4 rounded-2xl text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none transition-all duration-200 bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-purple-400/60 focus:bg-white/[0.06] resize-none leading-relaxed"
            />

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-white/40 font-mono flex items-center gap-1 mr-1">
                <Plus size={10} /> 메모 예시:
              </span>
              {DIARY_NOTE_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => appendNoteIdea(idea)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white/90 border border-white/5 transition-all cursor-pointer"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>

          {/* 🌟 AI Generated / Polished Mind Diary Display & Kore TTS Voice */}
          <AnimatePresence>
            {mindDiary ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-black/50 border border-purple-400/30 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-transparent pointer-events-none" />

                {/* Top Control Bar of Mind Diary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/25 text-purple-200 border border-purple-400/30 flex items-center gap-1 font-mono">
                      <Sparkles size={11} className="text-amber-300" />
                      완성된 소울 마음일기
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {todayKey}
                    </span>
                  </div>

                  {/* Action Group: TTS Kore, Edit, Copy */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* TTS Kore Voice Player Button */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-bold transition-all shadow-sm">
                      <span className="text-[11px] font-sans">Kore 음성</span>
                      <TTSButton
                        text={mindDiary}
                        voice="Kore"
                        className="text-purple-200 hover:text-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingDiary(!isEditingDiary)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>{isEditingDiary ? '편집 완료' : '직접 수정'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyText('mindDiary', mindDiary)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                      title="일기 본문 복사"
                    >
                      {copiedKey === 'mindDiary' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Diary Body Content */}
                <div className="relative z-10">
                  {isEditingDiary ? (
                    <textarea
                      rows={5}
                      value={mindDiary}
                      onChange={(e) => {
                        hasUserEditedRef.current = true;
                        setMindDiary(e.target.value);
                      }}
                      className="w-full p-4 rounded-2xl text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none transition-all duration-200 bg-black/40 backdrop-blur-md border border-purple-400/50 focus:bg-black/60 resize-none leading-relaxed font-serif"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-purple-50/95 leading-relaxed sm:leading-loose font-serif whitespace-pre-line tracking-wide break-keep">
                      {mindDiary}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/40 font-sans flex items-center justify-center gap-2">
                <Wand2 size={13} className="text-purple-400/60" />
                <span>간단한 메모를 적고 [✨ AI 마음일기로 완성하기] 버튼을 누르면 품격 있는 일기가 생성되고 Kore 음성으로 들을 수 있습니다.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 4: Lucy AI Midnight Whisper */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-white/60 tracking-wider font-sans uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-pink-400" />
              루시 AI 자정의 속삭임 (Lucy's Midnight Whisper)
            </label>
            <button
              type="button"
              onClick={handleRequestAiReflection}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold font-sans bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw size={12} className="animate-spin text-purple-300" />
                  <span>축복 메시지 수신 중...</span>
                </>
              ) : aiFeedback ? (
                <>
                  <RefreshCw size={12} />
                  <span>자정 축복 다시 받기</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>루시에게 자정 축복 받기</span>
                </>
              )}
            </button>
          </div>

          {aiFeedback && !isBrokenMidnightWhisper(aiFeedback) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-100/90 text-xs sm:text-sm leading-relaxed font-sans relative shadow-inner space-y-3 backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Moon size={15} className="text-purple-400 animate-pulse" />
                  <span>루시의 자정 메시지 (Midnight Whisper)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(aiFeedback);
                      setCopiedKey('whisper');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 text-[10px] transition-colors cursor-pointer"
                    title="축복 메시지 복사"
                  >
                    {copiedKey === 'whisper' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copiedKey === 'whisper' ? '복사됨' : '복사'}</span>
                  </button>
                  <TTSButton
                    text={aiFeedback}
                    voice="Kore"
                    className="text-purple-300 hover:text-white"
                  />
                </div>
              </div>
              <p className="whitespace-pre-line break-keep font-serif text-[13px] sm:text-[14px] leading-relaxed text-purple-100/95 tracking-wide pl-1">
                {aiFeedback}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-purple-500/15 text-[11px] text-purple-300/70 font-sans">
                <span>🌙 오늘 하루의 고요한 쉼을 위한 루시의 자정 축복</span>
                <button
                  type="button"
                  onClick={handleRequestAiReflection}
                  disabled={isAiLoading}
                  className="hover:text-purple-200 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  새로운 속삭임 생성
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-white/40 font-sans">
              마음일기를 작성한 후 [루시에게 자정 축복 받기]를 누르면 따뜻한 하루 피날레 메시지가 도착합니다.
            </div>
          )}
        </div>
      </motion.div>

      {/* 🌟 Achievement Share Modal */}
      <EpilogueAchievementShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        stats={achievementStats}
      />
    </div>
  );
}
