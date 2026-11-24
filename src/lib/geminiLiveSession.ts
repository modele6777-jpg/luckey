import { buildLucyLiveInstruction, buildOrbLiveInstruction } from './lucyLiveBrief';
import { orbFunctionDeclarations } from './orb/orbTools';
import { orbVoice } from './orbMasters';
import { parseOrbLivePrices, type OrbLivePrices } from './orb/orbSessionMetrics';

export type LiveVoiceState = 'listening' | 'speaking';

export type LiveVoiceSession = {
  stop: () => void;
  setMuted: (muted: boolean, measureTurn?: boolean) => void;
  interrupt: () => void;
  sendText: (text: string, measureTurn?: boolean) => boolean;
  /** 마이크를 완전히 닫는다 (아이폰 마이크 표시도 꺼진다). 연결은 그대로 둔다. */
  releaseMic: () => void;
  /** 닫힌 마이크를 다시 연다. 열렸으면 true. */
  acquireMic: () => Promise<boolean>;
  /** 지금 재생 중인 마스터 목소리의 크기 (0~1, 오브 맥동용). */
  outputLevel: () => number;
};

import { setMicCaptureActive } from './audioMixingPolicy';
import { lucyMicrophonePermissionMessage, requestLucyMicrophone } from './lucyMicrophone';

const LIVE_MODEL = 'gemini-3.8-live';

type LiveVoiceHandlers = {
  nickname?: string;
  chart?: string;
  cards?: string;
  voice?: string;
  focus?: string;
  greet?: string;
  /** 상담 진행 방식·지난 상담 기록 같은 추가 안내 (참고 자료). */
  notes?: string;
  onState?: (state: LiveVoiceState) => void;
  onAudioLevel?: (level: number) => void;
  onUserText?: (text: string) => void;
  onLucyText?: (text: string) => void;
  onError?: (error: { code: string; message: string }) => void;
  /** Microphone requested earlier inside the user's tap (some browsers only show the prompt there). */
  micStream?: Promise<MediaStream> | null;
  /** Start without sending microphone audio (used by Orb's hold-to-talk mode). */
  startMuted?: boolean;
  /** 누르고 말하기: 음소거 중에는 마이크를 아예 닫아 둔다 (누를 때 acquireMic으로 다시 연다). */
  releaseMicWhileMuted?: boolean;
  /** When set, a missing microphone is not fatal: the session continues with typed input and spoken answers. */
  onNotice?: (message: string) => void;
  /** 🔮 오브 통합 마스터: 마스터가 도구를 함수로 부른다. persona = 말투, rules = 도구 사용 규칙. */
  orb?: { persona: string; rules: string };
  /** 마스터가 부른 함수를 실행하고 결과(JSON)를 돌려준다. */
  onToolCall?: (call: { id?: string; name: string; args?: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  /** 실시간 자막: 마스터 말 조각을 그 목소리가 실제로 들리는 순간에 준다 (글자는 목소리보다 훨씬 먼저 도착한다). */
  onCaption?: (text: string) => void;
  /** 재생이 끊겨(끼어들기 등) 아직 안 나온 자막을 버렸다. */
  onCaptionReset?: () => void;
  /** 마스터의 한 차례 답이 끝났다 (생각 중 표시를 끈다). */
  onTurnComplete?: () => void;
  /** 도구 실행 중 여부 (오브 표시용). */
  onToolBusy?: (busy: boolean) => void;
  onConnectionInfo?: (model: string, prices: OrbLivePrices | null) => void;
  onUsageMetadata?: (usage: unknown) => void;
  onInputSent?: (source: 'hold' | 'text') => void;
  onAudioScheduled?: (delayMs: number) => void;
  onToolResponseSent?: () => void;
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
  const primedMic = handlers.micStream;
  let stopped = false;
  let failed = false;
  let muted = handlers.startMuted ?? false;
  let ready = false;
  let socket: WebSocket | null = null;
  let stream: MediaStream | null = null;
  let micRequestId = 0;
  let processor: { onaudioprocess: ((event: AudioProcessingEvent) => void) | null; connect: (node: AudioNode) => void; disconnect: () => void } | null = null;
  let speakTimer: ReturnType<typeof setTimeout> | null = null;
  let setupTimer: ReturnType<typeof setTimeout> | null = null;
  let nextAt = 0;
  const sources = new Set<AudioBufferSourceNode>();
  // 마스터 목소리 크기를 재는 분석기 (오브가 목소리에 맞춰 맥동한다). 없는 환경이면 그냥 재생한다.
  let analyser: AnalyserNode | null = null;
  try {
    if (typeof (playback as any).createAnalyser === 'function') {
      analyser = playback.createAnalyser();
      analyser.fftSize = 512;
      analyser.connect(playback.destination);
    }
  } catch { analyser = null; }
  const levelBuffer = new Float32Array(512);
  const outputLevel = () => {
    if (!analyser || !sources.size) return 0;
    try {
      analyser.getFloatTimeDomainData(levelBuffer);
      let sum = 0;
      for (let i = 0; i < levelBuffer.length; i += 1) sum += levelBuffer[i] * levelBuffer[i];
      return Math.max(0, Math.min(1, (Math.sqrt(sum / levelBuffer.length) - 0.004) / 0.12));
    } catch { return 0; }
  };

  const fail = (code: string, message: string) => {
    if (stopped || failed) return;
    failed = true;
    stop();
    handlers.onError?.({ code, message });
  };

  // 실시간 자막: 글자 조각마다 재생 시각을 정해 두고 그때 보여 준다.
  let lastChunkAt = 0;
  let lastCaptionAt = 0;
  const captionTimers = new Set<ReturnType<typeof setTimeout>>();
  const clearCaptions = () => {
    for (const timer of captionTimers) clearTimeout(timer);
    captionTimers.clear();
    lastCaptionAt = 0;
  };
  const scheduleCaption = (text: string) => {
    if (!handlers.onCaption) return;
    const now = playback.currentTime;
    // 글자 조각은 자기 목소리 조각 바로 뒤에 도착한다: 가장 최근 목소리 조각이 시작되는 때에 보여 준다.
    const audioPending = nextAt > now + 0.02;
    const at = Math.max(now, lastCaptionAt, audioPending ? lastChunkAt : now);
    lastCaptionAt = at;
    const delay = Math.max(0, (at - now) * 1000);
    if (delay < 60) { handlers.onCaption(text); return; }
    const timer = setTimeout(() => {
      captionTimers.delete(timer);
      if (!stopped) handlers.onCaption?.(text);
    }, delay);
    captionTimers.add(timer);
  };

  const stopPlayback = () => {
    const hadCaptions = captionTimers.size > 0;
    clearCaptions();
    if (hadCaptions) handlers.onCaptionReset?.();
    for (const source of sources) {
      try { source.stop(); } catch { /* already ended */ }
    }
    sources.clear();
    nextAt = 0;
    if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
    if (!stopped) handlers.onState?.('listening');
  };

  const markSpeaking = () => {
    handlers.onState?.('speaking');
    if (speakTimer) clearTimeout(speakTimer);
    // 목소리는 도착보다 늦게 재생되므로, 예약된 마지막 소리가 끝날 때 말하기를 끝낸다.
    const remainingMs = Math.max(0, (nextAt - playback.currentTime) * 1000);
    speakTimer = setTimeout(() => {
      if (!stopped) handlers.onState?.('listening');
    }, remainingMs + 250);
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
    source.connect(analyser || playback.destination);
    const startAt = Math.max(playback.currentTime + 0.02, nextAt);
    source.start(startAt);
    lastChunkAt = startAt;
    nextAt = startAt + buffer.duration;
    sources.add(source);
    source.onended = () => sources.delete(source);
    handlers.onAudioScheduled?.((startAt - playback.currentTime) * 1000);
    markSpeaking();
  };

  let pendingText: { line: string; measureTurn: boolean } | null = null;

  const sendTyped = (text: string, measureTurn = false) => {
    const line = text.replace(/\s+/g, ' ').trim().slice(0, 500);
    if (!line || stopped || socket?.readyState !== WebSocket.OPEN) return false;
    stopPlayback();
    socket.send(JSON.stringify({
      clientContent: {
        turns: [{ role: 'user', parts: [{ text: line }] }],
        turnComplete: true,
      },
    }));
    if (measureTurn) handlers.onInputSent?.('text');
    handlers.onState?.('listening');
    return true;
  };

  const cancelledCalls = new Set<string>();
  let activeToolBatches = 0;
  // 같은 소켓의 다른 배치가 진행 중이어도 준비된 결과는 바로 돌려준다.
  const answerToolCall = async (toolCall: any) => {
    const calls: Array<{ id?: string; name: string; args?: Record<string, unknown> }> = toolCall.functionCalls || toolCall.function_calls || [];
    if (!calls.length) return;
    if (activeToolBatches++ === 0) handlers.onToolBusy?.(true);
    try {
      const isCancelled = (id?: string) => Boolean(id && cancelledCalls.has(String(id)));
      const responses = [];
      for (const call of calls) {
        if (stopped || isCancelled(call.id)) continue;
        let response: Record<string, unknown>;
        try {
          response = handlers.onToolCall
            ? await handlers.onToolCall({ id: call.id, name: String(call.name || ''), args: call.args || {} })
            : { ok: false, message: '이 상담에서는 도구를 쓸 수 없습니다.' };
        } catch {
          response = { ok: false, message: '도구 실행에 실패했습니다. 계산값 없이 이어 가세요.' };
        }
        responses.push({ ...(call.id ? { id: call.id } : {}), name: call.name, response });
      }
      const functionResponses = responses.filter(response => !isCancelled(response.id));
      if (stopped || !functionResponses.length || socket?.readyState !== WebSocket.OPEN) return;
      try {
        socket.send(JSON.stringify({ toolResponse: { functionResponses } }));
        handlers.onToolResponseSent?.();
      } catch { /* socket closing */ }
    } finally {
      activeToolBatches -= 1;
      if (!activeToolBatches && !stopped) handlers.onToolBusy?.(false);
    }
  };

  const handleMessage = (raw: string) => {
    let message: any;
    try { message = JSON.parse(raw); } catch { return; }
    if (message.error) {
      fail('live-failed', '실시간 음성에 연결하지 못했습니다.');
      return;
    }
    const usage = message.usageMetadata ?? message.usage_metadata;
    if (usage != null) handlers.onUsageMetadata?.(usage);
    if (message.setupComplete || message.setup_complete) {
      ready = true;
      if (setupTimer) clearTimeout(setupTimer);
      handlers.onState?.('listening');
      if (pendingText) {
        const queued = pendingText;
        pendingText = null;
        sendTyped(queued.line, queued.measureTurn);
      }
      return;
    }
    const toolCall = message.toolCall || message.tool_call;
    if (toolCall) { void answerToolCall(toolCall); return; }
    const cancelled = message.toolCallCancellation || message.tool_call_cancellation;
    if (cancelled) {
      for (const id of cancelled.ids || []) cancelledCalls.add(String(id));
      return;
    }
    const content = message.serverContent || message.server_content;
    if (!content) return;
    if (content.interrupted) stopPlayback();
    const userText = content.inputTranscription?.text || content.input_transcription?.text;
    const lucyText = content.outputTranscription?.text || content.output_transcription?.text;
    if (userText) handlers.onUserText?.(String(userText));
    const parts = content.modelTurn?.parts || content.model_turn?.parts || [];
    for (const part of parts) {
      const inline = part.inlineData || part.inline_data;
      if (inline?.data) playPcm(String(inline.data), inline.mimeType || inline.mime_type);
    }
    if (lucyText) {
      handlers.onLucyText?.(String(lucyText));
      scheduleCaption(String(lucyText));
    }
    if (content.turnComplete || content.turn_complete) {
      handlers.onTurnComplete?.();
      // 아직 재생할 목소리가 남았으면 말하기가 끝날 때(markSpeaking 타이머) 듣기로 바꾼다.
      if (nextAt <= playback.currentTime + 0.05) handlers.onState?.('listening');
    }
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    setMicCaptureActive(false);
    if (speakTimer) clearTimeout(speakTimer);
    if (setupTimer) clearTimeout(setupTimer);
    handlers.onAudioLevel?.(0);
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

  let micSource: MediaStreamAudioSourceNode | null = null;
  const attachStream = (next: MediaStream) => {
    stream = next;
      const source = capture.createMediaStreamSource(next);
      micSource = source;
      processor = (capture as any).createScriptProcessor(4096, 1, 1);
      const silent = capture.createGain();
      silent.gain.value = 0;
      processor!.onaudioprocess = (event) => {
        if (stopped) return;
        const input = event.inputBuffer.getChannelData(0);
        if (!ready || muted || socket?.readyState !== WebSocket.OPEN) {
          handlers.onAudioLevel?.(0);
          return;
        }
        let sumSquares = 0;
        for (let index = 0; index < input.length; index += 1) sumSquares += input[index] * input[index];
        const rms = Math.sqrt(sumSquares / Math.max(1, input.length));
        handlers.onAudioLevel?.(Math.max(0, Math.min(1, (rms - 0.006) / 0.06)));
        const samples = downsample(input, capture.sampleRate);
        socket.send(JSON.stringify({
          realtimeInput: { audio: { data: pcmBase64(samples), mimeType: 'audio/pcm;rate=16000' } },
        }));
      };
      source.connect(processor as unknown as AudioNode);
      processor!.connect(silent);
      silent.connect(capture.destination);
  };
  const detachStream = () => {
    try { processor?.disconnect(); } catch { /* ignore */ }
    try { micSource?.disconnect(); } catch { /* ignore */ }
    stream?.getTracks().forEach(track => track.stop());
    processor = null;
    micSource = null;
    stream = null;
    handlers.onAudioLevel?.(0);
  };

  const run = async () => {
    // Ask for permission while still inside the user's action, before waiting
    // on a provider token. An Orb guest can continue by text after refusal.
    try {
      setMicCaptureActive(true);
      const next = await (primedMic || requestLucyMicrophone());
      if (stopped) {
        next.getTracks().forEach(track => track.stop());
        return;
      }
      if (muted && handlers.releaseMicWhileMuted) {
        next.getTracks().forEach(track => track.stop());
        setMicCaptureActive(false);
      } else {
        stream = next;
        next.getAudioTracks().forEach(track => { track.enabled = false; });
      }
    } catch (error) {
      if (stopped) return;
      setMicCaptureActive(false);
      const message = lucyMicrophonePermissionMessage(error);
      if (!handlers.onNotice) {
        fail('mic-denied', message);
        return;
      }
      handlers.onNotice(`${message} 지금은 글로 상담할 수 있어요.`);
    }

    let token = '';
    let model = LIVE_MODEL;
    try {
      const response = await fetch('/api/ai/live-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nickname: handlers.nickname || '',
          chart: handlers.chart || '',
          cards: handlers.cards || '',
          voice: orbVoice(handlers.voice || ''),
          focus: handlers.focus || '',
          greet: handlers.greet || '',
          notes: handlers.notes || '',
          ...(handlers.orb ? { orb: true, persona: handlers.orb.persona, rules: handlers.orb.rules } : {}),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body?.token) {
        const code = typeof body?.code === 'string' ? body.code : 'live-unavailable';
        const needsServerSetup = code === 'GEMINI_API_KEY_INVALID' || code === 'GEMINI_API_KEY_MISSING';
        const orbMessage = needsServerSetup
          ? '음성 서버에서 인증을 거부했어요. 음성 서버 설정을 확인해야 합니다.'
          : '음성 서버에 연결하지 못했어요. 잠시 후 다시 연결해 주세요.';
        fail(code, handlers.orb ? orbMessage : '실시간 음성을 열지 못해 기본 마이크로 듣습니다.');
        return;
      }
      token = String(body.token);
      model = String(body.model || LIVE_MODEL);
      if (!stopped) handlers.onConnectionInfo?.(model, parseOrbLivePrices(body.usagePrices));
    } catch {
      fail('live-unavailable', '실시간 음성을 열지 못해 기본 마이크로 듣습니다.');
      return;
    }
    if (stopped) return;

    if (stream) {
      stream.getAudioTracks().forEach(track => { track.enabled = !muted; });
      attachStream(stream);
    }

    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(token)}`;
    socket = new WebSocket(url);
    const setupTimerId = setTimeout(() => {
      if (!stopped && !ready) fail('live-timeout', '실시간 음성 응답이 없어 기본 마이크로 듣습니다.');
    }, 8000);
    setupTimer = setupTimerId;
    socket.onopen = () => {
      socket?.send(JSON.stringify({
        setup: {
          model: `models/${model}`,
          generationConfig: {
            responseModalities: ['AUDIO'],
            // 한국어로 듣고 말한다 (영어로 잘못 알아듣지 않게).
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: orbVoice(handlers.voice || '') } }, languageCode: 'ko-KR' },
          },
          // 마스터가 한 말과 사용자의 말을 글자로도 받는다 (자막·보고서용).
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: {
            parts: [{ text: handlers.orb
              ? buildOrbLiveInstruction(handlers.nickname || '', handlers.orb.persona, handlers.greet || '', handlers.notes || '', handlers.orb.rules)
              : buildLucyLiveInstruction(handlers.nickname || '', handlers.chart || '', handlers.cards || '', handlers.focus || '', handlers.greet || '', handlers.notes || '') }],
          },
          // 🔮 오브 마스터는 15가지 도구를 함수로 부른다.
          ...(handlers.orb ? { tools: [{ functionDeclarations: orbFunctionDeclarations() }] } : {}),
        },
      }));
    };
    socket.onmessage = async (event) => {
      const raw = typeof event.data === 'string' ? event.data : await event.data.text();
      handleMessage(raw);
    };
    const handleDisconnect = () => {
      if (stopped) return;
      if (!ready) fail('live-failed', '실시간 음성 연결이 끊겼습니다. 기본 마이크로 듣습니다.');
      // 상담 도중 끊김(네트워크, 연결 시간 만료): 화면이 다시 연결할 수 있게 알린다.
      else fail('live-closed', '음성 연결이 끊겼어요.');
    };
    // A transport error can arrive before close. Use the same recovery for both.
    socket.onerror = handleDisconnect;
    socket.onclose = handleDisconnect;
  };

  void run();
  return {
    stop,
    setMuted: (next, measureTurn = false) => {
      // 누르고 말하기: 손을 떼면(다시 음소거) 말이 끝났다고 알려 바로 답하게 한다.
      if (next && !muted && ready && socket?.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
          if (measureTurn) handlers.onInputSent?.('hold');
        } catch { /* socket closing */ }
      }
      muted = next;
      if (next) handlers.onAudioLevel?.(0);
      stream?.getAudioTracks().forEach(track => { track.enabled = !next; });
    },
    interrupt: stopPlayback,
    outputLevel,
    releaseMic: () => {
      micRequestId += 1;
      if (stream) detachStream();
      setMicCaptureActive(false);
    },
    acquireMic: async () => {
      if (stopped) return false;
      if (stream) return true;
      const requestId = ++micRequestId;
      try {
        // iOS는 녹음 가능한 오디오 세션에서만 마이크를 연다.
        setMicCaptureActive(true);
        const next = await requestLucyMicrophone();
        if (stopped || requestId !== micRequestId) { next.getTracks().forEach(track => track.stop()); return false; }
        next.getAudioTracks().forEach(track => { track.enabled = !muted; });
        void capture.resume();
        attachStream(next);
        return true;
      } catch {
        if (!stopped && requestId === micRequestId) setMicCaptureActive(false);
        return false;
      }
    },
    sendText: (text: string, measureTurn = false) => {
      const line = text.replace(/\s+/g, ' ').trim().slice(0, 500);
      if (!line || stopped) return false;
      if (!ready || socket?.readyState !== WebSocket.OPEN) {
        pendingText = { line, measureTurn };
        return true;
      }
      return sendTyped(line, measureTurn);
    },
  };
}
