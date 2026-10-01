import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import type { Entry } from "./summary";

// Local dev: a SQLite file. Production (Vercel): set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
const g = globalThis as unknown as { __db?: Client; __ready?: Promise<void> };
const url = process.env.TURSO_DATABASE_URL || "file:./data/cafe.db";
if (url.startsWith("file:")) fs.mkdirSync(path.dirname(url.slice(5)), { recursive: true });
const client =
  g.__db ??
  (g.__db = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }));

async function init() {
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        price REAL NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        kind TEXT NOT NULL DEFAULT 'purchase',
        item TEXT NOT NULL,
        qty REAL NOT NULL DEFAULT 1,
        price REAL NOT NULL DEFAULT 0,
        note TEXT NOT NULL DEFAULT '',
        added_by TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS entries_date ON entries(date)`,
      `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
    ],
    "write",
  );
  // Seed starter items once (a flag keeps deleted items from coming back).
  const seeded = await client.execute("SELECT 1 FROM settings WHERE key = 'seeded'");
  if (!seeded.rows.length) {
    await client.batch(
      [
        "INSERT OR IGNORE INTO items (name, price) VALUES ('Tea', 20), ('Cigarette', 20)",
        "INSERT INTO settings (key, value) VALUES ('seeded', '1')",
      ],
      "write",
    );
  }
}

/** Run a query after making sure the schema exists. */
export async function query<T = Record<string, unknown>>(sql: string, args: (string | number)[] = []): Promise<T[]> {
  await (g.__ready ??= init());
  const r = await client.execute({ sql, args });
  return r.rows as unknown as T[];
}

export type Item = { id: number; name: string; price: number };

export const allEntries = () => query<Entry>("SELECT * FROM entries ORDER BY date, id");
export const entriesOn = (date: string) => query<Entry>("SELECT * FROM entries WHERE date = ? ORDER BY id", [date]);
export const allItems = () => query<Item>("SELECT * FROM items ORDER BY name");

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await query<{ key: string; value: string }>("SELECT key, value FROM settings");
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export async function setSetting(key: string, value: string) {
  await query("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [key, value]);
}
