# Configuración de Resend para el Formulario de Contacto

## ¿Qué es Resend?

[Resend](https://resend.com) es un servicio moderno y confiable para el envío de emails transaccionales. Es mucho más fácil de configurar que nodemailer y está diseñado específicamente para aplicaciones modernas.

## Ventajas de Resend

- ✅ **Configuración simple**: Solo necesitas una API key
- ✅ **Alta deliverabilidad**: Los emails llegan a la bandeja de entrada
- ✅ **API moderna**: Diseñada para desarrolladores
- ✅ **Gratuito**: 3,000 emails/mes gratis
- ✅ **Sin configuración SMTP**: No necesitas configurar servidores de email
- ✅ **Dominios personalizados**: Puedes usar tu propio dominio

## Configuración

### 1. Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Key

1. En el dashboard de Resend, ve a **API Keys**
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "Portfolio Contact Form")
4. Copia la API key generada

### 3. Configurar variables de entorno

Crea o actualiza tu archivo `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Dominio personalizado (Opcional pero recomendado)

Para usar tu propio dominio en lugar de `onboarding@resend.dev`:

1. En Resend, ve a **Domains**
2. Haz clic en **Add Domain**
3. Agrega tu dominio (ej: `tu-dominio.com`)
4. Configura los registros DNS que te proporcione Resend
5. Espera a que se verifique (puede tomar unos minutos)

Una vez verificado, actualiza el archivo `src/app/api/contact/route.ts`:

```typescript
// Cambiar de:
from: 'Portfolio Contact <onboarding@resend.dev>'

// A:
from: 'Portfolio Contact <contacto@tu-dominio.com>'
```

## Uso

El formulario de contacto ahora enviará emails usando Resend:

1. **Email a ti**: Recibes el mensaje del usuario
2. **Email de confirmación**: El usuario recibe confirmación automática

## Límites gratuitos

- **3,000 emails/mes** gratis
- **100 emails/día** gratis
- Perfecto para portfolios personales

## Monitoreo

En el dashboard de Resend puedes ver:
- Emails enviados
- Tasa de entrega
- Emails rebotados
- Estadísticas de apertura

## Troubleshooting

### Error: "API key de Resend no configurada"
- Verifica que `RESEND_API_KEY` esté en tu `.env.local`
- Reinicia el servidor de desarrollo

### Error: "Invalid API key"
- Verifica que la API key sea correcta
- Asegúrate de que la API key esté activa en Resend

### Emails no llegan
- Verifica que el dominio esté verificado en Resend
- Revisa la carpeta de spam
- Usa un dominio personalizado para mejor deliverabilidad

## Migración desde nodemailer

Si tenías configurado nodemailer anteriormente:

1. ✅ Instala Resend: `npm install resend`
2. ✅ Actualiza la API route (ya hecho)
3. ✅ Configura `RESEND_API_KEY` en `.env.local`
4. ❌ Puedes eliminar `EMAIL_USER` y `EMAIL_PASSWORD` del `.env.local`
5. ❌ Puedes desinstalar nodemailer: `npm uninstall nodemailer`

## Recursos

- [Documentación oficial de Resend](https://resend.com/docs)
- [Guía de migración desde nodemailer](https://resend.com/docs/migrate-from-nodemailer)
- [Mejores prácticas de email](https://resend.com/docs/best-practices)
