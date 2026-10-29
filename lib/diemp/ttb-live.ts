import { cache } from "react"
import { canOpen, type User } from "@/lib/diemp/access"
import { readAssessmentJson } from "@/lib/diemp/db"
import { assessments, documentByNumber, namunaOchilgan, type Assessment, type AssessmentStatus } from "@/lib/diemp/ttb"

const statuses = new Set<AssessmentStatus>(["qoralama", "tekshiruvda", "qaytarilgan", "tasdiqlangan", "monitoring"])

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

export function applySaved(base: Assessment, saved: unknown): Assessment {
  if (!saved || typeof saved !== "object") return base
  const row = saved as Partial<Assessment>
  const holat = statuses.has(row.holat as AssessmentStatus) ? (row.holat as AssessmentStatus) : base.holat
  return {
    ...base,
    holat,
    muammo: text(row.muammo),
    maqsad: text(row.maqsad),
    muqobil: text(row.muqobil),
    tadbirkor: text(row.tadbirkor),
    fuqaro: text(row.fuqaro),
    davlat: text(row.davlat),
    xarajat: numberText(row.xarajat),
    foyda: numberText(row.foyda),
    yuk: numberText(row.yuk),
    xarajatTasdiq: flag(row.xarajatTasdiq),
    foydaTasdiq: flag(row.foydaTasdiq),
    yukTasdiq: flag(row.yukTasdiq),
    reja: numberText(row.reja),
    haqiqiy: numberText(row.haqiqiy),
    rejaTasdiq: flag(row.rejaTasdiq),
    haqiqiyTasdiq: flag(row.haqiqiyTasdiq),
    yangilangan: text(row.yangilangan, 20) || base.yangilangan,
  }
}

export const loadAssessments = cache(async () => {
  if (!namunaOchilgan()) return []
  const saved = await readAssessmentJson()
  const map = new Map<string, unknown>()
  for (const row of saved) {
    try {
      map.set(row.id, JSON.parse(row.json) as unknown)
    } catch {
      // buzilgan qator namuna holatda qoladi
    }
  }
  return assessments.map((row) => (map.has(row.id) ? applySaved(row, map.get(row.id)) : row))
})

export async function assessmentFor(user: User, id: string) {
  if (!canOpen(user.rol, "/baholash")) return { ok: false as const, status: 403 }
  const row = (await loadAssessments()).find((item) => item.id === id)
  const document = row ? documentByNumber(row.hujjat) : null
  if (!row || !document || document.maxfiylik === "maxfiy") return { ok: false as const, status: 404 }
  if (user.rol === "ijrochi" && !user.topshiriqlar.includes(row.id)) return { ok: false as const, status: 403 }
  if (user.rol === "koordinator" && user.tashkilot && row.organ !== user.tashkilot) return { ok: false as const, status: 403 }
  return { ok: true as const, row, document }
}
