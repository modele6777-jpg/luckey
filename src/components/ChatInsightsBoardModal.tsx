import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  BookOpen,
  RefreshCw,
  X,
  ChevronRight,
  MessageSquare,
  Flame,
  Volume2,
  VolumeX,
  Check,
  Copy,
  Sliders,
  Send,
  Loader2,
  HeartHandshake,
  Tag,
  Lightbulb,
  Sun,
  Moon
} from 'lucide-react';
import {
  ChatInsightSummary,
  loadSavedChatInsights,
  extractAiChatInsights,
  extractLocalInsights,
  syncInsightsFromDailyMemories
} from '@/lib/chatInsightsEngine';
import { UnifiedMessage } from '@/lib/chatHistorySync';
import { playTTS, stopTTS, subscribeTTS } from '@/utils/tts';

interface ChatInsightsBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessages: UnifiedMessage[];
  onConsultInsight?: (promptText: string) => void;
  userName?: string;
}

export function ChatInsightsBoardModal({
  isOpen,
  onClose,
  currentMessages,
  onConsultInsight,
  userName = '질문자'
}: ChatInsightsBoardModalProps) {
  const [insights, setInsights] = useState<ChatInsightSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  const [ttsState, setTtsState] = useState<{ isSpeaking: boolean; activeText: string | null }>({
    isSpeaking: false,
    activeText: null
  });

  useEffect(() => {
    return subscribeTTS((state) => {
      setTtsState({
        isSpeaking: state.isSpeaking,
        activeText: state.activeText
      });
    });
  }, []);

  // Load insights and sync with daily memories
  const refreshInsights = useCallback(() => {
    const list = syncInsightsFromDailyMemories();
    setInsights(list);
    if (list.length > 0 && !selectedId) {
      setSelectedId(list[0].id);
    }
  }, [selectedId]);

  useEffect(() => {
    if (isOpen) {
      refreshInsights();
    }
  }, [isOpen, refreshInsights]);

  // Analyze today's chat on demand or auto-trigger if not analyzed
  const todayDateStr = useMemo(() => new Date().toLocaleDateString('sv'), []);
  const todayUserMsgs = useMemo(
    () => currentMessages.filter((m) => m.role === 'user' && m.content),
    [currentMessages]
  );

  const todayInsight = useMemo(() => {
    return insights.find((item) => item.date === todayDateStr) || null;
  }, [insights, todayDateStr]);

  const handleAnalyzeToday = async (forceAi = false) => {
    if (todayUserMsgs.length === 0) return;
    setIsAnalyzing(true);
    try {
      if (forceAi) {
        const enriched = await extractAiChatInsights(todayDateStr, currentMessages);
        setInsights((prev) => {
          const filtered = prev.filter((i) => i.id !== enriched.id);
          return [enriched, ...filtered];
        });
        setSelectedId(enriched.id);
      } else {
        const local = extractLocalInsights(todayDateStr, currentMessages);
        if (local) {
          setInsights((prev) => {
            const filtered = prev.filter((i) => i.id !== local.id);
            return [local, ...filtered];
          });
          setSelectedId(local.id);
        }
      }
    } catch (err) {
      console.warn('[ChatInsightsBoard] Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Selected item
  const selectedInsight = useMemo(() => {
    if (!selectedId && insights.length > 0) return insights[0];
    return insights.find((item) => item.id === selectedId) || todayInsight || insights[0] || null;
  }, [selectedId, insights, todayInsight]);

  // Copy helper
  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // TTS helper
  const handlePlayTTS = (text: string) => {
    if (ttsState.isSpeaking && ttsState.activeText === text) {
      stopTTS();
    } else {
      playTTS(text, 'Kore');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            stopTTS();
            onClose();
          }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0f111a] border border-amber-500/25 shadow-[0_15px_60px_rgba(0,0,0,0.8)] overflow-hidden text-slate-200 z-10"
        >
          {/* Top Decorative Border Gradient */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 via-purple-500 to-rose-400 shrink-0" />

          {/* Modal Header */}
          <div className="px-5 sm:px-8 pt-5 pb-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-purple-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                <Sparkles size={20} className="text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                    인사이트 요약 보드
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    SOUL DIGEST
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  루시와의 대화 기록에서 길어 올린 핵심 통찰과 마음의 변화
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAnalyzeToday(true)}
                disabled={isAnalyzing || todayUserMsgs.length === 0}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                title="오늘 나눈 대화를 AI로 정밀 재분석하여 통찰을 갱신합니다."
              >
                {isAnalyzing ? (
                  <Loader2 size={13} className="animate-spin text-amber-300" />
                ) : (
                  <RefreshCw size={13} className="text-amber-300" />
                )}
                <span className="hidden sm:inline">AI 통찰 추출</span>
              </button>

              <button
                onClick={() => {
                  stopTTS();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body: Two columns (Sidebar list + Detail panel) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Left Sidebar: Date & History Tabs */}
            <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/20 shrink-0">
              <div className="p-3 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-400" />
                  대화 히스토리 목록
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  총 {insights.length + (todayUserMsgs.length > 0 && !todayInsight ? 1 : 0)}건
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-44 md:max-h-none premium-scroll">
                {/* Today's live entry if not yet saved */}
                {todayUserMsgs.length > 0 && !todayInsight && (
                  <button
                    onClick={() => handleAnalyzeToday(false)}
                    className="w-full p-2.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                          오늘
                        </span>
                        <span className="text-xs font-semibold text-white">
                          오늘 대화 ({todayUserMsgs.length}개 질문)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-300/80 mt-1">
                        클릭하여 오늘 통찰 바로 생성 ✨
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-amber-400/60 group-hover:translate-x-0.5 transition-transform mt-1" />
                  </button>
                )}

                {/* Saved list */}
                {insights.map((item) => {
                  const isSelected = selectedInsight?.id === item.id;
                  const isToday = item.date === todayDateStr;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border border-amber-400/50 shadow-md shadow-amber-950/40 text-white'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isToday
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {item.date}
                          </span>
                          {isToday && (
                            <span className="text-[10px] text-amber-300 font-bold">TODAY</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {item.userQueryCount ? `${item.userQueryCount}문답` : ''}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 break-keep break-words whitespace-normal leading-relaxed">
                        {item.primaryTheme || item.coreInsight}
                      </div>
                      <div className="flex items-center gap-1 overflow-hidden mt-0.5">
                        {item.keywords?.slice(0, 2).map((kw, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 truncate max-w-[80px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}

                {insights.length === 0 && todayUserMsgs.length === 0 && (
                  <div className="text-center py-8 px-4 text-xs text-slate-500">
                    <MessageSquare size={24} className="mx-auto mb-2 text-slate-600" />
                    저장된 대화 통찰이 없습니다.<br />
                    루시와 대화를 나누면 자동으로 통찰이 누적됩니다.
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Detail Insight Card */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-white/[0.01] to-transparent premium-scroll">
              {selectedInsight ? (
                <div className="space-y-4">
                  {/* Insight Date Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Calendar size={13} />
                        {selectedInsight.date} 통찰 리포트
                      </span>
                      {selectedInsight.date === todayDateStr && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          오늘의 기록
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayTTS(selectedInsight.coreInsight)}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          ttsState.isSpeaking && ttsState.activeText === selectedInsight.coreInsight
                            ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                        }`}
                        title="핵심 통찰 낭독"
                      >
                        {ttsState.isSpeaking && ttsState.activeText === selectedInsight.coreInsight ? (
                          <VolumeX size={13} />
                        ) : (
                          <Volume2 size={13} />
                        )}
                        <span className="text-[11px]">음성</span>
                      </button>

                      <button
                        onClick={() => handleCopy(selectedInsight.coreInsight, 'core')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
                        title="핵심 문장 복사"
                      >
                        {copiedField === 'core' ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                        <span className="text-[11px]">복사</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Core Insight Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-purple-500/15 border border-amber-500/30 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                      <Sparkles size={80} className="text-amber-300" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400/90 mb-1.5 block">
                      Core Soul Realization · 핵심 통찰
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      "{selectedInsight.coreInsight}"
                    </h3>

                    {/* Keywords Tag Pill list */}
                    {selectedInsight.keywords && selectedInsight.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {selectedInsight.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-amber-200/90 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Emotional Shift & Consciousness Trajectory */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <HeartHandshake size={14} className="text-rose-400" />
                      <span>내면 상태 및 의식의 전환 (Emotional Shift)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 block mb-0.5">시작 시점</span>
                        <p className="text-xs text-rose-300 font-medium">
                          {selectedInsight.emotionalShift.before || '고민과 해답 탐색'}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/30 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 block mb-0.5">전환된 상태</span>
                        <p className="text-xs text-emerald-200 font-medium">
                          {selectedInsight.emotionalShift.after || '고요한 수용과 안도'}
                        </p>
                      </div>
                    </div>

                    {selectedInsight.emotionalShift.description && (
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        {selectedInsight.emotionalShift.description}
                      </p>
                    )}
                  </div>

                  {/* 3. Deep Realizations (깊은 깨달음 목록) */}
                  {selectedInsight.deepRealizations && selectedInsight.deepRealizations.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Lightbulb size={14} />
                        <span>영적 성찰 & 깊은 깨달음 (Deep Realizations)</span>
                      </div>
                      <ul className="space-y-2">
                        {selectedInsight.deepRealizations.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 flex items-start gap-2 bg-white/[0.02] p-2 rounded-xl border border-white/5"
                          >
                            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 4. Action Prescriptions & Meditation Focus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Actionable Guidance */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                        <Compass size={14} />
                        <span>오늘의 구체적 처방</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {selectedInsight.actionPrescriptions?.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-sky-400 text-sm leading-none">•</span>
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Meditation Prompt */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <Moon size={14} />
                        <span>오늘 밤 사색 화두</span>
                      </div>
                      <p className="text-xs text-purple-200/90 leading-relaxed italic">
                        "{selectedInsight.meditationPrompt}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action: Consult Lucy Deeply with this Insight */}
                  {onConsultInsight && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const consultPrompt = `[인사이트 요약 보드 연계 질문]\n일자: ${selectedInsight.date}\n핵심 통찰: "${selectedInsight.coreInsight}"\n\n이 통찰과 관련해서 내 마음을 더 깊이 통찰하고, 지금 상황에서 놓치지 말아야 할 우주적 메시지를 들려줘.`;
                          onClose();
                          onConsultInsight(consultPrompt);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send size={14} className="text-slate-950" />
                        <span>이 통찰로 루시에게 심층 질문하기</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <Sparkles size={36} className="text-amber-400/40 animate-pulse" />
                  <p className="text-xs text-slate-400">
                    좌측 목록에서 열람할 날짜의 인사이트를 선택하거나,<br />
                    상단의 [AI 통찰 추출] 버튼을 눌러 오늘 대화를 요약해 보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
