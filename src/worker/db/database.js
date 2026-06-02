import { HttpError } from "../http/errors.js";

export function assertDb(env) {
  if (!env.DB) {
    throw new HttpError(500, "Database binding DB is not configured.");
  }
}
