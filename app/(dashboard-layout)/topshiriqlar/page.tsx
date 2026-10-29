import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Registry } from "@/app/components/diemp/registry"
import { taskColumns, taskRows } from "@/lib/diemp/task-rows"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Topshiriqlar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const mine = user.rol === "koordinator"
  return (
    <Suspense>
      <Registry
        title="Topshiriqlar"
        description={mine
          ? "Siz kiritgan va sizga tushgan topshiriq. Qatorni ochib, bajarilganlik faylini yuklang."
          : "Har bir topshiriq, kimda ekani, dalil va ekspert qarori. Qatorni oching."}
        columns={taskColumns}
        rows={await taskRows(user)}
        filters={[]}
        filename="topshiriqlar.csv"
      />
    </Suspense>
  )
}
