import { assertDb } from "../../db/database.js";
import { HttpError } from "../../http/errors.js";
import { clampInt } from "../../utils/number.js";
import { normalizeAddress } from "../../utils/normalize.js";
import { findEmailById, findEmails } from "./emails.repository.js";

export async function listEmails(url, env) {
  assertDb(env);

  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 50);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const to = normalizeAddress(url.searchParams.get("to"));

  return await findEmails(env.DB, { limit, offset, to });
}

export async function getEmail(id, env) {
  assertDb(env);

  const email = await findEmailById(env.DB, id);

  if (!email) {
    throw new HttpError(404, "Email not found.");
  }

  return email;
}
