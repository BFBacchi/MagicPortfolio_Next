-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    summary TEXT,
    images TEXT[],
    tag VARCHAR(100),
    link VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO projects (slug, title, published_at, summary, images, tag, link, content) VALUES
(
    'mi-primer-proyecto',
    'Mi Primer Proyecto Web',
    '2024-01-15 10:00:00',
    'Un proyecto web moderno construido con Next.js y TypeScript que demuestra las mejores prácticas de desarrollo frontend.',
    ARRAY['/images/project1.jpg', '/images/project1-2.jpg'],
    'web-development',
    'https://github.com/tu-usuario/mi-primer-proyecto',
    '# Mi Primer Proyecto Web

Este es un proyecto increíble que desarrollé usando las tecnologías más modernas del mercado.

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL

## Características

- Diseño responsive
- Optimización de rendimiento
- SEO optimizado
- Base de datos en tiempo real

## Resultados

El proyecto ha sido un éxito total, recibiendo excelentes comentarios de la comunidad de desarrolladores.'
),
(
    'aplicacion-movil-react-native',
    'Aplicación Móvil con React Native',
    '2024-02-20 14:30:00',
    'Desarrollo de una aplicación móvil multiplataforma que funciona tanto en iOS como en Android.',
    ARRAY['/images/mobile-app.jpg'],
    'mobile-development',
    'https://github.com/tu-usuario/react-native-app',
    '# Aplicación Móvil con React Native

Una aplicación móvil completa desarrollada con React Native que demuestra las capacidades de desarrollo multiplataforma.

## Características Principales

- Autenticación de usuarios
- Navegación fluida
- Integración con APIs
- Notificaciones push

## Tecnologías

- React Native
- Expo
- Firebase
- Redux Toolkit

## Aprendizajes

Este proyecto me enseñó mucho sobre el desarrollo móvil y las particularidades de cada plataforma.'
); 