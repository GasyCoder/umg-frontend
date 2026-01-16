import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseHosts(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always allow static assets and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/static") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2|webp|gif)$/) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Admin host guard
  if (pathname.startsWith("/admin")) {
    const adminHosts = parseHosts(process.env.ADMIN_HOSTS);
    if (adminHosts.length > 0) {
      const currentHost = request.headers.get("host") || request.nextUrl.host;
      if (currentHost && !adminHosts.includes(currentHost)) {
        const url = request.nextUrl.clone();
        url.host = adminHosts[0];
        url.protocol = request.nextUrl.protocol;
        return NextResponse.redirect(url);
      }
    }
  }

  // 3. Admin authentication check
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("umg_admin_token")?.value;
    const isLoginPage = pathname === "/admin/login";
    
    // If no token and not on login page, redirect to login
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // If has token and on login page, redirect to dashboard
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    return NextResponse.next();
  }

  // 4. Maintenance page is always accessible
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // 5. Check maintenance status for public routes
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${apiUrl}/maintenance-status`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      console.log("[Middleware] Maintenance check:", { pathname, maintenance_mode: data.maintenance_mode });

      if (data.maintenance_mode === true) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  } catch (error) {
    // Ignore maintenance check errors when API is unreachable in dev.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
