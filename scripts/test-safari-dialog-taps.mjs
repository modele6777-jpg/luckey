import {build} from 'esbuild';
import {webkit,chromium} from '@playwright/test';
import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const fixture=`
import React from 'react';import{createRoot}from'react-dom/client';
import{DialogTriggerButton}from'./src/components/layout/DialogTriggerButton';
import{OverlayPaneContext}from'./src/components/layout/OverlayPaneContext';
import{LucyEngineCatalogDialog}from'./src/components/chat/LucyEngineCatalogDialog';
import{PromptLibraryModal}from'./src/components/chat/PromptLibraryModal';
function App(){const[open,set]=React.useState(null);const Button=window.legacy?'button':DialogTriggerButton;return <OverlayPaneContext.Provider value="lucy"><Button id="engine" onPointerDown={window.legacy?e=>e.preventDefault():undefined} onClick={()=>{window.activations++;set('engine')}}>Engine</Button><Button id="prompt" onClick={()=>{window.activations++;set('prompt')}}>Questions</Button><LucyEngineCatalogDialog isOpen={open==='engine'} isLight onClose={()=>set(null)}/><PromptLibraryModal isOpen={open==='prompt'} onClose={()=>set(null)} onSelectPrompt={()=>{}}/></OverlayPaneContext.Provider>}createRoot(document.getElementById('root')).render(<App/>);`;
const bundle=await build({stdin:{contents:fixture,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',loader:{'.css':'empty'},alias:{'@':process.cwd()+'/src'}});
const useChromium=process.env.LUCKEY_TEST_BROWSER==='chromium';
const browser=await(useChromium?chromium:webkit).launch({headless:true,...(useChromium?{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}:process.env.LUCKEY_WEBKIT_EXECUTABLE?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{})});
try{
 const css=(await readdir('dist/assets')).find(f=>/^main-.*\.css$/.test(f));
 for(const legacy of [true,false]){
  const page=await browser.newPage({viewport:{width:1200,height:900},isMobile:true,hasTouch:true});
  await page.setContent('<style>body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0;display:flex}#duo-content-viewport{width:600px;height:100%}#duo-lucy-viewport{flex:1;height:100%}.sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%}#engine,#prompt{padding:15px;background:white}</style><main class="sites-pinned-main"><div id="duo-content-viewport"></div><div id="duo-lucy-viewport"><div id="root"></div></div></main><nav class="sites-pinned-sidebar"></nav>');
  await page.addStyleTag({content:await readFile('dist/assets/'+css,'utf8')});
  await page.evaluate(legacy=>{window.legacy=legacy;window.activations=0;window.suppressClick=true;document.addEventListener('click',e=>{if(window.suppressClick&&e.target.closest('#engine,#prompt')){e.preventDefault();e.stopImmediatePropagation();}},true);},legacy);
  await page.addScriptTag({content:bundle.outputFiles[0].text});
  await page.locator('#engine').tap();
  if(legacy){assert.equal(await page.locator('[role=dialog]').count(),0,'Reproduce missing compatibility click');await page.close();continue;}
  await page.locator('#lucy-engine-catalog-dialog').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>window.activations),1,'Touch activates without click');
  // A compatibility click retargeted to the newly inserted backdrop is ignored.
  await page.locator('.duo-portal > .fixed').dispatchEvent('click',{bubbles:true,detail:1});
  assert.equal(await page.locator('#lucy-engine-catalog-dialog').count(),1);
  await page.getByRole('button',{name:'엔진 목록 닫기',exact:true}).tap();
  await page.locator('[role=dialog]').waitFor({state:'detached'});
  await page.locator('#prompt').tap();
  await page.locator('#hori-prompt-library-dialog').waitFor({state:'visible'});
  await page.locator('.prompt-library-action').first().dispatchEvent('click',{bubbles:true,detail:1});
  assert.equal(await page.locator('#hori-prompt-library-dialog').count(),1,'Opening click cannot select a card and close the library');
  // A fresh tap on the backdrop still dismisses normally.
  const overlay=await page.locator('#hori-prompt-library-modal-backdrop').boundingBox();
  await page.touchscreen.tap(overlay.x+2,overlay.y+2);
  await page.locator('[role=dialog]').waitFor({state:'detached'});
  // Compatibility click and keyboard paths remain supported without duplication.
  await page.evaluate(()=>window.suppressClick=false);
  const before=await page.evaluate(()=>window.activations);
  await page.locator('#engine').tap();
  await page.locator('#lucy-engine-catalog-dialog').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>window.activations),before+1);
  await page.keyboard.press('Escape');await page.locator('[role=dialog]').waitFor({state:'detached'});
  await page.locator('#prompt').focus();await page.keyboard.press('Enter');
  await page.locator('#hori-prompt-library-dialog').waitFor({state:'visible'});
  await page.keyboard.press('Escape');await page.locator('[role=dialog]').waitFor({state:'detached'});
  await page.locator('#engine').dispatchEvent('pointerdown',{pointerId:3,pointerType:'touch',isPrimary:true,button:0,clientX:650,clientY:20});
  await page.locator('#engine').dispatchEvent('pointercancel',{pointerId:3,pointerType:'touch'});
  await page.locator('#engine').dispatchEvent('pointerup',{pointerId:3,pointerType:'touch',clientX:650,clientY:20});
  assert.equal(await page.locator('[role=dialog]').count(),0,'Cancelled gestures never open dialogs');
  await page.close();
 }
 console.log('PASS: touch opens real engine/question dialogs without compatibility click; no double activation or immediate backdrop dismissal; normal backdrop, Escape, keyboard, cancellation preserved');
}finally{await browser.close();}
