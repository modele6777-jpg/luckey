// Web Audio API 기반 오프라인 사운드스케이프 신디사이저 (심리상담실 & 명상 전용 무다운로드 오디오 엔진)
class SoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = {};
    this.currentSound = null;
    this.masterGain = null;
    this.volume = 0.45;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val) || 0.45));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  stop() {
    if (this.currentSound && this.activeNodes[this.currentSound]) {
      try {
        this.activeNodes[this.currentSound].stop();
      } catch (e) {}
      delete this.activeNodes[this.currentSound];
    }
    this.currentSound = null;
  }

  play(type) {
    this.init();
    if (this.currentSound === type) {
      this.stop();
      return false; // 토글 꺼짐
    }

    this.stop();
    this.currentSound = type;

    switch (type) {
      case 'ocean':
        this.createOceanWaves();
        break;
      case 'rain':
        this.createRain();
        break;
      case 'stream':
        this.createGentleStream();
        break;
      case 'forest':
        this.createForestWind();
        break;
      case 'fire':
        this.createFireplace();
        break;
      case 'bowl':
        this.createSingingBowl();
        break;
      case 'freq432':
        this.createHealing432Hz();
        break;
      case 'freq528':
        this.createHealing528Hz();
        break;
      case 'om':
        this.createZenOmDrone();
        break;
      case 'chime':
        this.createWindChimes();
        break;
      case 'musicbox':
        this.createMusicBox();
        break;
      case 'crickets':
        this.createNightCrickets();
        break;
      case 'pink':
        this.createClinicalPinkNoise();
        break;
      case 'thunder':
        this.createRainThunder();
        break;
      default:
        this.createOceanWaves();
        break;
    }
    return true; // 켜짐
  }

  // 헬퍼: 핑크 노이즈 버퍼 생성 (1/f 파워 스펙트럼)
  generatePinkNoiseBuffer(seconds = 3) {
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 1. 🌊 파도 소리: 핑크 노이즈 + 저주파 LFO 스윕 (밀려왔다 부서지는 해변 파도)
  createOceanWaves() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.generatePinkNoiseBuffer(3);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.11, this.ctx.currentTime); // 9초 주기

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes['ocean'] = {
      stop: () => {
        try { noise.stop(); lfo.stop(); noise.disconnect(); } catch (e) {}
      }
    };
  }

  // 2. 🌧️ 온화한 빗소리: 고운 밴드패스 핑크 노이즈
  createRain() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.generatePinkNoiseBuffer(2);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    this.activeNodes['rain'] = {
      stop: () => {
        try { noise.stop(); noise.disconnect(); } catch (e) {}
      }
    };
  }

  // 3. 🏞️ 산속 옹달샘 / 시냇물 (Gentle Stream): 물 흐르는 맑은 수류음
  createGentleStream() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.generatePinkNoiseBuffer(3);
    noise.loop = true;

    const streamFilter = this.ctx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);
    streamFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // 물결 출렁임 LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.45, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(320, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(streamFilter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(streamFilter);
    streamFilter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    // 간헐적 물방울 퐁당 소리
    const dropInterval = setInterval(() => {
      if (this.currentSound !== 'stream') {
        clearInterval(dropInterval);
        return;
      }
      this.triggerWaterDrop();
    }, 2800);

    this.activeNodes['stream'] = {
      stop: () => {
        clearInterval(dropInterval);
        try { noise.stop(); lfo.stop(); noise.disconnect(); } catch (e) {}
      }
    };
  }

  triggerWaterDrop() {
    if (!this.ctx || this.currentSound !== 'stream') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 900 + Math.random() * 400;

      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  // 4. 🍃 아늑한 숲바람: 초저주파 바람결
  createForestWind() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.generatePinkNoiseBuffer(4);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12초 주기
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes['forest'] = {
      stop: () => {
        try { noise.stop(); lfo.stop(); noise.disconnect(); } catch (e) {}
      }
    };
  }

  // 5. 🪵 따뜻한 벽난로 장작불 (Fireplace Crackle)
  createFireplace() {
    // 1) 저주파 온기 웅성거림
    const rumble = this.ctx.createBufferSource();
    rumble.buffer = this.generatePinkNoiseBuffer(3);
    rumble.loop = true;

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(160, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    rumble.start();

    // 2) 장작 타닥타닥 크래클 간헐 틱
    const crackleInterval = setInterval(() => {
      if (this.currentSound !== 'fire') {
        clearInterval(crackleInterval);
        return;
      }
      this.triggerFireCrackle();
    }, 220);

    this.activeNodes['fire'] = {
      stop: () => {
        clearInterval(crackleInterval);
        try { rumble.stop(); rumble.disconnect(); } catch (e) {}
      }
    };
  }

  triggerFireCrackle() {
    if (!this.ctx || this.currentSound !== 'fire' || Math.random() > 0.65) return;
    try {
      const buffer = this.ctx.createBuffer(1, 400, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < 400; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 50);
      }

      const snap = this.ctx.createBufferSource();
      snap.buffer = buffer;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1800 + Math.random() * 1200, this.ctx.currentTime);
      snapFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(0.18 + Math.random() * 0.15, this.ctx.currentTime);

      snap.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.masterGain);

      snap.start();
    } catch (e) {}
  }

  // 6. 🔔 티베트 싱잉볼: 풍부한 하모닉스 배음 + 7.5초 주기 은은한 타종
  createSingingBowl() {
    this.triggerBowlChime();

    const interval = setInterval(() => {
      if (this.currentSound !== 'bowl') {
        clearInterval(interval);
        return;
      }
      this.triggerBowlChime();
    }, 7500);

    this.activeNodes['bowl'] = {
      stop: () => {
        clearInterval(interval);
      }
    };
  }

  triggerBowlChime() {
    if (!this.ctx || (this.currentSound !== 'bowl' && this.currentSound !== null)) return;
    try {
      const freqs = [216, 434, 652];
      const gains = [0.4, 0.25, 0.12];

      const masterChimeGain = this.ctx.createGain();
      masterChimeGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      masterChimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 6.8);
      masterChimeGain.connect(this.masterGain);

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        g.gain.setValueAtTime(gains[idx], this.ctx.currentTime);

        osc.connect(g);
        g.connect(masterChimeGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 7.0);
      });
    } catch (e) {}
  }

  // 7. ✨ 432Hz 치유 주파수 (Healing Solfeggio Tone & Alpha Entrainment)
  createHealing432Hz() {
    const osc1 = this.ctx.createOscillator(); // 432Hz
    const osc2 = this.ctx.createOscillator(); // 438Hz (6Hz 알파파 유도 바이노럴 비트)
    const oscSub = this.ctx.createOscillator(); // 216Hz 온기 서브하모닉

    osc1.frequency.setValueAtTime(432, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(438, this.ctx.currentTime);
    oscSub.frequency.setValueAtTime(216, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const gainSub = this.ctx.createGain();

    gain1.gain.setValueAtTime(0.24, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gainSub.gain.setValueAtTime(0.18, this.ctx.currentTime);

    // 부드러운 호흡식 트레몰로 LFO
    const tremolo = this.ctx.createOscillator();
    tremolo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12초 주기
    const tremoloGain = this.ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(gain1.gain);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    oscSub.connect(gainSub);

    gain1.connect(droneGain);
    gain2.connect(droneGain);
    gainSub.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    oscSub.start();
    tremolo.start();

    this.activeNodes['freq432'] = {
      stop: () => {
        try {
          osc1.stop(); osc2.stop(); oscSub.stop(); tremolo.stop();
          droneGain.disconnect();
        } catch (e) {}
      }
    };
  }

  // 8. 💖 528Hz 평온·스트레스 해소 주파수 (Transformation & Miracle Tone)
  createHealing528Hz() {
    const oscMain = this.ctx.createOscillator(); // 528Hz
    const oscHarmonic = this.ctx.createOscillator(); // 1056Hz (옥타브)
    const oscRoot = this.ctx.createOscillator(); // 264Hz (베이스)

    oscMain.frequency.setValueAtTime(528, this.ctx.currentTime);
    oscHarmonic.frequency.setValueAtTime(1056, this.ctx.currentTime);
    oscRoot.frequency.setValueAtTime(264, this.ctx.currentTime);

    const gMain = this.ctx.createGain();
    const gHarm = this.ctx.createGain();
    const gRoot = this.ctx.createGain();

    gMain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gHarm.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gRoot.gain.setValueAtTime(0.22, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    oscMain.connect(gMain);
    oscHarmonic.connect(gHarm);
    oscRoot.connect(gRoot);

    gMain.connect(filter);
    gHarm.connect(filter);
    gRoot.connect(filter);

    const finalGain = this.ctx.createGain();
    finalGain.gain.setValueAtTime(0.58, this.ctx.currentTime);
    filter.connect(finalGain);
    finalGain.connect(this.masterGain);

    oscMain.start();
    oscHarmonic.start();
    oscRoot.start();

    this.activeNodes['freq528'] = {
      stop: () => {
        try {
          oscMain.stop(); oscHarmonic.stop(); oscRoot.stop();
          finalGain.disconnect();
        } catch (e) {}
      }
    };
  }

  // 9. 🧘 젠 옴(Om) 명상 보컬 드론 (Deep Zen Om Resonance)
  createZenOmDrone() {
    const osc108 = this.ctx.createOscillator();
    const osc216 = this.ctx.createOscillator();
    const osc324 = this.ctx.createOscillator();

    osc108.frequency.setValueAtTime(108, this.ctx.currentTime);
    osc216.frequency.setValueAtTime(216, this.ctx.currentTime);
    osc324.frequency.setValueAtTime(324, this.ctx.currentTime);

    // 목소리 모음 포먼트 필터 (O sound, ~700Hz)
    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.setValueAtTime(680, this.ctx.currentTime);
    formant.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const swellLfo = this.ctx.createOscillator();
    swellLfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10초 주기
    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    const omGain = this.ctx.createGain();
    omGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

    swellLfo.connect(swellGain);
    swellGain.connect(omGain.gain);

    osc108.connect(formant);
    osc216.connect(formant);
    osc324.connect(formant);

    formant.connect(omGain);
    omGain.connect(this.masterGain);

    osc108.start();
    osc216.start();
    osc324.start();
    swellLfo.start();

    this.activeNodes['om'] = {
      stop: () => {
        try {
          osc108.stop(); osc216.stop(); osc324.stop(); swellLfo.stop();
          omGain.disconnect();
        } catch (e) {}
      }
    };
  }

  // 10. 🎐 청아한 풍경 / 윈드차임 (Wind Chimes & Soft Air)
  createWindChimes() {
    // 배경 부드러운 공기 흐름
    const air = this.ctx.createBufferSource();
    air.buffer = this.generatePinkNoiseBuffer(4);
    air.loop = true;

    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'lowpass';
    airFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

    const airGain = this.ctx.createGain();
    airGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(this.masterGain);
    air.start();

    // 펜타토닉 음계 차임벨 (E6, G6, A6, B6, D7, E7)
    const chimePitches = [1318, 1568, 1760, 1975, 2349, 2637];

    const chimeInterval = setInterval(() => {
      if (this.currentSound !== 'chime') {
        clearInterval(chimeInterval);
        return;
      }
      const p = chimePitches[Math.floor(Math.random() * chimePitches.length)];
      this.triggerBellTone(p, 2.5);
    }, 2400);

    this.activeNodes['chime'] = {
      stop: () => {
        clearInterval(chimeInterval);
        try { air.stop(); air.disconnect(); } catch (e) {}
      }
    };
  }

  triggerBellTone(freq, decayTime = 2.5) {
    if (!this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(freq * 2.01, this.ctx.currentTime); // 살짝 디튠된 하모닉

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + decayTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + decayTime + 0.1);
      osc2.stop(this.ctx.currentTime + decayTime + 0.1);
    } catch (e) {}
  }

  // 11. 🎶 마음 치유 오르골 (Therapy Music Box / Celestial Harp)
  createMusicBox() {
    // 치유 펜타토닉 멜로디 시퀀스
    const melody = [523.25, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25];
    let noteIdx = 0;

    const noteInterval = setInterval(() => {
      if (this.currentSound !== 'musicbox') {
        clearInterval(noteInterval);
        return;
      }
      const freq = melody[noteIdx % melody.length];
      noteIdx++;
      this.triggerMusicBoxTine(freq);
    }, 1100);

    this.activeNodes['musicbox'] = {
      stop: () => {
        clearInterval(noteInterval);
      }
    };
  }

  triggerMusicBoxTine(freq) {
    if (!this.ctx || this.currentSound !== 'musicbox') return;
    try {
      const osc = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      oscOvertone.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      oscOvertone.frequency.setValueAtTime(freq * 3.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      oscOvertone.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      oscOvertone.start();
      osc.stop(this.ctx.currentTime + 1.9);
      oscOvertone.stop(this.ctx.currentTime + 1.9);
    } catch (e) {}
  }

  // 12. 🌙 고요한 밤 풀벌레 (Night Crickets & Breeze)
  createNightCrickets() {
    const breeze = this.ctx.createBufferSource();
    breeze.buffer = this.generatePinkNoiseBuffer(3);
    breeze.loop = true;

    const breezeFilter = this.ctx.createBiquadFilter();
    breezeFilter.type = 'lowpass';
    breezeFilter.frequency.setValueAtTime(300, this.ctx.currentTime);
    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    breeze.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.masterGain);
    breeze.start();

    // 4500Hz 풀벌레 고주파 펄스
    const cricketOsc = this.ctx.createOscillator();
    cricketOsc.type = 'sine';
    cricketOsc.frequency.setValueAtTime(4600, this.ctx.currentTime);

    // 32Hz 날개 떨림 변조
    const amOsc = this.ctx.createOscillator();
    amOsc.frequency.setValueAtTime(32, this.ctx.currentTime);
    const amGain = this.ctx.createGain();
    amGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    const cricketMasterGain = this.ctx.createGain();
    cricketMasterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    amOsc.connect(amGain);
    amGain.connect(cricketMasterGain.gain);

    cricketOsc.connect(cricketMasterGain);
    cricketMasterGain.connect(this.masterGain);

    cricketOsc.start();
    amOsc.start();

    this.activeNodes['crickets'] = {
      stop: () => {
        try {
          breeze.stop(); cricketOsc.stop(); amOsc.stop();
          breeze.disconnect(); cricketMasterGain.disconnect();
        } catch (e) {}
      }
    };
  }

  // 13. 🔕 임상 핑크 노이즈 (Clinical Pink Noise / 차음 & 이완)
  createClinicalPinkNoise() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.generatePinkNoiseBuffer(3);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.activeNodes['pink'] = {
      stop: () => {
        try { noise.stop(); noise.disconnect(); } catch (e) {}
      }
    };
  }

  // 14. ⛈️ 창밖 빗소리와 먼 천둥 (Soft Rain & Distant Thunder)
  createRainThunder() {
    // 빗소리 레이어
    const rain = this.ctx.createBufferSource();
    rain.buffer = this.generatePinkNoiseBuffer(2);
    rain.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(900, this.ctx.currentTime);
    rainFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    rain.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rain.start();

    // 22초마다 은은하게 울리는 아주 먼 천둥소리
    const thunderInterval = setInterval(() => {
      if (this.currentSound !== 'thunder') {
        clearInterval(thunderInterval);
        return;
      }
      this.triggerDistantThunder();
    }, 22000);

    this.activeNodes['thunder'] = {
      stop: () => {
        clearInterval(thunderInterval);
        try { rain.stop(); rain.disconnect(); } catch (e) {}
      }
    };
  }

  triggerDistantThunder() {
    if (!this.ctx || this.currentSound !== 'thunder') return;
    try {
      const thunderNoise = this.ctx.createBufferSource();
      thunderNoise.buffer = this.generatePinkNoiseBuffer(4);

      const thunderFilter = this.ctx.createBiquadFilter();
      thunderFilter.type = 'lowpass';
      thunderFilter.frequency.setValueAtTime(75, this.ctx.currentTime);

      const thunderGain = this.ctx.createGain();
      thunderGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      thunderGain.gain.linearRampToValueAtTime(0.45, this.ctx.currentTime + 1.2);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.5);

      thunderNoise.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(this.masterGain);

      thunderNoise.start();
      thunderNoise.stop(this.ctx.currentTime + 4.6);
    } catch (e) {}
  }

  /**
   * 🔔 부드러운 티베트 싱잉볼 종소리 (Tibetan Singing Bowl Bell Strike)
   * 5초 풍선 호흡 세션 완료 시 심신을 깊고 편안하게 진정시키는 치유 배음 타종
   */
  playSingingBowlChime(options = {}) {
    this.init();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const baseFreq = options.freq || 528; // 528Hz Solfeggio / 432Hz 치유 주파수
      const masterVol = options.volume !== undefined ? options.volume : 0.7;
      const duration = options.duration || 6.8;

      const chimeMaster = this.ctx.createGain();
      chimeMaster.gain.setValueAtTime(masterVol, now);
      if (this.masterGain) {
        chimeMaster.connect(this.masterGain);
      } else {
        chimeMaster.connect(this.ctx.destination);
      }

      // 1. 부드러운 펠트 말렛 접촉음 (Soft felt-mallet transient strike)
      try {
        const malletNoise = this.ctx.createBufferSource();
        malletNoise.buffer = this.generatePinkNoiseBuffer(1);
        const malletFilter = this.ctx.createBiquadFilter();
        malletFilter.type = 'bandpass';
        malletFilter.frequency.setValueAtTime(baseFreq * 0.85, now);
        malletFilter.Q.setValueAtTime(3.5, now);

        const malletGain = this.ctx.createGain();
        malletGain.gain.setValueAtTime(0.0001, now);
        malletGain.gain.linearRampToValueAtTime(0.065, now + 0.015);
        malletGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        malletNoise.connect(malletFilter);
        malletFilter.connect(malletGain);
        malletGain.connect(chimeMaster);
        malletNoise.start(now);
        malletNoise.stop(now + 0.25);
      } catch (_) {}

      // 2. 티베트 싱잉볼 고유 배음 파셜 (Sub-base + Fundamental + Beating + Rich Harmonics)
      const partials = [
        { f: baseFreq * 0.5, gain: 0.32, decay: duration * 0.98 },      // 온기 있는 서브 베이스 (264Hz)
        { f: baseFreq, gain: 0.48, decay: duration },                    // 맑고 청아한 기본음 (528Hz)
        { f: baseFreq + 1.25, gain: 0.36, decay: duration * 0.96 },     // 맥놀이 진동 코러스 (+1.25Hz)
        { f: baseFreq * 2.01, gain: 0.20, decay: duration * 0.75 },     // 1차 고조파 (1061Hz)
        { f: baseFreq * 3.015, gain: 0.11, decay: duration * 0.55 },    // 2차 고조파 (1591Hz)
        { f: baseFreq * 4.76, gain: 0.05, decay: duration * 0.38 },     // 상위 메탈릭 공명 (2513Hz)
      ];

      partials.forEach(p => {
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.f, now);

        // 부드러운 페이드인(클릭 팝 방지) 및 우아한 감쇠
        pGain.gain.setValueAtTime(0.0001, now);
        pGain.gain.linearRampToValueAtTime(p.gain, now + 0.025);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(chimeMaster);

        osc.start(now);
        osc.stop(now + p.decay + 0.1);
      });

      // 3. 브라우저 햅틱 진동 피드백 (모바일 지원 기기)
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate([25, 45, 30]);
        } catch (_) {}
      }
    } catch (e) {
      console.warn('Singing bowl chime error:', e);
    }
  }

  // 싱글 차임 (기존 호환성 유지 및 싱잉볼 타종으로 고음질화)
  playChime(options) {
    return this.playSingingBowlChime(options);
  }
}

window.soundscapeEngine = new SoundscapeEngine();
