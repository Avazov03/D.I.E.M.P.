"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <div className="flex md:flex-row flex-col items-center justify-between gap-3 text-center">
      <p className="text-sm text-muted-foreground">© 2026 D.I.E.M.P.</p>
      <p className="text-sm text-muted-foreground">
        Interfeys asosi{" "}
        <Link href="https://shadcndashboard.dev/" target="_blank" className="hover:text-primary">
          Shadcn Dashboard
        </Link>
      </p>
    </div>
  )
}
