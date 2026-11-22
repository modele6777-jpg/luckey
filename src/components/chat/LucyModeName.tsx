import type React from 'react';
import { motion } from 'framer-motion';

interface LucyModeNameProps { plus: boolean; pro: boolean; isLight: boolean; master?: boolean }
const proStyle = 'bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]';

// Lucy Master(점술모드) 로고: 헤더에서는 깊이 표시가 잘리지 않게 짧은 이름 'Lucy Pro'로 보인다. 텍스트만, 선명하게.
// iOS는 그라데이션 글자에 CSS filter(drop-shadow)를 걸면 비트맵으로 그려 픽셀이 보이므로,
// 빛번짐은 글자 뒤에 겹친 별도 레이어(text-shadow)로만 준다.
const MASTER_GRADIENT = 'linear-gradient(100deg, #f3e8ff 0%, #e9d5ff 35%, #f5d0fe 60%, #fde68a 100%)';
const masterText: React.CSSProperties = {
  backgroundImage: MASTER_GRADIENT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitFontSmoothing: 'antialiased',
};
const masterGlow: React.CSSProperties = {
  color: 'transparent',
  textShadow: '0 0 14px rgba(192, 132, 252, 0.45), 0 0 2px rgba(253, 230, 138, 0.25)',
};

function MasterWords({ style }: { style: React.CSSProperties }) {
  return (
    <>
      <span className="font-black tracking-tight" style={style}>Lucy</span>
      <span className="font-serif italic font-semibold tracking-normal" style={style}>Pro</span>
    </>
  );
}

/** Folded: Lucy. Unfolded: Lucy Plus. Pro stays an independent marker and never adds Plus. Master: hidden divination mode. */
export function LucyModeName({ plus, pro, isLight, master = false }: LucyModeNameProps) {
  if (master) {
    return (
      <motion.span
        key="master"
        className="relative inline-flex items-baseline whitespace-nowrap"
        data-lucy-name
        data-lucy-name-marker="master"
        aria-label="Lucy Pro"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
      >
        {/* 빛번짐 레이어 (장식) */}
        <span aria-hidden="true" className="absolute inset-0 inline-flex items-baseline gap-[0.3em] pointer-events-none select-none">
          <MasterWords style={masterGlow} />
        </span>
        <span className="relative inline-flex items-baseline gap-[0.3em]">
          <MasterWords style={masterText} />
        </span>
      </motion.span>
    );
  }
  const showPlus = plus && !pro;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" data-lucy-name aria-label={showPlus ? 'Lucy Plus' : undefined}>
      <span className={pro ? proStyle : `font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Lucy</span>
      {showPlus && (
        <motion.span
          key="plus"
          data-lucy-name-marker="plus"
          className={`inline-flex items-center rounded-full px-2 py-[1px] text-[0.72em] font-black tracking-wide leading-tight border ${
            isLight
              ? 'bg-gradient-to-r from-teal-50 to-sky-50 border-teal-300/70 text-teal-700'
              : 'bg-gradient-to-r from-teal-500/20 to-sky-500/20 border-teal-300/40 text-teal-200'
          }`}
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
        >Plus</motion.span>
      )}
      {pro && (
        <motion.span key="pro" data-lucy-name-marker="pro" className={proStyle}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>Pro</motion.span>
      )}
    </span>
  );
}
