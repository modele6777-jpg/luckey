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
  Sparkles,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMutedRef = useRef(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentOpenRef = useRef(false);
  const voiceStateRef = useRef<VoiceState>('idle');
  voiceStateRef.current = voiceState;

  // 🎙️ Push-to-Talk (버튼 홀드 녹음) 상태 및 최신 발화 ref
  const isPttActiveRef = useRef(false);
  const latestTranscriptRef = useRef('');
  const tossedTextRef = useRef('');

  // 🌟 실시간 음성모드 활성 상태 및 단계(경청/생각/발화)를 빅뱅 버튼에 브로드캐스팅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prism:lucy_voice_state', {
          detail: { isOpen, state: voiceState },
        })
      );
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('prism:lucy_voice_state', {
            detail: { isOpen: false, state: 'idle' },
          })
        );
      }
    };
  }, [isOpen, voiceState]);

  const stopRecognition = useCallback(() => {
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

  // 🎙️ SpeechRecognition 초기화 및 경청 시작
  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || !isComponentOpenRef.current || isMutedRef.current) return;
    stopRecognition();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('현재 브라우저에서 마이크 자동 음성 인식을 지원하지 않습니다.');
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

      const isCurrent = () => recognitionRef.current === recognition && isComponentOpenRef.current && !isMutedRef.current;

      recognition.onstart = () => {
        if (!isCurrent()) return;
        setVoiceState('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        if (!isCurrent()) return;
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
          latestTranscriptRef.current = combined;
          setTranscript(combined);
          setInterimTranscript(interimStr);

          // PTT(홀드) 모드가 아닐 때만 1.2초 무음 감지 시 자동 전송
          if (!isPttActiveRef.current) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              if (isCurrent() && combined.length >= 2 && voiceStateRef.current === 'listening') {
                handleSendPrompt(combined);
              }
            }, 1250);
          }
        }
      };

      recognition.onerror = (e: any) => {
        if (!isCurrent()) return;
        console.warn('[LucyVoice] STT Error notice:', e.error || e);
        if (e.error === 'not-allowed') {
          stopRecognition();
          setErrorMessage('마이크 접근 권한이 차단되어 있습니다. 브라우저 설정에서 마이크를 허용해 주세요.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        if (!isCurrent()) return;
        // 모달이 열려있고 여전히 경청 상태라면 세션 재개
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
      console.warn('[LucyVoice] Failed to start recognition:', err);
      setVoiceState('idle');
    }
  }, [stopRecognition]);

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
            // 🌟 100% 여성 목소리(Aoede / Web Speech 여성 보이스)로 낭독 (루시 채팅/음성모드에서는 완료 싱잉볼 제외)
            await playTTS(spokenText, 'Aoede', true, 'calm', undefined, false, undefined, undefined, undefined, { skipCompletionChime: true });
          } catch (ttsErr) {
            console.warn('[LucyVoice] playTTS error:', ttsErr);
          } finally {
            if (isComponentOpenRef.current && voiceStateRef.current === 'speaking') {
              setVoiceState(isMutedRef.current ? 'idle' : 'listening');
              if (!recognitionRef.current) startListening();
            }
          }
        },
      });
    } catch (err: any) {
      console.error('[LucyVoice] Send failed:', err);
      setErrorMessage('일시적인 통신 지연이 발생했습니다. 다시 말씀해 주시면 정성껏 답변해 드릴게요.');
      setVoiceState(isMutedRef.current ? 'idle' : 'listening');
      startListening();
    }
  };

  // 🔊 전역 TTS 상태 구독 (루시가 말하는 중인지 실시간 감지)
  useEffect(() => {
    return subscribeTTS((state) => {
      if (!isComponentOpenRef.current) return;
      if (state.isSpeaking || state.isLoading) {
        stopRecognition();
        if (voiceStateRef.current !== 'speaking') {
          setVoiceState('speaking');
        }
      } else if (voiceStateRef.current === 'speaking' && !isMutedRef.current) {
        // 낭독이 완전히 끝나면 자연스럽게 다시 마이크 경청(listening) 상태로 복귀
        setVoiceState('listening');
        if (!recognitionRef.current) startListening();
      } else if (voiceStateRef.current === 'speaking') {
        setVoiceState('idle');
      }
    });
  }, [startListening, stopRecognition]);

  // 🎯 전역 이벤트 수신: 어디서든 빅뱅 버튼 홀드 또는 음성 모드 버튼 클릭 시 팝업
  useEffect(() => {
    const handleOpenVoice = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      unlockAudioPlayback();
      primeTTSAudioElement();
      triggerHaptic('whitehole');

      setIsOpen(true);
      isComponentOpenRef.current = true;
      isMutedRef.current = false;
      setErrorMessage(null);

      const initPrompt = detail?.initialPrompt;
      const tossed = detail?.textToToss;
      const promptText = initPrompt || (tossed ? `내가 선택한 문장이야:\n"${tossed}"\n\n이 내용에 대해 핵심과 따뜻한 피드백을 친절하게 음성으로 이야기해 줘.` : '');

      if (promptText && typeof promptText === 'string' && promptText.trim()) {
        // 선택 문장 피드백 요청이 전달된 경우 즉시 루시 질의 및 음성 출력 시작
        handleSendPrompt(promptText.trim());
      } else {
        // 일반 홀드 진입: 즉시 마이크 경청 시작
        setVoiceState('listening');
        startListening();
      }
    };

    const handleCloseVoice = () => {
      handleClose();
    };

    // 🎙️ PTT (빅뱅 버튼 홀드 시 즉시 질문 녹음 시작)
    const handleStartVoicePtt = (e: Event) => {
      unlockAudioPlayback();
      primeTTSAudioElement();
      triggerHaptic('whitehole');

      isPttActiveRef.current = true;
      latestTranscriptRef.current = '';
      setIsOpen(true);
      isComponentOpenRef.current = true;
      isMutedRef.current = false;
      setErrorMessage(null);
      setTranscript('');
      setInterimTranscript('');
      setVoiceState('listening');

      const detail = (e as CustomEvent)?.detail;
      const tossed = detail?.textToToss;
      if (tossed && typeof tossed === 'string' && tossed.trim()) {
        tossedTextRef.current = tossed.trim();
        latestTranscriptRef.current = tossed.trim();
        setTranscript(tossed.trim());
      } else {
        tossedTextRef.current = '';
      }

      startListening();
    };

    // 🚀 PTT (손을 떼는 순간 무음 대기 없이 즉각 루시 질문 발송)
    const handleCommitVoicePtt = (e?: Event) => {
      if (!isPttActiveRef.current) return;
      const detail = (e as CustomEvent)?.detail;
      const tossed = detail?.textToToss || tossedTextRef.current;
      isPttActiveRef.current = false;
      isMutedRef.current = true;
      stopRecognition();

      const userSpeech = latestTranscriptRef.current.trim();
      let promptToSend = '';

      if (tossed) {
        if (userSpeech && userSpeech !== tossed) {
          promptToSend = `[선택 문장]\n"${tossed}"\n\n[사용자 음성 질문]\n${userSpeech}`;
        } else {
          promptToSend = `내가 선택한 문장이야:\n"${tossed}"\n\n이 내용에 대해 핵심과 따뜻한 피드백을 친절하게 음성으로 이야기해 줘.`;
        }
      } else {
        promptToSend = userSpeech;
      }

      tossedTextRef.current = '';

      if (promptToSend.length >= 1) {
        handleSendPrompt(promptToSend);
      } else {
        setVoiceState('idle');
      }
    };

    // 🛑 PTT (드래그 아웃 또는 취소)
    const handleAbortVoicePtt = () => {
      isPttActiveRef.current = false;
      tossedTextRef.current = '';
      stopRecognition();
      handleClose();
    };

    window.addEventListener('prism:open_lucy_voice', handleOpenVoice);
    window.addEventListener('prism:close_lucy_voice', handleCloseVoice);
    window.addEventListener('prism:start_lucy_voice_ptt', handleStartVoicePtt);
    window.addEventListener('prism:commit_lucy_voice_ptt', handleCommitVoicePtt);
    window.addEventListener('prism:abort_lucy_voice_ptt', handleAbortVoicePtt);

    // URL 쿼리 파라미터 감지 (?voice=1 or ?voice=true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('voice') === '1' || params.get('voice') === 'true') {
        window.dispatchEvent(new CustomEvent('prism:open_lucy_voice'));
      }
    }

    return () => {
      isComponentOpenRef.current = false;
      stopRecognition();
      window.removeEventListener('prism:open_lucy_voice', handleOpenVoice);
      window.removeEventListener('prism:close_lucy_voice', handleCloseVoice);
      window.removeEventListener('prism:start_lucy_voice_ptt', handleStartVoicePtt);
      window.removeEventListener('prism:commit_lucy_voice_ptt', handleCommitVoicePtt);
      window.removeEventListener('prism:abort_lucy_voice_ptt', handleAbortVoicePtt);
    };
  }, [startListening, stopRecognition]);

  // 🛑 루시 말 끊기(인터럽트) 및 듣기 전환
  const handleInterruptLucy = () => {
    triggerHaptic('whitehole');
    stopTTS();
    setVoiceState(isMutedRef.current ? 'idle' : 'listening');
    startListening();
  };

  // 🎤 마이크 음소거 / 청취 토글
  const handleToggleMic = () => {
    triggerHaptic('whitehole');
    if (voiceState === 'speaking') {
      handleInterruptLucy();
      return;
    }

    if (!isMutedRef.current && (recognitionRef.current || voiceState === 'listening')) {
      isMutedRef.current = true;
      latestTranscriptRef.current = '';
      stopRecognition();
      setTranscript('');
      setInterimTranscript('');
      setVoiceState('idle');
    } else {
      isMutedRef.current = false;
      setVoiceState('listening');
      startListening();
    }
  };

  // 닫기
  const handleClose = () => {
    triggerHaptic('whitehole');
    isComponentOpenRef.current = false;
    isPttActiveRef.current = false;
    latestTranscriptRef.current = '';
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
      <div className="fixed inset-0 pointer-events-none z-[9995] select-none font-sans overflow-hidden">
        {/* ✨ Non-intrusive Floating Voice HUD Capsule positioned above the bottom-right BigBang Button */}
        <motion.div
          key="lucy-voice-floating-capsule"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="pointer-events-auto absolute bottom-[calc(var(--sab,0px)+5.25rem)] right-3 sm:right-6 max-w-[calc(100vw-1.5rem)] sm:max-w-md w-auto rounded-2xl bg-neutral-950/90 hover:bg-neutral-950/95 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white p-3 flex flex-col gap-2 transition-colors"
        >
          {/* Status Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {/* Dynamic Animated Status Indicator */}
              <div className="relative shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-white/10 shadow-inner">
                {voiceState === 'speaking' ? (
                  <Volume2 size={15} className="text-amber-400 animate-pulse" />
                ) : voiceState === 'thinking' ? (
                  <Sparkles size={15} className="text-purple-400 animate-spin" />
                ) : voiceState === 'listening' ? (
                  <Mic size={15} className="text-cyan-400 animate-bounce" />
                ) : (
                  <MicOff size={15} className="text-slate-500" />
                )}
                {/* Status Dot */}
                <span
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
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

              {/* Title & Stage Label */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-tight shrink-0">루시 AI 음성</span>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {voiceState === 'listening' && '· 경청 중'}
                    {voiceState === 'thinking' && '· 생각 중'}
                    {voiceState === 'speaking' && '· 답변 중'}
                    {voiceState === 'idle' && '· 대기'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* 말끊기 Button (when speaking) */}
              {voiceState === 'speaking' && (
                <button
                  type="button"
                  onClick={handleInterruptLucy}
                  className="px-2 py-1 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="루시 말 끊고 바로 질문하기"
                >
                  <VolumeX size={12} />
                  <span>말끊기</span>
                </button>
              )}

              {/* Manual Send Button (when transcript exists) */}
              {transcript.trim().length >= 2 && voiceState === 'listening' && (
                <button
                  type="button"
                  onClick={() => handleSendPrompt(transcript)}
                  className="px-2 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="지금 바로 전송"
                >
                  <Send size={11} />
                  <span>전송</span>
                </button>
              )}

              {/* Mic Mute/Toggle */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                  voiceState === 'listening'
                    ? 'bg-white/10 text-cyan-300 border-cyan-400/30'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
                title={voiceState === 'listening' ? '마이크 음소거' : '다시 듣기'}
              >
                {voiceState === 'listening' ? <Mic size={13} /> : <MicOff size={13} />}
              </button>

              {/* Close / Exit Voice Mode */}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition-all active:scale-95 cursor-pointer"
                title="음성 모드 종료"
                aria-label="음성 모드 종료"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Real-time Subtitle / Context Feedback Row */}
          <div className="text-[11px] leading-relaxed">
            {transcript || interimTranscript ? (
              <div className="flex items-start gap-1.5 text-cyan-200 bg-cyan-950/40 px-2.5 py-1.5 rounded-xl border border-cyan-500/20 max-h-16 overflow-y-auto">
                <span className="font-bold text-cyan-400 shrink-0">나:</span>
                <span className="truncate">{transcript || interimTranscript}</span>
              </div>
            ) : voiceState === 'speaking' && lastLucyReply ? (
              <div className="flex items-start gap-1.5 text-amber-200 bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-500/20 max-h-16 overflow-y-auto">
                <span className="font-bold text-amber-400 shrink-0">루시:</span>
                <span className="line-clamp-2">{lastLucyReply}</span>
              </div>
            ) : (
              <div className="text-slate-400 text-[11px] px-1 flex items-center justify-between">
                <span>
                  {isPttActiveRef.current
                    ? '말씀하신 후 손을 떼면 즉시 답변이 나와요.'
                    : '편하게 말씀하세요. 루시가 실시간으로 듣고 있어요.'}
                </span>
                <button
                  type="button"
                  onClick={handleNavigateToChat}
                  className="text-amber-300/80 hover:text-amber-300 underline text-[10px] shrink-0 ml-2"
                >
                  채팅방 보기
                </button>
              </div>
            )}
          </div>

          {/* Error Message if STT not supported or mic denied */}
          {errorMessage && (
            <div className="text-[10px] text-rose-300 bg-rose-950/60 px-2 py-1 rounded-lg border border-rose-500/30">
              {errorMessage}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default LucyVoiceModeModal;
