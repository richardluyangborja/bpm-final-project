import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt, SESSION_COOKIE_KEY } from "./lib/session"

const publicRoutes = ["/"]

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAdminRoute = path.startsWith("/admin")
  const isCollectorRoute = path.startsWith("/collector")
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get(SESSION_COOKIE_KEY)?.value
  const session = await decrypt(cookie)

  // block access on private routes if session is unauthenticated
  if ((isAdminRoute || isCollectorRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // redirect to admin route if the session is admin
  if (
    isPublicRoute &&
    session?.userId &&
    session.role === "ADMIN" &&
    !req.nextUrl.pathname.startsWith("/admin/collector-management")
  ) {
    return NextResponse.redirect(
      new URL("/admin/collector-management", req.nextUrl)
    )
  }

  // redirect to collector route if the session is collector
  if (
    isPublicRoute &&
    session?.userId &&
    session.role === "COLLECTOR" &&
    !req.nextUrl.pathname.startsWith("/collector/record-payments")
  ) {
    return NextResponse.redirect(
      new URL("/collector/record-payments", req.nextUrl)
    )
  }

  // block access if the role is not admin
  if (isAdminRoute && session?.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/collector/record-payments", req.nextUrl)
    )
  }

  // block access if the role is not collector
  if (isCollectorRoute && session?.role !== "COLLECTOR") {
    return NextResponse.redirect(
      new URL("/admin/collector-management", req.nextUrl)
    )
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
