import type { UserProfile } from '@/lib/sharedState';
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { makeSavedCalculation, getSavedCalculations, savedResultMatchesProfile } from '@/lib/divination/savedResults';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { calculateZiwei, calculateSukuyo, calculateVedic } from '@/lib/divination/birthCharts';
import { calculateIching, castIching } from '@/lib/divination/iching';
import { calculateLiuren, calculateQimen, eventInstant } from '@/lib/divination/eventCharts';

type Tool = 'ziwei'|'sukuyo'|'vedic'|'liuren'|'qimen'|'iching';
const TOOLS: {id:Tool;name:string;note:string}[]=[
  {id:'ziwei',name:'자미두수',note:'12궁 · 주성 · 사화'}, {id:'sukuyo',name:'숙요',note:'한국 음력 27숙 · 윤달 제외'},
  {id:'vedic',name:'베딕 참고',note:'평균 세차 근사 · 정밀 차트 아님'}, {id:'liuren',name:'육임',note:'천지반 · 사과삼전'},
  {id:'qimen',name:'일반 기문',note:'차보법 · 홍국 수리 제외'}, {id:'iching',name:'주역',note:'동전법 · 본괘와 지괘'},
];
type Calculation = ReturnType<typeof calculateZiwei>|ReturnType<typeof calculateSukuyo>|ReturnType<typeof calculateVedic>|ReturnType<typeof calculateLiuren>|ReturnType<typeof calculateQimen>|ReturnType<typeof calculateIching>;
function Result({value}:{value:Calculation}) {
  if ('primary' in value) return <><p className="text-xl font-semibold">{value.primary.number}. {value.primary.name} → {value.changed.number}. {value.changed.name}</p><p>변효: {value.movingLines.join('·') || '없음'}</p><ol className="space-y-2 py-4" aria-label="위에서 아래로 표시한 6효">{[...value.lines].reverse().map((n,i)=><li key={i} className="flex gap-4 items-center"><span>{6-i}효 · {n}</span><span className="font-mono tracking-widest">{n%2?'━━━━━━━━':'━━━　━━━'}</span><span>{n===6||n===9?'변효':''}</span></li>)}</ol><p className="text-sm opacity-70">6 노음·변효 / 7 소양 / 8 소음 / 9 노양·변효</p></>;
  if ('palaces' in value) return <><p>명궁 {value.soulPalace} · 신궁 {value.bodyPalace} · {value.fiveElementsClass}</p><div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">{value.palaces.map(p=><div key={p.branch} className="rounded-xl border border-violet-400/20 p-3"><strong>{p.name} · {p.stem}{p.branch}</strong>{p.body&&<span> · 신궁</span>}<p className="mt-1 text-sm">{p.major.map(s=>`${s.name}${s.mutagen?`(${s.mutagen})`:''}`).join(' · ')||'주성 없음'}</p><p className="text-xs opacity-60 mt-1">대한 {p.decadal.join('~')}세 · 라이브러리 전통 나이</p></div>)}</div></>;
  if ('mansion' in value) return <p className="text-xl">본명숙 {value.mansion} · 음력 {value.lunarMonth}월 {value.lunarDay}일</p>;
  if ('nakshatra' in value) return <><p className="text-lg">{value.nakshatra.name} · {value.nakshatra.pada}파다</p><p>출생 다샤 {value.nakshatra.lord} · 잔여 약 {value.vimshottari.birthBalanceYears.toFixed(2)}년</p><p className="text-sm mt-2">아야남샤 참고값 {value.ayanamsa.toFixed(4)}°</p></>;
  if ('transmissions' in value) return <><p>월장 {value.monthGeneral} · 일진 {value.day} · 시주 {value.hour}</p><div className="grid grid-cols-3 gap-2 mt-3">{[['초전',value.transmissions.chuChuan],['중전',value.transmissions.zhongChuan],['말전',value.transmissions.moChuan]].map(([label,entries])=><div key={String(label)} className="rounded-xl border border-violet-400/20 p-3"><strong>{label}</strong><p>{(entries as string[]).join(' · ')}</p></div>)}</div><p className="mt-2">과체 {value.transmissions.keTi}</p><p className="mt-2 text-sm">사과: {Object.values(value.lessons).map((v: any) => Array.isArray(v) ? v.join(' / ') : String(v)).join(' · ')}</p></>;
  const c=value.chart;
  return <><p>{String(c['陰陽'])}둔 {String(c['局數'])}국 · {String(c['節氣'])} · {String(c['三元'])}</p><p>직부 {String(c['值符'])} · 직사 {String(c['值使'])}</p><div className="grid grid-cols-3 gap-2 mt-3">{(c['方位'] as string[]).map((p,i)=><div key={i} className="rounded-xl border border-violet-400/20 p-2 text-sm"><strong>{p}</strong><p>{(c['天門'] as string[])[i]||'중궁'} · {(c['九星'] as string[])[i]}</p><p>{(c['地盤'] as string[])[i]} / {(c['天盤'] as string[])[i]}</p></div>)}</div></>;
}
export default function DivinationLab({profile}:{profile?:UserProfile} = {}) {
  const {sharedState,updateSharedState}=useApp();
  const userProfile=profile || sharedState?.userProfile || getPersistentUserProfile();
  const [,navigate]=useLocation();
  const [tool,setTool]=useState<Tool>('iching');
  const [question,setQuestion]=useState('');
  const [date,setDate]=useState(()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date()));
  const [time,setTime]=useState(()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit'}).format(new Date()));
  const [zone,setZone]=useState('Asia/Seoul');
  const [manual,setManual]=useState(false);
  const [lines,setLines]=useState('');
  const [result,setResult]=useState<{tool:Tool;value:Calculation;question:string}|null>(null);
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const [saveStatus,setSaveStatus]=useState('');
  const saved=getSavedCalculations(sharedState?.featureHistory).slice(0,12);
  const isEvent=tool==='liuren'||tool==='qimen';
  function calculate() {
    setError('');setResult(null);setCopied(false);
    try {
      if ((isEvent||tool==='iching')&&!question.trim()) throw new RangeError('먼저 살펴볼 질문을 입력하세요.');
      const value=tool==='iching'?(manual?calculateIching(lines.trim().split(/[\s,]+/).map(Number)):castIching()):tool==='ziwei'?calculateZiwei(userProfile):tool==='sukuyo'?calculateSukuyo(userProfile):tool==='vedic'?calculateVedic(userProfile):tool==='liuren'?calculateLiuren(eventInstant(date,time,zone)):calculateQimen(eventInstant(date,time,zone));
      setResult({tool,value,question:question.trim()});
      const record=makeSavedCalculation(tool,value,question.trim(),userProfile);
      setSaveStatus('저장 중…');
      void updateSharedState({featureHistory:[record,...(sharedState?.featureHistory||[])].slice(0,100)},'profile').then(()=>setSaveStatus('저장됨 · 루시와 루시프로가 함께 활용합니다.')).catch(()=>setSaveStatus('이 기기에 저장했습니다. 네트워크 연결 후 동기화를 확인하세요.'));
    } catch(e) {setError(e instanceof Error?e.message:'계산하지 못했습니다. 입력을 확인하세요.');}
  }
  return <div className="relative isolate w-full overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#18152e] via-[#0e1020] to-[#171526] text-white shadow-xl">
    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-violet-300/15 shadow-[0_0_90px_20px_rgba(139,92,246,0.12)]" />
    <header className="relative border-b border-white/10 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-semibold tracking-[0.25em] text-violet-300">LUCY · DESTINY STUDIO</span><span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-200">계산 후 자동 저장</span></div>
      <h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight">나의 질문에, 하나의 지도</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">명반과 괘를 계산하고, 루시와 함께 의미를 살펴보세요.</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-violet-100/80"><span className="rounded-lg bg-white/5 px-3 py-1.5">6가지 계산 도구</span><span className="rounded-lg bg-white/5 px-3 py-1.5">저장 자료 {saved.length}개</span><span className="rounded-lg bg-white/5 px-3 py-1.5">루시 · 루시프로 연동</span></div>
    </header>
    <div className="relative space-y-5 p-5 sm:p-7">
      <p className="text-sm opacity-70">계산 결과는 자동 저장되어 루시·루시프로가 참조합니다. 출생 기반 도구는 현재 프로필 정보를 사용합니다.</p>
      <h4 className="text-xs font-semibold tracking-wider text-violet-200/70">01 · 도구 선택</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" aria-label="계산 도구">{TOOLS.map(t=><button key={t.id} type="button" aria-pressed={tool===t.id} onClick={()=>{setTool(t.id);setResult(null);setError('');}} className={`group text-left rounded-2xl border p-4 transition-colors ${tool===t.id?'border-violet-300/65 bg-gradient-to-br from-violet-500/30 to-indigo-500/10 shadow-[0_0_24px_rgba(139,92,246,0.12)]':'border-white/10 bg-white/[0.025] hover:bg-white/[0.07]'}`}><span aria-hidden="true" className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-xl text-violet-200">{{ziwei:"✧",sukuyo:"☾",vedic:"☉",liuren:"◈",qimen:"⌘",iching:"☯"}[t.id]}</span><span className="block font-semibold">{t.name}</span><span className="block text-xs mt-1 opacity-65">{t.note}</span></button>)}</div>
      <h4 className="text-xs font-semibold tracking-wider text-violet-200/70">02 · 질문과 정보</h4>
      {isEvent||tool==='iching'?<label className="block text-sm">질문<input className="block w-full mt-1 rounded-xl border border-violet-400/25 bg-transparent px-3 py-2" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="지금 살펴보고 싶은 일은 무엇인가요?" maxLength={500}/></label>:<div className="text-sm flex flex-wrap gap-3"><span>등록된 생일: {userProfile?.basic?.birthdate||'미입력'} · 생시 {userProfile?.basic?.birthtime||'미입력'}</span><button type="button" className="underline" onClick={()=>navigate('/profile')}>프로필 수정</button></div>}
      {isEvent&&<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 layout-form-grid" data-form-columns="3"><label className="text-sm">점시 날짜<input aria-label="점시 날짜" type="date" value={date} onChange={e=>setDate(e.target.value)} className="block w-full bg-transparent border rounded-lg p-2 mt-1"/></label><label className="text-sm">점시 시각<input aria-label="점시 시각" type="time" value={time} onChange={e=>setTime(e.target.value)} className="block w-full bg-transparent border rounded-lg p-2 mt-1"/></label><label className="text-sm">입력 시간대<select value={zone} onChange={e=>setZone(e.target.value)} className="block w-full bg-slate-900 text-white border rounded-lg p-2 mt-1">{['Asia/Seoul','Asia/Tokyo','Asia/Shanghai','America/New_York','Europe/London'].map(z=><option key={z}>{z}</option>)}</select></label></div>}
      {tool==='qimen'&&<p className="text-sm text-amber-500">일반 기문 차보법입니다. 입력을 서울 평균태양시(한국 표준시 −32분)로 환산한 뒤 정시로 계산하며, 분 단위 절기 경계와 홍국기문 수리는 지원하지 않습니다.</p>}
      {tool==='vedic'&&<p className="text-sm text-amber-500">평균 세차율을 사용한 참고 계산입니다. 정밀 Lahiri 차트와 다르며 경계의 별자리·다샤 날짜는 확정하지 않습니다.</p>}
      {tool==='iching'&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={manual} onChange={e=>setManual(e.target.checked)}/>직접 얻은 6효 입력</label>{manual?<label className="block text-sm">아래→위 순서<input value={lines} onChange={e=>setLines(e.target.value)} placeholder="예: 7 8 6 9 7 8" className="block w-full mt-1 rounded-xl border border-violet-400/25 bg-transparent px-3 py-2"/></label>:<p className="text-xs opacity-65">버튼을 누를 때 동전 3개를 6번 던지는 방식으로 새 괘를 얻습니다. 화면을 다시 열기만 해서는 작괘하지 않습니다.</p>}</>}
      <button type="button" onClick={calculate} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-6 py-3 font-semibold shadow-lg shadow-violet-950/30 hover:brightness-110 transition">{tool==='iching'&&!manual?'동전법으로 작괘':'계산하기'}</button>
      {saveStatus&&<p role="status" className="text-sm text-emerald-400">{saveStatus}</p>}
      {error&&<p role="alert" className="text-sm text-amber-500">{error}</p>}
      {result&&<section aria-label="계산 결과" className="rounded-xl border border-violet-400/20 p-4 space-y-3"><p className="text-xs opacity-65 break-words">{result.value.method}</p>{result.question&&<p className="font-medium">{result.question}</p>}<Result value={result.value}/>{'limitations' in result.value&&result.value.limitations.map(s=><p key={s} className="text-xs text-amber-500">{s}</p>)}<details><summary className="text-sm cursor-pointer opacity-70">전체 계산값 보기</summary><pre className="mt-2 text-xs whitespace-pre-wrap break-all max-h-80 overflow-y-auto">{JSON.stringify(result.value,null,2)}</pre></details><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(`[${TOOLS.find(t=>t.id===result.tool)?.name} 실제 계산 결과]\n질문: ${result.question}\n${JSON.stringify(result.value,null,2)}\n위 실제 결과의 범위와 한계를 지키며 해석해 줘.`);setCopied(true);}catch{setError('복사 권한을 확인하세요. 전체 계산값에서 직접 복사할 수 있습니다.');}}} className="text-sm underline">{copied?'복사 완료 · 루시 대화에 붙여넣으세요':'루시에게 물어볼 계산값 복사'}</button></section>}
      {saved.length>0&&<section aria-label="저장된 점술 자료" className="space-y-2"><h3 className="font-semibold text-sm">저장된 계산 자료</h3>{saved.map(r=><button key={r.id} type="button" onClick={()=>{setTool(r.details.tool as Tool);setResult({tool:r.details.tool as Tool,value:r.details.value as Calculation,question:r.details.question});setError('');setSaveStatus('저장된 자료를 불러왔습니다. 새로 계산하지 않았습니다.');}} className="block w-full rounded-xl border border-violet-400/20 p-3 text-left text-sm"><strong>{TOOLS.find(t=>t.id===r.details.tool)?.name}</strong><span className="ml-2 text-xs opacity-60">{new Date(r.timestamp).toLocaleString('ko-KR')}</span><span className="block mt-1 opacity-70">{r.details.question||'출생 프로필 기반 계산'}{!savedResultMatchesProfile(r,userProfile)?' · 출생정보 변경됨: 채팅 참조 제외':''}</span></button>)}</section>}
      <p className="text-xs opacity-60">토정비결·태을신수는 기준 판본과 계산표를 확보하지 못해 아직 지원하지 않습니다. 계산 결과는 전통적 해석 자료이며 미래의 성패를 보장하지 않습니다.</p>
    </div>
  </div>;
}
