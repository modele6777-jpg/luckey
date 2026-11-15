import {build} from 'esbuild';
import {chromium,webkit} from '@playwright/test';
import {readdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const fixture=`import React from 'react';import{createRoot}from'react-dom/client';import{LucyLibraryDialogs,LucyLibraryTrigger}from'./src/components/chat/LucyLibraryDialogs';import{OverlayPaneContext}from'./src/components/layout/OverlayPaneContext';import{LUCY_PRO_CATALOG_ENGINES}from'./src/lib/divination/engineCatalog';window.expectedEngines=LUCY_PRO_CATALOG_ENGINES.length;window.parentRenders=0;function Conversation(){window.parentRenders++;const[draft,setDraft]=React.useState('');const select=React.useCallback(text=>setDraft(text),[]);return <OverlayPaneContext.Provider value="lucy"><LucyLibraryTrigger id="engine" stateKey="paint:engine">Engine</LucyLibraryTrigger><LucyLibraryTrigger id="prompt" stateKey="paint:prompt">Questions</LucyLibraryTrigger><div id="conversation">{Array.from({length:80},(_,i)=><p key={i}>Long conversation message {i}: {('Content '.repeat(30))}</p>)}</div><output>{draft}</output><LucyLibraryDialogs sessionKey="paint" isLight onSelectPrompt={select}/></OverlayPaneContext.Provider>}createRoot(document.getElementById('root')).render(<Conversation/>);`;
const bundle=await build({stdin:{contents:fixture,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',loader:{'.css':'empty'},alias:{'@':process.cwd()+'/src'}});
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?(process.env.LUCKEY_WEBKIT_EXECUTABLE?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{}):{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900},isMobile:true,hasTouch:true});
 await page.setContent('<style>body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0;display:flex}#duo-content-viewport{width:600px;height:100%}#duo-lucy-viewport{flex:1;height:100%;overflow:auto}.sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%}#engine,#prompt{padding:12px;background:white}</style><main class="sites-pinned-main"><div id="duo-content-viewport"></div><div id="duo-lucy-viewport"><div id="root"></div></div></main><nav class="sites-pinned-sidebar"></nav>');
 const css=(await readdir('dist/assets')).find(f=>/^main-.*\.css$/.test(f));await page.addStyleTag({content:await readFile('dist/assets/'+css,'utf8')});
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.evaluate(()=>{window.firstPaintEntries=null;window.addEventListener('pointerup',()=>{const frame=()=>{if(document.querySelector('#lucy-engine-catalog-dialog'))window.firstPaintEntries=document.querySelectorAll('[data-testid=lucy-engine-catalog-entry]').length;else requestAnimationFrame(frame)};requestAnimationFrame(frame);},{once:true,capture:true});});
 await page.locator('#engine').tap();await page.locator('#lucy-engine-catalog-dialog').waitFor({state:'visible'});
 await page.waitForFunction(()=>window.firstPaintEntries!==null);
 assert(await page.evaluate(()=>window.firstPaintEntries<window.expectedEngines),'Popup paints before the full engine catalog is created');
 assert.equal(await page.evaluate(()=>window.parentRenders),1,'Opening a library must not rerender the conversation');
 await page.locator('[data-testid=lucy-engine-catalog-list][aria-busy=false]').waitFor({state:'visible'});
 assert.equal(await page.getByTestId('lucy-engine-catalog-entry').count(),await page.evaluate(()=>window.expectedEngines),'All engines remain available after progressive rendering');
 await page.getByRole('button',{name:'엔진 목록 닫기',exact:true}).tap();
 await page.locator('#prompt').tap();await page.locator('#hori-prompt-library-dialog').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>window.parentRenders),1,'Question opening also skips conversation rendering');
 await page.locator('.prompt-library-action').first().tap();await page.locator('#hori-prompt-library-dialog').waitFor({state:'detached'});
 assert((await page.locator('output').innerText()).length>0,'Choosing a question still updates the conversation draft');
 console.log('PASS: dialog shell paints before full engine list, opening either library leaves conversation untouched, all engines load, question selection still works');
}finally{await browser.close();}
