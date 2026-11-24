import { useEffect, useRef, useState, type RefObject } from 'react';
import { setMicCaptureActive } from '@/lib/audioMixingPolicy';
import { lucyMicrophonePermissionMessage, requestLucyMicrophone } from '@/lib/lucyMicrophone';
import { collectSpeechTranscript } from '@/lib/speechAutoSend';
import { rememberBgmBeforeMic, resumeBgmAfterMicSoon } from '@/lib/micBgmResume';

/**
 * 🎙️ 입력창 누르고 말하기 (루시·Lucy Pro 공용).
 *
 * - 입력 중이 아닐 때 입력창을 짧게 탭하면 평소처럼 키보드가 열린다.
 * - 0.22초 이상 누르고 있으면 마이크가 켜지고, 말하는 동안 음성 인식 글자와 소리 파동(마이크 음량)이 보인다.
 * - 손을 떼면 들은 말을 바로 보낸다. 아무 말도 없었으면 보내지 않는다.
 * - iOS가 입력창을 길게 누를 때 띄우는 돋보기·미리보기를 막으려고, 입력 중이 아닐 때는 터치를 직접 처리한다.
 * - 마이크를 쓰는 동안만 녹음 가능한 오디오 세션으로 바꾸고, 끝나면 원래(ambient)로 돌린다.
 */
export interface HoldToTalkState {
  holding: boolean;
  /** 0~1 마이크 음량 */
  level: number;
  transcript: string;
  error: string;
}

const HOLD_MS = 220;
const MOVE_CANCEL_PX = 24;

export function useHoldToTalk(
  targetRef: RefObject<HTMLElement | null>,
  options: { enabled: boolean; onSend: (text: string) => void; onStart?: () => void },
): HoldToTalkState {
  const [holding, setHolding] = useState(false);
  const [level, setLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const session = useRef<{
    recognition: any;
    stream: MediaStream | null;
    context: AudioContext | null;
    frame: number;
    committed: string;
    current: string;
    active: boolean;
    finishing: boolean;
    bgmWasPlaying: boolean;
  } | null>(null);
  const pressTimer = useRef<number | null>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const talking = useRef(false);
  const errorTimer = useRef<number | null>(null);

  const showError = (message: string) => {
    setError(message);
    if (errorTimer.current) window.clearTimeout(errorTimer.current);
    errorTimer.current = window.setTimeout(() => setError(''), 3500);
  };

  const releaseAudio = () => {
    const s = session.current;
    if (!s) return;
    if (s.frame) cancelAnimationFrame(s.frame);
    s.frame = 0;
    s.stream?.getTracks().forEach(track => track.stop());
    s.stream = null;
    void s.context?.close().catch(() => undefined);
    s.context = null;
    setMicCaptureActive(false);
    setLevel(0);
  };

  const startRecognition = () => {
    const s = session.current;
    if (!s) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showError('이 브라우저는 음성 인식을 지원하지 않아요.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      if (session.current !== s) return;
      s.current = collectSpeechTranscript(event.results).text;
      setTranscript(`${s.committed} ${s.current}`.replace(/\s+/g, ' ').trim());
    };
    recognition.onerror = (event: any) => {
      if (session.current !== s) return;
      const code = event?.error || '';
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        showError('마이크 권한이 필요해요. 설정에서 마이크를 허용해 주세요.');
        s.active = false;
      } else if (code === 'audio-capture' && s.stream) {
        // 이 기기는 소리 파동용 마이크와 음성 인식을 함께 못 쓴다: 파동을 끄고 인식만 다시 시작한다.
        releaseAudio();
      }
    };
    recognition.onend = () => {
      if (session.current !== s) return;
      // 브라우저가 잠깐 멈춰도 누르고 있는 동안은 계속 듣는다.
      s.committed = `${s.committed} ${s.current}`.trim();
      s.current = '';
      if (s.active && !s.finishing) {
        try { startRecognition(); } catch { /* ignore */ }
        return;
      }
      if (s.finishing) finish();
    };
    s.recognition = recognition;
    try { recognition.start(); } catch { /* already started */ }
  };

  const startMeter = (stream: MediaStream) => {
    const s = session.current;
    if (!s) return;
    try {
      const context = new AudioContext();
      s.context = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (session.current !== s || !s.context) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) { const v = (data[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.max(0, Math.min(1, (rms - 0.01) / 0.12)));
        s.frame = requestAnimationFrame(tick);
      };
      s.frame = requestAnimationFrame(tick);
    } catch {
      // 파동 없이도 음성 인식은 계속한다.
    }
  };

  const begin = async () => {
    if (session.current) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showError('이 브라우저는 음성 인식을 지원하지 않아요.');
      return;
    }
    const current = session.current = { recognition: null, stream: null, context: null, frame: 0, committed: '', current: '', active: true, finishing: false, bgmWasPlaying: rememberBgmBeforeMic() };
    setTranscript('');
    setMicCaptureActive(true);
    try {
      const stream = await requestLucyMicrophone({ audio: true });
      if (session.current !== current || !current.active) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      session.current.stream = stream;
      setHolding(true);
      optionsRef.current.onStart?.();
      startRecognition();
      startMeter(stream);
    } catch (error) {
      if (session.current !== current || !current.active) return;
      showError(lucyMicrophonePermissionMessage(error));
      finish();
    }
  };

  // 인식기를 확실히 끈다: 아이폰은 stop() 뒤에도 계속 듣는 경우가 있어 abort()로 마이크를 놓게 한다.
  const killRecognition = (recognition: any) => {
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    try { recognition.abort(); } catch { /* already ended */ }
  };

  const finish = () => {
    const s = session.current;
    if (!s) return;
    killRecognition(s.recognition);
    s.recognition = null;
    releaseAudio();
    session.current = null;
    setHolding(false);
    const text = `${s.committed} ${s.current}`.replace(/\s+/g, ' ').trim();
    setTranscript('');
    // 마이크 때문에 멈췄던 앱 배경음은 오디오 세션이 돌아온 뒤 다시 튼다.
    resumeBgmAfterMicSoon(s.bgmWasPlaying, 450);
    if (text) optionsRef.current.onSend(text);
  };

  const end = () => {
    const s = session.current;
    if (!s) return;
    s.active = false;
    s.finishing = true;
    setHolding(false);
    // 손을 떼면 소리 파동용 마이크는 바로 닫는다.
    releaseAudio();
    // 마지막 말을 확정할 시간을 조금(0.6초) 준다. 인식이 끝나면(onend) 바로 보내고, 안 끝나면 강제로 끈 뒤 보낸다.
    if (!s.recognition) { finish(); return; }
    try { s.recognition.stop(); } catch { /* not started */ }
    window.setTimeout(() => { if (session.current === s) finish(); }, 600);
  };

  const cancelPress = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = null;
    pressStart.current = null;
  };

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const onStart = (event: TouchEvent) => {
      if (!optionsRef.current.enabled || document.activeElement === target || event.touches.length > 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      pressStart.current = { x: touch.clientX, y: touch.clientY };
      talking.current = false;
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
      pressTimer.current = window.setTimeout(() => {
        pressTimer.current = null;
        talking.current = true;
        void begin();
      }, HOLD_MS);
    };
    const onMove = (event: TouchEvent) => {
      const start = pressStart.current;
      const touch = event.touches[0];
      if (!start || !touch || talking.current) return;
      if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > MOVE_CANCEL_PX) cancelPress();
    };
    const onEnd = (event: TouchEvent) => {
      if (!pressStart.current && !talking.current) return;
      event.preventDefault();
      const wasTalking = talking.current;
      talking.current = false;
      cancelPress();
      if (wasTalking) end();
      else (target as HTMLElement).focus();
    };
    const onCancel = () => {
      const wasTalking = talking.current;
      talking.current = false;
      cancelPress();
      if (wasTalking) end();
    };
    // 손가락이 입력창 밖에서 떨어져도 '뗌'으로 처리한다.
    const onWindowRelease = () => {
      if (!talking.current) return;
      talking.current = false;
      cancelPress();
      end();
    };
    window.addEventListener('touchend', onWindowRelease);
    window.addEventListener('touchcancel', onWindowRelease);
    window.addEventListener('blur', onWindowRelease);
    document.addEventListener('visibilitychange', onWindowRelease);
    target.addEventListener('touchstart', onStart, { passive: false });
    target.addEventListener('touchmove', onMove, { passive: true });
    target.addEventListener('touchend', onEnd, { passive: false });
    target.addEventListener('touchcancel', onCancel);
    return () => {
      window.removeEventListener('touchend', onWindowRelease);
      window.removeEventListener('touchcancel', onWindowRelease);
      window.removeEventListener('blur', onWindowRelease);
      document.removeEventListener('visibilitychange', onWindowRelease);
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchmove', onMove);
      target.removeEventListener('touchend', onEnd);
      target.removeEventListener('touchcancel', onCancel);
    };
  });

  useEffect(() => () => {
    if (errorTimer.current) window.clearTimeout(errorTimer.current);
    cancelPress();
    const s = session.current;
    if (s) {
      session.current = null;
      if (s.recognition) { s.recognition.onend = null; s.recognition.onresult = null; s.recognition.onerror = null; }
      try { s.recognition?.abort(); } catch { /* ignore */ }
      s.stream?.getTracks().forEach(track => track.stop());
      void s.context?.close().catch(() => undefined);
      setMicCaptureActive(false);
    }
  }, []);

  return { holding, level, transcript, error };
}
