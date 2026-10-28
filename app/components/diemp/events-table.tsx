import Link from "next/link"
import { ArrowDownUp, BriefcaseBusiness } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { events } from "@/lib/diemp/sample"
import { StatusPill } from "@/app/components/diemp/status-pill"

export function EventsTable() {
  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <BriefcaseBusiness size={16} className="text-foreground" />
          Oxirgi muhim hodisalar
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0!">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  {["Vaqt", "Hodisa", "Obyekt", "Holat", "Izoh"].map((label) => (
                    <TableHead key={label} className="px-4 py-3 h-auto text-sm font-normal text-muted-foreground">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {label}
                        <ArrowDownUp size={14} className="text-muted-foreground shrink-0" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.obyekt + event.vaqt} className="border-border hover:bg-muted/30">
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{event.vaqt}</TableCell>
                    <TableCell className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                      <Link href={event.href} className="hover:underline underline-offset-4">{event.hodisa}</Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{event.obyekt}</TableCell>
                    <TableCell className="px-4 py-3"><StatusPill field="holat" code={event.holat} /></TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">{event.izoh}</TableCell>
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
