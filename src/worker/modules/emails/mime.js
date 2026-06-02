import { decodeWords } from "postal-mime";

export function decodeMimeHeader(value) {
  return decodeWords(String(value || "")).trim();
}
