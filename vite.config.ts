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

function readChangelogSummary(version: string): string | undefined {
  try {
    const changelogPath = path.resolve(__dirname, 'public/changelog.json');
    const entries = JSON.parse(fs.readFileSync(changelogPath, 'utf-8')) as Array<{
      version?: string;
      summary?: string;
    }>;
    const match = entries.find((entry) => entry.version === version);
    return match?.summary?.trim() || undefined;
  } catch {
    return undefined;
  }
}

function buildVersionPayload(version: string) {
  const builtAt = new Date().toISOString();
  const summary = readChangelogSummary(version);
  return summary ? { version, builtAt, summary } : { version, builtAt };
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
          start_url: "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            },
          ],
          shortcuts: [
            {
              name: "루시 AI 프로 (LUCY AI PRO)",
              short_name: "루시 AI 프로",
              description: "루시 AI 프로와 나누는 심플 & 라이트 대화",
              url: "/chat",
              icons: [{ src: "/lucy-icon-192.png", sizes: "192x192" }]
            },
            {
              name: "PRISM 핸드북 & 바이블",
              short_name: "프리즘핸드북",
              description: "PRISM 7대 우주 공간 가이드 & 론다번·사주·세도나·호오포노포노 바이블",
              url: "/handbook",
              icons: [{ src: "/handbook-icon-192.png", sizes: "192x192" }]
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/chat/, /^\/lucy/, /^\/handbook/, /^\/rebible/, /^\/calm/, /^\/key/, /^\/orb/],
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
                !url.pathname.startsWith('/calm') &&
                !url.pathname.startsWith('/key'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'prism-html',
                networkTimeoutSeconds: 3,
              },
            },
          ],
        }
      })
    ],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.AI_API_KEY': JSON.stringify(env.AI_API_KEY),
      'process.env.XAI_API_KEY': JSON.stringify(env.XAI_API_KEY),
      'process.env.AI_TYPE': JSON.stringify(env.AI_TYPE),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.GOOGLE_GENAI_API_KEY || ''),
      'import.meta.env.VITE_AI_API_KEY': JSON.stringify(env.VITE_AI_API_KEY || env.AI_API_KEY || ''),
      'import.meta.env.VITE_AI_TYPE': JSON.stringify(env.VITE_AI_TYPE || env.AI_TYPE || 'gemini'),
      'import.meta.env.VITE_GEMINI_MODEL': JSON.stringify(env.VITE_GEMINI_MODEL || env.GEMINI_MODEL || 'gemini-3.7-flash'),
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
