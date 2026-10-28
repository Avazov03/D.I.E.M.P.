import { decisions, evidence, kpis, reports, risks, visibleTasks, type DataRow } from "@/lib/diemp/sample"
import { extraReports } from "@/lib/diemp/inbox"
import type { Role, User } from "@/lib/diemp/access"

function wide(rol: Role) {
  return rol === "super_admin" || rol === "rahbariyat" || rol === "nazorat" || rol === "tahlilchi"
}

export function tasksFor(user: User) {
  const open = visibleTasks()
  if (user.rol === "koordinator" && user.tashkilot) return open.filter((row) => row.tashkilot === user.tashkilot)
  if (user.rol === "ijrochi") return open.filter((row) => user.topshiriqlar.includes(row.raqam))
  return open
}

export function reportsFor(user: User) {
  const rows = [...reports, ...extraReports()]
  if (wide(user.rol)) return rows
  if (user.rol === "koordinator" && user.tashkilot) return rows.filter((row) => row.tashkilot === user.tashkilot)
  const ids = new Set(tasksFor(user).map((row) => row.raqam))
  return rows.filter((row) => ids.has(row.topshiriq))
}

export function evidenceFor(user: User) {
  const open = evidence.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return open
  const ids = new Set(tasksFor(user).map((row) => row.raqam))
  return open.filter((row) => ids.has(row.topshiriq))
}

export function risksFor(user: User) {
  const open = risks.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return open
  const ids = new Set(tasksFor(user).map((row) => row.raqam))
  return open.filter((row) => ids.has(row.topshiriq))
}

export function decisionsFor(user: User) {
  if (user.rol === "super_admin" || user.rol === "rahbariyat") return decisions
  const open = decisions.filter((row) => row.maxfiylik !== "maxfiy")
  if (wide(user.rol)) return open
  const ids = new Set(tasksFor(user).map((row) => row.qaror))
  return open.filter((row) => ids.has(row.raqam))
}

export function kpisFor(user: User): DataRow[] {
  if (user.rol === "ijrochi" || user.rol === "koordinator") return []
  return kpis
}
