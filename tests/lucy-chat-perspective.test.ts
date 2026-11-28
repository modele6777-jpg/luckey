import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wantsLucyProReading,
  pickLucyChatPerspectives,
  buildLucyChatPerspectiveDirective,
  buildLucyChatSystemPrompt,
} from '../src/lib/lucyChatPerspective.ts';

test('점을 원하는 말은 루시프로로 넘긴다', () => {
  for (const text of [
    '점 봐줘',
    '오늘 운세 알려줘',
    '사주 해석해줘',
    '타로 카드 뽑아줘',
    '우리 궁합 봐줘',
    '재물운 어때',
    '내일 운 봐줘',
    '점집 가고 싶어',
  ]) {
    assert.equal(wantsLucyProReading(text), true, text);
  }
});

test('점이나 운명학을 원하지 않는 일상 말은 채팅에 남긴다', () => {
  for (const text of [
    '오늘 회사 때문에 고민이야',
    '점점 힘들어',
    '점수 어떻게 나왔어',
    '오늘 운동 갈까',
    '점은 말고 그냥 이야기하자',
    '타로는 말고 내 마음만 보자',
    '안녕',
    '그 사람이 답장을 안 해',
  ]) {
    assert.equal(wantsLucyProReading(text), false, text);
  }
});

test('루시채팅 지시는 운명학을 빼고 관점을 두 개 이상 고른다', () => {
  const picked = pickLucyChatPerspectives('그 사람이 답장을 안 해서 서운해');
  assert.ok(picked.length >= 2);
  assert.ok(picked.some(item => item.id === 'relation' || item.id === 'feeling'));
  const directive = buildLucyChatPerspectiveDirective('이직할까 고민이야');
  assert.match(directive, /루시프로/);
  assert.match(directive, /금지: 사주/);
  assert.doesNotMatch(directive, /15대 운명학/);
  const prompt = buildLucyChatSystemPrompt({
    nickname: '제제',
    realName: '박주형',
    memory: '일이 버거움',
    userText: '이직할까 고민이야',
  });
  assert.match(prompt, /여러 관점/);
  assert.match(prompt, /제제/);
  assert.match(prompt, /금지: 사주/);
});
