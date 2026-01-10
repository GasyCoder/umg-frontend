import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude routes that should ALWAYS be accessible
  // Admin routes, API routes, static files, and the maintenance page itself
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("/static") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2|webp|gif)$/) ||
    pathname === "/maintenance" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Check maintenance status from Backend API
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    
    // Short timeout to prevent blocking site if API is slow
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${apiUrl}/maintenance-status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store", // Don't cache to get real-time status
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      
      console.log("[Middleware] Maintenance check:", { 
        pathname, 
        maintenance_mode: data.maintenance_mode 
      });

      // If maintenance is ON, redirect to maintenance page
      if (data.maintenance_mode === true) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  } catch (error) {
    // If API check fails, fail OPEN (allow access) for stability
    console.error("[Middleware] Maintenance check failed:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
