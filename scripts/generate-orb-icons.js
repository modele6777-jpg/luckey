import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG designed specifically for LucKey (Lucy + Key + Lucky 🍀) PWA & iOS Safari Apple Touch Icon:
// Fully opaque deep cosmic obsidian background (#02030a -> #090c26 -> #131742) across the full 512x512 canvas.
// The glorious "LucKey" sits majestically in the center within Apple's 80% safe zone (safe area 410x410).
// Blends the arcane 4-leaf lucky clover with a 3D multifaceted prismatic crystal key, celestial astral rings, and radiant starlight core.
const luckeySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <defs>
    <!-- Background Canvas Gradient (100% Opaque for iOS Safari & Android PWA) -->
    <radialGradient id="luckeyBg" cx="50%" cy="40%" r="76%">
      <stop offset="0%" stop-color="#141846" />
      <stop offset="35%" stop-color="#0a0c24" />
      <stop offset="70%" stop-color="#040510" />
      <stop offset="100%" stop-color="#020307" />
    </radialGradient>

    <!-- Glow & Lighting Filters -->
    <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="emeraldGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="purpleGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="22" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="keyGlint" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- LucKey Prismatic & Lucky Emerald-Cyan-Purple Gradients -->
    <linearGradient id="luckeyMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="20%" stop-color="#a5f3fc" />
      <stop offset="42%" stop-color="#38bdf8" />
      <stop offset="68%" stop-color="#34d399" />
      <stop offset="85%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>

    <!-- Clover Petals Radiant Prism -->
    <linearGradient id="cloverGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="30%" stop-color="#67e8f9" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#34d399" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="cloverGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#a7f3d0" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="cloverGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="30%" stop-color="#c084fc" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#34d399" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="cloverGradBottom" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="75%" stop-color="#818cf8" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.9" />
    </linearGradient>

    <!-- Crystal Shaft Gradient -->
    <linearGradient id="crystalShaft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="18%" stop-color="#67e8f9" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#0284c7" stop-opacity="0.85" />
      <stop offset="78%" stop-color="#4338ca" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.98" />
    </linearGradient>

    <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#67e8f9" />
      <stop offset="55%" stop-color="#34d399" />
      <stop offset="85%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <linearGradient id="crossguardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.85" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="75%" stop-color="#c084fc" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#34d399" stop-opacity="0.85" />
    </linearGradient>

    <!-- Key Head Core Singularity Radial -->
    <radialGradient id="keyHeadCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="22%" stop-color="#a7f3d0" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#38bdf8" stop-opacity="0.85" />
      <stop offset="75%" stop-color="#9333ea" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#060818" stop-opacity="0.95" />
    </radialGradient>

    <!-- Celestial Orbital Rings -->
    <linearGradient id="ringCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.15" />
    </linearGradient>
    <linearGradient id="ringPurple" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.75" />
      <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#34d399" stop-opacity="0.15" />
    </linearGradient>
  </defs>

  <!-- 1. FULL SQUARE BASE CANVAS (Opaque for Apple Touch Icon & PWA) -->
  <rect width="512" height="512" fill="url(#luckeyBg)" />

  <!-- 2. Ambient Deep Space Halos & Lucky Energy Nebulae -->
  <circle cx="256" cy="150" r="160" fill="#059669" opacity="0.18" filter="url(#emeraldGlow)" />
  <circle cx="256" cy="150" r="145" fill="#7c3aed" opacity="0.22" filter="url(#purpleGlow)" />
  <circle cx="256" cy="280" r="150" fill="#0284c7" opacity="0.26" filter="url(#cyanGlow)" />

  <!-- 3. Celestial Orbital Rings & Arcane Geometry -->
  <circle cx="256" cy="150" r="132" fill="none" stroke="url(#ringCyan)" stroke-width="1.8" stroke-dasharray="6 14" opacity="0.7" />
  <circle cx="256" cy="150" r="108" fill="none" stroke="url(#ringPurple)" stroke-width="1.4" stroke-dasharray="4 8" opacity="0.6" />
  <circle cx="256" cy="265" r="215" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 18" opacity="0.28" />

  <!-- Starry Spark Points (Lucky Constellation) -->
  <circle cx="256" cy="22" r="3.5" fill="#34d399" filter="url(#starGlow)" />
  <circle cx="390" cy="150" r="3.5" fill="#c084fc" filter="url(#starGlow)" />
  <circle cx="122" cy="150" r="3.5" fill="#67e8f9" filter="url(#starGlow)" />
  <circle cx="398" cy="360" r="2.5" fill="#38bdf8" opacity="0.75" />
  <circle cx="114" cy="370" r="2.5" fill="#a7f3d0" opacity="0.75" />
  <circle cx="205" cy="466" r="2" fill="#ffffff" opacity="0.7" />
  <circle cx="308" cy="462" r="2" fill="#67e8f9" opacity="0.7" />

  <!-- 4. THE GLORIOUS LUCKEY (Centrally aligned & balanced within 80% safe area) -->
  <g id="luckeyGroup">
    <!-- Back Light Radiance -->
    <ellipse cx="256" cy="285" rx="64" ry="160" fill="#38bdf8" opacity="0.16" filter="url(#cyanGlow)" />

    <!-- A. KEY STEM / SHAFT (Long vertical crystal column) -->
    <!-- Shadow / Base Layer -->
    <rect x="246" y="215" width="20" height="210" rx="10" fill="#040614" />
    <!-- 3D Prismatic Glass Body -->
    <rect x="246" y="215" width="20" height="210" rx="10" fill="url(#crystalShaft)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.2" />
    
    <!-- Central Pure Light Conduit Core -->
    <line x1="256" y1="220" x2="256" y2="415" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.95" filter="url(#keyGlint)" />
    <line x1="256" y1="220" x2="256" y2="415" stroke="#67e8f9" stroke-width="1.5" stroke-linecap="round" />

    <!-- Prismatic Middle Collar Rings / Emerald Lucky Bead on Shaft -->
    <g transform="translate(256, 310)">
      <ellipse cx="0" cy="0" rx="15" ry="5.5" fill="url(#luckeyMetallic)" stroke="#ffffff" stroke-width="1" />
      <ellipse cx="0" cy="0" rx="11" ry="3.5" fill="#06091e" />
      <circle cx="0" cy="0" r="3" fill="#34d399" filter="url(#starGlow)" />
      <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
    </g>

    <!-- B. KEY BIT (TEETH) - Arcane Prismatic Notches with Lucky Runes -->
    <g id="keyTeeth">
      <!-- Tooth 1 (Upper Notch) -->
      <path d="M 264 340 L 298 340 L 305 347 L 305 358 L 296 364 L 264 364 Z" 
            fill="url(#toothGrad)" stroke="#ffffff" stroke-width="1.2" />
      <line x1="268" y1="352" x2="298" y2="352" stroke="#ffffff" stroke-width="1.8" opacity="0.9" />
      <circle cx="300" cy="352" r="2" fill="#a7f3d0" filter="url(#keyGlint)" />

      <!-- Tooth 2 (Main Long Stepped Notch - Lucky Key Crown) -->
      <path d="M 264 374 L 314 374 L 324 384 L 324 397 L 314 406 L 292 406 L 286 398 L 264 398 Z" 
            fill="url(#toothGrad)" stroke="#ffffff" stroke-width="1.2" />
      <line x1="268" y1="390" x2="316" y2="390" stroke="#ffffff" stroke-width="2" opacity="0.95" />
      <circle cx="318" cy="390" r="2.5" fill="#ffffff" filter="url(#starGlow)" />

      <!-- Tooth 3 (Lower Delicate Notch) -->
      <path d="M 264 412 L 296 412 L 302 418 L 302 426 L 294 430 L 264 430 Z" 
            fill="url(#toothGrad)" stroke="#ffffff" stroke-width="1" />
      <line x1="268" y1="421" x2="294" y2="421" stroke="#ffffff" stroke-width="1.5" opacity="0.85" />
    </g>

    <!-- C. SHAFT FINIAL / CRYSTAL TIP (Sharp lower crystal spire) -->
    <g id="shaftTip">
      <path d="M 246 422 L 256 454 L 266 422 Z" fill="url(#crystalShaft)" stroke="#ffffff" stroke-width="1.2" />
      <line x1="256" y1="420" x2="256" y2="452" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
      <!-- Star spark at very tip -->
      <circle cx="256" cy="454" r="3.5" fill="#ffffff" filter="url(#starGlow)" />
    </g>

    <!-- D. KEY CROSSGUARD / WING COLLAR (Between Bow and Stem) -->
    <g id="crossguard">
      <!-- Elegant curved crystal wings -->
      <path d="M 256 208 C 218 208, 186 222, 166 236 C 196 235, 230 228, 256 222 C 282 228, 316 235, 346 236 C 326 222, 294 208, 256 208 Z" 
            fill="url(#crossguardGrad)" stroke="#ffffff" stroke-width="1.2" />
      
      <!-- Wing Tip Glints -->
      <circle cx="166" cy="236" r="2.8" fill="#34d399" filter="url(#starGlow)" />
      <circle cx="346" cy="236" r="2.8" fill="#c084fc" filter="url(#starGlow)" />

      <!-- Center Hexagonal Runic Gem Node (Lucky Emerald/Cyan Core) -->
      <path d="M 256 208 L 268 220 L 268 232 L 256 242 L 244 232 L 244 220 Z" 
            fill="#08102c" stroke="url(#luckeyMetallic)" stroke-width="1.6" />
      <circle cx="256" cy="225" r="4.5" fill="#34d399" filter="url(#keyGlint)" />
      <circle cx="256" cy="225" r="2" fill="#ffffff" />
    </g>

    <!-- E. KEY BOW (HEAD) - ARCANE 4-LEAF LUCKY CLOVER & ORACLE EYE -->
    <g id="keyHead">
      <!-- Outer Decorative Spire / Crown at Top (Y: 58 ~ 90) -->
      <g id="headCrown">
        <path d="M 256 56 L 268 76 L 256 88 L 244 76 Z" fill="url(#luckeyMetallic)" stroke="#ffffff" stroke-width="1.2" />
        <circle cx="256" cy="56" r="3.5" fill="#34d399" filter="url(#starGlow)" />
        <line x1="256" y1="60" x2="256" y2="84" stroke="#ffffff" stroke-width="2" />
      </g>

      <!-- Left & Right Flank Ornaments on Head Ring -->
      <path d="M 166 150 L 178 138 L 178 162 Z" fill="url(#luckeyMetallic)" stroke="#ffffff" stroke-width="1" />
      <path d="M 346 150 L 334 138 L 334 162 Z" fill="url(#luckeyMetallic)" stroke="#ffffff" stroke-width="1" />
      <circle cx="166" cy="150" r="2.8" fill="#67e8f9" filter="url(#starGlow)" />
      <circle cx="346" cy="150" r="2.8" fill="#c084fc" filter="url(#starGlow)" />

      <!-- The Outer Thick Crystal Arch Ring -->
      <circle cx="256" cy="150" r="76" fill="none" stroke="#040616" stroke-width="18" />
      <circle cx="256" cy="150" r="76" fill="none" stroke="url(#luckeyMetallic)" stroke-width="14" />
      <circle cx="256" cy="150" r="84" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.85" />
      <circle cx="256" cy="150" r="68" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.2" />

      <!-- Interior Scrying Glass Void & Nebula -->
      <circle cx="256" cy="150" r="67" fill="#040510" />
      <circle cx="256" cy="150" r="67" fill="url(#keyHeadCore)" />

      <!-- 🍀 4-LEAF CLOVER CRYSTAL LOBES (The True LucKey Signature) 🍀 -->
      <!-- Top Petal -->
      <path d="M 256 150 C 238 128, 230 102, 256 86 C 282 102, 274 128, 256 150 Z" 
            fill="url(#cloverGradTop)" stroke="#ffffff" stroke-width="1" opacity="0.9" />
      <!-- Bottom Petal -->
      <path d="M 256 150 C 238 172, 230 198, 256 214 C 282 198, 274 172, 256 150 Z" 
            fill="url(#cloverGradBottom)" stroke="#ffffff" stroke-width="1" opacity="0.9" />
      <!-- Left Petal -->
      <path d="M 256 150 C 234 132, 208 124, 192 150 C 208 176, 234 168, 256 150 Z" 
            fill="url(#cloverGradLeft)" stroke="#ffffff" stroke-width="1" opacity="0.9" />
      <!-- Right Petal -->
      <path d="M 256 150 C 278 132, 304 124, 320 150 C 304 176, 278 168, 256 150 Z" 
            fill="url(#cloverGradRight)" stroke="#ffffff" stroke-width="1" opacity="0.9" />

      <!-- Clover Facet Veins / Fine Arcane Diamond Stems -->
      <g stroke="#ffffff" stroke-width="0.9" opacity="0.75">
        <line x1="256" y1="92" x2="256" y2="208" />
        <line x1="198" y1="150" x2="314" y2="150" />
      </g>

      <!-- 8-Point Cosmic Compass Lines -->
      <g stroke="#67e8f9" stroke-width="0.8" opacity="0.5">
        <line x1="216" y1="110" x2="296" y2="190" stroke-dasharray="2 3" />
        <line x1="216" y1="190" x2="296" y2="110" stroke-dasharray="2 3" />
      </g>

      <!-- Central Singularity Radiant 4-Point Starlight Core (Lucky Star) -->
      <g transform="translate(256, 150)" filter="url(#starGlow)">
        <!-- Nova Flare Diamond -->
        <path d="M 0,-34 Q 0,0 34,0 Q 0,0 0,34 Q 0,0 -34,0 Q 0,0 0,-34 Z" fill="#ffffff" opacity="0.98" />
        <path d="M 0,-20 Q 0,0 20,0 Q 0,0 0,20 Q 0,0 -20,0 Q 0,0 0,-20 Z" fill="#34d399" />
        <!-- Pure White Starlight Singularity Core -->
        <circle cx="0" cy="0" r="5.5" fill="#ffffff" />
      </g>

      <!-- Sparkling Starlets inside Core -->
      <circle cx="234" cy="132" r="2.2" fill="#ffffff" opacity="0.9" />
      <circle cx="278" cy="128" r="2" fill="#a7f3d0" opacity="0.95" />
      <circle cx="234" cy="168" r="2" fill="#c084fc" opacity="0.85" />
      <circle cx="278" cy="168" r="2.4" fill="#67e8f9" opacity="0.95" />

      <!-- Top Curved Specular Glare (Realistic Glass Crescent Highlight) -->
      <path d="M 220 110 C 236 98, 276 98, 292 110 C 276 104, 236 104, 220 110 Z" fill="#ffffff" opacity="0.95" />
      <circle cx="212" cy="126" r="3" fill="#ffffff" opacity="0.85" />
    </g>

    <!-- F. ELEGANT "LUCKEY" EMBLEM (Bottom Curved Arc Inscription) -->
    <g id="luckeyLabel" opacity="0.88">
      <text x="256" y="492" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" letter-spacing="0.32em" fill="#a5f3fc">
        LUCKEY
      </text>
      <!-- Flanking Lucky Spark Dots -->
      <circle cx="168" cy="487" r="1.8" fill="#34d399" />
      <circle cx="344" cy="487" r="1.8" fill="#c084fc" />
    </g>
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const svgBuffer = Buffer.from(luckeySvg);

  // 1. Save SVGs: luckey-icon.svg, orb-icon.svg, and key-icon.svg
  fs.writeFileSync(path.join(publicDir, 'luckey-icon.svg'), luckeySvg);
  fs.writeFileSync(path.join(publicDir, 'orb-icon.svg'), luckeySvg);
  fs.writeFileSync(path.join(publicDir, 'key-icon.svg'), luckeySvg);
  console.log('Saved luckey-icon.svg, orb-icon.svg, and key-icon.svg');

  // 2. apple-touch-icon-orb.png (180x180, 100% opaque for iOS Safari)
  await sharp(svgBuffer)
    .resize(180, 180)
    .flatten({ background: '#02030a' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon-orb.png'));
  console.log('Generated apple-touch-icon-orb.png (180x180, opaque)');

  // 3. orb-icon-192.png and luckey-icon-192.png (192x192, 100% opaque)
  const png192 = await sharp(svgBuffer)
    .resize(192, 192)
    .flatten({ background: '#02030a' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'orb-icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'luckey-icon-192.png'), png192);
  console.log('Generated orb-icon-192.png & luckey-icon-192.png (192x192, opaque)');

  // 4. orb-icon-512.png and luckey-icon-512.png (512x512, 100% opaque)
  const png512 = await sharp(svgBuffer)
    .resize(512, 512)
    .flatten({ background: '#02030a' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'orb-icon-512.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'luckey-icon-512.png'), png512);
  console.log('Generated orb-icon-512.png & luckey-icon-512.png (512x512, opaque)');

  // 5. orb-favicon.png (64x64, 100% opaque)
  await sharp(svgBuffer)
    .resize(64, 64)
    .flatten({ background: '#02030a' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'orb-favicon.png'));
  console.log('Generated orb-favicon.png (64x64, opaque)');
}

run().catch(console.error);
