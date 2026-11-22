import db from "../db/db.js";

export async function createRefreshToken({id, userId, familyId, tokenHash, expiresAt}) {
  await db.query(`
    INSERT INTO refresh_tokens (id, user_id, family_id, token_hash, expires_at)
    VALUES ($1, $2, $3, $4, $5)
  `, [id, userId, familyId, tokenHash, expiresAt]);
}

export async function findRefreshTokenByHash(tokenHash) {
  const res = await db.query(`
    SELECT id, user_id, family_id, expires_at, revoked_at
    FROM refresh_tokens
    WHERE token_hash = $1
  `, [tokenHash]);
  return res.rows[0];
}

export async function revokeRefreshToken(id) {
  await db.query(`
    UPDATE refresh_tokens SET revoked_at = now()
    WHERE id = $1 AND revoked_at IS NULL
  `, [id]);
}

export async function revokeFamily(familyId) {
  await db.query(`
    UPDATE refresh_tokens SET revoked_at = now()
    WHERE family_id = $1 AND revoked_at IS NULL
  `, [familyId]);
}
