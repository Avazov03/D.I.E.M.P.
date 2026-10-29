"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ProofUpload({ raqam }: { raqam: string }) {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setNote("")
    try {
      const response = await fetch(`/api/topshiriq/${encodeURIComponent(raqam)}/dalil`, {
        method: "POST",
        body: new FormData(event.currentTarget),
      })
      const data = (await response.json()) as { xato?: string }
      if (!response.ok) {
        setNote(data.xato || "Yuklanmadi")
        return
      }
      window.location.reload()
    } catch {
      setNote("Yuklanmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => void submit(event)}>
      <p className="text-sm text-muted-foreground">Bajarilganlik faylini shu topshiriqqa bog'lang. PDF, Word (.doc va .docx) yoki rasm.</p>
      <Input name="fayl" type="file" accept=".pdf,.doc,.docx,.rtf,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf" required />
      {note ? <p className="text-sm text-[#ec003f]">{note}</p> : null}
      <div>
        <Button type="submit" disabled={loading}>{loading ? "Yuklanmoqda" : "Dalilni yuklash"}</Button>
      </div>
    </form>
  )
}
