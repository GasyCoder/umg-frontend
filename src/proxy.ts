// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseHosts(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isAsset(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/static") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2|webp|gif)$/) ||
    pathname === "/favicon.ico"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Always allow assets & next internals
  if (isAsset(pathname)) return NextResponse.next();

  const publicHosts = parseHosts(process.env.PUBLIC_HOSTS);
  const adminHosts = parseHosts(process.env.ADMIN_HOSTS);

  const host = (request.headers.get("host") || request.nextUrl.host || "").toLowerCase();
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  const isPublicHost = publicHosts.some((h) => host === h || host.endsWith(`.${h}`) || host.includes(h));
  const isAdminHost = adminHosts.some((h) => host === h || host.endsWith(`.${h}`) || host.includes(h));

  const token = request.cookies.get("umg_admin_token")?.value;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  // 2) Public hosts: block /admin
  if (isPublicHost && isAdminPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3) Admin host: redirect root → login (ou admin si token)
  if (isAdminHost && !isLocalhost && pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/admin" : "/admin/login", request.url));
  }

  // 4) Admin host: redirect non-admin routes → /admin
  // (except maintenance)
  if (isAdminHost && !isLocalhost && !isAdminPath && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 5) ADMIN AUTH CHECK
  if (isAdminPath) {
    // ✅ IMPORTANT: Toujours laisser /admin/login accessible
    // sinon boucle si token invalide/expiré
    if (isLoginPage) {
      return NextResponse.next();
    }

    // Accès aux autres pages admin: token requis
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // 6) Maintenance page always accessible
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // 7) Maintenance check for public routes
  try {
    const apiUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:8000/api/v1";

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
      if (data?.maintenance_mode === true) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  } catch {
    // ignore
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};