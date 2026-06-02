export function json(data, status = 200) {
  return jsonResponse({ ok: true, data }, status);
}

export function errorJson(message, status = 500) {
  return jsonResponse({ ok: false, error: { message } }, status);
}

function jsonResponse(data, status) {
  return withCors(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    })
  );
}

export function withCors(response) {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET, POST, PATCH, OPTIONS");
  headers.set("access-control-allow-headers", "Authorization, Content-Type");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
