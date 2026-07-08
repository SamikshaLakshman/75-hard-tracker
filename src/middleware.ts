import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isApi = pathname.startsWith("/api");

  if (!token && !isAuth && !isApi && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)"],
};
