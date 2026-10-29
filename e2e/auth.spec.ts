import { expect, test } from "@playwright/test"
import { roleLabel, users } from "../lib/diemp/access"
import { kirish } from "./yordam"

test("noto'g'ri parol kirmaydi", async ({ page }) => {
  await page.goto("/auth/auth2/login")
  await page.getByLabel("Pochta*").fill("rahbar@diemp.uz")
  await page.getByLabel("Parol*").fill("boshqa-parol")
  await page.getByRole("button", { name: "Kabinetga kirish" }).click()
  await expect(page.getByText("Pochta yoki parol noto'g'ri")).toBeVisible()
  await expect(page).toHaveURL(/\/auth\/auth2\/login/)
})

test("har bir rol o'z tugmasidan kiradi", async ({ page }) => {
  for (const user of users) {
    await page.context().clearCookies()
    await kirish(page, user.rol)
    await expect(page.getByText(roleLabel[user.rol]).first()).toBeVisible()
  }
})

test("sessiyasiz sahifa va API yopiq", async ({ page, request }) => {
  await page.goto("/baholash")
  await expect(page).toHaveURL(/\/auth\/auth2\/login/)
  const response = await request.get("/api/sessiya")
  expect(response.status()).toBe(401)
})

test("kirishdan tashqari auth sahifalari ochiladi", async ({ page }) => {
  for (const path of ["/auth/error", "/auth/maintenance", "/auth/auth2/forgot-password", "/auth/auth2/register", "/auth/auth2/two-steps"]) {
    const response = await page.goto(path)
    expect(response?.ok()).toBeTruthy()
  }
})

test("chiqish seansni yopadi", async ({ page }) => {
  await kirish(page, "rahbariyat")
  await page.getByAltText("profile").click()
  await page.getByRole("button", { name: "Chiqish" }).click()
  await expect(page).toHaveURL(/\/auth\/auth2\/login/)
  await page.goto("/monitoring")
  await expect(page).toHaveURL(/\/auth\/auth2\/login/)
})
