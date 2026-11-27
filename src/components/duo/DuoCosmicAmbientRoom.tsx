import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Music, Activity, Headphones, Pause, Play } from 'lucide-react';
import './duo-cosmic-room.css';
import { PageGuideButton } from '@/components/guide/PageGuide';
import { SmartGuideSettingsButton } from '@/components/guide/SmartGuideSettings';
import { getPageGuide } from '@/lib/pageGuides';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '@/lib/divination/deterministicEngine';
import { LUCY_PRO_CATALOG_DUPLICATE_KEYS } from '@/lib/divination/catalogDuplicateKeys';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { getVisualRhythmBeatConfig, VisualRhythmBinauralPlayer } from '@/lib/visualRhythmBinaural';

interface DuoCosmicAmbientRoomProps {
  isLight?: boolean;
}

const VISIBLE_DCE_ENGINES = ALL_DCE_ENGINES.filter(engine =>
  !LUCY_PRO_CATALOG_DUPLICATE_KEYS.has(engine.key),
);

// 📖 표시 카탈로그 엔진별 핵심 통찰 및 요약 설명 생성기
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
  const binauralPlayerRef = useRef<VisualRhythmBinauralPlayer | null>(null);
  if (!binauralPlayerRef.current) binauralPlayerRef.current = new VisualRhythmBinauralPlayer();

  // BPM 리듬 설정 (기본 90 BPM)
  const [ambientTempoBpm, setAmbientTempoBpm] = useState<number>(90);
  const [isBinauralPlaying, setIsBinauralPlaying] = useState(false);
  // 🔮 사용자 표시 카탈로그 엔진 중 무작위로 시작
  const [activeEngineIdx, setActiveEngineIdx] = useState<number>(() => {
    return Math.floor(Math.random() * VISIBLE_DCE_ENGINES.length);
  });

  // 🎵 음악 비트 탭 싱크 (애플뮤직 박자에 맞춰 화면 탭 시 템포 실측 동기화)
  const tapTimesRef = useRef<number[]>([]);
  const lastTapRippleRef = useRef<{ time: number } | null>(null);

  useEffect(() => () => {
    binauralPlayerRef.current?.stop();
  }, []);

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
        binauralPlayerRef.current?.updateBpm(clamped);
      }
    }
  }, []);

  // 무조건 랜덤 셔플 (10초 주기)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEngineIdx((prev) => {
        let next = Math.floor(Math.random() * VISIBLE_DCE_ENGINES.length);
        if (next === prev && VISIBLE_DCE_ENGINES.length > 1) {
          next = (next + 1) % VISIBLE_DCE_ENGINES.length;
        }
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // BPM 변경: 시각 리듬과 탭 동기화에만 사용
  const handleSelectBpm = useCallback((bpm: number) => {
    triggerHaptic('whitehole');
    setAmbientTempoBpm(bpm);
    binauralPlayerRef.current?.updateBpm(bpm);
  }, []);

  const handleToggleBinauralBeat = useCallback(() => {
    triggerHaptic('whitehole');
    if (isBinauralPlaying) {
      binauralPlayerRef.current?.stop();
      setIsBinauralPlaying(false);
      return;
    }
    setIsBinauralPlaying(binauralPlayerRef.current?.start(ambientTempoBpm) ?? false);
  }, [ambientTempoBpm, isBinauralPlaying]);

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

  // 🎨 상단 [나의 리듬] 캔버스: 신비롭고 몽환적인 심우주 오로라 & 리듬 파동 (Celestial Starlight Nebula & Dreamy Pulse)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 🌟 몽환적인 유영 별빛 & 반딧불이 성운 가루 (36개 별빛 정령)
    interface DreamyStardust {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      phase: number;
      color: string;
      baseAlpha: number;
    }
    const updateCanvasSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor((rect.width || 440) * dpr);
      const h = Math.floor((rect.height || 210) * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    const motes: DreamyStardust[] = [];
    const colors = [
      '#fde68a', // starlight yellow
      '#c084fc', // mystical purple
      '#6ee7b7', // aurora mint
      '#f472b6', // dreamy rose
      '#ffffff', // diamond white
    ];
    for (let i = 0; i < 48; i++) {
      motes.push({
        x: Math.random() * (canvas.width || 440),
        y: Math.random() * (canvas.height || 210),
        size: 0.8 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 12,
        speedY: -4 - Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        baseAlpha: 0.25 + Math.random() * 0.55,
      });
    }

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const cy = height * 0.52;

      ctx.clearRect(0, 0, width, height);

      // 1. 심우주 벨벳 성운 배경 (Deep Velvet Cosmic Space)
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#050713');
      bg.addColorStop(0.5, '#0b0c1e');
      bg.addColorStop(1, '#070512');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 템포 주파수 (BPM -> Hz)
      const freq = ambientTempoBpm / 60;
      // 🎵 심장박동 & 음악 비트 펄스 (부드러운 유기적 호흡)
      const beatCycle = (elapsed * freq) % 1.0;
      const beatBreath = Math.exp(-beatCycle * 3.5);
      const beatSwell = Math.sin(elapsed * Math.PI * 2 * freq) * 0.25 + beatBreath * 0.75;

      // 2. 신비로운 다중 오로라 성운 발광 워시 (Dreamy Nebula Aurora Glow)
      // 중앙 좌측: 황금빛 성운
      const goldNebula = ctx.createRadialGradient(
        width * 0.35 + Math.sin(elapsed * 0.4) * 30,
        cy + Math.cos(elapsed * 0.5) * 20,
        10,
        width * 0.35,
        cy,
        width * 0.45
      );
      goldNebula.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      goldNebula.addColorStop(0.6, 'rgba(245, 158, 11, 0.03)');
      goldNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = goldNebula;
      ctx.fillRect(0, 0, width, height);

      // 중앙 우측: 자수정빛 황혼 성운 (Amethyst Twilight Nebula)
      const purpleNebula = ctx.createRadialGradient(
        width * 0.68 + Math.cos(elapsed * 0.35) * 30,
        cy + Math.sin(elapsed * 0.45) * 20,
        15,
        width * 0.68,
        cy,
        width * 0.50
      );
      purpleNebula.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
      purpleNebula.addColorStop(0.55, 'rgba(52, 211, 153, 0.05)');
      purpleNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = purpleNebula;
      ctx.fillRect(0, 0, width, height);

      // 3. 신성기하학 달빛 헤일로 (Moonlight Resonance Rings)
      ctx.save();
      const haloR = 48 * (1 + beatSwell * 0.08);
      ctx.beginPath();
      ctx.arc(width / 2, cy, haloR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.12 + beatSwell * 0.12})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, cy, haloR * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 + beatSwell * 0.06})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 12]);
      ctx.stroke();
      ctx.restore();

      // 4. 은하수의 결 · 몽환적인 3중 실크 오로라 리본 파동 (Silk Starlight Waves)
      const segments = 90;
      const stepX = width / segments;

      const getWaveY = (x: number, layer: number): number => {
        const nx = x / width;
        const wave1 = Math.sin(nx * Math.PI * 3.2 - elapsed * 2.2 + layer * 1.2) * (14 + beatSwell * 10);
        const wave2 = Math.cos(nx * Math.PI * 5.6 + elapsed * 1.6 - layer * 0.8) * (8 + beatSwell * 5);
        const centerDist = Math.abs(nx - 0.5);
        const centerHeart = Math.exp(-centerDist * centerDist * 18) * (26 * beatSwell);
        const flutter = Math.sin(nx * 18 + elapsed * 3.5 + layer) * 2.5;

        return wave1 + wave2 + (layer === 1 ? centerHeart : -centerHeart * 0.4) + flutter;
      };

      // [리본 A] 자수정 섀도우 리본 (Amethyst Aurora Base)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i <= segments; i++) {
        const x = i * stepX;
        const y = cy - getWaveY(x, 0);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const ribAGrad = ctx.createLinearGradient(0, cy - 35, 0, height);
      ribAGrad.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
      ribAGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
      ribAGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ribAGrad;
      ctx.fill();

      // [리본 B] 에메랄드 오로라 언더필 (Emerald Aurora Silk)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i <= segments; i++) {
        const x = i * stepX;
        const y = cy - getWaveY(x, 2);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const ribBGrad = ctx.createLinearGradient(0, cy - 30, 0, height);
      ribBGrad.addColorStop(0, 'rgba(52, 211, 153, 0.18)');
      ribBGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.05)');
      ribBGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ribBGrad;
      ctx.fill();
      ctx.restore();

      // [파동 선 1] 에메랄드 실크 윤곽선
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = i * stepX;
        const y = cy - getWaveY(x, 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // [파동 선 2] 자수정 오로라 윤곽선
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = i * stepX;
        const y = cy - getWaveY(x, 0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // [파동 선 3: 황금빛 주 리듬 스트림] 찬란하게 빛나는 골든 스타더스트 리본
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = i * stepX;
        const y = cy - getWaveY(x, 1);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.70)';
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // [파동 선 4: 백열 순백 코어 필라멘트]
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      // 5. 몽환적인 유영 별빛 정령 & 반딧불이 성운 가루 (Dreamy Firefly Motes)
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.speedX * 0.016;
        m.y += m.speedY * 0.016;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        const pulseAlpha = Math.sin(elapsed * 2.5 + m.phase) * 0.35 + 0.65;
        const currentAlpha = m.baseAlpha * pulseAlpha * (1 + beatSwell * 0.4);

        ctx.save();
        ctx.beginPath();
        const r = Math.max(0.6, m.size * (1 + beatSwell * 0.3));
        ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = Math.min(1, currentAlpha);
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 6. 탭 파문 (Golden Starlight Water Ripples)
      if (lastTapRippleRef.current) {
        const tapDelta = (now - lastTapRippleRef.current.time) / 1000;
        if (tapDelta < 1.4) {
          const ripProgress = tapDelta / 1.4;
          const ripR = ripProgress * 130;
          const ripAlpha = (1 - ripProgress) * 0.65;

          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, cy, ripR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(251, 191, 36, ${ripAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 7. 은은하고 신비로운 캡션 텍스트 (좌측 상단 BPM 앰비언트)
      ctx.save();
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
      ctx.fillText(`✦ ${ambientTempoBpm} BPM`, 16, 24);

      ctx.font = '400 8.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.50)';
      ctx.shadowBlur = 0;
      ctx.fillText('COSMIC RESONANCE', 16, 36);

      ctx.textAlign = 'right';
      ctx.font = '400 8.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.shadowBlur = 0;
      ctx.fillText('TAP TO SYNC', width - 16, 36);
      ctx.restore();

      if (!reducedMotion) animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [ambientTempoBpm]);

  const currentEngine = VISIBLE_DCE_ENGINES[activeEngineIdx] || VISIBLE_DCE_ENGINES[0];
  const currentSummary = getEngineShortSummary(currentEngine);
  const binauralConfig = getVisualRhythmBeatConfig(ambientTempoBpm);

  return (
    <div className="cosmic-room-shell flex h-full min-h-0 w-full flex-col">
    <CosmicRoomHeader isLight={isLight} />
    <section className={'cosmic-room ' + (isLight ? 'cosmic-room--light' : '')} aria-label="코스믹 룸" style={{ height: 'auto', flex: '1 1 0%', minHeight: 0 }}>
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

      {/* 3️⃣ 하단 카드: 비주얼 리듬 (BPM + 프리셋 3종) */}
      <section className="cosmic-room-tempo cosmic-room-card" aria-label="비주얼 리듬 설정">
        <div className="cosmic-room-tempo-heading">
          <div>
            <span className="cosmic-room-card-heading"><Activity size={13} /> 비주얼 리듬</span>
            <p><strong>{ambientTempoBpm}</strong><span>BPM</span></p>
          </div>
          <button
            type="button"
            aria-pressed={isBinauralPlaying}
            onClick={handleToggleBinauralBeat}
            className={`cosmic-room-binaural-btn${isBinauralPlaying ? ' is-active' : ''}`}
            title={`${isBinauralPlaying ? '바이노럴 비트 끄기' : '바이노럴 비트 켜기'} · ${binauralConfig.waveLabel} 좌우 차이 · 스테레오 헤드폰 권장`}
          >
            {isBinauralPlaying ? <Pause size={12} /> : <Play size={12} />}
            <Headphones size={13} />
            <span>{isBinauralPlaying ? '비트 정지' : '바이노럴 비트'}</span>
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
    </div>
  );
};


/**
 * 🌌 코스믹 룸 / 코스믹 프로(점술모드 테이블) 헤더. 오른쪽 루시 헤더와 높이·배경·아래 선 색을 그대로 맞춰
 * 두 화면의 경계선이 한 줄로 이어지게 한다 (루시 헤더 크기·테마가 바뀌면 따라간다).
 */
export function CosmicRoomHeader({ isLight, title = 'Cosmic Room', guideId = 'cosmic' }: { isLight: boolean; title?: string; guideId?: string }) {
  const [look, setLook] = useState<{ height: number; background: string; border: string } | null>(null);
  useEffect(() => {
    let frame = 0;
    let observed: Element | null = null;
    let resize: ResizeObserver | null = null;
    let mutation: MutationObserver | null = null;
    const read = () => {
      const header = document.querySelector('#duo-lucy-viewport .lucy-chat-header');
      if (!header) return;
      if (header !== observed) {
        resize?.disconnect();
        mutation?.disconnect();
        observed = header;
        if (typeof ResizeObserver !== 'undefined') {
          resize = new ResizeObserver(schedule);
          resize.observe(header);
        }
        mutation = new MutationObserver(schedule);
        mutation.observe(header, { attributes: true, attributeFilter: ['class', 'style'] });
      }
      const style = getComputedStyle(header);
      const rect = header.getBoundingClientRect();
      setLook((prev) => {
        const next = { height: Math.round(rect.height), background: style.backgroundColor, border: style.borderBottomColor };
        return prev && prev.height === next.height && prev.background === next.background && prev.border === next.border ? prev : next;
      });
    };
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    }
    read();
    // 루시 헤더가 늦게 생기거나 테마(아침·밤)가 바뀌는 경우
    const timer = window.setInterval(read, 1500);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener('resize', schedule);
      resize?.disconnect();
      mutation?.disconnect();
    };
  }, [isLight]);

  return (
    <header
      data-cosmic-room-header
      className={`cosmic-room-header flex shrink-0 items-center justify-between gap-2 border-b px-3 backdrop-blur-xl ${isLight ? 'text-slate-900' : 'text-white'}`}
      style={{
        height: look?.height || 58,
        minHeight: look?.height || 58,
        background: look?.background || (isLight ? 'rgba(255,255,255,0.85)' : 'rgba(2,6,23,0.85)'),
        borderBottomColor: look?.border || (isLight ? 'rgba(253,230,138,0.6)' : 'rgba(245,158,11,0.3)'),
      }}
    >
      <h2 className="min-w-0 truncate text-base sm:text-xl font-black tracking-tight">{title}</h2>
      <div className="flex shrink-0 items-center gap-1.5">
        <PageGuideButton guide={getPageGuide(guideId)} tone={isLight ? 'light' : 'dark'} />
        {/* 🧭 스마트 가이드 설정 (물음표) — 코스믹 룸 헤더 */}
        <SmartGuideSettingsButton tone={isLight ? 'light' : 'dark'} />
      </div>
    </header>
  );
}
