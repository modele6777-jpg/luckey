import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:3,hasTouch:true});
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:4175/calm/index.html?no_auto=1');
 await page.setContent('<iframe title="Key" src="http://127.0.0.1:4175/calm/index.html?no_auto=1" style="width:390px;height:700px;border:0"></iframe>');
 const frame=page.frames().find(f=>f.parentFrame());await frame.waitForLoadState('load');await frame.waitForSelector('.studio-ex-card');await page.waitForTimeout(500);for(const id of ["btn-close-studio","btn-close-prescription","btn-close-journal"]){const close=frame.locator("#"+id);if(await close.isVisible())await close.click();}
 for(const width of [390,520,1024]){
  await page.locator('iframe').evaluate((e,w)=>e.style.width=w+'px',width);
  await page.waitForTimeout(600);
  await frame.waitForFunction(()=>parseFloat(document.documentElement.style.getPropertyValue('--key-header-height'))===Math.ceil(document.querySelector('.top-nav').getBoundingClientRect().height));
  const measurements=await frame.evaluate(async()=>{
   const bar=document.querySelector('.view-tabs-container'),header=document.querySelector('.top-nav');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);
   const start=bar.getBoundingClientRect().top+window.scrollY+100;
   const values=[];
   for(let i=0;i<40;i++){window.scrollTo(0,start+i*7.3);await new Promise(requestAnimationFrame);values.push({top:bar.getBoundingClientRect().top,header:header.getBoundingClientRect().bottom,width:bar.getBoundingClientRect().width});}
   return values;
  });
  const tops=measurements.map(v=>v.top);assert(Math.max(...tops)-Math.min(...tops)<0.6,`Pinned tabs stay stable at ${width}px`);
  assert(measurements.every(v=>Math.abs(v.top-Math.ceil(v.header))<1),`Tabs stay directly below header at ${width}px`);
  assert.equal(await frame.locator('.tab-pill').count(),6);
  await frame.locator('[data-tab="tab-toolbox"]').click();await frame.locator('#tab-toolbox').waitFor({state:'visible'});
  await frame.locator('[data-tab="tab-exercises"]').click();
 }
 console.log('PASS: Key tabs stay stationary below header during fractional scrolling and iframe resizing; all six tabs remain usable');
}finally{await browser.close();}
