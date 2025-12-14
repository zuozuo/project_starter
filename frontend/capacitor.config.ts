import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cpamaster.app',
  appName: 'CPA Master',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
