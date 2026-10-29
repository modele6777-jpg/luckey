import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';

type Point = { x: number; y: number; time: number; life: number };
type Spark = Point & { dx: number; dy: number; size: number };
interface Props {
  settling: boolean;
  pointerRef: RefObject<{ clientX: number; clientY: number } | null>;
  originRef: RefObject<{ x: number; y: number } | null>;
}

/** Bounded, visual-only pointer trail; never handles input or changes routes. */
export function BigBangStarTrail({ settling, pointerRef, originRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settlingRef = useRef(settling);
  useEffect(() => { settlingRef.current = settling; }, [settling]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = innerWidth;
    let height = innerHeight;
    let frame = 0;
    let points: Point[] = [];
    let sparks: Spark[] = [];
    let lastSparkDistance = 0;
    let sequence = 0;
    const resize = () => {
      width = innerWidth; height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = []; sparks = [];
    };
    resize();
    const origin = originRef.current;
    if (origin) points.push({ ...origin, time: performance.now(), life: 600 });
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      const light = document.documentElement.classList.contains('light');
      const pointer = settlingRef.current ? null : pointerRef.current;
      if (pointer) {
        const previous = points.at(-1);
        const distance = previous ? Math.hypot(pointer.clientX - previous.x, pointer.clientY - previous.y) : 0;
        if (!previous || distance > .7) {
          const speed = distance / Math.max(8, now - (previous?.time || now));
          const life = reduced.matches ? 80 : 260 + Math.min(speed * 180, 360);
          points.push({ x: pointer.clientX, y: pointer.clientY, time: now, life });
          lastSparkDistance += distance;
          if (!reduced.matches && lastSparkDistance > 28) {
            lastSparkDistance = 0; sequence++;
            sparks.push({ x: pointer.clientX, y: pointer.clientY, time: now, life: 420,
              dx: Math.sin(sequence * 2.4) * 12, dy: -8 - sequence % 9, size: sequence % 3 === 0 ? 2.8 : 1.6 });
          }
        }
      }
      points = points.filter(p => now - p.time < p.life).slice(-64);
      sparks = sparks.filter(p => now - p.time < p.life).slice(-10);
      context.lineCap = 'round'; context.lineJoin = 'round';
      if (!reduced.matches) {
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i];
          const alpha = Math.max(0, 1 - (now - a.time) / a.life);
          context.globalAlpha = alpha * .7;
          context.strokeStyle = light ? '#789ec4' : '#a9d5f2';
          context.shadowColor = '#a9d5f2'; context.shadowBlur = light ? 2 : 7;
          context.lineWidth = .6 + 1.2 * i / points.length;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        }
      }
      context.shadowBlur = 0;
      for (const spark of sparks) {
        const age = (now - spark.time) / spark.life;
        const x = spark.x + spark.dx * age, y = spark.y + spark.dy * age;
        const r = spark.size * (1 - age * .5);
        context.globalAlpha = (1 - age) * .8;
        context.fillStyle = light ? '#7194b7' : '#e5f3ff';
        context.beginPath(); context.moveTo(x, y - r * 1.7); context.lineTo(x + r * .4, y - r * .4);
        context.lineTo(x + r * 1.7, y); context.lineTo(x + r * .4, y + r * .4);
        context.lineTo(x, y + r * 1.7); context.lineTo(x - r * .4, y + r * .4);
        context.lineTo(x - r * 1.7, y); context.lineTo(x - r * .4, y - r * .4); context.closePath(); context.fill();
      }
      const head = points.at(-1);
      if (head) {
        context.globalAlpha = Math.max(0, 1 - (now - head.time) / head.life);
        context.fillStyle = light ? '#7194b7' : '#f0f8ff';
        context.shadowColor = '#b9def8'; context.shadowBlur = reduced.matches ? 0 : 9;
        context.beginPath(); context.arc(head.x, head.y, 2, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1; context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, [pointerRef, originRef]);
  if (typeof document === 'undefined') return null;
  return createPortal(<canvas ref={canvasRef} data-bigbang-star-trail="true" aria-hidden="true"
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10010 }} />, document.body);
}
