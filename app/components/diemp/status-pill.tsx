import { statusTone } from "@/lib/diemp/labels"
import { displayValue } from "@/lib/diemp/sample"

export function StatusPill({ code, field }: { code: string; field: string }) {
  const tone = statusTone[code] ?? { bg: "bg-muted", text: "text-foreground" }
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal whitespace-nowrap ${tone.bg} ${tone.text}`}>
      {displayValue(field, code)}
    </span>
  )
}
