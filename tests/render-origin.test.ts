import assert from 'node:assert/strict';
import test from 'node:test';
import { isAllowedAppOrigin } from '../server/api-lib/publicAccess.ts';

test('Render deployment trusts only its own https hostname', () => {
  const saved = process.env.RENDER_EXTERNAL_HOSTNAME;
  try {
    delete process.env.RENDER_EXTERNAL_HOSTNAME;
    assert.equal(isAllowedAppOrigin('https://luckey.onrender.com'), false);
    process.env.RENDER_EXTERNAL_HOSTNAME = 'luckey.onrender.com';
    assert.equal(isAllowedAppOrigin('https://luckey.onrender.com'), true);
    assert.equal(isAllowedAppOrigin('http://luckey.onrender.com'), false);
    assert.equal(isAllowedAppOrigin('https://other.onrender.com'), false);
    assert.equal(isAllowedAppOrigin('https://luckey-six.vercel.app'), true);
  } finally {
    if (saved === undefined) delete process.env.RENDER_EXTERNAL_HOSTNAME;
    else process.env.RENDER_EXTERNAL_HOSTNAME = saved;
  }
});
