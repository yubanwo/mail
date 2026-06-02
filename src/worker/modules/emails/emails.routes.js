import { requireUser } from "../auth/auth.guard.js";
import { getEmailResponse, listEmailsResponse } from "./emails.controller.js";

export function registerEmailRoutes(router) {
  router.get("/emails", withUser((context) => {
    return listEmailsResponse(context.req.raw, context.env);
  }));
  router.get("/emails/:id", withUser((context) => {
    return getEmailResponse(context.req.raw, context.env, Number(context.req.param("id")));
  }));
}

function withUser(handler) {
  return async (context) => {
    await requireUser(context.req.raw, context.env);
    return handler(context);
  };
}
