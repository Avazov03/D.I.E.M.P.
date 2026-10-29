import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { methodologyNote, monitoringColumns, monitoringFilters, monitoringRows } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Monitoring" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Monitoring va natijadorlik"
        description={`Reja va haqiqiy ko'rsatkich alohida. Tasdiqlanmagan qiymat rasmiy foizga kirmaydi. ${methodologyNote}`}
        columns={monitoringColumns}
        rows={monitoringRows(await loadAssessments())}
        filters={monitoringFilters}
        filename="ttb-monitoring.csv"
      />
    </Suspense>
  )
}
