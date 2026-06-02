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
    ...extractReadableContent(parsed),
  };
}

export function looksLikeRawEmail(value) {
  return /(^|\n)(received|from|to|subject|content-type):/i.test(String(value || "").slice(0, 2000));
}

function extractReadableContent(parsed) {
  if (parsed.html?.trim()) {
    return {
      content: sanitizeHtml(parsed.html).trim(),
      contentType: "text/html",
    };
  }

  if (parsed.text?.trim()) {
    return {
      content: parsed.text.trim(),
      contentType: "text/plain",
    };
  }

  return {
    content: "",
    contentType: "text/plain",
  };
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

function sanitizeHtml(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?<\/embed>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
}
