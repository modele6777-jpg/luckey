import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Feather,
  Lock,
  Unlock,
  Sparkles,
  Eye,
  EyeOff,
  Send,
  Heart,
  Calendar,
  Trash2,
  Key,
  RefreshCw,
  Moon,
  ShieldCheck,
  PenLine,
  Wand2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Flame,
  Wind,
  X,
  Mail,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { invokeLLMStructured } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playAiResultNotification } from '@/lib/audioHaptics';
import { sendSecretNoteToLucy } from '@/lib/oracleDeepInsight';
import { TTSButton } from '@/components/TTSButton';
import { z } from 'zod';

export interface SecretMessageProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export interface SecretNote {
  id: string;
  dateKey: string;
  createdAt: number;
  moodTag: string;
  title: string;
  content: string;
  isSealed: boolean;
  blessingEcho?: string;
  colorTheme?: string;
  isBlessingLoading?: boolean;
}

export const MOOD_TAGS = [
  { id: 'confession', label: '밤의 고백', emoji: '🌙', color: 'from-sky-500/20 to-indigo-500/20', description: '숨겨온 진실과 은밀한 고백' },
  { id: 'release', label: '놓아주는 마음', emoji: '🕊️', color: 'from-teal-500/20 to-sky-500/20', description: '미련과 집착을 비워내는 마음' },
  { id: 'tears', label: '남모를 눈물', emoji: '💧', color: 'from-blue-500/20 to-cyan-500/20', description: '슬픔과 홀로 삼킨 눈물' },
  { id: 'wish', label: '숨겨둔 소망', emoji: '✨', color: 'from-amber-500/20 to-sky-500/20', description: '간절한 소원과 미래의 꿈' },
  { id: 'letter', label: '파랑새에게 부치는 편지', emoji: '✉️', color: 'from-sky-400/20 to-blue-600/20', description: '파랑새와 나누는 따뜻한 편지' },
  { id: 'gratitude', label: '비밀 감사', emoji: '🤍', color: 'from-slate-400/20 to-sky-400/20', description: '마음 깊은 곳의 고마움과 축복' },
] as const;

export type MoodTagId = typeof MOOD_TAGS[number]['id'];

export interface MoodRecommendation {
  tagId: MoodTagId;
  moodObj: typeof MOOD_TAGS[number];
  confidence: 'high' | 'medium';
  reason: string;
  matchedKeywords: string[];
}

export function detectMoodFromText(text: string): MoodRecommendation | null {
  const clean = text.trim().toLowerCase();
  if (clean.length < 3) return null;

  const scoreMap: Record<MoodTagId, { score: number; keywords: string[] }> = {
    tears: { score: 0, keywords: [] },
    release: { score: 0, keywords: [] },
    wish: { score: 0, keywords: [] },
    confession: { score: 0, keywords: [] },
    gratitude: { score: 0, keywords: [] },
    letter: { score: 0, keywords: [] },
  };

  const patterns: Array<{ tag: MoodTagId; words: string[]; weight: number }> = [
    {
      tag: 'tears',
      words: [
        '눈물', '울었', '울컥', '슬프', '슬퍼', '서러', '서운', '아파', '아프', '상처', 
        '외로', '쓸쓸', '우울', '지쳐', '지침', '힘들', '괴로', '답답', '비참', '억울', 
        '무너', '버겁', '한숨', '괴롭', '울고 싶', '가슴이 아', '마음이 아', '눈물이'
      ],
      weight: 2,
    },
    {
      tag: 'release',
      words: [
        '놓아', '비우', '잊어', '미련', '집착', '훌훌', '털어', '그만', '용서', '정리', 
        '포기', '내려놓', '보내주', '비워', '흘려보내', '끝내', '지우려', '털어버리', '잊을래'
      ],
      weight: 2,
    },
    {
      tag: 'wish',
      words: [
        '소원', '소망', '바래', '바라', '꿈', '희망', '이루', '꼭', '기도', '행복해', 
        '성공', '합격', '잘되', '앞으로는', '되었으면', '바란다', '원해', '간절', '바라는'
      ],
      weight: 2,
    },
    {
      tag: 'confession',
      words: [
        '고백', '비밀', '사실은', '아무에게도', '누구에게도', '속마음', '짝사랑', '좋아하', 
        '사랑해', '부끄러', '솔직히', '숨겨', '죄책감', '차마', '말하지', '못한 말', '나만 아는'
      ],
      weight: 2,
    },
    {
      tag: 'gratitude',
      words: [
        '감사', '고마', '은혜', '덕분', '축복', '따뜻', '소중한', '잊지 않', '다행', 
        '행복했', '사랑받', '고마웠', '선물 같은', '고마운'
      ],
      weight: 2,
    },
    {
      tag: 'letter',
      words: [
        '파랑새', '너에게', '편지', '들어줄래', '들어줘', '전해줘', '물어봐', '답장', 
        '파랑새야', '안녕 파랑새', '내 말 좀', '듣고 있니'
      ],
      weight: 2.5,
    },
  ];

  for (const { tag, words, weight } of patterns) {
    for (const w of words) {
      if (clean.includes(w)) {
        scoreMap[tag].score += weight;
        if (!scoreMap[tag].keywords.includes(w)) {
          scoreMap[tag].keywords.push(w);
        }
      }
    }
  }

  let topTag: MoodTagId | null = null;
  let maxScore = 0;

  for (const tag of Object.keys(scoreMap) as MoodTagId[]) {
    if (scoreMap[tag].score > maxScore) {
      maxScore = scoreMap[tag].score;
      topTag = tag;
    }
  }

  if (!topTag || maxScore < 2) return null;

  const moodObj = MOOD_TAGS.find((m) => m.id === topTag) || MOOD_TAGS[0];
  const matched = scoreMap[topTag].keywords;
  const reasonMap: Record<MoodTagId, string> = {
    tears: '남모르게 홀로 삼켜온 슬픔과 눈물의 온기가 느껴집니다.',
    release: '무거운 짐을 내려놓고 마음을 비워내려는 용기가 돋보입니다.',
    wish: '가슴 깊이 간직한 빛나는 소망과 바람이 담겨 있습니다.',
    confession: '누구에게도 말하지 못했던 은밀한 고백과 진심이 담겨 있습니다.',
    gratitude: '세상을 밝히는 순수한 감사의 파동이 느껴집니다.',
    letter: '파랑새에게 다정하게 띄워 보내는 온기 어린 편지입니다.',
  };

  return {
    tagId: topTag,
    moodObj,
    confidence: maxScore >= 4 ? 'high' : 'medium',
    reason: reasonMap[topTag] || `${moodObj.label} 테마와 깊이 공명합니다.`,
    matchedKeywords: matched.slice(0, 3),
  };
}

const PROMPTS = [
  '오늘 누구에게도 꺼내놓지 못한 마음속 무거운 짐이 있나요?',
  '가장 솔직한 나만의 감정을 조용히 기록해보세요.',
  '이곳은 오직 당신만을 위한 안전하고 성스러운 안식처입니다.',
  '마음의 응어리를 글로 적는 순간, 치유의 바람이 불어옵니다.',
  '내가 바라는 가장 순수하고 은밀한 소망은 무엇인가요?',
];

const STORAGE_KEY = 'bluebird_secret_messages_v1';
const PIN_STORAGE_KEY = 'bluebird_secret_pin_v1';

const BlessingResponseSchema = z.object({
  blessingMessage: z.string().describe('사용자가 적은 비밀 쪽지의 구체적인 고민이나 마음을 정확히 읽고, 군더더기 없이 그에 맞추어 따뜻하고 간결하게 건네는 1~2문장의 핵심 공감 답장'),
  comfortMantra: z.string().describe('사용자가 마음속에 간직할 수 있는 짧고 다정한 1줄 위로 문구'),
  energyShift: z.string().optional().describe('이 비밀이 승화되며 일어나는 영적 파동의 긍정적 변화 1문장'),
});

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateTailoredBlessingEcho(content: string, moodLabel: string, userName: string = '제제'): string {
  const text = content.toLowerCase();
  const name = userName || '제제';

  if (text.includes('회사') || text.includes('직장') || text.includes('일') || text.includes('야근') || text.includes('업무') || text.includes('상사') || text.includes('퇴사') || text.includes('이직') || text.includes('동료')) {
    return `${name} 님, 일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻하고 포근한 쉼을 누리세요.`;
  }
  if (text.includes('친구') || text.includes('사람') || text.includes('인간관계') || text.includes('상처') || text.includes('서운') || text.includes('배신') || text.includes('싸움') || text.includes('오해') || text.includes('눈치')) {
    return `${name} 님의 마음의 평화가 가장 소중합니다. 타인의 시선에 휘둘리지 않고 당신만의 맑은 온기를 지키세요.`;
  }
  if (text.includes('사랑') || text.includes('연애') || text.includes('이별') || text.includes('그리움') || text.includes('보고싶') || text.includes('짝사랑') || text.includes('남자친구') || text.includes('여자친구') || text.includes('헤어') || text.includes('마음')) {
    return `누군가를 진심으로 아끼고 사랑했던 ${name} 님의 순수한 온기는 그 자체로 눈부시게 아름답습니다.`;
  }
  if (text.includes('불안') || text.includes('걱정') || text.includes('두려') || text.includes('미래') || text.includes('시험') || text.includes('취업') || text.includes('면접') || text.includes('돈') || text.includes('재정') || text.includes('합격') || text.includes('준비')) {
    return `조급해하지 않아도 괜찮아요, ${name} 님. 모든 순리는 가장 알맞고 아름다운 때에 당신 편이 되어줍니다.`;
  }
  if (text.includes('외로') || text.includes('혼자') || text.includes('쓸쓸') || text.includes('우울') || text.includes('눈물') || text.includes('지침') || text.includes('피곤') || text.includes('힘들') || text.includes('지쳐') || text.includes('버겁')) {
    return `숨을 깊게 들이쉬고 내쉬어 보세요. 무거운 짐을 견뎌온 ${name} 님이라는 존재 자체로 이미 귀하고 충분합니다.`;
  }
  if (text.includes('감사') || text.includes('행복') || text.includes('고마') || text.includes('희망') || text.includes('소망') || text.includes('축복') || text.includes('기쁨') || text.includes('좋아')) {
    return `세상에 띄워 보낸 ${name} 님의 다정한 감사의 파동은 머지않아 더 커다란 행운과 평온으로 되돌아옵니다.`;
  }

  return `${name} 님, 흘러간 것은 흘러간 대로 두고, 지금 이 순간의 나를 온전히 안아줍니다.`;
}

export function SecretMessage({ isOpen, onClose, isModal }: SecretMessageProps = {}) {
  const { firebaseUser, sharedState, openLucyChat, sendUnifiedMessage } = useApp();

  const [notes, setNotes] = useState<SecretNote[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>(MOOD_TAGS[0].id);
  const [noteContent, setNoteContent] = useState('');
  const [isSealedState, setIsSealedState] = useState(true);
  const [isGeneratingBlessing, setIsGeneratingBlessing] = useState(false);
  const [unlockedNoteIds, setUnlockedNoteIds] = useState<Record<string, boolean>>({});
  const [filterMood, setFilterMood] = useState<string>('all');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [pinTargetNoteId, setPinTargetNoteId] = useState<string | null>(null);
  const [pinError, setPinError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [burnTargetId, setBurnTargetId] = useState<string | null>(null);

  // Auto-Emotion Tag Recommendation States
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(true);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);

  // Live real-time emotion detection from content
  const liveRecommendation = useMemo(() => detectMoodFromText(noteContent), [noteContent]);

  // Synchronize auto-recommendation when text updates and manual override is not active
  useEffect(() => {
    if (autoMatchEnabled && !isManualOverride && liveRecommendation) {
      setSelectedMood(liveRecommendation.tagId);
    }
  }, [liveRecommendation, autoMatchEnabled, isManualOverride]);

  // Reset manual override flag when content is cleared
  useEffect(() => {
    if (!noteContent.trim()) {
      setIsManualOverride(false);
    }
  }, [noteContent]);

  // Deep AI Emotion Analyzer Handler (2.5초 안전 타임아웃)
  const handleDeepAiMoodAnalyze = async () => {
    if (!noteContent.trim()) return;
    setIsDeepAnalyzing(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/ai/secret-mood-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data?.moodTag) {
          setSelectedMood(data.moodTag);
          setIsManualOverride(false);
        }
      } else if (liveRecommendation) {
        setSelectedMood(liveRecommendation.tagId);
        setIsManualOverride(false);
      }
    } catch (e) {
      if (liveRecommendation) {
        setSelectedMood(liveRecommendation.tagId);
        setIsManualOverride(false);
      }
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  // Load notes on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
      const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
      if (storedPin) {
        setSavedPin(storedPin);
      }
    } catch (e) {
      console.warn('Failed to load secret notes:', e);
    }
  }, []);

  // Save notes helper
  const persistNotes = (updated: SecretNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save secret notes to local storage:', e);
    }
  };

  const handleCreateNote = async (requestBlessing = false) => {
    if (!noteContent.trim()) return;

    const currentContent = noteContent.trim();
    const today = getTodayKey();
    const moodObj = MOOD_TAGS.find((m) => m.id === selectedMood) || MOOD_TAGS[0];

    const rawNick = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
    const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';

    const firstLine = currentContent.split('\n')[0]?.trim() || '';
    const autoTitle = firstLine.slice(0, 26) || `${moodObj.label}의 기록`;
    const newNoteId = `secret-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // ⚡ 1. 즉각 저장 (0ms 지연): UI 블로킹 없이 바로 보관함에 새 쪽지 등록
    const newNote: SecretNote = {
      id: newNoteId,
      dateKey: today,
      createdAt: Date.now(),
      moodTag: selectedMood,
      title: firstLine.length > 26 ? `${autoTitle}...` : autoTitle,
      content: currentContent,
      isSealed: isSealedState,
      blessingEcho: undefined,
      colorTheme: moodObj.color,
      isBlessingLoading: requestBlessing,
    };

    const updated = [newNote, ...notes];
    persistNotes(updated);

    // 폼 즉시 리셋 & 방금 작성한 쪽지 즉시 열람 허용
    setNoteContent('');
    setIsManualOverride(false);
    setUnlockedNoteIds((prev) => ({ ...prev, [newNote.id]: true }));

    // Sync to prism ecosystem
    recordPrismFeature({
      app: 'bluebird',
      featureName: '파랑새의 비밀 쪽지 (Secret Note)',
      summary: `[${moodObj.label}] 비밀 쪽지를 봉인하여 내면의 짐을 털어놓았습니다. (봉인 상태: ${isSealedState ? '보호됨' : '열림'})`,
      details: {
        dateKey: today,
        moodTag: moodObj.label,
        hasBlessing: Boolean(requestBlessing),
      },
    });

    if (!requestBlessing) return;

    // ⚡ 2. 초고속 비동기 축복 답장 수신 (대기 없이 쪽지 카드 내부에서 로딩 후 스무스 업데이트)
    setIsGeneratingBlessing(true);
    try {
      let blessing: string | undefined = undefined;

      // 1순위: 전용 초고속 서버 API 호출 (최대 2.8초 타임아웃)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2800);
        const res = await fetch('/api/ai/secret-blessing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: currentContent,
            moodTag: moodObj.label,
            userName: nickname,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data?.comfortMantra) {
            blessing = String(data.comfortMantra).replace(/^['“”‘’]+|['“”‘’]+$/g, '').trim();
          }
        }
      } catch (fastErr) {
        // 서버 호출 타임아웃 또는 네트워크 단절 시 아래 스마트 폴백으로 즉각 전환
      }

      // 2순위: 클라이언트 경량 AI 호출 시도 (타임아웃 3초, maxRetries 0)
      if (!blessing) {
        try {
          const BlessingSchema = z.object({
            comfortMantra: z.string().describe('파랑새의 따뜻한 답장 2~3문장'),
          });

          const res = await invokeLLMStructured({
            messages: [
              {
                role: 'system',
                content: `당신은 사용자의 지친 마음을 다정하게 안아주는 '파랑새(BLUEBIRD)'입니다. 사용자가 적은 쪽지 내용에 깊이 공감하고 위로하는 2~3문장의 따뜻한 구어체 답장을 전해주세요.`,
              },
              {
                role: 'user',
                content: `[사용자]: ${nickname}\n[감정]: ${moodObj.label}\n[쪽지 내용]: "${currentContent}"\n\n파랑새의 답장을 전해주세요.`,
              },
            ],
            schema: BlessingSchema,
            maxRetries: 0,
            timeoutMs: 3000,
          });

          if (res?.comfortMantra) {
            blessing = res.comfortMantra.replace(/^['“”‘’]+|['“”‘’]+$/g, '').trim();
          }
        } catch (_) {}
      }

      // 3순위: 즉각 감정 매칭 휴리스틱 엔진 (0ms 폴백 - 항상 성공 보장)
      if (!blessing) {
        blessing = generateTailoredBlessingEcho(currentContent, moodObj.label, nickname);
      }

      // 쪽지 카드 내부 상태 및 로컬 스토리지에 축복 문구 반영
        setNotes((prevNotes) => {
          const nextNotes = prevNotes.map((n) =>
            n.id === newNoteId
              ? { ...n, blessingEcho: blessing, isBlessingLoading: false }
              : n
          );
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes));
          } catch (_) {}
          return nextNotes;
        });

        try {
          playAiResultNotification();
        } catch (_) {}
    } finally {
      setIsGeneratingBlessing(false);
    }
  };

  // 🌟 토스된 비밀 쪽지/감사 수신 및 즉각 작성/위로 분석
  useEffect(() => {
    const triggerAutoSecret = (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');
      setNoteContent(trimmed);
      const autoRec = detectMoodFromText(trimmed);
      if (autoRec) {
        setSelectedMood(autoRec.tagId);
      }
      setTimeout(() => {
        void handleCreateNote(true);
      }, 150);
    };

    if (typeof window !== 'undefined') {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText) {
        triggerAutoSecret(autoText);
      }
    }

    const handleExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.text && (detail.tab === 'secretMessage' || detail.targetMenuId?.includes('bluebird') || detail.targetMenu?.path?.includes('/bluebird'))) {
        triggerAutoSecret(detail.text);
      }
    };
    window.addEventListener('prism:selection_execute', handleExecute);
    return () => window.removeEventListener('prism:selection_execute', handleExecute);
  }, [handleCreateNote]);

  const handleToggleSeal = (noteId: string) => {
    if (savedPin && !unlockedNoteIds[noteId]) {
      setPinTargetNoteId(noteId);
      setPinInput('');
      setPinError(false);
      return;
    }

    setUnlockedNoteIds((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const verifyPinAndUnlock = () => {
    if (pinInput === savedPin) {
      if (pinTargetNoteId) {
        setUnlockedNoteIds((prev) => ({ ...prev, [pinTargetNoteId]: true }));
      }
      setPinTargetNoteId(null);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSavePin = () => {
    if (pin.length >= 4) {
      setSavedPin(pin);
      localStorage.setItem(PIN_STORAGE_KEY, pin);
      setShowPinSetup(false);
      setPin('');
    }
  };

  const handleRemovePin = () => {
    setSavedPin('');
    localStorage.removeItem(PIN_STORAGE_KEY);
    setShowPinSetup(false);
    setPin('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    persistNotes(updated);
    setBurnTargetId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = useMemo(() => {
    if (filterMood === 'all') return notes;
    return notes.filter((n) => n.moodTag === filterMood);
  }, [notes, filterMood]);

  const activeMoodObj = MOOD_TAGS.find((m) => m.id === selectedMood) || MOOD_TAGS[0];

  const isModalMode = Boolean(isModal || onClose);

  if (isOpen !== undefined && !isOpen) {
    return null;
  }

  const mainContent = (
    <div className={`w-full max-w-4xl mx-auto space-y-8 ${isModalMode ? 'p-3 sm:p-6 pb-12' : 'glass p-5 sm:p-8 md:p-10 rounded-[32px] sm:rounded-[40px] bg-white/[0.04] sm:bg-white/[0.06] border border-sky-400/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.5)] my-4'} text-white font-sans relative overflow-hidden backdrop-blur-2xl`}>
      {/* Subtle ice blue specular glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Ethereal Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center space-y-4 pt-2"
      >
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-sky-400/20 to-blue-600/10 border border-sky-300/30 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <Feather className="text-sky-300 animate-pulse" size={28} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-sky-400">
              BLUEBIRD SECRET SANCTUARY
            </span>
            {savedPin && (
              <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono">
                <ShieldCheck size={10} /> PIN 보호 중
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white/95">
            파랑새의 비밀 쪽지
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/70 max-w-md mx-auto leading-relaxed">
            세상에 꺼내놓지 못한 은밀한 마음과 감정을 안전하게 봉인하세요. 
            고요한 파랑새가 당신의 숨은 고백을 온화한 치유의 주파수로 감싸줍니다.
          </p>
        </div>

        {/* Action Bar (PIN Setup & Prompt Rotator) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActivePromptIndex((prev) => (prev + 1) % PROMPTS.length)}
            className="text-[11px] px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sky-200/80 hover:text-sky-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles size={12} className="text-sky-400" />
            <span>영감 문장: "{PROMPTS[activePromptIndex]}"</span>
            <RefreshCw size={10} className="opacity-50 hover:opacity-100" />
          </button>

          <button
            onClick={() => setShowPinSetup((prev) => !prev)}
            className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              savedPin
                ? 'bg-sky-500/10 border-sky-400/30 text-sky-300 hover:bg-sky-500/20'
                : 'bg-white/[0.04] border-white/10 text-white/50 hover:text-white/80'
            }`}
          >
            <Key size={12} />
            <span>{savedPin ? '보안 PIN 관리' : '비밀번호 설정'}</span>
          </button>
        </div>

        {/* PIN Setup Modal / Drawer */}
        <AnimatePresence>
          {showPinSetup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden max-w-md mx-auto pt-2"
            >
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-sky-500/30 backdrop-blur-xl space-y-4 text-left shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Key size={14} /> 4자리 이상 비밀번호 설정
                  </span>
                  {savedPin && (
                    <button
                      onClick={handleRemovePin}
                      className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      PIN 제거
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  PIN을 설정하면 봉인된 쪽지를 열어볼 때 확인 절차를 거쳐 더욱 안전하게 보호됩니다.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={12}
                    placeholder="새 PIN 번호 입력"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    onClick={handleSavePin}
                    disabled={pin.length < 4}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    저장
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Creation Chamber */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass relative group rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 bg-white/[0.03] border border-white/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_40px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        {/* Subtle Ethereal Glass Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-400/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative space-y-6">
          {/* Mood Selector Tabs with Auto-Recommendation */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-300/80 block text-left">
                1. 비밀의 감정 테마 (Soul Frequency)
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoMatchEnabled;
                    setAutoMatchEnabled(next);
                    if (next && liveRecommendation) {
                      setSelectedMood(liveRecommendation.tagId);
                      setIsManualOverride(false);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                    autoMatchEnabled
                      ? 'bg-sky-500/15 border-sky-400/30 text-sky-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                  }`}
                  title={autoMatchEnabled ? '작성 내용에 맞춘 자동 감정 태그 매칭이 켜져 있습니다' : '자동 태그 매칭 켜기'}
                >
                  <Wand2 size={11} className={autoMatchEnabled ? 'text-sky-300 animate-pulse' : ''} />
                  <span>자동 감정 감지 {autoMatchEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeepAiMoodAnalyze}
                  disabled={!noteContent.trim() || isDeepAnalyzing}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-sky-200/80 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  title="작성한 쪽지의 뉘앙스를 AI로 정밀 분석하여 최적의 감정 태그를 추천합니다"
                >
                  {isDeepAnalyzing ? (
                    <>
                      <RefreshCw size={11} className="animate-spin text-sky-300" />
                      <span>분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={11} className="text-sky-400" />
                      <span>AI 정밀 분석</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Recommendation Suggestion Card */}
            <AnimatePresence>
              {liveRecommendation && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-left shadow-inner">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0 shadow-sm">
                        <Sparkles size={13} className="animate-pulse" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-sky-200">
                            감정 감지 추천:
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white px-2 py-0.5 rounded-lg bg-sky-500/25 border border-sky-400/40 shadow-sm">
                            <span>{liveRecommendation.moodObj.emoji}</span>
                            <span>{liveRecommendation.moodObj.label}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-sky-200/85 leading-relaxed break-keep break-words">
                          {liveRecommendation.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {selectedMood === liveRecommendation.tagId ? (
                        <span className="text-[10px] px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-medium flex items-center gap-1">
                          <Check size={11} />
                          <span>태그 적용됨</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMood(liveRecommendation.tagId);
                            setIsManualOverride(false);
                          }}
                          className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                        >
                          <Check size={11} />
                          <span>추천 태그로 변경</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mood Buttons Grid */}
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map((tag) => {
                const isSelected = selectedMood === tag.id;
                const isRecommended = liveRecommendation?.tagId === tag.id;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedMood(tag.id);
                      setIsManualOverride(true);
                    }}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/25 border-sky-400/60 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] scale-[1.02]'
                        : isRecommended
                        ? 'bg-sky-400/10 border-sky-400/40 text-sky-200 hover:bg-sky-400/20 hover:text-white'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
                    } border`}
                  >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                    {isRecommended && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-sky-400/30 text-sky-200 border border-sky-300/40 font-mono tracking-tighter">
                        AI 추천
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single Unified Note Input Field */}
          <div className="space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-300/80 block">
                2. 마음의 기록 (Heart Whisper)
              </label>
              <span className="text-[10px] text-white/40 font-sans">
                한 칸에 마음을 자유롭게 털어놓으세요
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                placeholder="마음속 깊이 숨겨둔 이야기, 누구에게도 털어놓지 못한 고백이나 서러움, 혹은 나만의 은밀한 바람을 편하게 적어보세요..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-sky-400/50 rounded-3xl p-5 text-sm text-white/90 placeholder:text-white/25 focus:outline-none transition-all shadow-inner leading-relaxed resize-y min-h-[140px]"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30">
                {noteContent.length}자
              </div>
            </div>
          </div>

          {/* Seal & Blessing Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
            <button
              onClick={() => setIsSealedState((prev) => !prev)}
              className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-2xl border transition-all cursor-pointer w-full sm:w-auto justify-center ${
                isSealedState
                  ? 'bg-sky-500/15 border-sky-400/40 text-sky-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}
            >
              {isSealedState ? <Lock size={14} className="text-sky-400" /> : <Unlock size={14} />}
              <span>{isSealedState ? '자동 은닉 봉인 활성화' : '공개 상태로 보관'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleCreateNote(false)}
                disabled={!noteContent.trim()}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 disabled:opacity-30 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Lock size={14} />
                <span>조용히 봉인 저장</span>
              </button>

              <button
                onClick={() => handleCreateNote(true)}
                disabled={!noteContent.trim()}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(14,165,233,0.35)] border border-sky-300/30"
              >
                <Sparkles size={14} className="text-sky-200" />
                <span>파랑새의 축복 답장 받기</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sealed Notes History Archive */}
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Moon size={16} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                봉인된 비밀 쪽지 보관함 ({filteredNotes.length})
              </h3>
              <span className="text-[10px] text-white/40">
                당신이 기록한 소중한 고백들이 안전하게 간직되어 있습니다.
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setFilterMood('all')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                filterMood === 'all'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-white/5 text-white/40 hover:text-white/70 border border-transparent'
              }`}
            >
              전체 ({notes.length})
            </button>
            {MOOD_TAGS.map((tag) => {
              const count = notes.filter((n) => n.moodTag === tag.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={tag.id}
                  onClick={() => setFilterMood(tag.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    filterMood === tag.id
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-white/5 text-white/40 hover:text-white/70 border border-transparent'
                  }`}
                >
                  {tag.emoji} {tag.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <Feather size={20} />
            </div>
            <p className="text-sm text-white/40 font-sans">
              아직 보관된 비밀 쪽지가 없습니다.
            </p>
            <p className="text-xs text-white/25">
              마음의 이야기를 적어 첫 번째 비밀 쪽지를 봉인해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredNotes.map((note) => {
                const moodObj = MOOD_TAGS.find((m) => m.id === note.moodTag) || MOOD_TAGS[0];
                const isUnlocked = unlockedNoteIds[note.id] || !note.isSealed;
                const isBurning = burnTargetId === note.id;

                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-[28px] p-5 sm:p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-sky-400/30 transition-all shadow-lg backdrop-blur-md space-y-4 group overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-300 font-medium flex items-center gap-1">
                          <span>{moodObj.emoji}</span>
                          <span>{moodObj.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-white/35">
                          {note.dateKey}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSeal(note.id)}
                          className="p-1.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-sky-300 transition-all cursor-pointer"
                          title={isUnlocked ? '가리기 / 봉인' : '쪽지 열어보기'}
                        >
                          {isUnlocked ? <EyeOff size={15} /> : <Eye size={15} className="text-sky-400" />}
                        </button>
                        <button
                          onClick={() => setBurnTargetId(note.id)}
                          className="p-1.5 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all cursor-pointer"
                          title="비밀 태우기 (삭제)"
                        >
                          <Flame size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Note Content Area (Sealed vs Unsealed) */}
                    <div className="relative min-h-[60px] flex-1 flex flex-col justify-center">
                      {isUnlocked ? (
                        <div className="space-y-3">
                          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed whitespace-pre-wrap break-words bg-black/20 p-3.5 rounded-2xl border border-white/5">
                            {note.content}
                          </p>

                          {note.isBlessingLoading ? (
                            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-200/90 flex items-center gap-2.5 animate-pulse">
                              <RefreshCw size={13} className="animate-spin text-sky-400 shrink-0" />
                              <span className="text-[11px] leading-relaxed text-sky-200/80">
                                🕊️ 파랑새가 제제님을 위한 따뜻한 위로의 답장을 적어내려가고 있어요...
                              </span>
                            </div>
                          ) : note.blessingEcho ? (
                            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-200/90 space-y-1.5 leading-relaxed">
                              <div className="flex items-center justify-between text-[10px] font-bold text-sky-300 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                  <Sparkles size={12} className="text-sky-400" /> 파랑새의 치유 문구
                                </span>
                                <TTSButton
                                  text={note.blessingEcho}
                                  voice="Kore"
                                  className="text-sky-300 border-sky-400/20 scale-90"
                                />
                              </div>
                              <p className="text-xs text-sky-100/95 font-medium leading-relaxed">
                                "{note.blessingEcho}"
                              </p>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div
                          onClick={() => handleToggleSeal(note.id)}
                          className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sky-500/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-sky-500/[0.04] group/seal"
                        >
                          <div className="w-9 h-9 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-2 group-hover/seal:scale-110 transition-transform">
                            <Lock size={15} />
                          </div>
                          <span className="text-xs font-bold text-white/70 group-hover/seal:text-sky-300">
                            은밀히 봉인된 쪽지
                          </span>
                          <span className="text-[10px] text-white/30 mt-0.5">
                            터치하여 열어보기
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    {isUnlocked && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/5 text-[10px] text-white/40">
                        <span className="font-mono">
                          {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              sendSecretNoteToLucy(
                                {
                                  content: note.content,
                                  moodTag: MOOD_TAGS.find(m => m.id === note.moodTag)?.label || note.moodTag,
                                  comfortMessage: note.blessingEcho,
                                },
                                openLucyChat,
                                sendUnifiedMessage
                              );
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/25 transition-all cursor-pointer shadow-sm font-medium"
                            title="이 쪽지의 고민과 마음을 루시(LUCY)에게 전달하여 1:1 대화를 이어갑니다"
                          >
                            <Sparkles size={11} className="text-sky-300" />
                            <span>루시와 속마음 나누기</span>
                          </button>

                          <button
                            onClick={() => handleCopy(note.id, `${note.content}${note.blessingEcho ? `\n\n[파랑새의 축복 메아리]\n${note.blessingEcho}` : ''}`)}
                            className="flex items-center gap-1 text-sky-300/80 hover:text-sky-200 cursor-pointer px-1 py-1"
                          >
                            {copiedId === note.id ? (
                              <>
                                <Check size={11} className="text-emerald-400" />
                                <span className="text-emerald-400">복사됨</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>쪽지 복사</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Burn Confirmation Overlay */}
                    <AnimatePresence>
                      {isBurning && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center space-y-3"
                        >
                          <Flame size={24} className="text-red-400 animate-pulse" />
                          <p className="text-xs font-bold text-white">
                            이 비밀 쪽지를 완전히 태워 날려보낼까요?
                          </p>
                          <p className="text-[10px] text-white/50">
                            영원히 삭제되며 복구할 수 없습니다.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => setBurnTargetId(null)}
                              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white/80 cursor-pointer"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-500/20 cursor-pointer"
                            >
                              태워 없애기
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Secret Message -> Lucy Deep Consultation Connection Banner */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-indigo-950/40 border border-sky-500/25 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-left shadow-xl shadow-sky-950/30">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={14} className="text-sky-300 animate-pulse" />
              <span>루시(LUCY) 비밀 쪽지 심층 교감</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              말 못 했던 비밀과 고민을 루시와 1:1로 나누기
            </h4>
            <p className="text-xs text-white/60 leading-relaxed break-keep">
              작성한 쪽지나 마음속 깊은 이야기를 루시에게 안전하게 털어놓으세요. 당신의 감정을 100% 무조건적으로 수용하고 포근한 위로와 지혜를 전해드립니다.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const latestNote = notes[0];
              sendSecretNoteToLucy(
                {
                  content: noteContent.trim() || latestNote?.content || '마음속에 간직해 온 남모를 이야기',
                  moodTag: MOOD_TAGS.find(m => m.id === selectedMood)?.label || '비밀쪽지',
                  comfortMessage: latestNote?.blessingEcho,
                },
                openLucyChat,
                sendUnifiedMessage
              );
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-sky-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all border border-sky-300/30 shrink-0"
          >
            <Sparkles size={15} />
            <span>루시에게 속마음 털어놓기</span>
          </motion.button>
        </div>
      </div>

      {/* PIN Unlock Prompt Modal */}
      <AnimatePresence>
        {pinTargetNoteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setPinTargetNoteId(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="p-6 sm:p-8 max-w-sm w-full rounded-[32px] bg-slate-900 border border-sky-500/30 text-center space-y-5 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Key size={22} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">비밀번호 확인</h4>
                <p className="text-xs text-white/50">봉인된 쪽지를 열기 위해 PIN을 입력하세요.</p>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN 번호"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && verifyPinAndUnlock()}
                  className="w-full text-center tracking-widest text-lg bg-white/5 border border-white/15 focus:border-sky-400 rounded-2xl py-3 text-white focus:outline-none"
                />
                {pinError && (
                  <p className="text-[11px] text-red-400">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPinTargetNoteId(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-white/80 transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={verifyPinAndUnlock}
                  className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isModalMode) {
    return (
      <AnimatePresence>
        {(isOpen ?? true) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 95, damping: 20 }}
              className="glass relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[32px] sm:rounded-[40px] border border-sky-500/30 bg-slate-950/95 shadow-2xl shadow-sky-950/60 p-2 sm:p-6 custom-scrollbar my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="sticky top-2 float-right z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
                  title="닫기"
                >
                  <X size={18} />
                </button>
              )}
              {mainContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return mainContent;
}
