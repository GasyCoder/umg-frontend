import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude routes that should always be accessible
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") || // Front API routes
    pathname.startsWith("/_next") ||
    pathname.includes("/static") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2)$/) ||
    pathname === "/maintenance"
  ) {
    return NextResponse.next();
  }

  // 2. Check maintenance status from Backend API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    // Short timeout to prevent blocking site if API is slow
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${apiUrl}/maintenance-status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache for 60s to avoid spamming API
    });
    
    clearTimeout(timeoutId);

    if (res.ok) {
        const data = await res.json();
        
        // If maintenance is ON, redirect to maintenance page
        if (data.maintenance_mode === true) {
            return NextResponse.rewrite(new URL("/maintenance", request.url));
        }
    }
  } catch (error) {
    // If API check fails, we generally fail OPEN (allow access) 
    // or fail functionality. Here failing open is safer for stability.
    // console.error("Middleware check failed:", error);
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
