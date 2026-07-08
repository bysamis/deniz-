import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "resort_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/setup") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValidSession(token);

  if (!isPublicPath && !authed) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && authed) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
