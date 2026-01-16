import { NextRequest, NextResponse } from "next/server";

function parseHosts(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminHosts = parseHosts(process.env.ADMIN_HOSTS);
  if (adminHosts.length === 0) {
    return NextResponse.next();
  }

  const currentHost = req.headers.get("host") || req.nextUrl.host;
  if (!currentHost || adminHosts.includes(currentHost)) {
    return NextResponse.next();
  }

  const targetHost = adminHosts[0];
  const url = req.nextUrl.clone();
  url.host = targetHost;
  url.protocol = req.nextUrl.protocol;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
