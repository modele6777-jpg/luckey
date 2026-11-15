import {chromium, webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await (safari?webkit:chromium).launch({headless:true,...(safari?(process.env.LUCKEY_WEBKIT_EXECUTABLE?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{}):{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
const base=process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4173';
try{
 const page=await browser.newPage({viewport:{width:1200,height:900},...(safari?{isMobile:true,hasTouch:true}:{})});
 await page.addInitScript(()=>{const d=new Date();localStorage.setItem('lu_unlocked_date',`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);sessionStorage.setItem('pwa_prompt_dismissed','true');sessionStorage.setItem('profileModalDismissed','1');});
 await page.goto(base+'/chat');await page.locator('.lucy-chat-footer').waitFor({state:'visible',timeout:30000});
 for(const size of [{width:1200,height:900},{width:626,height:890},{width:890,height:626},{width:800,height:800},{width:800,height:1200},{width:393,height:852}]) {
  await page.setViewportSize(size);await page.waitForTimeout(250);
  for(const kind of ['engine','prompt']) {
   const trigger=(kind==='engine'?page.getByRole('button',{name:/Lucy 엔진과 관점 목록/}):page.getByRole('button',{name:'추천질문 라이브러리 열기'})).first();
   await (safari?trigger.tap():trigger.click());
   const dialog=page.locator(kind==='engine'?'#lucy-engine-catalog-dialog':'#hori-prompt-library-dialog');
   await dialog.waitFor({state:'visible'});
   if(kind==='engine') await dialog.locator('[data-testid=lucy-engine-catalog-list][aria-busy=false]').waitFor({state:'visible'});
   await page.waitForTimeout(250);
   const metrics=await dialog.evaluate(el=>{
    const scroller=el.querySelector('.chat-library-scroll'),r=el.getBoundingClientRect();
    const grid=el.querySelector('.prompt-library-grid');
    return {width:r.width,height:r.height,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollHeight:scroller.clientHeight,columns:grid?getComputedStyle(grid).gridTemplateColumns.split(' ').length:null};
   });
   assert(metrics.scrollWidth<=metrics.clientWidth+2,`${kind} must not overflow horizontally at ${JSON.stringify(size)}`);
   assert(metrics.scrollHeight>=metrics.height*.45,`${kind} must retain usable list space`);
   if(kind==='prompt') assert.equal(metrics.columns,metrics.width>=640?2:1,'Cards use actual dialog width');
   const scroll=dialog.locator('.chat-library-scroll');
   await scroll.evaluate(el=>{el.scrollTop=el.scrollHeight;});
   const last=kind==='engine'?dialog.getByTestId('lucy-engine-catalog-entry').last():dialog.locator('.prompt-library-action').last();
   const lastRect=await last.boundingBox(),scrollRect=await scroll.boundingBox();
   assert(lastRect.y+lastRect.height<=scrollRect.y+scrollRect.height+2,'Last entry remains reachable');
   const close=page.getByRole('button',{name:kind==='engine'?'엔진 목록 닫기':'닫기',exact:true}).last();
   const c=await close.boundingBox(),d=await dialog.boundingBox();
   assert(c.x>=d.x&&c.y>=d.y&&c.x+c.width<=d.x+d.width+1,'Close button stays inside popup');
   await (safari?close.tap():close.click());await dialog.waitFor({state:'detached'});
  }
 }
 console.log('PASS: real engine/question dialogs fit narrow and short panes, keep readable columns and list space, and expose last entries and close controls');
}finally{await browser.close();}
