import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Music, Sliders, Play, Pause, Activity, Zap, Compass } from 'lucide-react';
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
  const [visualMode, setVisualMode] = useState<'mandala' | 'wave' | 'galaxy'>('mandala');
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
    }, 2800);
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
    let startTime = performance.now();

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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ambientTempoBpm, visualMode]);

  const currentEngine = ALL_DCE_ENGINES[activeEngineIdx] || ALL_DCE_ENGINES[0];

  return (
    <div className={`h-full w-full flex flex-col justify-between select-none p-3.5 sm:p-5 transition-colors duration-500 relative overflow-hidden ${
      isLight ? 'bg-gradient-to-br from-slate-100 via-amber-50/40 to-slate-200 text-slate-800' : 'bg-slate-950 text-white'
    }`}>
      {/* 배경 앰비언트 캔버스 */}
      <canvas
        ref={canvasRef}
        width={420}
        height={320}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
      />

      {/* 상단: 상태 배지 및 외부 음악 모드 알림 */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-amber-500/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Compass size={16} className="animate-spin-slow" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-black tracking-tight text-amber-300">
                마스터 코스믹 룸
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                246대 풀가동
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              외부 음악 믹싱 보존 · 앰비언트 펄스 비주얼라이저
            </p>
          </div>
        </div>

        {/* 오디오 모드 뱃지 */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-[10px] font-semibold text-amber-300 shadow-xs">
          <Music size={12} className="animate-bounce" />
          <span>{bgmState.isPlaying ? '내장 BGM 반응' : '외부 음악 감상 모드'}</span>
        </div>
      </div>

      {/* 중앙: 실시간 가동 중인 246대 DCE 엔진 텔레메트리 */}
      <div className="relative z-10 my-auto text-center py-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-400/30 text-xs font-bold text-amber-200 mb-2 shadow-lg backdrop-blur-md">
          <Zap size={13} className="text-amber-400 animate-pulse" />
          <span>DCE #{activeEngineIdx + 1} · {currentEngine?.nameKo || '심층 운명학 엔진'}</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed drop-shadow-sm font-medium">
          {currentEngine?.description || '전체 246개 결정론·운명학 엔진이 우측 루시 대화창에 실시간 주입되고 있습니다.'}
        </p>
      </div>

      {/* 하단: 템포 조절 바 및 탭 템포 버튼 (외부 음악 맞춤 박자) */}
      <div className="relative z-10 pt-3 border-t border-white/10 shrink-0 bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
            <Activity size={13} className="text-amber-400" />
            <span>비주얼 펄스 템포</span>
            <span className="text-amber-400 font-mono">({ambientTempoBpm} BPM)</span>
          </span>

          {/* 탭 템포 버튼 */}
          <button
            type="button"
            onClick={handleTapTempo}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="듣고 계신 멜론/애플뮤직 비트에 맞춰 탭하면 템포가 싱크됩니다"
          >
            👆 비트 탭 싱크 (Tap)
          </button>
        </div>

        {/* 프리셋 템포 칩 */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => { triggerHaptic('whitehole'); setAmbientTempoBpm(60); }}
            className={`py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              ambientTempoBpm === 60 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800/80 text-slate-300 border-white/10'
            }`}
          >
            🧘 명상 60
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic('whitehole'); setAmbientTempoBpm(90); }}
            className={`py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              ambientTempoBpm === 90 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800/80 text-slate-300 border-white/10'
            }`}
          >
            ☕ 팝 90
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic('whitehole'); setAmbientTempoBpm(120); }}
            className={`py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
              ambientTempoBpm === 120 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800/80 text-slate-300 border-white/10'
            }`}
          >
            ⚡ 비트 120
          </button>
        </div>
      </div>
    </div>
  );
};
