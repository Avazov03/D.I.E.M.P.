import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { methodologyNote, reportColumns, reportFilters, reportRows } from "@/lib/diemp/ttb"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Hisobotlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Elektron hisobotlar"
        description={`Word va PDF shakllari tasdiqlangan uslubiyotdan olinadi. Hozircha namuna holat. ${methodologyNote}`}
        columns={reportColumns}
        rows={reportRows()}
        filters={reportFilters}
        filename="ttb-hisobotlar.csv"
      />
    </Suspense>
  )
}
