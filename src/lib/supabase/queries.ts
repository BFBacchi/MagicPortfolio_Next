import { supabase } from '../supabase'

// Tipos para los datos del About
export interface Introduction {
  id: number
  name: string
  role: string
  description: string
  avatar_url?: string
  created_at: string
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  start_date: string
  end_date: string | null
  description: string
  technologies: string[]
  created_at: string
}

export interface Study {
  id: number
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  description: string
  created_at: string
}

export interface TechnicalSkill {
  id?: number
  name: string
  category: string
  level: string
  user_id: string
  created_at?: string
}

// Función para obtener la introducción
export async function getIntroduction(): Promise<Introduction | null> {
  const { data, error } = await supabase
    .from('introduction')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching introduction:', error)
    return null
  }

  return data
}

// Función para obtener experiencia laboral
export async function getWorkExperience(): Promise<WorkExperience[]> {
  const { data, error } = await supabase
    .from('work_experience')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching work experience:', error)
    return []
  }

  return data || []
}

// Función para obtener estudios
export async function getStudies(): Promise<Study[]> {
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching studies:', error)
    return []
  }

  return data || []
}

// Función para obtener habilidades técnicas
export async function getTechnicalSkills(userId?: string): Promise<TechnicalSkill[]> {
  let query = supabase
    .from('technical_skills')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    // Si no se pasa userId, obtener todas las habilidades (para compatibilidad)
    console.log('No userId provided, fetching all technical skills')
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching technical skills:', error)
    return []
  }

  console.log('Fetched technical skills:', data?.length || 0, 'records')
  return data || []
} 