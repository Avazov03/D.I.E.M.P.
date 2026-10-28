import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { decisionsFor } from "@/lib/diemp/scope"
import { decisionColumns, decisionFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Qarorlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Qarorlar"
        description="Hujjat reyestri. Maxfiy yozuv faqat ruxsatli rolda ko'rinadi va eksportga kirmaydi."
        columns={decisionColumns}
        rows={decisionsFor(user)}
        filters={decisionFilters}
        filename="diemp-qarorlar.csv"
      />
    </Suspense>
  )
}
