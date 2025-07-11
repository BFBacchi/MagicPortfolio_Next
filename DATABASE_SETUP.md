# Configuración de Base de Datos - Magic Portfolio

## 🎯 Resumen

Tu portafolio ahora está configurado para usar Supabase (PostgreSQL) en lugar de archivos `.mdx` locales. Esto te permitirá:

- ✅ Gestionar proyectos desde una base de datos
- ✅ Añadir/editar proyectos sin tocar código
- ✅ Mejor rendimiento y escalabilidad
- ✅ Posibilidad de crear un panel de administración

## 📋 Pasos para Completar la Configuración

### 1. Crear el archivo de variables de entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con:

```env
POSTGRES_URL="postgresql://postgres:mV8VerS68n4Pky8O@db.ykmzwzvxrdbtsbxsysky.supabase.co:5432/postgres"
```

### 2. Crear la tabla en Supabase

Ejecuta el script SQL en tu base de datos de Supabase:

1. Ve a tu proyecto en Supabase
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `scripts/create-tables.sql`
4. Ejecuta el script

### 3. Migrar datos existentes (Opcional)

Si quieres conservar los proyectos que ya tienes en archivos `.mdx`, ejecuta:

```bash
node scripts/migrate-mdx-to-db.js
```

### 4. Probar la aplicación

```bash
npm run dev
```

Visita `http://localhost:3000/work` para ver tus proyectos cargados desde la base de datos.

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
2. **Autenticación**: Proteger el panel de administración
3. **Imágenes**: Configurar almacenamiento de imágenes en Supabase Storage
4. **Categorías**: Añadir sistema de categorías/tags
5. **Búsqueda**: Implementar búsqueda de proyectos

## 🐛 Solución de Problemas

### Error de conexión
- Verifica que el archivo `.env.local` existe y tiene la URL correcta
- Asegúrate de que las credenciales de Supabase son correctas

### Error de tabla no encontrada
- Ejecuta el script `create-tables.sql` en Supabase
- Verifica que la tabla `projects` existe

### Error de SSL
- El código ya está configurado para Supabase con SSL
- Si persiste, verifica la configuración de red

## 📞 Soporte

Si encuentras algún problema, revisa:
1. Los logs del servidor de desarrollo
2. La consola del navegador
3. Los logs de Supabase

¡Tu portafolio ahora está conectado a una base de datos real! 🎉 