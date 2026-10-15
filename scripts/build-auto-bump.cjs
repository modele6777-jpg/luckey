const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { bumpVersion } = require('./bump-version.cjs');
const { appendChangelogEntry, parseCommitSummary } = require('./changelog-utils.cjs');

const repoRoot = path.resolve(__dirname, '..');

// Helper to normalized file path relative to repo root
function getRelativePath(fullPath) {
  return path.relative(repoRoot, fullPath).replace(/\\/g, '/');
}

// Check file labels based on FILE_CHANGE_HINTS in changelog-utils.cjs
const FILE_CHANGE_HINTS = [
  { pattern: /src\/pages\/TrinityApp\.tsx$/i, label: 'Trinity 타로 리딩·UI 개선' },
  { pattern: /src\/components\/trinity\/TarotSpread\.tsx$/i, label: '타로 카드 휠 성능·역방향 카드' },
  { pattern: /src\/lib\/trinity\/utils\.ts$/i, label: '타로 자동 배열법·AI 프롬프트 강화' },
  { pattern: /src\/data\/tarotData\.ts$/i, label: '타로 카드 데이터·역방향 지원' },
  { pattern: /src\/components\/trinity\/BgMusicPlayer\.tsx$/i, label: 'BGM 플레이어·데일리 타로 음악 수정' },
  { pattern: /src\/components\/trinity\/VisionPortal\.tsx$/i, label: '비전 포털(카메라 타로) 연동' },
  { pattern: /src\/components\/UpdateNoticeModal\.tsx$/i, label: '업데이트 변경점 안내 UI' },
  { pattern: /src\/lib\/updateNotice\.ts$/i, label: '업데이트 changelog 로직' },
  { pattern: /src\/components\/muse\/ArtistWayBible\.tsx$/i, label: 'Artist Bible 페이지 헤더 통일' },
  { pattern: /muse\/src\/App\.tsx$/i, label: 'Muse 탭 라벨 통일' },
  { pattern: /src\/pages\/MuseApp\.tsx$/i, label: 'Muse 앱 기능 개선' },
  { pattern: /src\/pages\/HealApp\.tsx$/i, label: 'Heal 앱 기능 개선' },
  { pattern: /src\/pages\/BluebirdApp\.tsx$/i, label: 'Bluebird 앱 기능 개선' },
  { pattern: /src\/pages\/OrangeApp\.tsx$/i, label: 'Orange 앱 기능 개선' },
  { pattern: /src\/App\.tsx$/i, label: '앱 셸·동기화·업데이트 안내' },
  { pattern: /server\//i, label: '서버 API 개선' },
  { pattern: /api\//i, label: 'API 라우트 개선' },
];

function labelForFile(filePath) {
  const normalized = getRelativePath(filePath);
  const hit = FILE_CHANGE_HINTS.find((entry) => entry.pattern.test(normalized));
  if (hit) return hit.label;
  const base = normalized.split('/').pop() || normalized;
  return `${base} 수정`;
}

// Recursive directory scanning
function getModifiedFilesSince(dir, builtAtMs, list = []) {
  if (!fs.existsSync(dir)) return list;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        getModifiedFilesSince(full, builtAtMs, list);
      }
    } else {
      if (stat.mtimeMs > builtAtMs) {
        list.push(full);
      }
    }
  }
  return list;
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function main() {
  const changelogPath = path.join(repoRoot, 'public', 'changelog.json');
  const versionPath = path.join(repoRoot, 'public', 'version.json');
  
  let changelog = [];
  try {
    if (fs.existsSync(changelogPath)) {
      changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
    }
  } catch (err) {
    console.warn('[build-auto-bump] Failed to read changelog.json:', err.message);
  }

  // 1. Try Git flow first
  const gitSha = runCapture('git rev-parse HEAD');
  if (gitSha) {
    console.log(`[build-auto-bump] Git repository detected. Commit SHA: ${gitSha}`);
    
    // Check if this commit already has a changelog entry
    const alreadyProcessed = changelog.some(entry => entry.commit === gitSha);
    if (alreadyProcessed) {
      console.log('[build-auto-bump] Current commit already has a changelog entry. Skipping auto-bump.');
      return;
    }

    // Process new commit
    const commitMsg = runCapture('git log -1 --pretty=%B') || '자동 업데이트';
    const lines = commitMsg.split('\n').map(l => l.trim()).filter(Boolean);
    const rawSummary = lines[0] || '기능 업그레이드 및 버그 수정';
    const summary = parseCommitSummary(rawSummary);

    // Find files changed in this commit
    const changedFilesStr = runCapture('git diff-tree --no-commit-id --name-only -r HEAD');
    let items = [];
    if (changedFilesStr) {
      const files = changedFilesStr.split('\n').map(f => f.trim()).filter(Boolean);
      items = [...new Set(files.map(labelForFile))];
    } else {
      items = ['내부 변경 사항 반영 및 최적화'];
    }

    console.log(`[build-auto-bump] Bumping version for commit: "${summary}"`);
    const bumped = bumpVersion({ summary, items });
    
    // Append to changelog with commit hash to prevent duplicate bumps
    const updatedEntry = {
      version: bumped.version,
      summary,
      builtAt: bumped.builtAt,
      commit: gitSha,
    };
    if (items.length > 0) {
      updatedEntry.items = items;
    }

    // Filter out duplicate version if any
    const filteredChangelog = changelog.filter(e => e.version !== bumped.version);
    filteredChangelog.unshift(updatedEntry);
    fs.writeFileSync(changelogPath, `${JSON.stringify(filteredChangelog.slice(0, 30), null, 2)}\n`);

    console.log(`[build-auto-bump] Success! Bumped to v${bumped.version} and registered commit ${gitSha.slice(0, 7)}.`);
    return;
  }

  // 2. Fallback to Local Directory Modification Flow (No Git repo)
  console.log('[build-auto-bump] Non-git environment detected (AI Studio Cloud / ZIP build). Using file modification checking.');

  let builtAtMs = 0;
  try {
    if (fs.existsSync(versionPath)) {
      const verPayload = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
      if (verPayload.builtAt) {
        builtAtMs = new Date(verPayload.builtAt).getTime();
      }
    }
  } catch (err) {
    console.warn('[build-auto-bump] Could not parse public/version.json:', err.message);
  }

  // Check files modified in src/ since last built time
  // Add a 10-second margin to avoid immediate recursive bumps on builds triggered in the same workspace session
  const checkMarginMs = builtAtMs + 10000;
  const modifiedFiles = getModifiedFilesSince(path.join(repoRoot, 'src'), checkMarginMs);
  
  if (modifiedFiles.length > 0) {
    console.log(`[build-auto-bump] Detected ${modifiedFiles.length} modified files in src/ since last build.`);
    
    const items = [...new Set(modifiedFiles.map(labelForFile))];
    const summary = '사용자 맞춤형 기능 업그레이드 및 UI 개선';

    const bumped = bumpVersion({ summary, items });

    // Append to changelog without commit hash
    appendChangelogEntry({
      version: bumped.version,
      summary,
      items,
      builtAt: bumped.builtAt,
    });

    console.log(`[build-auto-bump] Success! Bumped to v${bumped.version} based on file modifications.`);
  } else {
    console.log('[build-auto-bump] No modifications in src/ detected. Version remains unchanged.');
  }
}

main();
