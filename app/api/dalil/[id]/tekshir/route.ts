import { readFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { canCheckEvidence, canJudgeEvidence } from "@/lib/diemp/access"
import { dataDir, evidenceById, setEvidenceStatus, storedTasks } from "@/lib/diemp/db"
import { evidenceFilesFor } from "@/lib/diemp/scope"
import { currentUser } from "@/lib/diemp/session"
import { matchEvidence } from "@/lib/diemp/vision"

const idPattern = /^[a-z0-9-]{3,40}$/
const statuses = new Set(["tasdiqlangan", "yetishmaydi", "tekshiruvda"])

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canCheckEvidence(user.rol)) return NextResponse.json({ xato: "Dalil tekshiruvi bu rolga yopiq" }, { status: 403 })
  const { id } = await context.params
  if (!idPattern.test(id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const visible = await evidenceFilesFor(user)
  if (!visible.some((row) => row.id === id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const row = await evidenceById(id)
  if (!row) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  if (row.tur !== "jpg" && row.tur !== "jpeg" && row.tur !== "png") {
    return NextResponse.json({ xato: "Bu fayl rasm emas" }, { status: 400 })
  }
  const task = (await storedTasks()).find((item) => item.raqam === row.topshiriq)
  const root = path.resolve(dataDir())
  const file = path.resolve(row.fayl)
  if (!file.startsWith(root + path.sep)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  try {
    const result = await matchEvidence(task?.matn || row.topshiriq, row.izoh, row.tur === "png" ? "image/png" : "image/jpeg", readFileSync(file))
    return NextResponse.json({ ...result, cheklov: "AI xulosasi rasmiy tasdiq emas. Holatni nazorat mas'uli qo'yadi." })
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI xizmati javob bermadi"
    return NextResponse.json({ xato: message }, { status: 502 })
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canJudgeEvidence(user.rol)) return NextResponse.json({ xato: "Dalil holatini bu rol qo'ymaydi" }, { status: 403 })
  const { id } = await context.params
  if (!idPattern.test(id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const visible = await evidenceFilesFor(user)
  if (!visible.some((row) => row.id === id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  let holat = ""
  try {
    const body = (await request.json()) as { holat?: unknown }
    holat = typeof body.holat === "string" ? body.holat : ""
  } catch {
    return NextResponse.json({ xato: "Ma'lumot o'qilmadi" }, { status: 400 })
  }
  if (!statuses.has(holat)) return NextResponse.json({ xato: "Holat noto'g'ri" }, { status: 400 })
  await setEvidenceStatus(id, holat)
  return NextResponse.json({ ok: true, holat })
}
