// src/database/repositories/ComorbidadeRepository.ts

import { BaseRepository } from "./BaseRepository";

export class ComorbidadeRepository extends BaseRepository {
  constructor() {
    super("comorbidade");
  }

  async findAll() {
    const db = await this.db();

    const result = await db.query(`
      SELECT *
      FROM comorbidade
      WHERE deletedAt IS NULL
      ORDER BY nome
    `);

    return result.values || [];
  }

  async findById(id: number) {
    const db = await this.db();

    const result = await db.query(
      `
      SELECT *
      FROM comorbidade
      WHERE id = ?
      `,
      [id]
    );

    return result.values?.[0] ?? null;
  }
}

export const comorbidadeRepository =
  new ComorbidadeRepository();