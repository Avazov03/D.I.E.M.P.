import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { tasksFor } from "@/lib/diemp/scope"
import { taskColumns, taskFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Topshiriqlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  return (
    <Suspense>
      <Registry
        title="Topshiriqlar"
        description="Jismoniy va moliyaviy foiz alohida. Ro'yxat shu rol ko'ra oladigan bandlar bilan cheklangan."
        columns={taskColumns}
        rows={await tasksFor(user)}
        filters={taskFilters}
        filename="diemp-topshiriqlar.csv"
      />
    </Suspense>
  )
}
