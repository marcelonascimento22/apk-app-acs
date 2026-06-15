import { BaseRepository } from "./BaseRepository";

export class familiaRepository extends BaseRepository {
  constructor() {
    super("familia");
  }

  async create(data: any) {
    const db = await this.db();

    await db.run(
      `
      INSERT INTO familia (
        id,
        endereco,
        numero,
        bairro,
        cep,
        latitude,
        longitude,
        descricao,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.id,
        data.endereco,
        data.numero,
        data.bairro,
        data.cep,
        data.latitude,
        data.longitude,
        data.descricao,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }

  async search(texto: string) {
    const db = await this.db();

    const result = await db.query(
        `
        SELECT *
        FROM familia
        WHERE
        endereco LIKE ?
        OR bairro LIKE ?
        OR descricao LIKE ?
        ORDER BY endereco
        `,
        [
        `%${texto}%`,
        `%${texto}%`,
        `%${texto}%`
        ]
    );

    return result.values || [];
}
}