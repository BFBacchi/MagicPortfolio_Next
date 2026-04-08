-- Script de diagnóstico para problemas de actualización de proyectos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que la tabla projects existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'projects';

-- 2. Verificar las políticas RLS actuales
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'projects'
ORDER BY cmd, policyname;

-- 3. Verificar si RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'projects';

-- 4. Verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- 5. Verificar si hay proyectos en la tabla
SELECT 
    id,
    slug,
    title,
    created_at
FROM projects
LIMIT 5;

-- 6. Verificar permisos del rol anon
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'projects'
AND grantee IN ('anon', 'authenticated', 'public');

-- 7. Probar una actualización directa (solo para diagnóstico)
-- NOTA: Esto solo funcionará si tienes permisos de superusuario
-- Descomenta solo si necesitas probar directamente
/*
UPDATE projects 
SET title = title || ' (test)'
WHERE id = 1
RETURNING id, title;
*/

-- 8. Verificar funciones de autenticación disponibles
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'auth'
AND routine_name IN ('uid', 'role', 'jwt')
ORDER BY routine_name;

