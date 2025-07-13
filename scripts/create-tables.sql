-- Crear la tabla projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    summary TEXT,
    images TEXT[] DEFAULT '{}',
    tag VARCHAR(100),
    link VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_tag ON projects(tag);

-- Habilitar Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

-- Crear política para permitir inserción (solo para usuarios autenticados si es necesario)
-- CREATE POLICY "Allow authenticated insert" ON projects
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insertar algunos proyectos de ejemplo
INSERT INTO projects (slug, title, published_at, summary, images, tag, link, content) VALUES
(
    'automate-design-handovers-with-a-figma-to-code-pipeline',
    'Automate Design Handovers with a Figma to Code Pipeline',
    '2024-01-15 10:00:00',
    'Learn how to automate the design-to-code handoff process using Figma and modern development tools.',
    ARRAY['/images/projects/project-01/cover-01.jpg', '/images/projects/project-01/cover-02.jpg'],
    'design-system',
    'https://github.com/example/figma-pipeline',
    '# Automate Design Handovers with a Figma to Code Pipeline

This project demonstrates how to create an automated pipeline that converts Figma designs into production-ready code.

## Features

- Automated design token extraction
- Component generation from Figma
- Integration with design systems
- CI/CD pipeline integration

## Technologies Used

- Figma API
- Node.js
- React
- TypeScript
- GitHub Actions'
),
(
    'building-once-ui-a-customizable-design-system',
    'Building Once UI: A Customizable Design System',
    '2024-01-10 14:30:00',
    'A comprehensive guide to building a scalable and customizable design system.',
    ARRAY['/images/projects/project-01/cover-03.jpg', '/images/projects/project-01/cover-04.jpg'],
    'design-system',
    'https://github.com/example/once-ui',
    '# Building Once UI: A Customizable Design System

A modern design system built with React and TypeScript that provides a solid foundation for building consistent user interfaces.

## Key Features

- Component library with 50+ components
- Theme customization
- Accessibility compliance
- Performance optimized
- TypeScript support

## Getting Started

```bash
npm install @once-ui/core
```

## Usage

```tsx
import { Button, Card, Text } from "@once-ui/core";

function App() {
  return (
    <Card>
      <Text>Hello World</Text>
      <Button>Click me</Button>
    </Card>
  );
}
```'
),
(
    'simple-portfolio-builder',
    'Simple Portfolio Builder',
    '2024-01-05 09:15:00',
    'A simple yet powerful portfolio builder for developers and designers.',
    ARRAY['/images/projects/project-01/image-01.jpg', '/images/projects/project-01/image-02.jpg'],
    'web-development',
    'https://github.com/example/portfolio-builder',
    '# Simple Portfolio Builder

A modern portfolio builder that helps developers and designers showcase their work effectively.

## Features

- Drag and drop interface
- Multiple themes
- SEO optimized
- Fast performance
- Mobile responsive

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase

## Installation

```bash
git clone https://github.com/example/portfolio-builder
cd portfolio-builder
npm install
npm run dev
```'
)
ON CONFLICT (slug) DO NOTHING; 