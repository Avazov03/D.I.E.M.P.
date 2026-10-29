"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { methodologyNote } from "@/lib/diemp/ttb"

const questions = [
  { savol: "Qaysi baholashlar hali tasdiqlanmagan?", href: "/baholash?holat=tekshiruvda" },
  { savol: "Qaysi hujjatlarda ma'muriy yuk yuqori?", href: "/baholash" },
  { savol: "Monitoringda reja va haqiqiy qayerda ajraladi?", href: "/monitoring" },
  { savol: "Qaysi hisobotlar tasdiq kutmoqda?", href: "/hisobotlar?holat=kutilmoqda" },
  { savol: "Qaytarilgan baholashlarda qanday kamchilik bor?", href: "/baholash?holat=qaytarilgan" },
]

type Answer = {
  javob: string
  manbalar: { id: string; href: string }[]
  aniqlanmagan: string[]
  rasmiy: { sof: number | null; yuk: number | null; natija: number | null }
  cheklov: string
}

function show(value: number | null, suffix = "") {
  return value === null ? "Hisoblanmaydi" : `${value}${suffix}`
}

export function AnalystPanel() {
  const [savol, setSavol] = useState(questions[0].savol)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [xato, setXato] = useState("")
  const [loading, setLoading] = useState(false)

  async function ask(text: string) {
    const question = text.trim()
    if (question.length < 3 || loading) return
    setSavol(question)
    setLoading(true)
    setXato("")
    setAnswer(null)
    try {
      const response = await fetch("/api/tahlil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savol: question }),
      })
      const data = (await response.json()) as {
        javob?: string
        manbalar?: { id: string; href: string }[]
        aniqlanmagan?: string[]
        rasmiy?: { sof?: number | null; yuk?: number | null; natija?: number | null }
        cheklov?: string
        xato?: string
      }
      if (!response.ok) {
        setXato(data.xato || "AI xizmati javob bermadi")
        return
      }
      setAnswer({
        javob: data.javob || "Javob olinmadi",
        manbalar: data.manbalar || [],
        aniqlanmagan: data.aniqlanmagan || [],
        rasmiy: {
          sof: data.rasmiy?.sof ?? null,
          yuk: data.rasmiy?.yuk ?? null,
          natija: data.rasmiy?.natija ?? null,
        },
        cheklov: data.cheklov || "AI xulosasi rasmiy fakt emas va ekspert tasdig'isiz qaror hisoblanmaydi.",
      })
    } catch {
      setXato("AI xizmati javob bermadi. Rasmiy ko'rsatkichlar o'z holicha ishlaydi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">AI yordamchi</h2>
        <p className="text-sm text-muted-foreground">
          Hujjat matni va baholash bo&apos;yicha dastlabki ko&apos;rsatma. Huquqiy bahoni almashtirmaydi. {methodologyNote}
        </p>
      </div>
      <DashboardCard>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={16} />
            Mutaxassis savoli
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-6">
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              void ask(savol)
            }}
          >
            <Textarea
              value={savol}
              onChange={(event) => setSavol(event.target.value)}
              maxLength={1000}
              placeholder="Savolni yozing"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || savol.trim().length < 3}>
                {loading ? "Kutilmoqda" : "So'rash"}
              </Button>
            </div>
          </form>
          {xato ? <p className="text-sm text-[#ec003f]">{xato}</p> : null}
          {answer ? (
            <div className="flex flex-col gap-3 border border-border p-4">
              <p className="text-sm">{answer.javob}</p>
              <p className="text-xs text-muted-foreground">{answer.cheklov}</p>
              <div className="grid gap-px bg-border sm:grid-cols-3">
                <div className="bg-background p-3">
                  <p className="text-lg">{show(answer.rasmiy.sof)}</p>
                  <p className="text-xs text-muted-foreground">Sof ta&apos;sir, kod hisobi</p>
                </div>
                <div className="bg-background p-3">
                  <p className="text-lg">{show(answer.rasmiy.yuk)}</p>
                  <p className="text-xs text-muted-foreground">Ma&apos;muriy yuk, kod hisobi</p>
                </div>
                <div className="bg-background p-3">
                  <p className="text-lg">{show(answer.rasmiy.natija, "%")}</p>
                  <p className="text-xs text-muted-foreground">Reja bajarilishi, kod hisobi</p>
                </div>
              </div>
              {answer.manbalar.length ? (
                <div className="flex flex-wrap gap-2">
                  {answer.manbalar.map((item) => (
                    <Link key={item.id} href={item.href} className="text-sm underline underline-offset-4">
                      {item.id}
                    </Link>
                  ))}
                </div>
              ) : null}
              {answer.aniqlanmagan.length ? (
                <p className="text-sm text-muted-foreground">Aniqlanmagan: {answer.aniqlanmagan.join(", ")}</p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </DashboardCard>
      <DashboardCard>
        <CardHeader className="border-b border-border">
          <CardTitle>Tayyor savollar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul>
            {questions.map((item) => (
              <li key={item.href} className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 last:border-b-0">
                <button type="button" className="text-left text-sm hover:underline" onClick={() => void ask(item.savol)}>
                  {item.savol}
                </button>
                <Link href={item.href} className="text-sm whitespace-nowrap text-muted-foreground">
                  Manbani ochish
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </DashboardCard>
    </div>
  )
}
