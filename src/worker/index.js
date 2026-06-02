import { handleFetch } from "./app.js";
import { handleInboundEmail } from "./modules/emails/inbound-email.js";

export default {
  async fetch(request, env, ctx) {
    return await handleFetch(request, env, ctx);
  },

  async email(message, env) {
    return await handleInboundEmail(message, env);
  },
};
