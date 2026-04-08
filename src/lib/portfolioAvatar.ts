import { cache } from "react";
import { getIntroduction } from "@/lib/supabase/queries";
import { person, baseURL } from "@/resources";

function absoluteFromSitePath(path: string): string {
  const b = baseURL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Avatar del portfolio: URL de `introduction.avatar_url` (Supabase) o recurso estático (p. ej. /favicon.ico).
 * `imgSrc` sirve para <img src> y metadata.icons; `absoluteForSeo` para JSON-LD (siempre absoluta).
 */
export const getPortfolioAvatarForSite = cache(async () => {
  try {
    const intro = await getIntroduction();
    const u = intro?.avatar_url?.trim();
    if (u && /^https?:\/\//i.test(u)) {
      return { imgSrc: u, absoluteForSeo: u };
    }
  } catch {
    /* env sin Supabase, etc. */
  }

  const raw = person.avatar || "/favicon.ico";
  if (/^https?:\/\//i.test(raw)) {
    return { imgSrc: raw, absoluteForSeo: raw };
  }
  const imgSrc = raw.startsWith("/") ? raw : `/${raw}`;
  return {
    imgSrc,
    absoluteForSeo: absoluteFromSitePath(imgSrc),
  };
});
