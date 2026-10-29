import { NextResponse } from "next/server"
import { canUpload } from "@/lib/diemp/access"
import { confirmDocument, documentById, type Draft } from "@/lib/diemp/db"
import { organizations } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"
import { decisionText, recordImpacts } from "@/lib/diemp/tasir"

const idPattern = /^[0-9a-f-]{36}$/i
const numberPattern = /^[A-Za-z0-9][A-Za-z0-9-]{1,30}$/
const orgs = new Set(organizations.map((item) => item.kod))

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canUpload(user.rol)) return NextResponse.json({ xato: "Tasdiqlash bu rolga yopiq" }, { status: 403 })
  const { id } = await context.params
  if (!idPattern.test(id) || !(await documentById(id))) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })

  let body: { raqam?: unknown; nomi?: unknown; sana?: unknown; topshiriqlar?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ xato: "Ma'lumot o'qilmadi" }, { status: 400 })
  }

  const raqam = typeof body.raqam === "string" ? body.raqam.trim() : ""
  const nomi = typeof body.nomi === "string" ? body.nomi.trim() : ""
  const sana = typeof body.sana === "string" ? body.sana.trim() : ""
  if (!numberPattern.test(raqam)) return NextResponse.json({ xato: "Qaror raqami kerak" }, { status: 400 })
  if (nomi.length < 3) return NextResponse.json({ xato: "Hujjat nomi kerak" }, { status: 400 })

  const rawTasks = Array.isArray(body.topshiriqlar) ? body.topshiriqlar : []
  const topshiriqlar = rawTasks.slice(0, 30).map((item) => {
    const row = item as { matn?: unknown; muddat?: unknown; tashkilot?: unknown; parchasi?: unknown }
    return {
      matn: typeof row.matn === "string" ? row.matn.trim().slice(0, 400) : "",
      muddat: typeof row.muddat === "string" ? row.muddat.trim().slice(0, 40) : "",
      tashkilot: typeof row.tashkilot === "string" ? row.tashkilot : "",
      parchasi: typeof row.parchasi === "string" ? row.parchasi.slice(0, 240) : "",
    }
  }).filter((task) => task.matn)
  if (!topshiriqlar.length) return NextResponse.json({ xato: "Kamida bitta topshiriq kerak" }, { status: 400 })
  if (topshiriqlar.some((task) => !orgs.has(task.tashkilot as typeof organizations[number]["kod"]))) {
    return NextResponse.json({ xato: "Har bir topshiriqqa tashkilot tanlanadi" }, { status: 400 })
  }

  const draft: Draft = { raqam, nomi: nomi.slice(0, 240), sana: sana.slice(0, 40), topshiriqlar, aniqlanmagan: [] }
  const result = await confirmDocument(id, draft)
  if (!result.ok) return NextResponse.json({ xato: result.xato }, { status: 409 })
  try {
    await recordImpacts(raqam, await decisionText(raqam), "taklif")
  } catch {
    // tasdiq saqlangan, statistika keyin qayta aniqlanadi
  }
  return NextResponse.json({ ok: true, raqam })
}
