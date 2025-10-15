import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para los proyectos
export interface Project {
  id: number
  slug: string
  title: string
  published_at: string
  summary: string
  images: string[]
  tag: string
  link: string
  content: string
  created_at: string
  video_url?: string
  technologies?: string[]
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  video_thumbnail?: string
}

// Función para obtener todos los proyectos
export async function getProjectsFromDB(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data || []
}

// Función para obtener un proyecto por slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
}

// Función para crear un nuevo proyecto
export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }

  return data
}

// Función para actualizar un proyecto existente
export async function updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }

  return data
}

// Función para eliminar un proyecto
export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }
} 