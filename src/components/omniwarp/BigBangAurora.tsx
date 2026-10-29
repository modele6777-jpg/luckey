import type React from 'react';
import { createPortal } from 'react-dom';

/** Decorative only: input and navigation always pass through the aurora. */
export function BigBangAurora({ settling, layerRef }: { settling: boolean; layerRef: React.RefObject<HTMLDivElement | null> }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div ref={layerRef} data-bigbang-aurora="true" data-settling={settling}
      className={`bigbang-aurora-screen ${settling ? 'is-settling' : ''}`} aria-hidden="true">
      {[0, 1, 2, 3].map(i => <div key={i} className={`bigbang-aurora-ribbon bigbang-aurora-ribbon-${i}`} />)}
    </div>, document.body
  );
}
