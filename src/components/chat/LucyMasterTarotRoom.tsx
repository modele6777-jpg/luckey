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


function ringPoint(radius: number, turn: number) {
  const angle = turn * Math.PI * 2 - Math.PI / 2;
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
}

function MagicCircle() {
  const gold = React.useId().replace(/:/g, '');
  const star = [0, 1, 2].map(index => {
    const point = ringPoint(104, index / 3);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(' ');
  const starDown = [0, 1, 2].map(index => {
    const point = ringPoint(104, index / 3 + 0.5);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(' ');
  return (
    <svg className="lmr-cloth-sigil" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6d4" />
          <stop offset="0.42" stopColor="#e6c27a" />
          <stop offset="1" stopColor="#c9a6ff" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke={`url(#${gold})`} strokeWidth="2.4" strokeOpacity="0.9" />
      <circle cx="200" cy="200" r="178" fill="none" stroke="#f3e2b4" strokeWidth="0.7" strokeOpacity="0.45" />
      <circle cx="200" cy="200" r="168" fill="none" stroke={`url(#${gold})`} strokeWidth="3.2" strokeLinecap="round" strokeDasharray="58 30" strokeOpacity="0.8" />
      {Array.from({ length: 12 }, (_, index) => {
        const point = ringPoint(168, index / 12 + 1 / 24);
        return <circle key={index} cx={point.x} cy={point.y} r="2.1" fill="#fff1c9" fillOpacity="0.85" />;
      })}
      {Array.from({ length: 8 }, (_, index) => {
        const point = ringPoint(190, index / 8);
        return (
          <path
            key={index}
            d={`M${point.x},${point.y - 5.2} L${point.x + 3.4},${point.y} L${point.x},${point.y + 5.2} L${point.x - 3.4},${point.y} Z`}
            fill="#f6e2ae"
            fillOpacity="0.9"
            stroke="#fff8df"
            strokeWidth="0.4"
          />
        );
      })}
      {Array.from({ length: 12 }, (_, index) => {
        const point = ringPoint(150, index / 12);
        const turn = index % 4;
        const mark = turn === 0
          ? 'M0,-8 L6.2,6 L-6.2,6 Z'
          : turn === 1
            ? 'M-6,0 H6 M0,-6 V6'
            : turn === 2
              ? 'M-6,-2 H6 M-3.2,4 H3.2 M0,-7 V1'
              : 'M0,-7 C4,-2 4,3 0,7 C-4,3 -4,-2 0,-7 Z';
        return (
          <path
            key={index}
            d={mark}
            transform={`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${index * 30})`}
            fill="none"
            stroke={`url(#${gold})`}
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
        );
      })}
      <circle cx="200" cy="200" r="128" fill="none" stroke={`url(#${gold})`} strokeWidth="1.3" strokeOpacity="0.75" />
      <polygon points={star} fill="none" stroke="#fff3cf" strokeWidth="1.7" strokeLinejoin="round" strokeOpacity="0.88" />
      <polygon points={starDown} fill="none" stroke={`url(#${gold})`} strokeWidth="1.35" strokeLinejoin="round" strokeOpacity="0.8" />
      <circle cx="200" cy="200" r="52" fill="none" stroke="#f0d7a2" strokeWidth="0.9" strokeOpacity="0.7" />
      {Array.from({ length: 6 }, (_, index) => {
        const tip = ringPoint(46, index / 6);
        const left = ringPoint(16, index / 6 - 0.08);
        const right = ringPoint(16, index / 6 + 0.08);
        return (
          <path
            key={index}
            d={`M${left.x.toFixed(2)},${left.y.toFixed(2)} Q${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${right.x.toFixed(2)},${right.y.toFixed(2)}`}
            fill="none"
            stroke="#fff6dc"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
        );
      })}
      <circle cx="200" cy="200" r="14" fill="none" stroke={`url(#${gold})`} strokeWidth="1.4" />
      <circle cx="200" cy="200" r="5.5" fill="#fff4cf" fillOpacity="0.9" />
    </svg>
  );
}

/** `table`: the unfolded left tarot table continues the same velvet and candles, without a second dream catcher. */
export function LucyMasterTarotRoom({ variant = 'chat' }: { variant?: 'chat' | 'table' } = {}) {
  return (
    <div className="lucy-master-room" data-lmr-variant={variant} aria-hidden="true">
      <div className="lmr-velvet" />
      <div className="lmr-cloth">
        <MagicCircle />
        <div className="lmr-cloth-trim" />
      </div>
      <div className="lmr-cloth-fringe" />
      {variant === 'chat' && <DreamCatcher />}
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
