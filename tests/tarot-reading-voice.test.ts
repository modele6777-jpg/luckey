import { buildTarotNarrationContent } from '../src/lib/todayTarotNarration.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureCompleteTarotReading } from '../src/lib/trinity/utils.ts';
import { handleDailyTarotPost } from '../server/api-lib/dailyTarotRoute.ts';
import { handleSitesApi } from '../server/sites-api.ts';
import { TAROT_READING_VOICE } from '../src/lib/tarotReadingVoice.ts';
import { LUCY_TAROT_RESPONSE_PROFILE, buildLucyTarotReadingPrompt } from '../src/lib/lucyTarotReading.ts';
import { extractConciseSummary, stripSummaryFromTarotText } from '../src/lib/tarotSummaryUtils.ts';
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

/** 카페에서 마주 앉아 읽은 것처럼 정교하되 문단을 끊어 말하고, 마지막에 열린 질문 하나를 남긴 3장 리딩 */
const cafeReading = `지금은 새 회사로 옮기는 쪽에 조금 더 기울어 보여요. 다만 지금 당장 옮기자는 결론이 아니라, 조건을 확인하기 전에는 서두를 이유가 없다는 쪽에 가까워요.

과거 자리의 은둔자는 혼자 안에서 정리하던 시간을 말해요. 연락을 주고받은 뒤로도 누구에게 속마음을 다 꺼내지 않고 밤에 혼자 계산해 오셨다는 뜻으로 읽혀요.

지금 자리의 검 두 장은 아직 판이 정해지지 않았다는 신호예요. 두 장이 나란히 서면 선택이 늦어지기보다, 비교할 정보가 아직 없다는 쪽으로 봐요. 연봉과 업무 범위 중 어느 쪽이 결정을 막고 있는지가 관건이에요.

앞으로 자리의 핸 타클 시종은 작은 확인에서 시작하는 태도예요. 여기서 앞의 두 카드와 결이 바뀌어요. 머릿속 비교에서 조건 확인으로 옮겨 가라는 뜻이에요.

오늘은 채용 담당자에게 실제로 맡을 업무 한 가지를 물어보세요. 대신 최종 연봉을 먼저 박아 두는 건 피하시고요.

지금 마음이 새 회사 쪽으로 기우는 건지, 아니면 지금 회사에 미련이 남은 건지, 어느 쪽에 가까우세요?`;

test('the shared voice contract asks for cafe-table precision without closing the conversation', () => {
  assert.match(TAROT_READING_VOICE, /전통 도상에서 이 카드가 가진 핵심 뜻/);
  assert.match(TAROT_READING_VOICE, /정방향이면 그 에너지가 드러나는 방식·역방향이면 막히거나 안으로 돌아선 결/);
  assert.match(TAROT_READING_VOICE, /배열에서 이 자리가 뜻하는 것/);
  assert.match(TAROT_READING_VOICE, /앞뒤 카드와 어떻게 대비되거나 보완되고/);
  assert.match(TAROT_READING_VOICE, /두세 문장으로 짧게 끊고 문단 사이를 띄워/);
  assert.match(TAROT_READING_VOICE, /열린 질문이나 확인 지점을 마지막에 하나/);
  assert.match(TAROT_READING_VOICE, /삼중되거나 추상어|어디에나 붙는 추상어/);
  assert.doesNotMatch(TAROT_READING_VOICE, /칸만 쓰세요/);
});

test('Lucy tarot reading and the Lucy Pro tarot house do not contradict each other', () => {
  const prompt = buildLucyTarotReadingPrompt(
    [{ id: 'major_9', nameKo: '은둔자', name: 'The Hermit', type: 'major', reversed: false, orientationKo: '정방향' }] as any,
    '이직할까요?',
  );
  // 루시프로 타로 하우스(buildTarotHouseGuide)와 같은 결: 대화체·짧은 호흡·열린 질문
  assert.match(prompt, /카페 상담처럼/);
  assert.match(prompt, /보고서 칸을 채우듯 항목을 나열하지 말고/);
  assert.match(prompt, /열린 질문 하나를 마지막에 남겨/);
  assert.doesNotMatch(prompt, /칸은 한 줄 결론, 카드, 종합, 다음 행동, 주의만 쓰세요/);
  assert.doesNotMatch(prompt, /카드마다 의미는 두 문장\. 다음 카드는 새 정보만/);
  assert.doesNotMatch(LUCY_TAROT_RESPONSE_PROFILE.rule, /짧은 보고서/);
  // 안전 규칙은 그대로 남는다.
  assert.match(prompt, /카드를 임의로 추가하거나 다른 카드로 바꾸지 마/);
  assert.match(prompt, /미래·날짜·성공 여부를 확정하지 마/);
});

 test('a free-form cafe reading still yields the 3-line summary and the spoken body', () => {
  const cards = [
    { id: 'major_9', nameKo: '은둔자', type: 'major', reversed: false },
    { id: 'swords_2', nameKo: '검 2', type: 'minor', reversed: false },
    { id: 'pentacles_1', nameKo: '핸 타클 시종', type: 'minor', reversed: false },
  ];
  const summary = extractConciseSummary(cafeReading, { cards, concern: '이직할까요?', theme: 'career' });
  assert.equal(summary.length, 3, JSON.stringify(summary));
  for (const line of summary) {
    assert.match(line, /^\[[^\]]+\] .{8,}/u, line);
  }
  assert.equal(new Set(summary).size, 3, '세 줄이 서로 달라야 한다');

  // 요약 카드는 본문에서 분리되고, 본문에는 마지막 열린 질문까지 남아 낭독된다.
  const body = stripSummaryFromTarotText(cafeReading);
  assert.ok(body.includes('어느 쪽에 가까우세요'), body);
  assert.ok(body.startsWith('지금은 새 회사로 옮기는 쪽에'), body);
  const content = buildTarotNarrationContent({ diagnosis: cafeReading, drawnCard: cards[0] as any }, summary);
  assert.ok(content.fullSpeech.includes('은둔자'), content.fullSpeech);
  assert.ok(!content.fullSpeech.includes('[현재 에너지]'));
});
