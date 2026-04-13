import { createClient } from '@supabase/supabase-js'
import { supabase as supabaseClient } from './supabase/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ No configurada');
  throw new Error('Variables de entorno de Supabase no configuradas. Verifica tu archivo .env.local');
}

// Usar el cliente compartido que tiene acceso a la sesión de autenticación
export const supabase = supabaseClient

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

export type ProjectsOrderBy = 'created_at' | 'published_at'

// Función para obtener todos los proyectos
export async function getProjectsFromDB(options?: {
  orderBy?: ProjectsOrderBy
}): Promise<Project[]> {
  const column = options?.orderBy ?? 'published_at'
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order(column, { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data || []
}

// Función para obtener un proyecto por slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
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
  } catch (err) {
    console.error('Unexpected error in getProjectBySlug:', err)
    return null
  }
}

// Función para crear un nuevo proyecto
export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  try {
    // Verificar sesión de autenticación
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error(`Error de autenticación: ${sessionError.message}`);
    }
    
    if (!session || !session.user) {
      throw new Error('No estás autenticado. Por favor, inicia sesión para crear proyectos.');
    }
    
    console.log('Creating project with user:', session.user.email);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      let errorMessage = error.message || 'Error desconocido al crear el proyecto';
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        errorMessage = 'No tienes permisos para crear proyectos. Verifica las políticas RLS en Supabase.';
      }
      
      throw new Error(errorMessage);
    }

    if (!data) {
      throw new Error('No se recibieron datos después de la creación');
    }

    return data
  } catch (err) {
    console.error('Unexpected error in createProject:', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Error inesperado al crear el proyecto');
  }
}

// Función para actualizar un proyecto existente
export async function updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
  try {
    // Verificar sesión de autenticación
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error(`Error de autenticación: ${sessionError.message}`);
    }
    
    if (!session || !session.user) {
      throw new Error('No estás autenticado. Por favor, inicia sesión para actualizar proyectos.');
    }
    
    console.log('Updating project with ID:', id);
    console.log('User authenticated:', session.user.email);
    console.log('Project data:', JSON.stringify(projectData, null, 2));
    
    // Intentar la actualización
    const updateResponse = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    console.log('Update response:', {
      hasData: !!updateResponse.data,
      hasError: !!updateResponse.error,
      data: updateResponse.data,
      error: updateResponse.error
    });

    // Verificar si hay error de manera más robusta
    if (updateResponse.error) {
      const error = updateResponse.error;
      
      // Intentar múltiples formas de acceder al error
      const errorMessage = error?.message || 
                          (error as any)?.error_description || 
                          (error as any)?.msg ||
                          'Error desconocido al actualizar el proyecto';
      
      const errorCode = error?.code || 
                       (error as any)?.statusCode ||
                       (error as any)?.status ||
                       '';
      
      const errorDetails = error?.details || 
                          (error as any)?.detail ||
                          '';
      
      const errorHint = error?.hint || '';
      
      // Log completo del error sin serialización
      console.error('=== ERROR DETAILS ===');
      console.error('Error object:', error);
      console.error('Error message:', errorMessage);
      console.error('Error code:', errorCode);
      console.error('Error details:', errorDetails);
      console.error('Error hint:', errorHint);
      console.error('Error keys:', error ? Object.keys(error) : 'No error object');
      console.error('Error string:', String(error));
      console.error('Error JSON:', JSON.stringify(error, null, 2));
      console.error('====================');
      
      // Determinar el mensaje de error apropiado
      let finalErrorMessage = errorMessage;
      
      if (errorCode === '42501' || errorMessage?.includes('permission') || errorMessage?.includes('policy') || errorMessage?.includes('RLS') || errorMessage?.includes('row-level security')) {
        finalErrorMessage = 'No tienes permisos para actualizar este proyecto. Las políticas RLS están bloqueando la operación. Ejecuta el script fix-projects-rls.sql en Supabase SQL Editor.';
      } else if (errorCode === 'PGRST116' || errorMessage?.includes('No rows') || errorMessage?.includes('not found')) {
        finalErrorMessage = `No se encontró el proyecto con el ID ${id}.`;
      } else if (!errorMessage || errorMessage === 'Error desconocido al actualizar el proyecto') {
        finalErrorMessage = `Error al actualizar el proyecto${errorCode ? ` (Código: ${errorCode})` : ''}. Verifica las políticas RLS en Supabase y que estés autenticado correctamente.`;
      }
      
      const fullErrorMessage = `${finalErrorMessage}${errorDetails ? ` - ${errorDetails}` : ''}${errorHint ? ` (${errorHint})` : ''}`;
      console.error('Throwing error:', fullErrorMessage);
      throw new Error(fullErrorMessage);
    }
    
    // Verificar que tenemos datos
    if (!updateResponse.data) {
      console.error('No data returned from update, but no error either');
      throw new Error('No se recibieron datos después de la actualización. Verifica que el proyecto existe y que tienes permisos.');
    }

    console.log('Project updated successfully:', updateResponse.data);
    return updateResponse.data
  } catch (err) {
    console.error('Unexpected error in updateProject:', err);
    if (err instanceof Error) {
      throw err;
    }
    // Si el error no es una instancia de Error, intentar convertirlo
    const errorMessage = typeof err === 'object' && err !== null 
      ? JSON.stringify(err, Object.getOwnPropertyNames(err))
      : String(err);
    throw new Error(`Error inesperado al actualizar el proyecto: ${errorMessage}`);
  }
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