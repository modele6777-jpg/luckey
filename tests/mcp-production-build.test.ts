import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { test } from 'node:test';

// Run after `npm run build`: this exercises the same bundled CJS server as Render.
test('production CJS build serves MCP discovery and initialization while protecting readings', { timeout: 30000 }, async () => {
  const reservation = createServer();
  await new Promise<void>((resolve, reject) => {
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', resolve);
  });
  const address = reservation.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  await new Promise<void>((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));

  const child = spawn(process.execPath, ['dist/server.cjs'], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), LUCKEY_MCP_TOKEN: 'isolated-test-token-0123456789', RENDER: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (data) => { output += String(data); });
  child.stderr.on('data', (data) => { output += String(data); });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try {
        const response = await fetch(`${base}/api/health`);
        if (response.ok) { ready = true; break; }
      } catch { /* server is starting */ }
      if (child.exitCode !== null) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, `production server did not start: ${output.slice(-1500)}`);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
    const discovery = await fetch(`${base}/api/mcp`, { headers: { accept: 'application/json' } });
    const discoveryBody = await discovery.json() as any;
    assert.equal(discovery.status, 200, `discovery: ${JSON.stringify(discoveryBody)}`);
    assert.equal(discoveryBody.status, 'healthy');
    assert.equal(discoveryBody.version, pkg.version);

    const initialize = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } } };
    for (const accept of ['application/json', 'application/json, text/event-stream']) {
      const response = await fetch(`${base}/api/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept }, body: JSON.stringify(initialize) });
      const body = await response.json() as any;
      assert.equal(response.status, 200, JSON.stringify(body));
      assert.equal(body.result.serverInfo.version, pkg.version);
    }
    const protectedReading = await fetch(`${base}/api/mcp`, {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'read_saju', arguments: {} } }),
    });
    assert.equal(protectedReading.status, 401);
  } finally {
    child.kill('SIGTERM');
  }
});
