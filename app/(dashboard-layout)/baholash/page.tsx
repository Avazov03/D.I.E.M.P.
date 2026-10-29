import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { assessmentColumns, assessmentFilters, assessmentRows, methodologyNote, visibleAssessments } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Baholash" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const saved = await loadAssessments()
  const listed = assessmentRows(saved)
  const rows = user.rol === "ijrochi"
    ? listed.filter((row) => user.topshiriqlar.includes(row.raqam))
    : user.rol === "koordinator" && user.tashkilot
      ? listed.filter((row) => row.organ === user.tashkilot)
      : listed
  const links = visibleAssessments(saved)
    .filter((row) => rows.some((item) => item.raqam === row.id))
    .slice(0, 8)
  return (
    <div className="flex flex-col gap-4">
      <Suspense>
        <Registry
          title="Tartibga solish ta'sirini baholash"
          description={`Dastlabki yoki keyingi baholash. Sof ta'sir va yuk faqat tasdiqlangan raqamdan hisoblanadi. ${methodologyNote}`}
          columns={assessmentColumns}
          rows={rows}
          filters={assessmentFilters}
          filename="ttb-baholash.csv"
        />
      </Suspense>
      <div className="flex flex-col border border-border">
        <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">Varaqani ochish</p>
        {links.map((row) => (
          <Link key={row.id} href={`/baholash/${row.id}`} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/40">
            <span>{row.id}. {row.hujjat}</span>
            <span className="text-muted-foreground">{row.turi === "dastlabki" ? "Dastlabki" : "Keyingi"}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
