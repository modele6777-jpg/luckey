interface LucyCosmicBackgroundProps {
  isProMode: boolean;
}

/** Decorative layers stay behind opaque reading surfaces. */
export function LucyCosmicBackground({ isProMode }: LucyCosmicBackgroundProps) {
  return (
    <div className="lucy-cosmic-bg-container" aria-hidden="true">
      <div className="lucy-cosmic-wash" />
      <div className="lucy-morning-light">
        <div className="lucy-morning-aurora" />
        <div className="lucy-sun-halo" />
        <div className="lucy-sun-beams" />
        <div className="lucy-sun-rays" />
        <div className="lucy-sun-disc" />
        <div className="lucy-morning-flare lucy-morning-flare-1" />
        <div className="lucy-morning-flare lucy-morning-flare-2" />
        <div className="lucy-morning-shimmer-field">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`lucy-morning-shimmer lucy-morning-shimmer-${i}`} />
          ))}
        </div>
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
      <div className={`lucy-star-field ${isProMode ? '' : 'is-visible'}`}>
        <div className="lucy-stars lucy-stars-distant" />
        <div className="lucy-stars lucy-stars-bright" />
      </div>
      <div className={`lucy-clover-field ${isProMode ? 'is-visible' : ''}`}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className="lucy-clover-orbit"
            style={{ left: `${5 + (i * 37) % 90}%`, top: `${4 + (i * 29) % 92}%`, animationDelay: `${-i * 3}s`, animationDuration: `${26 + (i % 7) * 3}s`, width: `clamp(${16 + i % 4}px, ${1.5 + (i % 3) * .25}vw, ${22 + i % 5}px)` }}>
            <svg viewBox="0 0 40 44" className="lucy-clover-particle" focusable="false" style={{ animationDelay: `${-i * 2}s`, animationDuration: `${5 + i % 7}s` }}>
              <g fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
                {[0, 90, 180, 270].map((angle) => (
                  <path key={angle} data-clover-heart-leaf="true" d="M20 20C17 17 10 13 11 8C12 3 18 3 20 7C22 3 28 3 29 8C30 13 23 17 20 20Z" transform={`rotate(${angle} 20 20)`} />
                ))}
              </g>
              <path d="M20 20Q29 34 20 42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
