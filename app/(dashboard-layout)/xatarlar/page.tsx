import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { riskColumns, riskFilters, risks } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "Xatarlar" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Xatarlar"
        description="Hozircha qoidaviy xatarlar. Tarix yetarli bo'lmaganda bu ogohlantirish prognozdek ko'rsatilmaydi."
        columns={riskColumns}
        rows={risks.filter((row) => row.maxfiylik !== "maxfiy")}
        filters={riskFilters}
        filename="diemp-xatarlar.csv"
      />
    </Suspense>
  )
}
