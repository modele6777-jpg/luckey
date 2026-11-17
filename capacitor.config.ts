import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.modele6777.luckey',
  appName: 'LucKey',
  webDir: 'dist',
  server: { hostname: 'localhost', iosScheme: 'capacitor' },
  ios: { contentInset: 'never', backgroundColor: '#ffffff', preferredContentMode: 'mobile' },
  plugins: {
    SplashScreen: { launchAutoHide: true, launchShowDuration: 1800, backgroundColor: '#ffffff', showSpinner: false },
    StatusBar: { style: 'DEFAULT', overlaysWebView: true },
  },
};
export default config;
