import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { evidence, evidenceColumns, evidenceFilters } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "Dalillar" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Dalillar"
        description="Fayl mavjudligi mazmun to'g'riligini isbotlamaydi. Xesh yaxlitlik uchun saqlanadi."
        columns={evidenceColumns}
        rows={evidence}
        filters={evidenceFilters}
        filename="diemp-dalillar.csv"
      />
    </Suspense>
  )
}
