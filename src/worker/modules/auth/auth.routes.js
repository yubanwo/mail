import { login, logout, me, refresh, register, updateMe } from "./auth.controller.js";

export function registerAuthRoutes(router) {
  router.post("/auth/register", (context) => register(context.req.raw, context.env));
  router.post("/auth/login", (context) => login(context.req.raw, context.env));
  router.post("/auth/refresh", (context) => refresh(context.req.raw, context.env));
  router.post("/auth/logout", (context) => logout(context.req.raw, context.env));
  router.get("/me", (context) => me(context.req.raw, context.env));
  router.patch("/me", (context) => updateMe(context.req.raw, context.env));
}
