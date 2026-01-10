import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("umg_admin_token")?.value;

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLogin = req.nextUrl.pathname === "/admin/login";

  if (isAdminPath && !isLogin && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};