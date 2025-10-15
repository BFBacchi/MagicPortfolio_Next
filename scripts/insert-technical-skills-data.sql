-- Script para insertar datos de habilidades técnicas en el nuevo formato
-- Ejecutar en Supabase SQL Editor DESPUÉS de ejecutar migrate-technical-skills.sql

-- Insertar habilidades técnicas con el nuevo formato
INSERT INTO technical_skills (name, category, level, description, user_id) VALUES
-- Frontend
('React', 'Frontend', 'expert', 'Experto en React con hooks, context API y desarrollo de componentes reutilizables', auth.uid()),
('Angular', 'Frontend', 'advanced', 'Experiencia sólida en Angular con TypeScript y arquitectura de componentes', auth.uid()),
('Next.js', 'Frontend', 'advanced', 'Desarrollo de aplicaciones SSR y SSG con Next.js', auth.uid()),
('TypeScript', 'Frontend', 'expert', 'Uso avanzado de TypeScript para desarrollo frontend y backend', auth.uid()),
('HTML5/CSS3', 'Frontend', 'expert', 'Maestría en HTML5, CSS3 y diseño responsivo', auth.uid()),
('SASS/SCSS', 'Frontend', 'advanced', 'Experiencia en preprocesadores CSS y metodologías BEM', auth.uid()),

-- Backend
('Java', 'Backend', 'advanced', 'Desarrollo backend robusto con Java y Spring Framework', auth.uid()),
('Spring Boot', 'Backend', 'expert', 'Experto en Spring Boot, microservicios y APIs REST', auth.uid()),
('Node.js', 'Backend', 'advanced', 'Desarrollo de APIs con Node.js y Express', auth.uid()),
('Python', 'Backend', 'intermediate', 'Desarrollo backend con Python y Flask', auth.uid()),
('Flask', 'Backend', 'intermediate', 'Creación de APIs RESTful con Flask', auth.uid()),

-- Base de Datos
('PostgreSQL', 'Database', 'advanced', 'Diseño y optimización de bases de datos relacionales', auth.uid()),
('MySQL', 'Database', 'intermediate', 'Administración y consultas complejas en MySQL', auth.uid()),
('MongoDB', 'Database', 'intermediate', 'Trabajo con bases de datos NoSQL', auth.uid()),

-- DevOps y Herramientas
('Git', 'DevOps', 'expert', 'Control de versiones avanzado con Git y GitHub', auth.uid()),
('GitHub', 'DevOps', 'expert', 'Colaboración en proyectos open source y gestión de repositorios', auth.uid()),
('Docker', 'DevOps', 'intermediate', 'Containerización de aplicaciones y microservicios', auth.uid()),
('AWS', 'Cloud', 'intermediate', 'Despliegue y gestión de aplicaciones en la nube', auth.uid()),
('Jenkins', 'DevOps', 'intermediate', 'Integración continua y despliegue automático', auth.uid()),

-- Metodologías
('Agile/Scrum', 'Methodology', 'advanced', 'Trabajo en equipos ágiles y metodologías Scrum', auth.uid()),
('TDD', 'Methodology', 'intermediate', 'Desarrollo dirigido por pruebas', auth.uid()),
('Clean Code', 'Methodology', 'advanced', 'Principios de código limpio y arquitectura de software', auth.uid());

-- Verificar que los datos se insertaron correctamente
SELECT 
    id,
    name,
    category,
    level,
    description,
    user_id,
    created_at
FROM technical_skills 
WHERE user_id = auth.uid()
ORDER BY category, name;
