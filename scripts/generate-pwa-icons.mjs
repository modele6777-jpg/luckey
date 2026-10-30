import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

// 1. LucKey / Prism Icon Targets (from generated high-fidelity asset or public/icon.svg)
const generatedIconSource = path.resolve(__dirname, '../src/assets/images/app_icon_prism_1793349636974.jpg');
const prismSource = fs.existsSync(generatedIconSource) ? generatedIconSource : path.join(publicDir, 'icon.svg');
const prismTargets = [
  { name: 'app-icon.png', size: 512 },
  { name: 'app-icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-v2.png', size: 512 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-192-v2.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-v2.png', size: 180 },
  { name: 'apple-touch-icon-precomposed.png', size: 180 },
  { name: 'favicon.png', size: 64 },
  { name: 'luckey-icon-512.png', size: 512 },
  { name: 'luckey-icon-192.png', size: 192 },
  { name: 'prism-icon-512.png', size: 512 },
  { name: 'prism-icon-192.png', size: 192 },
  { name: 'prism-icon-180.png', size: 180 },
];

// 2. Lucy Icon Targets (from public/lucy-icon.svg)
const lucySource = path.join(publicDir, 'lucy-icon.svg');
const lucyTargets = [
  { name: 'lucy-icon-512.png', size: 512 },
  { name: 'lucy-icon-192.png', size: 192 },
  { name: 'lucy-icon-180.png', size: 180 },
  { name: 'apple-touch-icon-lucy.png', size: 180 },
];

// 3. Orb Icon Targets (from public/orb-icon.svg)
const orbSource = path.join(publicDir, 'orb-icon.svg');
const orbTargets = [
  { name: 'orb-icon-512.png', size: 512 },
  { name: 'orb-icon-192.png', size: 192 },
  { name: 'apple-touch-icon-orb.png', size: 180 },
  { name: 'orb-favicon.png', size: 64 },
];

async function main() {
  // Generate Prism Icons
  if (fs.existsSync(prismSource)) {
    for (const { name, size } of prismTargets) {
      const out = path.join(publicDir, name);
      await sharp(prismSource)
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(out);
      console.log(`[PRISM] wrote ${name} (${size}x${size})`);
    }
  }

  // Generate Lucy Icons
  if (fs.existsSync(lucySource)) {
    for (const { name, size } of lucyTargets) {
      const out = path.join(publicDir, name);
      await sharp(lucySource)
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(out);
      console.log(`[LUCY] wrote ${name} (${size}x${size})`);
    }
  }

  // Generate Orb Icons
  if (fs.existsSync(orbSource)) {
    for (const { name, size } of orbTargets) {
      const out = path.join(publicDir, name);
      await sharp(orbSource)
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(out);
      console.log(`[ORB] wrote ${name} (${size}x${size})`);
    }
  }
  console.log('All PWA icons successfully generated!');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});