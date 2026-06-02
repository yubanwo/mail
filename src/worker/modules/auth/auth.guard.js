import { HttpError } from "../../http/errors.js";
import { unixNow } from "../../utils/date.js";
import { verifyJwt } from "./jwt.js";

export async function requireUser(request, env) {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    throw new HttpError(401, "Bearer token is required.");
  }

  const payload = await verifyJwt(match[1], getJwtSecret(env));

  if (!payload.sub || Number(payload.exp || 0) <= unixNow()) {
    throw new HttpError(401, "Token has expired.");
  }

  return {
    id: Number(payload.sub),
    username: String(payload.username || ""),
  };
}

export function getJwtSecret(env) {
  if (!env.JWT_SECRET) {
    throw new HttpError(500, "JWT_SECRET is not configured.");
  }

  return env.JWT_SECRET;
}
