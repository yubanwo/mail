import { json } from "../../http/response.js";
import { getEmail, listEmails } from "./emails.service.js";

export async function listEmailsResponse(request, env) {
  return json({ emails: await listEmails(new URL(request.url), env) });
}

export async function getEmailResponse(request, env, id) {
  return json({ email: await getEmail(id, env) });
}
