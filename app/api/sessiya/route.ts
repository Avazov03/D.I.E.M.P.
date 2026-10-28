import { NextResponse } from "next/server"
import { publicUser } from "@/lib/diemp/access"
import { currentUser } from "@/lib/diemp/session"

export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
  return NextResponse.json(publicUser(user))
}
