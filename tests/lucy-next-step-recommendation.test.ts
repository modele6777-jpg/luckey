import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectLucyRecommendationKind } from '../src/lib/lucyNextStepRecommendation';

const answer = '지금 할 수 있는 다음 행동을 함께 차분히 정리해 볼게요.';
const recommendationComponent = readFileSync(new URL('../src/components/LucyResponseRecommendation.tsx', import.meta.url), 'utf8');
const lucyPage = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');

// ── 답변 말미 추천은 항상 단일 선택 ──────────────────────────────────────────────

test('a practical self-care conversation recommends the Key channel', () => {
  assert.equal(
    selectLucyRecommendationKind({ userQuery: '스트레스 줄이는 실천 방법을 알려줘', lucyAnswer: answer }),
    'key',
  );
});

test('a topic-led conversation falls back to one Luckey channel recommendation', () => {
  assert.equal(
    selectLucyRecommendationKind({ userQuery: '창작에 영감을 줄 예술 이야기를 해줘', lucyAnswer: answer }),
    'luckey',
  );
});

test('an explicit divination request recommends Divination Mode in ordinary Lucy', () => {
  assert.equal(
    selectLucyRecommendationKind({ userQuery: '이번 달 운세를 사주로 봐줘', lucyAnswer: answer }),
    'divination',
  );
});

test('recent conversation context can select Divination Mode for a short follow-up', () => {
  assert.equal(
    selectLucyRecommendationKind({
      userQuery: '그럼 지금은 어떻게 보면 좋을까?',
      recentUserTexts: ['요즘 이직 때문에 불안하고 결정을 못 하겠어', '사주 흐름도 궁금해'],
      lucyAnswer: answer,
    }),
    'divination',
  );
});

test('the existing context offer can select Divination Mode, but not while already there', () => {
  assert.equal(
    selectLucyRecommendationKind({ userQuery: '이 이야기를 더 보고 싶어', lucyAnswer: answer, forceDivination: true }),
    'divination',
  );
  assert.equal(
    selectLucyRecommendationKind({ userQuery: '사주 상담을 이어가자', lucyAnswer: answer, isMasterMode: true }),
    'luckey',
  );
});

test('greetings, casual messages, and empty context do not receive a consultation recommendation', () => {
  assert.equal(selectLucyRecommendationKind({ userQuery: '안녕', lucyAnswer: answer, isGreeting: true }), null);
  assert.equal(selectLucyRecommendationKind({ userQuery: '오늘은 뭐 해?', lucyAnswer: answer, isCasual: true }), null);
  assert.equal(selectLucyRecommendationKind({ userQuery: '', lucyAnswer: answer }), null);
  assert.equal(selectLucyRecommendationKind({ userQuery: '고민이 있어', lucyAnswer: '짧아요' }), null);
});

test('each substantive response yields one scalar recommendation, never a list of destinations', () => {
  const contexts = [
    { userQuery: '개운법을 알려줘', lucyAnswer: answer },
    { userQuery: '타로로 선택을 보고 싶어', lucyAnswer: answer },
    { userQuery: '명화로 마음을 환기하고 싶어', lucyAnswer: answer },
  ];
  for (const context of contexts) {
    const selected = selectLucyRecommendationKind(context);
    assert.ok(selected);
    assert.ok(['key', 'luckey', 'divination'].includes(selected));
    assert.equal(Array.isArray(selected), false);
  }
});

test('the rendered recommendation has one destination action and stays outside the spoken message text', () => {
  assert.equal((recommendationComponent.match(/data-lucy-recommendation-action="true"/g) || []).length, 1);
  assert.match(lucyPage, /renderRecommendationFooter=\{\(\) =>/);
  assert.match(lucyPage, /textContent=\{textContent\}/);
  assert.doesNotMatch(lucyPage, /data-lucy-master-offer/);
});
