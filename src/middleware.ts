import { type NextRequest, NextResponse } from "next/server";

/**
 * Protected route prefixes that require authentication.
 * The middleware checks for the access_token cookie presence.
 * Actual token signature validation happens on the backend — a 401 from
 * the API will cause the frontend to redirect to /login.
 */
const PROTECTED_PREFIXES = ["/admin"];

/**
 * Auth routes — redirect authenticated users away from these.
 */
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  let isAuthenticated = false;
  let role = "";
  if (accessToken) {
    try {
      const parts = accessToken.split(".");
      const payloadPart = parts[1];
      if (parts.length === 3 && payloadPart) {
        const payloadStr = atob(
          payloadPart.replace(/-/g, "+").replace(/_/g, "/"),
        );
        const payload = JSON.parse(payloadStr);

        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          isAuthenticated = true;
          role = payload.role?.toLowerCase() || "";
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Redirect unauthenticated users from protected routes to /login.
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect already-authenticated users away from /login.
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
