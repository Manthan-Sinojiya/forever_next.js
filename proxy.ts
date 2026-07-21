import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED_USER_ROUTES = ["/profile", "/cart", "/wishlist", "/orders"];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

// Routes that redirect authenticated users away (login/signup)
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Also check the localStorage-based role for backward-compatibility with
  // the demo admin bypass (client-side only, cannot be read server-side).
  // For proper admin protection we rely on the NextAuth JWT token role claim.

  const isAuthenticated = !!token;
  const userRole = (token as Record<string, string> | null)?.role || "user";
  const isAdmin = userRole === "admin";

  // 1. Protect admin routes — redirect to login if not admin
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated but not an admin, redirect to homepage
    if (!isAdmin) {
      // Check if user came via the local admin bypass (demo mode)
      // We allow it through since the admin pages do their own client-side
      // access check via localStorage. Only enforce server-side for non-demo.
      // In production with real admin users, remove this allowance.
      const isDemoAdminBypass =
        request.cookies.get("next-auth.session-token") === undefined &&
        request.cookies.get("__Secure-next-auth.session-token") === undefined;

      if (!isDemoAdminBypass) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  }

  // 2. Protect standard user routes
  if (PROTECTED_USER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Check if user has a local-storage session (client-side only bypass)
      // Middleware cannot read localStorage, so we only protect based on JWT token.
      // If the user has localStorage credentials, the client-side redirect in the
      // page component will handle access control.
      // For strict enforcement, redirect unauthenticated JWT users to login.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Redirect already-authenticated users away from login/signup
  if (AUTH_ROUTES.some((route) => pathname === route)) {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, logo, public assets
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|logo|images|products|icons|api).*)",
  ],
};
