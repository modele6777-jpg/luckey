import { safeLocalStorage } from '@/utils/safeStorage';
import { getSharedAudioContext, getAmbientAudioBus, setBgmPlaybackSessionActive } from '@/lib/audio';

/**
 * 🔮 루시 마스터(점술모드) 전용 배경음.
 * 음원 파일 없이 Web Audio로 실시간 합성한다: 낮은 드론 + 바람 같은 숨결 + 가끔 울리는 맑은 차임.
 * 미스테리하지만 대화에 방해되지 않게 아주 작게, 천천히.
 *
 * 앱 오디오 규칙(AGENTS.md 2번)을 따른다: 공유 AudioContext의 ambient 버스로만 내보내고(TTS 중 자동 더킹),
 * 외부 음악을 끊지 않는 비독점 세션을 쓰며, 사용자가 켠 적이 없으면 자동으로 재생하지 않는다.
 */
const PREF_KEY = 'lucy_master_bgm';
const MASTER_VOLUME = 0.16;

// D 도리안 펜타토닉 (D, E, G, A, C) — 몽환적이고 해결되지 않는 느낌
const CHIME_NOTES = [293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  disconnect: AudioNode[];
  nodes: AudioScheduledSourceNode[];
  chimeTimer: ReturnType<typeof setTimeout> | null;
};

let engine: Engine | null = null;
const listeners = new Set<(playing: boolean) => void>();

/** 사용자가 토글로 직접 켠 적이 있을 때만 true (기본은 꺼짐: 자동 BGM 금지) */
export function isLucyMasterBgmPreferred(): boolean {
  try { return safeLocalStorage.getItem(PREF_KEY) === 'on'; } catch { return false; }
}

function setPreferred(on: boolean) {
  try { safeLocalStorage.setItem(PREF_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
}

export function isLucyMasterBgmPlaying(): boolean {
  return Boolean(engine && engine.ctx.state === 'running');
}

export function subscribeLucyMasterBgm(listener: (playing: boolean) => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function notify() {
  const playing = isLucyMasterBgmPlaying();
  listeners.forEach(l => l(playing));
}

function buildEngine(): Engine | null {
  if (typeof window === 'undefined') return null;
  let ctx: AudioContext;
  let bus: GainNode;
  try {
    ctx = getSharedAudioContext();
    bus = getAmbientAudioBus();
  } catch {
    return null;
  }
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(bus);

  // Soft room "reverb": a feedback delay through a lowpass
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const damp = ctx.createBiquadFilter();
  damp.type = 'lowpass';
  damp.frequency.value = 2200;
  delay.connect(damp).connect(feedback).connect(delay);
  delay.connect(master);

  const nodes: AudioScheduledSourceNode[] = [];

  // Drone pad: D2 + A2 + D3, slightly detuned, through a slowly breathing lowpass
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 420;
  padFilter.Q.value = 0.7;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.5;
  padFilter.connect(padGain).connect(master);
  padGain.connect(delay);
  [[73.42, -4], [73.42, 5], [110.0, -3], [146.83, 2]].forEach(([freq, detune], i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = i === 3 ? 0.12 : 0.22;
    osc.connect(g).connect(padFilter);
    osc.start();
    nodes.push(osc);
  });
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 180;
  lfo.connect(lfoDepth).connect(padFilter.frequency);
  lfo.start();
  nodes.push(lfo);

  // Breath / candle-air: filtered noise, very quiet
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 600;
  noiseFilter.Q.value = 0.6;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;
  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  const breath = ctx.createOscillator();
  breath.frequency.value = 0.09;
  const breathDepth = ctx.createGain();
  breathDepth.gain.value = 0.02;
  breath.connect(breathDepth).connect(noiseGain.gain);
  noise.start();
  breath.start();
  nodes.push(noise, breath);

  const e: Engine = { ctx, master, disconnect: [master, delay, feedback, damp, padFilter, padGain, noiseFilter, noiseGain], nodes, chimeTimer: null };

  // Occasional chimes, like a far-off bell in the room
  const chime = () => {
    if (!engine || engine !== e) return;
    if (ctx.state === 'running') {
      const now = ctx.currentTime;
      const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
      const voices: [number, number][] = [[freq, 0.16], [freq * 2.01, 0.04]];
      voices.forEach(([f, level]) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(level, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        osc.connect(g);
        g.connect(master);
        g.connect(delay);
        osc.start(now);
        osc.stop(now + 4.6);
      });
    }
    e.chimeTimer = setTimeout(chime, 4000 + Math.random() * 6000);
  };
  e.chimeTimer = setTimeout(chime, 1800);
  return e;
}

function fadeTo(e: Engine, value: number, seconds: number) {
  const now = e.ctx.currentTime;
  e.master.gain.cancelScheduledValues(now);
  e.master.gain.setValueAtTime(e.master.gain.value, now);
  e.master.gain.linearRampToValueAtTime(value, now + seconds);
}

/** 재생 시작. 브라우저가 소리를 막으면 false (사용자가 버튼을 눌러야 함). */
export async function startLucyMasterBgm(): Promise<boolean> {
  if (!engine) engine = buildEngine();
  if (!engine) return false;
  try { await engine.ctx.resume(); } catch { /* blocked until a gesture */ }
  if (engine.ctx.state !== 'running') { notify(); return false; }
  setBgmPlaybackSessionActive(true);
  fadeTo(engine, MASTER_VOLUME, 2.5);
  notify();
  return true;
}

export function stopLucyMasterBgm(): void {
  const e = engine;
  if (!e) return;
  engine = null;
  if (e.chimeTimer) clearTimeout(e.chimeTimer);
  try { fadeTo(e, 0, 0.8); } catch { /* closed */ }
  setTimeout(() => {
    e.nodes.forEach(n => { try { n.stop(); } catch { /* already stopped */ } });
    // 공유 AudioContext는 닫지 않고 이 배경음의 노드만 떼어낸다
    e.disconnect.forEach(n => { try { n.disconnect(); } catch { /* already disconnected */ } });
  }, 900);
  setBgmPlaybackSessionActive(false);
  notify();
}

/** 토글 버튼: 켜고 끄고, 선택을 기억한다. */
export async function toggleLucyMasterBgm(): Promise<boolean> {
  if (isLucyMasterBgmPlaying()) {
    setPreferred(false);
    stopLucyMasterBgm();
    return false;
  }
  setPreferred(true);
  return startLucyMasterBgm();
}
