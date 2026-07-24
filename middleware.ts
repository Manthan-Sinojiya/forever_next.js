import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rateLimitMap = new Map();

export default withAuth(
  function middleware(req) {
    const ip = (req as any).ip || req.headers.get("x-forwarded-for") || "unknown";
    
    // Apply basic rate limiting for API routes
    if (req.nextUrl.pathname.startsWith("/api")) {
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute
      const limit = 100; // 100 requests per minute
      
      const record = rateLimitMap.get(ip) || { count: 0, startTime: now };
      
      if (now - record.startTime > windowMs) {
        record.count = 1;
        record.startTime = now;
      } else {
        record.count++;
      }
      
      rateLimitMap.set(ip, record);
      
      if (record.count > limit) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }

    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return null;
    }

    if (!isAuth && isAdminPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect Admin API Routes from unauthorized mutations
    if (isApiRoute && req.method !== "GET") {
      const publicPostRoutes = ["/api/checkout", "/api/orders", "/api/auth", "/api/login", "/api/signup", "/api/upload", "/api/users", "/api/wishlist", "/api/profile"];
      const isPublic = publicPostRoutes.some(route => req.nextUrl.pathname.startsWith(route));
      if (!isPublic && token?.role !== "admin") {
        return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
      }
    }

    return null;
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
    "/login",
    "/api/checkout/:path*", 
    "/api/orders/:path*", 
    "/api/users/:path*", 
    "/api/wishlist/:path*", 
    "/api/profile/:path*",
    "/api/admin/:path*" // if any
  ],
};
