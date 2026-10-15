import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'wouter';
import { 
  ListTodo, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  Flame, 
  Award, 
  Zap, 
  Compass, 
  HeartPulse, 
  Calendar, 
  Clock, 
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Save,
  ArrowUpDown,
  Filter,
  Layers,
  ListOrdered
} from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';

export type MissionCategory = 'mind' | 'action' | 'wisdom' | 'gratitude' | 'custom';
export type MissionPriority = 'high' | 'medium' | 'low' | 'essential' | 'growth' | 'healing';
export type NormalizedPriority = 'high' | 'medium' | 'low';
export type SortOption = 'priority-desc' | 'priority-asc' | 'time-asc' | 'default';
export type ViewMode = 'grouped' | 'ranked';

export function normalizePriority(p: MissionPriority | string | undefined): NormalizedPriority {
  if (p === 'high' || p === 'essential') return 'high';
  if (p === 'low' || p === 'healing') return 'low';
  return 'medium';
}

export interface MissionItem {
  id: string;
  title: string;
  description?: string;
  category: MissionCategory;
  priority: MissionPriority;
  estimatedMinutes?: number;
  completed: boolean;
  completedAt?: string;
  isCustom?: boolean;
  actionHint?: string;
  actionRoute?: string;
  recommendReason?: string;
  recommendedRank?: number;
}

export interface MissionStreakData {
  lastCompletedDate: string;
  streakCount: number;
}

export const CATEGORY_META: Record<MissionCategory, { label: string; icon: string; color: string; bg: string }> = {
  mind: { label: '마음챙김', icon: '🧘', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  action: { label: '실행·활력', icon: '⚡', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  wisdom: { label: '우주·통찰', icon: '🌌', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  gratitude: { label: '감사·연결', icon: '🕊️', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  custom: { label: '나만의 ToDo', icon: '✍️', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export const PRIORITY_CONFIG: Record<NormalizedPriority, {
  id: NormalizedPriority;
  rankNumber: number;
  label: string;
  rankBadge: string;
  badgeLabel: string;
  tierTitle: string;
  tierSubtitle: string;
  icon: string;
  textColor: string;
  badgeBg: string;
  cardBorder: string;
  cardBg: string;
  leftStripe: string;
  dotColor: string;
  weight: number;
}> = {
  high: {
    id: 'high',
    rankNumber: 1,
    label: '추천 1순위',
    rankBadge: '🥇 추천 1순위',
    badgeLabel: '🔥 추천 1순위 (핵심)',
    tierTitle: '최우선 핵심 과업',
    tierSubtitle: '오늘의 에너지 중심을 세우고 가장 중요한 성과를 여는 골든 퀘스트',
    icon: '🔥',
    textColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25',
    cardBorder: 'border-rose-500/30 hover:border-rose-400/60 shadow-[0_0_24px_rgba(244,63,94,0.1)]',
    cardBg: 'bg-gradient-to-r from-rose-950/25 via-zinc-950/40 to-transparent',
    leftStripe: 'from-amber-400 via-rose-500 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.7)]',
    dotColor: 'bg-rose-500',
    weight: 3,
  },
  medium: {
    id: 'medium',
    rankNumber: 2,
    label: '추천 2순위',
    rankBadge: '🥈 추천 2순위',
    badgeLabel: '⚡ 추천 2순위 (도약)',
    tierTitle: '도약 & 실천 과업',
    tierSubtitle: '시야를 넓히고 영감과 지속 가능한 추진력을 얻는 도약 퀘스트',
    icon: '⚡',
    textColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25',
    cardBorder: 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_24px_rgba(245,158,11,0.1)]',
    cardBg: 'bg-gradient-to-r from-amber-950/25 via-zinc-950/40 to-transparent',
    leftStripe: 'from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]',
    dotColor: 'bg-amber-400',
    weight: 2,
  },
  low: {
    id: 'low',
    rankNumber: 3,
    label: '추천 3순위',
    rankBadge: '🥉 추천 3순위',
    badgeLabel: '🌿 추천 3순위 (회복)',
    tierTitle: '회복 & 웰니스 과업',
    tierSubtitle: '몸의 세포를 깨우고 따뜻한 연결과 평온한 안식을 선사하는 회복 퀘스트',
    icon: '🌿',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25',
    cardBorder: 'border-emerald-500/25 hover:border-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.08)]',
    cardBg: 'bg-gradient-to-r from-emerald-950/25 via-zinc-950/40 to-transparent',
    leftStripe: 'from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    dotColor: 'bg-emerald-400',
    weight: 1,
  },
};

export const PRIORITY_META: Record<string, { label: string; icon: string; textColor: string }> = {
  high: { label: '추천 1순위', icon: '🔥', textColor: 'text-rose-400' },
  medium: { label: '추천 2순위', icon: '⚡', textColor: 'text-amber-400' },
  low: { label: '추천 3순위', icon: '🌿', textColor: 'text-emerald-400' },
  essential: { label: '추천 1순위', icon: '🔥', textColor: 'text-rose-400' },
  growth: { label: '추천 2순위', icon: '⚡', textColor: 'text-amber-400' },
  healing: { label: '추천 3순위', icon: '🌿', textColor: 'text-emerald-400' },
};

export const AI_PRESET_MODES = [
  { id: 'balance', label: '균형 & 일상 리셋', icon: '⚖️', desc: '몸과 마음의 조화를 회복하는 하루' },
  { id: 'burnout', label: '피로 & 번아웃 치유', icon: '🔋', desc: '충전과 깊은 쉼에 집중하는 치유' },
  { id: 'focus', label: '초집중 & 실행력 돌파', icon: '⚡', desc: '미뤄둔 중요 일과 성과 창출 몰입' },
  { id: 'peace', label: '불안 해소 & 평온 회복', icon: '🌿', desc: '복잡한 잡념을 비우고 마음을 가라앉힘' },
  { id: 'creative', label: '영감 & 창의적 창작', icon: '🎨', desc: '예술과 직관, 새로운 발상 깨우기' },
];

export const INITIAL_CURATED_MISSIONS: Omit<MissionItem, 'completed'>[] = [
  // 🥇 추천 1순위 (최우선 골든 핵심 과업)
  {
    id: 'mission-mind-1',
    title: '아침 3분 호흡 명상으로 신경계 안정화하기',
    description: '4초 들숨, 4초 멈춤, 4초 날숨(박스 호흡)을 5회 반복하며 하루의 내면 중심을 단단히 세웁니다.',
    category: 'mind',
    priority: 'high',
    estimatedMinutes: 3,
    recommendReason: '기상 직후 미주신경 안정 및 코르티솔 조절 최우선',
    actionHint: 'eCPR 호흡 가이드로 이동',
    actionRoute: '/ecpr',
  },
  {
    id: 'mission-action-1',
    title: '가장 미뤄온 핵심 과업 1개 선정 후 25분 몰입 시작하기',
    description: '작은 완성이 주는 성취감이 도파민을 깨웁니다. 완벽주의를 내려놓고 첫 25분을 온전히 쏟아보세요.',
    category: 'action',
    priority: 'high',
    estimatedMinutes: 25,
    recommendReason: '하루 중 가장 높은 뇌 집중도 시간대 골든 과업 완수',
    actionHint: '25분 몰입 집중',
  },
  // 🥈 추천 2순위 (도약 & 실천 과업)
  {
    id: 'mission-wisdom-1',
    title: '오늘의 우주 운명 타로 카드 1장 뽑고 마음에 품기',
    description: 'Universe 탭에서 우주적 기운과 상징을 조망하여, 오늘 마주할 선택의 나침반을 얻습니다.',
    category: 'wisdom',
    priority: 'medium',
    estimatedMinutes: 3,
    recommendReason: '하루 선택의 갈림길에서 우주적 통찰과 나침반 획득',
    actionHint: 'Universe 탭 바로가기',
    actionRoute: '/universe',
  },
  {
    id: 'mission-routine-1',
    title: '오후 15분 디지털 디톡스 & 주변 공간 미니멀 정돈',
    description: '책상과 시각적 잡음을 정리하고 잠시 화면을 멀리하여 오후 후반부의 집중력 저하를 방어합니다.',
    category: 'action',
    priority: 'medium',
    estimatedMinutes: 15,
    recommendReason: '시각적 잡음 제거를 통한 후반부 집중력 및 에너지 재충전',
    actionHint: '15분 공간 정돈',
  },
  // 🥉 추천 3순위 (회복 & 웰니스 과업)
  {
    id: 'mission-body-1',
    title: '맑은 미온수 2잔 천천히 음미 및 10분 가벼운 햇빛 산책',
    description: '밤새 잠들어 있던 림프 순환과 장기를 깨우고, 자연광을 쬐어 낮 시간 활력 세로토닌을 충전합니다.',
    category: 'action',
    priority: 'low',
    estimatedMinutes: 10,
    recommendReason: '체내 림프 순환 활성화 및 세로토닌 합성 지원',
    actionHint: '햇빛 & 미온수 충전',
  },
  {
    id: 'mission-gratitude-1',
    title: '소중한 이에게 온기 건네기 & 잠들기 전 3가지 감사 기록',
    description: '외부로 전한 온기는 나의 결핍을 채웁니다. 잠들기 전 사소하게 감사했던 3가지를 마음에 새기세요.',
    category: 'gratitude',
    priority: 'low',
    estimatedMinutes: 5,
    recommendReason: '옥시토신 분비 및 깊은 숙면을 유도하는 심리적 이완',
    actionHint: '감사 명상',
  },
];

function getKstDateKey(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch (_) {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }
}

function getKstFormattedDate(): string {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date());
  } catch (_) {
    return new Date().toLocaleDateString('ko-KR');
  }
}

export function PrologueTodoSection() {
  const [, navigate] = useLocation();
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  const todayKey = useMemo(() => getKstDateKey(), []);
  const todayFormatted = useMemo(() => getKstFormattedDate(), []);

  // Storage keys & helpers
  const legacyStorageKey = `prologue_daily_todos_${todayKey}`;
  const MASTER_STORAGE_KEY = 'prologue_todo_missions_v1';

  // Load from localStorage safely
  const initialLoadResult = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        missions: INITIAL_CURATED_MISSIONS.map(m => ({ ...m, completed: false })),
        savedTime: '방금 전',
      };
    }
    try {
      // 1. Try master storage key
      const masterRaw = localStorage.getItem(MASTER_STORAGE_KEY);
      if (masterRaw) {
        const parsed = JSON.parse(masterRaw);
        if (parsed && Array.isArray(parsed.missions) && parsed.missions.length > 0) {
          let timeLabel = '방금 전';
          if (parsed.lastSavedAt) {
            try {
              timeLabel = new Date(parsed.lastSavedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            } catch (_) {}
          }
          if (parsed.date === todayKey) {
            const enriched = parsed.missions.map((m: MissionItem) => {
              const curated = INITIAL_CURATED_MISSIONS.find(c => c.id === m.id);
              return {
                ...m,
                recommendReason: m.recommendReason || curated?.recommendReason || (normalizePriority(m.priority) === 'high' ? '최우선 골든 과업' : normalizePriority(m.priority) === 'medium' ? '도약 & 실천 과업' : '회복 & 웰니스 과업'),
              };
            });
            return { missions: enriched, savedTime: timeLabel };
          } else {
            // Carry over user custom or in-progress tasks to new day
            const customOrActive = parsed.missions.filter((m: MissionItem) => m.isCustom || !m.completed);
            const freshCurated = INITIAL_CURATED_MISSIONS.map(m => ({ ...m, completed: false }));
            const existingIds = new Set(customOrActive.map((m: MissionItem) => m.id));
            const additions = freshCurated.filter(m => !existingIds.has(m.id));
            const merged = [...customOrActive, ...additions];
            const enriched = merged.map((m: MissionItem) => {
              const curated = INITIAL_CURATED_MISSIONS.find(c => c.id === m.id);
              return {
                ...m,
                recommendReason: m.recommendReason || curated?.recommendReason,
              };
            });
            return { missions: enriched, savedTime: '오늘 날짜로 동기화됨' };
          }
        }
      }

      // 2. Try date-keyed legacy storage
      const legacyRaw = localStorage.getItem(legacyStorageKey);
      if (legacyRaw) {
        const parsedLegacy = JSON.parse(legacyRaw);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          return { missions: parsedLegacy, savedTime: '로컬 데이터 복원됨' };
        }
      }
    } catch (e) {
      console.warn('[PrologueTodo] Failed to load missions from localStorage:', e);
    }

    return {
      missions: INITIAL_CURATED_MISSIONS.map(m => ({ ...m, completed: false })),
      savedTime: '새로 생성됨',
    };
  }, [todayKey, legacyStorageKey]);

  // Missions state initialized from localStorage
  const [missions, setMissions] = useState<MissionItem[]>(initialLoadResult.missions);
  const [lastSavedTime, setLastSavedTime] = useState<string>(initialLoadResult.savedTime);
  const [saveSuccessFlash, setSaveSuccessFlash] = useState(false);

  // Synchronous localStorage saver
  const saveToLocalStorage = useCallback((missionsToSave: MissionItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      const nowIso = new Date().toISOString();
      const payload = {
        date: todayKey,
        missions: missionsToSave,
        lastSavedAt: nowIso,
      };
      const serialized = JSON.stringify(payload);
      localStorage.setItem(MASTER_STORAGE_KEY, serialized);
      localStorage.setItem(legacyStorageKey, JSON.stringify(missionsToSave));

      const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeStr);
      setSaveSuccessFlash(true);
      setTimeout(() => setSaveSuccessFlash(false), 2000);

      // Multi-tab broadcast
      window.dispatchEvent(new CustomEvent('prologue_todo_storage_sync', {
        detail: { date: todayKey, missions: missionsToSave, lastSavedAt: nowIso }
      }));

      // Cloud Real-Time Auto-Sync across devices (PC <-> Mobile)
      try {
        void updateSharedState({
          todoMissions: payload,
        }, 'prologue_todo');
      } catch (_) {}
    } catch (e) {
      console.warn('[PrologueTodo] Error saving missions to localStorage:', e);
    }
  }, [todayKey, legacyStorageKey, updateSharedState]);

  // Helper to update state and immediately persist
  const updateAndSaveMissions = useCallback((updater: MissionItem[] | ((prev: MissionItem[]) => MissionItem[])) => {
    setMissions(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToLocalStorage(next);
      return next;
    });
  }, [saveToLocalStorage]);

  // Keep localStorage synced on missions change
  useEffect(() => {
    saveToLocalStorage(missions);
  }, [missions, saveToLocalStorage]);

  // Synchronize across multiple browser tabs / windows and cross-device realtime cloud
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if ((e.key === MASTER_STORAGE_KEY || e.key === legacyStorageKey) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const newMissionsList = Array.isArray(parsed) ? parsed : parsed?.missions;
          if (Array.isArray(newMissionsList) && newMissionsList.length > 0) {
            setMissions(newMissionsList);
            if (parsed.lastSavedAt) {
              setLastSavedTime(new Date(parsed.lastSavedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
            }
          }
        } catch (_) {}
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail.missions)) {
        setMissions(customEvent.detail.missions);
        if (customEvent.detail.lastSavedAt) {
          setLastSavedTime(new Date(customEvent.detail.lastSavedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('prologue_todo_storage_sync', handleCustomSync);
    window.addEventListener('prism:todo_updated', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('prologue_todo_storage_sync', handleCustomSync);
      window.removeEventListener('prism:todo_updated', handleCustomSync);
    };
  }, [legacyStorageKey]);

  // Ensure save on beforeunload (page refresh / close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage(missions);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [missions, saveToLocalStorage]);

  // Streak state
  const [streakData, setStreakData] = useState<MissionStreakData>(() => {
    try {
      const saved = localStorage.getItem('prologue_mission_streak');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return { lastCompletedDate: '', streakCount: 1 };
  });

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MissionCategory>('custom');
  const [newPriority, setNewPriority] = useState<NormalizedPriority>('high');
  const [newMinutes, setNewMinutes] = useState<number>(10);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // AI Mission generator state
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPreset, setAiPreset] = useState<string>('balance');
  const [aiCustomInput, setAiCustomInput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Filtering & Sorting (추천순위 우선 기본 정렬 및 그룹 뷰 기본값)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | NormalizedPriority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('priority-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');

  // TTS audio briefing state
  const isTTSPlayingGlobal = useTTSActive();
  const [isBriefingPlaying, setIsBriefingPlaying] = useState(false);

  // Copy status
  const [copied, setCopied] = useState(false);

  // Derived progress calculations
  const totalCount = missions.length;
  const completedCount = useMemo(() => missions.filter(m => m.completed).length, [missions]);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Counts and stats by recommended priority tier
  const priorityStats = useMemo(() => {
    const stats: Record<NormalizedPriority, { total: number; completed: number; active: number }> = {
      high: { total: 0, completed: 0, active: 0 },
      medium: { total: 0, completed: 0, active: 0 },
      low: { total: 0, completed: 0, active: 0 },
    };
    missions.forEach(m => {
      const norm = normalizePriority(m.priority);
      stats[norm].total += 1;
      if (m.completed) {
        stats[norm].completed += 1;
      } else {
        stats[norm].active += 1;
      }
    });
    return stats;
  }, [missions]);

  // Backward compatibility priority counts
  const priorityCounts = useMemo(() => {
    return {
      high: priorityStats.high.total,
      medium: priorityStats.medium.total,
      low: priorityStats.low.total,
    };
  }, [priorityStats]);

  // Streak update when all completed
  useEffect(() => {
    if (isAllCompleted) {
      try {
        const todayStr = getKstDateKey();
        if (streakData.lastCompletedDate !== todayStr) {
          const prevDate = new Date();
          prevDate.setDate(prevDate.getDate() - 1);
          const yesterdayKey = prevDate.toISOString().split('T')[0];

          const newStreak = streakData.lastCompletedDate === yesterdayKey 
            ? streakData.streakCount + 1 
            : Math.max(1, streakData.streakCount);

          const updated: MissionStreakData = {
            lastCompletedDate: todayStr,
            streakCount: newStreak,
          };
          setStreakData(updated);
          localStorage.setItem('prologue_mission_streak', JSON.stringify(updated));

          recordPrismFeature({
            app: 'hub',
            featureName: 'Prologue Daily Mission All Clear',
            summary: `오늘의 모든 미션(${totalCount}개) 올클리어 달성! (연속 ${newStreak}일 스트릭)`,
            details: { streak: newStreak, totalCount },
          });
        }
      } catch (_) {}
    }
  }, [isAllCompleted, streakData, totalCount]);

  // Toggle mission completion
  const handleToggleMission = (id: string) => {
    updateAndSaveMissions(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextCompleted = !m.completed;
          return {
            ...m,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return m;
      })
    );
  };

  // Change priority of an existing mission
  const handleChangePriority = (id: string, nextPriority: NormalizedPriority) => {
    updateAndSaveMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, priority: nextPriority } : m))
    );
  };

  // Cycle priority on click (high -> medium -> low -> high)
  const handleCyclePriority = (id: string, currentPriority: MissionPriority) => {
    const norm = normalizePriority(currentPriority);
    const nextOrder: Record<NormalizedPriority, NormalizedPriority> = {
      high: 'medium',
      medium: 'low',
      low: 'high',
    };
    handleChangePriority(id, nextOrder[norm]);
  };

  // Add custom mission
  const handleAddMission = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return;

    const newItem: MissionItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: cleanTitle,
      category: newCategory,
      priority: newPriority,
      estimatedMinutes: Number(newMinutes) || 10,
      completed: false,
      isCustom: true,
      recommendReason: newPriority === 'high' ? '직접 등록한 오늘 최우선 골든 과업' : newPriority === 'medium' ? '직접 등록한 도약 & 실천 과업' : '직접 등록한 웰니스 & 여유 과업',
    };

    updateAndSaveMissions(prev => [newItem, ...prev]);
    setNewTitle('');
    setIsAddFormOpen(false);
  };

  // Delete mission
  const handleDeleteMission = (id: string) => {
    updateAndSaveMissions(prev => prev.filter(m => m.id !== id));
  };

  // Reset to default curated missions
  const handleResetToDefault = () => {
    if (window.confirm('ToDo 목록을 추천순위별 기본 큐레이션으로 초기화하시겠습니까?')) {
      const reset = INITIAL_CURATED_MISSIONS.map(m => ({ ...m, completed: false }));
      updateAndSaveMissions(reset);
    }
  };

  // Clear completed missions
  const handleClearCompleted = () => {
    if (window.confirm('완료된 미션 항목들을 목록에서 정리하시겠습니까?')) {
      updateAndSaveMissions(prev => prev.filter(m => !m.completed));
    }
  };

  // Manual save trigger for instant verification
  const handleManualSave = () => {
    saveToLocalStorage(missions);
  };

  // AI Personalized Mission Generation (추천 1·2·3순위 구조화 생성)
  const handleGenerateAiMissions = async () => {
    setIsGeneratingAi(true);
    try {
      const selectedModeObj = AI_PRESET_MODES.find(m => m.id === aiPreset);
      const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
      const userName = (rawNick && rawNick !== '여행자' && rawNick !== '사용자') ? rawNick : '제제';

      const prompt = `당신은 사용자의 웰니스, 마음챙김, 생산성, 영혼 성장을 돕는 라이프 퀘스트 마스터 AI입니다.
아래 조건에 따라 오늘 하루 실천할 수 있는 현실적이고 매력적인 데일리 미션 3개를 '추천 순위별(1순위: 최우선 핵심, 2순위: 도약 실천, 3순위: 회복 웰니스)'로 JSON 형식으로 생성하세요.

[사용자 정보]
- 이름/닉네임: ${userName}
- 선택된 집중 모드: ${selectedModeObj?.label} (${selectedModeObj?.desc})
- 사용자 직접 작성한 상황/고민: ${aiCustomInput.trim() || '없음 (집중 모드에 맞춰 생성)'}
- 현재 날짜: ${todayFormatted}

[미션 요구사항]
1. 반드시 3개의 미션을 각각 추천 1순위('high'), 추천 2순위('medium'), 추천 3순위('low')로 배분하여 반환하세요:
   - 1순위 (priority: 'high'): 오늘 가장 먼저 완수해야 할 집중도 최고조의 최우선 골든 퀘스트
   - 2순위 (priority: 'medium'): 성취감과 리듬, 창의적 통찰을 넓히는 도약 퀘스트
   - 3순위 (priority: 'low'): 몸의 긴장을 풀고 감사와 평온을 회복하는 웰니스 퀘스트
2. 소요 시간은 3분~30분 이내로 부담 없이 실행 가능해야 합니다.
3. category는 'mind', 'action', 'wisdom', 'gratitude' 중 하나여야 합니다.
4. recommendReason에는 해당 미션이 이 순위로 추천된 이유를 1문장으로 명시하세요.
5. 반드시 순수한 JSON 배열만 반환하세요:
[
  {
    "title": "미션 제목 (간결하고 명확하게)",
    "description": "실천 방법 및 마인드셋 팁 (1~2문장)",
    "category": "mind" | "action" | "wisdom" | "gratitude",
    "priority": "high" | "medium" | "low",
    "estimatedMinutes": 5,
    "recommendReason": "추천 사유 (1문장)",
    "actionHint": "간단한 팁"
  }
]`;

      const res = await invokeLLM({
        messages: [{ role: 'user', content: prompt }],
        responseFormat: { type: 'json_object' },
      });

      let parsed: any[] = [];
      try {
        const jsonMatch = res.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = JSON.parse(res);
        }
      } catch (err) {
        console.warn('AI mission parse error, using fallback:', err);
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        const generatedMissions: MissionItem[] = parsed.map((item, idx) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: String(item.title || '새로운 데일리 퀘스트'),
          description: item.description ? String(item.description) : undefined,
          category: (['mind', 'action', 'wisdom', 'gratitude'].includes(item.category) ? item.category : 'action') as MissionCategory,
          priority: normalizePriority(item.priority),
          estimatedMinutes: Number(item.estimatedMinutes) || 10,
          completed: false,
          isCustom: true,
          recommendReason: item.recommendReason ? String(item.recommendReason) : 'AI 맞춤 추천 순위 지정',
          actionHint: item.actionHint ? String(item.actionHint) : 'AI 맞춤 추천 미션',
        }));

        updateAndSaveMissions(prev => [...generatedMissions, ...prev]);
        setIsAiPanelOpen(false);
        setAiCustomInput('');

        recordPrismFeature({
          app: 'hub',
          featureName: 'Prologue AI Mission Synthesizer',
          summary: `AI 맞춤 데일리 미션 ${generatedMissions.length}개 생성 완료 (${selectedModeObj?.label})`,
          details: { mode: selectedModeObj?.label, count: generatedMissions.length },
        });
      }
    } catch (e) {
      console.error('Failed to generate AI missions:', e);
      alert('AI 미션 생성 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Audio TTS Briefing (추천 순위별 체계적 낭독)
  const handleToggleAudioBriefing = () => {
    if (isBriefingPlaying || isTTSPlayingGlobal) {
      stopTTS();
      setIsBriefingPlaying(false);
      return;
    }

    const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
    const userName = (rawNick && rawNick !== '여행자' && rawNick !== '당신') ? rawNick : '제제';
    const pendingCount = totalCount - completedCount;

    const tier1 = missions.filter(m => normalizePriority(m.priority) === 'high' && !m.completed);
    const tier2 = missions.filter(m => normalizePriority(m.priority) === 'medium' && !m.completed);
    const tier3 = missions.filter(m => normalizePriority(m.priority) === 'low' && !m.completed);

    let briefingText = `안녕하세요, ${userName}님. 오늘 ${todayFormatted}의 추천순위별 ToDo 오디오 브리핑입니다. ` +
      `준비된 총 ${totalCount}개의 퀘스트 중, 현재 ${completedCount}개를 달성하셨고 ${pendingCount}개의 퀘스트가 남아있습니다. `;

    if (pendingCount > 0) {
      if (tier1.length > 0) {
        briefingText += `가장 먼저 오늘 반드시 완수해야 할 추천 1순위 핵심 과업은, ${tier1.map(m => m.title).join(', ')} 입니다. `;
      }
      if (tier2.length > 0) {
        briefingText += `이어서 일상의 도약과 실행을 이끄는 추천 2순위 과업은, ${tier2.map(m => m.title).join(', ')} 입니다. `;
      }
      if (tier3.length > 0) {
        briefingText += `마지막으로 몸과 마음의 안식을 채우는 추천 3순위 회복 과업은, ${tier3.map(m => m.title).join(', ')} 입니다. `;
      }
    } else {
      briefingText += `축하합니다! 오늘의 모든 추천 미션을 올클리어하셨습니다. 성취의 기쁨을 온전히 누리세요. `;
    }

    briefingText += `조급해하지 마시고, 지금 이 순간 할 수 있는 가장 작은 호흡과 걸음 하나에 집중하세요. 오늘도 우주의 온기와 평온이 함께합니다.`;

    setIsBriefingPlaying(true);
    playTTS(briefingText, 'Kore', false, '확신');
  };

  // Copy list to clipboard (추천순위별 깔끔한 그룹 포맷팅)
  const handleCopyList = () => {
    const tier1 = missions.filter(m => normalizePriority(m.priority) === 'high');
    const tier2 = missions.filter(m => normalizePriority(m.priority) === 'medium');
    const tier3 = missions.filter(m => normalizePriority(m.priority) === 'low');

    const formatTier = (title: string, items: MissionItem[]) => {
      if (items.length === 0) return '';
      return `${title}\n` + items.map(m => {
        return `${m.completed ? '✅' : '⬜'} [${m.completed ? '완료' : '진행'}] ${m.title}${m.estimatedMinutes ? ` (${m.estimatedMinutes}분)` : ''}${m.recommendReason ? ` - 💡 ${m.recommendReason}` : ''}\n   └ ${m.description || '목표를 향해 나아갑니다.'}`;
      }).join('\n') + '\n\n';
    };

    const listText = `[📅 ${todayFormatted} ToDo - 추천순위별 리포트]\n` +
      `전체 달성률: ${completedCount}/${totalCount} (${progressPercent}%)\n\n` +
      formatTier('🥇 [추천 1순위: 최우선 핵심 과업]', tier1) +
      formatTier('🥈 [추천 2순위: 도약 & 실천 과업]', tier2) +
      formatTier('🥉 [추천 3순위: 회복 & 웰니스 과업]', tier3) +
      `- LucKey PROLOGUE ToDo`;

    navigator.clipboard.writeText(listText.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Filtered & Sorted list (추천 순위 기반 랭킹 정렬 보장)
  const filteredMissions = useMemo(() => {
    let list = missions.filter(m => {
      // Status filter
      if (statusFilter === 'active' && m.completed) return false;
      if (statusFilter === 'completed' && !m.completed) return false;

      // Category filter
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

      // Priority filter
      if (priorityFilter !== 'all') {
        const itemNorm = normalizePriority(m.priority);
        if (itemNorm !== priorityFilter) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'priority-desc') {
      list = [...list].sort((a, b) => {
        const wa = PRIORITY_CONFIG[normalizePriority(a.priority)].weight;
        const wb = PRIORITY_CONFIG[normalizePriority(b.priority)].weight;
        if (wb !== wa) return wb - wa; // 3 (1순위) -> 2 (2순위) -> 1 (3순위)
        return Number(a.completed) - Number(b.completed); // 미완료 우선
      });
    } else if (sortBy === 'priority-asc') {
      list = [...list].sort((a, b) => {
        const wa = PRIORITY_CONFIG[normalizePriority(a.priority)].weight;
        const wb = PRIORITY_CONFIG[normalizePriority(b.priority)].weight;
        if (wa !== wb) return wa - wb; // 1 (3순위) -> 2 (2순위) -> 3 (1순위)
        return Number(a.completed) - Number(b.completed);
      });
    } else if (sortBy === 'time-asc') {
      list = [...list].sort((a, b) => (a.estimatedMinutes || 0) - (b.estimatedMinutes || 0));
    } else if (sortBy === 'default') {
      // 기본 등록순에서도 미완료 상태 및 추천 가중치를 유지
      list = [...list].sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return list;
  }, [missions, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Grouped Tiers for Tiered View Mode
  const groupedTiers = useMemo(() => {
    const tiers: {
      priority: NormalizedPriority;
      config: typeof PRIORITY_CONFIG['high'];
      items: MissionItem[];
    }[] = [
      { priority: 'high', config: PRIORITY_CONFIG.high, items: [] },
      { priority: 'medium', config: PRIORITY_CONFIG.medium, items: [] },
      { priority: 'low', config: PRIORITY_CONFIG.low, items: [] },
    ];

    filteredMissions.forEach(item => {
      const norm = normalizePriority(item.priority);
      const target = tiers.find(t => t.priority === norm);
      if (target) target.items.push(item);
    });

    if (priorityFilter !== 'all') {
      return tiers.filter(t => t.priority === priorityFilter);
    }
    return tiers;
  }, [filteredMissions, priorityFilter]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 text-white font-sans">
      
      {/* 🌟 Top Hero Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] p-6 sm:p-9 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-950/90 to-purple-950/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-indigo-300 font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-400" />
                {todayFormatted}
              </span>
              <span className="text-white/30" aria-hidden="true">·</span>
              <span className="text-amber-300 font-mono text-[11px] flex items-center gap-1">
                <Flame size={12} className="text-amber-400 animate-pulse" />
                {streakData.streakCount}일 연속 달성 중
              </span>
              <span className="text-white/30" aria-hidden="true">·</span>
              <div 
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono text-[11px]"
                title="모든 ToDo와 진행 상태가 브라우저의 localStorage에 자동 저장되어 새로고침해도 안전하게 유지됩니다."
              >
                <HardDrive size={11} className={saveSuccessFlash ? 'text-emerald-300 animate-bounce' : 'text-emerald-400'} />
                <span>localStorage 동기화</span>
                <span className="text-emerald-200/50 text-[10px]">({lastSavedTime})</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <ListTodo className="text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]" size={28} />
              <span>ToDo</span>
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/70 max-w-xl leading-relaxed">
              몸과 마음, 영혼의 성장을 이끄는 오늘의 실천 ToDo. 작은 실행 하나가 하루의 에너지와 우주적 통찰을 완성합니다.
            </p>
          </div>

          {/* Quick Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleAudioBriefing}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer ${
                isBriefingPlaying || isTTSPlayingGlobal
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
              title="ToDo 오디오 브리핑 안내"
            >
              {isBriefingPlaying || isTTSPlayingGlobal ? (
                <>
                  <VolumeX size={15} />
                  <span>오디오 정지</span>
                </>
              ) : (
                <>
                  <Volume2 size={15} className="text-indigo-300" />
                  <span>오늘의 브리핑</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyList}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 transition-all cursor-pointer"
              title="미션 목록 복사하기"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? '복사됨' : '복사'}</span>
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-1.5 border transition-all cursor-pointer ${
                saveSuccessFlash 
                  ? 'bg-emerald-600/30 text-emerald-200 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
              title="현재 미션 상태를 브라우저 localStorage에 즉시 저장합니다 (새로고침 시 유지)"
            >
              <Save size={14} className={saveSuccessFlash ? 'text-emerald-300 animate-pulse' : 'text-white/60'} />
              <span>{saveSuccessFlash ? '저장됨' : '저장'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Progress Bar & Streak Status Banner */}
      <div className="p-5 sm:p-6 rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
              {isAllCompleted ? (
                <Award size={22} className="text-amber-400 animate-bounce" />
              ) : (
                <Zap size={20} className="text-indigo-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">오늘의 퀘스트 달성률</span>
                <span className="text-xs font-mono font-bold text-indigo-300">{completedCount}/{totalCount} 완료</span>
              </div>
              <p className="text-[11px] text-white/50">
                {isAllCompleted
                  ? '🎉 오늘의 모든 미션을 완벽히 올클리어하셨습니다! 빛나는 성취를 축하합니다.'
                  : `${totalCount - completedCount}개의 퀘스트가 남아있습니다. 한 걸음씩 실행해보세요.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-300">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="w-full h-3 rounded-full bg-black/50 overflow-hidden border border-white/10 relative p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full relative overflow-hidden ${
              isAllCompleted
                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 shadow-[0_0_16px_rgba(251,191,36,0.7),0_0_28px_rgba(244,63,94,0.35)]'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 shadow-[0_0_14px_rgba(99,102,241,0.65),0_0_24px_rgba(168,85,247,0.35)]'
            }`}
          >
            {/* Subtle traveling light shimmer */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
            />
            {/* Radiant leading edge glow bead */}
            {progressPercent > 0 && progressPercent < 100 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_14px_rgba(199,210,254,0.9)]" />
            )}
          </motion.div>
        </div>

        {/* Celebration Banner when 100% complete */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between gap-3 text-xs text-amber-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌟</span>
                <div>
                  <strong className="font-bold text-amber-300 block">오늘의 우주 마스터 배지 획득!</strong>
                  <span>오늘 하루의 모든 퀘스트를 성공적으로 마쳤습니다. 오늘의 기운과 통찰이 당신을 밝혀줍니다.</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/30 text-[11px] font-bold text-amber-200 shrink-0">
                +15 Vitality
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ⚡ Action Bar: AI 맞춤 미션 생성 & 새 미션 추가 토글 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            isAiPanelOpen
              ? 'bg-indigo-500/20 border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Sparkles size={18} className="text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">AI 맞춤형 데일리 퀘스트 생성</span>
              <span className="text-[10px] text-white/50">내 컨디션과 고민에 맞춘 고유 미션 3개 주조</span>
            </div>
          </div>
          {isAiPanelOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </button>

        <button
          type="button"
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            isAddFormOpen
              ? 'bg-emerald-500/20 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Plus size={18} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">나만의 ToDo & 미션 직접 추가</span>
              <span className="text-[10px] text-white/50">오늘 완수하고 싶은 개인 목표 즉시 등록</span>
            </div>
          </div>
          {isAddFormOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </button>
      </div>

      {/* 🤖 Expandable AI Generator Panel */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-[28px] border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-950/90 to-black p-5 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                <span>오늘 하루 집중하고 싶은 테마를 선택하세요</span>
              </h3>
              <span className="text-[10px] text-white/40 font-mono">Gemini AI Engine</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AI_PRESET_MODES.map(mode => {
                const isSelected = aiPreset === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setAiPreset(mode.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/30 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="text-lg mb-1">{mode.icon}</div>
                    <div className="text-xs font-bold break-keep break-words">{mode.label}</div>
                    <div className="text-[10px] text-white/40 break-keep break-words whitespace-normal mt-0.5">{mode.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Notes Input */}
            <div>
              <label className="block text-[11px] text-white/60 mb-2">
                오늘 겪고 있는 고민이나 특별히 도전하고 싶은 상황이 있다면 적어주세요 (선택):
              </label>
              <input
                type="text"
                value={aiCustomInput}
                onChange={e => setAiCustomInput(e.target.value)}
                placeholder="예: 중요한 발표를 앞두고 있어서 마인드셋을 다잡고 싶어요..."
                className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400 transition-all font-sans"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleGenerateAiMissions}
              disabled={isGeneratingAi}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <RotateCcw size={16} className="animate-spin text-white" />
                  <span>맞춤형 데일리 퀘스트 주조 중...</span>
                </>
              ) : (
                <>
                  <Zap size={16} className="text-amber-300" />
                  <span>✨ 맞춤형 데일리 미션 3개 생성하여 추가하기</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✍️ Expandable Custom ToDo Form */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-[28px] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-950/90 to-black p-5 sm:p-7 space-y-4"
          >
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Plus size={16} className="text-emerald-400" />
              <span>새로운 나만의 ToDo 미션 등록</span>
            </h3>

            <form onSubmit={handleAddMission} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="오늘 완수할 구체적인 행동이나 할 일을 입력하세요 (예: 책 20페이지 독서)"
                  className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition-all font-sans"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category select */}
                <div>
                  <label className="block text-[10px] text-white/50 mb-1.5 font-mono">카테고리</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as MissionCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="custom">✍️ 나만의 ToDo</option>
                    <option value="action">⚡ 실행 & 과업</option>
                    <option value="mind">🧘 마음챙김</option>
                    <option value="wisdom">🌌 지혜 & 통찰</option>
                    <option value="gratitude">🕊️ 감사 & 관계</option>
                  </select>
                </div>

                {/* Priority select */}
                <div>
                  <label className="block text-[10px] text-white/50 mb-1.5 font-mono">추천 우선순위</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as NormalizedPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="high">🥇 추천 1순위 (최우선 골든 핵심)</option>
                    <option value="medium">🥈 추천 2순위 (도약 & 일상 실천)</option>
                    <option value="low">🥉 추천 3순위 (회복 & 웰니스 리셋)</option>
                  </select>
                </div>

                {/* Estimated Minutes */}
                <div>
                  <label className="block text-[10px] text-white/50 mb-1.5 font-mono">예상 소요 시간</label>
                  <select
                    value={newMinutes}
                    onChange={e => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value={3}>3분 (빠른 실행)</option>
                    <option value={5}>5분</option>
                    <option value={10}>10분</option>
                    <option value={20}>20분</option>
                    <option value={30}>30분 (깊은 몰입)</option>
                    <option value={60}>1시간</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-40 cursor-pointer"
                >
                  + 미션 추가하기
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 추천순위별 현황 & 빠른 선택 카드 (추천순위 개편 핵심 UI) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/70 flex items-center gap-1.5 font-sans">
            <Award size={14} className="text-amber-400" />
            <span>오늘의 추천순위별 과업 현황</span>
          </span>
          <span className="text-[11px] text-white/40 font-mono">
            {priorityFilter !== 'all' ? `${PRIORITY_CONFIG[priorityFilter].label} 필터 적용 중` : '모든 추천순위 표시'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(['high', 'medium', 'low'] as NormalizedPriority[]).map((tierKey) => {
            const conf = PRIORITY_CONFIG[tierKey];
            const stats = priorityStats[tierKey];
            const isSelected = priorityFilter === tierKey;
            const tierPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const isTierDone = stats.total > 0 && stats.completed === stats.total;

            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => setPriorityFilter(isSelected ? 'all' : tierKey)}
                className={`p-3.5 sm:p-4 rounded-[22px] border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${conf.cardBorder} ${conf.cardBg} shadow-[0_0_24px_rgba(255,255,255,0.08)] scale-[1.01]`
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{conf.rankNumber === 1 ? '🥇' : conf.rankNumber === 2 ? '🥈' : '🥉'}</span>
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{conf.rankBadge}</span>
                        {isTierDone && (
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                            올클리어
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-white/50">{conf.tierTitle}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white">
                      {stats.completed}/{stats.total}
                    </span>
                    <span className="block text-[10px] font-mono text-white/40">
                      {tierPercent}%
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden mt-3 border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${conf.leftStripe}`}
                    style={{ width: `${tierPercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🗂️ Filter Tabs & View Mode & Sort Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
            {[
              { id: 'all', label: `전체 (${totalCount})` },
              { id: 'active', label: `진행 중 (${totalCount - completedCount})` },
              { id: 'completed', label: `완료 (${completedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle & Sort Selector & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Grouped Tier vs Ranked List */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
                title="추천순위별로 묶어보기"
              >
                <Layers size={13} />
                <span>추천그룹별</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ranked')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'ranked'
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
                title="추천순위 번호순 랭킹 리스트로 보기"
              >
                <ListOrdered size={13} />
                <span>랭킹 리스트</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/80 hover:border-white/20 transition-all">
                <ArrowUpDown size={12} className="text-indigo-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs text-white/90 focus:outline-none cursor-pointer pr-1"
                  aria-label="ToDo 정렬"
                >
                  <option value="priority-desc" className="bg-zinc-900 text-rose-300 font-bold">🌟 추천순위 높은 순</option>
                  <option value="priority-asc" className="bg-zinc-900 text-emerald-300">🌿 추천순위 낮은 순</option>
                  <option value="time-asc" className="bg-zinc-900 text-amber-300">⏱️ 소요 시간 짧은 순</option>
                  <option value="default" className="bg-zinc-900 text-white">📋 기본 등록순</option>
                </select>
              </div>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleClearCompleted}
                className="text-[11px] text-white/40 hover:text-red-300 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                title="완료된 항목 정리"
              >
                <Trash2 size={12} />
                <span>완료 항목 정리</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] text-white/40 hover:text-indigo-300 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              title="기본 큐레이션으로 초기화"
            >
              <RotateCcw size={12} />
              <span>기본 미션 리셋</span>
            </button>
          </div>
        </div>

        {/* Priority Quick Filter Row */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-white/40 flex items-center gap-1 mr-1 font-mono">
            <Filter size={11} className="text-indigo-400" />
            우선순위 필터:
          </span>
          <button
            type="button"
            onClick={() => setPriorityFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              priorityFilter === 'all'
                ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                : 'bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('high')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              priorityFilter === 'high'
                ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-rose-500/10 text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/20'
            }`}
          >
            <span>🥇 1순위</span>
            <span className="font-mono text-[10px] opacity-80">({priorityCounts.high})</span>
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('medium')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              priorityFilter === 'medium'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-amber-500/10 text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
            }`}
          >
            <span>🥈 2순위</span>
            <span className="font-mono text-[10px] opacity-80">({priorityCounts.medium})</span>
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('low')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              priorityFilter === 'low'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            <span>🥉 3순위</span>
            <span className="font-mono text-[10px] opacity-80">({priorityCounts.low})</span>
          </button>
        </div>
      </div>

      {/* 📋 Mission Items List & Tier Display */}
      {filteredMissions.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.01] space-y-3">
          <span className="text-3xl block">🍃</span>
          <p className="text-xs text-white/50">
            {priorityFilter !== 'all' 
              ? `'${PRIORITY_CONFIG[priorityFilter].label}' 조건에 맞는 ToDo가 없습니다.` 
              : '해당 조건에 맞는 ToDo가 없습니다.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setPriorityFilter('all');
            }}
            className="text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            필터 초기화하기
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        /* 📑 Mode 1: 추천순위 그룹별 묶어보기 */
        <div className="space-y-6">
          {groupedTiers.map((tier) => {
            if (tier.items.length === 0 && priorityFilter !== 'all') return null;
            const tierTotal = tier.items.length;
            const tierCompleted = tier.items.filter(i => i.completed).length;

            return (
              <div key={tier.priority} className="space-y-3">
                {/* Tier Group Header Banner */}
                <div className={`p-4 rounded-[22px] border ${tier.config.cardBorder} ${tier.config.cardBg} backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${tier.config.badgeBg}`}>
                      {tier.config.rankNumber === 1 ? '🥇' : tier.config.rankNumber === 2 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{tier.config.rankBadge} · {tier.config.tierTitle}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${tier.config.badgeBg}`}>
                          {tierCompleted}/{tierTotal} 완료
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">{tier.config.tierSubtitle}</p>
                    </div>
                  </div>

                  {tierTotal > 0 && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-mono font-bold text-white/70">
                        달성률 {Math.round((tierCompleted / tierTotal) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Items in Tier */}
                {tier.items.length === 0 ? (
                  <div className="p-6 text-center rounded-[20px] border border-dashed border-white/10 bg-white/[0.01]">
                    <p className="text-xs text-white/40">이 추천순위 단계에 해당하는 ToDo가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {tier.items.map((item, idx) => {
                      const cat = CATEGORY_META[item.category] || CATEGORY_META.custom;
                      const normPri = normalizePriority(item.priority);
                      const priConfig = PRIORITY_CONFIG[normPri];

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`group relative p-4 sm:p-5 rounded-[24px] border transition-all duration-300 ${
                            item.completed
                              ? 'bg-white/[0.015] border-white/5 opacity-60'
                              : `${priConfig.cardBorder} ${priConfig.cardBg} shadow-lg backdrop-blur-sm`
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Priority Indicator Stripe */}
                            <div 
                              className={`w-1.5 self-stretch rounded-full bg-gradient-to-b ${priConfig.leftStripe} shrink-0 my-0.5 opacity-85 group-hover:opacity-100 transition-all`}
                              title={`추천순위: ${priConfig.rankBadge}`} 
                            />

                            {/* Interactive Checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleMission(item.id)}
                              className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                item.completed
                                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                                  : 'border-white/20 hover:border-indigo-400 bg-white/5 hover:bg-indigo-500/10 text-transparent'
                              }`}
                              aria-label={item.completed ? '미션 완료 해제' : '미션 완료 표시'}
                            >
                              <Check size={14} className={item.completed ? 'stroke-[3]' : 'opacity-0'} />
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0 space-y-1.5">
                              {/* Metadata Header */}
                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                {/* Priority selector badge */}
                                <div className="relative inline-flex items-center">
                                  <select
                                    value={normPri}
                                    onChange={e => {
                                      e.stopPropagation();
                                      handleChangePriority(item.id, e.target.value as NormalizedPriority);
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    className={`appearance-none text-[10.5px] font-bold px-2 py-0.5 pr-4 rounded-lg border transition-all cursor-pointer focus:outline-none ${priConfig.badgeBg}`}
                                    title="추천순위 변경 (클릭하여 1순위/2순위/3순위 선택)"
                                  >
                                    <option value="high" className="bg-zinc-900 text-rose-300 font-bold">🥇 추천 1순위 (핵심)</option>
                                    <option value="medium" className="bg-zinc-900 text-amber-300 font-bold">🥈 추천 2순위 (도약)</option>
                                    <option value="low" className="bg-zinc-900 text-emerald-300 font-bold">🥉 추천 3순위 (회복)</option>
                                  </select>
                                  <ChevronDown size={10} className="absolute right-1 pointer-events-none opacity-60 text-white" />
                                </div>

                                <span className="text-white/20" aria-hidden="true">·</span>
                                <span className={`font-medium ${cat.color}`}>
                                  {cat.icon} {cat.label}
                                </span>
                                {item.estimatedMinutes && (
                                  <>
                                    <span className="text-white/20" aria-hidden="true">·</span>
                                    <span className="text-white/40 flex items-center gap-1 font-mono text-[10px]">
                                      <Clock size={10} />
                                      {item.estimatedMinutes}분
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Task Title */}
                              <h4
                                onClick={() => handleToggleMission(item.id)}
                                className={`text-sm sm:text-base font-bold transition-all cursor-pointer leading-snug ${
                                  item.completed
                                    ? 'line-through text-white/40'
                                    : 'text-white group-hover:text-indigo-200'
                                }`}
                              >
                                {item.title}
                              </h4>

                              {/* Task Description */}
                              {item.description && (
                                <p className={`text-xs leading-relaxed ${item.completed ? 'text-white/30 line-through' : 'text-white/60'}`}>
                                  {item.description}
                                </p>
                              )}

                              {/* Recommendation Reason Badge */}
                              {item.recommendReason && !item.completed && (
                                <div className="pt-0.5">
                                  <span className="inline-flex items-center gap-1 text-[10.5px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                                    <span className="text-[11px]">💡</span>
                                    <span className="font-mono text-[9.5px] text-amber-400/80">추천 사유:</span>
                                    <span className="font-medium text-amber-200">{item.recommendReason}</span>
                                  </span>
                                </div>
                              )}

                              {/* Action Hint / Link if present */}
                              {item.actionRoute && !item.completed && (
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => navigate(item.actionRoute!)}
                                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>{item.actionHint || '바로가기'}</span>
                                    <ArrowRight size={11} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteMission(item.id)}
                              className="opacity-40 group-hover:opacity-100 text-white/30 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer shrink-0"
                              title="미션 삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* 🏆 Mode 2: 랭킹 리스트 보기 */
        <div className="space-y-3">
          {filteredMissions.map((item, idx) => {
            const cat = CATEGORY_META[item.category] || CATEGORY_META.custom;
            const normPri = normalizePriority(item.priority);
            const priConfig = PRIORITY_CONFIG[normPri];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative p-4 sm:p-5 rounded-[24px] border transition-all duration-300 ${
                  item.completed
                    ? 'bg-white/[0.015] border-white/5 opacity-60'
                    : `${priConfig.cardBorder} ${priConfig.cardBg} shadow-lg backdrop-blur-sm`
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Priority Indicator Stripe */}
                  <div 
                    className={`w-1.5 self-stretch rounded-full bg-gradient-to-b ${priConfig.leftStripe} shrink-0 my-0.5 opacity-85 group-hover:opacity-100 transition-all`}
                    title={`추천순위: ${priConfig.rankBadge}`} 
                  />

                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleMission(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'border-white/20 hover:border-indigo-400 bg-white/5 hover:bg-indigo-500/10 text-transparent'
                    }`}
                    aria-label={item.completed ? '미션 완료 해제' : '미션 완료 표시'}
                  >
                    <Check size={14} className={item.completed ? 'stroke-[3]' : 'opacity-0'} />
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Metadata Header with Rank index */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Rank Index Tag */}
                      <span className={`px-2 py-0.5 rounded-lg font-mono font-black text-[10px] ${
                        idx === 0
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                          : idx === 1
                          ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                          : 'bg-white/10 text-white/70 border border-white/15'
                      }`}>
                        #{idx + 1}
                      </span>

                      {/* Priority selector badge */}
                      <div className="relative inline-flex items-center">
                        <select
                          value={normPri}
                          onChange={e => {
                            e.stopPropagation();
                            handleChangePriority(item.id, e.target.value as NormalizedPriority);
                          }}
                          onClick={e => e.stopPropagation()}
                          className={`appearance-none text-[10.5px] font-bold px-2 py-0.5 pr-4 rounded-lg border transition-all cursor-pointer focus:outline-none ${priConfig.badgeBg}`}
                          title="추천순위 변경"
                        >
                          <option value="high" className="bg-zinc-900 text-rose-300 font-bold">🥇 추천 1순위 (핵심)</option>
                          <option value="medium" className="bg-zinc-900 text-amber-300 font-bold">🥈 추천 2순위 (도약)</option>
                          <option value="low" className="bg-zinc-900 text-emerald-300 font-bold">🥉 추천 3순위 (회복)</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-1 pointer-events-none opacity-60 text-white" />
                      </div>

                      <span className="text-white/20" aria-hidden="true">·</span>
                      <span className={`font-medium ${cat.color}`}>
                        {cat.icon} {cat.label}
                      </span>
                      {item.estimatedMinutes && (
                        <>
                          <span className="text-white/20" aria-hidden="true">·</span>
                          <span className="text-white/40 flex items-center gap-1 font-mono text-[10px]">
                            <Clock size={10} />
                            {item.estimatedMinutes}분
                          </span>
                        </>
                      )}
                    </div>

                    {/* Task Title */}
                    <h4
                      onClick={() => handleToggleMission(item.id)}
                      className={`text-sm sm:text-base font-bold transition-all cursor-pointer leading-snug ${
                        item.completed
                          ? 'line-through text-white/40'
                          : 'text-white group-hover:text-indigo-200'
                      }`}
                    >
                      {item.title}
                    </h4>

                    {/* Task Description */}
                    {item.description && (
                      <p className={`text-xs leading-relaxed ${item.completed ? 'text-white/30 line-through' : 'text-white/60'}`}>
                        {item.description}
                      </p>
                    )}

                    {/* Recommendation Reason Badge */}
                    {item.recommendReason && !item.completed && (
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                          <span className="text-[11px]">💡</span>
                          <span className="font-mono text-[9.5px] text-amber-400/80">추천 사유:</span>
                          <span className="font-medium text-amber-200">{item.recommendReason}</span>
                        </span>
                      </div>
                    )}

                    {/* Action Hint / Link if present */}
                    {item.actionRoute && !item.completed && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => navigate(item.actionRoute!)}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{item.actionHint || '바로가기'}</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteMission(item.id)}
                    className="opacity-40 group-hover:opacity-100 text-white/30 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer shrink-0"
                    title="미션 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 🌌 Bottom Inspiration Banner */}
      <div className="p-6 rounded-[28px] border border-white/5 bg-gradient-to-r from-indigo-950/20 via-purple-950/20 to-black text-center space-y-2">
        <p className="text-xs text-white/60 font-medium">
          "오늘 하루 통제할 수 있는 유일한 영역은 나의 선택과 행동입니다."
        </p>
        <p className="text-[10px] text-white/30 font-mono">
          매일 자정에 새로운 일일 우주 미션이 갱신되며, 당신의 모든 성취는 영혼의 기억에 보존됩니다.
        </p>
      </div>

    </div>
  );
}
