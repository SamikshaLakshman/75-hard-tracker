import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that redirect an already-logged-in user away (e.g. don't show login page if signed in)
const AUTH_ROUTES = ["/login", "/signup"];

// Routes that are always public — no auth required, and no redirect either way
const PUBLIC_ROUTES = ["/terms", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isApi = pathname.startsWith("/api");

  if (!token && !isAuthRoute && !isPublicRoute && !isApi && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)"],
};
