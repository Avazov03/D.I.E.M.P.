import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { canUpload } from "@/lib/diemp/access"
import { dataDir, listDocuments, saveDocument, type Draft } from "@/lib/diemp/db"
import { extractDraft } from "@/lib/diemp/extract"
import { isSecretText, readDocument } from "@/lib/diemp/read-file"
import { currentUser } from "@/lib/diemp/session"

const LIMIT = 8 * 1024 * 1024

export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canUpload(user.rol)) return NextResponse.json({ xato: "Hujjatlar bu rolga yopiq" }, { status: 403 })
  return NextResponse.json(await listDocuments())
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canUpload(user.rol)) return NextResponse.json({ xato: "Hujjat yuklash bu rolga yopiq" }, { status: 403 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ xato: "Fayl o'qilmadi" }, { status: 400 })
  }
  const file = form.get("fayl")
  if (!(file instanceof File)) return NextResponse.json({ xato: "Fayl tanlanmagan" }, { status: 400 })
  if (file.size < 1 || file.size > LIMIT) return NextResponse.json({ xato: "Fayl 8 MB dan katta yoki bo'sh" }, { status: 400 })

  const lower = file.name.toLowerCase()
  const tur = lower.endsWith(".pdf") ? "pdf" : lower.endsWith(".docx") ? "docx" : null
  if (!tur) return NextResponse.json({ xato: "Faqat PDF yoki DOCX qabul qilinadi" }, { status: 400 })

  const bytes = Buffer.from(await file.arrayBuffer())
  const pdfOk = tur === "pdf" && bytes.subarray(0, 5).toString("latin1") === "%PDF-"
  const docxOk = tur === "docx" && bytes[0] === 0x50 && bytes[1] === 0x4b
  if (!pdfOk && !docxOk) return NextResponse.json({ xato: "Fayl turi mos emas" }, { status: 400 })

  let matn = ""
  try {
    matn = await readDocument(tur, bytes)
  } catch {
    return NextResponse.json({ xato: "Hujjat matni o'qilmadi" }, { status: 400 })
  }
  if (matn.length < 20) {
    return NextResponse.json({ xato: "Matn topilmadi. Skaner rasm bo'lsa, hozircha matnli PDF yoki Word kerak." }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const folder = path.join(dataDir(), "hujjatlar")
  mkdirSync(folder, { recursive: true })
  const fayl = path.join(folder, `${id}.${tur}`)
  writeFileSync(fayl, bytes)

  let holat = "ajratilgan"
  let cheklov = ""
  let draft: Draft | null = null
  if (isSecretText(matn) || isSecretText(file.name)) {
    holat = "cheklangan"
    cheklov = "Maxfiy belgi bor. Tashqi AI ga yuborilmadi. Maydonlarni odam to'ldiradi."
  } else {
    try {
      draft = await extractDraft(matn)
    } catch (error) {
      cheklov = error instanceof Error ? error.message : "Ajratilmadi"
      draft = { raqam: "", nomi: "", sana: "", topshiriqlar: [], aniqlanmagan: ["AI ajratmasi olinmadi"] }
    }
  }

  await saveDocument({
    id,
    nom: file.name.slice(0, 180),
    tur,
    fayl,
    matn: matn.slice(0, 400000),
    holat,
    yuklovchi: user.id,
    yaratilgan: new Date().toISOString(),
    cheklov,
  }, draft)

  return NextResponse.json({ id })
}
