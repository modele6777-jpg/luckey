import {build} from 'esbuild';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{BigBangLuckyBreeze}from'./src/components/omniwarp/BigBangLuckyBreeze';createRoot(document.getElementById('root')).render(<BigBangLuckyBreeze settling={false}/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife'});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 await page.setContent('<style>body{margin:0}.fixed{position:fixed}.inset-0{inset:0}.absolute{position:absolute}.pointer-events-none{pointer-events:none}</style><div id="root"></div>');
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 for(const size of [{width:1200,height:900},{width:800,height:1200},{width:393,height:852}]) {
  await page.setViewportSize(size);await page.waitForTimeout(300);
  const root=page.locator('[data-bigbang-lucky-breeze-fullscreen]');
  assert.deepEqual(await root.boundingBox(),{x:0,y:0,...size});
  assert.equal(await root.evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  const visible=await root.evaluate(element=>Array.from(element.children).filter(leaf=>{
   const r=leaf.getBoundingClientRect();return +getComputedStyle(leaf).opacity>0.05&&r.right>innerWidth/2&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;
  }).length);
  assert(visible>0,'Visible clovers must reach the Lucy half of the full display');
 }
 console.log('PASS: clovers span the full display in unfolded landscape/portrait and folded mode, remain visible in Lucy half, and never capture input');
}finally{await browser.close();}
