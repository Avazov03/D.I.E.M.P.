"use client"

import Link from "next/link"

function Mark() {
  return (
    <svg viewBox="0 0 64 64" className="size-8 shrink-0" aria-hidden>
      <rect width="64" height="64" rx="15" className="fill-foreground" />
      <path d="M36 12.5h12.2a6 6 0 0 1 6 6V31" fill="none" stroke="#2090F0" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12.5 33.5V46.2a6 6 0 0 0 6 6H32" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-background/70" />
      <text x="30" y="40" textAnchor="middle" className="fill-background" fontSize="22" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">DI</text>
    </svg>
  )
}

const letters = ["D", "I", "E", "M", "P"]

const FullLogo = ({ showName = false }: { showName?: boolean }) => {
  return (
    <Link href="/" aria-label="D.I.E.M.P." className="flex items-center gap-2 overflow-hidden text-foreground">
      <Mark />
      <span className={showName ? "flex items-center gap-2" : "flex items-center gap-2 group-data-[state=collapsed]:hidden"}>
        <span className="h-5 w-px bg-foreground/40" />
        <span className="flex items-end gap-1.5 text-sm font-bold leading-none">
          {letters.map((letter) => (
            <span key={letter} className="contents">
              <span>{letter}</span>
              <span className="mb-px size-1 shrink-0 rounded-full bg-foreground" />
            </span>
          ))}
        </span>
      </span>
    </Link>
  )
}

export default FullLogo
