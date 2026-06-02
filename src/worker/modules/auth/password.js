import { PASSWORD_ITERATIONS } from "../../config.js";
import { base64Url, base64UrlToBytes } from "../../utils/base64.js";
import { timingSafeEqual } from "../../utils/crypto.js";

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PASSWORD_ITERATIONS);
  return `pbkdf2$${PASSWORD_ITERATIONS}$${base64Url(salt)}$${base64Url(hash)}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, iterations, salt, expectedHash] = String(storedHash).split("$");

  if (algorithm !== "pbkdf2" || !iterations || !salt || !expectedHash) {
    return false;
  }

  const actualHash = await pbkdf2(password, base64UrlToBytes(salt), Number(iterations));
  return timingSafeEqual(base64Url(actualHash), expectedHash);
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );

  return new Uint8Array(bits);
}
