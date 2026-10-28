import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { reportsFor } from "@/lib/diemp/scope"
import { reportColumns, reportFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Hisobotlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Hisobotlar"
        description="Faqat tasdiqlangan hisobot rasmiy ko'rsatkichga kiradi. Ro'yxat shu rol doirasida."
        columns={reportColumns}
        rows={reportsFor(user)}
        filters={reportFilters}
        filename="diemp-hisobotlar.csv"
      />
    </Suspense>
  )
}
