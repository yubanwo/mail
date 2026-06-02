import { readJsonResponse } from "./response.js";

export function createApiClient(tokens, setTokens) {
  async function request(path, options = {}, retry = true) {
    const headers = new Headers(options.headers || {});
    headers.set("content-type", "application/json");

    if (tokens?.access_token) {
      headers.set("authorization", `Bearer ${tokens.access_token}`);
    }

    let response = await fetch(path, { ...options, headers });

    if (response.status === 401 && retry && tokens?.refresh_token) {
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      });

      if (refreshResponse.ok) {
        const refreshData = await readJsonResponse(refreshResponse);
        setTokens({
          access_token: refreshData.access_token,
          refresh_token: refreshData.refresh_token,
        });
        response = await request(path, options, false);
      } else {
        setTokens(null);
        await readJsonResponse(refreshResponse);
      }
    }

    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "请求失败");
    }

    return data;
  }

  return {
    get: (path) => request(path),
    post: (path, body) => request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
    patch: (path, body) => request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  };
}
