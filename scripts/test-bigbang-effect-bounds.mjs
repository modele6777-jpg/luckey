import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const bundle=await build({stdin:{contents:`
import React from 'react';import{createRoot}from'react-dom/client';
import{BigBangExpansionOverlay}from'./src/components/omniwarp/BigBangExpansionOverlay';
import{BigBangHorizonOverlay}from'./src/components/omniwarp/BigBangHorizonOverlay';
import{BigBangLuckyBreeze}from'./src/components/omniwarp/BigBangLuckyBreeze';
import{BigBangCloverWind}from'./src/components/omniwarp/BigBangCloverWind';
import{BigBangStarTrail}from'./src/components/omniwarp/BigBangStarTrail';
function App(){const p=React.useRef({clientX:900,clientY:500}),o=React.useRef({x:900,y:500}),l=React.useRef(null);return <><BigBangExpansionOverlay/><BigBangHorizonOverlay isVisible radialSectorIndex={0} activeHole="whitehole" dragDistance={50} dragAngleDeg={0}/><BigBangLuckyBreeze settling={false}/><BigBangCloverWind settling={false} layerRef={l}/><BigBangStarTrail settling={false} pointerRef={p} originRef={o}/></>};window.mountEffects=()=>createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',alias:{'@':`${process.cwd()}/src`}});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cssFile=(await readdir('dist/assets')).find(f=>/^main-.*\.css$/.test(f));
 await page.setContent('<main class="sites-pinned-main"><div id="duo-content-viewport"></div><div id="duo-lucy-viewport"></div></main><nav class="sites-pinned-sidebar"></nav><div id="root"></div>');
 await page.addStyleTag({content:await readFile('dist/assets/'+cssFile,'utf8')});
 await page.addStyleTag({content:`body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0;display:flex}#duo-content-viewport{width:600px;height:100%;background:rgb(20,30,40)}#duo-lucy-viewport{flex:1;height:100%;background:rgb(3,90,20)}.sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%;background:rgb(90,20,80)}body.swapped .sites-pinned-main{flex-direction:row-reverse}body.portrait .sites-pinned-main{inset:0 0 60px;flex-direction:column}body.portrait #duo-content-viewport,body.portrait #duo-lucy-viewport{width:100%;height:50%;flex:none}body.portrait .sites-pinned-sidebar{top:auto;bottom:0;width:100%;height:60px}`});
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 const baseline=await page.locator('#duo-lucy-viewport').screenshot();
 await page.evaluate(()=>window.mountEffects());
 for(const phase of ['whitehole','blackhole','wormhole']){
  await page.evaluate(phase=>window.dispatchEvent(new CustomEvent('prism:bigbang_commit',{detail:{phase,target:{eventHorizonMode:'whitehole'}}})),phase);
  await page.waitForTimeout(100);
  assert.deepEqual(await page.locator('#duo-lucy-viewport').screenshot(),baseline,'Effects must not change any Lucy pixels');
 }
 for(const mode of ['landscape','swapped','portrait','folded']){
  if(mode==='portrait') await page.setViewportSize({width:800,height:1200});
  if(mode==='folded') await page.setViewportSize({width:393,height:852});
  await page.evaluate(mode=>{
   document.body.className=mode==='swapped'?'swapped':mode==='portrait'?'portrait':'';
   if(mode==='folded'){document.getElementById('duo-content-viewport').removeAttribute('id');document.getElementById('duo-lucy-viewport').remove();}
  },mode);
  await page.waitForTimeout(100);
  const expected=await page.locator(mode==='folded'?'.sites-pinned-main':'#duo-content-viewport').boundingBox();
  const layers=await page.locator('[data-bigbang-effect-viewport]').all();assert(layers.length>=4);
  for(const layer of layers){assert.deepEqual(await layer.boundingBox(),expected,mode);assert.equal(await layer.evaluate(e=>getComputedStyle(e).pointerEvents),'none');}
  if(mode!=='folded') {
   // Verify no effect can paint over Lucy in either swapped or stacked layouts.
   await page.locator('[data-bigbang-effect-viewport]').evaluateAll(es=>es.forEach(e=>e.style.visibility='hidden'));
   const clean=await page.locator('#duo-lucy-viewport').screenshot();
   await page.locator('[data-bigbang-effect-viewport]').evaluateAll(es=>es.forEach(e=>e.style.visibility='visible'));
   assert.deepEqual(await page.locator('#duo-lucy-viewport').screenshot(),clean,'Lucy pixels remain untouched in '+mode);
  }
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: all Big Bang effects fit content in landscape/swapped/portrait/folded; whitehole/blackhole/wormhole leave Lucy pixels unchanged; effects never capture input');
}finally{await browser.close();}
