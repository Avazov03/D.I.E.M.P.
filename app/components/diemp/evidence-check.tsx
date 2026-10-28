"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Result = { nimaKorindi: string; moslik: string; sabab: string; cheklov: string }

const matchLabel: Record<string, string> = {
  mos: "Mos",
  mos_emas: "Mos emas",
  aniqlanmagan: "Aniqlanmagan",
}

export function EvidenceCheck({ id, canCheck, canJudge }: { id: string; canCheck: boolean; canJudge: boolean }) {
  const [result, setResult] = useState<Result | null>(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  async function check() {
    setLoading(true)
    setNote("")
    try {
      const response = await fetch(`/api/dalil/${id}/tekshir`, { method: "POST" })
      const data = (await response.json()) as Result & { xato?: string }
      if (!response.ok) {
        setNote(data.xato || "Tekshiruv olinmadi")
        return
      }
      setResult(data)
    } catch {
      setNote("Tekshiruv olinmadi")
    } finally {
      setLoading(false)
    }
  }

  async function judge(holat: string) {
    setNote("")
    const response = await fetch(`/api/dalil/${id}/tekshir`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holat }),
    })
    const data = (await response.json()) as { xato?: string }
    if (!response.ok) {
      setNote(data.xato || "Holat saqlanmadi")
      return
    }
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-3">
      {canCheck ? <Button type="button" disabled={loading} onClick={() => void check()}>{loading ? "Rasm ko'rilmoqda" : "AI rasmni tekshirsin"}</Button> : null}
      {result ? (
        <div className="border border-border p-3 text-sm">
          <p>Ko'rindi: {result.nimaKorindi}</p>
          <p>Moslik: {matchLabel[result.moslik] ?? result.moslik}</p>
          <p>Sabab: {result.sabab}</p>
          <p className="text-muted-foreground">{result.cheklov}</p>
        </div>
      ) : null}
      {canJudge ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => void judge("tasdiqlangan")}>Dalil mos</Button>
          <Button type="button" variant="secondary" onClick={() => void judge("yetishmaydi")}>Dalil mos emas</Button>
        </div>
      ) : null}
      {note ? <p className="text-sm text-foreground">{note}</p> : null}
    </div>
  )
}
