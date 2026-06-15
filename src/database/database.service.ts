import {
  CapacitorSQLite,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

import { migrations } from "./migrations";

export class DatabaseService {
  static db: SQLiteDBConnection;

  static async init() {
    
    if (this.db) return this.db;

    this.db = await CapacitorSQLite.createConnection(
      "acs",
      false,
      "no-encryption",
      1,
      false
    );

    await this.db.open();

    for (const migration of migrations) {
      await this.db.execute(migration);
    }

    return this.db;
  }

  static async getConnection() {
    if (!this.db) {
      await this.init();
    }

    return this.db;
  
  }

  static async query() {}

  static async execute() {}
}