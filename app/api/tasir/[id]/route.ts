import { NextResponse } from "next/server"
import { canJudgeEvidence } from "@/lib/diemp/access"
import { listImpacts, setImpactStatus } from "@/lib/diemp/db"
import { currentUser } from "@/lib/diemp/session"

const idPattern = /^[0-9a-f-]{36}$/i

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canJudgeEvidence(user.rol)) return NextResponse.json({ xato: "Statistikani bu rol tasdiqlamaydi" }, { status: 403 })
  const { id } = await context.params
  if (!idPattern.test(id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const existing = (await listImpacts()).find((item) => item.id === id)
  if (!existing) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  let holat = ""
  try {
    const body = (await request.json()) as { holat?: unknown }
    holat = typeof body.holat === "string" ? body.holat : ""
  } catch {
    return NextResponse.json({ xato: "Ma'lumot o'qilmadi" }, { status: 400 })
  }
  if (holat !== "tasdiqlangan" && holat !== "rad") return NextResponse.json({ xato: "Holat noto'g'ri" }, { status: 400 })
  await setImpactStatus(id, holat)
  return NextResponse.json({ ok: true, holat })
}
