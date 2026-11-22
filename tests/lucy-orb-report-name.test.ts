import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const reportSource = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const hostSource = readFileSync(new URL('../src/components/lucy/OrbCounselHost.tsx', import.meta.url), 'utf8');

test('Orb report uses the saved nickname or name input, not a hard-coded fallback', () => {
  assert.match(hostSource, /sharedState\?\.userProfile\?\.basic\?\.nickname\?\.trim\(\)/);
  assert.match(hostSource, /sharedState\?\.userProfile\?\.basic\?\.name\?\.trim\(\)/);
  assert.match(hostSource, /persistentProfile\?\.basic\?\.nickname\?\.trim\(\)/);
  assert.match(hostSource, /persistentProfile\?\.basic\?\.name\?\.trim\(\)/);
  assert.match(hostSource, /nickname=\{nickname\}/);
  assert.match(reportSource, /const reportName = nickname\.trim\(\)/);
  assert.match(reportSource, /\.\.\.\(reportName \? \[`이름: \$\{reportName\}`\] : \[\]\)/);
  assert.doesNotMatch(reportSource, /nickname\s*\|\|\s*['"]친구['"]/);
  assert.doesNotMatch(reportSource, /'박주형'/);
});
