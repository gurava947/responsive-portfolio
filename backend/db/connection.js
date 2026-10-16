import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export const DATABASE_NAME = "Static Web Development Database";
export const DATABASE_FILE = "static-web-development.db";
export const DATABASE_PATH = resolve(process.env.DATABASE_PATH || DATABASE_FILE);

export function openDatabase(path = DATABASE_PATH) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path, { enableForeignKeyConstraints: true, timeout: 5000 });
  database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  if (path !== ":memory:") database.exec("PRAGMA journal_mode = WAL;");
  return database;
}
