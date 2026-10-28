import type { Metadata } from "next"
import { redirect } from "next/navigation"
import StyleAwareWrapper from "@/app/components/shared/StyleAwareWrapper"
import StyleDivider from "@/app/components/shared/StyleDivider"
import { CabinetHeading, ExecutorCabinet, TaskCabinet } from "@/app/components/diemp/cabinets"
import { ControlGrid } from "@/app/components/diemp/control-grid"
import { DashboardHeading } from "@/app/components/diemp/dashboard-heading"
import { EventsTable } from "@/app/components/diemp/events-table"
import { ExecutionChart } from "@/app/components/diemp/execution-chart"
import { IndicatorGrid } from "@/app/components/diemp/indicator-grid"
import { OrgTable } from "@/app/components/diemp/org-table"
import { organizations } from "@/lib/diemp/sample"
import { tasksFor } from "@/lib/diemp/scope"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = {
  title: "Kabinet",
  description: "Rol kabineti",
}

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const rows = tasksFor(user)

  if (user.rol === "ijrochi") return <ExecutorCabinet rows={rows} />
  if (user.rol === "koordinator") {
    const org = organizations.find((item) => item.kod === user.tashkilot)?.nom ?? "Tashkilot"
    return <TaskCabinet rol="koordinator" text={`${org} topshiriqlari va hisobotlari. Boshqa tashkilot ko'rinmaydi.`} rows={rows} />
  }
  if (user.rol === "nazorat") {
    return <TaskCabinet rol="nazorat" text="Muddat, hisobot va muammolarni tekshirasiz. Maxfiy bandlar bu rolda ochilmaydi." rows={rows} />
  }
  if (user.rol === "tahlilchi") {
    return (
      <>
        <CabinetHeading rol="tahlilchi" text="KPI, tendensiya va AI tahlil. Rasmiy foiz kodda hisoblanadi." />
        <StyleAwareWrapper lyraClassName="grid grid-cols-12 p-px gap-px bg-border" defaultClassName="grid grid-cols-12 gap-4">
          <div className="lg:col-span-7 col-span-12">
            <ExecutionChart />
          </div>
          <div className="lg:col-span-5 col-span-12">
            <IndicatorGrid />
          </div>
        </StyleAwareWrapper>
      </>
    )
  }

  return (
    <>
      <div className="pb-4">
        <DashboardHeading name={user.ism} />
      </div>
      <StyleAwareWrapper lyraClassName="grid grid-cols-12 p-px gap-px bg-border" defaultClassName="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ControlGrid />
        </div>
        <StyleDivider wrapperClassName="col-span-12" />
        <div className="lg:col-span-7 col-span-12">
          <ExecutionChart />
        </div>
        <div className="lg:col-span-5 col-span-12">
          <IndicatorGrid />
        </div>
        <StyleDivider wrapperClassName="col-span-12" />
        <div className="col-span-12">
          <EventsTable />
        </div>
        <StyleDivider wrapperClassName="col-span-12" />
        <div className="col-span-12">
          <OrgTable />
        </div>
      </StyleAwareWrapper>
    </>
  )
}
