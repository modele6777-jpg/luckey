import { buildLucyLiveInstruction } from './lucyLiveBrief';

export type LiveVoiceState = 'listening' | 'speaking';

export type LiveVoiceSession = {
  stop: () => void;
  setMuted: (muted: boolean) => void;
  interrupt: () => void;
};

const LIVE_MODEL = 'gemini-3.8-live';

type LiveVoiceHandlers = {
  nickname?: string;
  chart?: string;
  cards?: string;
  onState?: (state: LiveVoiceState) => void;
  onUserText?: (text: string) => void;
  onLucyText?: (text: string) => void;
  onError?: (error: { code: string; message: string }) => void;
};

function downsample(input: Float32Array, inRate: number, outRate = 16000): Float32Array {
  if (inRate === outRate) return input;
  const ratio = inRate / outRate;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j += 1) sum += input[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

function pcmBase64(samples: Float32Array): string {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function parseRate(mime: string | undefined): number {
  const match = /rate=(\d+)/.exec(mime || '');
  return match ? Number(match[1]) : 24000;
}

export function startGeminiLiveVoice(handlers: LiveVoiceHandlers): LiveVoiceSession {
  const playback = new AudioContext();
  const capture = new AudioContext();
  void playback.resume();
  void capture.resume();
  let stopped = false;
  let failed = false;
  let muted = false;
  let ready = false;
  let socket: WebSocket | null = null;
  let stream: MediaStream | null = null;
  let processor: { onaudioprocess: ((event: AudioProcessingEvent) => void) | null; connect: (node: AudioNode) => void; disconnect: () => void } | null = null;
  let speakTimer: ReturnType<typeof setTimeout> | null = null;
  let setupTimer: ReturnType<typeof setTimeout> | null = null;
  let nextAt = 0;
  const sources = new Set<AudioBufferSourceNode>();

  const fail = (code: string, message: string) => {
    if (stopped || failed) return;
    failed = true;
    handlers.onError?.({ code, message });
  };

  const stopPlayback = () => {
    for (const source of sources) {
      try { source.stop(); } catch { /* already ended */ }
    }
    sources.clear();
    nextAt = 0;
  };

  const markSpeaking = () => {
    handlers.onState?.('speaking');
    if (speakTimer) clearTimeout(speakTimer);
    speakTimer = setTimeout(() => {
      if (!stopped) handlers.onState?.('listening');
    }, 500);
  };

  const playPcm = (data: string, mime?: string) => {
    const rate = parseRate(mime);
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    const view = new DataView(bytes.buffer);
    const count = Math.floor(bytes.length / 2);
    if (!count) return;
    const buffer = playback.createBuffer(1, count, rate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < count; i += 1) channel[i] = view.getInt16(i * 2, true) / 0x8000;
    const source = playback.createBufferSource();
    source.buffer = buffer;
    source.connect(playback.destination);
    const startAt = Math.max(playback.currentTime + 0.02, nextAt);
    source.start(startAt);
    nextAt = startAt + buffer.duration;
    sources.add(source);
    source.onended = () => sources.delete(source);
    markSpeaking();
  };

  const handleMessage = (raw: string) => {
    let message: any;
    try { message = JSON.parse(raw); } catch { return; }
    if (message.error) {
      fail('live-failed', '실시간 음성에 연결하지 못했습니다.');
      return;
    }
    if (message.setupComplete || message.setup_complete) {
      ready = true;
      if (setupTimer) clearTimeout(setupTimer);
      handlers.onState?.('listening');
      return;
    }
    const content = message.serverContent || message.server_content;
    if (!content) return;
    if (content.interrupted) stopPlayback();
    const userText = content.inputTranscription?.text || content.input_transcription?.text;
    const lucyText = content.outputTranscription?.text || content.output_transcription?.text;
    if (userText) handlers.onUserText?.(String(userText));
    if (lucyText) handlers.onLucyText?.(String(lucyText));
    const parts = content.modelTurn?.parts || content.model_turn?.parts || [];
    for (const part of parts) {
      const inline = part.inlineData || part.inline_data;
      if (inline?.data) playPcm(String(inline.data), inline.mimeType || inline.mime_type);
    }
    if (content.turnComplete || content.turn_complete) handlers.onState?.('listening');
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (speakTimer) clearTimeout(speakTimer);
    if (setupTimer) clearTimeout(setupTimer);
    stopPlayback();
    try { processor?.disconnect(); } catch { /* ignore */ }
    try { socket?.close(); } catch { /* ignore */ }
    stream?.getTracks().forEach(track => track.stop());
    void playback.close().catch(() => undefined);
    void capture.close().catch(() => undefined);
    socket = null;
    stream = null;
    processor = null;
  };

  const run = async () => {
    let token = '';
    let model = LIVE_MODEL;
    try {
      const response = await fetch('/api/ai/live-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nickname: handlers.nickname || '', chart: handlers.chart || '', cards: handlers.cards || '' }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.token) {
        fail(body?.code || 'live-unavailable', '실시간 음성을 열지 못해 기본 마이크로 듣습니다.');
        return;
      }
      token = String(body.token);
      model = String(body.model || LIVE_MODEL);
    } catch {
      fail('live-unavailable', '실시간 음성을 열지 못해 기본 마이크로 듣습니다.');
      return;
    }
    if (stopped) return;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      fail('mic-denied', '마이크 권한이 차단되어 있습니다. 브라우저 설정에서 마이크를 허용해 주세요.');
      return;
    }
    if (stopped) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }

    const source = capture.createMediaStreamSource(stream);
    processor = (capture as any).createScriptProcessor(4096, 1, 1);
    const silent = capture.createGain();
    silent.gain.value = 0;
    processor.onaudioprocess = (event) => {
      if (!ready || muted || stopped || socket?.readyState !== WebSocket.OPEN) return;
      const input = event.inputBuffer.getChannelData(0);
      const samples = downsample(input, capture.sampleRate);
      socket.send(JSON.stringify({
        realtimeInput: { audio: { data: pcmBase64(samples), mimeType: 'audio/pcm;rate=16000' } },
      }));
    };
    source.connect(processor);
    processor.connect(silent);
    silent.connect(capture.destination);

    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(token)}`;
    socket = new WebSocket(url);
    const setupTimerId = window.setTimeout(() => {
      if (!stopped && !ready) fail('live-timeout', '실시간 음성 응답이 없어 기본 마이크로 듣습니다.');
    }, 8000);
    setupTimer = setupTimerId;
    socket.onopen = () => {
      socket?.send(JSON.stringify({
        setup: {
          model: `models/${model}`,
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          },
          systemInstruction: {
            parts: [{ text: buildLucyLiveInstruction(handlers.nickname || '', handlers.chart || '', handlers.cards || '') }],
          },
        },
      }));
    };
    socket.onmessage = async (event) => {
      const raw = typeof event.data === 'string' ? event.data : await event.data.text();
      handleMessage(raw);
    };
    socket.onerror = () => fail('live-failed', '실시간 음성 연결이 끊겼습니다. 기본 마이크로 듣습니다.');
    socket.onclose = () => {
      if (!stopped && !ready) fail('live-failed', '실시간 음성 연결이 끊겼습니다. 기본 마이크로 듣습니다.');
    };
  };

  void run();
  return {
    stop,
    setMuted: (next) => { muted = next; },
    interrupt: stopPlayback,
  };
}
