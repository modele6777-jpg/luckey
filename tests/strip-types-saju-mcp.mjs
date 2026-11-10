// Loads the Vercel entry the way production does: Node type stripping, with no
// enum/parameter-property transform. Run with
// node --experimental-strip-types --no-experimental-transform-types.
import { createServer } from 'node:http';

for (const name of ['GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY', 'AI_API_KEY', 'API_KEY']) {
  delete process.env[name];
}

const { default: app } = await import('../api/index.ts');
const server = createServer(app);
await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
const { port } = server.address();

async function post(route, body) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(4000),
  });
  const text = await response.text();
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }
  return { status: response.status, body: parsed };
}

const failures = [];
function expect(label, condition) {
  if (!condition) failures.push(label);
}

const valid = await post('/api/saju/chart', { year: 1990, month: 5, day: 15, birthtime: '13:30', isLunar: false });
expect(`valid saju ${valid.status}`, valid.status === 200 && typeof valid.body?.pillars?.day === 'string');
const invalid = await post('/api/saju/chart', {});
expect(`invalid saju ${invalid.status} ${invalid.body?.code}`, invalid.status === 400 && invalid.body?.code === 'invalid_year');
const initialized = await post('/api/mcp', {
  jsonrpc: '2.0', id: 1, method: 'initialize',
  params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'strip-types', version: '0' } },
});
expect(`mcp post ${initialized.status}`, initialized.status === 200 && initialized.body?.result?.serverInfo?.name === 'luckey-oracle-mcp');
const discovered = await fetch(`http://127.0.0.1:${port}/api/mcp`, { signal: AbortSignal.timeout(4000) });
const discoveryText = await discovered.text();
expect(`mcp get ${discovered.status}`, discovered.status === 200 && discoveryText.includes('luckey-oracle-mcp'));

await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('strip-types saju and MCP ok');
