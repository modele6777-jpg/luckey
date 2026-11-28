import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectChatDeepPerspectiveKeys } from '../src/lib/lucyChatEngineMatch.ts';

function loadDeepEngines() {
  const source = readFileSync(new URL('../src/lib/divination/deterministicEngine.ts', import.meta.url), 'utf8');
  const engines = [];
  const pattern = /\{\s*key:\s*'([^']+)',\s*nameKo:\s*'([^']+)',\s*icon:\s*'[^']*',\s*category:\s*'deep_master'(?:,\s*summary:\s*'((?:\\'|[^'])*)')?/g;
  for (const match of source.matchAll(pattern)) {
    engines.push({
      key: match[1],
      nameKo: match[2],
      summary: (match[3] || '').replace(/\\'/g, "'"),
    });
  }
  return engines;
}

const engines = loadDeepEngines();
const lovePreferred = [
  'contextualSynastry',
  'destinySynastryEcho',
  'swissJungIndividuationArchetype',
  'koreanChusaKimJeonghuiSehando',
];
const careerPreferred = [
  'italianMachiavelliVirtuFortuna',
  'koreanRyuSeongryongJingbirok',
  'swissJungIndividuationArchetype',
];

test('엔진함 심층 관점을 읽어 온다', () => {
  assert.ok(engines.length > 50, `parsed ${engines.length}`);
  assert.ok(engines.some(engine => engine.key === 'contextualSynastry'));
});

test('관계 질문은 엔진함의 인연 관점을 고른다', () => {
  const keys = selectChatDeepPerspectiveKeys({
    question: '그 사람이 답장을 안 해서 서운해',
    intentTerms: ['연애', '관계', '사랑'],
    preferredKeys: lovePreferred,
    engines,
    limit: 2,
  });
  assert.equal(keys.length, 2);
  assert.ok(keys.some(key => lovePreferred.includes(key)), keys.join(','));
  assert.ok(!keys.includes('sajuClassicYongshin'), keys.join(','));
});

test('이직 고민은 커리어 관점을 고르고 기본 사주 폴백은 쓰지 않는다', () => {
  const keys = selectChatDeepPerspectiveKeys({
    question: '이직할까 고민이야',
    intentTerms: ['이직', '커리어', '진로'],
    preferredKeys: careerPreferred,
    engines,
    limit: 2,
  });
  assert.equal(keys.length, 2);
  assert.ok(keys.some(key => careerPreferred.includes(key)), keys.join(','));
});

test('의도 없는 마음 이야기는 사주 원국 관점을 강제하지 않는다', () => {
  const keys = selectChatDeepPerspectiveKeys({
    question: '요즘 마음이 너무 복잡해',
    intentTerms: [],
    preferredKeys: [],
    engines,
    limit: 2,
  });
  assert.equal(keys.length, 2);
  assert.ok(!keys.includes('sajuClassicYongshin'));
  assert.ok(!keys.includes('geokguk'));
});

test('짧은 잡담도 관점은 두 개로 채운다', () => {
  const keys = selectChatDeepPerspectiveKeys({
    question: '그냥 심심해서',
    engines,
    limit: 2,
  });
  assert.equal(keys.length, 2);
  assert.equal(new Set(keys).size, 2);
});

test('루시채팅은 고른 엔진함 키를 배지로 넘긴다', () => {
  const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
  const router = readFileSync(new URL('../src/lib/divination/smartAgentRouter.ts', import.meta.url), 'utf8');
  const context = readFileSync(new URL('../src/contexts/AppContext.tsx', import.meta.url), 'utf8');
  assert.match(page, /deepOnly: true/);
  assert.match(page, /deepPerspectiveKeys: divinationSelection\.deepPerspectiveKeys \|\| \[\]/);
  assert.match(router, /selectChatDeepPerspectiveKeys/);
  assert.match(router, /fateFallbackReason\.includes\('타고난 사주 원국'\)/);
  assert.match(context, /deepPerspectiveKeys: options\?\.deepPerspectiveKeys \|\| \[\]/);
  assert.match(context, /extraSystemContext \|\| ''/);
});
