export type DiffLine = { tur: "teng" | "olindi" | "qoshildi"; matn: string }

function lines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
}

export function lineDiff(before: string, after: string): DiffLine[] {
  const left = lines(before)
  const right = lines(after)
  const n = left.length
  const m = right.length
  const dp = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = left[i] === right[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (left[i] === right[j]) {
      out.push({ tur: "teng", matn: left[i] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ tur: "olindi", matn: left[i] })
      i += 1
    } else {
      out.push({ tur: "qoshildi", matn: right[j] })
      j += 1
    }
  }
  while (i < n) {
    out.push({ tur: "olindi", matn: left[i] })
    i += 1
  }
  while (j < m) {
    out.push({ tur: "qoshildi", matn: right[j] })
    j += 1
  }
  return out
}
