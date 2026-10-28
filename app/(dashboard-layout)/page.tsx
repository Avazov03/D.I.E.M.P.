import type { Metadata } from "next"
import StyleAwareWrapper from "@/app/components/shared/StyleAwareWrapper"
import StyleDivider from "@/app/components/shared/StyleDivider"
import { ControlGrid } from "@/app/components/diemp/control-grid"
import { DashboardHeading } from "@/app/components/diemp/dashboard-heading"
import { EventsTable } from "@/app/components/diemp/events-table"
import { ExecutionChart } from "@/app/components/diemp/execution-chart"
import { IndicatorGrid } from "@/app/components/diemp/indicator-grid"
import { OrgTable } from "@/app/components/diemp/org-table"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Rahbariyat nazorat ekrani",
}

export default function Page() {
  return (
    <>
      <div className="pb-4">
        <DashboardHeading />
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
