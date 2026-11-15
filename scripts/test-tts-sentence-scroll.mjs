import { build } from 'esbuild';
import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';
const result = await build({stdin:{contents:`
import React,{useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {useSmartScroll} from './src/hooks/useSmartScroll';
import {TTSHighlightMark} from './src/components/common/TTSHighlightedText';
function App(){const ref=useRef(null);const [index,setIndex]=useState(4);window.changeSentence=setIndex;useSmartScroll({containerRef:ref,resumeDelayMs:100});return <div id="viewport" ref={ref} style={{height:400,overflowY:'auto',scrollBehavior:'smooth',overflowAnchor:'none'}}><div style={{height:600}}/>{Array.from({length:24},(_,i)=><div key={i} style={{height:100}}>{i===index?<TTSHighlightMark>Sentence {index}</TTSHighlightMark>:'Other sentence'}</div>)}<div style={{height:600}}/></div>};createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',tsconfig:'tsconfig.json',plugins:[{name:'tts-fixture',setup(b){b.onResolve({filter:/@\/utils\/tts$/},()=>({path:'tts',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`export function useTTSState(){return {isSpeaking:true,currentSentence:'same sentence',activeSentenceIndex:0}}`,loader:'js'}));}}]});
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');await page.addScriptTag({content:result.outputFiles[0].text});
 const centered=()=>page.waitForFunction(()=>{const v=document.getElementById('viewport'),m=v.querySelector('[data-tts-active="true"]');if(!m)return false;const a=v.getBoundingClientRect(),b=m.getBoundingClientRect();return Math.abs((a.top+a.height/2)-(b.top+b.height/2))<3;});
 await centered();
 // Reused marks and fast, alternating sentence updates must never leave an old animation running.
 for(const index of [14,5,20,8]){await page.evaluate(i=>window.changeSentence(i),index);await centered();}
 const top=await page.locator('#viewport').evaluate(e=>e.scrollTop);await page.waitForTimeout(800);assert.equal(await page.locator('#viewport').evaluate(e=>e.scrollTop),top);
 // Real input during automatic positioning pauses tracking, then resumes the latest sentence.
 await page.locator('#viewport').dispatchEvent('pointerdown',{pointerType:'touch'});await page.evaluate(()=>window.changeSentence(18));await page.waitForTimeout(40);assert.equal(await page.locator('#viewport').evaluate(e=>e.scrollTop),top);await centered();
 console.log('PASS: every committed sentence centers immediately, rapid changes stay stable, manual override resumes');
}finally{await browser.close();}
