export async function precisaSincronizar() {

  const ultimaSync =
    localStorage.getItem("ultimaSync");

  if (!ultimaSync) return true;

  const horas =
    (Date.now() -
    new Date(ultimaSync).getTime())
    / 3600000;

  return horas >= 24;
}