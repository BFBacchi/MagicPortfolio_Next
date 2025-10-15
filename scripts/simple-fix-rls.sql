-- Script simple para corregir políticas de RLS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar políticas existentes
SELECT 'POLÍTICAS EXISTENTES:' as info;
SELECT policyname FROM pg_policies WHERE tablename = 'technical_skills';

-- 2. Eliminar solo las políticas que pueden estar causando problemas
DROP POLICY IF EXISTS "Allow users to update their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow users to delete their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON technical_skills;

-- 3. Crear políticas simples y permisivas
CREATE POLICY IF NOT EXISTS "Allow public read access" ON technical_skills
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert skills" ON technical_skills
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update skills" ON technical_skills
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete skills" ON technical_skills
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Verificar que las políticas se crearon correctamente
SELECT 'POLÍTICAS FINALES:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'technical_skills'
ORDER BY policyname;
