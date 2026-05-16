import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_REQUIRED_PREFIXES = ["/profile", "/friends", "/add-friend", "/add-event", "/my-events", "/approvals"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = AUTH_REQUIRED_PREFIXES.some(
    (prefix) => pathname.startsWith(`${prefix}/`) || pathname === prefix
  );

  if (needsAuth) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
