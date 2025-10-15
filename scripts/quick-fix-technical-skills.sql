-- Script de solución rápida para technical_skills
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si hay datos
SELECT 'DATOS ACTUALES:' as info;
SELECT COUNT(*) as total_records FROM technical_skills;

-- 2. Verificar si hay datos con user_id
SELECT 'DATOS CON USER_ID:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    COUNT(*) - COUNT(user_id) as records_without_user_id
FROM technical_skills;

-- 3. Verificar las políticas de RLS
SELECT 'POLÍTICAS DE RLS:' as info;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'technical_skills';

-- 4. Verificar si hay datos sin user_id y asignarlos
SELECT 'ASIGNANDO USER_ID A DATOS SIN ASIGNAR:' as info;
UPDATE technical_skills 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- 5. Verificar que se asignaron correctamente
SELECT 'VERIFICACIÓN FINAL:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id
FROM technical_skills;

-- 6. Mostrar algunos datos de ejemplo
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
