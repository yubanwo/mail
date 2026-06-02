export function unixNow() {
  return Math.floor(Date.now() / 1000);
}

export function sqliteDateTime(timestamp) {
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19);
}
