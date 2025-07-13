import { getProjectsFromDB, getProjectBySlug, Project } from './supabase'

// Re-exportar las funciones de Supabase
export { getProjectsFromDB, getProjectBySlug }
export type { Project }

// Función de compatibilidad para mantener la API existente
export async function getProjects() {
  return await getProjectsFromDB()
}

export async function getProject(slug: string) {
  return await getProjectBySlug(slug)
} 