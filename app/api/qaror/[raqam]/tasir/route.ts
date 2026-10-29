import { NextResponse } from "next/server"
import { canOpen } from "@/lib/diemp/access"
import { documentOwners, storedDecisions, storedTasks } from "@/lib/diemp/db"
import { currentUser } from "@/lib/diemp/session"
import { decisionText, recordImpacts } from "@/lib/diemp/tasir"

const numberPattern = /^[A-Za-z0-9][A-Za-z0-9-]{0,40}$/

export async function POST(_request: Request, context: { params: Promise<{ raqam: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canOpen(user.rol, "/reyestr") && !canOpen(user.rol, "/topshiriqlar")) return NextResponse.json({ xato: "Bu rolga yopiq" }, { status: 403 })
  const { raqam } = await context.params
  if (!numberPattern.test(raqam)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const decision = (await storedDecisions()).find((item) => item.raqam === raqam)
  if (!decision) return NextResponse.json({ xato: "Qaror topilmadi" }, { status: 404 })
  if (user.rol === "koordinator") {
    const owners = await documentOwners()
    const tasks = await storedTasks()
    const own = owners.get(decision.hujjat) === user.id
    const organ = tasks.some((task) => task.qaror === raqam && task.tashkilot === user.tashkilot)
    if (!own && !organ) return NextResponse.json({ xato: "Bu qaror bu rolda yo'q" }, { status: 403 })
  }
  const text = await decisionText(raqam)
  const rows = await recordImpacts(raqam, text, "taklif")
  return NextResponse.json({ ok: true, soni: rows.length })
}
