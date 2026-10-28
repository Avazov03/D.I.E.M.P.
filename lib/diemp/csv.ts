export function downloadCsv(filename: string, rows: Record<string, string>[], columns: { key: string; label: string }[]) {
  const header = columns.map((column) => csvCell(column.label)).join(",")
  const body = rows.map((row) => columns.map((column) => csvCell(row[column.key] ?? "")).join(","))
  const csv = `\uFEFF${[header, ...body].join("\n")}`
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}
