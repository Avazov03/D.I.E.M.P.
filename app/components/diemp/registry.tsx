"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowDownUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { downloadCsv } from "@/lib/diemp/csv"
import { displayValue, exportableRows, type Column, type DataRow, type FilterDef } from "@/lib/diemp/sample"
import { statusTone } from "@/lib/diemp/labels"
import { StatusPill } from "@/app/components/diemp/status-pill"

export function Registry({
  title,
  description,
  columns,
  rows,
  filters,
  filename,
}: {
  title: string
  description: string
  columns: Column[]
  rows: DataRow[]
  filters: FilterDef[]
  filename: string
}) {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [note, setNote] = useState("")

  const filtered = useMemo(() => {
    return rows.filter((row) => filters.every((filter) => {
      const value = params.get(filter.param)
      if (!value || value === "barchasi") return true
      return row[filter.param] === value
    }))
  }, [filters, params, rows])

  function setFilter(param: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (!value || value === "barchasi") next.delete(param)
    else next.set(param, value)
    const query = next.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          className="flex items-center gap-1.5 h-auto px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => {
            const exported = exportableRows(filtered, columns)
            downloadCsv(filename, exported, columns)
            const hidden = filtered.length - exported.length
            setNote(hidden > 0 ? `${hidden} ta maxfiy yozuv eksportga kiritilmadi.` : "Eksport tayyor.")
          }}
        >
          <Download size={16} />
          <span className="text-sm font-medium">Eksport</span>
        </Button>
      </div>
      {note ? <p className="text-sm text-foreground">{note}</p> : null}
      <DashboardCard className="flex flex-col gap-0!">
        <CardHeader className="border-b border-border flex flex-row flex-wrap gap-2 items-center">
          {filters.map((filter) => {
            const current = params.get(filter.param) ?? "barchasi"
            const currentLabel = current === "barchasi"
              ? `${filter.label}: barchasi`
              : filter.options.find((option) => option.value === current)?.label ?? current
            return (
            <Select key={filter.param} value={current} onValueChange={(value) => value && setFilter(filter.param, value)}>
              <SelectTrigger className="h-auto! w-fit text-sm cursor-pointer">
                <SelectValue>{currentLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barchasi" className="cursor-pointer">{filter.label}: barchasi</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            )
          })}
          <span className="text-sm text-muted-foreground ms-auto">{filtered.length} ta yozuv</span>
        </CardHeader>
        <CardContent className="px-0!">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="px-4 py-3 h-auto text-sm font-normal text-muted-foreground">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {column.label}
                        <ArrowDownUp size={14} className="text-muted-foreground shrink-0" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="px-4 py-8 text-sm text-muted-foreground">
                      Bu filtr bo&apos;yicha yozuv yo&apos;q.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((row) => (
                  <TableRow key={row.raqam ?? row.topshiriq ?? row.nom ?? row.vaqt} className="border-border hover:bg-muted/30">
                    {columns.map((column) => {
                      const raw = row[column.key] ?? ""
                      return (
                        <TableCell key={column.key} className="px-4 py-3 text-sm align-top max-w-[320px]">
                          {statusTone[raw] ? <StatusPill field={column.key} code={raw} /> : displayValue(column.key, raw)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  )
}
