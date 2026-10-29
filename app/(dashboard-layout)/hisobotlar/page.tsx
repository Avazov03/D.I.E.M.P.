import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { methodologyNote, reportColumns, reportFilters, reportRows } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Hisobotlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const saved = await loadAssessments()
  let rows = reportRows(saved)
  if (user.rol === "ijrochi") rows = rows.filter((row) => user.topshiriqlar.includes(row.fayl))
  if (user.rol === "koordinator" && user.tashkilot) rows = rows.filter((row) => row.organ === user.tashkilot)
  return (
    <Suspense>
      <Registry
        title="Elektron hisobotlar"
        description={`Word va PDF namuna hisobot sifatida yuklanadi. Tasdiqlangan idoraviy blanka kelgach shu shakl almashtiriladi. ${methodologyNote}`}
        columns={reportColumns}
        rows={rows}
        filters={reportFilters}
        filename="ttb-hisobotlar.csv"
      />
    </Suspense>
  )
}
