import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { risksFor } from "@/lib/diemp/scope"
import { riskColumns, riskFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Xatarlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Xatarlar"
        description="Hozircha qoidaviy xatarlar. Tarix yetarli bo'lmaganda bu ogohlantirish prognozdek ko'rsatilmaydi."
        columns={riskColumns}
        rows={await risksFor(user)}
        filters={riskFilters}
        filename="diemp-xatarlar.csv"
      />
    </Suspense>
  )
}
