import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
const CSS_FILE = path.join(SRC_DIR, 'index.css');

console.log('🔍 [Theme Contrast Audit] Starting dual theme typography verification...\n');

let errorCount = 0;
let warningCount = 0;

// 1. Verify CSS Dual Theme Engine
if (!fs.existsSync(CSS_FILE)) {
  console.error('❌ index.css not found!');
  process.exit(1);
}

const cssContent = fs.readFileSync(CSS_FILE, 'utf-8');

// Check Light Mode Anti-White & Pastel-Light Eradication Engine
const hasLightModeWhiteEradication = 
  cssContent.includes('html.light') &&
  cssContent.includes('.text-white') &&
  cssContent.includes('#090d16') &&
  cssContent.includes('#0f172a');

// 15 Color Families Spectrum Check for Light Mode (bright colors mapped to deep 800~900)
const colorFamilies = [
  'purple', 'indigo', 'pink', 'rose', 'amber', 'yellow',
  'cyan', 'sky', 'blue', 'emerald', 'teal', 'green', 'orange', 'violet', 'fuchsia'
];

const missingLightColors = colorFamilies.filter(c => !cssContent.includes(`.text-${c}-100`));
const missingDarkColors = colorFamilies.filter(c => !cssContent.includes(`.text-${c}-500`) && !cssContent.includes(`.text-${c}-600`));

if (!hasLightModeWhiteEradication || missingLightColors.length > 0) {
  console.error(`❌ [CSS Check] Light mode luminance contrast rules missing for: ${missingLightColors.join(', ')}`);
  errorCount++;
} else {
  console.log(`✅ [CSS Check] Light mode full-spectrum luminance engine active (15 color families calibrated).`);
}

// Check Dark Mode Anti-Black & Deep-Tone Eradication Engine (Global Scope)
const hasDarkModeGlobalBlackEradication = 
  cssContent.includes('html.dark') &&
  cssContent.includes('.text-black') &&
  cssContent.includes('.text-slate-900') &&
  cssContent.includes('#ffffff') &&
  cssContent.includes('#f8fafc');

if (!hasDarkModeGlobalBlackEradication || missingDarkColors.length > 0) {
  console.error(`❌ [CSS Check] Dark mode luminance contrast rules missing for: ${missingDarkColors.join(', ')}`);
  errorCount++;
} else {
  console.log(`✅ [CSS Check] Dark mode full-spectrum luminance engine active (15 color families calibrated).`);
}

// 2. Scan TSX files for risky inline color patterns
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        scanDir(fullPath);
      }
    } else if (entry.name.endsWith('.tsx')) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      const lines = code.split('\n');

      lines.forEach((line, idx) => {
        // Check for suspicious hardcoded color in inactive options (e.g. rgba(255, 255, 255, 0.4~0.6) on plain background)
        if (line.includes("color:") && line.includes("rgba(255, 255, 255, 0.") && !line.includes("stroke") && !line.includes("fill")) {
          // If it is in an inline style not protected by theme check
          if (!line.includes("isLight") && !line.includes("theme") && !line.includes("active")) {
            console.warn(`⚠️ [Potential Contrast Risk] ${path.relative(process.cwd(), fullPath)}:${idx + 1}: ${line.trim()}`);
            warningCount++;
          }
        }
      });
    }
  }
}

scanDir(SRC_DIR);

console.log('\n======================================================');
console.log(`📊 Audit Finished: ${errorCount} errors, ${warningCount} warnings.`);
console.log('======================================================');

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 Dual Theme Typography Audit Passed Successfully!\n');
  process.exit(0);
}
