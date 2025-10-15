-- Script para verificar el estado actual de las políticas
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar políticas existentes
SELECT 'POLÍTICAS ACTUALES:' as info;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'technical_skills'
ORDER BY policyname;

-- 2. Verificar el estado de RLS
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'technical_skills';

-- 3. Verificar si hay datos
SELECT 'DATOS ACTUALES:' as info;
SELECT COUNT(*) as total_records FROM technical_skills;

-- 4. Verificar usuario actual
SELECT 'USUARIO ACTUAL:' as info;
SELECT auth.uid() as current_user_id;
