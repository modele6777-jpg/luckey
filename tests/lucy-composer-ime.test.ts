import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Exercise the actual textarea callbacks without mounting the full AI/audio application.
const source = ts.createSourceFile('LucyStandalonePage.tsx', readFileSync(
  new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8',
), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const callbacks: Record<string, string> = {};
function visit(node: ts.Node) {
  if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
    && node.tagName.getText(source) === 'textarea') {
    for (const prop of node.attributes.properties) {
      if (ts.isJsxAttribute(prop) && prop.initializer && ts.isJsxExpression(prop.initializer)
        && prop.initializer.expression) {
        callbacks[prop.name.getText(source)] = prop.initializer.expression.getText(source);
      }
    }
  }
  ts.forEachChild(node, visit);
}
visit(source);

function composer() {
  let sends = 0;
  let prevented = 0;
  let completed = '';
  const context = {
    input: '',
    currentGhostPromptRef: { current: '예시 질문' },
    hasPendingAnswer: false,
    isInputComposingRef: { current: false },
    handleSend: () => { sends++; },
    setInput: (value: string) => { completed = value; },
  };
  const callback = (name: string) => {
    assert.ok(callbacks[name], `textarea must wire ${name}`);
    return runInNewContext(ts.transpileModule(`(${callbacks[name]})`, {
      compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText, context);
  };
  const keyDown = callback('onKeyDown');
  return {
    start: callback('onCompositionStart'),
    end: callback('onCompositionEnd'),
    key: (key = 'Enter', isComposing = false, keyCode = 13, shiftKey = false) => keyDown({
      key, shiftKey, nativeEvent: { isComposing, keyCode },
      preventDefault: () => { prevented++; },
    }),
    result: () => ({ sends, prevented, completed }),
  };
}

test('Korean composition confirmation preserves text; a later Enter sends once', () => {
  const chat = composer();
  chat.start();
  chat.key(); // Composition ref also covers browsers missing the native flag.
  chat.key('Tab', true, 229);
  assert.deepEqual(chat.result(), { sends: 0, prevented: 0, completed: '' });
  chat.end();
  chat.key('Enter', false, 229); // Safari can deliver compositionend before keydown.
  chat.key('Enter', true);
  assert.equal(chat.result().sends, 0);
  assert.equal(chat.result().prevented, 0);
  chat.key();
  assert.deepEqual(chat.result(), { sends: 1, prevented: 1, completed: '' });
});

test('Shift+Enter stays a newline and Tab still completes the example after composition', () => {
  const chat = composer();
  chat.key('Enter', false, 13, true);
  chat.key('a', false, 65);
  assert.deepEqual(chat.result(), { sends: 0, prevented: 0, completed: '' });
  chat.key('Tab', false, 9);
  assert.deepEqual(chat.result(), { sends: 0, prevented: 1, completed: '예시 질문' });
});
