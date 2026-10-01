import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, sessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Cron endpoint authenticates itself with CRON_SECRET.
  if (pathname === "/login" || pathname === "/api/login" || pathname.startsWith("/api/cron/")) {
    return NextResponse.next();
  }
  if (req.cookies.get(COOKIE)?.value === (await sessionToken())) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = { matcher: ["/((?!_next/|favicon.ico).*)"] };
