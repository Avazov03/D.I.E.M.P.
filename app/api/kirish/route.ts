import { NextResponse } from "next/server"
import { findUser, publicUser, sessionCookie } from "@/lib/diemp/access"

export async function POST(request: Request) {
  let pochta = ""
  let parol = ""
  try {
    const body = (await request.json()) as { pochta?: unknown; parol?: unknown }
    pochta = typeof body.pochta === "string" ? body.pochta : ""
    parol = typeof body.parol === "string" ? body.parol : ""
  } catch {
    return NextResponse.json({ xato: "Ma'lumot o'qilmadi" }, { status: 400 })
  }

  const user = findUser(pochta, parol)
  if (!user) return NextResponse.json({ xato: "Pochta yoki parol noto'g'ri" }, { status: 401 })

  const response = NextResponse.json(publicUser(user))
  response.cookies.set(sessionCookie, user.id, { httpOnly: true, sameSite: "lax", path: "/" })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionCookie, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  return response
}
