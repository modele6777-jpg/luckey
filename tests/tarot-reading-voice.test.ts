import { buildTarotNarrationContent } from '../src/lib/todayTarotNarration.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureCompleteTarotReading } from '../src/lib/trinity/utils.ts';
import { handleDailyTarotPost } from '../server/api-lib/dailyTarotRoute.ts';
import { handleSitesApi } from '../server/sites-api.ts';
import { TAROT_READING_VOICE } from '../src/lib/tarotReadingVoice.ts';
const reading = '지금은 이직 여부를 서둘러 정하기보다 새 회사의 역할을 먼저 확인하는 쪽으로 읽혀요. 은둔자는 혼자 생각을 정리하는 배경을 보여주고, 검 두 장은 아직 비교할 정보가 부족한 현재와 이어져요. 마지막의 펜타클 시종은 작은 확인부터 시작해 보라는 제안으로 볼 수 있어요. 채용 담당자에게 실제로 맡을 업무 한 가지를 물어보세요.';
test('a complete conversational reading stays intact without generic extra chapters', () => {
  assert.equal(ensureCompleteTarotReading(reading, '이직할까요?', []), reading);
  const numbered = `### 1. 지금의 고민\n${reading}\n\n### 2. 다음 선택\n제안받은 업무 범위를 직접 확인해 보세요.`;
  assert.equal(ensureCompleteTarotReading(numbered, '이직할까요?', []), numbered);
});
test('daily model prompt uses the same voice without requiring an inline summary or repeated affirmation', async () => {
  let prompt = '';
  const res = { setHeader() {}, status() { return this; }, json(value: unknown) { return value; } };
  await handleDailyTarotPost({ body: { card: { nameKo: '은둔자', name: 'The Hermit', keywords: ['성찰'] } } } as any, res as any, {
    apiKey: 'test-only', callModel: async (_key, _contents, config) => {
      prompt = String(config.systemInstruction);
      return { text: JSON.stringify({ diagnosis: reading }) };
    },
  });
  assert.ok(prompt.includes(TAROT_READING_VOICE));
  assert.ok(!prompt.includes('반드시 3줄 요약을 가장 먼저'));
  assert.ok(!prompt.includes('오늘의 황금빛 확언'));
});
test('Sites daily tarot sends the conversational contract to Gemini', async () => {
  let prompt = '';
  await handleSitesApi(new Request('https://test.invalid/api/ai/daily-tarot', { method: 'POST', body: JSON.stringify({ card: { nameKo: '별', reversed: true } }) }), { gemini: 'test-only' }, async (_url, options) => {
    const payload = JSON.parse(String(options?.body)); prompt = payload.messages[0].content;
    return Response.json({ choices: [{ message: { content: JSON.stringify(Object.fromEntries(['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'spiritualEnergy', 'blessingMessage', 'focusPlaylist'].map(key => [key, key === 'diagnosis' ? reading : '참고']))) } }] });
  });
  assert.ok(prompt.includes(TAROT_READING_VOICE));
  assert.match(prompt, /각각 1~2문장/);
});

test('full narration reads the story once while the separate summary remains accessible', () => {
  const summary = '[현재 에너지] 별도 요약 전용 문장입니다.';
  const content = buildTarotNarrationContent({ diagnosis: reading, drawnCard: { nameKo: '은둔자', name: 'The Hermit', keywords: ['성찰'] } }, [summary]);
  assert.ok(!content.fullSpeech.includes('별도 요약 전용 문장'));
  assert.ok(content.summarySpeechText.includes('별도 요약 전용 문장'));
  assert.ok(content.fullSpeech.includes('채용 담당자'));
});
