export function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeAddress(value) {
  return String(value || "").trim().toLowerCase();
}
