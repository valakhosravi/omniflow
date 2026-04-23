import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccessMap } from "./utils/routeAccessMap";
import { decodeJWT } from "./utils/decodeJWT";

interface DecodedToken {
  ServiceIds?: number[];
  exp?: number;
}

const getRequiredServices = (pathname: string): number[] | null => {
  const sortedPaths = Object.keys(routeAccessMap).sort(
    (a, b) => b.length - a.length,
  );
  for (const path of sortedPaths) {
    if (pathname.startsWith(path)) {
      return routeAccessMap[path];
    }
  }
  return null;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/pictures") ||
    pathname.startsWith("/logout")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!accessToken || !!refreshToken;

  // Check if user is on homepage
  const isOnHomePage = pathname === "/";

  if (
    (accessToken === undefined || refreshToken === undefined) &&
    !isOnHomePage
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/logout";
    url.searchParams.set("message", "token_expired");
    const response = NextResponse.redirect(url);
    response.cookies.set("access_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return NextResponse.redirect(url);
  }

  const isOnUnauthorizedPage = pathname === "/unauthorized";

  if (!isAuthenticated && !isOnHomePage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (
    isOnHomePage ||
    isOnUnauthorizedPage ||
    !isAuthenticated ||
    !accessToken
  ) {
    return NextResponse.next();
  }

  const requiredServices = getRequiredServices(pathname);
  if (requiredServices) {
    const decodedToken = decodeJWT<DecodedToken>(accessToken);
    if (!decodedToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // const hasAccess = requiredServices.every((id) => userServices.includes(id));
    const hasAccess = true;

    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
