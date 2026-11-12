import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '../src/lib/divination/deterministicEngine';
import {
  DEEP_PERSPECTIVE_RESEARCH_COUNTS,
  ENGINE_CATALOG_COUNTS,
  getEngineCatalogMeaning,
  getEngineCatalogResearch,
  getEngineCatalogSources,
} from '../src/lib/divination/engineCatalog';

test('engine catalogue separates 15 foundational tools from 313 deep perspectives', () => {
  assert.equal(ALL_DCE_ENGINES.length, 328);
  assert.deepEqual(ENGINE_CATALOG_COUNTS, { foundational: 15, deep_master: 313 });
});

test('all listed catalog entries retain a readable meaning', () => {
  for (const engine of ALL_DCE_ENGINES) {
    assert.ok(getEngineCatalogMeaning(engine).trim(), `missing meaning for ${engine.key}`);
  }
});

test('foundational tool meanings use their registered practical focus', () => {
  const saju = ALL_DCE_ENGINES.find(engine => engine.key === 'saju')!;
  assert.equal(saju.category, 'foundational');
  assert.match(getEngineCatalogMeaning(saju), /타고난 성향|대운|재능/);
  assert.equal(getEngineCatalogResearch(saju), undefined);
});

test('all 229 newly described perspectives have an individual meaning and accurate source status', () => {
  const undescribedBeforeResearch = ALL_DCE_ENGINES.filter(
    engine => engine.category === 'deep_master' && !engine.summary,
  );
  assert.equal(undescribedBeforeResearch.length, 229);
  assert.deepEqual(DEEP_PERSPECTIVE_RESEARCH_COUNTS, {
    total: 229,
    supported: 219,
    unsupported: 10,
  });

  for (const engine of undescribedBeforeResearch) {
    const research = getEngineCatalogResearch(engine);
    assert.ok(research, `missing researched entry for ${engine.key}`);
    assert.equal(research.nameKo, engine.nameKo, `catalog name mismatch for ${engine.key}`);
    assert.equal(getEngineCatalogMeaning(engine), research.meaning);
    assert.ok(research.meaning.trim(), `empty meaning for ${engine.key}`);

    const sources = getEngineCatalogSources(engine);
    if (research.supported) {
      assert.ok(sources.length > 0, `supported entry has no safe source link: ${engine.key}`);
      assert.ok(sources.every(source => /^https?:\/\//.test(source.url)));
    } else {
      assert.equal(sources.length, 0, `unverified entry should not display a source link: ${engine.key}`);
      assert.match(research.meaning, /^이름을 바탕으로 한 앱 내 해석:/);
    }
  }
});

test('multiple references are exposed as separate links and future unknown entries remain cautious', () => {
  const medicalBioMatrix = ALL_DCE_ENGINES.find(engine => engine.key === 'medicalBioMatrix')!;
  assert.equal(getEngineCatalogSources(medicalBioMatrix).length, 3);

  const futureEngine: DceEngineMeta = {
    key: 'futureUnresearchedPerspective',
    nameKo: '미등록 심층 관점',
    icon: '📘',
    category: 'deep_master',
  };
  const meaning = getEngineCatalogMeaning(futureEngine);
  assert.ok(meaning.includes(futureEngine.nameKo));
  assert.match(meaning, /참고 관점/);
  assert.match(meaning, /개인별 계산·측정·예측 결과를 뜻하지는 않습니다/);
});
