import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { AssessmentForm } from "@/app/components/diemp/assessment-form"
import { canConfirmAssessment, canEditAssessment } from "@/lib/diemp/access"
import { documentByNumber } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = { title: "Baholash varaqasi" }

async function Board({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const { id } = await params
  const assessment = (await loadAssessments()).find((row) => row.id === id) ?? null
  if (!assessment) notFound()
  if (user.rol === "ijrochi" && !user.topshiriqlar.includes(assessment.id)) notFound()
  if (user.rol === "koordinator" && user.tashkilot && assessment.organ !== user.tashkilot) notFound()
  const document = documentByNumber(assessment.hujjat)
  if (!document || document.maxfiylik === "maxfiy") notFound()
  return (
    <AssessmentForm
      assessment={assessment}
      document={document}
      canEdit={canEditAssessment(user.rol)}
      canConfirm={canConfirmAssessment(user.rol)}
    />
  )
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Varaqa yuklanmoqda...</p>}>
      <Board params={params} />
    </Suspense>
  )
}
