import type { User } from "@/lib/diemp/access"
import { storedEvidence, storedTasks } from "@/lib/diemp/db"
import type { DataRow } from "@/lib/diemp/sample"
import { organName } from "@/lib/diemp/ttb"

export const taskColumns = [
  { key: "raqam", label: "Topshiriq" },
  { key: "matn", label: "Matn" },
  { key: "organ", label: "Kimda" },
  { key: "muddat", label: "Muddat" },
  { key: "dalil", label: "Dalil", kind: "status" as const },
  { key: "ai", label: "AI" },
  { key: "holat", label: "Holat", kind: "status" as const },
]

export function canBringProof(user: User, organ: string) {
  if (user.rol === "super_admin") return true
  return user.rol === "koordinator" && user.tashkilot === organ
}

export async function taskRows(user: User, onlyReview = false) {
  const proofs = await storedEvidence()
  let tasks = await storedTasks()
  if (user.rol === "koordinator" && user.tashkilot) tasks = tasks.filter((row) => row.tashkilot === user.tashkilot)
  if (user.rol === "ijrochi") tasks = tasks.filter((row) => user.topshiriqlar.includes(row.raqam))
  const rows: DataRow[] = tasks.map((task) => {
    const proof = proofs.find((item) => item.topshiriq === task.raqam)
    return {
      raqam: task.raqam,
      matn: task.matn,
      organ: organName(task.tashkilot),
      muddat: task.muddat || "—",
      dalil: proof?.holat || "yoq",
      ai: proof?.izoh || "—",
      holat: task.holat || "ijroda",
      havola: `/topshiriqlar/${encodeURIComponent(task.raqam)}`,
    }
  })
  if (!onlyReview) return rows
  return rows.filter((row) => row.dalil === "tekshiruvda")
}
