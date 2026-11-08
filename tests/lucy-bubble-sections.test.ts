import test from 'node:test';
import assert from 'node:assert/strict';
import { splitIntoKakaoBubbles, joinKakaoBubblesForTTS } from '../src/lib/lucyChatUtils';

test('breathing instructions keep each screenshot heading with its explanation', () => {
  const sections = [
    ['• **준비 단계:**', '편안하게 앉아서 어깨의 힘을 빼고 배 위에 손을 올려봐.'],
    ['• **1단계 (4초 들이쉬기):**', '천천히 코로 숨을 깊게 들이쉬며 아래배가 부푸는 것을 느껴봐.'],
    ['• **2단계 (7초 숨 참기):**', '들이쉰 숨을 몸 안에 머금고 부드럽게 멈춰봐.'],
    ['• **3단계 (8초 내쉬기):**', '입술을 살짝 벌리고 긴장과 답답함을 길게 내쉬어봐.'],
    ['• **실천 팁 & 효과:**', '이 주기 호흡을 반복하면서 몸과 마음의 변화를 살펴봐.'],
    ['• **계산 근거 및 한계:**', '본 조언은 상징적 웰니스 가이드이며 실제 측정값은 아니야.'],
  ];
  const text = ['차분하게 호흡을 함께 해보자.', ...sections.flat(), '지금은 어떤 느낌이 들어?'].join('\n\n');
  for (const limit of [1, 2, 3, 4, 6, 12]) {
    const bubbles = splitIntoKakaoBubbles(text, limit);
    assert.ok(bubbles.length <= limit, `limit ${limit}`);
    for (const [heading, body] of sections) {
      assert.ok(bubbles.some(bubble => bubble.includes(heading) && bubble.includes(body)), heading);
    }
    assert.equal(bubbles.join('\n\n'), text);
  }
  assert.equal(joinKakaoBubblesForTTS(text), text);
});

test('heading styles and headings attached to previous text stay with following bodies', () => {
  for (const heading of ['### 실천 팁', '• ### 실천 팁', '**실천 팁:**', '- **실천 팁:**', '* **실천 팁:**', '· **실천 팁:**', '• 실천 팁:', '1. 실천 팁:', '준비 단계:']) {
    const body = '이 설명은 소제목과 같은 말풍선에서 읽을 수 있어야 해. 천천히 내용을 확인해봐.';
    for (const prefix of ['', '이전 설명이 충분히 길게 이어지는 문단이야.\n']) {
      const text = `${prefix}${heading}\n\n${body}`;
      const bubbles = splitIntoKakaoBubbles(text);
      assert.equal(bubbles.length, 1, heading);
      assert.ok(bubbles[0].includes(heading) && bubbles[0].includes(body));
    }
  }
});

test('plain paragraphs stay ordered and within the requested bubble count', () => {
  for (let count = 2; count <= 20; count++) {
    const paragraphs = Array.from({ length: count }, (_, i) => `${i + 1}번째 설명이야. ${'문장 내용이야. '.repeat((i % 5) + 1)}`.trim());
    const text = paragraphs.join('\n\n');
    for (const limit of [1, 2, 3, 4]) {
      const bubbles = splitIntoKakaoBubbles(text, limit);
      assert.ok(bubbles.length <= limit, `${count} paragraphs / ${limit} bubbles`);
      assert.equal(bubbles.join('\n\n'), text);
    }
  }
});

test('code blocks, tables and ordinary sentence splitting retain their content', () => {
  const code = '```ts\nconst first = 1;\n\nconst second = 2;\n```';
  const table = '| 항목 | 값 |\n| --- | --- |\n| 호흡 | 천천히 |';
  const bubbles = splitIntoKakaoBubbles(`앞 설명이야.\n\n${code}\n\n${table}\n\n마지막 설명이야.`);
  assert.ok(bubbles.some(bubble => bubble.includes(code)));
  assert.ok(bubbles.some(bubble => bubble.includes(table)));
  const text = '첫 번째 문장은 충분한 길이로 자연스럽게 이야기를 시작해. 두 번째 문장에서는 조금 더 자세한 설명을 덧붙여. 마지막 문장은 편안하게 마무리해.';
  const sentences = splitIntoKakaoBubbles(text);
  assert.ok(sentences.length > 1);
  assert.equal(sentences.join(' '), text);
});
