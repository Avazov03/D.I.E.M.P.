import { NextResponse } from "next/server"
import { askAnalyst } from "@/lib/diemp/gemini"

export async function POST(request: Request) {
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
    const known = ["Kalit sozlanmagan", "Kalit qabul qilinmadi", "AI javobi o'qilmadi", "AI javobi bo'sh", "AI modeli topilmadi"]
    return NextResponse.json(
      { xato: known.includes(message) ? message : "AI xizmati javob bermadi. Rasmiy ko'rsatkichlar o'z holicha ishlaydi." },
      { status: 502 }
    )
  }
}
