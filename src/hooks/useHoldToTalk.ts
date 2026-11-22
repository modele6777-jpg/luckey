import { useEffect, useRef, useState, type RefObject } from 'react';
import { setMicCaptureActive } from '@/lib/audioMixingPolicy';
import { collectSpeechTranscript } from '@/lib/speechAutoSend';

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

  const startMeter = async () => {
    const s = session.current;
    if (!s || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (session.current !== s || !s.active) { stream.getTracks().forEach(track => track.stop()); return; }
      s.stream = stream;
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

  const begin = () => {
    if (session.current) return;
    session.current = { recognition: null, stream: null, context: null, frame: 0, committed: '', current: '', active: true, finishing: false };
    setTranscript('');
    setHolding(true);
    optionsRef.current.onStart?.();
    // iOS는 재생 전용(ambient) 세션에서는 마이크를 열지 않는다: 누른 순간 녹음 가능한 세션으로 바꾼다.
    setMicCaptureActive(true);
    startRecognition();
    void startMeter();
  };

  const finish = () => {
    const s = session.current;
    if (!s) return;
    session.current = null;
    releaseAudio();
    setHolding(false);
    const text = `${s.committed} ${s.current}`.replace(/\s+/g, ' ').trim();
    setTranscript('');
    if (text) optionsRef.current.onSend(text);
  };

  const end = () => {
    const s = session.current;
    if (!s) return;
    s.active = false;
    s.finishing = true;
    setHolding(false);
    // 마지막 말을 확정할 시간을 조금 준다. 인식이 끝나면(onend) 바로 보낸다.
    try { s.recognition?.stop(); } catch { /* not started */ }
    window.setTimeout(() => { if (session.current === s) finish(); }, 900);
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
        begin();
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
    target.addEventListener('touchstart', onStart, { passive: false });
    target.addEventListener('touchmove', onMove, { passive: true });
    target.addEventListener('touchend', onEnd, { passive: false });
    target.addEventListener('touchcancel', onCancel);
    return () => {
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchmove', onMove);
      target.removeEventListener('touchend', onEnd);
      target.removeEventListener('touchcancel', onCancel);
    };
  });

  useEffect(() => () => {
    if (errorTimer.current) window.clearTimeout(errorTimer.current);
    const s = session.current;
    if (s) {
      session.current = null;
      try { s.recognition?.abort(); } catch { /* ignore */ }
      s.stream?.getTracks().forEach(track => track.stop());
      void s.context?.close().catch(() => undefined);
      setMicCaptureActive(false);
    }
  }, []);

  return { holding, level, transcript, error };
}
