import { mkdirSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { canBringProof } from "@/lib/diemp/task-rows"
import { dataDir, replaceProof, setEvidenceNote, storedTasks } from "@/lib/diemp/db"
import { isSecretText, readDocument } from "@/lib/diemp/read-file"
import { currentUser } from "@/lib/diemp/session"
import { matchEvidence, matchText } from "@/lib/diemp/vision"

const LIMIT = 8 * 1024 * 1024

function noteOf(result: { moslik: string; nimaKorindi: string; sabab: string }) {
  const holat = result.moslik === "mos" ? "Mos" : result.moslik === "mos_emas" ? "Mos emas" : "Aniqlanmagan"
  return `${holat}. ${result.nimaKorindi} ${result.sabab}`.replace(/\s+/g, " ").trim().slice(0, 500)
}

export async function POST(request: Request, context: { params: Promise<{ raqam: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  const { raqam } = await context.params
  const task = (await storedTasks()).find((item) => item.raqam === raqam)
  if (!task) return NextResponse.json({ xato: "Topshiriq topilmadi" }, { status: 404 })
  if (!canBringProof(user, task.tashkilot)) return NextResponse.json({ xato: "Dalilni topshiriq tushgan organ yuklaydi" }, { status: 403 })

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
  const tur = lower.endsWith(".pdf") ? "pdf" : lower.endsWith(".docx") ? "docx" : lower.endsWith(".png") ? "png" : lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : null
  if (!tur) return NextResponse.json({ xato: "Faqat PDF, Word yoki rasm qabul qilinadi" }, { status: 400 })

  const bytes = Buffer.from(await file.arrayBuffer())
  const pdfOk = tur === "pdf" && bytes.subarray(0, 5).toString("latin1") === "%PDF-"
  const docxOk = tur === "docx" && bytes[0] === 0x50 && bytes[1] === 0x4b
  const imageOk = tur === "png" || tur === "jpg"
  if (!pdfOk && !docxOk && !imageOk) return NextResponse.json({ xato: "Fayl turi mos emas" }, { status: 400 })

  let matn = ""
  if (tur === "pdf" || tur === "docx") {
    try {
      matn = await readDocument(tur, bytes)
    } catch {
      return NextResponse.json({ xato: "Dalil matni o'qilmadi" }, { status: 400 })
    }
    if (matn.length < 20) return NextResponse.json({ xato: "Matn topilmadi. Matnli PDF yoki Word kerak." }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const folder = path.join(dataDir(), "dalillar")
  mkdirSync(folder, { recursive: true })
  const fayl = path.join(folder, `${id}.${tur}`)
  writeFileSync(fayl, bytes)
  const secret = isSecretText(matn) || isSecretText(file.name)
  const old = await replaceProof({
    id,
    topshiriq: task.raqam,
    hujjat: task.hujjat,
    nom: file.name.slice(0, 180),
    tur,
    fayl,
    izoh: secret ? "Maxfiy belgi bor. AI ga yuborilmadi. Ekspert o'zi ko'radi." : "AI solishtirmoqda.",
  })
  const root = path.resolve(dataDir())
  for (const previous of old) {
    const target = path.resolve(previous)
    if (target !== path.resolve(fayl) && target.startsWith(root + path.sep)) {
      try {
        unlinkSync(target)
      } catch {
        // eski fayl allaqachon yo'q
      }
    }
  }

  if (!secret) {
    try {
      const result = tur === "pdf" || tur === "docx"
        ? await matchText(task.matn, matn)
        : await matchEvidence(task.matn, file.name, tur === "png" ? "image/png" : "image/jpeg", bytes)
      await setEvidenceNote(id, noteOf(result))
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI solishtira olmadi"
      await setEvidenceNote(id, message.slice(0, 500))
    }
  }
  return NextResponse.json({ ok: true, id })
}
