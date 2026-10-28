import { months, type DataRow } from "@/lib/diemp/sample"

export type MonthPoint = { oy: string; yopilgan: number; otgan: number }
export type Period = "10" | "3" | "1"

const statuses = ["yakunlangan", "ijroda", "muddati_otgan"] as const
export type StatusKey = (typeof statuses)[number]

export function monthSeries(rows: DataRow[]): MonthPoint[] {
  return months.map((oy) => ({
    oy,
    yopilgan: rows.filter((row) => row.oy === oy && row.holat === "yakunlangan").length,
    otgan: rows.filter((row) => row.oy === oy && row.holat === "muddati_otgan").length,
  }))
}

export function sliceSeries(series: MonthPoint[], period: Period) {
  if (period === "1") return series.slice(-1)
  if (period === "3") return series.slice(-3)
  return series
}

export function closedChange(series: MonthPoint[]) {
  if (series.length < 2) return null
  const last = series[series.length - 1]?.yopilgan ?? 0
  const previous = series[series.length - 2]?.yopilgan ?? 0
  if (previous === 0) return null
  return Math.round(((last - previous) / previous) * 100)
}

export function statusShare(rows: DataRow[]) {
  const known = rows.filter((row) => statuses.includes(row.holat as StatusKey))
  const total = known.length
  return {
    total,
    parts: statuses.map((key) => {
      const count = known.filter((row) => row.holat === key).length
      return { key, count, percent: total ? Math.round((count / total) * 100) : null }
    }),
  }
}
