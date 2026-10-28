export type DraftTask = {
  matn: string
  muddat: string
  tashkilot: string
  parchasi: string
}

export type Draft = {
  raqam: string
  nomi: string
  sana: string
  topshiriqlar: DraftTask[]
  aniqlanmagan: string[]
}
