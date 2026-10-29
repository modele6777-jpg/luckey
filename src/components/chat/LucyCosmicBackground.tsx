interface LucyCosmicBackgroundProps {
  isPlusMode: boolean;
}

/** Decorative layers stay behind opaque reading surfaces. */
export function LucyCosmicBackground({ isPlusMode }: LucyCosmicBackgroundProps) {
  return (
    <div className="lucy-cosmic-bg-container" aria-hidden="true">
      <div className="lucy-cosmic-wash" />
      <div className={`lucy-star-field ${isPlusMode ? '' : 'is-visible'}`}>
        <div className="lucy-stars lucy-stars-distant" />
        <div className="lucy-stars lucy-stars-bright" />
      </div>
      <div className={`lucy-clover-field ${isPlusMode ? 'is-visible' : ''}`}>
        {Array.from({ length: 24 }, (_, i) => (
          <svg key={i} viewBox="0 0 40 44" className="lucy-clover-particle"
            style={{ left: `${5 + (i * 37) % 90}%`, top: `${4 + (i * 29) % 92}%`, animationDelay: `${-i * 3}s`, animationDuration: `${5 + (i % 7)}s`, width: `clamp(${9 + i % 4}px, ${1.1 + (i % 3) * .25}vw, ${14 + i % 5}px)` }}>
            <g fill="currentColor">
              <ellipse cx="14" cy="13" rx="7" ry="9" transform="rotate(-40 14 13)" />
              <ellipse cx="26" cy="13" rx="7" ry="9" transform="rotate(40 26 13)" />
              <ellipse cx="12" cy="25" rx="7" ry="9" transform="rotate(-65 12 25)" />
              <ellipse cx="28" cy="25" rx="7" ry="9" transform="rotate(65 28 25)" />
            </g>
            <path d="M20 23Q26 35 19 42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ))}
      </div>
    </div>
  );
}
