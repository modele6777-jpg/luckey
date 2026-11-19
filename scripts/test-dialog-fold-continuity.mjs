import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const base=process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4173';
try {
 const page=await browser.newPage({viewport:{width:1200,height:900},hasTouch:true});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  const d=new Date();localStorage.setItem('lu_unlocked_date',`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  sessionStorage.setItem('pwa_prompt_dismissed','true');sessionStorage.setItem('profileModalDismissed','1');
 });
 await page.goto(base+'/chat');
 await page.locator('.lucy-chat-footer textarea').first().waitFor({state:'visible',timeout:30000});
 for(const kind of ['prompt','engine']) {
  const trigger=kind==='engine'?page.getByRole('button',{name:/^엔진함 열기/}):page.getByRole('button',{name:'추천질문 라이브러리 열기'});
  await trigger.first().tap();
  const selector=kind==='engine'?'#lucy-engine-catalog-dialog':'#hori-prompt-library-dialog';
  const dialog=page.locator(selector);await dialog.waitFor({state:'visible'});
  await dialog.locator('input').first().fill('사주');
  if(kind==='engine') await dialog.locator('[data-testid=lucy-engine-catalog-list][aria-busy=false]').waitFor({state:'visible'});
  await page.waitForTimeout(250);
  await dialog.evaluate(element=>{
   window.savedDialog=element;
   window.savedScroll=element.querySelector('[data-testid="lucy-engine-catalog-list"]')||element.querySelector('.overflow-y-auto');
   window.savedScroll.scrollTop=100;
   window.savedScrollTop=window.savedScroll.scrollTop;
  });
  const scrollSuffix=kind==='engine'?':engine:scroll':':prompt:scroll';
  await page.waitForFunction(suffix=>{
   const key=Array.from({length:sessionStorage.length},(_,index)=>sessionStorage.key(index)).find(name=>name?.endsWith(suffix));
   return key&&Number(JSON.parse(sessionStorage.getItem(key)||'0'))>0;
  },scrollSuffix,{timeout:5000});
  for(const size of [{width:393,height:852},{width:800,height:1200},{width:1200,height:900},{width:393,height:852},{width:1200,height:900}]) {
   await page.setViewportSize(size);
   await page.waitForFunction(folded=>Boolean(document.querySelector('#duo-lucy-viewport'))!==folded,size.width<540);
   await page.waitForTimeout(250);
   assert.equal(await dialog.count(),1,kind+' popup must remain open');
   assert.equal(await dialog.evaluate(element=>element===window.savedDialog),true,'Dialog DOM identity must survive folding');
   assert.equal(await dialog.locator('input').first().inputValue(),'사주','Search state must survive folding');
   assert.equal(await page.evaluate(()=>window.savedScroll.isConnected),true,'Scroll element stays mounted');
   // Native scroll anchoring can adjust pixels as text reflows at a new width.
   // The same scroller must remain mounted and keep its reading position off the top.
   if (await page.evaluate(()=>window.savedScrollTop > 0)) assert(await page.evaluate(()=>window.savedScroll.scrollTop > 0),'List must not reset to its start');
   const bounds=await dialog.evaluate(element=>{
    const portal=element.closest('[data-overlay-pane]'),r=portal.getBoundingClientRect();
    const nav=document.querySelector('.sites-pinned-sidebar').getBoundingClientRect();
    const intersects=r.left<nav.right&&r.right>nav.left&&r.top<nav.bottom&&r.bottom>nav.top;
    return {width:r.width,height:r.height,intersects};
   });
   assert(bounds.width>0&&bounds.height>0&&!bounds.intersects,'Popup remains visible and excludes navigation');
  }
  await page.getByRole('button',{name:kind==='engine'?'엔진 목록 닫기':'닫기',exact:true}).last().tap();
  await dialog.waitFor({state:'detached'});
 }
 // A Lucy popup also survives folding while the channel pane is the folded page.
 await page.goto(base+'/key');
 await page.locator('iframe[title="Key"]').waitFor({state:'visible',timeout:30000});
 await page.getByRole('button',{name:/^엔진함 열기/}).tap();
 const engine=page.locator('#lucy-engine-catalog-dialog');await engine.waitFor({state:'visible'});
 await page.locator('iframe[title="Key"]').evaluate(frame=>{window.savedKeyFrame=frame;});
 await page.setViewportSize({width:393,height:852});
 await page.waitForFunction(()=>!document.getElementById('duo-lucy-viewport'));
 await engine.waitFor({state:'visible'});
 assert.equal(await page.locator('iframe[title="Key"]').evaluate(frame=>frame===window.savedKeyFrame),true,'Channel iframe must not remount');
 await page.setViewportSize({width:1200,height:900});
 await engine.waitFor({state:'visible'});
 assert.equal(await engine.count(),1);
 await page.getByRole('button',{name:'엔진 목록 닫기',exact:true}).tap();
 const frame=page.frameLocator('iframe[title="Key"]');
 await page.waitForFunction(()=>typeof document.querySelector('iframe[title="Key"]')?.contentWindow?.startPractice === 'function');
 await page.locator('iframe[title="Key"]').evaluate(element=>{
  const win=element.contentWindow;
  win.startPractice(win.PRACTICE_EXERCISES[0].globalIndex);
  win.savedPractice=win.document.getElementById('modal-practice');
 });
 await frame.locator('#modal-practice').waitFor({state:'visible'});
 await frame.locator('#studio-next-step').click();
 const step=await frame.locator('#studio-body').innerText();
 for(const size of [{width:393,height:852},{width:1200,height:900}]) {
  await page.setViewportSize(size);await page.waitForTimeout(350);
  await frame.locator('#modal-practice').waitFor({state:'visible'});
  assert.equal(await frame.locator('#studio-body').innerText(),step,'Key practice step must survive folding');
  assert.equal(await page.locator('iframe[title="Key"]').evaluate(element=>element.contentWindow.savedPractice===element.contentDocument.getElementById('modal-practice')),true);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: real prompt/engine popups retain DOM, search and scroll across repeated fold/unfold/rotation; hidden Lucy popup and Key iframe survive; navigation excluded');
} finally {await browser.close();}
