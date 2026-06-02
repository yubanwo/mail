import { sha256Hex } from "../../utils/crypto.js";
import { normalizeUsername } from "../../utils/normalize.js";

export async function countUsers(db) {
  const row = await db.prepare("SELECT COUNT(*) AS count FROM users").first();
  return Number(row?.count || 0);
}

export async function createUser(db, username, passwordHash) {
  const result = await db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
  `)
    .bind(normalizeUsername(username), passwordHash)
    .run();

  return { id: result.meta.last_row_id, username: normalizeUsername(username) };
}

export async function findUserByUsername(db, username) {
  return await db.prepare(`
    SELECT id, username, password_hash
    FROM users
    WHERE username = ?
  `)
    .bind(normalizeUsername(username))
    .first();
}

export async function findUserById(db, id) {
  return await db.prepare(`
    SELECT id, username
    FROM users
    WHERE id = ?
  `)
    .bind(id)
    .first();
}

export async function updateUser(db, id, updates) {
  if (updates.username && updates.passwordHash) {
    await db.prepare(`
      UPDATE users
      SET username = ?, password_hash = ?
      WHERE id = ?
    `)
      .bind(normalizeUsername(updates.username), updates.passwordHash, id)
      .run();
  } else if (updates.username) {
    await db.prepare("UPDATE users SET username = ? WHERE id = ?")
      .bind(normalizeUsername(updates.username), id)
      .run();
  } else if (updates.passwordHash) {
    await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .bind(updates.passwordHash, id)
      .run();
  }

  return await db.prepare(`
    SELECT id, username
    FROM users
    WHERE id = ?
  `)
    .bind(id)
    .first();
}

export async function createRefreshToken(db, userId, refreshToken, expiresAt) {
  await db.prepare(`
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `)
    .bind(userId, await sha256Hex(refreshToken), expiresAt)
    .run();
}

export async function findActiveRefreshToken(db, refreshToken) {
  return await db.prepare(`
    SELECT rt.id, rt.user_id, u.username
    FROM refresh_tokens rt
    JOIN users u ON u.id = rt.user_id
    WHERE rt.token_hash = ?
      AND rt.revoked = 0
      AND rt.expires_at > datetime('now')
  `)
    .bind(await sha256Hex(refreshToken))
    .first();
}

export async function revokeRefreshTokenById(db, id) {
  await db.prepare("UPDATE refresh_tokens SET revoked = 1 WHERE id = ?")
    .bind(id)
    .run();
}

export async function revokeRefreshToken(db, refreshToken) {
  await db.prepare("UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?")
    .bind(await sha256Hex(refreshToken))
    .run();
}
