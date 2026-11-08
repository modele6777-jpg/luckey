import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Music, Activity, Compass } from 'lucide-react';
import './duo-cosmic-room.css';
import { ALL_DCE_ENGINES } from '@/lib/divination/deterministicEngine';
import { getBgmPublicState, type BgmPublicState } from '@/components/trinity/BgMusicPlayer';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

interface DuoCosmicAmbientRoomProps {
  isLight?: boolean;
}

export const DuoCosmicAmbientRoom: React.FC<DuoCosmicAmbientRoomProps> = ({ isLight = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgmState, setBgmState] = useState<BgmPublicState>(() => getBgmPublicState());

  // 외부 음악(멜론/애플뮤직) 앰비언트 펄스 설정
  const [ambientTempoBpm, setAmbientTempoBpm] = useState<number>(90); // 기본 90 BPM
  const [activeEngineIdx, setActiveEngineIdx] = useState<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  // BGM 상태 실시간 수신
  useEffect(() => {
    const handleBgmStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<BgmPublicState>;
      if (customEvent.detail) {
        setBgmState(customEvent.detail);
      }
    };
    window.addEventListener('prism:bgm_state_change', handleBgmStateChange);
    window.dispatchEvent(new CustomEvent('prism:request_bgm_state'));
    return () => {
      window.removeEventListener('prism:bgm_state_change', handleBgmStateChange);
    };
  }, []);

  // 246대 DCE 엔진 텔레메트리 티커 (3초마다 순환)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEngineIdx((prev) => (prev + 1) % ALL_DCE_ENGINES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // 탭 템포: 음악 박자에 맞춰 탭하면 템포 자동 동기화
  const handleTapTempo = useCallback(() => {
    triggerHaptic('whitehole');
    const now = Date.now();
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
        setAmbientTempoBpm(Math.min(180, Math.max(50, calculatedBpm)));
      }
    }
  }, []);

  // 캔버스 앰비언트 펄스 & 만다라 렌더러
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 템포 주파수 계산 (BPM -> Hz)
      const freq = ambientTempoBpm / 60;
      const pulse = Math.sin(elapsed * Math.PI * 2 * freq);
      const secondaryPulse = Math.cos(elapsed * Math.PI * freq * 0.5);
      const radius = Math.min(width, height) * 0.32 * (1 + pulse * 0.08);

      // 1. 코스믹 배경 오로라 방사광
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.6);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      grad.addColorStop(0.4, 'rgba(139, 92, 246, 0.12)');
      grad.addColorStop(0.8, 'rgba(16, 185, 129, 0.05)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. 신성기하학 만다라 링
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.15);

      const rings = 5;
      for (let r = 0; r < rings; r++) {
        const ringR = (radius / rings) * (r + 1) * (1 + secondaryPulse * 0.04);
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = r % 2 === 0 
          ? `rgba(245, 158, 11, ${0.15 + (pulse + 1) * 0.1})` 
          : `rgba(99, 102, 241, ${0.12 + (secondaryPulse + 1) * 0.08})`;
        ctx.lineWidth = 1 + (r === rings - 1 ? 1.5 : 0.5);
        ctx.stroke();
      }

      // 3. 12방위 천체 노드 파티클
      const nodes = 12;
      for (let i = 0; i < nodes; i++) {
        const angle = (i * Math.PI * 2) / nodes;
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(nx, ny, 3 + (pulse + 1) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#8b5cf6' : '#10b981';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. 리듬 사운드웨이브 궤도선
      const wavePoints = 64;
      ctx.beginPath();
      for (let p = 0; p <= wavePoints; p++) {
        const theta = (p / wavePoints) * Math.PI * 2;
        const waveOffset = Math.sin(theta * 6 + elapsed * 3) * (6 + pulse * 8);
        const wr = radius * 0.65 + waveOffset;
        const wx = Math.cos(theta) * wr;
        const wy = Math.sin(theta) * wr;
        if (p === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();

      if (!reducedMotion) animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ambientTempoBpm]);

  const currentEngine = ALL_DCE_ENGINES[activeEngineIdx] || ALL_DCE_ENGINES[0];

  return (
    <section className={'cosmic-room ' + (isLight ? 'cosmic-room--light' : '')} aria-label="코스믹 룸">
      <header className="cosmic-room-heading">
        <span className="cosmic-room-eyebrow"><Compass size={13} /> LUCY + · COSMIC ROOM</span>
        <h2>나만의 코스믹 룸</h2>
        <p>음악에 맞춰 잠시, 마음을 고요하게.</p>
      </header>
      <div className="cosmic-room-visual cosmic-room-card">
        <div className="cosmic-room-visual-heading">
          <span className="cosmic-room-live"><i aria-hidden="true" /> 나의 리듬</span>
          <span className="cosmic-room-music"><Music size={12} /> {bgmState.isPlaying ? 'BGM 감상 중' : '외부 음악과 함께'}</span>
        </div>
        <div className="cosmic-room-stage">
          <canvas ref={canvasRef} width={420} height={320} aria-hidden="true" />
          <span className="cosmic-room-stage-label">BREATHE<br /><strong>& FLOW</strong></span>
        </div>
        <p className="cosmic-room-caption">나의 속도로, 천천히.</p>
        <p className="cosmic-room-note">듣고 있는 음악은 그대로 이어져요.</p>
      </div>
      <section className="cosmic-room-engine cosmic-room-card" aria-label="운명학 관점 소개">
        <div className="cosmic-room-card-heading">
          <span><Sparkles size={13} /> 새로운 관점</span>
          <span className="cosmic-room-count">{activeEngineIdx + 1} / {ALL_DCE_ENGINES.length}</span>
        </div>
        <h3>{currentEngine?.nameKo || '나를 알아가는 시간'}</h3>
        <p>지금의 질문을 조금 다른 각도에서 바라보세요.</p>
      </section>
      <section className="cosmic-room-tempo cosmic-room-card" aria-label="비주얼 리듬 설정">
        <div className="cosmic-room-tempo-heading">
          <div><span className="cosmic-room-card-heading"><Activity size={13} /> 비주얼 리듬</span><p><strong>{ambientTempoBpm}</strong><span>BPM</span></p></div>
          <button type="button" onClick={handleTapTempo} className="cosmic-room-tap" title="듣고 있는 음악 박자에 맞춰 두 번 이상 눌러주세요">박자 맞추기</button>
        </div>
        <div className="cosmic-room-presets" role="group" aria-label="리듬 프리셋">
          {[{ bpm: 60, label: '명상' }, { bpm: 90, label: '편안하게' }, { bpm: 120, label: '집중' }].map(({ bpm, label }) => (
            <button key={bpm} type="button" aria-pressed={ambientTempoBpm === bpm} onClick={() => { triggerHaptic('whitehole'); setAmbientTempoBpm(bpm); }}><span>{label}</span><small>{bpm}</small></button>
          ))}
        </div>
      </section>
    </section>
  );
};
