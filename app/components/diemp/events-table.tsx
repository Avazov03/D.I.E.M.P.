import Link from "next/link"
import { History } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCard } from "@/app/components/shared/dashboard-card"
import { StatusPill } from "@/app/components/diemp/status-pill"
import { namunaOchilgan } from "@/lib/diemp/ttb"

const sampleEvents = [
  { vaqt: "28.10.2026 11:20", hodisa: "Baholash qaytarildi", obyekt: "BH-05", holat: "qaytarilgan", izoh: "Foyda hisobi tasdiqlanmadi", href: "/baholash/BH-05" },
  { vaqt: "27.10.2026 16:05", hodisa: "Ekspert tasdiqladi", obyekt: "BH-04", holat: "tasdiqlangan", izoh: "Keyingi TTB yakunlandi", href: "/baholash/BH-04" },
  { vaqt: "27.10.2026 10:40", hodisa: "Hisobot shakli kutmoqda", obyekt: "BH-01", holat: "tekshiruvda", izoh: "Uslubiyot shakli namuna", href: "/hisobotlar" },
  { vaqt: "26.10.2026 14:15", hodisa: "Monitoring yangilandi", obyekt: "BH-02", holat: "monitoring", izoh: "Haqiqiy 42 / reja 50", href: "/monitoring" },
  { vaqt: "25.10.2026 09:30", hodisa: "AI dastlabki tahlil", obyekt: "TTB-03", holat: "qoralama", izoh: "AI xulosa rasmiy emas", href: "/tahlil" },
  { vaqt: "24.10.2026 18:00", hodisa: "Hujjat reyestrga kiritildi", obyekt: "TTB-01", holat: "tekshiruvda", izoh: "Loyiha versiyasi 1.1", href: "/reyestr" },
]

export function EventsTable() {
  const events = namunaOchilgan() ? sampleEvents : []
  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <History size={16} className="text-muted-foreground" />
          Oxirgi muhim hodisalar
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0!">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="px-4">Vaqt</TableHead>
              <TableHead className="px-4">Hodisa</TableHead>
              <TableHead className="px-4">Obyekt</TableHead>
              <TableHead className="px-4">Holat</TableHead>
              <TableHead className="px-4">Izoh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-sm text-muted-foreground">Hali hodisa yo&apos;q.</TableCell>
              </TableRow>
            ) : events.map((event) => (
              <TableRow key={event.vaqt + event.obyekt} className="border-border hover:bg-muted/30">
                <TableCell className="px-4 py-3 text-sm">{event.vaqt}</TableCell>
                <TableCell className="px-4 py-3 text-sm">
                  <Link href={event.href} className="hover:underline underline-offset-4">{event.hodisa}</Link>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">{event.obyekt}</TableCell>
                <TableCell className="px-4 py-3"><StatusPill code={event.holat} field="holat" /></TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">{event.izoh}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </DashboardCard>
  )
}
