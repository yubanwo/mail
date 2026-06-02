import PostalMime, { decodeWords } from "postal-mime";

export function decodeMimeHeader(value) {
  return decodeWords(String(value || "")).trim();
}

export async function parseEmail(raw) {
  const parsed = await PostalMime.parse(raw, { attachmentEncoding: "utf8" });

  return {
    from: formatAddress(parsed.from),
    to: formatAddressList(parsed.to),
    subject: parsed.subject || "",
    content: extractReadableContent(parsed),
  };
}

function extractReadableContent(parsed) {
  if (parsed.text?.trim()) {
    return parsed.text.trim();
  }

  if (parsed.html?.trim()) {
    return htmlToText(parsed.html).trim();
  }

  return "";
}

function formatAddress(address) {
  if (!address) return "";

  if (address.group) {
    return formatAddressList(address.group);
  }

  if (address.name && address.address) {
    return `${address.name} <${address.address}>`;
  }

  return address.address || address.name || "";
}

function formatAddressList(addresses) {
  return (addresses || []).map(formatAddress).filter(Boolean).join(", ");
}

function htmlToText(html) {
  return decodeHtmlEntities(
    String(html)
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\/(p|div|tr|table|h[1-6]|li)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
  );
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}
