import { DatabaseService } from "../database.service";

export class SyncQueueRepository {

  static async add(
    tabela: string,
    registroId: string,
    operacao: string
  ) {

    const db =
      await DatabaseService.getConnection();

    await db.run(
      `
      INSERT INTO sync_queue (
        tabela,
        registroId,
        operacao,
        dataCriacao
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        tabela,
        registroId,
        operacao,
        new Date().toISOString()
      ]
    );
  }

  static async pending() {

    const db =
      await DatabaseService.getConnection();

    const result = await db.query(
      `SELECT * FROM sync_queue`
    );

    return result.values || [];
  }

  static async clear() {
    const db =
        await DatabaseService.getConnection();

    await db.execute(
        "DELETE FROM sync_queue"
    );
    }
}