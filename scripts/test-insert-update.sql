-- Script para probar inserción y actualización en technical_skills
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar el usuario actual
SELECT 'USUARIO ACTUAL:' as info;
SELECT auth.uid() as current_user_id;

-- 2. Probar inserción de un nuevo registro
INSERT INTO technical_skills (name, category, level, user_id) 
VALUES ('Test Skill', 'Testing', 'intermediate', auth.uid())
RETURNING *;

-- 3. Verificar que se insertó correctamente
SELECT 'REGISTRO INSERTADO:' as info;
SELECT * FROM technical_skills WHERE name = 'Test Skill';

-- 4. Probar actualización del registro
UPDATE technical_skills 
SET level = 'advanced' 
WHERE name = 'Test Skill' AND user_id = auth.uid()
RETURNING *;

-- 5. Verificar que se actualizó correctamente
SELECT 'REGISTRO ACTUALIZADO:' as info;
SELECT * FROM technical_skills WHERE name = 'Test Skill';

-- 6. Limpiar el registro de prueba
DELETE FROM technical_skills WHERE name = 'Test Skill' AND user_id = auth.uid();

-- 7. Verificar que se eliminó
SELECT 'REGISTRO ELIMINADO:' as info;
SELECT COUNT(*) as count FROM technical_skills WHERE name = 'Test Skill';
