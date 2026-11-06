/** Synthetic data only. Run: node --use-env-proxy --use-system-ca --import tsx scripts/eval-lucy-consultations.mts --live */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { LUCY_CONSULTATION_FIXTURES } from '../tests/fixtures/lucy-consultations.ts';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools.ts';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis.ts';
import { buildLucyCriticalFacts, formatLucyCriticalFacts, findCriticalFactConflicts } from '../src/lib/lucyCriticalFacts.ts';
import { reviewLucyReply, findUnsupportedClaims } from '../src/lib/lucyReplyReview.ts';
import { LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, LUCY_REVIEW_MODEL, LUCY_REVIEW_FALLBACK_MODELS, requestWithModelFallback } from '../src/lib/lucyModelPolicy.ts';
import { drawLucyTarotCards, formatTarotMarker } from '../src/utils/tarotDetector.ts';
import { TAROT_NO_DRAW_RULE } from '../src/lib/lucyTarotIntegrity.ts';
import { CALCULATION_HONESTY_RULE } from '../src/lib/divination/calculationAudit.ts';
import { buildChatDivinationContext } from '../src/lib/divination/chatContext.ts';

if (!process.argv.includes('--live')) throw Error('Actual API evaluation requires --live. Uses synthetic profiles and paid model requests.');
const baseUrl=process.env.LUCY_EVAL_BASE_URL || 'https://luckey-flame.vercel.app';
const repeats=Number(process.env.LUCY_EVAL_REPEATS || 2);
const concurrency=Number(process.env.LUCY_EVAL_CONCURRENCY || 4);
const output=process.env.LUCY_EVAL_OUTPUT || 'docs/evals/lucy-consultations-live.json';
await mkdir(dirname(output), { recursive:true });
const previous = process.argv.includes('--resume') ? JSON.parse(await readFile(output, 'utf8')) : { results:[] };
const retained = (previous.results || []).filter((result:any) => result.ok);
const completedKeys = new Set(retained.map((result:any) => `${result.id}:${result.mode}:${result.repeat}`));
const prepared=LUCY_CONSULTATION_FIXTURES.map(fixture=>({...fixture,draw:fixture.drawCount?(previous.results?.find((result:any)=>result.id===fixture.id&&result.draw) ? {source:'app-random' as const,id:'resume-'+fixture.id,drawnAt:1,markers:previous.results.find((result:any)=>result.id===fixture.id&&result.draw).draw} : {
  source:'app-random' as const,id:crypto.randomUUID(),drawnAt:Date.now(),
  markers:drawLucyTarotCards(fixture.drawCount).map(formatTarotMarker).join('\n'),
}):undefined}));
const jobs=prepared.flatMap(fixture=>[false,true].flatMap(master=>Array.from({length:repeats},(_,repeat)=>({fixture,master,repeat:repeat+1}))));
const scheduled = jobs.filter(job => !completedKeys.has(`${job.fixture.id}:${job.master?'master':'normal'}:${job.repeat}`));
const results:any[]=[...retained];
let quotaBlocked=false;
let cursor=0;
async function request(model:string,fallback:readonly string[],messages:any[],timeoutMs:number,maxOutputTokens:number,signal:AbortSignal,reviewMode?:'general'|'master'){
  return requestWithModelFallback(model,fallback,async candidate=>{
    signal.throwIfAborted();
    const res=await fetch(baseUrl+'/api/openai/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:candidate,messages,max_tokens:maxOutputTokens,...(reviewMode?{review_mode:reviewMode}:{})}),
      signal:AbortSignal.any([signal,AbortSignal.timeout(timeoutMs)]),
    });
    if(!res.ok){
      const body=await res.text();
      if(res.status===429||/requests per day|GenerateRequestsPerDay|AI_QUOTA_EXCEEDED/i.test(body))quotaBlocked=true;
      throw Error('Provider HTTP '+res.status+(quotaBlocked?' (quota; evaluation paused)':''));
    }
    const json=await res.json();
    const text=json.choices?.[0]?.message?.content;
    if(typeof text!=='string'||!text.trim())throw Error('Empty provider response');
    return {text,model:json.model};
  });
}
async function run(job:typeof jobs[number]){
 const {fixture,master,repeat}=job;
 const start=Date.now();
 const selection=selectOptimalDivinationTools(fixture.question,[],fixture.profile,master,{allowMaster:master});
 const audit=selection.calculationAudit || [];
 const facts=buildLucyCriticalFacts(audit.some(item=>item.toolId==='saju'&&item.sentToModel&&item.status==='calculated')?calculateDetailedSaju(fixture.profile):null,fixture.draw);
 const event=buildChatDivinationContext({text:fixture.question,selected:selection.selectedTools.map(tool=>tool.id),now:new Date('2026-11-06T09:00:00Z')});
 const evidence=[selection.promptInjection,event.prompt,fixture.draw?`[앱 실제 추첨 기록]\n${fixture.draw.markers}\n카드를 이미 뽑았으며 순서와 정역방향을 지켜 리딩해.`:'',formatLucyCriticalFacts(facts),`[입력 프로필]\n${JSON.stringify(fixture.profile || {})}`].join('\n');
 const models:any[]=[];
 const reviews:any[]=[];
 const attempts:any[]=[];
 let result:any={id:fixture.id,category:fixture.category,question:fixture.question,mode:master?'master':'normal',repeat,draw:fixture.draw?.markers,tools:selection.selectedTools.map(tool=>tool.id),calculated:audit.filter(item=>item.sentToModel&&item.status==='calculated').length,symbolic:audit.filter(item=>item.sentToModel&&item.status==='symbolic').length};
 for(let attempt=1;attempt<=2;attempt++){
   const controller=new AbortController();
   const totalTimer=setTimeout(()=>controller.abort(),master?420000:240000);
   try{
     const generated=await request(master?LUCY_MASTER_MODEL:'gemini-flash-lite-latest',master?LUCY_MASTER_FALLBACK_MODELS:[],[
       {role:'system',content:`너는 루시 상담사야. 한국어 반말로 질문에 직접 답해. 답변은 600자 이내. 실제 제공한 근거만 사용하고 한계와 실천할 행동을 연결해.\n${TAROT_NO_DRAW_RULE}\n${CALCULATION_HONESTY_RULE}\n${evidence}`},
       {role:'user',content:fixture.question},
     ],master?300000:120000,4096,controller.signal);
     models.push(generated.response.model);
     const draft=generated.response.text;
     const draftIssues=[...findUnsupportedClaims(draft,audit),...findCriticalFactConflicts(draft,facts,fixture.question)];
     const final=await reviewLucyReply(draft,{question:fixture.question,evidence,audit,facts,signal:controller.signal,request:async messages=>{
       const reviewed=await request(master?LUCY_MASTER_MODEL:LUCY_REVIEW_MODEL,master?LUCY_MASTER_FALLBACK_MODELS:LUCY_REVIEW_FALLBACK_MODELS,messages,120000,4096,controller.signal,master?'master':'general');
       models.push(reviewed.response.model);
       try{reviews.push(JSON.parse(reviewed.response.text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'')));}catch{}
       return reviewed.response.text;
     }});
     const finalIssues=[...findUnsupportedClaims(final,audit),...findCriticalFactConflicts(final,facts,fixture.question)];
     result={...result,ok:!finalIssues.length,draft,draftIssues,final,finalIssues,attempts,models,reviews,elapsedMs:Date.now()-start};
     break;
   }catch(error){
     attempts.push({attempt,error:String(error)});
     result={...result,ok:false,attempts,models,reviews,elapsedMs:Date.now()-start};
     if(quotaBlocked)break;
   }finally{clearTimeout(totalTimer);}
 }
 results.push(result);
 await writeFile(output,JSON.stringify({timestamp:new Date().toISOString(),baseUrl,repeats,total:jobs.length,completed:results.length,quotaBlocked,results},null,2));
 console.log(JSON.stringify({completed:results.length,total:jobs.length,id:result.id,mode:result.mode,repeat,ok:result.ok,ms:result.elapsedMs,error:result.attempts?.at(-1)?.error}));
}
await Promise.all(Array.from({length:concurrency},async()=>{while(!quotaBlocked&&cursor<scheduled.length){const index=cursor++;await run(scheduled[index]);}}));
const approved=results.filter(r=>r.ok).length;
console.log(JSON.stringify({total:results.length,approved,blocked:results.length-approved,pending:jobs.length-results.length,quotaBlocked,output}));
