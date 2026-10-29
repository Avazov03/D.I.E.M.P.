import mammoth from "mammoth"
import WordExtractor from "word-extractor"
import { extractText, getDocumentProxy } from "unpdf"

const SECRET = /maxfiy|махфий|для служебного пользования|дсп/i

export async function readDocument(kind: "pdf" | "docx" | "doc", bytes: Buffer) {
  if (kind === "doc") {
    const extracted = await new WordExtractor().extract(bytes)
    return extracted.getBody().replace(/\s+\n/g, "\n").trim()
  }
  if (kind === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(bytes))
    const result = await extractText(pdf, { mergePages: true })
    const text = Array.isArray(result.text) ? result.text.join("\n") : result.text
    return text.replace(/\s+\n/g, "\n").trim()
  }
  const result = await mammoth.extractRawText({ buffer: bytes })
  return result.value.replace(/\s+\n/g, "\n").trim()
}

function clean(value: string) {
  return value.replace(/\s+\n/g, "\n").trim()
}

function rtfToText(bytes: Buffer) {
  let raw = bytes.toString("latin1")
  raw = raw.replace(/\\'([0-9a-f]{2})/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
  raw = raw.replace(/\\u(-?\d+)\??/g, (_, n: string) => {
    const code = Number(n)
    return String.fromCharCode(code < 0 ? code + 65536 : code)
  })
  raw = raw.replace(/\\par[d]?/g, "\n")
  raw = raw.replace(/\\[a-z]+-?\d* ?/gi, "")
  return clean(raw.replace(/[{}]/g, ""))
}

function htmlToText(bytes: Buffer) {
  return clean(
    bytes
      .toString("utf8")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&"),
  )
}

export async function readOffice(name: string, bytes: Buffer) {
  const lower = name.toLowerCase()
  if (!/\.(pdf|doc|docx|rtf)$/.test(lower)) throw new Error("Faqat PDF yoki Word qabul qilinadi")
  const attempts: Array<"pdf" | "docx" | "doc"> = []
  const push = (kind: "pdf" | "docx" | "doc") => {
    if (!attempts.includes(kind)) attempts.push(kind)
  }
  if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") push("pdf")
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) push("docx")
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf) push("doc")
  if (lower.endsWith(".docx")) push("docx")
  if (lower.endsWith(".doc") || lower.endsWith(".rtf")) push("doc")
  if (lower.endsWith(".pdf")) push("pdf")
  if (lower.endsWith(".doc")) push("docx")

  for (const kind of attempts) {
    try {
      const text = clean(await readDocument(kind, bytes))
      if (text.length >= 20) return { kind, text }
    } catch {
      // keyingi o'qish usuli
    }
  }
  const head = bytes.subarray(0, 80).toString("latin1")
  if (head.includes("{\\rtf") || lower.endsWith(".rtf")) {
    const text = rtfToText(bytes)
    if (text.length >= 20) return { kind: "doc" as const, text }
  }
  const markup = bytes.subarray(0, 500).toString("utf8").toLowerCase()
  if (markup.includes("<html") || markup.includes("<?xml") || markup.includes("word.document")) {
    const text = htmlToText(bytes)
    if (text.length >= 20) return { kind: "doc" as const, text }
  }
  throw new Error("Hujjat matni o'qilmadi. Matnli PDF yoki Word kerak.")
}

export function isSecretText(text: string) {
  return SECRET.test(text)
}
