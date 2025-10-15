-- Script para verificar el estado de la tabla technical_skills después de la migración
-- Ejecutar en Supabase SQL Editor

-- Verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'technical_skills' 
ORDER BY ordinal_position;

-- Verificar los datos actuales
SELECT 
    id,
    name,
    category,
    level,
    user_id,
    created_at
FROM technical_skills 
ORDER BY category, name;

-- Verificar si hay datos sin user_id
SELECT 
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    COUNT(*) - COUNT(user_id) as records_without_user_id
FROM technical_skills;

-- Verificar las políticas de RLS
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
WHERE tablename = 'technical_skills';
