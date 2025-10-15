-- Script para verificar autenticación y acceso a datos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si hay usuarios en auth.users
SELECT 'USUARIOS EN AUTH.USERS:' as info;
SELECT COUNT(*) as user_count FROM auth.users;

-- 2. Verificar el usuario actual
SELECT 'USUARIO ACTUAL:' as info;
SELECT auth.uid() as current_user_id;

-- 3. Verificar si hay datos en technical_skills
SELECT 'DATOS EN TECHNICAL_SKILLS:' as info;
SELECT COUNT(*) as total_records FROM technical_skills;

-- 4. Verificar si hay datos con user_id
SELECT 'DATOS CON USER_ID:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    COUNT(*) - COUNT(user_id) as records_without_user_id
FROM technical_skills;

-- 5. Mostrar algunos datos de ejemplo
SELECT 'DATOS DE EJEMPLO:' as info;
SELECT 
    id,
    name,
    category,
    level,
    user_id,
    created_at
FROM technical_skills 
ORDER BY category, name
LIMIT 5;

-- 6. Verificar si RLS está habilitado
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'technical_skills';
