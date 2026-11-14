import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const fixture = `
import React from 'react';
import {createRoot} from 'react-dom/client';
import {ScreenPortal} from './src/components/layout/ScreenPortal';
import {WorkspacePortal} from './src/components/layout/DuoWorkspace';
import {OverlayPaneContext} from './src/components/layout/OverlayPaneContext';
import {rememberOverlayPane} from './src/lib/overlayPane';
document.addEventListener('click', e=>rememberOverlayPane(e.target), true);
function Dialog({name,close}) {
 const [nested,setNested]=React.useState(false);
 return <WorkspacePortal onClose={close}>
  <div className="fixed inset-0 backdrop" data-dialog={name}>
   <section role="dialog" className="panel max-h-[92vh]">
    <button data-close={name} onClick={close}>Close</button>
    <button data-nest={name} onClick={()=>setNested(true)}>Nested</button>
    <div className="long">Long content</div>
   </section>
   {nested&&<ScreenPortal><div id="tarot-stage-container" className="fixed inset-0 nested"><button data-nested-close={name} onClick={()=>setNested(false)}>Close nested</button></div></ScreenPortal>}
  </div>
 </WorkspacePortal>;
}
function Pane({name}) {
 const [open,setOpen]=React.useState(false);
 return <OverlayPaneContext.Provider value={name}>
  <button data-open={name} onClick={()=>setOpen(true)}>Open {name}</button>
  <button data-global={name} onClick={()=>window.openGlobal()}>Global {name}</button>
  {open&&<Dialog name={name} close={()=>setOpen(false)}/>}
 </OverlayPaneContext.Provider>;
}
function Global(){const[open,set]=React.useState(false);window.openGlobal=()=>set(true);return <ScreenPortal>{open&&<div data-dialog="global" className="fixed inset-0"><button id="global-close" onClick={()=>set(false)}>Close</button></div>}</ScreenPortal>}
createRoot(document.getElementById('content-root')).render(<Pane name="content"/>);
createRoot(document.getElementById('lucy-root')).render(<Pane name="lucy"/>);
createRoot(document.getElementById('global-root')).render(<Global/>);
document.getElementById('floating').onclick=()=>window.openGlobal();
`;
const bundle = await build({ stdin: { contents: fixture, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, format: 'iife', alias: { '@': `${process.cwd()}/src` } });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.setContent(`<style>
    body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0;display:flex}
    .sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%;z-index:200}
    #duo-content-viewport,#duo-lucy-viewport{width:50%;height:100%}
    body.swapped .sites-pinned-main{flex-direction:row-reverse}
    body.portrait .sites-pinned-main{inset:0 0 60px;flex-direction:column}
    body.portrait #duo-content-viewport,body.portrait #duo-lucy-viewport{width:100%;height:50%}
    body.portrait .sites-pinned-sidebar{top:auto;bottom:0;width:100%;height:60px}
    .fixed{position:fixed}.inset-0{inset:0}.backdrop{display:flex;background:#0008}.nested{background:#888}
    .panel{height:88vh;width:100%;max-height:92vh;overflow:auto;background:white}.long{height:1600px}
  </style><main class="sites-pinned-main"><div id="duo-content-viewport"><div id="content-root"></div></div><div id="duo-lucy-viewport"><div id="lucy-root"></div></div></main><nav class="sites-pinned-sidebar"><button id="nav" onclick="window.navClicks=(window.navClicks||0)+1">Menu</button></nav><div id="global-root"></div><button id="floating" style="position:fixed;right:90px;bottom:5px;z-index:50">Floating global</button>`);
  // Include the legacy ID rules which previously positioned tarot in device coordinates.
  await page.addStyleTag({ content: (await readFile('src/index.css','utf8')).split('}').filter(rule=>rule.includes('#tarot-stage-container')).map(rule=>rule+'}').join('\n') });
  await page.addStyleTag({ content: await readFile('src/styles/duo-workspace.css','utf8') });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const box = async (selector, expected) => {
    await page.waitForFunction(({selector,expected})=>{
      const rect=document.querySelector(selector)?.getBoundingClientRect();
      return rect&&Object.entries(expected).every(([k,v])=>Math.abs(rect[k]-v)<1);
    }, {selector,expected});
    assert.deepEqual(await page.locator(selector).boundingBox(),expected,selector);
  };
  await page.locator('[data-open=content]').click();
  await box('[data-dialog=content]',{x:0,y:0,width:560,height:800});
  // The other pane remains usable with an independent popup open.
  await page.locator('[data-open=lucy]').click();
  await box('[data-dialog=lucy]',{x:560,y:0,width:560,height:800});
  await page.locator('[data-nest=content]').click();
  await box('.nested',{x:0,y:0,width:560,height:800});
  await page.locator('[data-nested-close=content]').click();
  await page.locator('[data-close=content]').click();
  await page.locator('[data-close=lucy]').click();
  // Persistent global portals must recapture the initiating pane on every opening.
  for(const [pane,x] of [['content',0],['lucy',560],['content',0]]) {
    await page.locator('[data-global='+pane+']').click();
    await box('[data-dialog=global]',{x,y:0,width:560,height:800});
    await page.locator('#global-close').click();
  }
  await page.locator('#floating').click();
  await box('[data-dialog=global]',{x:560,y:0,width:560,height:800});
  await page.locator('#global-close').click();
  await page.locator('[data-open=lucy]').click();
  await page.evaluate(()=>document.body.classList.add('swapped'));
  await box('[data-dialog=lucy]',{x:0,y:0,width:560,height:800});
  await page.setViewportSize({width:800,height:1200});
  await page.evaluate(()=>{document.body.className='portrait';document.documentElement.className='duo-unfolded-portrait'});
  await box('[data-dialog=lucy]',{x:0,y:570,width:800,height:570});
  await page.locator('[data-nest=lucy]').click();
  await box('.nested',{x:0,y:570,width:800,height:570});
  await page.locator('[data-nested-close=lucy]').click();
  await page.setViewportSize({width:800,height:600});
  await box('[data-dialog=lucy]',{x:0,y:270,width:800,height:270});
  const panel=await page.locator('[data-dialog=lucy] .panel').boundingBox();
  assert(panel.height<=238 && panel.y>=270 && panel.y+panel.height<=540);
  await page.locator('[data-nest=lucy]').focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.close),'lucy');
  await page.locator('#nav').click();
  assert.equal(await page.evaluate(()=>window.navClicks),1);
  await page.locator('[data-close=lucy]').click();
  // Folded layout falls back to all of main, excluding navigation.
  await page.evaluate(()=>{document.body.className='';document.documentElement.className='';document.getElementById('duo-lucy-viewport').style.display='none';document.getElementById('duo-content-viewport').removeAttribute('id')});
  await page.locator('[data-open=content]').click();
  await box('[data-dialog=content]',{x:0,y:0,width:720,height:600});
  await page.locator('[data-close=content]').click();
  await page.evaluate(()=>{document.querySelector('.sites-pinned-main').style.height='0px'});
  await page.locator('[data-open=content]').click({force:true});
  await box('[data-dialog=content]',{x:0,y:0,width:720,height:600});
  assert.deepEqual(errors,[]);
  console.log('PASS: independent pane popups, nested dialogs, global reopen ownership, swapped/portrait/keyboard bounds, scrollable tall dialog, focus, sidebar, folded fallback');
} finally { await browser.close(); }
