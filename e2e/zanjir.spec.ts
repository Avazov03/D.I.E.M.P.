import { writeFileSync } from "node:fs"
import { expect, test } from "@playwright/test"
import { kirish } from "./yordam"

test("baholovchi varaqani ochadi va qoralama saqlaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  await page.getByRole("link", { name: "BH-02 ni ochish" }).click()
  await expect(page).toHaveURL(/\/baholash\/BH-02/)
  await expect(page.getByText("Sof ta'sir").first()).toBeVisible()
  await page.getByRole("button", { name: "Qoralama saqlash" }).click()
  await expect(page.getByText(/Qoralama saqlandi/)).toBeVisible()
  await page.reload()
  await expect(page.getByText("Qoralama").first()).toBeVisible()
})

test("hujjat yuklash: rad va muvaffaqiyatli zanjir", async ({ page }) => {
  test.setTimeout(120_000)
  writeFileSync("D:\\tmp\\e2e-not-a-docx.docx", "bu docx emas")
  await kirish(page, "rahbariyat")
  await page.goto("/hujjatlar")

  await page.locator("input[type=file]").setInputFiles("D:\\tmp\\e2e-not-a-docx.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await expect(page.getByText("Fayl turi mos emas")).toBeVisible()

  await page.locator("input[type=file]").setInputFiles("content/namuna/qaror-qr-11.docx")
  await page.getByRole("button", { name: "Hujjatni yuklash" }).click()
  await page.waitForURL(/\/hujjatlar\/[0-9a-f-]{36}$/i, { timeout: 90_000 })
  await expect(page.getByRole("link", { name: "Asl faylni ochish" })).toBeVisible()
})

test("namuna hisobot va versiya solishtirish ochiladi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  const pdf = await page.request.get("/api/baholash/BH-04/fayl?tur=pdf")
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()["content-type"]).toContain("pdf")
  const pdfBody = await pdf.body()
  expect(pdfBody.subarray(0, 5).toString()).toBe("%PDF-")
  expect(pdfBody.toString("latin1")).toContain("Namuna hisobot")
  const word = await page.request.get("/api/baholash/BH-04/fayl?tur=docx")
  expect(word.status()).toBe(200)
  const wordBody = await word.body()
  expect(wordBody.subarray(0, 2).toString()).toBe("PK")
  expect(wordBody.toString("latin1")).toContain("word/document.xml")
  expect(wordBody.toString("latin1")).toContain("Namuna hisobot")

  await page.goto("/reyestr/TTB-01")
  await expect(page.getByRole("heading", { name: /Versiya 1\.0/ })).toBeVisible()
  await expect(page.getByRole("heading", { name: /Versiya 1\.1/ })).toBeVisible()
  await expect(page.getByText("Olib tashlangan: Litsenziya uchun 7 ta hujjat talab qilinadi.")).toBeVisible()
  await expect(page.getByText("Qo'shilgan: Litsenziya uchun 4 ta hujjat talab qilinadi.")).toBeVisible()
})

test("baholovchi hujjat faylini ocha olmaydi", async ({ page }) => {
  await kirish(page, "ijrochi")
  const response = await page.request.get("/api/hujjat/namuna-qr-11/fayl")
  expect(response.status()).toBe(403)
  const report = await page.request.get("/api/baholash/BH-01/fayl?tur=pdf")
  expect(report.status()).toBe(403)
})
