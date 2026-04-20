import { getProjectsFromDB, getProjectBySlug, Project } from './supabase'

// Re-exportar las funciones de Supabase
export { getProjectsFromDB, getProjectBySlug }
export type { Project }

/**
 * Slugs incluidos en `generateStaticParams` (SSG). Caracteres como `:` rompen
 * carpetas `.next` en Windows; aquí se filtran solo para pre-render estático.
 */
export function isSafeProjectSlug(slug: string | undefined | null): boolean {
  const s = typeof slug === "string" ? slug.trim() : "";
  if (!s || s.length > 256) return false;
  if (s.includes("://")) return false;
  if (/[<>:"|?*\x00-\x1f\\/]/.test(s)) return false;
  return true;
}

/**
 * ¿Puede mostrarse el enlace a `/work/...`? Más permisivo que {@link isSafeProjectSlug}
 * (permite `:`, `?`, `|`, etc.). La ruta usa `encodeURIComponent` para coincidir con Next.
 * Sigue bloqueando `://` (URL guardada como slug) y separadores de ruta.
 */
export function isLinkableProjectSlug(slug: string | undefined | null): boolean {
  const s = typeof slug === "string" ? slug.trim() : "";
  if (!s || s.length > 256) return false;
  if (s.includes("://")) return false;
  if (/[\x00-\x1f\\/]/.test(s)) return false;
  return true;
}

/** Ruta interna del detalle del proyecto (tabla `projects`). */
export function hrefForWorkProject(slug: string | undefined | null): string | undefined {
  if (!isLinkableProjectSlug(slug)) return undefined;
  return `/work/${encodeURIComponent((slug as string).trim())}`;
}

// Función de compatibilidad para mantener la API existente
export async function getProjects() {
  return await getProjectsFromDB()
}

export async function getProject(slug: string) {
  return await getProjectBySlug(slug)
} 