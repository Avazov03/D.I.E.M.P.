import { documents } from "@/lib/diemp/ttb"

export function generateStaticParams() {
  return documents.filter((row) => row.maxfiylik !== "maxfiy").map((row) => ({ raqam: row.raqam }))
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
