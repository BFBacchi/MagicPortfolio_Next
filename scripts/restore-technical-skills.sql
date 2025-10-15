-- Script para restaurar los datos desde el respaldo
-- Ejecutar en Supabase SQL Editor SOLO si necesitas volver al estado anterior

-- Verificar que existe el respaldo
SELECT 
    'Verificando respaldo...' as status,
    COUNT(*) as backup_records
FROM technical_skills_backup;

-- Eliminar la tabla actual (¡CUIDADO! Esto eliminará todos los datos actuales)
-- DROP TABLE IF EXISTS technical_skills;

-- Restaurar desde el respaldo
-- CREATE TABLE technical_skills AS 
-- SELECT * FROM technical_skills_backup;

-- Verificar la restauración
-- SELECT 
--     'Restauración completada' as status,
--     COUNT(*) as restored_records
-- FROM technical_skills;
