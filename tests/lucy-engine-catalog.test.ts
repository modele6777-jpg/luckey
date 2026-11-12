import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DCE_ENGINES } from '../src/lib/divination/deterministicEngine';
import { ENGINE_CATALOG_COUNTS, getEngineCatalogMeaning } from '../src/lib/divination/engineCatalog';


test('engine catalogue separates 15 foundational tools from 292 deep perspectives', () => {
  assert.equal(ALL_DCE_ENGINES.length, 307);
  assert.deepEqual(ENGINE_CATALOG_COUNTS, { foundational: 15, deep_master: 292 });
});

test('foundational tool meanings use their registered practical focus', () => {
  const saju = ALL_DCE_ENGINES.find(engine => engine.key === 'saju')!;
  assert.equal(saju.category, 'foundational');
  assert.match(getEngineCatalogMeaning(saju), /타고난 성향|대운|재능/);
});

test('deep perspectives show summaries when available and safe fallback wording otherwise', () => {
  const described = ALL_DCE_ENGINES.find(engine => engine.category === 'deep_master' && engine.summary)!;
  assert.equal(getEngineCatalogMeaning(described), described.summary);

  const undescribed = ALL_DCE_ENGINES.find(engine => engine.category === 'deep_master' && !engine.summary)!;
  const meaning = getEngineCatalogMeaning(undescribed);
  assert.ok(meaning.includes(undescribed.nameKo));
  assert.match(meaning, /참고 관점/);
  assert.match(meaning, /개인별 계산·측정·예측 결과를 뜻하지는 않습니다/);
});
