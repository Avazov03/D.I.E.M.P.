import { NextResponse } from "next/server"
import { currentUser } from "@/lib/diemp/session"
import { reportDocx, reportLines, reportPdf } from "@/lib/diemp/report-file"
import { assessmentFor } from "@/lib/diemp/ttb-live"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  const { id } = await context.params
  const found = await assessmentFor(user, id)
  if (!found.ok) return NextResponse.json({ xato: found.status === 403 ? "Bu hisobot sizga ochiq emas" : "Hisobot topilmadi" }, { status: found.status })

  const tur = new URL(request.url).searchParams.get("tur")
  if (tur !== "docx" && tur !== "pdf") return NextResponse.json({ xato: "Format noto'g'ri" }, { status: 400 })
  const lines = reportLines(found.row, found.document)
  const bytes = tur === "docx" ? reportDocx(lines) : reportPdf(lines)
  const type = tur === "docx"
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/pdf"
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${found.row.id}-namuna.${tur}"`,
    },
  })
}
