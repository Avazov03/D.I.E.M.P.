import { NextResponse } from "next/server"
import { canAskAi } from "@/lib/diemp/access"
import { askAnalyst } from "@/lib/diemp/gemini"
import { currentUser } from "@/lib/diemp/session"

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canAskAi(user.rol)) return NextResponse.json({ xato: "Bu rol AI tahlilni ko'rmaydi" }, { status: 403 })

  let question = ""
  try {
    const body = (await request.json()) as { savol?: unknown }
    question = typeof body.savol === "string" ? body.savol.trim() : ""
  } catch {
    return NextResponse.json({ xato: "Savol o'qilmadi" }, { status: 400 })
  }

  if (question.length < 3) return NextResponse.json({ xato: "Savol juda qisqa" }, { status: 400 })
  if (question.length > 1000) return NextResponse.json({ xato: "Savol juda uzun" }, { status: 400 })

  try {
    const answer = await askAnalyst(question)
    return NextResponse.json(answer)
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI xizmati javob bermadi"
    const known = ["Kalit sozlanmagan", "Kalit qabul qilinmadi", "AI javobi o'qilmadi", "AI javobi bo'sh", "AI modeli topilmadi", "AI hozir javob chegarasida. Birozdan keyin qayta bosing."]
    return NextResponse.json(
      { xato: known.includes(message) ? message : "AI xizmati javob bermadi. Rasmiy ko'rsatkichlar o'z holicha ishlaydi." },
      { status: 502 }
    )
  }
}
