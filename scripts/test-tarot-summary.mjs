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

const picture = '카드 속 두 인물이 서로의 성배를 마주 보며 건네는 모습은 완벽한 대칭과 균형을 의미합니다.';
const energy = '지금 제제님의 마음은 상대와 호흡을 맞추고 싶으면서도 먼저 말을 꺼내기가 조심스러운 오늘 하루의 평온한 연결의 에너지 위에 있습니다.';
const teaser = '컵 2 카드가 주는 평온한 결합의 흐름 속에서도 주의할 점은 있습니다.';
const caution = '상대가 내 마음을 알아주길 바라며 입을 닫거나 감정적인 자존심으로 거리를 벌리면 오해가 쌓이니, 오늘은 기대와 짐작 대신 솔직하고 부드러운 한 마디로 서로의 마음을 직접 확인하세요.';
const flourish = '이 작은 행동이 제제님의 2026년 병오년 관성 운을 긍정적인 방향으로 이끄는 첫 단추가 될 것입니다.';
const action = '오늘 저녁 잠들기 전에 상대에게 고마운 점 하나를 짧은 문자 메시지로 직접 전해 보고, 보낸 뒤에는 절대 상대의 답을 재촉하지 마세요.';
const cups = { id: 'cups_2', name: 'Two of Cups', nameKo: '컵 2', type: 'cups', keywords: ['결합', '파트너십', '로맨스', '상호 존중'], reversed: false };

const hollowWithBody = `[핵심 3줄 요약]
- [현재 에너지] ${picture}
- [방향과 결단] 컵 2 카드가 주는 평온함 속에서도 주의할 점은 있습니다.
- [실천 행동] ${flourish}

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
${energy}

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기
${picture} 컵 2는 결합과 상호 존중을 뜻합니다.

### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성
서로의 마음을 확인하며 한 걸음 가까워지되, 상대가 알아주길 바라며 입을 닫으면 오해가 쌓이니 그 점은 주의하세요.

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방
오늘 저녁 상대에게 고마운 점 하나를 짧은 메시지로 전해 보세요. ${flourish}
`;
const repaired = extractConciseSummary(hollowWithBody, { concern: '오늘의 타로', theme: 'daily', cards: [cups] });
assert(repaired[0].includes('마음') || repaired[0].includes('에너지'), repaired[0]);
assert(!repaired[0].includes('의미합니다'), repaired[0]);
assert(repaired[1].includes('입을 닫'), repaired[1]);
assert(!/주의할\s*점은\s*있습니다/.test(repaired[1]), repaired[1]);
assert(/메시지|전해/.test(repaired[2]), repaired[2]);
assert(!repaired[2].includes('이 작은 행동'), repaired[2]);
assert(!repaired[2].includes('첫 단추'), repaired[2]);

function overLong(first, second) {
  const line = `${first} ${second}`;
  assert(first.endsWith('.'), first);
  assert(first.length - 1 >= 35 && first.length - 1 <= 125, first.length);
  assert(line.length > 125, line.length);
  return line;
}
const truncated = `[핵심 3줄 요약]
- [현재 에너지] ${overLong(picture, energy)}
- [방향과 결단] ${overLong(teaser, caution)}
- [실천 행동] ${overLong(flourish, action)}
### 1. 마음
카드를 펼쳤습니다.
`;
const fromLong = extractConciseSummary(truncated, { concern: '오늘의 타로', cards: [cups] });
assert(fromLong[0].includes('마음'), fromLong[0]);
assert(!fromLong[0].includes('의미합니다'), fromLong[0]);
assert(fromLong[1].includes('입을 닫') || fromLong[1].includes('오해'), fromLong[1]);
assert(!/주의할\s*점은\s*있습니다/.test(fromLong[1]), fromLong[1]);
assert(/메시지|전해/.test(fromLong[2]), fromLong[2]);
assert(!fromLong[2].includes('이 작은 행동'), fromLong[2]);

const hollowOnly = `[핵심 3줄 요약]
- [현재 에너지] ${picture}
- [방향과 결단] 컵 2 카드가 주는 평온함 속에서도 주의할 점은 있습니다.
- [실천 행동] ${flourish}
### 1. 마음
${picture}
`;
const fromCard = extractConciseSummary(hollowOnly, { concern: '오늘의 타로', cards: [cups] });
assert(/결합|파트너십|상호 존중/.test(fromCard[0]), fromCard[0]);
assert(!fromCard[0].includes('의미합니다'), fromCard[0]);
assert(/감정|경계|휘둘|오해/.test(fromCard[1]), fromCard[1]);
assert(!/주의할\s*점은\s*있습니다/.test(fromCard[1]), fromCard[1]);
assert(/전하세요|말을|메시지|메모|확인/.test(fromCard[2]), fromCard[2]);
assert(!fromCard[2].includes('이 작은 행동'), fromCard[2]);

const reversed = extractConciseSummary(hollowOnly, { concern: '오늘의 타로', cards: [{ ...cups, reversed: true }] });
assert(/오해|불균형|서운|입을 닫/.test(reversed[0] + reversed[1]), reversed);
assert(/입을 닫|자존심|불균형/.test(reversed[1]), reversed[1]);

console.log('\n--- before (screenshot) ---');
console.log('01', picture);
console.log('02 컵 2 카드가 주는 평온함 속에서도 주의할 점은 있습니다.');
console.log('03', flourish);
console.log('--- after (body recovered) ---');
repaired.forEach((row, i) => console.log(`0${i + 1}`, row));
console.log('--- after (card grounded, no usable body) ---');
fromCard.forEach((row, i) => console.log(`0${i + 1}`, row));

console.log('Tarot summaries: career/love/money, short answers, body grounding, duplicate filtering, verdict preservation, and hollow-line repair passed.');

const currentEnergy = extractConciseSummary(`[핵심 3줄 요약]
- [현재 에너지] 이직은 새로운 기회가 될 것입니다.
- [방향과 결단] 이직은 조건을 비교한 뒤 결정하세요.
- [실천 행동] 채용 공고의 업무 범위를 확인하세요.
### 1. 현재 상황
지금은 이직을 준비해야 합니다.
이직하고 싶지만 새 직장의 업무 범위가 불분명해 망설이고 있습니다.`, { theme: 'career', concern: '이직할까요?' });
assert.match(currentEnergy[0], /업무 범위가 불분명해 망설이고 있습니다/);
