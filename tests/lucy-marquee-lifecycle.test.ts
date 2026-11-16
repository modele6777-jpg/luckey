import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { createContext, runInContext } from 'node:vm';

test('loading-to-ready starts the real marquee loop; reading holds, motion preference and cleanup remain intact', () => {
  const page=readFileSync(new URL('../src/pages/LucyStandalonePage.tsx',import.meta.url),'utf8');
  const start=page.indexOf('  useEffect(() => {\n    if (!isLucyReady) return;\n    const container = promptsMarqueeRef.current;');
  assert(start>=0,'marquee must wait for its rendered DOM');
  const end=page.indexOf('  }, [isLucyReady, currentPrompts.length, measurePromptsMarqueeLoop, wrapPromptsMarquee]);',start);
  assert(end>start,'ready transition must rerun the effect');
  const body=page.slice(start+'  useEffect(() => {'.length,end);
  const frames=new Map<number,(time:number)=>void>();let id=0;
  const motion={matches:false};const hold={hover:false,dragging:false,touched:false,resumeAt:0};
  const listeners=new Map<string,unknown>();
  const container={scrollLeft:0,scrollWidth:3200,clientWidth:300,firstElementChild:{},addEventListener:(name:string,fn:unknown)=>listeners.set(name,fn),removeEventListener:(name:string)=>listeners.delete(name)};
  const ref:{current:typeof container|null}={current:null};
  let disconnected=false;
  const scope=createContext({
    promptsMarqueeRef:ref,promptsMarqueeHoldRef:{current:hold},promptsMarqueeLoopCacheRef:{current:0},
    window:{requestAnimationFrame:(fn:(time:number)=>void)=>{frames.set(++id,fn);return id;},cancelAnimationFrame:(key:number)=>frames.delete(key),matchMedia:()=>motion},
    ResizeObserver:class {observe(){}disconnect(){disconnected=true;}},
    measurePromptsMarqueeLoop:()=>1600,wrapPromptsMarquee:()=>{},
    PROMPTS_MARQUEE_FLOW_DURATION_MS:38000,PROMPTS_MARQUEE_MAX_PX_PER_SECOND:22,
  });
  runInContext(transformSync(`globalThis.attach = (isLucyReady) => {${body}\n};`,{loader:'ts'}).code,scope);
  assert.equal(scope.attach(false),undefined);assert.equal(frames.size,0);
  ref.current=container;const cleanup=scope.attach(true);
  const tick=(time:number)=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time));};
  for(let time=16;time<=1024;time+=16)tick(time);
  assert(container.scrollLeft>=21&&container.scrollLeft<=24,`readable speed: ${container.scrollLeft}`);
  const initial=container.scrollLeft;hold.touched=true;
  for(let time=1040;time<=2048;time+=16)tick(time);
  assert.equal(container.scrollLeft,initial);
  hold.touched=false;motion.matches=true;
  for(let time=2064;time<=3072;time+=16)tick(time);
  assert.equal(container.scrollLeft,initial);
  motion.matches=false;
  for(let time=3088;time<=4096;time+=16)tick(time);
  assert(container.scrollLeft>initial);
  cleanup();assert.equal(frames.size,0);assert.equal(listeners.size,0);assert(disconnected);
});
