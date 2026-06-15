// src/database/repositories/PessoaComorbidadeRepository.ts

import { BaseRepository } from "./BaseRepository";
import { SyncQueueRepository } from "./SyncQueueRepository";

export class PessoaComorbidadeRepository extends BaseRepository {
  constructor() {
    super("pessoa_comorbidade");
  }

  async vincular(data: {
    pessoaId: number;
    comorbidadeId: number;
    dataDiagnostico?: string;
    observacao?: string;
    status?: string;
  }) {
    const db = await this.db();

    const result = await db.run(
      `
      INSERT INTO pessoa_comorbidade (
        pessoaId,
        comorbidadeId,
        dataDiagnostico,
        observacao,
        status,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.pessoaId,
        data.comorbidadeId,
        data.dataDiagnostico,
        data.observacao,
        data.status,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    const id = result.changes?.lastId;

    await SyncQueueRepository.add(
      "pessoa_comorbidade",
      String(id),
      "INSERT"
    );

    return id;
  }

  async remover(id: number) {
    const db = await this.db();

    await db.run(
      `
      UPDATE pessoa_comorbidade
      SET deletedAt = ?,
          updatedAt = ?
      WHERE id = ?
      `,
      [
        new Date().toISOString(),
        new Date().toISOString(),
        id,
      ]
    );

    await SyncQueueRepository.add(
      "pessoa_comorbidade",
      String(id),
      "DELETE"
    );
  }

  async listarPorPessoa(pessoaId: number) {
    const db = await this.db();

    const result = await db.query(
      `
      SELECT
        pc.*,
        c.nome as comorbidadeNome
      FROM pessoa_comorbidade pc
      INNER JOIN comorbidade c
        ON c.id = pc.comorbidadeId
      WHERE
        pc.pessoaId = ?
        AND pc.deletedAt IS NULL
      `,
      [pessoaId]
    );

    return result.values || [];
  }

  async atualizarStatus(
    id: number,
    status: string,
    observacao?: string
    ) {
    const db = await this.db();

    await db.run(
        `
        UPDATE pessoa_comorbidade
        SET
        status = ?,
        observacao = ?,
        updatedAt = ?
        WHERE id = ?
        `,
        [
        status,
        observacao,
        new Date().toISOString(),
        id,
        ]
    );

    await SyncQueueRepository.add(
        "pessoa_comorbidade",
        String(id),
        "UPDATE"
    );

    return this.findById(id);
    }
}

export const pessoaComorbidadeRepository =
  new PessoaComorbidadeRepository();