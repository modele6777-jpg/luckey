import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?(process.env.LUCKEY_WEBKIT_EXECUTABLE?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{}):{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
const base=process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4173';
try{
 const page=await browser.newPage({viewport:{width:1200,height:900},hasTouch:true,...(safari?{isMobile:true}:{})});
 await page.addInitScript(()=>{
  const d=new Date(),today=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  localStorage.setItem('lu_unlocked_date',today);sessionStorage.setItem('pwa_prompt_dismissed','true');sessionStorage.setItem('profileModalDismissed','1');
  localStorage.setItem('lucy_daily_first_entry_date_v1',today);localStorage.setItem('lucy_daily_first_visit_done_date_v1',today);localStorage.setItem('lucy_chat_auto_tts','false');
  const now=Date.now();const history=Array.from({length:36},(_,i)=>({id:`latest-${i}`,role:i%2?'model':'user',persona:'lucy',channel:'lucy',content:(`최근 대화 검증 ${i}번째 메시지입니다. 오늘의 생각과 감정을 나누고 다음 선택을 돌아봅니다.\n`).repeat(10),timestamp:now-(36-i)*60000}));
  localStorage.setItem('chat_history_unified_v3',JSON.stringify(history));
 });
 await page.goto(base+'/chat');const messages=page.locator('.lucy-chat-main');await messages.waitFor({state:'visible',timeout:30000});
 const bottom=async()=>{await page.waitForFunction(()=>{const e=document.querySelector('.lucy-chat-main');return e&&e.scrollHeight-e.clientHeight>1000&&e.scrollHeight-e.clientHeight-e.scrollTop<3;}).catch(async error=>{console.log(await messages.evaluate(e=>({top:e.scrollTop,height:e.clientHeight,content:e.scrollHeight,box:e.getBoundingClientRect().toJSON(),pane:e.closest('[data-workspace-pane]').getAttribute('style')})));throw error;});};
 await bottom();
 // Layout changes must not be misclassified as scrolling into history.
 await messages.evaluate(e=>{const extra=document.createElement('div');extra.style.height='450px';extra.dataset.layoutFixture='true';e.firstElementChild.append(extra);});
 await bottom();
 await page.setViewportSize({width:1200,height:700});await bottom();
 await page.waitForTimeout(250);
 await messages.evaluate(e=>{e.scrollTop=500;e.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await page.getByRole('button',{name:'최근대화',exact:true}).waitFor({state:'visible'});
 const manual=await messages.evaluate(e=>e.scrollTop);
 await messages.evaluate(e=>{const extra=document.createElement('div');extra.style.height='200px';e.firstElementChild.append(extra);});
 await page.waitForTimeout(300);assert(Math.abs(await messages.evaluate(e=>e.scrollTop)-manual)<3,'Reading older messages is not pulled to the bottom');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('prism:scroll_to_top')));
 await page.waitForFunction(()=>document.querySelector('.lucy-chat-main')?.scrollTop<2);
 // Same-count saved history can have a newer final pair. BFCache return restores it.
 await page.evaluate(()=>{const old=JSON.parse(localStorage.getItem('chat_history_unified_v3'));const now=Date.now();old.splice(-2,2,{id:'saved-return-user',role:'user',persona:'lucy',content:'복귀 전 최신 질문',timestamp:now-1000},{id:'saved-return-answer',role:'model',persona:'lucy',content:'최신 복귀 검증 답변입니다.',timestamp:now-500});localStorage.setItem('chat_history_unified_v3',JSON.stringify(old));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
 await messages.getByText('최신 복귀 검증 답변입니다.',{exact:true}).waitFor({state:'visible'});await bottom();
 await page.waitForTimeout(250);
 await messages.evaluate(e=>{e.scrollTop=0;e.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.testVisibility||'visible'});window.testVisibility='hidden';document.dispatchEvent(new Event('visibilitychange'));window.testVisibility='visible';document.dispatchEvent(new Event('visibilitychange'));});
 await bottom();
 // Selecting Lucy again on the same route is also a fresh entry.
 await page.waitForTimeout(250);await messages.evaluate(e=>{e.scrollTop=0;e.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('nav-click-active',{detail:{path:'/chat'}})));await bottom();
 // A retained pane must also reveal its latest end after being hidden.
 await page.waitForTimeout(250);await messages.evaluate(e=>{e.scrollTop=0;e.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await page.locator('[data-workspace-pane="lucy"]').evaluate(e=>e.style.setProperty('display','none','important'));await page.waitForTimeout(100);
 assert.equal(await messages.evaluate(e=>e.getBoundingClientRect().height),0,'Pane really becomes hidden');
 await page.locator('[data-workspace-pane="lucy"]').evaluate(e=>e.style.removeProperty('display'));await bottom();
 assert.equal(await messages.getByText('최신 복귀 검증 답변입니다.',{exact:true}).count(),1);
 console.log('PASS: latest history on entry/return/reveal, delayed content and viewport bottom-follow, same-count saved updates, manual history reading and top control preserved');
}finally{await browser.close();}
