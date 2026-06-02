import { SignJWT, jwtVerify } from "jose";
import { HttpError } from "../../http/errors.js";

const textEncoder = new TextEncoder();

export async function signJwt(payload, secret) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(textEncoder.encode(secret));
}

export async function verifyJwt(token, secret) {
  try {
    const { payload } = await jwtVerify(token, textEncoder.encode(secret), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    throw new HttpError(401, "Invalid token.");
  }
}
