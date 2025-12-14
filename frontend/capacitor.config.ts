import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.app',
  appName: 'Your App Name',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
