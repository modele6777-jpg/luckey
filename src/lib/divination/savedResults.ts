import type { UserProfile } from '../sharedState';
import type { DivinationToolId } from '../fifteenDivinationTools';
export const LAB_FEATURE = '점술 계산실';
export interface SavedCalculation {
  id:string;app:string;featureName:string;summary:string;timestamp:number;dateKey:string;
  details:{tool:DivinationToolId;value:unknown;question:string;birthKey?:string};
}
export function birthKey(profile?:UserProfile) {
  const b=profile?.basic;
  return JSON.stringify([b?.birthdate||'',b?.birthtime||'',b?.lunarSolar||'solar',!!b?.isLeapMonth,b?.gender||'',b?.birthCity||'']);
}
export function makeSavedCalculation(tool:DivinationToolId,value:unknown,question:string,profile?:UserProfile,now=Date.now()):SavedCalculation {
  return {id:`divination-${now}-${globalThis.crypto.randomUUID()}`,app:'epilogue',featureName:LAB_FEATURE,summary:tool,timestamp:now,dateKey:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date(now)),details:{tool,value,question,birthKey:birthKey(profile)}};
}
export function getSavedCalculations(history:unknown):SavedCalculation[] {
  if (!Array.isArray(history)) return [];
  return history.filter((r):r is SavedCalculation => r?.featureName===LAB_FEATURE&&typeof r.id==='string'&&Number.isFinite(r.timestamp)&&['ziwei','sukuyo','vedic','liuren','qimen','iching'].includes(r.details?.tool)&&r.details?.value&&typeof r.details.value==='object').sort((a,b)=>b.timestamp-a.timestamp);
}
export function savedResultMatchesProfile(record:SavedCalculation,profile?:UserProfile) {
  return !['ziwei','sukuyo','vedic'].includes(record.details.tool) || record.details.birthKey===birthKey(profile);
}
export function buildSavedDivinationPrompt(history:unknown,profile:UserProfile|undefined,selected:readonly DivinationToolId[],text:string) {
  const refersToSaved=/저장|계산실|프로필.*(?:괘|포국|계산)|이전\s*계산/.test(text);
  const records=getSavedCalculations(history).filter(r=>savedResultMatchesProfile(r,profile));
  const latest=new Map<DivinationToolId,SavedCalculation>();
  for(const r of records) if(!latest.has(r.details.tool)&&(selected.includes(r.details.tool)||refersToSaved)) latest.set(r.details.tool,r);
  if (!latest.size) return refersToSaved ? {prompt:'[프로필 저장 자료 없음] 현재 상담 대상과 일치하는 저장 계산 자료가 없어. 아직 저장하지 않았거나 출생정보가 바뀌었을 수 있어. 저장값이 있다고 하거나 새 괘·포국으로 대체하지 말고 프로필 계산실에서 확인하도록 안내해.',reuse:true} : {prompt:'',reuse:false};
  const chosen=[...latest.values()].filter(r=>refersToSaved||['ziwei','sukuyo','vedic'].includes(r.details.tool));
  if(!chosen.length) return {prompt:'',reuse:false};
  return {reuse:refersToSaved,prompt:`[프로필에 저장된 점술 계산 자료]\n아래는 사용자가 계산실에서 생성하고 저장한 자료야. 원래 질문·저장 시각·유파·한계를 지켜서 참조해. 과거 질문의 포국을 새로운 질문의 현재 포국으로 바꾸어 말하지 마. 저장한 자료의 해석 요청이면 새로 뽑거나 포국하지 마. 출생 정보가 바뀐 자료는 제외했어.\n${chosen.map(r=>JSON.stringify({tool:r.details.tool,savedAt:new Date(r.timestamp).toISOString(),originalQuestion:r.details.question,result:r.details.value})).join('\n')}`};
}
