import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ENGINE_CATALOG_THEME_COUNTS,
  type EngineCatalogCategoryFilter,
  type EngineCatalogThemeFilter,
  filterCatalogEngines,
  getEngineCatalogTheme,
  LUCY_PRO_CATALOG_ENGINES,
  LUCY_PRO_CHANNEL_THEMES,
  selectCatalogEngines,
} from '../src/lib/divination/engineCatalog';

const CATEGORIES: EngineCatalogCategoryFilter[] = ['all', 'foundational', 'deep_master'];
const THEMES: EngineCatalogThemeFilter[] = ['all', ...LUCY_PRO_CHANNEL_THEMES.map(theme => theme.id)];

test('a catalog with no filter keeps the registered totals on both chip rows', () => {
  const { engines, counts } = selectCatalogEngines();
  assert.equal(engines.length, 360);
  assert.deepEqual(counts.categories, { all: 360, foundational: 15, deep_master: 345 });
  assert.equal(counts.themes.all, 360);
  for (const theme of LUCY_PRO_CHANNEL_THEMES) {
    assert.equal(counts.themes[theme.id], ENGINE_CATALOG_THEME_COUNTS[theme.id], `theme chip drifted: ${theme.id}`);
  }
});

test('선택한 심층 관점에서 테마 칩이 전체 수치(360·프롤로그 5)가 아니라 표시 목록(345·프롤로그 3)을 가리킨다', () => {
  const { engines, counts } = selectCatalogEngines({ category: 'deep_master' });
  assert.equal(engines.length, 345);
  assert.equal(counts.categories.all, 360);
  assert.equal(counts.categories.deep_master, 345);
  assert.equal(counts.themes.all, 345);
  assert.equal(counts.themes.prologue, 3);
  // 칩 숫자 === 그 칩을 눌렀을 때 보이는 개수(섹션 헤더 '3개').
  assert.equal(selectCatalogEngines({ category: 'deep_master', theme: 'prologue' }).engines.length, counts.themes.prologue);
});

test('선택한 프롤로그 테마에서 분류 칩이 필터된 5개(기초 2·심층 3)를 가리킨다', () => {
  const { engines, counts } = selectCatalogEngines({ theme: 'prologue' });
  assert.equal(engines.length, 5);
  assert.equal(counts.categories.all, 5);
  assert.equal(counts.categories.foundational, 2);
  assert.equal(counts.categories.deep_master, 3);
  assert.equal(counts.categories.foundational + counts.categories.deep_master, counts.categories.all);
  assert.equal(selectCatalogEngines({ theme: 'prologue', category: 'deep_master' }).engines.length, counts.categories.deep_master);
});

test('검색어와 분류·테마 필터가 겹쳐도 칩 숫자와 표시 개수·섹션 헤더가 같은 목록을 가리킨다', () => {
  const queries = ['', '사주', '존재하지않는검색어'];

  for (const category of CATEGORIES) {
    for (const theme of THEMES) {
      for (const query of queries) {
        const label = `category=${category} theme=${theme} query=${query || '(빈 검색어)'}`;
        const { engines, counts } = selectCatalogEngines({ category, theme, query });
        const themeBasis = filterCatalogEngines({ theme, query });
        const categoryBasis = filterCatalogEngines({ category, query });

        // 분류 칩은 테마·검색어 기준, 테마 칩은 분류·검색어 기준으로 계산된다.
        assert.equal(counts.categories.all, themeBasis.length, label);
        assert.equal(counts.themes.all, categoryBasis.length, label);
        assert.equal(counts.categories.foundational + counts.categories.deep_master, counts.categories.all, label);
        assert.equal(
          LUCY_PRO_CHANNEL_THEMES.reduce((sum, item) => sum + counts.themes[item.id], 0),
          counts.themes.all,
          label,
        );

        // '모든 테마' 숫자는 표시 개수, 특정 테마 숫자는 그 테마 섹션 헤더와 같아야 한다.
        assert.equal(engines.length, theme === 'all' ? counts.themes.all : counts.themes[theme], label);

        // 표시 목록의 테마별 묶음 합(각 섹션 헤더 합)도 표시 개수와 일치한다.
        const sectionTotal = LUCY_PRO_CHANNEL_THEMES.reduce(
          (sum, item) => sum + engines.filter(engine => getEngineCatalogTheme(engine) === item.id).length,
          0,
        );
        assert.equal(sectionTotal, engines.length, label);

        // 표시 목록은 항상 카탈로그의 부분집합이다.
        assert.equal(engines.every(engine => LUCY_PRO_CATALOG_ENGINES.includes(engine)), true, label);
      }
    }
  }
});
