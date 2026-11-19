import React from 'react';
import './lucy-master-tarot-room.css';

/**
 * 🔮 루시 마스터(점술모드) 대화 배경.
 * 보라빛 벨벳 타로 테이블 + 흔들리는 양초 + 은은한 연기·먼지 — 대화에 집중할 수 있게 어둡고 차분하게.
 * 모든 요소는 장식이며 포인터 이벤트를 받지 않는다.
 */
const CANDLES: { left: string; height: number; delay: string; scale: number }[] = [
  { left: '6%', height: 74, delay: '0s', scale: 1 },
  { left: '13%', height: 48, delay: '-1.3s', scale: 0.82 },
  { left: '84%', height: 58, delay: '-0.6s', scale: 0.9 },
  { left: '92%', height: 86, delay: '-2.1s', scale: 1.05 },
];

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${-(i * 1.7)}s`,
  duration: `${14 + (i % 5) * 3}s`,
}));


function DreamCatcher() {
  // 고리 + 거미줄 + 가운데 구슬 + 깃털 3개 (깃털은 바람에 살랑)
  const web: string[] = [];
  const R = 34;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return [50 + Math.cos(a) * R, 46 + Math.sin(a) * R];
  });
  const inner = pts.map(([x, y]) => [50 + (x - 50) * 0.55, 46 + (y - 46) * 0.55]);
  const core = pts.map(([x, y]) => [50 + (x - 50) * 0.22, 46 + (y - 46) * 0.22]);
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    web.push(`M${pts[i][0]},${pts[i][1]} L${inner[n][0]},${inner[n][1]}`);
    web.push(`M${inner[i][0]},${inner[i][1]} L${core[n][0]},${core[n][1]}`);
  }
  return (
    <svg className="lmr-dreamcatcher" viewBox="0 0 100 190" overflow="visible" aria-hidden="true">
      <line x1="50" y1="-400" x2="50" y2="10" stroke="#c9a46a" strokeOpacity=".6" strokeWidth=".8" />
      <circle cx="50" cy="46" r="36" fill="none" stroke="#c9a46a" strokeWidth="3" />
      <circle cx="50" cy="46" r="36" fill="none" stroke="#7a4fa8" strokeWidth="1" strokeDasharray="2 3" />
      <path d={web.join(' ')} stroke="#e6d3ff" strokeOpacity=".55" strokeWidth=".7" fill="none" />
      <polygon points={inner.map(p => p.join(',')).join(' ')} fill="none" stroke="#e6d3ff" strokeOpacity=".4" strokeWidth=".6" />
      <circle cx="50" cy="46" r="3.2" fill="#b98cff" />
      {[28, 50, 72].map((x, i) => (
        <g key={x} className="lmr-feather" style={{ transformOrigin: `${x}px ${i === 1 ? 82 : 76}px`, animationDelay: `${-i * 0.9}s` }}>
          <line x1={x} y1={i === 1 ? 82 : 76} x2={x} y2={i === 1 ? 108 : 98} stroke="#c9a46a" strokeWidth=".8" />
          <circle cx={x} cy={i === 1 ? 108 : 98} r="2.2" fill={i === 1 ? '#e6c46a' : '#8a5cc9'} />
          <path
            d={`M${x},${(i === 1 ? 110 : 100)} q-7,18 0,${i === 1 ? 52 : 42} q7,-24 0,-${i === 1 ? 52 : 42}z`}
            fill={i === 1 ? '#efe4ff' : '#cdb4f0'} fillOpacity=".85"
          />
          <line x1={x} y1={i === 1 ? 110 : 100} x2={x} y2={i === 1 ? 160 : 140} stroke="#9a7cc4" strokeWidth=".5" />
        </g>
      ))}
    </svg>
  );
}

export function LucyMasterTarotRoom() {
  return (
    <div className="lucy-master-room" aria-hidden="true">
      <div className="lmr-velvet" />
      <div className="lmr-cloth">
        <div className="lmr-cloth-sigil" />
        <div className="lmr-cloth-trim" />
      </div>
      <div className="lmr-cloth-fringe" />
      <DreamCatcher />
      <div className="lmr-candle-glow" />
      {MOTES.map((m, i) => (
        <span key={i} className="lmr-mote" style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }} />
      ))}
      {CANDLES.map((c, i) => (
        <div key={i} className="lmr-candle" style={{ left: c.left, transform: `translateX(-50%) scale(${c.scale})` }}>
          <div className="lmr-halo" style={{ animationDelay: c.delay }} />
          <div className="lmr-flame" style={{ animationDelay: c.delay }}>
            <div className="lmr-flame-core" />
          </div>
          <div className="lmr-wick" />
          <div className="lmr-wax" style={{ height: c.height }}>
            <div className="lmr-drip" />
          </div>
          <div className="lmr-holder" />
        </div>
      ))}
      <div className="lmr-vignette" />
    </div>
  );
}
