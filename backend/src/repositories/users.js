import db from "../db/db.js";
import {randomUUID} from "node:crypto";

export async function createUserWithAccount({id, name, email, passwordHash}) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const userRes = await client.query(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email
    `, [id, name, email, passwordHash]);
    await client.query(`
      INSERT INTO accounts (id, user_id, provider, provider_account_id)
      VALUES ($1, $2, 'password', $3)
    `, [randomUUID(), id, email]);

    await client.query("COMMIT");
    return userRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
export async function findUserById(id) {
  const res = await db.query(`
    SELECT id, name, email FROM users WHERE id = $1
  `, [id]);
  return res.rows[0];
}

export async function findUserByEmail(email) {
  const res = await db.query(`
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = $1
  `, [email]);
  return res.rows[0];
}
