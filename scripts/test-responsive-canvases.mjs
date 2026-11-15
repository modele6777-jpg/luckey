import {readFile,readdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const cssFile=(await readdir('dist/assets')).find(name=>/^main-.*\.css$/.test(name));const css=await readFile('dist/assets/'+cssFile,'utf8');
 const fixture=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{useContentCanvasCompact}from'./src/hooks/useContentCanvasCompact';function App(){const compact=useContentCanvasCompact(768);return <div id="js-width">{String(compact)}</div>}createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic'});
 const page=await browser.newPage({viewport:{width:1400,height:900}});
 await page.setContent('<main data-workspace-pane="content" data-responsive-canvas="true" style="width:350px"><div id="layout" class="flex flex-col sm:flex-row"></div><div id="grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"><div>A</div><div>B</div><div>C</div></div><div id="root"></div></main><div class="screen-portal" data-responsive-canvas="true" style="position:relative;width:300px"><div id="popup" class="grid grid-cols-1 md:grid-cols-2"><div>A</div><div>B</div></div></div><div id="outside" class="flex flex-col sm:flex-row"></div>');await page.addStyleTag({content:css});await page.addScriptTag({content:fixture.outputFiles[0].text});
 for(const width of [280,390,630,640,768,1100]){
  await page.locator('[data-workspace-pane]').evaluate((element,width)=>element.style.width=width+'px',width);
  await page.waitForFunction(({width})=>document.querySelector('#js-width')?.textContent===String(width<768),{width});
  assert.equal(await page.locator('#layout').evaluate(e=>getComputedStyle(e).flexDirection),width<640?'column':'row');
  assert.equal(await page.locator('#grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),width<768?1:width<1024?2:3);
  assert.equal(await page.locator('#popup').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),1,'Popup uses its own width');
  assert.equal(await page.locator('#outside').evaluate(e=>getComputedStyle(e).flexDirection),'row','Global navigation still uses the window width');
 }
 console.log('PASS: CSS and JS use each canvas width for folded/split/large layouts; popup bounds are independent');
}finally{await browser.close();}
