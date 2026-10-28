"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DocumentUpload() {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  async function send(file: File) {
    setLoading(true)
    setNote("Matn o'qilmoqda")
    const body = new FormData()
    body.set("fayl", file)
    try {
      const response = await fetch("/api/hujjat", { method: "POST", body })
      const data = (await response.json()) as { id?: string; xato?: string }
      if (!response.ok || !data.id) {
        setNote(data.xato || "Yuklanmadi")
        return
      }
      window.location.href = `/hujjatlar/${data.id}`
    } catch {
      setNote("Yuklanmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-3 border border-border p-4"
      onSubmit={(event) => {
        event.preventDefault()
        const input = event.currentTarget.elements.namedItem("fayl")
        const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined
        if (file) void send(file)
      }}
    >
      <p className="text-sm text-muted-foreground">PDF yoki Word. AI ajratmasi tasdiqlanmaguncha topshiriq hisoblanmaydi. Skaner rasm hozircha o'qilmaydi.</p>
      <Input name="fayl" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground">{note}</p>
        <Button type="submit" disabled={loading}>{loading ? "Yuklanmoqda" : "Hujjatni yuklash"}</Button>
      </div>
    </form>
  )
}
