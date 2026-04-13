import { getProjectsFromDB, getProjectBySlug, Project } from './supabase'

// Re-exportar las funciones de Supabase
export { getProjectsFromDB, getProjectBySlug }
export type { Project }

/** Slugs con `://`, `/` o caracteres de ruta rompen SSG (p. ej. en Windows) y no son rutas válidas. */
export function isSafeProjectSlug(slug: string | undefined | null): boolean {
  const s = typeof slug === "string" ? slug.trim() : "";
  if (!s || s.length > 256) return false;
  if (s.includes("://")) return false;
  if (/[<>:"|?*\x00-\x1f\\/]/.test(s)) return false;
  return true;
}

// Función de compatibilidad para mantener la API existente
export async function getProjects() {
  return await getProjectsFromDB()
}

export async function getProject(slug: string) {
  return await getProjectBySlug(slug)
} 