import { BigBangEffectPortal } from './BigBangEffectPortal';
import React from 'react';

/** Visual-only portal: never captures input or navigates. */
export function BigBangCloverWind({ settling, layerRef }: { settling:boolean; layerRef:React.RefObject<HTMLDivElement | null> }) {
  if(typeof document==='undefined')return null;
  return (<BigBangEffectPortal zIndex={10035}><div ref={layerRef} data-bigbang-clover-wind="true" data-settling={settling} className={`bigbang-clover-wind-screen ${settling?'is-settling':''}`} aria-hidden="true">
    {Array.from({length:64},(_,i)=><span key={i} className="bigbang-clover-wind-leaf" style={{left:`${(i*47+7)%103}%`,top:`${(i*31+11)%107}%`,'--leaf-size':`${14+(i*13)%24}px`,'--leaf-duration':`${2.4+(i%7)*.32}s`,'--leaf-delay':`${-(i%17)*.29}s`,'--leaf-turn':`${(i%2?1:-1)*(90+(i%5)*45)}deg`,'--leaf-tilt':`${i*37%360}deg`,color:['#6ee7b7','#a7f3d0','#34d399','#d9f99d'][i%4]} as React.CSSProperties}>
      <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        {[0,90,180,270].map(angle=><path key={angle} transform={`rotate(${angle} 12 12)`} d="M12 12C9 10 4 8 5 4C6 1 10 2 12 5C14 2 18 1 19 4C20 8 15 10 12 12Z" />)}
        <path d="M12 12Q15 18 10 23" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>)}
  </div></BigBangEffectPortal>);
}
