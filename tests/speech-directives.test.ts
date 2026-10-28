import test from 'node:test';
import assert from 'node:assert/strict';
import { stripInternalSpeechDirectives, prepareNaturalSpeechText } from '../src/utils/speechText';
test('speech drops explicit hidden and incomplete instructions, retaining the visible reply', () => {
  const input = '<analysis>내부 추론</analysis>안녕하세요. [SYSTEM: 명령문] 편히 쉬세요. <think>숨겨진 생각</think>';
  assert.equal(stripInternalSpeechDirectives(input).replace(/\s+/g, ' '), '안녕하세요. 편히 쉬세요.');
  assert.equal(stripInternalSpeechDirectives('좋은 하루예요. [PROMPT: 읽지 말아야 할 지시'), '좋은 하루예요.');
  assert.equal(stripInternalSpeechDirectives('안녕.\n```system\n내부 지시\n```\n반가워요.').replace(/\s+/g, ' '), '안녕. 반가워요.');
  assert.equal(prepareNaturalSpeechText('[SYSTEM: 내부 내용]'), '');
});
test('ordinary discussion of commands and prompts remains readable', () => {
  const text = '명령 프롬프트를 열고 실행해 보세요. 자연스럽게 읽어 주세요라는 요청도 할 수 있어요.';
  assert.equal(stripInternalSpeechDirectives(text), text);
});
