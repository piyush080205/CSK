import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { Entry } from "./summary";

const file = process.env.DATABASE_PATH ?? "./data/cafe.db";
fs.mkdirSync(path.dirname(file), { recursive: true });

const g = globalThis as unknown as { __db?: Database.Database };
export const db =
  g.__db ??
  (g.__db = (() => {
    const d = new Database(file);
    d.pragma("journal_mode = WAL");
    d.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        price REAL NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        kind TEXT NOT NULL DEFAULT 'purchase',
        item TEXT NOT NULL,
        qty REAL NOT NULL DEFAULT 1,
        price REAL NOT NULL DEFAULT 0,
        note TEXT NOT NULL DEFAULT '',
        added_by TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS entries_date ON entries(date);
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    `);
    const { c } = d.prepare("SELECT COUNT(*) c FROM items").get() as { c: number };
    if (c === 0) {
      const ins = d.prepare("INSERT INTO items (name, price) VALUES (?, ?)");
      ins.run("Tea", 20);
      ins.run("Cigarette", 20);
    }
    return d;
  })());

export type Item = { id: number; name: string; price: number };

export const allEntries = () => db.prepare("SELECT * FROM entries ORDER BY date, id").all() as Entry[];
export const entriesOn = (date: string) =>
  db.prepare("SELECT * FROM entries WHERE date = ? ORDER BY id").all(date) as Entry[];
export const allItems = () => db.prepare("SELECT * FROM items ORDER BY name").all() as Item[];

export function getSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export function setSetting(key: string, value: string) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}
