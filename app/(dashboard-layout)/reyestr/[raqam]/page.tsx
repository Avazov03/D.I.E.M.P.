import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { lineDiff } from "@/lib/diemp/diff"
import { canOpen } from "@/lib/diemp/access"
import { documentByNumber, organName } from "@/lib/diemp/ttb"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Versiyani solishtirish" }

async function Board({ params }: { params: Promise<{ raqam: string }> }) {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  if (!canOpen(user.rol, "/reyestr")) redirect("/")
  const { raqam } = await params
  const document = documentByNumber(raqam)
  if (!document || document.maxfiylik === "maxfiy") notFound()
  const diff = lineDiff(document.oldingi, document.matn)
  const changed = diff.filter((line) => line.tur !== "teng")

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">{document.raqam}. {document.nomi}</h2>
        <p className="text-sm text-muted-foreground">
          {organName(document.organ)} · namuna matn. {document.oldingiVersiya} va {document.versiya} yonma-yon.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-border p-4">
          <h3 className="text-sm font-medium">Versiya {document.oldingiVersiya}</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm">{document.oldingi}</p>
        </section>
        <section className="border border-border p-4">
          <h3 className="text-sm font-medium">Versiya {document.versiya}</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm">{document.matn}</p>
        </section>
      </div>
      <section className="border border-border p-4">
        <h3 className="text-sm font-medium">O&apos;zgarishlar</h3>
        {changed.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Matn o&apos;zgarmagan.</p> : (
          <ul className="mt-3 flex flex-col gap-2">
            {changed.map((line) => (
              <li key={`${line.tur}-${line.matn}`} className="text-sm">
                <span className="text-muted-foreground">{line.tur === "olindi" ? "Olib tashlangan" : "Qo'shilgan"}: </span>
                {line.matn}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Link href="/reyestr" className="text-sm underline underline-offset-4">Reyestr</Link>
    </div>
  )
}

export default function Page({ params }: { params: Promise<{ raqam: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Versiya yuklanmoqda...</p>}>
      <Board params={params} />
    </Suspense>
  )
}
