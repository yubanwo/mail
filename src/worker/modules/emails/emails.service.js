import { assertDb } from "../../db/database.js";
import { HttpError } from "../../http/errors.js";
import { clampInt } from "../../utils/number.js";
import { normalizeAddress } from "../../utils/normalize.js";
import { findEmailById, findEmails } from "./emails.repository.js";
import { looksLikeRawEmail, parseEmail } from "./mime.js";

export async function listEmails(url, env) {
  assertDb(env);

  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 50);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const to = normalizeAddress(url.searchParams.get("to"));

  const emails = await findEmails(env.DB, { limit, offset, to });
  return await Promise.all(emails.map((email) => normalizeStoredEmail(email, { includeContent: false })));
}

export async function getEmail(id, env) {
  assertDb(env);

  const email = await findEmailById(env.DB, id);

  if (!email) {
    throw new HttpError(404, "Email not found.");
  }

  return await normalizeStoredEmail(email, { includeContent: true });
}

async function normalizeStoredEmail(email, { includeContent }) {
  const withoutContent = ({ content, ...summary }) => summary;

  if (!looksLikeRawEmail(email.content)) {
    const normalized = {
      ...email,
      content_type: inferContentType(email.content),
    };
    return includeContent ? normalized : withoutContent(normalized);
  }

  const parsedEmail = await parseEmail(email.content);
  const normalized = {
    ...email,
    mail_from: parsedEmail.from || email.mail_from,
    mail_to: parsedEmail.to || email.mail_to,
    subject: parsedEmail.subject || email.subject,
    content: parsedEmail.content || email.content,
    content_type: parsedEmail.contentType || "text/plain",
  };

  return includeContent ? normalized : withoutContent(normalized);
}

function inferContentType(content) {
  return /^\s*<(?:!doctype\s+html|html|body|table|div|p|center)\b/i.test(String(content || ""))
    ? "text/html"
    : "text/plain";
}
