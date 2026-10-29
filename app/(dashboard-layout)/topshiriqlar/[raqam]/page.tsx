import type { Metadata } from "next"
import Link from "next/link"
import { readFileSync } from "node:fs"
import path from "node:path"
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { EvidenceCheck } from "@/app/components/diemp/evidence-check"
import { ProofUpload } from "@/app/components/diemp/proof-upload"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { canCheckEvidence, canJudgeEvidence } from "@/lib/diemp/access"
import { dataDir, documentOwners, storedEvidence, storedTasks } from "@/lib/diemp/db"
import { readDocument } from "@/lib/diemp/read-file"
import { currentUser } from "@/lib/diemp/session"
import { canBringProof } from "@/lib/diemp/task-rows"
import { organName } from "@/lib/diemp/ttb"

export const metadata: Metadata = { title: "Topshiriq" }

async function Board({ params }: { params: Promise<{ raqam: string }> }) {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const { raqam } = await params
  const task = (await storedTasks()).find((item) => item.raqam === raqam)
  if (!task) notFound()
  const owns = (await documentOwners()).get(task.hujjat) === user.id
  if (user.rol === "koordinator" && user.tashkilot !== task.tashkilot && !owns) notFound()
  const proof = (await storedEvidence()).find((item) => item.topshiriq === task.raqam)
  const image = proof?.tur === "jpg" || proof?.tur === "jpeg" || proof?.tur === "png"
  let proofText = ""
  if (proof && (proof.tur === "pdf" || proof.tur === "docx" || proof.tur === "doc")) {
    const root = path.resolve(dataDir())
    const file = path.resolve(proof.fayl)
    if (file.startsWith(root + path.sep)) {
      try {
        proofText = await readDocument(proof.tur === "pdf" ? "pdf" : proof.tur === "doc" ? "doc" : "docx", readFileSync(file))
      } catch {
        proofText = ""
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl">{task.raqam}</h2>
          <p className="text-sm text-muted-foreground">{organName(task.tashkilot)} · muddat {task.muddat || "—"}</p>
        </div>
        <StatusPill code={task.holat || "ijroda"} field="holat" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-border p-4">
          <h3 className="mb-3 text-sm font-medium">Topshiriq</h3>
          <p className="whitespace-pre-wrap text-sm">{task.matn}</p>
        </section>
        <section className="flex flex-col gap-3 border border-border p-4">
          <h3 className="text-sm font-medium">Bajarilganlik dalili</h3>
          {proof ? (
            <>
              <StatusPill code={proof.holat} field="holat" />
              {image ? <img src={`/api/dalil/${proof.id}/fayl`} alt={proof.nom} className="w-full border border-border" /> : null}
              {proofText ? <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-sm">{proofText}</pre> : null}
              <a className="text-sm underline underline-offset-4" href={`/api/dalil/${proof.id}/fayl`} target="_blank" rel="noreferrer">Faylni ochish</a>
              <p className="text-sm">AI: {proof.izoh || "—"}</p>
              <p className="text-xs text-muted-foreground">AI xulosasi rasmiy tasdiq emas. Qarorni ekspert qo'yadi.</p>
              <EvidenceCheck id={proof.id} canCheck={canCheckEvidence(user.rol)} canJudge={canJudgeEvidence(user.rol)} />
            </>
          ) : canBringProof(user, task.tashkilot, owns) ? <ProofUpload raqam={task.raqam} /> : <p className="text-sm text-muted-foreground">Dalil hali yuklanmagan. Uni topshiriq tushgan organ beradi.</p>}
          {proof && canBringProof(user, task.tashkilot, owns) ? <ProofUpload raqam={task.raqam} /> : null}
        </section>
      </div>
      <Link className="text-sm underline underline-offset-4" href="/topshiriqlar">Topshiriqlar</Link>
    </div>
  )
}

export default function Page({ params }: { params: Promise<{ raqam: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Topshiriq yuklanmoqda...</p>}>
      <Board params={params} />
    </Suspense>
  )
}
