import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { kpiColumns, kpiFilters, kpis } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "KPI" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="KPI"
        description="Formula tasdiqlanmagan yoki reja nol bo'lsa, tizim rasmiy foiz chiqarmaydi."
        columns={kpiColumns}
        rows={kpis}
        filters={kpiFilters}
        filename="diemp-kpi.csv"
      />
    </Suspense>
  )
}
