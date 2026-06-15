// src/database/repositories/PessoaRepository.ts

import { BaseRepository } from './BaseRepository';
import { SyncQueueRepository } from './SyncQueueRepository';

export class PessoaRepository extends BaseRepository {
  constructor() {
    super('pessoa');
  }

  async create(data: any) {
    const db = await this.db();

    await db.run(
      `
      INSERT INTO pessoa (
        id,
        nome,
        cpf,
        sus,
        dataNascimento,
        sexo,
        telefone,
        familiaId,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.id,
        data.nome,
        data.cpf,
        data.sus,
        data.dataNascimento,
        data.sexo,
        data.telefone,
        data.familiaId,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }

  async findById(id: number) {
    const db = await this.db();

    const result = await db.query(
      `
      SELECT *
      FROM pessoa
      WHERE id = ?
      `,
      [id]
    );

    return result.values?.[0] ?? null;
  }

  async search(nome: string) {
    const db = await this.db();

    const result = await db.query(
      `
      SELECT *
      FROM pessoa
      WHERE nome LIKE ?
      AND deletedAt IS NULL
      ORDER BY nome
      `,
      [`%${nome}%`]
    );

    return result.values || [];
  }

  async update(id: number, data: any) {
    const db = await this.db();

    await db.run(
        `
        UPDATE pessoa
        SET
        nome = ?,
        cpf = ?,
        sus = ?,
        dataNascimento = ?,
        sexo = ?,
        telefone = ?,
        familiaId = ?,
        updatedAt = ?
        WHERE id = ?
        `,
        [
        data.nome,
        data.cpf,
        data.sus,
        data.dataNascimento,
        data.sexo,
        data.telefone,
        data.familiaId,
        new Date().toISOString(),
        id,
        ]
    );

    await SyncQueueRepository.add(
        "pessoa",
        String(id),
        "UPDATE"
    );

    return await this.findById(id);
  }

  
}

export const pessoaRepository = new PessoaRepository();