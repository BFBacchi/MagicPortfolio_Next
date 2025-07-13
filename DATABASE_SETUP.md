# Configuración de Base de Datos - Magic Portfolio

## 🎯 Resumen

Tu portafolio ahora está configurado para usar **Supabase** como backend. Esto te permitirá:

- ✅ Gestionar proyectos desde una base de datos en la nube
- ✅ Añadir/editar proyectos sin tocar código
- ✅ Mejor rendimiento y escalabilidad
- ✅ Posibilidad de crear un panel de administración
- ✅ Autenticación y autorización integradas
- ✅ APIs automáticas

## 📋 Pasos para Completar la Configuración

### 1. Variables de entorno configuradas ✅

El archivo `.env.local` ya está configurado con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ykmzwzvxrdbtsbxsysky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbXp3enZ4cmRidHNieHN5c2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDI2MjEsImV4cCI6MjA2NjExODYyMX0.5R1YevRjwoGqUkzSHUSaEAxtniv_fMhyn2Sa0LvpQHk
```

### 2. Crear la tabla en Supabase

Ejecuta el script SQL en tu base de datos de Supabase:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/ykmzwzvxrdbtsbxsysky
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `scripts/create-tables.sql`
4. Ejecuta el script

### 3. Probar la aplicación

```bash
npm run dev
```

Visita:
- `http://localhost:3000/work` - Para ver tus proyectos
- `http://localhost:3000/db-test` - Para verificar la conexión

## 🗄️ Estructura de la Base de Datos

### Tabla `projects`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID único autoincremental |
| `slug` | VARCHAR(255) | URL amigable del proyecto |
| `title` | VARCHAR(255) | Título del proyecto |
| `published_at` | TIMESTAMP | Fecha de publicación |
| `summary` | TEXT | Resumen del proyecto |
| `images` | TEXT[] | Array de URLs de imágenes |
| `tag` | VARCHAR(100) | Etiqueta del proyecto |
| `link` | VARCHAR(255) | Enlace al proyecto |
| `content` | TEXT | Contenido completo en Markdown |
| `created_at` | TIMESTAMP | Fecha de creación en BD |

## 🔧 Funciones Disponibles

### `getProjectsFromDB()`
Obtiene todos los proyectos ordenados por fecha de publicación.

### `getProjectBySlug(slug)`
Obtiene un proyecto específico por su slug.

## 📝 Ejemplo de Inserción de Datos

```sql
INSERT INTO projects (slug, title, published_at, summary, images, tag, link, content) VALUES
(
    'mi-nuevo-proyecto',
    'Mi Nuevo Proyecto',
    '2024-03-15 10:00:00',
    'Descripción de mi nuevo proyecto',
    ARRAY['/images/project.jpg'],
    'web-development',
    'https://github.com/mi-usuario/proyecto',
    '# Mi Nuevo Proyecto

Contenido del proyecto en Markdown...'
);
```

## 🚀 Próximos Pasos Sugeridos

1. **Panel de Administración**: Crear una interfaz para gestionar proyectos
2. **Autenticación**: Usar Supabase Auth para proteger el panel de administración
3. **Imágenes**: Configurar Supabase Storage para almacenar imágenes
4. **Categorías**: Añadir sistema de categorías/tags
5. **Búsqueda**: Implementar búsqueda de proyectos con Supabase

## 🐛 Solución de Problemas

### Error de conexión
- Verifica que el archivo `.env.local` existe y tiene las variables correctas
- Asegúrate de que las credenciales de Supabase son correctas
- Verifica que la tabla `projects` existe en Supabase

### Error de tabla no encontrada
- Ejecuta el script `create-tables.sql` en Supabase SQL Editor
- Verifica que la tabla `projects` existe

### Error de políticas de seguridad
- Verifica que las políticas RLS están configuradas correctamente
- La política "Allow public read access" debe estar habilitada

## 🔍 Herramientas de Diagnóstico

- **API de estado**: `http://localhost:3000/api/db-status`
- **Página de diagnóstico**: `http://localhost:3000/db-test`

## 📞 Soporte

Si encuentras algún problema, revisa:
1. Los logs del servidor de desarrollo
2. La consola del navegador
3. Los logs de Supabase en el dashboard
4. La página de diagnóstico en `/db-test`

¡Tu portafolio ahora está conectado a Supabase! 🎉 