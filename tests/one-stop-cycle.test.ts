import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceOneStopCycle, normalizeOneStopState, type OneStopState } from '../src/lib/omniWarp/oneStopCycle';
const paths = ['/', '/key', '/orange', '/trinity?tab=oracle', '/trinity?tab=tarot', '/library', '/profile'];

test('three full cycles never repeat a destination, even with constantly changing context', () => {
  let state: OneStopState = { cycleIndex: 1, visitedPaths: ['/'] };
  let current = '/';
  for (let cycle = 1; cycle <= 3; cycle++) {
    const seen = new Set([current]);
    for (let step = 1; step < paths.length; step++) {
      const ranking = step % 2 ? [...paths].reverse() : paths;
      const next = advanceOneStopCycle(state, paths, current, ranking);
      assert.equal(next.state.cycleIndex, cycle);
      assert(!seen.has(next.destination), next.destination);
      seen.add(next.destination);
      current = next.destination;
      state = JSON.parse(JSON.stringify(next.state)); // Reload persistence preserves the route.
    }
    assert.equal(seen.size, paths.length);
    const next = advanceOneStopCycle(state, paths, current, paths);
    assert(next.restarted);
    assert.equal(next.state.cycleIndex, cycle + 1);
    assert.notEqual(next.destination, current);
    // Prepare the next full cycle without consuming its first recommendation twice.
    state = { cycleIndex: cycle + 1, visitedPaths: [current] };
  }
});

test('context always selects the top unvisited page, including tabs and manually visited pages', () => {
  const next = advanceOneStopCycle({ cycleIndex: 1, visitedPaths: ['/', '/key', '/trinity?tab=oracle'] }, paths, '/library', ['/key', '/library', '/trinity?tab=oracle', '/trinity?tab=tarot', '/orange']);
  assert.equal(next.destination, '/trinity?tab=tarot');
  assert(next.state.visitedPaths.includes('/library'));
});

test('corrupted storage is sanitized and newly added destinations join the unfinished cycle', () => {
  const state = normalizeOneStopState({ cycleIndex: -3, visitedPaths: ['/', '/', '/removed', 42] }, paths);
  assert.deepEqual(state, { cycleIndex: 1, visitedPaths: ['/'] });
  const next = advanceOneStopCycle({ cycleIndex: 4, visitedPaths: paths }, [...paths, '/new'], '/profile', paths);
  assert.equal(next.destination, '/new');
  assert.equal(next.restarted, false);
  assert.equal(next.state.cycleIndex, 4);
});

test('peeking does not mutate the supplied state and completion excludes the current page', () => {
  const state = { cycleIndex: 2, visitedPaths: [...paths] };
  const next = advanceOneStopCycle(state, paths, '/profile', ['/profile', '/key']);
  assert.equal(next.destination, '/key');
  assert.deepEqual(state, { cycleIndex: 2, visitedPaths: paths });
  assert.deepEqual(next.state, { cycleIndex: 3, visitedPaths: ['/profile', '/key'] });
});

test('legacy/default tab URLs pointing at the same screen count as one page', async () => {
  const { normalizeOneStopPage: key } = await import('../src/lib/omniWarp/oneStopPages');
  assert.equal(key('/trinity?tab=destiny'), '/trinity');
  assert.equal(key('/trinity?tab=fusion'), '/trinity?tab=oracle');
  assert.equal(key('/trinity?tab=wealth'), '/trinity?tab=tarot');
  assert.equal(key('/muse?tab=artRecommendation'), '/muse');
  assert.equal(key('/handbook?tab=audio'), '/handbook');
  assert.equal(key('/epilogue?tab=profile'), '/profile');
  assert.equal(key('/prologue?tab=ecpr'), '/ecpr');
  assert.equal(key('/heal?tab=synergy'), '/heal?tab=synergy');
});

test('warp URLs state the default tab explicitly instead of inheriting a previous session tab', async () => {
  const { oneStopNavigationPath: path } = await import('../src/lib/omniWarp/oneStopPages');
  assert.equal(path('/trinity'), '/trinity?tab=destiny');
  assert.equal(path('/muse'), '/muse?tab=artRecommendation');
  assert.equal(path('/orange?tab=synergy'), '/orange?tab=synergy');
  assert.equal(path('/profile'), '/profile');
});
