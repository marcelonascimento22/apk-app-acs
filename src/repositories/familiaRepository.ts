import { databaseService } from "../services/database";

export const familiaRepository = {
  async getAll() {
    const db = databaseService.getDB();
    const res = await db?.query("SELECT * FROM familias WHERE deleted = 0");
    return res?.values || [];
  },

  async create(familia: any) {
    const db = databaseService.getDB();

    const now = new Date().toISOString();

    await db?.run(
      `INSERT INTO familias 
      (id, nome, endereco, numero, bairro, latitude, longitude, updated_at, synced, deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
      [
        familia.id,
        familia.nome,
        familia.endereco,
        familia.numero,
        familia.bairro,
        familia.latitude,
        familia.longitude,
        now
      ]
    );

    // adiciona na fila de sync
    await db?.run(
      `INSERT INTO sync_queue (tipo, entidade, payload, created_at)
       VALUES (?, ?, ?, ?)`,
      [
        "CREATE",
        "familia",
        JSON.stringify(familia),
        now
      ]
    );
  }
};