import { APP_LOCALES, AppLocale } from "./config";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  if (!value) return false;
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/");
  const maybeLocale = segments[1];
  if (isAppLocale(maybeLocale)) {
    const stripped = `/${segments.slice(2).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/+$/, "");
  }
  return normalized === "" ? "/" : normalized;
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const maybeLocale = normalized.split("/")[1];
  return isAppLocale(maybeLocale) ? maybeLocale : null;
}

export function withLocalePath(pathname: string, locale: AppLocale): string {
  const base = stripLocalePrefix(pathname);
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}
