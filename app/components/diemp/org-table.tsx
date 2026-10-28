import Link from "next/link"
import { ArrowDownUp, Building2 } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { organizationRows } from "@/lib/diemp/sample"

const columns = [
  { key: "nom", label: "Tashkilot" },
  { key: "topshiriq", label: "Topshiriq" },
  { key: "otgan", label: "Muddati o'tgan" },
  { key: "kutilmoqda", label: "Tasdiq kutilmoqda" },
  { key: "jismoniy", label: "Jismoniy" },
  { key: "moliyaviy", label: "Moliyaviy" },
]

export function OrgTable() {
  const rows = organizationRows()
  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Building2 size={16} className="text-foreground" />
          Tashkilotlar kesimi
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0!">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
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
                {rows.map((row) => (
                  <TableRow key={row.tashkilot} className="border-border hover:bg-muted/30">
                    {columns.map((column) => (
                      <TableCell key={column.key} className="px-4 py-3 text-sm whitespace-nowrap">
                        {column.key === "nom" ? (
                          <Link href={`/topshiriqlar?tashkilot=${row.tashkilot}`} className="font-medium hover:underline underline-offset-4">
                            {row.nom}
                          </Link>
                        ) : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </DashboardCard>
  )
}
