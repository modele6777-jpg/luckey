import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
try{
 const page=await browser.newPage({viewport:{width:1000,height:900},hasTouch:true});
 await page.addInitScript(()=>{
  const d=new Date(),today=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  localStorage.setItem('lu_unlocked_date',today);sessionStorage.setItem('lucy_chat_ready_once','true');sessionStorage.setItem('profileModalDismissed','1');sessionStorage.setItem('pwa_prompt_dismissed','true');
  window.selectionSends=[];window.addEventListener('lucy-inject-message',e=>{window.selectionSends.push(e.detail.prompt);e.stopImmediatePropagation();},true);
 });
 await page.route('**/api/**',r=>r.abort());
 await page.goto((process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4174')+'/chat');await page.locator('.lucy-chat-main').waitFor({timeout:30000});
 page.setDefaultTimeout(15000);
 const send=page.getByLabel('선택한 글을 루시에게 보내기',{exact:true});
 const select=async(kind,text)=>{
  await page.evaluate(({kind,text})=>{
   document.querySelector('#selection-fixture')?.remove();const root=document.createElement('div');root.id='selection-fixture';root.style.cssText='position:fixed;top:200px;left:100px;z-index:999999;background:white;color:black;user-select:text';
   if(kind==='input'){const field=document.createElement('textarea');field.value=text;root.append(field);document.body.append(root);field.focus();field.setSelectionRange(0,text.length);field.dispatchEvent(new Event('select',{bubbles:true}));return;}
   if(kind==='iframe'){const frame=document.createElement('iframe');frame.srcdoc='<p id="text"></p>';root.append(frame);document.body.append(root);frame.onload=()=>{frame.contentDocument.querySelector('#text').textContent=text;frame.contentWindow.focus();const range=frame.contentDocument.createRange();range.selectNodeContents(frame.contentDocument.querySelector('#text'));frame.contentDocument.getSelection().removeAllRanges();frame.contentDocument.getSelection().addRange(range);frame.contentDocument.dispatchEvent(new Event('selectionchange'));};return;}
   const p=document.createElement('p');p.textContent=text;root.append(p);document.body.append(root);const range=document.createRange();range.selectNodeContents(p);getSelection().removeAllRanges();getSelection().addRange(range);document.dispatchEvent(new Event('selectionchange'));
  },{kind,text});await send.waitFor({state:'visible'});
 };
 let expected=0;
 for(const kind of ['body','input','iframe']){
  const text=`${kind}에서 선택한 문장입니다`;await select(kind,text);
  if(kind==='body'){
   const box=await send.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(600);await page.mouse.up();assert.equal(await page.evaluate(()=>window.selectionSends.length),0);assert(!page.url().includes('/key'));
  }
  if(kind==='input'){await page.evaluate(()=>document.documentElement.classList.add('keyboard-open'));await send.waitFor({state:'visible'});}
  await send.click();expected++;await page.waitForFunction(n=>window.selectionSends.length===n,expected);assert((await page.evaluate(()=>window.selectionSends.at(-1))).includes(text));
  await page.evaluate(()=>document.documentElement.classList.remove('keyboard-open'));
 }
 assert.equal(await page.evaluate(()=>window.selectionSends.length),3);
 // Navigate away with Lucy retained, then ensure the queued selection is consumed on return.
 await page.evaluate(()=>{history.pushState(null,'','/key?no_auto=1');window.dispatchEvent(new PopStateEvent('popstate'));});
 await page.locator('iframe[title="Key"]').waitFor({state:'visible'});await page.waitForTimeout(700);
 await select('body','Key 화면에서 루시에게 전달하는 검증 문장');await send.click();
 await page.waitForFunction(()=>window.selectionSends.some(text=>text.includes('Key 화면에서 루시에게 전달하는 검증 문장')) || ((location.pathname==='/'||location.pathname==='/chat') && sessionStorage.getItem('lucy_injected_auto_send')===null));

 console.log('PASS: body, textarea and embedded-page selections send once to Lucy; holds do not open Key; selected input works with keyboard visibility rules');
}finally{await browser.close();}
