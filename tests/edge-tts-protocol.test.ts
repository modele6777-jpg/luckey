import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEdgeTtsSsmlMessage } from '../server/api-lib/edgeTts';

test('Edge Neural SSML timestamp contains exactly one UTC suffix and escapes text', () => {
  const message = buildEdgeTtsSsmlMessage(
    `안녕 <루시> & '친구'`,
    'ko-KR-SunHiNeural',
    'ko-KR',
    '2026-11-11T07:00:00Z',
    'test-request-id',
  );
  assert.match(message, /X-Timestamp:2026-11-11T07:00:00Z\r\nPath:ssml/);
  assert.doesNotMatch(message, /X-Timestamp:[^\r\n]*ZZ/);
  assert.match(message, /안녕 &lt;루시&gt; &amp; &apos;친구&apos;/);
});
