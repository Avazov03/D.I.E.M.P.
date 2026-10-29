import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { EvidenceCheck } from "@/app/components/diemp/evidence-check"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { canCheckEvidence, canJudgeEvidence, canUpload } from "@/lib/diemp/access"
import { storedTasks } from "@/lib/diemp/db"
import { evidenceFilesFor } from "@/lib/diemp/scope"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Dalil" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const { id } = await params
  const row = (await evidenceFilesFor(user)).find((item) => item.id === id)
  if (!row) notFound()
  const task = (await storedTasks()).find((item) => item.raqam === row.topshiriq)
  const image = row.tur === "jpg" || row.tur === "jpeg" || row.tur === "png"
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl">{row.nom}</h2>
          <p className="text-sm text-muted-foreground">{row.izoh}</p>
        </div>
        <StatusPill code={row.holat} field="holat" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-border p-4">
          <h3 className="mb-3 text-sm font-medium">Dalil fayli</h3>
          {image ? <img src={`/api/dalil/${row.id}/fayl`} alt={row.nom} className="w-full border border-border" /> : null}
          <a className="mt-3 inline-block text-sm underline underline-offset-4" href={`/api/dalil/${row.id}/fayl`} target="_blank" rel="noreferrer">Faylni ochish</a>
        </section>
        <section className="flex flex-col gap-3 border border-border p-4 text-sm">
          <h3 className="text-sm font-medium">Topshiriq</h3>
          <p>{task?.matn || row.topshiriq}</p>
          <p className="text-muted-foreground">{row.topshiriq}. Muddat {task?.muddat || "—"}.</p>
          {canUpload(user.rol) ? <Link className="underline underline-offset-4" href={`/hujjatlar/${row.hujjat}`}>Asl hujjat</Link> : null}
          <EvidenceCheck id={row.id} canCheck={canCheckEvidence(user.rol)} canJudge={canJudgeEvidence(user.rol)} />
        </section>
      </div>
      <Link className="text-sm underline underline-offset-4" href="/topshiriqlar">Topshiriqlar</Link>
    </div>
  )
}
