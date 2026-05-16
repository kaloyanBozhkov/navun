import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_REQUIRED_PREFIXES = [
  "/profile",
  "/friends",
  "/add-friend",
  "/add-event",
  "/my-events",
  "/approvals",
  "/business-profile",
];

const BUSINESS_PREFIXES = ["/add-event", "/my-events", "/business-profile"];
const ADMIN_PREFIXES = ["/approvals"];

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

    const role = (token.role as string) ?? "USER";

    // Business routes require BUSINESS role + approved, or ADMIN
    const needsBusiness = BUSINESS_PREFIXES.some(
      (prefix) => pathname.startsWith(`${prefix}/`) || pathname === prefix
    );
    if (needsBusiness && role !== "ADMIN" && role !== "BUSINESS") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Admin routes require ADMIN role
    const needsAdmin = ADMIN_PREFIXES.some(
      (prefix) => pathname.startsWith(`${prefix}/`) || pathname === prefix
    );
    if (needsAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
