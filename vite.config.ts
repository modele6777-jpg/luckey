import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {defineConfig, loadEnv, type Plugin} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
) as { version: string };

function readChangelogEntry(version: string): { summary?: string; items?: string[] } | undefined {
  try {
    const changelogPath = path.resolve(__dirname, 'public/changelog.json');
    const entries = JSON.parse(fs.readFileSync(changelogPath, 'utf-8')) as Array<{
      version?: string;
      summary?: string;
      items?: string[];
    }>;
    const match = entries.find((entry) => entry.version === version);
    if (!match?.summary?.trim()) return undefined;
    const items = Array.isArray(match.items)
      ? match.items.map((item) => String(item).trim()).filter(Boolean)
      : [];
    return { summary: match.summary.trim(), ...(items.length ? { items } : {}) };
  } catch {
    return undefined;
  }
}

function buildVersionPayload(version: string) {
  const builtAt = new Date().toISOString();
  const entry = readChangelogEntry(version);
  return entry ? { version, builtAt, ...entry } : { version, builtAt };
}

function prismVersionPlugin(version: string): Plugin {
  const writeVersionFiles = () => {
    try {
      const payload = buildVersionPayload(version);
      const serialized = `${JSON.stringify(payload, null, 2)}\n`;
      fs.mkdirSync(path.resolve(__dirname, 'dist'), { recursive: true });
      fs.writeFileSync(path.resolve(__dirname, 'dist/version.json'), serialized);
    } catch (e) {
      console.warn('[prismVersionPlugin] Warning writing version.json:', e);
    }
  };

  return {
    name: 'prism-version-json',
    closeBundle() {
      writeVersionFiles();
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (mode === 'sites') {
    for (const key of ['GEMINI_API_KEY', 'AI_API_KEY', 'XAI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_AI_API_KEY']) delete env[key];
  }
  const releaseEntry = readChangelogEntry(packageJson.version);
  return {
    plugins: [
      prismVersionPlugin(packageJson.version),
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        includeAssets: [
          'icon.svg',
          'favicon.png',
          'icon-192.png',
          'icon-512.png',
          'apple-touch-icon.png',
          'apple-touch-icon-precomposed.png',
          'lucy-icon.svg',
          'lucy-icon-180.png',
          'lucy-icon-192.png',
          'lucy-icon-512.png',
          'apple-touch-icon-lucy.png',
          'manifest-lucy.webmanifest',
          'manifest-lucy.json',
          'handbook-icon.svg',
          'handbook-icon-180.png',
          'handbook-icon-192.png',
          'handbook-icon-512.png',
          'apple-touch-icon-handbook.png',
          'manifest-handbook.webmanifest',
          'manifest-handbook.json',
          'orb-icon.svg',
          'orb-icon-192.png',
          'orb-icon-512.png',
          'apple-touch-icon-orb.png',
          'orb-favicon.png',
          'manifest-orb.webmanifest',
          'manifest-orb.json',
        ],
        manifest: {
          name: "LucKey",
          short_name: "LucKey",
          description: "LucKey AI 페르소나 유니버스",
          id: "/",
          scope: "/",
          prefer_related_applications: false,
          start_url: "/",
          display: "standalone",
          orientation: "any",
          lang: "ko",
          background_color: "#06070a",
          theme_color: "#06070a",
          icons: [
            {
              src: "/icon-192-v2.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icon-512-v2.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icon-512-v2.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "/apple-touch-icon-v2.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any"
            },
          ],
          shortcuts: [
            {
              name: "Lucy",
              short_name: "Lucy",
              description: "Lucy와 나누는 소울 & 라이프 지능 대화",
              url: "/chat",
              icons: [{ src: "/lucy-icon-192.png", sizes: "192x192" }]
            },
            {
              name: "ReBible",
              short_name: "ReBible",
              description: "ReBible 7대 우주 지혜 경전 & 가이드",
              url: "/handbook",
              icons: [{ src: "/handbook-icon-192.png", sizes: "192x192" }]
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,mjs,css,html,ico,png,svg}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/chat/, /^\/lucy/, /^\/handbook/, /^\/rebible/, /^\/calm/, /^\/robots\.txt$/, /^\/sitemap\.xml$/, /^\/favicon\.ico$/, /^\/health$/],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 5000000,
          // Help mobile browsers pick up new versions faster
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                request.destination === 'document' &&
                !url.pathname.startsWith('/chat') &&
                !url.pathname.startsWith('/lucy') &&
                !url.pathname.startsWith('/handbook') &&
                !url.pathname.startsWith('/calm'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'prism-html',
                networkTimeoutSeconds: 3,
              },
            },
            {
              // 오프라인 복원력: 데일리아트 명화 이미지 등 외부 이미지를
              // 한 번 본 뒤에는 오프라인에서도 다시 보여준다 (Stale-While-Revalidate)
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'prism-external-images',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 14 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Google Fonts 스타일시트 — 오프라인에서도 폰트가 깨지지 않도록
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'prism-google-fonts-css',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [200] },
              },
            },
            {
              // Google Fonts 폰트 파일 — 1년 캐시
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'prism-google-fonts-files',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [200] },
              },
            },
          ],
        }
      })
    ],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __APP_RELEASE_NOTES__: JSON.stringify(releaseEntry
        ? { version: packageJson.version, ...releaseEntry }
        : null),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.AI_API_KEY': JSON.stringify(env.AI_API_KEY),
      'process.env.XAI_API_KEY': JSON.stringify(env.XAI_API_KEY),
      'process.env.AI_TYPE': JSON.stringify(env.AI_TYPE),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.GOOGLE_GENAI_API_KEY || ''),
      'import.meta.env.VITE_AI_API_KEY': JSON.stringify(env.VITE_AI_API_KEY || env.AI_API_KEY || ''),
      'import.meta.env.VITE_AI_TYPE': JSON.stringify(env.VITE_AI_TYPE || env.AI_TYPE || 'gemini'),
      'import.meta.env.VITE_GEMINI_MODEL': JSON.stringify(env.VITE_GEMINI_MODEL || env.GEMINI_MODEL || 'gemini-3.1-flash-lite'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          chat: path.resolve(__dirname, 'chat.html'),
          handbook: path.resolve(__dirname, 'handbook.html'),
        },
      },
    },
    server: {
      // This app runs Vite in Express middleware mode in the preview.
      // Disable both HMR and its WebSocket transport so stale @vite/client
      // connections cannot emit "WebSocket closed without opened" errors.
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: false,
      ws: false,
    },
  };
});
