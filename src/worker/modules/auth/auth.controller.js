import { readJson } from "../../http/request.js";
import { json } from "../../http/response.js";
import { requireUser } from "./auth.guard.js";
import { getCurrentUser, loginUser, logoutUser, refreshUserToken, registerUser, updateCurrentUser } from "./auth.service.js";

export async function register(request, env) {
  return json(await registerUser(await readJson(request), env), 201);
}

export async function login(request, env) {
  return json(await loginUser(await readJson(request), env));
}

export async function refresh(request, env) {
  const { refresh_token: refreshToken } = await readJson(request);
  return json(await refreshUserToken(refreshToken, env));
}

export async function logout(request, env) {
  const { refresh_token: refreshToken } = await readJson(request);
  await logoutUser(refreshToken, env);
  return json({ ok: true });
}

export async function me(request, env) {
  return json({ user: await getCurrentUser(await requireUser(request, env), env) });
}

export async function updateMe(request, env) {
  const user = await requireUser(request, env);
  return json({ user: await updateCurrentUser(user, await readJson(request), env) });
}
