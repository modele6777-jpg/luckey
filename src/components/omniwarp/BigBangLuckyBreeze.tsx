import { useLayoutEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';

/** A small, non-interactive breeze around the button, rather than a screen overlay. */
export function BigBangLuckyBreeze({ settling, buttonRef }: {
  settling: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const reduced = useReducedMotion();
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [buttonRef]);
  if (!center || typeof document === 'undefined') return null;
  return createPortal(
    <div aria-hidden="true" data-bigbang-lucky-breeze="true" style={{ position: 'fixed', left: center.x, top: center.y, width: 0, height: 0, pointerEvents: 'none', zIndex: 10030 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * Math.PI / 6;
        const x = Math.cos(angle) * 44;
        const y = Math.sin(angle) * 44;
        return <motion.span key={i} style={{ position: 'absolute', left: -9, top: -9, width: 16 + i % 3 * 3, height: 20, color: i % 2 ? '#86efac' : '#34d399', filter: 'drop-shadow(0 0 3px #6ee7b755)' }}
          initial={{ x, y, opacity: 0, rotate: i * 31 }}
          animate={reduced ? { x, y, opacity: settling ? 0 : 0.7 } : { x: [x, x * 1.8 + 15, x * 2.5 + 30], y: [y, y - 32, y - 85], opacity: [0, 0.85, 0], rotate: [i * 31, i * 31 + 65] }}
          transition={{ duration: reduced ? 0.2 : 1.8, delay: reduced ? 0 : i * 0.06, repeat: reduced || settling ? 0 : Infinity, ease: 'easeOut' }}>
          <svg viewBox="0 0 28 30" width="100%" height="100%" fill="currentColor">
            {[0, 90, 180, 270].map(a => <path key={a} transform={`rotate(${a} 14 14)`} d="M14 14C11 12 5 9 6 5C7 1 12 2 14 6C16 2 21 1 22 5C23 9 17 12 14 14Z" />)}
            <path d="M14 14Q18 23 11 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </motion.span>;
      })}
    </div>, document.body,
  );
}
