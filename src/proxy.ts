import { type NextRequest, NextResponse } from "next/server";

/**
 * Protected route prefixes that require authentication.
 */
const PROTECTED_PREFIXES = ["/admin"];

/**
 * Auth routes — redirect authenticated users away from these.
 */
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowerPathname = pathname.toLowerCase();
  const accessToken = request.cookies.get("access_token")?.value;

  let isAuthenticated = false;
  let role = "";

  // Validate JWT access token structure and expiration
  if (accessToken && accessToken.trim() !== "") {
    try {
      const parts = accessToken.split(".");
      const payloadPart = parts[1];
      if (parts.length === 3 && payloadPart) {
        const payloadStr = atob(
          payloadPart.replace(/-/g, "+").replace(/_/g, "/"),
        );
        const payload = JSON.parse(payloadStr);

        const currentTime = Math.floor(Date.now() / 1000);
        if (
          payload.exp &&
          typeof payload.exp === "number" &&
          payload.exp > currentTime
        ) {
          isAuthenticated = true;
          role = (payload.role || "")
            .toString()
            .toLowerCase()
            .replace(/[-_]/g, " ")
            .trim();
        }
      }
    } catch {
      // Invalid token structure or parsing failure
      isAuthenticated = false;
    }
  }

  const isAdminRole = role === "admin" || role === "super admin";
  const isBillingUser = role === "billing user";

  // Helper to clear invalid/expired auth cookies on redirect
  const clearAuthCookies = (response: NextResponse) => {
    response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  };

  // 1. Protection for /admin routes
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    lowerPathname.startsWith(prefix),
  );
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      const res = NextResponse.redirect(loginUrl);
      if (accessToken) {
        clearAuthCookies(res);
      }
      return res;
    }

    // Only admin and billing user roles can access /admin routes
    if (!isAdminRole && !isBillingUser) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Role-based restrictions inside /admin: billing users can only access /admin/billing
    if (isBillingUser) {
      const isBillingPath = lowerPathname.startsWith("/admin/billing");
      if (!isBillingPath) {
        return NextResponse.redirect(new URL("/admin/billing", request.url));
      }
    }
  }

  // 2. Strict access control for /profile and its sub-routes (/profile/*)
  const isProfileRoute =
    lowerPathname === "/profile" || lowerPathname.startsWith("/profile/");
  if (isProfileRoute) {
    // If not authenticated, redirect to /login with return URL
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      const res = NextResponse.redirect(loginUrl);
      if (accessToken) {
        clearAuthCookies(res);
      }
      return res;
    }

    // Admin/Billing accounts should be routed to their respective dashboards instead of customer profile
    if (isAdminRole) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (isBillingUser) {
      return NextResponse.redirect(new URL("/admin/billing", request.url));
    }

    return NextResponse.next();
  }

  // 3. Redirect already-authenticated users away from auth routes (/login, /register)
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    lowerPathname.startsWith(route),
  );
  if (isAuthRoute && isAuthenticated) {
    if (isAdminRole) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (isBillingUser) {
      return NextResponse.redirect(new URL("/admin/billing", request.url));
    } else {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      if (
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.includes(":")
      ) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
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
