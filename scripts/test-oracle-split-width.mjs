import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const context=await browser.newContext({viewport:{width:630,height:900},screen:{width:1280,height:900},hasTouch:true,userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
 const page=await context.newPage();page.setDefaultTimeout(20000);
 await page.addInitScript(()=>{const d=new Date(),t=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;localStorage.setItem('lu_unlocked_date',t);sessionStorage.setItem('profileModalDismissed','1');sessionStorage.setItem('pwa_prompt_dismissed','true');localStorage.setItem(`trinity_daily_result_guest_${t}`,JSON.stringify({dateKey:t,drawnCard:{id:'major_0',name:'The Fool',nameKo:'바보',type:'major',keywords:['시작'],reversed:false},diagnosis:'### 1. 현재 마음\n새로운 일을 차분히 준비하며 오늘 할 수 있는 작은 행동을 생각해 보세요.'}));});
 await page.route('**/api/**',r=>r.abort());await page.goto((process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4174')+'/trinity?tab=oracle');await page.locator('.oracle-mode-tabs').waitFor({state:'visible'});
 for(const viewport of [{width:630,height:900},{width:390,height:844},{width:520,height:900},{width:1280,height:900},{width:900,height:1280}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(300);
  // Cover-mode navigation may select Lucy on a fold-size change; inspect Oracle in each canvas.
  if (!await page.locator('.oracle-mode-tabs').count()) {
    await page.goto((process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4174')+'/trinity?tab=oracle');
    await page.locator('.oracle-mode-tabs').waitFor({state:'visible'});
  }
  const boxes=await page.locator('.oracle-mode-tabs').evaluate(tabs=>{const card=tabs.closest('.oracle-intro-card'),root=document.querySelector('#duo-content-viewport')||document.querySelector('.channel-page')||document.body;const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width}};return {tabs:rect(tabs),card:rect(card),root:rect(root),viewport:innerWidth,buttons:Array.from(tabs.children).map(rect),scrollWidth:tabs.scrollWidth,clientWidth:tabs.clientWidth};});
  assert.equal(boxes.buttons.length,4);
  assert(boxes.card.left>=-1&&boxes.card.right<=boxes.viewport+1,`Card fits app window ${JSON.stringify(viewport)}: ${JSON.stringify(boxes)}`);
  assert(boxes.tabs.left>=boxes.card.left&&boxes.tabs.right<=boxes.card.right+1,'Mode tabs fit the card');
  assert(boxes.scrollWidth<=boxes.clientWidth+1,'Modes reflow rather than overflowing');
  for(const button of boxes.buttons)assert(button.left>=boxes.tabs.left-1&&button.right<=boxes.tabs.right+1&&button.top>=boxes.tabs.top-1&&button.bottom<=boxes.tabs.bottom+1,'Every mode button is completely inside its container');
 }
 const dailyClose=page.locator('#today-tarot-narration-modal button[title="닫기"]');if(await dailyClose.isVisible())await dailyClose.click();
 await page.locator('.oracle-mode-tabs').getByRole('button',{name:'힐링 (78장)',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.oracle-mode-tabs button')?.className.includes('text-yellow-200') || document.querySelector('#tarot-stage-container'));
 console.log('PASS: all four oracle modes fit narrow iPad windows, unfolded panes and rotation; mode selection remains usable');
}finally{await browser.close();}
