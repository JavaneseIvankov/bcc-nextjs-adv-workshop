import { auth } from "@/lib/auth";
import { userRepo } from "@/server/repositories";
import { NextRequest, NextResponse } from "next/server";

function toLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const path = request.nextUrl.pathname;
  const isAdminPath = path.startsWith("/admin") || path.startsWith("/api/admin");

  if (!session) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 },
      );
    }
    return toLoginRedirect(request);
  }

  if (isAdminPath) {
    const role = await userRepo.getRoleById(session.user.id);
    if (role !== "admin") {
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          { status: 403, message: "Forbidden", data: null },
          { status: 403 },
        );
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/checkout",
    "/api/reservations/:path*",
  ],
};
