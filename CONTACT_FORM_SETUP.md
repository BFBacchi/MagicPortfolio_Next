# 📧 Configuración del Formulario de Contacto

## ✨ Migración a Resend

El formulario de contacto ahora usa [Resend](https://resend.com) en lugar de nodemailer. Resend es más confiable, fácil de configurar y está diseñado para aplicaciones modernas.

### Ventajas de Resend:
- ✅ **Configuración simple**: Solo necesitas una API key
- ✅ **Alta deliverabilidad**: Los emails llegan a la bandeja de entrada
- ✅ **3,000 emails/mes gratis**
- ✅ **Sin configuración SMTP compleja**

### Configuración rápida:
1. Crea cuenta en [resend.com](https://resend.com)
2. Obtén tu API key
3. Agrega `RESEND_API_KEY` a tu `.env.local`
4. ¡Listo!

Para más detalles, consulta [RESEND_SETUP.md](./RESEND_SETUP.md)

## 🚀 Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Resend API Key (Recomendado - más fácil y confiable)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Configuración anterior con Gmail (ya no necesaria)
# EMAIL_USER=bfbacchi@gmail.com
# EMAIL_PASSWORD=tu_app_password_de_gmail
```

## 📋 Pasos para Configurar Gmail

### 1. Habilitar Autenticación de 2 Factores
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Activa la verificación en 2 pasos

### 2. Generar App Password
1. Ve a Seguridad → Contraseñas de aplicaciones
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "Portfolio Contact Form"
4. Copia la contraseña generada (16 caracteres)

### 3. Configurar Variables de Entorno
```env
EMAIL_USER=bfbacchi@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Tu app password de 16 caracteres
```

## ✨ Características del Formulario

### 🎯 Campos del Formulario
- **Nombre**: Campo de texto obligatorio
- **Email**: Validación en tiempo real
- **Asunto**: Campo de texto obligatorio
- **Mensaje**: Textarea con 5 filas

### 🔄 Funcionalidad
- ✅ **Validación en tiempo real** del email
- ✅ **Validación de campos obligatorios**
- ✅ **Estados de carga** con feedback visual
- ✅ **Mensaje de éxito** con opción para enviar otro
- ✅ **Manejo de errores** en español
- ✅ **Email automático** a bfbacchi@gmail.com
- ✅ **Email de confirmación** al usuario

### 📧 Emails Automáticos

#### Email a Bruno (bfbacchi@gmail.com)
- **Asunto**: `[Portfolio Contact] {asunto del usuario}`
- **Contenido**: Información completa del contacto
- **Reply-To**: Email del usuario (para responder directamente)

#### Email de Confirmación al Usuario
- **Asunto**: "Gracias por contactarme - Bruno Bacchi"
- **Contenido**: Confirmación personalizada con enlaces útiles
- **Incluye**: Enlaces a LinkedIn, GitHub, y proyectos

## 🎨 Diseño y UX

### 🎯 Propuesta de Valor
- **Título**: "💬 ¡Hablemos de tu proyecto!"
- **Descripción**: Enfoque en proyectos y desarrollo fullstack
- **Promesa**: "Respuesta garantizada en menos de 24 horas"

### 🔄 Estados Visuales
1. **Formulario vacío**: Campos habilitados
2. **Validación**: Errores en tiempo real
3. **Enviando**: Botón deshabilitado con "Enviando..."
4. **Éxito**: Mensaje de confirmación con opción de nuevo envío
5. **Error**: Mensaje de error con opción de reintentar

## 🛠️ Archivos Modificados

- ✅ `src/resources/content.js` - Contenido del formulario
- ✅ `src/components/Mailchimp.tsx` - Componente del formulario
- ✅ `src/app/api/contact/route.ts` - API para envío de emails
- ✅ `package.json` - Dependencias (nodemailer)

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** con tu app password de Gmail
2. **Probar el formulario** enviando un mensaje de prueba
3. **Personalizar templates** de email si es necesario
4. **Configurar analytics** para tracking de conversiones
5. **Agregar captcha** si recibes spam

## 🔧 Troubleshooting

### Error: "Invalid login"
- Verifica que el app password sea correcto
- Asegúrate de que la verificación en 2 pasos esté activada

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Revisa que el puerto 587 esté disponible

### Error: "Authentication failed"
- Regenera el app password
- Verifica que no haya espacios en la contraseña

## 📊 Métricas Recomendadas

- Tasa de conversión del formulario
- Tiempo de respuesta promedio
- Tipos de consultas más comunes
- Tasa de abandono del formulario
