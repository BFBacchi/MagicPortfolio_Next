-- Script COMPLETO para corregir las políticas RLS de la tabla projects
-- Ejecutar en Supabase SQL Editor
-- IMPORTANTE: Este script elimina y recrea todas las políticas

-- ============================================
-- PASO 1: Verificar estado actual
-- ============================================
SELECT 
    'Estado actual de RLS' as info,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'projects';

SELECT 
    'Políticas actuales' as info,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'projects'
ORDER BY cmd, policyname;

-- ============================================
-- PASO 2: Eliminar TODAS las políticas existentes
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;
DROP POLICY IF EXISTS "Allow public insert" ON projects;
DROP POLICY IF EXISTS "Allow public update" ON projects;
DROP POLICY IF EXISTS "Allow public delete" ON projects;

-- ============================================
-- PASO 3: Asegurar que RLS está habilitado
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 4: Crear políticas nuevas
-- ============================================

-- Política 1: Lectura pública (SELECT) - Todos pueden leer
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT 
    USING (true);

-- Política 2: Inserción (INSERT) - Solo usuarios autenticados
CREATE POLICY "Allow authenticated insert" ON projects
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Política 3: Actualización (UPDATE) - Solo usuarios autenticados
CREATE POLICY "Allow authenticated update" ON projects
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Política 4: Eliminación (DELETE) - Solo usuarios autenticados
CREATE POLICY "Allow authenticated delete" ON projects
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);

-- ============================================
-- PASO 5: Verificar que las políticas se crearon correctamente
-- ============================================
SELECT 
    'Políticas creadas' as info,
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 100)
        ELSE 'Sin condición USING'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || substring(with_check::text, 1, 100)
        ELSE 'Sin condición WITH CHECK'
    END as with_check_clause
FROM pg_policies 
WHERE tablename = 'projects'
ORDER BY cmd, policyname;

-- ============================================
-- PASO 6: Verificar permisos de la tabla
-- ============================================
SELECT 
    'Permisos de tabla' as info,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'projects'
AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;

-- ============================================
-- PASO 7: Probar que las funciones de auth están disponibles
-- ============================================
SELECT 
    'Funciones de auth disponibles' as info,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'auth'
AND routine_name IN ('uid', 'role', 'jwt')
ORDER BY routine_name;

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. Las políticas usan auth.uid() IS NOT NULL para verificar autenticación
-- 2. Esto significa que cualquier usuario autenticado puede hacer CRUD
-- 3. Si quieres restringir más, puedes modificar las políticas para verificar
--    el email del usuario o usar roles específicos
-- 4. Asegúrate de que el usuario esté autenticado antes de intentar actualizar

