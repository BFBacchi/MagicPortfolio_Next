# 📚 Documentación Interna - Magic Portfolio

## 🎯 Resumen del Proyecto

**Magic Portfolio** es un portafolio web moderno construido con **Next.js 15** y **Once UI**, integrado con **Supabase** como backend. El proyecto está personalizado para **Bruno Bacchi** como desarrollador Full Stack.

### Información del Proyecto
- **Nombre**: @once-ui-system/magic-portfolio
- **Versión**: 2.2.0
- **Framework**: Next.js 15.3.1
- **UI Library**: Once UI 1.2.4
- **Backend**: Supabase
- **Lenguaje**: TypeScript
- **Estilos**: SCSS + CSS Modules

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
magic-portfolio/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── about/             # Página About
│   │   ├── api/               # API Routes
│   │   │   ├── authenticate/  # Autenticación
│   │   │   ├── check-auth/    # Verificación de auth
│   │   │   ├── db-status/     # Estado de DB
│   │   │   └── og/            # Open Graph
│   │   ├── blog/              # Blog y posts
│   │   ├── db-test/           # Página de prueba de DB
│   │   ├── gallery/           # Galería de imágenes
│   │   ├── work/              # Proyectos de trabajo
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   │   ├── about/             # Componentes específicos de About
│   │   ├── blog/              # Componentes del blog
│   │   ├── common/            # Componentes comunes
│   │   ├── gallery/           # Componentes de galería
│   │   └── work/              # Componentes de trabajo
│   ├── contexts/              # Contextos de React
│   ├── lib/                   # Utilidades y configuración
│   │   └── supabase/          # Cliente y queries de Supabase
│   ├── resources/             # Recursos y configuración
│   └── utils/                 # Utilidades generales
├── scripts/                   # Scripts de base de datos
├── public/                    # Archivos estáticos
└── docs/                      # Documentación
```

---

## 🔐 Sistema de Autenticación

### Componentes de Autenticación

#### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)
- **Propósito**: Contexto global para manejo de autenticación
- **Funcionalidades**:
  - Estado del usuario autenticado
  - Funciones de login/logout
  - Verificación de sesión
  - Escucha de cambios de autenticación

#### 2. **AuthButton** (`src/components/AuthButton.tsx`)
- **Propósito**: Botón de autenticación con menú desplegable
- **Funcionalidades**:
  - Selector de idioma (ES/EN)
  - Modal de login
  - Menú desplegable del usuario autenticado
  - Botón de logout en menú desplegable
  - Cierre automático del menú al hacer clic fuera

#### 3. **RouteGuard** (`src/components/RouteGuard.tsx`)
- **Propósito**: Protección de rutas con contraseña
- **Funcionalidades**:
  - Verificación de rutas habilitadas
  - Protección con contraseña para rutas específicas
  - Verificación de autenticación

### API Routes de Autenticación

#### 1. **`/api/authenticate`** (`src/app/api/authenticate/route.ts`)
- **Método**: POST
- **Propósito**: Autenticación con contraseña
- **Funcionalidad**: Establece cookie de autenticación

#### 2. **`/api/check-auth`** (`src/app/api/check-auth/route.ts`)
- **Método**: GET
- **Propósito**: Verificar estado de autenticación
- **Funcionalidad**: Verifica cookie de autenticación

---

## 🗄️ Base de Datos (Supabase)

### Configuración
- **URL**: `https://ykmzwzvxrdbtsbxsysky.supabase.co`
- **Cliente**: Configurado en `src/lib/supabase/client.ts`
- **Variables de entorno**: `.env.local`

### Tablas Principales

#### 1. **`introduction`**
- **Propósito**: Información personal del portafolio
- **Campos**:
  - `id`, `name`, `role`, `description`
  - `avatar_url`, `location`, `languages`
  - `github_url`, `linkedin_url`, `discord_url`, `email_url`

#### 2. **`work_experience`**
- **Propósito**: Experiencia laboral
- **Campos**:
  - `id`, `company`, `position`, `start_date`, `end_date`
  - `description`, `technologies`

#### 3. **`studies`**
- **Propósito**: Estudios y certificaciones
- **Campos**:
  - `id`, `institution`, `degree`, `field`
  - `start_date`, `end_date`, `description`

#### 4. **`technical_skills`**
- **Propósito**: Habilidades técnicas
- **Campos**:
  - `id`, `title`, `category`, `level`, `description`

### Scripts de Base de Datos
- **`scripts/create-tables.sql`**: Creación de tablas
- **`scripts/bruno-bacchi-data.sql`**: Datos de ejemplo para Bruno
- **`scripts/insert-bruno-data.js`**: Script Node.js para insertar datos

---

## 🎨 Sistema de Contenido

### Archivo de Configuración Principal
**`src/resources/content.js`**

#### Objetos de Configuración:

1. **`person`**: Información personal
   ```javascript
   const person = {
     firstName: "Bruno",
     lastName: "Bacchi",
     role: "Design Engineer",
     email: "bfbacchi@gmail.com",
     location: "America/Argentina/Buenos_Aires"
   };
   ```

2. **`social`**: Enlaces sociales
   ```javascript
   const social = [
     { name: "GitHub", icon: "github", link: "..." },
     { name: "LinkedIn", icon: "linkedin", link: "..." },
     { name: "Discord", icon: "discord", link: "..." },
     { name: "Email", icon: "email", link: "..." }
   ];
   ```

3. **`home`**: Configuración de la página principal
4. **`about`**: Configuración de la página About
5. **`blog`**: Configuración del blog
6. **`work`**: Configuración de proyectos
7. **`gallery`**: Configuración de la galería
8. **`dbTest`**: Configuración de la página de prueba de DB

### Archivo de Configuración de UI
**`src/resources/once-ui.config.js`**

#### Configuraciones Principales:

1. **`routes`**: Habilitación de páginas
   ```javascript
   const routes = {
     "/": true,
     "/about": true,
     "/work": true,
     "/blog": true,
     "/gallery": true,
     "/db-test": true
   };
   ```

2. **`display`**: Elementos de UI a mostrar
   ```javascript
   const display = {
     location: true,
     time: true,
     themeSwitcher: true
   };
   ```

3. **`protectedRoutes`**: Rutas protegidas con contraseña
4. **`style`**: Configuración de tema y estilos
5. **`fonts`**: Configuración de fuentes

---

## 🧩 Componentes Principales

### 1. **Header** (`src/components/Header.tsx`)
- **Funcionalidades**:
  - Navegación principal
  - Selector de idioma
  - Botón de autenticación
  - Mostrar/ocultar enlaces según autenticación
  - Reloj en tiempo real

### 2. **AboutClient** (`src/components/about/AboutClient.tsx`)
- **Funcionalidades**:
  - Panel de avatar con información personal
  - Navegación lateral
  - Secciones editables (solo para usuarios autenticados)
  - Gestión de imágenes

### 3. **AvatarPanel** (`src/components/about/AvatarPanel.tsx`)
- **Funcionalidades**:
  - Muestra información personal
  - Enlaces sociales
  - Botón de edición (solo para usuarios autenticados)

### 4. **Projects** (`src/components/work/Projects.tsx`)
- **Funcionalidades**:
  - Lista de proyectos
  - Filtrado y búsqueda
  - Integración con base de datos

---

## 🌐 Sistema de Navegación

### Rutas Principales
- **`/`**: Página principal
- **`/about`**: Página About con información personal
- **`/work`**: Lista de proyectos
- **`/work/[slug]`**: Página individual de proyecto
- **`/blog`**: Lista de posts del blog
- **`/blog/[slug]`**: Página individual de post
- **`/gallery`**: Galería de imágenes
- **`/db-test`**: Página de prueba de conexión a DB (solo autenticados)

### Protección de Rutas
- **Rutas públicas**: Home, About, Work, Blog, Gallery
- **Rutas autenticadas**: DB Test
- **Rutas protegidas**: Proyectos específicos (configurables)

---

## 🎨 Sistema de Estilos

### Tecnologías de Estilos
- **SCSS**: Preprocesador CSS
- **CSS Modules**: Estilos encapsulados por componente
- **Once UI**: Sistema de diseño y componentes

### Archivos de Estilos Principales
- **`src/components/Header.module.scss`**: Estilos del header
- **`src/components/AuthButton.module.scss`**: Estilos del botón de auth
- **`src/components/about/about.module.scss`**: Estilos de la página About
- **`src/resources/custom.css`**: Estilos personalizados globales

---

## 🔧 Funcionalidades Especiales

### 1. **Sistema de Autenticación con Menú Desplegable**
- El botón de logout se despliega desde el nombre del usuario
- Menú elegante con cierre automático
- Integración completa con Supabase Auth

### 2. **Protección Condicional de Rutas**
- El enlace "DB Test" solo aparece para usuarios autenticados
- Verificación en tiempo real del estado de autenticación

### 3. **Integración con Base de Datos**
- Datos dinámicos desde Supabase
- Página de prueba de conexión
- Scripts de migración y datos de ejemplo

### 4. **Sistema de Contenido Flexible**
- Configuración centralizada en archivos JS
- Habilitación/deshabilitación de páginas
- Contenido dinámico basado en configuración

---

## 🚀 Scripts y Comandos

### Comandos de Desarrollo
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construcción para producción
npm run start    # Servidor de producción
npm run lint     # Linting del código
```

### Scripts de Base de Datos
```bash
# Insertar datos de Bruno Bacchi
node scripts/insert-bruno-data.js

# Ejecutar scripts SQL en Supabase
# (Copiar y pegar en SQL Editor de Supabase)
```

---

## 📝 Notas de Desarrollo

### Cambios Recientes Implementados
1. **Menú desplegable de usuario**: Implementado en `AuthButton.tsx`
2. **Protección de ruta DB Test**: Solo visible para usuarios autenticados
3. **Estilos CSS modulares**: Migrados de inline a archivos SCSS
4. **Integración completa con Supabase**: Autenticación y base de datos

### Consideraciones Técnicas
- **Next.js 15**: Usa App Router y React 19
- **TypeScript**: Tipado estricto en todo el proyecto
- **Once UI**: Sistema de componentes consistente
- **Supabase**: Backend completo con autenticación y base de datos
- **Responsive Design**: Optimizado para todos los dispositivos

### Próximas Mejoras Sugeridas
1. Panel de administración para gestión de contenido
2. Sistema de comentarios en blog
3. Integración con CMS headless
4. Optimización de imágenes automática
5. Sistema de notificaciones

---

## 🔗 Enlaces Útiles

- **Demo**: https://demo.magic-portfolio.com
- **Once UI Docs**: https://docs.once-ui.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ykmzwzvxrdbtsbxsysky
- **Next.js Docs**: https://nextjs.org/docs

---

*Documentación generada automáticamente para el proyecto Magic Portfolio - Bruno Bacchi*
