import Link from "next/link"
import { Building2 } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { organName, organs, visibleAssessments } from "@/lib/diemp/ttb"
import { StatusPill } from "@/app/components/diemp/status-pill"

export function OrgTable() {
  const rows = organs.map((org) => {
    const items = visibleAssessments().filter((row) => row.organ === org.kod)
    const open = items.filter((row) => row.holat === "qoralama" || row.holat === "tekshiruvda" || row.holat === "qaytarilgan").length
    const done = items.filter((row) => row.holat === "tasdiqlangan" || row.holat === "monitoring").length
    return { kod: org.kod, nom: org.nom, jami: items.length, ochiq: open, yopiq: done }
  })

  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" />
          Organlar kesimi
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0!">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="px-4">Organ</TableHead>
              <TableHead className="px-4">Jami</TableHead>
              <TableHead className="px-4">Ochiq</TableHead>
              <TableHead className="px-4">Tasdiqlangan</TableHead>
              <TableHead className="px-4">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.kod} className="border-border hover:bg-muted/30">
                <TableCell className="px-4 py-3">
                  <Link href={`/baholash?organ=${row.kod}`} className="font-medium hover:underline underline-offset-4">
                    {organName(row.kod)}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-3">{row.jami}</TableCell>
                <TableCell className="px-4 py-3">{row.ochiq}</TableCell>
                <TableCell className="px-4 py-3">{row.yopiq}</TableCell>
                <TableCell className="px-4 py-3">
                  <StatusPill code={row.ochiq ? "tekshiruvda" : "tasdiqlangan"} field="holat" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </DashboardCard>
  )
}
