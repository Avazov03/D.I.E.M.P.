import { NextResponse } from "next/server"
import { canOpen } from "@/lib/diemp/access"
import { currentUser } from "@/lib/diemp/session"
import { averageOutcome } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"

export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canOpen(user.rol, "/monitoring")) return NextResponse.json({ xato: "Monitoring bu rolga yopiq" }, { status: 403 })
  return NextResponse.json({ natija: averageOutcome(await loadAssessments()) })
}
