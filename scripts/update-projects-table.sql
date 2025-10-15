-- Script para actualizar la tabla projects con campos para videos y mejoras
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas para videos de YouTube
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_thumbnail TEXT,
ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);

-- Comentarios para documentar las nuevas columnas
COMMENT ON COLUMN projects.video_url IS 'URL del video de YouTube del proyecto';
COMMENT ON COLUMN projects.video_thumbnail IS 'URL de la miniatura del video';
COMMENT ON COLUMN projects.technologies IS 'Array de tecnologías utilizadas en el proyecto';
COMMENT ON COLUMN projects.featured IS 'Indica si el proyecto está destacado';
COMMENT ON COLUMN projects.status IS 'Estado del proyecto: draft, published, archived';

-- Actualizar políticas de RLS para permitir operaciones CRUD para usuarios autenticados
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;

-- Crear políticas para usuarios autenticados
CREATE POLICY "Allow authenticated insert" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Actualizar algunos proyectos existentes con datos de ejemplo
UPDATE projects 
SET 
  technologies = ARRAY['React', 'Next.js', 'TypeScript', 'Supabase'],
  featured = true,
  video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE slug = 'building-once-ui-a-customizable-design-system';

UPDATE projects 
SET 
  technologies = ARRAY['Figma', 'Node.js', 'GitHub Actions'],
  featured = true
WHERE slug = 'automate-design-handovers-with-a-figma-to-code-pipeline';

UPDATE projects 
SET 
  technologies = ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  featured = false
WHERE slug = 'simple-portfolio-builder';

