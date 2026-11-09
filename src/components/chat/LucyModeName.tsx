import { motion } from 'framer-motion';

interface LucyModeNameProps { plus: boolean; pro: boolean; isLight: boolean }
const plusStyle = 'bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]';
const proStyle = 'bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]';

/** Plus is an independent, stable marker; enabling Pro never replaces it. */
export function LucyModeName({ plus, pro, isLight }: LucyModeNameProps) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" data-lucy-name>
      <span className={plus ? plusStyle : pro ? proStyle : `font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Lucy</span>
      {plus && <span key="plus" data-lucy-name-marker="plus" className={plusStyle}>+</span>}
      {pro && (
        <motion.span key="pro" data-lucy-name-marker="pro" className={proStyle}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>Pro</motion.span>
      )}
    </span>
  );
}
