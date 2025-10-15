-- Script para verificar y corregir políticas de RLS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar políticas actuales
SELECT 'POLÍTICAS ACTUALES:' as info;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'technical_skills';

-- 2. Eliminar políticas existentes (si es necesario)
DROP POLICY IF EXISTS "Allow public read access" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to insert skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow users to update their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow users to delete their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON technical_skills;

-- 3. Crear políticas más permisivas para testing
-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON technical_skills
    FOR SELECT USING (true);

-- Política para permitir inserción para usuarios autenticados
CREATE POLICY "Allow authenticated users to insert skills" ON technical_skills
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para permitir actualización para usuarios autenticados
CREATE POLICY "Allow authenticated users to update skills" ON technical_skills
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para permitir eliminación para usuarios autenticados
CREATE POLICY "Allow authenticated users to delete skills" ON technical_skills
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Verificar que las políticas se crearon correctamente
SELECT 'POLÍTICAS CREADAS:' as info;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'technical_skills';
