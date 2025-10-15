-- Script para asignar user_id a los datos existentes
-- Ejecutar en Supabase SQL Editor DESPUÉS de la migración

-- Verificar si hay datos sin user_id
SELECT 
    'Datos sin user_id:' as status,
    COUNT(*) as count
FROM technical_skills 
WHERE user_id IS NULL;

-- Asignar user_id a los datos existentes (reemplaza 'TU_USER_ID_AQUI' con tu ID real)
-- Opción 1: Asignar a un usuario específico
-- UPDATE technical_skills 
-- SET user_id = 'TU_USER_ID_AQUI'
-- WHERE user_id IS NULL;

-- Opción 2: Asignar al primer usuario de la tabla auth.users
UPDATE technical_skills 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Verificar que se asignaron correctamente
SELECT 
    'Datos actualizados:' as status,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id
FROM technical_skills;

-- Mostrar los datos actualizados
SELECT 
    id,
    name,
    category,
    level,
    user_id,
    created_at
FROM technical_skills 
ORDER BY category, name;
