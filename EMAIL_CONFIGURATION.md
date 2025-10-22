# 📧 Configuración del Transporter de Correo

## 🚀 Pasos para Configurar Gmail

### 1. Habilitar Verificación en 2 Pasos
1. Ve a tu cuenta de Google: [myaccount.google.com](https://myaccount.google.com)
2. Navega a **Seguridad** → **Verificación en 2 pasos**
3. Activa la verificación en 2 pasos si no está activada

### 2. Generar Contraseña de Aplicación
1. En la misma sección de **Seguridad**
2. Busca **Contraseñas de aplicaciones** (puede estar en "Cómo iniciar sesión en Google")
3. Selecciona **Correo** y **Otro (nombre personalizado)**
4. Escribe "Portfolio Contact Form"
5. **Copia la contraseña generada** (16 caracteres sin espacios)

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Email Configuration
EMAIL_USER=bfbacchi@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**⚠️ IMPORTANTE**: 
- Usa la contraseña de aplicación de 16 caracteres
- NO uses tu contraseña normal de Gmail
- NO incluyas espacios en la contraseña

## 🔧 Configuración Alternativa (Otros Proveedores)

### Outlook/Hotmail
```env
EMAIL_USER=tu@outlook.com
EMAIL_PASSWORD=tu_contraseña
```

Y modifica el transporter en `src/app/api/contact/route.ts`:
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Yahoo
```env
EMAIL_USER=tu@yahoo.com
EMAIL_PASSWORD=tu_app_password
```

```javascript
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### SMTP Personalizado
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.tu-proveedor.com',
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## 🧪 Probar la Configuración

### 1. Verificar Variables de Entorno
Crea un archivo de prueba `test-email.js`:

```javascript
require('dotenv').config({ path: '.env.local' });

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Configurado' : 'No configurado');
```

### 2. Probar el Formulario
1. Inicia el servidor: `npm run dev`
2. Ve a `http://localhost:3000`
3. Llena el formulario de contacto
4. Envía un mensaje de prueba

### 3. Verificar Logs
Revisa la consola del servidor para ver si hay errores:
- ✅ "Mensaje enviado correctamente"
- ❌ "Error sending email: ..."

## 🛠️ Troubleshooting

### Error: "Invalid login"
- ✅ Verifica que la verificación en 2 pasos esté activada
- ✅ Usa la contraseña de aplicación, no tu contraseña normal
- ✅ Asegúrate de que no haya espacios en la contraseña

### Error: "Connection timeout"
- ✅ Verifica tu conexión a internet
- ✅ Revisa que el puerto 587 esté disponible
- ✅ Prueba con un proveedor diferente

### Error: "Authentication failed"
- ✅ Regenera la contraseña de aplicación
- ✅ Verifica que el email esté correcto
- ✅ Asegúrate de que `.env.local` esté en la raíz del proyecto

### Error: "nodemailer.createTransporter is not a function"
- ✅ Ya corregido: usar `createTransport` (sin 'r')
- ✅ Reinicia el servidor después del cambio

## 📊 Configuración de Producción

### Variables de Entorno en Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `EMAIL_USER`: bfbacchi@gmail.com
   - `EMAIL_PASSWORD`: tu_app_password

### Variables de Entorno en Netlify
1. Ve a tu proyecto en Netlify
2. Site settings → Environment variables
3. Agrega las mismas variables

## 🔒 Seguridad

### ✅ Buenas Prácticas
- Usa contraseñas de aplicación, no contraseñas normales
- Nunca commitees `.env.local` al repositorio
- Usa variables de entorno en producción
- Considera usar un servicio como SendGrid para producción

### ❌ Evitar
- Hardcodear credenciales en el código
- Usar contraseñas normales de email
- Compartir contraseñas de aplicación
- Exponer credenciales en logs

## 📧 Personalización de Emails

### Modificar Templates
Edita `src/app/api/contact/route.ts` para personalizar:
- Estilos HTML de los emails
- Contenido de confirmación
- Información incluida en el email

### Agregar Campos
Para agregar más campos al formulario:
1. Actualiza el estado en `Mailchimp.tsx`
2. Modifica la validación en la API
3. Actualiza los templates de email

## 🎯 Próximos Pasos

1. **Configurar Gmail** con app password
2. **Probar el formulario** con un email real
3. **Personalizar templates** si es necesario
4. **Configurar en producción** cuando despliegues
5. **Monitorear** emails recibidos y errores

¡Con esta configuración tu formulario de contacto estará funcionando perfectamente! 🚀
