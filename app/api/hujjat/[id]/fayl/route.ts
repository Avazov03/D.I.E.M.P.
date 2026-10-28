import { readFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { canUpload } from "@/lib/diemp/access"
import { dataDir, documentById } from "@/lib/diemp/db"
import { currentUser } from "@/lib/diemp/session"

const idPattern = /^[A-Za-z0-9-]{3,80}$/

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  if (!canUpload(user.rol)) return NextResponse.json({ xato: "Hujjat bu rolga yopiq" }, { status: 403 })
  const { id } = await context.params
  if (!idPattern.test(id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const row = await documentById(id)
  if (!row) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })

  const root = path.resolve(dataDir())
  const file = path.resolve(row.fayl)
  if (!file.startsWith(root + path.sep)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const bytes = readFileSync(file)
  const type = row.tur === "pdf"
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${row.tur === "pdf" ? "hujjat.pdf" : "hujjat.docx"}"`,
    },
  })
}
