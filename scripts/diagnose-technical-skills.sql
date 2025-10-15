-- Script de diagnóstico para verificar problemas con technical_skills
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura de la tabla
SELECT 'ESTRUCTURA DE LA TABLA:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'technical_skills' 
ORDER BY ordinal_position;

-- 2. Verificar si la tabla tiene datos
SELECT 'CONTEO DE DATOS:' as info;
SELECT COUNT(*) as total_records FROM technical_skills;

-- 3. Verificar si hay datos con user_id
SELECT 'DATOS CON USER_ID:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    COUNT(*) - COUNT(user_id) as records_without_user_id
FROM technical_skills;

-- 4. Verificar los datos actuales
SELECT 'DATOS ACTUALES:' as info;
SELECT 
    id,
    name,
    category,
    level,
    user_id,
    created_at
FROM technical_skills 
ORDER BY category, name
LIMIT 10;

-- 5. Verificar si hay datos con valores NULL en campos requeridos
SELECT 'DATOS CON VALORES NULL:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(name) as records_with_name,
    COUNT(level) as records_with_level,
    COUNT(category) as records_with_category
FROM technical_skills;

-- 6. Verificar las políticas de RLS
SELECT 'POLÍTICAS DE RLS:' as info;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'technical_skills';

-- 7. Verificar si RLS está habilitado
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'technical_skills';
