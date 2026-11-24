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

test('custom deployment origins require an exact HTTPS origin', () => {
  const key = 'LUCKEY_APP_ORIGINS';
  const previous = process.env[key];
  process.env[key] = 'https://luckey.example.org, https://preview.example.org:8443';
  try {
    assert.equal(isAllowedAppOrigin('https://luckey.example.org'), true);
    assert.equal(isAllowedAppOrigin('https://preview.example.org:8443'), true);
    assert.equal(isAllowedAppOrigin('https://preview.example.org'), false);
    assert.equal(isAllowedAppOrigin('http://luckey.example.org'), false);
    assert.equal(isAllowedAppOrigin('https://luckey.example.org.evil.test'), false);
    assert.equal(isAllowedAppOrigin('https://luckey.example.org/not-an-origin'), false);
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
});

test('a new HTTPS host serves its same-origin app without a platform-specific environment variable', () => {
  assert.equal(isAllowedAppOrigin('https://new.luckey.example', 'new.luckey.example'), true);
  assert.equal(isAllowedAppOrigin('https://different.luckey.example', 'new.luckey.example'), false);
  assert.equal(isAllowedAppOrigin('http://new.luckey.example', 'new.luckey.example'), false);
});
