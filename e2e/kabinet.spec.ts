import { expect, test } from "@playwright/test"
import { kirish, tanla } from "./yordam"

test("rahbar kesimi, diagramma va rasmiy foiz ishlaydi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await expect(page.getByText("Nazorat kesimi")).toBeVisible()
  await expect(page.getByText("Ijro dinamikasi")).toBeVisible()
  await expect(page.getByText("Holat taqsimoti")).toBeVisible()
  await expect(page.getByRole("link", { name: /67% Jismoniy bajarilish/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /71% Moliyaviy bajarilish/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /63% Muddatga rioya/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /63% Dalil tasdig'i/ })).toBeVisible()

  const yopilgan = page.getByRole("link", { name: /^\d+$/ }).first()
  const oldingi = Number(await yopilgan.textContent())
  expect(oldingi).toBeGreaterThan(0)
  await tanla(page, /So'nggi 10 oy/, "Joriy oy")
  await expect(yopilgan).toHaveText("0")
  await expect(page.getByText("Oldingi oyga nisbatan hisoblanmaydi")).toBeVisible()

  await page.getByRole("link", { name: /Muddati o'tgan/ }).first().click()
  await expect(page).toHaveURL(/\/topshiriqlar\?holat=muddati_otgan/)
  await expect(page.getByRole("combobox").filter({ hasText: "Muddati o'tgan" })).toBeVisible()
  await expect(page.getByText("FR-22-01")).toBeVisible()
})

test("ko'rsatkich va tashkilot havolasi manbani ochadi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.getByRole("link", { name: /67% Jismoniy bajarilish/ }).click()
  await expect(page).toHaveURL(/\/kpi$/)
  await expect(page.getByRole("heading", { name: "KPI", exact: true })).toBeVisible()

  await page.goto("/")
  await page.getByRole("link", { name: "Iqtisodiyot vazirligi" }).click()
  await expect(page).toHaveURL(/tashkilot=iqtisod/)
  await expect(page.getByText("QR-11-01")).toBeVisible()
})

test("bo'sh filtr va maxfiy eksport holati", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.goto("/topshiriqlar?holat=yoq")
  await expect(page.getByText("Bu filtr bo'yicha yozuv yo'q.")).toBeVisible()
  await expect(page.getByText("0 ta yozuv")).toBeVisible()

  await page.goto("/qarorlar")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Eksport" }).click()
  expect((await download).suggestedFilename()).toBe("diemp-qarorlar.csv")
  await expect(page.getByText("1 ta maxfiy yozuv eksportga kiritilmadi.")).toBeVisible()
})

test("tahlilchi ham diagrammani ko'radi, nazorat kesimisiz", async ({ page }) => {
  await kirish(page, "tahlilchi")
  await expect(page.getByText("Ijro dinamikasi")).toBeVisible()
  await expect(page.getByText("Holat taqsimoti")).toBeVisible()
  await expect(page.getByText("Nazorat kesimi")).toHaveCount(0)
  await expect(page.getByRole("link", { name: /67% Jismoniy bajarilish/ })).toBeVisible()
})
