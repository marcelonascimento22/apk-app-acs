import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acs.app',
  appName: 'ACS App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['backend-app-acs.onrender.com'] // Adicione o IP do seu backend aqui
  }
};

export default config;
