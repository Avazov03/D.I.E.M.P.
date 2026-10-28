import { expect, test } from "@playwright/test"
import { kirish } from "./yordam"

test("dalil rasm, AI chegarasi va odam qarori", async ({ page }) => {
  test.setTimeout(150_000)
  await kirish(page, "ijrochi")
  await page.goto("/dalillar/dalil-qurilish")
  await expect(page.getByRole("heading", { name: "Opps!!!" })).toBeVisible()
  const hidden = await page.request.get("/api/dalil/dalil-qurilish/fayl")
  expect(hidden.status()).toBe(404)

  await page.context().clearCookies()
  await kirish(page, "koordinator")
  await page.goto("/dalillar/dalil-qurilish")
  await expect(page.getByRole("img", { name: "Qurilish maydoni surati" })).toBeVisible()
  await expect(page.getByRole("button", { name: "AI rasmni tekshirsin" })).toHaveCount(0)
  const image = await page.request.get("/api/dalil/dalil-qurilish/fayl")
  expect(image.status()).toBe(200)
  expect(image.headers()["content-type"]).toContain("image/jpeg")

  await page.context().clearCookies()
  await kirish(page, "tahlilchi")
  await page.goto("/dalillar/dalil-stullar")
  await page.getByRole("button", { name: "AI rasmni tekshirsin" }).click()
  await expect(page.getByText(/Mos emas|Mos|Aniqlanmagan|javob chegarasida|javob bermadi|Tekshiruv olinmadi/).first()).toBeVisible({ timeout: 100_000 })
  await expect(page.getByText("Tekshiruvda")).toBeVisible()

  await page.context().clearCookies()
  await kirish(page, "nazorat")
  await page.goto("/dalillar/dalil-portal")
  await expect(page.getByRole("link", { name: "Asl hujjat" })).toBeVisible()
  await page.getByRole("button", { name: "Dalil mos", exact: true }).click()
  await expect(page.getByText("Tasdiqlangan")).toBeVisible()
  await page.goto("/dalillar")
  await expect(page.getByRole("link", { name: /Portal ekrani/ })).toContainText("Tasdiqlangan")
})

test("AI savoli rasmiy foizni o'zi yozmaydi", async ({ page }) => {
  test.setTimeout(150_000)
  await kirish(page, "rahbariyat")
  await page.goto("/tahlil")
  const box = page.getByPlaceholder("Savolni yozing")
  await expect(box).toHaveValue(/Qaysi topshiriqlar/)
  await box.fill("ab")
  await expect(page.getByRole("button", { name: "So'rash" })).toBeDisabled()
  await box.fill("Qaysi topshiriqlar muddati bo'yicha xavf ostida?")
  await page.getByRole("button", { name: "So'rash" }).click()
  await expect(page.getByText(/Jismoniy, kod hisobi|javob chegarasida|javob bermadi|Rasmiy ko'rsatkichlar/).first()).toBeVisible({ timeout: 100_000 })
  if (await page.getByText("Jismoniy, kod hisobi").isVisible()) {
    await expect(page.getByText("67%").first()).toBeVisible()
    await expect(page.getByText("71%").first()).toBeVisible()
    await expect(page.getByText("rasmiy fakt emas")).toBeVisible()
  }
  await page.getByRole("link", { name: "Manbani ochish" }).first().click()
  await expect(page).toHaveURL(/\/xatarlar\?daraja=yuqori/)
})

test("nazorat umumiy AI sahifasiga kirmaydi", async ({ page }) => {
  await kirish(page, "nazorat")
  await page.goto("/tahlil")
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("heading", { name: "AI tahlil", exact: true })).toHaveCount(0)
})
