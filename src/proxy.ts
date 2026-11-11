import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with SESSION_COOKIE_NAME in src/lib/auth/session.ts
const SESSION_COOKIE_NAME = "admin_session";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/unauthorized"]);

/**
 * Optimistic check only: redirects to login when there's no session cookie.
 * The real validation against the database happens in requireAdmin()
 * (src/lib/auth) on every admin page and action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
