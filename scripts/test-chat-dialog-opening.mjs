import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Use the actual dialogs and trigger. A blur-induced layout shift models the
// composer moving when a mobile keyboard closes between pointerdown and click.
const fixture = `
import React from 'react';
import {createRoot} from 'react-dom/client';
import {DialogTriggerButton} from './src/components/layout/DialogTriggerButton';
import {OverlayPaneContext} from './src/components/layout/OverlayPaneContext';
import {LucyEngineCatalogDialog} from './src/components/chat/LucyEngineCatalogDialog';
import {PromptLibraryModal} from './src/components/chat/PromptLibraryModal';
function App(){
 const[open,setOpen]=React.useState(null),[blurred,setBlurred]=React.useState(false);
 const Button=window.legacy?'button':DialogTriggerButton;
 return <OverlayPaneContext.Provider value="lucy">
  <textarea aria-label="composer" onFocus={()=>setBlurred(false)} onBlur={()=>setBlurred(true)}/>
  <div style={{position:'absolute',top:blurred?'220px':'340px'}}>
   <Button id="engine" onClick={()=>setOpen('engine')}>Engine</Button>
   <Button id="prompt" onClick={()=>setOpen('prompt')}>Questions</Button>
  </div>
  <LucyEngineCatalogDialog isOpen={open==='engine'} isLight={true} onClose={()=>setOpen(null)}/>
  <PromptLibraryModal isOpen={open==='prompt'} onClose={()=>setOpen(null)} onSelectPrompt={()=>{}}/>
 </OverlayPaneContext.Provider>;
}
createRoot(document.getElementById('root')).render(<App/>);
`;
const bundle = await build({ stdin:{contents:fixture,resolveDir:process.cwd(),loader:'tsx'}, bundle:true,write:false,format:'iife',loader:{'.css':'empty'},alias:{'@':`${process.cwd()}/src`} });
const cssFile = (await readdir('dist/assets')).find(name=>/^main-.*\.css$/.test(name));
const css = await readFile(`dist/assets/${cssFile}`,'utf8');
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 for(const legacy of [true,false]) {
  const page=await browser.newPage({viewport:{width:1200,height:900},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<style>body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0;display:flex}#duo-content-viewport{width:600px;height:100%}#duo-lucy-viewport{position:relative;flex:1;height:100%}.sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%}#engine,#prompt{padding:12px;background:#fff;border:1px solid}textarea{background:white}body.portrait .sites-pinned-main{inset:0 0 60px;flex-direction:column}body.portrait #duo-content-viewport,body.portrait #duo-lucy-viewport{width:100%;height:50%;flex:none}body.portrait .sites-pinned-sidebar{top:auto;bottom:0;width:100%;height:60px}</style><main class="sites-pinned-main"><div id="duo-content-viewport"></div><div id="duo-lucy-viewport"><div id="root"></div></div></main><nav class="sites-pinned-sidebar"></nav>');
  await page.addStyleTag({content:css});
  await page.evaluate(value=>window.legacy=value,legacy);
  await page.addScriptTag({content:bundle.outputFiles[0].text});
  await page.locator('textarea').focus();
  await page.locator('#engine').click();
  if(legacy) {
   assert.equal(await page.locator('[role=dialog]').count(),0,'Native click must reproduce loss after blur moves the trigger');
   console.log('Reproduced: blur during pointer press moves the native trigger and loses its click');
   await page.close();continue;
  }
  const engine=page.locator('#lucy-engine-catalog-dialog');
  await engine.waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'엔진 목록 닫기');
  await page.keyboard.press('Escape');await engine.waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>document.activeElement.id),'engine');
  for(let i=0;i<5;i++)for(const kind of ['engine','prompt']) {
   await page.locator('textarea').focus();
   await page.locator('#'+kind).tap();
   const dialog=page.locator(kind==='engine'?'#lucy-engine-catalog-dialog':'#hori-prompt-library-dialog');
   await dialog.waitFor({state:'visible'});
   await page.waitForTimeout(230);
   const rect=await dialog.boundingBox();assert(rect.x>=600&&rect.x+rect.width<=1120&&rect.height>100);
   await page.getByRole('button',{name:kind==='engine'?'엔진 목록 닫기':'닫기',exact:true}).click();
   await dialog.waitFor({state:'detached'});
   assert.equal(await page.evaluate(()=>document.activeElement.id),kind);
  }
  await page.locator('#prompt').focus();await page.keyboard.press('Enter');
  await page.locator('#hori-prompt-library-dialog').waitFor({state:'visible'});
  await page.setViewportSize({width:800,height:900});
  await page.evaluate(()=>document.body.className='portrait');
  await page.waitForTimeout(300);
  const rect=await page.locator('#hori-prompt-library-dialog').boundingBox();
  assert(rect.y>=420&&rect.y+rect.height<=840,'Portrait popup must fit its source pane above the menu');
  await page.keyboard.press('Escape');await page.locator('[role=dialog]').waitFor({state:'detached'});
  assert.deepEqual(errors,[]);
  console.log('PASS: real engine/question dialogs, focused-composer taps, repeat open/close, focus restoration, keyboard activation, Escape, portrait pane bounds');
  await page.close();
 }
} finally {await browser.close();}
