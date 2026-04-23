import { NextRequest, NextResponse } from "next/server";
import { APP_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE } from "./src/i18n/config";
import { isAppLocale } from "./src/i18n/locale";

const IGNORED_PREFIXES = ["/_next", "/api", "/favicon.ico", "/sitemap.xml", "/robots.txt"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const [, maybeLocale] = pathname.split("/");
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferredLocale = isAppLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  if (!isAppLocale(maybeLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${preferredLocale}` : `/${preferredLocale}${pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", maybeLocale);
  const rewritten = request.nextUrl.clone();
  rewritten.pathname = pathname.replace(`/${maybeLocale}`, "") || "/";

  const response = NextResponse.rewrite(rewritten, {
    request: { headers },
  });
  response.cookies.set(LOCALE_COOKIE, maybeLocale, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
