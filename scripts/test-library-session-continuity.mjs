import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?(process.env.LUCKEY_WEBKIT_EXECUTABLE?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{}):{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
const base=process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4173';
try{
 const page=await browser.newPage({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
 await page.addInitScript(()=>{const d=new Date();localStorage.setItem('lu_unlocked_date',`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);sessionStorage.setItem('pwa_prompt_dismissed','true');sessionStorage.setItem('profileModalDismissed','1');});
 await page.goto(base+'/chat');await page.locator('.lucy-chat-footer').waitFor({state:'visible',timeout:30000});
 for(const kind of ['engine','prompt']){
  const trigger=kind==='engine'?page.getByRole('button',{name:/Lucy 엔진과 관점 목록/}):page.getByRole('button',{name:'추천질문 라이브러리 열기'});
  await trigger.first().tap();
  const selector=kind==='engine'?'#lucy-engine-catalog-dialog':'#hori-prompt-library-dialog';
  const dialog=page.locator(selector);await dialog.waitFor({state:'visible'});
  if(kind==='engine') await dialog.getByRole('button',{name:/^심층 관점/}).first().tap();
  await dialog.locator('input').first().fill('사주');
  await dialog.locator('input').first().blur();
  if(kind==='engine') await dialog.locator('[data-testid=lucy-engine-catalog-list][aria-busy=false]').waitFor({state:'visible'});
  await dialog.evaluate(e=>{window.savedLibrary=e;e.querySelector('.chat-library-scroll').scrollTop=100;});
  for(const size of [{width:626,height:890},{width:890,height:626},{width:393,height:852},{width:1200,height:900}]){
   await page.setViewportSize(size);await page.waitForTimeout(300);
   await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.evaluate(e=>e===window.savedLibrary),true,'Ordinary folding retains the same dialog DOM');
   assert.equal(await dialog.locator('input').first().inputValue(),'사주');
  }
  // Safari can restore a page rather than just resize it. The tab snapshot must
  // recover the open popup and its controls even when React is mounted anew.
  await page.reload();await dialog.waitFor({state:'visible',timeout:30000});
  assert.equal(await dialog.locator('input').first().inputValue(),'사주','Search survives page restoration');
  if(kind==='engine') assert.equal(await dialog.getByRole('button',{name:/^심층 관점/}).first().getAttribute('aria-pressed'),'true');
  if(kind==='engine') await dialog.locator('[data-testid=lucy-engine-catalog-list][aria-busy=false]').waitFor({state:'visible'});
  await page.waitForTimeout(250);
  assert(await dialog.locator('.chat-library-scroll').evaluate(e=>e.scrollTop>0),'Reading position restores');
  if(kind==='prompt'){
   await dialog.locator('input').first().fill('');
   await dialog.getByTitle('다음 페이지',{exact:true}).tap();
   await page.reload();await dialog.waitFor({state:'visible',timeout:30000});
   assert.match(await dialog.locator('.chat-library-pagination').innerText(),/2\s*\/\s*13/,'Question page restores');
  }
  await page.getByRole('button',{name:kind==='engine'?'엔진 목록 닫기':'닫기',exact:true}).last().tap();
  await dialog.waitFor({state:'detached'});
  await page.reload();await page.locator('.lucy-chat-footer').waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator(selector).count(),0,'Explicitly closed popup stays closed after restoration');
  await page.setViewportSize({width:393,height:852});await page.waitForTimeout(250);
 }
 console.log('PASS: folded-first engine/question dialogs retain DOM on unfold/refold, restore open/search/filter/page/scroll after page recreation, and remain closed after explicit close');
}finally{await browser.close();}
