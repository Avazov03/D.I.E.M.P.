"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Download, Moon, RefreshCcw, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadCsv } from "@/lib/diemp/csv"
import { exportableRows, taskColumns, tasks } from "@/lib/diemp/sample"

export function DashboardHeading({ name = "Rahbariyat" }: { name?: string }) {
  const [greeting, setGreeting] = useState("Xayrli kun")
  const [note, setNote] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting("Xayrli tong")
    else if (hour >= 12 && hour < 17) setGreeting("Xayrli kun")
    else if (hour >= 17 && hour < 21) setGreeting("Xayrli kech")
    else setGreeting("Xayrli tun")
  }, [])

  const daytime = greeting === "Xayrli tong" || greeting === "Xayrli kun"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center flex-wrap lg:flex-nowrap lg:gap-0 gap-4 justify-between">
        <div className="flex flex-col items-start">
          <h2 className="text-xl flex items-center gap-2">
            {greeting}, {name}
            <span className="flex items-center">
              {daytime ? <Sun size={25} color="orange" /> : <Moon size={25} />}
            </span>
          </h2>
          <p className="text-sm font-normal text-muted-foreground">
            Namuna ma&apos;lumot. Rasmiy ko&apos;rsatkich faqat tasdiqlangan yozuv va kod formulasi bilan chiqadi.
          </p>
        </div>
        <div className="flex items-center lg:flex-nowrap flex-wrap gap-2">
          <Button variant="outline" className="p-2.5 h-auto outline rounded-lg cursor-pointer" onClick={() => window.location.reload()}>
            <RefreshCcw size={16} />
          </Button>
          <Button
            className="flex items-center gap-1.5 h-auto px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => {
              const rows = exportableRows(tasks, taskColumns)
              downloadCsv("diemp-topshiriqlar.csv", rows, taskColumns.map((column) => ({ ...column, label: column.label })))
              const hidden = tasks.length - rows.length
              setNote(hidden > 0 ? `Eksport tayyor. ${hidden} ta maxfiy yozuv kiritilmadi.` : "Eksport tayyor.")
            }}
          >
            <Download size={16} />
            <span className="text-sm font-medium">Eksport</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays size={14} />
        <span>Manba: namuna to&apos;plami · Hisoblash: tasdiqlangan qiymat · Tasdiq: namuna holati</span>
        {note ? <span className="text-foreground">{note}</span> : null}
      </div>
    </div>
  )
}
