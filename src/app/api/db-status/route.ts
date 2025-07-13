import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Intentar una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      status: 'connected',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString(),
      connectionInfo: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'unknown',
        database: 'supabase',
        ssl: 'enabled'
      },
      projectsCount: data?.length || 0
    });
  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection failed',
      error: {
        code: error.code || 'UNKNOWN',
        message: error.message || 'Unknown error',
        details: error.details || null,
        hint: error.hint || null
      },
      suggestions: [
        'Verifica que las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas',
        'Asegúrate de que la tabla "projects" existe en tu base de datos de Supabase',
        'Verifica que las políticas de seguridad de Supabase permitan acceso anónimo a la tabla projects',
        'Revisa los logs de Supabase para más detalles'
      ]
    }, { status: 500 });
  }
} 