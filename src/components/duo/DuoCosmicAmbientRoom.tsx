import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Music, Activity, Play, Pause, Volume2 } from 'lucide-react';
import './duo-cosmic-room.css';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '@/lib/divination/deterministicEngine';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

interface DuoCosmicAmbientRoomProps {
  isLight?: boolean;
}

// 🎧 Web Audio API 기반 순수 바이노럴 비트 합성기 (스테레오 채널 분리)
class BinauralBeatSynthesizer {
  private ctx: AudioContext | null = null;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;

  public static getBeatFreq(bpm: number): { beatHz: number; carrierHz: number; waveLabel: string } {
    if (bpm <= 65) {
      return { beatHz: 4.5, carrierHz: 216, waveLabel: '세타파(θ) 4.5Hz · 깊은 명상' };
    }
    if (bpm <= 95) {
      return { beatHz: 10.0, carrierHz: 220, waveLabel: '알파파(α) 10Hz · 편안한 이완' };
    }
    return { beatHz: 15.0, carrierHz: 240, waveLabel: '베타파(β) 15Hz · 집중과 각성' };
  }

  public start(bpm: number): boolean {
    try {
      this.stop();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      const ctx = new AudioCtx();
      this.ctx = ctx;

      const { beatHz, carrierHz } = BinauralBeatSynthesizer.getBeatFreq(bpm);

      // 좌측 채널: carrierHz (예: 216Hz, 220Hz, 240Hz)
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(carrierHz, ctx.currentTime);

      // 우측 채널: carrierHz + beatHz (예: 220.5Hz, 230Hz, 255Hz)
      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(carrierHz + beatHz, ctx.currentTime);

      // 스테레오 채널 분리 머저
      const merger = ctx.createChannelMerger(2);

      const leftGain = ctx.createGain();
      leftGain.gain.setValueAtTime(0.5, ctx.currentTime);
      leftOsc.connect(leftGain);
      leftGain.connect(merger, 0, 0); // 좌측 이어폰

      const rightGain = ctx.createGain();
      rightGain.gain.setValueAtTime(0.5, ctx.currentTime);
      rightOsc.connect(rightGain);
      rightGain.connect(merger, 0, 1); // 우측 이어폰

      // 부드러운 페이드인
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.5);

      merger.connect(masterGain);
      masterGain.connect(ctx.destination);

      leftOsc.start();
      rightOsc.start();

      this.leftOsc = leftOsc;
      this.rightOsc = rightOsc;
      this.masterGain = masterGain;
      this.isPlaying = true;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      return true;
    } catch (e) {
      console.warn('Binaural beat synthesis error:', e);
      return false;
    }
  }

  public updateBpm(bpm: number) {
    if (!this.isPlaying || !this.ctx || !this.leftOsc || !this.rightOsc) return;
    try {
      const { beatHz, carrierHz } = BinauralBeatSynthesizer.getBeatFreq(bpm);
      const now = this.ctx.currentTime;
      this.leftOsc.frequency.linearRampToValueAtTime(carrierHz, now + 0.3);
      this.rightOsc.frequency.linearRampToValueAtTime(carrierHz + beatHz, now + 0.3);
    } catch (_) {}
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        setTimeout(() => {
          try {
            this.leftOsc?.stop();
            this.rightOsc?.stop();
            this.leftOsc?.disconnect();
            this.rightOsc?.disconnect();
            this.ctx?.close();
          } catch (_) {}
          this.ctx = null;
          this.leftOsc = null;
          this.rightOsc = null;
          this.masterGain = null;
          this.isPlaying = false;
        }, 280);
      } catch (_) {
        this.ctx = null;
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// 📖 246대 DCE 엔진별 핵심 통찰 및 요약 설명 생성기
function getEngineShortSummary(engine: DceEngineMeta): string {
  if (engine.summary) return engine.summary;
  const k = engine.key;
  const n = engine.nameKo;

  // 1. 기초 15대 도구
  if (k === 'saju') return '생년월일시 사주팔자와 오행의 생극제화로 타고난 기질과 대운의 흐름을 조망합니다.';
  if (k === 'astrology') return '출생 천궁도 행성 배치와 황도 12궁 각도로 내면의 원형과 우주적 기운을 해석합니다.';
  if (k === 'ziwei') return '자미성·천부성 등 12궁 별자리 배치를 통해 인생의 길흉화복과 귀인 흐름을 정밀 분석합니다.';
  if (k === 'tarot') return '78장 원형 카드의 무의식적 투사와 동시성으로 현재 당면한 기운과 선택의 기로를 짚어냅니다.';
  if (k === 'sukuyo') return '달의 27숙 궤도와 6대 관계 매트릭스로 영혼의 상성과 숙명적 인연의 깊이를 읽습니다.';
  if (k === 'mahabote') return '출생 요일과 미얀마 8요일 행성 주기로 성격의 고유한 장단점과 대처 방식을 진단합니다.';
  if (k === 'vedic') return '항성황도대 정밀 계산과 120년 다샤로 카르마의 전개와 인생의 결실 시기를 진단합니다.';
  if (k === 'liuren') return '하늘과 땅의 12신살 정단으로 일상 속 구체적인 사건과 거래의 진척을 밝힙니다.';
  if (k === 'qimen') return '천간·지지와 팔문·구성의 시공간 포국으로 현실 속 최선의 전략적 승부처를 찾습니다.';
  if (k === 'kabbalah') return '생명나무 10대 세피라와 22개 길을 통해 우주적 창조 질서와 영혼의 성장 단계를 짚습니다.';
  if (k === 'iching') return '음양 64괘의 동효와 변괘를 통해 세상의 변화 이치와 알맞은 처세의 타이밍을 읽습니다.';
  if (k === 'thai_astrology') return '동남아 전통 불교 점성학의 생애주기와 인연수치로 업보의 흐름을 살펴봅니다.';
  if (k === 'tojeong') return '토정 이지함의 역학 원리로 한 해의 사계절 운세 흐름과 조심할 액운을 방비합니다.';
  if (k === 'kyusei') return '낙서 9궁의 정위반 순환으로 해와 달의 기운에 따른 길방위와 개운법을 도출합니다.';
  if (k === 'taiyi') return '천문 3식의 최고봉으로 국가적·시대적 대세 흐름과 거시적 환경 변화를 관조합니다.';

  // 2. 주요 심층 결정론 도구
  if (k === 'chronoTransit') return '지금 이 시각 행성들의 하늘 위치가 나의 출생 차트와 이루는 실시간 각도를 해석합니다.';
  if (k === 'lifeSeasonTiming') return '10년 주기로 바뀌는 대운의 계절적 전환점을 파악해 인생의 속도 조절을 돕습니다.';
  if (k === 'energeticPrescription') return '목화토금수 오행의 결핍과 과다를 진단해 심신의 균형을 맞추는 솔루션을 제시합니다.';
  if (k === 'contextualSynastry') return '대화 상대방과의 사주·에너지 상성을 실시간 교차 검증해 관계의 시너지를 찾습니다.';
  if (k === 'instantDecision') return '지금 시각의 기문둔갑 시가팔문으로 선택의 길흉과 즉시 행동 여부를 명확히 가릅니다.';
  if (k === 'ziweiFlyingStars') return '유년 사화(록·권·과·기)의 비궁 흐름을 추적해 올해의 재물과 명예 기회를 포착합니다.';
  if (k === 'specialStarsMatrix') return '천을귀인·괴강·백호·양인 등 15대 신살의 역동성을 분석해 잠재된 슈퍼파워를 깨웁니다.';
  if (k === 'monthlyFlow') return '12개월의 월별 운기 흐름을 시각화해 상반기와 하반기의 핵심 실행 전략을 제시합니다.';
  if (k === 'spatialFengshui') return '거주 공간과 집무실의 방위 에너지를 조율해 집중력과 재물운을 끌어올립니다.';
  if (k === 'vitalityCurve') return '24시간 생체 시계와 오행 순환 리듬을 대조해 최적의 몰입과 휴식 타이밍을 찾습니다.';
  if (k === 'samjaeGyoUn') return '삼재와 10년 대운 교운기의 환절기 변곡점을 짚어 무리한 확장을 방비하고 체질을 개선합니다.';
  if (k === 'auspiciousStars') return '내 사주에 깃든 귀인과 길성망을 찾아내 위기 상황에서 나를 도울 조력자의 성향을 짚습니다.';
  if (k === 'geokguk') return '월지 정통 10대 격국을 규명해 사회적 성취의 그릇과 나에게 가장 유리한 커리어 궤도를 밝힙니다.';
  if (k === 'wealthPipeline') return '재성의 통근 여부와 식상 생재의 흐름을 분석해 안정적인 자산 파이프라인 구축을 돕습니다.';
  if (k === 'karmicNodes') return '노스노드와 사우스노드를 대조해 과거의 익숙한 집착을 넘어 영혼이 나아가야 할 진로를 비춥니다.';
  if (k === 'contractShield') return '문서운과 계약궁의 충극을 사전 검토해 불리한 조항이나 법적 분쟁의 씨앗을 방어합니다.';
  if (k === 'deepWorkFlow') return '수면 주기와 일주 기운에 맞춘 최적의 딥워크 시간대를 도출해 창작과 성과의 밀도를 극대화합니다.';
  if (k === 'ikigaiDestinyCompass') return '내가 잘하는 것과 세상이 원하는 것, 사주 적성이 만나는 인생의 참된 보람을 발굴합니다.';

  // 3. 역사적 철학·원형 엔진 매칭
  if (n.includes('니체')) return '운명을 긍정하는 아모르파티 철학으로 어떤 고난도 극복하는 결단의 힘을 부여합니다.';
  if (n.includes('마키아벨리')) return '비르투(역량)와 포르투나(기회)의 균형으로 냉철한 전략적 주도권을 잡습니다.';
  if (n.includes('융') || n.includes('그림자')) return '무의식의 그림자와 아니마·아니무스 원형을 탐색해 온전한 자기실현(개성화)을 이끕니다.';
  if (n.includes('정약용')) return '실사구시와 목민심서의 실천적 공직 윤리로 삶의 질서를 단단히 바로 세웁니다.';
  if (n.includes('류성룡') || n.includes('징비록')) return '징비록의 반성적 성찰을 통해 과거의 실패를 미래의 확실한 자산으로 바꿉니다.';
  if (n.includes('키르케고르')) return '단독자로서 주체적이고 실존적인 결단을 내리는 진정한 용기를 일깨웁니다.';
  if (n.includes('스피노자')) return '자연의 필연성과 내면의 코나투스(존재 역량)를 긍정하며 명징한 평정을 얻습니다.';
  if (n.includes('데카르트')) return '의심할 수 없는 명징한 사유로 복잡한 문제의 근본 핵심을 간결하게 꿰뚫습니다.';
  if (n.includes('칸트')) return '보편적 도덕 법칙과 순수 실천 이성으로 스스로에게 부끄러움 없는 확고한 원칙을 세웁니다.';
  if (n.includes('손자병법') || n.includes('손자')) return '싸우지 않고 이기는 부전승의 지혜와 지형·형세의 흐름을 읽는 전략을 제공합니다.';
  if (n.includes('헤겔')) return '모순과 갈등을 더 높은 차원으로 종합하는 변증법적 도약(지양)의 계기를 찾습니다.';
  if (n.includes('쇼펜하우어')) return '삶의 맹목적 의지와 번뇌를 직시하여 과도한 집착에서 벗어난 관조의 평온을 얻습니다.';
  if (n.includes('파스칼')) return '이성이 미처 알지 못하는 심장의 지혜로 삶의 실존적 확신을 되찾습니다.';
  if (n.includes('루미')) return '수피즘의 신성한 사랑과 시적 영감으로 메마른 영혼의 갈증을 포근하게 적십니다.';
  if (n.includes('추사') || n.includes('세한도')) return '세한도의 지혜처럼 험난한 겨울에도 변치 않는 진정한 가치와 인연을 가려냅니다.';
  if (n.includes('베이컨')) return '신기관의 실증적 관찰과 경험적 검증으로 낡은 편견을 깨고 혁신을 도모합니다.';
  if (n.includes('아퀴나스')) return '신앙과 이성의 조화로 가치 있는 것과 일시적인 것을 명확히 분별합니다.';
  if (n.includes('아우구스티누스')) return '고백록의 깊은 내적 조명을 통해 시간의 한계를 넘어 영원한 진리를 성찰합니다.';
  if (n.includes('용수') || n.includes('중론')) return '양극단의 집착을 내려놓고 공(空)과 중도의 시선으로 사태의 본모습을 봅니다.';
  if (n.includes('지눌')) return '단번에 본질을 깨닫고 꾸준히 닦아 나가는 정혜쌍수의 실천적 평정을 유지합니다.';
  if (n.includes('몽테뉴')) return '수상록의 유연한 인간 성찰로 타인의 시선에 얽매이지 않고 나다운 삶을 누립니다.';
  if (n.includes('원효')) return '원융회통의 열린 지혜로 모든 대립과 갈등을 한마음(일심) 안에서 조화롭게 화해시킵니다.';
  if (n.includes('최치원')) return '유불선 삼교를 아우르는 풍류도의 기운으로 동서양 지혜를 유연하게 융합합니다.';
  if (n.includes('피타고라스')) return '수의 비례와 천체의 조화로 내 삶의 리듬 속에 깃든 필연적 질서를 해독합니다.';
  if (n.includes('아카식')) return '모든 사건과 통찰이 보존된 우주적 지혜의 저장소에서 현재의 영적 실마리를 엽니다.';
  if (n.includes('풍수') || n.includes('8택')) return '머무는 공간의 방위와 에너지 흐름을 조율해 삶의 운기를 북돋웁니다.';
  if (n.includes('차크라') || n.includes('쿤달리니')) return '에너지 센터의 진동수를 정렬해 막힌 기운을 틔우고 생명력을 복원합니다.';
  if (n.includes('바이오리듬')) return '신체·감성·지성의 삼중 주기를 살펴 중요한 일의 타이밍을 최적화합니다.';

  // 기본 유니버설 템플릿
  return `${n}의 고유한 결정론적 관점을 통해 현재 질문을 새로운 각도에서 깊이 있게 조망합니다.`;
}

export const DuoCosmicAmbientRoom: React.FC<DuoCosmicAmbientRoomProps> = ({ isLight = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // BPM 리듬 설정 (기본 90 BPM)
  const [ambientTempoBpm, setAmbientTempoBpm] = useState<number>(90);
  // 🔮 246대 DCE 엔진 무조건 랜덤 셔플로 시작
  const [activeEngineIdx, setActiveEngineIdx] = useState<number>(() => {
    return Math.floor(Math.random() * ALL_DCE_ENGINES.length);
  });

  // 바이노럴 비트 합성기 상태
  const [isBinauralPlaying, setIsBinauralPlaying] = useState<boolean>(false);
  const synthRef = useRef<BinauralBeatSynthesizer | null>(null);

  // 🎵 음악 비트 탭 싱크 (애플뮤직 박자에 맞춰 화면 탭 시 템포 실측 동기화)
  const tapTimesRef = useRef<number[]>([]);
  const lastTapRippleRef = useRef<{ time: number } | null>(null);

  const handleTapSync = useCallback(() => {
    triggerHaptic('whitehole');
    const now = Date.now();
    lastTapRippleRef.current = { time: performance.now() };
    const times = tapTimesRef.current;
    times.push(now);
    if (times.length > 4) times.shift();

    if (times.length >= 2) {
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 250 && avgInterval < 2000) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        const clamped = Math.min(180, Math.max(50, calculatedBpm));
        setAmbientTempoBpm(clamped);
        if (synthRef.current?.getIsPlaying()) {
          synthRef.current.updateBpm(clamped);
        }
      }
    }
  }, []);

  useEffect(() => {
    synthRef.current = new BinauralBeatSynthesizer();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  // 무조건 랜덤 셔플 (10초 주기)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEngineIdx((prev) => {
        let next = Math.floor(Math.random() * ALL_DCE_ENGINES.length);
        if (next === prev && ALL_DCE_ENGINES.length > 1) {
          next = (next + 1) % ALL_DCE_ENGINES.length;
        }
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // BPM 변경 시 바이노럴 비트 주파수 연동
  const handleSelectBpm = useCallback((bpm: number) => {
    triggerHaptic('whitehole');
    setAmbientTempoBpm(bpm);
    if (synthRef.current?.getIsPlaying()) {
      synthRef.current.updateBpm(bpm);
    }
  }, []);

  // 바이노럴 비트 재생 / 정지 토글
  const handleToggleBinauralBeat = useCallback(() => {
    triggerHaptic('whitehole');
    const synth = synthRef.current;
    if (!synth) return;

    if (isBinauralPlaying) {
      synth.stop();
      setIsBinauralPlaying(false);
    } else {
      const ok = synth.start(ambientTempoBpm);
      if (ok) {
        setIsBinauralPlaying(true);
      }
    }
  }, [isBinauralPlaying, ambientTempoBpm]);

  // 🎵 외부 음악과 함께 클릭 시: iOS 애플뮤직 앱(music://) 바로 실행
  const handleOpenAppleMusic = useCallback(() => {
    triggerHaptic('whitehole');
    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        window.location.href = 'music://';
      } else {
        window.open('https://music.apple.com', '_blank', 'noopener,noreferrer');
      }
    } catch (_) {
      window.location.href = 'music://';
    }
  }, []);

  // 🎨 상단 [나의 리듬] 캔버스: 병원 심장박동(ECG 심전도) 초호화 네온 오실로스코프 모니터 렌더러
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 파티클 시스템 (R-Peak 발생 시 뿜어져 나오는 황금빛 스타더스트 불꽃)
    interface SparkleParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }
    const particles: SparkleParticle[] = [];
    let lastRPeakTrigger = 0;
    const rippleWaves: { x: number; y: number; r: number; alpha: number }[] = [];

    // ECG 파형 계산 함수 (0 ~ 1 주기 내 P-Q-R-S-T-U 파형 생성)
    const getEcgWaveY = (phase: number, rBoost: number): number => {
      const u = (phase % 1.0 + 1.0) % 1.0;
      let y = Math.sin(u * Math.PI * 32) * 0.6; // 생체 미세 떨림

      if (u >= 0.08 && u < 0.18) {
        // P-wave (심방 탈분극: 부드러운 언덕)
        const pPhase = (u - 0.08) / 0.10;
        y += Math.sin(pPhase * Math.PI) * 11;
      } else if (u >= 0.22 && u < 0.25) {
        // Q-wave (날카로운 하강)
        const qPhase = (u - 0.22) / 0.03;
        y -= Math.sin(qPhase * Math.PI) * 9;
      } else if (u >= 0.25 && u < 0.32) {
        // R-peak (심실 주 탈분극: 심장 박동의 최고점! 극도로 날카롭고 웅장한 수직 스파이크)
        const rPhase = (u - 0.25) / 0.07;
        const rHeight = 72 * rBoost;
        if (rPhase < 0.45) {
          y += (rPhase / 0.45) * rHeight;
        } else {
          y += (1 - (rPhase - 0.45) / 0.55) * rHeight;
        }
      } else if (u >= 0.32 && u < 0.38) {
        // S-wave (깊은 하강 파동)
        const sPhase = (u - 0.32) / 0.06;
        y -= Math.sin(sPhase * Math.PI) * 24;
      } else if (u >= 0.38 && u < 0.46) {
        // ST-segment: 미세한 온화한 회복선
        y += 2.2;
      } else if (u >= 0.46 && u < 0.66) {
        // T-wave (심실 재분극: 풍부하고 우아한 황금빛 돔)
        const tPhase = (u - 0.46) / 0.20;
        y += Math.sin(tPhase * Math.PI) * 20;
      } else if (u >= 0.66 && u < 0.73) {
        // U-wave (미세 잔류 파형)
        const uPhase = (u - 0.66) / 0.07;
        y += Math.sin(uPhase * Math.PI) * 4.5;
      }
      return y;
    };

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const baselineY = height * 0.55;

      ctx.clearRect(0, 0, width, height);

      // 1. 깊은 흑요석(Obsidian) 배경 + 방사형 앰버 오로라 글로우
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#06080e');
      bgGrad.addColorStop(0.5, '#0b0f19');
      bgGrad.addColorStop(1, '#06080e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const auraGrad = ctx.createRadialGradient(width / 2, baselineY, 10, width / 2, baselineY, width * 0.6);
      auraGrad.addColorStop(0, isBinauralPlaying ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.09)');
      auraGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. 고정밀 밀리미터 골든 메디컬 그리드 (병원 오실로스코프 눈금)
      ctx.save();
      const minorStep = 16;
      ctx.beginPath();
      for (let x = 0; x <= width; x += minorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += minorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.045)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      const majorStep = 48;
      ctx.beginPath();
      for (let x = 0; x <= width; x += majorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += majorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 그리드 교차점 미세 십자선 (+)
      for (let x = majorStep; x < width; x += majorStep) {
        for (let y = majorStep; y < height; y += majorStep) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. 심장박동 파형 (스위핑 레이저 오실로스코프)
      const freq = ambientTempoBpm / 60; // 초당 박동 수
      const cycleDuration = 1 / freq;    // 1회 심박 소요 시간 (초)
      const sweepSpeed = (width / 2.4) * freq;
      const headX = (elapsed * sweepSpeed) % width;

      // 🎵 음악 비트 킥드럼 어택 & 지수 감쇠
      const beatPhase = (elapsed * freq) % 1.0;
      const kickAttack = Math.exp(-beatPhase * 5.0);

      // 수동 탭 리플
      let tapRipple = 0;
      if (lastTapRippleRef.current) {
        const tapDelta = (now - lastTapRippleRef.current.time) / 1000;
        if (tapDelta < 1.0) {
          tapRipple = Math.sin(tapDelta * Math.PI) * (1 - tapDelta);
        }
      }

      const rBoost = 1.0 + kickAttack * 0.25 + tapRipple * 0.35 + (isBinauralPlaying ? 0.15 : 0);
      const eraseGap = 28; // 앞쪽 지우개 간격 (실제 병원 모니터의 스캔 지우개)

      // R-Peak 발화 감지: headX 위치에서의 파형이 정점에 도달했을 때 불꽃/리플 트리거
      const headCycleTime = (now / 1000);
      const currentCyclePhase = (headCycleTime / cycleDuration) % 1.0;
      if (currentCyclePhase >= 0.27 && currentCyclePhase <= 0.31) {
        if (now - lastRPeakTrigger > (cycleDuration * 800)) {
          lastRPeakTrigger = now;
          const peakY = baselineY - (72 * rBoost);
          // 뿜어져 나오는 황금빛 스타더스트 불꽃 12개 생성
          for (let p = 0; p < 12; p++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 20 + Math.random() * 60;
            particles.push({
              x: headX,
              y: peakY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 30,
              life: 0,
              maxLife: 0.6 + Math.random() * 0.4,
              size: 1.5 + Math.random() * 2.5,
              color: p % 3 === 0 ? '#fbbf24' : p % 3 === 1 ? '#34d399' : '#ffffff',
            });
          }
          // 동심원 쇼크웨이브
          rippleWaves.push({ x: headX, y: peakY, r: 0, alpha: 0.85 });
        }
      }

      // 점 배열 구축
      const points: { x: number; y: number; alpha: number }[] = [];
      const stepX = 2;
      for (let x = 0; x < width; x += stepX) {
        const distBehind = (headX - x + width) % width;
        if (distBehind < eraseGap && distBehind > 0) {
          continue; // 지우개 간격 통과
        }
        const persistence = Math.max(0.35, 1.0 - (distBehind / width) * 0.65);
        const timeOffset = (distBehind / sweepSpeed);
        const ptTime = elapsed - timeOffset;
        const phase = (ptTime / cycleDuration) % 1.0;
        const waveY = getEcgWaveY(phase, rBoost);
        points.push({ x, y: baselineY - waveY, alpha: persistence });
      }

      // 파형 언더필 그라디언트 (빛나는 오로라 워시)
      if (points.length > 2) {
        ctx.save();
        ctx.beginPath();
        let inSub = false;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const prev = points[i - 1];
          if (!prev || Math.abs(pt.x - prev.x) > stepX * 2) {
            if (inSub) {
              ctx.lineTo(prev.x, baselineY);
              ctx.closePath();
            }
            ctx.moveTo(pt.x, baselineY);
            ctx.lineTo(pt.x, pt.y);
            inSub = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        if (inSub && points.length > 0) {
          ctx.lineTo(points[points.length - 1].x, baselineY);
          ctx.closePath();
        }
        const fillGrad = ctx.createLinearGradient(0, baselineY - 80, 0, baselineY);
        fillGrad.addColorStop(0, isBinauralPlaying ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.14)');
        fillGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.06)');
        fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.restore();
      }

      // 4. 고광택 멀티 레이어 ECG 선 그리기
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const prev = points[i - 1];
        if (!prev || Math.abs(pt.x - prev.x) > stepX * 2) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = isBinauralPlaying ? 'rgba(251, 191, 36, 0.55)' : 'rgba(245, 158, 11, 0.40)';
      ctx.lineWidth = 4.5;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 14;
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.restore();

      // 5. 스캔 헤드 (Leading Sweep Head): 눈부신 코스믹 다이아몬드 스파크
      const headWaveY = getEcgWaveY((elapsed / cycleDuration) % 1.0, rBoost);
      const headPosY = baselineY - headWaveY;

      // 수직 레이저 스캔 가이드 빔
      const scanBeamGrad = ctx.createLinearGradient(0, 0, 0, height);
      scanBeamGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
      scanBeamGrad.addColorStop(Math.max(0, (headPosY - 25) / height), 'rgba(245, 158, 11, 0.08)');
      scanBeamGrad.addColorStop(headPosY / height, 'rgba(255, 255, 255, 0.35)');
      scanBeamGrad.addColorStop(Math.min(1, (headPosY + 25) / height), 'rgba(245, 158, 11, 0.08)');
      scanBeamGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = scanBeamGrad;
      ctx.fillRect(headX - 1, 0, 2, height);

      // 스캔 헤드 발광 오브
      ctx.save();
      const sparkGlow = ctx.createRadialGradient(headX, headPosY, 0, headX, headPosY, 16);
      sparkGlow.addColorStop(0, '#ffffff');
      sparkGlow.addColorStop(0.3, '#fde68a');
      sparkGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.4)');
      sparkGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sparkGlow;
      ctx.beginPath();
      ctx.arc(headX, headPosY, 16, 0, Math.PI * 2);
      ctx.fill();

      // 백열 핵
      ctx.beginPath();
      ctx.arc(headX, headPosY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // 6. 스타더스트 불꽃 파티클 렌더링 & 업데이트
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 0.016;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
        p.vy += 25 * 0.016;
        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * (1 - progress * 0.5)), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // 7. R-Peak 쇼크웨이브 동심원 링
      for (let i = rippleWaves.length - 1; i >= 0; i--) {
        const rw = rippleWaves[i];
        rw.r += 45 * 0.016;
        rw.alpha -= 1.2 * 0.016;
        if (rw.alpha <= 0) {
          rippleWaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rw.x, rw.y, rw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${rw.alpha * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 8. 럭셔리 메디컬 텔레메트리 HUD 텍스트 (Hospital ECG Monitor Information)
      ctx.save();
      const currentCyclePhaseNow = ((now / 1000) / cycleDuration) % 1.0;
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "JetBrains Mono", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
      ctx.fillText(`♥ ${ambientTempoBpm} BPM`, 14, 22);

      ctx.font = '600 8.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.65)';
      ctx.shadowBlur = 0;
      ctx.fillText('LEAD II · ECG HARMONICS', 14, 34);

      ctx.textAlign = 'right';
      ctx.font = '600 9px -apple-system, "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.fillText('528Hz SYNC · OPTIMAL', width - 14, 22);

      ctx.font = '600 8.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowBlur = 0;
      ctx.fillText('QTc: 412ms · HRV: 68', width - 14, 34);

      ctx.font = '500 8px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.fillText('TAP TO SYNC BPM', width - 14, height - 10);
      ctx.restore();

      if (!reducedMotion) animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ambientTempoBpm, isBinauralPlaying]);

  const currentEngine = ALL_DCE_ENGINES[activeEngineIdx] || ALL_DCE_ENGINES[0];
  const currentSummary = getEngineShortSummary(currentEngine);

  return (
    <section className={'cosmic-room ' + (isLight ? 'cosmic-room--light' : '')} aria-label="코스믹 룸">
      {/* 1️⃣ 상단 카드: 나의 리듬 (제목·설명 제외 순수 비주얼 파동 캔버스) */}
      <div className="cosmic-room-visual cosmic-room-card">
        {/* 상단 라벨 */}
        <div className="cosmic-room-visual-heading">
          <span className="cosmic-room-live"><i aria-hidden="true" /> 나의 리듬</span>
          <button
            type="button"
            onClick={handleOpenAppleMusic}
            className="cosmic-room-music-btn"
            title="애플뮤직(Apple Music) 앱 열기"
          >
            <Music size={12} />
            <span>외부 음악과 함께</span>
          </button>
        </div>

        {/* 중앙: 병원 심장박동 ECG 심전도 오실로스코프 모니터 (초호화 코스믹 네온) */}
        <div
          className="cosmic-room-stage cursor-pointer active:scale-[0.99] transition-transform"
          onClick={handleTapSync}
          title="재생 중인 음악 박자에 맞춰 2번 이상 탭하면 심장박동 BPM이 동기화됩니다"
        >
          <canvas ref={canvasRef} width={440} height={190} aria-hidden="true" />
        </div>
      </div>

      {/* 2️⃣ 중간 카드: 새로운 관점 (무조건 랜덤 셔플 표출 & 셔플 버튼 제거) */}
      <section
        className="cosmic-room-engine cosmic-room-card"
        aria-label="운명학 관점 소개"
      >
        <div className="cosmic-room-card-heading">
          <span><Sparkles size={13} /> 새로운 관점</span>
        </div>
        <h3>{currentEngine?.nameKo || '나를 알아가는 시간'}</h3>
        <p>{currentSummary}</p>
      </section>

      {/* 3️⃣ 하단 카드: 비주얼 리듬 (BPM + 바이노럴 비트 재생/정지 버튼 + 프리셋 3종) */}
      <section className="cosmic-room-tempo cosmic-room-card" aria-label="비주얼 리듬 설정">
        <div className="cosmic-room-tempo-heading">
          <div>
            <span className="cosmic-room-card-heading"><Activity size={13} /> 비주얼 리듬</span>
            <p><strong>{ambientTempoBpm}</strong><span>BPM</span></p>
          </div>

          {/* 바이노럴 비트 재생/정지 버튼 */}
          <button
            type="button"
            onClick={handleToggleBinauralBeat}
            className={`cosmic-room-binaural-btn ${isBinauralPlaying ? 'is-active' : ''}`}
            title={`${ambientTempoBpm} BPM에 조율된 바이노럴 비트 (${BinauralBeatSynthesizer.getBeatFreq(ambientTempoBpm).waveLabel}) 재생`}
          >
            {isBinauralPlaying ? (
              <>
                <Volume2 size={13} className="animate-pulse" />
                <span>비트 정지</span>
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" />
                <span>바이노럴 비트</span>
              </>
            )}
          </button>
        </div>

        {/* BPM 프리셋 칩 (명상 60 / 편안하게 90 / 집중 120) */}
        <div className="cosmic-room-presets" role="group" aria-label="리듬 프리셋">
          {[
            { bpm: 60, label: '명상' },
            { bpm: 90, label: '편안하게' },
            { bpm: 120, label: '집중' },
          ].map(({ bpm, label }) => (
            <button
              key={bpm}
              type="button"
              aria-pressed={ambientTempoBpm === bpm}
              onClick={() => handleSelectBpm(bpm)}
            >
              <span>{label}</span>
              <small>{bpm}</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
};
