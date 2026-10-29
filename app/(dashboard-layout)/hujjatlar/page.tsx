import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DocumentUpload } from "@/app/components/diemp/document-upload"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { canUpload } from "@/lib/diemp/access"
import { listDocuments } from "@/lib/diemp/db"
import { methodologyNote } from "@/lib/diemp/ttb"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Hujjat yuklash" }

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  if (!canUpload(user.rol)) redirect("/")
  const rows = await listDocuments()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Hujjatni tizimga kiritish</h2>
        <p className="text-sm text-muted-foreground">
          Loyiha yoki qabul qilingan hujjat PDF/Word sifatida yuklanadi. AI maydon ajratishi mumkin, tasdiq odamniki. {methodologyNote}
        </p>
      </div>
      <DocumentUpload />
      <div className="flex flex-col border border-border">
        {rows.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Hali hujjat yuklanmagan.</p> : null}
        {rows.map((row) => (
          <Link key={row.id} href={`/hujjatlar/${row.id}`} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/40">
            <span>{row.nom}</span>
            <span className="flex items-center gap-3">
              <span className="text-muted-foreground">{row.tur.toUpperCase()}</span>
              <StatusPill code={row.holat} field="holat" />
            </span>
          </Link>
        ))}
      </div>
      <Link href="/reyestr" className="text-sm underline underline-offset-4">Reyestrga o&apos;tish</Link>
    </div>
  )
}
