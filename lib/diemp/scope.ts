import { decisions, evidence, kpis, reports, risks, visibleTasks, type DataRow } from "@/lib/diemp/sample"
import { extraReports } from "@/lib/diemp/inbox"
import { storedDecisions, storedTasks } from "@/lib/diemp/db"
import type { Role, User } from "@/lib/diemp/access"

async function uploadedTasks(): Promise<DataRow[]> {
  return (await storedTasks()).map((row) => ({
    raqam: row.raqam,
    qaror: row.qaror,
    matn: row.matn,
    tashkilot: row.tashkilot,
    muddat: row.muddat || "—",
    holat: "ijroda",
    muddatKod: "yaqin",
    xatar: "yoq",
    jismoniy: "—",
    jismoniyTasdiq: "yoq",
    moliyaviy: "—",
    moliyaviyTasdiq: "yoq",
    manba: "Hujjat",
  }))
}

async function uploadedDecisions(): Promise<DataRow[]> {
  return (await storedDecisions()).map((row) => ({
    raqam: row.raqam,
    turi: "qaror",
    nomi: row.nomi,
    sana: row.sana || "—",
    maxfiylik: "ichki",
    holat: "ijroda",
    topshiriq: String(row.topshiriq),
  }))
}

function wide(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat" || rol === "tahlilchi"
}

export async function tasksFor(user: User) {
  const open: DataRow[] = [
    ...visibleTasks().map((row): DataRow => ({ ...row, manba: row.manba || "Namuna" })),
    ...(await uploadedTasks()),
  ]
  if (user.rol === "koordinator" && user.tashkilot) return open.filter((row) => row.tashkilot === user.tashkilot)
  if (user.rol === "ijrochi") return open.filter((row) => user.topshiriqlar.includes(row.raqam))
  return open
}

export async function reportsFor(user: User) {
  const rows = [...reports, ...extraReports()]
  if (wide(user.rol)) return rows
  if (user.rol === "koordinator" && user.tashkilot) return rows.filter((row) => row.tashkilot === user.tashkilot)
  const ids = new Set((await tasksFor(user)).map((row) => row.raqam))
  return rows.filter((row) => ids.has(row.topshiriq))
}

export async function evidenceFor(user: User) {
  const open = evidence.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return open
  const ids = new Set((await tasksFor(user)).map((row) => row.raqam))
  return open.filter((row) => ids.has(row.topshiriq))
}

export async function risksFor(user: User) {
  const open = risks.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return open
  const ids = new Set((await tasksFor(user)).map((row) => row.raqam))
  return open.filter((row) => ids.has(row.topshiriq))
}

export async function decisionsFor(user: User) {
  const extra = await uploadedDecisions()
  if (user.rol === "super_admin" || user.rol === "rahbariyat") return [...decisions, ...extra]
  const open = decisions.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return [...open, ...extra]
  const ids = new Set((await tasksFor(user)).map((row) => row.qaror))
  return [...open.filter((row) => ids.has(row.raqam)), ...extra.filter((row) => ids.has(row.raqam))]
}

export function kpisFor(user: User): DataRow[] {
  if (user.rol === "ijrochi" || user.rol === "koordinator") return []
  return kpis
}
