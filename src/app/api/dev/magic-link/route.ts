import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLastMagicLink } from "@/lib/dev-magic-link";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const url = getLastMagicLink(email);
  return NextResponse.json({ url });
}
