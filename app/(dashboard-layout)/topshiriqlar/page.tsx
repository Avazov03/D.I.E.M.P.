import type { Metadata } from "next"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { taskColumns, taskFilters, visibleTasks } from "@/lib/diemp/sample"

export const metadata: Metadata = { title: "Topshiriqlar" }

export default function Page() {
  return (
    <Suspense>
      <Registry
        title="Topshiriqlar"
        description="Jismoniy va moliyaviy foiz alohida. Maxfiy bandlar bu seansda ko'rsatilmaydi."
        columns={taskColumns}
        rows={visibleTasks()}
        filters={taskFilters}
        filename="diemp-topshiriqlar.csv"
      />
    </Suspense>
  )
}
