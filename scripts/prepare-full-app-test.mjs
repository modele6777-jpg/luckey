import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const policy = `<meta http-equiv="Content-Security-Policy" content="connect-src 'self'; form-action 'self'">`;
function protect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { protect(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const source = readFileSync(file, 'utf8');
    if (!source.includes('http-equiv="Content-Security-Policy"')) writeFileSync(file, source.replace(/<head(?:\s[^>]*)?>/i, match => match + policy));
  }
}
protect('dist');
writeFileSync('dist/index.html', readFileSync('dist/full-app-test.html'));
console.log('Full-app test HTML and same-origin frame policies prepared.');
