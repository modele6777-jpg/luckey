import { useId, type RefObject } from 'react';
import { createPortal } from 'react-dom';

const CURTAINS = [
  'M-100 350C80 130 180 500 390 280S720 440 1100 100',
  'M-100 170C180 410 280 80 520 260S850 80 1100 300',
  'M-100 540C150 300 350 650 590 390S900 530 1100 240',
];

/** Thin luminous folds, with a transparent falloff behind every reading surface. */
export function BigBangAurora({ settling, layerRef }: { settling: boolean; layerRef: RefObject<HTMLDivElement | null> }) {
  const id = useId();
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div ref={layerRef} data-bigbang-aurora="true" data-settling={settling}
      className={`bigbang-aurora-screen ${settling ? 'is-settling' : ''}`} aria-hidden="true">
      {CURTAINS.map((curve, i) => (
        <div key={i} className={`bigbang-aurora-curtain bigbang-aurora-curtain-${i}`}>
          <svg viewBox="0 0 1000 900" preserveAspectRatio="none" focusable="false">
            <defs>
              <linearGradient id={`${id}-veil-${i}`} x1="0" y1="0" x2="0.25" y2="1">
                <stop stopColor={i === 1 ? '#a7a5ed' : '#74ddc6'} stopOpacity="0.22" />
                <stop offset="0.55" stopColor="#74bddb" stopOpacity="0.08" />
                <stop offset="1" stopColor="#74bddb" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${id}-edge-${i}`}>
                <stop stopColor="#71d9bf" stopOpacity="0" />
                <stop offset="0.4" stopColor="#a4ebd1" stopOpacity="0.65" />
                <stop offset="0.75" stopColor="#b8b5f0" stopOpacity="0.5" />
                <stop offset="1" stopColor="#8cb8ed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${curve}L1100 1000H-100Z`} fill={`url(#${id}-veil-${i})`} />
            <path d={curve} fill="none" stroke={`url(#${id}-edge-${i})`} strokeWidth="3" style={{ filter: 'blur(1.2px)' }} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      ))}
    </div>, document.body
  );
}
