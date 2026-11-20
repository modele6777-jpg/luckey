import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '../src/lib/divination/deterministicEngine';
import { LUCY_PRO_CATALOG_TOTAL_COUNT, LUCY_PRO_DEEP_PERSPECTIVE_COUNT, LUCY_PRO_FOUNDATIONAL_COUNT } from '../src/lib/divination/engineCatalogCount';
import { LUCY_PRO_CATALOG_DUPLICATE_KEYS } from '../src/lib/divination/catalogDuplicateKeys';
import { LUCY_PRO_CATALOG_OMITTED_KEYS } from '../src/lib/divination/catalogApprovedOmissions';
import {
  DEEP_PERSPECTIVE_RESEARCH_COUNTS,
  ENGINE_CATALOG_COUNTS,
  ENGINE_CATALOG_THEME_COUNTS,
  getEngineCatalogMeaning,
  getEngineCatalogResearch,
  getEngineCatalogSources,
  getEngineCatalogTheme,
  LUCY_PRO_CATALOG_ENGINES,
  LUCY_PRO_CHANNEL_THEMES,
} from '../src/lib/divination/engineCatalog';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '../src/lib/fifteenDivinationTools';

test('Lucy Pro catalog contains the approved 435 entries: 15 foundational tools and 420 deep perspectives', () => {
  assert.equal(ALL_DCE_ENGINES.length, 437);
  assert.equal(LUCY_PRO_CATALOG_ENGINES.length, 435);
  assert.equal(LUCY_PRO_FOUNDATIONAL_COUNT, 15);
  assert.equal(LUCY_PRO_CATALOG_TOTAL_COUNT, 435);
  assert.equal(LUCY_PRO_DEEP_PERSPECTIVE_COUNT, ENGINE_CATALOG_COUNTS.deep_master);
  assert.equal(LUCY_PRO_DEEP_PERSPECTIVE_COUNT, 420);
  assert.deepEqual(ENGINE_CATALOG_COUNTS, { foundational: 15, deep_master: 420 });
  assert.equal(new Set(LUCY_PRO_CATALOG_ENGINES.map(engine => engine.key)).size, 435);
  assert.deepEqual([...LUCY_PRO_CATALOG_OMITTED_KEYS], [
    'irishJamesJoyceUlyssesEpiphany',
    'germanHermannHesseDemianSteppenwolf',
  ]);
  for (const key of LUCY_PRO_CATALOG_OMITTED_KEYS) {
    assert.equal(LUCY_PRO_CATALOG_ENGINES.some(engine => engine.key === key), false, `unapproved item remains visible: ${key}`);
  }
  for (const key of LUCY_PRO_CATALOG_DUPLICATE_KEYS) {
    assert.equal(LUCY_PRO_CATALOG_ENGINES.some(engine => engine.key === key), false, `duplicate remains visible: ${key}`);
  }
});

test('every listed engine has a readable meaning and one of the seven channel themes', () => {
  const totalThemeCount = Object.values(ENGINE_CATALOG_THEME_COUNTS).reduce((sum, count) => sum + count, 0);
  assert.equal(LUCY_PRO_CHANNEL_THEMES.length, 7);
  assert.equal(totalThemeCount, LUCY_PRO_CATALOG_ENGINES.length);
  assert.deepEqual(ENGINE_CATALOG_THEME_COUNTS, {
    prologue: 5,
    orange: 26,
    trinity: 88,
    aura: 99,
    bluebird: 62,
    muse: 146,
    epilogue: 9,
  });

  for (const theme of LUCY_PRO_CHANNEL_THEMES) {
    assert.ok(ENGINE_CATALOG_THEME_COUNTS[theme.id] > 0, `empty channel theme: ${theme.id}`);
  }

  for (const engine of LUCY_PRO_CATALOG_ENGINES) {
    assert.ok(getEngineCatalogMeaning(engine).trim(), `missing meaning for ${engine.key}`);
    assert.ok(LUCY_PRO_CHANNEL_THEMES.some(theme => theme.id === getEngineCatalogTheme(engine)), `missing theme for ${engine.key}`);
  }
});

test('bluebird catalog label changes without changing its ID, route, or count', () => {
  const theme = LUCY_PRO_CHANNEL_THEMES.find(item => item.id === 'bluebird');
  assert.deepEqual(theme, {
    id: 'bluebird',
    label: '블루버드',
    emoji: '🕊️',
    route: '/bluebird',
    description: '일상·관계·소통',
  });
  assert.equal(ENGINE_CATALOG_THEME_COUNTS.bluebird, 38);
});

test('foundational tool meanings and primary themes use their existing authored definitions', () => {
  for (const engine of ALL_DCE_ENGINES.filter(item => item.category === 'foundational')) {
    const tool = FIFTEEN_DIVINATION_TOOLS[engine.key as DivinationToolId];
    assert.ok(tool, `missing foundational definition for ${engine.key}`);
    assert.equal(getEngineCatalogTheme(engine), tool.primaryTheme);
    assert.equal(getEngineCatalogMeaning(engine), tool.bestFor || tool.coreEssence);
  }

  const saju = ALL_DCE_ENGINES.find(engine => engine.key === 'saju')!;
  assert.equal(saju.category, 'foundational');
  assert.match(getEngineCatalogMeaning(saju), /타고난 성향|대운|재능/);
  assert.equal(getEngineCatalogResearch(saju), undefined);
});

test('automatic theme classification prioritizes named divination systems over generic reflection wording', () => {
  const ziweiFlyingStars = ALL_DCE_ENGINES.find(engine => engine.key === 'ziweiFlyingStars')!;
  assert.equal(getEngineCatalogTheme(ziweiFlyingStars), 'trinity');
});
test('all currently summary-missing catalog perspectives retain their researched meaning and source status', () => {
  const undescribedBeforeResearch = ALL_DCE_ENGINES.filter(
    engine => engine.category === 'deep_master' && !engine.summary,
  );
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
      assert.ok(sources.length > 0, `supported entry has no safe source: ${engine.key}`);
      assert.ok(sources.every(source => /^https?:\/\//.test(source.url)));
    } else {
      assert.equal(sources.length, 0, `unverified entry should not expose a source: ${engine.key}`);
      assert.match(research.meaning, /^이름을 바탕으로 한 앱 내 해석:/);
    }
  }
});

test('future engines automatically use an authored meaning and matching primary theme', () => {
  const futureHealthEngine: DceEngineMeta = {
    key: 'futureSleepMeditationRecovery',
    nameKo: '수면 명상 회복 관점',
    icon: '🌙',
    category: 'deep_master',
    meaning: '수면과 명상을 통해 몸과 마음의 회복 리듬을 살피는 참고 관점입니다.',
  };
  assert.equal(getEngineCatalogMeaning(futureHealthEngine), futureHealthEngine.meaning);
  assert.equal(getEngineCatalogTheme(futureHealthEngine), 'aura');

  const explicitThemeEngine: DceEngineMeta = {
    key: 'futureCreativePerspective',
    nameKo: '창작 영감 관점',
    icon: '🎨',
    category: 'deep_master',
    summary: '창작과 예술적 영감을 살피는 참고 관점입니다.',
    primaryTheme: 'muse',
  };
  assert.equal(getEngineCatalogMeaning(explicitThemeEngine), explicitThemeEngine.summary);
  assert.equal(getEngineCatalogTheme(explicitThemeEngine), 'muse');
});

test('future unresearched entries still receive a cautious meaning and default channel theme', () => {
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
  assert.equal(getEngineCatalogTheme(futureEngine), 'trinity');
});

test('Joyce, Hesse, and Han Yong-un catalog meanings avoid unsupported quotations and personal measures', () => {
  const joyce = getEngineCatalogMeaning(ALL_DCE_ENGINES.find(engine => engine.key === 'irishJamesJoyceUlyssesEpiphany')!);
  assert.match(joyce, /Stephen Hero/);
  assert.doesNotMatch(joyce, /Yes I said yes I will Yes|\/100/);

  const hesse = getEngineCatalogMeaning(ALL_DCE_ENGINES.find(engine => engine.key === 'germanHermannHesseDemianSteppenwolf')!);
  assert.match(hesse, /문학적 관점/);
  assert.doesNotMatch(hesse, /양극성.*치유|치유.*양극성/);

  const han = getEngineCatalogMeaning(ALL_DCE_ENGINES.find(engine => engine.key === 'koreanHanYongUnSilenceOfNim')!);
  assert.match(han, /확인되지 않은 인용/);
  assert.match(han, /동의와 안전/);
});

test('multiple references remain available to internal review while the dialog may omit their links', () => {
  const medicalBioMatrix = ALL_DCE_ENGINES.find(engine => engine.key === 'medicalBioMatrix')!;
  assert.equal(getEngineCatalogSources(medicalBioMatrix).length, 3);
});
