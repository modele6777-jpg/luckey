/**
 * 루시 프롬프트 품질 검사: 여러 생년월일·질문·상담 단계에서 프롬프트가 지켜야 할 약속을 한 번에 확인한다.
 * - 크기 상한, 앱이 지어낸 해석 항목 없음, 공통 판 표시, 해석 카드가 실제 계산값과 일치, 입력이 없으면 개인 카드 없음.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { routeAndExecute } from '../src/lib/divination/smartAgentRouter.ts';
import { findIchingCard } from '../src/lib/divination/knowledge/ichingCards.ts';

const PROFILES: Array<{ label: string; basic: Record<string, unknown> }> = [
  { label: '1990 여 서울 시간 있음', basic: { birthdate: '1990-05-15', birthtime: '14:30', gender: 'female', lunarSolar: 'solar', birthCity: '서울' } },
  { label: '1975 남 부산 새벽', basic: { birthdate: '1975-02-03', birthtime: '05:10', gender: 'male', lunarSolar: 'solar', birthCity: '부산' } },
  { label: '2001 여 음력 생시 없음', basic: { birthdate: '2001-08-15', gender: 'female', lunarSolar: 'lunar' } },
  { label: '1988 남 진태양시', basic: { birthdate: '1988-11-30', birthtime: '23:40', gender: 'male', lunarSolar: 'solar', birthCity: '대구', trueSolarTime: true } },
];
const QUESTIONS = ['이직을 해야 할지 고민이에요', '그 사람 마음이 궁금해요', '올해 돈 흐름은 어때요?'];
const BANNED = ['SynthesisMatrix', 'ritualAction', 'reflectiveQuestion', 'interpretiveBoundary', 'timelineCards', 'masterAffirmation'];

function jsonOf(prompt: string): any[] {
  const start = prompt.indexOf('[계산 상태 및 데이터 JSON]\n') + '[계산 상태 및 데이터 JSON]\n'.length;
  return JSON.parse(prompt.slice(start, prompt.indexOf('[JSON 끝]')));
}

for (const { label, basic } of PROFILES) {
  for (const base of ['saju', 'tarot_saju'] as const) {
    test(`prompt quality · ${label} · 루시프로 ${base}`, () => {
      for (const text of QUESTIONS) {
        const r = routeAndExecute({ text, profile: { basic } as any, isMasterRequested: true, divinationMode: { base } });
        const prompt = r.promptInjection;
        assert.ok(prompt.length < 60000, `통합 상담 길이 ${prompt.length}`);
        for (const word of BANNED) assert.ok(!prompt.includes(word), `금지 항목 ${word}`);
        const tools = jsonOf(prompt);
        const iching = tools.find(t => t.tool === '주역');
        // 통합 상담은 사주와 함께 13대 도구를 늘 계산한다.
        assert.ok(iching, '13대 도구(주역)가 함께 전달된다');
        if (iching?.status === 'calculated') {
          assert.match(String(iching.scope), /지금 시각의 괘/);
          const card = findIchingCard(iching.data?.primary?.name);
          assert.ok(card, 'computed hexagram has a card');
          assert.ok(prompt.includes(`주역 본괘 ${card!.number}. ${card!.name}`), 'the attached card is the computed hexagram');
        }
        const taiyi = tools.find(t => t.tool === '태을신수');
        assert.ok(taiyi, '태을신수도 함께 전달된다');
        if (taiyi?.status === 'calculated') assert.match(String(taiyi.scope), /올해의 연국/);
        if (!basic.birthtime) assert.ok(!prompt.includes('명궁 주성'), '생시가 없으면 자미두수 명궁 카드를 붙이지 않는다');
      }
    });
  }
}

test('without a birth date no personal cards are attached', () => {
  const r = routeAndExecute({ text: '이직 고민', profile: { basic: {} } as any, isMasterRequested: true, divinationMode: { base: 'tarot_saju' } });
  for (const personal of ['자미두수 명궁 주성', '구성학 본명성', '숙요 본명숙']) assert.ok(!r.promptInjection.includes(personal), personal);
});
