"use client"

import Link from "next/link"
import { Registry } from "@/app/components/diemp/registry"
import { assessmentColumns, assessmentFilters, organName } from "@/lib/diemp/ttb"
import type { DataRow } from "@/lib/diemp/sample"
import { roleLabel, type Role } from "@/lib/diemp/access"

export function CabinetHeading({ rol, text }: { rol: Role; text: string }) {
  return (
    <div className="pb-4">
      <h2 className="text-xl">{roleLabel[rol]}</h2>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function TaskCabinet({
  rol,
  text,
  organ,
  ids,
  rows: source,
}: {
  rol: Role
  text: string
  organ?: string | null
  ids?: string[]
  rows: DataRow[]
}) {
  let rows = source
  if (organ) rows = rows.filter((row) => row.organ === organ)
  if (ids?.length) rows = rows.filter((row) => ids.includes(row.raqam))
  return (
    <>
      <CabinetHeading rol={rol} text={text} />
      <Registry
        title="Baholashlar"
        description={organ ? `${organName(organ)} bo'yicha ochiq baholashlar.` : text}
        columns={assessmentColumns}
        rows={rows}
        filters={assessmentFilters}
        filename="ttb-baholash.csv"
      />
      <p className="pt-2 text-sm">
        <Link href="/baholash" className="underline underline-offset-4">Barcha ochiq baholashlar</Link>
      </p>
    </>
  )
}

export function ExecutorCabinet({ ids, rows: source }: { ids: string[]; rows: DataRow[] }) {
  const rows = source.filter((row) => ids.includes(row.raqam))
  return (
    <>
      <CabinetHeading rol="ijrochi" text="Sizga biriktirilgan baholash varaqalari. Tasdiqlanmaguncha rasmiy hisobot hisoblanmaydi." />
      <Registry
        title="Mening baholashlarim"
        description="Faqat sizga biriktirilgan bandlar."
        columns={assessmentColumns}
        rows={rows}
        filters={[]}
        filename="ttb-mening-baholash.csv"
      />
      <div className="flex flex-col gap-2 pt-4">
        {rows.map((row) => (
          <Link key={row.raqam} href={`/baholash/${row.raqam}`} className="text-sm underline underline-offset-4">
            {row.raqam} ni ochish
          </Link>
        ))}
      </div>
    </>
  )
}

export function UserCabinet({ rows }: { rows: { pochta: string; rolNomi: string; tashkilot: string }[] }) {
  return (
    <>
      <CabinetHeading rol="super_admin" text="Foydalanuvchilar va rollar. Namuna parol: namuna." />
      <Registry
        title="Foydalanuvchilar"
        description="Super administrator ro'yxatni ko'radi."
        columns={[
          { key: "pochta", label: "Pochta" },
          { key: "rolNomi", label: "Rol" },
          { key: "tashkilot", label: "Tashkilot" },
        ]}
        rows={rows}
        filters={[]}
        filename="ttb-foydalanuvchilar.csv"
      />
    </>
  )
}
