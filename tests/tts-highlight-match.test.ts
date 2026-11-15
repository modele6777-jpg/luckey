import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_SENTENCE_MATCH_SCORE,
  bestSentenceGroupIndex,
  isSentenceActive,
  scoreSentenceMatch,
} from '../src/lib/ttsHighlightMatch';
import { sentenceIndexAtProgress, sentenceWeight } from '../src/lib/speechHighlightTiming';
import { prepareNaturalSpeechText } from '../src/utils/speechText';
import { splitSpeechIntoSentences } from '../src/utils/tts';
import { groupReactNodesIntoSentences } from '../src/components/common/TTSHighlightedText';

// A daily tarot reading in the shape the app renders: three-line summary, steps
// 1~4 and the blessing of step 5 (heading, quoted blessing, bold affirmation).
// Step 5 is the text the user reported as underlined in the wrong place.
const TAROT_READING = `[핵심 3줄 요약]
- [현재 에너지] 오늘 당신의 마음은 새로운 흐름을 향해 열려 있습니다.
- [방향과 결단] 카드가 가리키는 방향은 당신의 선택을 응원합니다.
- [실천 행동] 작은 정리와 가벼운 대화가 운의 흐름을 바꿉니다.

### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
어서 오세요. 카드를 조용히 마주하니, 당신께서 가슴속에 품고 계신 **"오늘 하루의 흐름"**에 대한 깊은 고민과 복잡한 마음결이 그대로 느껴집니다.

현재 당신의 에너지는 중요한 갈림길 위에 서 있으며, 가장 먼저 모습을 드러낸 **[해] 카드**는 당신이 더 이상 혼자서 불안해하지 않아도 된다는 다정한 위로와 함께 변화의 신호를 건네고 있습니다.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기
_원 카드 (1장 배열)_

[해 정방향]의 상징인 밝은 성취와 활력은 당신의 오늘을 환하게 비춥니다.

### ⚖️ 3. 현재 흐름을 위한 상징적 참고
실제 앱에서 펼쳐진 [해]의 의미는 현재 상황을 돌아보는 한 관점을 제공합니다. 이는 미래의 확정 예언이 아니며, 질문자가 확인할 수 있는 조건과 선택이 우선입니다.

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방
- **마음의 정돈**: 오늘 하루만큼은 타인의 시선이나 과거의 후회에 얽매이지 말고, 당신 자신의 직관에 집중해 보세요.
- **실천 한 걸음**: 가슴속으로만 맴돌던 생각을 밖으로 꺼내어 작은 실천(메모, 가벼운 대화, 정리 정돈)으로 연결해 보세요. 작은 파동이 큰 대운을 불러옵니다.

### ✨ 5. 오늘 하루를 지켜줄 황금빛 축복과 확언
> _"당신의 마음이 머무는 곳에 오늘의 행운이 함께합니다."_

- **오늘의 황금빛 확언**: "나는 오늘 하루도 빛나는 선택을 하는 사람입니다."`;

interface RenderedBlock {
  heading: boolean;
  groups: string[];
}

/** Mirrors how Streamdown renders: headings are one unit, paragraphs keep sentence groups. */
function renderBlocks(markdown: string): RenderedBlock[] {
  const blocks: RenderedBlock[] = [];
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) {
      const headingText = line.replace(/^#+\s*/, '');
      blocks.push({ heading: true, groups: [headingText] });
      continue;
    }
    const body = line.replace(/^[-*•]+\s+/, '').replace(/^>\s*/, '');
    const groups = groupReactNodesIntoSentences([body]).map((group) => group.text);
    blocks.push({ heading: false, groups });
  }
  return blocks;
}

function placesUnderlinedFor(sentence: string, blocks: RenderedBlock[]): string[] {
  const hits: string[] = [];
  for (const block of blocks) {
    for (const group of block.groups) {
      if (isSentenceActive(group, sentence)) hits.push(group.trim());
    }
  }
  return [...new Set(hits)];
}

test('every sentence of a tarot reading is underlined in exactly one place', () => {
  const blocks = renderBlocks(TAROT_READING);
  const spoken = splitSpeechIntoSentences(prepareNaturalSpeechText(TAROT_READING));
  assert.ok(spoken.length >= 15);

  for (const sentence of spoken) {
    const hits = placesUnderlinedFor(sentence, blocks);
    assert.equal(hits.length, 1, `${hits.length} places underlined for "${sentence}": ${JSON.stringify(hits)}`);
  }
});

test('the blessing of step 5 never pulls the underline onto a repeated word', () => {
  const affirmation = '**오늘의 황금빛 확언**: "나는 오늘 하루도 빛나는 선택을 하는 사람입니다."';
  assert.equal(isSentenceActive(affirmation, '다섯째, 오늘 하루를 지켜줄 황금빛 축복과 확언.'), false);
  assert.equal(isSentenceActive('오늘 하루를 지켜줄 황금빛 축복과 확언', '오늘의 황금빛 확언, 나는 오늘 하루도 빛나는 선택을 하는 사람입니다.'), false);
  assert.equal(isSentenceActive('### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방', '다섯째, 오늘 하루를 지켜줄 황금빛 축복과 확언.'), false);
  assert.equal(isSentenceActive('오늘 당신의 마음은 카드의 흐름을 따라갑니다.', '오늘 카드가 당신의 마음과 선택을 비춥니다.'), false);
  assert.equal(isSentenceActive('카드는 당신에게 잠시 멈추라고 말합니다.', '카드는 당신에게 잠시 쉬어가라고 말합니다.'), false);
});

test('the spoken sentence is recognised through numbering, bold labels and quotes', () => {
  assert.ok(isSentenceActive('5. 오늘 하루를 지켜줄 황금빛 축복과 확언', '다섯째, 오늘 하루를 지켜줄 황금빛 축복과 확언.'));
  assert.ok(isSentenceActive('오늘 하루를 지켜줄 황금빛 축복과 확언', '다섯째, 오늘 하루를 지켜줄 황금빛 축복과 확언.'));
  assert.ok(isSentenceActive(
    '- **마음의 정돈**: 오늘 하루만큼은 타인의 시선에 얽매이지 말고 당신의 직관에 집중해 보세요.',
    '마음의 정돈, 오늘 하루만큼은 타인의 시선에 얽매이지 말고 당신의 직관에 집중해 보세요.',
  ));
  assert.ok(isSentenceActive(
    '> _"당신의 마음이 머무는 곳에 오늘의 행운이 함께합니다."_',
    '당신의 마음이 머무는 곳에 오늘의 행운이 함께합니다.',
  ));
  assert.ok(isSentenceActive('AI 상담은 언제든 열려 있습니다.', '에이아이 상담은 언제든 열려 있습니다.'));
});

test('a part cut from a long displayed sentence still belongs to that sentence', () => {
  const displayed = '가슴속으로만 맴돌던 생각을 밖으로 꺼내어 작은 실천으로 연결해 보세요.';
  const boundaryCut = prepareNaturalSpeechText(displayed).slice(0, 26);
  assert.ok(isSentenceActive(displayed, boundaryCut), 'chunk boundary left the underline off the sentence being read');

  const middleCut = '생각을 밖으로 꺼내어 작은 실천으로';
  assert.ok(isSentenceActive(displayed, middleCut));

  const unrelated = '생각을 정리하면 마음이 가벼워집니다.';
  assert.equal(isSentenceActive(displayed, unrelated), false);
});

test('the strongest sentence of a paragraph owns the underline, not the first passing one', () => {
  const groups = [
    '오늘 당신의 마음은 새로운 흐름을 향해 열려 있습니다. ',
    '카드를 조용히 마주하니 당신의 마음결이 그대로 느껴집니다. ',
    '당신의 선택을 응원합니다. ',
  ];
  assert.equal(bestSentenceGroupIndex(groups, '카드를 조용히 마주하니 당신의 마음결이 그대로 느껴집니다.'), 1);
  assert.equal(bestSentenceGroupIndex(groups, '당신의 선택을 응원합니다.'), 2);
  assert.equal(bestSentenceGroupIndex(groups, '전혀 다른 문장이 흘러갑니다.'), -1);
});

test('weak guesses stay below the threshold that draws an underline', () => {
  assert.ok(MIN_SENTENCE_MATCH_SCORE > 0.5);
  assert.equal(scoreSentenceMatch('', '어떤 문장입니다.'), 0);
  assert.equal(scoreSentenceMatch('어떤 문장입니다.', ''), 0);
  assert.equal(scoreSentenceMatch('짧은 말', '다른 짧은 말'), 0);
});

test('the underline follows the audio clock, not the glyph count', () => {
  const sentences = ['다섯째, 오늘의 흐름.', '아주 긴 문장이 이어지면서 마음의 흐름을 천천히 설명합니다.', '마지막 문장입니다.'];
  const weights = sentences.map(sentenceWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  const shareOfFirst = weights[0] / total;
  assert.equal(sentenceIndexAtProgress(sentences, { elapsed: 0.05, duration: 1, paused: false }), 0);
  assert.equal(sentenceIndexAtProgress(sentences, { elapsed: shareOfFirst - 0.2, duration: 1, paused: false }), 0);
  // The drawn underline moves on with the voice, a beat before the exact boundary.
  assert.equal(sentenceIndexAtProgress(sentences, { elapsed: shareOfFirst + 0.05, duration: 1, paused: false }), 1);
  assert.equal(sentenceIndexAtProgress(sentences, { elapsed: 0.999, duration: 1, paused: false }), 2);

  // Numbers are spoken as syllables, so they hold the underline longer.
  const withNumber = sentenceWeight('오늘의 행운의 숫자는 2026, 색은 골드입니다.');
  const withoutNumber = sentenceWeight('오늘의 행운의 숫자는 가나다라, 색은 골드입니다.');
  assert.ok(withNumber > withoutNumber);
  // A sentence that ends a thought pauses longer than one without that pause.
  assert.ok(sentenceWeight('마음이 머무는 곳에 행운이.') > sentenceWeight('마음이 머무는 곳에 행운이'));
  assert.equal(sentenceIndexAtProgress([], { elapsed: 0.2, duration: 1, paused: false }), -1);
  assert.equal(sentenceIndexAtProgress(sentences, { elapsed: 0.2, duration: 0, paused: false }), -1);
});
