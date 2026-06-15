import { CapacitorSQLite } from "@capacitor-community/sqlite";
import { migrations } from "./migrations";

export async function initDatabase() {

  const db = await CapacitorSQLite.createConnection(
    "acs",
    false,
    "no-encryption",
    1,
    false
  );

  await db.open();

  for (const sql of migrations) {
    await db.execute(sql);
  }

  return db;
}