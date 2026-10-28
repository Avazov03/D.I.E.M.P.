"use client"

import Link from "next/link"

const FullLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 overflow-hidden">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold tracking-tight text-background">
        DI
      </span>
      <span className="hidden lg:block text-sm font-semibold tracking-[0.16em] text-foreground group-data-[state=collapsed]:hidden">
        D.I.E.M.P.
      </span>
    </Link>
  )
}

export default FullLogo
