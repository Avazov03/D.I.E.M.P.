import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { decisionColumns, decisionFilters, decisions } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "Qarorlar" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Qarorlar"
        description="Hujjat reyestri. Maxfiy yozuv ro'yxatda belgilanadi, eksportga kirmaydi."
        columns={decisionColumns}
        rows={decisions}
        filters={decisionFilters}
        filename="diemp-qarorlar.csv"
      />
    </Suspense>
  )
}
