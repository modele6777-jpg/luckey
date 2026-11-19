import type React from 'react';
import { motion } from 'framer-motion';

interface LucyModeNameProps { plus: boolean; pro: boolean; isLight: boolean; master?: boolean }
const proStyle = 'bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]';

const masterStyle = 'font-black tracking-wide';
const masterGradient: React.CSSProperties = {
  backgroundImage: 'linear-gradient(90deg, #f5d0fe 0%, #e9d5ff 40%, #fde68a 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'drop-shadow(0 0 10px rgba(216, 180, 254, 0.75))',
};

/** Folded: Lucy. Unfolded: Lucy Plus. Pro stays an independent marker and never adds Plus. Master: hidden divination mode. */
export function LucyModeName({ plus, pro, isLight, master = false }: LucyModeNameProps) {
  if (master) {
    return (
      <motion.span
        key="master"
        className="inline-flex items-center gap-1.5 whitespace-nowrap"
        data-lucy-name
        data-lucy-name-marker="master"
        aria-label="Lucy Master"
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      >
        <span aria-hidden="true" className="text-[0.85em] drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]">🔮</span>
        <span className={masterStyle} style={masterGradient}>Lucy</span>
        <span className={`${masterStyle} font-serif italic`} style={masterGradient}>Master</span>
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
