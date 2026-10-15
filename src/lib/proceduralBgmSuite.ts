/**
 * PRISM Healing & Transcendence Procedural BGM Suite (30 Premium Synthesized Tracks)
 * 100% Web Audio API procedural synthesis - no external audio files required.
 * Infinite, pristine, zero-latency looping with soothing acoustic & celestial soundscapes.
 * Tailored exclusively for: 사주·오행 / 78장 오라클 타로 / 솔페지오 치유 / 세도나 방하착 / 호오포노포노 / 양자 현실화 & 뮤즈.
 */
import {
  createLoopingNoiseSource,
  type NoiseColor,
} from "./audio";

export interface BgmTrack {
  name: string;
  url: string;
  artist?: string;
  trackKey?: string;
  category?: string;
}

export interface ProceduralSynthUtils {
  createAutoPanner: (speedHz: number, panDepth: number) => any;
  createDelay: (delayTime: number, feedback: number, wet: number) => any;
  createNoiseNode: (ctx: AudioContext, color: NoiseColor) => AudioBufferSourceNode;
  registerDynamicVoice: (nodes: any[], stopDelaySeconds: number) => void;
  activeNodesRef: React.MutableRefObject<any[]>;
  synthIntervalRef: React.MutableRefObject<any>;
  secondarySynthIntervalRef: React.MutableRefObject<any>;
}

export type TrackPlayFn = (
  ctx: AudioContext,
  masterGain: GainNode,
  utils: ProceduralSynthUtils
) => void;

// Musical Scale & Frequency Definitions
const PENTATONIC = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
const WOOD_PENTATONIC = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00]; // E minor pentatonic
const LYDIAN_SCALE = [130.81, 146.83, 164.81, 185.00, 196.00, 220.00, 246.94, 261.63];
const DORIAN_SCALE = [146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66];

export const FLOW_AUDIO_TRACKS: BgmTrack[] = [
  // --- Suite 1: 사주 ✕ 오행 치유 명리학 (Saju & 5 Elements) ---
  { name: "1. 木(목)의 새싹: 봄의 태동과 생명력", url: "flow-saju-wood", artist: "PRISM 사주·오행 명리", category: "사주·오행" },
  { name: "2. 火(화)의 불꽃: 영혼의 열정과 빛", url: "flow-saju-fire", artist: "PRISM 사주·오행 명리", category: "사주·오행" },
  { name: "3. 土(토)의 대지: 만물을 품는 중심과 균형", url: "flow-saju-earth", artist: "PRISM 사주·오행 명리", category: "사주·오행" },
  { name: "4. 金(금)의 결실: 명료한 가을과 수렴의 미학", url: "flow-saju-metal", artist: "PRISM 사주·오행 명리", category: "사주·오행" },
  { name: "5. 水(수)의 심연: 지혜와 흐름의 침묵", url: "flow-saju-water", artist: "PRISM 사주·오행 명리", category: "사주·오행" },

  // --- Suite 2: 78장 오라클 타로 여정 (Oracle Tarot Journey) ---
  { name: "6. 바보의 도약: 두려움 없는 순수한 시작", url: "flow-tarot-fool", artist: "PRISM 오라클 타로", category: "오라클 타로" },
  { name: "7. 여황제의 정원: 풍요와 창조의 온기", url: "flow-tarot-empress", artist: "PRISM 오라클 타로", category: "오라클 타로" },
  { name: "8. 은둔자의 등불: 어둠을 밝히는 내면의 성찰", url: "flow-tarot-hermit", artist: "PRISM 오라클 타로", category: "오라클 타로" },
  { name: "9. 운명의 회전축: 영원한 순환과 우주적 타이밍", url: "flow-tarot-wheel", artist: "PRISM 오라클 타로", category: "오라클 타로" },
  { name: "10. 별빛의 인도: 어둠 속 꺼지지 않는 희망", url: "flow-tarot-star", artist: "PRISM 오라클 타로", category: "오라클 타로" },
  { name: "11. 찬란한 태양: 승리와 무한한 생명 축복", url: "flow-tarot-sun", artist: "PRISM 오라클 타로", category: "오라클 타로" },

  // --- Suite 3: 솔페지오 기적 주파수 & 차크라 (Solfeggio Frequencies) ---
  { name: "12. 396Hz 죄책감과 두려움의 완전 해방", url: "flow-heal-396", artist: "PRISM 솔페지오 치유", category: "솔페지오" },
  { name: "13. 432Hz 자연과 우주의 수학적 평온 동조", url: "flow-heal-432", artist: "PRISM 솔페지오 치유", category: "솔페지오" },
  { name: "14. 528Hz 기적과 사랑의 DNA 변형 파동", url: "flow-heal-528", artist: "PRISM 솔페지오 치유", category: "솔페지오" },
  { name: "15. 639Hz 가슴 차크라와 관계의 조화로운 치유", url: "flow-heal-639", artist: "PRISM 솔페지오 치유", category: "솔페지오" },
  { name: "16. 741Hz 직관과 영적 명료함의 각성", url: "flow-heal-741", artist: "PRISM 솔페지오 치유", category: "솔페지오" },
  { name: "17. 963Hz 순수 신성 의식과 우주적 합일", url: "flow-heal-963", artist: "PRISM 솔페지오 치유", category: "솔페지오" },

  // --- Suite 4: 세도나 메서드 & 방하착 릴리즈 (Sedona Letting Go) ---
  { name: "18. 에고의 무조건적 항복 (Surrender of Ego)", url: "flow-sedona-surrender", artist: "PRISM 세도나 방하착", category: "세도나 방하착" },
  { name: "19. 생각 사이의 고요 (Silent Gap of Awareness)", url: "flow-sedona-gap", artist: "PRISM 세도나 방하착", category: "세도나 방하착" },
  { name: "20. 528Hz 무저항 챔버 (Zero-Resistance Sanctuary)", url: "flow-sedona-chamber", artist: "PRISM 세도나 방하착", category: "세도나 방하착" },
  { name: "21. 명치와 가슴의 신체 감각 릴리즈 (Somatic Heart Dissolution)", url: "flow-sedona-heart", artist: "PRISM 세도나 방하착", category: "세도나 방하착" },
  { name: "22. 순수 참나의 영원한 침묵 (Pure Presence Beyond Words)", url: "flow-sedona-presence", artist: "PRISM 세도나 방하착", category: "세도나 방하착" },

  // --- Suite 5: 호오포노포노 & 블루버드 평화 (Ho'oponopono & Peace) ---
  { name: "23. 미안합니다 · 용서하세요 (Ho'oponopono Cleansing)", url: "flow-hooponopono-cleanse", artist: "PRISM 호오포노포노", category: "호오포노포노" },
  { name: "24. 감사합니다 · 사랑합니다 (Ho'oponopono Pure Love)", url: "flow-hooponopono-love", artist: "PRISM 호오포노포노", category: "호오포노포노" },
  { name: "25. 블루 솔라 워터 태양빛 정화 (Blue Solar Water Transmutation)", url: "flow-hooponopono-water", artist: "PRISM 호오포노포노", category: "호오포노포노" },
  { name: "26. 푸른 새의 평화와 성경 묵상 (Bluebird Sacred Peace)", url: "flow-bluebird-peace", artist: "PRISM 블루버드 평화", category: "호오포노포노" },

  // --- Suite 6: 뮤즈 아우라 & 양자 현실화 (Quantum & Muse) ---
  { name: "27. 황금빛 양자 도약 (Quantum Leap Manifestation)", url: "flow-quantum-leap", artist: "PRISM 양자 현실화", category: "양자·뮤즈" },
  { name: "28. 5차원 주파수 앵커링 (5D Vibrational Anchor)", url: "flow-quantum-anchor", artist: "PRISM 양자 현실화", category: "양자·뮤즈" },
  { name: "29. 달빛 아래 예술가의 캔버스 (Moonlit Muse Canvas)", url: "flow-muse-canvas", artist: "PRISM 뮤즈 예술", category: "양자·뮤즈" },
  { name: "30. 영원한 안식의 요람 (Cradle of Eternal Serenity)", url: "flow-muse-cradle", artist: "PRISM 뮤즈 예술", category: "양자·뮤즈" },
];

/**
 * Per-track loudness calibration offsets to achieve consistent perceptual volume across all tracks.
 */
export const TRACK_NORMALIZATION_GAINS: Record<string, number> = {
  // Saju Suite
  "flow-saju-wood": 1.05,
  "flow-saju-fire": 0.85,
  "flow-saju-earth": 1.15,
  "flow-saju-metal": 1.0,
  "flow-saju-water": 0.90,

  // Tarot Suite
  "flow-tarot-fool": 1.05,
  "flow-tarot-empress": 0.88,
  "flow-tarot-hermit": 1.15,
  "flow-tarot-wheel": 0.95,
  "flow-tarot-star": 0.90,
  "flow-tarot-sun": 0.85,

  // Solfeggio Suite
  "flow-heal-396": 1.10,
  "flow-heal-432": 1.0,
  "flow-heal-528": 1.0,
  "flow-heal-639": 1.05,
  "flow-heal-741": 1.05,
  "flow-heal-963": 0.95,

  // Sedona Suite
  "flow-sedona-surrender": 1.0,
  "flow-sedona-gap": 1.30,
  "flow-sedona-chamber": 0.95,
  "flow-sedona-heart": 1.10,
  "flow-sedona-presence": 1.15,

  // Ho'oponopono & Bluebird Suite
  "flow-hooponopono-cleanse": 1.05,
  "flow-hooponopono-love": 0.92,
  "flow-hooponopono-water": 1.05,
  "flow-bluebird-peace": 1.10,

  // Quantum & Muse Suite
  "flow-quantum-leap": 0.90,
  "flow-quantum-anchor": 1.0,
  "flow-muse-canvas": 1.05,
  "flow-muse-cradle": 1.10,
};

export function getTrackNormalizationGain(trackUrl: string): number {
  return TRACK_NORMALIZATION_GAINS[trackUrl] ?? 1.0;
}

export const FLOW_TRACK_GENERATORS: Record<string, TrackPlayFn> = {
  // 1. 木(목)의 새싹: 봄의 태동과 생명력 (Wood Spring Awakening)
  "flow-saju-wood": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.85, 0.45, 0.35);
    const panner = createAutoPanner(0.06, 0.6);

    const playWood = () => {
      const now = ctx.currentTime;
      const notes = WOOD_PENTATONIC;
      const count = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const noteTime = now + i * 0.45;
        const freq = notes[Math.floor(Math.random() * notes.length)];

        const osc = ctx.createOscillator();
        const oscTri = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);
        oscTri.type = "triangle";
        oscTri.frequency.setValueAtTime(freq * 2.0, noteTime);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq * 1.5, noteTime);
        filter.Q.setValueAtTime(3.5, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.018, noteTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 4.8);

        osc.connect(gain);
        oscTri.connect(gain);
        gain.connect(filter);
        filter.connect(delay);
        filter.connect(panner);

        osc.start(noteTime);
        oscTri.start(noteTime);
        osc.stop(noteTime + 5.0);
        oscTri.stop(noteTime + 5.0);
        registerDynamicVoice([osc, oscTri, gain, filter], 5.0 + i * 0.45);
      }
    };

    playWood();
    synthIntervalRef.current = setInterval(playWood, 5500);
  },

  // 2. 火(화)의 불꽃: 영혼의 열정과 빛 (Fire Radiant Passion)
  "flow-saju-fire": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.1, 0.52, 0.28);
    const panner = createAutoPanner(0.03, 0.5);

    const chords = [
      [220.0, 277.18, 329.63, 415.30], // A major 7
      [246.94, 293.66, 369.99, 440.0], // B minor 7
      [196.0, 246.94, 293.66, 369.99], // G major 7
      [220.0, 261.63, 329.63, 392.0],  // A minor 7
    ];
    let step = 0;

    const playFire = () => {
      const now = ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * 0.5, now);
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 1.003, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(750, now);
        filter.frequency.linearRampToValueAtTime(1400, now + 3.0);
        filter.frequency.exponentialRampToValueAtTime(700, now + 8.0);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.012, now + 2.5 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 9.0);
        osc2.stop(now + 9.0);
        registerDynamicVoice([osc, osc2, filter, gain], 9.0);
      });
    };

    playFire();
    synthIntervalRef.current = setInterval(playFire, 7200);
  },

  // 3. 土(토)의 대지: 만물을 품는 중심과 균형 (Earth Sacred Grounding)
  "flow-saju-earth": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.4, 0.45, 0.25);
    const omFreq = 136.1; // Earth Year / Om fundamental

    const playEarth = () => {
      const now = ctx.currentTime;
      const freqs = [omFreq * 0.5, omFreq, omFreq * 1.5, omFreq * 2.0];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.025 : 0.012, now + 3.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 11.5);
        registerDynamicVoice([osc, filter, gain], 11.5);
      });
    };

    playEarth();
    synthIntervalRef.current = setInterval(playEarth, 8500);
  },

  // 4. 金(금)의 결실: 명료한 가을과 수렴의 미학 (Metal Crisp Harvest)
  "flow-saju-metal": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.65, 0.55, 0.4);
    const panner = createAutoPanner(0.08, 0.7);

    const metalPitches = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // Pure crystalline ringing

    const playMetalChime = () => {
      const now = ctx.currentTime;
      const count = 2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const t = now + i * 0.35;
        const freq = metalPitches[Math.floor(Math.random() * metalPitches.length)];

        const osc = ctx.createOscillator();
        const oscHigh = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        oscHigh.type = "sine";
        oscHigh.frequency.setValueAtTime(freq * 2.76, t); // Singing bowl metallic overtone

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.014, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);

        osc.connect(gain);
        oscHigh.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        oscHigh.start(t);
        osc.stop(t + 6.0);
        oscHigh.stop(t + 6.0);
        registerDynamicVoice([osc, oscHigh, gain], 6.0 + i * 0.35);
      }
    };

    playMetalChime();
    synthIntervalRef.current = setInterval(playMetalChime, 4800);
  },

  // 5. 水(수)의 심연: 지혜와 흐름의 침묵 (Water Deep Wisdom)
  "flow-saju-water": (ctx, masterGain, { createNoiseNode, createDelay, registerDynamicVoice, synthIntervalRef, activeNodesRef }) => {
    const delay = createDelay(1.2, 0.48, 0.35);

    // Deep water wave flow using gentle brown noise
    const noise = createNoiseNode(ctx, "brown");
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(280, ctx.currentTime);

    noiseGain.gain.setValueAtTime(0.018, ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    activeNodesRef.current.push(noise, noiseFilter, noiseGain);

    const playWhaleMelody = () => {
      const now = ctx.currentTime;
      const baseFreq = 164.81 + (Math.random() * 80 - 40);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.33, now + 3.0);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, now + 7.0);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

      osc.connect(gain);
      gain.connect(delay);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 9.0);
      registerDynamicVoice([osc, gain], 9.0);
    };

    playWhaleMelody();
    synthIntervalRef.current = setInterval(playWhaleMelody, 8000);
  },

  // 6. 바보의 도약: 두려움 없는 순수한 시작 (The Fool's Leap of Faith)
  "flow-tarot-fool": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.7, 0.45, 0.35);
    const panner = createAutoPanner(0.07, 0.6);
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C Pentatonic major

    const playFool = () => {
      const now = ctx.currentTime;
      const count = 4;
      for (let i = 0; i < count; i++) {
        const t = now + i * 0.28;
        const freq = scale[i % scale.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.016, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        osc.stop(t + 4.5);
        registerDynamicVoice([osc, gain], 4.5 + i * 0.28);
      }
    };

    playFool();
    synthIntervalRef.current = setInterval(playFool, 5000);
  },

  // 7. 여황제의 정원: 풍요와 창조의 온기 (The Empress Lush Garden)
  "flow-tarot-empress": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.0, 0.5, 0.3);
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [196.00, 246.94, 293.66, 349.23], // G7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
    ];
    let step = 0;

    const playEmpress = () => {
      const now = ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 1.002, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(550, now);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.014, now + 2.8 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 9.0);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(delay);
        filter.connect(masterGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 9.5);
        osc2.stop(now + 9.5);
        registerDynamicVoice([osc, osc2, gain, filter], 9.5);
      });
    };

    playEmpress();
    synthIntervalRef.current = setInterval(playEmpress, 7500);
  },

  // 8. 은둔자의 등불: 어둠을 밝히는 내면의 성찰 (The Hermit Inner Lantern)
  "flow-tarot-hermit": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.3, 0.48, 0.35);
    const panner = createAutoPanner(0.03, 0.5);

    const playHermit = () => {
      const now = ctx.currentTime;
      const droneNotes = [146.83, 220.00, 293.66]; // D minor modal

      droneNotes.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(420, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.015, now + 4.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 12.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(now);
        osc.stop(now + 12.5);
        registerDynamicVoice([osc, filter, gain], 12.5);
      });
    };

    playHermit();
    synthIntervalRef.current = setInterval(playHermit, 9500);
  },

  // 9. 운명의 회전축: 영원한 순환과 우주적 타이밍 (Wheel of Destiny Rotation)
  "flow-tarot-wheel": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.1, 0.5, 0.32);
    const panner = createAutoPanner(0.05, 0.6);

    const playWheel = () => {
      const now = ctx.currentTime;
      const root = 528.0;
      const harmonics = [root * 0.5, root, root * 1.5, root * 2.0];
      const freq = harmonics[Math.floor(Math.random() * harmonics.length)];

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(680, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.003, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.016, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.5);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(delay);
      filter.connect(panner);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 12.0);
      osc2.stop(now + 12.0);
      registerDynamicVoice([osc, osc2, gain, filter], 12.0);
    };

    playWheel();
    synthIntervalRef.current = setInterval(playWheel, 6800);
  },

  // 10. 별빛의 인도: 어둠 속 꺼지지 않는 희망 (The Star Celestial Beacon)
  "flow-tarot-star": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.75, 0.55, 0.42);
    const panner = createAutoPanner(0.07, 0.7);
    const lydianNotes = [523.25, 587.33, 659.25, 739.99, 783.99, 880.0, 1046.50]; // C Lydian twinkling

    const playStar = () => {
      const now = ctx.currentTime;
      const count = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const t = now + i * 0.4;
        const freq = lydianNotes[Math.floor(Math.random() * lydianNotes.length)];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.015, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        osc.stop(t + 5.0);
        registerDynamicVoice([osc, gain], 5.0 + i * 0.4);
      }
    };

    playStar();
    synthIntervalRef.current = setInterval(playStar, 5200);
  },

  // 11. 찬란한 태양: 승리와 무한한 생명 축복 (The Sun Glorious Triumph)
  "flow-tarot-sun": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.9, 0.45, 0.28);

    const playSun = () => {
      const now = ctx.currentTime;
      const sunHarmonics = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major radiant chord

      sunHarmonics.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(850, now);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.014, now + 2.5 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 9.0);
        registerDynamicVoice([osc, filter, gain], 9.0);
      });
    };

    playSun();
    synthIntervalRef.current = setInterval(playSun, 7000);
  },

  // 12. 396Hz 죄책감과 두려움의 완전 해방 (396Hz Liberation)
  "flow-heal-396": (ctx, masterGain, { createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const panner = createAutoPanner(0.04, 0.4);

    const play396 = () => {
      const now = ctx.currentTime;
      const freq = 396.0;

      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const gain = ctx.createGain();

      oscL.type = "sine";
      oscL.frequency.setValueAtTime(freq, now);
      oscR.type = "sine";
      oscR.frequency.setValueAtTime(freq + 4.5, now); // 4.5Hz Theta brainwave beat

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.0);

      oscL.connect(gain);
      oscR.connect(gain);
      gain.connect(panner);

      oscL.start(now);
      oscR.start(now);
      oscL.stop(now + 11.5);
      oscR.stop(now + 11.5);
      registerDynamicVoice([oscL, oscR, gain], 11.5);
    };

    play396();
    synthIntervalRef.current = setInterval(play396, 8500);
  },

  // 13. 432Hz 자연과 우주의 수학적 평온 동조 (432Hz Cosmic Harmony)
  "flow-heal-432": (ctx, masterGain, { createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const panner = createAutoPanner(0.03, 0.5);

    const play432 = () => {
      const now = ctx.currentTime;
      const freqs = [432.0, 432.0 * 1.5, 432.0 * 0.5]; // 216Hz, 432Hz, 648Hz

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.016, now + 3.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 12.0);

        osc.connect(gain);
        gain.connect(panner);

        osc.start(now);
        osc.stop(now + 12.5);
        registerDynamicVoice([osc, gain], 12.5);
      });
    };

    play432();
    synthIntervalRef.current = setInterval(play432, 9000);
  },

  // 14. 528Hz 기적과 사랑의 DNA 변형 파동 (528Hz Miracle Awakening)
  "flow-heal-528": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.2, 0.5, 0.35);

    const play528 = () => {
      const now = ctx.currentTime;
      const base = 528.0;

      const osc = ctx.createOscillator();
      const oscOvertone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(base, now);
      oscOvertone.type = "sine";
      oscOvertone.frequency.setValueAtTime(base * 2.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.0);

      osc.connect(gain);
      oscOvertone.connect(gain);
      gain.connect(delay);
      gain.connect(masterGain);

      osc.start(now);
      oscOvertone.start(now);
      osc.stop(now + 11.5);
      oscOvertone.stop(now + 11.5);
      registerDynamicVoice([osc, oscOvertone, gain], 11.5);
    };

    play528();
    synthIntervalRef.current = setInterval(play528, 8500);
  },

  // 15. 639Hz 가슴 차크라와 관계의 조화로운 치유 (639Hz Heart Chakra)
  "flow-heal-639": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.0, 0.48, 0.3);

    const play639 = () => {
      const now = ctx.currentTime;
      const f = 639.0;
      const osc = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      oscSub.type = "triangle";
      oscSub.frequency.setValueAtTime(f * 0.5, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.016, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 10.5);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(delay);
      gain.connect(masterGain);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 11.0);
      oscSub.stop(now + 11.0);
      registerDynamicVoice([osc, oscSub, gain], 11.0);
    };

    play639();
    synthIntervalRef.current = setInterval(play639, 8200);
  },

  // 16. 741Hz 직관과 영적 명료함의 각성 (741Hz Intuitive Clarity)
  "flow-heal-741": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.8, 0.52, 0.35);

    const play741 = () => {
      const now = ctx.currentTime;
      const f = 741.0;

      const osc = ctx.createOscillator();
      const oscFifth = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      oscFifth.type = "sine";
      oscFifth.frequency.setValueAtTime(f * 1.5, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.014, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 9.5);

      osc.connect(gain);
      oscFifth.connect(gain);
      gain.connect(delay);
      gain.connect(masterGain);

      osc.start(now);
      oscFifth.start(now);
      osc.stop(now + 10.0);
      oscFifth.stop(now + 10.0);
      registerDynamicVoice([osc, oscFifth, gain], 10.0);
    };

    play741();
    synthIntervalRef.current = setInterval(play741, 7500);
  },

  // 17. 963Hz 순수 신성 의식과 우주적 합일 (963Hz Divine Crown Connection)
  "flow-heal-963": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.4, 0.55, 0.4);
    const panner = createAutoPanner(0.03, 0.6);

    const play963 = () => {
      const now = ctx.currentTime;
      const f = 963.0;

      const osc = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(f * 0.5, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.013, now + 3.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 12.0);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(delay);
      gain.connect(panner);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 12.5);
      oscSub.stop(now + 12.5);
      registerDynamicVoice([osc, oscSub, gain], 12.5);
    };

    play963();
    synthIntervalRef.current = setInterval(play963, 9200);
  },

  // 18. 에고의 무조건적 항복 (Surrender of Ego)
  "flow-sedona-surrender": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.2, 0.45, 0.3);

    const playSurrender = () => {
      const now = ctx.currentTime;
      const chords = [130.81, 164.81, 196.0, 261.63]; // C major relaxation

      chords.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(380, now);

        // Soft exhale release curve
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.015, now + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 10.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 10.5);
        registerDynamicVoice([osc, filter, gain], 10.5);
      });
    };

    playSurrender();
    synthIntervalRef.current = setInterval(playSurrender, 8200);
  },

  // 19. 생각 사이의 고요 (Silent Gap of Awareness)
  "flow-sedona-gap": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.5, 0.52, 0.38);
    const panner = createAutoPanner(0.04, 0.5);

    const playGapChime = () => {
      const now = ctx.currentTime;
      const baseFreq = 432;
      const overtoneFreq = baseFreq * 2.76;

      [baseFreq, overtoneFreq].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        const vol = idx === 0 ? 0.016 : 0.008;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 6.5 : 4.5));

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(now);
        osc.stop(now + 7.0);
        registerDynamicVoice([osc, gain], 7.0);
      });
    };

    playGapChime();
    synthIntervalRef.current = setInterval(playGapChime, 6200);
  },

  // 20. 528Hz 무저항 챔버 (Zero-Resistance Sanctuary)
  "flow-sedona-chamber": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.2, 0.48, 0.32);

    const playChamber = () => {
      const now = ctx.currentTime;
      const freqs = [528.0, 528.0 * 0.5, 528.0 * 0.25];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(520, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.018 : 0.012, now + 3.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 12.0);
        registerDynamicVoice([osc, filter, gain], 12.0);
      });
    };

    playChamber();
    synthIntervalRef.current = setInterval(playChamber, 8800);
  },

  // 21. 명치와 가슴의 신체 감각 릴리즈 (Somatic Heart Dissolution)
  "flow-sedona-heart": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.95, 0.45, 0.28);
    const panner = createAutoPanner(0.04, 0.5);

    const playSomatic = () => {
      const now = ctx.currentTime;
      const warmChord = [174.61, 220.0, 261.63]; // F major warm heart resonance

      warmChord.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.015, now + 2.5 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(now);
        osc.stop(now + 9.0);
        registerDynamicVoice([osc, gain], 9.0);
      });
    };

    playSomatic();
    synthIntervalRef.current = setInterval(playSomatic, 7200);
  },

  // 22. 순수 참나의 영원한 침묵 (Pure Presence Beyond Words)
  "flow-sedona-presence": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.5, 0.5, 0.35);

    const playPresence = () => {
      const now = ctx.currentTime;
      const root = 216.0; // 432 sub-harmonic

      const osc = ctx.createOscillator();
      const oscAir = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(root, now);
      oscAir.type = "triangle";
      oscAir.frequency.setValueAtTime(root * 2.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.014, now + 4.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 12.5);

      osc.connect(gain);
      oscAir.connect(gain);
      gain.connect(delay);
      gain.connect(masterGain);

      osc.start(now);
      oscAir.start(now);
      osc.stop(now + 13.0);
      oscAir.stop(now + 13.0);
      registerDynamicVoice([osc, oscAir, gain], 13.0);
    };

    playPresence();
    synthIntervalRef.current = setInterval(playPresence, 9800);
  },

  // 23. 미안합니다 · 용서하세요 (Ho'oponopono Cleansing)
  "flow-hooponopono-cleanse": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.8, 0.48, 0.32);
    const panner = createAutoPanner(0.05, 0.5);
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25]; // Gentle acoustic piano tones

    const playCleanse = () => {
      const now = ctx.currentTime;
      const count = 3;

      for (let i = 0; i < count; i++) {
        const t = now + i * 0.38;
        const freq = notes[i % notes.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.015, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        osc.stop(t + 4.8);
        registerDynamicVoice([osc, gain], 4.8 + i * 0.38);
      }
    };

    playCleanse();
    synthIntervalRef.current = setInterval(playCleanse, 5600);
  },

  // 24. 감사합니다 · 사랑합니다 (Ho'oponopono Pure Love)
  "flow-hooponopono-love": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.0, 0.5, 0.3);
    const loveChord = [261.63, 329.63, 392.0, 528.0]; // C Major with 528Hz Miracle Love

    const playLove = () => {
      const now = ctx.currentTime;

      loveChord.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 3 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, now);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.014, now + 2.5 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 9.0);
        registerDynamicVoice([osc, filter, gain], 9.0);
      });
    };

    playLove();
    synthIntervalRef.current = setInterval(playLove, 7200);
  },

  // 25. 블루 솔라 워터 태양빛 정화 (Blue Solar Water Transmutation)
  "flow-hooponopono-water": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.65, 0.55, 0.4);
    const panner = createAutoPanner(0.08, 0.7);
    const drops = [659.25, 783.99, 880.00, 1046.50, 1318.51];

    const playWaterDrop = () => {
      const now = ctx.currentTime;
      const count = 2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const t = now + i * 0.25;
        const freq = drops[Math.floor(Math.random() * drops.length)];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.015, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        osc.stop(t + 3.2);
        registerDynamicVoice([osc, gain], 3.2 + i * 0.25);
      }
    };

    playWaterDrop();
    synthIntervalRef.current = setInterval(playWaterDrop, 4500);
  },

  // 26. 푸른 새의 평화와 성경 묵상 (Bluebird Sacred Peace)
  "flow-bluebird-peace": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.2, 0.48, 0.35);

    const playPeace = () => {
      const now = ctx.currentTime;
      const peacePitches = [196.0, 246.94, 293.66, 392.0]; // G Major sacred peaceful chord

      peacePitches.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.014, now + 3.0 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 9.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 10.0);
        registerDynamicVoice([osc, filter, gain], 10.0);
      });
    };

    playPeace();
    synthIntervalRef.current = setInterval(playPeace, 7800);
  },

  // 27. 황금빛 양자 도약 (Quantum Leap Manifestation)
  "flow-quantum-leap": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.7, 0.52, 0.35);
    const panner = createAutoPanner(0.06, 0.6);
    const arpeggio = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // Ascending spiral

    const playQuantum = () => {
      const now = ctx.currentTime;

      arpeggio.forEach((f, idx) => {
        const t = now + idx * 0.22;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.014, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.0);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(t);
        osc.stop(t + 4.2);
        registerDynamicVoice([osc, gain], 4.2 + idx * 0.22);
      });
    };

    playQuantum();
    synthIntervalRef.current = setInterval(playQuantum, 6000);
  },

  // 28. 5차원 주파수 앵커링 (5D Vibrational Anchor)
  "flow-quantum-anchor": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.2, 0.45, 0.3);

    const playAnchor = () => {
      const now = ctx.currentTime;
      // Dual-core 432Hz + 528Hz anchoring
      const anchorPitches = [216.0, 432.0, 528.0];

      anchorPitches.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.018 : 0.014, now + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 10.5);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 11.0);
        registerDynamicVoice([osc, gain], 11.0);
      });
    };

    playAnchor();
    synthIntervalRef.current = setInterval(playAnchor, 8500);
  },

  // 29. 달빛 아래 예술가의 캔버스 (Moonlit Muse Canvas)
  "flow-muse-canvas": (ctx, masterGain, { createDelay, createAutoPanner, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(0.9, 0.5, 0.35);
    const panner = createAutoPanner(0.04, 0.5);
    const impressionistChords = [
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
      [164.81, 196.0, 246.94, 293.66], // Em7
    ];
    let step = 0;

    const playCanvas = () => {
      const now = ctx.currentTime;
      const chord = impressionistChords[step % impressionistChords.length];
      step++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.014, now + 2.0 + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(gain);
        gain.connect(delay);
        gain.connect(panner);

        osc.start(now);
        osc.stop(now + 9.0);
        registerDynamicVoice([osc, gain], 9.0);
      });
    };

    playCanvas();
    synthIntervalRef.current = setInterval(playCanvas, 7000);
  },

  // 30. 영원한 안식의 요람 (Cradle of Eternal Serenity)
  "flow-muse-cradle": (ctx, masterGain, { createDelay, registerDynamicVoice, synthIntervalRef }) => {
    const delay = createDelay(1.4, 0.48, 0.32);

    const playCradle = () => {
      const now = ctx.currentTime;
      const lullabyChords = [130.81, 196.0, 261.63, 329.63]; // Warm C major cradle

      lullabyChords.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.013, now + 3.5 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 11.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(delay);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 11.5);
        registerDynamicVoice([osc, filter, gain], 11.5);
      });
    };

    playCradle();
    synthIntervalRef.current = setInterval(playCradle, 8800);
  },
};
