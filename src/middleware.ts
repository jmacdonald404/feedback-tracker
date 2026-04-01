import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
