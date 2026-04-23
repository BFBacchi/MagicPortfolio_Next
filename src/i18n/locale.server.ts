import { cookies, headers } from "next/headers";
import { AppLocale, DEFAULT_LOCALE, LOCALE_COOKIE } from "./config";
import { isAppLocale } from "./locale";

export async function getRequestLocale(): Promise<AppLocale> {
  const headerBag = await headers();
  const fromHeader = headerBag.get("x-locale");
  if (isAppLocale(fromHeader)) return fromHeader;

  const cookieBag = await cookies();
  const fromCookie = cookieBag.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(fromCookie)) return fromCookie;

  return DEFAULT_LOCALE;
}
