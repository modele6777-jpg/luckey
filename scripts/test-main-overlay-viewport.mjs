import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const bundle = await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{ScreenPortal}from'./src/components/layout/ScreenPortal';import{WorkspacePortal}from'./src/components/layout/DuoWorkspace';function App(){const[n,set]=React.useState(false);return <ScreenPortal><div id="tarot-stage-container" className="fixed inset-0 backdrop"><button id="open" onClick={()=>set(true)}>Open</button>{n&&<WorkspacePortal onClose={()=>set(false)}><div className="fixed inset-0 nested"><button id="first">First</button><button id="last">Last</button></div></WorkspacePortal>}</div></ScreenPortal>}createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',alias:{'@':`${process.cwd()}/src`}});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 await page.setContent('<style>body{margin:0}.sites-pinned-main{position:fixed;inset:0 80px 0 0}.sites-pinned-sidebar{position:fixed;right:0;top:0;width:80px;height:100%;z-index:200}.fixed{position:fixed}.inset-0{inset:0}.backdrop{background:#0008}.nested{background:#8888}body.portrait .sites-pinned-main{inset:0}body.portrait .sites-pinned-sidebar{top:auto;bottom:0;width:100%;height:60px}</style><main class="sites-pinned-main"></main><nav class="sites-pinned-sidebar"><button id="nav" onclick="window.navClicks=(window.navClicks||0)+1">Menu</button></nav><div id="root"></div>');
 await page.addStyleTag({content:(await readFile('src/index.css','utf8')).split('}').filter(rule=>rule.includes('#tarot-stage-container')).map(rule=>rule+'}').join('\n')});
 await page.addStyleTag({content:await readFile('src/styles/duo-workspace.css','utf8')});
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 const check=async(width,height)=>{await page.waitForFunction(({width,height})=>{const r=document.querySelector('.screen-portal')?.getBoundingClientRect();return r&&r.width===width&&r.height===height},{width,height});for(const selector of ['.screen-portal','.backdrop',...(await page.locator('.nested').count()?['.duo-portal','.nested']:[])]){const r=await page.locator(selector).boundingBox();assert.deepEqual(r,{x:0,y:0,width,height},selector);}await page.locator('#nav').click();};
 await check(1120,800);
 await page.locator('#open').click();await page.locator('#first').waitFor();await check(1120,800);
 await page.locator('#last').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'first');
 await page.setViewportSize({width:800,height:1200});await page.evaluate(()=>{document.body.classList.add('portrait');document.documentElement.classList.add('duo-unfolded-portrait')});await check(800,1140);
 await page.setViewportSize({width:800,height:600});await check(800,540);
 await page.keyboard.press('Escape');await page.locator('.nested').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.activeElement.id),'open');
 await page.evaluate(()=>{document.body.classList.remove('portrait');document.documentElement.classList.remove('duo-unfolded-portrait');document.documentElement.classList.add('duo-unfolded-landscape','duo-panels-swapped')});await check(720,600);
 assert.equal(await page.evaluate(()=>window.navClicks),5);
 console.log('PASS: main bounds, fixed backdrops, nested stacking/focus, portrait menu, resize, navigation clicks');
}finally{await browser.close();}
