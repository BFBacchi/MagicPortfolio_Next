-- Script para corregir las políticas RLS de la tabla projects
-- Ejecutar en Supabase SQL Editor

-- Verificar políticas existentes
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
ORDER BY policyname;

-- Eliminar políticas existentes si es necesario
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON projects;

-- Crear política para lectura pública
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

-- Crear políticas para usuarios autenticados
-- Usar auth.uid() IS NOT NULL en lugar de auth.role() para mejor compatibilidad
CREATE POLICY "Allow authenticated insert" ON projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update" ON projects
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete" ON projects
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verificar que las políticas se crearon correctamente
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || qual::text
        ELSE 'Sin condición USING'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check::text
        ELSE 'Sin condición WITH CHECK'
    END as with_check_clause
FROM pg_policies 
WHERE tablename = 'projects'
ORDER BY policyname;

