-- Script para migrar la tabla technical_skills
-- Ejecutar en Supabase SQL Editor
-- Este script preserva todos los datos existentes y los convierte al nuevo formato

-- Paso 1: Agregar las columnas que faltan
ALTER TABLE technical_skills 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Paso 2: Migrar datos existentes: copiar title a name
UPDATE technical_skills 
SET name = title 
WHERE name IS NULL;

-- Paso 3: Crear una columna temporal para el nuevo formato de level
ALTER TABLE technical_skills 
ADD COLUMN IF NOT EXISTS level_temp VARCHAR(50);

-- Paso 4: Migrar los datos de level (convertir números a strings descriptivos)
UPDATE technical_skills 
SET level_temp = CASE 
  WHEN level >= 9 THEN 'expert'
  WHEN level >= 7 THEN 'advanced'
  WHEN level >= 5 THEN 'intermediate'
  ELSE 'beginner'
END
WHERE level_temp IS NULL;

-- Paso 5: Eliminar la columna level original
ALTER TABLE technical_skills DROP COLUMN IF EXISTS level;

-- Paso 6: Renombrar level_temp a level
ALTER TABLE technical_skills RENAME COLUMN level_temp TO level;

-- Paso 7: Hacer que name sea NOT NULL
ALTER TABLE technical_skills ALTER COLUMN name SET NOT NULL;

-- Paso 8: Hacer que level sea NOT NULL
ALTER TABLE technical_skills ALTER COLUMN level SET NOT NULL;

-- Paso 9: Asignar user_id a un usuario por defecto (opcional)
-- Descomenta las siguientes líneas si quieres asignar todas las habilidades a un usuario específico
-- UPDATE technical_skills 
-- SET user_id = (SELECT id FROM auth.users LIMIT 1)
-- WHERE user_id IS NULL;

-- Paso 10: Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_technical_skills_user_id ON technical_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_technical_skills_category ON technical_skills(category);
CREATE INDEX IF NOT EXISTS idx_technical_skills_level ON technical_skills(level);

-- Paso 11: Habilitar RLS si no está habilitado
ALTER TABLE technical_skills ENABLE ROW LEVEL SECURITY;

-- Paso 12: Crear políticas de seguridad
-- Política para permitir lectura pública (todos pueden ver las habilidades)
DROP POLICY IF EXISTS "Allow public read access" ON technical_skills;
CREATE POLICY "Allow public read access" ON technical_skills
    FOR SELECT USING (true);

-- Política para permitir inserción solo para usuarios autenticados
DROP POLICY IF EXISTS "Allow authenticated users to insert skills" ON technical_skills;
CREATE POLICY "Allow authenticated users to insert skills" ON technical_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir actualización solo para el propietario
DROP POLICY IF EXISTS "Allow users to update their own skills" ON technical_skills;
CREATE POLICY "Allow users to update their own skills" ON technical_skills
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir eliminación solo para el propietario
DROP POLICY IF EXISTS "Allow users to delete their own skills" ON technical_skills;
CREATE POLICY "Allow users to delete their own skills" ON technical_skills
    FOR DELETE USING (auth.uid() = user_id);

-- Paso 13: Verificar la migración
-- Esta consulta te mostrará cómo quedaron los datos después de la migración
SELECT 
    id,
    name,
    category,
    level,
    description,
    user_id,
    created_at
FROM technical_skills 
ORDER BY category, name;
