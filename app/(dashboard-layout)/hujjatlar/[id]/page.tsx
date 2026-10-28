import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { DocumentReview } from "@/app/components/diemp/document-review"
import { canUpload } from "@/lib/diemp/access"
import { documentById } from "@/lib/diemp/db"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Hujjat" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  if (!canUpload(user.rol)) redirect("/")
  const { id } = await params
  const row = documentById(id)
  if (!row) notFound()
  return (
    <DocumentReview
      id={row.id}
      nom={row.nom}
      tur={row.tur}
      matn={row.matn}
      holat={row.holat}
      cheklov={row.cheklov}
      draft={row.ajratma}
    />
  )
}
