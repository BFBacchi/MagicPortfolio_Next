-- Script para insertar datos de ejemplo para Bruno Bacchi
-- Ejecutar en Supabase SQL Editor

-- Tabla de introducción
INSERT INTO introduction (name, role, description) VALUES (
  'Bruno Bacchi',
  'Full Stack Developer',
  'Desarrollador Full Stack apasionado por crear soluciones innovadoras y escalables. Especializado en tecnologías modernas como React, Angular, Node.js y Java Spring Boot. Con experiencia en desarrollo frontend y backend, siempre buscando aprender nuevas tecnologías y mejorar mis habilidades.'
);

-- Tabla de experiencia laboral
INSERT INTO work_experience (company, position, start_date, end_date, description, technologies) VALUES
(
  'TechCorp Solutions',
  'Senior Full Stack Developer',
  '2022-01-01',
  NULL,
  'Lideré el desarrollo de aplicaciones web empresariales utilizando React, Node.js y microservicios. Implementé arquitecturas escalables y optimicé el rendimiento de aplicaciones críticas.',
  ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS']
),
(
  'InnovateSoft',
  'Full Stack Developer',
  '2020-03-01',
  '2021-12-31',
  'Desarrollé aplicaciones web completas usando Angular y Java Spring Boot. Trabajé en equipo ágil y participé en la toma de decisiones técnicas.',
  ARRAY['Angular', 'Java', 'Spring Boot', 'MySQL', 'Git', 'Jenkins']
),
(
  'StartUpHub',
  'Frontend Developer',
  '2019-06-01',
  '2020-02-28',
  'Especializado en desarrollo frontend con React y Next.js. Creé interfaces de usuario modernas y responsivas.',
  ARRAY['React', 'Next.js', 'TypeScript', 'CSS3', 'SASS', 'Figma']
),
(
  'DigitalCraft',
  'Backend Developer',
  '2018-01-01',
  '2019-05-31',
  'Desarrollé APIs RESTful y microservicios usando Python Flask y Node.js. Implementé bases de datos y sistemas de autenticación.',
  ARRAY['Python', 'Flask', 'Node.js', 'MongoDB', 'Redis', 'Docker']
);

-- Tabla de estudios
INSERT INTO studies (institution, degree, field, start_date, end_date, description) VALUES
(
  'Universidad Tecnológica Nacional',
  'Ingeniería en Sistemas de Información',
  'Ingeniería de Software',
  '2015-03-01',
  '2020-12-31',
  'Carrera completa en ingeniería de sistemas con especialización en desarrollo de software y arquitecturas de sistemas.'
),
(
  'Platzi',
  'Certificación Full Stack',
  'Desarrollo Web',
  '2021-01-01',
  '2021-06-30',
  'Programa intensivo de desarrollo full stack con tecnologías modernas.'
),
(
  'Coursera',
  'Certificación en Machine Learning',
  'Inteligencia Artificial',
  '2022-03-01',
  '2022-08-31',
  'Curso especializado en machine learning y algoritmos de IA.'
);

-- Tabla de habilidades técnicas
INSERT INTO technical_skills (title, category, level, description) VALUES
-- Frontend
('React', 'Frontend', 9, 'Experto en React con hooks, context API y desarrollo de componentes reutilizables'),
('Angular', 'Frontend', 8, 'Experiencia sólida en Angular con TypeScript y arquitectura de componentes'),
('Next.js', 'Frontend', 8, 'Desarrollo de aplicaciones SSR y SSG con Next.js'),
('TypeScript', 'Frontend', 9, 'Uso avanzado de TypeScript para desarrollo frontend y backend'),
('HTML5/CSS3', 'Frontend', 9, 'Maestría en HTML5, CSS3 y diseño responsivo'),
('SASS/SCSS', 'Frontend', 8, 'Experiencia en preprocesadores CSS y metodologías BEM'),

-- Backend
('Java', 'Backend', 8, 'Desarrollo backend robusto con Java y Spring Framework'),
('Spring Boot', 'Backend', 9, 'Experto en Spring Boot, microservicios y APIs REST'),
('Node.js', 'Backend', 8, 'Desarrollo de APIs con Node.js y Express'),
('Python', 'Backend', 7, 'Desarrollo backend con Python y Flask'),
('Flask', 'Backend', 7, 'Creación de APIs RESTful con Flask'),

-- Base de Datos
('PostgreSQL', 'Database', 8, 'Diseño y optimización de bases de datos relacionales'),
('MySQL', 'Database', 7, 'Administración y consultas complejas en MySQL'),
('MongoDB', 'Database', 6, 'Trabajo con bases de datos NoSQL'),

-- DevOps y Herramientas
('Git', 'DevOps', 9, 'Control de versiones avanzado con Git y GitHub'),
('GitHub', 'DevOps', 9, 'Colaboración en proyectos open source y gestión de repositorios'),
('Docker', 'DevOps', 7, 'Containerización de aplicaciones y microservicios'),
('AWS', 'Cloud', 6, 'Despliegue y gestión de aplicaciones en la nube'),
('Jenkins', 'DevOps', 6, 'Integración continua y despliegue automático'),

-- Metodologías
('Agile/Scrum', 'Methodology', 8, 'Trabajo en equipos ágiles y metodologías Scrum'),
('TDD', 'Methodology', 7, 'Desarrollo dirigido por pruebas'),
('Clean Code', 'Methodology', 8, 'Principios de código limpio y arquitectura de software'); 