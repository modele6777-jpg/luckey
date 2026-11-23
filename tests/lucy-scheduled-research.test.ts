import assert from 'node:assert/strict';
import test from 'node:test';
import { runScheduledResearch } from '../server/api-lib/lucyScheduledResearch';
import { searchKnowledgeMetadata } from '../server/api-lib/lucyKnowledgeSources';

test('the scheduler requires both settings before searching or writing', async () => {
  for (const settings of [null, {}, { researchEnabled: true }, { scheduledResearchEnabled: true }]) {
    assert.deepEqual(await runScheduledResearch({
      readSettings: async () => settings,
      search: async () => assert.fail('Unexpected search'),
      createCandidate: async () => assert.fail('Unexpected write'),
    }), { enabled: false, added: 0 });
  }
});

test('a scheduled run stores only unverified bibliography and retries skip existing candidates', async () => {
  const writes = new Map<string, Parameters<Parameters<typeof runScheduledResearch>[0]['createCandidate']>[1]>();
  const date = new Date('2026-11-23T00:00:00Z');
  const settings = { researchEnabled: true, scheduledResearchEnabled: true };
  const record = {
    DOI: '10.1000/example', title: ['Published book'], author: [{ family: 'Author' }],
    type: 'book', abstract: 'must never be stored',
  };
  const deps: Parameters<typeof runScheduledResearch>[0] = {
    readSettings: async () => settings,
    search: (query, count) => searchKnowledgeMetadata(query, count, async (url) => {
      assert.equal(new URL(String(url)).hostname, 'api.crossref.org');
      assert.equal(count, 5);
      assert.ok(query);
      return Response.json({ message: { items: [record, { ...record, DOI: record.DOI.toUpperCase() }] } });
    }),
    async createCandidate(id, candidate) {
      if (writes.has(id)) return false;
      writes.set(id, candidate);
      return true;
    },
  };

  assert.deepEqual(await runScheduledResearch(deps, date), { enabled: true, added: 1 });
  assert.deepEqual(await runScheduledResearch(deps, date), { enabled: true, added: 0 });
  const [{ source }] = [...writes.values()];
  assert.deepEqual(source, {
    title: 'Published book', authors: ['Author'], doi: '10.1000/example', url: 'https://doi.org/10.1000/example',
    sourceKind: 'book', verification: 'unreviewed', access: 'metadata_only',
  });
});
