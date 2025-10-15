-- Script para hacer respaldo de los datos actuales antes de la migración
-- Ejecutar en Supabase SQL Editor ANTES de ejecutar migrate-technical-skills.sql

-- Crear tabla de respaldo
CREATE TABLE IF NOT EXISTS technical_skills_backup AS 
SELECT * FROM technical_skills;

-- Verificar que el respaldo se creó correctamente
SELECT 
    'Backup creado exitosamente' as status,
    COUNT(*) as total_records
FROM technical_skills_backup;

-- Mostrar los datos del respaldo
SELECT 
    id,
    title,
    category,
    level,
    description,
    created_at
FROM technical_skills_backup 
ORDER BY category, title;
