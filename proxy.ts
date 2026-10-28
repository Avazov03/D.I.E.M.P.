import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { canOpen, sessionCookie, userById } from "@/lib/diemp/access"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/auth") || pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  const user = userById(request.cookies.get(sessionCookie)?.value)
  if (pathname === "/api/kirish") return NextResponse.next()

  if (!user) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ xato: "Kirish kerak" }, { status: 401 })
    const url = request.nextUrl.clone()
    url.pathname = "/auth/auth2/login"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/api/")) return NextResponse.next()
  if (!canOpen(user.rol, pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
}
