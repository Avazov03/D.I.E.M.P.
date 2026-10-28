import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Registry } from "@/app/components/diemp/registry"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { evidenceFilesFor, evidenceFor } from "@/lib/diemp/scope"
import { evidenceColumns, evidenceFilters } from "@/lib/diemp/sample"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Dalillar" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const files = await evidenceFilesFor(user)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl">Faylli dalillar</h2>
        <p className="text-sm text-muted-foreground">Rasm ochiladi. AI rasmni ko'rib topshiriqqa mosligini aytadi. Rasmiy holatni nazorat mas'uli qo'yadi.</p>
      </div>
      <div className="flex flex-col border border-border">
        {files.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Bu rolda ochiladigan faylli dalil yo'q.</p> : null}
        {files.map((row) => (
          <Link key={row.id} href={`/dalillar/${row.id}`} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/40">
            <span>{row.nom}. {row.topshiriq}</span>
            <StatusPill code={row.holat} field="holat" />
          </Link>
        ))}
      </div>
    <Suspense>
      <Registry
        title="Dalillar"
        description="Pastdagi qatorlar namuna yozuv. Fayli yo'q. Ochiladigan dalillar yuqorida."
        columns={evidenceColumns}
        rows={await evidenceFor(user)}
        filters={evidenceFilters}
        filename="diemp-dalillar.csv"
      />
    </Suspense>
    </div>
  )
}
