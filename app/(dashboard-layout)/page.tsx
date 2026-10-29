import type { Metadata } from "next"
import { redirect } from "next/navigation"
import StyleAwareWrapper from "@/app/components/shared/StyleAwareWrapper"
import StyleDivider from "@/app/components/shared/StyleDivider"
import { CabinetHeading, ExecutorCabinet, TaskCabinet } from "@/app/components/diemp/cabinets"
import { ControlGrid } from "@/app/components/diemp/control-grid"
import { DashboardHeading } from "@/app/components/diemp/dashboard-heading"
import { EventsTable } from "@/app/components/diemp/events-table"
import { ExecutionChart } from "@/app/components/diemp/execution-chart"
import { StatusShare } from "@/app/components/diemp/status-share"
import { IndicatorGrid } from "@/app/components/diemp/indicator-grid"
import { OrgTable } from "@/app/components/diemp/org-table"
import { assessmentRows, averageBurden, averageNet, averageOutcome, countStatus, monthSeries, organName, statusShare, visibleAssessments } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"
import { currentUser } from "@/lib/diemp/session"

export const metadata: Metadata = {
  title: "Kabinet",
  description: "TTB kabineti",
}

export default async function Page() {
  const user = await currentUser()
  if (!user) redirect("/auth/auth2/login")
  const saved = await loadAssessments()
  const rows = assessmentRows(saved)
  const visible = visibleAssessments(saved)
  const series = monthSeries()
  const share = statusShare(saved)
  const indicators = {
    net: averageNet(saved),
    burden: averageBurden(saved),
    outcome: averageOutcome(saved),
    confirmed: countStatus("tasdiqlangan", saved) + countStatus("monitoring", saved),
    total: visible.length,
  }

  if (user.rol === "ijrochi") return <ExecutorCabinet ids={user.topshiriqlar} rows={rows} />
  if (user.rol === "koordinator") {
    return <TaskCabinet rol="koordinator" text={`${organName(user.tashkilot || "")} hujjatlari va baholashlari.`} organ={user.tashkilot} rows={rows} />
  }
  if (user.rol === "nazorat") {
    return <TaskCabinet rol="nazorat" text="Baholashlarni tekshirasiz va tasdiqlaysiz. AI xulosa rasmiy qaror emas." rows={rows} />
  }
  if (user.rol === "tahlilchi") {
    return (
      <>
        <CabinetHeading rol="tahlilchi" text="Monitoring, tendensiya va AI yordam. Rasmiy foiz kodda hisoblanadi." />
        <StyleAwareWrapper lyraClassName="grid grid-cols-12 p-px gap-px bg-border" defaultClassName="grid grid-cols-12 gap-4">
          <div className="lg:col-span-7 col-span-12">
            <ExecutionChart series={series} />
          </div>
          <div className="lg:col-span-5 col-span-12">
            <StatusShare total={share.total} parts={share.parts} />
          </div>
          <div className="col-span-12">
            <IndicatorGrid {...indicators} />
          </div>
        </StyleAwareWrapper>
      </>
    )
  }

  return (
    <>
      <div className="pb-4">
        <DashboardHeading name={user.ism} rows={rows} />
      </div>
      <StyleAwareWrapper lyraClassName="grid grid-cols-12 p-px gap-px bg-border" defaultClassName="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ControlGrid />
        </div>
        <StyleDivider wrapperClassName="col-span-12" />
        <div className="lg:col-span-7 col-span-12">
          <ExecutionChart series={series} />
        </div>
        <div className="lg:col-span-5 col-span-12">
          <StatusShare total={share.total} parts={share.parts} />
        </div>
        <div className="col-span-12">
          <IndicatorGrid {...indicators} />
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
