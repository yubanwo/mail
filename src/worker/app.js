import { Hono } from "hono";
import { cors } from "hono/cors";
import { HttpError } from "./http/errors.js";
import { errorJson, json } from "./http/response.js";
import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
import { registerEmailRoutes } from "./modules/emails/emails.routes.js";

const app = new Hono();

app.use("*", cors({
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
  origin: "*",
}));

app.get("/health", () => json({ ok: true }));
registerAuthRoutes(app);
registerEmailRoutes(app);

app.notFound(() => errorJson("Not found", 404));

app.onError((error) => {
  if (error instanceof HttpError) {
    return errorJson(error.message, error.status);
  }

  console.error("Request failed", error);
  return errorJson("Internal server error", 500);
});

export async function handleFetch(request, env, ctx) {
  return await app.fetch(request, env, ctx);
}
