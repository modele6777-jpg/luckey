import {chromium,webkit} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const safari=process.env.LUCKEY_TEST_BROWSER==='webkit';
const browser=await(safari?webkit:chromium).launch({headless:true,...(safari?{executablePath:process.env.LUCKEY_WEBKIT_EXECUTABLE}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']})});
const all=['/prologue?tab=universe','/ecpr','/todo','/mission','/aegis','/trinity?tab=destiny','/trinity?tab=tarot','/trinity?tab=oracle','/trinity?tab=synergy','/orange?tab=secret','/orange?tab=wishingWell','/orange?tab=synergy','/heal?tab=meditation','/heal?tab=oneMinute','/heal?tab=synergy','/bluebird?tab=daily','/bluebird?tab=secretMessage','/bluebird?tab=synergy','/muse?tab=artRecommendation','/muse?tab=roleModel','/muse?tab=synergy','/epilogue?tab=diary','/profile','/chronicle','/library','/handbook','/synergy','/omniwarp','/chat','/key?no_auto=1'];
const routes=process.env.LUCKEY_AUDIT_ROUTES?process.env.LUCKEY_AUDIT_ROUTES.split(','):process.env.LUCKEY_AUDIT_SMOKE?['/prologue?tab=universe','/trinity?tab=destiny','/trinity?tab=oracle','/orange?tab=secret','/heal?tab=meditation','/bluebird?tab=daily','/muse?tab=artRecommendation','/profile','/library','/chat','/key?no_auto=1']:all;
const results=[];
try{
 for(const width of (process.env.LUCKEY_AUDIT_WIDTHS||'390,630').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:true});
  await context.addInitScript(()=>{const d=new Date(),t=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;localStorage.setItem('lu_unlocked_date',t);sessionStorage.setItem('profileModalDismissed','1');sessionStorage.setItem('pwa_prompt_dismissed','true');sessionStorage.setItem('lucy_chat_ready_once','true');localStorage.setItem('lucy_chat_auto_tts','false');const profile={basic:{name:'검증사용자',birthdate:'1994-01-24',birthtime:'12:20',gender:'male',calendar:'solar'},fate:{},psych:{},music:{},art:{}};localStorage.setItem('prism_user_profile',JSON.stringify(profile));});
  const page=await context.newPage();page.setDefaultTimeout(15000);await page.route('**/api/**',r=>r.abort());await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  for(const route of routes){
   try{
    await page.goto((process.env.LUCKEY_TEST_URL||'http://127.0.0.1:4174')+route,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(isChat=>document.querySelector(isChat?'.lucy-chat-main':'[data-app-scroll-root], iframe[title="Key"]'),route.startsWith('/chat'));
    await page.waitForTimeout(250);
    const data=await page.evaluate(()=>{
     const panes=document.querySelectorAll('[data-workspace-pane]');const active=Array.from(panes.length?panes:document.querySelectorAll('[data-responsive-canvas]')).filter(e=>e.getBoundingClientRect().width>1&&e.getBoundingClientRect().height>1);
     const bad=[];
     for(const canvas of active){const bound=canvas.getBoundingClientRect();for(const e of canvas.querySelectorAll('button,input:not([type=hidden]),select,textarea,summary')){
      const r=e.getBoundingClientRect(),style=getComputedStyle(e);if(r.width<2||r.height<2||style.visibility==='hidden'||e.closest('[hidden],[aria-hidden="true"]'))continue;
      if(r.right<=bound.right+2&&r.left>=bound.left-2)continue;
      let accessible=false;for(let p=e.parentElement;p&&p!==canvas;p=p.parentElement){const s=getComputedStyle(p);if((s.overflowX==='auto'||s.overflowX==='scroll')&&p.scrollWidth>p.clientWidth+1){accessible=true;break;}if(p.matches('#tarot-stage-container,[data-card-id]')){accessible=true;break;}}
      if(!accessible)bad.push({tag:e.tagName,text:(e.textContent||e.getAttribute('aria-label')||e.id).trim().slice(0,65),left:Math.round(r.left),right:Math.round(r.right),canvasLeft:Math.round(bound.left),canvasRight:Math.round(bound.right),classes:e.className?.toString().slice(0,150)});
     }}
     return {canvas:active.map(e=>({pane:e.dataset.workspacePane,width:Math.round(e.getBoundingClientRect().width),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth})),bad:bad.slice(0,12)};
    });results.push({width,route,...data});if(data.bad.length)console.log('OVERFLOW',width,route,JSON.stringify(data.bad));
   }catch(error){results.push({width,route,error:error.message.slice(0,200)});console.log('ERROR',width,route,page.url(),error.message.slice(0,100));}
  }
  await context.close();console.log('Finished width',width);
 }
 await writeFile((process.env.LUCKEY_AUDIT_REPORT||'/tmp/app-canvas-audit.json'),JSON.stringify(results,null,2));const bad=results.filter(r=>r.error||r.bad?.length);console.log(JSON.stringify({screens:results.length,failures:bad.length,report:(process.env.LUCKEY_AUDIT_REPORT||'/tmp/app-canvas-audit.json')}));if(bad.length)process.exitCode=1;
}finally{await browser.close();}
