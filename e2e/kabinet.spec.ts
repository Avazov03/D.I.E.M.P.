import { expect, test } from "@playwright/test"
import { kirish, tanla } from "./yordam"

test("rahbar kesimi, diagramma va rasmiy foiz ishlaydi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await expect(page.getByText("TTB kesimi")).toBeVisible()
  await expect(page.getByText("Baholash dinamikasi")).toBeVisible()
  await expect(page.getByText("Holat taqsimoti")).toBeVisible()
  await expect(page.getByText("O'rtacha sof ta'sir")).toBeVisible()
  await expect(page.getByText("Ma'muriy yuk")).toBeVisible()

  await tanla(page, /So'nggi 10 oy/, "Joriy oy")
  await expect(page.getByText("Oldingi oyga nisbatan hisoblanmaydi")).toBeVisible()

  await page.getByRole("link", { name: /Tekshiruvda/ }).first().click()
  await expect(page).toHaveURL(/\/baholash\?holat=tekshiruvda/)
  await expect(page.getByRole("cell", { name: "BH-01", exact: true })).toBeVisible()
})

test("baholash varaqasi sof ta'sirni kodda hisoblaydi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.goto("/baholash/BH-01")
  await expect(page.getByText("360")).toBeVisible()
  await expect(page.getByText("Sof ta'sir")).toBeVisible()
  await page.getByRole("button", { name: "Ekspert tasdiqlasin" }).click()
  await expect(page.getByText(/Tasdiqlandi/)).toBeVisible()
})

test("tahlilchi diagrammani ko'radi, TTB kesimisiz", async ({ page }) => {
  await kirish(page, "tahlilchi")
  await expect(page.getByText("Baholash dinamikasi")).toBeVisible()
  await expect(page.getByText("Holat taqsimoti")).toBeVisible()
  await expect(page.getByText("TTB kesimi")).toHaveCount(0)
})
