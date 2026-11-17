import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
export default defineConfig({
  publicDir: 'debug/fold-test-public',
  resolve: { alias: { '@': path.resolve('src') } },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    manifest: { name: 'LucKey 화면 전환 진단', short_name: '럭키 진단', start_url: '/fold-test.html', display: 'standalone', theme_color: '#111827', background_color: '#111827', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] },
    workbox: { navigateFallback: 'fold-test.html', maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, globPatterns: ['**/*.{js,css,html,png}'] },
  })],
  build: { rollupOptions: { input: 'fold-test.html' } },
});
