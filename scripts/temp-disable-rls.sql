-- Script temporal para deshabilitar RLS y permitir operaciones sin autenticación
-- ⚠️ SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
-- Ejecutar en Supabase SQL Editor

-- 1. Deshabilitar RLS temporalmente
ALTER TABLE technical_skills DISABLE ROW LEVEL SECURITY;

-- 2. Verificar que RLS está deshabilitado
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'technical_skills';

-- 3. Probar inserción sin autenticación
INSERT INTO technical_skills (name, category, level, user_id) 
VALUES ('Test Skill', 'Testing', 'intermediate', '00000000-0000-0000-0000-000000000000')
RETURNING *;

-- 4. Verificar que se insertó
SELECT 'REGISTRO INSERTADO:' as info;
SELECT * FROM technical_skills WHERE name = 'Test Skill';

-- 5. Limpiar el registro de prueba
DELETE FROM technical_skills WHERE name = 'Test Skill';

-- 6. Verificar que se eliminó
SELECT 'REGISTRO ELIMINADO:' as info;
SELECT COUNT(*) as count FROM technical_skills WHERE name = 'Test Skill';
