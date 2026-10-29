import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { documentColumns, documentFilters, documentRows, methodologyNote } from "@/lib/diemp/ttb"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Reyestr" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
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
  )
}
