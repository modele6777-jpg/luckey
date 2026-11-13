import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDeepSynapseContext, PERSONAS } from '../src/lib/ai';

const profile = {
  basic: {
    name: '검사용',
    birthdate: '1990-05-17',
    birthtime: '14:30',
    gender: 'female' as const,
    birthCity: '서울',
  },
};

test('profile context is background only and does not claim every divination tool ran', () => {
  const context = buildDeepSynapseContext(profile);
  assert.match(context, /프로필 기반 사주·출생 차트 요약은 대화 배경으로만 사용/);
  assert.match(context, /이번 메시지에 포함된 라우터 계산 근거와 감사 기록만 기준/);
  assert.doesNotMatch(context, /15대 운명학 시드 지표|15대 도구 중 가장 적합한|마하보테 8요일 부분 계산|태국점성술 요일 상징|카발라 생명나무/);
});

test('Lucy persona does not claim unprovided engine results or hidden emotional knowledge', () => {
  const system = PERSONAS.lucyFull('', '', '', '', '');
  assert.match(system, /이번 메시지에 실제 제공된 계산 결과만 사용해/);
  assert.match(system, /제공되지 않은 도구를 실행한 것처럼 말하지 마/);
  assert.match(system, /숨은 감정이나 무의식은 알고 있다고 단정하지 말고/);
  assert.doesNotMatch(system, /15대 운명학 시드 지표|60여 개 결정론 계산 엔진|완벽히 품고/);
});
