import { statusLabel } from "@/lib/diemp/labels"
import {
  averageApproved,
  deadlineRate,
  decisions,
  evidence,
  events,
  kpis,
  organizations,
  reports,
  risks,
  visibleTasks,
  type DataRow,
} from "@/lib/diemp/sample"
import { extraReports } from "@/lib/diemp/inbox"
import { storedDecisions, storedTasks } from "@/lib/diemp/db"

export type OfficialFigures = {
  jismoniy: number | null
  moliyaviy: number | null
  muddat: number | null
}

const orgName = new Map<string, string>(organizations.map((org) => [org.kod, org.nom]))

function label(value: string) {
  return statusLabel[value] ?? value
}

function open(rows: DataRow[]) {
  return rows.filter((row) => row.maxfiylik !== "maxfiy")
}

function confirmedPercent(row: DataRow, valueKey: string, flagKey: string) {
  if (row[flagKey] !== "ha") return "tasdiqlanmagan, rasmiy foizga kirmaydi"
  return `${row[valueKey]}%`
}

export function officialFigures(): OfficialFigures {
  const rows = visibleTasks()
  return {
    jismoniy: averageApproved(rows, "jismoniy", "jismoniyTasdiq"),
    moliyaviy: averageApproved(rows, "moliyaviy", "moliyaviyTasdiq"),
    muddat: deadlineRate(rows),
  }
}

export function analysisBrief() {
  const rows = visibleTasks()
  const figures = officialFigures()
  const ids = new Set<string>()
  const remember = (value?: string) => {
    if (value && value !== "—") ids.add(value)
  }

  const qarorlar = open(decisions).map((row) => {
    remember(row.raqam)
    return {
      id: row.raqam,
      turi: label(row.turi),
      nomi: row.nomi,
      sana: row.sana,
      holat: label(row.holat),
    }
  })

  const yuklanganQarorlar = storedDecisions().map((row) => {
    remember(row.raqam)
    return { id: row.raqam, turi: "Qaror", nomi: row.nomi, sana: row.sana || "aniqlanmagan", holat: "Ijroda", manba: "Yuklangan hujjat" }
  })

  const topshiriqlar = rows.map((row) => {
    remember(row.raqam)
    remember(row.qaror)
    return {
      id: row.raqam,
      qaror: row.qaror,
      matn: row.matn,
      tashkilot: orgName.get(row.tashkilot) ?? row.tashkilot,
      muddat: row.muddat,
      holat: label(row.holat),
      muddatHolati: label(row.muddatKod),
      xatar: label(row.xatar),
      jismoniy: confirmedPercent(row, "jismoniy", "jismoniyTasdiq"),
      moliyaviy: confirmedPercent(row, "moliyaviy", "moliyaviyTasdiq"),
    }
  })

  const yuklanganTopshiriqlar = storedTasks().map((row) => {
    remember(row.raqam)
    remember(row.qaror)
    return {
      id: row.raqam,
      qaror: row.qaror,
      matn: row.matn,
      tashkilot: orgName.get(row.tashkilot) ?? row.tashkilot,
      muddat: row.muddat || "aniqlanmagan",
      holat: "Ijroda",
      jismoniy: "tasdiqlanmagan, rasmiy foizga kirmaydi",
      moliyaviy: "tasdiqlanmagan, rasmiy foizga kirmaydi",
      manba: "Yuklangan hujjat, odam tasdiqlagan",
    }
  })

  const hisobotlar = [...reports, ...extraReports()].map((row) => {
    remember(row.raqam)
    remember(row.topshiriq)
    return {
      id: row.raqam,
      topshiriq: row.topshiriq,
      davr: row.davr,
      tashkilot: orgName.get(row.tashkilot) ?? row.tashkilot,
      holat: label(row.holat),
      hajm: row.hajm,
      muammo: row.muammo,
    }
  })

  const dalillar = open(evidence).map((row) => {
    remember(row.raqam)
    remember(row.topshiriq)
    return {
      id: row.raqam,
      topshiriq: row.topshiriq,
      tur: row.tur,
      holat: label(row.holat),
      sana: row.sana,
    }
  })

  const korsatkichlar = kpis.map((row) => {
    remember(row.nom)
    remember(row.manba)
    return {
      id: row.nom,
      tur: label(row.tur),
      olchov: row.olchov,
      reja: row.reja,
      tasdiqlangan: row.tasdiq,
      formula: row.formula,
      natija: row.natija,
      holat: label(row.holat),
      manba: row.manba,
    }
  })

  const xatarlar = open(risks).map((row) => {
    remember(row.topshiriq)
    return {
      topshiriq: row.topshiriq,
      daraja: label(row.daraja),
      tur: row.tur,
      sabab: row.sabab,
      manba: row.manba,
      tavsiya: row.tavsiya,
    }
  })

  const hodisalar = events
    .filter((row) => row.holat !== "maxfiy" && !row.obyekt.startsWith("NM-05"))
    .map((row) => {
      remember(row.obyekt)
      return { vaqt: row.vaqt, hodisa: row.hodisa, obyekt: row.obyekt, izoh: row.izoh }
    })

  const kontekst = {
    manba: "Namuna to'plami va odam tasdiqlagan yuklangan hujjatlar. Bu jonli davlat bazasi emas.",
    maxfiy: "Maxfiy yozuvlar bu kontekstga kiritilmagan. Matnini taxmin qilma.",
    rasmiy: {
      jismoniy_bajarilish_foiz: figures.jismoniy,
      moliyaviy_bajarilish_foiz: figures.moliyaviy,
      muddatga_rioya_foiz: figures.muddat,
      qoida: "Bu uchta foiz kodda hisoblangan. Boshqa foiz yozma. Jismoniy va moliyaviy ko'rsatkich bir xil emas. Tasdiqlanmagan qiymat rasmiy foizga kirmaydi. Reja 0 yoki formula tasdiqlanmagan bo'lsa natija Hisoblanmaydi.",
    },
    qarorlar: [...qarorlar, ...yuklanganQarorlar],
    topshiriqlar: [...topshiriqlar, ...yuklanganTopshiriqlar],
    hisobotlar,
    dalillar,
    korsatkichlar,
    xatarlar,
    hodisalar,
  }

  return { kontekst, ids, figures }
}

export function sourceHref(id: string) {
  if (storedTasks().some((row) => row.raqam === id)) return "/topshiriqlar"
  if (storedDecisions().some((row) => row.raqam === id)) return "/qarorlar"
  if (/^NM-\d{2}-\d{2}$/.test(id)) return "/topshiriqlar"
  if (/^NM-\d{2}$/.test(id)) return "/qarorlar"
  if (/^HS-\d+$/.test(id)) return "/hisobotlar"
  if (/^DL-\d+$/.test(id)) return "/dalillar"
  if (kpis.some((row) => row.nom === id)) return "/kpi"
  if (risks.some((row) => row.topshiriq === id && row.maxfiylik !== "maxfiy")) return "/xatarlar"
  return null
}
