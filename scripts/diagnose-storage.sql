-- Script de diagnóstico completo para storage
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Verificar configuración del bucket
SELECT 
    'BUCKET CONFIGURATION' as section,
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'magicportfolio';

-- 2. Verificar políticas existentes
SELECT 
    'EXISTING POLICIES' as section,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%magicportfolio%';

-- 3. Verificar si hay archivos en el bucket
SELECT 
    'EXISTING FILES' as section,
    name,
    bucket_id,
    owner,
    created_at,
    updated_at
FROM storage.objects 
WHERE bucket_id = 'magicportfolio'
LIMIT 10;

-- 4. Verificar configuración de RLS en storage.objects
SELECT 
    'RLS STATUS' as section,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 5. Verificar permisos del usuario actual
SELECT 
    'CURRENT USER PERMISSIONS' as section,
    current_user as user,
    session_user as session_user,
    auth.uid() as auth_uid,
    auth.role() as auth_role; 