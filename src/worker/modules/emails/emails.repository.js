import { normalizeAddress } from "../../utils/normalize.js";

export async function findEmails(db, { limit, offset, to }) {
  if (to) {
    const rows = await db.prepare(`
      SELECT id, mail_from, mail_to, subject, created_at
      FROM emails
      WHERE mail_to = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ? OFFSET ?
    `)
      .bind(normalizeAddress(to), limit, offset)
      .all();

    return rows.results || [];
  }

  const rows = await db.prepare(`
    SELECT id, mail_from, mail_to, subject, created_at
    FROM emails
    ORDER BY created_at DESC, id DESC
    LIMIT ? OFFSET ?
  `)
    .bind(limit, offset)
    .all();

  return rows.results || [];
}

export async function findEmailById(db, id) {
  return await db.prepare(`
    SELECT id, mail_from, mail_to, subject, content, created_at
    FROM emails
    WHERE id = ?
  `)
    .bind(id)
    .first();
}

export async function createEmail(db, { from, to, subject, content }) {
  await db.prepare(`
    INSERT INTO emails (
      mail_from,
      mail_to,
      subject,
      content
    )
    VALUES (?, ?, ?, ?)
  `)
    .bind(
      normalizeAddress(from),
      normalizeAddress(to),
      subject,
      content
    )
    .run();
}
