import { useLayoutEffect, useRef, type PointerEvent } from 'react';

const FLOW_PIXELS_PER_SECOND = 18;
const RESUME_DELAY_MS = 1400;

export function OrbQuestionMarquee({ questions, onSelect }: {
  questions: readonly string[];
  onSelect: (question: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef(0);
  const resumeAt = useRef(0);
  const drag = useRef<{ id: number; x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const track = viewport.firstElementChild!;
    const middle = track.children[1] as HTMLElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let timer = 0;
    let lastTime = 0;
    let remainder = 0;
    let automaticScroll = -1;

    const measure = () => {
      const period = middle.offsetWidth;
      periodRef.current = period > viewport.clientWidth ? period : 0;
      viewport.dataset.looping = String(periodRef.current > 0);
      viewport.scrollLeft = periodRef.current;
    };

    const pause = () => {
      resumeAt.current = performance.now() + RESUME_DELAY_MS;
      wake();
    };

    function animate(time: number) {
      const period = periodRef.current;
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
      lastTime = time;
      if (!motion.matches && period && !drag.current && !viewport.matches(':hover')
        && !viewport.querySelector(':focus-visible') && time >= resumeAt.current) {
        remainder += elapsed * FLOW_PIXELS_PER_SECOND / 1000;
        const step = Math.floor(remainder);
        if (step) {
          remainder -= step;
          viewport.scrollLeft = period + ((viewport.scrollLeft + step - period) % period + period) % period;
          automaticScroll = viewport.scrollLeft;
        }
      }
      frame = requestAnimationFrame(animate);
    }

    function wake() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const period = periodRef.current;
        if (!period || drag.current || viewport.querySelector(':focus-visible')) return;
        const scroll = viewport.scrollLeft;
        if (scroll < period || scroll >= period * 2) {
          viewport.scrollLeft = period + scroll % period;
          automaticScroll = viewport.scrollLeft;
        }
      }, RESUME_DELAY_MS);
    }

    const onScroll = () => {
      // Native touch scrolling keeps its momentum. Normalize only after it has settled.
      if (viewport.scrollLeft !== automaticScroll) pause();
    };
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(middle);
    observer.observe(viewport);
    viewport.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(animate);
    return () => {
      observer.disconnect();
      viewport.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [questions]);

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    resumeAt.current = performance.now() + RESUME_DELAY_MS;
  };

  return (
    <div
      ref={viewportRef}
      className="lucy-orb-lucy-questions"
      role="group"
      aria-label="루시 추천 질문"
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        suppressClick.current = false;
        drag.current = { id: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
      }}
      onPointerMove={event => {
        const active = drag.current;
        const period = periodRef.current;
        if (event.pointerType === 'touch' || active?.id !== event.pointerId || !period) return;
        const offset = event.clientX - active.x;
        if (!active.moved) {
          if (Math.abs(offset) <= 5) return;
          active.moved = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.dataset.dragging = 'true';
        }
        const position = active.scroll - offset;
        event.currentTarget.scrollLeft = period + ((position % period) + period) % period;
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse' && !event.currentTarget.hasPointerCapture(event.pointerId)) endDrag(event);
      }}
      onDragStart={event => event.preventDefault()}
      onClickCapture={event => {
        if (!suppressClick.current || event.detail === 0) return;
        suppressClick.current = false;
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      <div className="lucy-orb-questions-track">
        {[0, 1, 2].map(copy => (
          <div key={copy} className="lucy-orb-questions-set" aria-hidden={copy !== 1 || undefined}>
            {questions.map(question => (
              <button key={question} type="button" tabIndex={copy === 1 ? undefined : -1}
                onClick={() => onSelect(question)}>{question}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
