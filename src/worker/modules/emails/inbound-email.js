import { MAX_EMAIL_BYTES } from "../../config.js";
import { assertDb } from "../../db/database.js";
import { createEmail } from "./emails.repository.js";
import { decodeMimeHeader, parseEmail } from "./mime.js";

export async function handleInboundEmail(message, env) {
  if (!env.DB) {
    message.setReject("Database binding DB is not configured.");
    return;
  }

  try {
    const rawEmail = await readEmail(message.raw);
    const parsedEmail = await parseEmail(rawEmail);

    assertDb(env);
    await createEmail(env.DB, {
      from: parsedEmail.from || decodeMimeHeader(message.headers.get("from")) || message.from,
      to: parsedEmail.to || decodeMimeHeader(message.headers.get("to")) || message.to,
      subject: parsedEmail.subject || decodeMimeHeader(message.headers.get("subject")),
      content: parsedEmail.content || rawEmail,
    });
  } catch (error) {
    console.error("Failed to store inbound email", {
      from: message.from,
      to: message.to,
      error: error instanceof Error ? error.message : String(error),
    });

    message.setReject("Failed to store inbound email.");
  }
}

async function readEmail(raw) {
  const bytes = await new Response(raw).arrayBuffer();

  if (bytes.byteLength > MAX_EMAIL_BYTES) {
    throw new Error(`Email is too large: ${bytes.byteLength} bytes`);
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
