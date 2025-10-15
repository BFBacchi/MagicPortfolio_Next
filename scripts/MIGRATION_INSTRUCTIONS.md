# 🚀 Instrucciones de Migración - Habilidades Técnicas

## 📋 Resumen
Este proceso migra la tabla `technical_skills` de la estructura antigua a la nueva, preservando todos tus datos existentes.

## 🔄 Cambios en la Estructura

### Antes (Estructura Actual):
- `title` (VARCHAR) → Se convierte a `name`
- `level` (INTEGER) → Se convierte a `level` (VARCHAR con valores: 'beginner', 'intermediate', 'advanced', 'expert')
- `category` (VARCHAR) → Se mantiene igual
- `description` (TEXT) → Se mantiene igual
- ❌ No tiene `user_id`

### Después (Nueva Estructura):
- `name` (VARCHAR, NOT NULL) ← Migrado desde `title`
- `level` (VARCHAR, NOT NULL) ← Convertido desde números a strings descriptivos
- `category` (VARCHAR) ← Se mantiene igual
- `description` (TEXT) ← Se mantiene igual
- ✅ `user_id` (UUID) ← Nueva columna para asociar habilidades con usuarios

## 📊 Conversión de Niveles

| Nivel Numérico | Nivel Descriptivo |
|----------------|-------------------|
| 9+             | expert           |
| 7-8            | advanced         |
| 5-6            | intermediate     |
| 1-4            | beginner         |

## 🛠️ Pasos de Migración

### Paso 1: Hacer Respaldo (OBLIGATORIO)
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/backup-technical-skills.sql
```

### Paso 2: Ejecutar Migración
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/migrate-technical-skills.sql
```

### Paso 3: Asignar User ID (IMPORTANTE)
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/assign-user-id.sql
```

### Paso 4: Verificar Migración
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/check-technical-skills.sql
```

### Paso 5: Diagnóstico (Si hay problemas)
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/diagnose-technical-skills.sql
```

## 🔧 Opciones Adicionales

### Opción A: Usar Datos Existentes
Si ya tienes datos en tu tabla, la migración los preservará y convertirá automáticamente.

### Opción B: Insertar Datos Nuevos
Si prefieres empezar desde cero con datos limpios:
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/insert-technical-skills-data.sql
```

### Opción C: Restaurar desde Respaldo
Si algo sale mal y necesitas volver al estado anterior:
```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: scripts/restore-technical-skills.sql
```

## ⚠️ Consideraciones Importantes

1. **Respaldo Obligatorio**: Siempre ejecuta el script de respaldo antes de la migración
2. **Usuario Autenticado**: Asegúrate de estar autenticado en Supabase cuando ejecutes los scripts
3. **Políticas de Seguridad**: El script configura RLS (Row Level Security) para proteger los datos
4. **Índices**: Se crean índices automáticamente para mejorar el rendimiento

## 🎯 Resultado Final

Después de la migración:
- ✅ Todos tus datos existentes se preservan
- ✅ Los niveles numéricos se convierten a descriptivos
- ✅ Se agrega soporte para múltiples usuarios
- ✅ Se configuran políticas de seguridad
- ✅ La aplicación funcionará correctamente

## 🆘 Solución de Problemas

### Error: "Column already exists"
- Esto es normal si ya ejecutaste el script antes
- El script usa `IF NOT EXISTS` para evitar errores

### Error: "Permission denied"
- Asegúrate de estar autenticado en Supabase
- Verifica que tienes permisos de administrador en la base de datos

### Error: "Foreign key constraint"
- El script crea la columna `user_id` como opcional inicialmente
- Puedes asignar un usuario específico descomentando las líneas correspondientes

## 📞 Soporte

Si encuentras algún problema durante la migración:
1. Verifica que ejecutaste el respaldo
2. Revisa los logs de Supabase
3. Usa el script de restauración si es necesario
4. Contacta al desarrollador si persisten los problemas
