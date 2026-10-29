import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { documentColumns, documentFilters, documentRows, methodologyNote } from "@/lib/diemp/ttb"
import { StatSection } from "@/app/components/diemp/stat-section"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Reyestr" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <div className="flex flex-col gap-6">
    <StatSection user={user} decisionsOnly />
    <Suspense>
      <Registry
        title="Normativ-huquqiy hujjatlar reyestri"
        description={`Loyiha va qabul qilingan hujjatlar. Raqamni bosing, eski va yangi matn yonma-yon chiqadi. ${methodologyNote}`}
        columns={documentColumns}
        rows={documentRows()}
        filters={documentFilters}
        filename="ttb-reyestr.csv"
      />
    </Suspense>
    </div>
  )
}
