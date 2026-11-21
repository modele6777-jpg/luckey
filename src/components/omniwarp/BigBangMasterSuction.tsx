import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { measureMainOverlayViewport } from '@/lib/mainOverlayViewport';
import { createPortal } from 'react-dom';

export const LUCY_MASTER_SUCTION_EVENT = 'prism:lucy_master_suction';

export type LucyMasterSuctionDirection = 'in' | 'out';

/**
 * Fire the Big Bang suction effect: 'in' pulls the screen into the button
 * (entering Lucy Master); 'out' plays it in reverse, the screen pouring back
 * out of the button (returning to regular Lucy).
 */
export function playLucyMasterSuction(direction: LucyMasterSuctionDirection = 'in'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LUCY_MASTER_SUCTION_EVENT, { detail: { direction } }));
}

const DURATION_MS = 1050;
const PARTICLE_COLORS = ['#f5d0fe', '#c084fc', '#a855f7', '#fde68a', '#ffffff', '#7c3aed'];

interface Particle { angle: number; radius: number; speed: number; spin: number; size: number; color: string }

/**
 * Entering Lucy Master from a Big Bang hold: the screen spirals and collapses into
 * the button. Visual-only (never intercepts input). It covers the pane that holds
 * the button (Lucy or content when unfolded, main when folded) so the vortex is
 * centred on the button itself; it never covers navigation.
 */
export function BigBangMasterSuction() {
  const [run, setRun] = useState(0);
  const [direction, setDirection] = useState<LucyMasterSuctionDirection>('in');
  const [origin, setOrigin] = useState({ x: 0, y: 0, reach: 600 });
  // The layer covers the pane that holds the button, so the vortex centre sits exactly on it.
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onSuction = (event: Event) => {
      setDirection((event as CustomEvent<{ direction?: LucyMasterSuctionDirection }>).detail?.direction === 'out' ? 'out' : 'in');
      const btn = document.getElementById('bigbang-omnibutton')?.getBoundingClientRect();
      const bx = btn ? btn.left + btn.width / 2 : 0;
      const by = btn ? btn.top + btn.height / 2 : 0;
      const inside = (b: { left: number; top: number; width: number; height: number }) =>
        b.width > 48 && b.height > 48 && bx >= b.left && bx <= b.left + b.width && by >= b.top && by <= b.top + b.height;
      const lucy = measureMainOverlayViewport('lucy');
      const content = measureMainOverlayViewport('content');
      const bounds = btn && inside(lucy) ? lucy : btn && inside(content) ? content : measureMainOverlayViewport('main');
      setBounds({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height });
      const gx = btn ? btn.left + btn.width / 2 : bounds.left + bounds.width / 2;
      const gy = btn ? btn.top + btn.height / 2 : bounds.top + bounds.height * 0.85;
      // Clamp the vortex centre into the effect bounds (the button can sit on the pane edge).
      const x = Math.min(Math.max(gx - bounds.left, 0), bounds.width);
      const y = Math.min(Math.max(gy - bounds.top, 0), bounds.height);
      const reach = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));
      setOrigin({ x, y, reach });
      setRun(value => value + 1);
    };
    window.addEventListener(LUCY_MASTER_SUCTION_EVENT, onSuction);
    return () => window.removeEventListener(LUCY_MASTER_SUCTION_EVENT, onSuction);
  }, []);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!run) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 450 : DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [run, reduceMotion]);

  // Particles stream inward on a tightening spiral and vanish into the button.
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.scale(dpr, dpr);
    const reverse = direction === 'out';
    const particles: Particle[] = Array.from({ length: 150 }, () => ({
      angle: Math.random() * Math.PI * 2,
      // Reverse: particles start inside the button and spiral back out.
      radius: reverse ? 2 + Math.random() * 10 : origin.reach * (0.35 + Math.random() * 0.75),
      speed: 0.018 + Math.random() * 0.03,
      spin: 0.025 + Math.random() * 0.045,
      size: 0.8 + Math.random() * 2.4,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));
    let frame = 0;
    const startedAt = performance.now();
    const draw = (now: number) => {
      const t = Math.min(1, (now - startedAt) / (DURATION_MS * 0.85));
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (const p of particles) {
        const prevX = origin.x + Math.cos(p.angle) * p.radius;
        const prevY = origin.y + Math.sin(p.angle) * p.radius;
        if (reverse) {
          // Burst out of the button fast, then ease as the spiral unwinds.
          p.radius = Math.min(origin.reach * 1.3, p.radius * (1 + (p.speed + 0.03) * (1.6 - t)) + 1.5);
          p.angle -= p.spin * (1 + Math.max(0, 1 - p.radius / origin.reach) * 3);
        } else {
          // Accelerate as the pull tightens; spin faster near the centre.
          p.radius *= 1 - (p.speed + t * 0.08);
          p.angle += p.spin * (1 + (1 - p.radius / origin.reach) * 3);
        }
        const px = origin.x + Math.cos(p.angle) * p.radius;
        const py = origin.y + Math.sin(p.angle) * p.radius;
        const alpha = reverse
          ? Math.max(0, Math.min(1, p.radius / 24)) * (1 - t * 0.85)
          : Math.max(0, Math.min(1, p.radius / 40)) * (1 - t * 0.4);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (t < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [visible, origin, reduceMotion, direction]);

  const reverse = direction === 'out';

  const at = `${origin.x}px ${origin.y}px`;
  return (
    typeof document === 'undefined' ? null : createPortal(
    <div
      data-lucy-master-suction-viewport
      style={{ position: 'fixed', left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, zIndex: 10000, pointerEvents: 'none', overflow: 'clip', contain: 'layout paint' }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`master-suction-${run}-${direction}`}
            data-testid="lucy-master-suction"
            data-direction={direction}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* In: darkness closes in on the button. Out: the screen opens back up from it. */}
            <motion.div
              className="absolute inset-0"
              initial={{ ['--hole' as string]: reverse ? '0px' : `${origin.reach * 1.1}px` }}
              animate={{ ['--hole' as string]: reverse ? `${origin.reach * 1.1}px` : '0px' }}
              transition={{ duration: (reduceMotion ? 400 : DURATION_MS * 0.8) / 1000, ease: reverse ? [0.1, 0.55, 0.45, 1] : [0.55, 0, 0.9, 0.45] }}
              style={{
                background: `radial-gradient(circle at ${at}, transparent 0, transparent var(--hole), rgba(46,16,101,0.55) calc(var(--hole) + 40px), rgba(12,5,26,0.96) calc(var(--hole) + 160px))`,
              }}
            />
            {!reduceMotion && (
              <>
                {/* Spiral arms rotating and shrinking into the centre. */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: origin.x, top: origin.y, width: origin.reach * 2.4, height: origin.reach * 2.4,
                    marginLeft: -origin.reach * 1.2, marginTop: -origin.reach * 1.2,
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(192,132,252,0.55) 30deg, transparent 75deg, rgba(253,230,138,0.45) 130deg, transparent 175deg, rgba(168,85,247,0.55) 220deg, transparent 265deg, rgba(245,208,254,0.5) 310deg, transparent 360deg)',
                    maskImage: 'radial-gradient(circle, transparent 4%, black 22%, black 55%, transparent 72%)',
                    WebkitMaskImage: 'radial-gradient(circle, transparent 4%, black 22%, black 55%, transparent 72%)',
                  }}
                  initial={reverse ? { scale: 0.02, rotate: -540, opacity: 0 } : { scale: 1, rotate: 0, opacity: 0 }}
                  animate={reverse ? { scale: 1, rotate: 0, opacity: [0, 0.9, 0.9, 0] } : { scale: 0.02, rotate: -540, opacity: [0, 0.9, 0.9, 0] }}
                  transition={{ duration: DURATION_MS / 1000, ease: reverse ? [0.15, 0.6, 0.4, 1] : [0.6, 0, 0.85, 0.4] }}
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                {/* The button swallows the light: a bright core that collapses, then a soft pulse. */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: origin.x, top: origin.y, width: 120, height: 120, marginLeft: -60, marginTop: -60,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(216,180,254,0.85) 30%, rgba(124,58,237,0.4) 60%, transparent 72%)',
                  }}
                  initial={reverse ? { scale: 1.6, opacity: 0 } : { scale: 2.4, opacity: 0 }}
                  animate={reverse ? { scale: [1.6, 0.35, 2.4], opacity: [0, 1, 0] } : { scale: [2.4, 0.35, 1.6], opacity: [0, 1, 0] }}
                  transition={{ duration: DURATION_MS / 1000, times: reverse ? [0, 0.28, 1] : [0, 0.72, 1], ease: reverse ? 'easeOut' : 'easeIn' }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>, document.body)
  );
}
