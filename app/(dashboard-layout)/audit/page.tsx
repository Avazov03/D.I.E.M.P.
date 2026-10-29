import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { audit, auditColumns } from "@/lib/diemp/sample"
import { namunaOchilgan } from "@/lib/diemp/ttb"

export const metadata: Metadata = { title: "Audit jurnali" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Audit jurnali"
        description="Muhim amallar qayd etiladi. Jurnal oddiy foydalanuvchi tomonidan tahrirlanmaydi."
        columns={auditColumns}
        rows={namunaOchilgan() ? audit : []}
        filters={[]}
        filename="diemp-audit.csv"
      />
    </Suspense>
  )
}
