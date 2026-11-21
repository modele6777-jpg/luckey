import * as S from './src/lib/divination/sukuyoEngine';
const info = (S as any).sukuyoMansionInfoByIndex;
const rows = Array.from({length:27},(_,i)=>info(i)).map((m:any)=>`${m.hanja}${m.luminary[0]}:${m.shukgukHanja}`);
console.log(rows.join(' '));
console.log([[1,1],[4,23],[8,15],[12,30]].map(([m,d])=>{const i=S.sukuyoIndexFromLunar(m,d);return `${m}/${d}=${info(i).hanja}`}).join(' '));
const rel = (S as any).sukuyoRelationBetween || (S as any).calculateSukuyoRelation;
console.log(Object.keys(S).join(','));
