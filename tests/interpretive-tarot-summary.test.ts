import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateInterpretiveTarotSummary, validateInterpretiveSummary } from '../src/lib/interpretiveTarotSummary.ts';
import { buildTarotNarrationContent } from '../src/lib/todayTarotNarration.ts';
const body = `### 1. 현재 마음\n당신은 새 직장의 제안을 받았지만 업무 범위를 확인하지 못해 선택을 망설이고 있습니다.\n### 3. 방향\n조건이 확인되기 전에는 안정적인 현재 직장을 성급히 떠나지 마세요.\n### 4. 실천\n오늘 채용 담당자에게 맡게 될 업무 범위를 서면으로 문의해 보세요.\n### 5. 축복\n불확실한 부분을 확인하며 자신의 속도로 결정하기 바랍니다.`;
const output = {
 energy: '이직의 기대와 역할에 대한 정보 부족이 맞물려 결정을 쉽게 내리지 못하는 상황입니다.',
 direction: '새로운 기회는 열어 두되, 실제 업무 조건을 확인한 뒤 이동 여부를 판단하는 편이 좋습니다.',
 action: '채용 담당자에게 담당 업무를 글로 확인해 달라고 요청해 판단에 필요한 정보를 모으세요.',
};
test('a separate interpretation receives the entire body and question, without the old summary', async () => {
 let received = '';
 const result = await generateInterpretiveTarotSummary('[핵심 3줄 요약]\n[현재 에너지] 이전 발췌 요약입니다.\n\n'+body, '이직할까요?', async (source, concern) => {
  received = source;assert.equal(concern,'이직할까요?');assert.match(source,/자신의 속도로/);assert.doesNotMatch(source,/이전 발췌/);return output;
 });
 assert.deepEqual(result, ['[현재 에너지] '+output.energy,'[방향과 주의점] '+output.direction,'[실천 행동] '+output.action]);
 for(const line of Object.values(output))assert(!received.includes(line));
});
test('Trinity summary omits a second warning when the UI already shows one separately', async () => {
 let includeCaution: boolean | undefined;
 const bullets = await generateInterpretiveTarotSummary(body, '이직할까요?', async (_source, _concern, include) => {
  includeCaution = include;
  return output;
 }, false);
 assert.equal(includeCaution, false);
 assert.deepEqual(bullets.map(line => line.match(/^\[([^\]]+)\]/)?.[1]), ['현재 에너지', '방향과 결단', '실천 행동']);
 assert.throws(() => validateInterpretiveSummary({ ...output, direction: '주의할 위험을 먼저 확인하고, 현실 조건을 비교해 판단하는 편이 좋습니다.' }, body, false), /경고 문구/);
});
test('copied sentences, duplicates and incomplete model output are rejected', () => {
 assert.throws(()=>validateInterpretiveSummary({...output,energy:'당신은 새 직장의 제안을 받았지만 업무 범위를 확인하지 못해 선택을 망설이고 있습니다.'},body));
 assert.throws(()=>validateInterpretiveSummary({...output,action:output.energy},body));
 assert.throws(()=>validateInterpretiveSummary({energy:output.energy},body));
});
test('model failure propagates instead of falling back to body extraction', async () => {
 await assert.rejects(generateInterpretiveTarotSummary(body,'이직',async()=>{throw new Error('offline');}),/offline/);
});
test('daily narration speaks exactly the supplied interpretation and does not extract a substitute', () => {
 const bullets=validateInterpretiveSummary(output,body);
 const daily={diagnosis:body};const narration=buildTarotNarrationContent(daily,bullets);
 assert.deepEqual(narration.conciseSummaryBullets,bullets);
 assert.equal(narration.chapters.find(c=>c.id==='summary')?.displayText,bullets.join('\n'));
 assert.deepEqual(buildTarotNarrationContent(daily).conciseSummaryBullets,[]);
 assert.equal(buildTarotNarrationContent(daily).summarySpeechText,'');
});
