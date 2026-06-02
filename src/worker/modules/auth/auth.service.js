import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "../../config.js";
import { assertDb } from "../../db/database.js";
import { HttpError } from "../../http/errors.js";
import { base64Url } from "../../utils/base64.js";
import { sqliteDateTime, unixNow } from "../../utils/date.js";
import { normalizeUsername } from "../../utils/normalize.js";
import { getJwtSecret } from "./auth.guard.js";
import {
  countUsers,
  createRefreshToken,
  createUser,
  findActiveRefreshToken,
  findUserById,
  findUserByUsername,
  revokeRefreshToken,
  revokeRefreshTokenById,
  updateUser,
} from "./auth.repository.js";
import { signJwt } from "./jwt.js";
import { hashPassword, verifyPassword } from "./password.js";

export async function registerUser({ username, password }, env) {
  assertDb(env);
  validateCredentials(username, password);

  const normalizedUsername = normalizeUsername(username);
  const canRegister = await countUsers(env.DB) === 0 || env.ALLOW_REGISTER === "true";

  if (!canRegister) {
    throw new HttpError(403, "Registration is disabled.");
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await createUser(env.DB, normalizedUsername, passwordHash);
    const tokens = await createTokens(user, env);
    return { user, ...tokens };
  } catch (error) {
    if (String(error).includes("UNIQUE")) {
      throw new HttpError(409, "Username already exists.");
    }

    throw error;
  }
}

export async function loginUser({ username, password }, env) {
  assertDb(env);
  validateCredentials(username, password);

  const user = await findUserByUsername(env.DB, username);

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new HttpError(401, "Invalid username or password.");
  }

  const publicUser = { id: user.id, username: user.username };
  return { user: publicUser, ...(await createTokens(publicUser, env)) };
}

export async function refreshUserToken(refreshToken, env) {
  assertDb(env);

  if (!refreshToken) {
    throw new HttpError(400, "refresh_token is required.");
  }

  const row = await findActiveRefreshToken(env.DB, refreshToken);

  if (!row) {
    throw new HttpError(401, "Invalid refresh token.");
  }

  await revokeRefreshTokenById(env.DB, row.id);

  const user = { id: row.user_id, username: row.username };
  return { user, ...(await createTokens(user, env)) };
}

export async function logoutUser(refreshToken, env) {
  assertDb(env);

  if (!refreshToken) {
    throw new HttpError(400, "refresh_token is required.");
  }

  await revokeRefreshToken(env.DB, refreshToken);
}

export async function getCurrentUser(currentUser, env) {
  assertDb(env);

  const user = await findUserById(env.DB, currentUser.id);
  if (!user) {
    throw new HttpError(401, "Invalid token.");
  }

  return user;
}

export async function updateCurrentUser(currentUser, { username, password }, env) {
  assertDb(env);

  const updates = {};
  if (username !== undefined) {
    if (!normalizeUsername(username) || normalizeUsername(username).length > 64) {
      throw new HttpError(400, "Username must be 1-64 characters.");
    }

    updates.username = normalizeUsername(username);
  }

  if (password !== undefined && password !== "") {
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      throw new HttpError(400, "Password must be 8-128 characters.");
    }

    updates.passwordHash = await hashPassword(password);
  }

  if (!updates.username && !updates.passwordHash) {
    throw new HttpError(400, "Nothing to update.");
  }

  try {
    return await updateUser(env.DB, currentUser.id, updates);
  } catch (error) {
    if (String(error).includes("UNIQUE")) {
      throw new HttpError(409, "Username already exists.");
    }

    throw error;
  }
}

async function createTokens(user, env) {
  const accessToken = await signJwt(
    {
      sub: String(user.id),
      username: user.username,
      exp: unixNow() + ACCESS_TOKEN_TTL_SECONDS,
    },
    getJwtSecret(env)
  );
  const refreshToken = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = sqliteDateTime(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await createRefreshToken(env.DB, user.id, refreshToken, expiresAt);

  return {
    access_token: accessToken,
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
  };
}

function validateCredentials(username, password) {
  if (!normalizeUsername(username) || normalizeUsername(username).length > 64) {
    throw new HttpError(400, "Username must be 1-64 characters.");
  }

  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    throw new HttpError(400, "Password must be 8-128 characters.");
  }
}
