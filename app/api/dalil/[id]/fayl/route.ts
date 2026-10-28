import { readFileSync } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { evidenceById, dataDir } from "@/lib/diemp/db"
import { evidenceFilesFor } from "@/lib/diemp/scope"
import { currentUser } from "@/lib/diemp/session"

const idPattern = /^[a-z0-9-]{3,40}$/

const mime: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  const { id } = await context.params
  if (!idPattern.test(id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const allowed = await evidenceFilesFor(user)
  if (!allowed.some((row) => row.id === id)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const row = await evidenceById(id)
  if (!row) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  const root = path.resolve(dataDir())
  const file = path.resolve(row.fayl)
  if (!file.startsWith(root + path.sep)) return NextResponse.json({ xato: "Topilmadi" }, { status: 404 })
  return new NextResponse(new Uint8Array(readFileSync(file)), {
    headers: {
      "Content-Type": mime[row.tur] ?? "application/octet-stream",
      "Content-Disposition": "inline",
    },
  })
}
