"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Gauge } from "lucide-react"
import { canOpen, type Role } from "@/lib/diemp/access"
import { averageOutcome } from "@/lib/diemp/ttb"

export function NavSecondary() {
  const [rol, setRol] = useState<Role | null>(null)
  useEffect(() => {
    void fetch("/api/sessiya")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { rol?: Role } | null) => setRol(data?.rol ?? null))
  }, [])
  if (!rol || !canOpen(rol, "/monitoring")) return null
  const value = averageOutcome() ?? 0

  return (
    <div className="-mx-4 border-t border-b border-border px-5 py-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="size-5 shrink-0" />
                <span className="font-medium text-base leading-6 text-foreground">Reja bajarilishi</span>
              </div>
              <span className="font-medium text-base leading-6 text-foreground">{value}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <div className="h-full bg-foreground rounded-full" style={{ width: `${value}%` }} />
            </div>
          </div>
          <p className="text-sm font-normal leading-5 text-muted-foreground text-center">
            Faqat tasdiqlangan monitoring qiymatlari.
          </p>
        </div>
        <Link href="/monitoring" className="w-full cursor-pointer h-9 flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 rounded-lg text-sm font-medium">
          Monitoring
        </Link>
      </div>
    </div>
  )
}
