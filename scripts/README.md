# Scripts para datos de Bruno Bacchi

Este directorio contiene scripts para insertar datos de ejemplo para Bruno Bacchi, un desarrollador Full Stack.

## Archivos

### 1. `bruno-bacchi-data.sql`
Script SQL para insertar datos directamente en Supabase SQL Editor.

**Cómo usar:**
1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Copia y pega el contenido del archivo
4. Ejecuta el script

### 2. `insert-bruno-data.js`
Script de Node.js para insertar datos usando la API de Supabase.

**Cómo usar:**
1. Asegúrate de tener las variables de entorno configuradas en `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

2. Instala las dependencias si no las tienes:
   ```bash
   npm install dotenv
   ```

3. Ejecuta el script:
   ```bash
   node scripts/insert-bruno-data.js
   ```

## Datos incluidos

### Introducción
- **Nombre:** Bruno Bacchi
- **Rol:** Full Stack Developer
- **Descripción:** Desarrollador apasionado por crear soluciones innovadoras

### Experiencia Laboral
1. **TechCorp Solutions** - Senior Full Stack Developer (2022-Presente)
2. **InnovateSoft** - Full Stack Developer (2020-2021)
3. **StartUpHub** - Frontend Developer (2019-2020)
4. **DigitalCraft** - Backend Developer (2018-2019)

### Estudios
1. **Universidad Tecnológica Nacional** - Ingeniería en Sistemas de Información
2. **Platzi** - Certificación Full Stack
3. **Coursera** - Certificación en Machine Learning

### Habilidades Técnicas
- **Frontend:** React, Angular, Next.js, TypeScript, HTML5/CSS3, SASS/SCSS
- **Backend:** Java, Spring Boot, Node.js, Python, Flask
- **Base de Datos:** PostgreSQL, MySQL, MongoDB
- **DevOps:** Git, GitHub, Docker, AWS, Jenkins
- **Metodologías:** Agile/Scrum, TDD, Clean Code

## Notas importantes

- Los datos se insertan con niveles de habilidad del 1 al 10
- Las fechas están en formato ISO (YYYY-MM-DD)
- Las tecnologías se almacenan como arrays en PostgreSQL
- Todos los datos incluyen timestamps automáticos

## Personalización

Puedes modificar los datos en cualquiera de los scripts para adaptarlos a tus necesidades específicas. Los scripts están diseñados para ser fáciles de editar y personalizar. 