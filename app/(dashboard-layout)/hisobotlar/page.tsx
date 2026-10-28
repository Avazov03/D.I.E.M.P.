import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { reportColumns, reportFilters, reports } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "Hisobotlar" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Hisobotlar"
        description="Faqat tasdiqlangan hisobot rasmiy ko'rsatkichga kiradi. Qaytarilgan yozuv tuzatishni kutadi."
        columns={reportColumns}
        rows={reports}
        filters={reportFilters}
        filename="diemp-hisobotlar.csv"
      />
    </Suspense>
  )
}
