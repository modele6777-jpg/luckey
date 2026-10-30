import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/lib/tarotSummaryUtils.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {extractConciseSummary}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const samples=[
 {theme:'career',concern:'이직을 준비해도 될까요?', lines:['현재 직장의 업무 부담이 커졌습니다.','이직은 연봉과 업무 조건을 비교한 뒤 결정하세요.','지원할 회사의 채용 조건을 먼저 확인하세요.']},
 {theme:'love',concern:'상대에게 먼저 연락할까요?',lines:['상대와의 연락 간격이 길어졌습니다.','관계를 단정하기보다 상대의 반응을 확인하세요.','상대에게 부담 없는 안부 연락을 한 번 보내 보세요.']},
 {theme:'money',concern:'새로운 투자를 시작할까요?',lines:['투자 자금과 생활비가 구분되지 않았습니다.','투자 수익보다 감당할 손실 한도를 먼저 정하세요.','계약의 비용과 중도 해지 조건을 확인하세요.']},
];
for(const sample of samples){
 const text='[핵심 3줄 요약]\n'+sample.lines.map((line,i)=>`- [${['현재 상황','방향과 결단','실천 행동'][i]}] ${line}`).join('\n')+'\n### 본문\n'+sample.lines.join('\n');
 const rows=extractConciseSummary(text,sample);
 assert.equal(rows.length,3);
 sample.lines.forEach((line,i)=>assert(rows[i].endsWith(line),rows[i]));
 assert(!rows.join(' ').includes('기운을 순환'));
}
const body='[핵심 3줄 요약]\n- 직관의 나침반을 믿고 기운을 순환하세요.\n- 마음의 중심을 잡고 내면의 빛을 보세요.\n- 물 한 잔으로 기운을 순환해 보세요.\n### 1. 현재 상황\n현재 직장의 업무가 경력 목표와 맞지 않습니다.\n### 3. 방향과 결단\n이직은 지원 조건과 연봉을 비교한 뒤 판단하세요.\n### 4. 실천 처방\n지원할 회사의 채용 공고에서 경력 조건을 확인하세요.';
const contextual=extractConciseSummary(body,{theme:'career',concern:'이직할까요?'});
assert(contextual[0].includes('직장'));assert(contextual[1].includes('이직'));assert(contextual[2].includes('채용'));
assert(!/물 한 잔|내면의 빛|기운을 순환/.test(contextual.join(' ')));
assert.equal(new Set(contextual.map(row=>row.replace(/^\[[^\]]+\]\s*/,''))).size,3);
const noVerdict=extractConciseSummary('이직을 고민하며 여러 조건을 확인해야 합니다. 아직 지원할 회사의 조건과 현재 직장의 상황이 구체적으로 확인되지 않았습니다.',{theme:'career',kind:'yes_no',concern:'이직 가능할까요?'});
assert(!/\[YES\]|\[NO\]/.test(noVerdict.join(' ')));
const verdict=extractConciseSummary('[핵심 3줄 요약]\n- [현재 상황] 이직 준비가 부족합니다.\n- [방향과 결단] 최종 판정은 [NO]이며 준비를 먼저 보완하세요.\n- [실천 행동] 지원 조건을 점검하세요.',{theme:'career',concern:'이직할까요?',kind:'yes_no'});
assert(verdict[1].includes('[NO]'));assert(!verdict[1].includes('[YES]'));
assert.deepEqual(extractConciseSummary('아직 생성 중'),[]);
console.log('Tarot summaries: career/love/money, short answers, body grounding, duplicate filtering and verdict preservation passed.');
