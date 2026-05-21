import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async init() {
    this.db = await this.sqlite.createConnection(
      'acs_db',
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS familias (
        id TEXT PRIMARY KEY,
        nome TEXT,
        endereco TEXT,
        numero TEXT,
        bairro TEXT,
        latitude REAL,
        longitude REAL,
        updated_at TEXT,
        synced INTEGER DEFAULT 0,
        deleted INTEGER DEFAULT 0
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        entidade TEXT,
        payload TEXT,
        created_at TEXT
      );
    `);
  }

  getDB() {
    return this.db;
  }
}

export const databaseService = new DatabaseService();