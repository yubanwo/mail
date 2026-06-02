export async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const payload = await response.json();

    if (payload && typeof payload === "object" && "ok" in payload) {
      if (payload.ok === false) {
        throw new Error(payload.error?.message || "请求失败");
      }

      return payload.data;
    }

    return payload;
  }

  const text = await response.text();
  const looksLikeHtml = text.trimStart().startsWith("<!doctype") || text.trimStart().startsWith("<html");

  if (looksLikeHtml) {
    throw new Error(
      `API returned HTML from ${response.url || "unknown URL"} (${response.status}, ${contentType || "unknown content-type"}). Please open the Cloudflare Worker dev URL.`
    );
  }

  throw new Error(text || "请求失败");
}
