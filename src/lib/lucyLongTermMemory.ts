import { selectLucyConversationMemory, formatLucyConversationMemory } from './lucyConversationMemory';
import { safeLocalStorage } from '../utils/safeStorage';
import type { UnifiedMessage } from './chatHistorySync';
export interface LucyMemoryEntry {
  id:string;account:string;scope:'lucy'|'lucy-pro';role:'user'|'assistant';timestamp:number;text:string;
}
export const MAX_LUCY_MEMORY_BYTES=128*1024;
export const MAX_LUCY_MEMORY_ENTRIES=512;
export const lucyMemoryKey=(account:string)=>`lucy_long_term_memory_v1:${encodeURIComponent(account)}`;
const bytes=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).byteLength;
function cleanText(content:UnifiedMessage['content']) {
  const raw=typeof content==='string'?content:Array.isArray(content)?content.filter(p=>p?.type==='text'&&typeof p.text==='string').map(p=>p.text).join('\n'):'';
  return raw.replace(/data:(?:image|audio|application)\/[\w.+-]+;base64,[A-Za-z0-9+/=]+/g,'[첨부 원본 생략]').trim();
}
export function memoryFromMessages(account:string,scope:LucyMemoryEntry['scope'],messages:readonly UnifiedMessage[]):LucyMemoryEntry[] {
  if(!account)return [];
  return messages.flatMap(m=>{
    if(!['user','model','assistant'].includes(m.role)||!Number.isFinite(m.timestamp)||!Number.isFinite(new Date(m.timestamp!).getTime())||/^(greet|greeting)/.test(m.id||''))return [];
    const raw=cleanText(m.content);
    if(!raw||/^(⚠️|\(※|%PDF)/.test(raw))return [];
    const limit=m.role==='user'?900:600;
    // Verbatim beginning/end excerpts, not model-invented facts or a claimed full transcript.
    const text=raw.length>limit?raw.slice(0,Math.floor(limit*.65))+' … '+raw.slice(-Math.floor(limit*.35)):raw;
    return [{id:`${scope}:${m.id||`${m.timestamp}:${m.role}`}`,account,scope,role:m.role==='user'?'user' as const:'assistant' as const,timestamp:m.timestamp!,text}];
  });
}
export function mergeLucyMemory(...sources:unknown[]):LucyMemoryEntry[] {
  const entries=new Map<string,LucyMemoryEntry>();
  for(const source of sources) if(Array.isArray(source)) for(const raw of source) {
    const e=raw as LucyMemoryEntry;
    if(!e||typeof e.id!=='string'||typeof e.account!=='string'||!['lucy','lucy-pro'].includes(e.scope)||!['user','assistant'].includes(e.role)||!Number.isFinite(e.timestamp)||!Number.isFinite(new Date(e.timestamp).getTime())||typeof e.text!=='string'||!e.text.trim())continue;
    const item={id:e.id.slice(0,220),account:e.account.slice(0,180),scope:e.scope,role:e.role,timestamp:e.timestamp,text:cleanText(e.text).slice(0,1200)};
    const key=item.account+'|'+item.id;
    const old=entries.get(key);
    // Deterministic union for concurrent PC/mobile sync, without last-writer data loss.
    if(!old||item.timestamp>old.timestamp||item.timestamp===old.timestamp&&(item.text.length>old.text.length||item.text.length===old.text.length&&item.text>old.text))entries.set(key,item);
  }
  const sorted=[...entries.values()].sort((a,b)=>b.timestamp-a.timestamp||a.account.localeCompare(b.account)||a.id.localeCompare(b.id)).slice(0,MAX_LUCY_MEMORY_ENTRIES);
  const result:LucyMemoryEntry[]=[];let used=2;
  for(const e of sorted){const cost=bytes(e)+(result.length?1:0);if(used+cost>MAX_LUCY_MEMORY_BYTES)break;result.push(e);used+=cost;}
  return result;
}
const forAccount=(value:unknown,account:string)=>Array.isArray(value)?value.filter(e=>e?.account===account):[];
export function readLucyMemory(account:string):LucyMemoryEntry[] {
  try{return mergeLucyMemory(forAccount(JSON.parse(safeLocalStorage.getItem(lucyMemoryKey(account))||'[]'),account));}catch{return [];}
}
export function writeLucyMemory(account:string,entries:unknown):LucyMemoryEntry[] {
  const normalized=mergeLucyMemory(forAccount(entries,account));
  safeLocalStorage.setItem(lucyMemoryKey(account),JSON.stringify(normalized));return normalized;
}
export function lucyMemorySignature(entries:unknown) {
  const text=JSON.stringify(mergeLucyMemory(entries));let hash=2166136261;
  for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return `${text.length}:${hash>>>0}`;
}
export function recallLucyLongTermMemory(account:string,entries:unknown,question:string,excludeIds:readonly string[]=[]) {
  const excluded=new Set(excludeIds);
  const all=mergeLucyMemory(forAccount(entries,account)).filter(entry=>!excluded.has(entry.id));
  return selectLucyConversationMemory(account,all,question);
}

export function buildLucyLongTermPrompt(account:string,entries:unknown,question:string,excludeIds:readonly string[]=[]) {
  return formatLucyConversationMemory(recallLucyLongTermMemory(account,entries,question,excludeIds));
}
