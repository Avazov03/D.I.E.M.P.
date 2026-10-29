import { assessments } from "@/lib/diemp/ttb"

export function generateStaticParams() {
  return assessments.map((row) => ({ id: row.id }))
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
