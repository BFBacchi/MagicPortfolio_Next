# 📰 Scripts de Automatización de Noticias

Este directorio contiene todos los scripts necesarios para automatizar la adición de noticias de desarrollo al blog.

## 📁 Archivos

| Archivo | Descripción |
|---------|-------------|
| `news-scraper.py` | Script principal que extrae noticias y genera posts MDX |
| `news-config.json` | Configuración personalizable del scraper |
| `news-template.mdx` | Template para generar posts MDX |
| `test-news-scraper.py` | Script de pruebas para verificar funcionamiento |
| `setup-news-automation.sh` | Script de configuración inicial (Linux/Mac) |
| `processed_news.json` | Tracking de noticias ya procesadas (generado automáticamente) |

## 🚀 Uso Rápido

### 1. Instalar dependencias

```bash
pip install requests feedparser beautifulsoup4 lxml
```

### 2. Ejecutar pruebas

```bash
python scripts/test-news-scraper.py
```

### 3. Ejecutar scraper manualmente

```bash
python scripts/news-scraper.py
```

### 4. Configurar GitHub Actions

El workflow en `.github/workflows/update-news-blog.yml` se ejecutará automáticamente.

## ⚙️ Configuración

### Personalizar fuentes RSS

Edita `news-config.json`:

```json
{
  "rss_feeds": [
    {
      "name": "Dev.to",
      "url": "https://dev.to/feed",
      "category": "Desarrollo Web",
      "enabled": true,
      "priority": 1
    }
  ]
}
```

### Ajustar filtros de contenido

```json
{
  "keywords": {
    "required": ["javascript", "react", "python"],
    "optional": ["css", "html", "api"],
    "exclude": ["job", "hiring", "career"]
  }
}
```

### Modificar límites

```json
{
  "settings": {
    "max_posts_per_run": 3,
    "max_posts_per_source": 2,
    "rate_limit_delay": 0.5
  }
}
```

## 🧪 Testing

### Ejecutar todas las pruebas

```bash
python scripts/test-news-scraper.py
```

### Probar una fuente específica

Modifica temporalmente `news-config.json` para incluir solo una fuente y ejecuta:

```bash
python scripts/news-scraper.py
```

## 🔧 Troubleshooting

### Error: "No module named 'requests'"

```bash
pip install requests feedparser beautifulsoup4 lxml
```

### Error: "Permission denied"

```bash
# Linux/Mac
chmod +x scripts/news-scraper.py

# Windows - no es necesario
```

### Posts no se generan

1. Verifica que las fuentes RSS estén activas
2. Revisa los logs de GitHub Actions
3. Confirma que `processed_news.json` no esté bloqueando contenido

### Contenido no relevante

1. Ajusta palabras clave en `news-config.json`
2. Modifica filtros de contenido
3. Desactiva fuentes problemáticas temporalmente

## 📊 Monitoreo

### Logs del scraper

El script imprime logs detallados durante la ejecución:

```
🚀 Iniciando scraper de noticias de desarrollo...
📡 Obteniendo noticias de Dev.to...
✅ Creado: nueva-noticia-20240115.mdx
🎉 Proceso completado. Se crearon 2 nuevos posts.
```

### Archivo de tracking

`processed_news.json` mantiene un registro de todas las noticias procesadas para evitar duplicados.

## 🔄 Flujo de Trabajo

1. **GitHub Action se ejecuta** (diariamente)
2. **Scraper obtiene noticias** de feeds RSS
3. **Filtra contenido relevante** usando palabras clave
4. **Verifica duplicados** usando sistema de tracking
5. **Genera archivos MDX** usando template
6. **Commit y push** automático

## 📚 Documentación Completa

Para documentación detallada, consulta:
- [NEWS_AUTOMATION_SETUP.md](../NEWS_AUTOMATION_SETUP.md) - Guía completa de configuración
- [GitHub Action](../.github/workflows/update-news-blog.yml) - Workflow de automatización

## 🤝 Contribuir

Para agregar nuevas fuentes o mejorar el scraper:

1. Edita `news-config.json` para agregar fuentes
2. Modifica `news-template.mdx` para personalizar formato
3. Ajusta `news-scraper.py` para nuevas funcionalidades
4. Ejecuta `test-news-scraper.py` para verificar cambios
5. Haz commit y push de los cambios

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.