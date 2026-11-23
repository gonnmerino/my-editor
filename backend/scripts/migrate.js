import {readdirSync, readFileSync} from "node:fs";
import db from "../src/db/db.js";

const dir = new URL("../migrations/", import.meta.url);

await db.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`);

const done = await db.query("SELECT name FROM schema_migrations");
const applied = new Set(done.rows.map((row) => row.name));

const files = readdirSync(dir).filter((file) => file.endsWith(".sql")).sort();

let count = 0;

for (const file of files) {
  if (applied.has(file)) continue;

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(readFileSync(new URL(file, dir), "utf8"));
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
    await client.query("COMMIT");
    count++;
    console.log(`Migración aplicada: ${file}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

if (count === 0) console.log("No hay migraciones pendientes");

await db.end();
