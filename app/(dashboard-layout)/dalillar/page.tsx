import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { evidenceFor } from "@/lib/diemp/scope"
import { evidenceColumns, evidenceFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Dalillar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Dalillar"
        description="Fayl mavjudligi mazmun to'g'riligini isbotlamaydi. Ro'yxat shu rol topshiriqlari bilan cheklangan."
        columns={evidenceColumns}
        rows={evidenceFor(user)}
        filters={evidenceFilters}
        filename="diemp-dalillar.csv"
      />
    </Suspense>
  )
}
