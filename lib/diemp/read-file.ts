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

export function isSecretText(text: string) {
  return SECRET.test(text)
}
