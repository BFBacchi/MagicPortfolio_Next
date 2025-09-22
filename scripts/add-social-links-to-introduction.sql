-- Script para agregar campos de enlaces sociales a la tabla introduction
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas para enlaces sociales
ALTER TABLE introduction 
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS discord_url TEXT,
ADD COLUMN IF NOT EXISTS email_url TEXT;

-- Crear índices para mejorar el rendimiento (opcional)
CREATE INDEX IF NOT EXISTS idx_introduction_github_url ON introduction(github_url);
CREATE INDEX IF NOT EXISTS idx_introduction_linkedin_url ON introduction(linkedin_url);

-- Comentarios para documentar las nuevas columnas
COMMENT ON COLUMN introduction.github_url IS 'URL del perfil de GitHub';
COMMENT ON COLUMN introduction.linkedin_url IS 'URL del perfil de LinkedIn';
COMMENT ON COLUMN introduction.discord_url IS 'URL del servidor de Discord';
COMMENT ON COLUMN introduction.email_url IS 'Dirección de correo electrónico';

-- Actualizar datos existentes con enlaces de ejemplo (opcional)
-- UPDATE introduction 
-- SET 
--   github_url = 'https://github.com/bruno-bacchi',
--   linkedin_url = 'https://www.linkedin.com/in/bruno-bacchi',
--   discord_url = 'https://discord.gg/bruno-bacchi',
--   email_url = 'bruno@example.com'
-- WHERE name = 'Bruno Bacchi';
