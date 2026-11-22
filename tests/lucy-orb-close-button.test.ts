import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');

test('Orb report close button is at the end of the bottom action row', () => {
  assert.match(component, /className="lucy-orb-dock lucy-orb-report-dock"[\s\S]*?보고서 파일 저장[\s\S]*?채팅에 남기기[\s\S]*?className="lucy-orb-report-close" onClick=\{closeWithoutSaving\}>닫기/);
  assert.doesNotMatch(component, /phase === 'report' && <button[^>]*>닫기<\/button>/);
  assert.match(styles, /\.lucy-orb-report-dock\s*\{[^}]*align-items:\s*center[^}]*\}/);
});
