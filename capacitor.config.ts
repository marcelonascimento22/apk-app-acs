import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acs.app',
  appName: 'ACS App',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['192.168.1.15'] // Adicione o IP do seu backend aqui
  }
};

export default config;
