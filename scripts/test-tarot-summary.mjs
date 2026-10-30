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

const before = [
  '카드 속 두 인물이 서로의 성배를 마주 보며 건네는 모습은 완벽한 대칭과 균형을 의미합니다.',
  '컵 2 카드가 주는 평온함 속에서도 주의할 점은 있습니다.',
  '이 작은 행동이 제제님의 2026년 병오년 관성 운을 긍정적인 방향으로 이끄는 첫 단추가 될 것입니다.',
];
const hollowReading = `[핵심 3줄 요약]
- [현재 상황] ${before[0]}
- [방향과 결단] ${before[1]}
- [실천 행동] ${before[2]}

### 1. 마음과 현재 에너지
컵 2 역방향은 두 사람의 호흡이 어긋나 한쪽만 애쓰는 불균형입니다. 재회를 원한다면 침묵으로 마음을 시험하지 마세요.

### 3. 방향과 결단
재회는 서두르지 말고, 상대가 알아주길 바라며 입을 닫거나 자존심 싸움으로 거리를 벌리지 않도록 주의하세요.

### 4. 실천 처방
오늘 저녁 상대에게 안부를 묻는 짧은 메시지 한 통을 보내 서로의 마음을 확인해 보세요.`;
const repaired = extractConciseSummary(hollowReading, {
  theme: 'love',
  concern: '재회해도 될까요?',
  cards: [{ id: 'cups_2', nameKo: '컵 2', type: 'cups', reversed: true, keywords: ['결합', '파트너십'] }],
});
assert.equal(repaired.length, 3);
assert(!/완벽한\s*대칭과\s*균형|주의할\s*점은\s*있습니다|이\s*작은\s*행동|첫\s*단추/.test(repaired.join(' ')), repaired.join('\n'));
assert(/호흡|불균형|재회|침묵/.test(repaired[0]), repaired[0]);
assert(/입을\s*닫|자존심/.test(repaired[1]), repaired[1]);
assert(/메시지/.test(repaired[2]), repaired[2]);
assert(!/이\s*작은\s*행동/.test(repaired[2]));
repaired.forEach((row) => {
  assert(row.length <= 180, row);
  assert(/[.!?]$/.test(row.replace(/^\[[^\]]+\]\s*/, '')), row);
});

const teaser = '이직을 앞두고 컵 2가 주는 평온함 속에서도 주의할 점은 있습니다.';
const payload = '제안받은 연봉과 업무 강도를 비교하기 전에는 사표를 내지 말고, 근무 조건이 적힌 제안서를 받기 전에는 퇴사 일정을 확정하지 마세요. 확인된 조건만 보고 결정하세요.';
assert(teaser.length > 35 && `${teaser} ${payload}`.length > 125);
const truncated = extractConciseSummary(`[핵심 3줄 요약]
- [현재 상황] 현재 직장의 업무 부담이 커져 이직을 저울질하는 상태입니다.
- [방향과 결단] ${teaser} ${payload}
- [실천 행동] 지원할 회사의 채용 공고에서 경력 조건을 먼저 확인해 보세요.
### 1. 현재 상황
현재 직장의 업무 부담이 커져 이직을 저울질하는 상태입니다.`, { theme: 'career', concern: '이직할까요?' });
assert(/연봉|사표|제안서/.test(truncated[1]), truncated[1]);
assert(!/주의할\s*점은\s*있습니다/.test(truncated[1]), truncated[1]);
assert(/확인/.test(truncated[2]), truncated[2]);

const cardOnly = extractConciseSummary(`[핵심 3줄 요약]
- [현재 상황] ${before[0]}
- [방향과 결단] ${before[1]}
- [실천 행동] ${before[2]}
### 1. 현재 상황
${before[0]}`, {
  theme: 'love',
  concern: '재회해도 될까요?',
  cards: [{ id: 'cups_2', nameKo: '컵 2', type: 'cups', reversed: true, keywords: ['결합'] }],
});
assert(/관계\s*불균형|오해|호흡|불균형/.test(cardOnly[0]), cardOnly[0]);
assert(/입을\s*닫|자존심/.test(cardOnly[1]), cardOnly[1]);
assert(/대화|확인/.test(cardOnly[2]) && !/이\s*작은\s*행동|첫\s*단추/.test(cardOnly[2]), cardOnly[2]);

console.log('BEFORE\n' + before.map((line, i) => `${i + 1}. ${line}`).join('\n'));
console.log('AFTER reading-grounded\n' + repaired.map((line, i) => `${i + 1}. ${line}`).join('\n'));
console.log('AFTER card-grounded\n' + cardOnly.map((line, i) => `${i + 1}. ${line}`).join('\n'));
console.log('Tarot summaries: career/love/money, short answers, body grounding, duplicate filtering, verdict preservation, and hollow-line repair passed.');
