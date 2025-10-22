#!/usr/bin/env python3
"""
Script de prueba para el scraper de noticias
"""

import sys
import os
import importlib.util

# Agregar el directorio de scripts al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importar el módulo news-scraper dinámicamente
spec = importlib.util.spec_from_file_location("news_scraper", "scripts/news-scraper.py")
news_scraper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(news_scraper)

NewsScraper = news_scraper.NewsScraper
import json

def test_scraper():
    """Probar el scraper con configuración de prueba"""
    print("🧪 Iniciando pruebas del scraper de noticias...")
    
    # Crear instancia del scraper
    scraper = NewsScraper()
    
    # Configurar para modo de prueba
    scraper.max_posts_per_run = 1  # Solo 1 post para prueba
    
    print("\n📡 Probando obtención de noticias...")
    
    try:
        # Obtener noticias
        news_items = scraper.fetch_rss_news()
        print(f"✅ Se obtuvieron {len(news_items)} noticias")
        
        if news_items:
            # Mostrar primera noticia como ejemplo
            first_news = news_items[0]
            print(f"\n📰 Ejemplo de noticia:")
            print(f"   Título: {first_news['title'][:50]}...")
            print(f"   Fuente: {first_news['source']}")
            print(f"   Categoría: {first_news['category']}")
            print(f"   URL: {first_news['url']}")
            
            # Probar generación de MDX
            print(f"\n📝 Probando generación de MDX...")
            content, slug = scraper.generate_mdx_content(first_news)
            print(f"✅ MDX generado exitosamente")
            print(f"   Slug: {slug}")
            print(f"   Longitud del contenido: {len(content)} caracteres")
            
            # Mostrar preview del frontmatter
            frontmatter_lines = content.split('\n')[:10]
            print(f"\n📋 Preview del frontmatter:")
            for line in frontmatter_lines:
                print(f"   {line}")
            
        else:
            print("⚠️  No se obtuvieron noticias para probar")
            
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        return False
    
    print(f"\n🎉 Pruebas completadas exitosamente!")
    return True

def test_config():
    """Probar la configuración"""
    print("\n⚙️ Probando configuración...")
    
    config_file = "scripts/news-config.json"
    if os.path.exists(config_file):
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        print(f"✅ Configuración cargada:")
        print(f"   Fuentes RSS: {len(config['rss_feeds'])}")
        print(f"   Máximo posts por ejecución: {config['settings']['max_posts_per_run']}")
        
        enabled_feeds = [f for f in config['rss_feeds'] if f.get('enabled', True)]
        print(f"   Fuentes activas: {len(enabled_feeds)}")
        
        for feed in enabled_feeds:
            print(f"     - {feed['name']} ({feed['category']})")
    else:
        print("⚠️  Archivo de configuración no encontrado")

if __name__ == "__main__":
    print("🚀 Iniciando pruebas del sistema de automatización de noticias")
    print("=" * 60)
    
    # Probar configuración
    test_config()
    
    # Probar scraper
    success = test_scraper()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ Todas las pruebas pasaron exitosamente!")
        print("\n📋 Próximos pasos:")
        print("1. Revisa la configuración en scripts/news-config.json")
        print("2. Ejecuta el scraper completo: python scripts/news-scraper.py")
        print("3. El GitHub Action se ejecutará automáticamente")
    else:
        print("❌ Algunas pruebas fallaron. Revisa los errores arriba.")
        sys.exit(1)
