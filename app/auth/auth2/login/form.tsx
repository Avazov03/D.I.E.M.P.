"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { users, roleLabel } from "@/lib/diemp/access"

export function LoginForm() {
  const [pochta, setPochta] = useState("rahbar@diemp.uz")
  const [parol, setParol] = useState("namuna")
  const [xato, setXato] = useState("")
  const [loading, setLoading] = useState(false)

  async function enter(mail: string, password: string) {
    setLoading(true)
    setXato("")
    try {
      const response = await fetch("/api/kirish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pochta: mail, parol: password }),
      })
      const data = (await response.json()) as { xato?: string }
      if (!response.ok) {
        setXato(data.xato || "Kirib bo'lmadi")
        return
      }
      window.location.href = "/"
    } catch {
      setXato("Kirib bo'lmadi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="space-y-6 w-full"
      onSubmit={(event) => {
        event.preventDefault()
        void enter(pochta, parol)
      }}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-normal text-muted-foreground">Pochta*</Label>
          <Input id="email" type="email" value={pochta} onChange={(event) => setPochta(event.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-normal text-muted-foreground">Parol*</Label>
          <Input id="password" type="password" value={parol} onChange={(event) => setParol(event.target.value)} required />
        </div>
      </div>
      {xato ? <p className="text-sm text-[#ec003f]">{xato}</p> : null}
      <Button type="submit" size="lg" className="w-full rounded-lg" disabled={loading}>
        {loading ? "Kirilmoqda" : "Kabinetga kirish"}
      </Button>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Namuna parol: namuna. Rolni tanlang.</p>
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            className="flex items-center justify-between gap-3 border border-border px-3 py-2 text-left text-sm hover:bg-muted/40"
            onClick={() => {
              setPochta(user.pochta)
              setParol(user.parol)
              void enter(user.pochta, user.parol)
            }}
          >
            <span>{roleLabel[user.rol]}</span>
            <span className="text-muted-foreground">{user.pochta}</span>
          </button>
        ))}
      </div>
    </form>
  )
}
