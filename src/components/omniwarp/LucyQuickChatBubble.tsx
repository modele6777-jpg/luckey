import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  Maximize2,
  Loader2,
  Bot,
  ArrowRight,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Copy,
  Check,
  ImagePlus,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useApp, UnifiedMessage } from '@/contexts/AppContext';
import { DynamicGhostInputPlaceholder } from '@/components/chat/DynamicGhostInputPlaceholder';
import { isGreetingMessage } from '@/lib/chatHistorySync';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { playTTSInChunks, stopTTS, subscribeTTS, normalizeTextForSpeech } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';
import { splitIntoKakaoBubbles, joinKakaoBubblesForTTS } from '@/lib/lucyChatUtils';
import { cleanAssistantMessageDisplay, cleanUserMessageDisplay } from '@/utils/cleanMessage';
import { collectSpeechTranscript, createEndOfSpeechWatcher, type EndOfSpeechWatcher } from '@/lib/speechAutoSend';

// 💬 퀵 말풍선 전용 감성 맞춤 예시 고민 풀 (루시 호리 라이브러리 및 데일리 힐링)
const QUICK_LUCY_PROMPTS = [
  '루시야, 오늘 하루를 어떻게 보내면 기분이 한결 좋아질까?',
  '요즘 생각이 너무 많은데 머릿속을 정리할 수 있는 좋은 질문을 던져줘.',
  '오늘 나에게 어울리는 행운의 컬러와 마음가짐은 무엇인지 알려줘.',
  '지금 이 순간 내 마음에 가장 필요한 따뜻한 위로는 무엇일까?',
  '오늘 하루를 특별하게 만들어줄 작은 실천 팁 하나만 알려줘.',
  '지친 나를 위해 따뜻한 차 한 잔 마시듯 마음을 포근하게 녹여줘.',
  '답답했던 마음을 시원하게 환기할 수 있는 긍정적인 생각법을 알려줘.',
  '오늘 밤 편안하게 푹 쉴 수 있는 다정한 힐링 한마디 부탁해.',
  '내 안의 불안을 가라앉히고 평온함을 되찾는 짧은 대화를 나누자.',
  '루시, 오늘 나 자신을 더 사랑할 수 있는 칭찬 한마디 해줄래?',
  '새로운 시작을 앞두고 용기를 북돋워 주는 따뜻한 조언을 듣고 싶어.',
  '지금 내 마음의 날씨를 알아차리고 다독여주는 시간을 가져보자.',
  '오늘 하루 소소하지만 확실한 행복을 찾는 비결은 무엇일까?',
  '루시의 눈으로 본 나의 가장 빛나는 장점은 무엇인지 말해줘.',
  '스트레스를 비우고 좋은 에너지를 채우는 오늘의 확언 한 줄을 들려줘!',
  '마음이 복잡할 때 호흡을 차분히 가다듬는 1분 이완법을 알려줘.',
  '인간관계에서 마음의 경계를 건강하게 지키는 방법은 무엇일까?',
  '오늘 나에게 일어날 수 있는 기분 좋은 우연과 행운은 무엇일지 알려줘.',
  '스스로에게 너무 엄격해질 때 나를 다정하게 안아주는 법을 알려줘.',
  '오늘 하루를 감사함으로 마무리하는 저녁 루틴을 추천해 줘.'
];

interface LucyQuickChatBubbleProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  initialVoiceActive?: boolean;
  initialAutoSend?: boolean;
}

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// 이미 순차 노출이 완료된 퀵 말풍선 메시지 ID 캐시 (재열림 시 재애니메이션 방지)
const revealedQuickMessageIds = new Set<string>();

/**
 * 음성 낭독에 방해가 되는 마크다운, 링크, 이미지 태그 등을 정제하여
 * 사람이 말하는 자연스러운 구어체 텍스트로 변환합니다.
 */
function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  const joined = joinKakaoBubblesForTTS(cleanAssistantMessageDisplay(text), 4) || text;
  const normalized = normalizeTextForSpeech(joined);
  if (normalized) return normalized;
  let cleaned = joined;
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');
  cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/\[EMOTION:\s*[^\]]+\]/gi, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * 💬 루시 퀵 대화 전용 다중 분할 말풍선 그룹 (루시채팅과 동일하게 답변을 2~4개로 쪼개서 순차 전송)
 */
function LucyQuickSplitBubbleGroup({
  msgId,
  textContent,
  isLatest,
  isGenerating,
  isHistorical,
  isPlaying,
  copiedId,
  onCopy,
  onToggleSpeak,
  onBubbleReveal,
}: {
  msgId: string;
  textContent: string;
  isLatest: boolean;
  isGenerating: boolean;
  isHistorical: boolean;
  isPlaying: boolean;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onToggleSpeak: (id: string, text: string) => void;
  onBubbleReveal: () => void;
}) {
  const bubbles = useMemo(() => splitIntoKakaoBubbles(textContent, 4), [textContent]);
  const fullJoinedText = useMemo(() => joinKakaoBubblesForTTS(textContent, 4) || textContent, [textContent]);

  const shouldSkipStagger = isHistorical || !isLatest || revealedQuickMessageIds.has(msgId);

  const [visibleCount, setVisibleCount] = useState<number>(() => {
    if (shouldSkipStagger) {
      if (msgId && !isGenerating) revealedQuickMessageIds.add(msgId);
      return Math.max(1, bubbles.length);
    }
    if (isGenerating) {
      const hasParagraphBreak = /\n{2,}/.test(textContent);
      return hasParagraphBreak || textContent.length >= 90 ? 1 : 0;
    }
    return 1;
  });

  const prevVisibleCountRef = useRef(visibleCount);

  useEffect(() => {
    if (shouldSkipStagger) {
      if (!isGenerating && bubbles.length > 0) {
        revealedQuickMessageIds.add(msgId);
      }
      setVisibleCount(bubbles.length);
      return;
    }

    // 1. 스트리밍 진행 중일 때: 첫 번째 단락(\n\n)이 완성되면 첫 번째 말풍선을 먼저 톡! 띄움
    if (isGenerating) {
      const hasParagraphBreak = /\n{2,}/.test(textContent);
      if ((hasParagraphBreak || textContent.length >= 90) && visibleCount < 1 && bubbles.length >= 1) {
        setVisibleCount(1);
      }
      return;
    }

    // 2. 스트리밍 완료 직후: 최소 1번째 말풍선은 즉시 노출
    if (visibleCount === 0 && bubbles.length >= 1) {
      setVisibleCount(1);
      return;
    }

    // 3. 2~4번째 말풍선을 카톡 간격(360ms)으로 순차 전송 연출
    if (visibleCount < bubbles.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => {
          const next = Math.min(bubbles.length, prev + 1);
          if (next >= bubbles.length) {
            revealedQuickMessageIds.add(msgId);
          }
          return next;
        });
      }, 360);
      return () => clearTimeout(timer);
    } else if (bubbles.length > 0) {
      revealedQuickMessageIds.add(msgId);
    }
  }, [bubbles.length, isGenerating, msgId, shouldSkipStagger, textContent, visibleCount]);

  useEffect(() => {
    if (visibleCount > prevVisibleCountRef.current) {
      prevVisibleCountRef.current = visibleCount;
      onBubbleReveal();
    }
  }, [visibleCount, onBubbleReveal]);

  const displayedBubbles = shouldSkipStagger
    ? bubbles
    : bubbles.slice(0, Math.min(visibleCount, bubbles.length));

  const isStaggeringMoreBubbles =
    !shouldSkipStagger && (isGenerating || visibleCount < bubbles.length);

  if (bubbles.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full min-w-0 max-w-[85%]">
      <AnimatePresence initial={false}>
        {displayedBubbles.map((bubbleText, bIdx) => {
          const isFirstBubble = bIdx === 0;
          const isLastBubble = bIdx === bubbles.length - 1;
          const bubbleCopyId = `${msgId}-qb-${bIdx}`;

          return (
            <motion.div
              key={`${msgId}-qbubble-${bIdx}`}
              initial={shouldSkipStagger ? false : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-end gap-1.5 min-w-0 max-w-full group/qbubble"
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] sm:text-[14px] font-medium leading-[1.66] select-text min-w-0 max-w-full break-words [overflow-wrap:anywhere] border transition-all ${
                  isFirstBubble ? 'rounded-tl-xs' : 'rounded-tl-md'
                } ${
                  isPlaying
                    ? 'border-amber-400/70 ring-1 ring-amber-400/35'
                    : 'border-cyan-400/25'
                }`}
                style={{
                  color: '#f8fafc',
                  background:
                    'linear-gradient(160deg, rgba(20, 28, 58, 0.94) 0%, rgba(12, 17, 38, 0.96) 100%)',
                  boxShadow:
                    '0 8px 22px rgba(2, 4, 14, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  className="lucy-cosmic-body whitespace-pre-wrap break-words"
                  style={{ color: '#f8fafc' }}
                >
                  {bubbleText}
                </div>

                {/* 마지막 말풍선 하단에 통합 듣기/멈춤 & 복사 컨트롤 표시 */}
                {isLastBubble && !isStaggeringMoreBubbles && (
                  <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-white/10">
                    {bubbles.length > 1 ? (
                      <span
                        className="lucy-cosmic-muted text-[10px] font-mono text-slate-400"
                        style={{ color: '#94a3b8' }}
                      >
                        {bubbles.length}개 분할 답변 완료
                      </span>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onCopy(msgId, fullJoinedText)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                        style={{ color: '#cbd5e1' }}
                        title={bubbles.length > 1 ? '전체 말풍선 복사' : '복사'}
                      >
                        {copiedId === msgId ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span style={{ color: '#6ee7b7' }}>복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>복사</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleSpeak(msgId, fullJoinedText)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50 animate-pulse'
                            : 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/20'
                        }`}
                        style={{
                          color: isPlaying ? '#fde68a' : '#67e8f9',
                        }}
                        title={isPlaying ? '한 번 더 눌러 음성 멈추기' : '음성으로 연속 듣기'}
                        aria-label="음성 듣기 토글"
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX size={12} className="text-amber-300" />
                            <span>멈춤</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} className="text-cyan-300" />
                            <span>{bubbles.length > 1 ? '연속 듣기' : '듣기'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 다중 말풍선일 때 우측 순번 및 개별 복사 버튼 */}
              {bubbles.length > 1 && (
                <div className="flex flex-col items-start gap-0.5 shrink-0 pb-0.5 opacity-65 group-hover/qbubble:opacity-100 transition-opacity">
                  <span
                    className="lucy-cosmic-muted text-[9px] font-mono tabular-nums px-0.5 select-none"
                    style={{ color: '#94a3b8' }}
                  >
                    {bIdx + 1}/{bubbles.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy(bubbleCopyId, bubbleText)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    style={{ color: '#94a3b8' }}
                    title={`이 말풍선(${bIdx + 1}/${bubbles.length})만 복사`}
                  >
                    {copiedId === bubbleCopyId ? (
                      <Check size={10} className="text-emerald-400" />
                    ) : (
                      <Copy size={10} />
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 카톡식 연속 말풍선 입력 중 인디케이터 */}
      {isStaggeringMoreBubbles && displayedBubbles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl rounded-tl-xs w-fit border border-cyan-400/35 bg-slate-900/95 shadow-[0_0_14px_rgba(0,240,255,0.18)]"
        >
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
          </div>
          <span
            className="lucy-cosmic-cyan text-[11px] font-semibold text-cyan-200"
            style={{ color: '#a5f3fc' }}
          >
            루시가 이어서 톡을 보내고 있어... ({displayedBubbles.length}/{Math.max(2, bubbles.length)})
          </span>
        </motion.div>
      )}
    </div>
  );
}

export const LucyQuickChatBubble: React.FC<LucyQuickChatBubbleProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  initialVoiceActive = false,
  initialAutoSend = false,
}) => {
  const [location, navigate] = useLocation();
  const { personaMessages, sendUnifiedMessage, isGenerating } = useApp();
  const [input, setInput] = useState('');
  const [activeGhostPrompt, setActiveGhostPrompt] = useState('');
  const currentGhostPromptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bubbleMountedAtRef = useRef<number>(Date.now());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // 🎙️ 음성 모드 (STT / TTS) 상태 관리
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [, setSpeechInterim] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isGlobalTtsSpeaking, setIsGlobalTtsSpeaking] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isVoiceModeRef = useRef<boolean>(isVoiceMode);
  const voiceStateRef = useRef<VoiceState>(voiceState);
  const speechTranscriptRef = useRef<string>(speechTranscript);
  const isMutedRef = useRef<boolean>(isMuted);

  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
  }, [isVoiceMode]);

  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);

  useEffect(() => {
    speechTranscriptRef.current = speechTranscript;
  }, [speechTranscript]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const isLucyGenerating = !!isGenerating?.lucy;

  // 🔊 루시 답변 자동 음성 읽기 (Auto-TTS 바로재생) 상태 및 영구 설정 (기본값: ON, localStorage 및 루시채팅과 동기화)
  const [isAutoRead, setIsAutoRead] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lucy_chat_auto_tts');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  const isAutoReadRef = useRef<boolean>(isAutoRead);
  useEffect(() => {
    isAutoReadRef.current = isAutoRead;
  }, [isAutoRead]);

  const [autoReadToast, setAutoReadToast] = useState<string | null>(null);
  const autoReadToastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // 전역 TTS 상태 구독하여 재생/종료 상태 실시간 동기화
  useEffect(() => {
    return subscribeTTS((state) => {
      const active = Boolean(state.isSpeaking || state.isLoading);
      setIsGlobalTtsSpeaking(active);
      if (!active) {
        setPlayingMessageId(null);
        setVoiceState((s) => (s === 'speaking' ? (isVoiceModeRef.current ? 'listening' : 'idle') : s));
      }
    });
  }, []);

  // 스토리지 및 루시채팅 등 타 뷰의 자동읽기 설정 변경 동기화 리스너
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lucy_chat_auto_tts') {
        const nextVal = e.newValue !== 'false';
        isAutoReadRef.current = nextVal;
        setIsAutoRead(nextVal);
      }
    };
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (typeof detail === 'boolean') {
        isAutoReadRef.current = detail;
        setIsAutoRead(detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('prism:auto_tts_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('prism:auto_tts_changed', handleCustom);
      if (autoReadToastTimerRef.current) {
        clearTimeout(autoReadToastTimerRef.current);
      }
    };
  }, []);

  // 🔊 자동 읽기 ON/OFF 토글 핸들러 (켜져 있거나 음성 재생 중일 때 한 번 더 누르면 즉시 OFF 및 음성 중지)
  const toggleAutoRead = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    const currentVal = isAutoReadRef.current;
    // 현재 자동읽기가 켜져 있거나 음성이 재생 중이면 무조건 끄기(false) + 즉시 음성 정지
    const next = currentVal || isGlobalTtsSpeaking || playingMessageId !== null ? !currentVal : true;
    // 만약 이미 켜진 상태에서 눌렀다면 확실하게 false로 전환
    const finalNext = currentVal ? false : next;

    isAutoReadRef.current = finalNext;
    setIsAutoRead(finalNext);

    try {
      localStorage.setItem('lucy_chat_auto_tts', String(finalNext));
      window.dispatchEvent(new CustomEvent('prism:auto_tts_changed', { detail: finalNext }));
    } catch (_) {}

    if (!finalNext) {
      stopTTS();
      setPlayingMessageId(null);
      setIsGlobalTtsSpeaking(false);
      setVoiceState((s) => (s === 'speaking' ? (isVoiceModeRef.current ? 'listening' : 'idle') : s));
    }

    if (autoReadToastTimerRef.current) clearTimeout(autoReadToastTimerRef.current);
    setAutoReadToast(finalNext ? '🔊 답변 자동 읽기 ON' : '🔇 답변 자동 읽기 OFF (음성 중지)');
    autoReadToastTimerRef.current = setTimeout(() => setAutoReadToast(null), 2200);
  }, [isGlobalTtsSpeaking, playingMessageId]);

  // 📋 메시지 복사 핸들러
  const handleCopyMessage = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
  }, []);

  // 🔊 개별 메시지 음성 듣기/멈춤 핸들러 (한 번 더 누르면 즉시 멈춤)
  const handlePlayMessageTTS = useCallback(async (msgId: string, content: string) => {
    if (playingMessageId === msgId || (playingMessageId === 'latest' && isGlobalTtsSpeaking)) {
      stopTTS();
      setPlayingMessageId(null);
      setIsGlobalTtsSpeaking(false);
      setVoiceState((s) => (s === 'speaking' ? 'idle' : s));
      return;
    }
    const spokenText = cleanTextForSpeech(content);
    if (!spokenText) return;
    try {
      unlockAudioPlayback();
      primeTTSAudioElement();
      stopTTS();
      setPlayingMessageId(msgId);
      setVoiceState('speaking');
      await playTTSInChunks(
        spokenText,
        'Aoede',
        110,
        undefined,
        undefined,
        { skipCompletionChime: true, isChatMode: true, isAutoPlay: false, isUserToggleClick: true }
      );
    } catch (err) {
      console.warn('[LucyQuickChatBubble] play individual message TTS error:', err);
    } finally {
      setPlayingMessageId((curr) => (curr === msgId ? null : curr));
      setVoiceState((s) => (s === 'speaking' ? 'idle' : s));
    }
  }, [playingMessageId, isGlobalTtsSpeaking]);

  // ⏱️ 말풍선 모드 1시간 주기 자동 초기화 관리 (1시간 = 3,600,000ms)
  const [bubbleCutoffTime, setBubbleCutoffTime] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('lucy_bubble_session_cutoff') || '0');
      return saved || 0;
    } catch {
      return 0;
    }
  });

  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // 말풍선 열림 시 1시간 비활성 검사 및 열려있는 동안 15초 주기 만료 체크
  useEffect(() => {
    if (!isOpen) return;

    bubbleMountedAtRef.current = Date.now();
    const currentNow = Date.now();
    setNowTick(currentNow);

    try {
      const lastActive = Number(localStorage.getItem('lucy_bubble_last_active_at') || '0');
      if (lastActive > 0 && currentNow - lastActive >= 60 * 60 * 1000) {
        localStorage.setItem('lucy_bubble_session_cutoff', String(currentNow));
        setBubbleCutoffTime(currentNow);
      }
    } catch (_) {}

    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 15000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // 🔄 말풍선 1시간 세션 수동 즉시 초기화 (새 대화 시작)
  const handleResetBubbleSession = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}
    const newCutoff = Date.now();
    setBubbleCutoffTime(newCutoff);
    setNowTick(newCutoff);
    try {
      localStorage.setItem('lucy_bubble_session_cutoff', String(newCutoff));
      localStorage.setItem('lucy_bubble_last_active_at', String(newCutoff));
    } catch (_) {}
    stopTTS();
    setPlayingMessageId(null);
    setVoiceState((s) => (s === 'speaking' ? 'idle' : s));
    if (autoReadToastTimerRef.current) clearTimeout(autoReadToastTimerRef.current);
    setAutoReadToast('⏱️ 말풍선 대화가 1시간 새 세션으로 초기화되었습니다.');
    autoReadToastTimerRef.current = setTimeout(() => setAutoReadToast(null), 2500);
  }, []);

  // 🎯 인사말 제외 및 1시간 주기 자동 초기화 필터링
  const lucyMessages = useMemo(() => {
    const rawList = personaMessages?.lucy || [];
    const oneHourAgo = nowTick - 60 * 60 * 1000;
    const effectiveCutoff = Math.max(oneHourAgo, bubbleCutoffTime);

    return rawList.filter((m: UnifiedMessage) => {
      if (m.id === 'greet' || m.id === 'default-greeting') return false;
      if (isGreetingMessage(m)) return false;

      const msgTime =
        m.timestamp ||
        (typeof m.id === 'string' && m.id.startsWith('msg-')
          ? parseInt(m.id.split('-')[1], 36)
          : 0);

      if (msgTime > 0 && msgTime < effectiveCutoff) {
        return false;
      }

      return true;
    });
  }, [personaMessages?.lucy, nowTick, bubbleCutoffTime]);

  // 스크롤 최하단 자동 이동
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // 🎙️ 음성 인식 중지
  const speechWatcherRef = useRef<EndOfSpeechWatcher | null>(null);
  const stopRecognition = useCallback(() => {
    speechWatcherRef.current?.dispose();
    speechWatcherRef.current = null;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    try {
      recognition?.abort();
    } catch (_) {}
  }, []);

  // 📷 사진 파일 선택 및 자동 리사이즈/압축 핸들러
  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      if (autoReadToastTimerRef.current) clearTimeout(autoReadToastTimerRef.current);
      setAutoReadToast('⚠️ 사진 크기는 최대 15MB까지 가능합니다.');
      autoReadToastTimerRef.current = setTimeout(() => setAutoReadToast(null), 2400);
      e.target.value = '';
      return;
    }

    setIsCompressingPhoto(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = typeof reader.result === 'string' ? reader.result : '';
          if (!result) {
            reject(new Error('Empty image data'));
            return;
          }
          const img = new Image();
          img.onload = () => {
            try {
              const MAX_DIM = 1024;
              let w = img.width;
              let h = img.height;
              if (w > MAX_DIM || h > MAX_DIM) {
                if (w > h) {
                  h = Math.round((h * MAX_DIM) / w);
                  w = MAX_DIM;
                } else {
                  w = Math.round((w * MAX_DIM) / h);
                  h = MAX_DIM;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.84));
              } else {
                resolve(result);
              }
            } catch {
              resolve(result);
            }
          };
          img.onerror = () => resolve(result);
          img.src = result;
        };
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });

      setAttachedPhoto(dataUrl);
      try {
        playAudioHaptic('tap_impact');
        triggerHaptic('whitehole');
      } catch (_) {}
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    } catch (err) {
      console.warn('[LucyQuickChatBubble] Photo select error:', err);
    } finally {
      setIsCompressingPhoto(false);
      e.target.value = '';
    }
  }, []);

  // 🚀 메시지 및 사진 전송 핸들러 (루시채팅과 동일하게 2~4개 말풍선 분할 답변 규칙 적용)
  const handleSend = useCallback(async (textToSend?: string, overridePhotoUrl?: string) => {
    const photoToSend = overridePhotoUrl || attachedPhoto || undefined;
    const candidateGhost = !input.trim() && !photoToSend ? currentGhostPromptRef.current || activeGhostPrompt : '';
    const rawMsg =
      textToSend ||
      (input.trim()
        ? input
        : photoToSend
        ? '이 사진을 보고 루시의 따뜻하고 깊이 있는 시선으로 분석하고 이야기해줘!'
        : candidateGhost);
    if ((!rawMsg || !rawMsg.trim()) && !photoToSend) return;
    if (isLucyGenerating) return;

    const userText = rawMsg.trim() || '이 사진을 보고 이야기해줘!';
    setInput('');
    setAttachedPhoto(null);
    setSpeechTranscript('');
    setSpeechInterim('');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
      unlockAudioPlayback();
      primeTTSAudioElement();
      localStorage.setItem('lucy_bubble_last_active_at', String(Date.now()));
    } catch (_) {}

    const wasVoiceActive = isVoiceModeRef.current;
    if (wasVoiceActive) {
      stopRecognition();
      stopTTS();
      setVoiceState('thinking');
    } else {
      stopTTS();
      setPlayingMessageId(null);
    }

    try {
      const multiBubbleRule = `[💬 루시 퀵 대화 & 카톡식 다중 말풍선 분할 규칙]
- 실제 사람이 카카오톡으로 단짝 친구에게 다정하게 이야기하듯, 답변을 한 덩어리로 길게 쓰지 말고 반드시 빈 줄(\`\\n\\n\`)로 구분된 2~4개의 자연스러운 말풍선 단락으로 쪼개서 대답해줘.
- 첫 번째 말풍선은 다정한 공감이나 핵심 첫인사로 짧고 산뜻하게 시작하고, 이어지는 말풍선에서 구체적인 조언이나 따뜻한 위로를 이어가줘.`;

      const voiceSystemContext = wasVoiceActive
        ? `${multiBubbleRule}
[🎙️ 실시간 1:1 음성 대화 모드 특화 지침]
지금 사용자와 실시간 음성으로 대화 중이야.
1. 각 말풍선 단락을 1~2문장씩 호흡이 짧고 다정한 구어체 반말로 작성해줘.
2. 마크다운 기호(#, **, -, * 등)나 링크 주소는 소리 내어 읽기에 어색하므로 절대 사용하지 말고 자연스러운 말소리 문장으로 구성해줘.`
        : multiBubbleRule;

      await sendUnifiedMessage(userText, 'lucy', photoToSend, {
        mode: 'casual',
        channels: [],
        extraSystemContext: voiceSystemContext,
        onFinish: async (fullText, _sentText, replyMsgId) => {
          const shouldSpeak = isVoiceModeRef.current || isAutoReadRef.current;
          if (!shouldSpeak) return;

          const spokenText = cleanTextForSpeech(fullText);
          if (spokenText) {
            const targetId = replyMsgId || 'latest';
            setVoiceState('speaking');
            setPlayingMessageId(targetId);
            try {
              await playTTSInChunks(
                spokenText,
                'Aoede',
                110,
                undefined,
                undefined,
                { skipCompletionChime: true, isChatMode: true, isAutoPlay: true }
              );
            } catch (ttsErr) {
              console.warn('[LucyQuickChatBubble] playTTSInChunks error:', ttsErr);
            } finally {
              setPlayingMessageId((curr) => (curr === targetId ? null : curr));
              if (isVoiceModeRef.current) {
                setVoiceState('listening');
                startListening();
              } else {
                setVoiceState('idle');
              }
            }
          } else {
            if (isVoiceModeRef.current) {
              setVoiceState('listening');
              startListening();
            } else {
              setVoiceState('idle');
            }
          }
        },
      });
    } catch (err) {
      console.error('[LucyQuickChatBubble] Failed to send message:', err);
      if (isVoiceModeRef.current) {
        setVoiceState('listening');
        startListening();
      }
    }
  }, [input, attachedPhoto, activeGhostPrompt, isLucyGenerating, sendUnifiedMessage, stopRecognition]);

  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  // 🎙️ 음성 인식 시작 (STT)
  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || !isVoiceModeRef.current || isMutedRef.current) return;
    stopRecognition();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      setVoiceState('error');
      return;
    }

    try {
      unlockAudioPlayback();
      primeTTSAudioElement();

      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const isCurrent = () => recognitionRef.current === recognition && isVoiceModeRef.current && !isMutedRef.current;

      recognition.onstart = () => {
        if (!isCurrent()) return;
        setVoiceError(null);
        setVoiceState('listening');
      };

      // 말이 끝나면(들은 글자가 1.2초 동안 그대로면) 시리처럼 자동 전송한다. (iOS가 같은 결과를 반복해도 OK)
      const watcher = createEndOfSpeechWatcher({
        canSend: () => isCurrent() && voiceStateRef.current !== 'thinking' && voiceStateRef.current !== 'speaking',
        onSend: (text) => { void handleSendRef.current(text); },
      });
      speechWatcherRef.current?.dispose();
      speechWatcherRef.current = watcher;

      recognition.onresult = (event: any) => {
        if (!isCurrent() || watcher.sent) return;
        const { text, interim } = collectSpeechTranscript(event.results);
        if (!watcher.heard(text)) return;
        speechTranscriptRef.current = text;
        setSpeechTranscript(text);
        setSpeechInterim(interim);
      };

      recognition.onerror = (e: any) => {
        if (!isCurrent()) return;
        console.warn('[LucyQuickChatBubble] STT error:', e.error || e);
        if (e.error === 'not-allowed') {
          stopRecognition();
          setVoiceError('마이크 권한이 차단되어 있습니다.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        if (!isCurrent()) return;
        // 브라우저가 듣기를 닫으면, 들은 말이 있을 때 바로 보낸다.
        if (watcher.sent || watcher.flush()) return;
        if (voiceStateRef.current === 'listening') {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      stopRecognition();
      console.warn('[LucyQuickChatBubble] startListening error:', err);
      setVoiceState('idle');
    }
  }, [stopRecognition]);

  // 🎙️ 루시 말 끊기 (인터럽트) 및 듣기 전환
  const handleInterruptLucy = useCallback(() => {
    triggerHaptic('whitehole');
    stopTTS();
    setPlayingMessageId(null);
    setVoiceState('listening');
    startListening();
  }, [startListening]);

  // 🎙️ 음성 모드 토글
  const handleToggleVoiceMode = useCallback(() => {
    triggerHaptic('whitehole');
    if (isVoiceModeRef.current) {
      isVoiceModeRef.current = false;
      speechTranscriptRef.current = '';
      stopRecognition();
      stopTTS();
      setPlayingMessageId(null);
      setIsVoiceMode(false);
      setVoiceState('idle');
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
    } else {
      isVoiceModeRef.current = true;
      isMutedRef.current = false;
      setIsVoiceMode(true);
      setIsMuted(false);
      setVoiceState('listening');
      startListening();
    }
  }, [startListening, stopRecognition]);

  // 🌟 오픈 및 초기 음성 모드 연동
  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      if (initialVoiceActive) {
        unlockAudioPlayback();
        primeTTSAudioElement();
        setIsVoiceMode(true);
        isVoiceModeRef.current = true;
        isMutedRef.current = false;
        setIsMuted(false);
        setVoiceState('listening');
        voiceStateRef.current = 'listening';
        startListening();
      } else {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 150);
      }
    } else {
      isVoiceModeRef.current = false;
      speechTranscriptRef.current = '';
      stopRecognition();
      stopTTS();
      setPlayingMessageId(null);
      setIsVoiceMode(false);
      setVoiceState('idle');
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
    }
  }, [isOpen, initialVoiceActive, scrollToBottom, startListening, stopRecognition]);

  useEffect(() => () => {
    isVoiceModeRef.current = false;
    stopRecognition();
  }, [stopRecognition]);

  // Only an open bubble handles explicit voice-send and abort events.
  useEffect(() => {
    if (!isOpen) return;
    const handleCommitVoice = (e?: Event) => {
      const customDetail = (e as CustomEvent)?.detail;
      const selectedText = customDetail?.textToToss;
      const currentSpeech = speechTranscriptRef.current;

      if (currentSpeech && currentSpeech.trim().length >= 1) {
        handleSend(currentSpeech.trim());
      } else if (selectedText && selectedText.trim().length >= 1) {
        const prompt = `내가 선택한 문장이야:\n"${selectedText.trim()}"\n\n이 내용에 대해 핵심과 따뜻한 피드백을 친절하게 이야기해 줘.`;
        if (autoSentPromptRef.current !== prompt && !isLucyGenerating) {
          autoSentPromptRef.current = prompt;
          handleSend(prompt);
        }
      } else if (initialPrompt && initialPrompt.trim().length >= 1 && !isLucyGenerating) {
        const prompt = initialPrompt.trim();
        if (autoSentPromptRef.current !== prompt) {
          autoSentPromptRef.current = prompt;
          handleSend(prompt);
        }
      }
    };
    const handleAbortVoice = () => {
      isVoiceModeRef.current = false;
      speechTranscriptRef.current = '';
      setIsVoiceMode(false);
      stopRecognition();
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceState('idle');
    };

    window.addEventListener('prism:quick_chat_commit_voice', handleCommitVoice);
    window.addEventListener('prism:abort_lucy_voice_ptt', handleAbortVoice);
    return () => {
      window.removeEventListener('prism:quick_chat_commit_voice', handleCommitVoice);
      window.removeEventListener('prism:abort_lucy_voice_ptt', handleAbortVoice);
    };
  }, [isOpen, handleSend, stopRecognition, initialPrompt, isLucyGenerating]);

  // 메시지 업데이트 시 스크롤
  useEffect(() => {
    if (isOpen && lucyMessages.length > 0) {
      scrollToBottom(true);
    }
  }, [isOpen, lucyMessages.length, isLucyGenerating, scrollToBottom]);

  const autoSentPromptRef = useRef<string | null>(null);

  // 초기 프롬프트 전달 시 입력창 자동 채움 및 즉시 발송 (문장 드래그 토스 등)
  useEffect(() => {
    if (!isOpen) {
      autoSentPromptRef.current = null;
      return;
    }

    if (isOpen && initialAutoSend && initialPrompt && initialPrompt.trim()) {
      const promptToAutoSend = initialPrompt.trim();
      if (autoSentPromptRef.current !== promptToAutoSend && !isLucyGenerating) {
        const timer = setTimeout(() => {
          if (autoSentPromptRef.current === promptToAutoSend) return;
          // A re-render may cancel this timer; only mark delivery once it actually starts.
          autoSentPromptRef.current = promptToAutoSend;
          handleSend(promptToAutoSend);
        }, 80);
        return () => clearTimeout(timer);
      }
    } else if (isOpen && initialPrompt && initialPrompt.trim()) {
      setInput(initialPrompt.trim());
    }
  }, [isOpen, initialAutoSend, initialPrompt, isLucyGenerating, handleSend]);

  // 풀스크린 루시 채팅(/chat)으로 확장 도약
  const handleExpandToFullScreen = () => {
    onClose();
    if (typeof window !== 'undefined') {
      (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    }
    navigate('/chat');
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/chat' } }));
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(target) &&
        !target.closest('#bigbang-omnibutton') &&
        !target.closest('[data-bigbang="true"]') &&
        !target.closest('.bottom-safe-fab-center')
      ) {
        onClose();
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick, true);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick, true);
    };
  }, [isOpen, onClose]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={bubbleRef}
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 14 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="루시 빠른 대화"
          data-lucy-quick-chat="true"
          data-keep-dark="true"
          className="lucy-cosmic-bubble keep-dark absolute bottom-[96px] sm:bottom-[104px] left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] max-w-[432px] sm:max-w-[468px] z-50 overflow-visible pointer-events-auto select-none"
          style={{
            touchAction: 'auto',
          }}
        >
          {/* 🌌 1. 배후 오로라 네온 글로우 후광 (Cosmic Aurora Ambient Halo) */}
          <div
            className="absolute -inset-[2px] rounded-[28px] pointer-events-none -z-10 opacity-90 blur-[10px]"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 240, 255, 0.45) 0%, rgba(168, 85, 247, 0.4) 52%, rgba(251, 191, 36, 0.35) 100%)',
            }}
          />

          {/* 🔮 2. 오로라 네온 테두리 프레임 & 다크 코스믹 글래스 본체 */}
          <div
            className="relative p-[1.5px] rounded-[26px] z-10 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 240, 255, 0.88) 0%, rgba(168, 85, 247, 0.78) 50%, rgba(251, 191, 36, 0.82) 100%)',
              boxShadow:
                '0 24px 60px rgba(2, 4, 16, 0.85), 0 0 28px rgba(0, 240, 255, 0.24), 0 0 42px rgba(168, 85, 247, 0.18)',
            }}
          >
            <div
              className="relative max-h-[66vh] sm:max-h-[510px] min-h-[230px] flex flex-col rounded-[24.5px] overflow-hidden backdrop-blur-2xl"
              style={{
                background:
                  'linear-gradient(168deg, rgba(13, 18, 38, 0.97) 0%, rgba(8, 11, 26, 0.98) 58%, rgba(4, 6, 16, 0.99) 100%)',
                boxShadow:
                  'inset 0 1px 1px rgba(255, 255, 255, 0.16), inset 0 -12px 28px rgba(0, 240, 255, 0.05)',
              }}
            >
              {/* 상단 미세 오로라 광선 라인 */}
              <div
                className="h-[1.5px] w-full shrink-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 5%, #00f0ff 30%, #c084fc 65%, #fbbf24 85%, transparent 95%)',
                }}
              />

              {/* 🌟 상단 코스믹 아케인 헤더 바 */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-cyan-400/20 shrink-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(15, 23, 52, 0.92) 0%, rgba(22, 16, 48, 0.88) 50%, rgba(12, 19, 44, 0.92) 100%)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="relative w-7 h-7 rounded-full flex items-center justify-center border border-cyan-300/60"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, #1e293b 0%, #090d1e 70%, #02040a 100%)',
                      boxShadow:
                        '0 0 14px rgba(0, 240, 255, 0.45), inset 0 0 8px rgba(168, 85, 247, 0.45)',
                    }}
                  >
                    <Sparkles size={13} className="text-cyan-300 animate-spin [animation-duration:9s]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090d1e] shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className="lucy-cosmic-title text-[13.5px] font-extrabold tracking-tight text-white"
                        style={{ color: '#ffffff' }}
                      >
                        루시 퀵 대화
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span
                        className="text-[11px] font-bold tracking-wide"
                        style={{ color: isVoiceMode ? '#fbbf24' : '#38bdf8' }}
                      >
                        {isVoiceMode ? '🎙️ 실시간 음성' : 'COSMIC LINK'}
                      </span>
                    </div>
                    <span
                      className="lucy-cosmic-sub text-[11px] font-medium text-slate-300 truncate max-w-[175px] sm:max-w-[230px]"
                      style={{ color: '#cbd5e1' }}
                    >
                      {isVoiceMode ? '실시간 1:1 다정한 음성 대화' : '빅뱅 아케인 채널 · 1시간 퀵 세션'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* 🔊 자동 읽기 (Auto-TTS) 설정 토글 버튼: 한 번 더 누르면 즉시 끄기 & 음성 중지 */}
                  <button
                    type="button"
                    data-auto-tts-toggle="true"
                    onClick={toggleAutoRead}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                      isAutoRead
                        ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:bg-cyan-500/25'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                    style={{ color: isAutoRead ? '#a5f3fc' : '#cbd5e1' }}
                    title={
                      isAutoRead
                        ? '답변 자동 읽기 ON - 한 번 더 누르면 즉시 꺼집니다'
                        : '답변 자동 읽기 OFF - 누르면 켜집니다'
                    }
                    aria-pressed={isAutoRead}
                    aria-label={isAutoRead ? '답변 자동 읽기 켜짐 (눌러서 끄기)' : '답변 자동 읽기 꺼짐 (눌러서 켜기)'}
                  >
                    {isAutoRead ? (
                      <>
                        <Volume2 size={13} className="text-cyan-300 animate-pulse shrink-0" />
                        <span className="text-[11px]">자동읽기 ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX size={13} className="text-slate-400 shrink-0" />
                        <span className="text-[11px]">자동읽기 OFF</span>
                      </>
                    )}
                  </button>

                  {/* 🔄 말풍선 1시간 세션 초기화 버튼 */}
                  <button
                    type="button"
                    onClick={handleResetBubbleSession}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    style={{ color: '#cbd5e1' }}
                    title="말풍선 대화 지금 초기화 (새 1시간 세션 시작 · 전체 대화는 루시채팅 보존)"
                    aria-label="말풍선 대화 초기화"
                  >
                    <RotateCcw size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleExpandToFullScreen}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    style={{ color: '#cbd5e1' }}
                    title="전체 채팅 화면으로 열기"
                    aria-label="전체 채팅 화면으로 열기"
                  >
                    <Maximize2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                    style={{ color: '#cbd5e1' }}
                    title="말풍선 닫기"
                    aria-label="말풍선 닫기"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* 🍞 자동읽기 토글 토스트 알림 */}
              <AnimatePresence>
                {autoReadToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-950/95 border border-cyan-400/60 text-cyan-100 text-xs font-bold shadow-[0_6px_20px_rgba(0,240,255,0.3)] z-30 flex items-center gap-1.5 pointer-events-none whitespace-nowrap"
                    style={{ color: '#ecfeff' }}
                  >
                    <span>{autoReadToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🎙️ 음성 모드 실시간 상태 HUD 배너 (음성 모드 활성 시 표출) */}
              {isVoiceMode && (
                <div
                  className="flex items-center justify-between px-4 py-2 border-b border-cyan-400/20 shrink-0 text-xs"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(14, 30, 62, 0.85) 0%, rgba(28, 18, 58, 0.85) 100%)',
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.25)]">
                      {voiceState === 'speaking' ? (
                        <Volume2 size={13} className="text-amber-300 animate-pulse" />
                      ) : voiceState === 'thinking' ? (
                        <Sparkles size={13} className="text-cyan-300 animate-spin" />
                      ) : voiceState === 'listening' ? (
                        <Mic size={13} className="text-cyan-300 animate-bounce" />
                      ) : (
                        <MicOff size={13} className="text-slate-400" />
                      )}
                      <span
                        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                          voiceState === 'listening'
                            ? 'bg-emerald-400 animate-ping'
                            : voiceState === 'speaking'
                            ? 'bg-amber-400 animate-pulse'
                            : voiceState === 'thinking'
                            ? 'bg-cyan-400 animate-pulse'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="lucy-cosmic-title text-xs font-bold text-white"
                        style={{ color: '#ffffff' }}
                      >
                        {voiceState === 'listening' && '음성 경청 중...'}
                        {voiceState === 'thinking' && '루시가 생각하고 있어요...'}
                        {voiceState === 'speaking' && '루시가 이야기 중이에요...'}
                        {voiceState === 'idle' && '음성 대기'}
                        {voiceState === 'error' && (voiceError || '음성 오류')}
                      </span>
                      {speechTranscript && voiceState === 'listening' && (
                        <span
                          className="lucy-cosmic-cyan text-[11px] font-semibold text-cyan-300 truncate max-w-[130px] sm:max-w-[175px] italic"
                          style={{ color: '#38bdf8' }}
                        >
                          "{speechTranscript}"
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {voiceState === 'speaking' && (
                      <button
                        type="button"
                        onClick={handleInterruptLucy}
                        className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/50 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        style={{ color: '#fecdd3' }}
                        title="루시 말 끊고 바로 질문하기"
                      >
                        <VolumeX size={11} />
                        <span>말끊기</span>
                      </button>
                    )}

                    {speechTranscript.trim().length >= 2 && voiceState === 'listening' && (
                      <button
                        type="button"
                        onClick={() => handleSend(speechTranscript)}
                        className="lucy-user-cosmic-msg keep-white px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                        style={{ color: '#ffffff' }}
                        title="지금 전송"
                      >
                        <Send size={11} />
                        <span>전송</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleToggleVoiceMode}
                      className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      style={{ color: '#cbd5e1' }}
                      title="텍스트 모드로 전환"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* 💬 메시지 목록 스크롤 영역 (딥 스페이스 코스믹 글래스 캔버스 + 다중 분할 말풍선) */}
              <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 min-h-[130px] max-h-[45vh] sm:max-h-[370px] scrollbar-thin scrollbar-thumb-cyan-400/30 select-text">
                {lucyMessages.length === 0 ? (
                  <div
                    className="h-full min-h-[145px] flex flex-col items-center justify-center text-center px-4 py-5 rounded-2xl border border-cyan-400/20"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 25%, rgba(22, 33, 68, 0.65) 0%, rgba(10, 14, 32, 0.78) 100%)',
                      boxShadow: 'inset 0 1px 12px rgba(0, 240, 255, 0.08)',
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl border border-cyan-400/45 flex items-center justify-center mb-2.5 text-cyan-300"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 30%, rgba(30, 41, 82, 0.95) 0%, rgba(9, 13, 30, 0.98) 100%)',
                        boxShadow: '0 0 18px rgba(0, 240, 255, 0.25)',
                      }}
                    >
                      <Bot size={22} />
                    </div>
                    <p
                      className="lucy-cosmic-title text-[14px] font-bold text-white mb-1"
                      style={{ color: '#ffffff' }}
                    >
                      루시에게 마음속 이야기를 건네보세요
                    </p>
                    <p
                      className="lucy-cosmic-sub text-[12.5px] font-normal text-slate-300 leading-relaxed max-w-[280px] mb-2.5"
                      style={{ color: '#cbd5e1' }}
                    >
                      {isVoiceMode
                        ? '말씀하시면 루시가 경청하고 다정한 목소리와 함께 답변해 드려요.'
                        : '아래 맞춤 예시를 탭하거나 질문을 자유롭게 적어 보내주세요.'}
                    </p>
                    <div
                      className="lucy-cosmic-cyan flex items-center gap-1.5 text-[11px] font-medium text-cyan-300"
                      style={{ color: '#38bdf8' }}
                    >
                      <Clock size={11} />
                      <span>말풍선은 1시간 단위로 자동 초기화됩니다</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center pb-0.5">
                      <div
                        className="lucy-cosmic-cyan flex items-center gap-1.5 text-[10.5px] font-medium text-cyan-300/90"
                        style={{ color: '#38bdf8' }}
                      >
                        <Clock size={10} />
                        <span>최근 1시간 퀵 대화 · 전체 기록은 루시채팅 보관</span>
                      </div>
                    </div>
                    {lucyMessages.map((msg, idx) => {
                      const isUser = msg.role === 'user';
                      const isLatest = idx === lucyMessages.length - 1;
                      const msgId = String(msg.id || idx);
                      const rawContent =
                        typeof msg.content === 'string'
                          ? msg.content
                          : Array.isArray(msg.content)
                          ? msg.content.find((c: any) => c.type === 'text')?.text || ''
                          : '';

                      const msgImageUrl =
                        (msg as any).imageUrl ||
                        (Array.isArray(msg.content)
                          ? (msg.content.find((c: any) => c.type === 'image_url') as any)?.image_url?.url
                          : undefined);

                      const msgContent = isUser
                        ? cleanUserMessageDisplay(rawContent)
                        : cleanAssistantMessageDisplay(rawContent);

                      if (!msgContent.trim() && !msgImageUrl) return null;

                      const isHistorical =
                        idx < lucyMessages.length - 1 ||
                        Boolean(msg.timestamp && msg.timestamp < bubbleMountedAtRef.current - 2000);

                      const isThisPlaying =
                        playingMessageId === msgId ||
                        (isLatest && playingMessageId === 'latest' && isGlobalTtsSpeaking);

                      return (
                        <div
                          key={msgId}
                          className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isUser && (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-cyan-300/60"
                              style={{
                                background:
                                  'radial-gradient(circle at 35% 30%, #1e293b 0%, #090d1e 80%)',
                                boxShadow: '0 0 10px rgba(0, 240, 255, 0.35)',
                              }}
                            >
                              <Sparkles size={12} className="text-cyan-300" />
                            </div>
                          )}

                          {isUser ? (
                            <div
                              data-keep-white="true"
                              className="lucy-user-cosmic-msg keep-white max-w-[84%] px-4 py-3 rounded-2xl leading-[1.68] select-text bg-gradient-to-br from-cyan-600/90 via-sky-600/95 to-indigo-700/95 text-white font-medium text-[14px] rounded-tr-xs border border-cyan-300/45 shadow-[0_6px_18px_rgba(6,182,212,0.28)]"
                              style={{ color: '#ffffff' }}
                            >
                              {msgImageUrl && (
                                <div className="mb-2 rounded-xl overflow-hidden border border-white/25 bg-black/30 max-w-[220px]">
                                  <img
                                    src={msgImageUrl}
                                    alt="전송한 사진"
                                    className="w-full max-h-[160px] object-cover block"
                                  />
                                </div>
                              )}
                              {msgContent.trim() && (
                                <div
                                  className="whitespace-pre-wrap break-words font-medium text-[14px]"
                                  style={{ color: '#ffffff' }}
                                >
                                  {msgContent}
                                </div>
                              )}
                            </div>
                          ) : (
                            <LucyQuickSplitBubbleGroup
                              msgId={msgId}
                              textContent={msgContent}
                              isLatest={isLatest}
                              isGenerating={isLatest && isLucyGenerating}
                              isHistorical={isHistorical}
                              isPlaying={isThisPlaying}
                              copiedId={copiedId}
                              onCopy={handleCopyMessage}
                              onToggleSpeak={handlePlayMessageTTS}
                              onBubbleReveal={() => scrollToBottom(true)}
                            />
                          )}

                          {isUser && (
                            <div className="w-7 h-7 rounded-full bg-indigo-950 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/50 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                              <User size={13} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* AI 생성 중 로딩 인디케이터 */}
                {isLucyGenerating &&
                  (lucyMessages.length === 0 ||
                    lucyMessages[lucyMessages.length - 1]?.role === 'user') && (
                    <div
                      className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-cyan-400/30 w-fit"
                      style={{
                        background: 'rgba(15, 23, 48, 0.92)',
                        boxShadow: '0 0 16px rgba(0, 240, 255, 0.15)',
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center">
                        <Loader2 size={12} className="animate-spin text-cyan-300" />
                      </div>
                      <span
                        className="lucy-cosmic-sub text-xs font-medium text-slate-200 animate-pulse"
                        style={{ color: '#e2e8f0' }}
                      >
                        루시가 아케인 파동 속에서 답변을 조합하고 있어요...
                      </span>
                    </div>
                  )}

                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* ⌨️ 하단 코스믹 캡슐 입력 바 */}
              <div
                className="p-2.5 sm:p-3 border-t border-cyan-400/20 shrink-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10, 15, 34, 0.95) 0%, rgba(6, 9, 22, 0.98) 100%)',
                }}
              >
                {/* 📷 첨부 사진 미리보기 배너 */}
                {attachedPhoto && (
                  <div className="mb-2 flex items-center justify-between gap-2.5 px-3 py-2 rounded-2xl border border-cyan-400/40 bg-slate-900/95 shadow-[0_4px_16px_rgba(0,240,255,0.18)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-300/50 shrink-0 bg-black/50">
                        <img
                          src={attachedPhoto}
                          alt="첨부 사진 미리보기"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="lucy-cosmic-title text-xs font-bold text-white truncate"
                          style={{ color: '#ffffff' }}
                        >
                          사진 첨부 완료
                        </span>
                        <span
                          className="lucy-cosmic-sub text-[11px] text-slate-300 truncate"
                          style={{ color: '#cbd5e1' }}
                        >
                          질문과 함께 보내거나 바로 전송하세요
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSend()}
                        disabled={isLucyGenerating}
                        className="lucy-user-cosmic-msg keep-white px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                        style={{ color: '#ffffff' }}
                        title="사진 바로 전송"
                      >
                        <Send size={11} />
                        <span>사진 전송</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttachedPhoto(null)}
                        className="p-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-500/25 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                        style={{ color: '#cbd5e1' }}
                        title="첨부 사진 취소"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* 숨겨진 사진 파일 선택 Input */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />

                <div
                  className="relative flex items-center rounded-2xl border border-cyan-400/35 px-2.5 py-2 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-400/30 transition-all"
                  style={{
                    background: 'rgba(4, 7, 18, 0.92)',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  {/* 🔊 입력창 옆 원클릭 자동읽기 ON/OFF 토글 버튼 */}
                  <button
                    type="button"
                    data-auto-tts-toggle="true"
                    onClick={toggleAutoRead}
                    className={`p-1.5 mr-1 rounded-xl transition-all cursor-pointer z-10 shrink-0 ${
                      isAutoRead
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'
                    }`}
                    style={{ color: isAutoRead ? '#67e8f9' : '#94a3b8' }}
                    title={isAutoRead ? '자동읽기 켜짐 (한 번 더 누르면 즉시 끄기)' : '자동읽기 꺼짐 (누르면 켜기)'}
                    aria-label={isAutoRead ? '자동읽기 켜짐' : '자동읽기 꺼짐'}
                  >
                    {isAutoRead ? (
                      <Volume2 size={14} className="animate-pulse text-cyan-300" />
                    ) : (
                      <VolumeX size={14} />
                    )}
                  </button>

                  {/* 📷 사진 전송(첨부) 버튼 (기존 마이크 버튼 대체) */}
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isLucyGenerating || isCompressingPhoto}
                    className={`p-1.5 mr-1.5 rounded-xl transition-all cursor-pointer z-10 shrink-0 ${
                      attachedPhoto
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:text-cyan-300 hover:border-cyan-400/40'
                    }`}
                    style={{ color: attachedPhoto ? '#a5f3fc' : '#cbd5e1' }}
                    title="사진 선택 및 전송"
                    aria-label="사진 전송"
                  >
                    {isCompressingPhoto ? (
                      <Loader2 size={15} className="animate-spin text-cyan-300" />
                    ) : (
                      <ImagePlus size={15} className={attachedPhoto ? 'text-cyan-300' : ''} />
                    )}
                  </button>

                  {/* 맞춤예시 동적 타이핑 플레이스홀더 */}
                  <div className="absolute inset-y-0 left-[74px] right-11 flex items-center pointer-events-none overflow-hidden">
                    <DynamicGhostInputPlaceholder
                      prompts={QUICK_LUCY_PROMPTS}
                      isVisible={!input && !attachedPhoto && !isLucyGenerating}
                      pauseDuration={11000}
                      typingSpeed={40}
                      deletingSpeed={18}
                      textClassName="lucy-cosmic-muted text-[13px] sm:text-[13.5px] text-slate-400 font-normal truncate"
                      onCurrentPromptChange={(prompt) => {
                        currentGhostPromptRef.current = prompt;
                        setActiveGhostPrompt(prompt);
                      }}
                    />
                  </div>

                  {/* 입력 텍스트 영역 */}
                  <textarea
                    ref={textareaRef}
                    aria-label="루시에게 보낼 메시지"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && !input && currentGhostPromptRef.current) {
                        e.preventDefault();
                        setInput(currentGhostPromptRef.current);
                        return;
                      }
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    placeholder={attachedPhoto ? '사진과 함께 보낼 메시지를 입력하세요 (선택)...' : ''}
                    disabled={isLucyGenerating}
                    className="lucy-cosmic-body w-full bg-transparent text-[14px] font-medium text-slate-50 resize-none outline-none leading-relaxed min-h-[26px] max-h-[72px] py-0.5 z-10 placeholder:text-slate-400"
                    style={{
                      color: '#f8fafc',
                    }}
                  />

                  {/* 전송 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={(!input.trim() && !attachedPhoto && !currentGhostPromptRef.current) || isLucyGenerating}
                    className={`ml-1.5 p-2 rounded-xl transition-all cursor-pointer z-10 shrink-0 ${
                      input.trim() || attachedPhoto || currentGhostPromptRef.current
                        ? 'lucy-user-cosmic-msg keep-white bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-[0_0_14px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95'
                        : 'bg-slate-800/70 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                    style={{
                      color:
                        input.trim() || attachedPhoto || currentGhostPromptRef.current
                          ? '#ffffff'
                          : '#64748b',
                    }}
                    title={attachedPhoto ? '사진 및 메시지 전송' : input.trim() ? '메시지 전송' : '맞춤 예시 전송'}
                    aria-label="전송"
                  >
                    {isLucyGenerating ? (
                      <Loader2 size={15} className="animate-spin text-white" />
                    ) : (
                      <Send size={15} />
                    )}
                  </button>
                </div>

                <div
                  className="lucy-cosmic-muted flex items-center justify-between mt-1 px-1 text-[11px] font-medium text-slate-400"
                  style={{ color: '#94a3b8' }}
                >
                  <span className="flex items-center gap-1">
                    <span>📷 사진 첨부 지원 · Tab 예시 채움</span>
                    <ArrowRight size={10} />
                  </span>
                  <span>{isVoiceMode ? '🎙️ 말씀하시면 자동 전송' : 'Enter 전송 · Shift+Enter 줄바꿈'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔮 3. 하단 아케인 다이아몬드 에너지 커넥터 (Arcane Diamond Conduit Tail -> BigBang Button) */}
          <div className="pointer-events-none select-none" aria-hidden="true">
            {/* 말풍선 하단 꼭짓점 다이아몬드 프리즘 */}
            <div
              className="animate-arcane-conduit absolute -bottom-2.5 left-1/2 w-5 h-5 rounded-[4px] border border-cyan-300/85 z-20"
              style={{
                background:
                  'linear-gradient(135deg, #0d132a 0%, #1e1b4b 60%, #090d1e 100%)',
              }}
            />
            {/* 빅뱅 버튼 상단 마법진으로 이어지는 오로라 에너지 코어 노드 */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 rounded-[2px] border border-cyan-200 z-20"
              style={{
                background: '#00f0ff',
                boxShadow: '0 0 12px #00f0ff, 0 0 20px #a855f7',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
