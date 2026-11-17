import { defineConfig, type ConfigEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import productionConfig from './vite.config';

export default defineConfig(async env => {
  const base = await productionConfig({ ...env, mode: 'sites' } as ConfigEnv);
  // Replace only PWA identity; retain the actual app's build/chunk configuration.
  const plugins = base.plugins.filter(plugin => !Array.isArray(plugin) || !plugin.some(item => item && typeof item === 'object' && 'name' in item && String(item.name).includes('pwa')));
  return {
    ...base,
    plugins: [...plugins, {
      name: 'isolated-test-credentials',
      configResolved(config) {
        for (const key of Object.keys(config.env)) if (/^VITE_.*(?:API_KEY|SECRET|TOKEN)$/.test(key)) delete config.env[key];
      },
    }, VitePWA({
      registerType: 'autoUpdate',
      manifest: { id: '/full-app-test', name: 'LucKey 전체 화면 테스트', short_name: '럭키 전체테스트', start_url: '/', display: 'standalone', theme_color: '#111827', background_color: '#111827', icons: [{ src: '/icon-192-v3.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512-v3.png', sizes: '512x512', type: 'image/png' }] },
      workbox: { navigateFallback: 'full-app-test.html', maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, globPatterns: ['**/*.{js,css,html,png,svg,woff2}'] },
    })],
    build: { ...base.build, rollupOptions: { ...base.build.rollupOptions, input: 'full-app-test.html' } },
  };
});
