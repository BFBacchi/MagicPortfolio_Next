#!/bin/bash

# 🚀 Script de configuración para automatización de noticias
# Este script configura el entorno para el scraper automático de noticias

echo "🚀 Configurando automatización de noticias para el blog..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Crear directorio de scripts si no existe
mkdir -p scripts

# Crear archivo de noticias procesadas si no existe
if [ ! -f "scripts/processed_news.json" ]; then
    echo "[]" > scripts/processed_news.json
    echo "✅ Creado archivo de noticias procesadas"
fi

# Hacer ejecutable el script de Python
chmod +x scripts/news-scraper.py

# Verificar dependencias de Python
echo "🐍 Verificando dependencias de Python..."

python3 -c "import requests, feedparser" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Instalando dependencias de Python..."
    pip3 install requests feedparser beautifulsoup4 lxml
else
    echo "✅ Dependencias de Python ya están instaladas"
fi

# Crear archivo .gitignore para archivos temporales
if [ ! -f "scripts/.gitignore" ]; then
    cat > scripts/.gitignore << EOF
# Archivos temporales del scraper
*.tmp
*.log
temp/
EOF
    echo "✅ Creado .gitignore para scripts"
fi

# Verificar que el directorio de posts existe
if [ ! -d "src/app/blog/posts" ]; then
    echo "❌ Error: Directorio src/app/blog/posts no encontrado"
    exit 1
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Revisa la configuración en scripts/news-config.json"
echo "2. Personaliza las fuentes RSS según tus preferencias"
echo "3. Ejecuta el scraper manualmente: python3 scripts/news-scraper.py"
echo "4. El GitHub Action se ejecutará automáticamente cada día a las 6:00 AM UTC"
echo ""
echo "🔧 Comandos útiles:"
echo "- Ejecutar scraper manualmente: python3 scripts/news-scraper.py"
echo "- Ver logs del GitHub Action: https://github.com/[tu-usuario]/[tu-repo]/actions"
echo "- Configurar notificaciones: Ve a Settings > Notifications en tu repo"
echo ""
echo "📚 Documentación:"
echo "- Configuración: scripts/news-config.json"
echo "- Template MDX: scripts/news-template.mdx"
echo "- GitHub Action: .github/workflows/update-news-blog.yml"
