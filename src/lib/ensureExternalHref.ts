/**
 * Once UI `ElementType` solo usa `<a>` externo si el href coincide con `^https?:\/\/`.
 * Sin esquema, Next `Link` trata el valor como ruta y antepone el dominio del portfolio.
 */
export function ensureExternalHref(
  href: string | undefined | null
): string | undefined {
  const raw = typeof href === "string" ? href.trim() : "";
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  if (/^mailto:/i.test(raw) || /^tel:/i.test(raw)) return raw;
  if (/^\/\//.test(raw)) return `https:${raw}`;
  return `https://${raw.replace(/^\/+/, "")}`;
}
