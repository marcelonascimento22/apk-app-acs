import { Geolocation } from '@capacitor/geolocation';

export async function solicitarPermissaoLocalizacao() {
  const permissions = await Geolocation.requestPermissions();

  return permissions.location === 'granted';
}

export async function obterLocalizacaoAtual() {
  const permissionGranted = await solicitarPermissaoLocalizacao();

  if (!permissionGranted) {
    throw new Error('Permissão de localização negada');
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}