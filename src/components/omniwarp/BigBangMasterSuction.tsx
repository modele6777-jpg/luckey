import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { measureMainOverlayViewport } from '@/lib/mainOverlayViewport';
import { BigBangEffectPortal } from './BigBangEffectPortal';

export const LUCY_MASTER_SUCTION_EVENT = 'prism:lucy_master_suction';

/** Fire the "pulled into the Big Bang button" effect (entering Lucy Master). */
export function playLucyMasterSuction(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LUCY_MASTER_SUCTION_EVENT));
}

const DURATION_MS = 1050;
const PARTICLE_COLORS = ['#f5d0fe', '#c084fc', '#a855f7', '#fde68a', '#ffffff', '#7c3aed'];

interface Particle { angle: number; radius: number; speed: number; spin: number; size: number; color: string }

/**
 * Entering Lucy Master from a Big Bang hold: the screen spirals and collapses into
 * the button. Visual-only (never intercepts input) and drawn inside the Big Bang
 * effect bounds, so it never paints across Lucy or navigation when unfolded.
 */
export function BigBangMasterSuction() {
  const [run, setRun] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, reach: 600 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onSuction = () => {
      const bounds = measureMainOverlayViewport('content');
      const btn = document.getElementById('bigbang-omnibutton')?.getBoundingClientRect();
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
    const particles: Particle[] = Array.from({ length: 150 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: origin.reach * (0.35 + Math.random() * 0.75),
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
        // Accelerate as the pull tightens; spin faster near the centre.
        p.radius *= 1 - (p.speed + t * 0.08);
        p.angle += p.spin * (1 + (1 - p.radius / origin.reach) * 3);
        const px = origin.x + Math.cos(p.angle) * p.radius;
        const py = origin.y + Math.sin(p.angle) * p.radius;
        const alpha = Math.max(0, Math.min(1, p.radius / 40)) * (1 - t * 0.4);
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
  }, [visible, origin, reduceMotion]);

  const at = `${origin.x}px ${origin.y}px`;
  return (
    <BigBangEffectPortal zIndex={10000}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`master-suction-${run}`}
            data-testid="lucy-master-suction"
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Darkness closing in on the button: the visible screen shrinks into it. */}
            <motion.div
              className="absolute inset-0"
              initial={{ ['--hole' as string]: `${origin.reach * 1.1}px` }}
              animate={{ ['--hole' as string]: '0px' }}
              transition={{ duration: (reduceMotion ? 400 : DURATION_MS * 0.8) / 1000, ease: [0.55, 0, 0.9, 0.45] }}
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
                  initial={{ scale: 1, rotate: 0, opacity: 0 }}
                  animate={{ scale: 0.02, rotate: -540, opacity: [0, 0.9, 0.9, 0] }}
                  transition={{ duration: DURATION_MS / 1000, ease: [0.6, 0, 0.85, 0.4] }}
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                {/* The button swallows the light: a bright core that collapses, then a soft pulse. */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: origin.x, top: origin.y, width: 120, height: 120, marginLeft: -60, marginTop: -60,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(216,180,254,0.85) 30%, rgba(124,58,237,0.4) 60%, transparent 72%)',
                  }}
                  initial={{ scale: 2.4, opacity: 0 }}
                  animate={{ scale: [2.4, 0.35, 1.6], opacity: [0, 1, 0] }}
                  transition={{ duration: DURATION_MS / 1000, times: [0, 0.72, 1], ease: 'easeIn' }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BigBangEffectPortal>
  );
}
