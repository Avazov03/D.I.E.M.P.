import type { Metadata } from "next"
import { AnalystPanel } from "@/app/components/diemp/analyst"

export const metadata: Metadata = { title: "AI tahlil" }

export default function Page() {
  return <AnalystPanel />
}
