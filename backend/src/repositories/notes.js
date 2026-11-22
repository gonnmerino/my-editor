import db from "../db/db.js";


export async function findAllByUser(userId) {
  const res = await db.query(`
      SELECT id, title, content, is_pinned, is_active
      FROM notes
      WHERE user_id = $1
  `, [userId]);
  return res.rows;
}

export async function createNote({id, userId, title, content}) {
  const res = await db.query(`
      INSERT INTO notes (id, user_id, title, content)
      VALUES ($1, $2, $3, $4) RETURNING id, title, content, is_pinned, is_active
  `, [id, userId, title, content]);
  return res.rows[0];
}

export async function updateNote(id, userId, {title, content, is_pinned, is_active}) {
  const res = await db.query(`
      UPDATE notes
      SET title = COALESCE($2, title),
          content = COALESCE($3, content),
          is_pinned = COALESCE($4, is_pinned),
          is_active = COALESCE($5, is_active)
      WHERE id = $1 AND user_id = $6
          RETURNING id, title, content, is_pinned, is_active
  `, [id, title ?? null, content ?? null, is_pinned ?? null, is_active ?? null, userId]);
  return res.rows[0];
}

export async function softDeleteNote(id, userId) {
  const res = await db.query(`
      UPDATE notes SET is_active = false
      WHERE id = $1 AND user_id = $2
          RETURNING id, title, content, is_pinned, is_active
  `, [id, userId]);
  return res.rows[0];
}

export async function deleteNotePermanently(id, userId) {
  const res = await db.query(`
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2
          RETURNING id
  `, [id, userId]);
  return res.rows[0];
}

