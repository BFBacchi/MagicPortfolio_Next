-- Script para crear políticas abiertas que funcionen sin autenticación
-- ⚠️ SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Allow public read access" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to insert skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow users to update their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow users to delete their own skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to update skills" ON technical_skills;
DROP POLICY IF EXISTS "Allow authenticated users to delete skills" ON technical_skills;

-- 2. Crear políticas abiertas (sin restricciones de autenticación)
CREATE POLICY "Allow all operations" ON technical_skills
    FOR ALL USING (true);

-- 3. Verificar que las políticas se crearon
SELECT 'POLÍTICAS CREADAS:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'technical_skills';

-- 4. Verificar el estado de RLS
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'technical_skills';
