// src/services/sync.service.ts

import api from "./api";
import { DatabaseService } from "../database/database.service";
import { SyncQueueRepository } from "../database/repositories/SyncQueueRepository";

export class SyncService {
  /**
   * Executa sincronização completa
   */
  static async sync() {
    try {
      console.log("Iniciando sincronização...");

      await this.uploadPending();

      await this.downloadUpdates();

      localStorage.setItem(
        "ultimaSync",
        new Date().toISOString()
      );

      console.log("Sincronização concluída");
    } catch (error) {
      console.error(
        "Erro durante sincronização:",
        error
      );

      throw error;
    }
  }

  /**
   * Verifica se precisa sincronizar
   */
  static async shouldSync() {
    const lastSync =
      localStorage.getItem("ultimaSync");

    if (!lastSync) {
      return true;
    }

    const diffHours =
      (Date.now() -
        new Date(lastSync).getTime()) /
      (1000 * 60 * 60);

    return diffHours >= 24;
  }

  /**
   * Status da sincronização
   */
  static async getStatus() {
    const queue =
      await SyncQueueRepository.pending();

    return {
      pendingItems: queue.length,
      lastSync:
        localStorage.getItem("ultimaSync"),
    };
  }

  /**
   * Envia registros pendentes
   */
  static async uploadPending() {
    const queue =
      await SyncQueueRepository.pending();

    if (!queue.length) {
      return;
    }

    const db =
      await DatabaseService.getConnection();

    const payload = {
      visitas: [],
      pessoas: [],
      familias: [],
    };

    for (const item of queue) {
      try {
        switch (item.tabela) {
          case "visita": {
            const result = await db.query(
              `
              SELECT *
              FROM visita
              WHERE localId = ?
              `,
              [item.registroId]
            );

            if (result.values?.length) {
              payload.visitas.push(
                result.values[0]
              );
            }

            break;
          }

          case "pessoa": {
            const result = await db.query(
              `
              SELECT *
              FROM pessoa
              WHERE id = ?
              `,
              [item.registroId]
            );

            if (result.values?.length) {
              payload.pessoas.push(
                result.values[0]
              );
            }

            break;
          }

          case "familia": {
            const result = await db.query(
              `
              SELECT *
              FROM familia
              WHERE id = ?
              `,
              [item.registroId]
            );

            if (result.values?.length) {
              payload.familias.push(
                result.values[0]
              );
            }

            break;
          }
        }
      } catch (error) {
        console.error(
          `Erro processando fila ${item.id}`,
          error
        );
      }
    }

    if (
      payload.visitas.length === 0 &&
      payload.pessoas.length === 0 &&
      payload.familias.length === 0
    ) {
      return;
    }

    const response =
      await api.post(
        "/sync/upload",
        payload
      );

    if (response.status === 200) {
      await SyncQueueRepository.clear();
    }
  }

  /**
   * Baixa atualizações do servidor
   */
  static async downloadUpdates() {
    const lastSync =
      localStorage.getItem("ultimaSync");

    const { data } =
      await api.get("/sync/download", {
        params: {
          since: lastSync,
        },
      });

    const db =
      await DatabaseService.getConnection();

    await db.execute("BEGIN TRANSACTION");

    try {
      /**
       * Pessoas
       */
      if (data.pessoas?.length) {
        for (const pessoa of data.pessoas) {
          await db.run(
            `
            INSERT OR REPLACE INTO pessoa (
              id,
              nome,
              cpf,
              sus,
              dataNascimento,
              sexo,
              telefone,
              familiaId,
              createdAt,
              updatedAt,
              deletedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              pessoa.id,
              pessoa.nome,
              pessoa.cpf,
              pessoa.sus,
              pessoa.dataNascimento,
              pessoa.sexo,
              pessoa.telefone,
              pessoa.familiaId,
              pessoa.createdAt,
              pessoa.updatedAt,
              pessoa.deletedAt,
            ]
          );
        }
      }

      /**
       * Famílias
       */
      if (data.familias?.length) {
        for (const familia of data.familias) {
          await db.run(
            `
            INSERT OR REPLACE INTO familia (
              id,
              endereco,
              numero,
              bairro,
              cep,
              latitude,
              longitude,
              descricao,
              createdAt,
              updatedAt,
              deletedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              familia.id,
              familia.endereco,
              familia.numero,
              familia.bairro,
              familia.cep,
              familia.latitude,
              familia.longitude,
              familia.descricao,
              familia.createdAt,
              familia.updatedAt,
              familia.deletedAt,
            ]
          );
        }
      }

      /**
       * Visitas
       */
      if (data.visitas?.length) {
        for (const visita of data.visitas) {
          await db.run(
            `
            INSERT OR REPLACE INTO visita (
              id,
              localId,
              pessoaId,
              dataVisita,
              tipoVisita,
              observacao,
              encaminhamento,
              createdAt,
              updatedAt,
              deletedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              visita.id,
              visita.localId,
              visita.pessoaId,
              visita.dataVisita,
              visita.tipoVisita,
              visita.observacao,
              visita.encaminhamento,
              visita.createdAt,
              visita.updatedAt,
              visita.deletedAt,
            ]
          );
        }
      }

      await db.execute("COMMIT");
    } catch (error) {
      await db.execute("ROLLBACK");
      throw error;
    }
  }
}