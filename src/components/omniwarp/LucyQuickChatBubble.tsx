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
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useApp, UnifiedMessage } from '@/contexts/AppContext';
import { DynamicGhostInputPlaceholder } from '@/components/chat/DynamicGhostInputPlaceholder';
import { isGreetingMessage } from '@/lib/chatHistorySync';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { playTTS, stopTTS } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';

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

/**
 * 음성 낭독에 방해가 되는 마크다운, 링크, 이미지 태그 등을 정제하여
 * 사람이 말하는 자연스러운 구어체 텍스트로 변환합니다.
 */
function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  let cleaned = text;
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
 * ⌨️ 루시 답변 실시간 타자기(Typewriter) 효과 컴포넌트
 * - 스트리밍 텍스트와 최신 답변을 글자 단위로 부드럽게 타자기처럼 연출
 */
function LucyTypewriterContent({
  content,
  isGenerating = false,
  onTypingStep,
}: {
  content: string;
  isGenerating?: boolean;
  onTypingStep?: () => void;
}) {
  const [displayedLength, setDisplayedLength] = useState<number>(() =>
    isGenerating ? 0 : content.length
  );

  useEffect(() => {
    if (!isGenerating && displayedLength >= content.length) {
      return;
    }

    if (displayedLength < content.length) {
      const diff = content.length - displayedLength;
      const step = diff > 40 ? 5 : diff > 15 ? 2 : 1;
      const timer = setTimeout(() => {
        setDisplayedLength((prev) => {
          const next = Math.min(prev + step, content.length);
          if (onTypingStep) onTypingStep();
          return next;
        });
      }, 16);
      return () => clearTimeout(timer);
    }
  }, [content, displayedLength, isGenerating, onTypingStep]);

  useEffect(() => {
    if (content.length < displayedLength) {
      setDisplayedLength(content.length);
    }
  }, [content, displayedLength]);

  const displayedText = content.slice(0, displayedLength);
  const isTyping = displayedLength < content.length || isGenerating;

  return (
    <div className="relative text-[13px] sm:text-sm text-slate-100 leading-relaxed break-words whitespace-pre-wrap select-text">
      {displayedText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-0.5 animate-pulse align-middle" />
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
  const [, navigate] = useLocation();
  const { personaMessages, sendUnifiedMessage, isGenerating } = useApp();
  const [input, setInput] = useState('');
  const [activeGhostPrompt, setActiveGhostPrompt] = useState('');
  const currentGhostPromptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // 🎙️ 음성 모드 (STT / TTS) 상태 관리
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [, setSpeechInterim] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

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

  // 스토리지 및 루시채팅 등 타 뷰의 자동읽기 설정 변경 동기화 리스너
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lucy_chat_auto_tts') {
        setIsAutoRead(e.newValue !== 'false');
      }
    };
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (typeof detail === 'boolean') {
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

  // 🔊 자동 읽기 ON/OFF 토글 핸들러
  const toggleAutoRead = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    setIsAutoRead((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lucy_chat_auto_tts', String(next));
        window.dispatchEvent(new CustomEvent('prism:auto_tts_changed', { detail: next }));
      } catch (_) {}
      if (!next) {
        stopTTS();
        setPlayingMessageId(null);
        setVoiceState((s) => (s === 'speaking' ? 'idle' : s));
      }
      if (autoReadToastTimerRef.current) clearTimeout(autoReadToastTimerRef.current);
      setAutoReadToast(next ? '🔊 답변 자동 읽기 ON' : '🔇 답변 자동 읽기 OFF');
      autoReadToastTimerRef.current = setTimeout(() => setAutoReadToast(null), 2200);
      return next;
    });
  }, []);

  // 🔊 개별 메시지 음성 듣기/멈춤 핸들러
  const handlePlayMessageTTS = useCallback(async (msgId: string, content: string) => {
    if (playingMessageId === msgId) {
      stopTTS();
      setPlayingMessageId(null);
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
      await playTTS(
        spokenText,
        'Aoede',
        true,
        'calm',
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        { skipCompletionChime: true, isAutoPlay: false }
      );
    } catch (err) {
      console.warn('[LucyQuickChatBubble] play individual message TTS error:', err);
    } finally {
      setPlayingMessageId((curr) => (curr === msgId ? null : curr));
      setVoiceState((s) => (s === 'speaking' ? 'idle' : s));
    }
  }, [playingMessageId]);

  // 🎯 인사말 제외 필터링 (사용자 요구: "이때 인사말은 생략하고")
  const lucyMessages = useMemo(() => {
    const rawList = personaMessages?.lucy || [];
    return rawList.filter((m: UnifiedMessage) => {
      if (m.id === 'greet' || m.id === 'default-greeting') return false;
      if (isGreetingMessage(m)) return false;
      return true;
    });
  }, [personaMessages?.lucy]);

  // 스크롤 최하단 자동 이동
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // 🎙️ 음성 인식 중지
  const stopRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
  }, []);

  // 🚀 메시지 전송 핸들러 (음성/텍스트 공용)
  const handleSend = useCallback(async (textToSend?: string) => {
    const candidateGhost = !input.trim() ? currentGhostPromptRef.current || activeGhostPrompt : '';
    const rawMsg = textToSend || (input.trim() ? input : candidateGhost);
    if (!rawMsg || !rawMsg.trim() || isLucyGenerating) return;

    const userText = rawMsg.trim();
    setInput('');
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
    } catch (_) {}

    const wasVoiceActive = isVoiceModeRef.current;
    if (wasVoiceActive) {
      stopRecognition();
      stopTTS();
      setVoiceState('thinking');
    }

    try {
      const voiceSystemContext = wasVoiceActive
        ? `[🎙️ 실시간 1:1 음성 대화 모드 특화 지침]
지금 사용자와 실시간 음성으로 대화 중이야.
1. 음성으로 듣기 편하도록 답변을 너무 길게 작성하지 말고, 2~4문장 내외로 다정하고 친근한 구어체 반말로 대답해줘.
2. 마크다운 기호(#, **, -, * 등)나 링크 주소는 소리 내어 읽기에 어색하므로 절대 사용하지 말고, 부드럽고 자연스러운 말소리 문장으로 구성해줘.`
        : undefined;

      await sendUnifiedMessage(userText, 'lucy', undefined, {
        mode: 'casual',
        channels: [],
        extraSystemContext: voiceSystemContext,
        onFinish: async (fullText, _sentText, replyMsgId) => {
          const shouldSpeak = isVoiceModeRef.current || isAutoReadRef.current;
          if (!shouldSpeak) return;

          const spokenText = cleanTextForSpeech(fullText);
          if (spokenText) {
            setVoiceState('speaking');
            setPlayingMessageId(replyMsgId || 'latest');
            try {
              await playTTS(
                spokenText,
                'Aoede',
                true,
                'calm',
                undefined,
                false,
                undefined,
                undefined,
                undefined,
                { skipCompletionChime: true, isAutoPlay: true }
              );
            } catch (ttsErr) {
              console.warn('[LucyQuickChatBubble] playTTS error:', ttsErr);
            } finally {
              setPlayingMessageId(null);
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
      if (wasVoiceActive) {
        setVoiceState('listening');
        startListening();
      }
    }
  }, [input, activeGhostPrompt, isLucyGenerating, sendUnifiedMessage, stopRecognition]);

  // 🎙️ 음성 인식 시작 (STT)
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
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

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceError(null);
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += chunk;
          } else {
            interimStr += chunk;
          }
        }

        const combined = (finalStr || interimStr).trim();
        if (combined) {
          speechTranscriptRef.current = combined;
          setSpeechTranscript(combined);
          setSpeechInterim(interimStr);

          // 1.3초 무음 감지 시 발화 마감 및 자동 전송
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (combined.length >= 2 && voiceStateRef.current === 'listening') {
              handleSend(combined);
            }
          }, 1300);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('[LucyQuickChatBubble] STT error:', e.error || e);
        if (e.error === 'not-allowed') {
          setVoiceError('마이크 권한이 차단되어 있습니다.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        if (isVoiceModeRef.current && voiceStateRef.current === 'listening' && !isMutedRef.current) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('[LucyQuickChatBubble] startListening error:', err);
      setVoiceState('idle');
    }
  }, [handleSend]);

  // 🎙️ 루시 말 끊기 (인터럽트) 및 듣기 전환
  const handleInterruptLucy = useCallback(() => {
    triggerHaptic('whitehole');
    stopTTS();
    setVoiceState('listening');
    startListening();
  }, [startListening]);

  // 🎙️ 음성 모드 토글
  const handleToggleVoiceMode = useCallback(() => {
    triggerHaptic('whitehole');
    if (isVoiceMode) {
      stopRecognition();
      stopTTS();
      setIsVoiceMode(false);
      setVoiceState('idle');
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
    } else {
      setIsVoiceMode(true);
      setIsMuted(false);
      setVoiceState('listening');
      startListening();
    }
  }, [isVoiceMode, startListening, stopRecognition]);

  // 🌟 오픈 및 초기 음성 모드 연동
  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      if (initialVoiceActive) {
        setIsVoiceMode(true);
        isVoiceModeRef.current = true;
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
      // 닫힐 때 음성 정리
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

  // 🎙️ PTT (빅뱅버튼을 누르고 있다가 손을 뗀 순간) 즉시 전송 이벤트 수신
  useEffect(() => {
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
  }, [handleSend, stopRecognition, initialPrompt, isLucyGenerating]);

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
        autoSentPromptRef.current = promptToAutoSend;
        setInput('');
        const timer = setTimeout(() => {
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
        !target.closest('[data-bigbang="true"]')
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
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          data-lucy-quick-chat="true"
          className="absolute bottom-[92px] sm:bottom-[104px] left-1/2 -translate-x-1/2 w-[calc(100vw-28px)] max-w-[420px] sm:max-w-[450px] max-h-[68vh] sm:max-h-[520px] min-h-[220px] flex flex-col rounded-3xl bg-slate-950/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(56,189,248,0.3)] z-50 overflow-hidden pointer-events-auto select-none ring-1 ring-cyan-300/30"
          style={{
            touchAction: 'auto',
          }}
        >
          {/* 🌟 상단 헤더 바 */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-cyan-950/50 via-slate-900/60 to-purple-950/50 border-b border-cyan-400/25 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-amber-300 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.7)]">
                <Sparkles size={13} className="text-slate-950 animate-spin [animation-duration:8s]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 shadow-[0_0_6px_#34d399]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight text-white drop-shadow">
                    루시 AI
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border transition-colors ${
                    isVoiceMode
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 animate-pulse'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                  }`}>
                    {isVoiceMode ? '🎙️ 음성 모드' : '퀵 대화'}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-200/70 truncate max-w-[170px] sm:max-w-[220px]">
                  {isVoiceMode ? '실시간 1:1 다정한 음성 대화' : '영혼의 안식처 · 즉각 대화'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* 🔊 자동 읽기 (Auto-TTS) 설정 토글 버튼 */}
              <button
                type="button"
                onClick={toggleAutoRead}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  isAutoRead
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.35)] hover:bg-emerald-500/30'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
                title={isAutoRead ? '답변 자동 읽기 ON (답변 완료 시 즉시 낭독) - 클릭 시 끄기' : '답변 자동 읽기 OFF - 클릭 시 켜기'}
                aria-label={isAutoRead ? '답변 자동 읽기 켜짐' : '답변 자동 읽기 꺼짐'}
              >
                {isAutoRead ? (
                  <>
                    <Volume2 size={13} className="text-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10.5px]">자동읽기 ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={13} className="opacity-70 shrink-0" />
                    <span className="text-[10.5px]">자동읽기 OFF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleExpandToFullScreen}
                className="p-1.5 rounded-xl text-cyan-200 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                title="전체 채팅 화면으로 열기"
                aria-label="전체 채팅 화면으로 열기"
              >
                <Maximize2 size={14} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                title="말풍선 닫기"
                aria-label="말풍선 닫기"
              >
                <X size={15} />
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
                className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/95 border border-cyan-400/40 text-cyan-200 text-[11px] font-semibold shadow-lg backdrop-blur-md z-30 flex items-center gap-1.5 pointer-events-none"
              >
                <span>{autoReadToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎙️ 음성 모드 실시간 상태 HUD 배너 (음성 모드 활성 시 표출) */}
          {isVoiceMode && (
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-purple-950/70 border-b border-cyan-400/20 shrink-0 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300">
                  {voiceState === 'speaking' ? (
                    <Volume2 size={12} className="text-amber-400 animate-pulse" />
                  ) : voiceState === 'thinking' ? (
                    <Sparkles size={12} className="text-purple-400 animate-spin" />
                  ) : voiceState === 'listening' ? (
                    <Mic size={12} className="text-cyan-400 animate-bounce" />
                  ) : (
                    <MicOff size={12} className="text-slate-500" />
                  )}
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                      voiceState === 'listening'
                        ? 'bg-emerald-400 animate-ping'
                        : voiceState === 'speaking'
                        ? 'bg-amber-400 animate-pulse'
                        : voiceState === 'thinking'
                        ? 'bg-purple-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[11px] font-bold text-cyan-200">
                    {voiceState === 'listening' && '음성 경청 중...'}
                    {voiceState === 'thinking' && '루시가 생각하고 있어요...'}
                    {voiceState === 'speaking' && '루시가 이야기 중이에요...'}
                    {voiceState === 'idle' && '음성 대기'}
                    {voiceState === 'error' && (voiceError || '음성 오류')}
                  </span>
                  {speechTranscript && voiceState === 'listening' && (
                    <span className="text-[10px] text-amber-200/90 truncate max-w-[130px] sm:max-w-[170px] italic">
                      "{speechTranscript}"
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* 루시 말끊기 버튼 */}
                {voiceState === 'speaking' && (
                  <button
                    type="button"
                    onClick={handleInterruptLucy}
                    className="px-2 py-0.5 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    title="루시 말 끊고 바로 질문하기"
                  >
                    <VolumeX size={10} />
                    <span>말끊기</span>
                  </button>
                )}

                {/* 실시간 전송 버튼 */}
                {speechTranscript.trim().length >= 2 && voiceState === 'listening' && (
                  <button
                    type="button"
                    onClick={() => handleSend(speechTranscript)}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                    title="지금 전송"
                  >
                    <Send size={10} />
                    <span>전송</span>
                  </button>
                )}

                {/* 음성 모드 해제 닫기 */}
                <button
                  type="button"
                  onClick={handleToggleVoiceMode}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="텍스트 모드로 전환"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* 💬 메시지 목록 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 min-h-[120px] max-h-[46vh] sm:max-h-[380px] scrollbar-thin scrollbar-thumb-cyan-500/20 select-text">
            {lucyMessages.length === 0 ? (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center px-4 py-6 text-slate-400">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center mb-2.5 text-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                  <Bot size={20} />
                </div>
                <p className="text-xs font-bold text-slate-200 mb-1">
                  루시에게 마음속 이야기를 건네보세요
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-[260px]">
                  {isVoiceMode
                    ? '말씀하시면 루시가 경청하고 다정한 목소리와 함께 답변해 드려요.'
                    : '아래 맞춤 예시를 탭하거나 질문을 자유롭게 적어 보내주세요.'}
                </p>
              </div>
            ) : (
              lucyMessages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isLatest = idx === lucyMessages.length - 1;
                const msgContent =
                  typeof msg.content === 'string'
                    ? msg.content
                    : Array.isArray(msg.content)
                    ? msg.content.find((c: any) => c.type === 'text')?.text || ''
                    : '';

                if (!msgContent.trim()) return null;

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                        <Sparkles size={11} className="text-slate-950" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed select-text shadow-md ${
                        isUser
                          ? 'bg-gradient-to-br from-cyan-600 to-sky-700 text-white rounded-tr-none border border-cyan-400/30'
                          : 'bg-slate-900/90 text-slate-100 rounded-tl-none border border-cyan-500/30 shadow-[0_0_16px_rgba(56,189,248,0.15)]'
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap break-words">{msgContent}</div>
                      ) : (
                        <div>
                          <LucyTypewriterContent
                            content={msgContent}
                            isGenerating={isLatest && isLucyGenerating}
                            onTypingStep={() => scrollToBottom(false)}
                          />
                          {!isLucyGenerating && (
                            <div className="flex justify-end mt-1 pt-0.5 border-t border-cyan-500/10">
                              <button
                                type="button"
                                onClick={() => handlePlayMessageTTS(String(msg.id || idx), msgContent)}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                                  playingMessageId === String(msg.id || idx)
                                    ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                    : 'text-cyan-300/60 hover:text-cyan-200 hover:bg-white/10'
                                }`}
                                title={playingMessageId === String(msg.id || idx) ? '음성 멈추기' : '음성으로 다시 듣기'}
                                aria-label="음성 듣기"
                              >
                                {playingMessageId === String(msg.id || idx) ? (
                                  <>
                                    <VolumeX size={11} className="text-amber-300" />
                                    <span>멈춤</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 size={11} />
                                    <span>듣기</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-6 h-6 rounded-full bg-cyan-700/80 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/40 text-cyan-200">
                        <User size={12} />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* AI 생성 중 로딩 인디케이터 (메시지가 아직 청크 도착 전일 때) */}
            {isLucyGenerating &&
              (lucyMessages.length === 0 ||
                lucyMessages[lucyMessages.length - 1]?.role === 'user') && (
                <div className="flex items-center gap-2 text-cyan-300 text-xs py-1">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
                    <Loader2 size={12} className="animate-spin text-amber-300" />
                  </div>
                  <span className="text-[11px] text-cyan-200/80 animate-pulse">
                    루시가 다정하게 답변을 적고 있어요...
                  </span>
                </div>
              )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* ⌨️ 하단 입력 바 (옅은 맞춤 예시 타이핑 플레이스홀더 + 마이크 토글 포함) */}
          <div className="p-2.5 bg-slate-950/90 border-t border-cyan-400/25 shrink-0">
            <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-cyan-400/35 px-3 py-1.5 focus-within:border-cyan-300 focus-within:ring-1 focus-within:ring-cyan-400/40 transition-all shadow-inner">
              {/* 🎙️ 마이크 토글 버튼 */}
              <button
                type="button"
                onClick={handleToggleVoiceMode}
                className={`p-1.5 mr-1.5 rounded-xl transition-all cursor-pointer z-10 shrink-0 ${
                  isVoiceMode
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                    : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                }`}
                title={isVoiceMode ? '음성모드 끄기' : '음성모드 켜기 (말하기)'}
                aria-label="마이크 토글"
              >
                {isVoiceMode ? (
                  <Mic size={14} className="animate-pulse text-amber-300" />
                ) : (
                  <Mic size={14} />
                )}
              </button>

              {/* 옅은 맞춤예시 동적 타이핑 플레이스홀더 (음성/텍스트 모드 공용 지원) */}
              <div className="absolute inset-y-0 left-11 right-10 flex items-center pointer-events-none overflow-hidden">
                <DynamicGhostInputPlaceholder
                  prompts={QUICK_LUCY_PROMPTS}
                  isVisible={!input && !isLucyGenerating}
                  pauseDuration={11000}
                  typingSpeed={40}
                  deletingSpeed={18}
                  textClassName="text-[12px] sm:text-[13px] text-cyan-200/40 font-normal truncate"
                  onCurrentPromptChange={(prompt) => {
                    currentGhostPromptRef.current = prompt;
                    setActiveGhostPrompt(prompt);
                  }}
                />
              </div>

              {/* 입력 텍스트 영역 */}
              <textarea
                ref={textareaRef}
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
                placeholder=""
                disabled={isLucyGenerating}
                className="w-full bg-transparent text-xs sm:text-sm text-white resize-none outline-none leading-relaxed min-h-[26px] max-h-[72px] py-0.5 z-10 placeholder-transparent"
                style={{
                  color: '#ffffff',
                }}
              />

              {/* 전송 버튼 */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!input.trim() && !currentGhostPromptRef.current) || isLucyGenerating}
                className={`ml-1.5 p-1.5 rounded-xl transition-all cursor-pointer z-10 shrink-0 ${
                  input.trim() || currentGhostPromptRef.current
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.7)] hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
                title={input.trim() ? '메시지 전송' : '맞춤 예시 전송'}
                aria-label="전송"
              >
                {isLucyGenerating ? (
                  <Loader2 size={14} className="animate-spin text-slate-950" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-cyan-200/50">
              <span className="flex items-center gap-1">
                <span>Tab 키로 맞춤 예시 자동 채움</span>
                <ArrowRight size={9} />
              </span>
              <span>{isVoiceMode ? '🎙️ 말씀하시면 자동 전송' : 'Enter 전송 · Shift+Enter 줄바꿈'}</span>
            </div>
          </div>

          {/* 🔻 하단 중앙 말풍선 앵커 꼬리 (빅뱅 버튼을 가리키는 뾰족한 삼각형 꼬리) */}
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-950 border-r border-b border-cyan-400/50 rotate-45 shadow-[2px_2px_8px_rgba(0,0,0,0.8)] pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
