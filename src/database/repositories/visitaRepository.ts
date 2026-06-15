import { BaseRepository } from "./BaseRepository";
import { SyncQueueRepository } from "./SyncQueueRepository";

export class VisitaRepository extends BaseRepository {
  constructor() {
    super("visita");
  }

  async create(data: any) {

    const db = await this.db();

    const localId = crypto.randomUUID();

    await db.run(
      `
      INSERT INTO visita (
        localId,
        pessoaId,
        dataVisita,
        tipoVisita,
        observacao,
        encaminhamento,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        localId,
        data.pessoaId,
        data.dataVisita,
        data.tipoVisita,
        data.observacao,
        data.encaminhamento,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    await SyncQueueRepository.add(
      "visita",
      localId,
      "INSERT"
    );
  }
}