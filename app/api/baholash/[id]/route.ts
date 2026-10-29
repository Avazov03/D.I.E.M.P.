import { NextResponse } from "next/server"
import { canConfirmAssessment, canEditAssessment } from "@/lib/diemp/access"
import { currentUser } from "@/lib/diemp/session"
import { writeAssessmentJson } from "@/lib/diemp/db"
import { assessmentGaps, type Assessment, type AssessmentStatus } from "@/lib/diemp/ttb"
import { assessmentFor } from "@/lib/diemp/ttb-live"

function text(value: unknown, limit = 2000) {
  return typeof value === "string" ? value.trim().slice(0, limit) : ""
}

function flag(value: unknown): "ha" | "yoq" {
  return value === "ha" ? "ha" : "yoq"
}

function numberText(value: unknown) {
  const raw = text(value, 20)
  return /^\d+(\.\d+)?$/.test(raw) ? raw : ""
}

function today() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date()).replace(/\//g, ".")
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  const { id } = await context.params
  const found = await assessmentFor(user, id)
  if (!found.ok) return NextResponse.json({ xato: found.status === 403 ? "Bu baholash sizga ochiq emas" : "Baholash topilmadi" }, { status: found.status })

  let body: Partial<Assessment>
  try {
    body = (await request.json()) as Partial<Assessment>
  } catch {
    return NextResponse.json({ xato: "Varaqa o'qilmadi" }, { status: 400 })
  }

  const holat = body.holat
  if (holat !== "qoralama" && holat !== "qaytarilgan" && holat !== "tasdiqlangan") {
    return NextResponse.json({ xato: "Holat noto'g'ri" }, { status: 400 })
  }
  if (holat === "qoralama" && !canEditAssessment(user.rol)) return NextResponse.json({ xato: "Qoralama saqlash bu rolga yopiq" }, { status: 403 })
  if (holat !== "qoralama" && !canConfirmAssessment(user.rol)) return NextResponse.json({ xato: "Tasdiqlash bu rolga yopiq" }, { status: 403 })

  const edit = canEditAssessment(user.rol)
  const confirm = canConfirmAssessment(user.rol)
  const next: Assessment = {
    ...found.row,
    holat: holat as AssessmentStatus,
    muammo: edit ? text(body.muammo) : found.row.muammo,
    maqsad: edit ? text(body.maqsad) : found.row.maqsad,
    muqobil: edit ? text(body.muqobil) : found.row.muqobil,
    tadbirkor: edit ? text(body.tadbirkor) : found.row.tadbirkor,
    fuqaro: edit ? text(body.fuqaro) : found.row.fuqaro,
    davlat: edit ? text(body.davlat) : found.row.davlat,
    xarajat: edit ? numberText(body.xarajat) : found.row.xarajat,
    foyda: edit ? numberText(body.foyda) : found.row.foyda,
    yuk: edit ? numberText(body.yuk) : found.row.yuk,
    reja: edit ? numberText(body.reja) : found.row.reja,
    haqiqiy: edit ? numberText(body.haqiqiy) : found.row.haqiqiy,
    xarajatTasdiq: confirm ? flag(body.xarajatTasdiq) : found.row.xarajatTasdiq,
    foydaTasdiq: confirm ? flag(body.foydaTasdiq) : found.row.foydaTasdiq,
    yukTasdiq: confirm ? flag(body.yukTasdiq) : found.row.yukTasdiq,
    rejaTasdiq: confirm ? flag(body.rejaTasdiq) : found.row.rejaTasdiq,
    haqiqiyTasdiq: confirm ? flag(body.haqiqiyTasdiq) : found.row.haqiqiyTasdiq,
    yangilangan: today(),
  }
  const gaps = assessmentGaps(next, holat)
  if (gaps.length) return NextResponse.json({ xato: `To'ldiring: ${gaps.join(", ")}` }, { status: 400 })

  await writeAssessmentJson(id, JSON.stringify(next))
  return NextResponse.json({ ok: true, baholash: next })
}
