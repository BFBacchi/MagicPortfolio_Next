# 📊 Resumen del Portfolio - Magic Portfolio

## 🎯 Descripción General

**Magic Portfolio** es un portafolio web moderno y profesional construido con tecnologías de última generación. Diseñado específicamente para **Bruno Bacchi** como desarrollador Full Stack, combina diseño elegante con funcionalidades avanzadas de gestión de contenido.

### Información del Proyecto
- **Nombre**: Magic Portfolio by Once UI
- **Versión**: 2.2.0
- **Propietario**: Bruno Bacchi
- **Tipo**: Portafolio personal / Profesional
- **Licencia**: CC BY-NC 4.0 (con opción comercial mediante Once UI Pro)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.3.1 (App Router)
- **React**: 19.0.0
- **UI Library**: Once UI 1.2.4
- **Lenguaje**: TypeScript 5.8.3
- **Estilos**: SCSS + CSS Modules
- **MDX**: Para contenido de blog y proyectos

### Backend & Base de Datos
- **Backend**: Supabase
- **Base de Datos**: PostgreSQL (a través de Supabase)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage

### Otras Tecnologías
- **Email**: Resend / Nodemailer
- **Newsletter**: Mailchimp
- **Iconos**: React Icons
- **Galería**: React Masonry CSS

---

## ✨ Características Principales

### 🎨 Diseño y UI
- ✅ Diseño responsive optimizado para todos los dispositivos
- ✅ Tema oscuro/claro con persistencia
- ✅ Diseño minimalista y profesional
- ✅ Animaciones sutiles y elegantes
- ✅ Sistema de diseño consistente con Once UI

### 📝 Gestión de Contenido
- ✅ **Blog/Noticias**: Sistema de posts con MDX
- ✅ **Proyectos**: Portafolio de trabajos con integración a base de datos
- ✅ **Galería**: Galería de imágenes con layout masonry
- ✅ **About**: Página personal editable desde base de datos
- ✅ **Noticias automáticas**: Scraper de RSS feeds para contenido automático

### 🔐 Autenticación y Seguridad
- ✅ Sistema de autenticación con Supabase
- ✅ Protección de rutas con contraseña
- ✅ Menú de usuario con logout
- ✅ Selector de idioma (ES/EN) con persistencia
- ✅ Rutas protegidas para contenido privado

### 🌐 Internacionalización
- ✅ Soporte multiidioma (Español/Inglés)
- ✅ Traducciones dinámicas en toda la aplicación
- ✅ Persistencia del idioma seleccionado
- ✅ Contexto de idioma global

### 📊 SEO y Metadatos
- ✅ Generación automática de Open Graph
- ✅ Schema.org para mejor indexación
- ✅ Metadatos dinámicos por página
- ✅ Sitemap y robots.txt automáticos

### 🗄️ Base de Datos
- ✅ Integración completa con Supabase
- ✅ Gestión de proyectos desde BD
- ✅ Perfil personal editable
- ✅ Experiencia laboral y estudios
- ✅ Habilidades técnicas

---

## 📁 Estructura del Proyecto

```
magic-portfolio/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── about/             # Página About (editable desde BD)
│   │   ├── api/               # API Routes
│   │   │   ├── authenticate/  # Autenticación
│   │   │   ├── contact/       # Formulario de contacto
│   │   │   ├── db-status/     # Estado de DB
│   │   │   └── og/            # Generación de Open Graph
│   │   ├── blog/              # Blog (legacy)
│   │   ├── noticias/          # Sistema de noticias automáticas
│   │   ├── work/              # Proyectos de trabajo
│   │   ├── gallery/           # Galería de imágenes
│   │   └── db-test/          # Página de prueba de DB
│   ├── components/            # Componentes React reutilizables
│   │   ├── about/             # Componentes de About
│   │   ├── blog/              # Componentes del blog
│   │   ├── work/              # Componentes de proyectos
│   │   └── gallery/           # Componentes de galería
│   ├── contexts/              # Contextos de React
│   │   ├── AuthContext.tsx    # Autenticación
│   │   ├── LanguageContext.tsx # Internacionalización
│   │   └── ToastContext.tsx   # Notificaciones
│   ├── lib/                   # Utilidades y configuración
│   │   ├── supabase/          # Cliente y queries de Supabase
│   │   ├── projects.ts        # Funciones de proyectos
│   │   └── db.ts             # Configuración de PostgreSQL
│   ├── resources/             # Recursos y configuración
│   │   ├── content.js         # Contenido principal
│   │   └── once-ui.config.js  # Configuración de UI
│   └── utils/                 # Utilidades generales
├── scripts/                   # Scripts de automatización
│   ├── news-scraper.py       # Scraper de noticias RSS
│   ├── create-tables.sql      # Scripts de BD
│   └── insert-bruno-data.js   # Datos iniciales
├── public/                    # Archivos estáticos
│   └── images/                # Imágenes del portfolio
└── docs/                      # Documentación
```

---

## 🚀 Funcionalidades Especiales

### 1. Sistema de Noticias Automáticas
- **Scraper RSS**: Extrae noticias de múltiples fuentes (Dev.to, FreeCodeCamp, Platzi, etc.)
- **Filtrado inteligente**: Solo contenido relevante en español
- **Generación automática**: Crea archivos MDX automáticamente
- **Workflow automatizado**: Integración con GitHub Actions

### 2. Gestión de Proyectos
- **Base de datos**: Proyectos almacenados en Supabase
- **Edición dinámica**: Formularios para crear/editar proyectos
- **Imágenes**: Soporte para múltiples imágenes por proyecto
- **Videos**: Soporte para videos embebidos

### 3. Página About Editable
- **Perfil personal**: Información editable desde la base de datos
- **Experiencia laboral**: Gestión de trabajos anteriores
- **Estudios**: Registro de educación y certificaciones
- **Habilidades técnicas**: Categorización y niveles

### 4. Formulario de Contacto
- **Integración con Resend**: Envío de emails profesionales
- **Validación**: Validación de formularios en cliente y servidor
- **Notificaciones**: Sistema de toasts para feedback

### 5. Galería de Imágenes
- **Layout Masonry**: Diseño tipo Pinterest
- **Responsive**: Adaptación automática a diferentes pantallas
- **Optimización**: Carga optimizada de imágenes

---

## 📊 Base de Datos (Supabase)

### Tablas Principales

#### `projects`
- Gestión completa de proyectos del portfolio
- Campos: slug, title, summary, images, content, etc.

#### `introduction`
- Información personal del portfolio
- Campos: name, role, description, avatar_url, social links

#### `work_experience`
- Experiencia laboral
- Campos: company, position, dates, description, technologies

#### `studies`
- Educación y certificaciones
- Campos: institution, degree, field, dates

#### `technical_skills`
- Habilidades técnicas categorizadas
- Campos: title, category, level, description

---

## 🌐 Rutas Principales

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Página principal | Público |
| `/about` | Información personal | Público |
| `/work` | Lista de proyectos | Público |
| `/work/[slug]` | Proyecto individual | Público |
| `/noticias` | Noticias automáticas | Público |
| `/noticias/[slug]` | Noticia individual | Público |
| `/gallery` | Galería de imágenes | Público |
| `/db-test` | Prueba de conexión DB | Autenticado |

---

## 🔧 Configuración y Personalización

### Archivos de Configuración Clave

1. **`src/resources/content.js`**
   - Información personal
   - Configuración de páginas
   - Enlaces sociales

2. **`src/resources/once-ui.config.js`**
   - Rutas habilitadas
   - Configuración de UI
   - Tema y estilos

3. **`.env.local`** (no incluido en repo)
   - Variables de entorno de Supabase
   - Configuración de email
   - API keys

---

## 📦 Dependencias Principales

```json
{
  "next": "^15.3.1",
  "react": "19.0.0",
  "@once-ui-system/core": "^1.2.4",
  "@supabase/supabase-js": "^2.52.0",
  "@mdx-js/loader": "^3.1.0",
  "typescript": "^5.8.3",
  "sass": "^1.86.3"
}
```

---

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Construcción para producción
npm run start        # Servidor de producción

# Utilidades
npm run lint         # Linting del código
npm run export       # Exportar sitio estático
```

---

## 📝 Características Únicas

### ✅ Implementaciones Personalizadas

1. **Sistema de noticias automáticas con Python**
   - Scraper de RSS feeds
   - Filtrado de contenido relevante
   - Generación automática de posts MDX

2. **Autenticación dual**
   - Supabase Auth para usuarios
   - Protección con contraseña para rutas específicas

3. **Internacionalización completa**
   - Contexto de idioma global
   - Persistencia en localStorage
   - Traducciones dinámicas

4. **Gestión de contenido híbrida**
   - Archivos MDX estáticos (blog/noticias)
   - Base de datos dinámica (proyectos/about)

5. **Sistema de imágenes avanzado**
   - Galería con layout masonry
   - Optimización automática
   - Soporte para videos

---

## 🎯 Casos de Uso

### Para Desarrolladores
- ✅ Portafolio profesional personalizado
- ✅ Showcase de proyectos y trabajos
- ✅ Blog técnico con noticias automáticas
- ✅ Galería de proyectos visual

### Para Empresas
- ✅ Portafolio corporativo
- ✅ Showcase de productos/servicios
- ✅ Blog de empresa
- ✅ Galería de trabajos realizados

---

## 📈 Estado del Proyecto

### ✅ Completado
- Sistema de autenticación completo
- Integración con Supabase
- Sistema de noticias automáticas
- Internacionalización (ES/EN)
- Gestión de proyectos desde BD
- Formulario de contacto
- Galería de imágenes
- SEO optimizado

### 🔄 En Desarrollo
- Panel de administración completo
- Sistema de comentarios
- Optimizaciones de rendimiento

### 💡 Futuras Mejoras
- Integración con CMS headless
- Sistema de notificaciones
- Analytics avanzado
- Optimización de imágenes automática

---

## 📞 Información de Contacto

**Desarrollador**: Bruno Bacchi  
**Email**: bfbacchi@gmail.com  
**GitHub**: [BFBacchi](https://github.com/BFBacchi)  
**LinkedIn**: [bruno-bacchi](https://www.linkedin.com/in/bruno-bacchi)  
**Ubicación**: Buenos Aires, Argentina

---

## 📄 Licencia

Distribuido bajo la licencia **CC BY-NC 4.0**:
- ❌ Uso comercial no permitido
- ✅ Atribución requerida
- 💼 Opción de licencia comercial mediante [Once UI Pro](https://once-ui.com/pricing)

---

## 🔗 Enlaces Útiles

- **Demo**: https://demo.magic-portfolio.com
- **Documentación Once UI**: https://docs.once-ui.com
- **Repositorio Original**: https://github.com/once-ui-system/magic-portfolio
- **Supabase Dashboard**: https://supabase.com/dashboard

---

*Última actualización: Octubre 2025*


