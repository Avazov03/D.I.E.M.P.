import { expect, test } from "@playwright/test"
import { kirish } from "./yordam"

test("AI savoli rasmiy hisobni o'zi yozmaydi", async ({ page }) => {
  test.setTimeout(150_000)
  await kirish(page, "rahbariyat")
  await page.goto("/tahlil")
  const box = page.getByPlaceholder("Savolni yozing")
  await expect(box).toHaveValue(/baholashlar/)
  await box.fill("ab")
  await expect(page.getByRole("button", { name: "So'rash" })).toBeDisabled()
  await box.fill("Qaysi baholashlar hali tasdiqlanmagan?")
  await page.getByRole("button", { name: "So'rash" }).click()
  await expect(page.getByText(/Sof ta'sir, kod hisobi|javob chegarasida|javob bermadi|Rasmiy ko'rsatkichlar/).first()).toBeVisible({ timeout: 100_000 })
  if (await page.getByText("Sof ta'sir, kod hisobi").isVisible()) {
    await expect(page.getByText("rasmiy fakt emas")).toBeVisible()
  }
  await page.getByRole("link", { name: "Manbani ochish" }).first().click()
  await expect(page).toHaveURL(/\/baholash\?holat=tekshiruvda/)
})

test("ekspert umumiy AI sahifasiga kirmaydi", async ({ page }) => {
  await kirish(page, "nazorat")
  await page.goto("/tahlil")
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("heading", { name: "AI yordamchi", exact: true })).toHaveCount(0)
})

test("ekspert baholashni tasdiqlay oladi", async ({ page }) => {
  await kirish(page, "nazorat")
  await page.goto("/baholash/BH-01")
  await expect(page.getByRole("button", { name: "Ekspert tasdiqlasin" })).toBeVisible()
  await page.getByRole("button", { name: "Ekspert tasdiqlasin" }).click()
  await expect(page.getByText(/Tasdiqlandi/)).toBeVisible()
  await page.reload()
  await expect(page.getByText("Tasdiqlangan").first()).toBeVisible()
})
