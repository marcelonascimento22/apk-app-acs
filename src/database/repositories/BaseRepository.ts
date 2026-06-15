import { DatabaseService } from "../database.service";

export abstract class BaseRepository {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async db() {
    return await DatabaseService.getConnection();
  }

  async findAll() {
    const db = await this.db();

    const result = await db.query(
      `SELECT * FROM ${this.tableName}
       WHERE deletedAt IS NULL`
    );

    return result.values || [];
  }

  async findById(id: number) {
    const db = await this.db();

    const result = await db.query(
      `
      SELECT *
      FROM ${this.tableName}
      WHERE id = ?
      `,
      [id]
    );

    return result.values?.[0];
  }

  async softDelete(id: number) {
    const db = await this.db();

    await db.run(
      `
      UPDATE ${this.tableName}
      SET deletedAt = ?
      WHERE id = ?
      `,
      [
        new Date().toISOString(),
        id,
      ]
    );
  }
}