import { mkdirSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { canBringProof } from "@/lib/diemp/task-rows"
import { dataDir, replaceProof, setEvidenceNote, storedTasks } from "@/lib/diemp/db"
import { isSecretText, readOffice } from "@/lib/diemp/read-file"
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
  const bytes = Buffer.from(await file.arrayBuffer())
  const image = lower.endsWith(".png") ? "png" : lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : null
  let tur = image ?? "doc"
  let matn = ""
  if (!image) {
    try {
      const office = await readOffice(file.name, bytes)
      tur = office.kind
      matn = office.text
    } catch (error) {
      const message = error instanceof Error ? error.message : "Dalil matni o'qilmadi"
      return NextResponse.json({ xato: message.includes("PDF") ? "Faqat PDF, Word yoki rasm qabul qilinadi" : message }, { status: 400 })
    }
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
      const result = tur === "pdf" || tur === "docx" || tur === "doc"
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
