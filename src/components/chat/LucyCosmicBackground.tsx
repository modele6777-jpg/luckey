interface LucyCosmicBackgroundProps {
  isPlusMode: boolean;
}

/** Decorative layers stay behind opaque reading surfaces. */
export function LucyCosmicBackground({ isPlusMode }: LucyCosmicBackgroundProps) {
  return (
    <div className="lucy-cosmic-bg-container" aria-hidden="true">
      <div className="lucy-cosmic-wash" />
      <div className="lucy-morning-light">
        <div className="lucy-sun-halo" />
        <div className="lucy-sun-rays" />
        <div className="lucy-sun-disc" />
      </div>
      <div className="lucy-meteor-field">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`lucy-shooting-star lucy-shooting-star-${i}`}>
            <span className="lucy-meteor-trail" />
          </div>
        ))}
      </div>
      <div className="lucy-night-moon">
        <svg viewBox="0 0 100 100" focusable="false">
          <path d="M73 10A42 42 0 1 0 86 77A40 40 0 0 1 73 10Z" fill="currentColor" />
        </svg>
      </div>
      <div className="lucy-day-clouds">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`lucy-day-cloud lucy-day-cloud-${i}`}>
            <svg viewBox="0 0 240 100" focusable="false">
              <path d="M38 85C8 85 4 48 31 40C28 13 65 2 84 25C100 -2 151 3 158 36C187 20 216 39 213 57C243 57 245 85 218 85Z" fill="currentColor" />
            </svg>
          </div>
        ))}
      </div>
      <div className={`lucy-star-field ${isPlusMode ? '' : 'is-visible'}`}>
        <div className="lucy-stars lucy-stars-distant" />
        <div className="lucy-stars lucy-stars-bright" />
      </div>
      <div className={`lucy-clover-field ${isPlusMode ? 'is-visible' : ''}`}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="lucy-clover-orbit"
            style={{ left: `${5 + (i * 37) % 90}%`, top: `${4 + (i * 29) % 92}%`, animationDelay: `${-i * 3}s`, animationDuration: `${26 + (i % 7) * 3}s`, width: `clamp(${9 + i % 4}px, ${1.1 + (i % 3) * .25}vw, ${14 + i % 5}px)` }}>
            <svg viewBox="0 0 40 44" className="lucy-clover-particle" focusable="false" style={{ animationDelay: `${-i * 2}s`, animationDuration: `${5 + i % 7}s` }}>
            <g fill="currentColor">
              <ellipse cx="14" cy="13" rx="7" ry="9" transform="rotate(-40 14 13)" />
              <ellipse cx="26" cy="13" rx="7" ry="9" transform="rotate(40 26 13)" />
              <ellipse cx="12" cy="25" rx="7" ry="9" transform="rotate(-65 12 25)" />
              <ellipse cx="28" cy="25" rx="7" ry="9" transform="rotate(65 28 25)" />
            </g>
            <path d="M20 23Q26 35 19 42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
