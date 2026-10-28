import { NextResponse } from "next/server"
import { tasksFor } from "@/lib/diemp/scope"
import { submitReport } from "@/lib/diemp/inbox"
import { currentUser } from "@/lib/diemp/session"

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (user.rol !== "ijrochi") return NextResponse.json({ xato: "Hisobotni faqat ijrochi yuboradi" }, { status: 403 })

  let topshiriq = ""
  let matn = ""
  try {
    const body = (await request.json()) as { topshiriq?: unknown; matn?: unknown }
    topshiriq = typeof body.topshiriq === "string" ? body.topshiriq : ""
    matn = typeof body.matn === "string" ? body.matn.trim() : ""
  } catch {
    return NextResponse.json({ xato: "Ma'lumot o'qilmadi" }, { status: 400 })
  }

  const own = (await tasksFor(user)).some((row) => row.raqam === topshiriq)
  if (!own) return NextResponse.json({ xato: "Bu topshiriq sizga biriktirilmagan" }, { status: 403 })
  if (matn.length < 5) return NextResponse.json({ xato: "Hisobot matni juda qisqa" }, { status: 400 })

  const row = submitReport(user.tashkilot ?? "", topshiriq, matn.slice(0, 300))
  return NextResponse.json(row)
}
