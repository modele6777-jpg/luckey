import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import postcss from 'postcss';
import { parse } from 'parse5';

const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const css = postcss.parse(await read('src/styles/duo-workspace.css'));
const columnsAt = width => {
  let columns;
  css.walkRules('.duo-split-workspace', rule => {
    let active = true;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type === 'atrule' && parent.name === 'container') {
        const minimum = /min-width:\s*(\d+)px/.exec(parent.params);
        if (minimum && width < Number(minimum[1])) active = false;
      }
    }
    if (active) rule.walkDecls('grid-template-columns', declaration => { columns = declaration.value; });
  });
  return columns;
};
for (const width of [375, 599]) assert.equal(columnsAt(width), 'minmax(0, 1fr)');
for (const width of [600, 768, 1024, 1280, 1920]) assert.equal(columnsAt(width), 'repeat(2, minmax(0, 1fr))');

// Exercise the actual media subscription, including cleanup and SSR fallback.
const code = ts.transpileModule(await read('src/hooks/useWideWorkspace.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
let wide = false;
let listener;
let subscriptions;
const context = vm.createContext({
  exports: {},
  require: () => ({ useMemo: factory => factory(), useSyncExternalStore: (...args) => { subscriptions = args; return args[1](); } }),
  window: { addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ get matches() { return wide; }, addEventListener: (_, fn) => { listener = fn; }, removeEventListener: (_, fn) => { if (listener === fn) listener = null; } }) },
});
vm.runInContext(code, context);
assert.equal(context.exports.useWideWorkspace(), false);
let updates = 0;
const unsubscribe = subscriptions[0](() => updates++);
wide = true;
listener();
assert.equal(context.exports.useWideWorkspace(), true);
assert.equal(updates, 1);
assert.equal(subscriptions[2](), false);
unsubscribe();
assert.equal(listener, null);

// The same Key IDs must remain inside the correct live input/output panes.
const document = parse(await read('public/calm/index.html'));
const descendants = [];
const walk = node => { descendants.push(node); node.childNodes?.forEach(walk); };
walk(document);
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const byId = id => descendants.filter(node => attr(node, 'id') === id);
const inside = (node, className) => {
  for (let parent = node.parentNode; parent; parent = parent.parentNode) {
    if (attr(parent, 'class')?.split(/\s+/).includes(className)) return true;
  }
  return false;
};
for (const [id, pane] of [['breathing-balloon', 'calm-input'], ['breathing-audio-panel', 'calm-output'], ['breathing-celebration-card', 'calm-output'], ['workbook-entries-container', 'calm-output']]) {
  assert.equal(byId(id).length, 1, `Keep a single ${id}`);
  assert.ok(inside(byId(id)[0], pane), `${id} belongs in ${pane}`);
}
const key = await read('src/pages/CalmApp.tsx');
assert.doesNotMatch(key, /fixed inset-0 w-full h-\[100dvh\]/);
assert.match(key, /relative w-full min-w-0 h-app-full/);

console.log('Passed: Duo workspace container breakpoints, media subscription cleanup, SSR fallback, Key input/output boundaries and sidebar-safe iframe sizing.');
