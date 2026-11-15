import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface ModeAppearance { plus: boolean; pro: boolean }
interface LucyModeTransitionProps { active: boolean; isPlusMode: boolean; isProMode: boolean }

/** Keep the name still; animate only the mode markers that actually change. */
export function LucyModeTransition({ active, isPlusMode, isProMode }: LucyModeTransitionProps) {
  const previous = useRef<ModeAppearance>({ plus: isPlusMode, pro: isProMode });
  const [change, setChange] = useState(() => ({ from: previous.current, to: previous.current }));
  useLayoutEffect(() => {
    const to = { plus: isPlusMode, pro: isProMode };
    const from = previous.current;
    if (from.plus === to.plus && from.pro === to.pro) return;
    previous.current = to;
    setChange({ from, to });
  }, [isPlusMode, isProMode]);

  if (!active || typeof document === 'undefined') return null;
  const name = `Lucy${isProMode ? ' Pro' : ''}`;
  const markerStyle = (marker: keyof ModeAppearance) => ({
    '--lucy-marker-from': change.from[marker] ? 1 : 0.08,
    '--lucy-marker-to': change.to[marker] ? 1 : 0.08,
  }) as CSSProperties;
  const markerDirection = (marker: keyof ModeAppearance) => change.from[marker] === change.to[marker]
    ? 'steady' : change.to[marker] ? 'in' : 'out';

  return createPortal(
    <div className="lucy-mode-transition" data-lucy-animation="true" data-lucy-loader="true" role="status" aria-label={`${name} 모드로 전환 중`} aria-live="polite" aria-busy="true">
      <strong className="lucy-transition-wordmark" aria-hidden="true">
        Lucy
        <span className="lucy-transition-markers">
          {(change.from.pro || change.to.pro) && (
            <span key={`pro-${change.from.pro}-${change.to.pro}`} className="lucy-transition-marker lucy-transition-pro" data-marker="pro" data-direction={markerDirection('pro')} style={markerStyle('pro')}>Pro</span>
          )}
        </span>
      </strong>
    </div>, document.body,
  );
}
