import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Sparkles,
  Radio,
  Send,
} from 'lucide-react';
import { playTTS, stopTTS, subscribeTTS } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

/**
 * 음성 낭독에 방해가 되는 마크다운, 링크, 이미지 태그 등을 정제하여
 * 사람이 말하는 자연스러운 구어체 텍스트로 변환합니다.
 */
function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. 이미지 마크다운 ![...](...) 제거
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');
  // 2. 링크 마크다운 [...](...) -> 링크 텍스트만 유지
  cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  // 3. 마크다운 헤더 기호 제거 (#, ##, ### 등)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  // 4. 볼드, 이탤릭 (*, **, _, __, ~~) 제거
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');
  // 5. 불릿 포인트 (- , * , 1. 등) 제거
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');
  // 6. 코드 블록 및 인라인 코드 제거
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  // 7. 감정 태그 및 제안 디렉티브 제거
  cleaned = cleaned.replace(/\[EMOTION:\s*[^\]]+\]/gi, '');
  cleaned = cleaned.replace(/\[SUGGESTIONS:[\s\S]*?\]/gi, '');

  return cleaned.trim();
}

export function LucyVoiceModeModal() {
  const [, navigate] = useLocation();
  const { sendUnifiedMessage } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [, setLastUserSpeech] = useState<string>('');
  const [lastLucyReply, setLastLucyReply] = useState<string>('');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSttSupported, setIsSttSupported] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // 음성 파형 애니메이션을 위한 오디오 에너지 레벨
  const [audioEnergy, setAudioEnergy] = useState<number>(0.2);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentOpenRef = useRef(false);
  const voiceStateRef = useRef<VoiceState>('idle');
  voiceStateRef.current = voiceState;

  // 🎙️ SpeechRecognition 초기화 및 경청 시작
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (voiceStateRef.current === 'speaking' || voiceStateRef.current === 'thinking') return;

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

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSttSupported(false);
      setErrorMessage(
        '현재 브라우저에서 마이크 자동 음성 인식을 지원하지 않습니다. 아래 텍스트 입력창으로 대화하실 수 있습니다.'
      );
      setVoiceState('idle');
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

      recognition.onstart = () => {
        setVoiceState('listening');
        setErrorMessage(null);
        setAudioEnergy(0.65);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript;
          } else {
            interimStr += item[0].transcript;
          }
        }

        const combined = (finalStr || interimStr).trim();
        if (combined) {
          setTranscript(combined);
          setInterimTranscript(interimStr);
          setAudioEnergy(0.85);

          // 1.2초 무음 감지 시 자동 턴테이킹(발화 자동 전송)
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (combined.length >= 2 && voiceStateRef.current === 'listening') {
              handleSendPrompt(combined);
            }
          }, 1250);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('[LucyVoice] STT Error notice:', e.error || e);
        if (e.error === 'not-allowed') {
          setErrorMessage('마이크 접근 권한이 차단되어 있습니다. 브라우저 설정에서 마이크를 허용해 주세요.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        setAudioEnergy(0.2);
        // 모달이 열려있고 여전히 경청 상태라면 세션 재개
        if (isComponentOpenRef.current && voiceStateRef.current === 'listening' && !isMuted) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('[LucyVoice] Failed to start recognition:', err);
      setVoiceState('idle');
    }
  }, [isMuted]);

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

  // 🚀 사용자 발화 전송 및 루시 여성 음성 답변 유도
  const handleSendPrompt = async (text: string) => {
    if (!text || !text.trim()) return;
    const cleanPrompt = text.trim();

    stopRecognition();
    stopTTS();

    setLastUserSpeech(cleanPrompt);
    setTranscript('');
    setInterimTranscript('');
    setVoiceState('thinking');
    triggerHaptic('whitehole');

    try {
      // 음성 대화 전용 간결한 반말 구어체 지침 주입
      const voiceSystemContext = `[🎙️ 실시간 1:1 음성 대화 모드 특화 지침]
지금 사용자와 실시간 음성으로 대화 중이야.
1. 음성으로 듣기 편하도록 답변을 너무 길게 작성하지 말고, 2~4문장 내외로 다정하고 친근한 구어체 반말로 대답해줘.
2. 마크다운 기호(#, **, -, * 등)나 링크 주소는 소리 내어 읽기에 어색하므로 절대 사용하지 말고, 부드럽고 자연스러운 말소리 문장으로 구성해줘.`;

      await sendUnifiedMessage(cleanPrompt, 'lucy', undefined, {
        mode: 'casual',
        extraSystemContext: voiceSystemContext,
        onFinish: async (fullText) => {
          if (!isComponentOpenRef.current) return;

          const spokenText = cleanTextForSpeech(fullText);
          setLastLucyReply(spokenText);
          setVoiceState('speaking');

          try {
            // 🌟 100% 여성 목소리(Kore / Web Speech 여성 보이스)로 낭독
            await playTTS(spokenText, 'Kore', true, 'calm');
          } catch (ttsErr) {
            console.warn('[LucyVoice] playTTS error:', ttsErr);
          } finally {
            if (isComponentOpenRef.current && voiceStateRef.current === 'speaking') {
              setVoiceState('listening');
              startListening();
            }
          }
        },
      });
    } catch (err: any) {
      console.error('[LucyVoice] Send failed:', err);
      setErrorMessage('일시적인 통신 지연이 발생했습니다. 다시 말씀해 주시면 정성껏 답변해 드릴게요.');
      setVoiceState('listening');
      startListening();
    }
  };

  // 🔊 전역 TTS 상태 구독 (루시가 말하는 중인지 실시간 감지)
  useEffect(() => {
    return subscribeTTS((state) => {
      if (!isComponentOpenRef.current) return;
      if (state.isSpeaking || state.isLoading) {
        if (voiceStateRef.current !== 'speaking') {
          setVoiceState('speaking');
        }
      } else if (voiceStateRef.current === 'speaking') {
        // 낭독이 완전히 끝나면 자연스럽게 다시 마이크 경청(listening) 상태로 복귀
        setVoiceState('listening');
        startListening();
      }
    });
  }, [startListening]);

  // 🎯 전역 이벤트 수신: 어디서든 빅뱅 버튼 홀드 또는 음성 모드 버튼 클릭 시 팝업
  useEffect(() => {
    const handleOpenVoice = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      unlockAudioPlayback();
      primeTTSAudioElement();
      triggerHaptic('whitehole');

      setIsOpen(true);
      isComponentOpenRef.current = true;
      setErrorMessage(null);

      const initPrompt = detail?.initialPrompt;
      if (initPrompt && typeof initPrompt === 'string' && initPrompt.trim()) {
        // 이전 선택 텍스트가 전달된 경우 즉시 루시 질의 시작
        handleSendPrompt(initPrompt.trim());
      } else {
        // 일반 홀드 진입: 즉시 마이크 경청 시작
        setVoiceState('listening');
        setTimeout(() => {
          startListening();
        }, 150);
      }
    };

    const handleCloseVoice = () => {
      handleClose();
    };

    window.addEventListener('prism:open_lucy_voice', handleOpenVoice);
    window.addEventListener('prism:close_lucy_voice', handleCloseVoice);

    // URL 쿼리 파라미터 감지 (?voice=1 or ?voice=true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('voice') === '1' || params.get('voice') === 'true') {
        window.dispatchEvent(new CustomEvent('prism:open_lucy_voice'));
      }
    }

    return () => {
      window.removeEventListener('prism:open_lucy_voice', handleOpenVoice);
      window.removeEventListener('prism:close_lucy_voice', handleCloseVoice);
    };
  }, [startListening]);

  // 🛑 루시 말 끊기(인터럽트) 및 듣기 전환
  const handleInterruptLucy = () => {
    triggerHaptic('whitehole');
    stopTTS();
    setVoiceState('listening');
    startListening();
  };

  // 🎤 마이크 음소거 / 청취 토글
  const handleToggleMic = () => {
    triggerHaptic('whitehole');
    if (voiceState === 'speaking') {
      handleInterruptLucy();
      return;
    }

    if (voiceState === 'listening') {
      stopRecognition();
      setIsMuted(true);
      setVoiceState('idle');
    } else {
      setIsMuted(false);
      setVoiceState('listening');
      startListening();
    }
  };

  // 닫기
  const handleClose = () => {
    triggerHaptic('whitehole');
    isComponentOpenRef.current = false;
    stopRecognition();
    stopTTS();
    setIsOpen(false);
    setVoiceState('idle');
    setTranscript('');
    setInterimTranscript('');
  };

  // 채팅방으로 이동하여 전문 확인
  const handleNavigateToChat = () => {
    handleClose();
    navigate('/chat');
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/chat' } }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="fixed inset-0 z-[9990] flex flex-col justify-between bg-slate-950/92 backdrop-blur-2xl text-white select-none overflow-hidden font-sans"
      >
        {/* ✨ 심우주 오로라 배경 백드롭 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-amber-400/10 blur-[110px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-rose-500/10 via-amber-400/10 to-blue-500/10 blur-[90px]" />
        </div>

        {/* 🌟 Top Header: 루시 보이스 상태 & 닫기 버튼 */}
        <header className="relative z-10 w-full px-5 pt-safe-top pt-4 pb-3 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-rose-300 to-cyan-400 p-[1.5px] shadow-[0_0_16px_rgba(251,191,36,0.35)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-lg">
                  ✨
                </div>
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
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
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-tight">루시 AI 음성 모드</h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 border border-amber-400/40 text-amber-200">
                  여성 목소리
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {voiceState === 'listening' && '귀 기울여 경청하는 중...'}
                {voiceState === 'thinking' && '답변을 생각하는 중...'}
                {voiceState === 'speaking' && '루시가 이야기하고 있어요'}
                {voiceState === 'idle' && '터치하여 대화 시작'}
                {voiceState === 'error' && '음성 설정 필요'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSubtitles((prev) => !prev)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                showSubtitles
                  ? 'bg-white/10 text-cyan-300 border border-cyan-400/30'
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}
              title="자막 켜기/끄기"
            >
              <Radio size={14} />
              <span className="hidden sm:inline">자막</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-all border border-white/10"
              aria-label="음성모드 닫기"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* 🌌 Center Stage: Cosmic Voice Orb & Visualizer */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4">
          {/* 🌟 Dynamic Cosmic Voice Orb */}
          <div className="relative flex items-center justify-center my-auto">
            {/* Outer Ripple Wave Rings (Listening or Speaking) */}
            <AnimatePresence>
              {(voiceState === 'listening' || voiceState === 'speaking') && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ duration: voiceState === 'listening' ? 2.4 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute w-56 h-56 rounded-full border ${
                      voiceState === 'listening'
                        ? 'border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]'
                        : 'border-amber-400/50 shadow-[0_0_50px_rgba(251,191,36,0.35)]'
                    }`}
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: [1.1, 1.7, 1.1], opacity: [0.4, 0.05, 0.4] }}
                    transition={{ duration: voiceState === 'listening' ? 3.0 : 2.0, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    className={`absolute w-64 h-64 rounded-full border border-dashed ${
                      voiceState === 'listening' ? 'border-teal-400/30' : 'border-rose-400/40'
                    }`}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Rotating Star Particles (Thinking) */}
            {voiceState === 'thinking' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className="absolute w-60 h-60 rounded-full border border-purple-400/30 border-t-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.35)]"
              />
            )}

            {/* Core Cosmic Interactive Orb */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={voiceState === 'speaking' ? handleInterruptLucy : handleToggleMic}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full cursor-pointer flex items-center justify-center p-1 group shadow-[0_12px_60px_rgba(0,0,0,0.8)] focus:outline-none"
            >
              {/* Orb Fluid Gradient Background */}
              <div
                className={`w-full h-full rounded-full transition-all duration-700 flex items-center justify-center relative overflow-hidden ${
                  voiceState === 'listening'
                    ? 'bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 shadow-[0_0_60px_rgba(20,184,166,0.6)]'
                    : voiceState === 'thinking'
                    ? 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-fuchsia-500 shadow-[0_0_60px_rgba(168,85,247,0.6)]'
                    : voiceState === 'speaking'
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 shadow-[0_0_75px_rgba(251,191,36,0.7)] animate-pulse'
                    : 'bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 border border-white/20'
                }`}
              >
                {/* Internal Shimmering Light */}
                <div className="absolute inset-0 bg-radial from-white/35 via-transparent to-transparent opacity-70 mix-blend-overlay" />

                {/* Orb Center Icon & Status */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                  {voiceState === 'speaking' ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex flex-col items-center gap-1.5 text-white"
                    >
                      <Volume2 size={40} className="drop-shadow-lg" />
                      <span className="text-xs font-bold tracking-tight text-white/90">루시 이야기 중</span>
                      <span className="text-[10px] text-amber-200/80">터치하여 말끊기</span>
                    </motion.div>
                  ) : voiceState === 'thinking' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="flex flex-col items-center gap-1.5 text-purple-200"
                    >
                      <Sparkles size={38} className="drop-shadow-lg" />
                      <span className="text-xs font-bold tracking-tight">생각하는 중...</span>
                    </motion.div>
                  ) : voiceState === 'listening' ? (
                    <div className="flex flex-col items-center gap-1.5 text-cyan-100">
                      <Mic size={38} className="drop-shadow-lg animate-pulse" />
                      <span className="text-xs font-bold tracking-tight">경청 중</span>
                      <span className="text-[10px] text-cyan-200/80">말씀해 주세요</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-300">
                      <MicOff size={34} />
                      <span className="text-xs font-semibold">터치하여 시작</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          </div>

          {/* 🎵 Dynamic Voice Equalizer Waveform Bars (Listening / Speaking) */}
          <div className="h-8 flex items-center justify-center gap-1.5 mt-4">
            {[40, 75, 55, 90, 65, 80, 45].map((h, idx) => (
              <motion.span
                key={idx}
                animate={
                  voiceState === 'listening' || voiceState === 'speaking'
                    ? {
                        height: [
                          `${Math.max(6, h * 0.25)}px`,
                          `${Math.max(10, h * audioEnergy)}px`,
                          `${Math.max(6, h * 0.3)}px`,
                        ],
                      }
                    : { height: '5px' }
                }
                transition={{
                  duration: 0.45 + (idx % 3) * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.08,
                }}
                className={`w-1 rounded-full transition-colors ${
                  voiceState === 'listening'
                    ? 'bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                    : voiceState === 'speaking'
                    ? 'bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : voiceState === 'thinking'
                    ? 'bg-purple-400/70'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* 💬 Subtitles: Realtime User Speech & Lucy Reply */}
          <AnimatePresence>
            {showSubtitles && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg mt-3 flex flex-col gap-2 min-h-[96px] max-h-[160px] overflow-y-auto px-4 py-3 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              >
                {/* 실시간 내 음성 텍스트 표출 */}
                {(transcript || interimTranscript) && (
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-cyan-300 shrink-0 mt-0.5">나:</span>
                    <p className="text-xs text-white leading-relaxed font-medium">
                      {transcript || interimTranscript}
                      {voiceState === 'listening' && (
                        <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-400 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                )}

                {/* 최근 루시 답변 텍스트 표출 */}
                {lastLucyReply && (
                  <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                    <span className="text-[11px] font-bold text-amber-300 shrink-0 mt-0.5">루시:</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{lastLucyReply}</p>
                  </div>
                )}

                {!transcript && !lastLucyReply && (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs py-3 text-center">
                    {voiceState === 'listening'
                      ? '무슨 이야기든 편하게 말씀하세요. 루시가 귀 기울이고 있어요.'
                      : '빅뱅 버튼을 롱프레스하거나 마이크를 터치하여 대화를 시작해 보세요.'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 에러 메시지 알림 바 */}
          {errorMessage && (
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-[11px] text-rose-200 text-center max-w-md">
              {errorMessage}
            </div>
          )}

          {/* 음성 미지원 브라우저용 텍스트 폴백 입력창 */}
          {!isSttSupported && (
            <div className="w-full max-w-md mt-3 flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manualInput.trim()) {
                    handleSendPrompt(manualInput.trim());
                    setManualInput('');
                  }
                }}
                placeholder="음성 인식이 미지원되는 환경입니다. 여기에 질문을 적어주세요..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => {
                  if (manualInput.trim()) {
                    handleSendPrompt(manualInput.trim());
                    setManualInput('');
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 🎛️ Bottom Control Bar: 말마침, 마이크 토글, 채팅방 연동 */}
        <footer className="relative z-10 w-full px-6 pt-3 pb-safe-bottom pb-5 flex items-center justify-between border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
          {/* Left: 채팅방 이동 버튼 */}
          <button
            onClick={handleNavigateToChat}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-all border border-white/10 text-xs font-bold"
          >
            <MessageSquare size={15} className="text-amber-400" />
            <span>채팅방에서 보기</span>
          </button>

          {/* Center: 수동 말마침(전송) / 마이크 제어 버튼 */}
          <div className="flex items-center gap-2">
            {transcript.trim().length >= 2 && voiceState === 'listening' ? (
              <button
                onClick={() => handleSendPrompt(transcript)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all animate-bounce"
              >
                <Send size={13} />
                <span>말 마침 (전송)</span>
              </button>
            ) : (
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-full transition-all active:scale-95 border ${
                  voiceState === 'listening'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
                title={voiceState === 'listening' ? '음소거' : '경청 시작'}
              >
                {voiceState === 'listening' ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            )}
          </div>

          {/* Right: 루시 말 끊기 (말하는 도중) or 닫기 */}
          {voiceState === 'speaking' ? (
            <button
              onClick={handleInterruptLucy}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold active:scale-95 transition-all"
            >
              <VolumeX size={14} />
              <span>말 끊기</span>
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white transition-all border border-white/10 text-xs font-bold"
            >
              닫기
            </button>
          )}
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}

export default LucyVoiceModeModal;
