import { statusLabel } from "@/lib/diemp/labels"
import { averageBurden, averageNet, averageOutcome, burden, netEffect, organName, outcomeGap, visibleAssessments, visibleDocuments } from "@/lib/diemp/ttb"
import { loadAssessments } from "@/lib/diemp/ttb-live"

export type OfficialFigures = {
  sof: number | null
  yuk: number | null
  natija: number | null
}

function label(value: string) {
  return statusLabel[value] ?? value
}

export async function analysisBrief() {
  const rows = visibleAssessments(await loadAssessments())
  const figures: OfficialFigures = {
    sof: averageNet(rows),
    yuk: averageBurden(rows),
    natija: averageOutcome(rows),
  }
  const ids = new Set<string>()
  const remember = (value?: string) => {
    if (value) ids.add(value)
  }

  const hujjatlar = visibleDocuments().map((row) => {
    remember(row.raqam)
    return {
      id: row.raqam,
      nomi: row.nomi,
      turi: label(row.turi),
      holat: label(row.holat),
      versiya: row.versiya,
      organ: organName(row.organ),
      matn: row.matn,
    }
  })

  const baholashlar = rows.map((row) => {
    remember(row.id)
    remember(row.hujjat)
    const sof = netEffect(row)
    const yuk = burden(row)
    const natija = outcomeGap(row)
    return {
      id: row.id,
      hujjat: row.hujjat,
      turi: label(row.turi),
      holat: label(row.holat),
      organ: organName(row.organ),
      muammo: row.muammo,
      maqsad: row.maqsad,
      muqobil: row.muqobil,
      sof: sof === null ? "Hisoblanmaydi" : sof,
      yuk: yuk === null ? "Hisoblanmaydi" : yuk,
      natija: natija === null ? "Hisoblanmaydi" : natija,
    }
  })

  const kontekst = {
    manba: "Namuna baholashlar. Bu jonli davlat bazasi emas.",
    maxfiy: "Maxfiy hujjatlar bu kontekstga kiritilmagan. Matnini taxmin qilma.",
    rasmiy: {
      sof: figures.sof,
      yuk: figures.yuk,
      natija: figures.natija,
      qoida: "Bu uchta qiymat kodda hisoblangan. Boshqa foiz yozma. Tasdiqlanmagan xarajat, foyda, yuk yoki reja rasmiy songa kirmaydi. Reja 0 bo'lsa natija Hisoblanmaydi.",
    },
    hujjatlar,
    baholashlar,
  }

  return { kontekst, ids, figures }
}

export async function sourceHref(id: string) {
  const rows = visibleAssessments(await loadAssessments())
  if (rows.some((row) => row.id === id)) return `/baholash/${id}`
  if (visibleDocuments().some((row) => row.raqam === id)) return `/reyestr/${id}`
  if (/^HS-BH-\d{2}$/.test(id)) return "/hisobotlar"
  return null
}
